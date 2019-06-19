<template>
	<div>
		这是主页
	</div>
</template>
<script>
export default {
	async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
		// console.log(window)
		return new Promise((resolve) => {
			setTimeout(function () {
				resolve({})
			}, 3000)
		})
	},
	transition: 'page'
}
</script>
