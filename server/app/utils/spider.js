// import * as cheerio from 'cheerio';
// import axios from 'axios';
// import * as Qs from 'qs';

const cheerio = require('cheerio')
const axios = require('axios')
const Qs = require('qs')

/**
 * @desc 请求页面通过cherrion格式化文档返回给业务处理
 * @param url 请求地址
 * @returns
 */
const requestHtml = async (url) => {
  const body = await requestInterface(url);
  return cheerio.load(body, { decodeEntities: false });
};

/**
 * @desc axios调用三方接口使用
 */
const requestInterface = async (
  url,
  param = {},
  method = 'GET',
) => {
  return new Promise((resolve, reject) => {
    axios({
      method,
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        csrf: 'MEWX5B55MBB',
        pragma: 'no-cache',
        'sec-ch-ua':
          '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        cookie:
          '_ga=GA1.2.1049405325.1635954830; _gid=GA1.2.2140587553.1635954830; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1635954830,1636115008; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1636170510; _gat=1; kw_token=MEWX5B55MBB',
      },
      url,
      data: Qs.stringify(param),
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * @desc 搜索音乐
 * @param url
 * @returns
 */
const searchMusic = async (url) => {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'GET',
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'sec-ch-ua':
          '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        Referer: 'https://www.kuwo.cn/search/list?key=%E5%AD%A4%E5%9F%8E',
        Cookie:
          '_ga=GA1.2.1049405325.1635954830; _gid=GA1.2.2140587553.1635954830; gid=bc653d0b-61c5-4d69-ac7f-2ee3e87dd0ce; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1635954830,1636115008,1636207872; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1636211110; kw_token=H77LBB1XLI; _gat=1',
        csrf: 'H77LBB1XLI',
      },
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * @desc 获取酷我音乐单个分类下的音乐的30首列表并写入数据库
 *       每次拿到目前数据库最大的customId往上加
 * @params url 完整的路径地址 例如 https://www.kuwo.cn/playlist_detail/1082685104 [替换这个就可以拿到不同分类 1082685104]
 * @returns [] 歌曲列表
 */
const spiderKuWoHotMusic = async (id = 93) => {
  // const url = `https://www.kuwo.cn/playlist_detail/${id}`;
  const reqId = '5fb962d0-8040-11ec-ac7a-3dfba12a5da4';
  const url = `http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=${id}&pn=1&rn=30&httpsStatus=1&reqId=${reqId}`
  const res = await requestInterface(url);
  const musicList = [];
  res.data.musicList.forEach(item => {
    musicList.push({
      music_name: item.name,
      music_album: item.album,
      music_duration: item.duration,
      music_artist: item.artist,
      music_mid: item.rid,
      music_pic120: item.albumpic
    })
  })
  // const $ = cheerio.load(body, { decodeEntities: false });
  // const musicListNodes = $('.album_list:first').children();
  // musicListNodes.each((index, node) => {
  //   const href = $(node).find('a').attr('href');
  //   const music_name = $(node).find('a').attr('title');
  //   const music_mid = href.split('/')[2];
  //   const music_album = $(node).find('.song_album span').attr('title');
  //   const time = $(node).find('.song_time span').text();
  //   const music_duration =
  //     Number(time.split(':')[0]) * 60 + Number(time.split(':')[1]);
  //   const music_singer = $(node).find('.song_artist span').text();
    // musicList.push({
    //   music_name,
    //   music_album,
    //   music_duration,
    //   music_singer,
    //   music_mid,
    // });
  // });
  return musicList;
};

/**
 * @desc 获取到首页的推荐里面的所有分类的分类Id
 *       默认拿3个分类、需要更多自己配置页码 一份分类会拿到前30首  默认初始化拿90首 需要更多自己配置页码
 */
const getRecommendMusicClass = async (page = 1, pagesize = 3) => {
  const reqId = '5fb962d0-8040-11ec-ac7a-3dfba12a5da4';
  const url = `http://www.kuwo.cn/api/www/bang/bang/bangMenu?httpsStatus=1&reqId=${reqId}`
  try {
    const res = await requestInterface(url);
    const RecommendMusicId = res.data[0].list.map((t) => t.sourceid);
    return RecommendMusicId;
  } catch (error) {
    return [];
  }
};

/**
 * @desc 结合上面两个方法我们可以一次获得多个分类的音乐用于初始化歌单 具体数量自己配置
 */
const initMusicSheet = async ({ classPage = 1, classPageSize = 3 }) => {
  const recommnetClassId = await getRecommendMusicClass(
    classPage,
    classPageSize,
  );
  const task = [];
  recommnetClassId.forEach((id) => task.push(spiderKuWoHotMusic(id)));
  const result = await Promise.all(task);
  let allMusic = [];
  result.forEach((music) => (allMusic = [...allMusic, ...music]));
  return allMusic;
};

/**
 * @desc 通过mid获取音乐的详情信息，包含封面 歌词等等
 * @param mid
 */
const getMusicDetail = async (mid) => {
  const musicInfoUrl = `https://www.kuwo.cn/api/www/music/musicInfo?mid=${mid}&httpsStatus=1&reqId=0b8cd740-409f-11ec-af85-c164fd2658ed`;
  const lrcUrl = `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${mid}`;
  const musicInfoData = await requestInterface(musicInfoUrl);
  const lrcData = await requestInterface(lrcUrl);
  if (lrcData.status === 200 && musicInfoData.code === 200) {
    const { lrclist } = lrcData.data;
    const {
      artist,
      pic120,
      duration,
      score100,
      album,
      name,
      songTimeMinutes,
      rid: mid,
    } = musicInfoData.data;
    return {
      music_lrc: lrclist,
      music_info: {
        music_artist: artist,
        music_pic120: pic120,
        music_duration: duration,
        music_score100: score100,
        music_album: album,
        music_name: name,
        music_songTimeMinutes: songTimeMinutes,
        music_mid: mid,
      },
    };
  } else {
    throw new HttpException(`没有找到歌曲信息！`, HttpStatus.BAD_REQUEST);
  }
};

/**
 * @desc 通过mid拿到歌曲播放临时地址
 * @param mid
 * @returns
 */
const getMusicSrc = async (mid) => {
  const url = `https://www.kuwo.cn/api/v1/www/music/playUrl?mid=${mid}&type=music&httpsStatus=1&reqId=853eeac0-3d6f-11ec-928a-dfe06ab55d81`;
  const res = await requestInterface(url);
  if (res.code === 200) {
    return res.data.url;
  } else {
    throw new HttpException(`没有找到歌曲地址！`, HttpStatus.BAD_REQUEST);
  }
};

 /**
  * 
  * @param {*} keyword
  * @returns bqbList 表情包在线地址列表
  */
const getBqb = async (keyword) => {
  const httpUrl = encodeURI(`https://www.fabiaoqing.com/search/bqb/keyword/${keyword}/type/bq/page/1.html`);
  let res = await axios.get(httpUrl)
  let $ = cheerio.load(res.data)
  let bqbList = [];
  $('#container .searchbqppdiv>a>img').each((i, el) => {
    bqbList.push($(el).attr('data-original'))
  })
  return bqbList
}

module.exports = {
  requestHtml,
  searchMusic,
  spiderKuWoHotMusic,
  getRecommendMusicClass,
  initMusicSheet,
  getMusicDetail,
  getMusicSrc,
  getBqb
}