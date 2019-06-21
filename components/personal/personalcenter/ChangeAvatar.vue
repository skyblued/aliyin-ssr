<template>
    <div class="change-avatar">
        <div class="avatar-content">
            <el-upload
                class="avatar-uploader"
                action="http://v1.yinbuting.cn/api/UploadToOSS"
                :show-file-list="false"
                list-type="picture-card"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img class="el-icon-upload" :src="$store.state.port.staticPath + '/img/personal/qyadd_icon.png'" alt="">
            </el-upload>
            <div class="preview">
                <div>
                    <img class="avatar" v-if="imageUrl" :src="imageUrl" alt="">
                </div>
                <span>头像预览</span>
                <p>
                    仅支持PNG、JPG、GIF，
                    大小不超过3M 
                    建议尺寸240*240
                </p>
            </div>
        </div>
        <div class="avatar-btn">确定上传</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            imageUrl: '',
        }
    },
    methods: {
        handleAvatarSuccess(res,file) {
            console.log(res,file)
            //this.imageUrl = file.url
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
}
</script>

<style lang="scss" scoped>

.avatar-content{
    display: flex;
    margin-top: 34px;
    margin-bottom: 55px;
}
.change-avatar /deep/ .avatar-uploader .el-upload{
    width: 266px;
    height: 266px;
    background:rgba(236,236,236,1);
    border-radius: 5px;
    position: relative;
    border: none;
    text-align: center;
    padding: 99px;
    line-height: 68px;
    .el-icon-upload{
        margin: 0;
    }
}
.preview{
    width: 126px;
    height: 155px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color:rgba(51,51,51,1);
    display: block;
    text-align: center;
    margin-left: 38px;
    div{
        width: 100%;
        height: 126px;
        background:rgba(236,236,236,1);
        border-radius: 50%;
        margin-bottom: 8px;
    }
    p{
        width: 166px;
        font-size: 14px;
        color:rgba(153,153,153,1);
        line-height: 24px;
        text-align: left;
        margin-top: 31px;
    }
}
.avatar-btn{
    background: $color;
    border-radius: 5px;
    width: 179px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color:rgba(254,254,254,1);
    cursor: pointer;
    user-select: none;
    &:hover{
        background: #0893ff;
    }
}
</style>
