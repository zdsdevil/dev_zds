import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { compilerOnlineUser } from "@/utils/chat";
import { getInfo } from "@/api/userManager";
import { musicCollectList } from "@/api/music";
import { getChatRooms } from "@/api/chatRoom";
const user = {
  state: {
    showSignInPopup: false,
    showSignUpPopup: false,
    isLogin: false,
    token: null,
    userInfo: null,
    onlineUserList: [],
    messageDataList: [],
    music_info: null,
    music_lrc: null,
    music_src: null,
    music_start_time: null,
    current_music_time: null,
    queue_music_list: [],
    cur_room_info: {
      room_id: '888'
    },
    roomList: [],
    musicCollectList: [],
    emoticonList: []
  },

  mutations: {
    setEmoticonList(state, list) {
      state.emoticonList = list;
    },
    setMusicCollectList(state, list) {
      state.musicCollectList = list;
    },
    setRoomList(state, list) {
      state.roomList = list;
    },
    setCurRoomInfo(state, info) {
      state.cur_room_info = info;
    },
    setSignInPopup(state, isShow) {
      state.showSignInPopup = isShow;
    },

    setSignUpPopup(state, isShow) {
      state.showSignUpPopup = isShow;
    },

    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },

    setToken(state, token) {
      state.token = token;
    },

    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },

    setOnlineUserList(state, userList) {
      state.onlineUserList = compilerOnlineUser(userList);
    },
    clearMessageDataList(state) {
      state.messageDataList = []
    },
    setMessageDataList(state, messageInfo) {
      const isArray = Array.isArray(messageInfo);
      let result = [];
      isArray && (result = [...state.messageDataList, ...messageInfo]);
      !isArray && (result = [...state.messageDataList, ...[messageInfo]]);
      state.messageDataList = result;
    },

    setCurrentMusicInfo(state, currentMusicInfo) {
      const { music_info, music_lrc, music_src } = currentMusicInfo;
      state.music_info = music_info;
      state.music_lrc = music_lrc;
      state.music_src = music_src;
    },

    setCurrentMusicStartTime(state, music_start_time) {
      state.music_start_time = music_start_time;
    },

    setCurrenMusicTime(state, current_music_time) {
      state.current_music_time = current_music_time;
    },

    setQueueMusicList(state, queue_music_list) {
      state.queue_music_list = queue_music_list;
    },
  },

  actions: {
    toggleSignInPopup({ commit }, isShow) {
      commit("setSignInPopup", isShow);
    },

    toggleSignUpPopup({ commit }, isShow) {
      commit("setSignUpPopup", isShow);
    },
    async getRoomList({ commit, state }) {
      return new Promise((resolve) => {
        getChatRooms().then(res => {
          let list = [...res.result.data]
          commit('setRoomList', list)
          if (!state.cur_room_info.room_id) {
            commit('setCurRoomInfo',list[0])
          }
          resolve(true);
        })
      })
    },
    async initGetInfo({ commit }, token) {
      commit("setToken", token);
      localStorage[ACCESS_TOKEN] = token;
      return new Promise((resolve) => {
        getInfo().then((res) => {
          const userInfo = res.result;
          commit("setUserInfo", userInfo);
          commit("setIsLogin", true);
          resolve(true);
        });
      });
    },
    async getMusicCollectList({ commit, state }) {
      return new Promise((resolve) => {
        musicCollectList().then(res => {
          let list = [...res.result.data]
          commit('setMusicCollectList', list)
          resolve(true);
        })
      })
    }
  }
}

export default user
