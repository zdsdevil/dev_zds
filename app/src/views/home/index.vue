<template>
<div class="index">
    <header :class="headerClass">
        <div class="container">
            <img class="logo" src="@img/zdx.png">
            <div class="nav">
                <router-link to="article" class="nav-item">个人文章</router-link>
                <router-link to="tool" class="nav-item">前端导航</router-link>
                <router-link to="message" class="nav-item">有话说</router-link>
                <router-link to="rain" class="nav-item">听雨</router-link>
                <router-link to="chat" class="nav-item">聊天室</router-link>
            </div>
        </div>
    </header>
    <section class="computer">
        <div class="mac" :style="{transform: macMatrix}">
            <div class="mac-screen"></div>
        </div>
        <!-- <div class="left-top">左上</div>
        <div class="right-top">右上</div>
        <div class="left-bottom">左下</div>
        <div class="right-bottom">右下</div> -->
    </section>
    <section class="website home-section" :style="{opacity: websiteOpacity}">
        <div class="tit">网站介绍</div>
        <div class="content">
            <div class="global" :style="{transform: globalMatrix}">
                <a-icon type="global" />
            </div>
            <div class="introduce">
                <div class="item app" :style="{transform: appMatrix}">
                    <a-icon type="home" />
                    <div class="text">
                        <div class="name">前端博客</div>
                        <div class="desc">vue博客系统</div>
                    </div>
                </div>
                <div class="item admin" :style="{transform: adminMatrix}">
                    <a-icon type="setting" />
                    <div class="text">
                        <div class="name">管理后台</div>
                        <div class="desc">vue + ant-design-vue</div>
                    </div>
                </div>
                <div class="item server" :style="{transform: serverMatrix}">
                    <a-icon type="api" />
                    <div class="text">
                        <div class="name">后端服务</div>
                        <div class="desc">egg + mongo + cheeiro</div>
                    </div>
                </div>
                <div class="item socket" :style="{transform: socketMatrix}">
                    <a-icon type="wechat" />
                    <div class="text">
                        <div class="name">聊天室</div>
                        <div class="desc">前端vue-socket.io 后端egg-socket.io开发的在线互动聊天室、用于实时通信</div>
                    </div>
                </div>
                <div class="item deployment" :style="{transform: deploymentMatrix}">
                    <a-icon type="cluster" />
                    <div class="text">
                        <div class="name">网站部署</div>
                        <div class="desc">linux云服务器、nginx、pm2</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="about home-section">
        <div class="tit">关于我的</div>
        <div class="introduce">
            <img src="@/assets/img/moyu.jpg">
        </div>
    </section>
    <section class="friends-link home-section">
        <div class="tit">友情链接</div>
    </section>
    <footer>
        <div class="copyright">
            <div class="tip">转载内容版权归作者及来源网站所有,本站原创内容转载请注明来源。</div>
            <div class="copyright-content">
                <span>Copyright © 2020-2021 zhongdx.site All Rights Reserved.</span>
                <a target="_blank" href="https://beian.miit.gov.cn/">闽ICP备2022002508号-1</a>
                <span class="gwab">
                    <a target="_blank" href="https://beian.miit.gov.cn/">
                        <img src="@/assets/img/beian_icon.png" width="18" height="18" alt="京公网安备">
                        <span>闽ICP备2022002508号-1</span>
                    </a>
                </span>
            </div>
        </div>
    </footer>
</div>
</template>

<script>
export default {
    data() {
        return {
            scrollX: 0,
            scrollY: 0,
        }
    },
    computed: {
        headerClass() {
            return this.scrollY >= 100 ? 'header-fixed' : ''
        },
        macMatrix() {
            if (this.scrollY >= 600) {
                return `matrix(1, 0, 0, 1, 0, 690)`
            } else {
                let percent = 1 - (this.scrollY / 1000);
                let a = 2.5 * percent;
                let top = this.scrollY * 1.2 || 10;
                return `matrix(${a > 1 ? a : 1}, 0, 0, ${a > 1 ? a : 1}, 0, ${-30 + top})`
            }
        },
        websiteOpacity() {
            return this.scrollY > 500 ? 1 : 0
        },
        globalMatrix() {
            if (this.scrollY > 900) {
                return `translateX(0px) rotate(0deg)`
            } else if (this.scrollY > 500) {
                let translateX = (this.scrollY - 500) * 2.5;
                let rotate = (this.scrollY - 500) * .9;
                return `translateX(${translateX - 1000}px) rotate(${rotate}deg)`
            } else {
                return `translateX(-1000px) rotate(0deg)`
            }
        },
        appMatrix() {
            if (this.scrollY > 600) {
                return `translateX(0px)`
            } else if (this.scrollY > 500) {
                let translateX = (this.scrollY - 500) * 10;
                return `translateX(${1000 - translateX}px)`
            } else {
                return `translateX(1000px)`
            }
        },
        adminMatrix() {
            if (this.scrollY > 700) {
                return `translateX(0px)`
            } else if (this.scrollY > 600) {
                let translateX = (this.scrollY - 600) * 10;
                return `translateX(${1000 - translateX}px)`
            } else {
                return `translateX(1000px)`
            }
        },
        serverMatrix() {
            if (this.scrollY > 800) {
                return `translateX(0px)`
            } else if (this.scrollY > 700) {
                let translateX = (this.scrollY - 700) * 10;
                return `translateX(${1000 - translateX}px)`
            } else {
                return `translateX(1000px)`
            }
        },
        socketMatrix() {
            if (this.scrollY > 900) {
                return `translateX(0px)`
            } else if (this.scrollY > 800) {
                let translateX = (this.scrollY - 800) * 10;
                return `translateX(${1000 - translateX}px)`
            } else {
                return `translateX(1000px)`
            }
        },
        deploymentMatrix() {
            if (this.scrollY > 1100) {
                return `translateX(0px)`
            } else if (this.scrollY > 900) {
                let translateX = (this.scrollY - 900) * 5;
                return `translateX(${1000 - translateX}px)`
            } else {
                return `translateX(1000px)`
            }
        }
    },
    mounted() {
        window.addEventListener('scroll', () => {
            let offset = this.getScrollOffset();
            this.scrollX = offset.x;
            this.scrollY = offset.y;
            console.log(this.scrollY)
        })
    },
    methods: {
        getScrollOffset() {
            if (window.pageXOffset) {
                return {
                    x: window.pageXOffset,
                    y: window.pageYOffset
                }
            } else {
                return {
                    x: document.body.scrollLeft + document.documentElement.scrollLeft,
                    y: document.body.scrollTop + document.documentElement.scrollTop
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.index {
    position: relative;
    width: 100%;
    height: 100%;

    header {
        z-index: 99999;
        position: fixed;
        top: 0;
        width: 100%;
        height: 60px;
        background: rgba(29, 29, 31, 0.72);
        transition: all .5s;

        &.header-fixed {
            background: #fff;
            box-shadow: 0 0 4 rgba(29, 29, 31, 0.72);

            .nav {
                &-item {
                    color: #666;
                }
            }
        }

        .container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 1200px;
            height: 100%;
            margin: auto;

            .logo {
                display: block;
                height: 50px;
            }
        }

        .nav {
            display: flex;
            height: 100%;

            &-item {
                position: relative;
                display: flex;
                align-items: center;
                height: 100%;
                padding: 0 20px;
                font-size: 16px;
                color: #fff;
                transition: color 0.25s ease;
                cursor: pointer;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    height: 2px;
                    width: 0;
                    border-radius: 2px;
                    background-image: linear-gradient(90deg, #2db7f5, #6bc30d);
                    transition: all 0.3s ease;
                }

                &:hover {
                    background: linear-gradient(90deg, #2db7f5, #6bc30d);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: #6bc30d;
                }

                &:hover::after {
                    width: 100%;
                    left: 0;
                }

                &.current {
                    color: #6bc30d;
                    font-weight: 600;
                    background: linear-gradient(90deg, #2db7f5, #6bc30d);
                    -webkit-background-clip: text;
                }

                &.current::after {
                    width: 100%;
                    left: 0;
                }
            }
        }
    }

    .computer {
        .mac {
            will-change: transform;
            z-index: 2;
            left: 0;
            right: 0;
            margin-top: 0;
            transform-origin: center 88px;
            pointer-events: none;
            width: 1362px;
            height: 898px;
            position: relative;
            left: 50%;
            margin-left: -681px;
            background-image: url('https://www.apple.com/v/macos/monterey/d/images/overview/hero/hero_hardware__dg4szzi47yye_large.png');

            &-screen {
                position: absolute;
                left: 0;
                right: 0;
                margin: 0 auto;
                top: 47px;
                width: 847px;
                height: 530px;
                background-size: 100% 100%;
                transform: perspective(0);
                background-image: url('https://www.apple.com/v/macos/monterey/d/images/overview/hero/hero_desktop__buokcfsx51py_large_2x.jpg')
            }
        }
    }

    .home-section {
        width: 1200px;
        transition: all .5s;
        margin: 50px auto;

        .tit {
            width: 100%;
            font-size: 28px;
            font-weight: 500;
            color: #333;
            text-align: center;
        }
    }

    .website {
        margin-top: 580px;

        .content {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 0 100px;

            .global {
                line-height: 1;
                font-size: 300px;
                color: #0090ce
            }

            .introduce {
                .item {
                    display: flex;
                    align-items: center;
                    margin: 30px 0;

                    i {
                        font-size: 24px;
                    }

                    .text {
                        margin-left: 20px;

                        .name {
                            line-height: 20px;
                            font-size: 16px;
                            color: #333;
                        }

                        .desc {
                            font-size: 14px;
                            color: #666;
                        }
                    }
                }
            }
        }

    }

    .about {
        .introduce {
            img {
                display: block;
                width: 70%;
                margin: 20px auto;
            }
        }
    }

    footer {
        position: relative;
        padding: 20px 0;
        font-size: 12px;
        color: #60606d;
        background-color: #06060b;

        .copyright {
            width: 1200px;
            margin: auto;
            text-align: center;

            &-content {
                display: flex;
                justify-content: center;
                align-items: center;

                .gwab {
                    img {
                        margin: 0 5px;
                    }
                }
            }
        }
    }
}
</style>
