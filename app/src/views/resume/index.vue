<template>
<div id="resume">
    <div class="title">个人简历 --- {{userInfo.name}}</div>
    <div class="sub-title">个人信息</div>
    <div class="user-info">
        <div class="item">姓名：{{userInfo.name}}</div>
        <div class="item">到岗时间：{{userInfo.when}}</div>
        <div class="item">电话：{{userInfo.tel}}</div>
        <div class="item">邮箱：{{userInfo.email}}</div>
        <div class="item mb0">期望岗位：{{userInfo.job}}</div>
        <div class="item mb0">期望薪资：{{userInfo.wage}}</div>
    </div>
    <div class="sub-title">教育经历</div>
    <div class="university">
        <img class="logo" :src="university.logo">
        <div class="content">
            <div class="item">
                <div>{{university.name}}</div>
                <div>{{university.time}}</div>
            </div>
            <div class="item">
                <div>{{university.specialty}}</div>
                <div>{{university.type}}</div>
            </div>
        </div>
    </div>
    <div class="sub-title">技能</div>
    <div class="skills">
        <div class="item" v-for="item,index in skills" :key="index">{{`${index + 1}、${item}`}}</div>
    </div>
    <div class="sub-title">工作经历</div>
    <div class="workExperience">
        <div class="work-item" v-for="item,index in workExperience" :key="index">
            <div class="name">
                <div class="n1">{{item.name}}</div>
                <div class="n2">{{item.time}}</div>
            </div>
            <div class="dept">
                <div class="d1">{{item.department}}</div>
                <div class="d2">{{item.job}}</div>
            </div>
            <div class="content">
                <div class="label">工作内容</div>
                <div class="text" v-for="c,index2 in item.work.content" :key="index2">{{`${index2 + 1}、${c}`}}</div>
            </div>
            <div>
                <div class="label">岗位职责</div>
                <div class="text" v-for="r,index3 in item.work.responsibilities" :key="index3">{{`${index3 + 1}、${r}`}}</div>
            </div>
            <div>
                <div class="label" v-if="item.work.performance.length">获得荣誉</div>
                <div class="text" v-for="p,index4 in item.work.performance" :key="index4">{{`${index4 + 1}、${p}`}}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import jmdx from '@/assets/img/jmdx.jpeg'
export default {
    data() {
        return {
            userInfo: {
                name: '钟东生',
                tel: '15710627409',
                email: 'dev_zds@163.com',
                when: '在职-月内到岗',
                wage: '面议',
                job: '前端岗位'
            },
            skills: ['熟练掌握jQuery、ES6、HTML5、CSS3、MV*框架 响应式布局等',
                '熟练掌握Vue2/3  vuex/pinia  vue router、webpack、vite 了解react angular',
                '熟练掌握echarts',
                '熟练掌握小程序原生开发及uniApp等第三方小程序框架',
                '熟练掌握前端工程化、模块开发',
                '了解vscode插件、浏览器插件、electron开发流程',
                '熟练掌握 node 框架egg 做服务端开发,掌握linux常用命令、nginx、pm2部署前后端项目',
                '熟练掌握git、svn'
            ],
            university: {
                logo: jmdx,
                name: '集美大学',
                specialty: '信息语计算科学',
                time: '2008 - 2014',
                type: '本科'
            },
            workExperience: [{
                name: '厦门卫星定位应用股份有限公司',
                time: '2021.06 - 至今',
                department: '交通信息平台事业部',
                job: '前端开发',
                work: {
                    content: ['移动端框架选型及搭建',
                        '多个智慧交通系列后台开发及公用组件封装',
                        '可视化大屏开发（地图、echarts、视频）',
                        '用户权限系统搭建'
                    ],
                    responsibilities: ['参与产品需求分析与项目评估',
                        '独完成产品框架设计和功能模块划分',
                        '与团队其他成员进行沟通和协作，改进并完善产品功能',
                        '负责产品的性能提升，后续的内容迭代以及 bug 修复',
                        '收集用户反馈并进行体验优化',
                        '完成上级领导交办的其他任务'
                    ],
                    performance: []
                }
            }, {
                name: '厦门威尔信息技术有限公司',
                time: '2019.08 - 2021.05',
                department: '平台组',
                job: '前端组长',
                work: {
                    content: ['重构平台系统',
                        '平台前端表单模块(可视化)',
                        '流程(流程设计器)',
                        'CMS (低代码可视化拖拽生成完整系统的设计器)组件维护、新增、重构',
                        '推动平台前后端分离。使用 egg.js 做中间层转发后端接口，处理部分复杂业务接口'
                    ],
                    responsibilities: ['参与产品需求分析与项目评估',
                        '独完成产品框架设计和功能模块划分',
                        '与团队其他成员进行沟通和协作，改进并完善产品功能',
                        '负责产品的性能提升，后续的内容迭代以及 bug 修复',
                        '收集用户反馈并进行体验优化',
                        '完成上级领导交办的其他任务'
                    ],
                    performance: ['2020年度优秀员工']
                }
            }, {
                name: '厦门昂讯网络科技有限公司',
                time: '2016.08 - 2019.08',
                department: '技术部',
                job: '前端组长',
                work: {
                    content: ['叫我修吧客户端微信公众号：功能涵盖微信分享、录⾳、地图定位及选址、普通叫修、扫码叫修、微信⽀付、 各类数据列表及相关操作',
                        '叫我修吧客户端微信⼩程序：使⽤微信⼩程序⾃带语法实现，功能同微信公众号。 ',
                        '若⼲个后台管理系统：接⼿后端使⽤AdminLTE模版开发的后台管理系统维护并新增功能模块、使⽤ Vue的后台UI Element-admin、iView-admin做为模版开发新的管理系统。',
                        'app活动页⾯：为app提供活动页⾯及实现相关交互。 '
                    ],
                    responsibilities: ['参与产品需求分析与项目评估',
                        '独完成产品框架设计和功能模块划分',
                        '与团队其他成员进行沟通和协作，改进并完善产品功能',
                        '负责产品的性能提升，后续的内容迭代以及 bug 修复',
                        '收集用户反馈并进行体验优化',
                        '完成上级领导交办的其他任务'
                    ],
                    performance: []
                }
            }, {
                name: '意博(厦门)网络服务有限公司',
                time: '2014.01 - 2016.08',
                department: '技术部',
                job: '前端开发',
                work: {
                    content: ['吉程旅行网使用jquery开发,功能包括机票酒店展示预定、定制旅游、企业会奖等',
                        '2016中国汽车产业数据研究峰会官网使用bootstrap做响应式开发',
                        '其他内部管理系统'
                    ],
                    responsibilities: [],
                    performance: []
                }
            }]
        }
    }
}
</script>

<style lang="scss">
#resume {
    width: 1000px;
    margin: 40px auto;
    background: #fff;
    // opacity: .2;

    .title {
        width: 100%;
        padding: 30px 0 10px;
        font-size: 30px;
        color: #333;
        text-align: center;
    }

    .sub-title {
        width: 100%;
        height: 40px;
        margin: 20px 0;
        padding: 0 20px;
        line-height: 40px;
        font-size: 20px;
        color: #fff;
        background: linear-gradient(to right,
                #fda085 0%,
                #f6d365 100%);
    }

    .user-info {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding: 0 20px;

        .item {
            width: 50%;
            margin-bottom: 15px;

            &.mb0 {
                margin-bottom: 0;
            }
        }
    }

    .university {
        display: flex;
        align-items: center;
        padding: 0 20px;

        .logo {
            display: block;
            width: 60px;
            height: 60px;
            margin-right: 20px;
        }

        .content {
            .item {
                display: flex;

                &>div {
                    width: 200px;
                }
            }
        }
    }

    .skills {
        padding: 0 20px;

        .item {}
    }

    .workExperience {
        padding: 0 20px;

        .work-item {
            margin-bottom: 20px;

            .name {
                display: flex;
                justify-content: space-between;

                .n1 {
                    font-size: 16px;
                    color: #333;
                }

                .n2 {}
            }

            .dept {
                display: flex;

                .d1 {
                    margin-right: 20px;
                }

                .d2 {}
            }
        }
    }
}
</style>
