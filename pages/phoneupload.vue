<template>
	<div id="phone-upload">
		<div style="margin:auto;width: 50%;" v-if="progress">
			<div class="upload-progress" style="display: inline-block;">
				<div class="progress-w" :style="`width:${progress}px`"></div>
			</div>
			<div style="display: inline-block;margin-left: 10px">{{progress|init}}%</div>
		</div>
		<div v-show="imageList" class="select">
			<div class="select-icon" @click="handleclick">
				<p class="select-icon-item"></p>
				<p>从相册中选择图片</p>
			</div>
			<div class="select-image">
				<span @click="handleclick">选择图片</span>
			</div>
			<input ref="phoneUpload" multiple accept="image/*" style="display: none" type="file" @change="phoneUpload">
		</div>
		
		<div class="upload-list" v-show="!imageList">
			<div class="upload-list-item" v-for="(item, i) in list" :key="i">
				<img :src="item" alt="">
			</div>
			<div class="upload-btn" @click="handleclick">
				<span>继续上传</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		
		return {
			TeamNum: null,
			type: null,
			param: null,
			imageList: true,
			list: [],
			progress: 0, // 上传进度
			timer: null
		}
	},
	filters: {
		init(val) {
			return val.toFixed(2);
		}
	},
	mounted() {
		this.createInfo()
	},
	methods: {
		createInfo () {
			let query = this.$route.query;
			console.log(query)
			let type = query.type;
			this.TeamNum = query.teamNum;
			this.param = type == 'true' ? {
							uuid: query.uuid,
							TypeNum: 0,
							TypeCategoryNum: 0,
							KeyWords: ''		
						} 
						: {
							uuid: query.uuid,
							TeamNum: this.TeamNum,
							TypeNum: 0,
							TypeCategoryNum: 0,
							IsPublic: 0
						};
		},
		// 点击激活上传
		handleclick () {
			this.$refs.phoneUpload.click()
		},
		//上传事件被激活
		phoneUpload () {
			this.imageList = false;
			let phoneUpload = this.$refs.phoneUpload
			let file = phoneUpload.files[0];
			const size = file.size / 1024 / 1024 < 20
			if (!size) {
				this.$message.closeAll();
				this.$message({
					message: '上传图片大小不能超过 20MB!',
					type: 'error',
					customClass: 'info',
					showClose: true
				})
				return
			}
			let reader = new FileReader();  
			//将文件以Data URL形式读入页面  
			reader.onload = () =>{
				this.list.push(reader.result)
			}
			reader.readAsDataURL(file);
			let formdata = new FormData()
			for(let key in this.param) {
				formdata.append(key, this.param[key])
			}
			formdata.append('file',file)
			this.handleUploadBtn (formdata)
		},
		// 上传图片到服务器
		handleUploadBtn (formdata) {
			let url = this.type == 'true' ? this.$store.state.port.DesignerMaterial : this.$store.state.port.TeamMaterial;
			this.timer = setInterval(()=> {
				if (this.progress > 95) clearInterval(this.timer)
				this.progress += 0.7;
			}, 300)
			this.$http.post(url, formdata)
			.then(res => {
				clearInterval(this.timer)
				this.progress = 0;
				let data = res.data;
					data = typeof data == 'object' ? data : JSON.parse(data)
				if (data.status == 'ok' || data.status == 'success') {
					this.$message.closeAll();
					this.$message({
						message: '上传成功! ',
						duration: 0,
						type: 'success',
						customClass: 'info',
						showClose: true
					});
				} else {
						// alert(data.status)
					this.$message('上传失败')
				}
			})
			.catch(err => {
				this.progress = 0;
                this.$message('上传失败')
				// if (err) alert(err);
			})

		}
	}
}
</script>

<style scoped lang="scss">
#phone-upload{
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	z-index: 99;
	overflow-y: scroll;
	.select {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 100%;
		text-align: center;
		.select-icon {
			font-size: 14px;
			text-align: center;
			.select-icon-item {
				width: 50px;
				height: 50px;
				margin: 0 auto;
				border-radius: 50%;
				background: linear-gradient(to right, #4facfe , #00f2f1);
			}
		}
		.select-image {
			margin-top: 30px;
			span {
				display: inline-block;
				padding: 5px 20px;
				background: linear-gradient(to right, #4facfe , #00f2f1);
				border-radius: 20px;
				color: #fff;
				font-size: 14px;
			}
		}
	}
	.upload-list {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		.upload-list-item {
			width: 26%;
			height: 100px;
			overflow: hidden;
			margin: 10px;
			img {
				display: block;
				height: 100%;
			}
		}
		.upload-btn {
			position: absolute;
			left: 40%;
			bottom: -60px;
			span {
				display: inline-block;
				padding: 5px 20px;
				background: linear-gradient(to right, #4facfe , #00f2f1);
				border-radius: 20px;
				color: #fff;
				font-size: 14px;
			}
		}
	}
	.upload-progress {
		margin: auto;
		width: 60%;
		height: 10px;
		background-color: #c5eafe;
		overflow: hidden;
		border-radius: 5px;
		.progress-w {
			height: 100%;
			border-radius: 5px;
			background-color: #745bff;
			transition: width ease .4s;
		}
	}
}
</style>
