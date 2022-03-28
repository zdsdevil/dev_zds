<template>
<dv-full-screen-container class="full-screen">
    <!-- <dv-loading>Loading...</dv-loading> -->
    <dv-border-box-11 title="移动数据分析" :titleWidth="200">
        <a-row>
          <a-col :span="6">
              <dv-decoration-3 style="width:100%;height:30px;" />
              <dv-conical-column-chart :config="config" class="chart1" />
          </a-col>
        </a-row>
    </dv-border-box-11>
</dv-full-screen-container>
</template>

<script>
export default {
    data() {
        return {
            config: {
                data: [{
                        name: '湖里区',
                        value: 55
                    },
                    {
                        name: '思明区',
                        value: 120
                    },
                    {
                        name: '集美区',
                        value: 71
                    },
                    {
                        name: '翔安区',
                        value: 66
                    },
                    {
                        name: '同安区',
                        value: 80
                    },
                    {
                        name: '海沧区',
                        value: 35
                    },
                    {
                        name: '角美',
                        value: 15
                    }
                ],
                img: [
                    require('@/static/img/1st.png'),
                    require('@/static/img/2st.png'),
                    require('@/static/img/3st.png'),
                    require('@/static/img/4st.png'),
                    require('@/static/img/5st.png'),
                    require('@/static/img/6st.png'),
                    require('@/static/img/7st.png'),
                ],
                showValue: true
            }
        }
    }
}
</script>

<style lang="less">
    body {
        margin: 0;
    }
    .full-screen {
        height: 100%;
        background: #282c34;
        .border-box-content {
            padding: 40px 30px;
        }
        .chart1 {
            margin-top: 20px;
            width: 100%;
            height: 300px;
        }
    }
</style>
