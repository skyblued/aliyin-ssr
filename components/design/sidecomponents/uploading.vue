<template>
	<div class="uploading" ref="boxUpload">
		<div class="uploading-btn">
			<el-upload 
				:action="'http://v1.yinbuting.cn/api' + uploadUrl"
				:headers="headers"
				multiple
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
			<div v-if="uploadType == 'pc'? true : false" class="area">
				<span class="area-icon" @click="handleActiveUpload" @dragenter.prevent @dragover.prevent @drop.prevent="handledragend($event)">选择文件或者将文件拖到上传框中</span>
			</div>
			<div v-if="uploadType == 'phone'? true : false" class="qr">
				<div class="qr-icon">
					<img :src="phoneQr" alt="">
				</div>
				<div class="title">
					<span>使用微信扫一扫上传手机图片</span>
				</div>
			</div>
		</template>
		<div class="content">
			<div class="uploading-icon">
				<span>已上传的素材</span>
				<div class="uploading-gif" v-show="uploadMssage.show">
					<img style="height:100%;vertical-align: middle;" :src="uploadMssage.src" alt="">
					<span>{{uploadMssage.msg}}</span>
				</div>
			</div>
			<!-- <div class="content-list" ref="list">
				<div class="list-item" @mousedown="setCopyBox($event, item)" v-for="(item,index) in list" :key="index">
					<img draggable="false" @click="handleCreateImage(item)" @load="setWaterfall"  class="img" :src="$store.state.port.imgBaseUrl + item.FilePath + (item.Svgtext == '' ? '!w300.src': '')" alt="">
					
					<span class="del-icon" @click="handleDelete(item, index)"></span>
					
				</div>
			</div> :row="true" :height="75"-->
            <div class="waterfall-wrap" ref="container">
                <div v-for="(item, index) of waterList"
                    :key="index"
                    @mousedown="setCopyBox($event, item)"
                    class="column-item">
                    <img draggable="false" @click="handleCreateImage(item)" :src="item.url" alt="">
                    <span class="del-icon" @click="handleDelete(item, index)"></span>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
import Waterfall from '@/components/design/Waterfall.vue'
import ImagesLayout from '@/assets/imagesLayout.js'
export default {
    components: {
        Waterfall,
    },
	props: ['copyBox', 'pageIndex'],
	data() {
		// 获取身份
		let identity = this.$route.params.t;
		
		identity = window.atob(identity).split('=')[0] == 'TemplateNumber' ? true : false
		let TeamNum = sessionStorage['teamNum'] || 0;
		let uploadUrl = null, getloadUrl = null, deleteUrl, param, page = 0;
		uploadUrl = identity ?  this.$store.state.port.DesignerMaterial
								: this.$store.state.port.TeamMaterial
		getloadUrl = identity ? this.$store.state.port.DesignerMaterials + `?pageIndex=${page}&SubStatus=0&AudStatus&StarTime&EndTime&TypeNum&TypeCateNum&Keywords`
								: this.$store.state.port.TeamMaterials + `?TeamNum=${TeamNum}&pageIndex=${page}&IsPublic=0&pageSize=20`
		// 删除素材接口
		deleteUrl = identity ? this.$store.state.port.DesignerMaterial
							: this.$store.state.port.TeamMaterial;
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
			// 身份
			identity,
			// 上传接口设置
			uploadUrl,
			// 获取数据接口设置
			getloadUrl,
			deleteUrl, // 删除素材接口
			// 上传类型
			uploadType: 'pc',
			// 手机上传二维码
			phoneQr: '',
			// 配置请求头
			headers: {
				'token': localStorage['token']
			},
			// 上传参数配置
			param,
			// 团队编号
			TeamNum, 
			// 用户自己上传的列表
			list: [],
			// 上传提示
			uploadMssage: {
				show: false,
				src: 'https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/img/loading.gif',
				msg: ''
			},
			// 选中元素
			ele: null,
			// 页码
			page,
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
            if (type == 'waterfall') {
				this.uploadMssage.src = 'https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/img/loading.gif'
				this.uploadMssage.show = true
                return
            }
			if (type) {
				this.uploadMssage.src = 'https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/img/loading.gif'
				this.uploadMssage.msg = '正在上传'
				this.uploadMssage.show = true
			} else {
				this.uploadMssage.src = 'https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/icon/success.png'
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
			let formdata = new FormData();
			let src = `http://192.168.3.100:8686/phoneupload/${sessionStorage['teamNum']}`
			formdata.append('teamnum', sessionStorage['teamNum'])
			formdata.append('content', src)
			formdata.append('action', 'createqr')
			formdata.append('precolor', '#000')
			formdata.append('bgcolor', '#fff')
			let config = {headers: {'Content-Type': 'multipart/form-data'}}
			this.$axios.post('/QrCode', formdata, config)
			.then((res) => {
				let data = JSON.parse(res.data)
				console.log(data)
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
				
				formdata.append('KeyWords', 'sdf')
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
		getImagesArr(arr) { // 获取图片宽高
            this.setUploading('waterfall')
			if (typeof arr != "object") return console.log('不是图片数组')
			return Promise.all(Array.from(arr).map((item,i) => {
                let reg = /(png|jpg|jpeg)/ig
                if (reg.test(item.FilePath)) {
                    return new Promise((resolve, reject)=> {
                            let img = new Image();
                            img.onload = (load) => {
                                let data = load.path[0]
                                item.url = data.src;
                                item.width = data.width;
                                item.height = data.height;
                                resolve(item)
                            }
                            img.src = this.$store.state.port.imgBaseUrl + item.FilePath + '!w300.src'
                    })
                }
			})).then(list => {
                this.setUploading(false)
                list.forEach((item, i) => {
                    if(!item) list.splice(i, 1)
                })
                this.waterList = list
                this.renderList()
            })
		},
        renderList() {
        // 纵向排列使用绝对定位排列
          // 存储每列已排列的高度
            this.columnData = []
            // 计算出每列应该占总宽度的百分比
            this.itemWidth = `${100 / 3}%`
            this.$nextTick(() => {
                // 对所有盒子进行计算绝对定位的位置
                const boxes = this.$refs.container.getElementsByClassName('column-item')
                for (let i = 0; i < boxes.length; i++) {
                this.setElementStyle(boxes[i], this.waterList[i], i)
                }
            })
        },
        setElementStyle (element, img, index) {
            // 计算出图片实际在项目中显示的高
            const w = this.$refs.container.offsetWidth / this.column
            const h = ((w - 6) / img.width) * img.height + 6
            if (index < this.column) {
                element.style.left = `${index * (100 / this.column)}%`
                this.columnData[index] = this.columnData[index] ? this.columnData[index] + h : h
                this.$refs.container['style']['height'] = this.columnData[index] + 'px'
            } else {
                // 找出最小高度的列
                let min = {}
                for (let i = 0; i < this.columnData.length; i++) {
                    if (!min.hasOwnProperty('index')) {
                    min = {index: i, value: this.columnData[i]}
                    } else {
                    if (this.columnData[i] < min.value) {
                        min = {index: i, value: this.columnData[i]}
                    }
                    }
                }
                element.style.left = `${min.index * (100 / this.column)}%`
                element.style.top = `${min.value}px`
                this.columnData[min.index] += h
                this.$refs.container['style']['height'] = this.columnData[min.index] + 'px'
            }
            element.style.width = this.itemWidth
        },
		// 获取用户的上传列表
		getData () {
			this.$axios.get(this.getloadUrl)
			.then( res =>{
				if (!res) return
				let data = JSON.parse(res.data)
				this.list = [].concat(this.list, data.Data)
				
				this.totalPage= data['X-Pagination'].TotalPages
			})
		},
        getMore(e) {
			let uploading = this.$refs.boxUpload;
			let total = uploading.scrollHeight; // 整个文档的高度
			let viewHeight = document.documentElement.clientHeight; // 可视区域的高度
			let scrollY = uploading.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
			this.mouseTop = scrollY
            console.log(viewHeight + scrollY , total)
			if (viewHeight + scrollY >= total - 60) {
				this.pageIndex += 1;
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
			
		},
		// 上传成功
		handleSuccess (response, file, fileList) {
			this.setUploading(false)
			let data = JSON.parse(response), key = '', Svgtext = '',TypeNum = null;
			console.log(data)
			if (data.status == 'ok') {
				key = data.key
				TypeNum = 7
			} else {
				key = data.svgpath;
				Svgtext = data.svgcontent;
				TypeNum = 1
			}
			this.list.unshift({FilePath: key, Svgtext, TypeNum})
			

		},
		// 上传时的钩子
		handleProgress (e, file, fileList) {
			this.setUploading(true)
		},
		// 上传失败
		handleError () {
			this.setUploading(false)
		},
		/**
		 * 将图片路径上行给父组件
		 */
		handleCreateImage (obj) {
			let result = this.checkedType(obj);
      		this.$emit("handleAdd", result);
		},
		// 检测当前元素类型
		checkedType(obj) {
			let src, type, native;
			// console.log(obj)
			if (obj.Svgtext != "") {
				src = obj.Svgtext;
				type = "svg";
			} else {
				src = this.$store.state.port.imgBaseUrl + obj.FilePath + "!w300.src";
				type = "image";
				native = this.identity ? true : false;
                let image = document.createElement('img')
                image.onload = () => {
                    image = null
                }
                image.setAttribute('src', this.$store.state.port.imgBaseUrl + obj.FilePath + "!w800.src");
			}
			return { src, type ,native};
		},
		// 获取当前元素的位置和大小
		setCopyBox (e, item) {
			// console.log(item)
			let ele = e.target,
				x = e.clientX - e.offsetX,
				y = e.clientY - e.offsetY, 
				w = ele.offsetWidth, 
				h = ele.offsetHeight;
			let cx = e.clientX, cy = e.clientY;
			let result = this.checkedType(item);
			let src = this.$store.state.port.imgBaseUrl + item.FilePath + (item.Svgtext == '' ? "!w300.src" : '')
			this.$emit("setCopyBox", {result, x, y, w, h, src, cx, cy});
			// this.ele = ele;
		},
		// 分类详细内容列表瀑布流
		setWaterfall() {
			let list = this.$refs.list
            var li = list.children;
            var Height = { f: [], w: [], three: []}
            for (var i = 0;i < li.length;i++){
                var inow = i%3;
				   li[i].style.transition = '1s'
				let w = li[i].offsetWidth;
				let h = li[i].offsetHeight;
                switch(inow) {
                    case 0:
                        li[i].style.left = 15 + 'px';
                        Height.f.push(h)
                        var step = Math.floor(i/3);
                        if(!step) {
                            li[i].style.top = 0;
                        } else {
                            var sum = 0;
                            for(var j = 0; j < step;j++){
                                sum += Height.f[j] + 5;
                            }
                            li[i].style.top = sum + 'px';
						}
						list['style']['height'] = sum + h + 'px'
                        break;
                    case 1:
                        li[i].style.left = w + 30 + 'px';
                        Height.w.push(h);
                        var step = Math.floor(i/3);
                        if(!step) {
                            li[i].style.top = 0;
                        } else {
                            var sum = 0;
                            for(var j = 0; j < step;j++){
                                sum += Height.w[j] + 5;
                            }
                            li[i].style.top = sum + 'px';
						}
						list['style']['height'] = sum + h + 'px'
                        break;
                    case 2:
                    li[i].style.left = w * 2 + 45 + 'px';
                    Height.three.push(h);
                    var step = Math.floor(i/3);
                    if(!step) {
                        li[i].style.top = 0;
                    } else {
                        var sum = 0;
                        for(var j = 0; j < step;j++){
                            sum += Height.three[j] + 5;
                        }
                        li[i].style.top = sum + 'px';
                    }
                    list['style']['height'] = sum + h + 'px'
                    break;
				}
				
            }
            // console.log('完毕')
		},
		// 删除素材
		handleDelete (item) {
			console.log(item, 'sfdsf')
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
				console.log(res)
				if (res.data == 'Success') {
					this.list = []
					this.getData()
				}
			})

		},
	},
	mounted () {
		// 获取用户上传素材列表
		this.getData() 
	},
	computed: {
        
	},
	watch: {
		// 监控当前元素的值
		copyBox () {
			// console.log(this.copyBox)
			// if(this.copyBox) {
			// 	this.ele.style.display = 'none'
			// } else {
			// 	this.ele.style.display = 'block'
			// }
		},
		// 监视页码
		pageIndex () {
			this.page++
			if(this.page <= this.totalPage) this.getData()
		},
        list () { // 监视图片列表
            this.getImagesArr(this.list)
            // console.log(this.list)
            // this.newList = this.list
        },
	}

}
</script>

<style lang="scss" scoped>
@import "@/assets/init.scss";
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
.qr {
	.qr-icon {
		width: 150px;
		height: 150px;
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
			background: url(/img/desicon/plugin/wechat_icon.png) no-repeat 15% 50%;
			// background-size: 27px 100%;
		}
	}
}
.content{
	position: relative;
	width: 100%;
	height: 100%;
	.uploading-icon {
		font-size: 14px;
		padding: 10px;
		.uploading-gif {
			height: 30px;
			text-align: center;
		}
	}
}
.content-list{
	position: relative;
	width: 100%;
	img{
		display: block;
		width: 100%;
		transition: .3s;
		cursor: pointer;
		
	}
}
.list-item{
	width: 88px;
	height: auto;
	position: absolute;
	overflow: hidden;
	background: rgba(0,0,0,.3);
	&:hover::after{
		content: '';
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.3);
		outline: #FFFFFF 2px solid;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		pointer-events: none;
	}
	&:hover .del-icon {
		display: block;
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
}

.waterfall-wrap {
    position: relative;
    // overflow-y: scroll;
    .column-item {
      position: absolute;
      padding: 3px;
      font-size: 0;
      box-sizing: border-box;
      transition: all .3s ease;
      img {
        max-width: 100%;
      }
      &:hover .del-icon {
		display: block;
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
    &.row {
      display: flex;
      flex-wrap: wrap;
      .row-item {
        margin: 5px;
        flex-grow: 1;
        font-size: 0;
        box-sizing: border-box;
        transition: all .3s ease;
        img {
          min-height: 100%;
          min-width: 100%;
          object-fit: cover;
        }
      }
      .last-box {
        margin: 5px;
        flex-grow: 999;
      }
    }
  }


</style>
