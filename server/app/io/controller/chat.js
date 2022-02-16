const Controller = require('egg').Controller;
const await = require('await-stream-ready/lib/await');
const spider = require('../../utils/spider')
const utils = require('../../utils/utils')
const room = 'default_room';

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
    const { app, socket, logger, helper } = this.ctx;
    const id = socket.id;
    this.connectSuccess(socket, socket.handshake.query);
  }
  async message() {
    const { app, socket, args, logger, helper } = this.ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    const { message_type, message_content } = args[0];
    const user_id = app.clientIdMap[id];
    const user_info = app.onlineUserInfo[user_id];
    const params = { user_id, user_info: user_id, message_content, message_type, room_id: 888 };
    await this.service.chat.create(params);
    nsp.to(room).emit('message', {
      data: { message_type, message_content, user_id, user_info },
      msg: '有一条新消息',
    })
  }
  async join() {
    const { app, socket, args, logger, helper } = this.ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    nsp.to(room).emit('join', args[0]);
  }

  /**
  * @desc 初次加入房间
  * @param client ws
  * @param query 加入房间携带了token和位置信息
  * @returns
  */
  async connectSuccess(client, query) {
    const { app } = this.ctx;
    const nsp = app.io.of('/');
    const { token, address } = query;
    const payload = app.jwt.verify(token, 'Great4-M').data;
    const { _id } = payload;
    if (!_id || !token) {
      client.emit('authFail', { code: -1, msg: '权限校验失败，请重新登录' });
      return client.disconnect();
    }
    const u = await this.service.user.find(_id);
    if (!u) {
      client.emit('authFail', { code: -1, msg: '无此用户信息、非法操作！' });
    }
    const { nickname, username, resume, avatar } = u;
    if (!app.clientIdMap) {
      app.clientIdMap = {};
      app.onlineUserInfo = {}
    }
    app.clientIdMap[client.id] = _id;
    app.onlineUserInfo[_id] = {
      nickname,
      username,
      resume,
      avatar,
      id: _id
    };
    const musicList = await this.service.music.initMusicList();

    nsp.to(room).emit('online', {
      code: 200,
      onlineUser: app.onlineUserInfo,
      msg: `来自${address}的${nickname}进入房间了`,
    });
    await this.switchMusic();
    await this.initRoom(client, _id, nickname);
    // nsp.to(room).emit('switchMusic', musicList)
  }

  /**
 * @desc 客户端发起切歌的请求 判断权限 是否有权切换
 * @param client socket
 * @param currentMusicInfo 当前播放中的歌曲信息
 */
  async cutMusic(client, data) {
    const user_id = this.app.clientIdMap[client.id];
    const user_info = this.app.onlineUserInfo[user_id];
    const { user_role, nickname } = user_info
    // if (!['admin'].includes(user_role)) return client.emit('tips', { code: -1, msg: '当前切歌只对管理员开放哟！' });
    const { music_album, music_artist } = this.app.currentMusicInfo;
    await this.messageNotice('info', `${nickname} 切掉了 ${music_album}(${music_artist})`);
    this.app.currentMusicInfo = null;
    this.switchMusic();
  }
  /* 触发切换歌曲 */
  async switchMusic() {
    const { app } = this.ctx;
    const nsp = app.io.of('/');
    if (!app.currentMusicInfo) {

    }
    const _now = new Date().getTime();
    let surplusTime = null;
    let _next = false;
    let nextMusicMid = null;
    if (!app.currentMusicInfo) {
      nextMusicMid = await this.getNextMusicMid();
      _next = true;
    } else {
      surplusTime = _now - app.lastTimespace
      if (surplusTime <= app.currentMusicInfo.music_duration * 1000) {
        nextMusicMid = {
          mid: app.currentMusicInfo.music_mid
        }
      } else {
        if (app.queueMusicList && app.queueMusicList.length) {
          nextMusicMid = {
            mid: app.queueMusicList[0].music_mid,
            user_info: app.queueMusicList[0].user_info
          }
          _next = true;
        } else {
          nextMusicMid = await this.getNextMusicMid();
          _next = true;
        }
      }
    }
    const { mid, user_info } = nextMusicMid;
    console.log('移除前点歌列表:', app.queueMusicList)
    console.log('当前歌曲', nextMusicMid)
    // console.log(this.ctx.client)
    try {
      const { music_lrc, music_info } = await spider.getMusicDetail(mid);
      app.currentMusicInfo = music_info;
      app.currentMusicLrc = music_lrc;
      app.currentMusicSrc = await spider.getMusciSrc(mid);
      const { music_artist, music_album } = music_info;
      app.queueMusicList.length && app.queueMusicList.shift(); // 移除掉队列的第一首歌
      console.log('移除后点歌列表:',app.queueMusicList)
      nsp.to(room).emit('switchMusic', {
        musicInfo: {
          music_info: app.currentMusicInfo,
          music_src: app.currentMusicSrc,
          music_lrc: app.currentMusicLrc,
          queue_music_list: app.queueMusicList,
        },
        msg: `正在播放${user_info ? user_info.nickname : '系统随机'}点播的 ${music_album}(${music_artist})`,
      });
      app.lastTimespace = _next ? new Date().getTime() : app.lastTimespace;
      if (!app.timer) app.timer = null;
      clearTimeout(app.timer);
      app.timer = setTimeout(() => {
        this.automationFn();
      }, _next ? app.currentMusicInfo.music_duration * 1000 : app.currentMusicInfo.music_duration * 1000 - surplusTime); /* 这首歌时长，到达这个时长自动切歌 */
    } catch (error) {
      console.log('当前歌曲暂时无法播放');
      app.queueMusicList.shift(); // 移除掉队列的第一首歌
      this.switchMusic();
      // return this.messageNotice('info', `该歌曲为付费内容，请下载酷我音乐客户端后付费收听! `);
      // return this.messageNotice('info', `当前歌曲暂时无法播放、点首其他歌曲吧! `);
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
    let mid;
    let user_info = null;
    if (!this.app.queueMusicList) this.app.queueMusicList = [];
    if (this.app.queueMusicList.length) {
      mid = this.app.queueMusicList[0].music_mid;
      user_info = this.app.queueMusicList[0].user_info;
    } else {
      const randomId = this.getRandomId(1, this.app.maxCount);
      const randomMusic = await this.ctx.model.Music.find({}).skip(randomId - 1).limit(1);
      mid = randomMusic[0].music_mid;
    }
    return { mid, user_info };
  }
  /* 点歌操作  */
  async chooseMusic(client) {
    const { app, args } = this.ctx;
    const nsp = app.io.of('/');
    const user_id = app.clientIdMap[client.id];
    if (!user_id) {
      client.emit('disconnected');
      return false;
    }
    const user_info = app.onlineUserInfo[user_id];
    let musicInfo = {...args[0]};
    const { music_name, music_artist, music_mid } = musicInfo;
    if (app.queueMusicList.some((t) => t.music_mid === music_mid)) {
      return client.emit('tips', { code: -1, msg: '这首歌已经在列表中啦！' });
    }
    /* 计算距离上次点歌时间 */
    if (!app.chooseMusicTimeSpace) app.chooseMusicTimeSpace = {};
    if (app.chooseMusicTimeSpace[user_id]) {
      const timeDifference = utils.getTimeSpace(app.chooseMusicTimeSpace[user_id]);
      if (timeDifference <= 30 && !['super', 'guest', 'admin'].includes(user_info.user_role)) {
        return client.emit('tips', { code: -1, msg: `频率过高 请在${30 - timeDifference}秒后重试` });
      }
    }
    musicInfo.user_info = user_info;
    app.queueMusicList.push(musicInfo);
    app.chooseMusicTimeSpace[user_id] = utils.getTimeSpace();
    client.emit('tips', { code: 1, msg: '恭喜您点歌成功' });
    nsp.to(room).emit('chooseMusic', {
      code: 1,
      queue_music_list: app.queueMusicList,
      msg: `${user_info.nickname} 点了一首 ${music_name}(${music_artist})`,
    });
  }

  /* 移除已点歌曲  */
  async removeQueueMusic(client, data) {
    const user_id = this.app.clientIdMap[client.id];
    const { music_mid, music_name, music_artist, user_info } = data;
    const { user_role } = user_info
    if (!['admin'].includes(user_role) && user_id !== user_info.user_id) {
      return client.emit('tips', { code: -1, msg: '非管理员只能移除掉自己点的歌曲哟...' });
    }
    const delIndex = this.app.queueMusicList.findIndex((t) => t.music_mid === music_mid);
    this.app.queueMusicList.splice(delIndex, 1);
    client.emit('tips', { code: 1, msg: `成功移除了歌单中的 ${music_name}(${music_artist})` });
    this.socket.emit('chooseMusic', {
      code: 1,
      queue_music_list: this.app.queueMusicList,
      msg: `${user_info.nickname} 移除了歌单中的 ${music_name}(${music_artist})`,
    });
  }

  /**
  * @desc 加入房间之后初始化信息 包含个人信息，歌曲列表，当前播放时间等等
  * @param client
  * @param user_id
  * @param nickname
  */
  async initRoom(client, user_id, nickname) {
    await client.emit('initRoom', {
      user_id,
      music_src: this.app.currentMusicSrc,
      music_info: this.app.currentMusicInfo,
      music_lrc: this.app.currentMusicLrc,
      music_start_time: Math.round(
        (new Date().getTime() - this.app.lastTimespace) / 1000,
      ) || 1,
      queue_music_list: this.app.queueMusicList,
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