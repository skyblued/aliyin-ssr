<template>
    <!-- @click="$store.commit('login/toggleShow', false)" -->
	<div class="model-dialog">
		<div class="logreg-wrapper" @click.stop>
			<div class="close-btn" style="top: 0px;right: -50px;" @click="handleClose"></div>
			<div class="comp">
				<div class="sign-page-wrapper"  v-if="!qqLogin && !bindQQ">
					
					<div class="toggle-sign-way">
						<div class="sign-way" title="切换登录方式" @click="handleToggleSign">
							<img :src="$store.state.port.staticPath + ($store.state.login.signType == 'wxpage' ? image : src)" alt="">
						</div>
						<div class="sign-way-tips">
							<img :src="$store.state.port.staticPath +'/img/home/security_icon.png'" alt="">
							<p v-if="$store.state.login.signType == 'signpage'">扫码登录在这里</p>
							<p v-else>账号登录在这里</p>
							<i></i>
							<i></i>
						</div>
					</div>
					<div class="wx-page" v-if="$store.state.login.signType == 'wxpage'">
						<div class="wx-title">
							<span>微信登录更安全</span>
						</div>
						<div class="qrcode">
							<img :src="wxqrcode" alt="" style="width:100%;height:100%;">
							<span class="refresh-mask" v-if="showCode" @click="handleRefresh">二维码过期点击刷新</span>
						</div>
						<div class="wx-tips">
							<img :src="$store.state.port.staticPath +'/img/home/wechat.png'" alt="">
							<p>
								打开
								<span>微信</span>
								扫描二维码登录
							</p>
						</div>
					</div>
					<div class="sign-page" v-if="$store.state.login.signType == 'signpage'">
						<p class="login-pwd-title">手机号码登录</p>
						<div class="sign-in">
							<el-form :model="form">
								<el-form-item>
									<!-- <el-input type="text" @blur="detection" v-model="phone" placeholder="请输入手机号码"></el-input> -->
									<el-input type="text" @blur="detection" v-model="form.usernameormobile" placeholder="请输入账号"></el-input>
									<span class="error-tips">{{error}}</span>
								</el-form-item>
								<el-form-item>
									<!-- <el-input type="password" v-model="password1" placeholder="请输入登录密码" @keyup.native="get($event)" @blur="blurend"></el-input> -->
									<el-input type="password" v-model="form.password" placeholder="请输入登录密码" @keyup.native="get($event)" @blur="blurend"></el-input>
									<span class="error-tips">{{pwderr}}</span>
								</el-form-item>
							</el-form>
							<div class="sign-line">
								<p>
									<span>没有账号，去<span style="color: #745bff;cursor: pointer;" @click="setDialogType('register')">注册</span></span>
								</p>
								<p @click="setDialogType('forget')">
									<span>忘记密码?</span>
								</p>
							</div>
							<!-- <el-button :disabled="show" @click.stop="login" :style="{background: background}">登 录</el-button> -->
							<el-button @click.stop="login">登 录</el-button>
						</div>
					</div>
                    <Register v-if="$store.state.login.signType == 'register'"></Register>
                    <ForgetPassword v-if="$store.state.login.signType == 'forget'"></ForgetPassword>
					<div class="others">
						<span class="sign-qq" @click="handleOpenQQ">QQ登录</span>
					</div>
				</div>
				<div v-if="qqLogin" class="It-modal-content" style="width: 500px;height:520px;marign:-530px;">
					<iframe id="iframeqq" class="modal-iframe" :src="$store.state.port.qqServer + '/QQLogin.aspx'" frameborder="0"></iframe>
				</div>
				<BindWechat v-if="bindQQ"
					@handleSkipClose="handleSkipClose"
					:info="info"
				></BindWechat>
			</div>
		</div>
	</div>
</template>

<script>
import BindWechat from '@/components/BindWechat'
import Register from '@/components/Register'
import ForgetPassword from '@/components/ForgetPassword'
export default {
	name: 'login',
	components: {
        BindWechat,
        Register,
        ForgetPassword
	},
    data () {
        return {
            image: '/img/home/computer_icon.png',
            src: '/img/home/Qrcode_icon.png',
            dialogForgetPwd: false,     // 忘记密码弹出框
			dialogApplyDesigner: false,  // 申请设计师弹出框
			qqLogin: false,
			bindQQ: false,
            form: {
                usernameormobile: '',
                password: '',
                Type: ''
			},
			info: {
                openid: '',
                name: '',
                pic: '',
                sex: '',
            },
            background: 'rgba(210,210,210,1)',
            disabled: true,
            error: '',
            pwderr: '',
            wxqrcode: '',
            timer: null,
            // phone: null,
            // password1: null,
            showCode: false,
            overtime: null,
        }
    },
    created () {
        this.codeImg = 'https://open.aliyin.com/ValidateCode.aspx?flage='
        
	},
    methods: {
        handleClose() {
			this.$store.commit('login/toggleShow', false);
			if (this.bindQQ) {
				this.handleSkipClose();
			}
        },
        handleToggleSign() {  // 切换登录方式
            if(this.$store.state.login.signType == 'signpage'){
                this.$store.commit('login/toggleSign', 'wxpage')
                this.handleSignIn()
            }else{
                this.$store.commit('login/toggleSign', 'signpage')
                clearInterval(this.timer)
            }
        },
        setDialogType(type) {
            this.$store.commit('login/toggleSign', type)
        },
        updataCode() {
            this.flage = new Date().getTime()
            // console.log(this.flage)
            this.codeImg = 'https://open.aliyin.com/ValidateCode.aspx?flage='+this.flage
        },
        // 失去焦点验证手机号或邮箱  
        detection() {  // 验证手机号 /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
            // if(!/(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.phone) ) {
            //     this.error = '请输入正确的手机号'
            // }else{
            //     this.error = ''
            // }
            if (!this.form.usernameormobile) {
                this.error = '请输入账号' 
            }else {
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
        // 二维码过期刷新
        handleRefresh() {
            // console.log(this.showCode)
            if(this.showCode){
                this.handleSignIn()
                this.showCode = false
            }
        },
        handleSignIn() {  // 微信登录
            let source= localStorage['source'] || ''
            this.$axios.get('/WeChatQR?RegistSource=' + source).then(res => {
                // console.log(res)
                if(res.data.status == 'ok'){
                    this.overtime = res.data.expire
                    let sceneId = res.data.sceneId
                    this.wxqrcode = res.data.qrcode
                    this.timer = setInterval(()=>{
                        var formData = new FormData
                        formData.append('sceneId', sceneId)
                        this.$axios.post('/WeChatQR',formData).then(result => {
                            // console.log(result)
                            if(result.data.status == 'ok') {
                                this.getTeamInfo(result.data.token).then(() => {
									
                                    let name = result.data.nickName || result.data.userName 
                                    localStorage.setItem('token', result.data.token)
                                    localStorage.setItem('userName', name)
                                    localStorage.setItem('isDesigner', result.data.IsDesigner)
                                    localStorage.setItem('avatar', result.data.headImage)
                                    localStorage.setItem('phone', result.data.bindPhone || '')
                                    localStorage.setItem('loginType', result.data.loginType)
                                    localStorage.setItem('isBindWx', '')
                                    localStorage.setItem('isBindQQ', result.data.bindqq)
                                    localStorage.setItem('userType', result.data.UserType)
                                    localStorage.setItem('times', result.data.logintimes)
                                    //localStorage.setItem('isLogin', true)
                                    this.$store.commit('login/addToKen', result.data.token)
                                    this.$store.commit('login/setUserName', name)
                                    this.$store.commit('login/changeLogin', true)
                                    this.$message.success('登录成功')
                                    this.$store.commit('login/toggleShow', false)
                                    this.$cookies.set('token', result.data.token, {maxAge: 604800, path: '/'}) 
                                    clearInterval(this.timer)
                                    history.go(0)
                                })
                            }else{
                                // this.$message('登录失败')  
                            }
                        })
                    },1000)
                    setTimeout(() => {
                        clearInterval(this.timer)
                        this.showCode = true
                    },3000000)
                }
            })
        },
        login () {
            if(!this.form.usernameormobile && !this.form.password) {
                this.error = '请输入账号'
                this.pwderr = '请输入密码'
                return
            }
            if(!this.form.usernameormobile) {
                this.error = '请输入账号'
                return
            }
            if(!this.form.password) {
                this.pwderr = '请输入密码'
                return 
            }
            var formData = new FormData();
            formData.append('usernameormobile', this.form.usernameormobile);
            formData.append('password', this.form.password)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post("/Login",formData).then((res)=>{
                // console.log(res.data)
                if(res.data.State == 'Success'){
                    clearInterval(this.timer)
                    let data = res.data;
                    this.getTeamInfo(data.Token).then(() => {
                        let name = data.NiceName || data.UserName || data.Phone
                        localStorage.setItem('token', data.Token)
                        localStorage.setItem('userName', name)
                        localStorage.setItem('isDesigner', data.IsDesigner)
                        localStorage.setItem('avatar', data.Headimgurl)
                        localStorage.setItem('phone', data.Phone)
                        localStorage.setItem('loginType', data.LoginType)
                        localStorage.setItem('userType', data.UserType)
                        localStorage.setItem('times', data.LoginTimes)
                        // 将用户token保存到vuex中
                        this.$store.commit('login/addToKen', data.Token)
                        this.$store.commit('login/setUserName', name)
                        this.$store.commit('login/changeLogin', true)
                        this.$message.success(res.data.Message)
						this.$store.commit('login/toggleShow', false)
						this.$cookies.set('token', data.Token,{maxAge: 604800, path: '/'}) 
                        history.go(0)
                    })
                }else{
                    this.$store.commit('login/toggleSign', 'signpage')
                    this.$message.warning(res.data.Message)
                }
            }).catch(error => {
                
            })
        },
        get(e) {
            if(e.keyCode == 13) {
                this.login()
            }
        },

        // 获取团队信息
        getTeamInfo(msg) {
            return new Promise((open,err) => {
                let config = {
                    headers: {
                        token: msg,
                        'Content-Type': 'application/json'
                    }
                }
                this.$axios.post('/TeamInfos', {}, config).then(response => {
                    // console.log(response.data)
                    localStorage.setItem('teamNum', response.data[0].Num)
                    localStorage.setItem('teamName', response.data[0].TeamName)
                    open(true)
                })
            })
		},
		handleOpenQQ() { // 打开QQ登录窗口
			this.qqLogin = true
			clearInterval(this.timer)
            this.$nextTick(() => {
                window.addEventListener("message",(result)=>{
					if(!result) return console.log('登录失败')
					// console.log(result.data.openid)
					this.bindQQ = true;
                    this.info.openid = result.data.openid
                    if(result.data.data !== undefined){
                        this.info.name = result.data.data.nickname
                        this.info.pic = result.data.data.figureurl_qq_2
                        this.info.sex = result.data.data.gender
                    }
                    if (result.data.message == 'needbind') {
						this.qqLogin = false;
						
                    }else{
                        if(!result.data) return
                        this.getTeamInfo(result.data.token).then(() => {
                            let name = result.data.nickName || result.data.userName || result.data.bindPhone
                            localStorage.setItem('token', result.data.token)
                            localStorage.setItem('userName', name)
                            localStorage.setItem('isDesigner', result.data.IsDesigner)
                            localStorage.setItem('avatar', result.data.headImage)
                            let phone = result.data.bindPhone
                            phone = phone.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
                            localStorage.setItem('phone', phone)
                            localStorage.setItem('loginType', result.data.loginType)
                            localStorage.setItem('isBindWx', result.data.bindWX)
                            localStorage.setItem('isBindQQ', result.data.bindqq)
                            localStorage.setItem('times', result.data.LoginTimes)
                            this.$message({type: 'success', message: '登录成功'})
							 // 将用户token保存到vuex中
							this.$store.commit('login/addToKen', data.Token)
							this.$store.commit('login/setUserName', name)
							this.$store.commit('login/changeLogin', true)
							this.$store.commit('login/toggleShow', false)
							this.$cookies.set('token', data.Token,{maxAge: 604800, path: '/'}) 
                            this.qqLogin = false
                            history.go(0)
                        })
                    }
                });
            })
		},
		handleSkipClose() { // 跳过手机号和微信绑定
            if(!this.info) return
            var formData = new FormData()
            formData.append('qqopenid', this.info.openid);
            formData.append('qqnicename', this.info.name);
            formData.append('qqheaderpic', this.info.pic);
            formData.append('qqsex', this.info.sex);
            formData.append('RegistSource', this.source)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            if(this.skip) return
            this.skip = true
            this.$axios.post('/QQModes', formData, config).then(res => {
                // console.log(res)
                if (res.data.status == 'ok') {
                    this.$message({type: 'success', message: '登录成功'})
                    this.getTeamInfo(res.data.token).then(() => {
                        let name = res.data.nickName || res.data.userName
                        localStorage.setItem('token', res.data.token)
                        localStorage.setItem('userName', name)
                        localStorage.setItem('avatar', res.data.headImage)
                        localStorage.setItem('isDesigner', res.data.IsDesigner)
                        localStorage.setItem('phone', res.data.bindPhone)
                        localStorage.setItem('loginType', res.data.loginType)
                        localStorage.setItem('isBindWx', res.data.bindWX)
                        localStorage.setItem('isBindQQ', res.data.bindqq)
						localStorage.setItem('times', res.data.logintimes)
						
                        // 将用户token保存到vuex中
						this.$store.commit('login/addToKen', res.data.token)
						this.$store.commit('login/setUserName', name)
						this.$store.commit('login/changeLogin', true)
						this.$store.commit('login/toggleShow', false)
						this.$store.$cookies.set('token', res.data.token,{maxAge: 604800, path: '/'}) 
                        this.skip = false
                        history.go(0)
                    })
                }else{
                    this.$message({type: 'warning', message: res.data.Message})
                }
            })
        }
    },
    destroyed() {
        clearInterval(this.timer)
    },
    mounted () {
		this.$nextTick(() => {
			const body = document.querySelector("body");
			if (body.append) {
				body.append(this.$el);
			} else {
				body.appendChild(this.$el);
			}
		});
        this.handleSignIn()
	},
	
}
</script>

<style lang="scss" scoped>

// 登录样式
.logreg-wrapper{
    min-width: 509px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 2px 0 rgba(0,0,0,.12);
    text-align: center;
    padding-bottom: 30px;
	position: relative;
}
.error-tips{
    position: absolute;
    top: 48px;
    left: 0;
    color: red;
    line-height: 16px;
}
.logreg-wrapper /deep/ .el-form .el-form-item .el-form-item__content .el-input .el-input__inner{
    height:48px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(210,210,210,1);
    border-radius:5px;
}
.logreg-wrapper /deep/ .el-form .el-form-item:first-child{
    margin-bottom:25px;
}
.logreg-wrapper /deep/ .el-button{
    width: 100%;
    height: 48px;
    // line-height: 15px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    border-radius:5px;
    background: $color;
    &:hover{
        color: #fff;
    }
}
.comp{
    width: 100%;
    height: 100%;
	position: relative;
	overflow: hidden;
	border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.sign-page-wrapper{
    position: relative;
    height: 100%;
    padding-top: 115px;
}
.toggle-sign-way, .toggle-sign-way .sign-way{
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
}
.toggle-sign-way{
    width:110px;
    height:133px;
    background:rgba(255,255,255,1);
    border-radius:10px;
}
.toggle-sign-way .sign-way{
    cursor: pointer;
    width:69px;
    height:69px;
}
.toggle-sign-way .sign-way img{
    display: inline-block;
    width: 100%;
    height: 100%;
    border-top-right-radius:10px;
}
.toggle-sign-way .sign-way-tips{
    width:157px;
    height:36px;
    display: flex;
    line-height: 20px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(132,139,145,0.3);
    position: absolute;
    top: 17px;
    right: 82px;
}
.toggle-sign-way .sign-way-tips img{
    width: 16px;
    height: 20px;
    display: inline-block;
    margin: 8px 0 8px 15px;
    vertical-align: top;
}
.toggle-sign-way .sign-way-tips p{
    display: inline-block;
    width:105px;
    height:14px;
    line-height: 14px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:$color;
    margin: 11px 13px 11px 8px;
}
.toggle-sign-way .sign-way-tips i{
    width:24px;
    height:1px;
    background:$color;
    display: inline-block;
    position: absolute;
    top: 18px;
    right: -24px;
    opacity:0.5;
}
.toggle-sign-way .sign-way-tips i:last-child{
    width:7px;
    height:7px;
    background:$color;
    box-shadow:0px 0px 5px 0px rgba(0,131,233,0.78);
    border-radius:50%;
    display: inline-block;
    position: absolute;
    right: -30px;
    top: 15px;
}

// 微信登录
.wx-page{
    width: 100%;
    height: 300px;
}
.wx-page .wx-title{
    width:164px;
    height:23px;
    line-height: 22px;
    font-size:22px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin: 0 auto 30px;
}
.wx-page .qrcode{
    width: 207px;
    height: 206px;
    border: 1px solid #9b9b9b;
    margin: 0 auto;
	position: relative;
	border-radius: 5px;
	overflow: hidden;
}
.refresh-mask{
    position: absolute;
    top: 12px;
    left: 12px;
    display: inline-block;
    width: 185px;
    height: 185px;
    cursor: pointer;
    background-color: rgba(0,0,0,.8);
    background-image: url(//static.chuangkit.com/dist/price_refresh_qrcode.svg?0927ca910842f5e6a23fe3dd55265c59);
    background-size: 40%;
    background-repeat: no-repeat;
    background-position: 50%;
}
.wx-page .wx-tips{
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin: 20px auto 0;
}
.wx-page .wx-tips img{
    width: 27px;
    height: 22px;
    display: inline-block;
    vertical-align: top;
}
.wx-page .wx-tips p{
    display: inline-block;
    width:189px;
    height:16px;
    line-height: 16px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    margin-left: 12px;
}

// qq登录
.others{
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    text-decoration:underline;
    color:rgba(153,153,153,1);
    padding: 20px 30px;
    text-align: right;
    cursor: pointer;
    &:hover{
        color: $color;
    }
}
// 账号登录
.sign-page{
    width: 356px;
    height: 302px;
    margin: auto;
}
.sign-page .login-pwd-title{
    width:140px;
    height:22px;
    line-height: 22px;
    font-size:22px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin: 0 auto 36px;
}
.sign-page .sign-in .sign-line{
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    margin-top: 20px;
    margin-bottom: 40px;
}
.sign-page .sign-in .sign-line p:first-child{
    width:121px;
    height:16px;
}
.sign-page .sign-in .sign-line p:last-child{
    width:67px;
    height:14px;
    line-height: 14px;
    cursor: pointer;
    &:hover{
        color: #745bff;
    }
}


.It-modal-content{
    .It-modal-close{
        position: absolute;
        right: -36px;
        top: -4px;
        color: #fff;
        cursor: pointer;
        &::before{
            content: '';
            background-image: url(/img/home/fork_gray.png);
            display: inline-block;
            width: 24px;
            height: 24px;
        }
    }
}
.modal-iframe{
	margin: -48px -60px;
    width: 620px;
    height: 600px;
    background-color: #fff;
}

</style>
