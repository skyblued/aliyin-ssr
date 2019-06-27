<template>
    <div class="create">
        <!-- <Header></Header> -->
        <div class="header">
            <div class="search-input">
                <div class="input-select">
                    <el-input v-model="keyword" placeholder="输入模板关键字" class="input" @keyup.native="getSearch($event)"></el-input>
                    <span class="search-btn" @click="handleSearch(keyword)">搜索</span>
                </div>
                <p class="hot-search">
                    <span>热门搜索：</span>
                    <span class="search-item" v-for="(tmp,i) in hotSearchList" :key="i">{{tmp.Word}}</span>
                </p>
            </div>
        </div>
        <div id="loading" v-if="loading">
            <div class="loader-inner ball-beat">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>

        <!--分类模板-->
        <div class="chat-list">
            <div class="chat-media" v-for="(item,i) in List" :key="i">
                <div class="hr-all">
                    <i></i>
                    <div class="hr-title">{{item.ClassName}}</div>
                </div>
                <div class="pic-list">
                    <div class="pic-item" v-for="(tmp,index) in item.ProductTypeList" :key="index">
                        <nuxt-link :to="`/templateList/templateCenter?id=${tmp.TypeId}&n=${tmp.FromClass}&title=${item.ClassName}&subtitle=${tmp.TypeName}`">
                            <div class="pic-img">
                                <img :src="$store.state.port.imgBaseUrl+tmp.ImageUrl" alt="">
                            </div>
                            <p class="pic-title">{{tmp.TypeName}}</p>
                            <p class="size"></p>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
        <!-- <Main :List="List"></Main> -->
    </div>
</template>

<script>
// import Header from '@/components/personal/create/Header.vue'
// import Main from '@/components/personal/create/Main.vue'
export default {
    data () {
        return {
            List: [],
            ProductTypeList: [],
            loading: true,
            hotSearchList: [],
            keyword: ''
        }
    },
    methods: {
        getData() {
            this.$axios.get(this.$store.state.port.AllTemplate).then((res) => {
                // console.log(res.data)
                this.List = res.data
                if(this.List.length > 0) {
                    this.loading = false
                }
            })
        },
        getSearch(e) {  // 搜索
            if(e.keyCode == 13) {
                this.$router.push({path: '/templateList/templateCenter', query: {k: this.keyword}})
                this.keyword = ''
            }
        },
        handleSearch(keyword) {
            this.$router.push({path: '/templateList/templateCenter', query: {k: keyword}})
            this.keyword = ''
        }
    },
    mounted() {
        this.getData()
    },
    components: {
        // Header,
        // Main
    }
}
</script>

<style lang="scss" scoped>

.create{
    width: 100%;
    min-width: 960px;
    //overflow-y: auto;
}
.header{
    text-align: center;
    background: rgba(255,255,255,1);
    //height: 179px;
    padding-top: 58px;
    padding-bottom: 54px;
    .search-input{
        width: 573px;
        margin: 0 auto;
        .input-select{
            width:561px;
            height:42px;
            position: relative;
            .search-btn{
                display: inline-block;
                width:96px;
                height:42px;
                background:$color;
                position: absolute;
                top: 0;
                right: -18px;
                font-size:16px;
                text-align: center;
                line-height: 42px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                border-radius: 0 22px 22px 0;
                cursor: pointer;
            }
        }
        .hot-search{
            text-align: left;
            font-size:12px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(153,153,153,1);
            margin-top: 10px;
            user-select: none;
            .search-item{
                margin: 0 10px;
                cursor: pointer;
                &:hover{
                    color: $color;
                }
            }
        }
    }
}

.header /deep/ .el-input__inner{
    border: 2px solid $color;
    border-radius: 22px 0 0 22px;
    height: 42px;
}
.header /deep/ .el-input{
    height: 42px;
}
#loading{
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 1000;
}

// 分类模板

.chat-list .hr-all i{
    background:rgba(255,157,55,1);
}
.chat-list{
    margin-top: 69px;
    padding-left: 50px;
    .chat-media{
        margin-bottom: 30px;
    }
    .chat-media:last-child{
        margin-bottom: 0;
    }
}

.hr-all{
    text-align: left;
    display: flex;
    line-height: 14px;
    i{
        width:5px;
        height:16px;
        background:rgba(70,192,177,1);
        margin-right: 10px;
    }
    .hr-title{
        font-size:17px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
}

.pic-list{
    margin-top: 31px;
    margin-left: 19px;
}
.pic-item{
    margin-right: 33px;
    margin-bottom: 36px;
    width: 120px;
    height: 187px;
    vertical-align: bottom;
    cursor: pointer;
    display: inline-block;
    transition: all .5s;
    font-family:MicrosoftYaHei;
    font-weight:400;
    text-align: center;
    .pic-title{
        font-size:14px;
        color:rgba(102,102,102,1);
        margin-top: 16px;
        margin-bottom: 11px;
    }
    .size{
        font-size:12px;
        color:rgba(153,153,153,1);
    }
}
.pic-item:hover .pic-title{
    font-weight: bold;
}
.pic-img{
    vertical-align: bottom;
    display: table-cell;
    height: 125px;
    width: 120px;
    text-align: center;
}
.pic-img img{
    max-height: 120px;
    max-width: 120px;
    //transition: box-shadow .4s ease;
}
</style>
