<template>
    <div class="table-page" ref="tablePage">
		<!-- @mouseenter="setPagePos(index)"  :style="{'height': 200 * list.ratio + 'px', top: index * 200 * list.ratio + 'px'}" -->
		<div draggable=true  @dragstart="handledragStart($event,i)" @dragover="handledragOver" @dragenter="handledragEnter($event, i)" @dragleave="handledragLeave($event,i)" @dragend="handledragEnd($event, i)" @mousedown="toggleTemplatePage(i)" class="page-index" :style="{height: height}" :ref="i" v-for="(item,i) in dataList" :key="i" >
			<div class="page-content">
				<img :src="$store.state.port.imgBaseUrl + item.Thumb" alt="">
			</div>
			<div class="mask" v-if="index == i"></div>
			<div class="copy" @click="copy(i)" data-tip="复制"></div>
			<div class="del" @click="del(i)" data-tip="删除"></div>
		</div>
    </div>
</template>

<script>
export default {
	data () {
		let message = this.$message
		return {
			dataList: null,
			height: null,
			page: [],
			// 选中下标
			// 选中的元素的下标
			index: 0,
			//移动的clientY值
			pageClientY: null,
			// 移动时进入的page
			enterPage: null,
			// 选中元素
			ele: [],
			// 提示消息
			message: message,
			/* 移动页面 ↓*/
			// 可以移动的开关
			dragMoveOff: false,
			pagePos: {
				h: 0
			}
			/* 移动页面 ↑ */
		}
	},
	props: ['data','TemplateNumber'],
	methods: {
		// 获取页面数据
		getData () {
			
		},
		// 复制一页
		copy (index) {
			this.$emit('copyPage', index)
		},
		// 删除页面
		del (i) {
			console.log(i)
			if(this.dataList.length == 1) {
				this.message({
					type: 'warning',
					message: '最后一页不能删除'
				})
				return
			}
			this.$emit('delTemplatePage', i)
			
		},
		/**
		 * 切换页面内容
		 */
		toggleTemplatePage (i) {
			this.index = i
			this.$emit('toggleTemplatePage', i)
		},
		// 鼠标按下记录坐标
		setdragStart (e, id) {
			this.dragMoveOff = true
			this.pagePos.cy = e.clientY;
			this.pagePos.id = id
			document.addEventListener('mousemove', this.setdragMove)
			document.addEventListener('mouseup', this.setdragClose)
		},
		setdragMove (e) {
			let y = e.clientY - this.pagePos.cy;
			this.pagePos.cy = e.clientY;
			let ele = this.$refs[this.pagePos.id][0]
			let tablePage = this.$refs.tablePage
			let childs = tablePage.children
			let top = ele.offsetTop;
			let h = ele.offsetHeight
			ele['style']['top'] = top + y + 'px'
			let pre = tablePage.children[this.pagePos.id - 1]
			let next = tablePage.children[this.pagePos.id + 1]
				// console.log(this.pagePos.id)
			// if (top + y < this.pagePos.id * 200 * this.list.ratio - h / 2) {
			// 	// ele = tablePage.removeChild(ele)
			// 	tablePage.insertBefore(ele, pre)
			// 	this.pagePos.id -= 1
			// 	pre['style']['top'] = this.pagePos.id * 200 * this.list.ratio + 'px'
			// } 
			// if (top + y > this.pagePos.id * 200 * this.list.ratio + h / 2) {
			// 	this.$refs[this.pagePos.id + 1][0]['style']['top'] = (this.pagePos.id - 1) * 200 * this.list.ratio + 'px'
			// }
		},
		setdragClose () {
			document.removeEventListener('mousemove', this.setdragMove)
			document.removeEventListener('mouseup', this.setdragClose)
		},
		setPagePos (id) {
			if (id == this.pagePos.id) return
			console.log(1231231)
		},
		// 拖拽开始
		handledragStart (e, i) {
			this.index = i
			e.target.parentNode.style.opacity = 0
		},
		// 拖拽中
		handledragOver (e) {
			e.preventDefault()
			
			let ele = e.target
			this.pageClientY = e.clientY
		},
		// 拖拽进入时
		handledragEnter (e, i) {
			if(this.index === i) return
			this.enterPage = i
			console.log(i, '拖拽方法')
			let parent = e.target
			this.ele.push(parent)
			let height = parent.offsetHeight
			parent.style.marginTop = height/2 + 'px'
		},
		// 拖拽移除时
		handledragLeave (e, i) {
			// if(e.clientY > this.pageClientY) {
			// 	let ele = e.target
			// 	let height = ele.offsetHeight
			// 	e.target.style.marginTop = 0

			// }
		},
		// 拖拽完成后,作用(被拖拽元素)
		handledragEnd (e, i) {
			this.ele.forEach( child =>{
				child.style.marginTop = 0
			})
			e.target.parentNode.style.opacity = 1
			this.$emit('handleReversing', {need: this.index, reverse: this.enterPage})
			
		},
		// 图片禁止
		imgdisable (e) {
			e.preventDefault()
		}
	},
	watch: {
		data () {
			this.dataList = this.data.list;
			this.height = this.data.ratio.Height / this.data.ratio.Width * 180 + 'px';
		}
	}
}
</script>

<style lang="scss" scoped>
.table-page{
	position: relative;
    width: 200px;
	height: 100%;
	padding-top: 10px;
	overflow-y: auto;
    .page-index {
		position: relative;
		width: 180px;
		padding: 6px 10px;
		// overflow: hidden;
		.page-content{
			width: 100%;
			height: 100%;
			
			position: relative;
			border: 1px solid #ccc;
			border-radius: 3px;
			img{
				width: 100%;
				height: 100%;
				display: block;
				transition: 1s;
			}
		}
		.mask {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, .3);
			cursor: pointer;
		}
		&:hover .del, &:hover .copy{
			display: block;
		}
	}
}
// 复制
.copy {
	position: absolute;
	left: 10px;
	bottom: 10px;
	width: 21px;
	height: 21px;
	display: none;
	background-color: #fff;
	background-repeat: no-repeat;
	background-position: 50%;
	background-image: url(/img/desicon/copy_small_icon.png);
	border-radius: 3px;
	&:hover {
		background-image: url(/img/desicon/copy_small_bule_icon.png);
	}
	&:hover::before {
		content: attr(data-tip);
		font-size: 12px;
		line-height: 12px;
		background-color: #fff;
		color: #626262;
		padding: 4px 8px;
		position: absolute;
		top: 20px;
		left: -10px;
		white-space: pre;
		border-radius: 2px;
		box-shadow: 0 2px 8px 0 rgba(0,0,0,.24);
		z-index: 2;
	}
}

.del{
	position: absolute;
	right: 10px;
	bottom: 10px;
	width: 21px;
	height: 21px;
	display: none;
	background-color: #fff;
	background-repeat: no-repeat;
	background-position: 50%;
	background-image: url(/img/desicon/delete_small_icon.png);
	border-radius: 3px;
	&:hover {
		background-image: url(/img/desicon/delete_small_blue_icon.png);
	}
	&:hover::before {
		content: attr(data-tip);
		font-size: 12px;
		line-height: 12px;
		background-color: #fff;
		color: #626262;
		padding: 4px 8px;
		position: absolute;
		top: 20px;
		left: -10px;
		white-space: pre;
		border-radius: 2px;
		box-shadow: 0 2px 8px 0 rgba(0,0,0,.24);
		z-index: 2;
	}
}
</style>
