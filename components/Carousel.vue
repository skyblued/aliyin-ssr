<template>
    <div class="carousel">
        <el-carousel trigger="click">
            <el-carousel-item v-for="(item,i) in nav" :key="i" :data-v="nav">
                <a target="_blank" :href="item.NavigateUrl">
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
	computed: {
		nav () {
			let ban = JSON.parse(JSON.stringify(this.banner))
			ban.forEach(item => {
				let index = item.NavigateUrl.indexOf('.com')
				if (index > -1) {
					item.NavigateUrl = item.NavigateUrl.slice(index + 4)
				} else {
					item.NavigateUrl = 'javascript: void(0);'
				}
			})
			return ban
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
