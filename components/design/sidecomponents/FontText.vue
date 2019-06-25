<template>
	<div id="font-text">
		<div class="leftPanel-font">
			<span class="large" 
				@mousedown.stop="handleTextDown($event, 28)"
				@click="addFontText(30)"
			>点击添加标题文字</span>
		</div>
		<div class="leftPanel-font">
			<span class="middle" 
			@mousedown.stop="handleTextDown($event, 20)"
			 @click="addFontText(25)">点击添加副标题文字</span>
		</div>
		<div class="leftPanel-font">
			<span class="small" 
			@mousedown.stop="handleTextDown($event, 14)"
			@click="addFontText(20)">点击添加正文文字</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FontText',
	props: ['pageIndex'],
	data() {
		return {
			textObj: null,
		}
	},
	methods: {
		addFontText(msg) {
			this.$emit('addFontText',msg);
		},
		handleTextDown(e, size) {
			let ele = e.target.parentNode,
				span = document.createElement('span');
			span.innerHTML = ele.innerText;
			span.style.fontSize = size + 'px';
			let obj = {
				type: 'text',
				width: ele.offsetWidth,
				height: ele.offsetHeight,
				_html: span.outerHTML,
				left: e.clientX - e.offsetX,
				top: e.clientY - e.offsetY,
				ox: e.clientX - e.offsetX,
				oy: e.clientY - e.offsetY,
				ex: e.clientX,
				ey: e.clientY,
				off: false,
				ele: ele,
				key: size
			}
			this.$emit('getDragAndDropBox', obj)
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
	margin: 10px 50px;
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
  font-size: 20px;
}
.small {
  font-size: 14px;
}
</style>
