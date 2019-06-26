<template>
    <div>
        <Header></Header>
        <nuxt-child />
        <Footer :qrcode="qrcode" :articleList="articleList"></Footer>
    </div>
</template>

<script>
import Header from '@/components/submitorder/Header'
import Footer from '@/components/Footer'
export default {
    components: {
        Header,
        Footer
    },
    async asyncData({app, $axios, route, store, query, req, redirect, error}) {
		let [FooterCode, FooterArticle] = await Promise.all([
			$axios.get(store.state.port.Advertise + '?ID=136'),
			$axios.get('/Articles')
		])
		return {
			qrcode: FooterCode.data.Advertisements[0].FileUrl,
			articleList: FooterArticle.data,
		}
	},
}
</script>

<style lang="scss" scoped>

</style>
