<template>
    <div class="carousel">
        <div class="temp-class">
            <TemplateClass></TemplateClass>
        </div>
        <el-carousel trigger="click">
            <el-carousel-item v-for="(item,i) in banner" :key="i">
                <img :src="$store.state.port.imgBaseUrl+item.FileUrl" alt="">
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import TemplateClass from '@/components/home/TemplateClass.vue'
export default {
    data() {
        return {
            banner: []
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
        this.getData();
    },
    components: {
        TemplateClass
    }
}
</script>

<style lang="scss" scoped>
.carousel{
    width: 1200px;
    margin: 30px auto 0;
    display: flex;
    .temp-class{
        width: 255px;
        height: 375px;
        margin-right: 15px;
    }
}
    .carousel /deep/ .el-carousel__container{
        height: 100%;
    }
    .el-carousel{
        width: 1200px;
        height: 409px;
        border-radius:20px;
        margin: 20px auto 53px;
    }
    .el-carousel img{
        width: 100%;
        height: 100%;
    }
</style>
