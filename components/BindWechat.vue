<template>
    <div class="bind-wechat">
        <div class="toggle-right">
            <div class="sign-way" title="切换绑定方式" @click="handleToggleWay">
                <img :src="phone ? src : image" alt="">
            </div>
            <div class="sign-way-tips">
                <img src="/img/home/security_icon.png" alt="">
                <p v-if="phone">绑定微信</p>
                <p v-else>绑定手机号</p>
                <i></i>
                <i></i>
            </div>
        </div>
        <div class="bind-phone" v-if="phone">
            <div class="bind-title">绑定手机号</div>
            <div class="phone-content">
                <el-form :model="form">
                    <el-form-item>
                        <el-input v-model="Phone" @blur="handlePhoneBlur" @focus="error = ''" placeholder="请输入手机号码"></el-input>
                        <span class="error-tips">{{error}}</span>
                    </el-form-item>
                    <el-form-item class="phone-code">
                        <el-input v-model="code" placeholder="请输入图形验证码"></el-input>
                        <img class="picture-img" :src="codeImg" alt="" @click="updataCode">
                    </el-form-item>
                    <el-form-item class="phone-code">
                        <el-input v-model="form.phonecode" placeholder="请输入验证码" @input="handleInput"></el-input>
                        <el-button :disabled="show" @click="getPhoneCode" v-show="sendCode" :style="{background: background}">获取验证码</el-button>
                        <el-button class="getCode" v-show="!sendCode" disabled>{{authTime}}s之后重新发送</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <p class="toast">绑定手机号防止账号丢失</p>
            <el-button class="sure-btn" :disabled="disabled" :style="{background: backgroundColor}" @click="handleBind">确认绑定</el-button>
        </div>
        <div class="bind-wx" v-if="wx">
            <div class="bind-title">绑定微信</div>
            <div class="qr-code">
                <img :src="qrcode" alt="">
            </div>
            <div class="wx-tips">
                <img src="/img/home/wechat.png" alt="">
                <span>绑定微信防止账号丢失</span>
            </div>
        </div>
        <p class="skip" @click="handleSkipBind">跳过</p>
    </div>
</template>

<script>

export default {
	
    data () {
        return {
            phone: true,
            wx: false,
            image: '/img/home/computer_icon.png',
            src: '/img/home/Qrcode_icon.png',
            form: {
                phone: '',
                phonecode: '',
            },
            Phone: null,
            code: '',
            codeImg: '',
            flage: '',
            passing: false,
            error: '',
            background: 'rgba(210,210,210,1)',
            sendCode: true,
            authTime: 0,
            disabled: true,
            backgroundColor: 'rgba(210,210,210,1)',

            qrcode: '',  // 微信二维码
            timer: null,
            bindphone: false,
            skip: false,
            source: localStorage['source'] || ''
        }
    },
    created () {
        this.flage = parseInt(new Date().getTime() / 1000)
        this.codeImg = this.$store.state.qqServer + '/ValidateCode.aspx?flage=' + this.flage
    },
    props: ['info'],
    methods: {
        handleToggleWay() {  // 切换绑定方式
            if (this.phone) {
                this.phone = false
                this.wx = true
                this.hangleBinfWx()
            } else {
                this.phone = true
                this.wx = false
            }
        },

        updataCode() {  // 刷新图片验证码
            this.flage = parseInt(new Date().getTime() / 1000)
            console.log(this.flage)
            this.codeImg = this.$store.state.qqServer +  '/ValidateCode.aspx?flage='+this.flage
        },

        // 验证图片验证码
        handlePicCode() {
            var url = '/VerificationCode?flage='+this.flage+'&code='+this.code;
            this.$http.get(url).then(res => {
                console.log(res.data)
                if(res.data == true){
                    this.passing = true
                }else{
                    this.passing = false
                    this.$message({type: 'error', message: '图形验证码错误'})
                    this.updataCode()
                }
            })
        },
        // 失去焦点验证手机号
        handlePhoneBlur() {
            if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.Phone) ) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },

        // 获取手机短信验证码
        getPhoneCode() {
            if (this.passing == true && this.form.phone == -1) {
                console.log(123)
                this.sendCode = false
                this.authTime = 60
                var timer = setInterval(() => {
                    this.authTime--;
                    if(this.authTime <= 0) {
                        this.sendCode = true
                        clearInterval(timer)
                    }
                },1000)
                var formData = new FormData();
                formData.append('Mobile', this.Phone);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$http.post('/VerificationCodeMobile', formData, config)
                .then(res => {
                    console.log(res)
                })
            }else{
                console.log(456)
            }
        },
        handleInput() {
            this.disabled = false
            this.backgroundColor = 'rgba(0,131,233,1)'
        },

        handleBind() {  // 绑定手机号
            var formData = new FormData()
            formData.append('phone', this.Phone);
            formData.append('code', this.form.phonecode);
            formData.append('qqopenid', this.info.openid);
            formData.append('qqnicename', this.info.name);
            formData.append('qqheaderpic', this.info.pic);
            formData.append('qqsex', this.info.sex);
            formData.append('RegistSource', this.source)
            console.log(this.Phone,this.form.phonecode,this.info.openid,this.info.name,this.info.pic,this.info.sex)
            if(this.bindphone) return 
            this.bindphone = true
            this.$http.post('LoginPhone4QQ', formData, confirm)
            .then(res => {
                console.log(res)
                if (res.data.status == 'ok') {
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
                        this.$store.commit('setToken', res.data.token)
                        this.$store.commit('setUserName', name)
                        this.$store.commit('setIsDesigner', res.data.IsDesigner)
                        this.$store.commit('setDialogBind', false)
                        this.$message({type: 'success', message: '绑定成功'})
                        this.bindphone = false
                        history.go(0)
                    })
                }else{
                    this.$message({type: 'warning', message: res.data.message})
                    return 
                }
            })
        },

        // 绑定微信
        hangleBinfWx() {
            if(this.wx == true){
                this.$http.get('/WeChatQR?RegistSource=' + this.source).then(res => {
                    console.log(res)
                    if(res.data.status == 'ok') {
                        this.qrcode = res.data.qrcode
                        let sceneId = res.data.sceneId
                        this.timer = setInterval(() => {
                            var formData = new FormData
                            formData.append('sceneId', sceneId)
                            this.$http.post('/WeChatQR', formData).then(result => {
                                console.log(result)
                                if(result.data.status == 'ok'){
                                    clearInterval(this.timer)
                                    if (result.data.bindqq == true) {
                                        this.$message({type: 'warning', message: '该微信已绑定过其他qq了'})
                                    } else {
                                        var formdata = new FormData()
                                        formdata.append('qqopenid', this.info.openid);
                                        formdata.append('qqnicename', this.info.name);
                                        formdata.append('qqheaderpic', this.info.pic);
                                        formdata.append('qqsex', this.info.sex);
                                        formdata.append('userid', result.data.userid);
                                        this.$http.post('/QQCallback', formdata).then(response => {
                                            console.log(response)
                                            if (response.data.status == 'ok') {
                                                let name = response.data.nickName || response.data.userName
                                                localStorage.setItem('token', response.data.token)
                                                localStorage.setItem('userName', name)
                                                localStorage.setItem('avatar', response.data.headImage)
                                                localStorage.setItem('isDesigner', response.data.IsDesigner)
                                                this.$store.commit('setToken', response.data.token)
                                                this.$store.commit('setUserName', name)
                                                this.$store.commit('setIsDesigner', response.data.IsDesigner)
                                                this.$store.commit('setDialogBind', false)
                                                this.$message({type: 'success', message: '绑定成功'})
                                            } else {
                                                this.$message({type: 'warning', message: response.data.message})
                                            }
                                        })
                                    }
                                }
                            })
                        }, 3000)
                    }
                })
            }
        },
        

        // 跳过不绑定
        handleSkipBind() {
            this.$emit('handleSkipClose')
            // if(!this.info) return
            // var formData = new FormData()
            // formData.append('qqopenid', this.info.openid);
            // formData.append('qqnicename', this.info.name);
            // formData.append('qqheaderpic', this.info.pic);
            // formData.append('qqsex', this.info.sex);
            // formData.append('RegistSource', this.source)
            // let config = {
            //     headers:{'Content-Type': 'multipart/form-data'}
            // }
            // if(this.skip) return
            // this.skip = true
            // this.$http.post('/QQModes', formData, config).then(res => {
            //     console.log(res)
            //     if (res.data.status == 'ok') {
            //         this.getTeamInfo(res.data.token).then(() => {
            //             let name = res.data.nickName || res.data.userName
            //             localStorage.setItem('token', res.data.token)
            //             localStorage.setItem('userName', name)
            //             localStorage.setItem('avatar', res.data.headImage)
            //             localStorage.setItem('isDesigner', res.data.IsDesigner)
            //             localStorage.setItem('phone', res.data.bindPhone)
            //             localStorage.setItem('loginType', res.data.loginType)
            //             localStorage.setItem('isBindWx', res.data.bindWX)
            //             localStorage.setItem('isBindQQ', res.data.bindqq)
            //             localStorage.setItem('times', res.data.logintimes)
            //             this.$store.commit('setToken', res.data.token)
            //             this.$store.commit('setUserName', name)
            //             this.$store.commit('setIsDesigner', res.data.IsDesigner)
            //             this.$store.commit('setDialogBind', false)
            //             this.$message({type: 'success', message: '登录成功'})
            //             this.skip = false
            //             history.go(0)
            //         })
            //     }else{
            //         this.$message({type: 'warning', message: res.data.Message})
            //     }
            // })
        },

        getTeamInfo(msg) {
            return new Promise((open,err) => {
                let config = {
                    headers: {
                        token: msg,
                        'Content-Type': 'application/json'
                    }
                }
                this.$http.post('/TeamInfos', {}, config).then(response => {
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
            if(this.passing == true && this.form.phone == -1){
                this.background = 'rgba(0,131,233,1)'
                return false
            }else{
                this.background = 'rgba(210,210,210,1)'
                return true
            }
        }
    },
    watch: {
        Phone() {
            if(/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.Phone)) { 
                this.form.phone = -1
            }else{
                this.form.phone = 1
            }
        },
        code() {
            if(this.code.length != 4 || !this.code){
                this.passing = false
                return
            }   
            this.handlePicCode()
        },
    },
}
</script>

<style lang="scss" scoped>
.bind-wechat{
    position: relative;
    height: 100%;
    text-align: center;
    padding-bottom: 80px;
    .toggle-right{
        position: absolute;
        top: 0;
        right: 0;
        width:110px;
        height:133px;
        background:rgba(255,255,255,1);
        border-radius:10px;
        .sign-way{
            position: absolute;
            top: 0;
            right: 0;
            width:69px;
            height:69px;
            cursor: pointer;
            img{
                display: inline-block;
                width: 100%;
                height: 100%;
                border-top-right-radius:10px;
            }
        }
        .sign-way-tips{
            display: flex;
            align-items: center;
            width: 122px;
            height:36px;
            line-height: 20px;
            background:rgba(255,255,255,1);
            box-shadow:0px 0px 5px 0px rgba(132,139,145,0.3);
            position: absolute;
            top: 17px;
            right: 82px;
            padding: 0 14px;
            img{
                width: 16px;
                height: 20px;
                display: inline-block;
                vertical-align: middle;
            }
            p{
                display: inline-block;
                height:14px;
                line-height: 14px;
                font-size:14px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:$color;
                margin-left: 8px;
            }
            i{
                width:24px;
                height:1px;
                background:$color;
                display: inline-block;
                position: absolute;
                top: 18px;
                right: -24px;
                opacity:0.5;
            }
            i:last-child{
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
        }
    }
    .bind-phone{
        padding: 80px 76px 0;
    }
    .bind-wx{
        padding-top: 80px;
        .qr-code{
            width: 207px;
            height: 206px;
            border:1px solid rgba(210,210,210,1);
            margin: 30px auto 0;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .wx-tips{
            margin-top: 30px;
            img{
                display: inline-block;
                vertical-align: middle;
                margin-right: 12px;
            }
            span{
                color:rgba(255,132,0,1);
            }
        }
    }
    .bind-title{
        font-size:22px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .toast{
        color:rgba(255,132,0,1);
        font-size: 14px;
        text-align: right;
    }
    .sure-btn{
        width: 100%;
        height: 48px;
        line-height: 48px;
        border-radius: 5px;
        text-align: center;
        padding: 0;
        color:rgba(254,254,254,1);
        background: rgba(210,210,210,1);
        font-size: 18px;
        margin-top: 40px;
        margin-bottom: 5px;
        &:hover{
            background: rgba(210,210,210,1);
            color:rgba(254,254,254,1);
        }
    }
    .skip{
        color:rgba(153,153,153,1);
        position: absolute;
        right: 38px;
        bottom: 30px;
        cursor: pointer;
        &:hover{
            color: $color;
        }
    }
}

.bind-wechat /deep/ .bind-phone .el-form{
    margin-top: 36px;
    .el-form-item, .el-form-item__content, .el-input, .el-input__inner{
        height: 48px;
        line-height: 48px;
    }
    .phone-code .el-form-item__content{
        display: flex;
        .el-button{
            margin-left: 8px;
            color: rgba(255,255,255,1);
        }
        .picture-img{
            display: inline-block;
            width: 97px;
            margin-left: 15px;
        }
        .getCode{
            //width:144px;
            height:48px;
            border:1px solid $color;
            border-radius:5px;
            margin-left: 8px;
            color: $color;
        }
    }
    .el-form-item{
        position: relative;
        .error-tips{
            position: absolute;
            top: 48px;
            left: 0;
            line-height: 14px;
            font-size: 14px;
            color: rgba(255,0,0,1);
        }
    }
}
</style>
