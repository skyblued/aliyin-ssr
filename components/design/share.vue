<template>
	<div class="waterfall-parent" ref="waterfallParent" @scroll="setScroll">
		<div class="share-content-group" v-if="selectContentList" ref="waterfall" id="waterfall">
			<div class="temp-item" v-for="(item, i) in list" :key="i">
				<div class="temp-picture-show">
					<img draggable="false" @load="handleLoad"  :src="$store.state.port.imgBaseUrl + item.FilePath + '!w88.src'" @click="handleClick(item)">
				</div>
			</div>
		</div>
		<div v-if="selectContentList.loadingIcon || selectContentList.baseLine" style="position: absolute;width: 100%;text-align:center;padding: 50px 0;">
			<img v-if="selectContentList.loadingIcon" style="height: 40px;" src="//static.aliyin.com/img/loading.svg" title="加载中..." alt="加载中...">
			<span>{{selectContentList.baseLine}}</span>
		</div>
		<div v-if="!selectContentList.loadingIcon && !selectContentList.backgroundList.length" style="text-align:center;padding: 50px 0;"><img style="width: 50%;" src="/img/error/ku.png" title="空空如也" alt="空空如也"></div>
	</div>
</template>

<script>
import { setWaterfall } from "@/assets/js/commonJS.js";
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
			console.log(this.selectContentList)
			return this.selectContentList.backgroundList
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
			let uploading = this.$refs.waterfallParent;
			let total = uploading.scrollHeight; // 整个文档的高度
			let viewHeight = uploading.clientHeight; // 可视区域的高度
			let scrollY = uploading.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
			if (viewHeight + scrollY >= total) {
				this.$emit('getMore')
			}
		},
	},
	mounted () {
	},

}
</script>

<style lang="scss">

.waterfall-parent {
	position: absolute;
	top: 74px;
	left: 0;
	width: 100%;
	bottom: 0;
	overflow-y: auto;
}
.share-content-group {
	width: 100%;
	min-height: 100%;
	position: relative;
	display: flex;
	justify-content: space-between;
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
