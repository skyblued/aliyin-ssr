<template>
    <div class="invitation-forget">
        <el-form :model="form" class="form">
            <el-form-item>
                <el-input type="text" @blur="detection" v-model="phone" placeholder="请输入手机号码"></el-input>
                <span style="color: red">{{error}}</span>
            </el-form-item>
            <el-form-item class="form-item">
                <div class="phone-code">
                    <el-input class="input" v-model="code" @blur="inputCode" placeholder="输入图形验证码" style="width: 315px;margin-right: 5px;"></el-input>
                    <img class="identifying-img" :src="codeImg" @click="updataCode" alt="">
                </div>
                <span style="color: red">{{picCode}}</span>
            </el-form-item>
            <el-form-item>
                <div class="phone-code">
                    <el-input class="phone-input" v-model="phoneCode" @input="registerCode" placeholder="请输入短信验证码" style="width: 265px;"></el-input>
                    <el-button type="text" class="getCode" v-show="sendCode" @click="getCode" :disabled="show" :style="{background: backgroundColor1,color: color}">获取验证码</el-button>
                    <el-button class="getCode" v-show="!sendCode" disabled>{{authTime}}s之后重新发送</el-button>
                </div>
            </el-form-item>
            <el-form-item>
                <el-input type="password" v-model="password" placeholder="设置新密码" @blur="confirm"></el-input>
                <span style="color: red">{{confirmerr}}</span>
            </el-form-item>
        </el-form>
        <div class="retrieve-line">
            <p>
                <span>已有账号，去<span style="color: #0083E9;cursor: pointer;" @click="handleToLogin">登录</span></span>
            </p>
            <p>
                <span>没有账号，去<span style="color: #0083E9;cursor: pointer;" @click="handleToReg">注册</span></span>
            </p>
        </div>
        <el-button class="retrieve-btn" :disabled="disabled" :style="{background: backgroundColor}"  @click="handleReset">修改密码</el-button>
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
            color: 'rgba(210,210,210,1)',
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
        this.codeImg = 'https://open.aliyin.com/ValidateCode.aspx?flage='
    },
    methods: {
        handleToLogin() {  // 跳转到登录
            this.$router.push('/invitationlogin')
        },
        handleToReg() {  // 跳转到注册
            this.$router.push('/invitationregister')
        },
        // 失去焦点验证手机号
        detection() {
            if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },
        updataCode() {  // 刷新图形验证码
            this.flage = Math.ceil(Math.random()*10)
            // console.log(this.flage)
            this.codeImg = 'https://open.aliyin.com/ValidateCode.aspx?flage='+this.flage
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
                    //this.retrievenext = true
                }
            })
        },
        confirm() {
            this.disabled = false
            this.backgroundColor = 'rgba(0,131,233,1)'
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
                        this.$store.commit('setDialogForget', false)
                        this.$store.commit('setDialog', true)
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
                    //console.log(res.data)
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
.invitation-forget{
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
            margin-left: 8px;
        }
        img{
            width: 97px;
            height: 48px;
            margin-left: 14px;
            cursor: pointer;
        }
    }
    .retrieve-line{
        display: flex;
        justify-content: space-between;
        font-size:14px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:26px;
        margin-top: -12px;
    }
    .retrieve-btn{
        width: 100%;
        height: 48px;
        line-height: 15px;
        text-align: center;
        font-size: 14px;
        color: rgba(255,255,255,1);
        border-radius:5px;
        margin-top: 30px;
        margin-bottom: 36px;
        &:hover{
            color: rgba(255,255,255,1);
        }
    }
}
</style>
