<template>
	<div>
	</div>
</template>

<script>
export default {
	loading: false,
	async asyncData({$axios, isDev, route, store, env, params, query, req, res, redirect, error}) {
		return {
			t: query.t
		}
	},
	mounted() {
		if (this.$store.state.login.isLogin && localStorage['teamNum']) {
			let n = localStorage['teamNum'];
			let params = `TemplateNumber=${this.t}&TeamNum=${n}` ;
			this.$axios.post('/CopyTemplate', params)
			.then(({data}) => {
				let str = '/design/' +  window.btoa(`DocumentNumber=${data}`)
				this.$router.replace(str)
			})
		} else {
			this.$store.commit('login/toggleShow', true)
		}
	}
}
</script>

<style>

</style>
