<template>
<page-header-wrapper :title="false">
    <div class="markdown-body">
        <div class="content" v-html="blogInfo.content"></div>
    </div>
</page-header-wrapper>
</template>

<script>
import 'github-markdown-css/github-markdown.css'
import comment from './comment.vue'
import {
    getBlog
} from '@/api/blog'
export default {
    components: {
        comment
    },
    data() {
        return {
            blogInfo: {}
        }
    },
    created() {
        getBlog(this.$route.params.id).then(res => {
            this.blogInfo = res.result;
        })
    },
    methods: {
    }
}
</script>

<style scoped>
    .markdown-body {
        box-sizing: border-box;
        width: 100%;
        margin: 0 auto;
        padding: 45px;
    }
    @media (max-width: 767px) {
        .markdown-body {
            padding: 15px;
        }
    }
</style>
