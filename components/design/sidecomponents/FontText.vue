<template>
	<div id="font-text">
		<div class="leftPanel-font">
			<span class="large" @click="addFontText(30)">点击添加标题文字</span>
		</div>
		<div class="leftPanel-font">
			<span class="middle" @click="addFontText(25)">点击添加标题文字</span>
		</div>
		<div class="leftPanel-font">
			<span class="small" @click="addFontText(20)">点击添加标题文字</span>
		</div>
	</div>
</template>

<script>
export default {
	props: ['pageIndex'],
	name: 'FontText',
	methods: {
		addFontText(msg) {
			this.$emit('addFontText',msg);
		}
	},
	watch: {
		pageIndex () {
			// console.log('触底了')
		}
	}
};
</script>

<style lang="scss" scoped>
.leftPanel-font {
	padding: 10px;
  text-align: center;
  span:hover {
    color: #33a6fb;
    cursor: pointer;
  }
}
.large {
  font-size: 28px;
}
.middle {
  font-size: 18px;
}
.small {
  font-size: 12px;
}
</style>
