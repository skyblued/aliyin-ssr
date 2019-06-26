<template>
	<nuxt-child></nuxt-child>
</template>

<script>
export default {
	loading: false,
	head () {
		return {
			title: '阿里印-设计不求人-设计器',
			meta: [
				{ hid: 'description', name: 'description', content: '在线DIV div' }
			]
		}
	},
	mounted() {
		this.$store.commit('login/addToKen', localStorage['token']);
	}
}
</script>

<style>

</style>
