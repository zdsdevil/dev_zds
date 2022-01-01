<template>
<div class="article-detail">
    <div class="tit">{{blogInfo.title}}</div>
    <!-- <div class="sub-tit">{{blogInfo.subTitle}}</div> -->
    <!-- <div class="tags">
        <a-tag v-for="tag in blogInfo.tags" :key="tag">{{tag}}</a-tag>
    </div> -->
    <span><time> {{blogInfo.createdAt}}</time> 发布 | {{blogInfo.readTimes}} 读过</span>
    <div class="markdown-body">
        <div class="content" v-html="blogInfo.content"></div>
    </div>
    <div class="next-article" v-if="nextBlogInfo.title">
        <div class="tip">阅读下一篇博文</div>
        <div class="block" @click="nextBlog">
            <div class="tit">{{nextBlogInfo.title}}</div>
            <div class="abstract">{{nextBlogInfo.abstract}}</div>
        </div>
    </div>
    <comment-drawer :blogId="blogInfo.id" :count="blogInfo.commentCount"></comment-drawer>
</div>
</template>

<script>
import 'github-markdown-css/github-markdown.css'
import commentDrawer from './../comment/index.vue'
import {
    getBlog,
    readBlog,
    getNextBlog
} from '@/api/blog'
export default {
    components: {
        commentDrawer
    },
    data() {
        return {
            blogInfo: {},
            nextBlogInfo: {},
        }
    },
    watch: {
        '$route'() {
            this.init();
        }
    },
    created() {
        this.init();
    },
    mounted() {
        console.log('mounted')
    },
    methods: {
        nextBlog() {
            this.$router.push(this.nextBlogInfo._id)
        },
        init() {
            getBlog(this.$route.params.articleId).then(res => {
                this.blogInfo = res.result;
            })
            getNextBlog(this.$route.params.articleId).then(res => {
                this.nextBlogInfo = !res.result.length ? {} : res.result[0];
            })
            readBlog(this.$route.params.articleId)
        }
    }
}
</script>

<style lang="less" scoped>
.article-detail {
    padding: 50px 50px 0;
    background: #fff;

    .tit {
        font-size: 60px;
        font-weight: bold;
        color: #333;
    }

    .sub-tit {
        font-size: 30px;
        color: #666;
    }

    .next-article {
        width: 100%;
        margin-top: 100px;

        .tip {
            margin-bottom: 15px;
            text-align: center;
            font-size: 22px;
            opacity: .25;
        }

        .block {
            width: 61.8%;
            margin: auto;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 2px 2px rgb(0 0 0 / 5%), 0 15px 100px 0 rgb(0 0 75 / 13%);
            transition: box-shadow ease-out .5s, opacity linear .3s;
            transition-delay: .2s;
            opacity: .5;
            user-select: none;
            cursor: pointer;

            &:hover {
                opacity: 1;
            }

            .tit {
                font-size: 22px;
            }

            .abstract {
                font-size: 16px;
                color: #666;
            }
        }
    }
}

.markdown-body {
    box-sizing: border-box;
    width: 100%;
    margin: 20px auto 0;
}

@media screen and (max-width: 768px) {
    .article-detail {
        padding: 20px 20px 0;
    }
}
</style>
