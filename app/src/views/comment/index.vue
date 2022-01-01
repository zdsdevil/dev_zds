<template>
<div class="comment-drawer-wrap">
    <a-icon class="open-btn" type="message" @click="showDrawer" v-show="!visible" />
    <a-badge class="count" :count="count" v-show="!visible" />
    <a-icon class="close-btn" type="close-circle" @click="closeDrawer" v-show="visible" />
    <a-drawer title="留言" :zIndex="zIndex" class="comment-drawer" placement="right" :closable="false" :visible="visible" :after-visible-change="afterVisibleChange" @close="onClose">
        <a-comment>
            <!-- <a-avatar slot="avatar" :src="userInfo.avatar"/> -->
            <div slot="content">
                <a-form-item>
                    <a-textarea :rows="4" v-model="value" placeholder="你也来说两句呗" />
                </a-form-item>
                <div style="font-size: 16px;color: #999">留个联系方式吧<span style="font-size: 14px">(不填回复名称默认为匿名)</span></div>
                <a-form-item>
                    <a-row :gutter="20">
                      <a-col :span="12">
                          <a-input v-model="nickname" placeholder="昵称"></a-input>
                      </a-col>
                      <a-col :span="12">
                          <a-input v-model="email" placeholder="email"></a-input>
                      </a-col>
                    </a-row>
                    <a-input v-model="website" placeholder="个人主页"></a-input>
                </a-form-item>
                <a-form-item>
                    <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit()">
                        提交
                    </a-button>
                </a-form-item>
            </div>
        </a-comment>
        <template v-if="comments.length">
            <comment :root="self" :blogId="blogId" :list="comments"></comment>
        </template>
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
            zIndex: -1,
            replyId: '',
            action: null,
            moment,
            comments: [],
            submitting: false,
            value: '',
            replayContent: '',
            userInfo: this.$store.getters.userInfo,
            nickname: localStorage.visitorNickname,
            email: localStorage.visitorEmail,
            website: localStorage.visitorWebsite
        };
    },
    mounted() {

    },
    watch: {
        blogId() {
            this.getCommentList();
        },
        nickname(val) {
            localStorage.visitorNickname = val;
        },
        email(val) {
            localStorage.visitorEmail = val;
        },
        website(val) {
            localStorage.visitorWebsite = val;
        }
    },
    methods: {
        afterVisibleChange(val) {
            console.log('visible', val);
        },
        showDrawer() {
            this.visible = true;
            this.zIndex = 1000;
        },
        closeDrawer() {
            this.visible = false;
            this.zIndex = -1;
        },
        onClose() {
            this.visible = false;
            this.zIndex = -1;
        },
        getCommentList() {
            getCommentList({
                blogId: this.blogId
            }).then(res => {
                this.comments = res.result.data;
            })
        },
        handleSubmit() {
            if (!this.value) return;
            this.submitting = true;
            let comment = {
                blogId: this.blogId,
                content: this.value,
                nickname: this.nickname || '匿名',
                email: this.email,
                website: this.website,
                createdTime: moment().fromNow(),
            }
            createComment(comment).then(res => {
                this.$message.success('评论成功！')
                this.value = '';
                this.submitting = false;
                this.replyId = '';
                this.getCommentList();
            })
        },
    }
}
</script>

<style lang="less">
.comment-drawer-wrap {
    .open-btn {
        z-index: 9999;
        position: fixed;
        top: 50px;
        right: 0;
        font-size: 48px;
        color: #f1dddd;
    }
    .close-btn {
        z-index: 9999;
        position: fixed;
        top: 10px;
        right: 10px;
        font-size: 32px;
        color: #666;
    }

    .count {
        z-index: 9999;
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
.comment-drawer {
    width: 700px !important;
    .ant-drawer-content-wrapper {
        width: 100% !important;
    }
}
@media screen and (max-width: 768px) {
    .comment-drawer {
    width: 100% !important;
}
}
</style>
