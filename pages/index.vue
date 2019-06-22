<template>
	<div class="container">
		<HeaderTop></HeaderTop>
		<Header></Header>
		<div class="carousel-content">
			<TemplateClass></TemplateClass>
			<Carousel></Carousel>
		</div>
		<Steps></Steps>
		<TempCommend></TempCommend>
		<Senior></Senior>
		<Footer></Footer>
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

