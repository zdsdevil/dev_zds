<template>
<a-card :bordered="false">
    <div class="table-page-search-wrapper">
        <a-form layout="inline">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-form-item label="角色名称">
                        <a-input v-model="queryParam.name" placeholder="请输入" />
                    </a-form-item>
                </a-col>
                <a-col :md="16" :sm="24">
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
        <span slot="createdAt" slot-scope="text">{{ text | moment }}</span>
        <span slot="action" slot-scope="text, record">
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
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称" hasFeedback>
                <a-input placeholder="起一个名字" v-decorator="['name',{rules: [{ required: true, message: '请输入角色名称' }], validateTrigger: ['change', 'blur']}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色编码" hasFeedback>
                <a-input placeholder="请输入" v-decorator="['code',{rules: [{ required: true, message: '请输入角色编码' }], validateTrigger: ['change', 'blur']}]" />
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
import {
    STable
} from '@/components'
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole
} from '@/api/userManager'
import {
    PERMISSION_ENUM
} from '@/core/permission/permission'
import {
    scorePassword
} from '@/utils/util'

const columns = [{
        title: '角色名称',
        dataIndex: 'name'
    },
    {
        title: '编码',
        width: '200px',
        dataIndex: 'code'
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
                return getRoleList(Object.assign(parameter, this.queryParam))
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
    },
    created() {

    },
    methods: {
        handleAdd() {
            this.visible = true
            this.modalTitle = '新增'
            this.form.resetFields();
        },
        handleDelete(id) {
            let that = this;
            this.$confirm({
                content: '确定删除角色？',
                onOk() {
                    deleteRole(id).then(res => {
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
                    name: record.name,
                    code: record.code
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
                        createRole({
                            ...values
                        }).then(res => {
                            this.$message.success('创建成功');
                            this.$refs.table.refresh(true)
                            this.visible = false
                        })
                    } else {
                        updateRole({
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
    watch: {}
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
