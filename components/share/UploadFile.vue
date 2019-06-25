<template>
    <div class="upload">
        <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :action="$store.state.port.netServer + '/UploadOrderFile'"
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
            multiple>
            <img class="el-icon-upload" src="/img/personal/qyadd_icon.png" alt="">
            <div class="el-upload__text">支持文件格式：pdf、cdr、ai、jpg、zip、rar、psd、png</div>
        </el-upload>
        <div class="close-btn" style="top: 0px;right: -50px;" @click="handleClose"></div>
        <div id="loading" v-if="loading">
            <div class="loader-inner ball-beat">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-if="success" style="color: #745bff;font-size: 16px;">文件上传成功</div>
        <div class="footer" style="margin-top: 30px;">
            <el-button :class="{disabled : !disabled}" @click="handleUpload" :disabled="disabled">确定上传</el-button>
            <el-button @click="handleClose">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filename: '',
            filepath: '',
            disabled: true,
            loading: false,
            success: false
        }
    },
    methods: {
        beforeAvatarUpload(file) {  
            const isLt2M = file.size <  1024 * 1024 * 200;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 200MB!');
            }
            return isLt2M;
        },

        uploadSuccess (response, file, fileList) {
            console.log('上传文件', response)
            if(response.status == 'ok') {
                this.loading = false
                this.success = true
                this.logoUploadPercent = 100
                this.filepath = response.key
                this.disabled = false
            }
        },
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！',response)
            this.$message({type: 'error', message: '上传文件失败'})
            this.loading = false
        },
        // 文件上传时的函数
        progress(event, file, fileList) {
            console.log(event,file)
            this.loading = true
            this.filename = file.name
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        // 确定上传
        handleUpload() {
            this.$emit('setCartFile', {name: this.filename, path: this.filepath})
            this.$refs.upload.clearFiles()
            this.disabled = true
            this.success = false
            this.$store.commit('port/setDialogUpload', false)
        },

        handleClose() {
            this.disabled = true
            this.success = false
            this.$store.commit('port/setDialogUpload', false)
        }
    },
    destroyed() {
        this.disabled = true
        this.filepath = ''
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
.upload /deep/ .footer .el-button{
    width: 98px;
}
.upload /deep/ .footer .el-button:first-child{
    background: rgba(236,236,236,1);
    color: rgba(51,51,51,1);
    margin-right: 40px;
}
.upload .footer .disabled{
    background: #745bff !important;
    color: rgba(255,255,255,1) !important;
    &:hover{
        color: rgba(255,255,255,1);
    }
}

#loading{
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 1000;
}
@keyframes ball-beat {
    50% {
        opacity: 0.2;
        transform: scale(0.75);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
.ball-beat > div {
    background: $color;
    width: 8px;
    height: 30px;
    // border-radius: 100%;
    border-radius: 5px;
    margin: 5px;
    animation-fill-mode: both;
    display: inline-block;
    animation: ball-beat 0.7s infinite linear;
}
.ball-beat > div:nth-child(2n-1){
    animation-delay: 0.35s !important;
}
</style>
