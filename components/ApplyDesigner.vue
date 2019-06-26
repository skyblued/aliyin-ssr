<template>
    <div class="apply-designer">
        <div class="apply-header">
            <img src="/img/home/apply_designer.png" alt="">
        </div>
        <div class="apply-body">
            <div class="apply-step">
                <div class="step-line"></div>
                <div class="steps">
                    <div class="step active">1</div>
                    <div :class="{'step': true, 'active' : step2 == true || step3}">2</div>
                    <div :class="{'step': true, 'active' : step3}">3</div>
                </div>
            </div>
            <div v-if="step1">
                <div class="apply-input">
                    <el-form :model="form" label-width="80px">
                        <el-form-item label="真实姓名: ">
                            <el-input v-model="form.name" @blur="input" placeholder="请输入真实姓名" @focus="nameerror = ''"></el-input>
                            <span class="error-tips">{{nameerror}}</span>
                        </el-form-item>
                        <el-form-item label="兼职意向: ">
                            <el-select v-model="intention" placeholder="请选择" @change="handleChange" @focus="handleFocus('intention')" style="width: 458px;">
                                <el-option value="请选择"></el-option>
                                <el-option :value="i" v-for="(item,i) in intentionList" :key="i" :label="item.ClassName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="QQ号: ">
                            <el-input v-model="form.qq" @blur="inputqq" placeholder="QQ号" @focus="handleFocus('qq')"></el-input>
                            <span class="error-tips">{{qqerror}}</span>
                        </el-form-item>
                        <el-form-item label="联系邮箱: ">
                            <el-input type="email" v-model="form.email" @blur="inputemail" @focus="handleFocus('email')" placeholder="请正确填写，审核通过会收到邮件通知"></el-input>
                            <span class="error-tips">{{emailerror}}</span>
                        </el-form-item>
                        <el-form-item label="手机号: ">
                            <el-input v-model="phone" @blur="inputPhone" placeholder="手机号" @focus="handleFocus('phone')"></el-input>  
                            <span class="error-tips">{{error}}</span>
                        </el-form-item>
                    </el-form>
                </div>
                <el-button class="step-btn" :style="{background: backgroundColor}" :disabled="show" @click="handleClick">下一步</el-button>
            </div>
            <div v-if="step2" class="step2">
                <div class="tips">
                    上传 3 张不同风格的代表作品（非源文件），让审核通过概率更高
                </div>
                <div class="pic-to-upload">
                    <div class="pic-item">
                        <el-upload
                            :action="$store.state.port.netServer + '/UploadToOSS'"
                            list-type="picture-card"
                            :onSuccess="uploadSuccess"
                            :onError="uploadError"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed"
                            accept="image/*"
                            :limit="3"
                            :headers="myHeader">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" top="10vh">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </div>
                <div class="rules">
                    <p>1、请上传完整的jpg、jpeg或png格式的原创作品,（PPT作品请将每张幻灯片导出为图片，合并成一张大图上传）。</p>
                    <p>2、务必提交与“兼职意向”相关的作品。如：社交媒体（微信公众号首图，手机海报、营销长图、朋友圈邀请函、公众号封面小图）等；广告印刷（印刷海报、名片、邀请函、易拉宝、展架）等；办公文档（PPT）。</p>
                    <p>3、单个上传作品大小控制在100MB之内。</p>
                </div>
                <el-button class="step-btn" :disabled="disabled" :style="{background: backgroundColor}" @click="handleUpload"><span>上传</span></el-button>
            </div>
            <div v-if="step3" class="step3">
                <img src="/img/home/apply_success.png" alt="">
                <p>申请提交成功，请耐心等待3-5个工作日</p>
                <!-- <el-button class="step-btn" :disabled="disabled" :style="{background: backgroundColor}" @click="handleToDesign">开启设计</el-button> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                name: '',
                intention: '',
                qq: '',
                email: '',
                phone: ''
            },
            disabled: true,
            backgroundColor: 'rgba(216,216,216,1)',
            step1: true,
            step2: false,
            step3: false,
            dialogImageUrl: '',
            dialogVisible: false,
            nameerror: '',
            qqerror: '',
            emailerror: '',
            error: '',
            intention: null,
            phone: null,
            fileList: [],   // 上传的文件列表 
            intentionList: [],
            skill: '',     // 兼职意向
        }
    },
    props: ['state'],
    methods: {
        input() {
            if(!/^[\u4E00-\u9FA5A-Za-z]+$/.test(this.form.name)) {
                this.nameerror = '请输入正确的中文姓名'
                return
            }else{
                this.nameerror = ''
            }
        },
        handleFocus(msg) {
            // if(!this.form.name) return this.$message({type:'warning', message: '请先填写姓名'})
            if(msg == 'intention'){
                this.getIntention()
            }else if(msg == 'qq'){
                this.qqerror = ''
            }else if(msg == 'email'){
                this.emailerror = ''
            }else{
                this.error = ''
            }
        },
        handleChange(val) {
            if(this.intention == '请选择') {
                this.$message.error('请选择兼职意向!')
                this.backgroundColor = 'rgba(216,216,216,1)'
                return
            }else{
                //this.backgroundColor = 'rgba(0,131,233,1)'
            }
            this.skill = this.intentionList[val].ClassNum
            // console.log(this.skill)
        },
        // 获取兼职意向列表
        getIntention() {
            this.$axios.get('/ProductCategories').then(res => {
                //console.log(res.data)
                this.intentionList = res.data
                console.log(this.intentionList)
            })
        },
        inputqq() {
            if(!/^[1-9][0-9]{4,9}$/gim.test(this.form.qq)) {
                this.qqerror = '请输入正确的qq号'
                return
            }else{
                this.qqerror = ''
            }
        },
        inputemail() {
            if(!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.([A-Za-z0-9]{2,4})+$/.test(this.form.email)){
                this.emailerror = '请输入正确的邮箱格式'
                return
            }else{
                this.emailerror = ''
            }
        },
        inputPhone() {
            if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)) {
                this.error = '请输入符合要求的号码'
                return
            }else{
                this.error = ''
            }
        },

        handleClick() {
            this.step1 = false
            this.step2 = true
            this.backgroundColor = 'rgba(216,216,216,1)'
            this.disabled = true
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        uploadSuccess (response, file, fileList) {
            console.log('上传文件', response)
            this.fileList.push({work: response.key})
            console.log(this.fileList)
            if(this.fileList.length >= 3){
                this.disabled = false
                this.backgroundColor = 'rgba(0,131,233,1)'
            } 
        },
        handleExceed(files, fileList) {  // 上传文件超出个数限制时的函数
            console.log(files, fileList)
            this.$message.warning('上传文件超出限制')
        },
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！',response)
        },
        handleUpload() {  // 申请设计师
            var formData = new FormData()
            formData.append('TrueName', this.form.name);
            formData.append('QQ', this.form.qq);
            formData.append('Tel', this.phone);
            formData.append('Email', this.form.email);
            formData.append('Skilled', this.skill);
            formData.append('Works_1', this.fileList[0].work);
            formData.append('Works_2', this.fileList[1].work);
            formData.append('Works_3', this.fileList[2].work);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/ApplyDesigner', formData, config).then(res => {
                console.log(res)
                if(res.data.State == 'Success'){
                    this.$message({type: 'success', message: res.data.Message})
                    this.step1 = false
                    this.step2 = false
                    this.step3 = true
                    //this.disabled = false
                    //this.backgroundColor = 'rgba(0,131,233,1)'
                }else{
                    this.$message({type: 'warning', message: res.data.Message})
                }
            })
        },
        handleToDesign() {
            this.$router.push('/designcenter')
        }
    },
    created() {
        console.log(this.state)
        if(this.state == 'no') {
            this.step3 = true
            this.step1 = false
        }
    },
    mounted() {
        //this.getIntention()
        if(localStorage['isDesigner'] == '1'){
            this.disabled = false
            this.backgroundColor = 'rgba(0,131,233,1)'
        }
    },
    watch: {
        // 验证手机号
        phone() {
            if(/(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.phone)) { 
                this.form.phone = -1
            }else{
                this.form.phone = 1
            }
        },
        // 验证是否选择兼职意向
        intention() {
            if(this.intention == '请选择'){
                this.form.intention = 1
            }else{
                this.form.intention = -1
            }
        },
        state() {
            console.log(this.state,'dsf ')
        }
    },
    computed: {
        show() {
            if(this.form.phone == -1 && this.form.intention == -1 && this.form.name && this.form.qq && this.form.email) {
                console.log(123)
                this.backgroundColor = 'rgba(0,131,233,1)'
                return false
            }else{
                console.log(456)
                this.backgroundColor = 'rgba(216,216,216,1)'
                return true
            }
        },
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.apply-header{
	height: 210px;
	img {
		width: 100%;
	}
}
.apply-body{
    width: 538px;
    margin: 0 auto;
    text-align: center;
    .apply-step{
        margin: 26px 0 44px;
        height: 36px;
        line-height: 28px;
        position: relative;
        .step-line{
            width: 100%;
            height: 2px;
            background:rgba(229,229,229,1);
            border-radius: 1px;
            position: absolute;
            top: 17px;
        }
        .steps{
            display: flex;
            justify-content: space-between;
            width: 362px;
            position: absolute;
            left: 88px;
            .step{
                background: rgba(220,220,220,1);
                border: 4px solid rgba(255,255,255,1);
                border-radius: 50%;
                font-family: MicrosoftYaHei-Bold;
                font-weight: bold;
                color:rgba(255,255,255,1);
                width: 36px;
                height: 36px;
                text-align: center;
            }
            .active{
                background: rgba(0,131,233,1);
            }
        }
    }
    .apply-input{
        font-family:MicrosoftYaHei;
        font-weight:400;
        .el-form-item{ 
            margin-bottom: 25px;
            .error-tips{
                line-height: 14px;
                position: absolute;
                top: 45px;
                left: 0;
                color: red;
            }
        }
    }
    .step-btn{
        border-radius: 5px;
        width:179px;
        height:48px;
        line-height: 48px;
        color:rgba(254,254,254,1);
        margin: 50px auto 65px;
    }
    .step2{
        font-size:14px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        .tips{
            color:rgba(153,153,153,1);
        }
        .pic-to-upload{
            margin: 36px 0 40px;
            .pic-item{
                height: 98px;
            }
        }
        .rules{
            color:rgba(102,102,102,1);
            line-height: 24px;
            text-align: left;
        }
    }
    .step3{
        font-size:16px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
        padding-bottom: 50px;
    }

}
.apply-designer /deep/ .el-upload--picture-card{
    border: 0;
    background: rgba(236,236,236,1);
    width:98px;
    height: 98px;
    line-height: 98px;
    border-radius: 0;
    .el-icon-plus{
        background-image: url(/img/home/add_big_icon.png);
        width: 43px;
        height: 43px;
        margin-top: 27px;
    }
    .el-icon-plus::before{
        content: '';
    }
}
.apply-designer /deep/ .el-upload-list .el-upload-list__item{
    width: 98px;
    height: 98px;
    line-height: 98px;
    border-radius: 0;
}
.apply-designer /deep/ .el-icon-upload-success{
    position: absolute;
    top: 0;
    right: 15px;
}


.apply-designer /deep/ .el-input__inner{
    height: 42px;
    line-height: 42px;
    background:rgba(244,244,244,1);
    border-radius: 3px;
    border: none;
    color:rgba(153,153,153,1);
}
.apply-designer /deep/ .el-form-item__label{
    font-size: 14px;
    color:rgba(153,153,153,1);
    line-height: 42px;
    text-align: left;
}
.apply-designer /deep/ .el-input__suffix-inner i::before{
    content: '';
}
.apply-designer /deep/ .el-input__suffix-inner i::after{
    background-image: url(/img/home/drop_down.png);
    width: 11px;
    height: 6px;
    vertical-align: 0;
}
.apply-designer /deep/ .el-input__suffix-inner i{
    transform: rotateZ(0deg);
}

.apply-designer /deep/ .el-button{
    padding: 0;
    border: none;
    &:hover{
        color:rgba(254,254,254,1);
    }
}
</style>
