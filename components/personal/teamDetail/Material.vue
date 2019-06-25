<template>
    <div id="material">
        <div class="material">
            <!-- <el-form :inline="true" class="form-inline">
                <el-form-item label="产品分类: ">
                    <el-select v-model="formInline.product" clearable class="select">
                        <el-option v-for="(item,index) in productList" :key="index" :label="item.ClassName" :value="item.ClassNum"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传时间: " class="form-item">
                    <div class="block-date">
                        <el-date-picker
                            v-model="formInline.startTime"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择开始日期"
                            :picker-options="pickerOptions0">
                        </el-date-picker>
                    </div>
                    <span class="range">~</span>
                    <div class="block-date">
                        <el-date-picker
                            v-model="formInline.endTime"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择结束日期"
                            :picker-options="pickerOptions1">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="screen" @click="getMaterialList">筛选</div>
                </el-form-item>
            </el-form> -->
            <div class="material-list">
                <div class="material-item">
                    <div class="material-block add" @click="dialogMaterialVisible = true">
                        <img class="block-img" src="/img/personal/qyadd_blue_icon.png" alt="">
                    </div>
                    <div class="material-title">
                        <span>添加素材</span>
                    </div>
                </div>
                <el-dialog
                    title="上传团队素材"
                    :close-on-click-modal="false"
                    :visible.sync="dialogMaterialVisible">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        drag
                        :action="$store.state.netServer + '/TeamMaterial'"
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
                        accept="image/*"
                        multiple>
                        <!-- <i class="el-icon-upload"></i> -->
                        <img class="el-icon-upload" src="/img/personal/qyadd_icon.png" alt="">
                        <div class="el-upload__text">选择素材，支持PNG、JPG格式 文件最大20MB</div>
                    </el-upload>
                    <div id="loading" v-if="loading">
                        <div class="loader-inner ball-beat">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div v-if="success" style="font-size: 18px;color: #745bff">上传成功</div>
                    <!-- <div v-if="logoFlag" class="progress-bar progress-bar-striped active" :style="{width: logoUploadPercent + '%'}">{{logoUploadPercent+ '%'}}</div> -->
                    <div class="footer">
                        <el-button class="sure-btn" @click="handleUpload">确定上传</el-button>
                        <el-button @click="dialogMaterialVisible = false">取 消</el-button>
                    </div>
                </el-dialog>
                <div class="material-item" v-for="(item,i) in materialList" :key="i">
                    <div class="material-block">
                        <img class="image" :src="$store.state.port.imgBaseUrl+item.FilePath" alt="">
                        <div class="material-block-mask">
                            <div data-tip="删除" class="block-delete" @click="open(i)">
                                <img src="/img/personal/delete_icon.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="material-title">
                        <p class="title"><span></span></p>
                        <p class="tips">
                            <!-- <span>公众号首图二维码</span> -->
                            <span>{{item.AddTime && item.AddTime.split('T')[0]}}</span>
                        </p>
                    </div>
                </div>
                <div class="material-item" style="height: 0px;visibility: hidden;"></div>
                <div class="material-item" style="height: 0px;visibility: hidden;"></div>
                <div class="material-item" style="height: 0px;visibility: hidden;"></div>
                <div class="material-item" style="height: 0px;visibility: hidden;"></div>
                <div class="material-item" style="height: 0px;visibility: hidden;"></div>
                <div class="material-item" style="height: 0px;visibility: hidden;"></div>
            </div>
            <div class="pagination" v-if="TotalPages >= 2">
                <HomePagination :Page="page" @getTempList="getMaterialList" />
            </div>
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            formInline: {
                product: '',
                date: ''
            },
            productList: [],  // 产品分类列表
            teamNum: localStorage['teamNum'],
            dialogMaterialVisible: false,
            fileList: [],
            imgUrl: '',
            materialList: [],
            serviceForm: {
                TypeNum: 1,
                TeamNum: localStorage['teamNum'],
                TypeCategoryNum: 11,
                IsPublic: 1
            },
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: null,    // 每页个数
            },
            TotalPages: null,
            logoFlag: false,
            logoUploadPercent: 0,
            pickerOptions0: {
                disabledDate: (time) => {
                    if (this.formInline.endTime) {
                        return time.getTime() > new Date(this.formInline.endTime).getTime();
                    } else {
                        return time.getTime() > Date.now();
                    }
                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    if(this.formInline.startTime){
                        return (
                            time.getTime() > Date.now() ||
                            time.getTime() < new Date(this.formInline.startTime).getTime()
                        );
                    }else{
                        return time.getTime() > Date.now();
                    }
                }
            },
            loading: false,
            success: false
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
            console.log('上传文件', JSON.parse(response))
            if(response == 'NoAuthority'){
                this.$message({type: 'error', message: '您没有权限无法上传'})
                this.dialogMaterialVisible = false
                this.logoFlag = false
            }else{
                this.imgUrl = JSON.parse(response).key || JSON.parse(response).svgpath
                this.logoFlag = true
                this.loading = false
                this.success = true
                //this.logoUploadPercent = 100
                this.page.totalRecords = this.page.totalRecords + 1
            }
        },
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！',response)
        },
        // 文件上传时的函数
        progress(event, file, fileList) {
            console.log(event,file)
            this.logoFlag = true;   
            this.loading = true
            //this.logoUploadPercent = parseInt(event.percent.toFixed(0))
            this.logoUploadPercent = parseInt((event.loaded / event.total * 100).toFixed(0))
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleUpload() {
            if(!this.imgUrl) return this.$message.warning('请先上传文件')
            this.dialogMaterialVisible = false
            this.logoFlag = false
            this.success = false
            this.materialList.unshift({FilePath:this.imgUrl})
            this.getMaterialList()
            this.$refs.upload.clearFiles();
        },
        // 获取团队专属素材列表
        getMaterialList() {
            var url = '/TeamMaterials?TeamNum='+this.teamNum+'&pageIndex='+this.page.currentPage + '&IsPublic='+1
            this.$axios.get(url).then((res) => {
                if(res.data == '暂无数据') return console.log('没有数据')
                console.log(JSON.parse(res.data))
                this.materialList = JSON.parse(res.data).Data
                var data = JSON.parse(res.data)['X-Pagination']
                this.page.totalRecords = data.TotalCount
                // this.page.pageSize = Math.ceil(data.TotalCount / data.TotalPages)
                this.TotalPages = data.TotalPages
            })
        },
        // 删除团队专属素材
        open(index) {
            this.$confirm('是否删除该素材?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var formData = new FormData(); 
                formData.append("TeamNum", this.teamNum);
                formData.append("Id", this.materialList[index].ID);
                formData.append("MaterialNum", this.materialList[index].MaterialNum);
                this.$axios.delete('/TeamMaterial',{data: formData}).then(res => {
                    // console.log(res)
                    if(res.data = 'success') {
                        this.$message({type: 'success',message: '删除成功!'});
                        this.materialList.splice(index,1)
                        this.page.totalRecords = this.page.totalRecords - 1
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
    },
    computed: {
        paramsData: function() {
            let params = {
                TypeNum: this.serviceForm.TypeNum,
                TeamNum: this.serviceForm.TeamNum,
                TypeCategoryNum: this.serviceForm.TypeCategoryNum,
                IsPublic: this.serviceForm.IsPublic
            }
            return params
        },
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    },
    mounted () {
        this.getMaterialList()
        this.$axios.get('/ProductCategories').then(res => {
            // console.log(res)
            this.productList = res.data
        })
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>

#material{
    width: 100%;
    padding: 30px 0;
    user-select: none;
}
.material{
    min-width: 960px;
    height: auto;
    margin: 0 auto;
    .form-inline{
        box-shadow: none;
        background: none;
        padding: 0;
        .el-input__inner{
            background:rgba(236,236,236,1);
        }
    }
}




.material-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 37px;
    .material-item{
        width:213px;
        height:271px;
        background:rgba(255,255,255,1);
        border-radius:10px;
        overflow: hidden;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
        transition: all .3s;
        cursor: pointer;
        margin-bottom: 21px;
        &:hover{
            box-shadow: 0 4px 15px rgba(0,0,0,.2);
            transform: translateY(-4px);
        }
        .material-block{
            width: 100%;
            height: 212px;
            position: relative;
            background:rgba(203,216,226,1);
            .image{
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .material-block-mask{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background:rgba(0,0,0,.2);
                // display: none;
                opacity: 0;
                transition: opacity .4s ease;
                .block-delete{
                    width:35px;
                    height:35px;
                    text-align: center;
                    background-color:rgba(255,255,255,1);
                    border-radius:5px;
                    position: absolute;
                    top: 11px;
                    right: 11px;
                    img{
                        margin-top: 3px;
                    }
                    &:hover::before{
                        content: attr(data-tip);
                        font-size: 12px;
                        line-height: 12px;
                        background-color: #fff;
                        color: #626262;
                        padding: 4px 6px;
                        position: absolute;
                        top: 49px;
                        left: -.5px;
                        white-space: pre;
                        border-radius: 2px;
                        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.24);
                    }
                    &:hover::after{
                        content: "";
                        position: absolute;
                        width: 0;
                        height: 0;
                        border-bottom: 4px solid #fff;
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        top: 45px;
                        left: 15.5px;
                    }
                }
            }
        }
        .material-title{ 
            padding: 8px 10px;
            .title{
                font-size:12px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(51,51,51,1);
                margin-bottom: 9px;
            }
            .tips{
                display: flex;
                font-size:11px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(153,153,153,1);
                span:first-child{
                    margin-right: 28px;
                }
            }
        }
    }
}
.material-item:hover .material-block .material-block-mask{
    // display: block;
    opacity: 1;
}
.material-item .add{
    background:rgba(203,216,226,1);
    .block-img{
        position: absolute;
        top: 82px;
        left: 79px;
    }
}
.material-item:first-child .material-title{
    font-size:20px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding: 18px 65px;
}

.pagination{
    text-align: center;
}


// 上传素材弹出框
.material /deep/ .el-dialog{
    width: 630px;
    height: 471px;
    border-radius:10px;
    text-align: center;
    .el-dialog__header{
        padding: 25px 20px 0;
        line-height: 21px;
        font-size: 23px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(51,51,51,1);
        position: relative;
        .el-dialog__headerbtn{
            position: absolute;
            top: 17px;
            right: -45px;
            .el-dialog__close{
                width: 24px;
                height: 24px;
                color: rgba(255,255,255,1);
                background-image: url(/img/home/fork_white.png);
                &::before{
                    content: '';
                }
            }
        }
    }
    .el-dialog__body{
        padding: 13px 35px;
        .el-icon-check{
            color: $color;
        }
        .upload-demo .el-upload-dragger{
            background:rgba(236,236,236,1);
            border-radius:5px;
            border: 0;
            width: 558px;
            height: 222px;
            margin-bottom: 20px;
            .el-upload__text{
                width:246px;
                height:45px;
                font-size:16px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(153,153,153,1);
                line-height:28px;
                margin: 0 auto;
            }
        }
        .footer{
            text-align: center;
            margin-top: 64px;
            .sure-btn{
                background: $color;
                color: rgba(255,255,255,1);
                &:hover{
                    background: $color;
                    color: rgba(255,255,255,1);
                }
            }
            .el-button{
                width: 179px;
                height: 48px;
            }
            .el-button+.el-button{
                margin-left: 31px;
            }
        }
    }
}

// 上传进度条
.progress-bar{
    height: 15px;
    border-radius: 10px;
    position: relative;
    animation: animate-positive 2s;
    background-color: #048CED;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    transition: width .6s ease;
    text-align: center;
    color: rgba(255,255,255,1);
}
.progress-bar.active{
    animation: reverse progress-bar-stripes 0.40s linear infinite, animate-positive 2s;
}
.progress-bar-striped {
    background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-size: 40px 40px;
}
@keyframes animate-positive{
    0% { width: 0; }
}
@keyframes progress-bar-stripes{
    0% {
        background-position: 40px 0;
    }

    100% {
        background-position: 0 0;
    }
}
</style>
