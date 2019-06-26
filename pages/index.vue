<template>
	<div class="container">
		<HeaderTop></HeaderTop>
		<Header id="header" :isFixed="isFixed" :barList="barList" :class="{fixed : isFixed}"></Header>
		<div class="carousel-content" :style="{ marginTop: marginTop }">
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
	async asyncData({app, $axios, route, store, query, req, redirect, error}) {
		
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
			articleList: FooterArticle.data,
			isFixed: false,
			marginTop: 0
		}
	},
	head() {
		return {
			title: '阿里印_在线设计印刷_免费设计_工厂直供_全国发货'
		}
	},
	methods: {
		scrollToTop() {
			let osTop = document.documentElement.scrollTop || document.body.scrollTop
			if (osTop >= 40) {
				this.isFixed = true
				this.marginTop = document.querySelector('#header').offsetHeight + 'px'
			} else {
				this.isFixed = false
				this.marginTop = 0
			}
		}
	},
	mounted() {
		this.$store.commit('login/addToKen', localStorage['token']);
		window.addEventListener('scroll', this.scrollToTop)
	},
	destroyed () {
		window.removeEventListener('scroll', this.scrollToTop); 
	},
}
</script>

<style lang="scss" scoped>
.carousel-content{
	display: flex;
	justify-content: space-between;
	width: 1200px;
	margin: 30px auto 20px;
	padding-top: 25px;
}

</style>

