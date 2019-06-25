<template>
	<div class="color-box">
		<!-- 我的专属颜色 -->
		<div class="my-color">
			<div>
				<span>我的专属颜色 : </span>
				<!-- <span class="color-icon"></span> -->
			</div>
			<div class="color-list">
				<template v-if="myColor.length">
					<div class="color-list-item" :style="{background: item.ColorCode}" v-for="(item,index) in myColor" :key="index"  @click="selectBg(item.ColorCode)"></div>
				</template>
				<template v-else>
					<div style="color: #ccc;">
						<span>还没有专属颜色</span>
						<span>去设置</span>
					</div>
				</template>
			</div>
		</div>
		<!-- 当前模板颜色 -->
		<div class="current-tempcolor">
			<div>当前模板颜色 : </div>
			<div class="tempcolor-list">
				<!-- popper-class="pick-color" -->
				<el-color-picker 
					
					v-model="selectColor" 
					@active-change="handleChange"
					@change="handleChange"
					size="medium"
				></el-color-picker>
				<div class="color-list-item" 
					v-for="(item, index) in useColor" :key="index" 
					:style="{background: item}"
					@click="selectBg(item)"
				></div>
			</div>
		</div>
		<!-- 最近使用颜色 -->
		<div class="current-tempcolor">
			<div>预设颜色 : </div>
			<div class="color-area">
				<div class="color-block pick-icon" @click="setshowPickColor"></div>
				<div class="color-block" v-for="(item, index) in colorBackground" :key="index">
					<div class="color-item" :style="{'background': item.bg}" @click="selectBg(item.bg)"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		selectColor: { // 选择的颜色
			type: String,
			default: '#000'
		},
		useColor: { // 使用过的颜色
			type: Array
		}
	},
	data () {
		return {
			// 团队专属颜色
			myColor: [],
			// 预设颜色
			colorBackground: [
				{bg: 'rgb(255, 255, 255)'},
				{bg: 'rgb(1,187,236)'},
				{bg: 'rgb(244,131,183)'},
				{bg: 'rgb(255,75,90)'},
				{bg: 'rgb(45,110,214)'},
				{bg: 'rgb(255,130,1)'},
				{bg: 'rgb(129,88,190)'},
				{bg: 'rgb(1,177,112)'},
				{bg: 'rgb(255,225,82)'},
				{bg: 'rgb(134,85,70)'},
				{bg: 'rgb(0,156,142)'},
			],
		}
	},
	methods: {
		// 1. 获取团队专属颜色
		getTeamColors () {
			let TeamNum = localStorage['teamNum']
			this.$axios.get(this.$store.state.port.TeamColors + `?TeamNum=${TeamNum}`)
				.then(res => {
					if(!res.data) return
					this.myColor = res.data
				})
		},
		// 2. 取色器颜色上传
		handleChange (color) {
			this.selectBg(color)
		},
		// 3. 颜色值数据上行父组件
		selectBg (color) {
			this.$emit('setTextColor', color)
		},
		setshowPickColor() { // 开启吸管
			this.$emit('setShowPickColor')
		},
	},
	created () {
		this.getTeamColors()
	}
}
</script>


<style lang="scss" scoped>
.color-box {
	width: 260px;
    padding: 14px 14px 4px;
	box-shadow: 0 2px 8px rgba(0,0,0,.24);
	font-size: 14px;
}
.my-color {
	.color-icon {
		display: inline-block;
		width: 45px;
		height: 15px;
		background: url(/img/desicon/background/vip_small_icon.png) no-repeat;
		background-size: 100%;
		margin-left: 10px;
		margin-bottom: -3px;
	}
	.color-list {
		padding-top: 10px;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		
	}
}
.tempcolor-list {
	padding-top: 10px;
}
.color-list-item {
	display: inline-block;
	width: 26px;
	height: 26px;
	margin: 5px;
	border-radius:3px;
	transition: all .3s;
	box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
	cursor: pointer;
	&:hover{
		transform: scale(1.1);
		box-shadow: 0 0px 5px 2px rgba(0, 0, 0, 0.3);
	}
}
.current-tempcolor {
	padding-top: 10px;
	.color-area{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		padding-top: 10px;
		.color-block{
			width: 26px;
			height: 26px;
			margin-right: 10px;
			margin-bottom: 10px;
			.color-item{
				width: 100%;
				height: 100%;
				border-radius:3px;
				transition: all .3s;
				cursor: pointer;
				&:hover{
					transform: scale(1.1);
					box-shadow: 0 0px 5px 2px rgba(0, 0, 0, 0.3);
				}
			}
			.color-item:first-child {
				border: 1px solid #ccc;
			}
		}
	}
}
.pick-icon {
	border: 1px solid #ccc;
	border-radius: 3px;
	background-image: url(/img/desicon/topTool/pick.png);
	background-size: 50%;
	background-repeat: no-repeat;
	background-position: 50%;
	cursor: pointer;
}
</style>

