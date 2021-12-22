<template>
<div>
    <a-list itemLayout="horizontal" :dataSource="option">
        <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
            <a-list-item-meta>
                <a slot="title">{{ item.title }}</a>
                <span slot="description">
                    <span class="security-list-description">{{ item.description }}</span>
                    <span v-if="item.value"> : </span>
                    <span class="security-list-value">{{ item.value }}</span>
                </span>
            </a-list-item-meta>
            <template v-if="item.actions">
                <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
            </template>
        </a-list-item>
    </a-list>
    <a-modal title="修改密码" style="top: 20px;" :width="800" v-model="changePwdVisible" @ok="handleOk">
        <a-form class="permission-form" :form="form">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧密码" hasFeedback>
                <a-input-password placeholder="请输入" v-decorator="['oldPassword', {rules: [{ required: true, message: '请输入旧密码' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新密码" hasFeedback>
                <a-input-password placeholder="请输入" v-decorator="['password', {rules: [{ required: true, message: '请输入新密码' }]}]"></a-input-password>
            </a-form-item>
            </a-form-item>
        </a-form>
    </a-modal>
</div>
</template>

<script>
import { resetPsw } from '@/api/userManager'
export default {
          data() {
            return {
                changePwdVisible: false,
                option: [{
                    title: '账户密码',
                    description: '当前密码强度',
                    value: '强',
                    actions: {
                        title: '修改',
                        callback: () => {
                            this.changePwdVisible = true
                        }
                    }
                }],
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 5
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 16
                    }
                },
                form: this.$form.createForm(this)
            }
        },
         methods: {
            handleOk() {
              this.form.validateFields((err, values) => {
                if (!err) {
                  resetPsw({...values}).then(res => {
                    this.$message.success('更新成功')
                  })
                }
              })
            }
        }
}
</script>

<style scoped>

</style>
