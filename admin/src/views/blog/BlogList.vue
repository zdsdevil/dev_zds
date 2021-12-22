<template>
<a-card :bordered="false">
    <div class="table-page-search-wrapper">
        <a-form layout="inline">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                    <a-form-item label="标题">
                        <a-input v-model="queryParam.title" placeholder="请输入" />
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
            <a @click="handleDetail(record.id)">详情</a>
            <a-divider type="vertical" />
            <a @click="handleEditBase(record)">编辑基本信息</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑内容</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record.id)">删除</a>
        </span>
    </s-table>

    <a-modal :title="modalTitle" style="top: 20px;" :width="800" v-model="visible" @ok="handleOk">
        <a-form class="permission-form" :form="form">
            <a-form-item v-if="modalTitle !== '新增'">
                <a-input type="hidden" v-decorator="['id']" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标题" hasFeedback>
                <a-input placeholder="请输入" v-decorator="['title',{rules: [{ required: true, message: '请输入标题' }], validateTrigger: ['change', 'blur']}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="副标题" hasFeedback>
                <a-input placeholder="请输入" v-decorator="['subTitle']" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="内容简介" hasFeedback>
                <a-textarea placeholder="请输入" v-decorator="['abstract', {rules: [{ required: true, message: '请输入内容简介' }]}]"></a-textarea>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标签" hasFeedback>
                <a-tag v-for="tag in tags" closable :key="tag" @close="() => handleClose(tag)">
                    {{ tag }}
                </a-tag>
                <a-input v-if="tagInputVisble" ref="tagInput" type="text" size="small" :style="{ width: '78px' }" :value="tagValue" @change="handleInputChange" @blur="handleInputConfirm" @keyup.enter="handleInputConfirm" />
                <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                    <a-icon type="plus" /> 添加标签
                </a-tag>
            </a-form-item>
        </a-form>
    </a-modal>

</a-card>
</template>

<script>
import {
    STable
} from '@/components'
import {
    getBlogList,
    createBlog,
    updateBlog,
    deleteBlog
} from '@/api/blog'

const columns = [{
        title: '标题',
        dataIndex: 'title'
    },
    {
        title: '小标题',
        dataIndex: 'subTitle'
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
        width: '300px',
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
            // 查询参数
            queryParam: {},
            // 表头
            columns,
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                return getBlogList(Object.assign(parameter, this.queryParam))
                    .then(res => {
                        return res.result
                    })
            },
            tags: [],
            tagInputVisble: false,
            tagValue: '',
        }
    },
    filters: {},
    computed: {},
    created() {

    },
    methods: {
        handleAdd() {
            this.visible = true
            this.modalTitle = '新增'
            this.tags = [];
            this.form.resetFields();
        },
        handleDetail(id) {
            this.$router.push('/blog/detail/' + id)
        },
        handleDelete(id) {
            let that = this;
            this.$confirm({
                content: '确定删除blog？',
                onOk() {
                    deleteBlog(id).then(res => {
                        that.$message.success('操作成功');
                        that.$refs.table.refresh(true)
                    })
                }
            })
        },
        handleEdit(record) {
            this.$router.push('/blog/edit/' + record.id)
        },
        handleEditBase(record) {
            this.visible = true
            this.modalTitle = '编辑'
            this.$nextTick(() => {
                this.tags = record.tags;
                this.form.setFieldsValue({
                    id: record.id,
                    title: record.title,
                    subTitle: record.subTitle,
                    abstract: record.abstract
                })
            })
        },
        handleOk(e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (this.modalTitle === '新增') {
                        createBlog({
                            tags: this.tags,
                            ...values
                        }).then(res => {
                            this.$message.success('创建成功');
                            this.$refs.table.refresh(true)
                            this.visible = false
                        })
                    } else {
                        updateBlog({
                            tags: this.tags,
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
        handleClose(removedTag) {
            const tags = this.tags.filter(tag => tag !== removedTag);
            this.tags = tags;
        },

        showInput() {
            this.tagInputVisble = true;
            this.$nextTick(function () {
                this.$refs.tagInput.focus();
            });
        },

        handleInputChange(e) {
            this.tagValue = e.target.value;
        },

        handleInputConfirm() {
            const tagValue = this.tagValue;
            let tags = this.tags;
            if (tagValue && tags.indexOf(tagValue) === -1) {
                tags = [...tags, tagValue];
            }
            Object.assign(this, {
                tags,
                tagInputVisble: false,
                tagValue: '',
            });
        },
    },
    watch: {}
}
</script>

<style lang="less" scoped>

</style>
