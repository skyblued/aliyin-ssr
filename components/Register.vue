<template>
    <div class="logreg-wrapper">
        <div class="sign-up-page">
            <div class="tel-sign-up-page">
                <div class="tab">注册账号</div>
                <div class="sign-up" v-if="signup">
                    <el-form :model="form" class="form">
                        <el-form-item>
                            <el-input type="text" @blur="detection" @focus="error = ''" v-model="phone" placeholder="输入手机号"></el-input>
                            <span class="error-tips">{{error}}</span>
                        </el-form-item>
                        <el-form-item class="form-item">
                            <div class="phone-code">
                                <el-input class="input" v-model="code" placeholder="输入图形验证码"></el-input>
                                <img class="identifying-img" :src="codeImg" @click="updataCode" alt="">
                            </div>
                            <span class="error-tips">{{picCode}}</span>
                        </el-form-item>
                        <el-form-item>
                            <div class="phone-code">
                                <el-input class="phone-input" v-model="phoneCode" @input="registerCode" placeholder="请输入短信验证码"></el-input>
                                <el-button type="text" class="getCode" v-show="sendCode" @click="getCode" :disabled="show" >获取验证码</el-button>
                                <el-button class="getCode" v-show="!sendCode" disabled>{{authTime}}s之后重新发送</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input type="password" v-model="password" placeholder="设置新密码" @blur="confirm"></el-input>
                            <span class="error-tips">{{confirmerr}}</span>
                        </el-form-item>
                    </el-form>
                    <div class="register-line">
                        <p>
                            <span>已有账号，去<span style="color: #745bff;cursor: pointer;" @click="handleToLogin">登录</span></span>
                        </p>
                    </div>
                    <el-button type="text" class="submit-btn" :disabled="disabled" :style="{background: backgroundColor}" @click="submitRegister">提交注册</el-button>
                    <div class="register-tips">
                        <img src="/img/personal/choose_icon.png" alt="">
                        <p>我已阅读并同意<span style="color: #745bff;cursor: pointer;">用户协议</span>和<span style="color: #745bff;cursor: pointer;">隐私政策</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            signup: true,
            img: '/img/home/Qrcode_icon.png',
            form: {
                usernameormobile: ''
            },
            codeImg: '', // 图形验证码 图片
            flage: '',   // 获取图形验证码随机数 
            code: '',    // 输入的图形验证码
            phoneCode: '',  // 输入的短信验证码
            sendCode: true, 
            authTime: 0,
            passing: false,  // 判断图形验证码是否验证成功
            phone: null,     // 输入的手机号
            password: null,  // 输入的密码
            backgroundColor1: '#cdcdcd',
            // color: 'rgba(210,210,210,1)',
            backgroundColor: 'rgba(210,210,210,1)',
            error: '',  // 手机号错误提示信息
            picCode: '',  // 图形验证码错误提示信息
            confirmerr: '',  // 密码格式错误提示信息
            disabled: true,
            // image: '/img/home/rectangle_icon.png',
            register: false,
            next: false
        }
    },
    created () {
        this.codeImg = this.$store.state.port.qqServer +  '/ValidateCode.aspx?flage='
    },
    methods: {


        handleToLogin() {  // 跳转到登录
            this.$store.commit('login/toggleSign', 'wxpage')
        },
        updataCode() {
            this.flage = new Date().getTime() + Math.ceil(Math.random()*10)
            // console.log(this.flage)
            this.codeImg = this.$store.state.port.qqServer +  '/ValidateCode.aspx?flage='+this.flage
        },
        // 失去焦点验证手机号
        detection() {
            if(!/^1[3-9][0-9]\d{8}$/.test(this.phone)) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
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
                    this.next = true
                    //this.retrievenext = true
                }
            })
        },
        confirm() {   // 验证密码格式
            if(!this.next) return 
            if(!/^[0-9A-Za-z]{6,20}$/.test(this.password)){
                this.confirmerr = '密码为6-16位数字或字母组成'
            }else{
                this.disabled = false
                this.backgroundColor = '#745bff'
                this.confirmerr = ''
                // this.image = '/img/rectangle_icon_hl.png'
            }
        },
        // 提交注册
        submitRegister() {
            if(this.form.Type=2) {
                var url = '/Register';
                let source = localStorage['source'] || ''
                var formData = new FormData();
                formData.append('Type', this.form.Type)
                formData.append('mobile', this.phone);
                formData.append('password', this.password);
                formData.append('UserName', this.phone);
                formData.append('RegistSource', source)
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                if(this.register) return 
                this.register = true
                this.$axios.post(url,formData,config).then(res => {
                    console.log(res.data)
                    if(res.data == 'AlreadyExistPhone') {
                        this.$message('该手机号已注册')
                        return
                    }
                    if(JSON.parse(res.data).State == 'Success') {
                        let data = JSON.parse(res.data)
                        this.getTeamInfo(data.Token).then(() => {
                            let name = data.NiceName || data.UserName || data.Phone || ''
                            localStorage.setItem('token', data.Token)
                            localStorage.setItem('userName', name)
                            localStorage.setItem('isDesigner', data.IsDesigner)
                            localStorage.setItem('avatar', data.headImage)
                            localStorage.setItem('phone', data.bindPhone || '')
                            localStorage.setItem('loginType', data.loginType)
                            localStorage.setItem('isBindWx', '')
                            localStorage.setItem('isBindQQ', data.bindqq)
                            localStorage.setItem('userType', data.UserType)
                            localStorage.setItem('times', data.LoginTimes)
                            this.$store.commit('setToken', data.Token)
                            this.$store.commit('setUserName', name)
                            this.$store.commit('setDialogType', '')
                            this.$message.success('注册成功')
                            this.register = false
                            history.go(0)
                        })
                    }else{
                        this.$message.error('注册失败')
                        return
                    }
                })
            }
        },
        getTeamInfo(msg) {
            return new Promise((open,err) => {
                let config = {
                    headers: {
                        token: msg,
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.post('/TeamInfos', {}, config).then(response => {
                    console.log(response.data)
                    localStorage.setItem('teamNum', response.data[0].Num)
                    localStorage.setItem('teamName', response.data[0].TeamName)
                    open(true)
                })
            })
        }
    },
    computed: {
        show() {
            if(this.passing && this.form.usernameormobile == -1){
                this.backgroundColor1 = 'rgba(0,131,233,1)'
                this.color = '#fff'
                return false
            }else{
                this.backgroundColor1 = ''
                this.color = 'rgba(210,210,210,1)'
                return true
            }
        }
    },
    watch: {
        // 验证手机号
        phone() {
            if(/^1[3-9][0-9]\d{8}$/.test(this.phone)) { 
                this.form.usernameormobile = -1
                // 验证手机号是否存在
                this.$axios.get('/ForgetPassword?mobile='+this.phone).then(res => {
                    // console.log(res.data)
                    if(res.data == 'No'){
                        return
                    }else{
                        this.$message('该手机号已注册，请登陆或找回密码')
                        // this.phone = ''
                    }
                })
                // this.detectionPhone()
            }else{
                this.form.usernameormobile = 1
            }
        },
        code() {
            if(this.code.length != 4 || !this.code) {
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
    position: relative;
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
.logreg-wrapper /deep/ .submit-btn{
    width: 356px;
    height: 48px;
    line-height: 15px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    border-radius:5px;
    padding: 0;
    &:hover{
        color: #fff;
    }
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



// 注册样式
.sign-up-page{
    width: 356px;
    height: 404px;
    margin: auto;
    text-align: left;
}
.tab{
    width:93px;
    height:23px;
    font-size:22px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin: 0 auto 25px;
}
.sign-up .register-line{
    width:120px;
    height:16px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:16px;
    margin: 20px 0 39px 237px;
}
.sign-up .register-tips{
    margin: 10px auto 0;
    height: 16px;
    line-height: 16px;
    width: 265px;
}
.sign-up .register-tips img{
    display: inline-block;
    width:16px;
    height:16px;
    vertical-align: top;
}
.sign-up .register-tips p{
    display: inline-block;
    width:240px;
    height:14px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    // margin-left: 9px;
}
.phone-code{
    width: 100%;
    display: flex;
    justify-content: space-around;
    position: relative;
}
.identifying-img{
    display: inline-block;
    width: 97px;
    height: 48px;
    margin-left: 14px;
}

</style>
