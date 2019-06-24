<template>
    <div>
		<HeaderTop></HeaderTop>
		<Header></Header>
        <Advertisement :banner="banner"></Advertisement>
		<Footer :qrcode="qrcode" :articleList="articleList"></Footer>
    </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import Header from '@/components/home/Header'
import Advertisement from '@/components/createdesign/Advertisement'
import Footer from '@/components/Footer'
export default {
    name: 'templatecenter',
    components: {
		HeaderTop,
		Header,
		Advertisement,
		Footer
    },
    async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
		let [Advertisement,FooterCode, FooterArticle] = await Promise.all([
			$axios.get(store.state.port.Advertise + '?ID=132'),
			$axios.get(store.state.port.Advertise + '?ID=136'),
			$axios.get('/Articles')
		])
		return {
			banner: Advertisement.data.Advertisements,
			qrcode: FooterCode.data.Advertisements[0].FileUrl,
			articleList: FooterArticle.data
		}
	},
}
</script>

<style lang="scss" scoped>

</style>
