<template>
<div class="account-settings-info-view">
    <a-row :gutter="16" type="flex" justify="center">
        <a-col :order="isMobile ? 2 : 1" :md="24" :lg="16">

            <a-form :form="form" layout="vertical">
                <a-form-item label="账号名">
                    <a-input disabled v-decorator="['username', {initialValue: userInfo.username}]" />
                </a-form-item>
                <a-form-item label="昵称">
                    <a-input v-decorator="['nickname', {initialValue: userInfo.nickname}]" placeholder="请输入您的昵称！" />
                </a-form-item>
                <a-form-item label="个人简介">
                    <a-textarea rows="4" v-decorator="['resume', {initialValue: userInfo.resume}]" placeholder="请输入个人简介" />
                </a-form-item>

                <a-form-item label="邮箱" :required="false">
                    <a-input v-decorator="['email', {initialValue: userInfo.email}, {rules: [{ validator: checkedEmail }], validateTrigger: ['change','blur']}]" placeholder="example@ant.design" />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" @click="save" style="margin-right: 20px">更新基本信息</a-button>
                    <a-button type="primary" @click="goBlog">博客主页</a-button>
                </a-form-item>
            </a-form>

        </a-col>
        <a-col :order="1" :md="24" :lg="8" :style="{ minHeight: '180px' }">
            <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
                <a-icon type="cloud-upload-o" class="upload-icon" />
                <div class="mask">
                    <a-icon type="plus" />
                </div>
                <img :src="option.img" />
            </div>
        </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setAvatar" />

</div>
</template>

<script>
import AvatarModal from './AvatarModal'
import {
    baseMixin
} from '@/store/app-mixin'
import store from '@/store'
export default {
    mixins: [baseMixin],
    components: {
        AvatarModal
    },
    data() {
        return {
            // cropper
            preview: {},
            userInfo: {},
            option: {
                img: '/avatar2.jpg',
                info: true,
                size: 1,
                outputType: 'jpeg',
                canScale: false,
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 180,
                autoCropHeight: 180,
                fixedBox: true,
                // 开启宽度和高度比例
                fixed: true,
                fixedNumber: [1, 1]
            },
            form: this.$form.createForm(this),
        }
    },
    mounted() {
        this.userInfo = store.getters.userInfo;
        this.option.img = this.userInfo.avatar;
    },
    methods: {
        goBlog() {
            this.$router.push('/app/blogger/' + this.userInfo._id)
        },
        checkedEmail(rule, value, callback) {
            const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (emailReg.test(value)) {
                callback()
            } else {
                callback(new Error('邮箱格式不正确！'))
            }
        },
        setAvatar(url) {
            this.option.img = url
        },
        save() {
            this.form.validateFields((err, values) => {
                if (!err) {
                    store.dispatch('UpdateUser',{
                        id: this.userInfo._id,
                        avatar: this.option.img,
                        ...values
                    }).then(res => {
                        this.$message.success('更新成功')
                    })
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
    height: 200px;
    width: 100%;
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
