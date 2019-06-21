<template>
    <div class="header">
        <div class="search-input">
            <div class="input-select">
                <el-input v-model="keyword" placeholder="输入模板关键字" class="input"></el-input>
                <span class="search-btn">搜索</span>
            </div>
            <p class="hot-search">
                <span>热门搜索：</span>
                <span class="search-item" v-for="(tmp,i) in hotSearchList" :key="i">{{tmp.Word}}</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            hotSearchList: [],
            keyword: ''
        }
    },
    mounted() {
        this.$axios.get('/SearchKeyWords').then((res) => {
            this.hotSearchList = res.data
        })
    }
}
</script>

<style lang="scss" scoped>

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
            border:2px solid $color;
            position: relative;
            .search-btn{
                display: inline-block;
                width:96px;
                height:42px;
                background:$color;
                position: absolute;
                top: -2px;
                right: -12px;
                font-size:16px;
                text-align: center;
                line-height: 42px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
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
    border: none;
    outline: medium;
    height: 38px;
}
</style>
