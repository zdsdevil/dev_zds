<template>
<div class="user-info">
    <a-avatar @click="$refs.modal.edit(1)" class="avatar" shape="square" :size="100" :src="form.avatar" />
    <div class="avatar-tip">TIP:头像更新后需刷新页面生效</div>
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="用户名">
            <input v-model="form.username" class="common-input" type="text" placeholder="用户名" />
        </a-form-item>
        <a-form-item label="昵称">
            <input v-model="form.nickname" class="common-input" type="text" placeholder="昵称" />
        </a-form-item>
        <a-form-item label="签名">
            <textarea v-model="form.resume" class="common-textarea" placeholder="每个人都有签名、我希望你也有..." />
            </a-form-item>
        <div class="btn">
            <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
                <btn theme="warning">专属背景</btn>
            </a-upload>
            <btn theme="primary" @click="save">更新资料</btn>
        </div>
    </a-form>
    <avatar-modal ref="modal" @ok="setAvatar" />
</div>
</template>

<script>
import Btn from "../../../Btn";
import AvatarModal from '@/components/AvatarModal/index.vue'
import {
    updateUser
} from '@/api/userManager'
import {
    mapState,
    mapMutations
} from "vuex";
import {
    uploadSingleFile
} from '@/api/upload'
import {
    fileBaseUrl
} from '@/config/fileConfig'
export default {
    components: {
        Btn,
        AvatarModal
    },
    data() {
        return {
            formLayout: 'horizontal',
            form: {},
            chatBg: ''
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.chat.userInfo
        })
    },
    watch: {
        'userInfo'() {
            this.form = {
                ...this.userInfo
            }
        }
    },
    mounted() {
        this.form = {
            ...this.userInfo
        }
    },
    methods: {
        ...mapMutations(['setUserInfo']),
        setAvatar(url) {
            this.form.avatar = url;
        },
        beforeUpload(file) {
            const formData = new FormData()
            formData.append('file', file)
            uploadSingleFile(formData, {
                contentType: false,
                processData: false,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(res => {
                this.chatBg = fileBaseUrl + res.result.url;
                updateUser({
                    id: this.form._id,
                    chatBg: this.chatBg
                }).then(res => {
                    this.$message.success('专属背景更新成功')
                    this.setUserInfo(res.result);
                })
            })
            return false;
        },
        validateForm() {
            const {
                username,
                nickname,
                resume
            } = this.form;
            return new Promise((resolve) => {
                if (username.length > 8 || username.length < 2) {
                    this.$message.error("请输入2-6位数的用户名");
                    resolve(false);
                }
                if (nickname.length > 8 || nickname.length < 2) {
                    this.$message.error("请输入2-8位数的昵称");
                    resolve(false);
                }
                return resolve(true);
            });
        },
        save(e) {
            this.validateForm().then(async (valid) => {
                if (valid) {
                    const {
                        username,
                        nickname,
                        resume,
                        avatar
                    } = this.form;
                    updateUser({
                        id: this.form._id,
                        username,
                        nickname,
                        resume,
                        avatar
                    }).then(res => {
                        this.$message.success('更新成功')
                        this.setUserInfo(res.result);
                    })
                }
            });
        },
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
