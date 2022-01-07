<template>
<a-card :bordered="false" title="主页背景图片">
    <div class="clearfix">
        <a-upload list-type="picture-card" ref="files" multiple :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove" @preview="handlePreview" @change="handleChange">
            <div v-if="fileList.length < 8">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                    选择图片
                </div>
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
    <a-button type="primary" :disabled="fileList.length === 0" :loading="uploading" @click="handleUpload">保存</a-button>
</a-card>
</template>

<script>
import store from '@/store'
import {
    uploadMultipleFile
} from '@/api/upload'
import {
    updateUser
} from '@/api/userManager'
import {
    fileBaseUrl
} from '@/config/fileConfig'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default {
    data() {
        return {
            userInfo: {},
            previewVisible: false,
            previewImage: '',
            uploading: false,
            fileList: [],
        };
    },
    mounted() {
        this.userInfo = store.getters.userInfo;
        this.fileList = this.userInfo.blogConfig ? this.userInfo.blogConfig.bgImgs.map(item => {
            return {
                uid: item,
                name: item,
                status: 'done',
                url: fileBaseUrl + item
            }
        }) : []
    },
    methods: {
        handleCancel() {
            this.previewVisible = false;
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
        },
        handleChange({
            fileList
        }) {
            this.fileList = fileList;
        },
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },
        beforeUpload(file) {
            this.fileList = [...this.fileList, file];
            return false;
        },
        handleUpload() {
            const {
                fileList
            } = this;
            const formData = new FormData();
            fileList.forEach((file, index) => {
                formData.append('files[]', file.originFileObj);
            });
            this.uploading = true;

            uploadMultipleFile(formData).then(res => {
                const url = fileBaseUrl + res.result.url;
                let hasUploadList = [];
                this.fileList.forEach(item => {
                    if (!item.originFileObj) hasUploadList.push(item.uid)
                })

                this.updateUser({
                    id: this.userInfo._id,
                    blogConfig: {
                        bgImgs: [...hasUploadList, ...res.result.ids]
                    }
                });
                this.uploading = false
            })
        },
        updateUser(data) {
            store.dispatch('UpdateUser', data).then(res => {
                this.$message.success('保存成功')
            })
        }
    },
};
</script>

<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
