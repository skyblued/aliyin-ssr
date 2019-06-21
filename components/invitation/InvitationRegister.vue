<template>
    <div class="invitation-register">
        <el-form :model="form" class="form">
            <el-form-item>
                <el-input type="text" @blur="detection" v-model="phone" placeholder="请输入手机号码"></el-input>
                <span style="color: red">{{error}}</span>
            </el-form-item>
            <el-form-item class="form-item">
                <div class="phone-code">
                    <el-input class="input" v-model="code" @blur="inputCode" placeholder="输入图形验证码"></el-input>
                    <img class="identifying-img" :src="codeImg" @click="updataCode" alt="">
                </div>
                <span style="color: red">{{picCode}}</span>
            </el-form-item>
            <el-form-item>
                <div class="phone-code">
                    <el-input class="phone-input" v-model="phoneCode" @input="registerCode" placeholder="请输入短信验证码"></el-input>
                    <el-button type="text" class="getCode" v-show="sendCode" @click="getCode" :disabled="show" :style="{background: backgroundColor1,color: color}">获取验证码</el-button>
                    <el-button class="getCode" v-show="!sendCode" disabled>{{authTime}}s之后重新发送</el-button>
                </div>
            </el-form-item>
            <el-form-item>
                <el-input type="password" v-model="password" placeholder="设置新密码" @blur="confirm"></el-input>
                <span style="color: red">{{confirmerr}}</span>
            </el-form-item>
        </el-form>
        <div class="register-line">
            <p>
                <span>已有账号，去<span style="color: #0083E9;cursor: pointer;" @click="handleToLogin">登录</span></span>
            </p>
        </div>
        <el-button class="register-btn" :disabled="disabled" :style="{background: backgroundColor}" @click="submitRegister">提交注册</el-button>
        <div class="register-tips">
            <img :src="image" alt="">
            <p>我已阅读并同意<span style="color: #0083E9;cursor: pointer;">用户协议</span>和<span style="color: #0083E9;cursor: pointer;">隐私政策</span></p>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
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
            color: 'rgba(210,210,210,1)',
            backgroundColor: 'rgba(210,210,210,1)',
            error: '',  // 手机号错误提示信息
            picCode: '',  // 图形验证码错误提示信息
            confirmerr: '',  // 密码格式错误提示信息
            disabled: true,
            image: '/img/rectangle_icon.png',   // 对号
        }
    },
    created () {
        this.codeImg = 'https://open.aliyin.com/ValidateCode.aspx?flage='
    },
    methods: {
        handleToLogin() {  // 跳转到登录
            this.$router.push('/invitationlogin')
        },
        updataCode() {   // 刷新图形验证码
            this.flage = Math.ceil(Math.random()*10)
            // console.log(this.flage)
            this.codeImg = 'https://open.aliyin.com/ValidateCode.aspx?flage='+this.flage
        },
        // 失去焦点验证手机号
        detection() {
            if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },
        // 失去焦点验证验证码
        inputCode() {  
            if(!this.code) return
            var url = '/VerificationCode?flage='+this.flage+'&code='+this.code;
            this.$axios.get(url).then(res => {
                // console.log(res)
                if(res.data == true) {
                    this.passing = true
                    this.picCode = ''
                }else{
                    //this.picCode = '后台返回'+res.data
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

                }
            })
        },
        confirm() {   // 验证密码格式
            if(!/^[0-9A-Za-z]{6,20}$/.test(this.password)){
                this.confirmerr = '密码为6-16位数字或字母组成'
            }else{
                this.disabled = false
                this.backgroundColor = 'rgba(0,131,233,1)'
                this.confirmerr = ''
                this.image = '/img/rectangle_icon_hl.png'
            }
        },
        // 提交注册
        submitRegister() {
            if(this.form.Type=2) {
                var url = '/Register';
                var formData = new FormData();
                formData.append('Type', this.form.Type)
                formData.append('mobile', this.phone);
                formData.append('password', this.form.password);
                formData.append('UserName', this.phone)
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post(url,formData,config).then(res => {
                    console.log(res.data)
                    if(res.data == 'AlreadyExistPhone') {
                        this.$message('该手机号已注册')
                        return
                    }
                    if(JSON.parse(res.data).State == 'Success') {
                        this.$message('注册成功')
                        let data = JSON.parse(res.data)
                        let name = data.UserName || data.NickName || data.Phone
                        sessionStorage.setItem('token', data.Token)
                        sessionStorage.setItem('userName', name)
                        this.$store.commit('setToken', data.Token)
                        this.$store.commit('setUserName', name)
                        this.$store.commit('setDialogReg', false)
                    }
                })
            }
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
            if(/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)) { 
                this.form.usernameormobile = -1
                // 验证手机号是否存在
                this.$axios.get('/ForgetPassword?mobile='+this.phone).then(res => {
                    // console.log(res.data)
                    if(res.data == 'No'){
                        return
                    }else{
                        this.$message('该手机号已注册，请登陆或找回密码')
                    }
                })
                // this.detectionPhone()
            }else{
                this.form.usernameormobile = 1
            }
        },
        code() {
            this.inputCode()
        },
        password() {
            this.confirm()
        }
    },
}
</script>

<style lang="scss" scoped>
.el-form-item span{
    height: 14px;
    line-height: 14px;
    position: absolute;
    top: 52px;
    left: 0;
}
.invitation-register{
    width: 356px;
    margin: 0 auto;
    .phone-code{
        display: flex;
        justify-content: space-between;
        .input, .phone-input{
            width: 244px;
        }
        .getCode{
            padding: 0 14px;
        }
        img{
            width: 97px;
            height: 48px;
            margin-left: 14px;
            cursor: pointer;
        }
    }
    .register-line{
        text-align: right;
        font-size:14px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:26px;
        margin-top: -12px;
    }
    .register-btn{
        width: 100%;
        height: 48px;
        line-height: 15px;
        text-align: center;
        font-size: 14px;
        color: rgba(255,255,255,1);
        border-radius:5px;
        margin-top: 30px;
        &:hover{
            color: rgba(255,255,255,1);
        }
    }
    .register-tips{
        display: flex;
        width: 265px;
        font-size:14px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:16px;
        margin: 20px auto 0;
        img{
            width: 16px;
            height: 16px;
            vertical-align: middle;
        }
    }
}
</style>
