<template>
    <div class="binding-phone">
        <div class="content-avatar">
            <img v-if="$store.state.login.avatar != 'null' && $store.state.login.avatar != ''" class="avatar" :src="$store.state.login.avatar.indexOf('http') > -1 ? $store.state.login.avatar :$store.state.port.imgBaseUrl + $store.state.login.avatar" alt="">
            <div v-else class="avatar-wrap"></div>
            <p>{{username}}</p>
        </div>
        <div class="content">
            <div class="content-title">
                <span class="title">手机号: </span>
                <el-input v-model="phone" @blur="handlePhoneBlur" @focus="error = ''" placeholder="请输入手机号"></el-input>
                <span class="error">{{error}}</span>
            </div>
            <div class="content-input">
                <span class="title">图片验证码: </span>
                <div class="input-code">
                    <el-input v-model="picode" placeholder="输入图形验证码"></el-input>
                    <span class="refresh" @click="updataCode">点击刷新</span>
                    <img :src="codeImg" alt="" @click="updataCode">
                </div>
            </div>
            <div class="content-input">
                <span class="title">短信验证码: </span>
                <div class="input-phone-code">
                    <el-input v-model="code" placeholder="请输入验证码" @input="handleInput"></el-input>
                    <!-- <span>获取验证码</span> -->
                    <el-button class="get-code" v-show="sendCode" @click="getPhoneCode">获取验证码</el-button>
                    <el-button class="get-code" v-show="!sendCode" disabled>{{authTime}}s之后重新发送</el-button>
                </div>
            </div>
            <!-- <div class="content-title">
                <span class="title">密码: </span>
                <el-input v-model="password" placeholder="设置阿里印密码"></el-input>
            </div> -->
        </div>
        <div class="btn">
            <el-button :class="{'binding-btn': true, disable : isDisable}" @click="handleBind">立即绑定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // avatar: localStorage['avatar'],
            username: localStorage['userName'],
            phone: '',
            error: '',  // 验证手机号错误信息
            code: '', // 短信验证码
            picode: '', // 图片验证码
            //password: ''
            codeImg: '',  // 图片验证码图片
            flage: '',    // 获取图形验证码的随机数

            sendCode: true,
            authTime: 0,
            isDisable: false
        }
    },
    created () {
        this.flage = parseInt(new Date().getTime() / 1000)
        this.codeImg = this.$store.state.port.qqServer +  '/ValidateCode.aspx?flage=' + this.flage
    },
    methods: {
        // 失去焦点验证手机号
        handlePhoneBlur() {
            if(!/^1[3-9][0-9]\d{8}$/.test(this.phone) ) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },
 
        updataCode() {  // 刷新图片验证码
            this.flage = parseInt(new Date().getTime() / 1000)
            this.codeImg = this.$store.state.port.qqServer +  '/ValidateCode.aspx?flage='+this.flage
        },


        // 获取短信验证码
        getPhoneCode() {
            if (!this.phone) return this.$message({type: 'warning', message: '手机号不能为空'})
            if (!this.picode) {
                return this.$message({type: 'warning', message: '验证码不能为空'})
            } else {
                var url = '/VerificationCode?flage='+this.flage+'&code='+this.picode;
                this.$axios.get(url).then(res => {
                    console.log(res.data)
                    if(res.data == true){
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
                        formData.append('Mobile', this.phone);
                        let config = {
                            headers:{'Content-Type': 'multipart/form-data'}
                        }
                        this.$axios.post('/VerificationCodeMobile', formData, config)
                        .then(res => {
                            console.log(res)
                            if (res.data == 'Success') {
                                this.$message({type: 'success', message: '短信已发送请注意查收!'})
                            }
                        })
                    }else{
                        this.$message({type: 'error', message: '图形验证码错误'})
                        this.updataCode()
                    }
                })
            }
        },

        handleInput() {
            this.isDisable = true
        },
        // 绑定
        handleBind() {
            if(!this.phone || !this.picode || !this.code) return this.$message({type: 'warning', message: '信息填写不完整'})
            var formData = new FormData()
            formData.append('Phone', this.phone);
            formData.append('Code', this.code);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/UserBindPhone', formData, config).then(res => {
                console.log(res.data)
                if(res.data == true) {
                    sessionStorage.setItem('phone', this.phone)
                    this.$message({type: 'success', message: res.data.message})
                    history.go(0)
                }else{
                    this.$message({type: 'error', message: res.data.message})
                }
            })
        }
    }
}
</script>

<style lang="scss">

.binding-phone{
    width: 517px;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    font-size: 14px;
    user-select: none;
    .content-title:last-child{
        margin-left: 14px;
    }
    .content-input{
        margin-left: -24px;
        .input-code{
            img{
                width: 97px;
                cursor: pointer;
            }
            .refresh{
                position: absolute;
                top: 0;
                right: 97px;
            }
        }
        .input-phone-code{
            width: 422px;
            display: flex;
            .get-code{
                border: 1px solid $color;
                color: $color;
                background: rgba(255,255,255,1);
                &:hover{
                    background: rgba(255,255,255,1);
                }
            }
        }
    }
    .content-title{
        position: relative;
        .error{
            color: rgba(255,0,0,1);
            font-size: 14px;
            line-height: 14px;
            position: absolute;
            top: 40px;
            left: 68px;
        }
    }
    .btn{
        .binding-btn{
            background: rgba(236,236,236,1);
            color: rgba(153,153,153,1);
        }
        .disable{
            background: $color;
            color: rgba(255,255,255,1);
        }
    }
}
.binding-phone .content .el-input{
    height: 40px;
}
</style>
