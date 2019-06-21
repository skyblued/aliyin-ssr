<template>
	<div>
		<div class="share-content-group" v-if="selectContentList" ref="left">
			<div class="temp-item" v-for="(item, i) in l" :key="i + new Date()">
				<div class="temp-picture-show">
					<img :src="$store.state.port.imgBaseUrl + item.FilePath" @click="handleClick(item)">
				</div>
			</div>
		
		</div>
	<div class="share-content-group" v-if="selectContentList" ref="right">
		<div class="temp-item" v-for="(item, i) in r" :key="i + new Date()">
			<div class="temp-picture-show">
				<img :src="$store.state.port.imgBaseUrl + item.FilePath" @click="handleClick(item)">
			</div>
		</div>
		
	</div>
	</div>
</template>

<script>
import { setWaterfall } from "@/assets/commonJS.js";
export default {
	props: ['selectContentList'],
	data () {
		return {
			l: [],
			r: [],
			list: null,
		}
	},
	watch: {
		// 格式化数据流
		list () {
			if(!this.selectContentList) return

			this.list = this.selectContentList
		},
		
	},
	methods: {
		// 事件上行
		handleClick (item) {
			this.$emit('handleChangeBackground', item)
		},
		// 实现瀑布流
		handleLoad () {
			let list = this.list

			for( let i = 0; i < this.selectContentList.length; i++) {
				let left = this.$refs.left
				let right = this.$refs.right
				console.log(left.offsetHeight,right.offsetHeight)
				// if(left.offsetHeight <= right.offsetHeight) {
				this.l.push(this.selectContentList[i])
				this.r.push(this.selectContentList[i])
			}
			
		}
	},
	mounted () {
		this.handleLoad()
		window.onscroll = function (e) {
			console.log(e)
		}
	},

}
</script>

<style lang="scss">
@import "@/assets/init.scss";
.share-content-group {
	float: left;
	width: 50%;
	min-height: 100%;
	padding-right: 15px;
	position: relative;
	display: flex;
	flex-direction: column;
	// justify-content: space-between;
	.temp-item {
		// position: absolute;
		width: 145px;
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
