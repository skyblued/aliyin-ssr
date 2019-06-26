<template>
    <no-ssr>
        <div class="personal">
            <!-- <el-container>
                <el-header style="height: 52px;">
                    <Header @setData="setData"></Header>
                </el-header>
                <el-container>
                    <el-aside style="width: 214px;">
                        <Aside v-if="show == 'create'"></Aside>
                        <CenterAside v-if="show == 'center'" @setData="setData"></CenterAside>
                    </el-aside>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container> -->
            <header class="header">
                <Header @setData="setData" @setVip="setVip"></Header>
            </header>

            <div class="personal-main">
                <!--  -->
                <div  v-if="show == 'toggle'" style="height: 880px">
                    <div class="aside" @click.stop="handleShow(false)">
                        <div class="logo">
                            <img v-if="$store.state.login.avatar != 'null' && $store.state.login.avatar != ''" class="avatar" :src="$store.state.login.avatar.indexOf('http') > -1 ? $store.state.login.avatar :$store.state.port.imgBaseUrl + $store.state.login.avatar" alt="">
                            <div v-else class="avatar-wrap"></div>
                            <span v-if="teamname" :title="teamname">
                                {{teamname}}
                                <!-- <i @click.stop="handleToggle('teamdetail')" title="团队管理"></i> -->
                            </span>
                            <!-- <img @click.stop="handleShow(true)" class="choose-team" src="/img/personal/switch_icon.png" alt=""> -->
                        </div>
                        <!-- <div class="ordinary" v-else>
                            <img @click="handleToggle('Vip')" src="/img/personal/opne-vip.png" alt="">
                            <img @click.stop="handleShow(true)" class="choose-team" src="/img/personal/switch_icon.png" alt="">
                        </div> -->
                        <ul> 
                            <li :class="asideTitle == '' ? 'active' : ''" @click="handleToggle('')">
                                <img :src="asideTitle == '' ? '/img/personal/leftnav/cjsj_white_icon.png' : '/img/personal/leftnav/cjsj_gray_icon.png'" alt="">
                                <span>创建设计</span>
                            </li>
                            <li :class="asideTitle == 'record' ? 'active' : ''" @click="handleToggle('record')">
                                <img :src="asideTitle == 'record' ? '/img/personal/leftnav/sjjl_white_icon.png' : '/img/personal/leftnav/sjjl_gray_icon.png'" alt="">
                                <span>设计记录</span>
                            </li>
                            <li :class="asideTitle == 'collect' ? 'active' : ''" @click="handleToggle('collect')">
                                <img :src="asideTitle == 'collect' ? '/img/personal/leftnav/scjl_white_icon.png' : '/img/personal/leftnav/scjl_gray_icon.png'" alt="">
                                <span>收藏记录</span>
                            </li>
                            <li :class="asideTitle == 'buy' ? 'active' : ''" @click="handleToggle('buy')" v-if="false">
                                <img :src="asideTitle == 'buy' ? '/img/personal/leftnav/gmjl_white_icon.png' : '/img/personal/leftnav/gmjl_gray_icon.png'" alt="">
                                <span>购买记录</span>
                            </li>
                            <li :class="asideTitle == 'order' ? 'active' : ''" @click="handleToggle('order')">
                                <img :src="asideTitle == 'order' ? '/img/personal/leftnav/ysdd_white_icon.png' : '/img/personal/leftnav/ysdd_gray_icon.png'" alt="">
                                <span>印刷订单</span>
                            </li>
                            <li :class="asideTitle == 'invoice' ? 'active' : ''" @click="handleToggle('invoice')">
                                <img :src="asideTitle == 'invoice' ? '/img/personal/leftnav/sqfp_white_icon.png' : '/img/personal/leftnav/sqfp_gray_icon.png'" alt="">
                                <span>申请发票</span>
                            </li>
                            <li :class="asideTitle == 'coupon' ? 'active' : ''" @click="handleToggle('coupon')">
                                <img :src="asideTitle == 'coupon' ? '/img/personal/leftnav/yhj_white_icon.png' : '/img/personal/leftnav/yhj_gray_icon.png'" alt="">
                                <span>优惠券</span>
                            </li>
                            <li :class="asideTitle == 'teamdetail' ? 'active' : ''" @click="handleToggle('teamdetail')">
                                <img :src="asideTitle == 'teamdetail' ? '/img/personal/leftnav/tdgl_white_icon.png' : '/img/personal/leftnav/tdgl_icon.png'" alt="">
                                <span>专属模板</span>
                            </li>
                        </ul>
                    </div>
                    <div class="personal-container" @click.stop="handleShow(false)" style="min-height:880px;" >
                        <nuxt-child />
                    </div>
                </div>
                <div v-else style="height: 880px">
                    <div class="aside">
                        <div class="logo">
                            <img v-if="$store.state.login.avatar != 'null' && $store.state.login.avatar != ''" class="avatar" :src="$store.state.login.avatar.indexOf('http') > -1 ? $store.state.login.avatar :$store.state.port.imgBaseUrl + $store.state.login.avatar" alt="">
                            <div v-else class="avatar-wrap"></div>
                            <span v-if="username">{{username}}</span>
                        </div>
                        <div class="aside-create-btn" @click="handleJump">开始创作</div>
                        <ul>
                            <li :class="asideTitle == 'acountcenter' ? 'active' : ''" @click="handleToggle('acountcenter')">
                                <img :src="asideTitle == 'acountcenter' ? '/img/personal/leftnav/zhgl_white_icon.png' : '/img/personal/leftnav/zhgl_gray_icon.png'" alt="">
                                <span>账号管理</span>
                            </li>
                            <!-- <li :class="asideTitle == 'team' ? 'active' : ''" @click="handleToggle('team')">
                                <img :src="asideTitle == 'team' ? '/img/personal/leftnav/tdgl_white_icon.png' : '/img/personal/leftnav/tdgl_gray_icon.png'" alt="">
                                <span>团队管理</span>
                            </li> -->
                            <li :class="asideTitle == 'acountaddress' ? 'active' : ''" @click="handleToggle('acountaddress')">
                                <img :src="asideTitle == 'acountaddress' ? '/img/personal/leftnav/shdz_white_icon.png' : '/img/personal/leftnav/shdz_gray_icon.png'" alt="">
                                <span>收货地址</span>
                            </li>
                            <li :class="asideTitle == 'acountInvoice' ? 'active' : ''" @click="handleToggle('acountInvoice')">
                                <img :src="asideTitle == 'acountInvoice' ? '/img/personal/leftnav/fpxx_white_icon.png' : '/img/personal/leftnav/fpxx_grat_icon.png'" alt="">
                                <span>发票信息</span>
                            </li>
                            <!-- <li :class="asideTitle == 'MessageCenter' ? 'active' : ''" @click="handleToggle('MessageCenter')">
                                <img :src="asideTitle == 'MessageCenter' ? '/img/personal/leftnav/zlx_white_icon.png' : '/img/personal/leftnav/zlx_gray_icon.png'" alt="">
                                <span>站内信</span>
                            </li> -->
                        </ul>
                    </div>
                    <div class="personal-container" style="min-height: 880px;">
                        <nuxt-child />
                    </div>
                </div>
            </div>
        </div>
    </no-ssr>
</template>

<script>
import Header from '@/components/personal/Header'
export default {
    asyncData({app, store}) {
        // console.log(app.$cookiz)
        if (!store.state.login.token) store.commit('login/toggleShow', true)
    },
    data () {
        return {
            teamname: null,
            username: null,
            show: null,
            asideTitle: null,
        }
    },
    methods: {
        setParam() {
            this.teamname = localStorage['teamName']
            this.username = localStorage['userName']
            this.show = this.$route.fullPath.indexOf('acount') > -1 ? '' : 'toggle'
            this.asideTitle = this.$route.fullPath.indexOf('acount') > -1 ? 'acountcenter' : ''
            this.$store.commit('login/setAvatar', localStorage['avatar'])
        },

        setData(val){
            console.log(val)
            this.show = val
            this.asideTitle = val
        },
        setVip(val) {
            this.asideTitle = val
        },
        handleToggle(title) {
            this.asideTitle = title
            this.$router.push('/personal/' + title)
        },
        handleJump() {
            this.show = 'toggle'
            this.asideTitle = ''
            this.$router.push('/personal')
        },
        handleShow(bool) {
            // this.$bus.$emit('setToggle', bool)
        }
    },
    created() {
        // this.$bus.$on('setMyOrder', (msg) =>this.asideTitle = msg)
    },
    mounted() {
        this.setParam()
        // this.$bus.$on('setMyOrder', (msg) =>this.asideTitle = msg)
        var title = this.$route.fullPath.split('/')[2]
        if(title == undefined) {
            this.asideTitle = ''
        }else{
            this.asideTitle = title
        }
    },
    destroyed() {
        // this.$bus.$off('setMyOrder')
    },
    watch: {
        show() {
            // if(this.show != 'toggle'){
            //     this.asideTitle = 'center'
            //     if(this.$route.fullPath == '/account/personalcenter'){
            //         this.asideTitle = 'personalcenter'
            //     }else if(this.$route.fullPath == '/account/team'){
            //         this.asideTitle = 'team'
            //     }else if(this.$route.fullPath == '/account/address') {
            //         this.asideTitle = 'address'
            //     }else{
            //         this.asideTitle = 'MessageCenter'
            //     }
            // }
        }
    },
    computed: {
        teamType() {
            return sessionStorage['teamType']
        }
    },
    components: {
        Header
    }
}
</script>

<style scoped lang="scss">


.personal{
    height: 100%;
    // user-select: none;
    .header{
        min-width: 1200px;
        height: 52px;
        display: flex;
        justify-content: space-between;
        background: rgba(255,255,255,1);
        border-bottom: 1px solid rgba(236,236,236,1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2000;
    }
    .personal-main{
        width: 100%;
        height: 100%;
        padding-top: 52px;
        padding-left: 214px;
        .transition-box {
            width: 214px;
            height: 100px;
            background-color: #409EFF;
            text-align: center;
            color: #fff;
            padding: 40px 20px;
        }
        .aside{
            width: 214px;
            position: fixed;
            top: 52px;
            left: 0;
            bottom: 0;
            z-index: 1000;
            color:rgba(102,102,102,1);
            box-shadow: 0px 1px 27px 2px rgba(203,211,217,0.76);
            background: rgba(255,255,255,1);
            user-select: none;
            .logo{
                padding: 29px 48px 61px;
                height: 160px;
                text-align: center;
                font-size:16px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color: rgba(51,51,51,1);
                .avatar-wrap{
                    // background: rgba(197,235,255,1);
                    background-image: url(/img/personal/avatar.png);
                    background-size: 100%;
                    margin: 0 auto;
                }
                .avatar, .avatar-wrap{
                    width:70px;
                    height:70px;
                    border-radius:50%;
                    margin-bottom: 16px;
                }
                .choose-team{
                    position: absolute;
                    right: 0;
                    top: 0;
                    cursor: pointer;
                }
                span{
                    width: 100%;
                    display: block;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                i{
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-image: url(/img/personal/leftnav/sz_gray_icon.png);
                    cursor: pointer;
                }
            }
            .ordinary{
                text-align: center;
                padding: 24px 0;
                cursor: pointer;
                position: relative;
                .choose-team{
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            }
            .aside-create-btn{
                background: $color;
                border-radius:5px;
                font-size:14px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(254,254,254,1);
                width: 127px;
                line-height: 32px;
                margin: 0 auto 35px;
                text-align: center;
                cursor: pointer;
            }
            ul{
                display: flex;
                height: 100%;
                flex-direction: column;
                li{
                    width: 100%;
                    text-align: center;
                    font-size:16px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    padding: 12px 0 11px 55px;
                    text-align: left;
                    cursor: pointer;
                    img{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 12px;
                        width: 25px;
                        height: 25px;
                    }
                    // &:hover{
                    //     background: linear-gradient(to right, #17b6ff,#6094e9,#9c36ff);
                    //     color: rgba(255,255,255,1);
                    // }
                }
                .active{
                    background: $gradient;
                    & span{
                        color: rgba(255,255,255,1);
                    }
                } 
            }
        }
        .personal-container{
            width: 100%;
            // overflow-x: hidden;
            // overflow-x: auto;
            background: rgba(236,236,236,1);
            // &::-webkit-scrollbar{
            //     width: 8px;
            //     height: 8px;
            // }
            // &::-webkit-scrollbar-thumb{
            //     border-radius: 5px;
            //     background: rgba(0,0,0,.3);
            // }
            // &::-webkit-scrollbar-track{
            //     border-radius: 0;
            //     background: rgba(255,255,255,1);
            // }
        }
    }
}
</style>
