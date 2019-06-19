<template>
	<div class="box">
		这是主页
		<nuxt-child></nuxt-child>
		<nuxt-link to="/">首页</nuxt-link>
	</div>
</template>
<script>
export default {
	async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
		console.log(route)
		//沙发斯蒂芬多福多寿
		
	},
	transition: 'page'
}
</script>

<style lang="scss" scoped>
.box {
	width: 100px;
	height: 200px;
	background: red;
}
</style>
