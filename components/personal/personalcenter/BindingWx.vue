<template>
    <div class="binding-wx">
        <img :src="$store.state.port.staticPath + '/img/Qrcode.png'" alt="">
        <span>请使用微信二维码扫描登录</span>
        <div class="binding-btn">立即绑定</div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>

.binding-wx{
    width: 517px;
    text-align: center;
    margin-top: 85px;
    user-select: none;
    img{
        width: 235px;
        height: 235px;
    }
    span{
        font-size:18px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
        display: block;
        margin: 28px auto 39px;
    }
    .binding-btn{
        background: $color;
        border-radius: 5px;
        width: 179px;
        height: 48px;
        line-height: 48px;
        margin: 0 auto;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color:rgba(254,254,254,1);
        cursor: pointer;
        &:hover{
            background: #0893ff;
        }   
    }
}
</style>
