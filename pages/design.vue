<template>
	<nuxt-child></nuxt-child>
</template>

<script>
export default {
	loading: false,
	mounted() {
		this.$store.commit('addToken', localStorage['token']);
	}
}
</script>

<style>

</style>
