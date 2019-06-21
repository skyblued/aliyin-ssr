<template>
    <div id="coupons">
        <div class="coupons">
            <div class="coupons-list" v-if="couponList.length">
                <div :class="{'coupons-item': true, 'coupons-mark' : item.ID == ''}" v-for="(item,i) in couponList" :key="i" @click="handleReceive(item,i)">
                    <img :src="$store.state.port.imgBaseUrl+item.ImageUrl" :title="item.ID == '' ? '已领取' : '点击领取'">
                </div>
            </div>
            <div class="coupons-tips" v-if="!couponList.length">
                <img :src="$store.state.port.staticPath + '/img/home/no-data.png'" alt="">
                <span>暂无可领取优惠券</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            couponList: []
        }
    },
    methods: {
        // 获取可领取优惠券列表
        getCouponsList() {
            this.$axios.get('/Coupons').then(res => {
                console.log(res.data)
                this.couponList = res.data
            })
        },
        // 领取优惠券
        handleReceive(item,i) {
            if(!localStorage['token']){
                this.$message({type: 'warning', message: '请先登录'})
                this.$store.commit('setDialogType', 'login')
            }else{
                if(item.ID == '') return
                let couponId = this.couponList[i].ID
                var formData = new FormData()
                formData.append('CouponID', couponId);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/UserCoupon', formData, config).then(res => {
                    console.log(res.data)
                    if(res.data.status == 'success'){
                        this.couponList[i].ID = ''
                        this.$message({type: 'success', message: res.data.msg})
                        //this.getCouponsList()
                    }else{
                        this.$message({type: 'warning', message: res.data.msg})
                    }
                })
            }
        },
    },
    mounted() {
        this.getCouponsList()
    }
}
</script>

<style lang="scss" scoped>
#coupons{
    width: 100%;
    .coupons{
        width: 1200px;
        margin: 0 auto;
        padding: 25px 0 63px;
        .coupons-list{
            display: flex;
            flex-wrap: wrap;
            .coupons-item{
                margin-right: 20px;
                cursor: pointer;
            }
            .coupons-mark{
                cursor: not-allowed;
                opacity: .3;
            }
        }
        .coupons-tips{
            display: flex;
            flex-direction: column;
            width: 208px;
            margin: 0 auto;
            text-align: center;
            span{
                margin-top: 20px;
            }
        }
    }
}
</style>
