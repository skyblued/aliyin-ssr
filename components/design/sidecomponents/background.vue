<template>
	<div class="background">
        <div class="background-type">
            <span :class="backgroundType == 'pure'? 'type-active': ''" @click="handleToggleType('pure')">纯色背景</span>
            <span :class="backgroundType == ''? 'type-active': ''" @click="handleToggleType('')">图片背景</span>
            <!-- 本地背景图片上传 -->
            <div class="background-upload-file">
                <div class="local">
                    <div class="upload-btn upload-text" @click="uploadFile()" v-if="progress.show">本地上传</div>
                    <div class="upload-btn upload-progress" v-else>
                        <div class="upload-animate">
                            <div class="progress-bar progress-bar-striped active" :style="{width: progress.w || 0}">
                                {{progress.w}}
                            </div>
                        </div>
                    </div> 
                    <input ref="uploadBackground" type="file" @change="handleUpload($event)" multiple>
                </div>
            </div>
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
						</div>
					</div>
					<!-- 最近使用颜色 -->
					<div class="current-tempcolor">
						<div>预设颜色 : </div>
						<div class="color-area">
							<div class="color-block" v-for="(item, index) in colorBackground" :key="index">
								<div class="color-item" :style="{'background': item.bg}" @click="selectBg(item.bg)"></div>
							</div>
						</div>
					</div>
					
				</div>
			</template>
			<!-- 图片背景 -->
			<template v-else>
				<Share @getMore="getMore" key="1" :selectContentList="backgroundList" @handleChangeBackground="handleChangeBackground"></Share>
			</template>
		</transition>
			
		
	</div>
</template>

<script>

import Share from '@/components/design/share.vue'
export default {
	props: ["pageIndex"],
	components: {
		Share,
	},
	name: 'background',
	data () {
		return {
			page: 0,
            backgroundType: 'pure',
			color5: 'rgba(255, 69, 0, 0.68)',
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
			backgroundList: [],
			fileImage: '',
			// 上传进度条
			progress: {
				show: true, w: 0
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
		},
		/**
		 * 纯色背景
		 */
		// 1. 获取团队专属颜色
		getTeamColors () {
			let TeamNum = sessionStorage['teamNum']
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
			let teamNum = sessionStorage['teamNum']
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
			this.progress.show = false
			this.$axios.post(this.$store.state.port.TeamMaterial, formdata, config)
					.then(res =>{
						this.$set(this.progress, 'w', '100%')
						this.progress.show = true
						let data = JSON.parse(res.data);
						this.$message({ message: '上传成功', type: 'success'});
						this.progress.w = 0
						if(data.status == 'ok') {
							let obj = {FilePath: data.key, type: 'image'}
							this.handleChangeBackground(obj)
						}
					}).catch(err => {
						this.progress.show = true
						this.progress.w = 0
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
		getData (Num = 0 ) {
			this.getTeamColors()
			this.$axios.get(this.$store.state.port.MaterialInfos + `?TypeNum=11&TypeCategoryNum=${Num}&pageIndex=${this.page}`).then(res => {
				let data = JSON.parse(res.data).Data
				this.backgroundList = this.backgroundList.concat(data);
                if (this.page > 1) return
                this.getMore()
			})
		},
		/**
		 * 传给父组件图片src
		 */
		handleChangeBackground (obj) {
			let src = {};
			src.msg = obj.Svgtext || obj.FilePath
			if(src.msg !== obj.Svgtext) {
				src.msg = '//img.aliyin.com/' + src.msg + '!w800.src';
				src.type = 'image'
			} else {
				src.type = 'svg'
			}
			
			this.$emit('handleChangeBackground', src)
		},
		// 加载更多背景图片数据
		getMore (e) {
			console.log('sdf')
			this.page++
			this.getData()
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
	},
	mounted () {

		this.getData();
		this.getMaterialCategories ()
	},
}
</script>

<style lang='scss' scoped>
@import "@/assets/init.scss";
.background {
	width: 100%;
	height: 100%;

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
			.color-list-item {
				width: 26px;
				height: 26px;
				margin-right: 10px;
    			margin-bottom: 10px;
				border-radius:3px;
				transition: all .3s;
				cursor: pointer;
				&:hover{
					transform: scale(1.1);
					box-shadow: 0 1px 8px 2px rgba(0, 0, 0, 0.3);
				}
			}
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
			background: rgb(29,133,204);
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
</style>
