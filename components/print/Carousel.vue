<template>
    <div class="carousel">
        <el-carousel trigger="click">
            <el-carousel-item v-for="(item,i) in carouselBanner" :key="i">
                <img :src="$store.state.port.imgBaseUrl + item.FileUrl" alt="">
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
    props: ['carouselBanner'],
    data() {
        return {
            
        }
    },
}
</script>

<style lang="scss" scoped>
.carousel /deep/ .el-carousel__container{
    height: 100%;
}
.el-carousel{
    width: 1200px;
    height: 409px;
    border-radius:20px;
    margin: 20px auto 23px;
}
.el-carousel img{
    width: 100%;
    height: 100%;
}
</style>
