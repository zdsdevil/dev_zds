<template>
<div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
        <a-form-item>
            <a-input size="large" type="text" :placeholder="$t('user.login.username.placeholder')" v-decorator="[
                'username',
                {rules: [{ required: true, message: $t('user.userName.required') }, { validator: handleUsername }], validateTrigger: 'change'}
              ]">
                <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
        </a-form-item>

        <a-form-item>
            <a-input-password size="large" :placeholder="$t('user.login.password.placeholder')" v-decorator="[
                'password',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]">
                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input-password>
        </a-form-item>

        <a-form-item>
            <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('user.login.remember-me') }}</a-checkbox>
            <router-link :to="{ name: 'recover', params: { user: 'aaa'} }" class="forge-password" style="float: right;">{{ $t('user.login.forgot-password') }}</router-link>
        </a-form-item>

        <a-form-item style="margin-top:24px">
            <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="state.loginBtn" :disabled="state.loginBtn">{{ $t('user.login.login') }}</a-button>
        </a-form-item>

        <div class="user-login-other">
            <router-link class="register" :to="{ name: 'register' }">{{ $t('user.login.signup') }}</router-link>
        </div>
    </a-form>

</div>
</template>

<script>
import md5 from 'md5'
import {
    mapActions
} from 'vuex'
import {
    timeFix
} from '@/utils/util'

export default {
    data() {
        return {
            loginBtn: false,
            isLoginError: false,
            form: this.$form.createForm(this),
            state: {
                time: 60,
                loginBtn: false,
                loginType: 0,
                smsSendBtn: false
            }
        }
    },
    created() {},
    methods: {
        ...mapActions(['Login', 'Logout']),
        // handler
        handleUsername(rule, value, callback) {
            const {
                state
            } = this
            const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
            if (regex.test(value)) {
                state.loginType = 0
            } else {
                state.loginType = 1
            }
            callback()
        },
        handleSubmit(e) {
            e.preventDefault()
            const {
                form: {
                    validateFields
                },
                state,
                Login
            } = this

            state.loginBtn = true

            const validateFieldsKey = ['username', 'password']

            validateFields(validateFieldsKey, {
                force: true
            }, (err, values) => {
                if (!err) {
                    console.log('login form', values)
                    const loginParams = {
                        ...values
                    }
                    // loginParams.password = md5(values.password)
                    Login(loginParams)
                        .then((res) => this.loginSuccess(res))
                        .catch(err => this.requestFailed(err))
                        .finally(() => {
                            state.loginBtn = false
                        })
                } else {
                    setTimeout(() => {
                        state.loginBtn = false
                    }, 600)
                }
            })
        },
        loginSuccess(res) {
            console.log(res)
            this.$router.push({
                path: '/'
            })
            // 延迟 1 秒显示欢迎信息
            setTimeout(() => {
                this.$notification.success({
                    message: '欢迎',
                    description: `${timeFix()}，欢迎回来`
                })
            }, 1000)
            this.isLoginError = false
        },
        requestFailed(err) {
            this.isLoginError = true
            this.$notification['error']({
                message: '错误',
                description: ((err.response || {}).data || {}).message || err || '请求出现错误，请稍后再试',
                duration: 4
            })
        }
    }
}
</script>

<style lang="less" scoped>
.user-layout-login {
    label {
        font-size: 14px;
    }

    .getCaptcha {
        display: block;
        width: 100%;
        height: 40px;
    }

    .forge-password {
        font-size: 14px;
    }

    button.login-button {
        padding: 0 15px;
        font-size: 16px;
        height: 40px;
        width: 100%;
    }

    .user-login-other {
        text-align: left;
        margin-top: 24px;
        line-height: 22px;

        .item-icon {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.2);
            margin-left: 16px;
            vertical-align: middle;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: #1890ff;
            }
        }

        .register {
            float: right;
        }
    }
}
</style>
