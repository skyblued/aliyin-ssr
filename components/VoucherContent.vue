<template>
    <div id="voucher-content">
        <div class="voucher-content">
            <div class="content-tabs">
                <div :class="['tabs-item', activeIndex == i ? 'active' : '']" v-for="(item,i) in tabsList" :key="i" @click="handleChoose(i)">
                    <img :src="item.imgUrl" alt="">
                    <span>{{item.title}}</span>
                </div>
            </div>
            <div class="content-list">
                <div class="personal-vip">
                    <p class="title">1.选择会员类型</p>
                    <div class="vip-type">
                        <div :class="['vip-type-item', typeIndex == index ? 'active' : '']" v-for="(items, index) in vipTypeList" :key="index" @click="handleChooseType(index)">
                            <p class="vip-time">{{items.time}}</p>
                            <p class="vip-price">￥<span>{{items.price}}</span></p>
                            <p class="vip-unit-price">￥{{items.unitPrice}}</p>
                        </div>
                    </div>
                    <p class="title">2.扫码付款</p>
                    <div class="vip-payment">
                        <img class="code" :src="code" alt="">
                        <!-- <span class="refresh-mask" v-if="showCode" @click="handleRefresh">二维码过期点击刷新</span> -->
                        <p class="zhifu-price">应付金额: <span>599元</span></p>
                        <p>
                            <img :src="$store.state.port.staticPath + '/img/home/cashier/zfb_icon.png'" alt="">
                            <img class="wechat" :src="$store.state.port.staticPath + '/img/home/cashier/wechat_icon.png'" alt="">
                            <span>支持微信、支付宝扫码付款</span>
                        </p>
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
            tabsList: [{
                id: 1,
                imgUrl: '',
                title: '个人VIP'
            },{
                id: 2,
                imgUrl: '',
                title: '企业VIP'
            },{
                id: 3,
                imgUrl: '',
                title: '集团VIP'
            }],
            activeIndex: 0,
            vipTypeList: [{
                id: 1,
                time: '1个月',
                price: '99',
                unitPrice: '99/月'
            },{
                id: 2,
                time: '6个月',
                price: '594',
                unitPrice: '99/月'
            },{
                id: 3,
                time: '12个月',
                price: '599',
                unitPrice: '59/月'
            },{
                id: 4,
                time: '24个月',
                price: '1198',
                unitPrice: '59/月'
            }],
            typeIndex: 0,
            code: '',
            teamNum: sessionStorage['teamNum'],
        }
    },
    methods: {
        handleChoose(i) {
            this.activeIndex = i
        },
        handleChooseType(index) {
            this.typeIndex = index
        },
        getCode() {
            var str = window.location.host
            var link = 'http://' + str + '/pay/'
            var url = '/pay?Url=' + link + '&Action=' + 'PrintShop' + '&TeamNum=' + this.teamNum + '&Num=' + '' + '&OrderCode=' + ''
            this.$axios.get(url).then(res =>{
                //console.log(res)
                if(res.status == 200){
                    this.code = res.data
                }
            })
        },
    },
    mounted() {
        this.getCode()
    }
}
</script>

<style lang="scss" scoped>

#voucher-content{
    width: 100%;
    background: rgba(244,244,244,1);
    user-select: none;
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 39px;
}
.voucher-content{
    width: 1200px;
    margin: 0 auto;
    .content-tabs{
        height: 76px;
        line-height: 76px;
        background: rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        display: flex;
        padding-left: 19px;
        .tabs-item{
            width: 82px;
            font-size: 18px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color:rgba(153,153,153,1);
            margin-right: 64px;
            text-align: center;
            position: relative;
            cursor: pointer;
            &:hover{
                color: $color;
            }
            &:hover::before{
                content: '';
                background-image: url(/img/personal/line_icon.png);
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
            }
        }
        .active{
            color: $color;
            &::before{
                content: '';
                background-image: url(/img/personal/line_icon.png);
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
            }
        }
    }
    .content-list{
        background:rgba(255,255,255,1);
        border-radius:10px;
        margin-top: 16px;
        padding: 30px 26px;
        .title{
            color:rgba(102,102,102,1);
            margin-bottom: 27px;
        }
        .vip-type{
            display: flex;
            justify-content: space-between;
            margin-bottom: 46px;
            .vip-type-item{
                position: relative;
                background:rgba(255,255,255,1);
                border: 2px solid rgba(238,238,238,1);
                box-shadow: 0px 0px 6px 0px rgba(196,196,196,0.2);
                border-radius: 10px;
                text-align: center;
                width: 260px;
                height: 140px;
                font-size: 16px;
                padding: 0 30px;
                color:rgba(102,102,102,1);
                cursor: pointer;
                &:hover{
                    border:2px solid rgba(255,150,0,1);
                }
                &:hover::before{
                    content: '';
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background-image: url(/img/print/choose_yellow.png);
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
                .vip-price span{
                    display: inline-block;
                    font-size: 40px;
                    line-height: 40px;
                    font-weight: bold;
                    color:rgba(255,6,0,1);
                    margin: 15px 0 13px 16px;
                }
                .vip-price{
                    border-bottom: 1px solid rgba(238,238,238,1);
                }
                .vip-unit-price, .vip-time{
                    margin: 14px 0 0;
                    line-height: 16px;
                }
            }
            .active{
                border:2px solid rgba(255,150,0,1);
                &::before{
                    content: '';
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background-image: url(/img/print/choose_yellow.png);
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
            }
        }
        .vip-payment{
            text-align: center;
            position: relative;
            .code{
                border:1px solid rgba(210,210,210,1);
                background:rgba(255,255,255,1);
                width: 240px;
                height: 240px;
            }
            .zhifu-price {
                font-size: 14px;
                margin-bottom: 14px;
                margin-top: 20px;
                span{
                    font-size: 16px;
                    color: rgba(255, 0, 0, 1);
                }
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
