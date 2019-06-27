<template>
    <div>
		<HeaderTop></HeaderTop>
		<Header id="header" :isFixed="isFixed" :barList="barList" :class="{fixed : isFixed}"></Header>
		<nuxt-child :style="{ marginTop: marginTop }"></nuxt-child>
		<ToolsBar></ToolsBar>
		<Footer :qrcode="qrcode" :articleList="articleList"></Footer>
    </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import Header from '@/components/home/Header'
import Footer from '@/components/Footer'
import ToolsBar from '@/components/ToolsBar'
export default {
    name: 'print',
    components: {
		HeaderTop,
		Header,
		Footer,
		ToolsBar
    },
    async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
		let [AllTemplate, FooterCode, FooterArticle] = await Promise.all([
			$axios.get(store.state.port.AllTemplate),
			$axios.get(store.state.port.Advertise + '?ID=136'),
			$axios.get('/Articles')
		])
		return {
			barList: AllTemplate.data,
			qrcode: FooterCode.data.Advertisements[0].FileUrl,
			articleList: FooterArticle.data,
			isFixed: false,
			marginTop: 0
		}
	},
	head () {
		return {
			title: '在线印刷_免费设计_工厂直供_送货上门_阿里印'
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

</style>
