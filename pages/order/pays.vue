<template>
    <div id="pay-success">
        <div class="pay-success">
            <div class="success-order-info">
                <p class="title">订单信息</p>
                <div class="success-info">
                    <div class="info">
                        <img src="/img/home/cashier/for_icon.png" alt="">
                        <div class="tips">
                            <p class="first">订单号：{{orderInfo.OrderCode}} 支付成功！</p>
                            <p>您的订单已经支付完成，我们将尽快为您安排生产并发货！</p>
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
                                        <p>
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
                        已付总额: 
                        <span class="price">{{orderInfo.OrderTotal && orderInfo.OrderTotal.toFixed(2)}}</span>
                        元
                        <p class="info-detail" @click="show = !show">
                            <span>订单详情</span>
                            <img :class="show ? 'is-active' : ''" src="/img/home/cashier/green_down_icon.png" alt="">
                        </p>
                    </div>
                </div>
                <div class="success-bottom">
                    <div class="see-order" @click="handleJumpOrder('order')">查看订单</div>
                    <div class="continue" @click="handleJumpPrint">继续购物</div>
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
            ordercode: '',
            orderInfo: {},
            productInfo: [],
        }
    },
    methods: {
        // 获取订单信息
        getOrderInfo() {
            this.$axios.get('/Order?orderCode=' + this.ordercode).then(res => {
                console.log(res.data)
                this.orderInfo = res.data
                if(res.data.OrderItems.length > 0){
                    this.productInfo = res.data.OrderItems
                }
            })
        },

        // 查看订单
        handleJumpOrder(title) {
            this.$router.push('/personal/' + title)
        },
        // 继续购物
        handleJumpPrint() {
            this.$router.push('/print')
        }
    },
    mounted() {
        this.ordercode = this.$route.query.code
        this.getOrderInfo()
    }
}
</script>

<style lang="scss" scoped>
#pay-success{
    width: 100%;
    background: rgba(244,244,244,1);
    user-select: none;
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 39px;
}
.pay-success{
    width: 1200px;
    margin: 0 auto 356px;
    .success-order-info{
        background:rgba(255,255,255,1);
        border-radius:10px;
        padding: 25px;
        .title{
            font-size:18px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,51,51,1);
        }
        .success-info{
            background:rgba(241,248,238,1);
            border-radius:10px;
            margin: 25px 0 38px;
            padding: 38px 24px;
            display: flex;
            justify-content: space-between;
            .info{
                display: flex;
                img{
                    margin-right: 38px;
                    display: inline-block;
                    width: 70px;
                    height: 70px;
                    margin-top: 13px;
                }
                .tips{
                    line-height: 32px;
                    font-size:14px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(102,102,102,1);
                    .first{
                        font-size:20px;
                        color:rgba(122,189,84,1);
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
            }
            .cashier-price{
                font-size: 14px;
                color: rgba(51,51,51,1);
                position: relative;
                .price{
                    font-size: 36px;
                    color: rgba(255,0,0,1);
                    margin-left: 15px;
                }
                .info-detail{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    cursor: pointer;
                    color:rgba(99,154,68,1);
                    img{
                        margin-left: 8px;
                        transition: transform .2s;
                    }
                    .is-active{
                        transform: rotate(-180deg);
                    }
                }
            }
        }
    }
    .success-bottom{
        display: flex;
        margin-left: 140px;
        margin-bottom: 14px;
        div{
            border-radius: 5px;
            text-align: center;
            height: 48px;
            line-height: 48px;
            width: 179px;
            font-size: 18px;
            cursor: pointer;
        }
        .see-order{
            background:rgba(243,152,0,1);
            color:rgba(254,254,254,1);
            margin-right: 52px;
        }
        .continue{
            border:1px solid rgba(210,210,210,1);
            color:rgba(102,102,102,1);
        }
    }
}
</style>
