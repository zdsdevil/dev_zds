<template>
<div class="article-list">
    <article v-for="item in list" :key="item.id" :id="item.id" @click="viewBlog(item.id)">
        <a-row :gutter="40">
            <a-col :span="17">
                <h2>{{item.title}}</h2>
                <p>{{ item.abstract }}</p>
                <span><time> {{item.createdAt}}</time> 发布 | {{item.commentCount}} 条评论</span>
            </a-col>
            <a-col :span="7" v-if="item.showImg">
                <img :src="item.showImg">
            </a-col>
        </a-row>
    </article>
</div>
</template>

<script>
import {
    getBlogList
} from '@/api/blog'
import avatar from '@/assets/img/01.jpg'
export default {
    data() {
        return {
            avatar,
            blogger_id: '',
            copyText: 'hello world',
            list: []
        }
    },
    created() {
        this.blogger_id = this.$route.params.id;
        this.getBlogList();
    },
    methods: {
        async getBlogList() {
            let res = await getBlogList();
            if(res.code !== 200) return;
            this.list = res.result.data.map(item => {
                const imgMatch = item.MdContent ? item.MdContent.match(/!\[(.*?)\]\((.*?)\)/) : '';
                if(imgMatch) {
                    item.showImg = imgMatch[2];
                }
                return item;
            });
        },
        viewBlog(id) {
            this.$router.push('detail/' + id)
        },
    }
}
</script>

<style lang="scss">
.article-list {
    padding: 30px;
}
article {
    margin-bottom: 30px;
    cursor: pointer;
    .ant-row {
        opacity: .5;
        transition: opacity 1s ease-out;
        &:hover {
            opacity: 1;
            transition-delay: .2s;
            img {
                box-shadow: 0 2px 5px rgba(0,0,25,0.1),0 5px 75px 1px rgba(0,0,50,0.2);
                transition-delay: .2s;
            }
        }
    }
    h2 {
        margin-bottom: 15px;
        font-size: 26px;
        font-weight: bold;
        color: rgb(51, 51, 51)
    }

    p {
        font-size: 18px;
        line-height: 1.625;
        letter-spacing: 1px;
        margin-bottom: 15px;
        color: #555;
    }

    span {
        font-size: 14px;
        color: #888;
    }

    img {
        display: block;
        height: 140px;
        width: 100%;
        box-shadow: none;
        transition: box-shadow 1s ease-out;
        transition-delay: 2s
    }
}
</style>
