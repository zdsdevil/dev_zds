<template>
<div class="chart" :id="id"></div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default () {
                return []
            }
        }
    },
    mounted() {
        this.render()
    },
    methods: {
        getTotal(arr) {
            return arr.reduce((cur,next) => {
               return typeof cur  === 'object' ? Number(cur.value) + Number(next.value) : cur + Number(next.value)
            })
        },
        render() {
            let that = this;
            let chartDom = document.getElementById(this.id);
            let myChart = this.$echarts.init(chartDom);
            myChart.setOption({
                width: '50%',
                legend: {
                    orient: 'vertical',
                    type: 'scroll',
                    top: 'center',
                    left: '55%',
                    itemGap: 20,
                    itemWidth: 8,
                    itemHeight: 8,
                    icon: 'circle',
                    textStyle: {
                        fontSize: 16,
                        fontStyle: 'italic',
                        color: '#95DBFF'
                    },
                    data: that.list,
                    formatter: function (name) {
                        let cur = that.list.find(item => item.name === name);
                        return `{a|${cur.name}}{b|${cur.value}件}`
                    },
                    textStyle:{
                        rich:{
                            a:{
                                width: 120,
                                fontSize: 16,
                                fontWeight: 400,
                                fontStyle: 'italic',
                                color: '#95DBFF'
                            },
                            b: {
                                fontSize: 16,
                                fontWeight: 400,
                                fontStyle: 'italic',
                                color: '#95DBFF'
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                series: [{
                        color: ['#3682e1', '#35d789', '#f94a5c'],
                        name: '人员类型',
                        type: 'pie',
                        zlevel: 2,
                        radius: ['59%', '66%'],
                        center: ['55%', '50%'],
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false,
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#10244a',
                                borderWidth: 2,
                            },
                        },
                        data: this.list,

                    },
                    {
                        name: 'pie1',
                        type: 'pie',
                        radius: ['55%', '70%'],
                        center: ['55%', '50%'],
                        color: '#10244a',
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [1],
                        silent: true,
                    },
                    {
                        name: 'pie2',
                        type: 'pie',
                        radius: ['72%', '77%'],
                        center: ['55%', '50%'],
                        itemStyle: {
                            color: '#13293c',
                        },
                        zlevel: 3,
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [1],
                        silent: true,
                    },
                    {
                        name: 'pie3',
                        type: 'pie',
                        radius: ['50%', '52%'],
                        center: ['55%', '50%'],
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#194e96'
                                    },
                                    {
                                        offset: 0.5,
                                        color: '#194e96'
                                    },
                                    {
                                        offset: 1,
                                        color: 'transparent'
                                    }
                                ], false)
                            }
                        },
                        zlevel: 3,
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [1],
                        silent: true,
                    },
                ]
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>
