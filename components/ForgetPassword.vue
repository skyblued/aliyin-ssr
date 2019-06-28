<template>
    <div class="logreg-wrapper">
        <div class="retrieve-page-hole">
            <div class="retrieve-page">
                <div class="retrieve-tab">忘记密码</div>
                <div class="tel-retrieve">
                    <el-form :model="form" class="form">
                        <el-form-item>
                            <el-input type="text" @blur="detection" @focus="error = ''" v-model="phone" placeholder="输入手机号"></el-input>
                            <span class="error-tips">{{error}}</span>
                        </el-form-item>
                        <el-form-item class="form-item">
                            <div class="phone-code">
                                <el-input class="input" v-model="code" placeholder="输入图形验证码" style="margin-right: 5px;"></el-input>
                                <img class="identifying-img" :src="codeImg" @click="updataCode" alt="">
                            </div>
                            <span class="error-tips">{{picCode}}</span>
                        </el-form-item>
                        <el-form-item>
                            <div class="phone-code">
                                <el-input class="phone-input" v-model="phoneCode" @input="registerCode" placeholder="请输入短信验证码" style="width: 265px;"></el-input>
                                <el-button type="text" class="getCode" v-show="sendCode" @click="getCode" :disabled="show">获取验证码</el-button>
                                <el-button class="getCode" v-show="!sendCode" disabled>{{authTime}}s之后重新发送</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input type="password" v-model="password" placeholder="设置新密码" @blur="confirm"></el-input>
                            <span class="error-tips">{{confirmerr}}</span>
                        </el-form-item>
                        <div class="retrieve-line">
                            <p>
                                <span>已有账号，去<span style="color: #745bff;cursor: pointer;" @click="setDialogType('wxpage')">登录</span></span>
                            </p>
                            <p>
                                <span>没有账号，去<span style="color: #745bff;cursor: pointer;" @click="setDialogType('register')">注册</span></span>
                            </p>
                        </div>
                        <el-button type="text" class="reset-btn" :disabled="disabled" :style="{background: backgroundColor}"  @click="handleReset">修改密码</el-button>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {    
            form: {
                usernameormobile: '',
                Type: ''
            },
            codeImg: '',
            flage: '',
            code: '',
            phoneCode: '',
            sendCode: true,
            authTime: 0,
            passing: false,
            backgroundColor1: '#cdcdcd',
            // color: 'rgba(210,210,210,1)',
            backgroundColor: 'rgba(210,210,210,1)',
            disabled: true,
            error: '',
            pwderr: '',
            picCode: '',
            err: '',
            confirmerr: '',
            phone: null,
            password: null, 
            img: '/img/home/Qrcode_icon.png',
        }
    },
    created () {
        this.codeImg = this.$store.state.port.qqServer +  '/ValidateCode.aspx?flage='
    },
    methods: {
        setDialogType(type) {
            this.$store.commit('login/toggleSign', type)
        },
        // 失去焦点验证手机号
        detection() {
            if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },
        updataCode() {
            this.flage = Math.ceil(Math.random()*10)
            // console.log(this.flage)
            this.codeImg = this.$store.state.port.qqServer +  '/ValidateCode.aspx?flage='+this.flage
        },
        // 失去焦点验证验证码
        inputCode() {  
            var url = '/VerificationCode?flage='+this.flage+'&code='+this.code;
            this.$axios.get(url).then(res => {
                console.log(res)
                if(res.data == true) {
                    this.passing = true
                    this.picCode = ''
                }else{
                    this.$message.warning('验证码错误')
                    this.code = ''
                    this.passing = false
                }
            })
        },
        // 获取手机验证码
        getCode() {
            if(this.passing && this.form.usernameormobile == -1){
                this.sendCode = false
                this.authTime = 60
                var timer = setInterval(() => {
                    this.authTime--;
                    if(this.authTime <= 0) {
                        this.sendCode = true
                        clearInterval(timer)
                    }
                },1000)
                var url = '/VerificationCodeMobile'
                var formData = new FormData();
                formData.append('Mobile', this.phone);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post(url,formData,config).then(res => {
                    // console.log(res)
                })
            }else{
                alert('验证未通过')
            }
            
        },
        // 验证手机验证码
        registerCode() {
            var url = '/VerificationCodeMobile';
            var formData = new FormData();
            formData.append('Mobile', this.phone);
            formData.append('code', this.phoneCode);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.put(url,formData,config).then(res => {
                // console.log(res)
                if(res.data == 'Success') {
                    //this.retrievenext = true
                }
            })
        },
        confirm() {
            this.disabled = false
            this.backgroundColor = '#745bff'
            this.confirmerr = ''
        },
        // 修改密码
        handleReset() {
            if(this.password && this.form.usernameormobile == -1){
                var formData = new FormData();
                formData.append('mobile', this.phone);
                formData.append('code', this.phoneCode);
                formData.append('pwd', this.password)
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/ForgetPassword', formData, config).then(res => {
                    console.log(res.data)
                    if(res.data.State == 'Success'){
                        this.$message({type: 'success',message: '修改成功'})
                        //this.resetsuccess = true
                        this.$store.commit('setDialogType', 'login')
                    }else{
                        this.$message({type: 'error',message: '修改失败'})
                    }
                })
            }   
        },
    },
    computed: {
        show() {
            if(this.passing && this.form.usernameormobile == -1){
                // this.backgroundColor1 = 'rgba(0,131,233,1)'
                // this.color = '#fff'
                return false
            }else{
                // this.backgroundColor1 = ''
                // this.color = 'rgba(210,210,210,1)'
                return true
            }
        }
    },
    watch: {
        // 验证手机号
        phone() {
            if(/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)) { 
                this.form.usernameormobile = -1
                // 验证手机号是否存在
                this.$axios.get('/ForgetPassword?mobile='+this.phone).then(res => {
                    // console.log(res.data)
                    if(res.data == 'No'){
                        this.error = "该手机号不存在，请重新输入"
                        return
                    }
                })
                // this.detectionPhone()
            }else{
                this.form.usernameormobile = 1
            }
        },
        code() {
            if(this.code.length != 4 || !this.code){
                this.passing = false
                return
            }   
            this.inputCode()
        },
        password() {
            this.confirm()
        }
    },
}
</script>

<style lang="scss" scoped>

.logreg-wrapper{
    width: 100%;
    margin: 0 auto;
    box-shadow: 0 0 2px 0 rgba(0,0,0,.12);
    text-align: center;
}
.logreg-wrapper /deep/ .el-form .el-form-item{
    width: 356px;
    .error-tips{
        color: red;
        font-size: 12px;
        line-height: 12px;
        display: block;
        position: absolute;
        top: 48px;
    }
}
.logreg-wrapper /deep/ .el-form .el-form-item .el-form-item__content .el-input .el-input__inner{
    width:356px;
    height:48px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(210,210,210,1);
    border-radius:5px;
}
.logreg-wrapper /deep/ .el-form .el-form-item .el-form-item__content .input .el-input__inner{
    width: 244px;
    height: 48px;
}
.logreg-wrapper /deep/ .el-form .el-form-item .el-form-item__content .phone-input .el-input__inner{
    width: 204px;
}
.logreg-wrapper /deep/ .el-form .el-form-item .el-form-item__content .el-input{
    width: 244px;
}
.logreg-wrapper /deep/ .reset-btn{
    width: 356px;
    height: 48px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    border-radius:5px;
    padding: 0;
    &:hover{
        color: #fff;
    }
}
.logreg-wrapper /deep/ .log-in-button span{
    width:71px;
    height:18px;
    line-height: 18px;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(254,254,254,1);
}
.logreg-wrapper /deep/ .getCode{
    width:144px;
    height:48px;
    border:1px solid $color;
    border-radius:5px;
    margin-left: 8px;
    color: $color;
    &:hover{
        color: $color;
        border:1px solid $color;
    }
}


// 找回密码样式
.retrieve-page-hole{
    height: 100%;
    width: 100%;
}
.retrieve-page{
    width: 356px;
    height: 404px;
    margin: auto;
    text-align: left;
}
.tel-retrieve .retrieve-line{
    width: 100%;
    height: 16px;
    margin-top: 20px;
    margin-bottom: 39px;
    display: flex;
    justify-content: space-between;
}
.tel-retrieve .retrieve-line p{
    display: inline-block;
    width:120px;
    height:16px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.retrieve-tab{
    width:92px;
    height:22px;
    line-height: 22px;
    font-size:22px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin: 0 auto 26px;
}
.phone-code{
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
}
.identifying-img{
    display: inline-block;
    width: 97px;
}

.logreg-wrapper /deep/ .phone-code .el-input{
    height: 48px;
    line-height: 48px;
}
</style>
