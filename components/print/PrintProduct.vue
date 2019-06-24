<template>
    <div class="print-product">
        <div class="product-list">
            <div class="product-item" v-for="(item,i) in floorList" :key="i">
                <p class="product-title">{{item.Name}}</p>
                <div class="product-content">
                    <!-- <img src="/img/print/xcyp_bg.png" alt=""> -->
                    <div class="mode1" @click="handleJumpDetail(item,item.Mode1_Link0)">
                        <img :src="$store.state.port.imgBaseUrl + item.Mode1_Pic0" alt="">
                    </div>
                    <div class="product-class-list">
                        <div class="product-class-item" @click="handleJumpDetail(item,item.Mode1_Link1)">
                            <div class="product-block">
                                <div class="product-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.Mode1_Pic1})`}"></div>
                                <img :src="$store.state.port.staticPath + '/img/print/zxys_hot.png'" alt="">
                            </div>
                            <div class="product-class-title">
                                <p>{{item.txt1_1_1}}</p>
                                <p>{{item.txt1_1_2}}</p>
                            </div>
                        </div>
                        <div class="product-class-item" @click="handleJumpDetail(item,item.Mode1_Link2)">
                            <div class="product-block">
                                <div class="product-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.Mode1_Pic2})`}"></div>
                                <!-- <img src="/img/print/zxys_hot.png" alt=""> -->
                            </div>
                            <div class="product-class-title">
                                <p>{{item.txt1_2_1}}</p>
                                <p>{{item.txt1_2_2}}</p>
                            </div>
                        </div>
                        <div class="product-class-item" @click="handleJumpDetail(item,item.Mode1_Link3)">
                            <div class="product-block">
                                <div class="product-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.Mode1_Pic3})`}"></div>
                                <!-- <img src="/img/print/zxys_hot.png" alt=""> -->
                            </div>
                            <div class="product-class-title">
                                <p>{{item.txt1_3_1}}</p>
                                <p>{{item.txt1_3_2}}</p>
                            </div>
                        </div>
                        <div class="product-class-item" @click="handleJumpDetail(item,item.Mode1_Link4)">
                            <div class="product-block">
                                <div class="product-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.Mode1_Pic4})`}"></div>
                                <!-- <img src="/img/print/zxys_hot.png" alt=""> -->
                            </div>
                            <div class="product-class-title">
                                <p>{{item.txt1_4_1}}</p>
                                <p>{{item.txt1_4_2}}</p>
                            </div>
                        </div>
                        <div class="product-class-item" @click="handleJumpDetail(item,item.Mode1_Link5)">
                            <div class="product-block">
                                <div class="product-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.Mode1_Pic5})`}"></div>
                                <!-- <img src="/img/print/zxys_hot.png" alt=""> -->
                            </div>
                            <div class="product-class-title">
                                <p>{{item.txt1_5_1}}</p>
                                <p>{{item.txt1_5_2}}</p>
                            </div>
                        </div>
                        <div class="product-class-item" @click="handleJumpDetail(item,item.Mode1_Link6)">
                            <div class="product-block">
                                <div class="product-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.Mode1_Pic6})`}"></div>
                                <!-- <img src="/img/print/zxys_hot.png" alt=""> -->
                            </div>
                            <div class="product-class-title">
                                <p>{{item.txt1_6_1}}</p>
                                <p>{{item.txt1_6_2}}</p>
                            </div>
                        </div>
                        <div class="product-class-item" @click="handleJumpDetail(item,item.Mode1_Link7)">
                            <div class="product-block">
                                <div class="product-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.Mode1_Pic7})`}"></div>
                                <!-- <img src="/img/print/zxys_hot.png" alt=""> -->
                            </div>
                            <div class="product-class-title">
                                <p>{{item.txt1_7_1}}</p>
                                <p>{{item.txt1_7_2}}</p>
                            </div>
                        </div>
                        <div class="product-class-item" @click="handleJumpDetail(item,item.Mode1_Link8)">
                            <div class="product-block">
                                <div class="product-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.Mode1_Pic8})`}"></div>
                                <!-- <img src="/img/print/zxys_hot.png" alt=""> -->
                            </div>
                            <div class="product-class-title">
                                <p>{{item.txt1_8_1}}</p>
                                <p>{{item.txt1_8_2}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="adversite" v-if="floorBanner">
                    <a target="_blank" :href="floorBanner.NavigateUrl.indexOf('www') > -1 ? floorBanner.NavigateUrl : 'javascript:;'">
                        <img :src="$store.state.port.imgBaseUrl + floorBanner.FileUrl" alt="">
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-list">
            <div class="footer-item" v-for="(item,i) in footerlist" :key=i>
                <img :src="$store.state.port.staticPath + item.src" alt="">
                <div class='footer-titles'>
                    <p>{{item.title}}</p>
                    <p>{{item.tip}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['floorList', 'floorBanner'],
    data() {
        return {
            footerlist: [{
                src: '/img/print/mfsj_icon.png',
                title: '免费设计',
                tip: '海量模板自助设计'
            },{
                src: '/img/print/ksjh_icon.png',
                title: '快速交货',
                tip: '全国工厂就近生产'
            },{
                src: '/img/print/cjzx_icon.png',
                title: '厂家直销',
                tip: '没有中间商赚差价'
            },{
                src: '/img/print/pzbz_icon.png',
                title: '品质保障',
                tip: '质量问题一律重印'
            }]
        }
    },
    methods: {
        handleJumpDetail(item, link) {
            let id = link
            this.$router.push({path: 'print/printDetail', query: {id}})

        },
    },
}
</script>

<style lang="scss" scoped>
.print-product{
    width: 100%;
    background: #f4f4f4;
    .footer-list{
        width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding-bottom: 26px;
        .footer-item{
            background:rgba(255,255,255,1);
            border-radius:5px;
            text-align: center;
            display: flex;
            border-radius:5px;
            padding: 24px 38px 24px 29px;
            img{
                vertical-align: middle;
                display: inline-block;
                margin-right: 33px;
            }
            .footer-titles{
                text-align: left;
                font-family:MicrosoftYaHei;
                font-weight:400;
                line-height: 30px;
                p:first-child{
                    font-size:20px;
                    color:rgba(51,51,51,1);
                }
                p:last-child{
                    font-size:16px;
                    color:rgba(153,153,153,1);
                }
            }
        }
    }
}
.product-list{
    width: 1200px;
    margin: 0 auto;
    padding: 50px 0;
    user-select: none;
    .product-item{
        margin-bottom: 50px;
        .product-title{
            font-size:30px;
            font-family:MicrosoftYaHei-Bold;
            font-weight:bold;
            color:rgba(51,51,51,1);
            line-height: 30px;
        }
        .product-content{
            padding: 25px 0 27px;
            display: flex;
            .mode1{
                width: 229px;
                height: 598px;
                margin-right: 13px;
                border-radius:10px;
                box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
                transition: all .5s;
                &:hover{
                    box-shadow:0px 2px 22px 2px rgba(128,128,128,0.25);
                    transform: translateY(-4px);
                }
                img{
                    display: block;
                    width: 229px;
                    height: 100%;
                    border-radius:10px;
                    cursor: pointer;
                }
            }
            .product-class-list{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                .product-class-item{
                    width: 229px;
                    height: 292px;
                    border-radius: 10px;
                    background:rgba(255,255,255,1);
                    text-align: center;
                    cursor: pointer;
                    box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
                    transition: all .3s;
                    margin-bottom: 15px;
                    &:hover{
                        box-shadow:0px 2px 22px 2px rgba(128,128,128,0.25);
                        transform: translateY(-4px);
                    }
                    .product-block{
                        width: 100%;
                        height: 204px;
                        position: relative;
                        padding: 15px 0;
                        img{
                            position: absolute;
                            top: 0;
                            right: 0;
                        }
                        .product-image{
                            display: inline-block;
                            width: 100%;
                            height: 100%;
                            background-size: contain;
                            background-position: 50%;
                            background-repeat: no-repeat;
                        }
                    }
                    .product-class-title{
                        text-align: center;
                        padding: 22px 0;
                        font-family:MicrosoftYaHei;
                        font-weight:400;
                        p:first-child{
                            font-size: 20px;
                            color:rgba(51,51,51,1);
                        }
                        p:last-child{
                            font-size: 14px;
                            color:rgba(153,153,153,1);
                        }
                    }
                }
            }
        }
        .adversite{
            width: 100%;
            height:117px;
            background:rgba(253,228,220,1);
            border-radius:10px;
        }
    }
    .product-item:last-child>.adversite:last-child{
        display: none;
    }
}
</style>
