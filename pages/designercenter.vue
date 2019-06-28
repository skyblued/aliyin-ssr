<template>
    <div class="designer">
        <header class="header">
            <Header></Header>
        </header>

        <div class="designer-main">
            <div class="aside">
                <div class="logo">
                    <img v-if="$store.state.login.avatar != 'null'" :src="$store.state.login.avatar.indexOf('http') > -1 ? $store.state.login.avatar :( $store.state.port.imgBaseUrl + $store.state.login.avatar)" alt="">
                    <div v-else class="logo-wrap"></div>
                    <p class="name-block">
                        <span class="user-name">
                            {{username}}
                        </span>
                    </p>
                </div>
                <ul>
                    <li :class="asideTitle == '' ? 'active' : ''" @click="handleToggle('')">
                        <img :src="asideTitle == '' ? '/img/personal/cjdd_blue_icon.png' : '/img/personal/cjdd_white_icon.png'" alt="">
                        <span>创建设计</span>
                    </li>
                    <li :class="asideTitle == 'myTemplate' ? 'active' : ''" @click="handleToggle('myTemplate')">
                        <img :src="asideTitle == 'myTemplate' ? '/img/personal/wdmb_blue_icon.png' : '/img/personal/wdmb_white_icon.png'" alt="">
                        <span>我的模板</span>
                    </li>
                    <li :class="asideTitle == 'myMaterial' ? 'active' : ''" @click="handleToggle('myMaterial')">
                        <img :src="asideTitle == 'myMaterial' ? '/img/personal/wdsc_blue_icon.png' : '/img/personal/wdsc_white_icon.png'" alt="">
                        <span>我的素材</span>
                    </li>
                    <li :class="asideTitle == 'myEarnings' ? 'active' : ''" @click="handleToggle('myEarnings')">
                        <img :src="asideTitle == 'myEarnings' ? '/img/personal/szmx_blue_icon.png' : '/img/personal/szmx_white_icon.png'" alt="">
                        <span>积分明细</span>
                    </li>
                    <li :class="asideTitle == 'masterTemp' ? 'active' : ''" @click="handleToggle('masterTemp')">
                        <img :src="asideTitle == 'masterTemp' ? '/img/personal/wdmb_blue_icon.png' : '/img/personal/wdmb_white_icon.png'" alt="">
                        <span>专属模板</span>
                    </li>
                    <!-- <li :class="asideTitle == 'withdrawRecord' ? 'active' : ''" @click="handleToggle('withdrawRecord')">
                        <img :src="asideTitle == 'withdrawRecord' ? '/img/personal/txjl_blue_icon.png' : '/img/personal/txjl_white_icon.png'" alt="">
                        <span>提现记录</span>
                    </li> -->
                </ul>
            </div>

            <div class="designer-container">
                <nuxt-child />
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/designer/Header.vue'
export default {
    data () {
        return {
            username: null,
            asideTitle: '',
        }
    },
    methods: {
        handleToggle(title){
            this.asideTitle = title
            this.$router.push('/designercenter/' + title)
        }
    },
    created() {
        // this.$axios.get('/ApplyDesigner').then(res => {
        //     if(res.data.code == '1') {
        //         this.asideTitle = ''
        //     }else{
        //         this.$message.warning(res.data.msg)
        //         this.$router.push('/')
        //     }
        // })
        var title = this.$route.fullPath.split('/')[2]
        if(title == undefined) {
            this.asideTitle = ''
        }else{
            this.asideTitle = title
        }
    },
    mounted() {
        this.username = localStorage['userName']
        this.$store.commit('login/setAvatar', localStorage['avatar'])
    },
    components: {
        Header,
    }
}
</script>

<style lang="scss" scoped>
.designer{
    height: 100%;
    user-select: none;
    .header{
        min-width: 1200px;
        height: 52px;
        background: rgba(255,255,255,1);
        border-bottom: 1px solid rgba(236,236,236,1);
        display: flex;
        justify-content: space-between;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2000;
    }
    .designer-main{
        width: 100%;
        height: 100%;
        padding-top: 52px;
        padding-left: 214px;
        .aside{
            width: 214px;
            // background: linear-gradient(to bottom,#00e3ff,#5ea2ff);
            background: $gradient;
            box-shadow:0px 1px 27px 2px rgba(203,211,217,0.76);
            position: fixed;
            top: 52px;
            left: 0;
            bottom: 0;
            z-index: 2000;
            .logo{
                width: 100%;
                height: 160px;
                text-align: center;
                padding-top: 24px;
                .logo-wrap{
                    background-image: url(/img/personal/avatar_icon.png);
                }
                img, .logo-wrap{
                    display: block;
                    width:70px;
                    height:70px;
                    margin: 0 auto;
                    border-radius:50%;
                    margin-bottom: 16px;
                }
                .name-block{
                    display: flex;
                    width: 150px;
                    margin: 0 auto;
                    justify-content: center;
                }
                .user-name{
                    display: inline-block;
                    font-size:18px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                    // color: rgba(102,102,102,1);
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                // .vip{
                //     display: inline-block;
                //     width: 20px;
                //     height: 14px;
                //     background:rgba(255,156,0,1);
                //     border-radius: 3px;
                //     font-size: 12px;
                //     font-family: MicrosoftYaHei;
                //     font-weight: 400;
                //     color:rgba(255,255,255,1);
                //     margin-left: 8px;
                // }
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
                    color:rgba(255,255,255,1);
                    // color: rgba(102,102,102,1);
                    padding: 12px 0 11px;
                    cursor: pointer;
                    img{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 10px;
                    }
                }
                .active{
                    background : rgba(255,255,255,1);
                    // background: $gradient;
                    & span{
                        color: $color;
                        // color: rgba(255,255,255,1);
                    }
                }
            }
        }
        .designer-container{
            width: 100%;
            // overflow-y: hidden;
        }
    }
}
</style>
