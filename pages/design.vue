<template>
	<div>
	</div>
</template>

<script>

export default {
	name: 'design',
	components: {
	},
	async asyncData({store}) {
		// console.log(context)
		// let {data} = await context.$axios.get("/Fonts");
		return {
			// fontList: data
		}
		
	},
	async fetch({store, req, res}) {
		let cookie = store.$cookiz.getAll();
		// console.log(cookie, req.headers.cookie)
	},
	mounted() {
		console.log(this)
		this.$axios.get("/Fonts");
		// console.log(this.fontList)
		
		
	}
}
</script>

<style lang="scss" scoped>

</style>

