<template>
	<div class="uploading" >
		<div class="uploading-btn">
			<el-upload 
				:action=" $store.state.netServer + uploadUrl"
				:headers="headers"
				multiple
				accept="image/*"
				:show-file-list="false"
				:data="param"
				:on-preview="handleUploadFill"
				:on-success="handleSuccess"
				:on-error="handleError"
				:on-progress="handleProgress"
				:before-upload="handleBeforUpload"
				>
				<span ref="uploading" :class="{'pc-icon': true, 'icon-active': uploadType == 'pc'? true : false}" @click="handleActive('pc')">电脑上传</span>
			</el-upload>
			<span :class="{'phone-icon': true, 'icon-active': uploadType == 'phone'? true : false}" @click="handleActive('phone')">手机上传</span>
		</div>
		<!-- 上传方式切换 -->
		<template>
			<div class="area"
			    @drop="handledragend($event)">
				<span class="area-icon" @click="handleActiveUpload">选择文件或者将文件拖到上传框中</span>
			</div>
			<transition name="el-zoom-in-center">
				<div class="img-preivew" v-if="phoneQr" @click="handleUpdate">
					<div class="lt-modal-content">
                        <img style="width: 166px;height: 166px;margin-top: 30px;" :src="phoneQr" alt="">
                        <p style="margin-top: 20px">用手机"扫一扫"上传手机相册图片</p>
                        <p style="margin-top: 20px">（*上传成功后，关闭页面即可使用）</p>
                        <div class="close-btn"></div>
                    </div>
				</div>
			</transition>
		</template>
		<div class="content" ref="boxUpload" @scroll="getMore">
			<div class="uploading-icon">
				<span>已上传的素材</span>
				<div class="uploading-gif" v-show="uploadMssage.show">
					<img style="height:100%;vertical-align: middle;" :src="uploadMssage.src" alt="">
					<span>{{uploadMssage.msg}}</span>
				</div>
			</div>
			<div class="items"  ref="itemsList">
				<div class="items-item" v-for="(item, index) of list" :key="index"
					@mousedown="setCopyBox($event, item)"
				>
					<img 
						@load="getSvgContent"
						draggable="false" 
						:style="`${item.Svgtext == '' ? '':'object-fit: fill'}`"
						@click.stop="handleCreateImage(item)" 
						@error="imgError"
						:src="$store.state.port.imgBaseUrl + item.FilePath + (item.FilePath.lastIndexOf('.svg') == -1 ? '!w300.src' : '')" alt="">
					<div>
						<span class="del-icon" @click="handleDelete(item, index)"></span>
					</div>
				</div>
			</div>
			<div v-if="loadingIcon || baseLine" style="width: 100%;text-align:center;padding: 50px 0;">
				<img v-if="loadingIcon" style="height: 40px;" src="https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/img/loading.gif" title="加载中..." alt="加载中...">
				<span style="font-size: 14px;">{{baseLine}}</span>
			</div>
		</div>
	</div>
</template>

<script>
import ImagesLayout from '@/assets/js/imagesLayout.js'
export default {
	name: 'uploading',
    
	props: ['copyBox', 'pageIndex'],
	data() {
		// 获取身份
		let identity = this.$route.params.t;
		identity = window.atob(identity).split('&')
		if (identity.length > 1) identity = true;
		else {
			identity = identity[0].split('=')[0] == 'TemplateNumber' ? true : false
		}
		let TeamNum = localStorage['teamNum'];
		let param;
		param = identity ? {
							TypeNum: 0,
							TypeCategoryNum: 0,
							KeyWords: ''		
						} 
						: {
							TeamNum,
							TypeNum: 0,
							TypeCategoryNum: 0,
							IsPublic: 0
						}
		return {
			loadingIcon: true, // 加载样式
			baseLine: '', // 没有更多
			// 身份
			identity,
			// 上传参数配置
			param,
			pageParams: { // 分页参数
				pageIndex: 0,
				pageSize: 30
			},
			
			uploadUrl: identity ? this.$store.state.port.DesignerMaterial
										: this.$store.state.port.TeamMaterial,// 上传接口设置
			getloadUrl: identity ? this.$store.state.port.DesignerMaterials + `?SubStatus=0&AudStatus&StarTime&EndTime&TypeNum&TypeCateNum&Keywords`
										: this.$store.state.port.TeamMaterials + `?TeamNum=${TeamNum}&IsPublic=0`,// 获取数据接口设置
			deleteUrl: identity ? this.$store.state.port.DesignerMaterial
										: this.$store.state.port.TeamMaterial, // 删除素材接口

			// 上传类型
			uploadType: 'pc',
			// 手机上传二维码
			phoneQr: '',
			// 配置请求头
			headers: {
				'token': localStorage['token']
			},
			
			// 团队编号
			TeamNum, 
			// 用户自己上传的列表
			list: [],
			waterfallList: [],
			// 上传提示
			uploadMssage: {
				show: false,
				src: 'https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/img/loading.gif',
				msg: ''
			},
			// 选中元素
			ele: null,
			// 总页数
			totalPage: 0,
			imageArr: [], //img标签
            waterList: [], // 
            column: 3,
            itemWidth: 0,
            columnData: [],
            layoutList: [], //
		};
	},
	methods: {
		/**上传动画 */
		setUploading (type) {
			if (type) {
				this.uploadMssage.src = 'https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/img/loading.gif'
				this.uploadMssage.msg = '正在上传'
				this.uploadMssage.show = true
			} else {
				// this.uploadMssage.src = 'https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/icon/success.png'
				this.uploadMssage.msg = '上传成功'
				this.uploadMssage.show = false
			}
		},
		
		// 选择上传方式
		handleActive (type) {
			this.uploadType = type
			if(type == 'phone') this.productionQr()
		},
		// 生成手机上传链接二维码
		productionQr () {
			let formdata = new FormData(),
				query = `teamNum=${localStorage['teamNum']}&type=${this.identity}&v=${new Date().getTime()}`;
			let src = `${window.location.origin}/phoneupload?${query}`;
			formdata.append('teamnum', localStorage['teamNum'])
			formdata.append('content', src)
			formdata.append('action', 'createqr')
			formdata.append('precolor', '#000')
			formdata.append('bgcolor', '#fff')
			let config = {headers: {'Content-Type': 'multipart/form-data'}}
			this.$axios.post('/QrCode', formdata, config)
			.then((res) => {
				let data = JSON.parse(res.data)
				// console.log(data)
				this.phoneQr = data.url
			}).catch((err) => {
				alert(err)
			});
		},
		// 点击拖入框触发上传
		handleActiveUpload () {
			this.$refs.uploading.click()
		},
		// 拖入文件触发
		handledragend (e) {
			e.preventDefault();
			let file = e.dataTransfer.files[0]
			const size = file.size / 1024 / 1024 < 20
			if (!size) {
				 this.$message.error('上传图片大小不能超过 20MB!')
				return size
			} 
			this.setUploading(true)
			let formdata = new FormData()
			if (this.identity) {
				formdata.append('TypeNum', 0)
				formdata.append('TypeCategoryNum', 0)
				formdata.append('KeyWords', 'sheji')
			} else {
				formdata.append('TeamNum', this.TeamNum)
				formdata.append('TypeNum', 0)
				formdata.append('TypeCategoryNum', 0)
				formdata.append('IsPublic', 0)
			}
			
			formdata.append('file',file)
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					'token': localStorage['token']
				},
			}
			this.$axios.post(this.uploadUrl, formdata, config)
					.then( res =>{
						this.setUploading(false)
						if(res.data === "") return
						let data = JSON.parse(res.data), key = '', Svgtext = '',TypeNum = null;
			
						if (data.status == 'ok') {
							key = data.key
							TypeNum = 7
						} else {
							key = data.svgpath;
							Svgtext = data.svgcontent;
							TypeNum = 1
						}
						this.list.unshift({FilePath: key, Svgtext, TypeNum})
                        
					})
					.catch(err => {
						this.setUploading(false)
						console.log(err)
					})
		},
        
		getUserUpload() {
			this.loadingIcon = true
			let url = this.getloadUrl + `&pageIndex=${this.pageParams.pageIndex}&pageSize=${this.pageParams.pageSize}`
			return new Promise((resolve, reject) => {
				// this._http.get(url).then(res => console.log(res))
				this.$axios.get(url)
				.then( res =>{
					this.loadingIcon = false;
					let data = res.data;
						data = typeof data == 'object' ? data : data != '暂无数据' ? JSON.parse(res.data) : {Data: []};
					resolve(data)
				})
			})
			
		},
		getData () {// 获取用户的上传列表
			this.getUserUpload().then(data => {
				// console.log(data)
				this.list = data.Data
			})
		},
        handleUpdate() { // 使用手机上传后更新
            this.pageParams.pageIndex = 1;
            this.getUserUpload().then(data => {
				// console.log(data)
				this.list = data.Data
                this.phoneQr = ''
			})
        },
        getMore(e) {
			let uploading = this.$refs.boxUpload;
			let total = uploading.scrollHeight; // 整个文档的高度
			let viewHeight = uploading.clientHeight; // 可视区域的高度
			let scrollY = uploading.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
			this.mouseTop = scrollY;
			if (viewHeight + scrollY >= total && !this.baseLine) {
				this.pageParams.pageIndex++;
				this.getUserUpload().then(data => {
					if (data.Data.length < 1) this.baseLine = '没有更多'
					this.list = this.list.concat(data.Data)
				})
			}
		},
		// 上传之前的钩子
		handleBeforUpload (file) {
			const size = file.size / 1024 / 1024 < 20
			if (!size) {
				 this.$message.error('上传图片大小不能超过 20MB!')
			} 
			return size
		},
		// 上传之后的文件
		handleUploadFill (file) {
			console.log(file)
		},
		// 上传成功
		handleSuccess (response, file, fileList) {
			this.setUploading(false)
			let data = JSON.parse(response), 
				key = '', 
				Svgtext = '',
				TypeNum = null,
				MaterialNum = data.materialnum,
				ID = data.materialid;
				// console.log(data)
			if (data.status == 'ok') {
				key = data.key
				TypeNum = 7
			} else {
				key = data.svgpath;
				Svgtext = data.svgcontent;
				TypeNum = 1
			}
			this.list.unshift({FilePath: key, Svgtext, TypeNum, MaterialNum,ID})
			

		},
		// 删除素材
		handleDelete (item, index) {
			// console.log(item,index)
			let formdata = new FormData();
			if (this.identity) {
				formdata.append('Id', item.ID)
				formdata.append('MaterialNum', item.Num)
			} else {
				formdata.append('TeamNum', this.TeamNum)
				formdata.append('Id', item.ID)
				formdata.append('MaterialNum', item.MaterialNum)
			}
			this.$axios.delete(this.deleteUrl,{data:formdata})
			.then(res => {
				// console.log(this.list)
				if (res.data == 'Success') {
					this.list.splice(index, 1)
					if (this.list.length < 1) {
						this.getData() 
					}
					// console.log(this.list)
				}
			})

		},
		// 上传时的钩子
		handleProgress (e, file, fileList) {
			this.setUploading(true)
		},
		// 上传失败
		handleError () {
			this.setUploading(false)
		},
		getSvgContent(e) {
			// 获取svg内容
			if (!this.$refs.itemsList) return
			let list = this.$refs.itemsList.childNodes,
					src = e.path[0].src;
				if (src.lastIndexOf('.svg') > -1) {
					fetch(src).then(response => response.text())
					.then(data => {
						list.forEach((div, index) => {
							if (div == e.path[0].parentNode) {
								this.selectContentList[index].Svgtext = data
							}
						})
					})
				}
		},
		/**
		 * 将图片路径上行给父组件
		 */
		handleCreateImage (obj) {
			this.checkedType(obj).then(result => {
				this.$emit("handleAdd", result);
			});
		},
		// 检测当前元素类型
		checkedType(obj) {
			let src, type, native = this.identity ? true : false;
			// console.log(obj)
			return new Promise((resolve, reject) => {
				if (obj.FilePath.lastIndexOf('.svg') != -1) {
					fetch(this.$store.state.port.imgBaseUrl + obj.FilePath)
					.then(response => response.text())
					.then(res => {
						src = res;
						type = "svg";
						resolve({ src, type ,native})
					})
				} else {
					src = this.$store.state.port.imgBaseUrl + obj.FilePath + "!w300.src";
					type = "image";
					let image = document.createElement('img')
					image.onload = () => {
						image = null
					}
					image.setAttribute('src', this.$store.state.port.imgBaseUrl + obj.FilePath + "!w800.src");
					resolve({ src, type ,native})
				}
				
			})
			
		},
		// 获取当前元素的位置和大小
		setCopyBox (e, item) {
			let ele = e.target,
				x = e.clientX - e.offsetX,
				y = e.clientY - e.offsetY, 
				w = ele.offsetWidth, 
				h = ele.offsetHeight;
			let cx = e.clientX, cy = e.clientY;
			this.checkedType(item).then(result => {
				let src = this.$store.state.port.imgBaseUrl + item.FilePath + (item.FilePath.lastIndexOf('.svg') == -1 ? '!w300.src' : '')
				this.$emit("setCopyBox", {result, x, y, w, h, src, cx, cy, ele});
			})
		},
		imgError(err) {
			err && err.target.parentNode.setAttribute('style', 'display: none')
		}
		
	},
	mounted () {
		// 获取用户上传素材列表
		this.getData() 
	},
	computed: {
	},

}
</script>

<style lang="scss" scoped>

.uploading {
	width: 100%;
	min-height: 100%;
	position: relative;
    overflow-y: scroll;
}
.uploading-btn {
	display: flex;
	justify-content: space-around;
	padding: 14px 10px;
	.pc-icon, .phone-icon {
		display: block;
		width: 120px;
		text-align: right;
		padding: 8px 10px;
		font-size: 14px;
		border-radius:5px;
		border:1px solid rgba(220,220,220,1);
		cursor: pointer;
		
		background-repeat: no-repeat;
		background-position: 20% 50%;
	}
	.pc-icon {
		background-image: url(/img/desicon/plugin/computer_icon.png);
	}
	.phone-icon {
		background-image: url(/img/desicon/plugin/phone_icon.png);
	}
	.icon-active {
		background-color: $color;
		color: #fff;
		&.pc-icon {
			background-image: url(/img/desicon/plugin/computer_white_icon.png);
		}
		&.phone-icon {
			background-image: url(/img/desicon/plugin/phone_white_icon.png);
		}
	}
}
.area {
	padding: 0px 20px 20px 20px;
	.area-icon {
		display: block;
		height: 100px;
		text-align: center;
		line-height: 140px;
		font-size: 14px;
		border: 1px dashed #B7B7B7;
		color: #B7B7B7;
		cursor: pointer;
		background-color:rgba(236,236,236,1);
		background-image: url(/img/desicon/plugin/add_small_icon.png);
		background-repeat: no-repeat;
		background-position: 50% 38%;
		&:hover {
			border: 1px dashed $color;
		}
	}
}
.img-preivew {
	position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
	z-index: 2019;
	padding: 20px;
	left: 60px;
	top: 50px;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, .3);
	overflow: auto;
	
}
.lt-modal-content {
    position: relative;
    margin: auto;
    width: 440px;
    text-align: center;
    background-color: #fff;
    padding: 20px 20px 30px;
    border: 0;
    border-radius: 6px;
    background-clip: padding-box;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
}
.close-btn {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
    cursor: pointer;
    &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 100%;
        height: 3px;
        border-radius: 3px;
        background: #745bff;
    }
    &::after {
        transform: rotate(90deg);
    }
}
.qr {
	.qr-icon {
		width: 100px;
		height: 100px;
		margin: 0 auto;
		border: 1px solid rgba(210,210,210,1);
		img {
			width: 100%;
			height: 100%;
		}
	}
	.title {
		text-align: center;
		font-size: 14px;
		span {
			display: block;
			padding: 8px 20px;
			// background: url(/img/desicon/plugin/wechat_icon.png) no-repeat 15% 50%;
			// background-size: 27px 100%;
		}
	}
}
.content{
	position: absolute;
	top: 182px;
	bottom: 0;
	width: 100%;
	overflow-y: auto;
	.uploading-icon {
		font-size: 14px;
		padding: 10px;
		.uploading-gif {
			height: 30px;
			text-align: center;
		}
	}
}
.items {
		padding-left: 	15px;
		width: 100%;
		.items-item {
			display: inline-block;
			width: 94px;
			height: 94px;
			margin-right: 7px;
			padding: 10px;
			margin-bottom: 10px;
			background: #F4F4F4;
    		cursor: pointer;
			position: relative;
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
			&:hover .del-icon {
				display: block;
			}
		}
	}



.del-icon {
	display: none;
	position: absolute;
	right: 5px;
	top: 5px;
	width: 20px;
	height: 20px;
	border-radius: 5px;
	background-repeat: no-repeat;
	background-color: rgba(255, 255, 255, 1);
	background-size: 100%;
	background-image: url(/img/desicon/delete_small_icon.png);
	z-index: 2;
	cursor: pointer;
	&:hover {
		background-image: url(/img/desicon/delete_small_blue_icon.png);
	}
}


</style>
