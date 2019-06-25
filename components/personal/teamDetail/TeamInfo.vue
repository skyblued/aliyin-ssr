<template>
    <div class="team-info">
        <div class="container">
            <el-form :inline="true" class="team-search">
                <el-form-item label="团队名称: ">
                    <el-input v-model="input" placeholder="请输入团队名称"></el-input>
                </el-form-item>
                <el-form-item label="团队logo: " class="upload-logo">
                    <el-upload
                        action="$store.state.netServer + '/UploadToOSS'"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :headers="myHeader">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <span>上传团队logo</span>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <div class="title">
                <p>
                    <span>团队空间: </span>
                    <span>200M/<span style="color: #0083E9;">5GB</span></span>
                </p>
                <p>购买空间</p>
            </div>
            <div class="info-btn">
                <div class="sure">保存</div>
                <div class="cancel">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            input: '',
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    },
    computed: {
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    },
}
</script>

<style lang="scss" scoped>

.team-info{
    .container{
        height: 680px;
        min-width: 960px;
        background:rgba(255,255,255,1);
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius: 10px;
        margin: 45px auto 0;
        padding: 42px 0 92px 40px;
        .title{
            display: flex;
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,51,51,1);
            margin-top: 20px;
            p:first-child{
                margin-right: 25px;
                span:first-child{
                    margin-right: 10px;
                }
            }
            p:last-child{
                color: rgba(255,0,0,1);
            }
        }
        .info-btn{
            height: 34px;
            line-height: 34px;
            display: flex;
            margin-top: 39px;
            div{
                border-radius: 5px;
                padding: 0 26px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                font-weight: 400;
                cursor: pointer;
            }
            .sure{
                background: $color;
                color:rgba(254,254,254,1);
                margin-right: 21px;
                // &:hover{
                //     background: #0893ff;
                // }
            }
            .cancel{
                border: 1px solid rgba(210,210,210,1);
                color:rgba(51,51,51,1);
            }
        }
    }
}
.team-info /deep/ .team-search{
    width: 360px;
    .upload-logo div{
        height: 98px;
    }
    .el-form-item{
        margin-bottom: 33px;
        .el-upload{
            width:98px;
            height:98px;
            background:rgba(236,236,236,1);
            border-radius:5px;
            border: none;
            line-height: 130px;
            .el-icon-plus{
                background-image: url(/img/home/add_big_icon.png);
                display: inline-block;
                width: 43px;
                height: 43px;
            }
            .el-icon-plus::before{
                content: '';
            }
        }
        span{
            font-size: 12px;
            color: rgba(102,102,102,1);
        }
        .el-upload-list__item{
            width: 98px;
            height: 98px;
        }
        i{
            color: rgba(255,255,255,1);
        }
    }
    .el-form-item__label{
        font-size:16px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .el-form-item__content{
        width: 266px;
        height: 42px;
    }
}
</style>
