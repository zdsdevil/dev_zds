<template>
<div class="chat" :style="chatBg">
    <div class="chat-container" v-if="isPassJoin">
        <div class="chat-container-header">
            <chat-header />
        </div>
        <div class="chat-container-content">
            <message-panel />
        </div>
        <div class="chat-container-progress">
            <chat-progress />
        </div>
        <div class="chat-container-footer">
            <chat-message-frame />
            <chat-lrc />
        </div>
    </div>
    <div>
        <sign-in @passJoin="passJoin"/>
        <sign-up @passJoin="passJoin"/>
        <music-player />
        <Popup :show="showPopup" :width="'300px'" title="欢迎加入聊天室" top="45vh" lock @close="closePopup" :showCloseBtn="false">
            <div :style="{ marginLeft: '20px' }">
                请注意、加入聊天室将自动播放音乐
            </div>
            <div slot="footer">
                <btn theme="gradient" @click="passJoin">确认加入</btn>
            </div>
        </Popup>
    </div>
</div>
</template>

<script>
import Vue from "vue"
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessageFrame from "@/components/chat/ChatMessageFrame";
import ChatLrc from "@/components/chat/ChatLrc";
import MessagePanel from "@/components/chat/MessagePanel";
import MusicPlayer from "@/components/chat/MusicPlayer";
import ChatProgress from "@/components/chat/ChatProgress";
import Popup from "@/components/Popup";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import Btn from "@/components/Btn";
import {
    mapActions,
    mapMutations,
    mapState
} from "vuex";
import {
    history
} from "@/api/chat";

export default {
    components: {
        ChatHeader,
        SignIn,
        SignUp,
        ChatMessageFrame,
        ChatLrc,
        MessagePanel,
        MusicPlayer,
        ChatProgress,
        Popup,
        Btn,
    },
    data() {
        return {
            showPopup: true,
            isPassJoin: false,
            getHistory: false,
            showInitNotice: false
        };
    },
    sockets: {
        /* 初次连接成功加入聊天室 */
        connect() {
            console.log('成功加入聊天室了哟')
            // this.$message.success("成功加入聊天室了哟");
        },
        disconnected() {
            this.$message.error('您已经掉线，请刷新网页！');
        },
        /* 携带的token没有通过校验、禁止用户做任何操作 */
        authFail(data) {
            this.loginAgain(data);
        },
        /* 初始化房间信息、获取音乐详情 */
        async initRoom(data) {
            this.updateMusicInfo(data);
            // this.$message.success(data.msg);
        },
        /* 用户上线了、更新在线列表、添加新用户上线消息提示、获取房间信息公告 */
        async online(data) {
            console.log('online', data, '---------------------')
            !this.getHistory && await this.getHistoryMessage();
            const {
                msg,
                onlineUser
            } = data
            this.setOnlineUserList(onlineUser);
            this.setMessageDataList({
                message_type: "info",
                message_content: msg
            });
            if (!this.showInitNotice) this.initNotice();
        },
        /* 来了一条新消息 */
        message(data) {
            console.log('message', data)
            if (!data || !data.data.message_content) return
            this.setMessageDataList(data.data);
        },
        /* 歌曲切换、到新歌曲了 */
        switchMusic(data) {
          const { msg, musicInfo } = data
          if(this.$store.state.chat.music_info && this.$store.state.chat.music_info.music_mid === musicInfo.music_info.music_mid) return;
          this.updateMusicInfo(musicInfo);
          this.setMessageDataList({ message_type: "info", message_content: msg });
        },
        // /* 服务端来了新的消息提示 */
        notice(data) {
          this.setMessageDataList(data);
          console.log(data);
        },
        /* 来自服务端的message消息提示 */
        tips(data) {
          const { code, msg } = data
          code === 1 && this.$message.success(msg)
          code === -1 && this.$message.error(msg)
        },
        /* 有新的点的歌曲信息、更新队列歌单并消息提示 */
        chooseMusic(data){
          const { queue_music_list, msg } = data;
          this.setMessageDataList({ message_type: "info", message_content: msg });
          this.setQueueMusicList(queue_music_list);
        }
    },
    methods: {
        ...mapActions(["toggleSignInPopup", "initGetInfo"]),
        ...mapMutations([
            "setIsLogin",
            "setOnlineUserList",
            "setMessageDataList",
            "setCurrentMusicInfo",
            "setCurrentMusicStartTime",
            "setQueueMusicList",
        ]),
        /* 调用一个开发API拿到用户位置的js */
        initUserAddress() {
            if (!document.querySelector("#address")) {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.id = "address";
                script.src = "https://pv.sohu.com/cityjson?ie=utf-8";
                document.head.appendChild(script);
            }
        },
        /* 初始化ws需要参数携带token前去校验 连接后挂载在全局 */
        async initSocket() {
            const token = localStorage['Access-Token'];
            const userInfo = this.$store.state.chat.userInfo;
            if (!token) {
                this.toggleSignInPopup(true); // 没有登录信息，强制用户登录
            } else if (!window.returnCitySN) {
                // 没有插入获取位置信息脚本，等待插入script完毕
                setTimeout(() => this.initSocket(), 50);
            } else {
                if (!userInfo) {
                    /* 如果有token没有个人信息就获取下，暂时用不到也可以不拿 */
                    await this.initGetInfo(token);
                    this.setIsLogin(true);
                }
                const {
                    cname
                } = window.returnCitySN;
                this.$socket.io.opts.query = {
                    token,
                    address: cname
                };
                this.$socket.open();
                this.$socket.emit("chat");
            }
        },
        /* 权限校验失败，重新登录 */
        loginAgain(data) {
            data && this.$message.error(data.msg);
            this.toggleSignInPopup(true);
        },
        /* 初始化房间信息、到点歌曲切换都走这里 */
        updateMusicInfo(data) {
            const {
                music_info,
                music_lrc,
                music_src,
                music_start_time,
                queue_music_list,
            } = data;
            console.log(music_start_time,'music_start_time')
            this.setQueueMusicList(queue_music_list);
            this.setCurrentMusicInfo({
                music_info,
                music_lrc,
                music_src
            });
            music_start_time && this.setCurrentMusicStartTime(music_start_time);
        },
        /* TODO 上拉加载更多 */
        async getHistoryMessage() {
            const res = await history();
            this.setMessageDataList(res.result.data);
            this.getHistory = true;
        },
        /* TODO 需要作为可配置项房间信息 */
        initNotice() {
            setTimeout(() => {
                if (this.$socket.connected) {
                    this.setMessageDataList({
                        message_type: "notice",
                        message_content: [
                            "欢迎来到钟大仙的听歌房、欢迎点歌、欢迎各位朋友的到来、一起安安静静听歌吧。"
                        ],
                    });
                    this.showInitNotice = true;
                }
            }, 1000);
        },
        /* 关闭弹窗 */
        closePopup() {
            this.showPopup = false;
        },
        /* 确认加入房间 */
        passJoin() {
            this.isPassJoin = true;
            this.showPopup = false;
            this.initSocket();
        }
    },
    created() {},
    mounted() {
        this.initUserAddress();
    },
    watch: {
        'userInfo.chatBg'(val) {
            console.log(val,'chatBg')
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.chat.userInfo
        }),
        chatBg() {
            return this.userInfo && this.userInfo.chatBg ?
            { background: 'url(' + this.userInfo.chatBg + ') 0% 0% / 100% 100% no-repeat'} :
            { background: 'url("https://jiangly.com/_nuxt/img/banner_111.a6be22c.gif")' }
        }
    },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 720px) {
    .chat-container {
        position: fixed;
        width: 100vw !important;
        height: 100vh !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        top: 0 !important;
        border-radius: 0 !important;
    }
}

.chat {
    width: 100vw;
    height: 100vh;
    background: url("https://public-1300678944.cos.ap-shanghai.myqcloud.com/blog/1636699165011bg.jpeg");
    background: url("https://jiangly.com/_nuxt/img/banner_111.a6be22c.gif");

    &-container {
        position: fixed;
        left: 8%;
        right: 8%;
        top: 8%;
        bottom: 8%;
        transition: all 0.5s;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 0 20px #f1f1f1;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        z-index: 1;

        &-header {
            width: 100%;
            height: 50px;
            border-bottom: 1px solid #eee;
        }

        &-content {
            flex: 1;
            height: 0;
            position: relative;
            padding: 20px;
        }

        &-progress {
            height: 2px;
            margin-bottom: 5px;
        }

        &-footer {
            // padding: 0 18px;
        }
    }
}
</style>
