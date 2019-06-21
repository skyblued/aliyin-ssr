<template>
    <div class="vip">
        <div class="vip-pay" style="position: relative;min-height: 730px;">
            <div class="cancel">
                <span class="return">返回</span>
            </div>
            <div class="pay">
                <div class="pay-main">
                    <div class="payment">
                        <div class="item-object item">
                            <div class="title">
                                <span>选择类型</span>
                            </div>
                            <div class="checkbox-tp">
                                <div class="checkbox-content-tp type" v-for="(item,index) in vipList" :key="index" @click="handleClickName(index)" :class="{active:index == tabIndex, bargain:index == 1}">{{item.Name}}</div>
                            </div>
                        </div>
                        <div class="item-object item">
                            <div class="title">
                                <span>开通时长</span>
                            </div>
                            <div class="checkbox-tp" v-for="(item,i) in vipList" :key="i" v-show="i === tabIndex">
                                <div class="checkbox-content-tp" v-for="(tmp,index) in item.SonList" :key="index" :class="{active: activeBlock[i] === index}" @click="handleClickItem(index,i)">
                                    <p>{{tmp.Name}}</p>
                                    <p>
                                        ￥{{tmp.Price}}
                                        <span class="member-count">(0人)</span>
                                    </p>
                                    <p class="discount-price">
                                        <span class="blue" :title="tmp.Describe">{{tmp.Describe}}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="pay-container">
                            <div class="pay-container-tab">
                                <span class="active">快捷支付</span>
                                <span>余额支付</span>
                            </div>
                            <div class="pay-container-content">
                                <div class="coupon-container">
                                    <p class="coupon-use">使用优惠券/码</p>
                                </div>
                                <div class="qrcode-way">
                                    <div class="mpay-qrcode-container">
                                        <div class="qrcode-container">
                                            <img :src="code" alt="">
                                        </div>
                                        <div class="qr-price">
                                            <p class="discount-price blue">￥{{qrPrice}}</p>
                                        </div>
                                    </div>
                                    <p class="qr-tip">使用支付宝/微信扫码付款</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            teamNum: sessionStorage['teamNum'],
            vipList: [],
            tabIndex: 0,
            activeBlock: {},
            qrprice: '',
            code: ''
        }
    },
    methods: {
        getCode() {
            var str = window.location.host
            var link = 'http://' + str + '/pay/'
            var url = '/pay?Url=' + link + '&Action=' + 'VIP' + '&TeamNum=' + this.teamNum + '&Num=' + ''
            this.$axios.get(url).then(res =>{
                //console.log(res)
                if(res.status == 200){
                    this.code = res.data
                }
            })
        },


        getVipData() {
            this.$axios.get('/VipType').then(res => {
                this.vipList = res.data
            })
        },
        handleClickName(index) {
            this.tabIndex = index
        },
        handleClickItem(index,i) {
            this.$set(this.activeBlock, this.tabIndex, index)
            this.qrprice = this.vipList[i].SonList[index].Price
            // console.log(this.qrprice)
            var formData = new FormData()
            formData.append('vipnum', this.vipList[i].SonList[index].Num);
            formData.append('vipparentnum', this.vipList[i].SonList[index].ParentNum)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/BecomeVip', formData, config).then(res => {
                console.log(res)
                if(res.data.Status == 'Success'){
                    this.$message(res.data.Message)
                    sessionStorage.setItem('teamType', 'team')
                    history.go()
                }else{
                    this.$message(res.data.Message)
                }
            })
        }
    },
    mounted() {
        this.getVipData()
        this.getCode()
    },
    computed: {
        qrPrice() {
            return this.qrprice
        }
    }
}
</script>

<style lang="scss" scoped>
.vip-pay{
    width: 850px;
    height: 612px;
    margin: 64px auto 0;
}
.vip-pay .cancel{
    position: absolute;
    top: -30px;
    left: 0;
    cursor: pointer;
}
.vip-pay .cancel .return{
    color: #cdcdcd;
    font-size: 14px;
}
.vip-pay .pay{
    box-sizing: border-box;
    padding: 0 0 0 300px;
    width: 100%;
    height: 612px;
    position: relative;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0,0,0,.12);
}
.vip-pay .pay .pay-main{
    position: absolute;
    width: 550px;
    height: 612px;
    top: 0;
    left: 300px;
    background-color: #fbfbfb;
    box-sizing: border-box;
    padding: 10px 34px 0;
}
.vip-pay .pay .pay-main .payment{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.payment .item{
    width: 100%;
    height: auto;
    margin-bottom: 16px;
}
.payment .item .title{
    margin-bottom: 10px;
    text-align: left;
}
.payment .item .title span{
    font-size: 14px;
    color: #626262;
}
.payment .item .checkbox-tp{
    height: auto;
}
.payment .item .checkbox-tp .checkbox-content-tp{
    position: relative;
    display: inline-block;
    width: 150px;
    height: 94px;
    padding-top: 10px;
    outline: 1px solid #e7e7e7;
    text-align: center;
    vertical-align: middle;
    background-color: #fff;
    cursor: pointer;
}
.payment .item .checkbox-tp .checkbox-content-tp:hover{
    outline: 2px solid #07aefc;
}
.payment .item .checkbox-tp .checkbox-content-tp:not(:last-child){
    margin-right: 16px;
}
.payment .item .checkbox-tp .checkbox-content-tp.active{
    outline: 2px solid #07aefc;
    box-shadow: 0 2px 4px 0 rgba(7,174,252,.24);
}
.payment .item .checkbox-tp .type{
    height: 52px;
    line-height: 52px;
    font-size: 18px;
    color: #9b9b9b;
    padding-top: 0;
}
.payment .item .checkbox-tp .type.active{
    color: #07aefc;
}
.payment .item .checkbox-tp .checkbox-content-tp.bargain::before{
    background: url(//static.chuangkit.com/dist/price_chaozhi.svg?7d353b2f021743c1e4e6dfbfd47ad4de) no-repeat;
    width: 40px;
    height: 16px;
    content: "";
    position: absolute;
    top: -1px;
    right: -1px;
    background-size: contain;
}
.payment .item .checkbox-tp .checkbox-content-tp p:first-child{
    font-size: 14px;
    color: #9b9b9b;
}
.payment .item .checkbox-tp .checkbox-content-tp p:nth-child(2).one{
    margin-top: 12px;
}
.payment .item .checkbox-tp .checkbox-content-tp p:nth-child(2){
    height: 26px;
    font-size: 20px;
    color: #07aefc;
    margin-bottom: 2px;
}
.payment .item .checkbox-tp .checkbox-content-tp p:nth-child(2) .member-count{
    color: #9b9b9b;
    font-size: 12px;
}
.payment .item .checkbox-tp .checkbox-content-tp .discount-price{
    margin-top: 4px;
    color: #9b9b9b;
    font-size: 12px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.blue{
    color: #07aefc;
}

.pay-container .pay-container-tab>span{
    display: inline-block;
    width: 150px;
    color: #9b9b9b;
    font-size: 17px;
    line-height: 42px;
    text-align: center;
    cursor: pointer;
    transition: all .2s ease;
}
.pay-container .pay-container-tab>span.active{
    color: #626262;
    background-color: #fff;
}
.pay-container .pay-container-content{
    padding: 6px 16px 10px;
    background-color: #fff;
    text-align: center;
}
.pay-container .pay-container-content .coupon-container{
    text-align: left;
    margin-bottom: 32px;
}
.pay-container .pay-container-content .coupon-container .coupon-use{
    color: #07aefc;
    cursor: pointer;
}
.mpay-qrcode-container{
    position: relative;
    width: 120px;
    height: 120px;
    padding: 10px;
    text-align: center;
    background: #9b9b9b;
    background-image: url(//static.chuangkit.com/dist/qrcodeBg.png?e885343185824001906f59562d70f413);
    background-size: contain;
    margin: 0 auto 8px;
}
.qrcode-container{
    position: relative;
    width: 100px;
    height: 100px;
    img{
        width: 100%;
        height: 100%;
    }
}
.qr-price{
    position: absolute;
    top: 40px;
    left: 124px;
    text-align: left;
}
.qr-price .discount-price{
    font-size: 26px;
}
.qr-price p{
    white-space: nowrap;
}
.qr-tip{
    font-size: 12px;
    color: #9b9b9b;
}
</style>
