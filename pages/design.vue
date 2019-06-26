<template>
	<nuxt-child></nuxt-child>
</template>

<script>
export default {
	loading: false,
	mounted() {
		this.$store.commit('login/addToKen', localStorage['token']);
	}
}
</script>

<style>

</style>
