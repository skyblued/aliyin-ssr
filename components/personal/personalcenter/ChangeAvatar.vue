<template>
    <div class="change-avatar">
        <div class="avatar-content">
            <el-upload
                class="avatar-uploader"
                :action="$store.state.port.netServer + '/UploadToOSS'"
                :show-file-list="false"
                list-type="picture-card"
                :on-success="handleAvatarSuccess"
                accept="image/*">
                <img class="el-icon-upload" src="/img/personal/qyadd_icon.png" alt="">
                <div class="big-preview">
                    <img ref="big" class="big-image" style="width: 266px;height: 266px;" v-if="imageUrl" :src="imageUrl" alt="">
                    <!-- <div class="preview-mask"></div> -->
                </div>
                <div v-if="imageUrl" class="again-upload">
                    <p>重新上传</p>
                    <!-- <span>
                        <i @click="handleEnlarge" class="el-icon-circle-plus-outline"></i>
                    </span> -->
                </div>
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
        <div class="avatar-btn" @click="handleUpload">确定上传</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            imageUrl: '',
            headpic: ''
        }
    },
    methods: {
        handleAvatarSuccess(res,file) {
            console.log(res,file)
            if(file.status == 'success') {
                this.imageUrl = file.response.url
                this.headpic = file.response.key
                console.log(this.headpic)
            }
        },
        // beforeAvatarUpload(file) {
        //     const isJPG = file.type === 'image/jpeg';
        //     const isPNG = file.type === 'image/png';
        //     const isLt2M = file.size / 1024 / 1024 < 2;

        //     if (!isJPG) {
        //         this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
        //     }
        //     if (!isPNG) {
        //         this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
        //     }
        //     if (!isLt2M) {
        //         this.$message.error('上传头像图片大小不能超过 2MB!');
        //     }
        //     return isJPG && isPNG && isLt2M;
        // },

        // 确定上传
        handleUpload() {
            if(!this.headpic) return
            var formData = new FormData()
            formData.append('HeadPic', this.headpic);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/ChangeHeadPic', formData, config).then(res => {
                console.log(res.data)
                if(res.data.state == 'ok') {
                    localStorage.setItem('avatar', res.data.path);
                    this.$store.commit('setAvatar', res.data.path)
                    this.$message.success(res.data.message)
                    //history.go(0)
                }else{
                    this.$message.warning(res.data.message)
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>

.avatar-content{
    display: flex;
    margin-top: 34px;
    margin-bottom: 55px;
    position: relative;
    .again-upload{
        position: absolute;
        top: 270px;
        left: 0;
        color: $color;
        line-height: 18px;
        width: 266px;
        display: flex;
        justify-content: space-between;
        p{
            cursor: pointer;
        }
    }
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
    .big-preview{
        position: absolute;
        top: 0;
        left: 0;
        width: 266px;
        height: 266px;
        border-radius: 5px;
        // &:hover .preview-mask{
        //     opacity: 1;
        // }
        .big-image{
            border-radius: 5px;
        }
        // .preview-mask{
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     background: rgba(0,0,0,.4);
        //     border-radius: 5px;
        //     width: 100%;
        //     height: 100%;
        //     opacity: 0;
        //     transition: opacity .4s ease;
        // }
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
    .avatar{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
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
    // &:hover{
    //     background: #0893ff;
    // }
}
</style>
