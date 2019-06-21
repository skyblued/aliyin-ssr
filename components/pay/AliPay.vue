<template>
    <div class="ali-pay">
        <!-- <div class="pay">
            <p class="pay-item">正在付款</p>
            <p class="pay-item">¥{{price && price.toFixed(2)}}</p>
            <p class="pay-item">订单金额：¥{{price && price.toFixed(2)}}</p>
            <p class="pay-item">订单号：{{c}}</p>
            <div class="pay-btn" @click="handleJump">重新支付</div>
        </div> -->
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
            //link: '',
            //price: ''
        }
    },
    methods: {
        // 获取订单金额信息
        // getOrder() {
        //     this.$axios.get('/Order?orderCode=' + this.c).then(res =>{
        //         //console.log(res.data)
        //         this.price = res.data.Amount
        //     })
        // },


        // handleJump() {
        //     window.location.href = this.link
        // },
        // 获取支付链接
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
                console.log(res.data)
                window.location.href = res.data
                //this.link = res.data
            })
        }
    },
    mounted() {
        this.t = this.$route.query.t
        this.c = this.$route.query.c
        this.n = this.$route.query.n
        this.a = this.$route.query.a
        this.u = this.$route.query.u
        this.type = this.$route.query.type
        this.getPayLink()
        //this.getOrder()
    }
}
</script>

<style lang="scss" scoped>
.ali-pay{
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
        background-image: url(/img/print/zfb_bg.png);
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
        background:rgba(0,131,233,1);
        border-radius:46px;
        color: rgba(255,255,255,1);
    }
}
</style>
