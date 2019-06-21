<template>
	<div class="container">
		<HeaderTop></HeaderTop>
		<Header></Header>
		<Footer></Footer>
	</div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import Header from '@/components/home/Header'
import Footer from '@/components/Footer'
export default {
	name: 'home',
	components: {
		HeaderTop,
		Header,
		Footer
	}
}
</script>

<style lang="scss" scoped>

</style>

