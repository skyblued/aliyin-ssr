<template>
	<div>
		<div class="share-content-group" @scroll="setScroll" v-if="selectContentList" ref="waterfall" id="waterfall">
			<div class="temp-item" v-for="(item, i) in list" :key="i">
				<div class="temp-picture-show">
					<img draggable="false" @load="handleLoad"  :src="$store.state.port.imgBaseUrl + item.FilePath + '!w88.src'" @click="handleClick(item)">
				</div>
			</div>
		</div>
		<div style="height: 200px"></div>
	</div>
</template>

<script>
import { setWaterfall } from "@/assets/commonJS.js";
export default {
	props: ['selectContentList'],
	data () {
		return {
		}
	},
	computed: {
		// 格式化数据流
		list () {
			if(!this.selectContentList) return
			// console.log(this.selectContentList)
			return this.selectContentList
		},
		
	},
	methods: {
		// 事件上行
		handleClick (item) {
			this.$emit('handleChangeBackground', item)
		},
		// 实现瀑布流
		handleLoad () {
			let waterfall = this.$refs.waterfall;
			try {
				setWaterfall(waterfall, 10, 10)
			} catch (error) {
				console.log(error)
			}
		},
		setScroll() { //加载更多
			let uploading = this.$refs.waterfall;
			let total = uploading.scrollHeight; // 整个文档的高度
			let viewHeight = document.documentElement.clientHeight; // 可视区域的高度
			let scrollY = uploading.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
			this.mouseTop = scrollY
			if (viewHeight + scrollY >= total - 244) {
				this.$emit('getMore')
			}
		},
	},
	mounted () {
	},

}
</script>

<style lang="scss">
@import "@/assets/init.scss";
.share-content-group {
	width: 100%;
	min-height: 100%;
	margin-top: 20px;
	position: relative;
	display: flex;
	justify-content: space-between;
	overflow-y: scroll;
	.temp-item {
		position: absolute;
		width: 95px;
		border-radius:3px;
		overflow: hidden;
		cursor: pointer;
		transition: all .3s;
		&:hover .temp-info-show {
			display: block;
		}
	}
	.temp-picture-show {
		width: 100%;
		img {
			display: block;
			width: 100%;
		}
	}
	.temp-info-show {
		display: none
	}
	.temp-item-store {
		position: absolute;
		right: 7px;
		top: 7px;
		width: 20px;
		height: 20px;
		background: #fff;
		border-radius:2px;
		cursor: pointer;
		.store-icon {
			display: inline-block;
			width: 20px;
			height: 20px;
			background: url(/img/desicon/collect_gray_icon.png) no-repeat;
			background-size: 100% 100%;
		}
		.store-icon-active {
			background: url(/img/desicon/collect_red_icon.png) no-repeat;
		}
	}
	.temp-item-detail {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 20px 5px 10px;
		display: flex;
		justify-content: space-between;
		.detail-price {
			display: inline-block;
			padding: 3px 8px;
			font-size: 14px;
			color: #fff;
			font-weight: bold;
		}
		.detail-shopping {
			display: inline-block;
			padding: 3px 8px;
			font-size: 12px;
			background: $color;
			border-radius:3px;
			color: #fff;
			cursor: pointer;
		}
	}
}
</style>
