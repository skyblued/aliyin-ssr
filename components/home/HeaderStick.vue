<template>
    <div id="header-stick">
        <div class="header-stick">
            <div class="header-stick-left">
                <div class="stick-logo">
                    <router-link to="/"><img :src="$store.state.port.staticPath + '/img/home/logo.png'" alt=""></router-link>
                </div>
                <div class="stick-tabs">
                    <!-- <div :class="{'stick-tabs-item': true, active: path == '/tempcenter'}" @click="handleJump('/tempcenter')">
                        <span>模板中心</span>
                    </div> -->
                    <div :class="{'stick-tabs-item': true, active: path == '/templatelist' || path == '/templatecenter'}" @click="handleJump('/templatelist')">
                        <span>在线设计</span>
                    </div>
                    <div :class="{'stick-tabs-item': true, active: path == '/print' || path == '/printdetail'}" @click="handleJump('/print')"> 
                        <span>在线印刷</span>
                        <img class="hot-img" :src="$store.state.port.staticPath + '/img/home/hot.png'" alt="">
                    </div>
                    <div :class="{'stick-tabs-item': true, active: path == '/recruit'}" @click="handleJump('/recruit')">
                        <span>招募设计师</span>
                    </div>
                </div>
            </div>
            <div class="stick-search">
                <el-input class="search-input" v-model="keywords" placeholder="请输入模板关键字" @keyup.native="getSearch($event)"></el-input>
                <el-button class="search-btn" @click="handleSearch(keywords)">搜索</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            keywords: ''
        }
    },
    methods: {
        handleJump(url) {
            this.$router.push(url)
        },

        getSearch(e) {  // 搜索
            if(e.keyCode == 13) {
                this.$router.push({path: '/templatecenter', query: {k: this.keywords}})
                this.keywords = ''
            }
        },
        handleSearch(keywords) {
            this.$router.push({path: '/templatecenter', query: {k: keywords}})
            this.search = ''
        }
    },
    computed: {
        path() {
            return this.$route.path
        }
    }
}
</script>

<style lang="scss" scoped>

#header-stick{
    width: 100%;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 44px 20px rgba(203,211,217,0.4);
}
.header-stick{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .header-stick-left{
        display: flex;
        .stick-logo{
            img{
                height: 70px;
            }
        }
    }
    .stick-tabs{
        display: flex;
        line-height: 74px;
        margin-left: 64px;
        .stick-tabs-item{
            width: 82px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color:rgba(51,51,51,1);
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
                width: 82px;
                height: 4px;
            }
            .hot-img{
                display: inline-block;
                width: 20px;
                height: 14px;
                position: absolute;
                top: 30px;
                right: -15px;
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
    .stick-search{
        display: flex;
        width: 320px;
        margin: 16px 16px 16px 0;
        position: relative;
        .search-input{
            height: 42px; 
        }
        .search-btn{
            width:96px;
            height:42px;
            line-height: 42px;
            background:$color;
            border-radius: 0 22px 22px 0;
            border: none;
            outline: none;
            position: absolute;
            top: 0;
            right: -18px;
            font-size:16px;
            text-align: center;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            padding: 0;
        }
    }
}
.header-stick /deep/ .stick-search .el-input__inner{
    border:2px solid $color;
    border-radius: 22px 0 0 22px;
    outline: none;
    height: 42px;
}
</style>
