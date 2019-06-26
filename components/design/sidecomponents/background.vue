<template>
	<div class="background">
        <div class="background-type">
            <span :class="backgroundType == 'pure'? 'type-active': ''" @click="handleToggleType('pure')">纯色背景</span>
            <span :class="backgroundType == ''? 'type-active': ''" @click="handleToggleType('')">图片背景</span>
            <!-- 本地背景图片上传 -->
            <div class="background-upload-file">
                <div class="local">
                    <div class="upload-btn upload-text" @click="uploadFile()">本地上传</div>
                    <input ref="uploadBackground" type="file" accept="image/*" @change="handleUpload($event)" multiple>
                </div>
            </div>
        </div>
		<div v-if="progress.show" style="height: 40px; text-align:center">
			<img style="height:100%;vertical-align: middle;" src="//static.aliyin.com/img/loading.svg" alt="">
		</div>
		<transition name="fade" mode="out-in">
			<template v-if="backgroundType">
				<!-- 纯色背景 -->
				<div key="1" class="pure-background" v-if="backgroundType">
					<!-- 我的专属颜色 -->
					<div class="my-color">
						<div>
							<span>我的专属颜色 : </span>
							<span class="color-icon"></span>
						</div>
						<div class="color-list">
							<template v-if="myColor">
								<div class="color-list-item" :style="{background: item.ColorCode}" v-for="(item,index) in myColor" :key="index"  @click="selectBg(item.ColorCode)"></div>
							</template>
							<template v-else>
								<div>
									<span>还没有专属颜色</span>
									<span>去设置</span>
								</div>
							</template>
						</div>
					</div>
					<!-- 当前模板颜色 -->
					<div class="current-tempcolor">
						<div>当前模板颜色 : </div>
						<div>
							<el-color-picker v-model="color5" @active-change="handleChange"></el-color-picker>
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
			<!-- 图片背景 -->
			<template v-else>
				<div :style="{top: `${progress.show ? 94 : 54}px`}" key="2" ref="backgroundImage" class="backgroundImage" @scroll="getMore" >
					<div v-for="(item, index) of backgroundList"
						:key="index"
						class="column-item">
							<img @load="handleWaterfall"
								class="img-mash" draggable="false" 
								@click="handleChangeBackground(item)" 
								:src="$store.state.port.imgBaseUrl + item.FilePath + (item.Svgtext == '' ? '!w300.src' : '')" alt="">
					</div>
				</div>
			</template>
		</transition>
			
		
	</div>
</template>

<script>
import { setWaterfall } from "@/assets/js/commonJS.js";
import Share from '@/components/design/share.vue'
export default {
	props: {
		useColor: { // 使用过的颜色
			type: Array
		},
		fontColorSelect: String
	},
	components: {
		Share,
	},
	name: 'background',
	data () {
		return {
			params: { // 获取背景数据参数
				pageIndex: 1,
				TypeCategoryNum: 0,
				pageSize: 30
			},
            backgroundType: 'pure',
			color5: this.fontColorSelect,
			// 团队专属颜色
			myColor: null,
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
			// 背景表现列表
			MaterialCategories: [],
			loadingIcon: true,
			baseLine: '',
			backgroundList: [],
			waterfallList: [], // 瀑布流
			// 上传进度条
			progress: {
				show: false, w: 0
			}
		}
	},
	methods: {
        /**
         * 切换背景类型
         * @param {String} type 背景类型
         */
        handleToggleType (type) {
			this.backgroundType = type
			type == 'pure' ? this.getData() : ''
		},
		handleWaterfall() { // 瀑布流
			setWaterfall(this.$refs.backgroundImage)
		},
		/**
		 * 纯色背景
		 */
		// 1. 获取团队专属颜色
		getTeamColors () {
			let TeamNum = localStorage['teamNum']
			this.$axios.get(this.$store.state.port.TeamColors + `?TeamNum=${TeamNum}`)
				.then(res => {
					if(!res.data) return
					this.myColor = res.data
				})
		},
		// 绑定上传事件
		uploadFile() {
			this.$refs.uploadBackground.click();
		},
		/**
		 * 上传图片
		 */
		handleUpload (e) {
			let file = this.$refs.uploadBackground.files[0];
			let formdata = new FormData()
			let teamNum = localStorage['teamNum']
			formdata.append('TeamNum', teamNum)
			formdata.append('TypeNum', 0)
			formdata.append('TypeCategoryNum', 0)
			formdata.append('file', file)
			formdata.append('IsPublic', 0)
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				onUploadProgress: (e) => {
					let w = Math.abs(Math.ceil(e.loaded / e.total)) * 100 - 5 + '%'
					this.$set(this.progress, 'w', w)
				}
			}
			this.progress.show = true
			this.$axios.post(this.$store.state.port.TeamMaterial, formdata, config)
					.then(res =>{
						this.$set(this.progress, 'w', '100%')
						this.progress.show = false
						let data = res.data;
							data = typeof data == 'object' ? data : JSON.parse(data)
						this.$message({ message: '上传成功', type: 'success'});
						this.progress.w = 0
						if(data.status == 'ok') {
							let obj = {FilePath: data.key, type: 'image'}
							this.handleChangeBackground(obj)
						}
					}).catch(err => {
						this.progress.show = false
						this.$message({ message: '上传失败', type: 'warning'});
						console.log(err)
					})

		},
		// 获取背景标签
		getMaterialCategories () {
			this.$axios.get(this.$store.state.port.MaterialCategories + `?TypeNum=11`)
			.then(res =>{
				this.MaterialCategories = res.data
			})

		},
		// 获取背景图片数据
		getData () {
			this.params.pageIndex = 1
			this.backgroundList = []
			this.baseLine = ''
			this.getBackgroundData().then(data => {
				this.backgroundList = data.Data
			})
		},
		getBackgroundData () {
			this.loadingIcon = true;
			return new Promise((resolve, reject) => {
				this.$axios.get(this.$store.state.port.MaterialInfos + `?TypeNum=11&TypeCategoryNum=${this.params.TypeCategoryNum}&pageIndex=${this.params.pageIndex}&pageSize=${this.params.pageSize}`).then(res => {
					this.loadingIcon = false;
					let data = res.data;
						data = typeof data == 'object' ? data : JSON.parse(data)
					resolve(data)
				})
			})
		},
		// 加载更多背景图片数据
		getMore (e) {
			if (this.baseLine) return
			let uploading = this.$refs.backgroundImage;
			let total = uploading.scrollHeight; // 整个文档的高度
			let viewHeight = uploading.clientHeight; // 可视区域的高度
			let scrollY = uploading.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
			this.mouseTop = scrollY
			this.params.pageSize = 10
			if (viewHeight + scrollY >= total) {
				this.params.pageIndex++;
				console.log(this.params.pageIndex)
				this.getBackgroundData().then(data => {
					this.backgroundList = this.backgroundList.concat(data.Data)
					if (this.params.pageIndex >= data['X-Pagination'].TotalPages) this.baseLine = '我是有底线的'
				})
			}
			
		},
		/**
		 * 传给父组件图片src
		 */
		handleChangeBackground (obj) {
			let src = {};
			src.msg = obj.Svgtext || obj.FilePath
			if(src.msg !== obj.Svgtext) {
				src.msg = 'http://img.aliyin.com/' + src.msg + '!w800.src';
				src.type = 'image'
			} else {
				src.type = 'svg'
			}
			
			this.$emit('handleChangeBackground', src)
		},
		
		// 选择颜色上传给父组件
		selectBg (color) {
			let obj = {background: color, type: 'color'}
			this.$emit('handleChangeBackground', obj);
		},
		// 取色器发生变化触发
		handleChange (color) {
			let obj = {background: color, type: 'color'}
			this.$emit('handleChangeBackground', obj);
		},
		setshowPickColor() { // 开启吸管
			this.$emit('setShowPickColor')
		},
	},
	mounted () {
		this.getData();
		this.getTeamColors();
		this.getMaterialCategories();
	},
	watch: {
		fontColorSelect(val) {
			this.color5 = val;
		}
	}
}
</script>

<style lang='scss' scoped>

.background {
	width: 100%;
	height: 100%;
	position: relative;

.background-type {
    padding-left: 10px;
    display: flex;
	padding-top: 20px;
    span {
        display: inline-block;
		font-size: 12px;
        text-align: center;
		border:1px solid rgba(220,220,220,1);
		border-radius:3px;
		color: rgba(51, 51, 51, 1);
		padding: 8px 12px;
		cursor: pointer;
        margin-right: 10px;
    }
    .type-active {
        color: #fff;
        background: $color;
    }

}

.pure-background {
    padding-top: 20px;
	padding-left: 10px;
	font-size: 14px;
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
			& .color-block:first-child .color-item{
				border: 1px solid rgba(0, 0, 0, .2);
			}
			.color-block{
				width: 26px;
				height: 26px;
				margin-right: 10px;
				margin-bottom: 10px;
				
				.color-item{
					width: 100%;
					height: 100%;
					border-radius:3px;
					border: 1px solid #ccc;
					transition: all .3s;
					cursor: pointer;
					&:hover{
						transform: scale(1.1);
						box-shadow: 0 1px 8px 2px rgba(0, 0, 0, 0.3);
					}
				}
			}
		}
	}
}

.background-upload-file{
	width: 80px;
	text-align: center; 
	.local{
		height: 30px;
		position: relative;
		.upload-btn {
			width: 100%;
            font-size: 12px;
			padding: 8px 12px;
			color: #fff;
			border-radius: 3px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}
		.upload-text {
			background: $color;
		}
		.upload-progress {
			background: rgba(0,0,0, .3);
			border-radius: 10px;
		}
		.upload-animate {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			
		}
		input{
			display: none;
		}
	}
}
.backgroundImage {
	position: absolute;  
	width: 100%; 
	bottom: 0px;
	overflow-y: auto;
}
.column-item {
	  position: absolute;
	  width: 98px;
      padding: 3px;
      font-size: 0;
      box-sizing: border-box;
      transition: all .3s ease;
	  cursor: pointer;
      img {
        max-width: 100%;
      }
	  &:hover .del-icon,&:hover .leftPanel-common-results-item-collect {
		  display: block;
	  }
	  & .collect-active {
			background-image: url(/img/desicon/matter/collect_red_icon.png)
		}
	&:hover .img-mash {
		background-color: rgba(0, 0, 0, .2);
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

.progress-bar{
	height: 100%;
	position: relative;
	animation: animate-positive 2s;
	background-color: #048CED;
	box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
	transition: width .6s ease;
}
.progress-bar.active{
	animation: reverse progress-bar-stripes 0.40s linear infinite, animate-positive 2s;
}
.progress-bar-striped {
	background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
	background-size: 40px 40px;
}
@keyframes animate-positive{
	0% { width: 0; }
}
@keyframes progress-bar-stripes{
0% {
	background-position: 40px 0;
}

100% {
	background-position: 0 0;
}
}
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
