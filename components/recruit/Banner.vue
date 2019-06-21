<template>
    <div class="recruit-banner">
        <el-button class="signup-btn">立即报名</el-button>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
.recruit-banner{
    width: 100%;
    height: 720px;
    background-image: url(/img/home/recruit/banner.png);
    background-repeat: no-repeat;
    background-position: 100%;
    position: relative;
    .signup-btn{
        position: absolute;
        left: 45%;
        top: 58%;
        background:rgba(243,152,0,1);
        border-radius:33px;
        border: none;
        text-align: center;
        width: 198px;
        height: 66px;
        line-height: 66px;
        font-size: 25px;
        color: rgba(255,255,255,1);
        padding: 0;
    }
}
</style>
