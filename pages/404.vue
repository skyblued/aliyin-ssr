<template>
	<div style="text-align:center">
		您访问的页面不存在即将跳转到首页...<span>{{time}}</span>
	</div>

</template>

<script>
export default {
	data() {
		return {
			time: 3
		}
	},
	mounted() {
		var timer = setInterval(() => {
			this.time--;
			if (this.time == 0) {
				clearInterval(timer)
				this.$router.replace('/')
			}
		}, 1000)
	}
}
</script>

<style>

</style>
