<template>
<div class="userInfo">
    <div class="mask"></div>
    <div class="info" :style="{'min-height': minHeight}">
        <a-avatar class="avatar" :size="100" :src="userInfo.avatar"></a-avatar>
        <div class="icons">
            <a-tooltip placement="bottom">
                <template slot="title">
                    <span>返回主页</span>
                </template>
                <div class="icon-block" @click="goHome">
                    <a-icon type="home" />
                </div>
            </a-tooltip>
        </div>
        <div class="name">{{userInfo.username}}</div>
        <!-- <div class="enName">dev_zds's Blog</div> -->
        <div class="resume">{{userInfo.resume}}</div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        userInfo: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data() {
        return {
            minHeight: ''
        }
    },
    methods: {
        goHome() {
            let pathArr = this.$route.path.split('detail');
            if(pathArr.length < 2) return
            let path = pathArr[0]
            this.$router.push(path)
        }
    },
    mounted() {
           if(window.innerWidth > 768) {
               this.minHeight = '100%';
        } else {
            this.minHeight = window.innerHeight / 2 + 'px';
        }
    },
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
            margin-top: 20px;
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

        .icons {
            margin-top: 15px;

            .icon-block {
                width: 26px;
                height: 26px;
                line-height: 24px;
                border: 1px solid #ddd;
                border-radius: 50%;
                text-align: center;
                cursor: pointer;

                &:hover {
                    background: rgba(221, 221, 221, 0.3);
                }
            }
        }
    }
}
</style>
