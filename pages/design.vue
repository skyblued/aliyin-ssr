<template>
	<div>
		
	</div>
</template>

<script>
export default {
	name: 'design',
	async asyncData({$axios, isDev, route, store, env, params, query, req, res, redirect, error}) {
		// let {data} = await $axios.get("/Fonts");
		return {
			// fontList: data
		}
		
	},
	mounted() {
		// console.log(this.fontList)
		
		
	}
}
</script>

<style lang="scss" scoped>

</style>

