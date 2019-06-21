<template>
    <div class="invitation-wechat">
        <div class="qrcode">
            <img :src="wxqrcode" alt="">
        </div>
        <div class="wechat-tips">
            <img :src="$store.state.port.staticPath + '/img/home/wechat.png'" alt="">
            <p>使用微信扫一扫立即登录</p>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            wxqrcode: '',
            timer: null,
        }
    },
    methods: {
        handleSignIn() {  // 微信登录
            this.$axios.get('/WeChatQR').then(res => {
                // console.log(res)
                if(res.data.status == 'ok'){
                    let sceneId = res.data.sceneId
                    this.wxqrcode = res.data.qrcode
                    this.timer = setInterval(()=>{
                        var formData = new FormData
                        formData.append('sceneId', sceneId)
                        this.$axios.post('/WeChatQR',formData).then(result => {
                            console.log(result)
                            if(result.data.status == 'ok') {
                                sessionStorage.setItem('token', result.data.token)
                                sessionStorage.setItem('userName', result.data.userName)
                                sessionStorage.setItem('isDesigner', result.data.IsDesigner)
                                this.$store.commit('setToken', result.data.token)
                                this.$store.commit('setUserName', result.data.userName)
                                this.$store.commit('setIsDesigner', result.data.IsDesigner)
                                this.$message('登录成功')
                                this.$store.commit('setIsLogin', true)
                                sessionStorage.setItem('isLogin', true)
                                this.$store.commit('setDialog', false)
                                clearInterval(this.timer)
                                //history.go(0)
                            }else{
                                //this.$message({type: 'warning', message: '登录失败'})
                                return 
                            }
                        })
                    },3000)
                }
            })
        }
    },
    destroyed() {
        clearInterval(this.timer)
    },
    mounted() {
        this.handleSignIn()
    }
}
</script>

<style lang="scss" scoped>
.qrcode{
    width: 261px;
    height: 260px;
    margin: 0 auto;
    border: 1px solid rgba(210,210,210,1);
    img{
        width: 100%;
        height: 100%;
    }
}
.wechat-tips{
    display: flex;
    font-size:19px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    width: 270px;
    margin: 32px auto 92px;
    img{
        margin-right: 14px;
        height: 29px;
    }
}
</style>
