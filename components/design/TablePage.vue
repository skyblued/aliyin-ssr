<template>
    <div class="table-page" ref="tablePage">
		<!-- @mouseenter="setPagePos(index)"  :style="{'height': 200 * list.ratio + 'px', top: index * 200 * list.ratio + 'px'}" -->
        <!-- @dragstart="handledragStart($event,i)" 
			@dragover="handledragOver" 
			@dragenter="handledragEnter($event, i)" 
			@dragleave="handledragLeave($event,i)" 
			@dragend="handledragEnd($event, i)" 

			
			
			-->
		<div 
			@mouseenter="activeEnter($event, i)"	
			@mousedown="toggleTemplatePage($event, i)" 
			class="page-index" 
			:ref="i" v-for="(item,i) in dataList" :key="i" 
			:style="`top:${(height + 20) * i}px;`"
		>
		<!--   -->
			<div class="page-content" 
					:style="`height: ${height}px`" v-html="item._html">
				<!-- <img v-if="item.Thumb" :src="item.Thumb" alt=""> -->
			</div>
			<div class="mask" :style="`opacity: ${pagenum == i ? .3 : 0}`"></div>
			<!--  v-if="PageMode && PageMode.PageMode" -->
			<div v-if="PageMode && (dataList.length < PageMode.MaxPages)" class="copy" @mousedown.stop="copy(i)" data-tip="复制"></div>
			<div class="del" @mousedown.stop="del(i)" data-tip="删除"></div>
		</div>
    </div>
</template>

<script>
export default {
	name: 'tablePage',
	props: {
		pagenum: {
			type: Number,
			default: 0
		},
		info: {
			type: Object
		},
		PageMode: { // p数模式
		}
	},
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
			},
			moveElem: { // 移动的元素
				cx: 0,
				cy: 0,
				w: 0,
				h: 0,
				oldindex: 0,
				index: 0,
				div: null,
				move: false
			}
			/* 移动页面 ↑ */
		}
	},
	methods: {
		// 获取页面数据
		getData () {
			
		},
		// 复制一页
		copy (index) {
			this.index = index;
			this.$emit('copyPage', index)
		},
		// 删除页面
		del (i) { 
			if(this.dataList.length == 1) {
				this.$message.closeAll();
				this.message({
					type: 'warning',
					message: '最后一页不能删除'
				})
			} else {
                this.$confirm('删除该页面, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    })
                    .then(() => {
						this.$emit('delTemplatePage', i);
						this.$message.closeAll();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
            }
		},
		/**
		 * 切换页面内容
		 */
		toggleTemplatePage (e, i) {
			this.index = i
			this.$emit('toggleTemplatePage', i)
			this.setdragStart(e, i)
		},

		// 鼠标按下记录坐标
		setdragStart (e, i) {
			this.dragMoveOff = true;
			this.moveElem.cx = e.clientX;
			this.moveElem.cy = e.clientY;
			this.moveElem.div = this.$refs.tablePage.children[i];
			this.moveElem.oldy = this.moveElem.div.offsetTop;
			this.moveElem.div.classList.add('move-active')
			this.moveElem.oldindex = i;
			this.moveElem.index = i;
			// console.log(this.moveElem, i)
			document.addEventListener('mousemove', this.setdragMove)
			document.addEventListener('mouseup', this.setdragClose)
		},
		setdragMove (e) {
			if (!this.dragMoveOff) return;
			let y = e.clientY - this.moveElem.cy,
				_y = this.moveElem.oldy + y;
			if (Math.abs(y) > 20) {
				this.moveElem.div.style.top = _y + 'px'
				this.moveposition(_y, this.moveElem.div)
				this.moveElem.move = true;
			} else {
				this.moveElem.move = false;
			}
		},
		setdragClose () {
			this.dragMoveOff = false;
			this.moveElem.div.classList.remove('move-active')
			this.upposition()
			document.removeEventListener('mousemove', this.setdragMove)
			document.removeEventListener('mouseup', this.setdragClose)
		},
		moveposition(_y, div) { // 设置位置
			// ,
			// 	h = this.height + 20,
			// 	step = _y / h;
		},
		activeEnter(e, i) { // 进入元素
			if (!this.dragMoveOff) return;
			let h = this.height + 20;
			// console.log(this.moveElem.index, i)
			if (this.moveElem.index < i ) {
				e.target.style.top = (i - 1) * h + 'px';
				this.moveElem.index = i;
			} else {
				e.target.style.top = this.moveElem.index * h + 'px';
				this.moveElem.index--;
			}
		},
		upposition() { // 松开鼠标后设置位置
			if (!this.moveElem.move) return;
			let h = this.height + 20,
				divs = Array.from(this.$refs.tablePage.children);
			divs.forEach((item, i) => {
				item.style.top = i * h + 'px';
			})
			this.index = this.moveElem.index;
			this.$emit('handleReversing', {oldindex: this.moveElem.oldindex, index: this.moveElem.index})
			this.moveElem.move = false;
		},
		setPagePos (id) {
			if (id == this.pagePos.id) return
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
		info () {
			this.dataList = this.info.list;
			// console.log(this.dataList[0]._html)
			this.height = 180 * this.info.ratio;
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
	padding-bottom: 20px;
	overflow-y: auto;
    .page-index {
		position: absolute;
		width: 100%;
		padding: 10px 10px;
		transition: top .2s;
		.page-content{
			width: 100%;
			position: relative;
			border: 1px solid #ccc;
			border-radius: 3px;
			overflow: hidden;
			box-sizing: content-box;
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
			background: #000;
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
// 移动
.table-page .page-index.move-active {
	z-index: 2;
	transition: none;
	pointer-events: none;
}
</style>
