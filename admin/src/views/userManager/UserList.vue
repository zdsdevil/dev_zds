<template>
<a-card :bordered="false">
    <div class="table-page-search-wrapper">
        <a-form layout="inline">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-form-item label="账号名称">
                        <a-input v-model="queryParam.username" placeholder="请输入" />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="状态">
                        <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="1">启用</a-select-option>
                            <a-select-option value="2">禁用</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <span class="table-page-search-submitButtons">
                        <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                        <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                    </span>
                </a-col>
            </a-row>
        </a-form>
    </div>
    <a-row>
        <a-col>
            <a-button @click="handleAdd" type="primary" style="margin-bottom: 15px">新增</a-button>
        </a-col>
    </a-row>
    <s-table ref="table" row-key="id" size="default" :columns="columns" :data="loadData">
        <span slot="role" slot-scope="role">{{ role.name }}</span>
        <a-tag :color="text === 1 ? 'blue' : 'red'" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag>
        <span slot="createdAt" slot-scope="text">{{ text | moment }}</span>
        <span slot="action" slot-scope="text, record">
            <a @click="goBlog(record.id)">博客主页</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record.id)">删除</a>
        </span>
    </s-table>

    <a-modal :title="modalTitle" style="top: 20px;" :width="800" v-model="visible" @ok="handleOk">
        <a-form class="permission-form" :form="form">
            <a-form-item>
                <a-input type="hidden" v-decorator="['id']" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号名称" hasFeedback>
                <a-input placeholder="起一个名字" v-decorator="['username',{rules: [{ required: true, message: $t('user.username.required') }], validateTrigger: ['change', 'blur']}]" />
            </a-form-item>
            <a-popover v-if="modalTitle === '新增'" placement="rightTop" :trigger="['focus']" :getPopupContainer="(trigger) => trigger.parentElement" v-model="state.passwordLevelChecked">
                <template slot="content">
                    <div :style="{ width: '240px' }">
                        <div :class="['user-register', passwordLevelClass]">{{ $t(passwordLevelName) }}</div>
                        <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
                        <div style="margin-top: 10px;">
                            <span>{{ $t('user.register.password.popover-message') }}
                            </span>
                        </div>
                    </div>
                </template>
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="密码" hasFeedback>
                    <a-input-password :placeholder="$t('user.register.password.placeholder')" v-decorator="['password', {rules: [{ required: true, message: $t('user.password.required') }, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"></a-input-password>
                </a-form-item>
            </a-popover>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色" hasFeedback>
                <a-select v-decorator="['role',{rules: [{required: true,message: $t('user.role.required')}], validateTrigger: ['change', 'blur']}]">
                    <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态" hasFeedback>
                <a-select v-decorator="['status', { initialValue: 1 }]">
                    <a-select-option :value="1">正常</a-select-option>
                    <a-select-option :value="2">禁用</a-select-option>
                </a-select>
            </a-form-item>

            <!-- <a-divider>拥有权限</a-divider>
            <template v-for="permission in permissions">
                <a-form-item class="permission-group" v-if="permission.actionsOptions && permission.actionsOptions.length > 0" :labelCol="labelCol" :wrapperCol="wrapperCol" :key="permission.permissionId" :label="permission.permissionName">
                    <a-checkbox>全选</a-checkbox>
                    <a-checkbox-group v-decorator="[`permissions.${permission.permissionId}`]" :options="permission.actionsOptions" />
                </a-form-item>
            </template> -->

        </a-form>
    </a-modal>

</a-card>
</template>

<script>
import pick from 'lodash.pick'
import {
    STable
} from '@/components'
import {
    getUserList,
    getRoleList,
    createUser,
    freezeUser,
    updateUser,
    deleteUser
} from '@/api/userManager'
import {
    PERMISSION_ENUM
} from '@/core/permission/permission'
import {
    scorePassword
} from '@/utils/util'

const levelNames = {
    0: 'user.password.strength.short',
    1: 'user.password.strength.low',
    2: 'user.password.strength.medium',
    3: 'user.password.strength.strong'
}
const levelClass = {
    0: 'error',
    1: 'error',
    2: 'warning',
    3: 'success'
}
const levelColor = {
    0: '#ff0000',
    1: '#ff0000',
    2: '#ff7e05',
    3: '#52c41a'
}
const STATUS = {
    1: '启用',
    2: '禁用'
}

const columns = [{
        title: '账号名称',
        dataIndex: 'username'
    },
    {
        title: '角色',
        width: '200px',
        dataIndex: 'role',
        scopedSlots: {
            customRender: 'role'
        }
    },
    {
        title: '状态',
        width: '200px',
        dataIndex: 'status',
        scopedSlots: {
            customRender: 'status'
        }
    },
    {
        title: '创建时间',
        width: '200px',
        dataIndex: 'createdAt',
        scopedSlots: {
            customRender: 'createdAt'
        },
        sorter: true
    }, {
        title: '操作',
        width: '200px',
        dataIndex: 'action',
        scopedSlots: {
            customRender: 'action'
        }
    }
]

export default {
    name: 'TableList',
    components: {
        STable
    },
    data() {
        return {
            description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
            roleList: [],
            visible: false,
            modalTitle: '',
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
            form: this.$form.createForm(this),
            permissions: [],

            // 高级搜索 展开/关闭
            advanced: false,
            // 查询参数
            queryParam: {},
            // 表头
            columns,
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                return getUserList(Object.assign(parameter, this.queryParam))
                    .then(res => {
                        return res.result
                    })
            },
            selectedRowKeys: [],
            selectedRows: [],
            state: {
                level: 0,
                passwordLevel: 0,
                passwordLevelChecked: false,
                percent: 10,
                progressColor: '#FF0000'
            },
        }
    },
    filters: {
        statusFilter(key) {
            return STATUS[key]
        },
        permissionFilter(key) {
            const permission = PERMISSION_ENUM[key]
            return permission && permission.label
        }
    },
    computed: {
        passwordLevelClass() {
            return levelClass[this.state.passwordLevel]
        },
        passwordLevelName() {
            return levelNames[this.state.passwordLevel]
        },
        passwordLevelColor() {
            return levelColor[this.state.passwordLevel]
        }
    },
    created() {
        getRoleList().then(res => {
            this.roleList = res.result.data;
        })
    },
    methods: {
        goBlog(id) {
            this.$router.push('/app/blogger/' + id)
        },
        handlePasswordLevel(rule, value, callback) {
            if (!value) {
                return callback()
            }
            console.log('scorePassword ; ', scorePassword(value))
            if (value.length >= 6) {
                if (scorePassword(value) >= 30) {
                    this.state.level = 1
                }
                if (scorePassword(value) >= 60) {
                    this.state.level = 2
                }
                if (scorePassword(value) >= 80) {
                    this.state.level = 3
                }
            } else {
                this.state.level = 0
                callback(new Error(this.$t('user.password.strength.msg')))
            }
            this.state.passwordLevel = this.state.level
            this.state.percent = this.state.level * 33

            callback()
        },
        handleAdd() {
            this.visible = true
            this.modalTitle = '新增'
            this.form.resetFields();
        },
        handleDelete(id) {
            let that = this;
            this.$confirm({
                content: '确定删除用户？',
                onOk() {
                    deleteUser(id).then(res => {
                        that.$message.success('操作成功');
                        that.$refs.table.refresh(true)
                    })
                }
            })
        },
        handleEdit(record) {
            this.visible = true
            this.modalTitle = '编辑'
            console.log('record', record)

            const checkboxGroup = {}
            // this.permissions = record.permissions.map(permission => {
            //     const groupKey = `permissions.${permission.permissionId}`
            //     checkboxGroup[groupKey] = permission.actionList
            //     const actionsOptions = permission.actionEntitySet.map(action => {
            //         return {
            //             label: action.describe,
            //             value: action.action,
            //             defaultCheck: action.defaultCheck
            //         }
            //     })
            //     return {
            //         ...permission,
            //         actionsOptions
            //     }
            // })

            this.$nextTick(() => {
                console.log('permissions', this.permissions)
                console.log('checkboxGroup', checkboxGroup)
                this.form.setFieldsValue({
                    id: record.id,
                    username: record.username,
                    role: record.role._id,
                    status: record.status
                })
                console.log(record)
                this.form.setFieldsValue(checkboxGroup)
            })
        },
        handleOk(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                console.log(err, values)
                if (!err) {
                    if (this.modalTitle === '新增') {
                        createUser({
                            ...values
                        }).then(res => {
                            this.$message.success('创建成功');
                            this.$refs.table.refresh(true)
                            this.visible = false
                        })
                    } else {
                        updateUser({
                            ...values
                        }).then(res => {
                            this.$message.success('操作成功');
                            this.$refs.table.refresh(true)
                            this.visible = false
                        })
                    }
                }
            })
        },
        onChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        toggleAdvanced() {
            this.advanced = !this.advanced
        }
    },
    watch: {
        /*
          'selectedRows': function (selectedRows) {
            this.needTotalList = this.needTotalList.map(item => {
              return {
                ...item,
                total: selectedRows.reduce( (sum, val) => {
                  return sum + val[item.dataIndex]
                }, 0)
              }
            })
          }
          */
    }
}
</script>

<style lang="less" scoped>
.permission-form {
    /deep/ .permission-group {
        margin-top: 0;
        margin-bottom: 0;
    }
}
</style>
