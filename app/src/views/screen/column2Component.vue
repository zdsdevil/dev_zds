<template>
<div class="column">
    <div class="column-item" v-for="item,index in list" :key="index">
        <div class="label">{{item.name}}</div>
        <div class="bar">
            <div class="inner-bar"></div>
        </div>
        <div class="value">{{item.value}}件</div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default () {
                return []
            }
        }
    },
    mounted() {},
    methods: {

    }
}
</script>

<style lang="scss" scoped>
@font-face {
    font-family: 'SourceHanSansCN';
    src: url(./SourceHanSansCN-Normal.otf);
}

.column {
    display: flex;
    width: 400px;
    height: 100%;
    padding-right: 44px;
    flex-direction: column;
    justify-content: center;

    &-item {
        display: flex;
        align-items: center;
        .label {
            width: 90px;
            font-size: 18px;
            font-family: SourceHanSansCN;
            font-weight: 400;
            font-style: italic;
            color: #95DBFF;
        }

        .bar {
            width: calc(100% - 120px);
            height: 10px;
            margin: 0 10px;
            border-radius: 5px;
            background: rgba(43, 131, 255,.2);
            .inner-bar {
                width: 50%;
                height: 10px;
                background: linear-gradient(90deg, transparent, rgb(43, 131, 255) 100%);;
                border-radius: 5px;
            }
        }
        .value {
            width: 50px;
            font-size: 16px;
            font-family: SourceHanSansCN;
            font-weight: 400;
            font-style: italic;
            color: #95DBFF;
        }
    }
}
</style>
