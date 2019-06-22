<template>
	
</template>

<script>
export default {
	mounted() {
		this.$axios.get("/Fonts")
		.then(data => {
			console.log(data)
		})
	}
}
</script>

<style>

</style>
