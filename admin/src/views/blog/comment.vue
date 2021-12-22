<template>
<a-card title="评论">
    <template v-if="comments.length">
        <comment :blogId="blogId" :list="comments"></comment>
    </template>
    <a-comment>
        <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />
        <div slot="content">
            <a-form-item>
                <a-textarea :rows="4" :value="value" @change="handleChange" />
            </a-form-item>
            <a-form-item>
                <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit()">
                    提交
                </a-button>
            </a-form-item>
        </div>
    </a-comment>
</a-card>
</template>

<script>
import {
    getCommentList,
    createComment
} from '@/api/comment'
import moment from 'moment';
export default {
    props: {
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

            if(data) {
                comment.root_commentId = data.root_commentId || data._id;
                comment.reply_sno = data.reply_sno ? data.reply_sno + 1 : 1;
                comment.reply_userId = data.auth._id;
                comment.reply_commentId = data._id;
            }
            createComment(comment).then(res => {
                this.$message.success('评论成功！')
                this.value = '';
                this.submitting = false;
                this.replyId = '';
                this.getCommentList();
            })
        },
        handleChange(e) {
            this.value = e.target.value;
        },
    },
};
</script>
