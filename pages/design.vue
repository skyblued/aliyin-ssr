<template>
	<div>
	</div>
</template>

<script>

export default {
	name: 'design',
	components: {
	},
	async asyncData({app, store}) {
		console.log(process.server)
		// console.log(app.$cookiz)
		// let form = new FormData();
		// app.myInjectedFunction('123131')
		// console.log()
		// console.log(context)
		// let {data} = await context.$axios.get("/Fonts");
		return {
			// fontList: data
		}
		
	},
	async fetch({app, req, res}) {
		let cookie = app.$cookiz.getAll();
		// console.log(cookie, req.headers.cookie)
	},
	mounted() {
		// console.log(this)
		// this.$axios.get("/Fonts");
		// console.log(this.fontList)
		
		
	}
}
</script>

<style lang="scss" scoped>

</style>

