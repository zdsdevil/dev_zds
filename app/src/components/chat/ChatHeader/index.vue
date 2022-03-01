<template>
<div class="header flex_between">
    <div class="header-left flex_start">
        <div class="header-left-id">
            <span class="visible-xl visible-md visible-sm">ID:</span>
            {{cur_room_info.room_id}}
        </div>
        <div class="header-left-name">
            <span class="visible-xl visible-md visible-sm">{{cur_room_info.room_name}}</span>
        </div>
        <div class="header-left-share flex_center" :data-clipboard-text="copyText" @click="share">
            <icon name="chat-share" scale="1.8" class="icon" />
            <span class="visible-xl visible-md visible-sm">分享</span>
        </div>
    </div>

    <div class="header-right flex_center">
        <!-- <div class="header-right-item flex_center" @click="toGit">
            <icon name="github" scale="1.8" />
            <span class="visible-xl visible-md visible-sm">开源地址</span>
        </div> -->
        <div class="header-right-item flex_center" @click.stop="openBox(1)">
            <icon name="chat-online" scale="1.8" class="icon" />
            <span class="visible-xl visible-md visible-sm">
                在线[{{ onLineNum }}]
            </span>
        </div>
        <div class="header-right-item flex_center" @click.stop="openBox(2)">
            <icon name="chat-room" scale="1.8" class="icon" />
            <span class="visible-xl visible-md visible-sm">房间</span>
        </div>
        <div class="header-right-item flex_center" @click.stop="openBox(3)">
            <icon name="chat-mine" scale="1.8" class="icon" />
            <span class="visible-xl visible-md visible-sm">我的</span>
        </div>
        <div class="header-right-item flex_center" @click="toBlog">
            <icon name="chat-go" scale="1.8" class="icon" />
            <span class="visible-xl visible-md visible-sm">前往</span>
        </div>
    </div>
    <!-- popup -->
    <chat-popup :options="opt1" :top="60" :right="10" title="在线用户">
        <online-list />
    </chat-popup>
    <chat-popup :options="opt2" :top="60" :right="10" title="房间信息">
        <template v-slot:handle>
            <div v-if="!myRoom.room_id" @click="homeHandle">
                <a-icon type="home" /> {{isCreateRoom ? '返回大厅' : '创建房间'}}
            </div>
            <div v-else @click="homeHandle">
                <a-icon type="home" /> {{ isMyRoom ? '返回大厅' : '我的房间' }}
            </div>
        </template>
        <room-list :roomList="roomList" v-show="!isCreateRoom"></room-list>
        <create-room v-show="isCreateRoom"></create-room>
    </chat-popup>
    <chat-popup :options="opt3" :top="60" :right="10" title="个人中心">
        <user-info />
    </chat-popup>
</div>
</template>

<script>
import Clipboard from "clipboard";
import ChatPopup from "@/components/ChatPopup";
import OnlineList from "./components/OnLineList.vue";
import roomList from "./components/roomList.vue";
import createRoom from "./components/createRoom.vue";
import UserInfo from "./components/UserInfo.vue";
import {
    getChatRooms
} from "@/api/chatRoom";
import {
    mapState,
    mapMutations,
    mapActions
} from "vuex";
export default {
    components: {
        ChatPopup,
        OnlineList,
        roomList,
        createRoom,
        UserInfo
    },
    data() {
        return {
            opt1: {
                show: false,
            },
            opt2: {
                show: false,
            },
            opt3: {
                show: false,
            },
            myRoom: {},
            isCreateRoom: false
        };
    },
    async created() {
        this.getRoomList();
    },
    mounted() {},
    watch: {
        'userInfo._id'() {
            this.getChatRooms()
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.chat.userInfo,
            roomList: state => state.chat.roomList,
            cur_room_info: state => state.chat.cur_room_info
        }),
        copyText() {
            return "http://124.222.47.163/chat";
        },
        onLineNum() {
            return this.$store.state.chat.onlineUserList.length;
        },
        isMyRoom() {
            return this.cur_room_info.room_id === this.myRoom.room_id
        }
    },
    methods: {
        ...mapMutations(['setCurRoomInfo']),
        ...mapActions(['getRoomList']),
        share() {
            const clipboard = new Clipboard(".header-left-share");
            clipboard.on("success", () => {
                this.$message.success("复制成功、快发给你的小伙伴一起来听音乐吧~");
                clipboard.destroy();
            });
        },
        openBox(val) {
            if (this[`opt${val}`].show) return (this[`opt${val}`].show = false);
            this.closeBox();
            this[`opt${val}`].show = !this[`opt${val}`].show;
        },
        closeBox() {
            const self = this;
            const res = Object.keys(self._data).filter(
                (key) => key.search("opt") !== -1
            );
            res.forEach((t) => (self[t].show = false));
        },
        homeHandle() {
            if (!this.myRoom.room_id) return this.isCreateRoom = true;
            let room = this.isMyRoom ? this.roomList[0] : this.myRoom;
            this.setCurRoomInfo(room)
            this.$socket.emit("changeRoom", room.room_id);
            this.closeBox()
        },
        toBlog() {
            this.$router.push('/')
        },
        toGit() {},
        async getChatRooms() {
            let res = await getChatRooms({
                master: this.userInfo._id
            });
            if (res.code !== 200) return;
            if (!res.result.data.length) return;
            this.$set(this, 'myRoom', res.result.data[0])
        }
    },
};
</script>

<style lang="less" scoped>
.header {
    height: 100%;
    padding: 0 15px;
    user-select: none;

    &-left {
        &-id {
            user-select: none;
            background-color: #333;
            color: #fff;
            display: flex;
            padding: 0 5px;
            font-size: 14px;
            border-radius: 3px;
            margin-right: 5px;
        }

        &-name {
            font-size: 18px;
            user-select: none;
            margin-right: 12px;
        }

        &-share {
            cursor: pointer;
            padding: 4px 10px;
            border-radius: 5px;
            transition: all 0.3s;

            .icon {
                margin-right: 3px;
            }

            &:hover {
                background: #eee;
            }
        }
    }

    &-right {
        &-item {
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            color: #999;
            border-radius: 5px;
            margin: 0 3px;
            z-index: 3001;

            .icon {
                margin-right: 3px;
            }

            &:hover {
                background: #eee;
            }

            &:active {
                filter: brightness(1.2);
            }
        }
    }
}
</style>
