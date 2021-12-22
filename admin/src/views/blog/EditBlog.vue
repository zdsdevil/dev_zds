<template>
<page-header-wrapper :title="false">
    <a-card :bordered="false">
        <a-descriptions :title="blogInfo.title">
            <a-descriptions-item v-if="blogInfo.subTitle" label="副标题">{{blogInfo.subTitle}}</a-descriptions-item>
            <a-descriptions-item label="标签">
                <a-tag v-for="tag in blogInfo.tags" :key="tag">
                    {{ tag }}
                </a-tag>
            </a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin-bottom: 32px" />
        <mavon-editor :ishljs="true" :toolbars="toolbars" @imgAdd="handleEditorImgAdd" @imgDel="handleEditorImgDel" style="height:600px" v-model="blogInfo.MdContent" @change="change" ref=md />
        <a-button type="primary" @click="handleSave" style="margin: 20px">保存</a-button>
    </a-card>
</page-header-wrapper>
</template>

<script>
import {
    getBlog,
    updateBlog
} from '@/api/blog'
import { uploadSingleFile } from '@/api/upload'
import { fileBaseUrl } from '@/config/fileConfig'
export default {
    data() {
        return {
            blogInfo: {},
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: true, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
            },
        }
    },
    created() {
        getBlog(this.$route.params.id).then(res => {
            this.blogInfo = res.result;
        })
    },
    methods: {
        handleSave() {
            let data = {...this.blogInfo};
            updateBlog(data).then(res => {
                this.$message.success('保存成功');
            })
        },
        //监听markdown变化
        change(value, render) {
            this.blogInfo.MdContent = value;
            this.blogInfo.content = render;
        },
        //上传图片接口pos 表示第几个图片
        handleEditorImgAdd(pos, $file) {
            var formdata = new FormData();
            formdata.append('file', $file);
            uploadSingleFile(formdata).then(res => {
                var url = fileBaseUrl + res.result.url;
                this.$refs.md.$img2Url(pos, url); //这里就是引用ref = md 然后调用$img2Url方法即可替换地址
            })
        },
        handleEditorImgDel() {
            console.log('handleEditorImgDel'); //我这里没做什么操作，后续我要写上接口，从七牛云CDN删除相应的图片
        }
    }
}
</script>

<style>

</style>
