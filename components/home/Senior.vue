<template>
    <div class="senior">
        <div class="senior-title">
            partners
            <p>他们都在用</p>
        </div>
        <div class="senior-tips">
            <p>数万家优质店铺与企业选择我们</p>
        </div>
        <div class="senior-img">
            <!-- <img :src="$store.state.port.staticPath + '/img/home/senior-icon.png'" alt=""> -->
            <div class="senior-item sprite" :style="{backgroundPosition: item.position}" v-for="(item,i) in imgList" :key="i"></div>
        </div>
        <div class="senior-btn"  @click="handleClick">
            <img :src="$store.state.port.staticPath + '/img/home/cjsj_icon.png'" alt="">
            <span>创建设计</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imgList: [{
                position: '0 0'
            },{
                position: '229px 0'
            },{
                position: '480px 0'
            },{
                position: '731px 0'
            },{
                position: '981px 0'
            },{
                position: '0 133px'
            },{
                position: '229px 133px'
            },{
                position: '480px 133px'
            },{
                position: '731px 133px'
            },{
                position: '981px 133px'
            },{
                position: '0 297px'
            },{
                position: '229px 297px'
            },{
                position: '480px 297px'
            },{
                position: '731px 297px'
            },{
                position: '981px 297px'
            },]
        }
    },
    methods: {
        handleClick() {
            this.$router.push('/createdesign')
        }
    }
}
</script>

<style lang="scss" scoped>

.senior{
    width: 1200px;
    height: 783px;
    margin: 55px auto 0;
    text-align: center;
}
.senior .senior-title{
    width:207px;
    line-height: 31px;
    font-size:38px;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(225,229,234,1);
    margin: 0 auto;
    text-transform: uppercase;
    position: relative;
}
.senior .senior-title p{
    font-size:29px;
    color:rgba(76,77,85,1);
    position: absolute;
    top: 0;
    left: 30px;
}
.senior .senior-tips{
    line-height: 15px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    margin: 10px auto; 
}
.senior .senior-img{
    height: 483px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .sprite{
        background-image: url(/img/home/senior-icon.png);
    }
    .senior-item{
        width: 229px;
        cursor: pointer;
    }
}
// .senior .senior-img img{
//     width: 100%;
//     height: 100%;
// }

.senior-btn{
    display: inline-block;
    background:rgba(243,152,0,1);
    border-radius:5px;
    width: 212px;
    height: 75px;
    line-height: 75px;
    text-align: center;
    font-size:22px;
    color:rgba(255,255,255,1);
    margin-top: 85px;
    cursor: pointer;
    user-select: none;
    img{
        display: inline-block;
        vertical-align: middle;
        margin-right: 28px;
    }
}
</style>
