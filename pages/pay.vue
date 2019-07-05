<template>
    <div id="pay">
        
    </div>
</template>

<script>
export default {
	asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
			console.log(query)
			return {
				orderCode: query.c,
				active: query.a,
				num: query.n,
				teamNum: query.t,
				userId: query.u
			}
	},
    mounted() {
        var ua = window.navigator.userAgent.toLowerCase();
        console.log(ua)
        //判断是不是微信
        if ( ua.match(/MicroMessenger/i) == 'micromessenger' ) { 
            // this.$router.push({path: '/wechat', query: {t: this.teamNum, c: this.orderCode, u: this.userId, n: this.num, a: this.active, type: 'wxnativepay'}}) 
            this.$router.push(`/wechat?t=${this.teamNum}&c=${this.orderCode}&u=${this.userId}&n=${this.num}&a=${this.active}& type=wxnativepay`) 
            return "wxnativepay"; 
        } else if (ua.match(/AlipayClient/i) == 'alipayclient') {  //判断是不是支付宝
            this.$router.push({path: '/alipay', query: {t: this.teamNum, c: this.orderCode, u: this.userId, n: this.num, a: this.active, type: 'alipaydirect'}})
            return "alipaydirect";  
        }else{   //哪个都不是
            // this.$router.push({path: '/wechatPay', query: {t: this.teamNum, c: this.orderCode, u: this.userId, n: this.num, a: this.active, type: 'wxnativepay'}}) 
            return "false";
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
