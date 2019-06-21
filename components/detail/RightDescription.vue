<template>
    <div class="description">
        <div class="description-header">
            <div class="author">
                <img src="" alt="">
                <div class="author-title">
                    <p class="name">{{info.Author}}</p>
                    <p class="time">
                        <span>上传时间 : </span>
                        <span>{{info.AddTime | ToSplit}}</span>
                    </p>
                </div>
            </div>
            <div class="tips">
                <p>
                    <img :src="$store.state.port.staticPath + '/img/home/use_icon.png'" alt="">
                    <span>{{info.Visits}}使用</span>
                </p>
                <p>
                    <img :src="$store.state.port.staticPath + '/img/home/collect-icon.png'" alt="">
                    <span>{{info.Counts}}收藏</span>
                </p>
            </div>
        </div>
        <div class="item-shop">
            <p class="item-shop-tips" v-if="info.Price == 1 || info.Price == 2">
                <span class="price-title">价格 : </span>
                <span class="price">￥10.0</span>
                <span class="free">会员免费用</span>
            </p>
            <p class="item-shop-tips" v-else>
                <span class="price-title">价格 : </span>
                <span class="free">免费</span>
            </p>
            <div class="buy-btn" @click="dialogVisible = true" v-if="info.Price == 1 || info.Price == 2">购买模板</div>
            <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
                <div class="buy-temp-title">
                    <img class="temp-img" :src="$store.state.port.imgBaseUrl+info.FacePicture" alt="">
                    <div class="buy-temp-tips">
                        <p class="temp-title">{{info.Name}}</p>
                        <p class="item-shop-tips">
                            <span class="price-title">价格 : </span>
                            <span class="free" v-if="info.Price">￥{{info.Price.toFixed(2)}}</span>
                        </p>
                        <div class="pay-mode">
                            <div class="wx-pay">
                                <img class="pay-choose-img" @click="handleChoose" :src="image" alt="">
                                <img class="pay-img" :src="$store.state.port.staticPath + '/img/home/WeChat_Pay.png'" alt="">
                                <span class="pay-tips">微信支付</span>
                            </div>
                            <div class="zfb-pay">
                                <img class="pay-choose-img" @click="handleChoose1" :src="image1" alt="">
                                <img class="pay-img" :src="$store.state.port.staticPath + '/img/home/Alipay_pay.png'" alt="">
                                <span class="pay-tips">支付宝支付</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="qrcode">
                    <img v-if="show == 'wx'" :src="$store.state.port.staticPath + '/img/Qrcode.png'" alt="">
                    <img v-if="show == 'zfb'" :src="$store.state.port.staticPath + '/img/Qrcode.png'" alt="">
                </div>
                <div class="buy-temp-btn">升级VIP免费下载</div>
            </el-dialog>
        </div>
        <div class="freeuse-btn" @click="handleJump" v-if="info.Price == 1 || info.Price == 2">会员免费使用</div>
        <div class="freeuse-btn" @click="handleJump" v-else>立即使用</div>
        <div class="item-tag">
            <p>标签</p>
            <div class="tag" v-if="info.Keywords">
                <span v-for="(item,i) in info.Keywords.split(' ')" :key="i">{{item}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            dialogVisible: false,
            activeName: 'first',
            image: '/img/home/choose.png',
            image1: '/img/home/choose_hl.png',
            show: 'zfb'
        }
    },
    props: ['info'],
    methods: {
        handleJump() {
            this.$emit('copyTemplate')
            // var url = this.$router.resolve({path: '/designer', query: {t: this.info.TemplateNumber, identity: 0, type: 'center', muban: 'muban'}})
            // window.open(url.href, '_blank')
        },
        handleChoose() {
            if(this.image1){
                this.image = '/img/home/choose_hl.png'
                this.image1 = '/img/home/choose.png'
                this.show = 'wx'
            }
        },
        handleChoose1() {
            if(this.image == '/img/home/choose_hl.png'){
                this.image1 = '/img/home/choose_hl.png'
                this.image = '/img/home/choose.png'
                this.show = 'zfb'
            }
        }
    },
    filters: {
        ToSplit(time) {
            if (!time) return
            //console.log(time)
            time = time.split(' ')[0].replace(/\//ig, '-')
            return time
        }
    },
}
</script>

<style lang="scss" scoped>

.description /deep/ .el-dialog{
    width: 672px;
    height: 676px;
    border-radius:10px;
}
.buy-temp-title{ 
    display: flex;
    .temp-img{
        width: 140px;
        height: 140px;
    }
    .buy-temp-tips{
        margin-left: 25px;
        .temp-title{
            font-size:23px;
            font-family:MicrosoftYaHei-Bold;
            font-weight:bold;
            color:rgba(51,51,51,1);
        }
        .item-shop-tips{
            margin: 12px 0;
        }
    }
    .pay-mode{
        display: flex;
        .wx-pay, .zfb-pay{
            display: inline-block;
            overflow: hidden;
            line-height: 48px;
        }
        .pay-choose-img{
            margin-right: 18px;
            float: left;
            margin-top: 12px;
            cursor: pointer;
        }
        .pay-img{
            margin-right: 13px;
            float: left;
        }
        .pay-tips{
            font-size:17px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,51,51,1);
            float: left;
            margin-right: 41px;
        }
    }
}
.qrcode{
    width:290px;
    height:290px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(210,210,210,1);
    margin: 46px auto;
}
.buy-temp-btn{
    width: 289px;
    margin: 0 auto;
    background: $color;
    border-radius:5px;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(254,254,254,1);
    text-align: center;
    line-height: 48px;
    cursor: pointer;
}

.description /deep/ .el-dialog__header{
    padding: 0;
    .el-dialog__headerbtn{
        position: absolute;
        top: 20px;
        right: -45px;
        .el-dialog__close{
            width: 24px;
            height: 24px;
            background-image: url(/img/home/fork_white.png);
            &::before{
                content: '';
            }
        }
    }
}
.description /deep/ .el-dialog__body{
    padding-top: 44px;
    padding-left: 37px;
}


// @import url('/css/init.scss');
.description{
    width: 349px;
    margin-left: 35px;
    margin-top: 37px;
}
.description .description-header{
    margin-bottom: 22px;
}
.description .description-header .author{
    display: flex;
}
.description .description-header .author img{
    display: inline-block;
    width:56px;
    height:56px;
    background:rgba(51,51,51,1);
    border-radius:50%;
    vertical-align: middle;
}
.description .description-header .author .author-title{
    display: inline-block;
    font-family:MicrosoftYaHei;
    font-weight:400;
    margin-left: 17px;
}
.description .description-header .author .author-title .name{
    height:17px;
    line-height: 17px;
    font-size:18px;
    color:rgba(51,51,51,1);
    margin-bottom: 12px;
    margin-top: 5px;
}
.description .description-header .author .author-title .time{
    font-size:14px;
    color:rgba(153,153,153,1);
}
.description .description-header .author .author-title .time span:first-child{
    margin-right: 5px;
}

.description .description-header .tips{
    display: flex;
    margin-top: 31px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.description .description-header .tips p:first-child{
    margin-right: 24px;
}
.description .description-header .tips p img{
    vertical-align: middle;
    margin-right: 7px;
}


.description .item-shop{
    width:100%;
    background:rgba(241,241,242,1);
    border-radius:5px;
    padding: 15px;
    .buy-btn{
        float: right;
        border:1px solid $color;
        border-radius:5px;
        padding: 8px 10px;
        font-size: 14px;
        color:$color;
        margin-top: -3px;
        cursor: pointer;
        &:hover{
            color: rgba(255,255,255,1);
            background: $color;
        }
    }
}
.description .item-shop .item-shop-tips{
    display: inline-block;
    line-height: 26px;
    overflow: hidden;
}
.description .item-shop .item-shop-tips .price-title{
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(102,102,102,1);
    margin-right: 6px;
    float: left;
}
.description .item-shop .item-shop-tips .price{
    font-size:20px;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(51,51,51,1);
    margin-right: 10px;
    float: left;
}
.description .item-shop .item-shop-tips .free{
    font-size:16px;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(255,47,64,1);
    float: left;
}

.description .freeuse-btn{
    background:$color;
    border-radius:5px;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(254,254,254,1);
    text-align: center;
    line-height: 48px;
    margin-top: 31px;
    cursor: pointer;
}

.description .item-tag p{
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin-bottom: 20px;
    margin-top: 46px;
}
.description .item-tag span{
    float: left;
    border:1px solid rgba(229,229,229,1);
    border-radius:2px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(102,102,102,1);
    padding: 6px 8px; 
    margin-right: 18px;
    margin-bottom: 12px;
    cursor: pointer;
    &:hover{
        color: $color;
    }
}
</style>
