<template>
    <div class="senior">
        <div class="senior-title">
            partners
            <p>他们都在用</p>
        </div>
        <div class="senior-tips">
            <p>数万家优质店铺与企业选择我们</p>
        </div>
        <div class="senior-img" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/home/line.png'})`}">
            <img v-for="(item,i) in imgList" :key="i" :src="$store.state.port.staticPath + item.url" alt="">
        </div>
        <nuxt-link to="/templateList">
            <span class="senior-btn">选择模板</span>
        </nuxt-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active: null,
            imgList: [{
                value: 0,
                url: '/img/home/logo/1.png'
            },{
                value: 1,
                url: '/img/home/logo/2.png'
            },{
                value: 2,
                url: '/img/home/logo/3.png'
            },{
                value: 3,
                url: '/img/home/logo/4.png'
            },{
                value: 4,
                url: '/img/home/logo/5.png'
            },{
                value: 5,
                url: '/img/home/logo/6.png'
            },{
                value: 6,
                url: '/img/home/logo/7.png'
            },{
                value: 7,
                url: '/img/home/logo/8.png'
            },{
                value: 8,
                url: '/img/home/logo/9.png'
            },{
                value: 9,
                url: '/img/home/logo/10.png'
            },{
                value: 10,
                url: '/img/home/logo/11.png'
            },{
                value: 11,
                url: '/img/home/logo/12.png'
            },{
                value: 12,
                url: '/img/home/logo/13.png'
            },{
                value: 13,
                url: '/img/home/logo/14.png'
            },{
                value: 14,
                url: '/img/home/logo/15.png'
            },]
        }
    },
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
    margin: 10px auto 38px; 
}
.senior .senior-img{
    height: 483px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    position: relative;
    // background-image: url(/img/home/line.png);
    img{
        width: 209px;
        height: 97px;
        margin-bottom: 30px;
    }
    img:nth-child(6),img:nth-child(7),img:nth-child(8),img:nth-child(9),img:nth-child(10) {
        position: relative;
        bottom: 5px;
    }
    img:nth-child(11),img:nth-child(12),img:nth-child(13),img:nth-child(14),img:nth-child(15) {
        margin-bottom: 10px;
    }
    .senior-item{
        width: 229px;
        height: 119px;
        cursor: pointer;
    }
}

.senior-btn{
    display: inline-block;
    background: linear-gradient(112deg,rgba(23,182,255,1) 0%,rgba(96,148,233,1) 40%,rgba(156,54,255,1) 150%);
    border-radius: 31px;
    width: 394px;
    height: 62px;
    line-height: 62px;
    text-align: center;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    font-size:22px;
    color:rgba(255,255,255,1);
    margin-top: 85px;
    cursor: pointer;
    user-select: none;
}
</style>
