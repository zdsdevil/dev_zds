<template>
<div>
    <a-comment v-for="item in list" :key="item.id">
        <template slot="actions">
            <span key="comment-basic-like">
                <a-tooltip title="Like">
                    <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like" />
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                    {{ item.like }}
                </span>
            </span>
            <span key="comment-basic-dislike">
                <a-tooltip title="Dislike">
                    <a-icon type="dislike" :theme="action === 'disliked' ? 'filled' : 'outlined'" @click="dislike" />
                </a-tooltip>
                <span style="padding-left: '8px';cursor: 'auto'">
                    {{ item.dislike }}
                </span>
            </span>
            <span key="comment-basic-reply-to" v-if="replyId === item.id" @click="replyId = ''">取消回复</span>
            <span key="comment-basic-reply-to" v-else @click="replyId = item.id">回复</span>
        </template>
        <a slot="author">{{item.auth.username}} <span v-if="item.reply_user"> <span class="">回复</span> {{item.reply_user.username}}</span> </a>
        <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />
        <p slot="content">{{item.content}}</p>
        <a-tooltip slot="datetime" :title="moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')">
            <span>{{ moment(item.createdAt).fromNow() }}</span>
        </a-tooltip>
        <a-row :gutter="20" v-if="replyId === item.id" style="margin-bottom: 10px">
            <a-col :span="20">
                <a-input v-model="replayContent" :placeholder="`@${item.auth.username}`"></a-input>
            </a-col>
            <a-col :span="4" style="text-align: right">
                <a-button type="primary" @click="handleSubmit(item)">提交</a-button>
            </a-col>
        </a-row>
        <comment :root="root" :blogId="blogId" :list="item.children"></comment>
        <div class="more-comments" v-if="item.childrenCount > 20" @click="getChildrenComments(item.id)">查看全部{{item.childrenCount}}回复</div>
    </a-comment>
</div>
</template>

<script>
import {
    getCommentList,
    createComment,
    getChildrenComments
} from '@/api/comment'
import moment from 'moment';
export default {
    name: 'comment',
    props: {
        root: {
            type: Object
        },
        list: {
            type: Array,
            default () {
                return []
            }
        },
        blogId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            replyId: '',
            action: null,
            moment,
            comments: [],
            submitting: false,
            value: '',
            replayContent: ''
        };
    },
    watch: {
        blogId() {
            this.getCommentList();
        }
    },
    mounted() {

    },
    methods: {
        getCommentList() {
            getCommentList({
                blogId: this.blogId
            }).then(res => {
                this.comments = res.result.data;
            })
        },
        getChildrenComments(id) {
            getChildrenComments(id).then(res => {

            })
        },
        like() {
            this.likes = 1;
            this.dislikes = 0;
            this.action = 'liked';
        },
        dislike() {
            this.likes = 0;
            this.dislikes = 1;
            this.action = 'disliked';
        },
        handleSubmit(data) {
            if (!this.value && !this.replayContent) {
                return;
            }
            this.submitting = true;
            let comment = {
                blogId: this.blogId,
                content: data ? this.replayContent : this.value,
                createdTime: moment().fromNow(),
            }

            if (data) {
                comment.root_commentId = data.root_commentId || data.id;
                comment.reply_sno = data.reply_sno ? data.reply_sno + 1 : 1;
                comment.reply_userId = data.auth.id;
                comment.reply_commentId = data.id;
            }

            createComment(comment).then(res => {
                this.$message.success('评论成功！')
                this.value = '';
                this.submitting = false;
                this.replyId = '';
                this.root.getCommentList();
            })
        },
        handleChange(e) {
            this.value = e.target.value;
        },
    },
};
</script>
<style scoped>
    .more-comments {
        margin-bottom: 10px;
        font-size: 14px;
        color: #8590a6;
        cursor: pointer;
    }
</style>
