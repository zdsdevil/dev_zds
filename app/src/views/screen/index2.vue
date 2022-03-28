<template>
<div class="screen">
    <!-- 头部 -->
    <div class="header">
        <div class="logo">交通运输投诉服务热线分析</div>
        <div class="handle">
            <div class="time-wrap">
                <div class="time">{{hms}}</div>
                <div class="split"></div>
                <div class="day">
                    <div>{{year}}</div>
                    <div>{{date}}</div>
                </div>
                <div class="split"></div>
                <div class="week">周{{week}}</div>
            </div>
        </div>
    </div>
    <!-- 内容 -->
    <div class="content">
        <div class="box lg-box">
            <div class="head">
                <div class="title">
                    <div class="text">
                        <div class="s">投诉热点TOP5</div>
                        <div class="dot"></div>
                        <div class="s">top5</div>
                    </div>
                </div>
            </div>
            <div class="chart-wrap">
                <columnComponent id="top5" :list="data1"></columnComponent>
            </div>
        </div>
        <div class="box">
            <div class="head">
                <div class="title">
                    <div class="text">
                        <div class="s">12345</div>
                        <div class="s-small">政务服务便民热线</div>
                    </div>
                    <div class="handle">
                        <img class="line" src="~@/assets/img/screen/pic_line.png">
                        <img class="column" src="~@/assets/img/screen/btn_zzt.png">
                        <img class="pie" src="~@/assets/img/screen/btn_bt.png">
                    </div>
                </div>
            </div>

            <div class="chart-wrap">
                <column2Component id="12345" :list="data1"></column2Component>
            </div>
        </div>
        <div class="box">
            <div class="head">
                <div class="title">
                    <div class="text">
                        <div class="s">96188</div>
                        <div class="s-small">公交车服务热线</div>
                    </div>
                    <div class="handle">
                        <img class="line" src="~@/assets/img/screen/pic_line.png">
                        <img class="column" src="~@/assets/img/screen/btn_zzt.png">
                        <img class="pie" src="~@/assets/img/screen/btn_bt.png">
                    </div>
                </div>
            </div>

            <div class="chart-wrap">
                <pie-component id="96188" :list="data1"></pie-component>
            </div>
        </div>
        <div class="box lg-box">
            <div class="head">
                <div class="title">
                    <div class="text">
                        <div class="s">12328</div>
                        <div class="s-small">交通运输服务监督电话</div>
                    </div>
                    <div class="handle">
                        <img class="line" src="~@/assets/img/screen/pic_line.png">
                        <img class="column" src="~@/assets/img/screen/btn_zzt.png">
                        <img class="pie" src="~@/assets/img/screen/btn_bt.png">
                    </div>
                </div>
            </div>

            <div class="chart-wrap" style="width: 430px;float: right;">
                <pie-component id="12328" :list="data1"></pie-component>
            </div>
        </div>
        <div class="box">
            <div class="head">
                <div class="title">
                    <div class="text">
                        <div class="s">96596</div>
                        <div class="s-small">轨道服务热线</div>
                    </div>
                    <div class="handle">
                        <img class="line" src="~@/assets/img/screen/pic_line.png">
                        <img class="column" src="~@/assets/img/screen/btn_zzt.png">
                        <img class="pie" src="~@/assets/img/screen/btn_bt.png">
                    </div>
                </div>
            </div>

            <div class="chart-wrap">
                <pie-component id="96596" :list="data1"></pie-component>
            </div>
        </div>
        <div class="box">
            <div class="head">
                <div class="title">
                    <div class="text">
                        <div class="s">96108</div>
                        <div class="s-small">出租车服务热线</div>
                    </div>
                    <div class="handle">
                        <img class="line" src="~@/assets/img/screen/pic_line.png">
                        <img class="column" src="~@/assets/img/screen/btn_zzt.png">
                        <img class="pie" src="~@/assets/img/screen/btn_bt.png">
                    </div>
                </div>
            </div>

            <div class="chart-wrap">
                <pie-component id="96108" :list="data1"></pie-component>
            </div>
        </div>
                <!-- 左侧 -->
        <div class="left" :class="leftTypes[curLeftTypeIndex]">
            <div class="item gjrx">
                <div class="label">公交热线</div>
                <div class="text">8<span>件</span></div>
            </div>
            <div class="item gdrx">
                <div class="label">轨道热线</div>
                <div class="text">15<span>件</span></div>
            </div>
            <div class="item zwrx">
                <div class="label">政务热线</div>
                <div class="text">22<span>件</span></div>
            </div>
            <div class="item jdrx">
                <div class="label">监督热线</div>
                <div class="text">76<span>件</span></div>
            </div>
            <div class="item czrx">
                <div class="label">出租热线</div>
                <div class="text">43<span>件</span></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import columnComponent from './columnComponent.vue';
import column2Component from './column2Component.vue';
import pieComponent from './pieComponent.vue';
export default {
    components: {
        columnComponent,
        column2Component,
        pieComponent
    },
    data() {
        return {
            logo: require('@/assets/img/screen/logo.png'),
            timer: null, //左侧bg循环定时器
            timer2: null, //右上角时间定时器
            curTime: new Date(), //当前时间
            days: ['一','二','三','四','五','六','日'],
            leftTypes: ['gj', 'gd', 'zw', 'jd', 'cz'], //左侧类型列表
            curLeftTypeIndex: 0,
            data1: [{
                name: '网约车管理',
                value: '12'
            },{
                name: '出租车不打表',
                value: '11'
            },{
                name: '出租车拒载',
                value: '8'
            },{
                name: '公交车不停车',
                value: '7'
            },{
                name: '路面破损',
                value: '3'
            }]
        }
    },
    computed: {
        hms() {
            let newDate = new Date(this.curTime);
            let hours = newDate.getHours();
            let minutes = newDate.getMinutes();
            let seconds = newDate.getSeconds();
            return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
        },
        year() {
            return new Date(this.curTime).getFullYear();
        },
        date() {
            let newDate = new Date(this.curTime);
            let month = newDate.getMonth() + 1;
            let date = newDate.getDate();
            return (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
        },
        week() {
            return this.days[new Date(this.curTime).getDay()]
        }
    },
    mounted() {
        this.setLeftLoop();
        this.renderTime();
    },
    methods: {
        //设置左侧循环
        
        setLeftLoop(a) {
            this.timer = setInterval(() => {
                this.curLeftTypeIndex = (this.curLeftTypeIndex === 4 ? this.curLeftTypeIndex = 0 : this.curLeftTypeIndex + 1);
            }, 5000)
        },
        renderTime() {
            this.timer2 = setInterval(() => {
                this.curTime = new Date();
            },1000)
        }
    }
}
</script>

<style lang="scss">
// @font-face {
//     font-family: 'SourceHanSansCN-Bold';
//     src: url(./SourceHanSansCN-Bold.otf);
// }

// @font-face {
//     font-family: 'SourceHanSansCN';
//     src: url(./SourceHanSansCN-Normal.otf);
// }

// @font-face {
//     font-family: 'Alibaba_PuHuiTi';
//     src: url(./alibaba_PuHuiTi.ttf);
// }

.screen {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    background-image: url('~@/assets/img/screen/bg2.png');
    background-size: 100% 100%;

    .header {
        display: flex;
        justify-content: space-between;
        padding: 40px 72px 0 22px;

        .logo {
            display: block;
            margin-left: 40px;
            font-size: 36px;
            // font-family: Alibaba_PuHuiTi;
            font-weight: bold;
            font-style: italic;
            color: #F6FAFF;
        }

        .handle {
            display: flex;

            .search {
                width: 500px;
                height: 58px;
                background: url('~@/assets/img/screen/search_bg.png') no-repeat;
            }

            .time-wrap {
                display: flex;
                align-items: center;
                height: 58px;

                .split {
                    margin: 0 24px;
                    height: 30px;
                    border: 2px solid #D9E5FF;
                    border-radius: 2px;
                    opacity: 0.3;
                    transform: skewX(-30deg);
                }

                .time {
                    font-size: 36px;
                    // font-family: Alibaba_PuHuiTi;
                    font-weight: bold;
                    font-style: italic;
                    color: #F6FAFF;
                }

                .day {
                    line-height: 1;
                    font-size: 16px;
                    // font-family: Alibaba_PuHuiTi;
                    font-weight: bold;
                    font-style: italic;
                    color: #F6FAFF;
                }

                .week {
                    line-height: 58px;
                    font-size: 32px;
                    // font-family: Alibaba_PuHuiTi;
                    font-weight: bold;
                    font-style: italic;
                    color: #F6FAFF;
                }

            }
        }
    }

    .content {
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 18px 36px 18px 42px;

        .left {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 460px;
            background-position: left center;
            background-size: auto;
            transition: all 1s ease-in-out;
            background-repeat: no-repeat;

            &.gj {
                background-image: url('~@/assets/img/screen/left_bg1.png');
            }

            &.gd {
                background-image: url('~@/assets/img/screen/left_bg2.png');
            }

            &.zw {
                background-image: url('~@/assets/img/screen/left_bg3.png');
            }

            &.jd {
                background-image: url('~@/assets/img/screen/left_bg4.png');
            }

            &.cz {
                background-image: url('~@/assets/img/screen/left_bg5.png');
            }

            .item {
                position: absolute;

                &:hover {
                    // background: red;
                }

                .label {
                    position: relative;
                    width: 116px;
                    height: 36px;
                    padding-left: 15px;
                    line-height: 36px;
                    // font-family: SourceHanSansCN;
                    color: #fff;
                    font-style: italic;

                    &::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        transform: skewX(-30deg);
                    }
                }

                .text {
                    width: 100%;
                    margin-left: -23px;
                    // font-family: SourceHanSansCN-Bold;
                    font-size: 28px;
                    font-style: italic;
                    color: #fff;
                    text-align: center;

                    span {
                        margin-left: 5px;
                        font-size: 16px;
                    }
                }

                &.gjrx {
                    top: 158px;
                    left: 94px;

                    .label {
                        &::after {
                            background: linear-gradient(90deg, rgba(69, 255, 248, 0.3333), transparent 70%, transparent);
                        }
                    }
                }

                &.gdrx {
                    top: 264px;
                    left: 220px;

                    .label {
                        &::after {
                            background: linear-gradient(90deg, rgba(151, 123, 255, 0.3333), transparent 70%, transparent);
                        }
                    }
                }

                &.zwrx {
                    top: 414px;
                    left: 266px;

                    .label {
                        &::after {
                            background: linear-gradient(90deg, rgba(42, 127, 248, 0.3333), transparent 70%, transparent);
                        }
                    }
                }

                &.jdrx {
                    top: 574px;
                    left: 220px;

                    .label {
                        &::after {
                            background: linear-gradient(90deg, rgba(11, 255, 34, 0.3333), transparent 70%, transparent);
                        }
                    }
                }

                &.czrx {
                    top: 680px;
                    left: 94px;

                    .label {
                        &::after {
                            background: linear-gradient(90deg, rgba(248, 202, 42, 0.3333), transparent 70%, transparent);
                        }
                    }
                }
            }
        }

        .box {
            width: calc(27% - 8px);
            height: 420px;
            margin-bottom: 12px;
            background: rgba(0, 0, 0, .2);
            border-radius: 12px;

            &.lg-box {
                width: calc(46% - 8px);
                border-radius: 12px 12px 12px 73px;
            }

            .head {
                width: 100%;
                padding-top: 30px;
                padding-right: 44px;
                display: flex;
                flex-direction: row-reverse;
                .title {
                    width: 400px;
                    padding-left: 26px;
                    padding-bottom: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: url('~@/assets/img/screen/title_line.png') no-repeat;
                    background-size: 100% 14px;
                    background-position: left bottom;

                    .text {
                        display: flex;
                        align-items: center;

                        .s {
                            line-height: 1;
                            font-size: 24px;
                            // font-family: SourceHanSansCN;
                            font-weight: bold;
                            font-style: italic;
                            color: #fff;
                            text-shadow: 0 0 8px rgba(145, 221, 164, 0.29), 0 0 8px rgba(145, 221, 164, 0.29), 0 0 8px rgba(145, 221, 164, 0.29), 0 0 8px rgba(145, 221, 164, 0.29), 0 0 8px rgba(145, 221, 164, 0.29);
                        }

                        .s-small {
                            vertical-align: bottom;
                            margin-left: 14px;
                            line-height: 1;
                            font-size: 16px;
                            // font-family: SourceHanSansCN;
                            font-weight: bold;
                            font-style: italic;
                            color: #fff;
                        }

                        .dot {
                            margin: 0 10px;
                            width: 4px;
                            height: 4px;
                            border-radius: 2px;
                            background: #fff;
                        }
                    }
                    .handle {
                        display: flex;
                        align-items: center;
                        img {
                            display: block;
                            width: 18px;
                            height: 18px;
                            &.line {
                                width: 8px;
                                height: 14px;
                            }
                            &.column {
                                margin: 0 14px 0 18px;
                            }
                            &.pie {

                            }
                        }
                    }
                }
            }
            .chart-wrap {
                display: flex;
                flex-direction: row-reverse;
                align-items: center;
                width: 100%;
                height: calc(100% - 68px);
            }
        }
    }
}
</style>
