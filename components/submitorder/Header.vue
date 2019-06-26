<template>
    <div id="header">
        <div class="header">
            <div class="header-left">
                <nuxt-link to="/"><img src="/img/home/logo.svg" alt=""></nuxt-link>
                <p v-if="path == '/order/submitOrder'">提交订单</p>
                <p v-else-if="path == '/order/shoppingCart'">
                    我的购物车
                    <span>温馨提示：产品出货时间，以最终下单并付款的时间起算，请尽快下单结算</span>
                </p>
                <p v-else-if="path == '/voucher'">充值中心</p>
                <p v-else>收银台</p>
            </div>
            <div class="header-right">
                <span @click="handleJump('')">会员中心</span>
                <span>|</span>
                <span @click="handleJump('order')">我的订单</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: ''
        }
    },
    methods: {
        handleJump(title) {
            this.title = title
            this.$router.push('/personal/' + title)
        },
    },
    computed: {
        path() {
            return this.$route.path
        }
    }
}
</script>

<style lang="scss" scoped>

#header{
    width: 100%;
    background: rgba(255,255,255,1);
    box-shadow:0px 0px 44px 10px rgba(203,211,217,0.4);
}
.header{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    color:rgba(51,51,51,1);
    .header-left{
        display: flex;
        align-items: center;
        font-size:20px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        img{
            margin-right: 57px;
            width: 178px;
            height: 55px;
        }
        p span{
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(153,153,153,1);
        }
    }
    .header-right{
        line-height: 70px;
        font-size: 14px;
        span{
            cursor: pointer;
        }
        span:nth-child(2){
            margin: 0 10px;
        }
        span:last-child{
            color: $color;
            text-decoration: underline;
        }
    }
}
</style>
