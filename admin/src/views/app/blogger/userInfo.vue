<template>
<div class="userInfo">
    <div class="mask"></div>
    <div class="info">
        <a-avatar class="avatar" :size="100" :src="avatar"></a-avatar>
        <div class="name">钟大仙</div>
        <div class="enName">dev_zds's Blog</div>
        <!-- <div class="note">记录生活、记录代码</div> -->
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        }
    }
}
</script>

<style lang="less">
.userInfo {
    position: relative;
    width: 100%;
    height: 100%;

    .mask {
        z-index: 1;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .5);
    }

    .info {
        z-index: 2;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: #fff;
        opacity: .8;
        .name {
            margin-top: 40px;
            font-size: 32px;
        }
        .enName {
            margin-top: 20px;
            font-size: 24px;
        }
        .note {
            margin-top: 20px;
            font-size: 16px;
        }
    }
}
</style>
