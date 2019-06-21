<template>
    <div class="steps">
        <div class="steps-title">
            Platform design process
            <p>平台设计流程</p>
        </div>
        <div class="steps-tips">
            <p>只需一步，轻松搞定</p>
        </div>
        <div class="steps-list">
            <div class="steps-item">
                <p class="choose"><span>选择模块</span></p>
                <img :src="$store.state.port.staticPath + '/img/home/xzmk.png'" alt="">
            </div>
            <img class="arrow-icon" :src="$store.state.port.staticPath + '/img/home/arrow_icon.png'" alt="">
            <div class="steps-item">
                <p class="modify"><span>修改内容</span></p>
                <img :src="$store.state.port.staticPath + '/img/home/xgnr.png'" alt="">
            </div>
            <img class="arrow-icon" :src="$store.state.port.staticPath + '/img/home/arrow_icon.png'" alt="">
            <div class="steps-item">
                <p class="download"><span>一键下载</span></p>
                <img :src="$store.state.port.staticPath + '/img/home/yjxz.png'" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.steps{
    width: 1200px;
    height: 288px;
    margin: 0 auto;
    text-align: center;
}
.steps .steps-title{
    width:483px;
    height:27px;
    line-height: 27px;
    font-size:32px;
    margin: 0 auto;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(225,229,234,1);
    position: relative;
    text-transform : uppercase
}
.steps .steps-title p{
    width:180px;
    height:30px;
    font-size:30px;
    color:rgba(76,77,85,1);
    position: absolute;
    top: 0;
    left: 150px;
}
.steps .steps-tips{
    width:126px;
    height:13px;
    line-height: 13px;
    font-size:14px;
    margin: 13px auto 35px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.steps .steps-list{
    width: 100%;
    height: 200px;
    line-height: 200px;
    display: flex;
    justify-content: space-between;
}
.steps-list .steps-item p{
    display: inline-block;
    width:54px;
    height:166px;
    border-radius:5px;
    padding: 23px 15px 23px 13px;
    margin: 23px 0 11px 0;
}
.steps-list .steps-item p span{
    display: inline-block;
    width:26px;
    height:120px;
    font-size:26px;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:30px;
}
.steps-list .steps-item p.choose{
    background:linear-gradient(-49deg,rgba(74,162,255,1) 0%,rgba(87,198,234,1) 100%);
    margin-right: 19px;
}
.steps-list .steps-item p.modify{
    background:linear-gradient(-49deg,rgba(254,121,143,1) 0%,rgba(251,143,135,1) 100%);
    margin-right: 15px;
}
.steps-list .steps-item p.download{
    background:linear-gradient(-49deg,rgba(255,157,55,1) 0%,rgba(255,191,55,1) 100%);
    margin-right: 43px;
}
.steps-list .steps-item img{
    vertical-align: top;
}
.steps-list .arrow-icon{
    margin: 92px 0 88px;
}
</style>
