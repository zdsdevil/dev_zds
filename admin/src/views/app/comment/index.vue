<template>
<div class="comment-drawer">
    <a-icon class="open-btn" type="message" @click="showDrawer" v-show="!visible" />
    <a-badge class="count" :count="count" v-show="!visible" />
    <a-drawer title="留言" width="700px" placement="right" :closable="false" :visible="visible" :after-visible-change="afterVisibleChange" @close="onClose">
        <template v-if="comments.length">
            <comment :root="self" :blogId="blogId" :list="comments"></comment>
        </template>
        <a-comment>
            <a-avatar slot="avatar" :src="userInfo.avatar"/>
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
    </a-drawer>
</div>
</template>

<script>
import {
    getCommentList,
    createComment
} from '@/api/comment'
import moment from 'moment';
export default {
    name: 'commentDrawer',
    props: {
        blogId: {
            type: String,
            default: ''
        },
        count: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            self: this,
            visible: false,
            replyId: '',
            action: null,
            moment,
            comments: [],
            submitting: false,
            value: '',
            replayContent: '',
            userInfo: this.$store.getters.userInfo
        };
    },
    watch: {
        blogId() {
            this.getCommentList();
        }
    },
    methods: {
        afterVisibleChange(val) {
            console.log('visible', val);
        },
        showDrawer() {
            this.visible = true;
        },
        onClose() {
            this.visible = false;
        },
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

            if (data) {
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
    }
}
</script>

<style lang="less">
.comment-drawer {
    .open-btn {
        position: fixed;
        top: 50px;
        right: 0;
        font-size: 48px;
        color: #f1dddd;
    }

    .count {
        position: fixed;
        top: 50px;
        right: 0;
    }
}
.ant-drawer-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
}
.ant-drawer-body {
    margin-top: 55px;
}
</style>
