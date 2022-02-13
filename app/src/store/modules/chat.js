import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { compilerOnlineUser } from "@/utils/chat";
import { getInfo } from "@/api/userManager";
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
  },

  mutations: {
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
    
      async initGetInfo({ commit }, token) {
        commit("setToken", token);
        localStorage[ACCESS_TOKEN] = token;
        return new Promise((resolve) => {
          getInfo().then((res) => {
            const userInfo  = res.result;
            commit("setUserInfo", userInfo);
            commit("setIsLogin", true);
            resolve(true);
          });
        });
      },

  }
}

export default user
