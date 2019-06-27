<template>
    <div id="header">
        <div  class="header">
            <div class="header-left">
                <nuxt-link to="/" v-if="!isFixed">
                    <img class="logo" :src="$store.state.port.staticPath + '/img/home/logo.svg'" alt="">
                </nuxt-link>
                <div v-if="isFixed" class="bar-menu-wrap" @mouseenter="barMenuListShow = true" @mouseleave="barMenuListShow = false">
                    <div class="bar-menu">
                        <img class="bar-img" src="/img/home/classify_icon.png" alt="">
                        <span class="bar-title">海量模板，每天更新</span>
                    </div>
                    <transition name="el-zoom-in-top">
                        <!-- <el-collapse-transition> -->
                        <div class="bar-menu-list" v-if="barMenuListShow" >
                            <TemplateClass :barList="barList"></TemplateClass>
                        </div>
                        <!-- </el-collapse-transition> -->
                    </transition>
                </div>
                <ul>
                    <nuxt-link to="/">
                        <li :class="{'menu-list': true, active: path == '/'}">首页</li>
                    </nuxt-link>
                    <nuxt-link to="/templateList">
                        <li :class="{'menu-list': true, active: path.indexOf('/templateList') > -1}">在线设计</li>
                    </nuxt-link>
                    <nuxt-link to="/print">
                        <li :class="{'menu-list': true, active: path.indexOf('/print') > -1}">在线印刷</li>
                    </nuxt-link>
                </ul>
            </div>
            <div class="header-right">
                <div class="search-input">
                    <div class="input-select">
                        <input v-model="keywords" placeholder="请输入模板关键字" @focus="show = true" @blur="show = false" class="input-with-select" @keydown.enter="handleSearch(keywords)">
                        <span class="search-btn" @click="handleSearch(keywords)">搜索</span>
                    </div>
                    <div v-if="show" class="hot-search">
                        <p>
                            <span>热门搜索：</span>
                            <span class="search-item" v-for="(tmp,i) in hotSearchList" :key="i">{{tmp.Word}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TemplateClass from '@/components/home/TemplateClass.vue'
export default {
    data () {
        return {
            keywords: '',
            hotSearchList: [],
			show: false,
			barMenuListShow: false,
        }
    },
    props: ['isFixed', 'barList'],
    methods: {
        // handleClick() {
        //     if(this.$route.path == '/') {
        //         history.go(0)
        //     }else{
        //         this.$router.push('/')
        //     }
        // },
        // handleJump(url) {
        //     this.$router.push(url)
        // },
         handleSearch(keywords) {
            console.log(13)
            let n, id,subtitle,title;
            if(this.$route.query.id && this.$route.query.n && this.$route.query.subtitle && this.$route.query.title) {
                n = this.$route.query.n
                id = this.$route.query.id   
                subtitle = this.$route.query.subtitle
                title = this.$route.query.title
            }
            this.$router.push({path: '/templatecenter', query: {k: keywords, n: n, id: id,subtitle: subtitle,title: title}})
            if(this.$route.path == '/templatecenter'){
                this.$bus.$emit('setKeyword', this.keywords)
            } 
        }
    },
    computed: {
        path() {
            return this.$route.path
        }
    },
    components: {
        TemplateClass
    }
}
</script>

<style lang="scss" scoped>
#header{
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 44px 20px rgba(203,211,217,0.4);
}
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1200px;
    height: 70px;
    margin: 0 auto;
    .header-left{
        display: flex;
        align-items: center;
        .logo{
            height: 55px;
            width: 176px;
            margin-right: 79px;
            cursor: pointer;
        }
        ul{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 38px;
            margin-top: 4px;
            margin-left: 15px;
            .menu-list{
                display: inline-block;
                width: 110px;
                height: 38px;
                line-height: 38px;
                text-align: center;
                // background:rgba(225,227,232,1);
                border-radius: 19px;
                color:rgba(51,51,51,1);
                font-size: 16px;
                cursor: pointer;
                margin-right: 21px;
                &:hover{
                    background:rgba(116,91,255,1);
                    color: rgba(255,255,255,1);
                    font-weight: bold;
                }
            }
            .active{
                background:rgba(116,91,255,1);
                color: rgba(255,255,255,1);
                font-weight: bold;
            }
        }
        .bar-menu-wrap{
            position: relative;
            width: 255px;
            // &:hover .bar-menu-list{
            //     display: block;
            // }
            .bar-menu-list{
                position: absolute;
                top: 44px;
                left: 0;
                // display: none;
                padding-top: 28px;
            }
        }
        .bar-menu{
            display: inline-block;
            width: 100%;
            height: 45px;
            line-height: 45px;
            background: $gradient;
            font-size: 16px;
            color: rgba(255,255,255,1);
            padding: 0 16px;
            border-radius: 5px;
            cursor: pointer;
            .bar-img{
                width: 21px;
                height: 21px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 15px;
            }
        }
    }
    .header-right{
        .search-input{
            margin: 20px 18px 21px 0;
            position: relative;
            .input-select{
                width:375px;
                height:42px;
                position: relative;
                input{
                    border:2px solid #745bff;
                    border-radius: 22px 0 0 22px;
                    height: 42px;
                    width: 100%;
                    outline: none;
                    padding-left: 20px;
                }
                .search-btn{
                    display: inline-block;
                    width:96px;
                    height:42px;
                    line-height: 42px;
                    background:$color;
                    border-radius: 0 22px 22px 0;
                    position: absolute;
                    top: 0;
                    right: -18px;
                    font-size:16px;
                    text-align: center;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                    cursor: pointer;
                }
            }
            .hot-search{
                position: absolute;
                top: 42px;
                left: 18px;
                background: #fff;
                right: 91px;
                -webkit-box-shadow: 0 18px 20px 0 rgba(20,33,65,.14);
                box-shadow: 0 18px 20px 0 rgba(20,33,65,.14);
                border-radius: 0 0 6px 6px;
                min-width: 160px;
                p{
                    height: 36px;
                    line-height: 36px;
                    padding: 0 20px;
                    span:first-child{
                        color: rgba(205,205,205,1);
                    }
                }
                .search-item{
                    margin: 0 10px;
                    cursor: pointer;
                    color: rgba(51,51,51,1);
                    &:hover{
                        color: #745bff;
                    }
                }
            }
        }
    }
}

</style>
