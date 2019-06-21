<template>
    <div class="upload">
        <el-upload
            class="upload-demo"
            ref="upload"
            drag
            action="http://v1.yinbuting.cn/api/UploadToOSS"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :onSuccess="uploadSuccess"
            :onError="uploadError"
            :on-progress="progress"
            :show-file-list="false"
            list-type="picture"
            :data="paramsData"
            :headers="myHeader"
            :before-upload="beforeAvatarUpload"
            accept=".jpg,.png"
            multiple>
            <!-- <i class="el-icon-upload"></i> -->
            <img class="el-icon-upload" :src="$store.state.port.staticPath + '/img/personal/qyadd_icon.png'" alt="">
            <div class="el-upload__text">支持文件格式：pdf、cdr、ai、jpg、zip、rar、psd、png</div>
        </el-upload>
        <div v-if="logoFlag" class="progress-bar progress-bar-striped active" :style="{width: logoUploadPercent + '%'}">{{logoUploadPercent+ '%'}}</div>
        <div class="footer">
            <el-button type="primary" @click="handleUpload">确定上传</el-button>
            <el-button @click="handleClose">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            logoFlag: false
        }
    },
    methods: {
        beforeAvatarUpload(file) {  
            const isLt2M = file.size <  1024 * 1024 * 20;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 20MB!');
            }
            return isLt2M;
        },

        uploadSuccess (response, file, fileList) {
            console.log('上传文件', response)
        },
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！',response)
        },
        // 文件上传时的函数
        progress(event, file, fileList) {
            console.log(event,file)
            this.logoFlag = true;   
            this.logoUploadPercent = parseInt(event.percent.toFixed(0))
            //this.logoUploadPercent = parseInt((event.loaded / event.total * 100).toFixed(0))
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        // 确定上传
        handleUpload() {},

        handleClose() {
            this.$store.commit('setDialogUpload', false)
        }
    },
    computed: {
        paramsData: function() {
            let params = {
                
            }
            return params
        },
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.upload /deep/ .upload-demo .el-upload-dragger{
    background:rgba(236,236,236,1);
    border-radius:5px;
    border: 0;
    width: 558px;
    height: 222px;
    margin-bottom: 20px;
    .el-upload__text{
        width: 100%;
        padding: 0 46px;
        color:rgba(153,153,153,1);
        line-height: 45px;
    }
}
</style>
