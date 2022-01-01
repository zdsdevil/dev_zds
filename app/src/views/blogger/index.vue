<template>
<a-layout class="container" :style="{'height': containerHeight}">
    <a-layout-sider :style="bgStyle">
        <userInfo :userInfo="userInfo" :style="{minHeight: bgStyle.minHeight}"></userInfo>
    </a-layout-sider>
    <a-layout-content>
        <router-view :style="{'min-height': containerHeight}"></router-view>
    </a-layout-content>
</a-layout>
</template>

<script>
import {
    fileBaseUrl
} from '@/config/fileConfig'
import {
    getUserByUsername
} from '@/api/user'
import userInfo from './userInfo.vue'
import articleList from '@/views/article/list.vue'
export default {
    components: {
        userInfo,
        articleList
    },
    data() {
        return {
            userInfo: {},
            containerHeight: '100%',
            containerMinHeight: '',
            blogger_username: '',
            timer: null,
            bgStyle: {}
        }
    },
    created() {
        this.blogger_username = this.$route.params.username;
    },
    mounted() {
        getUserByUsername(this.$route.params.username).then(res => {
            this.userInfo = res.result;
            this.$store.commit('SET_INFO', this.userInfo);
            this.loopBg();
        })
        if(window.innerWidth > 768) {
            this.containerHeight = window.innerHeight + 'px';
            delete this.bgStyle.minHeight;
        } else {
            this.containerHeight = '100%'
            this.bgStyle.minHeight = window.innerHeight / 2 + 'px !important';
        }
    },
    methods: {
        loopBg() {
            let that = this;
            const bgImgs = that.userInfo.blogConfig ? that.userInfo.blogConfig.bgImgs.map(item => fileBaseUrl + item) : ['~@/assets/img/01.jpg', '~@/assets/img/02.jpg', '~@/assets/img/03.jpg', '~@/assets/img/04.jpg', '~@/assets/img/05.jpg', '~@/assets/img/06.jpg', '~@/assets/img/06.jpg'];
            let len = bgImgs.length;
            let curIndex = 0;
            that.setBg(bgImgs[curIndex]);
            that.timer = setInterval(() => {
                curIndex = curIndex === len - 1 ? 0 : ++curIndex;
                that.setBg(bgImgs[curIndex])
            }, 5000)
        },
        setBg(url) {
            this.bgStyle = Object.assign({},this.bgStyle,{
                background: `url('${url}') no-repeat`,
                backgroundSize: '100% 100%'
            })
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>

<style lang="less">
.container {
    width: 100%;
    height: 100%;

    .ant-layout-sider {
        width: 38.2%;
        height: 100%;
        transition: all 2s;
    }
}

@media screen and (max-width: 768px) {
    .container {
        display: block;
        .ant-layout-sider {
            width: 100% !important;
            max-width: 100% !important;
            height: 50%;
            transition: all 2s;
        }
    }
}
</style>
