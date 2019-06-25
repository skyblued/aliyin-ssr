<template>
    <div class="team-vi">
        <div class="logo">
            <div class="title">
                <i></i>
                <span>我的LOGO</span>
            </div>
            <div class="logo-img">
                <div class="logo-item" @click="dialogLogoVisible = true">
                    <img class="upload-img" src="/img/personal/upload_sc_icon.png" alt="">
                    <span class="logo-name">上传</span>
                </div>
                <div v-for="(item,i) in logoList" :key="i" class="logo-item">
                    <div class="logo-img-wrap">
                        <img :src="$store.state.port.imgBaseUrl+item.FilePath">
                        <div class="logo-mask" @click="open1(i)">
                            <span>删除</span>
                        </div>
                    </div>
                    <span class="logo-name"></span>
                </div>
                <el-dialog
                    title="上传专用LOGO"
                    :lock-scroll="false"
                    :close-on-click-modal="false"
                    :before-close="close"
                    :visible.sync="dialogLogoVisible">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        drag
                        :action="$store.state.netServer + '/TeamLogo'" 
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :onSuccess="uploadSuccess"
                        :onError="uploadError"
                        :on-progress="progress"
                        :show-file-list="true"
                        list-type="picture"
                        :data="paramsData"
                        :headers="myHeader"
                        :before-upload="beforeAvatarUpload"
                        accept=".jpg,.jpeg,.png,.psd,.svg,.cdr"
                        multiple>
                        <!-- <i class="el-icon-upload"></i> -->
                        <img class="el-icon-upload" src="/img/personal/qyadd_icon.png" alt="">
                        <div class="el-upload__text">选择素材，支持PNG、JPG格式 文件最大20MB</div>
                    </el-upload>
                    <!-- <div v-if="logoFlag" class="progress-bar progress-bar-striped active" :style="{width: logoUploadPercent + '%'}">{{logoUploadPercent+ '%'}}<i :class="{'el-icon-check': success == true ? true : false}"></i></div> -->
                    <div class="dialog-footer">
                        <div class="sure" @click="handleUpload">确定上传</div>
                        <div class="cancel" @click="dialogLogoVisible = false">取消</div>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div class="color">
            <div class="title">
                <i></i>
                <span>我的专有颜色</span>
            </div>
            <div class="color-info">
                <div class="color-item" circle @click="dialogColorVisible = true">
                    <img class="colors" src="/img/personal/upload_ys_icon.png" alt="">
                    <span style="color: rgba(102,102,102,1);">添加颜色</span>
                </div>
                <div v-for="(item,i) in backgroundColor" :key="i" class="color-item">
                    <div class="colors" :style="{background: item.ColorCode}"></div>
                    <div class="colors-mask" @click="open(i)">删除</div>
                    <span :style="{color:item.ColorCode}">{{item.ColorCode}}</span>
                </div>
                <el-dialog title="设置颜色" :visible.sync="dialogColorVisible" :close-on-click-modal="false">
                    <div class="color-input">
                        颜色值: 
                        <el-input style="width: 276px;margin-left: 10px;" v-model="color"></el-input>
                        <div class="block">
                            <el-color-picker v-model="color"></el-color-picker>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <div class="sure" @click="handleAdd">确定</div>
                        <div class="cancel" @click="dialogColorVisible = false">取消</div>
                    </div>
                </el-dialog>
            </div>
        </div>
        <!-- <div class="font">
            <div class="title">
                <i></i>
                <span>我的专有字体</span>
            </div>
            <div class="fonts">
                <div class="font-btn" @click="handleOpenFont">
                    <img src="/img/personal/upload_wz_icon.png" alt="">
                </div>
                <div class="font-item" v-for="(items,index) in teamFontList" :key="index">
                    <div class="font-img-wrap">
                        <img :src="$store.state.port.imgBaseUrl+items.FontThumb" alt="">
                        <div class="font-mask" @click="open2(index)">删除</div>
                    </div>
                </div>
                <el-dialog title="添加专用字体" :visible.sync="dialogFontVisible" :close-on-click-modal="false">
                    <div class="add-font">
                        <div class="font-title" @click="handleFont">
                            <span>字体: </span>
                            <p class="font-input">
                                <span>{{fontValue}}</span>
                                <img src="/img/home/drop_down.png" alt="">
                            </p>
                        </div>
                        <div class="font-list" v-if="show">
                            <div class="choose-font-btn">
                                <div :class="{'active' : allfont == true}" @click="handleAll">全部</div>
                                <div :class="{'active' : freefont == true}" @click="handlefree">免费</div>
                                <div :class="{'active' : chargefont == true}" @click="handleCharge">商用</div>
                            </div>
                            <div class="content">
                                <div class="font-content" v-if="allfont">
                                    <el-scrollbar wrap-class="list" view-class="view-box" :native="true" style="height: 100%;">
                                        <div v-for="(item,i) in fontList" :key="i" class="fonts-item" @click="handleChangeFont(i)">
                                            <img :src="$store.state.port.imgBaseUrl+item.FontThumb" alt="">
                                            <span v-if="item.FontType == '0'" class="font-tips">商用</span>
                                        </div>
                                    </el-scrollbar>
                                </div>
                                <div class="font-content" v-if="freefont">
                                    <el-scrollbar wrap-class="list" view-class="view-box" :native="true" style="height: 100%;">
                                        <div v-for="(item,i) in fontList" :key="i" class="fonts-item">
                                            <img v-if="item.FontType == '1'" :src="$store.state.port.imgBaseUrl+item.FontThumb" alt="">
                                        </div>
                                    </el-scrollbar>
                                </div>
                                <div class="font-content" v-if="chargefont">
                                    <el-scrollbar wrap-class="list" view-class="view-box" :native="true" style="height: 100%;">
                                        <div v-for="(item,i) in fontList" :key="i" class="fonts-item">
                                            <img v-if="item.FontType == '0'" :src="$store.state.port.imgBaseUrl+item.FontThumb" alt="">
                                            <span v-if="item.FontType == '0'" class="font-tips">商用</span>
                                        </div>
                                    </el-scrollbar>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-upload
                        style="margin-bottom: 20px;"
                        ref="upload"
                        :action="$store.state.netServer + '/TeamFonts'"
                        :on-preview="handlePreviewFont"
                        :onSuccess="uploadFontSuccess"
                        :headers="myHeader"
                        :on-error="uploadFontError"
                        :data="Data">
                        <el-button size="small" type="primary">点击上传字体</el-button>
                    </el-upload>       
                    <input type="file" ref="font" @change="handleFontUpload">
                    <div slot="footer" class="dialog-footer">
                        <div class="sure" @click="handleAddFont">确定</div>
                        <div class="cancel" @click="dialogFontVisible = false">取消</div>
                    </div>
                </el-dialog>
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {},
            teamNum: localStorage['teamNum'],
            fileList: [],
            visible: false,
            dialogLogoVisible: false,
            dialogColorVisible: false,
            dialogFontVisible: false,
            color: '#409EFF',
            input: '',
            backgroundColor: [],   // 团队专属颜色列表
            serviceForm: {
                TypeNum: 15,
                TeamNum: localStorage['teamNum'],
                TypeCategoryNum: 15
            },
            logoList: [],    // 团队专属logo列表
            teamFontList: [],  // 团队专属字体列表
            logoUrl: '',
            fontValue: '选择平台字体',    // 字体名称
            fontList: [],     // 字体列表
            font: '',         // 字体ID
            logoUploadPercent: 0,
            logoFlag: false,
            // colorValue: ''
            allfont: true,   // 全部字体
            freefont: false,  // 免费字体
            chargefont: false,  // 商用字体
            success: false,
            show: false
        }
    },
    methods: {
        // 上传字体
        handlePreviewFont() {

        },
        uploadFontSuccess(res,file) {
            // console.log(res, file)
            if(res.status == "Success"){
                this.$message({type: 'success', message: res.Message})
                let fontImg = res.imgkey
                // console.log(fontImg, '字体图片')
                //this.teamFontList.unshift({FontThumb: fontImg})
                // console.log(this.teamFontList, '字体列表')
                this.$refs.upload.clearFiles();
                this.dialogFontVisible = false
                this.getFontList()
            }else{
                this.$message({type: 'warning', message: res.Message})
            }
        },
        uploadFontError (res, file, fileList) {
            // console.log('上传失败，请重试！', res, file)
        },
        // handleFontUpload() {
        //     var file = this.$refs.font.files[0]
        //     var formData = new FormData()
        //     formData.append('font', file);
        //     formData.append('TeamNum', this.serviceForm.TeamNum)
        //     let config = {
        //         eaders:{'Content-Type': 'multipart/form-data'}
        //     }
        //     this.$axios.post('/TeamFonts', formData, config).then(res =>{
        //         console.log(res)
        //     })
        // },

        // 字体切换
        handleAll() {
            if(!this.allfont){
                this.allfont = true
                this.freefont = false
                this.chargefont = false
            }else{
                return 
            }
        },
        handlefree() {
            if(!this.freefont){
                this.freefont = true
                this.allfont = false
                this.chargefont = false
            }else{
                return
            }
        },
        handleCharge() {
            if(!this.chargefont){
                this.chargefont = true
                this.allfont = false
                this.freefont = false
            }else{
                return
            }
        },


        beforeAvatarUpload(file) {  
            const isLt2M = file.size <  1024 * 1024 * 4;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 4MB!');
            }
            return isLt2M;
        },
        handleUpload() {
            if(!this.success) return this.$message.warning('请先上传文件')
            // var formData = new FormData()
            // formData.append('TypeNum', 15);
            // formData.append('TeamNum', this.teamNum);
            // formData.append('TypeCategoryNum', 15);
            // formData.append('IsPublic', 1);
            // formData.append('file', this.logoUrl);
            // let config = {
            //     headers:{'Content-Type': 'multipart/form-data'}
            // }
            // this.$axios.post('/TeamLogo', formData, config).then(res => {
            //     console.log(res.data)
            // })
            this.dialogLogoVisible = false
            this.logoFlag = false
            this.getLogoList()
            this.$refs.upload.clearFiles();
        },
        close() {  // 关闭弹出框之前的回调
            this.dialogLogoVisible = false
            this.$refs.upload.clearFiles();
        },
        // 删除专属LOGO
        open1(index) {
            this.$confirm('是否删除该LOGO?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var url = '/TeamLogo'
                var formData = new FormData(); 
                formData.append("TeamNum", this.logoList[index].TeamNum);
                formData.append("Id", this.logoList[index].ID);
                formData.append("MaterialNum", this.logoList[index].MaterialNum);
                formData.append("FileName", this.logoList[index].FilePath)
                this.$axios.delete(url,{data: formData}).then(res => {
                    // console.log(res)
                    if(res.data = 'success') {
                        this.$message({type: 'success',message: '删除成功!'});
                        this.logoList.splice(index,1)
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
        // 删除专属颜色
        open(index) {
            this.$confirm('是否删除该颜色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var url = '/TeamColor'
                var formData = new FormData(); 
                formData.append("TeamNum", this.serviceForm.TeamNum);
                formData.append("ID", this.backgroundColor[index].ID);
                this.$axios.delete(url,{data: formData}).then(res => {
                    // console.log(res)
                    if(res.data = 'success') {
                        this.$message({type: 'success',message: '删除成功!'});
                        this.backgroundColor.splice(index,1)
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
        handleRemove(file, fileList) {
            // console.log(file, fileList);
        },
        handlePreview(file) {
            // console.log(file);
        },
        uploadSuccess (response, file, fileList) {
            // console.log(JSON.parse(response), file)
            if(JSON.parse(response).status == 'success' || JSON.parse(response).status == 'ok'){
                this.logoUrl = JSON.parse(response).svgpath || JSON.parse(response).key
                this.logoFlag = true
                this.logoUploadPercent = 100
                this.success = true
            }
        },
        uploadError (response, file, fileList) {
            // console.log('上传失败，请重试！',file)
        },
        // 文件上传时的函数
        progress(event, file, fileList) {
            // console.log(event,file) 
            this.logoFlag = true
            this.logoUploadPercent = parseInt(file.percentage.toFixed(0))
            //this.logoUploadPercent = parseInt((event.loaded / event.total * 100).toFixed(0))
        },
        handleAdd() {
            var url = '/TeamColor'
            var formData = new FormData();
            formData.append("TeamNum", this.serviceForm.TeamNum);
            formData.append("Code", this.color);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            if(this.color == ''){
                this.$message({
                    message: '请输入颜色值'
                })
            }else{
                this.$axios.post(url,formData,config).then(res => {
                    // console.log(res)
                    if(res.data == 'AlreadyExist'){
                        alert('已存在')
                    }else if(res.data == 'Success'){
                        // this.backgroundColor.unshift({ColorCode:this.color})
                        this.getColorList()
                        this.dialogColorVisible = false
                    }
                })
            }
            // console.log(this)
        },
        // 获取专属颜色列表
        getColorList() {
            var url = '/TeamColors?TeamNum='+this.teamNum
            this.$axios.get(url).then(res => {
                this.backgroundColor = res.data
                // console.log(this.backgroundColor)
            })
        },
        // 获取专属LOGO列表
        getLogoList() {
            var url = "/TeamLogos?TeamNum=" + this.teamNum + '&IsPublic=' + 1
            this.$axios.get(url).then(res => {
                // console.log(res.data)
                this.logoList = res.data
            })
        },
        // 获取团队字体列表
        getFontList() {
            var url = '/TeamFonts?TeamNum='+ this.teamNum
            this.$axios.get(url).then(res => {
                // console.log(res.data)
                this.teamFontList = res.data
            })
        },
        // 字体
        handleOpenFont() {
            this.dialogFontVisible = true
            this.$axios.get('/Fonts').then(res => {
                // console.log(res.data)
                this.fontList = res.data
            })
        },
        handleFont() {
            this.show = !this.show
        },
        handleAddFont() {
            var formData = new FormData()
            formData.append('FontID', this.font);
            formData.append('TeamNum', this.teamNum);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamFont', formData, config).then(res => {
                // console.log(res.data)
                if(res.data == 'Success'){
                    this.$message({type: 'success', message: '添加成功'})
                    this.getFontList()
                    this.dialogFontVisible = false
                    this.fontValue = ''
                }else{
                    this.$message({type: 'error', message: '添加失败'})
                }
            })
        },
        // 添加字体(非上传)
        handleChangeFont(i) {
            this.fontValue = this.fontList[i].FontCairoName
            this.font = this.fontList[i].FontID
            this.show = false
        },
        // 删除字体
        open2(index) {
            this.$confirm('是否删除该字体?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var url = '/TeamFont'
                var formData = new FormData(); 
                formData.append("TeamNum", this.serviceForm.TeamNum);
                formData.append("FontID", this.teamFontList[index].FontID);
                this.$axios.delete(url,{data: formData}).then(res => {
                    // console.log(res)
                    if(res.data = 'success') {
                        this.$message({type: 'success',message: '删除成功!'});
                        this.teamFontList.splice(index,1)
                    }else{
                        this.$message({type: 'warning',message: '删除失败'})
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        }
    },
    computed: {
        paramsData: function() {
            let params = {
                TypeNum: this.serviceForm.TypeNum,
                TeamNum: this.serviceForm.TeamNum,
                TypeCategoryNum: this.serviceForm.TypeCategoryNum,
                IsPublic: 1
            }
            return params
        },
        Data: function() {
            let data = {
                TeamNum: this.serviceForm.TeamNum,
            }
            return data
        },
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    },
    mounted () {
        this.getColorList()
        this.getLogoList()
        this.getFontList()
    }
}
</script>

<style lang="scss" scoped>
// 
.team-vi{
    padding: 48px 32px;
    width: 100%;
    user-select: none;
    min-width: 960px;
}
.title{
    text-align: left;
    display: flex;
    line-height: 14px;
    font-size:17px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    i{
        width:5px;
        height:16px;
        margin-right: 10px;
    }
}
.logo .title i{
    background:rgba(70,192,177,1);
}
.color .title i{
    background:rgba(255,157,55,1);
}
.font .title i{
    background:rgba(254,121,143,1);
}

.logo, .color{
    margin-bottom: 40px;
}


.logo-img, .color-info, .fonts{
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    padding-top: 40px;
    padding-left: 20px;
    .logo-item{
        text-align: center;
        display: block;
        height: 158px;
        margin-right: 42px;
        margin-bottom: 31px;
        cursor: pointer;
        .upload-img{
            width: 128px;
            height: 128px;
        }
        .logo-img-wrap{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 128px;
            height: 128px;
            background: rgba(255,255,255,1);
            position: relative;
            &:hover .logo-mask{
                // display: block;
                height: 34px;
            }
            img{
                width: 102px;
                height: 102px;
                object-fit: contain;
            }
            .logo-mask{
                width: 100%;
                height:0;
                line-height: 34px;
                text-align: center;
                background:rgba(0,0,0,.3);
                font-size:16px;
                color:rgba(255,255,255,1);
                position: absolute;
                bottom: 0;
                left: 0;
                // display: none;
                transition: all .3s linear;
                overflow: hidden;
            }
        }
        .logo-name{
            display: block;
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(102,102,102,1);
            margin-top: 10px;
        }
    }
}

// 弹出框关闭按钮样式
.team-vi /deep/ .el-dialog{
    width: 630px;
    border-radius:10px;
    text-align: center;
    .el-dialog__header{
        padding: 25px 20px 0;
        font-size:23px;
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
    .dialog-footer{
        display: flex;
        margin: 0 100px;
        div{
            line-height: 48px;
            height: 48px;
            font-size: 18px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            width: 179px;
            cursor: pointer;
            text-align: center;
        }
        .sure{
            background: $color;
            border-radius: 5px;
            margin-right: 31px;
            color:rgba(254,254,254,1);
            // &:hover{
            //     background: #0893ff;
            // }
        }
        .cancel{
            border: 1px solid rgba(210,210,210,1);
            border-radius: 5px;
            color:rgba(153,153,153,1);
        }
    }
}
// 上传LOGO弹出框样式
.team-vi /deep/ .logo .el-dialog__body{
    padding: 23px 35px 45px;
    .dialog-footer{
        margin-top: 54px;
    }
}
.team-vi /deep/ .logo .el-dialog__body .upload-demo .el-upload-dragger{
    background:rgba(236,236,236,1);
    border-radius:5px;
    border: 0;
    width: 557px;
    height: 222px;
    margin-bottom: 20px;
}
.logo .el-icon-upload{
    margin: 53px auto 32px;
}
.logo .el-upload__text{
    width:246px;
    height:45px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:28px;
    margin: 0 auto;
}

// 颜色样式
.color-info{
    .color-item{
        text-align: center;
        display: block;
        height: 89px;
        line-height: 14px;
        margin-right: 49px;
        margin-bottom: 31px;
        cursor: pointer;
        position: relative;
        &:hover .colors-mask{
            // display: block;
            opacity: 1;
        }
        .colors{
            width: 61px;
            height: 61px;
            border-radius: 50%;
        }
        .colors-mask{
            width: 61px;
            height: 61px;
            border-radius: 50%;
            background:rgba(0,0,0,.3);
            color:rgba(255,255,255,1);
            text-align: center;
            line-height: 61px;
            position: absolute;
            top: 0;
            left: 0;
            // display: none;
            opacity: 0;
            transition: all .2s ease-out;
        }
        span{
            display: block;
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            margin-top: 14px;
        }
    }
}

.team-vi /deep/ .color .el-dialog .el-dialog__body .color-input{
    display: flex;
    height: 48px;
    line-height: 48px;
    .el-input__inner{
        height: 48px;
    }
    .block .el-color-picker__trigger{
        padding: 0;
        width: 48px;
        height: 48px;
        margin-left: 18px;
    }
}
.team-vi /deep/ .color .el-dialog .el-dialog__footer{
    text-align: center;
    padding: 0 20px 47px;
}


// 字体样式
.fonts .font-btn{
    height: 44px;
    cursor: pointer;
    margin-right: 43px;
}
.fonts .font-item{
    background:rgba(255,255,255,1);
    padding: 10px 25px 0 20px;
    margin-right: 43px; 
    height: 44px;
    line-height: 44px;
    cursor: pointer;
    position: relative;
    margin-bottom: 25px;
    .font-img-wrap{
        width: 100%;
        height: 100%;
        &:hover .font-mask{
            // display: block;
            opacity: 1;
        }
        .font-mask{
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.3);
            color: rgba(255,255,255,1);
            position: absolute;
            top: 0;
            left: 0;
            text-align: center;
            // display: none;
            opacity: 0;
            transition: all .3s ease-in-out;
        }
    }
}
.team-vi /deep/ .font .el-dialog__footer{
    padding: 0 0 45px;
}
.team-vi /deep/ .font .el-dialog__body{
    padding: 31px 47px 0 48px;
    
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
}


.add-font{
    height: 292px; 
    display: flex;
    position: relative;
    .font-title{
        display: flex;
        line-height: 48px;
        height: 48px;
        font-size:18px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
        .font-input{
            width: 457px;
            height:48px;
            line-height: 48px;
            border:1px solid rgba(210,210,210,1);
            border-radius:5px;
            color:rgba(153,153,153,1);
            margin-left: 33px;
            display: flex;
            justify-content: space-between;
            padding: 0 16px;
            cursor: pointer;
            img{
                height: 6px;
                margin: 21px 0;
            }
        }
    }
    .font-list{
        width: 213px;
        background: rgba(255,255,255,1);
        box-shadow:0px 1px 27px 2px rgba(176,176,176,0.5);
        position: absolute;
        top: 48px;
        left: 72px;
        z-index: 10;
        .choose-font-btn{
            display: flex;
            justify-content: space-around;
            margin-top: 14px;
            div{
                display: inline-block;
                background:rgba(255,255,255,1);
                border:1px solid rgba(220,220,220,1);
                border-radius:3px;
                font-size:12px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(51,51,51,1);
                text-align: center;
                height: 28px;
                line-height: 28px;
                padding: 0 17px;
                cursor: pointer;
            }
            .active{
                background: $color;
                color: rgba(255,255,255,1);
            }
        }
        .font-content{
            height: 200px;
            overflow: hidden;
            margin-top: 14px;
            .fonts-item{
                display: flex;
                &:hover{
                    background: #ecf5ff;
                }
                img{
                    display: block;
                    cursor: pointer;
                }
            }
        }
    }
}


.font-tips{
    border: 1px solid $color;
    border-radius: 3px;
    font-size: 12px;
    color: $color;
    height: 14px;
    line-height: 12px;
    position: relative;
    top: 0px;
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
  color: rgba(255,255,255,1);
  text-align: center;
  i{
      display: inline-block;
      position: absolute;
      top: 0;
      right: -18px;
      color: $color;
      font-weight: bold;
  }
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
