<template>
	<transition name="popup">
		<div class="pick-color-box" style="display: flex;justify-content: center;align-items: center;height: 100%;" 
			@click="closePick"
			ref="pickColorBox"
		>
			<div id="pick-color"></div>
			<div v-if="loadingIcon" style="position: absolute;top: 47%;left: 46%">
				<img style="height: 20px;" src="/img/loadingSvg.svg">
			</div>
			<div v-if="toggleColorBox" ref="pickBox" :style="`position: absolute;box-sizing: content-box;border-radius: 61px;width: 122px;height: 122px;border: 1px solid #000;border-radius: 50%;overflow: hidden;left:${position.x}px;top:${position.y}px`">
				<div 
					v-for="(item, i) in colorList" :key="i"
					:style="`float:left;width: 10px;height: 10px;background:${item};border-left: 1px solid ${(i == 60 ? 'red' : i == 61 ? 'red' : 'rgb(204, 204, 204)')}; border-top: 1px solid ${i == 60 ? 'red' : i == 71 ? 'red' : 'rgb(204, 204, 204)'};box-sizing: content-box;`"
				></div>
			</div>
		</div>
	</transition>
</template>

<script>
import html2canvas from 'html2canvas'
import {imageToBase} from '@/assets/js/utils.js'
export default {
	name: 'pickColor',
    props: {
        oldColor: {
            type: String
        }
    },
	data() {
		return {
			 // 画布参数
			 loadingIcon: true,
			 colorList: [], // 附近颜色
			 position: {
				 x: 0,
				 y: 0
			 },
			 toggleColorBox: false, // 放大镜
             rgb: '', // 拾取的颜色
		}
	},
	methods: {
		closePick() { // 关闭
            this.$emit('seeColor', this.rgb)
			this.$emit('closePick', false)
		},
		getCanvas() {
			this.loadingIcon = true
			let node = document.getElementById('drawing').cloneNode(true),
				pickColorNode = document.getElementById('pick-color'),
				width = this.$refs.pickColorBox.offsetWidth,
				height = this.$refs.pickColorBox.offsetHeight;
				document.body.appendChild(node)
			imageToBase(node).then(data => {
				this.loadingIcon = false
				html2canvas(node).then((canvas) => {
					document.body.removeChild(node)
					let w = canvas.width,
						h = canvas.height,
						oldw = 0,
						oldh = 0,
						r = h / w;
					if (w >= h) {
						oldw = w > width / 1.2 ? width / 1.2 : w
						oldh = oldw * r;
					} else {
						oldh = h > height / 1.2 ? height/ 1.2 : h;
						oldw = oldh / r;
					}
					let ratio = w / oldw;
					canvas.style.width = oldw + 'px';
					canvas.style.height = oldh + 'px';
					pickColorNode.appendChild(canvas)
					let ctx = canvas.getContext('2d');
					canvas.onmousemove = (e) => {
						this.pick(e, ctx, ratio)
                        .then(({color, cooky}) => {
			                this.$emit('seeColor', color)
                            this.seeColorCooky(cooky.data) 
                        })
					}
                    canvas.onmousedown = (e) => {
                        this.pick(e, ctx, ratio)
                        .then(({color, cooky}) => {
			               this.rgb = color
                        })
                    }
					canvas.onmouseenter = () => this.toggleColorBox = true;
					canvas.onmouseleave = () => this.toggleColorBox = false;
				})
			})
		},
		pick (e, ctx, ratio) {
			return new Promise((resolve, reject) => {
                let x = e.layerX * ratio,
                    y = e.layerY * ratio,
                    pixel = ctx.getImageData(x, y, 1, 1),
                    cooky = ctx.getImageData(x-5, y-5, 11, 11),
                    data = pixel.data,
					rgb = `rgb(${data[0]},${data[1]},${data[2]})`;
					// console.log(rgb)
                resolve({color: rgb, cooky})
                this.position.x = e.clientX;
                this.position.y = e.clientY;
            })
			
			
		},
		seeColorCooky(arr) {
			let rgb = '';
			this.colorList = []; 
			for(let i = 0, len = arr.length; i < len; i++) {
				// console.log(i%4)
				let a = i%4;
				if ( a == 0) {
					rgb = 'rgb('
				}
				rgb += arr[i] + ','
				if (a == 3) {
					rgb = rgb.slice(0,-5) + ')'
					this.colorList.push(rgb)
				}
			}
		}
	},
	mounted() {
		this.getCanvas()
        this.rgb = this.oldColor
	}
}
</script>

<style lang="scss">
.pick-color-box {
	#pick-color canvas {
		cursor: url(/img/desicon/topTool/pick.png) 0 28, default;
	}
}
.popup-enter,
.popup-leave-to {
	  transform: translateY(-30px);
  }
.popup-enter-active,
.popup-leave-active {
	transition: all .5s;
}
</style>

