<template>
	<div class="plugin">
		<div class="plugin-active">
					
					<div class="plugin-item">
						<div style="font-size: 14px; padding: 10px 0;">请输入网址生成二维码</div>
						<div>
							<div>
								
								<el-input v-model="www" class="input-with-select" autofocus>
										
									<el-select class="select" v-model="select" slot="prepend">
										<el-option label="http://" value="http://"></el-option>
										<el-option label="https://" value="https://"></el-option>
									</el-select>
								</el-input>

							</div>
						</div>
					</div>
					<div class="qr-type">
						<div class="qr-icon" @click="handleIcon">
							<div class="qr-default"></div>
							<img :src="iconSrc" alt="">
							<input type="file" ref="iconUpload" @change="handleUpload">
						</div>
						<div class="qr-color" v-if="false">
							<div class="qr-color-item">
								<span>前景色</span>
								<el-color-picker v-model="pre_color" @active-change="setPreColor"></el-color-picker>
							</div>
							<div class="qr-color-item">
								<span>背景色</span>
								<el-color-picker v-model="bg_color" @active-change="setBgColor"></el-color-picker>
							</div>
						</div>
					</div>
					<div class="production">
						<el-button class="prodution-btn" @click="handleSelect">{{msg}}</el-button>
					</div>
					<div class="img">
						<img draggable="false" :src="src" alt="">
					</div>
				</div>
		<div class="plugin-type" v-if="false">
			<div v-for="(item, i) in icon" :key="i" class="plugin-item">
				<div class="plugin-icon" @click="handleShow">
					<img class="" :src="item.src">
					<img class="" :src="item.src">
				</div>
				<div class="title"><span>{{item.title}}</span></div>
			</div>
			
		</div>
		<transition name="fade" mode="out-in">
			<template>
				
			</template>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'plugin',
	data () {
		return {
			pre_color: '#000',
			bg_color: '#fff',
			icon: [
				{src: '/img/desicon/plugin/Qrcode_icon.png', title: '二维码'},
				{src: '/img/desicon/plugin/form_icon.png', title: '表格'},
				{src: '/img/desicon/plugin/line_chart_icon.png', title: '折线图'},
				{src: '/img/desicon/plugin/pie_icon.png', title: '饼状图'},
				{src: '/img/desicon/plugin/map_icon.png', title: '地图'},
			],
			pluginshow: '',
			www: 'www.aliyin.com',
			select: 'http://',
			src: '',
			msg: '生成二维码',
			// 图片
			iconSrc: '',
			// 图片文件
			iconFile : '',
		}
	},
	methods: {
		// 切换插件内容
		handleShow () {
			this.pluginshow = this.pluginshow ? '' : 'qr'
		},
		//点击生成二维码
		handleSelect () {
			this.msg = '正在生成 50%'
			let content = this.select + this.www
			this.handleGet (content)
			.then(url => {
				// 二维码加载出来生成图片
				this.$emit('handleAddQrCode', {type: 'image', src: this.src})
			})
		},
		// 请求二维码的handle
		handleGet (content = 'http://www.aliyin.com') {
			
			let formdata = new FormData();
			formdata.append('teamnum', localStorage['teamNum'])
			formdata.append('content', content)
			formdata.append('action', 'createqr')
			// console.log(this.pre_color, this.bg_color)
			formdata.append('precolor', this.pre_color)
			formdata.append('bgcolor', this.bg_color)
			formdata.append('', this.iconFile)
			let config = {headers: {'Content-Type': 'multipart/form-data'}}
			return new Promise((resolve, reject) => {
				this.$axios.post('/QrCode', formdata, config)
				.then((res) => {
					this.msg = '正在生成 100%'
					let data = JSON.parse(res.data)
					this.src = data.url
					resolve(data.url)
				}).catch((err) => {
					this.msg = '生成失败,检查是否合理域名'
					alert(err)
				});
			})
		},
		// 添加图片
		handleIcon () {
			this.$refs.iconUpload.click()
		},
		// 设置颜色
		setPreColor (value) {
			this.pre_color = value;
		},
		setBgColor (value) {
			this.bg_color = value
		},
		// 有文件时
		handleUpload (e) {
			let file = e.target.files[0];
			if(!/image\/\w+/.test(file.type)){ 
				this.$message({
					message: '抱歉，只支持图片类型哦！',
					type: 'warning'
				});   
				return false;  
			} 
			this.iconFile = file;
			var reader = new FileReader();  
			//将文件以Data URL形式读入页面  
			reader.onload = () =>{
				this.iconSrc = reader.result
				// console.log(this.iconSrc)
			}
			reader.readAsDataURL(file);
		},
		
	},
	mounted () {
	},
	watch: {
		src () {
			this.msg = '生成二维码'
		},
	}
}
</script>

<style lang="scss" scoped>
.plugin{
	padding: 0 15px;
	min-height: 100%;
	background: #fff;
	.plugin-type {
		width: 100%;
		height: 264px;
		padding: 20px 0;
		display: flex;
		flex-wrap: wrap;
		border-bottom: 1px solid #ccc;
		.plugin-item {
			width: 75px;
			height: 75px;
			margin: 10px;
			.plugin-icon {
				width: 100%;
				height: 100%;
				position: relative;
				cursor: pointer;
				&:hover img:last-child {
					transform: translateY(-5px);
				}
				& img:first-child {
					filter: blur(3px);
					width: 90%;
					bottom: 0;
					left: 4px;
					opacity: .7	;
				}
			}
			img {
				position: absolute;
				display: block;
				width: 100%;
				height: 100%;
				border-radius:5px;
				transition: all .3s;
			}
			.title {
				padding: 10px 0;
				text-align: center;
				font-size: 12px;
			}
		}
	}
}

.plugin-active {
	transition: 1s;
	.plugin-item {
		padding: 10px 10px;
	}
	.qr-type {
		display: flex;
		.qr-icon {
			flex: 1;
			width: 100px;
			height: 100px;
			padding: 10px;
			position: relative;
			.qr-default {
				position: absolute;
				width: 80px;
				height: 80px;
				background: #EAEAEA;
				cursor: pointer;
				border-radius: 3px;
				&::before {
					content: '+';
					position: absolute;
					left: 27px;
					top: 0px;
					width: 20px;
					height: 20px;
					font-size: 50px;
					color: rgb(183,183,183);
				}
				&::after {
					content: 'LOGO';
					position: absolute;
					left: 23px;
					top: 50px;
					width: 20px;
					height: 20px;
					font-size: 14px;
					color: rgb(183,183,183);
				}
			}
			img {
				position: relative;
				display: block;
				width: 80px;
				height: 80px;
				border-radius: 3px;
				cursor: pointer;
			}
			input {
				display: none;
			}
		}
		.qr-color {
			flex: 2;
			padding: 10px;
			.qr-color-item {
				padding-left: 65px;
				position: relative;
				span {
					position: absolute;
					top: 9px;
					left:0;
					display: inline-block;
					padding-top: -10px;
				}
			}
		}
	}
	.img{
		width: 100%;
		box-shadow: 0px 0px 1px rgba(0,0,0,.3);
		margin: 10px 0;
		img{
			display: block;
			width: 100%;
		}
	}
	.el-select .el-input {
		width: 130px;
	}
	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}
	.select{
		width: 90px;
	}
	.production{
		text-align: center;
		.prodution-btn{
			width: 90%;
		}
	}
}

</style>
