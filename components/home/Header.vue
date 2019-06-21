<template>
    <div id="header">
        <div class="header-search">
        <div class="logo">
            <nuxt-link class="link" to="/"><img :src="$store.state.port.staticPath + '/img/home/logo.svg'" alt=""></nuxt-link>
        </div>
        <div class="search-input">
            <div class="input-select">
                <el-input v-model="search" placeholder="请输入模板关键字" class="input-with-select" @keyup.native="getSearch($event)">
                </el-input>
                <span class="search-btn" @click="handleSearch(search)">搜索</span>
            </div>
            <div class="hot-search">
                <p>
                    <span>热门搜索：</span>
                    <span class="search-item" v-for="(tmp,i) in hotSearchList" :key="i">{{tmp.Word}}</span>
                </p>
            </div>
        </div>
    </div>
		
    </div>
</template>

<script>
export default {
    data () {
        return {
			isShow: '',
			SecondList: [],
			barList: [],
            ClassName: '',
			activeIndex: 0,
			search: '',
            hotSearchList: []
        }
	},
	methods: {
		handleOver(i) {
            this.isShow = 'ok'
            this.ClassName = this.barList[i].ClassName
            this.SecondList = this.barList[i].ProductTypeList
            this.activeIndex = i
        },
        handleOut() {
            this.isShow = ''
        },
        handleClick(tmp) {
            let num = tmp.FromClass
            let title = this.ClassName
            let subtitle = tmp.TypeName
            let typeId = tmp.TypeId
            this.$router.push({path: '/tempcenter', query: {title, subtitle, typeId,num}})
		},
		handleSelect(key, keyPath) {
            this.activeIndex = key
            // console.log(key, keyPath);
        },
        getDate() {
            this.$axios.get(this.$store.state.port.AllTemplate).then((res) => {
                //console.log(res.data)
                this.barList = res.data
            })
		},
		getSearch(e) {
            if(e.keyCode == 13) {
                this.$router.push({path: '/templatecenter', query: {k: this.search}})
                // console.log(this.search)
                this.search = ''
            }
        },
        handleSearch(keywords) {
            // console.log(keywords) templatecenter
            this.$router.push({path: '/templatecenter', query: {k: keywords}})
            this.search = ''
        }
	},
    mounted () {
        this.$axios.get('/SearchKeyWords').then((res) => {
            //console.log(res.data)
            this.hotSearchList = res.data
        })
    },
}
</script>

<style lang="scss" scoped>
#header{
    height:149px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 44px 20px rgba(203,211,217,0.4);
}
.header-bar{
    width: 1200px;
    height: 38px;
    margin: 0 auto;
}
.header-bar .bar-list{
    height: 100%;
    display: flex;
    justify-content: space-between;
    a{
        text-decoration: none;
    }
}
.bar-list .bar-list-left{
    display: flex;
    justify-content: space-between;
}
.bar-list-left .bar-item-temp{
    position: relative;
    height: 38px;
}
.bar-class{
    display: none;
    padding-top: 20px;
}
.bar-active:hover .bar-class{
    display: block;
}
.bar-list .bar-item{
    cursor: pointer;
}
.bar-list .bar-item span{
    height: 16px; 
    cursor: pointer;
}
.bar-list .bar-item:first-child{
    height:100%;
    line-height: 38px;
    padding: 0 50px 0 16px;
    background:$color;
    border-radius: 5px 5px 0 0;
}
.bar-list .bar-item:nth-child(2), .bar-item:nth-child(3){
    //width:67px;
    height:16px;
    line-height: 16px;
    font-size:16px;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    margin: 11px 23px 11px 38px;
    a{
        color: $color;
        &:hover{
            color: #0893ff;
        }
    }
}
.bar-list .bar-item:nth-child(5), .bar-list .bar-item:nth-child(6){
    //width:68px;
    height:15px;
    line-height: 15px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    margin: 11px 37px 11px 11px;
    color:rgba(51,51,51,1);
    a{
        color: rgba(51,51,51,1);
        &:hover{
            color: $color;
        }
    }
}
.bar-list .bar-item:nth-child(4){
    //width: 100px;
    height: 15px;
    line-height: 15px;
    font-size: 16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    margin: 11px 17px 11px 23px;
    a{
        color: rgba(51,51,51,1);
        &:hover{
            color: $color;
        }
    }
}
.bar-list .bar-item img.hot-img{
    width: 20px;
    height: 14px;
    display: inline-block;
    margin-left: 6px;
}
.bar-list .bar-item .temp-class-img{
    display: inline-block;
    width: 21px;
    height: 15px;
    margin-right: 15px;
}
.bar-list .bar-item span.temp-class{
    display: inline-block;
    //width:153px;
    height: 15px;
    font-size: 16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
    position: relative;
    top: -2px;
}
.template-class{
    position: absolute;
    left: 0;
    top: 58px;
    z-index: 100;
    width:255px;
    height:528px;
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 27px 2px rgba(203,211,217,0.4);
    .active{
        box-shadow: -1px 0px 27px 2px rgba(203,211,217,.5);
    }
}
.template-class .class-item{
    width: 100%;
    height: 73px;
    padding: 13px 10px 13px 20px;
    cursor: pointer;
}
.template-class .class-item .class-item-block{
    height: 47px;
    line-height: 47px;
    display: flex;
}
.template-class .class-item .class-item-img{
    vertical-align: middle;
    margin-right: 10px;
    img{
        width: 47px;
        height: 100%;
    }
}
.template-class .class-item .class-item-label{
    margin: 5px 0;
}
.template-class .class-item .class-item-label p{
    font-family:MicrosoftYaHei;
    font-weight:400;
}
.template-class .class-item .class-item-label p:first-child{
    line-height: 15px;
    font-size:16px;  
    color:rgba(51,51,51,1);
    margin-bottom: 10px;
}
.template-class .class-item .class-item-label p:last-child{
    height:12px;
    line-height: 12px;
    font-size:12px;
    color:rgba(153,153,153,1);  
    display: flex;
    span{
        margin: 0 2px;
    }
}
.template-class .class-level-item{
    width:946px;
    height:528px;
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 27px 10px rgba(203,211,217,0.4);
    position: absolute;
    top: 0;
    left: 255px;
    user-select: none; 
}
.template-class .class-level-item .class-level-item-label{
    width: 878px;
    height: auto;
    margin: 26px 37px 40px 30px;
}
.template-class .class-level-item .class-level-item-label:last-child{
    margin-bottom: 0;
}
.template-class .class-level-item .class-level-item-label .level-title{
    height:15px;
    line-height: 15px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin-bottom: 20px;
}
.template-class .class-level-item .class-level-item-label .level-tips{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 54px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    .level-tips-item{
        text-align: center;
        height: 100px;
        cursor: pointer;
        span{
            display: block;
            height: 12px;
            width: 109px;
            line-height: 12px;
            margin-bottom: 15px;
        }
        &:hover span{
            color: $color;
        }
    }
}
.header-search /deep/ .el-input__inner{
    border:2px solid $color;
    border-radius: 22px 0 0 22px;
    height: 42px;

}
.header-search{
    width: 1200px;
    height: 111px;
    display: flex;
    margin: 0 auto;
}
.header-search .logo{
    padding: 13px 123px 29px 0;
    .link{
        display: inline-block;
        height: 70px;
    }
    img{
        height: 70px;
    }
}
.header-search .search-input{
    margin: 26px 0 22px;
}
.search-input .input-select{
    width:561px;
    height:42px;
    position: relative;
}
.search-input .input-select .search-btn{
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
.header-search .search-input .hot-search{
    //width: 557px;
    height: 11px;
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    margin-top: 10px;
}
.header-search .search-input .hot-search .search-item{
    margin: 0 10px;
    cursor: pointer;
    &:hover{
        color: $color
    }
}
</style>
