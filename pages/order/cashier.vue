<template>
    <div id="cashier-info">
        <div class="cashier-info">
            <div class="cashier-order-info">
                <p class="title">订单信息</p>
                <div class="cashier-order">
                    <div class="info">
                        <img src="/img/home/cashier/for_icon.png" alt="">
                        <div class="tips">
                            <p class="first">订单提交成功，去付款咯~</p>
                            <p>订单号: <span>{{orderInfo.OrderCode}}</span>,请在<span>24小时</span>内完成支付，超时后您的订单将被取消</p>
                            <p v-if="!show">收货地址：{{orderInfo.ShipName}}  {{orderInfo.ShipCellPhone}}    {{orderInfo.ShipRegion}} {{orderInfo.ShipAddress}}</p>
                            <el-collapse-transition>
                                <div v-if="show">
                                    <div class="detail">
                                        <p>订单号: {{orderInfo.OrderCode}}</p>
                                        <p>收货地址：{{orderInfo.ShipName}}  {{orderInfo.ShipCellPhone}}    {{orderInfo.ShipRegion}} {{orderInfo.ShipAddress}}</p>
                                        <div class="product-info">
                                            <span class="name">商品名称: </span>
                                            <div class="product-item">
                                                <p v-for="(item,i) in productInfo" :key="i">
                                                    <span>{{item.Name}}</span>
                                                    <span>{{item.AttributeNames}}</span>
                                                    <span>{{item.CraftNames}}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <p v-if="orderInfo.InvoiceState == '1'">
                                            发票信息：
                                            <span v-if="orderInfo.MakeType == 0">纸质发票</span>
                                            <span v-if="orderInfo.MakeType == 1">电子发票</span>
                                            <span>{{orderInfo.InvoiceTitle}}</span>
                                        </p>
                                    </div>
                                </div>
                            </el-collapse-transition>
                        </div>
                    </div>
                    <div class="cashier-price">
                        应付总额: 
                        <span class="price">{{orderInfo.Amount && orderInfo.Amount.toFixed(2)}}</span>
                        元
                        <p class="info-detail" @click="show = !show">
                            <span>订单详情</span>
                            <img :class="show ? 'is-active' : ''" src="/img/home/drop_down.png" alt="">
                        </p>
                    </div>
                </div>   
            </div>
            <div class="cashier-patment">
                <p class="title">扫码付款</p>
                <div class="content">
                    <img class="code" :src="code" alt="">
                    <span class="refresh-mask" v-if="showCode" @click="handleRefresh">二维码过期点击刷新</span>
                    <p>
                        <img src="/img/home/cashier/zfb_icon.png" alt="">
                        <img class="wechat" src="/img/home/cashier/wechat_icon.png" alt="">
                        <span>支持微信、支付宝扫码付款</span>
                    </p>
                </div>
            </div>
        </div>  
    </div>
</template>

<script>
export default {
    data () {
        return {
            show: false,
            teamNum: null,
            code: '',
            ordercode: '',  // 订单编号
            orderInfo: {}, // 订单信息
            productInfo: [],  // 商品信息

            timer: null,
            showCode: false
        }
    },
    methods: {
        handleRefresh() {
            if(this.showCode){
                this.getCode()
                this.showCode = false
            }
        },
        getCode() {
            var str = window.location.host
            var link = 'http://' + str + '/pay/'
            var url = '/pay?Url=' + link + '&Action=' + 'PrintShop' + '&TeamNum=' + this.teamNum + '&Num=' + '' + '&OrderCode=' + this.ordercode
            console.log(url)
            this.$axios.get(url).then(res =>{
                console.log(res)
                if(res.status == 200){
                    this.code = res.data
                    this.timer = setInterval(() => {
                        var url = '/CheckPay?OrderCode=' + this.ordercode + '&Action=' + 'PrintShop'
                        this.$axios.get(url).then(res => {
                            console.log(res.data)
                            if(res.data == 'Success'){
                                this.$router.push({path: '/order/pays', query: {code: this.ordercode}})
                                clearInterval(this.timer)
                            }
                        })
                    }, 3000)
                    setTimeout(() =>{
                        clearInterval(this.timer)
                        this.showCode = true
                    },300000)
                }
            })
        },

        // 获取订单信息
        getOrderInfo() {
            this.$axios.get('/Order?orderCode=' + this.ordercode).then(res => {
                console.log(res.data)
                this.orderInfo = res.data
                if(res.data.OrderItems.length > 0){
                    this.productInfo = res.data.OrderItems
                }
                if(res.data.PaymentStatus ==0){
                    this.getCode()
                }
            })
        }
    },
    destroyed() {
        clearInterval(this.timer)
    },
    mounted() {
        this.teamNum = localStorage['teamNum']
        this.ordercode = this.$route.query.code
        this.getOrderInfo()
    }
}
</script>

<style lang="scss" scoped>
#cashier-info{
    width: 100%;
    background: rgba(244,244,244,1);
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 39px;
}
.cashier-info{
    width: 1200px;
    margin: 0 auto;
    .cashier-order-info{
        background:rgba(255,255,255,1);
        border-radius: 10px;
        padding: 25px;   
        .cashier-order{
            margin-top: 34px;
            display: flex;
            justify-content: space-between;
            line-height: 96px;
            .info{
                display: flex;
                .tips{
                    line-height: 28px;
                    font-size:14px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(102,102,102,1);
                    .first{
                        font-size: 20px;
                        color: rgba(51,51,51,1);
                        margin-bottom: 12px;
                    }
                    span{
                        color: rgba(243, 152, 0, 1);
                        margin: 0 5px;
                    }
                    .detail{
                        margin-top: 50px;
                        font-size:14px;
                        color:rgba(102,102,102,1);
                        text-align: left;
                        .product-info{
                            display: flex;
                            span{
                                margin: 0;
                                color: rgba(102,102,102,1);
                                margin-right: 10px;
                            }
                            .product-item{
                                display: flex;
                                flex-direction: column;
                            }
                        }
                    }
                }
                img{
                    width: 70px;
                    height: 70px;
                    margin-top: 13px;
                    margin-right: 38px;
                }
            }
            .cashier-price{
                font-size: 14px;
                position: relative;
                .price{
                    font-size: 36px;
                    color:rgba(254,0,0,1);
                    margin-left: 15px;
                }
                .info-detail{
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    font-size: 14px;
                    line-height: 16px;
                    cursor: pointer;
                    img{
                        margin-left: 9px;
                        transition: transform .2s;
                        
                    }
                    .is-active{
                        transform: rotate(-180deg);
                    }
                }
            }
        }
    }
    .cashier-patment{
        background:rgba(255,255,255,1);
        border-radius:10px;
        padding: 25px;
        margin-top: 20px;
        .content{
            text-align: center;
            position: relative;
            .refresh-mask{
                position: absolute;
                top: 30px;
                left: 39.5%;
                display: inline-block;
                width: 240px;
                height: 240px;
                cursor: pointer;
                background-color: rgba(0,0,0,.8);
                background-image: url(//static.chuangkit.com/dist/price_refresh_qrcode.svg?0927ca910842f5e6a23fe3dd55265c59);
                background-size: 40%;
                background-repeat: no-repeat;
                background-position: 50%;
            }
            .code{
                border:1px solid rgba(210,210,210,1);
                background:rgba(255,255,255,1);
                width: 240px;
                height: 240px;
                margin: 30px 0;
            }
            p img{
                display: inline-block;
                vertical-align: middle;
            }
            p span{
                color:rgba(51,51,51,1);
                font-size: 16px;
            }
            .wechat{
                margin: 0 11px;
            }
        }
    }
}
</style>
