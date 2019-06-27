<template>
    <div id="landing">
        <HeaderTop></HeaderTop>
        <Header id="header" :isFixed="isFixed" :barList="barList" :class="{fixed : isFixed}"></Header>
        <el-carousel trigger="click" indicator-position="none">
            <el-carousel-item v-for="(items,i) in banner" :key="i">
                <img :src="items.Image && $store.state.port.imgBaseUrl + items.Image" alt="">
            </el-carousel-item>
        </el-carousel>
        <div class="landing" :style="{'background-image' : `url(${background && $store.state.port.imgBaseUrl + background})`}">
            <div class="advertise">
                <img src="/img/themes/horn.png" alt="">
                <div class="marbox">
                    <ul ref="mar" :class="{martop: animate == true}">
                        <li v-for="(item,i) in items" :key="i">
                            <p>
                                手机号
                                <span>{{item.ShipCellPhone}}</span> 的
                                <span>{{item.ShipName}}</span> 购买了
                                <span style="color: #024BB4;">{{item.ShipAddress}}</span>
                            </p>
                            <span>{{item.CreateDate.split('T').join(' ')}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="landing-tips">
                <img src="/img/themes/left.png" alt="">
                <p>领券后下单更实惠</p>
                <img src="/img/themes/left.png" alt="">
            </div>
            <ul class="landing-coupon">
                <li v-for="(item,i) in couponList" :key="i">
                    <p>- 满{{item.LimitPrice}}元使用 -</p>
                    <p>{{item.Amount}}<span>元</span></p>
                    <div class="receive-btn">
                        <span @click="handleReceive(item)" :class="{active: item.IsReceived == 1}">{{item.IsReceived == 0 ? '立即领取' : '领取成功'}}</span>
                    </div>
                </li>
            </ul>

            <HotShow></HotShow>
            <FanOffer></FanOffer>
            <SelfDesign :Tplcategory="Tplcategory"></SelfDesign>
            <ServiceShow></ServiceShow>

            <div class="introduction">
                <div class="introduction-title">
                    <p>阿里印平台介绍</p>
                    <p>专注研究人工智能设计器</p>
                </div>
                <div class="introduction-content">
                    <div class="content">
                        <img src="/img/themes/introduction_icon.png" alt="">
                    </div>
                </div>
            </div>
            <Footer :qrcode="qrcode" :articleList="articleList"></Footer>
        </div>
    </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import Header from '@/components/home/Header.vue'
import HotShow from '@/components/themes/HotShow.vue'
import FanOffer from '@/components/themes/FanOffer.vue'
import SelfDesign from '@/components/themes/SelfDesign.vue'
import ServiceShow from '@/components/themes/ServiceShow.vue'
import Footer from '@/components/Footer'
export default {
    components: {
        HeaderTop,
        Header,
        HotShow,
        FanOffer,
        SelfDesign,
        ServiceShow,
        Footer
    },
    async asyncData({app, $axios, route, store, query, req, redirect, error}) {
		
		let [AllTemplate, Advertising, FooterCode, FooterArticle] = await Promise.all([
            $axios.get(store.state.port.AllTemplate),
            $axios.get('/LandingPage?PageID=3'),
			$axios.get(store.state.port.Advertise + '?ID=136'),
			$axios.get('/Articles')
		])
		return {
            barList: AllTemplate.data,
			qrcode: FooterCode.data.Advertisements[0].FileUrl,
			articleList: FooterArticle.data,
			isFixed: false,
            marginTop: 0,
            background: Advertising.data.Background,
            banner: Advertising.data.Banners,
            casesList: Advertising.data.Cases,
            couponList: Advertising.data.Coupons.reverse(),
            Tplcategory: Advertising.data.Tplcategory,
            items: Advertising.data.OrderDelivers,
            animate: false,
		}
	},
    filters: {
        capitalize: function(value) {
            let endLen;
            if(value.length > 2) {
                endLen = 1
            }else{
                endLen = 0
            }
            var len = value.length-1-endLen;
            var xing = '';
            for (var i=0;i<len;i++) {
                xing+='*';
            }
            return value.substring(0,1)+xing+value.substring(value.length-endLen);
        }
    },
    created() {
        setInterval(this.scroll, 2000)
    },
    methods: {
        scrollToTop() {  // 固定导航栏
			let osTop = document.documentElement.scrollTop || document.body.scrollTop
			if (osTop >= 40) {
				this.isFixed = true
				this.marginTop = document.querySelector('#header').offsetHeight + 'px'
			} else {
				this.isFixed = false
				this.marginTop = 0
			}
		},
        scroll() {  // 滚动广告
            if(!this.$refs.mar) return
            let mar = this.$refs.mar;
            mar.style.marginTop = '-22px'
            this.animate = !this.animate
            setTimeout(() => {
                this.items.push(this.items[0])
                this.items.shift()
                mar.style.marginTop = '0px'
                this.animate = !this.animate
            }, 1000)
        },
        // 领取优惠券
        handleReceive(item) {
            if(!localStorage['token']){
                this.$message({type: 'warning', message: '请先登录'})
                this.$store.commit('login/toggleShow', true)
                return
            }else{
                if(item.IsReceived == 1) return
                var formData = new FormData()
                formData.append('CouponID', item.ID);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/UserCoupon', formData, config).then(res => {
                    // console.log(res.data)
                    if(res.data.status == 'success'){
                        item.IsReceived = 1
                        this.$message.success(res.data.msg)
                    }else{
                        this.$message.warning(res.data.msg)
                    }
                })
            }
        },
    },
    mounted() {
        window.addEventListener('scroll', this.scrollToTop)
    },
    destroyed () {
		window.removeEventListener('scroll', this.scrollToTop); 
	},
}
</script>

<style lang="scss" scoped>
#landing /deep/ .el-carousel__container{
    height: 1349px;
}
.el-carousel img{
    width: 100%;
    height: 100%;
}
.landing{
    width: 100%;
    height: 100%;
    background-repeat: repeat-y;
    padding-top: 200px;
    margin-top: -400px;
    .advertise{
        width: 1130px;
        height: 128px;
        margin: 0 auto 56px;
        background-image: url(/img/themes/info_adver.gif);
        background-repeat: no-repeat;
        padding: 0 25px;
        display: flex;
        align-items: center;
        position: relative;
        img{
            padding-left: 38px;
        }
        .marbox{
            position: relative;
            width: 913px;
            height: 22px;
            line-height: 22px;
            margin-left: 23px;
            overflow: hidden;
        }
        ul{
            width: 100%;
            li{
                display: flex;
                justify-content: space-between;
                height: 22px;
                line-height: 22px;
                font-size:22px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(51,51,51,1);
                span{
                    display: inline-block;
                }
            }
        }
        .martop{
            transition: all .5s;
        }
    }
    .landing-tips{
        display: flex;
        align-items: center;
        width: 850px;
        height: 50px;
        margin: 0 auto 54px;
        p{
            font-size:52px;
            font-family:SourceHanSansSC-Medium;
            font-weight:500;
            color:rgba(2,75,180,1);
            margin: 0 32px;
        }
    }
    .landing-coupon{
        display: flex;
        justify-content: space-between;
        width: 1200px;
        margin: 0 auto 88px;
        li{
            width: 296px;
            height: 183px;
            background-image: url(/img/themes/coupons.png);
            background-repeat: no-repeat;
            position: relative;
            text-align: center;
            p:first-child{
                font-size:25px;
                font-family:SourceHanSansCN-Regular;
                font-weight:400;
                color:rgba(88,91,94,1);
                margin-top: 14px;
                padding-right: 10px;
            }
            p:nth-child(2){
                font-size:80px;
                height: 60px;
                line-height: 60px;
                font-family:STHupo;
                font-weight:400;
                color:rgba(2,75,180,1);
                margin: 9px 0 13px;
                span{
                    font-size:32px;
                    font-family:SourceHanSansCN-Regular;
                    font-weight:bold;
                }
            }
            .receive-btn{
                width: 255px;
                margin-left: 8px;
                border-top: 2px dashed rgba(186,187,180,1);
                span{
                    display: inline-block;
                    width: 133px;
                    height: 29px;
                    line-height: 29px;
                    color: rgba(255,255,255,1);
                    text-align: center;
                    background:linear-gradient(0deg,rgba(13,105,189,1),rgba(19,113,200,1),rgba(55,152,241,1));
                    box-shadow:0px 2px 0px 0px rgba(255,255,255,1);
                    border-radius:14px;
                    margin-top: 8px;
                    cursor: pointer;
                }
                .active{
                    background: rgba(186,187,180,1);
                    cursor: default;
                }
            }
        }
    }
    .introduction{
        width: 1266px;
        margin: 0 auto;
        .introduction-title{
            width: 700px;
            height: 203px;
            margin: 0 auto;
            background-image: url(/img/themes/cloud.png);
            background-repeat: no-repeat;
            padding-top: 58px;
            text-align: center;
            p:first-child{
                font-size: 50px;
                font-family: SourceHanSansSC-Heavy;
                font-weight: 800;
                color:rgba(254,112,53,1);
            }
            p:last-child{
                font-size: 23px;
                font-family: MicrosoftYaHei;
                font-weight: 400;
                color:rgba(51,51,51,1);
                margin-top: 15px;
            }
        }
        .introduction-content{
            width: 1136px;
            margin: 46px auto 110px;
            background:rgba(0,156,238,1);
            box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.33);
            border-radius: 15px;
            padding: 13px;
            .content{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1110px;
                background:rgba(255,255,255,1);
                border-radius: 15px;
                padding: 40px 0;
            }
        }
    }
}
</style>
