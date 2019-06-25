<template>
    <div>
        <Carousel :carouselBanner="carouselBanner"></Carousel>
        <Recommend :recommendList="recommendList" :banner="banner"></Recommend>
        <PrintProduct :floorList="floorList" :floorBanner="floorBanner"></PrintProduct>
        <PrintFooter></PrintFooter>
    </div>
</template>

<script>
import Carousel from '@/components/print/Carousel'
import Recommend from '@/components/print/Recommend'
import PrintProduct from '@/components/print/PrintProduct'
import PrintFooter from '@/components/print/PrintFooter'
export default {
    components: {
        Carousel,
        Recommend,
        PrintProduct,
        PrintFooter
    },
    async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
		let [Carousel,Recommend,RecommendBanner,PrintProduct] = await Promise.all([
            $axios.get(store.state.port.Advertise + '?ID=133'),
            $axios.get(store.state.port.Advertise + '?ID=134'),
            $axios.get(store.state.port.Advertise + '?ID=135'),
            $axios.post('/Floors'),
		])
		return {
            carouselBanner: Carousel.data.Advertisements,
            recommendList: Recommend.data.Advertisements,
            banner: RecommendBanner.data.Advertisements[0],
            floorList: PrintProduct.data,
            floorBanner: RecommendBanner.data.Advertisements[1],
		}
    },
}
</script>

<style lang="scss" scoped>

</style>
