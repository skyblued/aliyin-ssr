<template>
	<div>
	</div>
</template>

<script>
export default {
	loading: false,
	async asyncData({$axios, isDev, route, store, env, params, query, req, res, redirect, error}) {
		return {
			q: {
				t: query.t,
				n: query.n
			}
		}
	},
	mounted() {
		if (this.$store.state.login.isLogin) {
			if (this.q.n == 'undefined' || this.q.n == undefined) this.q.n = localStorage['teamNum'];
			let params = `TemplateNumber=${this.q.t}&TeamNum=${this.q.n}` ;
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
