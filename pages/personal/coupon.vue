<template>
    <div id="coupon">
        <div class="coupon">
            <div class="coupon-header">
                <div class="coupon-tab" @click="getCanUserCoupon('0')">
                    <span :class="{active: activeIndex == '0'}">全部</span>
                </div>
                <div class="coupon-tab" @click="getCanUserCoupon('1')">
                    <span :class="{active: activeIndex == '1'}">有效</span>
                </div>
                <div class="coupon-tab" @click="getCanUserCoupon('-1')">
                    <span :class="{active: activeIndex == '-1'}">已过期</span>
                </div>
            </div>
            <div class="coupon-list" v-if="couponList.length">
                <div class="coupon-item" v-for="(item,i) in couponList" :key="i">
                    <img class="box1" :src="$store.state.port.imgBaseUrl+item.Coupon.ImageUrl" alt="" @click="handleOpen(item)">
                    <div class="box2">
                        <p>消费满{{item.Coupon.LimitPrice}}元减{{item.Coupon.Amount}}元，可使用一张</p>
                        <p>有效期: {{item.Coupon.EffectiveDays + '天后过期'}}</p>
                    </div>
                </div>
                <div class="coupon-item" style="height: 0px;margin-bottom: 0;visibility: hidden;"></div>
                <div class="coupon-item" style="height: 0px;margin-bottom: 0;visibility: hidden;"></div>
                <div class="coupon-item" style="height: 0px;margin-bottom: 0;visibility: hidden;"></div>
                <div class="coupon-item" style="height: 0px;margin-bottom: 0;visibility: hidden;"></div>
                <div class="coupon-item" style="height: 0px;margin-bottom: 0;visibility: hidden;"></div>
            </div>

            <div class="coupon-tip" v-if="!couponList.length && !show">
                <img src="/img/error/ku.png" alt="">
                <p>暂无此优惠券</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            couponList: [],
            activeIndex: '0',
            startDate: '',
            valueTime: '',
            // endTime: ''
            show: true,
        }
    },
    methods: {
        // 获取已领取优惠券列表
        getCanUserCoupon(i) {
            this.activeIndex = i
            let isExpired = i
            this.$axios.get('/UserCoupons?IsExpired=' + isExpired).then(res => {
                console.log(res.data)
                if(res.data == null) return this.couponList = []
                if(res.data.length > 0) this.show = false
                this.couponList = res.data.filter(item => {if(item.Coupon) return item})
            })
        },
        handleOpen(item) {
            item.IsEnable = !item.IsEnable
        },
    },
    mounted() {
        this.getCanUserCoupon('0')
    }
}
</script>

<style lang="scss" scoped>

#coupon{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.coupon{
    min-width: 1200px;
    margin: 0 auto;
    .coupon-header{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        line-height: 76px;
        display: flex;
        padding-left: 48px;
        .coupon-tab{
            width: 82px;
            text-align: center;
            margin-right: 31px;
            cursor: pointer;
            position: relative;
            color:rgba(153,153,153,1);
            font-size: 18px;
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
    .coupon-list{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        padding: 32px 30px;
        margin-top: 37px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .coupon-item{
            width: 270px;
            height: 96px;
            margin-bottom: 35px;
            position: relative;
            img{
                cursor: pointer;
            }
            .box1, .box2{
                width: 100%;
                height: 96px;
                position: absolute;
                top: 0;
                left: 0;
                transition: all, 1s;
                backface-visibility: hidden;
                background-position: 50%;
                background-size: contain;
                background-repeat: no-repeat;
            }
            .box1{
                z-index: 2;
                padding-left: 30px;
                display: flex;
                align-items: center;
                // p:first-child{
                //     font-weight:400;
                //     color:rgba(0,0,0,1);
                //     font-size:26px;
                //     font-family:SourceHanSansCN-Normal;
                //     span:last-child{
                //         font-size:52px;
                //         font-family:HYYaKuHeiW;
                //         line-height:32px;
                //         position: relative;
                //         &::before{
                //             content: '￥';
                //             display: inline-block;
                //             position: absolute;
                //             top: 6px;
                //             left: -24px;
                //             font-size: 26px;
                //         }
                //     }
                // }
                // p:last-child{
                //     font-size:20px;
                //     font-family:SourceHanSansCN-Regular;
                //     font-weight:400;
                //     color:rgba(0,0,0,1);
                //     span{
                //         display: block;
                //     }
                //     span:first-child{
                //         margin-top: -10px;
                //         margin-bottom: 10px;
                //     }
                //     span:last-child{
                //         width: 92px;
                //         height:25px;
                //         line-height: 21px;
                //         text-align: center;
                //         font-size: 16px;
                //         margin: 0 auto;
                //         background:rgba(255,255,255,1);
                //         border:1px solid rgba(0, 0, 0, 1);
                //     }
                // }
            }
            .box2{
                transform: rotateY(180deg);
                font-family:SourceHanSansCN-Regular;
                font-weight:400;
                color:rgba(0,0,0,1);
                text-align: center;
                padding-top: 25px;
                p:first-child{
                    font-size:15px;
                    margin-bottom: 10px;
                }
                p:last-child{
                    font-size:18px;
                }
            }
            // .box{
            //     position: relative;
            //     top: -5px;
            // }
            // .transition-box{
            //     text-align: center;
            //     font-size:12px;
            //     font-family:MicrosoftYaHei;
            //     font-weight:400;
            //     color:rgba(51,51,51,1);
            //     line-height:20px;
            //     padding: 21px 26px 29px;
            //     border-top: 2px dashed rgba(255,255,255,1);
            //     background:rgba(255,225,228,1);
            //     p:first-child{
            //         color:rgba(191,92,121,1);
            //         font-size: 16px;
            //     }
            //     p:nth-child(2){
            //         margin: 18px 0;
            //         text-align: left;
            //     }
            // }
        }
        .coupon-item:hover .box1{
            transform: rotateY(180deg);
        }
        .coupon-item:hover .box2{
            transform: rotateY(0deg);
        }
    }
    .coupon-tip{
        margin-top: 200px;
        text-align: center;
    }
}
</style>
