<template>
    <div class="carousel">
        <el-carousel trigger="click">
            <el-carousel-item v-for="(item,i) in banner" :key="i">
                <a target="_blank" :href="item.NavigateUrl.indexOf('www') > -1 ? item.NavigateUrl : 'javascript:;'">
                    <img :src="$store.state.port.imgBaseUrl+item.FileUrl" alt="" :title="item.AdvertisementName">
                </a>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
    props: ['banner'],
    data() {
        return {
            // banner: []
        }
    },
    methods: {
        getData() {
            var url = "/Advertise?ID="+121;
            this.$axios.get(url).then(res => {
                // console.log(res.data)
                this.banner = res.data.Advertisements
            })
        }
    },
    mounted() {
        // this.getData();
    }
}
</script>

<style lang="scss" scoped>
.carousel /deep/ .el-carousel__container{
    height: 100%;
}
.el-carousel{
    width: 930px;
    height: 375px;
    border-radius:20px;
}
.el-carousel img{
    width: 100%;
    height: 100%;
}
</style>
