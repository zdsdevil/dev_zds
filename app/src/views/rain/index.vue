<template>
    <div class="rain">
        <div class="logo-img" @click="toIndex">
            <img src="@img/logo.png">
        </div>

        <img class="rain-bg" src="@img/rain/rain-bg.gif" draggable="false">
        <img class="words" src="@img/rain/words.png" draggable="false">

        <ul class="option flex align-center" v-show="show">
            <li v-for="(item, index) in rainIcon" :key="index">
                <span @click="music(index, item.active)">
                    <img :src="item.on" draggable="false" v-if="item.active" />
                    <img :src="item.off" draggable="false" v-else/>
                </span>
                <!-- music -->
                <audio class="music" loop="loop" preload="auto">
                    <source type="audio/mpeg" :src="item.music">
                </audio>
            </li>
        </ul>
    </div>
</template>

<script>
import thunder from './video/thunder.mp3'
import loudThunder from './video/loudThunder.mp3'
import rain from './video/rain.mp3'
export default {
    name: 'rainy',
    data(){
        return{
            audioDom: [],
            show: true,
            rainIcon: [
                {
                    on: require('@img/rain/rain_on.png'),
                    off: require('@img/rain/rain_off.png'),
                    music: thunder,
                    active: false
                },
                {
                    on: require('@img/rain/rain2_on.png'),
                    off: require('@img/rain/rain2_off.png'),
                    music: loudThunder,
                    active: false
                },
                {
                    on: require('@img/rain/rain3_on.png'),
                    off: require('@img/rain/rain3_off.png'),
                    music: rain,
                    active: false
                }
            ],
            loading: true,
            img: null
        }
    },
    activated(){
        debugger;
      this.audioDom = document.getElementsByClassName("music");
      this.userToast()
      document.documentElement.addEventListener('click', this.oncePlay)
    },
    deactivated () {
        document.documentElement.removeEventListener('click', this.oncePlay)
        this.rainIcon.forEach(item => this.$set(item, 'active', false))
    },
    methods: {
        toIndex(){
            this.$router.push('/')
        },
        music(type, active){
            this.audioDom = document.getElementsByClassName("music");
            this.$set(this.rainIcon[type], 'active', !active);
            !active ? this.audioDom[type].play() : this.audioDom[type].pause()
        },
        // 让用户自动触发播放，不然浏览器会报错
        oncePlay () {
          this.music(0, false)
          document.documentElement.removeEventListener('click', this.oncePlay)
        },
        // 提示用户，让用户手动触发
        userToast () {
         
        }
    }
}
</script>

<style lang="less" scoped>
.rain{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    box-sizing: border-box;
    .logo-img{
        color: #fff;
        position: fixed;
        top: 20px;
        left: 30px;
        z-index: 9999;
        cursor: pointer;
        width: 50%;
        img{
            width: 100%;
        }
    }
    .rain-bg{
        width: 100vw;
        height: 100vh;
    }
    .words{
        position: fixed;
        top: 80px;
        right: 80px;
    }
    .option{
        width: auto;
        height: 70px;
        position: fixed;
        bottom: 0;
        right: 0;
        text-align: center;
        li{
            display: inline-block;
            list-style-type: none;
            cursor: pointer;
            span{
                display: inline-block;
            }
        }
    }
}
@media screen and (max-width: 480px){
    .rain {
        .logo-img{
            color: #fff;
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            cursor: pointer;
            width: 100%;
            img{
                width: 100%;
            }
        }
    }
    .rain{
        .words{
            top: 30%;
            left: 50%;
            right: auto;
            transform: translate(-50%, -50% );
        }
        .rain-bg {
            position: absolute;
            left: 60%;
            top: 50%;
            transform: translate(-50%,-50%);
            height: 100%;
            width: auto;
        }
        .option{
            width: auto;
            right: 20px;
            li{
                width: 60px;
                overflow: hidden;
                span{
                    display: flex;
                    justify-content: center;
                }
            }
        }
        .logo{
            left: 20px;
        }
    }
}
</style>
