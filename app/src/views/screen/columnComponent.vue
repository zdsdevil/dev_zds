<template>
<div class="column">
    <div class="column-item" v-for="item,index in list" :key="index">
        <div class="label">
            <div class="l-text">
                <span class="index">{{index + 1}}</span>
                <span class="name">{{item.name}}</span>
            </div>
            <div class="r-text">{{item.value}}件</div>
        </div>
        <div class="bar">
            <div class="inner-bar"></div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default() {
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
        margin-bottom: 15px;
        .label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 0 10px;
            .l-text {
                .index {
                    margin: 0 18px 0 10px;
                    font-size: 18px;
                    font-family: SourceHanSansCN;
                    font-weight: bold;
                    font-style: italic;
                    color: #FFA800;
                }

                .name {
                    font-size: 18px;
                    font-family: SourceHanSansCN;
                    font-weight: 400;
                    font-style: italic;
                    color: #B4D3FF;
                }
            }

            .r-text {
                font-size: 18px;
                font-family: SourceHanSansCN;
                font-weight: bold;
                font-style: italic;
                color: #95DBFF;
            }
        }

        .bar {
            width: 100%;
            height: 10px;
            padding: 2px 4px;
            border: 1px solid #2666C4;
            border-radius: 5px;

            .inner-bar {
                width: 50%;
                height: 4px;
                background: linear-gradient(90deg, rgba(151, 50, 255, 0.58) 58%, rgba(255, 214, 48, 0.99) 100%);
                border-radius: 2px;
            }
        }
    }
}
</style>
