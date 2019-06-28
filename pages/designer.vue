<template>
	<nuxt-child></nuxt-child>
</template>

<script>
export default {
	loading: false,
	head () {
		return {
			title: '阿里印-设计不求人-设计器',
			htmlAttrs: {
				lang: 'zh-CN',
			}
		}
	},
	asyncData({app, isDev, route, store, env, params, query, req, res, redirect, error}) {
		if (!store.state.login.token) store.commit('login/toggleShow', true)
	},
	mounted() {
		this.$store.commit('login/addToKen', localStorage['token']);
	}
}
</script>

<style>

</style>
