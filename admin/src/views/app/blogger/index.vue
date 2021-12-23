<template>
<a-layout class="container" :style="{'height': containerHeight}">
    <a-layout-sider width="38.2%">
        <userInfo></userInfo>
    </a-layout-sider>
    <a-layout-content>
        <router-view :style="{'min-height': containerHeight}"></router-view>
    </a-layout-content>
</a-layout>
</template>

<script>
import userInfo from './userInfo.vue'
import articleList from '@/views/app/article/list.vue'
export default {
    components: {
        userInfo,
        articleList
    },
    data() {
        return {
            containerHeight: '100%',
            blogger_id: ''
        }
    },
    created() {
        this.blogger_id = this.$route.params.id;
    },
    mounted() {
        this.containerHeight = window.innerHeight + 'px';
    }
}
</script>

<style lang="less">
.container {
    width: 100%;
    height: 100%;

    .ant-layout-sider {
        height: 100%;
        background: url('~@/assets/img/02.jpg') no-repeat;
        background-size: 100% 100%;
    }
}
</style>
