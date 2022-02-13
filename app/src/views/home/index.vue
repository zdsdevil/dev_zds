<template>
<div class="max">
    <div id="scene" class="img-outer">
        <div data-depth="0.4" class="layer">
            <img src="@img/main.jpg" class="moveImg" :width="imgWidth" :height="imgHeight">
        </div>
    </div>
    <div class="mask"></div>
    <div class="info">
        <div class="time">{{date.month}} {{date.day}}, {{date.year}}</div>
        <div class="title">{{title}}</div>
        <div class="content">春秋十四甲之摸鱼甲</div>
    </div>
    <div class="nav">
      <div class="nav-item" @click="go('dev_zds')">article</div>
      <div class="nav-item" @click="go('rain')">听雨</div>
      <div class="nav-item" @click="go('io')">聊天室</div>
    </div>
</div>
</template>

<script>
import Parallax from 'parallax-js'
export default {
    name: 'home',
    data() {
        return {
            imgWidth: null,
            imgHeight: null,
            hiddenText: false,
            date: {},
            title: '',
            monthCN: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        }
    },
    created() {
        let wWidth = document.documentElement.clientWidth
        let wHeight = document.documentElement.clientHeight
        this.imgWidth = wWidth + 150
        this.imgHeight = wHeight + 150
        if (wWidth <= 600) {
            this.imgWidth = 1920 / 1.3;
            this.imgHeight = 960
        }
    },
    mounted() {
        const scene = document.getElementById('scene');
        const parallaxInstance = new Parallax(scene, {
            relativeInput: true,
            clipRelativeInput: true,
        })
        this.getYearMonthDay();
    },
    methods: {
        go(url) {
            if(url === 'rain') {
              this.$router.push('/rain')
            } else if (url === 'io') {
              this.$router.push('/chat')
            } else {
              this.$router.push('/blogger/' + url)
            }
        },
        getYearMonthDay() {
            const date = new Date()
            this.date.year = date.getFullYear()
            this.date.month = this.monthCN[date.getMonth()]
            this.date.day = date.getDate()
            const hours = date.getHours()
            this.title = hours < 9 ? '早上好' : hours < 12 ? '上午好' : hours < 2 ? '中午好' : hours < 18 ? '下午好' : '晚上好'
        },
    }
}
</script>

<style lang="less" scoped>
@keyframes move {
    from {
        transform: translateY(0px);
    }

    to {
        transform: translateY(-20px);
    }
}

#scene {
    // height: 100%;
    position: relative;
    overflow: hidden;

    #image {
        position: absolute;
        max-width: none;
        display: block;
    }
}

.max {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    z-index: 9999;

    .img-outer {
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .moveImg {
        margin-bottom: 20px;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
        max-width: none;
        display: block;
    }

    .info {
        position: absolute;
        top: 54%;
        left: 10%;
        color: #fff;
        transform: translateY(-50%);
        color: #fff;
        font-size: .5rem;

        .time {
            font-size: 14px;
        }

        .title {
            font-size: 1rem;
            margin: 15px 0 30px;
        }

        .content {
            font-size: 15px;
        }
    }
    .nav {
      display: flex;
      position: absolute;
      top: 54%;
      right: 10%;
      .nav-item {
        margin-left: 30px;
        font-size: 30px;
        color: #fff;
        cursor: pointer;
      }
    }
}

.mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #4c50cf86;
    clip-path: polygon(0 0, 25% 0, 60% 100%, 0 100%);
    pointer-events: none;
}

@media screen and (max-width: 900px) {
    .mask {
        clip-path: polygon(0 0, 220px 0, 700px 100%, 0 100%);
    }
}

@media screen and (max-width: 780px) {
    .mask {
        clip-path: none
    }

    .info {
        bottom: 8%;
        left: 5%;
        top: auto;
        width: 70%;
        transform: none;
    }
}
</style>
