<template>
    <div class="wx-pay" v-if="code">
        <div class="pay">
            <p class="pay-item">正在付款</p>
            <p class="pay-item">¥{{price && price.toFixed(2)}}</p>
            <p class="pay-item">订单金额：¥{{price && price.toFixed(2)}}</p>
            <p class="pay-item">订单号：{{c}}</p>
            <div class="pay-btn" @click="handleJump">重新支付</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            t: '',
            c: '',
            n: '',
            a: '',
            u: '',
            type: '',
            code: '',
            state: '',
            price: '',
            link: '',
            msg: '',
        }
    },
    methods: {
        onBridgeReady(){
            let msg = JSON.parse(this.msg)
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    'appId': msg.appId,
                    'timeStamp': msg.timeStamp,
                    'nonceStr': msg.nonceStr,
                    'package': msg.package,
                    'signType': msg.signType,
                    'paySign': msg.paySign
                },
                function(res){
                if(res.err_msg == "get_brand_wcpay_request:ok" ){
                    alert('支付成功')
                // 使用以上方式判断前端返回,微信团队郑重提示：
                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                } else{
                    alert('取消支付')
                }
            }); 
        }, 
        init() {
            if (typeof WeixinJSBridge == "undefined"){
							// alert('没有这个')
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
                    document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
								}
								this.onBridgeReady();
            }else{
                this.onBridgeReady();
            }
        },


        // 获取订单金额信息
        getOrder() {
            this.$axios.get('/Order?orderCode=' + this.c).then(res =>{
                //console.log(res.data)
                this.price = res.data.Amount
            })
        },
        handleJump() {
            this.onBridgeReady()
        },

        getPayLink() {
            var formData = new FormData()
            formData.append('PayType', this.type);
            formData.append('UserID', this.u);
            formData.append('TeamNum', this.t);
            formData.append('Num', this.n);
            formData.append('Action', this.a);
            formData.append('OrderCode', this.c);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/pay', formData, config).then(res => {
                if(res.data == '') return
                this.link = res.data
                window.location.href = res.data 
                
            })
        },
        getWxPay() {
					// let m = `c:${this.c},code: ${this.code}, state: ${this.state}`;
            var url = '/WxPay?OrderCode=' + this.c + '&code=' + this.code + '&state=' + this.state
            this.$axios.get(url).then(({data}) =>{
                if(data == '') return alert('没有返回')
								this.msg = data
								if (data.indexOf('return') > -1) alert(data);
								this.init()
						})
						.catch(err => {
							let s = `url: ${url}, 这是出错了`
							alert(s)
						})
				},
				getOrderState() { //获取订单支付状态
						this.$axios.get('/CheckPay?OrderCode=' + this.c +'&Action=PrintShop')
						.then(({data}) => {
							if (data == 'Success') {
								alert('支付成功')
							} else {
								this.getWxPay();
							}
						})
						.catch(err => {
						})
				}
    },
    mounted() { 
			// let q = JSON.stringify(this.$route.query) ;
			// alert(q)
        this.t = this.$route.query.t
        this.c = this.$route.query.c || this.$route.query.OrderCode
        this.n = this.$route.query.n
        this.a = this.$route.query.a
        this.u = this.$route.query.u
        this.type = this.$route.query.type
        this.code = this.$route.query.code
				this.state = this.$route.query.state
				this.getOrder();
        if(!this.$route.query.code) this.getPayLink()
				else this.getOrderState()
        
    }
}
</script>

<style lang="scss" scoped>
.wx-pay{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:rgba(237,237,237,1);
    .pay{
        width: 100%;
        height: 100%;
        color:rgba(51,51,51,1);
        background-image: url(/img/print/for_bg.png);
        background-repeat: no-repeat;
        background-size: 100%;
        position: relative;
        margin-top: 10%;
        .pay-item{
            text-align: center;
            padding: 0.5rem 0;
            margin: 0;
        }
        .pay-item:nth-child(2){
            font-size: 2rem;
            font-weight: 500;
        }
        .pay-item:nth-child(1){
            font-size: 1.2rem;
            padding-top: 30%;
        }
    }
    .pay-btn{
        position: absolute;
        bottom: 24%;
        width: 90%;
        height: 42px;
        line-height: 42px;
        margin: 0 1rem;
        text-align: center;
        background:rgba(59,172,106,1);
        border-radius:46px;
        color: rgba(255,255,255,1);
    }
}      
</style>
