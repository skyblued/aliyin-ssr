<template>
	<div class="container">
		<HeaderTop></HeaderTop>
		<Header></Header>
		<div class="carousel-content">
			<TemplateClass :barList="barList"></TemplateClass>
			<Carousel :banner="banner"></Carousel>
		</div>
		<Steps :bannerList="bannerList"></Steps>
		<TempCommend :label="label"></TempCommend>
		<Senior></Senior>
		<Footer :qrcode="qrcode" :articleList="articleList"></Footer>
	</div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import Header from '@/components/home/Header'
import TemplateClass from '@/components/home/TemplateClass'
import Carousel from '@/components/Carousel'
import Steps from '@/components/home/Steps'
import TempCommend from '@/components/home/TempCommend'
import Senior from '@/components/home/Senior'
import Footer from '@/components/Footer'
export default {
	name: 'home',
	components: {
		HeaderTop,
		Header,
		TemplateClass,
		Carousel,
		Steps,
		TempCommend,
		Senior,
		Footer
	},
	async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
		let cookie = store.$cookiz.getAll();
		if (req) console.log(cookie,isDev, req.headers.cookie);
		let [AllTemplate, Carousel, Steps, TempCommend, FooterCode, FooterArticle] = await Promise.all([
			$axios.get(store.state.port.AllTemplate),
			$axios.get(store.state.port.Advertise + '?ID=131'),
			$axios.get(store.state.port.Advertise + '?ID=138'),
			$axios.get('/RecommendTemplaleClass?TeamNum=' + '19'),
			$axios.get(store.state.port.Advertise + '?ID=136'),
			$axios.get('/Articles')
		])
		return {
			barList: AllTemplate.data,
			banner: Carousel.data.Advertisements,
			bannerList: Steps.data.Advertisements,
			label: TempCommend.data,
			qrcode: FooterCode.data.Advertisements[0].FileUrl,
			articleList: FooterArticle.data
		}
	}
}
</script>

<style lang="scss" scoped>
.carousel-content{
	display: flex;
	justify-content: space-between;
	width: 1200px;
	margin: 30px auto 20px;
}
</style>

