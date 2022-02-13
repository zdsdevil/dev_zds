<template>
<div class="sign-in">
    <Popup title="注册账户" width="300px" :show="show" lock :showCloseBtn="false" @close="handlerClose">
        <input v-model="params.username" class="common-input" type="text" placeholder="用户姓名" style="width: 260px" @keyup.enter="login" />
        <input v-model="params.nickname" class="common-input" type="text" placeholder="用户昵称" style="width: 260px" @keyup.enter="login" />
        <input v-model="params.password" class="common-input" type="password" placeholder="用户密码" style="width: 260px" @keyup.enter="login" />

        <input v-model="params.password2" class="common-input" type="password" placeholder="确认密码" style="width: 260px" @keyup.enter="login" />
        <div v-if="params.avatar" class="ant-upload-preview" @click="$refs.modal.edit(1)">
            <a-icon type="cloud-upload-o" class="upload-icon" />
            <div class="mask">
                <a-icon type="plus" />
            </div>
            <img :src="params.avatar" />
        </div>
        <a-button v-else type="primary" @click="$refs.modal.edit(1)">上传头像</a-button>
        <div style="text-align: right">
            <span style="font-size: 12px; color: #999; cursor: pointer">
                忘记密码？
            </span>
        </div>
        <div class="btn" slot="footer">
            <btn theme="gradient" :loading="loading" long @click="register">我要注册
            </btn>
            <btn :style="{ marginTop: '10px' }" long @click="goLogin">前往登录
            </btn>
        </div>
    </Popup>
    <avatar-modal ref="modal" @ok="setAvatar" />
</div>
</template>

<script>
import AvatarModal from '@/components/AvatarModal/index.vue'
import Popup from "../Popup/index.vue";
import Btn from "../Btn";
import {
    validatorsExp
} from "../../utils/validate";
import {
    mapActions
} from "vuex";
import {
    login,
    register
} from "@/api/userManager";
export default {
    components: {
        AvatarModal,
        Popup,
        Btn
    },
    data() {
        return {
            params: {
                username: null,
                nickname: null,
                password: null,
                password2: null,
                avatar: ''
            },
            loading: false,
        };
    },
    methods: {
        ...mapActions(["toggleSignInPopup", "toggleSignUpPopup", "initGetInfo"]),
        register() {
            this.validateForm().then(async (valid) => {
                if (valid) {
                    await register(this.params);
                    this.$message.success("恭喜您、注册成功啦");
                    const res = await login(this.params);
                    await this.initGetInfo(res.result.token);
                    this.handlerClose();
                    this.$emit('passJoin')
                }
            });
        },
        goLogin() {
            this.toggleSignUpPopup(false);
            this.toggleSignInPopup(true);
        },
        handlerClose() {
            this.toggleSignUpPopup(false);
        },
        validateForm() {
            const {
                username,
                nickname,
                password,
                password2,
                avatar
            } = this.params;
            return new Promise((resolve) => {
                // if (Object.values(this.params).filter((t) => t).length < 5) {
                //     this.$message.error("请按要求填写完所有信息！");
                //     resolve(false);
                // }
                if (username.length > 8 || username.length < 2) {
                    this.$message.error("请输入2-6位数的用户名称");
                    resolve(false);
                }
                if (nickname.length > 8 || nickname.length < 2) {
                    this.$message.error("请输入2-8位数的用户昵称");
                    resolve(false);
                }
                if (password.length > 8 || password.length < 2) {
                    this.$message.error("密码在6-32位数之间哟");
                    resolve(false);
                }
                if (password !== password2) {
                    this.$message.error("两次密码不一致、请确认密码输入正确！");
                    return resolve(false);
                }
                if (!avatar) {
                    this.$message.error("请上传头像");
                    resolve(false);
                }
                return resolve(true);
            });
        },
        setAvatar(url) {
            this.params.avatar = url
        },
    },
    created() {},
    mounted() {},
    watch: {},
    computed: {
        show() {
            return this.$store.state.chat.showSignUpPopup;
        },
    },
};
</script>

<style lang="less" scoped>
.sign-in {
    .btn {
        width: 100%;
        padding: 0 10px;
    }
}
.ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 1.4rem;
        padding: 0.5rem;
        background: rgba(222, 221, 221, 0.7);
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .mask {
        opacity: 0;
        position: absolute;
        background: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        transition: opacity 0.4s;

        &:hover {
            opacity: 1;
        }

        i {
            font-size: 2rem;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -1rem;
            margin-top: -1rem;
            color: #d6d6d6;
        }
    }

    img,
    .mask {
        width: 100%;
        max-width: 180px;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
    }
}
</style>
