<template>
<div class="online">
    <create-room v-show="editRoom" :roomInfo="roomInfo" @back="editRoom = false"></create-room>
    <div v-show="!editRoom" @click="changeRoom(item)" v-for="(item, index) in roomList" :key="index" class="online-item" :class="cur_room_info.room_id === item.room_id ? 'active' : ''">
        <!-- <a-icon class="cur-room" v-if="cur_room_id === item.room_id" type="sketch" /> -->
        <img class="online-item-avatar" :src="item.room_logo" />
        <div class="online-item-info">
            <div class="online-item-info-name">
                <span>{{ item.room_name }}</span>
                <div v-if="item.master && userInfo._id === item.master._id && cur_room_info.room_id === item.room_id" @click.stop="edit(item)">编辑</div>
            </div>
            <div class="online-item-info-desc s-1-line">
                {{ item.notice }}
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from "vuex";
import createRoom from "./createRoom.vue";
export default {
    name: "roomList",
    components: {
        createRoom
    },
    props: {
        roomList: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data() {
        return {
            roomInfo: {},
            editRoom: false,
        }
    },
    created() {
    },
    computed: {
        ...mapState({
            userInfo: state => state.chat.userInfo,
            cur_room_info: state => state.chat.cur_room_info
        }),
        myRoom() {
            return false
        }
    },
    methods: {
        ...mapMutations([
            "setCurRoomInfo"
        ]),
        changeRoom(item) {
            this.setCurRoomInfo(item)
            this.$socket.emit("changeRoom", item.room_id);
        },
        edit(item) {
            this.editRoom = true;
            this.$set(this,'roomInfo',item);
        }
    }
};
</script>

<style lang="less" scoped>
.online {
    display: flex;
    flex-direction: column;
    height: 440px;
    overflow: hidden;
    overflow-y: auto;

    &-item {
        cursor: pointer;
        padding: 10px;
        display: flex;
        align-items: center;
        border-top: 1px solid #f5f5f5;
        transition: all 0.3s;
        border-left: 3px solid transparent;
        padding-left: 8px;
        position: relative;

        .cur-room {
            position: absolute;
            top: 0;
            left: 0;
        }

        &:hover,
        &.active {
            border-left: 3px solid #1295dd;
            background: #ede5e5;
        }

        &-avatar {
            width: 40px;
            height: 40px;
            border-radius: 5px;
            margin-right: 10px;
        }

        &-info {
            display: flex;
            flex-direction: column;
            flex: 1;
            width: 0;

            &-name {
                font-size: 14px;
                color: #000;
                font-weight: 500;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .role {
                    background-color: #ccc;
                    font-size: 12px;
                    color: #fff;
                    padding: 1px 3px;
                    margin-right: 3px;
                    border-radius: 3px;
                }
            }

            &-desc {
                font-size: 12px;
                margin-top: 8px;
                color: #aaa;
                text-align: left;
            }
        }
    }
}
</style>
