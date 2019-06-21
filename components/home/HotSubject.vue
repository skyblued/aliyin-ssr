<template>
    <div class="hot-subject">
        <div class="hot-subject-title">
            Hot topic
            <p>热门专题</p>
        </div>
        <div class="hot-subject-tips">
            <p>海量模板，每日更新</p>
        </div>
        <div class="hot-list" v-if="list[0]">
            <div class="hot-item" v-for="(item,i) in list" :key="i" @click="handleToHotDetail(item)">
                <img :src="$store.state.port.imgBaseUrl+item.Img" alt="">
                <div class="hot-item-title">
                    <p>{{item.Name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            Visiable: 1,
            IsHot: 1
        }
    },
    methods: {
        getData() {
            var url = "/ThematicColumn?Visiable=" + this.Visiable+"&IsHot="+ this.IsHot
            this.$axios.get(url).then(res=>{
                console.log(res.data)
                this.list = res.data
            })
        },
        handleToHotDetail(item) {
            let num = item.Num
            let name = item.Name
            this.$router.push({path: '/hotdetail', query: {num, name}})
        }
    },
    mounted() {
        this.getData();
    }
}
</script>

<style lang="scss" scoped>

.hot-subject{
    width: 1200px;
    height: 286px;
    margin: 66px auto 78px;
    text-align: center;
}
.hot-subject .hot-subject-title{
    width:218px;
    //height:31px;
    line-height: 31px;
    font-size:38px;
    margin: 0 auto;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(225,229,234,1);
    position: relative;
    text-transform : uppercase;
    user-select: none;
}
.hot-subject .hot-subject-title p{
    font-size:30px;
    color:rgba(76,77,85,1);
    position: absolute;
    top: 0;
    left: 49px;
}
.hot-subject .hot-subject-tips{
    // width:127px;
    // height:14px;
    line-height: 14px;
    font-size:14px;
    margin: 10px auto 49px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.hot-subject .hot-list{
    display: flex;
    justify-content: space-between;
}
.hot-list .hot-item{
    width:280px;
    height:181px;
    background:$color;
    border-radius:10px;
    position: relative;
    overflow: hidden;
    &:hover img{
        transform: scale(1.4);
    }
}
.hot-list .hot-item img{
    border-radius:10px;
    display: inline-block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: all 0.6s;
}
.hot-list .hot-item .hot-item-title{
    width: 100%;
    height: 51px;
    background:linear-gradient(0deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0) 100%);
    border-radius:0px 0px 10px 10px;
    position: absolute;
    bottom: 0;
}
.hot-list .hot-item .hot-item-title p{
    line-height: 20px;
    font-size:20px;
    margin: 19px auto 13px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
}
</style>
