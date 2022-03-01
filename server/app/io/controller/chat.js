const Controller = require('egg').Controller;
const await = require('await-stream-ready/lib/await');
const spider = require('../../utils/spider')
const utils = require('../../utils/utils')
const room = '888';

class ChatController extends Controller {
  // maxCount = {}; // 一共有多少首歌曲，在这个区间随机拿
  // clientIdMap = {}; //  记录clientId和userId
  // onlineUserInfo = {}; // 在线用户信息
  // queueMusicList = []; // 当前队列的歌单
  // currentMusicInfo = {}; // 当前正在播放的音乐
  // currentMusicLrc = {}; // 当前正在播放音乐的歌词
  // currentMusicSrc = null; // 当前正在播放歌曲的地址
  // timer = null; // 保持全局一个定时器
  // chooseMusicTimeSpace = {}; // 记录每位用户的点歌时间 限制30s点一首
  // lastTimespace = {}; // 上次切歌的时间戳
  async index() {
    const { socket } = this.ctx;
    this.connectSuccess(socket, socket.handshake.query);
  }
  async join() {
    const { app, socket, args } = this.ctx;
    const nsp = app.io.of('/');
    nsp.to(socket.curRoomId).emit('join', args[0]);
  }
  async changeRoom() {
    const { app, socket, args } = this.ctx;
    const nsp = app.io.of('/');
    let curRoomId = socket.curRoomId;
    let userId = app[curRoomId].clientIdMap[socket.id]
    delete app[curRoomId].onlineUserInfo[userId]
    socket.leave(curRoomId);
    nsp.to(curRoomId).emit('refreshOnlineUser', app[curRoomId].onlineUserInfo)
    socket.join(args[0])
    socket.curRoomId = args[0];
    this.connectSuccess(socket, socket.handshake.query)
  }

  //通知所有房间在线用户更新房间列表
  async updateRoomList() {
    const { app, socket } = this.ctx;
    const nsp = app.io.of('/');
    app.roomList.forEach(item => {
      nsp.to(item).emit('updateRoomList');
    })
  }
  async message() {
    const { app, socket, args } = this.ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    const { message_type, message_content } = args[0];
    const user_id = app[socket.curRoomId].clientIdMap[id];
    const user_info = app[socket.curRoomId].onlineUserInfo[user_id];
    const params = { user_id, user_info: user_id, message_content, message_type, room_id: socket.curRoomId };
    await this.service.chat.create(params);
    nsp.to(socket.curRoomId).emit('message', {
      data: { message_type, message_content, user_id, user_info },
      msg: '有一条新消息',
    })
  }

  /**
  * @desc 初次加入房间
  * @param client ws
  * @param query 加入房间携带了token和位置信息
  * @returns
  */
  async connectSuccess(socket, query) {
    const { app } = this.ctx;
    const nsp = app.io.of('/');
    const { token, address } = query;
    const payload = app.jwt.verify(token, 'Great4-M').data;
    const { _id } = payload;
    if (!_id || !token) {
      socket.emit('authFail', { code: -1, msg: '权限校验失败，请重新登录' });
      return socket.disconnect();
    }
    const u = await this.service.user.find(_id);
    if (!u) {
      socket.emit('authFail', { code: -1, msg: '无此用户信息、非法操作！' });
    }
    const { nickname, username, resume, avatar } = u;
    if (!app.roomList) app.roomList = [];
    //初始化房间对象
    if (!app[socket.curRoomId]) {
      app[socket.curRoomId] = {}
      app.roomList.push(socket.curRoomId);
    }
    //初始化房间客户端连接对象
    if (!app[socket.curRoomId].clientIdMap) {
      app[socket.curRoomId].clientIdMap = {};
      app[socket.curRoomId].onlineUserInfo = {}
    }
    app[socket.curRoomId].clientIdMap[socket.id] = _id;
    app[socket.curRoomId].onlineUserInfo[_id] = {
      nickname,
      username,
      resume,
      avatar,
      id: _id
    };
    await this.service.music.initMusicList();
    nsp.to(socket.curRoomId).emit('online', {
      code: 200,
      onlineUser: app[socket.curRoomId].onlineUserInfo,
      msg: `来自${address}的${nickname}进入房间了`,
    });
    await this.switchMusic(true);
    await this.initRoom(socket, _id, nickname);
  }

  /**
 * @desc 客户端发起切歌的请求 判断权限 是否有权切换
 * @param client socket
 * @param currentMusicInfo 当前播放中的歌曲信息
 */
  async cutMusic() {
    const { socket } = this.ctx;
    const user_id = this.app[socket.curRoomId].clientIdMap[socket.id];
    const user_info = this.app[socket.curRoomId].onlineUserInfo[user_id];
    const { user_role, nickname } = user_info
    // if (!['admin'].includes(user_role)) return client.emit('tips', { code: -1, msg: '当前切歌只对管理员开放哟！' });
    const { music_album, music_artist } = this.app[socket.curRoomId].currentMusicInfo;
    await this.messageNotice('info', `${nickname} 切掉了 ${music_album}(${music_artist})`);
    this.app[socket.curRoomId].currentMusicInfo = null;
    this.switchMusic();
  }
  /* 触发切换歌曲 */
  async switchMusic(isInit = false) {
    const { app, socket } = this.ctx;
    const nsp = app.io.of('/');
    const _now = new Date().getTime();
    let surplusTime = null;
    let _next = false;
    let nextMusicMid = null;
    if (!app[socket.curRoomId].currentMusicInfo) {
      nextMusicMid = await this.getNextMusicMid();
      _next = true;
    } else {
      surplusTime = _now - app[socket.curRoomId].lastTimespace
      if (surplusTime <= app[socket.curRoomId].currentMusicInfo.music_duration * 1000) {
        nextMusicMid = {
          mid: app[socket.curRoomId].currentMusicInfo.music_mid
        }
      } else {
        if (app[socket.curRoomId].queueMusicList && app[socket.curRoomId].queueMusicList.length) {
          nextMusicMid = {
            mid: app[socket.curRoomId].queueMusicList[0].music_mid,
            user_info: app[socket.curRoomId].queueMusicList[0].user_info
          }
          _next = true;
        } else {
          nextMusicMid = await this.getNextMusicMid();
          _next = true;
        }
      }
    }
    const { mid, user_info } = nextMusicMid;
    console.log('当前房间id', socket.curRoomId)
    console.log('移除前点歌列表:', app[socket.curRoomId].queueMusicList)
    console.log('当前歌曲', nextMusicMid)
    try {
      const { music_lrc, music_info } = await spider.getMusicDetail(mid);
      app[socket.curRoomId].currentMusicInfo = music_info;
      app[socket.curRoomId].currentMusicLrc = music_lrc;
      app[socket.curRoomId].currentMusicSrc = await spider.getMusicSrc(mid);
      const { music_artist, music_name } = music_info;
      !isInit && app[socket.curRoomId].queueMusicList.length && app[socket.curRoomId].queueMusicList.shift(); // 移除掉队列的第一首歌
      console.log('移除后点歌列表:',app[socket.curRoomId].queueMusicList)
      nsp.to(socket.curRoomId).emit('switchMusic', {
        musicInfo: {
          music_info: app[socket.curRoomId].currentMusicInfo,
          music_src: app[socket.curRoomId].currentMusicSrc,
          music_lrc: app[socket.curRoomId].currentMusicLrc,
          queue_music_list: app[socket.curRoomId].queueMusicList,
        },
        msg: `正在播放${user_info ? user_info.nickname : '系统随机'}点播的 ${music_name}(${music_artist})`,
      });
      app[socket.curRoomId].lastTimespace = _next ? new Date().getTime() : app[socket.curRoomId].lastTimespace;
      if (!app[socket.curRoomId].timer) app[socket.curRoomId].timer = null;
      clearTimeout(app[socket.curRoomId].timer);
      app[socket.curRoomId].timer = setTimeout(() => {
        this.automationFn();
      }, _next ? app[socket.curRoomId].currentMusicInfo.music_duration * 1000 : app[socket.curRoomId].currentMusicInfo.music_duration * 1000 - surplusTime); /* 这首歌时长，到达这个时长自动切歌 */
    } catch (error) {
      console.log('当前歌曲暂时无法播放');
      if (app[socket.curRoomId].queueMusicList.length && app[socket.curRoomId].queueMusicList[0].music_mid == app[socket.curRoomId].currentMusicInfo.music_mid) {
        app[socket.curRoomId].queueMusicList.shift(); // 移除掉队列的第一首歌
        nsp.to(socket.curRoomId).emit('notice', { message_type: 'info', message_content: `${user_info ? user_info.nickname : '系统随机'}点播的 ${app[socket.curRoomId].currentMusicInfo.music_name}(${app[socket.curRoomId].currentMusicInfo.music_artist})歌曲暂时无法播放`});
      }
      app[socket.curRoomId].currentMusicInfo = null;
      this.switchMusic();
    }
  }
  /* 房间创建成功后开始自动播放歌曲 */
  async automationFn () {
    try {
      await this.switchMusic();
    } catch (error) {
      return this.automationFn();
    }
  };
  getRandomId(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* 获取下一首音乐id、有人点歌拿到歌单中的mid 没有则去db随机一首 */
  async getNextMusicMid() {
    const { app, socket } = this.ctx;
    let mid;
    let user_info = null;
    if (!app[socket.curRoomId].queueMusicList) app[socket.curRoomId].queueMusicList = [];
    if (app[socket.curRoomId].queueMusicList.length) {
      mid = app[socket.curRoomId].queueMusicList[0].music_mid;
      user_info = app[socket.curRoomId].queueMusicList[0].user_info;
    } else {
      const randomId = this.getRandomId(1, app.maxCount);
      const randomMusic = await this.ctx.model.Music.find({}).skip(randomId - 1).limit(1);
      mid = randomMusic[0].music_mid;
    }
    return { mid, user_info };
  }
  /* 点歌操作  */
  async chooseMusic() {
    const { app, socket, args } = this.ctx;
    const nsp = app.io.of('/');
    const user_id = app[socket.curRoomId].clientIdMap[socket.id];
    if (!user_id) {
      socket.emit('disconnected');
      return false;
    }
    const user_info = app[socket.curRoomId].onlineUserInfo[user_id];
    let musicInfo = {...args[0]};
    const { music_name, music_artist, music_mid } = musicInfo;
    if (app[socket.curRoomId].queueMusicList.some((t) => t.music_mid === music_mid)) {
      return socket.emit('tips', { code: -1, msg: '这首歌已经在列表中啦！' });
    }
    /* 计算距离上次点歌时间 */
    if (!app[socket.curRoomId].chooseMusicTimeSpace) app[socket.curRoomId].chooseMusicTimeSpace = {};
    if (app[socket.curRoomId].chooseMusicTimeSpace[user_id]) {
      const timeDifference = utils.getTimeSpace(app[socket.curRoomId].chooseMusicTimeSpace[user_id]);
      if (timeDifference <= 1 && !['super', 'guest', 'admin'].includes(user_info.user_role)) {
        return socket.emit('tips', { code: -1, msg: `频率过高 请在${1 - timeDifference}秒后重试` });
      }
    }
    musicInfo.user_info = user_info;
    app[socket.curRoomId].queueMusicList.push(musicInfo);
    app[socket.curRoomId].chooseMusicTimeSpace[user_id] = utils.getTimeSpace();
    socket.emit('tips', { code: 1, msg: '恭喜您点歌成功' });
    nsp.to(socket.curRoomId).emit('chooseMusic', {
      code: 1,
      queue_music_list: app[socket.curRoomId].queueMusicList,
      msg: `${user_info.nickname} 点了一首 ${music_name}(${music_artist})`,
    });
  }

  /* 移除已点歌曲  */
  async removeQueueMusic() {
    const { app, socket, args } = this.ctx;
    const nsp = app.io.of('/');
    const user_id = this.app[socket.curRoomId].clientIdMap[socket.id];
    const { music_mid, music_name, music_artist, user_info } = args[0];
    const { user_role } = user_info
    if (!['admin'].includes(user_role) && user_id !== user_info.id) {
      return socket.emit('tips', { code: -1, msg: '非管理员只能移除掉自己点的歌曲哟...' });
    }
    const delIndex = this.app[socket.curRoomId].queueMusicList.findIndex((t) => t.music_mid === music_mid);
    this.app[socket.curRoomId].queueMusicList.splice(delIndex, 1);
    socket.emit('tips', { code: 1, msg: `成功移除了歌单中的 ${music_name}(${music_artist})` });
    nsp.to(socket.curRoomId).emit('chooseMusic', {
      code: 1,
      queue_music_list: this.app[socket.curRoomId].queueMusicList,
      msg: `${user_info.nickname} 移除了歌单中的 ${music_name}(${music_artist})`,
    });
  }

  /* 顶歌 */
  async musicToTop() {
    const { app, socket, args } = this.ctx;
    const nsp = app.io.of('/');
    const initIndex  = args[0];
    const user_id = app[socket.curRoomId].clientIdMap[socket.id];
    const user_info = app[socket.curRoomId].onlineUserInfo[user_id];
    let queueMusicList = app[socket.curRoomId].queueMusicList;
    let music = queueMusicList[initIndex];
    queueMusicList.splice(initIndex, 1);
    queueMusicList.unshift(music)
    const { music_name, music_artist } = music;
    socket.emit('tips', { code: 1, msg: `成功置顶了歌单中的 ${music_name}(${music_artist})` });
    nsp.to(socket.curRoomId).emit('chooseMusic', {
      code: 1,
      queue_music_list: queueMusicList,
      msg: `${user_info.nickname} 置顶了歌单中的 ${music_name}(${music_artist})`,
    });
  }

  /* 根据关键字获取表情包 */
  async getBqb() {
    const { app, socket, args } = this.ctx;
    let data = await spider.getBqb(args[0]);
    socket.emit('setBqbList', data)
  }
  /**
  * @desc 加入房间之后初始化信息 包含个人信息，歌曲列表，当前播放时间等等
  * @param socket
  * @param user_id
  * @param nickname
  */
  async initRoom(socket, user_id, nickname) {
    await socket.emit('initRoom', {
      user_id,
      music_src: this.app[socket.curRoomId].currentMusicSrc,
      music_info: this.app[socket.curRoomId].currentMusicInfo,
      music_lrc: this.app[socket.curRoomId].currentMusicLrc,
      music_start_time: Math.round(
        (new Date().getTime() - this.app[socket.curRoomId].lastTimespace) / 1000,
      ) || 1,
      queue_music_list: this.app[socket.curRoomId].queueMusicList,
      msg: `欢迎${nickname}加入房间！`,
    });
  }

  /**
   * @desc 全局消息类型通知，发送给所有人的消息
   * @param message_type 通知消息类型
   * @param message_content 通知内容
   */
  messageNotice(message_type, message_content) {
    this.ctx.socket.emit('notice', { message_type, message_content });
  }
}
module.exports = ChatController;