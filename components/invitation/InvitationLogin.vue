<template>
    <div class="invitation-login">
        <div class="account-login">
            <el-form :model="form" class="form">
                <el-form-item>
                    <el-input type="text" @blur="detection" v-model="phone" placeholder="请输入手机号码"></el-input>
                    <span style="color: red">{{error}}</span>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" v-model="password1" placeholder="请输入登录密码" @keyup.native="get($event)" @blur="blurend"></el-input>
                    <span style="color: red">{{pwderr}}</span>
                </el-form-item>
            </el-form>
            <div class="account-login-line">
                <p>
                    <span>没有账号，去<span style="color: #0083E9;cursor: pointer;" @click="handleToReg">注册</span></span>
                </p>
                <p @click="handleRetrieve">
                    <span>忘记密码?</span>
                </p>
            </div>
            <el-button :disabled="show" class="button" @click.stop="login" :style="{background: backgroundColor2}">登录</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                usernameormobile: '',
                password: '',
            },
            phone: null,
            password1: null,
            error: '',
            pwderr: '',
            backgroundColor2: 'rgba(210,210,210,1)',
        }
    },
    methods: {
        // 跳转到注册
        handleToReg() {
            this.$router.push('/invitationregister')
        },
        // 跳转到忘记密码
        handleRetrieve() {
            this.$router.push('/invitationforget')
        },

        // 失去焦点验证手机号
        detection() {  
            if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone) ) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },
        // 验证密码
        blurend() {
            if(!/^[0-9A-Za-z]{6,20}$/.test(this.password1)) {
                this.pwderr = '密码为6-16位数字或字母组成'
                return
            }else{
                this.pwderr = ''
            }
        },
        login () {
            if(this.form.password == -1 && this.form.usernameormobile == -1){
                var formData = new FormData();
                formData.append('usernameormobile', this.phone);
                formData.append('password', this.password1)
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post("/Login",formData,config).then((res)=>{
                    console.log(res)
                    if(res.data.State == 'Success'){
                        clearInterval(this.timer)
                        let data = res.data;
                        let name = data.UserName || data.NickName || data.Phone
                        // console.log(data) 登录成功将token保存到sessionStorage
                        sessionStorage.setItem('token', data.Token)
                        sessionStorage.setItem('userName', name)
                        sessionStorage.setItem('isDesigner', res.data.IsDesigner)
                        sessionStorage.setItem('isLogin', true)
                        // 将用户token保存到vuex中
                        this.$store.commit('setToken', data.Token)
                        this.$store.commit('setUserName', name)
                        this.$store.commit('setIsDesigner', res.data.IsDesigner)
                        this.$store.commit('setIsLogin', true)
                        this.$store.commit('setDialog', false)
                        this.$message({
                            type: 'success',
                            message: res.data.Message
                        })
                        history.go(0)
                    }else{
                        this.$store.commit('setDialog', true)
                        this.$store.commit('setIsLogin', false)
                        this.$message({
                            type: 'warning',
                            message: res.data.Message
                        })
                    }
                }).catch(error => {
                    
                })
            } 
        },
        get(e) {
            if(e.keyCode == 13) {
                this.login()
            }
        }
    },
    computed: {
        show() {
            if(this.form.password == -1 && this.form.usernameormobile == -1){
                this.backgroundColor2 = 'rgba(0,131,233,1)'
                return false
            }else{
                this.backgroundColor2 = 'rgba(210,210,210,1)'
                return true
            }
        }
    },
    watch: {
        // 验证手机号或邮箱
        phone() {
            if(/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)) { 
                this.form.usernameormobile = -1
            }else{
                this.form.usernameormobile = 1
            }
        },
        // code() {  // 监听输入的图形验证码
        //     this.inputCode()
        // },
        // 验证密码
        password1() {
            if(/^[0-9A-Za-z]{6,20}$/.test(this.password1)) {
                this.form.password = -1
            }else{
                this.form.password = 1
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.invitation-login{
    margin-bottom: 171px;
    .account-login{
        width: 356px;
        margin: 0 auto;
        .account-login-line{
            display: flex;
            justify-content: space-between;
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(153,153,153,1);
            line-height:26px;
            margin-top: -12px;
            p:last-child{
                cursor: pointer;
                &:hover{
                    color: #0083E9;
                }
            }
        }
    }
    .button{
        width: 100%;
        height: 48px;
        line-height: 15px;
        text-align: center;
        font-size: 14px;
        color: rgba(255,255,255,1);
        border-radius:5px;
        margin-top: 35px;
        &:hover{
            color: rgba(255,255,255,1);
        }
    }
}
</style>
