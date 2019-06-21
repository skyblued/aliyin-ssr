<template>
	<div>
		<div ref="editor" class="editor" :style="boxStyle">
			<div v-if="clip">
				<span>{{XY.x}},</span>
				<span>{{XY.y}}</span>
			</div>
			<div class="clip" v-if="!clip">
				<div class="right" @mousedown="handleAgree(true)">√</div>
				<div class="wrong" @mousedown="handleAgree(false)">×</div>
			</div>
			<!-- <div class="resize t-resize-point"></div>
			<div class="resize r-resize-point"></div>
			<div class="resize b-resize-point"></div>
			<div class="resize l-resize-point"></div>

			<div class="resize lt-resize-point"></div>
			<div class="resize rt-resize-point"></div>
			<div class="resize rb-resize-point"></div>
			<div class="resize lb-resize-point"></div>

			<div class="rotate-btn"></div> -->
		</div>

		<!-- <div ref="editor" class="editor imgbox" :style="imgBox" data-imgBox="image">
			
			<div class="resize t-resize-point"></div>
			<div class="resize r-resize-point"></div>
			<div class="resize b-resize-point"></div>
			<div class="resize l-resize-point"></div>

			<div class="resize lt-resize-point"></div>
			<div class="resize rt-resize-point"></div>
			<div class="resize rb-resize-point"></div>
			<div class="resize lb-resize-point"></div>

			 <div class="rotate-btn"></div>
		</div> -->

	</div>
</template>

<script>


export default {
	data () {
		return {
			
		}
	},
	props: ['box', 'clip'],
	methods: {
		/**
		 * 裁剪的确认和取消
		 * @handleAgree 确认
		 * 
		 */
		handleAgree (msg) {
			// console.log('确认:' + msg)
			this.$emit('handleClipAgree', msg)
		}
	},
	computed: {
		/**
		 * 返回一个选中元素生成对应的样式
		 */
		boxStyle () {
			let box = this.box;
			// console.log(box)
			if(box === undefined) return;

			// console.log(box)

			let left = box.x2 + 'px' || 0;
			let top = box.y + 'px' || 0;
			let display = box.display || 'none';
			let clip = box.clip;
			return {
				left, top ,display
			}
		},
		/**
		 * x,y坐标
		 */
		XY () {
			let box = this.box;
				
			if(box.x === undefined || box.y === undefined) return {x : 0, y : 0}	

			let x = box.x.toFixed(0)
			let y = box.y.toFixed(0)
			return {x,y}
		},
		imgBox () {
			let box = this.box;
            // console.log(box)
			if(box === undefined) return

			let left = box.x + 'px' || 0;
			let top = box.y + 'px' || 0;
			let width = box.width + 'px' || 0;
			let height = box.height + 'px' || 0;
			let display = box.display || 'none';
			let transform = `rotate(${box.rotate}deg)` || 'rotate(0deg)'
			return {
				left, top , width , height, display
			}

		}
	},
	mounted () {
		// this.addEvent();
	},

}
</script>

<style lang="scss" scoped>

.editor{
	position: absolute;
	z-index: 10;
	transform: all .3s;
	display: none;
	// width: 70px;
	background: rgba(0, 0, 0, 0.3);
	// height: 20px;
	pointer-events: none;
	font-size: 12px;
	color: #fff;
	&::before{
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		border: 1px solid #fff;
	}
	&:after{
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		border: 1px dashed rgba(0, 0, 0, .5);
		z-index: 10;
	}
	.resize{
		position: absolute;
		width: 14px;
		height: 14px;
		z-index: 1;
		background-image: url(/img/dartboard.svg);
		background-repeat: no-repeat;
		background-position-x: 0;
		right: -8px;
		bottom: -8px;
		pointer-events: auto;
	}
	.t-resize-point{
		// cursor: ns-resize;
		top: -7px;
		left: 50%;
		margin-left: -7px;
		z-index: 2;
		background-position-y: -96px;
		&:hover, &:active{
			// cursor: ns-resize;
			background-position-x: -24px;
		}
	}
	.r-resize-point{
		// cursor: ew-resize;
		top: 50%;
		margin-top: -7px;
		right: -13px;
		z-index: 2;
		background-position-y: -168px;
		&:hover, &:active{
			// cursor: ew-resize;
			background-position-x: -24px;
		}
	}
	.b-resize-point{
		// cursor: ns-resize;
		bottom: -9px;
		left: 50%;
		margin-left: -7px;
		z-index: 2;
		background-position-y: -116px;
		&:hover, &:active{
			// cursor: ns-resize;
			background-position-x: -24px;
		}
	}
	.l-resize-point{
		// cursor: ew-resize;
		top: 50%;
		margin-top: -7px;
		left: -8px;
		z-index: 2;
		background-position-y: -144px;
		&:hover, &:active{
			// cursor: ew-resize;
			background-position-x: -24px;
		}
	}
	.lt-resize-point{
		left: -8px;
		top: -8px;
		background-position-y: -24px;
		&:hover, &:active{
			// cursor: nwse-resize;
			background-position-x: -24px;
		}
	}
	.rt-resize-point{
		right: -8px;
		top: -8px;
		background-position-y: 0;
		&:hover, &:active{
			// cursor: nesw-resize;
			background-position-x: -24px;
		}
	}
	.rb-resize-point{
		right: -8px;
		bottom: -8px;
		background-position-y: -72px;
		&:hover, &:active{
			// cursor: nwse-resize;
			background-position-x: -24px;
		}
	}
	.lb-resize-point{
		left: -8px;
		bottom: -8px;
		background-position-y: -48px;
		&:hover, &:active{
			// cursor: nesw-resize;
			background-position-x: -24px;
		}
	}
	// 旋转
	.rotate-btn{
		width: 0;
		height: 40px;
		margin: 0 auto;
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		&::before{
			content: "";
			position: absolute;
			top: 16px;
			left: -10px;
			width: 20px;
			height: 20px;
			border-radius: 10px;
			background: url(/img/dartboard.svg) 0 -192px;
			// cursor: pointer;
		}
		&:hover::before{
			background: url(/img/dartboard.svg) -30px -192px;
		}
		&::after{
			content: "";
			display: block;
			position: absolute;
			left: 50%;
			height: 16px;
			border-left: 1px dashed #9b9b9b;
		}
	}
}
.clip{
	width: 32px;
	height: 64px;
	background: #fff;    
	box-shadow: 0 2px 8px 0 rgba(0,0,0,.24);
	pointer-events: auto;
	cursor: pointer;
	.right, .wrong{
		width: 100%;
		height: 32px;
		font-size: 25px;
		line-height: 32px;
		text-align: center;
		color: rgb(153,153,153);
		&:hover{
			color: rgb(48,158,238);
		}
	}
	.right{
		border-bottom: 1px solid rgba(255, 255, 255, .3);
	}
}
</style>
