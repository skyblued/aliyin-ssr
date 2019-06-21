<template>
    <div id="pay-fail">
        <div class="pay-fail">
            <div class="fail-order-info">
                <p class="title">订单信息</p>
                <div class="fail-info">
                    <div class="info">
                        <img :src="$store.state.port.staticPath + '/img/home/cashier/fork_icon.png'" alt="">
                        <div class="tips">
                            <p class="first">订单号：19582256688 支付失败！</p>
                            <p>失败原因：该笔订单已通过其他渠道完成支付！</p>
                            <p v-if="!show">收货地址：刘冰  15989665569    湖北省 武汉市 洪山区 鲁磨路国光大厦B座2222室</p>
                            <el-collapse-transition>
                                <div v-if="show">
                                    <div class="detail">
                                        <p>订单号: 195558885994</p>
                                        <p>收货地址：刘冰  15989665569    湖北省 武汉市 洪山区 鲁磨路国光大厦B座2222室</p>
                                        <p>商品名称: 铜版纸覆哑膜   92*56mm 100g铜版纸   覆亚膜</p>
                                        <p style="margin-left: 64px;">铜版纸覆哑膜   92*56mm 100g铜版纸   覆亚膜</p>
                                        <p style="margin-left: 64px;">铜版纸覆哑膜   92*56mm 100g铜版纸   覆亚膜</p>
                                        <p>发票信息：电子发票    个人</p>
                                    </div>
                                </div>
                            </el-collapse-transition>
                        </div>
                    </div>
                    <div class="cashier-price">
                        应付总额: 
                        <span class="price">3600.00</span>
                        元
                        <p class="info-detail" @click="show = !show">
                            <span>订单详情</span>
                            <img :class="show ? 'is-active' : ''" :src="$store.state.port.staticPath + '/img/home/cashier/orange_down_icon.png'" alt="">
                        </p>
                    </div>
                </div>
                <div class="fail-bottom">
                    <div class="try-pay">重新支付</div>
                    <div class="continue">继续购物</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            show: false
        }
    }
}
</script>

<style lang="scss" scoped>
#pay-fail{
    width: 100%;
    background: rgba(244,244,244,1);
    user-select: none;
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 39px;
}
.pay-fail{
    width: 1200px;
    margin: 0 auto 356px;
    .fail-order-info{
        background:rgba(255,255,255,1);
        border-radius:10px;
        padding: 25px;
        .title{
            font-size:18px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,51,51,1);
        }
        .fail-info{
            background: rgba(254,250,242,1);
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
                        color:rgba(243,152,0,1);
                    }
                    .detail{
                        margin-top: 50px;
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
                    color:rgba(227,142,0,1);
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
    .fail-bottom{
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
        .try-pay{
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
