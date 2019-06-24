<template>
    <div>
		<HeaderTop></HeaderTop>
		<Header></Header>
		<nuxt-child></nuxt-child>
		<Footer :qrcode="qrcode" :articleList="articleList"></Footer>
    </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import Header from '@/components/home/Header'
import Footer from '@/components/Footer'
export default {
    name: 'print',
    components: {
		HeaderTop,
		Header,
		Footer
    },
    async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
		let [FooterCode, FooterArticle] = await Promise.all([
			$axios.get(store.state.port.Advertise + '?ID=136'),
			$axios.get('/Articles')
		])
		return {
			qrcode: FooterCode.data.Advertisements[0].FileUrl,
			articleList: FooterArticle.data
		}
	},
}
</script>

<style lang="scss" scoped>

</style>
