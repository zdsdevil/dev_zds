<template>
<div class="user-info">
    <a-avatar v-if="form.room_logo" @click="$refs.modal.edit(1)" class="avatar" :size="100" :src="form.room_logo" />
    <a-avatar v-else @click="$refs.modal.edit(1)" class="avatar" :size="100" style="backgroundColor:#87d068" icon="user" />
    <div class="avatar-tip">TIP:请选择您的房间logo</div>
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="房间名">
            <input v-model="form.room_name" class="common-input" type="text" placeholder="个人房间名称" />
        </a-form-item>
        <a-form-item label="房间靓号">
            <span v-if="form._id">{{form.room_id}}</span>
            <input v-else v-model="form.room_id" class="common-input" type="text" placeholder="自定义1-3位数房间靓号" />
        </a-form-item>
        <a-form-item label="房间公告">
            <textarea v-model="form.notice" class="common-textarea" placeholder="房间公告" />
        </a-form-item>
        <div v-if="roomInfo.room_id" class="btn">
            <btn theme="primary" @click="update">更新</btn>
            <btn theme="assist" @click="backList">返回列表</btn>
        </div>
        <div v-else class="btn">
            <btn theme="primary" @click="save">确定</btn>
        </div>
    </a-form>
    <avatar-modal ref="modal" @ok="setAvatar" />
</div>
</template>

<script>
import Btn from "../../../Btn";
import AvatarModal from '@/components/AvatarModal/index.vue'
import {
    createRoom,
    updateChatRoom
} from "@/api/chatRoom";
import {
    mapState,
    mapMutations
} from "vuex";
export default {
    components: {
        Btn,
        AvatarModal
    },
    props: {
        roomInfo: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            formLayout: 'horizontal',
            form: {
                room_logo: '',
                room_id: ''
            },
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.chat.userInfo
        })
    },
    watch: {
        roomInfo: {
            handler(val) {
                this.$set(this,'form',val)
            },
            deep: true
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations([
            "setCurRoomInfo"
        ]),
        changeRoom(item) {
            this.setCurRoomInfo(item)
            this.$socket.emit("changeRoom", item.room_id);
        },
        setAvatar(url) {
            this.form.room_logo = url;
        },
        validateForm() {
            const {
                room_logo,
                room_name,
                room_id
            } = this.form;
            return new Promise((resolve) => {
                if (!room_logo) {
                    this.$message.error("请选择您的房间logo");
                    resolve(false);
                }
                if (!room_name) {
                    this.$message.error("请输入个人房间名称");
                    resolve(false);
                }
                if (room_id.length < 1 || room_id.length > 3) {
                    this.$message.error("房间靓号为1-3位正整数");
                    resolve(false);
                }
                return resolve(true);
            });
        },
        save(e) {
            this.validateForm().then(async (valid) => {
                if (valid) {
                    const {
                        room_logo,
                        room_name,
                        notice
                    } = this.form;
                    createRoom({
                        master: this.userInfo._id,
                        room_logo,
                        room_name,
                        notice
                    }).then(res => {
                        this.$message.success('创建成功')
                        this.changeRoom(res.result);
                        this.$socket.emit("updateRoomList");
                    })
                }
            });
        },
        update() {
            this.validateForm().then(async (valid) => {
                if (valid) {
                    const {
                        _id,
                        room_logo,
                        room_name,
                        room_id,
                        notice
                    } = this.form;
                    updateChatRoom({
                        id: _id,
                        master: this.userInfo._id,
                        room_logo,
                        room_name,
                        room_id,
                        notice
                    }).then(res => {
                        this.$message.success('更新成功')
                        this.$socket.emit("updateRoomList");
                    })
                }
            });
        },
        backList() {
            this.$emit('back')
        }
    },
};
</script>

<style lang="scss" scoped>
.user-info {
    .avatar {
        display: block;
        margin: 5px auto;
    }

    .avatar-tip {
        margin-bottom: 15px;
        font-size: 12px;
        color: #777;
        text-align: center;
    }

    input.common-input {
        margin: 0;
    }

    .btn {
        display: flex;
        justify-content: center;
        margin-top: -20px;

        .z-btn {
            margin: 0 10px
        }
    }
}
</style>
