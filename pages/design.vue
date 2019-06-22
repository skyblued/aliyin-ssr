<template>
	<div>
		
	</div>
</template>

<script>
export default {
	name: 'design',
	async asyncData({$axios, isDev, route, store, env, params, query, req, res, redirect, error}) {
		console.log($axios)
		// let {data} = await $axios.get("/Fonts");
		return {
			// fontList: data
		}
		
	},
	async fetch({store, req, isClient}) {
		console.log(req.headers.cookie,isClient)
	},
	mounted() {
		// console.log(this.fontList)
		
		
	}
}
</script>

<style lang="scss" scoped>

</style>

