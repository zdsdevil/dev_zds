<template>
<a-result :isSuccess="true" :content="false" :title="email" :sub-title="description">

    <template #extra>
        <!-- <a-button size="large" type="primary">查看邮箱</a-button> -->
        <a-button size="large" style="margin-left: 8px" @click="goHomeHandle">返回首页</a-button>
    </template>

</a-result>
</template>

<script>
import {
    mapActions
} from 'vuex'
export default {
    name: 'RegisterResult',
    data() {
        return {
            description: '',
            form: {}
        }
    },
    computed: {
        email() {
            const v = this.form && this.form.username || 'xxx'
            return `你的账户：${v} 注册成功`
        }
    },
    created() {
        this.form = this.$route.params
    },
    methods: {
        ...mapActions(['Login']),
        loginSuccess(res) {
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
        },
        requestFailed(err) {
            this.$notification['error']({
                message: '错误',
                description: ((err.response || {}).data || {}).message || err || '请求出现错误，请稍后再试',
                duration: 4
            })
        },
        goHomeHandle() {
            this.Login(this.form)
                .then((res) => this.loginSuccess(res))
                .catch(err => this.requestFailed(err))
        }
    }
}
</script>

<style scoped>

</style>
