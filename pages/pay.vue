<template>
    <div id="pay">
        
    </div>
</template>

<script>
export default {
    data () {
        // let params = this.$route.params.t
        // params = params.split('&')
        // console.log(params)
        return {
            orderCode: '',
            active: '',
            num: 0,
            teamNum: '',
            userId: ''
        }
    },
    mounted() {
        var url = window.location.href
        // console.log(url)
        var str = url.split('/')[4]
        var msg = str.split('&')
        var m = []
        for(var i=0;i<msg.length;i++) {
            m.push(msg[i].substr(2))
        }
        // console.log(m)
        this.orderCode = m[0]
        this.active = m[2]
        this.teamNum = m[1]
        this.userId = m[4]



        var ua = window.navigator.userAgent.toLowerCase();
        console.log(ua)
        //判断是不是微信
        if ( ua.match(/MicroMessenger/i) == 'micromessenger' ) { 
            this.$router.push({path: '/wechatPay', query: {t: this.teamNum, c: this.orderCode, u: this.userId, n: this.num, a: this.active, type: 'wxnativepay'}}) 
            //this.$router.push(`/wechat?t=${this.teamNum}&c=${this.orderCode}&u=${this.userId}&n=${this.num}&a=${this.active}& type=wxnativepay`) 
            return "wxnativepay"; 
        } else if (ua.match(/AlipayClient/i) == 'alipayclient') {  //判断是不是支付宝
            this.$router.push({path: '/alipay', query: {t: this.teamNum, c: this.orderCode, u: this.userId, n: this.num, a: this.active, type: 'alipaydirect'}})
            return "alipaydirect";  
        }else{   //哪个都不是
            //this.$router.push({path: '/wechat', query: {t: this.teamNum, c: this.orderCode, u: this.userId, n: this.num, a: this.active, type: 'wxnativepay'}}) 
            return "false";
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
