import desHeader from "@/components/design/desHeader.vue";
import temp from "@/components/design/sidecomponents/temp.vue";
import TablePage from "@/components/design/TablePage.vue";
import Background from "@/components/design/sidecomponents/background.vue";
import FontText from "@/components/design/sidecomponents/FontText.vue";
import Matter from "@/components/design/sidecomponents/matter.vue";
import Plugin from "@/components/design/sidecomponents/plugin.vue";
import Uploading from "@/components/design/sidecomponents/uploading.vue";
import Setcolor from '@/components/design/setcolor.vue';
import Projection from '@/components/design/projection.vue';
import PathWs from '@/components/design/pathWS.vue'
import Dialog from '@/components/design/dialog.vue'
import Preview from '@/components/design/preview.vue'
import PickColor from '@/components/design/pickColor.vue'
import SuperAdmin from '@/components/design/sidecomponents/superAdmin.vue'
import DownloadWait from '@/components/design/downloadWait.vue'
import Psd from '@/components/design/sidecomponents/psd.vue'

import {
	getTransform,
	getScaledRect,
	getPointAndOpposite,
	getNewRect,
	getNewCursorArray,
	resolver,
	count
} from "@/assets/js/commonJS.js";
// 导入util
import {
	colorToRGB
} from '@/assets/js/utils.js'

// import SVG from "svg.js";
// import draggable from "svg.draggable.js";
// import filter from 'svg.filter.js'


export default {
	components: {
		desHeader,
		temp,
		TablePage,
		Background,
		FontText,
		Matter,
		Plugin,
		Uploading,
		Setcolor,
		Projection,
		PathWs,
		Dialog,
		Preview,
		PickColor,
		SuperAdmin,
		DownloadWait,
		Psd,
	},
	asyncData({app, isDev, route, store, env, params, query, req, res, redirect, error}) {
		console.log(store.state.login.token,1232131, app)
		if (!store.state.login.token) store.commit('login/toggleShow', true)
	},
	validate({ params, query, redirect }) {
		// console.log(params)
		if (params.t) {
			return true
		} else {
			redirect('/')

		} // 参数无效，Nuxt.js 停止渲染当前页面并显示错误页面
		
	},
	data() {
	
		return {
			saveUrl: '', // 保存接口
			autosave: null,
			saveAllpageBtn: true, // 保存按钮限制
			superAdmin: null, // 超级管理员
			queryNumber: null, // 查询编号
			isSave: false, // 是否保存
			wsServer: null, // ws
			wsMssage: '', // ws mssage
			// 参数是否完整
			desParams: false,
			//身份
			identity: null,
			// 查询的模板信息
			templateInfo: null,
			draw: null, // 画布
			model: null, // 某类产品
			defs: null, // 所有的引用
			design_title: "默认标题", // 设计作品标题
			List: [], //
			// 最左侧切换栏
			sideTitle: null,
			// 搜索
			mouseTop: null, // 搜索栏是否
			color5: "rgba(255, 69, 0, 0.68)",

			/* 样式变换定义 start */
			// 左侧面板切换开关
			toggle: true,
			// 顶部类型工具栏,扩展展示
			tool_box: '',
			// 文字字体类型
			familyType: 'all',
			toolShow: {
				show: "",
				father: false
			}, // 工具切换开关
			// 选中元素类型,对应该类型工具类型
			toolType: "",
			// 预设颜色
			colorBackground: [
				'rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(1,187,236)', 'rgb(244,131,183)', 'rgb(255,75,90)', 'rgb(45,110,214)', 'rgb(255,130,1)', 'rgb(129,88,190)', 'rgb(1,177,112)', 'rgb(255,225,82)', 'rgb(134,85,70)', 'rgb(0,156,142)',
			],
			/* 样式变换定义 end */

			/* 投影 start */
			projectionList: {
				k: 35,
				j: 56,
				t: 26,
				d: 78,
				off: false,
				elem: null
			},
			/* 投影 end */

			/* 顶部工具栏 ↓*/
			// 选中类型工具
			codeTypeTool: '',
			// 图片工具 设置大小
			imageObj: {
				width: '',
				height: '',
			},
			// 图片裁剪
			clipImageSrc: "", // 需要裁剪的图片
			isClipImage: false,
			clipBoxPosition: {
				// 保存裁剪大小
				x: null,
				y: null,
				width: null,
				height: null,
				off: {}
			},
			// 图片clip: rect
			clipImage: null,
			imageSize: {// 每次创建image时,保存当前大小
				w: 0,
				h: 0
			},
			// 背景图片
			backgroundShow: false,
			// 背景图片处理
			backgroundImageUrl: '',
			/* 顶部工具栏 ↑*/

			/* 底部工具 ↓ */
			// 底部控件计算画布比例
			setCanvasRatio: '',
			// 预览窗口
			pageThumbSrc: '',
			pageViewOff: false, // 是否显示缩放预览框
			pageViewOldPos: { // 预览窗口移动参数
				ex: null,
				ey: null,
				left: null,
				top: null,
				maxX: null,
				maxY: null,
				drawRatio: null,
				isLeft: true,
				isTop: true
			},
			refLine: { // 参考线
				lines: [],
				down: false,
				clientX: 0,
				clientY: 0,
				l: null,
				x: 0,
				y: 0,
				w: 0,
				h: 0
			},
			/* 底部工具 ↑ */


			// 存放操作的元素
			svgList: [], // 存放所有svg里面的元素
			elementChecked: null, // 选中的svg元素
			twoGroup: null, // 第二
			threeGroup: null, // 第四
			svgParent: null, // 嵌套svg
			svgLock: false, // 当前元素锁定状态
			adsorbSrc: null, // 吸附元素
            adsorbOff: false, // 开关
			isClipAdsorb: false, // 是否要裁切吸附框

			//
			textSvg: null, // 选中的文字类型的path

			imgX: null, // 拖拽元素进来时，获取x轴的坐标
			imgY: null, // // 拖拽元素进来时，获取y轴的坐标
			block: false, // 滑块开关
			// blockDistance: '140px', 	//滑块移动的距离
			rectSelect: this.$refs.rectDiv, // 矩形选区
			rectOldpos: {
				posx: 0,
				posy: 0
			},
			rectSelectStyle: {
				left: 0,
				top: 0,
				width: 0,
				height: 0,
				display: "none",
				leaveDraw: true
			},
			inputShow: false, // 输入框的切换显示
			svgBackground: "rgb(255,255,255)",
			familyList: [],
			fontColorSelect: "#C118C4",
			useColor: [], // 模板颜色拾取(暂时支持文字)
			// 文字设置 start
			textElem: null,
			textDefault: '', // 选中的字体
			textObj: {
				size: 28,
				family: '',
				spacing: 0,
				line: 1,
				lineHeight: 1,
				itailic: 0,
				bold: 0,
				underline: 0
			}, // 每次发送的文字集合字符串
			// 间距
			fontStyle: {
				spacing: 0,
				line: 0
			},
			fontValue: "NSimSun", // 字体
			//
			font: false, // 如果是文字就显示它的功能
			textOff: false, // 只有修改文字之后才能再次去请求服务器
			opacityValue: 100,
			textSelectedHeight: null,
			oldWordSpace: 0,
			textProduction: false, // 生成文字时的动画开关
			wordSpace: 19, // 字间距
			lineSpace: 0, // 行间距
			// mutationEvent 监听文字发生变化
			observer: null,
			// 文字设置 end

			// 组合
			group: {
				// 选中多个组合
				set: null,
				box: null,
				isgroup: false
			},
			mouseStopId: null, // 鼠标左键按下
			// 历史记录,撤销和恢复记录
			// 页面记录
			totalHistory: [],
			svgHistory: [],
			templateHistory: [], // 所有的页面数据
			svgRedoList: [],
			testHistory: [],
			//svg颜色拾取和填充
			svgFill: ["#f06"],
			svgFillList: [],
			svgFillIndex: null,


			page: {
				// 记录屏幕坐标
				show: false,
				position: {
					left: 0,
					top: 0
				}
			},
			// 模板加载列表
			templateList: [],
			// 当前模板所有页数据列表
			CurrentTemplateData: [],
			// 加载模板时的动画
			templateAnimation: false,
			// 右侧预览图

			// 当前渲染数据
			loadTemplate: null,
			// 选中元素的位置和大小
			codeBox: {
				x: 0, y: 0 , width: 0, height: 0, isShow: false, rotate: 0
			},
			//copy 复制左侧选中的素材
			copyBox: {
				x: 0, y: 0 , width: 0, height: 0, display: false, cx: 0, cy: 0, _cx: 0, _cy: 0, result: '', src: '', ratio: 0, _html: ''
			},
			// 拖拽元素
			dragAndDrop: null,
			// 记录选中最初的大小
			oldCodeBox: null,
			// 选中按钮控件
			resizeBox: {
				move: false,
				t: false,
				l: false,
				r: false,
				b: false,
				lt: false,
				lb: false,
				rt: false,
				rb: false,
				rotate: false
			},
			// 可以保存的开关
			canSave: false,
			timer: null,
			timerPng: null,
			// 保存成功后
			saveSuccess: false,
			// 保存模板的id
			TemplateNumber: null,
			// 创建模板后
			creatTemplate: null,
			// 保存当前编辑的页面的页码
			pagenum: 0,
			
			// copy素材是否进入画布 
			copyok: false,
			// copy的原对象
			metaCopy: true,
			/* 下载和印刷的对话框 ↓ */
			dialog: {
				success: true,
				off: false,
				type: ''
			},
			/* 下载和印刷的对话框 ↑ */
			/* 快捷键参数 */
			ctrlKey: false, // 键盘ctrl按下
			allMask: false, // 全屏遮罩
			maskObj: { // 抓手工具
				off: false,
				ex: 0,
				ey: 0,
				_x: 0,
				_y: 0,
				x: 0,
				y: 0,
				elem: null,
			},
			ctrlCopy: null, // ctrl 复制
			copyElemArr: [], // 复制集合
			elemIndex: null, // 选中元素按下
			/* 吸附参考线 */
			guide: {
				selectBox: null,
				arr: [],
				off: true
			},
			preview: {// 预览
				off: false,
				show: false,
				wait: true, // 等待
				src: 'http://www.aliyin.com/img/error/ku.png',
				msg: '',
				data: {
					obj: '', mtl: ''
				},
				btnSee: true// 是否显示预览按钮
			}, 
			showPickColor: { // 吸取颜色对话框
				show: false, type: ''
			},
			rightBtn: { // 右键参数
				show: false,
				x: 0,
				y: 0,
			},
			PageMode: null, // p数模式
		};
	},
	filters: {
		setInt(num) { // 取整
			return num.toFixed(0)
		},
		textStr: function (value) {
			let str = ''
			value.forEach(item => {
				str += item + '\n'
			})
			return str
		}
	},
	mounted() {
		// console.log(this)
		this.createInfo();
		this.getTemplate().then(data => {
			this.handleLoadTemplateData(data);
		}); // 查询模板数据
		// this.WS()
		
		// 查询还是创建空白模板
		// 获取字体列表
		this.getFontData();
		window.addEventListener('keyup', this.keycode)
		window.addEventListener('keydown', this.keyDown)
		window.addEventListener('mouseup', this.mouseUp)

		window.onbeforeunload =  (e) => {
			if (this.isSave) {
				return false;
			}
		}
	},
	methods: {
		createInfo() {
			// console.log(this.$store)
			let params = this.$route.params,
				query = window.atob(params.t),
				queryArr = query.split('&');
				this.queryNumber = queryArr[0].split('='),
				this.superAdmin = queryArr[1] == 'admin=admin' ? 'admin' : null;
			
					
			// 获取设计者身份
			this.autosave = this.superAdmin ? false : true;	
			this.sideTitle = this.superAdmin ? 'admin' : 'matter';
		},
		closeWindow() { // 关闭窗口
			this.$confirm(`服务器出错`, {
				title: '提示',
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center: true,
				showClose: false,
				showCancelButton: false,
				closeOnClickModal: false, // 点击遮罩外不可取消
				confirmButtonText: '关闭', // 确定按钮内容
				closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
			}).then(() => {
				window.close();
			}).catch(() => {
				window.close();
			});
		},
		seeColor(color) { //设置吸管颜色
			if (this.showPickColor.type == 'text') {
				this.fontColor(color)
			} else if (this.showPickColor.type == 'svg') {
				this.handleSvgFill(color)
			} else if (this.showPickColor.type == 'background') {
				this.fontColorSelect = color;
				this.handleChangeBackground({type: 'color',background: color})
			} else if (this.showPickColor.type == 'group') {
				this.groupText(color)
				
			}
		},
		setPreview(type) { // 生成预览图, 开启预览
			this.preview.off = type
			this.preview.wait = true;
			if (type) {
				this.preview.show = false
				let view = this.draw.viewbox(),
					list = [];
				this.CurrentTemplateData.forEach(item => {
					list.push(item.SvgContent)
				})
				this.getPreview(list, view)
				.then(data => {
					this.preview.data = data
					this.preview.show = true
					this.preview.msg = ''
				})
				.catch(err => {
					this.preview.show = false
					this.preview.msg = '服务器出错, 请稍后再试'
				})
			}
		},
		getPreview(list, size) { // 生成svg图片
			return new Promise((resolve, reject) => {
				let obj = {
					list,
					name: this.formatDate(),
					width: size.width,
					height: size.height,
					obj: this.$store.state.port.imgBaseUrl + this.templateInfo.Size.StereoModel + `?v=${new Date().getTime()}`,
					mtl: this.$store.state.port.imgBaseUrl + this.templateInfo.Size.StereoMaterial+ `?v=${new Date().getTime()}`
				}
				// http://localhost:5050/replace this.$store.state.preveiwPort
				this.$axios.post(this.$store.state.port.preveiwPort, obj, {
					timeout: 1000 * 60 * 2
				})
				.then(res => {
					resolve(res.data)
				})
				.catch(err => {
					reject(false)
				})
			})
		},
		// 获取字体列表
		getFontData() {
			this.$axios.get("/Fonts").then(({data}) => {
				// console.log(res)
				if (data == undefined || data == null) return console.log('没有字体')
				this.familyList = data;
				this.textDefault = data[0].FontThumb;
				// console.log(res.data)
				// let font = document.getElementById('font-face'),
				// 	str = '';
				let font = document.createElement('style'), str = '';
					this.familyList.forEach((item, i) => {
						item.down = false;
						if (i == 0) {
							item.down = true;
							fetch(`https://aliyinsrc.oss-cn-shenzhen.aliyuncs.com/${item.FontPath}`)
						}
						item.src = `https://aliyinsrc.oss-cn-shenzhen.aliyuncs.com/${item.FontPath}`
						str += `
							@font-face {
								font-family: "${item.FontCairoName}";
								src: url("https://aliyinsrc.oss-cn-shenzhen.aliyuncs.com/${item.FontPath}")
							}
						`
					})
					font.innerHTML = str;
					document.head.append(font)
			});
		},
		getFontThumb(font) { //获取当前字体名称
			let fontObj = '';
			for(let i = 0, len = this.familyList.length; i < len; i++) {
				// console.log(font , this.familyList[i].FontCairoName)
				if (font == this.familyList[i].FontCairoName) {
					fontObj = this.familyList[i]
					return fontObj;
				}
			}
			
			if (fontObj == '') fontObj = this.familyList[0]
			return fontObj
		},
		/* 操作方法 start ↓*/
		init() {
			if (this.svgLock) return
			document.addEventListener("mousemove", this.drag);
			document.addEventListener("mouseup", this.setShow);
		},
		close() {

			document.removeEventListener("mousemove", this.drag);
			document.removeEventListener("mouseup", this.setShow);
		},
		// 更新样式
		css(node, ops) {
			for (var index in ops) {
				node["style"][index] = ops[index];
			}
		},
		// 设置旋转后指示箭头
		setCursorStyle(degree) {
			var top = document.querySelector(".t-resize-point"),
				topRight = document.querySelector(".rt-resize-point"),
				right = document.querySelector(".r-resize-point"),
				bottomRight = document.querySelector(".rb-resize-point"),
				bottom = document.querySelector(".b-resize-point"),
				bottomLeft = document.querySelector(".lb-resize-point"),
				left = document.querySelector(".l-resize-point"),
				topLeft = document.querySelector(".lt-resize-point"),
				cursorStyle = getNewCursorArray(degree);
			this.css(top, {
				cursor: cursorStyle[0]
			});
			this.css(topRight, {
				cursor: cursorStyle[1]
			});
			this.css(right, {
				cursor: cursorStyle[2]
			});
			this.css(bottomRight, {
				cursor: cursorStyle[3]
			});
			this.css(bottom, {
				cursor: cursorStyle[4]
			});
			this.css(bottomLeft, {
				cursor: cursorStyle[5]
			});
			this.css(left, {
				cursor: cursorStyle[6]
			});
			this.css(topLeft, {
				cursor: cursorStyle[7]
			});
		},
		rectDraw() {
			let zoom = this.draw.viewbox().zoom;
			let svgRatio = this.svgParent && this.svgParent.viewbox().zoom;
			let rbox = this.draw.rbox();
		
			if (this.toolType == 'group') {
				let group = this.group.set.members;
				group.forEach((firstGroup, i) => {
					let rotate = firstGroup.first().data('rotate');
					let svg = firstGroup.first().first()
					let svgWidth = this.codeBox.width * this.group.box[i].oldwidth / zoom;
					let svgHeight = this.codeBox.height * this.group.box[i].oldheight / zoom;
					let cx = (this.codeBox.x - rbox.x + this.codeBox.width * this.group.box[i].oldx) / zoom;
					let cy = (this.codeBox.y - rbox.y + this.codeBox.height * this.group.box[i].oldy) / zoom;

					svg.size(svgWidth, svgHeight);
					firstGroup.translate(cx, cy);
					firstGroup.first().attr('transform', `rotate(${rotate},${svgWidth / 2},${svgHeight / 2})`)
					if (firstGroup.data('type') == 'text') {
						let obj = firstGroup.data("obj");
						obj.size = svgHeight * obj.scale
						firstGroup.data({obj})
					}
				})
			} else if (this.toolType == 'adsorb' && this.isClipAdsorb) {
				let w = this.codeBox.width - this.page.oldCodeBox.width; // 宽度增量
				let h = this.codeBox.height - this.page.oldCodeBox.height; // 高度增量
				let image = this.elementChecked.node.querySelector('image');
					image = SVG.get(image.id)

				image.size(this.codeBox.width / zoom / svgRatio, this.codeBox.height / zoom / svgRatio)
				switch (this.page.adsorbPoint) {
					case 1:
						image.move( this.page.image.imgX - w / zoom / svgRatio, this.page.image.imgY - h / zoom / svgRatio)
					break;
					case 2:
						image.move( this.page.image.imgX , this.page.image.imgY - h / zoom / svgRatio)
					break;
					case 3: 
						image.move( this.page.image.imgX , this.page.image.imgY)
					break;
					case 4: 
						image.move( this.page.image.imgX - w / zoom / svgRatio , this.page.image.imgY)
					break
				}
				
			} else {

				let ratio = this.codeBox.height / this.codeBox.width
				this.svgParent.size(this.codeBox.width / zoom, this.codeBox.height / zoom).data('ratio', ratio);

				let x = (this.codeBox.x - this.page.oldCodeBox.x) / zoom;
				let y = (this.codeBox.y - this.page.oldCodeBox.y) / zoom;
				this.elementChecked.move(this.page.oldElem.x + x, this.page.oldElem.y + y)
				// this.elementChecked.attr("transform", `translate(${this.page.oldElem.x + x},${this.page.oldElem.y + y})`);
				this.twoGroup.attr("transform", `rotate(${this.codeBox.rotate},${this.svgParent.width() / 2},${this.svgParent.height() / 2})`);

			}

			if (this.toolType == "text") {
				if (this.codeTypeTool !== 'text') {
					let obj = this.elementChecked.data("obj");
					this.textObj.size = this.codeBox.height * obj.scale
					obj.size = this.textObj.size / zoom
					this.elementChecked.data({obj})
				}
			}
		},

		// 记录坐标
		handleRecord(e) {
			if (e.button !== 0) return;
			this.rightBtn.show = false;
			let ele = e.target;
			
			let classList = ele.classList;
			if (classList.contains("code-box")) {
				this.elementChecked && this.elemDown(this.elementChecked.id())
				this.resizeBox.move = true;
				this.getAllElemPos()
				// !this.group.set && ;// 获取所有元素的位置
			} else if (
				classList.contains("rb-resize-point") ||
				classList.contains("lt-resize-point") ||
				classList.contains("rt-resize-point") ||
				classList.contains("lb-resize-point") ||
				classList.contains("t-resize-point") ||
				classList.contains("r-resize-point") ||
				classList.contains("b-resize-point") ||
				classList.contains("l-resize-point")
			) {
				this.resizeBox.move = false;
				this.resizeBox.resize = true;
				if (this.toolType == 'text' && (classList.contains("l-resize-point") || classList.contains("r-resize-point"))) {
					this.inputSubmit()
				}
			} else if (classList.contains("rotate-btn")) {
				this.resizeBox.move = false;
				this.resizeBox.rotate = true;
			}
			this.oldCodeBox = JSON.stringify(this.codeBox);
			// console.log(this.codeBox)
			var {
				x,
				y,
				width,
				height,
				rotate
			} = this.codeBox;
			var ex = event.pageX;
			var ey = event.pageY;
			// 计算初始状态旋转后的rect
			this.page.transformedRect = getTransform({
				x,
				y,
				width,
				height
			}, rotate);
			// 取得旋转后的8点坐标
			var {
				point
			} = this.page.transformedRect;

			// 获取当前点和对角线点
			var pointAndOpposite = getPointAndOpposite(point, ex, ey);

			var {
				opposite
			} = pointAndOpposite;

			// 对角线点的索引即为缩放基点索引
			this.page.baseIndex = opposite.index;
			this.page.oppositeX = opposite.point.x;
			this.page.oppositeY = opposite.point.y;

			// 鼠标释放点距离当前点对角线点的偏移量
			this.page.offsetWidth = Math.abs(ex - this.page.oppositeX);
			this.page.offsetHeight = Math.abs(ey - this.page.oppositeY);

			// 记录最原始的状态
			this.page.oPoint = {
				x,
				y,
				width,
				height,
				rotate
			};
			this.init();
			this.page.x = e.clientX;
			this.page.y = e.clientY;
			this.page.ax = this.page.oPoint.x + this.page.oPoint.width / 2 
			this.page.ay = this.page.oPoint.y + this.page.oPoint.height / 2 
			this.page.oldCodeBox = JSON.parse(JSON.stringify(this.codeBox));
			if (!this.elementChecked) return
			let transform = this.elementChecked.transform();
			this.page.oldElem = JSON.parse(JSON.stringify(transform))
			let image = this.elementChecked.node.querySelector('image')
			let imgX = image ? image.x.animVal.value : '';
			let imgY = image ? image.y.animVal.value : '';
			this.page.image = {imgX, imgY}
			
			this.page.adsorbPoint = 
									classList.contains("lt-resize-point") ?	1 :
									classList.contains("rt-resize-point") ? 2 :
									classList.contains("rb-resize-point") ? 3 :
									classList.contains("lb-resize-point") ? 4 : 0
			
		},
		// 拖拽
		drag(e) {
			if (this.textProduction) return
			let oldCodeBox = this.page.oldCodeBox;
			var x = e.clientX - this.page.x;
			var y = e.clientY - this.page.y;
			let w, h;
			this.page.x = e.clientX;
			this.page.y = e.clientY;

			let zoom = this.draw.viewbox().zoom;
			let rbox = this.draw.rbox();
			// 旋转
			if (this.resizeBox.rotate) {
				let parent = this.svgParent;
				let rotate = (Math.atan2(e.clientX - this.page.ax, this.page.ay - e.clientY) / Math.PI) * 180;
				// let div = document.querySelector(".code-box");
				rotate = Math.round(rotate + 180);
				if (rotate < 5 || rotate > 355) rotate = 0;
				if (rotate < 95 && rotate > 85) rotate = 90;
				if (rotate < 185 && rotate > 175) rotate = 180;
				if (rotate < 275 && rotate > 265) rotate = 270;
				this.codeBox.rotate = rotate;

				this.twoGroup.attr('transform', `rotate(${rotate},${parent.width()/2},${parent.height()/2})`).data({
					rotate: rotate
				});
				this.setCursorStyle(rotate);
				return
			}

			// 移动
			if (this.resizeBox.move) {
				this.codeBox.x += x;
				this.codeBox.y += y;
				// !this.group.set && 
				this.setSelectBox(x/zoom, y/zoom)
				if (this.toolType == 'group') {
					let group = this.group.set.members;
					group.forEach((firstGroup, i) => {
						let cx = (this.codeBox.x - rbox.x + this.codeBox.width * this.group.box[i].oldx) / zoom;
						let cy = (this.codeBox.y - rbox.y + this.codeBox.height * this.group.box[i].oldy) / zoom;
						firstGroup.translate(cx, cy);
					})
				} else if (this.toolType == 'adsorb' && this.isClipAdsorb) {
					w = this.codeBox.x - oldCodeBox.x;
					h = this.codeBox.y - oldCodeBox.y;
					let image = this.elementChecked.node.querySelector('image');
						image = SVG.get(image.id)
					let r = this.codeBox.rotate * Math.PI / 180
					let _x = w / Math.cos(r) + Math.sin(r) * (h - w * Math.tan(r));
					let _y = Math.cos(r) * (h - w * Math.tan(r))
					let svgRatio = this.svgParent.viewbox().zoom;
					let x1 = this.page.image.imgX + _x / zoom / svgRatio;
					let y1 = this.page.image.imgY + _y / zoom / svgRatio;
					
					image.move(x1, y1)
				} 
				else {
					let transform = this.elementChecked.transform();
					this.elementChecked.move(transform.transformedX + x / zoom, transform.transformedY + y / zoom)
					// this.elementChecked.attr("transform", `translate(${},${})`);
				}
				return
			}
			//旋转后重新计算left，top 值
			if (this.resizeBox.resize) {

				var event = e;
				var nex = event.pageX;
				var ney = event.pageY;
				var scale = {
					x: 1,
					y: 1
				};
				var realScale = 1;

				// 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
				if (this.page.offsetWidth > this.page.offsetHeight) {
					realScale = Math.abs(nex - this.page.oppositeX) / this.page.offsetWidth;
				} else {
					realScale = Math.abs(ney - this.page.oppositeY) / this.page.offsetHeight;
				}

				if ([0, 2, 4, 6].indexOf(this.page.baseIndex) >= 0) {
					scale.x = scale.y = realScale;
				} else if ([1, 5].indexOf(this.page.baseIndex) >= 0) {
					scale.y = realScale;
				} else if ([3, 7].indexOf(this.page.baseIndex) >= 0) {
					scale.x = realScale;
				}

				var newRect = getNewRect(
					this.page.oPoint,
					scale,
					this.page.transformedRect,
					this.page.baseIndex
				);
				this.codeBox.x = newRect.x;
				this.codeBox.y = newRect.y;
				this.codeBox.width = newRect.width;
				this.codeBox.height = newRect.height
				
				this.rectDraw();
			}

		},
		// 关闭控件
		setShow(e) {
			this.setSaveTime();
			for (let item in this.resizeBox) {
				this.resizeBox[item] = false;
			}
			this.close();
            if (this.toolType == 'group') return;
             let type = this.elementChecked.data("type");
            if (type == "adsorb") { // 选中吸附框时
				this.handleAdsorbUp(e, this.elementChecked)
			}
		},
		/* 操作方法 end ↑*/

		
		handledblclick() { // 展示框codebox 双击触发效果
			if (this.toolType == 'group') return;
			let type = this.elementChecked.data("type");
			if (type == "text") { // 选中文字时
				this.copyElemArr = []
				this.inputSubmit();
			}
		},
        handleEnter(e) {
            if (this.toolType == 'group') return;
            let type = this.elementChecked.data("type");
			if (type == "adsorb") { // 选中吸附框时
				this.handleAdsorbEnter(e, this.elementChecked)
			}
        },
        handleLeave(e) {
            if (this.toolType == 'group' || !this.elementChecked) return;
             let type = this.elementChecked.data("type");
            if (type == "adsorb") { // 选中吸附框时
				this.handleAdsorbLeave(e, this.elementChecked)
			}
        },
		/*  画布初始化 */
		handleCanvasInit() {
			// 初始化画布 ,如果有内容 清空
			
			if (this.draw) this.draw.remove();
			let editorSvg = this.$refs.editorSvg,
				codeBox = this.$refs.box,
				drawing = this.$refs.drawing;
			// 静止使用右键
			editorSvg.oncontextmenu = function (e) {
				return false
			};
			codeBox.oncontextmenu = (e) => {
				this.rightMenuBox(e)
				return false
			};
			// 获取显示区域的宽高
			let width = editorSvg.offsetWidth,
				height = editorSvg.offsetHeight;
			let w = 0,
				h = 0,
				eleid = "canvas",
				vw = 0,
				vh = 0;
			let size = this.templateInfo.Size;
			let ratio = size.Height / size.Width;
			
			if (size.Width > size.Height) {
				w = width - 140;
				h = w * ratio;
				vw = 70;
				vh = (height - h) / 2;
			} else {
				h = height - 140;
				w = h / ratio;
				vh = 70;
				vw = (width - w) / 2;
			}
			drawing['style']['left'] = vw + 'px'
			drawing['style']['top'] = vh + 'px'
			drawing['style']['width'] = w + 'px'
			drawing['style']['height'] = h + 'px'
			// console.log(size, size.ResolvingPower,size.Width * 300/ 25.4)
			let draw = SVG("drawing"),
				dpi = size.Unit == 'mm' ? ((size.ResolvingPower || 300) / 25.4) : 1;
			draw.size(w, h).viewbox(0, 0, size.Width * dpi , size.Height * dpi).attr("id", eleid)
			if (this.templateInfo.TypeId != 23) draw.style('background', '#fff');
			this.setCanvasRatio = (w / (size.Width * dpi) * 100).toFixed(0) + '%'
			this.draw = draw;
			this.model = null;
			draw.clear();
			// window.addEventListener("resize", this.setCanvasResize);
		},
		superBtn() { // 超级管理员回退
			this.group.set = this.draw.set();
			var list = this.draw.children();
			// console.log(list)
			list.forEach((item, index) => {
				if (item.data('type') != 'Masking')
				this.group.set.add(item)
			})
			let zoom = this.draw.viewbox().zoom;
			let dbox = this.draw.rbox();
			let sbox = this.group.set.bbox();
			this.codeBox.x = sbox.x * zoom + dbox.x;
			this.codeBox.y = sbox.y * zoom + dbox.y;
			this.codeBox.width = sbox.width * zoom;
			this.codeBox.height = sbox.height * zoom;
			this.group.box = this.getGroupRelativePosition(this.group.set, sbox);
			this.group.isgroup = true;
			this.codeBox.isShow = true;
			this.toolShow.father = true;
			this.toolType = 'group';
		},
		dingchang(size){
			let view = this.draw.viewbox(),
				zoom = view.zoom,
				w = this.draw.width(),
				h = this.draw.height();
			let rbox = this.draw.rbox();
			let sbox = this.group.set.bbox();
			this.codeBox.width = sbox.w / size //w;
			this.codeBox.height = sbox.h / size; // w * (sbox.h / sbox.w);
			this.codeBox.x = rbox.x;
			this.codeBox.y = rbox.y;
			let group = this.group.set.members;
				group.forEach((firstGroup, i) => {
					let rotate = firstGroup.first().data('rotate');
					let svg = firstGroup.first().first()
					let svgWidth = this.codeBox.width * this.group.box[i].oldwidth / zoom;
					let svgHeight = this.codeBox.height * this.group.box[i].oldheight / zoom;
					let cx = (this.codeBox.x - rbox.x + this.codeBox.width * this.group.box[i].oldx) / zoom;
					let cy = (this.codeBox.y - rbox.y + this.codeBox.height * this.group.box[i].oldy) / zoom;

					svg.size(svgWidth, svgHeight);
					firstGroup.translate(cx, cy);
					firstGroup.first().attr('transform', `rotate(${rotate},${svgWidth / 2},${svgHeight / 2})`)
					if (firstGroup.data('type') == 'text') {
						let obj = firstGroup.data("obj");
						obj.size = svgHeight * obj.scale
						firstGroup.data({obj})
					}
				});
		},
		dingchang2() { // 一键解锁
			let list = this.draw.children();
			list.forEach(item => {
				if (item.data('type') != 'Masking') {
					item.attr('class', 'hoveMove')
				}
			})
			this.svgLock = false
		},
		//画布跟随窗口大小设置
		setCanvasResize() {
			if (this.toolType == 'text') {
				this.inputSetPath()
			}
			this.clearRectSelect();
			let dbox, drawing, editorSvg, size, ratio, width, height, w, h, vw, vh;
			dbox = this.draw.viewbox();
			drawing = this.$refs.drawing;
			editorSvg = this.$refs.editorSvg;
			size = this.templateInfo.Size;
			ratio = size.Height / size.Width;
			width = editorSvg.offsetWidth;
			height = editorSvg.offsetHeight;

			if (size.Width > size.Height) {
				w = width - 140;
				h = w * ratio;
				vw = 70;
				vh = (height - h) / 2 - 30;
			} else {
				h = height - 200;
				w = h / ratio;
				vh = 70;
				vw = (width - w) / 2 - 30;
			}
			drawing['style']['left'] = vw + 'px'
			drawing['style']['top'] = vh + 'px'
			drawing['style']['width'] = w + 'px'
			drawing['style']['height'] = h + 'px'
			this.setCanvasRatio = (w / dbox.width * 100).toFixed(0) + '%'
			this.draw.size(w, h);
			// this.pageViewShow()
		},

		/* 查询模板数据 */
		getTemplate() {
			this.templateAnimation = true;
			
			if (this.queryNumber) {
				let url = '', 
				page = this.queryNumber[0], 
				t = this.queryNumber[1];
			
				if (page == 'TemplateNumber') { // 设计师
					this.identity = 'TemplatePages'
					this.saveUrl = this.$store.state.port.DesignerTemplatePage;
					url = this.$store.state.port.Template;
				} else { // 团队
					this.identity = 'Pages';
					this.saveUrl = this.$store.state.port.DocumentPage;
					url = this.$store.state.port.Document;
				}
				let formdata = new FormData();
				formdata.append(page, t);
				return new Promise((resolve, reject) => {
					this.$axios.post(url, formdata)
					.then(res => {
						this.templateAnimation = false;
						let data = res.data;
						// console.log(data)
						// 保存模板数据
						this.templateInfo = data;
						this.preview.btnSee = data.Size.StereoModel == '' ? false : true;
						this.design_title = data.Name;
						this.PageMode = data.ProductType;
						if (!this.PageMode.PageMode) this.PageMode.MaxPages = this.PageMode.FixedPages
						// console.log(this.PageMode)
						this.getMasking()
						.then(masking => {
							let size = this.templateInfo.Size, 
								dpi = size.Unit == 'mm' ? ((size.ResolvingPower || 300) / 25.4) : 1;
							let str = `<svg width="${size.Width * dpi}" height="${size.Height * dpi}" preserveAspectRatio="none"`
							masking = masking.replace(/^<svg/, str)
							this.templateInfo.Size.MaskingContent = masking;
						})
						resolve(data)
						
					})
					.catch(err => {
						console.log(err)
						this.closeWindow()
					})
				})
			} else {
				this.closeWindow()
			}
			
		},
		getPageJson(page) { // 查询json数据,和svg html
			return Promise.all(Array.from(page).map((item, index) => {
				return new Promise((resolve, reject) => {
					
					let jsonPath = this.$store.state.port.ossPath + item.JsonPath + `?v=${new Date().getTime()}`,
						svgPath = this.$store.state.port.ossPath + item.SvgPath;
					this.$axios.get(jsonPath)
					.then(({data}) => {
						// console.log(data)
						item.JsonContent = JSON.stringify(data);
						resolve(true)
					})
				})
			}))
		},
		getMasking() { // 获取
			return new Promise((resolve, reject) => {
				if (this.templateInfo && this.templateInfo.Size.SizeMarking.length) {
					// console.log('Size.Masking' , this.templateInfo.Size)
					let path = '';
					for(let obj of this.templateInfo.Size.SizeMarking) {
						if (obj.IsDefault) {
							path = obj.MarkingPath
						}
					}
					if (!path) path = this.templateInfo.Size.SizeMarking[0].MarkingPath;
					console.log(path)
					fetch('http://img.aliyin.com/' + path + '?v=' + new Date().getTime())
					.then(response => response.text())
					.then(data => {
						// console.log(data)
						resolve(data)
					})
					.catch(err => resolve(''))
				} else {
					resolve('')
				}
			})
		},
		/* 操作模板数据 */
		handleLoadTemplateData(data) {
			this.handleCanvasInit();
			// console.log(data, this.identity)
			let page = data[this.identity];
			this.CurrentTemplateData = page;
			// console.log(page)
			this.getPageJson(page)
			.then(bool => {
				// console.log(this.CurrentTemplateData[0])
				this.loadTemplate = this.CurrentTemplateData[0];
				this.pageThumbSrc = this.CurrentTemplateData[0].Thumb && this.$store.state.port.imgBaseUrl + this.CurrentTemplateData[0].Thumb + `?v=${new Date().getTime()}`
				this.productSvgHtml();
			})
		},
		// 渲染模板
		handleLoadTemplate(templateList) {
			this.handleCanvasInit();
			this.addMasking();
			let list = JSON.parse(templateList.JsonContent);
			// this.svgList = list;
			// console.log(templateList)
			if (!list.length) return;
			// console.log(list)
			this.readerTemplate(list)
			
		},
		/**
		 * 
		 * @param {Array} children 子元素
		 */
		readerTemplate(children) { // 渲染模板
			let draw = this.draw, masking = null;
			children.forEach((item, i) => {
				item.eleid = new Date().getTime()+i;
				if (item.type != 'Masking') {
					
					let firstGroup = draw.group(),
						twoGroup = firstGroup.group(),
						svgGroup = twoGroup.nested();
					firstGroup.attr({
						transform: item.transform,
						id: item.eleid,
						class: item.className,
						opacity: item.opacity
					}).data({
						type: item.type,
						obj: item.key,
						group: item.group
					})
					if (item.type == 'background') {
						firstGroup.node.onmousedown = event => {
							// event.stopPropagation() 
							this.backgroundClick(item.eleid)
						}
					} else if (item.type == 'adsorb') {
						firstGroup.on("mouseenter", this.handleAdsorbEnter);
						firstGroup.on("mouseup", this.handleAdsorbUp);
						firstGroup.on('mouseleave', this.handleAdsorbLeave);
						firstGroup.on("click", () => this.handleActive(item.eleid));
						firstGroup.on("mousedown", () => this.elemDown(item.eleid))
					} else {
						firstGroup.on("click", () => this.handleActive(item.eleid))
						firstGroup.on("mousedown", () => this.elemDown(item.eleid))
					};
	
					if (item.className == "hoveMove" && item.group == '') firstGroup.draggable().on('dragend', () => this.setSaveTime())
					else firstGroup.draggable(false)
					twoGroup.data({
						rotate: item.rotate
					}).attr('transform', item.rotation);
					svgGroup.size(item.width, item.height).attr({'viewBox': item.viewbox, preserveAspectRatio: 'none'}).style('overflow', '')
					if (item.type == 'text') {
						// console.log(item._html, 123)
						let reg = /(fill|stroke)=rgb\(.*?\)/ig;
						let reg2 = /fill="rgb\(0," 0,="" 0\)="" stroke="rgb\(0,"/g
						let reg3 = /fill="rgb\(255," 255,="" 255\)="" stroke="rgb\(255,"/g
						let reg4 = /fill="rgb\(112," 112,="" 112\)="" stroke="rgb\(112,"/g
						item._html = item._html.replace(reg, function(val) {
							let arr = val.split('=')
							val = arr[0] + '="' + arr[1] + '"'
							return val
						})
						item._html = item._html.replace(reg2, 'fill="#000" stroke="#000"')
						item._html = item._html.replace(reg3, 'fill="#fff" stroke="#fff"')
						item._html = item._html.replace(reg4, 'fill="#707070" stroke="#707070"')
						item._html = item._html.replace(/(stroke-linecap=('|")round('|")|stroke-linejoin=('|")round('|"))/ig, '')
						// console.log(item._html, 456)
					}
					svgGroup.svg(item._html || item.str)//.attr('transform', item.reverse);
					if (item.type == undefined) firstGroup.remove();
				} else {
					masking = item
				}
				if (item.type == 'text') {
					let family = this.getFontThumb(item.key.family)
					if (!family.down) {
						fetch(family.src)
					}
				}
			})
			if (masking && this.templateInfo.TypeId == 38 && this.templateInfo.Size.ID == 91) {
				this.model.node.innerHTML = masking._html
			}
			this.moveMaking();
		},
		// 设计师通过上传psd渲染
		uploadpsd(data) {
			if (data.children.length < 1) return
			this.handleCanvasInit();
			this.addMasking();
			this.readerTemplate(data.children)
		},
		// 添加刀版
		addMasking(masking) {
			if(!this.templateInfo.Size.MaskingContent) return;
			let view = this.draw.viewbox();
			let size = this.templateInfo.Size, 
					dpi = size.Unit == 'mm' ? ((size.ResolvingPower || 300) / 25.4) : 1;
			let str = `<svg width="${size.Width * dpi}" height="${size.Height * dpi}" preserveAspectRatio="none"`
			if (!this.model) {
				masking = this.templateInfo.Size.MaskingContent;
				this.model = this.draw.group();
				this.model.style('pointer-events', 'none')
				.data('type', 'Masking')
				masking = masking.replace(/<svg?/, str)
				this.model.svg(masking)
			} else {
				masking = masking.replace(/<svg?/, str)
				this.model.node.innerHTML = masking;
			}
			
			// masking && this.model.first().size(view.width, view.height).attr('preserveAspectRatio', 'none')
		},
		setTemplateTitle () { // 修改模板名称
			let url, params = {
				Name: this.design_title
			},
			data = new FormData();
			// console.log(this.templateInfo)
			data.append('Name', this.design_title)
			if (this.identity == 'Pages'){
				params.DocumentNum = this.templateInfo.DocumentNumber
				url = '/Document'
				data.append('DocumentNum', this.templateInfo.DocumentNumber)
			} else {
				params.TemplateNum = this.templateInfo.TemplateNumber
				url = '/Template'
				data.append('TemplateNum', this.templateInfo.TemplateNumber)
			}
			// console.log(url, 12321132131312)
			this.$axios.put(url, data)
			.then(res => {
				// console.log(res)
			})
		},
		// 保存模板页
		handleSave({ pagenum, str, list, btn,down }) {
			let putObj = {
                    svgcontent: str,
                    jsoncontent: list,
                    PageId: this.CurrentTemplateData[pagenum].PageId,
					Number: pagenum,
					Thumb: '',
					ThumbPath: ''
				};
			// 更新模板页数据接口
			clearTimeout(this.timerPng);
			if (down) {
				clearTimeout(this.timerPng);
				this.clickAllSavePage();
			} else {
				this.$axios.put(this.saveUrl, putObj).then(res => {
					this.isSave = false
					if (res.data.status == 'success') {
						if (btn) {
							this.$message.closeAll()
							this.$message({type: 'success', message: '保存成功',customClass: 'info'})
						}
					} else {
						this.$message.closeAll()
						this.$message({message: '提交状态无法保存',customClass: 'info'})
					}
				}).catch(err => {
					console.error('保存失败' + err.message)
				});
			}
			

		},
		/**
         * 保存模板
         * @param {boolean} btn 点击保存按钮 
         * @param {boolean} togglePage 切换页面
         */
		setSaveTime(btn, togglePage, down) {
			this.isSave = true;
			let pagenum = this.pagenum,
			    { str, list } = this.productionData();
			this.CurrentTemplateData[pagenum].JsonContent = list;
			this.CurrentTemplateData[pagenum].SvgContent = str;
			
			clearTimeout(this.timer);
			if (!this.autosave) return;
			if (btn || togglePage) {
				this.handleSave({ pagenum, str, list, btn, down })
			} else {
				this.timer = setTimeout(() => this.handleSave({ pagenum, str, list }), 2000);
			}
			if (this.svgHistory[this.svgHistory.length - 1] !== list) {
				// console.log(list)
				this.svgHistory.push(list)
			}
		},
		// 撤销回退
		clearCanvas(msg) {
			let drawing = this.$refs.drawing
			this.clearRectSelect()
			// let json = JSON.parse(this.templateHistory[this.templateHistory.length - 1])
			// console.log(json)
			if (msg == "undo") {
				var oldSvgStr = this.svgHistory.pop();
				if (oldSvgStr == undefined) return;
				// console.log(this.svgHistory)
				this.svgRedoList.unshift(oldSvgStr);
				this.CurrentTemplateData[this.pagenum].JsonContent = oldSvgStr
				this.handleLoadTemplate(this.CurrentTemplateData[this.pagenum])
			} else {
				var newSvgStr = this.svgRedoList.shift();

				if (newSvgStr == undefined) return;

				this.svgHistory.push(newSvgStr);
				this.CurrentTemplateData[this.pagenum].JsonContent = newSvgStr
				this.handleLoadTemplate(this.CurrentTemplateData[this.pagenum])
			}
			
		},

		/**
		 * 生成svg字符串和带数据结构的json
		 */
		productionData() {
			let str, node ;
			// console.log(this.templateInfo.Size)
			node = this.draw.node.cloneNode(true);
			node = SVG(node)
			let ratio = this.templateInfo.Size.Height / this.templateInfo.Size.Width;
			node.size(400, 400 * ratio)
			str = node.svg();
			str = str.replace(/<g id="outBloodLine">.*?<\/g>/, '')
			str = str.replace(/<path id="outBloodLine".*?<\/path>/, '')
			str = str.replace(/(http:|https:)*\/\/img.aliyin.com/g, 'http://img.aliyin.com')
			// console.log(str)
			let childs = this.draw.children(),
				list = [];
			try {
				childs.forEach(child => {	
					let type = child.data('type'), eleAttr; 
					if (child.type == 'g' && type && type != 'Masking') {
						let twoGroup, svgGroup, threeGroup;
						twoGroup = child.first();
						svgGroup = twoGroup.first();
						threeGroup = svgGroup.last();
						if (threeGroup.type == 'defs') {
							threeGroup.remove();
							threeGroup = svgGroup.last();
						}
						eleAttr = {
							type,//类型
							eleid: child.attr('id'), // id
							transform: child.attr('transform'), // 位移数据
							className: child.attr("class"), // 类名信息
							opacity: child.attr('opacity') || 1, // 透明度
							key: child.data("obj") || "", // 关键属性
							rotate: twoGroup.data("rotate") || 0, // 旋转
							rotation: twoGroup.attr('transform'),
							width: svgGroup.width(), // 宽度
							height: svgGroup.height(), // 高度
							viewbox: svgGroup.attr('viewBox'),
							reverce: threeGroup.attr('transform'), // 翻转
							_html: svgGroup.node.innerHTML, // 最核心svg内容
							group: child.data('group') || '', // 组合标识信息
							"group-transform": "" // 组合变换数据
						}
						// 需要带数据结构的数组
						// console.log(eleAttr)
						
					} else if (type == 'Masking') {
						eleAttr = {
							type,
							_html: child.node.innerHTML
						}
					}
					eleAttr && list.push(eleAttr);
				});
				
			} catch (err) {
				console.log(err);
			}
			list = JSON.stringify(list); // 转换为json存储
			
			return { str, list };
		},
		getIndex(num) { // 获取当前页的下标
			console.log(this.CurrentTemplateData)
			for(let i = 0, len = this.CurrentTemplateData.length; i < len; i++) {
				if (num == this.CurrentTemplateData[i].Number) 
					return i
			}

		},
		saveSvgHtml(item, index) { //保存svg html 
			let url = this.saveUrl;
			let putObj = {
                    svgcontent: item.SvgContent,
                    jsoncontent: item.JsonContent,
                    PageId: item.PageId,
					Number: index,
					Thumb: item.Thumb,
					ThumbPath: item.ThumbPath
				};
			this.$axios.put(url, putObj).then(res => {
				if (res.data.status == 'success' && res.data.key) {
					item.Thumb = this.$store.state.port.imgBaseUrl + res.data.key + `?v=${new Date().getTime()}`;
					// console.log(res.data)
				} 
			}).catch(err => {
				console.error('保存失败' + err.message)
			});
		},
		/**
		 * 
		 * @param {JsonContent} obj  解析后的json
		 */
		getSvgHtml(obj) { // 根据JsonContent 生成svg Html
			// console.log(obj)
			let size = this.templateInfo.Size, masking = false, masking_html = '';
			let dpi = size.Unit == 'mm' ? ((size.ResolvingPower || 300) / 25.4) : 1,
				width = size.Width * dpi,
				height = size.Height * dpi;
			let _html = `<svg width="${200}" height="${200 * (size.Height / size.Width)}" 
				viewBox="0 0 ${width} ${height}"
				xmlns="http://www.w3.org/2000/svg" 
				version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">`
			obj.forEach(json => {
					if (json.type != 'Masking') {
						if (json.type == 'text') {
							let reg = /(fill|stroke)=rgb\(.*?\)/ig;
							json._html = json._html.replace(reg, function(val) {
								let arr = val.split('=')
								val = arr[0] + '="' + arr[1] + '"'
								return val
							})
							json._html.replace(/(stroke-linecap="round"|stroke-linejoin="round")/ig, '')
						}
						_html += `<g ${json.transform ? 'transform="' + json.transform + '"': ''} opacity="${json.opacity || 1}">
							<g ${json.rotation ? 'transform="' + json.rotation + '"': ''}>
								<svg width="${json.width}" height="${json.height}" 
								${json.viewbox ? 'viewBox="' + json.viewbox + '"': ''}
								preserveAspectRatio="none"
								xmlns="http://www.w3.org/2000/svg" 
								version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
									${json._html || ''}
								</svg>
							</g>
						</g>`
					} else {
						masking = true;
						masking_html = json._html || '';
					}
				})
			if(this.templateInfo.ProductType.TypeId == 38 && this.templateInfo.Size.ID == 91) {
				_html += `
					<g style="pointer-events: none;">
						${masking_html}
					</g>
				`
			} else if (this.templateInfo.Size.MaskingContent) {
				_html += `
					<g style="pointer-events: none;">
						${this.templateInfo.Size.MaskingContent}
					</g>
				`
			}
			
			_html += '</svg>'
			_html = _html.replace(/(http:|https:)*\/\/img.aliyin.com/g, 'http://img.aliyin.com')
			_html = _html.replace(/<g id="outBloodLine">.*?<\/g>/, '')
			_html = _html.replace(/<path id="outBloodLine".*?<\/path>/, '')
			return _html
		},
		/**
		 * @return {page} page 生成后的所有页面数据
		 */
		getSaveData() { // 生成可以保存的数据
			let page = JSON.parse(JSON.stringify(this.CurrentTemplateData))
			// console.log(page)
			page.forEach((item, index) => {
				let _html = this.getSvgHtml(JSON.parse(item.JsonContent))
				page[index].SvgContent = _html;
				this.CurrentTemplateData[index].SvgContent = _html
			})
			return page
		},
		productSvgHtml() { // 生成缩略图和保存
			if (!this.templateInfo) return
			
			let page = this.getSaveData()//JSON.parse(JSON.stringify(this.CurrentTemplateData));
			// console.log(page)
			page.forEach((item, i) => {
				this.productThumbnail(item, i)
				.then(img => {
					item.Thumb = this.$store.state.port.nodeUrl + img+ `?v=${new Date().getTime()}`;
					item.ThumbPath = this.$store.state.port.nodeUrl + img+ `?v=${new Date().getTime()}`;
					this.saveSvgHtml(item, i)
				})
			})
		},
		templatePageReplace(page) { // 左侧选中模板页替换当前页
			console.log(page)
			let pagenum = this.pagenum;
			fetch(this.$store.state.port.ossPath + page.JsonPath)
			.then(response => response.json())
			.then(data => {
				this.CurrentTemplateData[pagenum].JsonContent = JSON.stringify(data);
				this.CurrentTemplateData[pagenum].SvgContent = this.getSvgHtml(data);
				this.CurrentTemplateData[pagenum].Thumb = page.Thumb;
				this.CurrentTemplateData[pagenum].ThumbPath = '';
				// console.log(this.CurrentTemplateData[this.pagenum])
				// this.loadTemplate = JSON.parse(JSON.stringify(this.CurrentTemplateData[this.pagenum]))
				this.handleLoadTemplate(this.CurrentTemplateData[this.pagenum])
				this.putPage(this.CurrentTemplateData[this.pagenum])
			})
            .catch(err => {
                this.$message.closeAll();
                this.$message({type: 'warning', message: '没有JsonPath', customClass: 'info'})
            })
		},
		putPage(obj) { // 保存页
			this.$axios.put(this.saveUrl, obj).then(res => {
				if (res.data.status == 'success' && res.data.key) {
					// item.Thumb = this.$store.state.port.imgBaseUrl + res.data.key + `?v=${new Date().getTime()}`;
					// console.log(res.data)
				} 
			}).catch(err => {
				console.error('保存失败' + err.message)
			});
		},
		/**
		 * 添加模板页面
		 */
		addTemplatePage(page) {
			// console.log(this.CurrentTemplateData.length, this.templateInfo)
			if (this.CurrentTemplateData.length >= (this.PageMode.MaxPages || 20)) {
				this.$message.closeAll();
				this.$message({message: '达到页面上限', type: 'warning', customClass: 'info'});
				return	
			};
			let url = null, obj = null;
			this.setSaveTime(false, true, true);
			this.clearRectSelect();
			let num = this.CurrentTemplateData.length;
			this.pagenum = num;
			
			if (page == undefined) {
				this.handleCanvasInit();
				let { str, list } = this.productionData();
				obj = {
					SvgContent: str,
					JsonContent: list,
					Number: num
				};
				// console.log(obj)
			} else {
				// console.log(page)
				obj = {
					SvgContent: page.SvgContent,
					JsonContent: page.JsonContent,
					Number: num,
					Thumb: page.Thumb,
				}
			}
			
			this.CurrentTemplateData.push(obj)
			this.loadTemplate = this.CurrentTemplateData[num]
			if (this.identity == 'TemplatePages') {
				url = this.$store.state.port.DesignerTemplatePage;
				obj.TemplateNumber = this.templateInfo.TemplateNumber;
			} else {
				url = this.$store.state.port.DocumentPage;
				obj.DocumentNumber = this.templateInfo.DocumentNumber;
			}
			
			// console.log(url, obj)
			this.$axios.post(url, obj)
				.then(res => {
					console.log(res)
					if (res == undefined || res == 'undefined') return console.log('没有添加成功')
					this.CurrentTemplateData[num].PageId = res.data.PageId
				}).catch(err => {
					console.log(err);
				});
		},
		/**
		 * 子组件触发删除某页
		 */
		delTemplatePage(i) {
			this.clearRectSelect();
			// console.log(this.CurrentTemplateData[i])
			let PageId = this.CurrentTemplateData[i].PageId;

			let formdata = new FormData();
			let name = "",
				url = this.saveUrl;
			if (this.identity == 'TemplatePages') {
				name = "templatepageid";
			} else {
				name = "documentpageid";
			}
			formdata.append(name, PageId);
			this.$axios.delete(url, {
				data: formdata
			}).then(res => {
				this.CurrentTemplateData.splice(i, 1);
				// console.log(this.pagenum, i)
				if (this.pagenum == i) {
					this.pagenum = i == 0 ? 0 : i - 1
					this.loadTemplate = this.CurrentTemplateData[this.pagenum] 
				} else if (this.pagenum > i) {
					this.pagenum--;
					this.loadTemplate = this.CurrentTemplateData[this.pagenum] 
				}
			});
		},
		// right-list 复制page
		copyPage(index) {
			let page = this.CurrentTemplateData[index]
			this.addTemplatePage(page)
		},
		/**
		 * 子组件切换页面
		 */
		toggleTemplatePage(i) {
			this.clearRectSelect();
			this.setSaveTime(false, true, false);
			this.pagenum = i;
			this.loadTemplate = this.CurrentTemplateData[i];
			this.svgHistory = []
			this.svgRedoList = []
		},
		/**
		 * 调换page页面的顺序
		 */
		handleReversing(pos) {
			// console.log(pos)
			let page = JSON.parse(JSON.stringify(this.CurrentTemplateData[pos.index])),
				oldPage = JSON.parse(JSON.stringify(this.CurrentTemplateData[pos.oldindex]));
			// console.log(page, oldPage)
			let arr = ['JsonContent', 'SvgContent', 'Thumb', 'JsonPath'];
			arr.forEach((item) => {
				this.CurrentTemplateData[pos.index][item] = oldPage[item];
				this.CurrentTemplateData[pos.oldindex][item] = page[item];
			})
			this.pagenum = pos.index;
			this.loadTemplate = this.CurrentTemplateData[pos.index]
			this.putPage(this.CurrentTemplateData[pos.index])
			this.putPage(this.CurrentTemplateData[pos.oldindex])
		},
		getDragAndDropBox(obj) { // 获取拖拽元素的位置大小
			this.dragAndDrop = obj;
			this.dragAndDrop.display = 'none';
			window.addEventListener('mousemove', this.setDragMove)
			window.addEventListener('mouseup', this.setDragUp)
		},
		setDragMove(e) {
			let x = e.clientX - this.dragAndDrop.ex,
				y = e.clientY - this.dragAndDrop.ey;
			if (x < 5 && y < 5) return;
			this.dragAndDrop.ele.style.opacity = 0;
			this.dragAndDrop.display = 'block';
			this.dragAndDrop.left = this.dragAndDrop.ox + x;
			this.dragAndDrop.top = this.dragAndDrop.oy + y;
		},
		setDragUp(e) {
			window.removeEventListener('mousemove', this.setDragMove)
			window.removeEventListener('mouseup', this.setDragUp)
			if (!this.dragAndDrop) return
			
			if(this.dragAndDrop.enter) return (()=>{
				this.dragAndDrop.ele.style.opacity = 1;
				this.handleAdd(this.dragAndDrop);
			})()
			this.dragAndDrop.left = this.dragAndDrop.ox;
			this.dragAndDrop.top = this.dragAndDrop.oy;
			this.dragAndDrop.transform = 'transition: all .3s;'
			setTimeout(()=> {
				this.dragAndDrop && (this.dragAndDrop.ele.style.opacity = 1);
				this.dragAndDrop = null;
			}, 300)
			
		},
		/**
		 * copy选中素材
		 */
		setCopyBox(obj) {
			let {result, x, y, w, h, src, cx, cy, ele} = obj;
			this.copyBox.totalWidth = this.draw.width() * .2;
			this.copyBox.x = x;
			this.copyBox.y = y;
            this.copyBox.ox = x;
            this.copyBox.oy = y;
            this.copyBox.ow = w;
            this.copyBox.oh = h;
			this.copyBox.width = w;
			this.copyBox.height = h;
            this.copyBox.ele = ele;
            this.copyBox.transform = 'none';
			this.copyBox.result = result;
			this.copyBox.src = src;
			this.copyBox.ratio = h / w;
			this.copyBox._cx = this.copyBox.cx = cx;
			this.copyBox._cy = this.copyBox.cy = cy;
			document.addEventListener("mousemove", this.copyMove);
			document.addEventListener("mouseup", this.copyUp);
            if (this.copyBox.result.type == 'image') {
                this.adsorbSrc = this.copyBox.result.src.replace('!w300.src', '!w800.src');
            }
		},

		// 复制移动事件
		copyMove(e) {
			if (!this.copyBox.display && e.clientX - this.copyBox.cx < 2 && e.clientY - this.copyBox.cy < 2) return
			
			let x = e.clientX - this.copyBox._cx;
			let y = e.clientY - this.copyBox._cy;
			this.copyBox._cx = e.clientX;
			this.copyBox._cy = e.clientY;
			if (e.clientX > 390) {
				this.copyBox.width = this.copyBox.totalWidth
				this.copyBox.height = this.copyBox.width * this.copyBox.ratio;

				this.copyBox.x = e.clientX - this.copyBox.width / 2;
				this.copyBox.y = e.clientY - this.copyBox.height / 2;
			} else {
                if (this.copyBox.width < this.copyBox.totalWidth){
                    this.copyBox.width += x ;
                    this.copyBox.height += x * this.copyBox.ratio;
                    
                    this.copyBox.x = e.clientX - this.copyBox.width / 2;
                    this.copyBox.y = e.clientY - this.copyBox.height / 2;
                } else {
                    this.copyBox.x += x;
                    this.copyBox.y += y;
                }
            }
			this.copyBox.ele.style.opacity = 0;
			this.copyBox.display = true;
		},
		// 移除事件
		copyUp(e) {
			document.removeEventListener("mousemove", this.copyMove);
			document.removeEventListener("mouseup", this.copyUp);
			if (!this.copyBox.display) return
			let box = this.draw.rbox();
			if (
				e.clientX > box.x &&
				e.clientX < box.x2 &&
				e.clientY > box.y &&
				e.clientY < box.y2
			) {
                this.copyBox.ele.style.opacity = 1;
				let box = this.draw.rbox();
				let zoom = this.draw.viewbox().zoom;
				let x = (this.copyBox.x - box.x) / zoom;
				let y = (this.copyBox.y - box.y) / zoom;
				let w = this.copyBox.width  / zoom;
				this.handleAdd(this.copyBox.result, {x,y,w});
				this.copyBox.result.type == 'image' ? '' : (this.copyBox.display = false)
				this.setSaveTime();
			} else {
                this.copyBox.x = this.copyBox.ox
                this.copyBox.y = this.copyBox.oy
                this.copyBox.width = this.copyBox.ow
                this.copyBox.height = this.copyBox.oh
                this.copyBox.transform = ' all .3s'
                setTimeout(()=>{
                    this.copyBox.ele.style.opacity = 1;
                    this.copyBox.display = false
                }, 300)
			}
			
		},
		getParentBox () { // 获取画布在屏幕中的位置
			let drbox = this.draw.rbox(),
				zoom = this.draw.viewbox().zoom,
				width = this.$refs.editorSvg.offsetWidth,
				height = this.$refs.editorSvg.offsetHeight,
				left = this.toggle ? 390 : 60,
				top = 50, 
				cx = (width / 2 + left - drbox.x) / zoom, 
				cy = (height / 2 + top - drbox.y) / zoom;
			return {cx, cy}
		},
		/*  添加元素 */
		handleAdd(result, obj) {
			// console.log(result, obj)
			let src = result.src;
			switch (result.type) {
				case 'text': 
					let drbox = this.draw.rbox(), 
						zoom = this.draw.viewbox().zoom,
						textObj = {
							key: result.key,
							x: (result.left - drbox.x) / zoom,
							y: (result.top - drbox.y) / zoom,
							w: result.width / zoom
						};
					result.ele.style.opacity = 1;
					this.addCreateText(textObj)
				break;
				case 'image':
					 src = result.native ? src.replace(/!w300.src/ig, '') 
					 	: src.replace(/!w300.src/ig, '!w800.src')
					this.addCreateImage(src, obj, result.native)
					break;
				case 'svg':
					this.addCreateSvg(src, obj, result.native);
					this.copyBox.display = false
					break;
				case 'adsorb':
					this.addCreateAdsorb(src, obj);
					break;
			}
			this.moveMaking();
		}, 
		addCreateText(obj) { // 创文字
			this.textToPath(obj.key, obj)
		},
		/**根据需要宽高,求出图片需要设置的宽高 */
		getImageRatio (load, TrueBox, ratio) {
			let w = null, h = null;
				if (load.height < TrueBox.height && load.width < TrueBox.width || load.height > TrueBox.height && load.width > TrueBox.width) {
					// 1. 加载图片比画布小 或都比画布大
					// console.log('加载图片比画布小')
					let _w = load.width / TrueBox.width;
					let _h = load.height / TrueBox.height;
					if (_w > _h) {
						h = TrueBox.height;
						w = h / ratio
					} else {
						w = TrueBox.width;
						h = w * ratio;
					}
				} else {
					// 3. 某一边比画布大
					// console.log('某一边比画布大')
					if (load.height > TrueBox.height) {
						w = TrueBox.width;
						h = w * ratio;
					} else {
						h = TrueBox.height;
						w = h / ratio;
					}
				}
			return {w, h}
		},
		// 一行文字变为吸附框
		textToAdsorb () {
			if (this.elementChecked.data('type') != 'text') return;
			let path = SVG.adopt(this.elementChecked.node.querySelector('path')),
				transform = path.parent().attr('transform');
			console.log(transform)
			
			path.attr('transform', transform)
			let {first, two, nested, three} = this.nodeInit();
			let clipId = "clip_" + new Date().getTime();
			let _html = `
				<g>
					<clipPath id="${clipId}"> 
						${path.svg()}
					</clipPath>
					<g clip-path="url(#${clipId})">
					<image xlink:href="http://img.aliyin.com/materials/201905/1eaa6fa2ff3b440986522bb825c1a65e.png!w800.src" width="400" height="200"></image>
					</g>
				</g>
				`
			three.svg(_html)
			
		},
		// 创建吸附框
		addCreateAdsorb (src, obj) {
			let zoom = this.draw.viewbox().zoom, 
				firstGroup = this.draw.group(), 
				twoGroup = firstGroup.group(), 
				svgParent = twoGroup.nested(), 
				threeGroup = svgParent.group();
			firstGroup.data({type: 'adsorb', obj: {src: '//img.aliyin.com/materials/201905/5f22ccfc2bb84a6489cdaf11e9fb00b5.png'}})
            .addClass('hoveMove').draggable().on('dragend', () => this.setSaveTime())
			firstGroup.on('click', ()=> this.handleActive(firstGroup.id()))
			.on('mouseenter', this.handleAdsorbEnter)
			.on('mouseup', this.handleAdsorbUp)
			.on('mouseleave', this.handleAdsorbLeave)
			.on("mousedown", () => this.elemDown(firstGroup.id()))
			twoGroup.data('rotate', 0)
			threeGroup.svg(src)
			
			let svg = threeGroup.node.querySelector('svg').getAttribute('viewBox'),
                viewbox = svg.split(' '),
                svgViewbox = {
                    width: viewbox[2],
                    height: viewbox[3]
                },
                svgRatio = svgViewbox.height / svgViewbox.width;
			let w = obj ? obj.w : (this.draw.width() * .2 / zoom);
			svgParent.size(w , w * svgRatio ).viewbox(0, 0, svgViewbox.width, svgViewbox.height).style('overflow', '');
			if (!obj) {
				let {cx, cy } = this.getParentBox()
				firstGroup.move(cx - w/2, cy - w * svgRatio /2)
			} else {
				firstGroup.attr('transform', `translate(${obj.x},${obj.y})`)
			}
			let oldimage = threeGroup.node.querySelectorAll('image'), 
				parent = null;
			this.copyBox.display = false
			oldimage.forEach(img => {
				if (img.width.animVal.value > 5) {
					parent = img.parentNode
				} 
			})
			let image = this.draw.image('//img.aliyin.com/materials/201905/5f22ccfc2bb84a6489cdaf11e9fb00b5.png')
           
			image.loaded(load => {
				let ratio = load.height / load.width;
				let {w , h} = this.getImageRatio(load, svgViewbox, ratio);
				image.size(w, h).center(svgViewbox.width / 2, svgViewbox.height / 2);
                parent.innerHTML = image.node.outerHTML;
                image.remove();
			})
			

		},
		// 携带图片进入吸附框时
		handleAdsorbEnter (e, ele) {
            if (!this.adsorbSrc || e.buttons != 1) return;
            this.adsorbOff = true;
            if (ele) {
                if (this.copyBox.display) {
                    this.$refs.copy.style.opacity = .5;
                } else {
                    let eleDown = this.draw.get(this.elemIndex)
                    eleDown.opacity(.5);
                }
            }
			let group = ele || SVG.get(e.target.id),
                svgParent = group.first().first(),
                svgViewbox = svgParent.viewbox();
			let old = svgParent.node.querySelector('image'),
                image = SVG.adopt(old),
                oldsrc = old.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
            image.loaded(load => {
                let ratio = load.height / load.width;
				let {w , h} = this.getImageRatio(load, svgViewbox, ratio);
				image.size(w, h).center(svgViewbox.width / 2, svgViewbox.height / 2);
            })
            image.load(this.adsorbSrc)
            group.data({obj: {src: oldsrc}})
			
		},
		// 携带图片离开吸附框
		handleAdsorbLeave(e, ele) {
            if (!this.adsorbSrc || e.buttons != 1) return;
            if (ele) {
                if (this.copyBox.display) {
                     this.$refs.copy.style.opacity = 1;
                } else {
                    let eleDown = this.draw.get(this.elemIndex)
                    eleDown.opacity(1);
                }
            }
            this.adsorbOff = false;
			let group = ele || SVG.get(e.target.id),
                src = group.data('obj').src,
                svgParent = group.first().first(),
                svgViewbox = svgParent.viewbox();
			let old = svgParent.node.querySelector('image'),
                image = SVG.adopt(old);
			image.loaded(load => {
                let ratio = load.height / load.width;
				let {w , h} = this.getImageRatio(load, svgViewbox, ratio);
				image.size(w, h).center(svgViewbox.width / 2, svgViewbox.height / 2);
            })
            image.load(src)
		
		},
		// 携带图片松开鼠标时
		handleAdsorbUp (e, ele) {
			if (!this.adsorbSrc || !this.adsorbOff) return;
			let group = ele || SVG.get(e.currentTarget.id),
                src = this.adsorbSrc;
            group.data({obj: {src}});
            this.adsorbSrc = '';
            if (ele && !this.copyBox.display) {
                let eleDown = this.draw.get(this.elemIndex)
                eleDown.remove();
            } else {
                this.$refs.copy.style.opacity = 1;
                this.copyBox.ele && (this.copyBox.ele.style.opacity = 1);
                this.copyBox.display = false;
            }
			this.setSaveTime();
		},
		// 吸附框裁剪
		adsorbClip () {
			this.isClipAdsorb = true;
			let {x, y, width, height} = this.getTrueElemChecked(this.elementChecked);
			let image = this.elementChecked.node.querySelector('image');
			this.backgroundImageUrl = image.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || image.getAttribute('href')
			
			let clipArea = this.$refs.clipArea;
			this.codeBox.x = x; 
			this.codeBox.y = y; 
			this.codeBox.width = width; 
			this.codeBox.height = height;
			
		},
		/**  选中需要裁剪图片元素真实大小和位置*/
		getTrueElemChecked (elem) {
			let x, y, width, height;
			let zoom = this.draw.viewbox().zoom;
			let svg = elem.node.querySelector('svg')
				svg = SVG.get(svg.id)
			let image = elem.node.querySelector('image')
				image.setAttribute('id', 'img_' + new Date().getTime())
				image = SVG.get(image.id)
			let grbox = image.rbox();
			let svgzoom = svg.viewbox().zoom // 内部嵌套缩放比
			let imgBbox = image.bbox();
			width = imgBbox.width * svgzoom * zoom
			height = imgBbox.height * svgzoom * zoom
			// 图片的中心点减去图片的一半
			x = grbox.cx - imgBbox.width * svgzoom * zoom / 2
			y = grbox.cy - imgBbox.height * svgzoom * zoom / 2
			return {x, y, width, height}
		},
		/* 文字生成 ↓*/
		// 后台生成path方法1 
		productPath(obj) {
			this.textProduction = true;
			// this.wsServer && this.wsServer.send(JSON.stringify(obj))
			// webserver
			return new Promise((resolve, reject) => {
				// this.$store.state.nodeUrl/text2path/pro
				this.$axios.post( this.$store.state.port.nodeUrl + "/textToPath/pro", obj)
                .then(res => {
                    this.textProduction = false;
                    resolve(res.data);
                }).catch(err => reject(err))
			})
		},
		countText(obj) { // 计算文字的个数
			let span = document.createElement('span'), 
				zoom = this.draw.viewbox().zoom,
				totalWidth = obj.width * zoom,
				size = obj.size * zoom,
				arr = [];
			document.body.append(span)
			span.style.textAlign = obj.align;
			span.style.fontFamily = obj.family;
			span.style.fontSize = size + 'px';
			span.style.wordBreak = 'break-all';
			span.style.letterSpacing = obj.spacing + 'em';
			span.style.lineHeight = obj.line;
			span.style.padding = 0;
			span.margin = 0;
			return new Promise((resolve, reject) => {
				obj.arrList.forEach(text => {
					let str = '', totalW = 0;
					span.innerHTML = ''
					Array.from(text).forEach(s => {
						if (s == ' ') {
							span.innerHTML += '&#32;'//'&ensp;'  
						} else {
							span.innerHTML += s;
						}
						let w = span.offsetWidth
						// console.log(w, totalWidth)
						if (w > totalWidth) {
							arr.push(str)
							str = s;
							span.innerText = s
						} else {
							str += s
						}
					})
					arr.push(str)
					obj.arrList = arr;
					resolve(obj)
				})
				document.body.removeChild(span)
			})
		},
        // 改变文字
		changePath(obj, type = false) {
			
			let zoom = this.draw.viewbox().zoom,
				elem = this.textElem,
				twoGroup = elem.first(),
				parent = twoGroup.first(),
				threeGroup = parent.last(),
				rotate = twoGroup.data('rotate'),
				box = this.$refs.box,
				data = elem.data('obj'),
				width = parent.width();
				// console.log(obj, width)
				threeGroup.clear()
				let fourGroup = threeGroup.group();
				fourGroup.svg(obj.svg);
				let resgroup = this.draw.group().svg(obj.svg),
					resbox = resgroup.bbox(),
					height = resbox.height;
				fourGroup.y(-resbox.y)
				resgroup.remove();
				fourGroup.children().forEach(group => {
					let transform = group.transform()
					switch (data.align) {
						case 'left':
						break;
						case 'center':
							group.x(transform.transformedX + (width - obj.width)/2)
						break;
						case 'right':
							group.x(transform.transformedX + (width - obj.width))
						break;
					}
				})
			let ratio = height / width;
			parent.data({ratio: ratio});
			twoGroup.attr('transform', `rotate(${rotate},${width / 2},${height / 2})`)
			parent.size(this.codeBox.width / zoom, height).viewbox(0, 0, this.codeBox.width / zoom, height);
			this.codeBox.height = height * zoom;
			data.scale = data.size / height;
			elem.data({obj: data})
			this.textElem && this.textElem.style('display', 'block')
			this.clearRectSelect()
			this.codeBox.isShow = false
			this.codeTypeTool = '';
			// setTimeout(() => this.handleActive(elem.id()), 100)
			this.setSaveTime()
		},
		// 文字生成path方法2
		textToPath (size = 30, data) {
			let zoom = this.draw.viewbox().zoom, dbox = this.draw.rbox(this.draw);
			let obj = {
				family: this.familyList[0].FontCairoName || '思源黑体-常规',
				fontId: 0,
                align: 'left',
				size: size / zoom,
				width: (data && data.width) || (200 / zoom),
				arrList: ['双击修改文字'],
				bold: 0,
				itailic: 0, 
				underline: 0,
				spacing: 0,
				line: 1.2,
				fill: '#000',
				scale: 1
			}
			let {first, two, nested, three} = this.nodeInit();
				first.data({type: 'text',obj: obj})
				nested.size(obj.width, obj.size)
				.viewbox(0, 0, obj.width, obj.size)
			let {cx, cy } = this.getParentBox();
				// console.log(cx - obj.width / 2, cy - obj.size / 2)
				// console.log(dbox.cx - obj.width / 2, dbox.cy - obj.size / 2)
				if (data && data.x) {
					first.move(data.x, data.y);
				} else {
					first.center(cx - obj.width / 2, cy - obj.size / 2);
				}
				this.dragAndDrop.ele.style.opacity = 1;
				this.dragAndDrop = null;
				this.handleActive(first.id())
            this.productPath(obj).then(result => {
                let str = result.svg,
					width = result.width,
					fourGroup = three.group(),
					rect = nested.rect('100%', '100%').opacity(0);
				three.before(rect);
				three.attr({fill: '#000',stroke: '#000'});

				fourGroup.svg(str)
				let threebox = fourGroup.bbox();
				fourGroup.y(-threebox.y)

				obj.scale = obj.size / threebox.height;
				let ratio = threebox.height / width;
				first.data({obj: obj})

				nested.size(obj.width, threebox.height)
				.viewbox(0, 0, obj.width, threebox.height).data({ ratio })
				this.moveMaking();
				this.handleActive(first.id())
				this.setSaveTime()
			})
		},
		// 添加文字
		addFontText(size) {
			this.clearRectSelect();
			this.textToPath(size)
			
		},
		/**初始化 创建元素容器
		 * @return {Object} first, two, nested, three 创建的元素
		 */
		nodeInit() { 
			let first = this.draw.group(),
				two = first.group(),
				nested = two.nested(),
				three = nested.group(),
				id = new Date().getTime();
			first.id(id).addClass('hoveMove')
			.on('click', () => this.handleActive(id))
			.on('mousedown', () => this.elemDown(id));
			first.draggable().on('dragend', () => this.setSaveTime())
			two.data('rotate', 0)
			nested.node.removeAttribute('style') //style('overflow','')
			return {
				first, two, nested, three
			}
		},
		/** 获取单个元素的存储属性
		 * @param {Object} elem svg包装的元素
		 */
		getSingleElementAttr(elem) { 
			let first = elem,
				two = elem.first(),
				node = two.first(),
				three = node.last();
			let obj = {
				type: first.data('type'), //类型
				eleid: first.id(), // id
				transform: first.attr('transform'), // 位移数据
				className: first.attr('class'), // 类名信息
				opacity: first.attr('opacity'), // 透明度
				key: first.data('obj'), // 关键属性
				rotate: two.data('rotate'), // 旋转
				rotation: two.attr('transform'),
				width: node.width(), // 宽度
				height: node.height(), // 高度
				viewbox: node.attr('viewBox'),
				reverce: three.attr('transform'), // 翻转
				_html: node.node.innerHTML, // 最核心svg内容
				group: first.data('group') || '', // 组合标识信息
				"group-transform": "" // 组合变换数据
			};
			return obj
		},
		/**渲染单个元素
		 * @param {Object} item 元素数据
		 */
		readerSingleElement(item, i = 100) {
			if (item.type == undefined) return;
			item.eleid = new Date().getTime() + i;
			let draw = this.draw,
				firstGroup = draw.group(),
				twoGroup = firstGroup.group(),
				svgGroup = twoGroup.nested();
			firstGroup.attr({
				transform: item.transform,
				id: item.eleid,
				class: item.className,
				opacity: item.opacity
			}).data({
				type: item.type,
				obj: item.key,
				group: item.group
			})
			if (item.type == 'background') {
				firstGroup.node.onmousedown = event => {
					// event.stopPropagation() 
					this.backgroundClick(item.eleid)
				}
			} else if (item.type == 'adsorb') {
				firstGroup.on("mouseenter", this.handleAdsorbEnter);
				firstGroup.on("mouseup", this.handleAdsorbUp);
				firstGroup.on('mouseleave', this.handleAdsorbLeave);
				firstGroup.on("click", () => this.handleActive(item.eleid));
				firstGroup.on("mousedown", () => this.elemDown(item.eleid))
			} else {
				firstGroup.on("click", () => this.handleActive(item.eleid))
				firstGroup.on("mousedown", () => this.elemDown(item.eleid))
			};
			if (item.className == "hoveMove" && item.group == '') firstGroup.draggable().on('dragend', () => this.setSaveTime())
			else firstGroup.draggable(false)
			twoGroup.data({
				rotate: item.rotate
			}).attr('transform', item.rotation);
			svgGroup.size(item.width, item.height).attr({'viewBox': item.viewbox, preserveAspectRatio: 'none'}).style('overflow', '')
			svgGroup.svg(item.str||item._html)//.attr('transform', item.reverse);
			return firstGroup;
		},
		inputSubmit(e) {// 显示文字输入框
			this.codeTypeTool = 'text';
			this.elementChecked.style('display', 'none');
			let box = this.$refs.box;
			this.observer = new MutationObserver(() => {
				let textHeight = this.$refs.textHeight;
				if (!textHeight) {
					this.observer = null;
					return
				};
				let height = textHeight.offsetHeight;
				box['style']['height'] = height + 'px'
			})
			this.observer.observe(box, {
				subtree: true,
				characterData: true,
				childList: true,  
				attributes: true
			})
		},
		// 失去焦点请求
		inputSetPath(e) {
			let zoom = this.draw.viewbox().zoom,
			    obj = this.elementChecked.data("obj"),
				textHeight = this.$refs.textHeight,
				family = textHeight.style['font-family'].replace(/"/g,''),
				childs = textHeight.childNodes,
				width = textHeight.offsetWidth / zoom,
				spacing = textHeight['style']['letter-spacing'].split('em')[0],
				line = textHeight['style']['line-height'],
				fill = textHeight['style']['color'],
				textArr = [],text = [];
			let oldObj = JSON.stringify(obj);
			childs.forEach(child => {
				let str = child.innerText
				if (str == undefined) str = child.data
				text.push(str)
				textArr.push(str)
			})
			obj.family = family;
			obj.width = width;
			obj.height = textHeight.offsetHeight / zoom;
			obj.fill = fill;
			obj.spacing = spacing;
			obj.line = line;
			obj.arrList = textArr;

			if (oldObj == JSON.stringify(obj)) {
				this.codeBox.isShow = false
				this.codeTypeTool = '';
				this.textElem && this.textElem.style('display', 'block')
				this.clearRectSelect()
				return
			}
			this.elementChecked.data({obj: obj});
			this.countText(obj).then(data => {
				this.productPath(data).then(this.changePath)
			})
			// this.svgParent.size(obj.width, obj.height).viewbox(0, 0,obj.width, obj.height)
		},
		/* 文字生成 ↑*/

		/* 创建svg元素 */
		addCreateSvg(str, obj, native) {
			this.clearRectSelect();
			// 1. 获取SVG包裹的画布
			let draw = this.draw, 
				zoom = this.draw.viewbox().zoom,
				size = this.templateInfo.Size;;
			let dbox = this.draw.rbox(this.draw)
			// 2.初始id
			let ele = new Date().getTime();
			// 3.填充数据

			let firstGroup = draw.group(),
				twoGroup = firstGroup.group(),
				svg = twoGroup.nested(),
				threeGroup = svg.group();
			firstGroup.draggable().on('dragend', () => this.setSaveTime());
			firstGroup.data({
					type: 'svg',
					obj: obj
				}).attr({
					'id': ele,
					class: 'hoveMove'
				})
				.on('click', () => this.handleActive(ele))
				.on("mousedown", () => this.elemDown(ele))
			twoGroup.data('rotate', 0)
			svg.style('overflow', '')
			threeGroup.svg(str)
			let strBox = threeGroup.node.querySelector('svg');
			// console.log(strBox,strBox.viewbox)
			let gbox = firstGroup.rbox(this.draw);
			let ratio = (gbox.height || 15) / (gbox.width || 15);
			let w = obj ? obj.w : (this.draw.width() * .2 / zoom);
			// if (native) w = strBox.width;
			svg.size(w, w * ratio).viewbox(0, 0, w, w * ratio).attr("preserveAspectRatio", "none").data({
				ratio: ratio
			})
			let rect = svg.rect('100%', '100%').opacity(0)
			threeGroup.before(rect)
			let x = dbox.cx - gbox.w / 2
			let y = dbox.cy - gbox.h / 2

			if (!obj) {
				let {cx, cy } = this.getParentBox()
					firstGroup.center(cx, cy )
			} else {
				firstGroup.attr('transform', `translate(${obj.x},${obj.y})`)
			}
			
			this.svgList.push(firstGroup)
			this.setSaveTime();
		},
		/* 背景图片 和背景颜色 激活背景图片可以处理 ↓*/
		// 点击背景
		backgroundClick(id) {
			let group = SVG.get(id);
			if (this.codeTypeTool == 'text') {
				this.inputSetPath()
				return
			}
			// || this.toolType == 'group'
			if (group.data('obj') == 'rect') {
				this.clearRectSelect();
				return
			};
			this.toolShow.father = true;
			this.toolType = 'background'
			this.elementChecked = group;
			this.twoGroup = group.first();
			this.svgParent = this.twoGroup.first();
			this.threeGroup = this.svgParent.first();
			this.codeBox.isShow = false;
		},
		// 改变背景
		handleChangeBackground(src) {
			let background = this.draw.first() || ''
			let eleid = new Date().getTime();
			let group1 = this.draw.group();
			let group2 = group1.group();
			let nested = group2.nested();
			let group3 = nested.group();
			let viewbox = this.draw.viewbox();
			group1.data({type: "background"}).attr("id", eleid);
			

			background == '' ? '' : background.before(group1);
			if (background && background.data("type") === "background") background.remove();
			if (src.type === "image") {
				group3.image(src.msg).loaded(load => {
					let ratio = load.height / load.width;
					let w = null,
						h = null;
					if (load.height < viewbox.height && load.width < viewbox.width || load.height > viewbox.height && load.width > viewbox.width) {
						// 1. 加载图片比画布小 或都比画布大
						// console.log('加载图片比画布小')
						let _w = load.width / viewbox.width;
						let _h = load.height / viewbox.height;
						if (_w > _h) {
							h = viewbox.height;
							w = h / ratio
						} else {
							w = viewbox.width;
							h = w * ratio;
						}
					} else {
						// 3. 某一边比画布大
						// console.log('某一边比画布大')
						if (load.height > viewbox.height) {
							w = viewbox.width;
							h = w * ratio;
						} else {
							h = viewbox.height;
							w = h / ratio;
						}
					}
					nested.size(w, h);
					nested.viewbox(0, 0, load.width, load.height);
					nested
						.style("overflow", "")
						.data({
							ratio: ratio
						})
						.attr("preserveAspectRatio", "none");
					group1.center(
						this.draw.rbox(this.draw).cx,
						this.draw.rbox(this.draw).cy
					);
					this.setSaveTime();
				});
				group1.data({
					obj: "image"
				})
				.on("mousedown", (event) => {
					// event.stopPropagation() 
					this.backgroundClick(eleid)
				});
			} else if (src.type === "svg") {
				group3.svg(src.msg);
				group1.data({
					obj: "svg"
				})
				.on("mousedown", (event) => {
					// event.stopPropagation() 
					this.backgroundClick(eleid)
				});
				this.setSaveTime();
			} else {
				this.fontColorSelect = src.background
				nested.style('overflow', '')
				nested.size(viewbox.width, viewbox.height).viewbox(0,0,viewbox.width, viewbox.height)
				group3.rect('100%', '100%').fill(src.background);
				group1.data({ obj: "rect" })
				.on("mousedown", (event) => {
					// event.stopPropagation() 
					this.backgroundClick(eleid)
				});
				this.toolType = ''
				this.toolShow.father = false;
				!this.isSave && this.setSaveTime();
			}
			this.toolShow.show = false
		},
		// 激活背景图片
		handleActiveBackground() {
			let image = this.threeGroup.node.querySelector('image');
			this.backgroundImageUrl = image.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || image.getAttribute('href');
			this.backgroundShow = true;
			this.getActiveSvgAttr(this.elementChecked);
		},
		/* 背景图片 和背景颜色 激活背景图片可以处理 ↑ */

		/**
		 * 	创建svg的image标签,并添加到页面的处理方法
		 *  @param src 图片的URI
		 */
		addCreateImage(src, obj, native) {
			this.clearRectSelect();
			// 1. 获取SVG包裹的画布
			let draw = this.draw, 
				zoom = this.draw.viewbox().zoom,
				size = this.templateInfo.Size;
			let dbox = this.draw.rbox(this.draw)
			// 2.初始id
			let ele = new Date().getTime();
			// 3.填充数据
			let firstGroup = draw.group();
			let twoGroup = firstGroup.group();
			let svg = twoGroup.nested();
			let threeGroup = svg.group();
			firstGroup.data({
					type: "image"
				}).attr({
					"id": ele,
					class: 'hoveMove',
				}).data({obj: {src: src}})
				.on("click", () => this.handleActive(ele))
				.on("mousedown", () => this.elemDown(ele));
			firstGroup.draggable().on('dragend', () => this.setSaveTime());
			twoGroup.data('rotate', 0)
			// 创建获取的图片
			let w = obj ? obj.w : (this.draw.width() * .2 / zoom);
			return new Promise((resolve, reject) => {
				let image = threeGroup.image(src).loaded(load => {
					this.copyBox.display = false
					let ratio = load.height / load.width;
					if (native) w = load.width
					image.size(w, w * ratio);
					svg.size(w, w * ratio).viewbox(0, 0, w, w * ratio).attr({
						"preserveAspectRatio": "none",
						style: ''
					}).data({
						ratio: ratio
					});
					if (!obj) {
						let {cx, cy } = this.getParentBox()
						firstGroup.move(cx - w / 2 , cy - w * ratio / 2)
					} else {
						firstGroup.attr('transform', `translate(${obj.x},${obj.y})`)
					}
					
					this.setSaveTime();
					resolve(firstGroup)
				});
			})

		},

		
		/* 文字设置 start */
		setText(type) {
			
			switch (type) {
				case 'size':
				case 'spacing':
					this.inputSubmit()
				break;
			}
		},
		// 1. 字体设置
		handleCommand(item, i) {
			// this.textProduction = true
			let textDefault = this.$refs.textDefault;
			textDefault.children[0].src = this.$store.state.port.imgBaseUrl + item.FontThumb
			let obj = this.elementChecked.data("obj");
			// obj.family = item.FontCairoName;
			// console.log(item)
			this.textObj.family = item.FontCairoName;
			obj.fontId = i 
			this.elementChecked.data({obj})
			// this.countText(obj).then(data => {
			// 	this.productPath(data).then(this.changePath)
			// })
			if (!item.download) {
				fetch(`https://aliyinsrc.oss-cn-shenzhen.aliyuncs.com/${item.FontPath}`)
				.then(response => response.text())
				.then(res => {item.download = true})
			}
			this.tool_box = ''
		},
		// 2.文字样式设置 (斜体, 下划线)
		handleTextStyle(style) {
			this.textObj[style] = this.textObj[style] == 1 ? 0 : 1;
			let obj = this.elementChecked.data("obj");
			obj[style] = this.textObj[style];
			this.elementChecked.data({obj})
			this.countText(obj).then(data => {
				this.productPath(data).then(this.changePath)
			})
		},
		// 2.1 字体粗体
		handleTextBold(val) {
			let obj = this.elementChecked.data("obj");
			// this.textObj.bold = this.textObj.bold == 1? 0 : 1;
			// console.log(val, val / 100 * 2)
			obj.bold = val / 100 * 2
			this.elementChecked.data({obj});
			this.countText(obj).then(data => {
				this.productPath(data).then(this.changePath)
			})
		},
		// 3.透明度设置
		formatTooltip(val) {
			if (this.group.set) {
				this.group.set.opacity(val / 100)
			} else {
				this.elementChecked && this.elementChecked.opacity(val / 100);
			}
			return val;
		},
		// 4. 字间距设置
		handleSpacing(val) {
			this.textObj.spacing = val / 1000;
			let obj = this.elementChecked.data("obj");
			obj.spacing = val / 1000;
			this.elementChecked.data({ obj: obj });
		},
		// 5.行间距设置
		handleLine(val) {
			this.textObj.line = 1 + val / 1000;
			let obj = this.elementChecked.data("obj");
			obj.line = 1 + val / 1000;
			this.elementChecked.data({obj});
		},
		// 6.字体大小设置
		handleSize(val) {
			if (val == '') return this.tool_box = ''
			if (this.textObj.size <= 16) this.textObj.size = 16
			let sizeList = this.$refs.sizeList;
			let obj = this.elementChecked.data("obj");
			let zoom = this.draw.viewbox().zoom;
			if (val == 'up') {
				this.textObj.size++
			} else if (val == 'down') {
				this.textObj.size--
			} else {
				this.textObj.size = val
			}
			
			obj.size = this.textObj.size / zoom;
			obj.scale = obj.size / this.svgParent.height()
			this.elementChecked.data({obj: obj})
		},
		// 7.字体颜色设置
		fontColor(color) {
			this.fontColorSelect = color;
			this.textObj.fill = color;
			let obj = this.elementChecked.data('obj')
			obj.fill = color
			this.threeGroup.fill(color).stroke(color)
			this.elementChecked.data({obj})
			// this.setSaveTime()
		},
		// 8. 获取选中的文字
		textSelect() {
			let text = window.getSelection ? window.getSelection() : document.selection.createRange().text;
			// console.log(text)
		},
		// 9. 文字对齐方式
		handleTextAlign(align) {
			let obj = this.elementChecked.data('obj')
			obj.align = align;
			this.elementChecked.data({ obj: obj });
			if (this.codeTypeTool == 'text') {
				this.inputSetPath()
			} else {
				this.countText(obj).then(data => {
					this.productPath(data).then(this.changePath)
				})
			}
			this.tool_box = ''
			this.setSaveTime()
		},
		// 10. 文字字母大小写转换
		textConversion() {
			let text = '';
			if (this.textObj.conversion) {
				this.$set(this.textObj, 'conversion', false);
				text = this.$refs.textHeight.innerHTML
				this.$refs.textHeight.innerHTML = text.toLocaleLowerCase();
				
			} else {
				this.$set(this.textObj, 'conversion', true);
				text = this.$refs.textHeight.innerHTML;
				this.$refs.textHeight.innerHTML = text.toLocaleUpperCase();
			}
		},
		
		// 8.文字旋转 使用监控
		/* 文字设置 end */

		/* 图片设置 start */
		// 1. 设置大小
		setElemSize() {
			let width = this.imageObj.width || this.codeBox.width
			let height = this.imageObj.height || this.codeBox.height
			let zoom = this.draw.viewbox().zoom
			this.svgParent.size(width / zoom, height / zoom)//.data('ratio', height / width)
			this.setSaveTime();
			this.tool_box = ''
			this.$set(this.imageObj, 'width', '')
			this.$set(this.imageObj, 'height', '')
			let id = this.elementChecked.attr('id')
			this.handleActive(id)
		},
		// 2. 图片开始裁剪
		imgClip() {
			if (this.toolType == 'adsorb') return this.adsorbClip();
			if (!this.elementChecked || this.elementChecked.data('type') !== 'image') return;
			this.toolShow.father = false;
			this.isClipImage = true;
			let image = this.threeGroup.first()
			let zoom = this.draw.viewbox().zoom;
			let svgzoom = this.svgParent.viewbox().zoom;
			let rotation = this.twoGroup.attr('transform')
			this.twoGroup.attr('transform', '')
			let gbox = this.elementChecked.rbox();
			let bbox = this.elementChecked.bbox();
			this.twoGroup.attr('transform', rotation);
			let rotate = this.twoGroup.data('rotate') || 0;
			let parentDiv = this.$refs.parentDiv;
			let clipRect = this.$refs.clipRect;
			let clipBox = this.$refs.clipBox
			let zoom_x = image.width() / gbox.w;
			let zoom_y = image.height() / gbox.h;
			parentDiv['style']['display'] = 'block'
			clipRect['style']['left'] = gbox.x + 'px'
			clipRect['style']['top'] = gbox.y + 'px'
			clipRect['style']['width'] = gbox.width + 'px'
			clipRect['style']['height'] = gbox.height + 'px'
			clipRect['style']['transform'] = `rotate(${rotate}deg)`
			clipBox['style']['background-size'] = `${gbox.w}px ${gbox.h}px`
			clipBox['style']['left'] = `${this.svgParent.viewbox().x / zoom_x || 0.5}px`
			clipBox['style']['top'] = `${this.svgParent.viewbox().y / zoom_y || 0.5}px`
			clipBox['style']['width'] = `${this.svgParent.width() * zoom}px`
			clipBox['style']['height'] = `${this.svgParent.height() * zoom}px`
			clipBox['style']['background-position'] = `-${this.svgParent.viewbox().x / zoom_x}px -${this.svgParent.viewbox().y / zoom_y}px`
			let src = image.attr();
			this.clipImageSrc = src["xlink:href"] || src["href"];
		},
		// 确认裁剪
		setImageClip() {
			let zoom = this.draw.viewbox().zoom;
			let svgzoom = this.svgParent.viewbox().zoom;
			let parentDiv = this.$refs.parentDiv;
			let clipRect = this.$refs.clipRect;
			let clipBox = this.$refs.clipBox
			let image = this.threeGroup.first()
			let oldw = this.svgParent.width();
			let oldh = this.svgParent.height();
			let r = this.svgParent.data('ratio')
			let ebox = this.elementChecked.rbox()
			let x = clipBox.offsetLeft;
			let y = clipBox.offsetTop;
			let width = clipBox.offsetWidth;
			let height = clipBox.offsetHeight;

			let ratio = height / width
			let zoom_x = image.width() / ebox.w;
			let zoom_y = image.height() / ebox.h;
			let svgViewbox = this.svgParent.viewbox()
			this.svgParent.size(width / zoom, height / zoom)
				.viewbox(x * zoom_x, y * zoom_y, zoom_x * width, height * zoom_y)
				.data({
					ratio: ratio
				})
			let transform = this.elementChecked.transform();

			let dbox = this.draw.rbox()
			this.elementChecked.attr('transform', `translate(${(clipRect.offsetLeft - dbox.x + x) / zoom},${(clipRect.offsetTop - dbox.y + y) / zoom})`)
			let rotate = this.twoGroup.data('rotate') || 0
			this.twoGroup.attr('transform', `rotate(${rotate},${width / zoom / 2},${height / zoom / 2})`)
			parentDiv['style']['display'] = 'none'
			this.isClipImage = false
			this.codeBox.isShow = false
		},
		// 4. 取消裁剪
		closeClip() {
			let parentDiv = this.$refs.parentDiv;
			parentDiv['style']['display'] = 'none'
			this.isClipImage = false
		},
		// 5. 设为背景图片
		setImageBackground() {
			let list = this.threeGroup.children(),
				src = {
					type: 'image'
				};
			list.forEach(item => {
				if (item.type !== 'image') return
				src.msg = item.attr("xlink:href") || item.attr("href")
				this.handleChangeBackground(src)
			})
			this.del()
		},
		// 6. 更换图片
		changeImage() {
			let input = document.createElement('input')
			input.type = 'file'
			input.accept = 'image/*'
			input.click()
			input.onchange = () => {
				let file = input.files[0]
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
					}
				}
				this.$axios.post(this.$store.state.port.TeamMaterial, formdata, config)
					.then(res => {
						input = null
						let data = JSON.parse(res.data);
						if (data.status == 'ok') {
							let src = data.url
							let gbox = this.elementChecked.rbox(this.draw)
							let translate = this.elementChecked.attr('transform')
							let rotate = this.twoGroup.data('rotate')
							this.del()
							this.addCreateImage(src, {
									w: gbox.w,
									x: gbox.x,
									y: gbox.y
								})
								.then(firstGroup => {
									let fbox = firstGroup.rbox(this.draw)
									firstGroup.attr('transform', translate)
									firstGroup.first().data('rotate', rotate).attr('transform', `rotate(${rotate},${fbox.width/2},${fbox.height/2})`)
									this.handleActive(firstGroup.attr('id'))
									this.setSaveTime()
								})
						}
					}).catch(err => {
						console.log(err)
					})
			}
		},
		// 7. 裁剪开始
		handeImageClipDown(e) {
			let classList = e.target.classList
			if (classList.contains('clip-box')) {
				this.clipBoxPosition.off.move = true;
				this.clipBoxPosition.off.point = false;
			} else if (classList.contains('clip-right-top-btn') || classList.contains('clip-right-bottom-btn') || classList.contains('clip-left-bottom-btn') || classList.contains('clip-left-top-btn')) {
				this.clipBoxPosition.off.move = false;
				this.clipBoxPosition.off.point = true;
			}
			let w = this.$refs.clipBox.offsetWidth;
			let h = this.$refs.clipBox.offsetHeight;
			let clipX = this.$refs.clipBox.offsetLeft;
			let clipY = this.$refs.clipBox.offsetTop;
			
			if (classList.contains('clip-right-top-btn')) {
				// console.log('右上')
				this.clipBoxPosition.x = false;
				this.clipBoxPosition.y = true;
			} else if (classList.contains('clip-right-bottom-btn')) {
				// console.log('右下')
				this.clipBoxPosition.x = false;
				this.clipBoxPosition.y = false;
			} else if (classList.contains('clip-left-bottom-btn')) {
				this.clipBoxPosition.x = true;
				this.clipBoxPosition.y = false;
				// console.log('左下')
			} else if (classList.contains('clip-left-top-btn')) {
				// console.log('左上')
				this.clipBoxPosition.x = true;
				this.clipBoxPosition.y = true;
			}
			
			this.clipBoxPosition.scaleX = e.clientX;
			this.clipBoxPosition.scaleY = e.clientY;
			this.clipBoxPosition.scaleW = w;
			this.clipBoxPosition.scaleH = h;
			this.clipBoxPosition.ratioW = e.clientX / w
			this.clipBoxPosition.ratioH = e.clientY / h
			this.clipBoxPosition.clipX = clipX
			this.clipBoxPosition.clipY = clipY
			this.clipBoxPosition.ratioX = e.clientX / this.clipBoxPosition.clipX
			this.clipBoxPosition.ratioY = e.clientY / this.clipBoxPosition.clipY
			this.clipBoxPosition.maxX = w + clipX - 20
			this.clipBoxPosition.maxY = h + clipY - 20;
			this.clipBoxPosition.maxW = clipX + w;
			this.clipBoxPosition.maxH = clipY + h;
			this.clipBoxPosition.parentWidth = this.$refs.clipRect.offsetWidth;
			this.clipBoxPosition.parentHeight = this.$refs.clipRect.offsetHeight;

			this.clipBoxPosition.cx = e.clientX;
			this.clipBoxPosition.cy = e.clientY;
			document.addEventListener('mousemove', this.handleImageClipMove)
			document.addEventListener("mouseup", this.handleImageClipClose)
			
		},
		// 8. 裁剪移动
		handleImageClipMove(e) {
			// console.log((e.clientX / this.clipBoxPosition.scaleX - 1) * 3,e.clientY / this.clipBoxPosition.scaleY)
			
			// this.clipBoxPosition.cx = e.clientX;
			// this.clipBoxPosition.cy = e.clientY;
			let clipRect = this.$refs.clipRect;
			let clipBox = this.$refs.clipBox

			if (this.clipBoxPosition.off.move) {
				let x = e.clientX - this.clipBoxPosition.scaleX
				let y = e.clientY - this.clipBoxPosition.scaleY
				let left = this.clipBoxPosition.clipX + x;
				let top = this.clipBoxPosition.clipY + y;
				if (left <= 0) left = 0.5;
				if (top <= 0) top = 0.5;
				if (left >= this.clipBoxPosition.parentWidth - this.clipBoxPosition.scaleW) left = this.clipBoxPosition.parentWidth - this.clipBoxPosition.scaleW
				if (top >= this.clipBoxPosition.parentHeight - this.clipBoxPosition.scaleH) top = this.clipBoxPosition.parentHeight - this.clipBoxPosition.scaleH
				// console.log(this.clipBoxPosition.parentWidth - this.clipBoxPosition.scaleW)
				clipBox['style']['left'] = left + 'px'
				clipBox['style']['top'] = top + 'px'
				clipBox['style']['background-position'] = `-${left}px -${top}px`
				return
			}

				 let scaleX = e.clientX / this.clipBoxPosition.scaleX - 1;
				 let scaleY = e.clientY / this.clipBoxPosition.scaleY - 1;
				 let l, t ,w, h;
				//  console.log(scaleW, 1 + (1 - e.clientX / this.clipBoxPosition.scaleX) )
				l = this.clipBoxPosition.clipX;
				t = this.clipBoxPosition.clipY;
				w = this.clipBoxPosition.scaleW * (1 + scaleX * this.clipBoxPosition.ratioW)
				h = this.clipBoxPosition.scaleH * (1 + scaleY * this.clipBoxPosition.ratioH)
				
				 if (this.clipBoxPosition.x) {
					l = this.clipBoxPosition.clipX * (1 + scaleX * this.clipBoxPosition.ratioX)
					w = this.clipBoxPosition.scaleW * (1 - scaleX * this.clipBoxPosition.ratioW)
				} 
				if (this.clipBoxPosition.y) {
					t = this.clipBoxPosition.clipY * (1 + scaleY * this.clipBoxPosition.ratioY)
					h = this.clipBoxPosition.scaleH * (1 - scaleY * this.clipBoxPosition.ratioH)
				}
				if (l <= 0) {
					l = .5;
					w = this.clipBoxPosition.maxW
				} 
				if (t <= 0) {
					t = .5;
					h = this.clipBoxPosition.maxH
				} 
				if (w <= 20 && this.clipBoxPosition.x) {
					w = 20;
					l = this.clipBoxPosition.maxX
				} else if (w <= 20) {
					w = 20;
				}
				if (h <= 20 && this.clipBoxPosition.y) {
					h = 20;
					t = this.clipBoxPosition.maxY
				} else if (h <= 20) {
					h = 20;
				}
				
				
				if ((l + w) >= this.clipBoxPosition.parentWidth - 1 ) {
					w = this.clipBoxPosition.parentWidth - l
				}
				if ((t + h) >= this.clipBoxPosition.parentHeight - 1) {
					h = this.clipBoxPosition.parentHeight - t
				}

				
				clipBox['style']['left'] = l + 'px'
				clipBox['style']['top'] = t + 'px'
				clipBox['style']['width'] = w + 'px'
				clipBox['style']['height'] = h + 'px'
				clipBox['style']['background-position'] = `-${l}px -${t}px`
			// }

		},
		// 9.停止裁剪移动
		handleImageClipClose() {
			this.clipBoxPosition.off.move = false;
			this.clipBoxPosition.off.point = false
			document.removeEventListener('mousemove', this.handleImageClipMove)
			document.removeEventListener("mouseup", this.handleImageClipClose)
		},
		/* 图片设置 end */

		/* svg文件 设置 ↓*/
		// 识别选中颜色
		handleFillIndex(index) {
			this.svgFillIndex = index;
		},
		// svg的颜色拾取和填充
		handleSvgFill(msg) {
			this.fontColorSelect = msg;
			let list = [],
				colorList = [],
				group = this.elementChecked,
				first = this.threeGroup;
			let str = first.node.innerHTML,
				reg2 = /(#.*?(;|")|rgba?\(.*?\))/ig,
				arr2 = str.match(reg2);
				// console.log(this.threeGroup, arr2)
				arr2 && arr2.forEach(color => {
					color = color.replace(/;|"/ig, '')
					if (colorList.indexOf(color) < 0) {
						colorList.push(color)
					}
				})
			if (!msg) {
				this.svgFillList = colorList;
			} else {
				
				let color = new RegExp(colorList[this.svgFillIndex].replace(/(\(|\))/ig, function(val) {return `\\${val}`}) , 'gi');
				
				str = str.replace(color, msg)
				first.node.innerHTML = str
				colorList[this.svgFillIndex] = msg;
				this.$set(this.svgFillList, this.svgFillIndex, msg)
			}
			// this.setSaveTime();
		},
		// 侧边工具栏切换
		sideToggle(title, index) {
			this.toggle = true;
			this.sideTitle = title;
		},
		// 获取群组 位置, 大小
		getGroupAttr(group) {
			let groupId = group.data('group').groupId,
				groupLock = group.data('group').groupLock,
				set = this.draw.set(),
				lock = false;
			this.lock = groupLock || false;
			this.draw.children().forEach((g, index) => {
				let group = g.data('group')
				if (g.data('type') != 'Masking' && group && group.groupId == groupId) {
					set.add(g)
					if (!g.hasClass('hoveMove')) {
						lock = true;
					}
				}
			})
			if (lock) this.svgLock = true
			else this.svgLock = false
			// 激活群组
			let sbox = set.bbox(),
				zoom = this.draw.viewbox().zoom,
				dbox = this.draw.rbox();
			this.group.set = set;
			this.group.box = this.getGroupRelativePosition(set, sbox);
			this.codeBox.x = sbox.x * zoom + dbox.x;
			this.codeBox.y = sbox.y * zoom + dbox.y;
			this.codeBox.width = sbox.width * zoom;
			this.codeBox.height = sbox.height * zoom;
			this.codeBox.rotate = 0;
			this.group.isgroup = true;
			this.codeBox.isShow = true;
			this.toolShow.father = true;
			this.toolType = 'group';
			this.getAllElemPos()
		},
		setCodeBox({width, height, x, y , rotate}) { // 设置codebox 的位置和大小以及旋转
			this.codeBox.x = x;
			this.codeBox.y = y;
			this.codeBox.width = width;
			this.codeBox.height = height;
			this.codeBox.rotate = rotate;
			this.codeBox.isShow = true
			this.setCursorStyle(this.codeBox.rotate)
		},
		// 获取单个激活的元素的位置和大小
		getActiveSvgAttr(group) {
			let zoom = this.draw.viewbox().zoom,
				twoGroup = group.first(),
				svgParent = group.first().first(),
				viewbox = svgParent.viewbox(),
				box = group.rbox(),
				bbox = group.bbox(),
				groupType = group.data('type');
				this.codeBox.x = box.x - bbox.x * zoom;
				this.codeBox.y = box.y - bbox.y * zoom;
				this.codeBox.width = svgParent.width() * zoom;
				this.codeBox.height = svgParent.height() * zoom;
				this.codeBox.rotate = twoGroup.data("rotate") || 0;
				this.codeBox.isShow = true
				this.setCursorStyle(this.codeBox.rotate)
			// console.log(box)
		},
		/**
		 * 激活当前选中容器，使之具备功能
		 * @param {[type]} id
		 */
		handleActive(id) {
			this.rightBtn.show = false;
			if (this.codeTypeTool == 'text') {
				return this.inputSetPath()
			}
			let group = SVG.get(id);
			if (group == null || group.node.children.length <= 0 
				|| this.isClipImage 
				|| group.data("type") == "background"
				|| (this.ctrlKey && this.group.set && this.group.set.members.length > 1) // ctrl按下
			) return;
			let GroupSet = group.data('group') || ''
			if (GroupSet != '') {
				this.getGroupAttr(group)
				return 
			};
			this.toolShow.father = true; // 打开工具总开关
			this.elementChecked = group;
			this.twoGroup = group.first()
			this.svgParent = this.twoGroup.first()
			
			this.getActiveSvgAttr(group); // 初始化box的大小和位置
			// 检测是否锁定
			if (group.hasClass("hoveMove")) {
				this.svgLock = false
				this.getAllElemPos();// 获取所有元素的位置
			} else {
				this.svgLock = true
			}
			// 根据类型绑定事件
			let type = group.data("type");
			let zoom = this.draw.viewbox().zoom;

			
			switch (type) {
				case "image":
					this.toolType = "image";
					this.threeGroup = this.svgParent.first()
					this.codeTypeTool = '';
					break;
				case "svg":
					this.toolType = "svg";
					this.threeGroup = this.svgParent.last()
					if (this.threeGroup.type == 'defs') {
						this.threeGroup.remove();
						this.threeGroup = this.svgParent.last()
					}
					this.handleSvgFill();
					this.codeTypeTool = '';
					break;
				case "text":
					this.textElem = group; // 当前选中文字
					this.toolType = "text";
					this.threeGroup = this.svgParent.last()
					if (this.threeGroup.type == 'defs') {
						this.threeGroup.remove();
						this.threeGroup = this.svgParent.last()
					}
					this.textObj = group.data('obj');
					if (typeof this.textObj.arrList != 'object') {
						// console.log(this.textObj.arrList.replace(/(^\[)|(\]$)/g, ""))
						this.textObj.arrList = [this.textObj.arrList.replace(/(^\[)|(\]$)/g, "")]
						let obj = JSON.parse(JSON.stringify(this.textObj))
						group.data({obj})
					}
					if (!this.textObj.width) {
						this.textObj.width = this.svgParent.width();
						let obj = JSON.parse(JSON.stringify(this.textObj))
						group.data({obj})
					}
					if (!this.textObj.scale) {
						this.textObj.scale = this.textObj.size / this.svgParent.height();
						group.data({obj: this.textObj})
					}
					this.textObj.size = this.textObj.size * zoom;
					this.textObj.bold = this.textObj.bold / 2 * 100; 
					this.fontStyle.spacing = this.textObj.spacing * 1000;
					this.fontStyle.line = (this.textObj.line - 1) * 1000;
					this.fontColorSelect = this.threeGroup.attr("fill") || "#000";
					this.textDefault = this.getFontThumb(this.textObj.family).FontThumb; 
					// console.log(this.getFontThumb(this.textObj.family))
					this.codeTypeTool = '';
					break;
				case 'adsorb':
					this.toolType = 'adsorb';
					this.codeTypeTool = 'adsorb';
					this.threeGroup = this.svgParent.first();
				break;
			}
			
			// 获取透明度
			this.opacityValue = group.opacity() * 100;
		},
		
		rightMenuBox(e) { //右键菜单
			e.button == 2 && (()=>{
				this.rightBtn.show = true
				this.rightBtn.x = e.offsetX;
				this.rightBtn.y = e.offsetY;
			})()

		},

		/*  顶部右边工具栏 ↓ */
		// 1. 锁定 lock
		lock() {
			if (this.group.set) {
				// console.log(this.group.set)
				this.group.set.members.forEach(g => {
					g.hasClass("hoveMove") ? (()=>{
						g.removeClass('hoveMove')
						g.draggable(false)
						this.svgLock = true
					})() : (()=>{
						g.addClass('hoveMove')
						g.draggable().on('dragend', () => this.setSaveTime())
						this.svgLock = false
					})()
				})
				return
			}
			if (this.elementChecked.hasClass("hoveMove")) {
				this.elementChecked.removeClass("hoveMove");
				this.elementChecked.draggable(false)
				this.svgLock = true
				this.guide.off = false
			} else {
				this.elementChecked.addClass("hoveMove");
				this.elementChecked.draggable().on('dragend', () => this.setSaveTime())
				this.svgLock = false
				this.guide.off = true
			}
			this.setSaveTime();
		},
		// 2.删除 del
		del() {
			if (this.group.set != null) {
				this.group.set.members.forEach(g => {
					g.remove();
				});
			} else {
				this.elementChecked && this.elementChecked.remove();
				// this.svgList.splice(this.elemIndex,1)
			}
			this.setSaveTime();
			this.clearRectSelect();
			this.tool_box = ''
		},
		/*  顶部右边工具栏 ↑ */

		/* 键盘按键事件 ↓*/
		// 选中元素按下
		elemDown (id) {
			let elem = SVG.get(id);
			elem && (()=>{
                this.elemIndex = elem.position();
                if (elem.data('type') == 'image') {
                    this.adsorbSrc = elem.node.querySelector('image').getAttributeNS('http://www.w3.org/1999/xlink', 'href') || image.getAttribute('href');
                }
            })();
		},
		
		// 鼠标抬起
		mouseUp(e) {
			if (e.ctrlKey && e.button == 0) {
				e.preventDefault(); 
				let set = this.group.set || this.draw.set(); // 是否具备容器,没有创建
				
				let elem = this.draw.get(this.elemIndex),
					zoom = this.draw.viewbox().zoom,
					dbox = this.draw.rbox(),
					 off = false;
				if (!set.has(this.elementChecked) && this.codeBox.isShow) {
					set.add(this.elementChecked)
				}
				
				if (!set.has(elem) && elem.hasClass('hoveMove')) { // 容器是否包含当前元素和是否锁定
					elem && set.add(elem) // 当前元素存在,添加
					this.group.set = set; // 保存当前容器
				}
				if (set.members.length <= 1) return;
				let sbox = set.bbox();//获取大小
				this.codeBox.x = sbox.x * zoom + dbox.x;
				this.codeBox.y = sbox.y * zoom + dbox.y;
				this.codeBox.width = sbox.width * zoom;
				this.codeBox.height = sbox.height * zoom;
				this.codeBox.rotate = 0;
				this.codeBox.isShow = true;
				this.group.box = this.getGroupRelativePosition(set, sbox);
				this.group.isgroup = false;
				this.toolShow.father = true;
				this.toolType = 'group';
				
			}
		},
		// 键盘up
		keycode(e) { // 快捷键设置
			this.ctrlKey =e.ctrlKey;
			// 通过delete键删除选中svg元素
			if (e.keyCode == 46) {
				this.del();
			}
			if (e.keyCode == 32) {
				this.allMask = false
			} 
		},
		//键盘down
		keyDown (e) {
			this.ctrlKey =e.ctrlKey;
			if (e.ctrlKey) {
				// ctrl + c
				if (e.keyCode == 67 && (this.toolType == 'group' || this.elementChecked) && !this.codeTypeTool) { 
					this.cloneBefore(this.elementChecked)
				}
				// ctrl + v
				if (e.keyCode == 86) {
					// e.preventDefault()
					if (!this.copyElemArr.length) return
					this.clone();
					if (this.toolType == 'group' || this.elementChecked) 
						this.cloneBefore(this.elementChecked)
					this.moveMaking()
				}
				// ctrl + A 全选除了锁定状态
				if (e.code == 'KeyA' && this.codeTypeTool != 'text') {
					e.preventDefault()
					if (!this.group.set) {
						this.group.set = this.draw.set()
					}
					this.draw.children().forEach(group => {
						let type = group.data('type') || '';
						if (type && group.hasClass('hoveMove')) {
							this.group.set.add(group)
						}
					})
					if (this.group.set.members.length < 1) return this.group.set = null
					let set = this.group.set;
					let zoom = this.draw.viewbox().zoom;
					let dbox = this.draw.rbox();
					let sbox = set.bbox();
					this.codeBox.x = sbox.x * zoom + dbox.x;
					this.codeBox.y = sbox.y * zoom + dbox.y;
					this.codeBox.width = sbox.width * zoom;
					this.codeBox.height = sbox.height * zoom;
					this.codeBox.rotate = 0;
					this.codeBox.isShow = true;
					this.group.box = this.getGroupRelativePosition(set, sbox);
					this.group.isgroup = false;
					this.toolShow.father = true;
					this.toolType = 'group';
				}
				switch(e.code) {
					case 'KeyZ': // ctrl + Z 撤销功能
						this.clearCanvas('undo')
					break;
					case 'KeyY': // ctrl + Y 恢复功能
						this.clearCanvas('redo');
					break;
					default: 
					break;
				}
			}
			// 抓手
			if (e.keyCode == 32) {
				this.allMask = true
			}
			
			// 37 ← 38 ↑ 39 → 40 ↓
			if ((e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) && this.codeTypeTool != 'text' && this.codeBox.isShow && !this.svgLock) {
				
				if(this.elementChecked) {
					let transform = this.elementChecked.transform(),
						zoom = this.draw.viewbox().zoom,
						x = transform.transformedX,
						y = transform.transformedY,
						arr = [];
					if (this.group.set) {
						this.group.set.members.forEach(g => {
							let t= g.transform(),
								_x = t.transformedX,
								_y = t.transformedY;
							arr.push({_x, _y, g})
						})
					}
					switch(e.keyCode) {
						case 37:
							this.codeBox.x--
							if (this.group.set) {
								arr.forEach(item => {
									item._x -= 1 / zoom;
									item.g.x(item._x)
								})
							} else {
								x -= 1 / zoom;
								this.elementChecked.x(x)
								this.setSelectBox(-1 / zoom, 0)
							}
						break;
						case 38:
							this.codeBox.y--
							if (this.group.set) {
								arr.forEach(item => {
									item._y -= 1 / zoom;
									item.g.y(item._y)
								})
							} else {
								y -= 1 / zoom;
								this.elementChecked.y(y)
								this.setSelectBox(0, -1 / zoom)
							}
						break;
						case 39:
							this.codeBox.x++
							if (this.group.set) {
								arr.forEach(item => {
									item._x += 1 / zoom;
									item.g.x(item._x)
								})
							} else {
								x += 1 / zoom;
								this.elementChecked.x(x)
								this.setSelectBox(1/zoom, 0)
							}
						break;
						case 40:
							this.codeBox.y++
							if (this.group.set) {
								arr.forEach(item => {
									item._y += 1 / zoom;
									item.g.y(item._y)
								})
							} else {
								y += 1 / zoom;
								this.elementChecked.y(y)
								this.setSelectBox(0, 1 / zoom)
							}
						break;
					}
				} else {
					if (e.keyCode == 37) {
						this.codeBox.x--
					} else if (e.keyCode == 38){
						this.codeBox.y--
					} else if (e.keyCode == 39) {
						this.codeBox.x++
					} else if (e.keyCode == 40) {
						this.codeBox.y++
					}
					this.rectDraw()
				}
			}
		},
		allDown(e) { // 全屏遮罩按下
			let elem = this.$refs.drawing;
			this.maskObj.off = true
			this.maskObj.ex = e.clientX;
			this.maskObj.ey = e.clientY;
			this.maskObj.x = elem.offsetLeft; 
			this.maskObj.y = elem.offsetTop; 
			this.maskObj.elem = elem; 
			this.maskObj._x = this.codeBox.x
			this.maskObj._y = this.codeBox.y
			document.addEventListener('mousemove', this.allMove)
			document.addEventListener('mouseup', this.allUp)
		},
		allMove (e) { // 全屏遮罩移动
			if (!this.maskObj.off) return
			let _x = e.clientX - this.maskObj.ex,
				_y = e.clientY - this.maskObj.ey; 
			this.maskObj.elem['style']['left'] = this.maskObj.x + _x + 'px'
			this.maskObj.elem['style']['top'] = this.maskObj.y + _y + 'px'
			this.codeBox.x = this.maskObj._x + _x
			this.codeBox.y = this.maskObj._y + _y
			this.setRefLine()
		},
		allUp(e) { // 移除遮罩事件
			this.maskObj.off = false
			document.removeEventListener('mousemove', this.allMove)
			document.removeEventListener('mouseup', this.allUp)
			
		},
		/* 键盘按键事件 ↑ */
		// 3.翻转选中元素
		flip(a, b) {
			this.threeGroup.scale(a, b);
			this.setSaveTime();
		},
		// 4.1 复制开始
		cloneBefore(obj) {
			this.copyElemArr = [];
			if (this.toolType == 'group') {
				this.group.set.members.forEach((item, i) => {
					let getElem = this.getSingleElementAttr(item);
					getElem.pagenum = this.pagenum;
					this.copyElemArr.push(getElem);
				})
			} else {
				let getElem = this.getSingleElementAttr(obj);
					getElem.pagenum = this.pagenum;
				this.copyElemArr.push(getElem);
			}
			
		},
		// 4.2复制中
		clone() {
			let zoom = this.draw.viewbox().zoom;
			this.rightBtn.show = false;
			if (!this.copyElemArr.length) return;
			let elemArr = this.copyElemArr;
			if (this.copyElemArr.length > 1) {
				let set = this.draw.set(), groupId = [], newGroupId = {};
				elemArr.forEach((item, i) => {
					if (item.group) {
						if (groupId.indexOf(item.group.groupId) > -1) {
							item.group.groupId = newGroupId[item.group.groupId]
						} else {
							groupId.push(item.group.groupId);
							let date = 'group_' + new Date().getTime();
							newGroupId[item.group.groupId] =  date;
							item.group.groupId = date;
						}
					};
					let readerElem = this.readerSingleElement(item, i),
						position = readerElem.transform();
					if (item.pagenum == this.pagenum) readerElem.translate(position.transformedX + (20 / zoom), position.transformedY + (20 / zoom))
					set.add(readerElem);
				})
				this.group.set = set;
				this.uploadGroup();
			} else {
				elemArr.forEach((item, i) => {
					let readerElem = this.readerSingleElement(item, i),
						position = readerElem.transform();
					if (item.pagenum == this.pagenum) readerElem.translate(position.transformedX + (20 / zoom), position.transformedY + (20 / zoom))
					this.handleActive(readerElem.id())
				})
			}
			this.setSaveTime();
		},
		// 4.3复制完成
		cloneEnd() {
			this.cloneBefore(this.elementChecked);
			this.clone();
		},
		// 4.4 清空复制对象
		clearClone() {
			this.copyElemArr = []
		},
		// 5.投影 ↓
		setProjection(value) {
			// this.projectionList.elem = this.draw.image('//img.aliyin.com/materials/201903/d3b516dbb7f1472d8969d8dab3c93322.jpg!w800.src').size(300, 300).draggable()
			this.projectionList.elem = this.elementChecked.filter()
			console.log(this.projectionList.elem)
			// let defs = this.draw.defs()
			// defs.svg(`<filter id="shadow-1" x="-7.111111111111111%" y="-11.867675419077289%" width="127.35687210411857%" height="145.65566105493755%"><feColorMatrix values="0 0 0 0 0
			//       0 0 0 0 0
			//       0 0 0 0 0
			//       0 0 0 1 0" type="matrix" in="SourceAlpha" result="matrix" color-interpolation-filters="sRGB"></feColorMatrix> <feOffset dx="47.28473957482688" dy="47.2847395748269" in="matrix" result="offset"></feOffset> <feGaussianBlur stdDeviation="6.4" in="offset" result="blur"></feGaussianBlur> <feMerge><feMergeNode in="blur"></feMergeNode> <feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>`)
			// this.elementChecked.attr('filter', 'url(#shadow-1)')
			// console.log(defs.first().attr())
			// defs.first().children().forEach(item => {
			// 	console.log(item.attr())
			// })
		},
		projectionK(value) {
			if (!value || this.projectionList.elem == null) return
			let image = this.projectionList.elem
			image.gaussianBlur(value)
		},
		projectionJ(value) {
			if (value && this.projectionList.elem) return
			let image = this.projectionList.elem
			let w = 100 + value + '%'
		},
		projectionT(value) {
			if (value) return
		},
		projectionD(value) {
			if (value) return
		},
		// 5. 投影 ↑
		/*  顶部右边工具栏 ↑ */

		// 清除矩形选区,并清空选中的组合,取消选中
		clearRectSelect() {
			// 没有选中任何元素时,隐藏功能
			this.toolShow.father = false;
			this.rightBtn.show = false;
			this.toolShow.show = "";
			if (this.codeTypeTool == 'text') return
			if (this.isClipImage) this.closeClip()
			this.codeTypeTool = '';
			this.tool_box = ''
			this.codeBox.isShow = false; 
			this.isClipAdsorb = false;
			this.isClipImage = false;
			this.toolType = '';
			this.backgroundShow = false;
			this.group.set = null;
			this.elementChecked = null;
			// 清空组合里面的元素
			let first = this.draw.first()
			if (first && first.data("type") == 'background') {
				first.removeClass('hoveMove')
				first.draggable(false)
			}

		},
		outDraw() { // 鼠标离开画布
			this.rectSelectStyle.leaveDraw = true;
			this.dragAndDrop && (this.dragAndDrop.enter = false);
		},
		enterDraw() { // 鼠标进入画布
			this.rectSelectStyle.leaveDraw = false;
			this.dragAndDrop && (this.dragAndDrop.enter = true);
		},
		// 矩形框选 ↓
		editorPageDown(e) {
			// 记录开始的left,top坐标 添加矩形选框
			this.fontColorSelect && this.pickColor(this.fontColorSelect) // 提前颜色
			// console.log(this.useColor)
			if (this.codeTypeTool && this.codeTypeTool != 'adsorb') {
				if (this.codeTypeTool == 'text') this.inputSetPath();
				return;
			}
			// this.clearRectSelect();
			if (this.toolType != 'background' || this.rectSelectStyle.leaveDraw)  {
				this.clearRectSelect();
			}
			let toggle = this.toggle ? 390 : 60;
		

			//记录鼠标开始的坐标
			this.rectOldpos.posx = e.pageX;
			this.rectOldpos.posy = e.pageY;
			this.rectOldpos.pageX = e.pageX;
			this.rectOldpos.pageY = e.pageY;

			this.rectSelectStyle.left = e.pageX - toggle + "px";
			this.rectSelectStyle.top = e.pageY + "px";

			this.rectSelectStyle.width = 0;
			this.rectSelectStyle.height = 0;

			document.addEventListener("mousemove", this.editorPageMove);
			document.addEventListener("mouseup", this.editorPageUp);
		},
		editorPageMove(e) {
			// 1.显示矩形选框
			this.rectSelectStyle.display = "block";

			// 2. 计算矩形选框的位置
			let toggle = this.toggle ? 390 : 60;
			this.rectSelectStyle.left =
				Math.min(e.pageX - toggle, this.rectOldpos.pageX - toggle) + "px";
			this.rectSelectStyle.top =
				Math.min(e.pageY, this.rectOldpos.pageY) + "px";

			// 3. 设置矩形选框的宽高
			let width = Math.abs(e.pageX - this.rectOldpos.pageX);
			let height = Math.abs(e.pageY - this.rectOldpos.pageY);

			this.rectSelectStyle.width = width + "px";
			this.rectSelectStyle.height = height + "px";

		},
		// 矩形 元素并组合到一个g元素
		editorPageUp(e) {

			document.removeEventListener("mousemove", this.editorPageMove);
			document.removeEventListener('mouseup', this.editorPageUp);
			if (parseInt(this.rectSelectStyle.width) < 1) return;

			this.rectSelectStyle.width = 0;
			this.rectSelectStyle.height = 0;

			let set = this.handleSelected(e);
			if (set == undefined || set.members.length == 0) return;
			if (set.members.length == 1) {
				let id = set.members[0].id()
				this.handleActive(id)
				return
			}
			let zoom = this.draw.viewbox().zoom;
			let dbox = this.draw.rbox();
			let sbox = set.bbox();
			this.codeBox.x = sbox.x * zoom + dbox.x;
			this.codeBox.y = sbox.y * zoom + dbox.y;
			this.codeBox.width = sbox.width * zoom;
			this.codeBox.height = sbox.height * zoom;
			this.codeBox.rotate = 0;
			this.codeBox.isShow = true;
			this.group.set = set;
			this.group.box = this.getGroupRelativePosition(set, sbox);
			this.group.isgroup = false;
			this.toolShow.father = true;
			this.toolType = 'group';
			this.rectSelectStyle.display = "none";
		},
		// 封装计算组合后的宽高和位置
		getGroupBox(set) {
			let minX = 0,
				minY = 0,
				maxX = 0,
				maxY = 0,
				width = 0,
				height = 0;
			let zoom = this.draw.viewbox().zoom;
			set.members.forEach(item => {
				let gbox = item.rbox(this.draw);
				let bbox = item.bbox();
				let x = gbox.x - bbox.x;
				let y = gbox.y - bbox.y;
				let x2 = gbox.x2 - bbox.x2;
				minX = minX > x ? x : minX;
			})
		},
		// 封装选中元素的方法
		handleSelected(e, move = false) {
			// 获取矩形选框四个边的位置
			var minX = this.rectOldpos.pageX;
			var minY = this.rectOldpos.pageY;

			var maxX = e.pageX;
			var maxY = e.pageY;

			// 如果是反向选择调换位置
			if (minX > maxX)[minX, maxX] = [maxX, minX];
			if (minY > maxY)[minY, maxY] = [maxY, minY];

			// 拿到多有可选取元素
			var svgList = [],
				childList = this.draw.children();
			childList.forEach(item => {
				let type = item.data('type')
				if (type != 'background' && type != 'Masking' && item.hasClass('hoveMove'))
					svgList.push(item)
			})
			this.svgLock = false
			if (!svgList.length) return;
			// 创建一个set 保存所有选中的元素
			let set = this.draw.set();
			
			let arr = [];
			svgList.forEach((value, index) => {
				arr.push(this.getPosition(value, false));
			});

			for (let i = 0, len = arr.length; i < len; i++) {
				// 获取当前DOM元素四边的位置
				let gMinX = arr[i].x;
				let gMaxX = arr[i].x + arr[i].width;

				let gMinY = arr[i].y;
				let gMaxY = arr[i].y + arr[i].height;

				if (gMinX < maxX && gMaxX > minX && gMinY < maxY && gMaxY > minY) {
					//将选中元素添加到set组合
					let selectGroup = svgList[i].data('group') || ''
					if (selectGroup != '') {
						childList.forEach(item => {
							let groupObj = item.data('group') || '';
							if (!set.has(item) && groupObj != '' && groupObj.groupId == selectGroup.groupId) set.add(item)
						})
					}
					!set.has(svgList[i]) && set.add(svgList[i]);
				}
			}
			
			// 返回组合set
			return set;
		},
		// 封装获取群组中各个元素相对位置和大小
		getGroupRelativePosition(set, sbox) {
			if (set == undefined || sbox == undefined) return new Error('没有组合或者组合大小')
			let arr = [];
			let zoom = this.draw.viewbox().zoom;
			set.members.forEach(g => {
				let svg = g.node.querySelector('svg');
				svg = SVG(svg);
				let gbox = g.rbox(this.draw);
				let bbox = g.bbox();
				let oldx = (gbox.x - bbox.x - sbox.x) / sbox.width;
				let oldy = (gbox.y - bbox.y - sbox.y) / sbox.height;
				let oldwidth = svg.width() / sbox.width;
				let oldheight = svg.height() / sbox.height;
				arr.push({
					oldx,
					oldy,
					oldwidth,
					oldheight
				});
			})
			return arr;
		},
		uploadGroup() { // 更新组合
			let zoom = this.draw.viewbox().zoom,
				dbox = this.draw.rbox();;
			let sbox = this.group.set.bbox();
			this.codeBox.x = sbox.x * zoom + dbox.x;
			this.codeBox.y = sbox.y * zoom + dbox.y;
			this.codeBox.width = sbox.width * zoom;
			this.codeBox.height = sbox.height * zoom;
			this.codeBox.isShow = true;
			this.toolType = 'group';
			this.toolShow.father = true;
			this.group.box = this.getGroupRelativePosition(this.group.set, sbox);
		},
		// 矩形框选 ↑

		/*  组合功能  ↓*/
		//1.0 获取去框选里面多个组合
		getMoreGroup() {
			let arr = [], setArr = [];
			this.group.set.members.forEach(item => {
				let group = item.data('group') || ''
				if (group && arr.indexOf(group.groupId) == -1) arr.push(group.groupId)
			})
			arr.forEach(item => {
				let set = this.draw.set();
				this.group.set.members.forEach(g => {
					let group = g.data('group') || '';
					if (group && group.groupId == item) set.add(g);
				})
				setArr.push({set, setBox: set.bbox()});
			})
			return {setArr, groupArr: arr};
		},
		//1.对齐方式
		setGroupAlign(type) {
			if (this.toolType != 'group') return;
			let dbox = this.draw.rbox(),
				zoom = this.draw.viewbox().zoom,
				minX = this.codeBox.x - dbox.x,
				minY = this.codeBox.y - dbox.y,
				maxX = minX + this.codeBox.width,
				maxY = minY + this.codeBox.height,
				cx = minX + this.codeBox.width / 2,
				cy = minY + this.codeBox.height / 2,
				{setArr, groupArr} = this.getMoreGroup();
			switch (type) {
				case "left":
					this.group.set.members.forEach(g => {
						let transform = g.transform(),
							gbox = g.rbox(this.draw),
							bgbox = g.bbox(),
							group = g.data('group');
						if(group) {
							let itembox = setArr[groupArr.indexOf(group.groupId)].setBox;
							g.attr('transform', `translate(${minX / zoom + (gbox.x - bgbox.x - itembox.x)}, ${transform.transformedY})`)
						} else {
							g.attr('transform', `translate(${minX / zoom - bgbox.x}, ${transform.transformedY})`)
						}
					});
					break;
				case "right":
					this.group.set.members.forEach(g => {
						let transform = g.transform(),
							gbox = g.rbox(this.draw),
							bgbox = g.bbox(),
							group = g.data('group');
						if(group) {
							let itembox = setArr[groupArr.indexOf(group.groupId)].setBox;
							g.attr('transform', `translate(${maxX / zoom - itembox.width + (gbox.x - bgbox.x - itembox.x)}, ${transform.transformedY})`)
						} else {
							g.attr('transform', `translate(${maxX / zoom - gbox.width - bgbox.x}, ${transform.transformedY})`)
						}
					});
					break;
				case "center":
					this.group.set.members.forEach(g => {
						let transform = g.transform(),
							gbox = g.rbox(this.draw),
							bgbox = g.bbox(),
							group = g.data('group');
						if(group) {
							let itembox = setArr[groupArr.indexOf(group.groupId)].setBox;
							g.attr('transform', `translate(${cx / zoom - itembox.width / 2 + (gbox.x - bgbox.x - itembox.x)}, ${transform.transformedY})`)
						} else {
							g.attr('transform', `translate(${cx / zoom - gbox.width / 2 - bgbox.x}, ${transform.transformedY})`)
						}
					});
					break;
				case "middle":
					this.group.set.members.forEach(g => {
						let transform = g.transform(),
							gbox = g.rbox(this.draw),
							bgbox = g.bbox(),
							group = g.data('group');
						if(group) {
							let itembox = setArr[groupArr.indexOf(group.groupId)].setBox;
							g.attr('transform', `translate(${transform.transformedX}, ${cy / zoom - itembox.height / 2 + (gbox.y - bgbox.y - itembox.y)})`)
						} else {
							g.attr('transform', `translate(${transform.transformedX}, ${cy / zoom - gbox.height / 2 - bgbox.y})`)
						}
					});
					break;
				case "top":
					this.group.set.members.forEach(g => {
						let transform = g.transform(),
							gbox = g.rbox(this.draw),
							bgbox = g.bbox(),
							group = g.data('group');
						if(group) {
							let itembox = setArr[groupArr.indexOf(group.groupId)].setBox;
							g.attr('transform', `translate(${transform.transformedX}, ${minY / zoom + (gbox.y - bgbox.y - itembox.y)})`)
						} else {
							g.attr('transform', `translate(${transform.transformedX}, ${minY / zoom - bgbox.y})`)
						}
					});
					break;
				case "bottom":
					this.group.set.members.forEach(g => {
						let transform = g.transform(),
							gbox = g.rbox(this.draw),
							bgbox = g.bbox(),
							group = g.data('group');
						if(group) {
							let itembox = setArr[groupArr.indexOf(group.groupId)].setBox;
							g.attr('transform', `translate(${transform.transformedX}, ${maxY / zoom - itembox.height + (gbox.y - bgbox.y - itembox.y)})`)
						} else {
							g.attr('transform', `translate(${transform.transformedX}, ${maxY / zoom - gbox.height - bgbox.y})`)
						}
						
					});
					break;
			}

			// 更新codebox
			this.uploadGroup();
			this.setSaveTime()
		},
		// 2.设置组合
		addGroup() {
			let groupId = 'group_';
			groupId += new Date().getTime();
			this.group.set.members.forEach((g, i) => {
				g.data('group', {
					groupId
				})
				g.draggable(false)
			})
			this.$set(this.group, 'isgroup', true);
		},
		// 3. 取消组合
		removeGroup() {
			if (this.toolType != 'group') return;
			this.group.set.members.forEach((g, i) => {
				g.data('group', '')
				g.draggable()
			})
			this.$set(this.group, 'isgroup', false)
		},
		// 4. 水平 和 垂直分布
		fenbuGroup(type) {
			let set = this.group.set;
			let sbox = set.bbox();
			let zoom = this.draw.viewbox().zoom;
			let dbox = this.draw.rbox();

			let arr = [];
			let gList = [];
			if (type == 'flatLine') {
				let minGroup = sbox.x;
				let maxGroup = sbox.x2;

				set.members.forEach((g, i) => {
					let gbox = g.rbox(this.draw);
					let x = gbox.x
					gList.push({
						x,
						g
					})
					arr.push(x)
				})
				arr.sort(function (a, b) {
					return a - b
				});
				let newArr = []
				arr.forEach((item, j) => {
					for (let index = 0; index < gList.length; index++) {
						if (arr[j] == gList[index].x) newArr.push(gList[index].g)
					}
				})
				let len = newArr.length
				let x = (newArr[len - 1].rbox(this.draw).cx - newArr[0].rbox(this.draw).cx) / (len - 1);
				for (let i = 1; i < newArr.length - 1; i++) {
					newArr[i].cx(sbox.x + newArr[0].bbox().cx + x * i)
				}

			} else {
				set.members.forEach((g, i) => {
					let gbox = g.rbox(this.draw);
					let x = gbox.y
					gList.push({
						x,
						g
					})
					arr.push(x)
				})
				arr.sort(function (a, b) {
					return a - b
				});
				let newArr = []
				arr.forEach((item, j) => {
					for (let index = 0; index < gList.length; index++) {
						if (arr[j] == gList[index].x) newArr.push(gList[index].g)
					}
				})
				let len = newArr.length
				let x = (newArr[len - 1].rbox(this.draw).cy - newArr[0].rbox(this.draw).cy) / (len - 1);
				for (let i = 1; i < newArr.length - 1; i++) {
					newArr[i].cy(sbox.y + newArr[0].bbox().cy + x * i)
				}
			}
			this.group.box = this.getGroupRelativePosition(set, sbox);
		},
		// 5.组合里面所有文字颜色设置
		groupText(color) {
			this.fontColorSelect = color;
			if (this.group.set) {
				this.group.set.members.forEach(g => {
					if (g.data('type') == 'text') {
						let svgGroup = g.first().first(), textGroup = svgGroup.last();
						if (textGroup.type == 'defs') {
							textGroup.remove();
							textGroup = svgGroup.last()
						}
						textGroup.attr({fill: color, stroke: color})
						let obj = g.data('obj')
						obj.fill = color
						g.data({obj})
					}
				})
			}
		},
		/* 组和功能 ↑ */
		getLastChild() { // 获取最后一个元素
			let last = this.draw.last();
			if (last.type == 'defs') {
				last.remove()
				last = this.draw.last()
			}
			if (last.data('type') == 'Masking') 
				last = last.previous();
			return last
		},
		moveMaking() { // 保持刀版在最上一层
			let last = this.getLastChild();
			if (last && this.model) last.after(this.model);
		},
		// 移动图层的顺序
		makeMove: function (msg) {
			if (!this.elementChecked) return;
			let last = this.getLastChild();
			switch (msg) {
				case 0:
					let next = this.elementChecked.next();
					next && next.after(this.elementChecked) // 上移
					this.model && last.after(this.model);
					break;
				case 1:
					let pre = this.elementChecked.previous();
					if (pre && pre.data('type') == 'background') return
					pre && pre.before(this.elementChecked); // 下移
					break;
				case 2: // 置于顶层
					last.after(this.elementChecked)
					this.model && this.elementChecked.after(this.model)
					break;
				case 3: // 置于底层
					let first = this.draw.first();
					if (first.data('type') == 'background') {
						first.after(this.elementChecked)
					} else {
						first.before(this.elementChecked)
					}
					break
			}
			this.elemDown(this.elementChecked.id())
		},

		// 公用的方法
		//1. 获取选中svgEle的属性
		getPosition: function (ele, screen = true) {
			var obj = {};
			var eleAttr = screen == true ? ele.rbox(this.draw) : ele.rbox();
			obj.x = eleAttr.x;
			obj.y = eleAttr.y;
			obj.width = eleAttr.width;
			obj.height = eleAttr.height;
			return obj;
		},
		drawWheel(e) { // 以鼠标为中心放大缩小画布
			if (this.toolType == 'text') {
				this.inputSetPath()
			}
			let drbox = this.draw.rbox(),
				parentWidth = this.$refs.editorSvg.offsetWidth,
				parentHeight = this.$refs.editorSvg.offsetHeight,
				width = this.$refs.drawing.offsetWidth,
				height = this.$refs.drawing.offsetHeight,
				oldwidth = width,
				oldheight = height,
				left = this.$refs.drawing.offsetLeft,
				top = this.$refs.drawing.offsetTop,
				mouseLeft = e.clientX - drbox.x,
				mouseTop = e.clientY - drbox.y,
				dbox = this.draw.viewbox(),
				ratio = dbox.height / dbox.width,
				scaleX = mouseLeft / width, // 计算鼠标x轴比例
				scaleY = mouseTop / height;// 计算鼠标y轴比例
			if (e.deltaY < 0) { // 放大
				width += 50;
				height = width * ratio;
			} else { // 缩小
				width -= 50;
				height = width * ratio;
			}
			if ( width > height ? (width < 200 ) : (height < 200 ) ) return
			if (width > height ? width > parentWidth : height > parentHeight) {
				left -= (width - oldwidth) * scaleX;
				top -= (height - oldheight) * scaleY;

			} else {
				left = (parentWidth - width) / 2;
				top = (parentHeight - height) / 2;
			}
			this.$refs.drawing.style.width = width + 'px'
			this.$refs.drawing.style.height = height + 'px'
			this.$refs.drawing.style.left = left + 'px'
			this.$refs.drawing.style.top = top + 'px'
			this.draw.size(width, height)
			this.setCanvasRatio = (width / this.draw.viewbox().width * 100).toFixed(0) + '%'
			this.ctrolView(width > height ? parentWidth : parentHeight, width > height ? width : height)
			this.setRefLine()
		},
		// 鼠标滚轮放大缩小事件
		svgWheel(e) {
			this.clearRectSelect();
			this.drawWheel(e);
		},
		//	画布底下控件
		adapt(msg) {
			if (this.toolType == 'text') {
				this.inputSetPath()
			}
            this.codeBox.isShow = false;
			let width = this.$refs.drawing.offsetWidth,
				height = this.$refs.drawing.offsetHeight,
				dbox = this.draw.viewbox(),
				ratio = dbox.height / dbox.width,
				parentWidth = this.$refs.editorSvg.offsetWidth,
				parentHeight = this.$refs.editorSvg.offsetHeight,
				left, top;
			switch (msg) {
				case 0:
					width = dbox.width
					height = dbox.height
					break;
				case 1:
					if (dbox.height < dbox.width) {
						width = parentWidth - 140;
						height = width * ratio;
					} else {
						height = parentHeight - 140;
						width = height / ratio;
					}
					break;
				case 2:
					width -= 50;
					height = width * ratio;
					break;
				case 3:
					width += 50;
					height = width * ratio;
					break;
			}
			if ( width > height ? (width < 200 ) : (height < 200 ) ) return
			left = (parentWidth - width) / 2;
			top = (parentHeight - height) / 2;
			this.$refs.drawing.style.left = left + 'px'
			this.$refs.drawing.style.top = top + 'px'
			this.$refs.drawing.style.width = width + 'px'
			this.$refs.drawing.style.height = height + 'px'
			this.setCanvasRatio = (width / dbox.width * 100).toFixed(0) + '%'
			this.draw.size(width, height);
			this.ctrolView(width > height ? parentWidth : parentHeight, width > height ? width : height)
			this.setRefLine()
		},
		setPageView(type) { // 计算拖放框口的位置和大小
			let view = this.draw.viewbox(),
				r = view.height /view.width,
				wVSh = view.width > view.height,
				drawRatio = 120 / this.draw.width(),
				width = 120,
				height = 120 * r,
				parentWidth = this.$refs.editorSvg.offsetWidth * drawRatio ,
				parentHeight = this.$refs.editorSvg.offsetHeight * drawRatio ,
				left = - this.$refs.drawing.offsetLeft * drawRatio + 20,
				top = - this.$refs.drawing.offsetTop * drawRatio + 20;
			this.pageViewOldPos.drawRatio = drawRatio;
			if (wVSh) {
				height + 40 <= parentHeight ? (()=>{
					parentHeight = height + 40;
					top = 0;
					this.pageViewOldPos.isTop = false;
				})()
				 : this.pageViewOldPos.isTop = true;
			} else {
				width + 40 <= parentWidth ? (()=>{
					parentWidth =  width + 40;
					left = 0;
					this.pageViewOldPos.isLeft = false
				})()
				: this.pageViewOldPos.isLeft = true
			}
			if (type) {
				this.$refs.pageViewParent.style.display = 'block'
				this.$refs.pageThumb.style.width = width + 'px';
				this.$refs.pageThumb.style.height = height + 'px';
				this.$refs.pageViewBox.style.width = parentWidth + 'px'
				this.$refs.pageViewBox.style.height = parentHeight + 'px'
				this.$refs.pageViewBox.style.left = left + 'px'
				this.$refs.pageViewBox.style.top = top + 'px'
			} else {
				this.$refs.pageViewParent.style.display = 'none'
				this.$refs.pageThumb.style.width = 0;
				this.$refs.pageThumb.style.height = 0;
			}
			
		},
		ctrolView(a , b) {
			if (a > b) this.setPageView(false)
			else this.setPageView(true)
		},
		/* 底部预览窗口一系列事件 ↓ */
		pageViewBoxDown(e) { //  同步缩放框里面可移动框
			this.clearRectSelect()
			this.pageViewOff = true;
			this.pageViewOldPos.ex = e.clientX;
			this.pageViewOldPos.ey = e.clientY;
			this.pageViewOldPos.left = this.$refs.pageViewBox.offsetLeft;
			this.pageViewOldPos.top = this.$refs.pageViewBox.offsetTop;
			this.pageViewOldPos.maxX = this.$refs.pageViewParent.offsetWidth - this.$refs.pageViewBox.offsetWidth;
			this.pageViewOldPos.maxY = this.$refs.pageViewParent.offsetHeight - this.$refs.pageViewBox.offsetHeight;
			
			document.addEventListener('mousemove', this.pageViewBoxMove)
			document.addEventListener('mouseup', this.pageViewBoxClose)
		},
		pageViewBoxMove(e) {
			if (!this.pageViewOff) return;
			let pageViewBox = this.$refs.pageViewBox;
			let drawing = this.$refs.drawing
			let x = e.clientX - this.pageViewOldPos.ex;
			let y = e.clientY - this.pageViewOldPos.ey;
			this.pageViewOldPos.ex = e.clientX;
			this.pageViewOldPos.ey = e.clientY;
			this.pageViewOldPos.left += x
			this.pageViewOldPos.top += y
			if (this.pageViewOldPos.left <= 0) {
				this.pageViewOldPos.left = 0;
			}
			if (this.pageViewOldPos.left >= this.pageViewOldPos.maxX) {
				this.pageViewOldPos.left = this.pageViewOldPos.maxX;
			}
			if (this.pageViewOldPos.top <= 0) {
				this.pageViewOldPos.top = 0;
			}
			if (this.pageViewOldPos.top >= this.pageViewOldPos.maxY) {
				this.pageViewOldPos.top = this.pageViewOldPos.maxY;
			}
			pageViewBox['style']['left'] = this.pageViewOldPos.left + 'px'
			pageViewBox['style']['top'] = this.pageViewOldPos.top + 'px'
			this.pageViewOldPos.isLeft ? drawing['style']['left'] = -(this.pageViewOldPos.left - 20) / (120 / this.draw.width()) + 'px' : ''
			this.pageViewOldPos.isTop ? drawing['style']['top'] = -(this.pageViewOldPos.top - 20) / (120 / this.draw.width()) + 'px' : ''
			this.setRefLine()
		},
		pageViewBoxClose() {
			this.pageViewOff = false;
			document.removeEventListener('mousemove', this.pageViewBoxMove)
			document.removeEventListener('mouseup', this.pageViewBoxClose)
		},
		setMask() { // 抓手工具
			this.allMask = !this.allMask
		},
		toggleGuide () { // 切换吸附参考线
			this.guide.off = !this.guide.off
		},
		addrefline(msg){ // 添加参考线
			let x = this.$refs.drawing.offsetLeft,
				y = this.$refs.drawing.offsetTop,
				w = this.$refs.drawing.offsetWidth,
				h = this.$refs.drawing.offsetHeight,
				pos;
			this.refLine.x = x;
			this.refLine.y = y;
			this.refLine.w = w;
			this.refLine.h = h;
			if (msg == 'x') {
				pos =  .5  ;
				this.refLine.lines.push({pos, type: 'x', off: false})
			} else {
				pos = .5;
				this.refLine.lines.push({pos, type: 'y', off: false})
			}
		},
		setRefLine() { // 更新参考线的位置
			this.refLine.x = this.$refs.drawing.offsetLeft;
			this.refLine.y = this.$refs.drawing.offsetTop;
			this.refLine.w = this.$refs.drawing.offsetWidth;
			this.refLine.h = this.$refs.drawing.offsetHeight;
		},
		refLineDown(e, item) { // 参考线按下
			this.refLine.down = true
			this.refLine.clientX = e.clientX;
			this.refLine.clientY = e.clientY;
			this.refLine.oldl = JSON.parse(JSON.stringify(item)) 
			this.refLine.l = item;
			document.addEventListener('mousemove', this.refLineMove)
			document.addEventListener('mouseup', this.refLineUp)
		},
		refLineMove(e) {
			if (!this.refLine.down) return;
			let x = e.clientX - this.refLine.clientX,
				y = e.clientY - this.refLine.clientY, r;
			if (this.refLine.l.type == 'x') {
				r = this.refLine.oldl.pos + x / this.refLine.w;
			} else {
				r = this.refLine.oldl.pos + y / this.refLine.h;
			}
			if (r > .49 && r < .51) r = .5;
			this.refLine.l.pos = r;
		},
		refLineUp() { // 参考线松开
			this.refLine.down = false;
			document.removeEventListener('mousemove', this.refLineMove)
			document.removeEventListener('mouseup', this.refLineUp)
		},
		handleRefLine(item) { // 点击参考线
			this.refLine.del = item
			this.toolType = this.tool_box == 'tool_refline'? '' : 'tool_refline'
			this.toolShow.father = true
		},
		handleDelete() { // 删除参考线
			this.refLine.lines.splice(this.refLine.del, 1)
			this.tool_box = ''
			this.toolShow.father = false
		},
		// 底部预览窗口一系列事件 ↑

		// toolface 滚动底部加载更多
		/* 页面所有切换显示动画start */
		// 1. 顶部工具扩展展示
		setToolBox(str, color) {
			this.rightBtn.show = false;
			this.tool_box = this.tool_box == str ? '' : str
			if (this.tool_box.indexOf('svg_tool') > -1) {
                this.fontColorSelect = color
				let i = this.tool_box.split('svg_tool')[1]
				this.handleFillIndex(i)
			}
			if (
				str == 'text_spacing' || 
				str == 'text_family' 
				) {
				this.setText('spacing')
			}
			if (str == 'text_color') { //拾取文字颜色
				this.draw && this.draw.children().forEach(item => {
					if (item.data('type') == 'text') {
						let fill = item.data('obj').fill
						fill && this.pickColor(fill)
					}
				})
			}
			
		},
		// 2. 字体类型切换
		setFamilyType(type) {
			this.familyType = type;
		},
		pickColor(fill) { // 检测颜色列表是否存在
			let color = colorToRGB(fill)
			this.useColor.indexOf(color) < 0 ? this.useColor.push(color) : ''
			this.useColor = [...new Set(this.useColor)]
			if (this.useColor.length > 12) this.useColor = this.useColor.slice(-12)
		},
		handleToggle() {//  切换顶部工具栏的显示和隐藏
			this.toggle = !this.toggle;
			this.clearRectSelect();
		},
		/* 页面所有切换显示动画 end */

		/* 下载文件 */
		// 图片转base64
		imageToBase(imageArr) {
			return Promise.all(Array.from(imageArr).map((image) => {
				var href = image.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || image.getAttribute('href');
				// href = href.replace('!w800.src', '');
				href = href.replace(this.$store.state.port.imgBaseUrl, 'http://aliyinsrc.oss-cn-shenzhen.aliyuncs.com/');
				// href += (href.indexOf('?') === -1 ? '?' : '&');
				if (!href) return Promise.resolve(null);
				return new Promise(function (resolve, reject) {
					var canvas = document.createElement('canvas');
					var img = new Image();
					img.crossOrigin = 'anonymous';
					img.onerror = function () {
						return reject(new Error('找不到 ' + href));
					};
					img.onload = function () {
						canvas.width = img.width;
						canvas.height = img.height;
						canvas.getContext('2d').drawImage(img, 0, 0);
						image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL('image/png'));
						resolve(true);
					};
					img.onerror = function() {
						image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '');
						resolve(true);
					}
					img.src = href;
				});
			}));
		},
		setDownAndPrint(type) { // 切换下载和印刷
			this.clickAllSavePage();
			this.dialog.off = true
			this.dialog.type = type
		},
		clickAllSavePage(show) { // 通用保存
			this.saveAllPage(show);
		},
		saveAllPage(show) { // 保存所有页面数据 并生成缩略图
			if (!this.saveAllpageBtn) return;
			let page = this.getSaveData();
			this.saveAllpageBtn = false;
			this.isSave = true;
			Promise.all(Array.from(page).map((item, i) => {
				return new Promise((resolve, reject) => {
					this.productThumbnail(item, i)
					.then(img => {
						
						item.Thumb = this.$store.state.port.nodeUrl + img+ `?v=${new Date().getTime()}`;
						item.ThumbPath = this.$store.state.port.nodeUrl + img+ `?v=${new Date().getTime()}`;
						this.$axios.put(this.saveUrl, item)
						.then(({data}) => {
							if (data.state = 'success') {
								this.CurrentTemplateData[i].Thumb = data.key
								resolve(true)
							}
						})
						.catch(err => reject(err))
					})
				})
			})).then(arr => {
				this.saveAllpageBtn = true;
				this.isSave = false;
				if (!show) return
				this.$message.closeAll()
				this.$message({type: 'success', message: '保存成功',customClass: 'info'})
			}).catch(err => {
				this.saveAllpageBtn = true;
				this.$message.closeAll()
				this.$message({type: 'warning', message: '服务器繁忙,请稍后再试...',customClass: 'info'})
			})
		},
		againFile() { // 重新生成PDF
			let page = this.getSaveData();
			let url = this.$store.state.port.DocumentPage;
			// console.log(1231)
		},
		// 生成PDF
		downloadFile() {
			// console.log(this.CurrentTemplateData)
			return Promise.all(Array.from(this.CurrentTemplateData).map((json, i) => {
				if (json.SvgContent == '') {
					json.SvgContent = `<svg></svg>`
				}
				let div = document.createElement('div')
				div.innerHTML = json.SvgContent;
				let svg = div.childNodes[0];
				// console.log(svg)
				div = null;
				let groupList = svg.querySelectorAll('g');
				let imageArr = svg.querySelectorAll('image');
				// console.log(svg)
				// 移除后台无法识别属性
				groupList.forEach(group => {
					group.removeAttribute('data-type')
					group.removeAttribute('data-obj')
					group.removeAttribute('data-group')
					group.removeAttribute('data-rotate')
				})
				return new Promise((resolve, reject) => {
					let zoom = this.draw.viewbox().zoom;
					this.imageToBase(imageArr).then(res => {
						// let canvas = SVG(svg);
						svg = svg.outerHTML
						svg = svg.replace(/xmlns:svgjs="http:\/\/svgjs.com\/svgjs"/ig, '')
						svg = svg.replace(/<g id="outBloodLine">.*?<\/g>/, '')
						svg = svg.replace(/<path id="outBloodLine".*?<\/path>/, '')
						svg = svg.replace('xmlns:svgjs="http://svgjs.com/svgjs"', '')
						// console.log(svg)
						resolve({svg})
					})
				})
			})).then(arr => {
				let obj = {
					arr,
					info: {
						title: this.formatDate(),
						pxwidth: this.draw.viewbox().width,
						pxheight: this.draw.viewbox().height,
						width: this.templateInfo.Size.Width,
						height: this.templateInfo.Size.Height,
						unit: this.templateInfo.Size.Unit
					}
				} 
				// 'http://localhost:5050' this.$store.state.nodeUrl `obj=${encodeURIComponent(JSON.stringify(obj))}`
				this.$axios.post(this.$store.state.port.nodeUrl + '/pdf/pro', obj, {
					responseType: 'blob'
				})
					.then((res) => {
						if (res.data == '') return new Error('没有生成的文件')
						let blob = res.data;
						let a = document.createElement('a');
						document.body.appendChild(a)
						a.target = '_blank'
						a.download = this.formatDate() + '.pdf'
						let url = URL.createObjectURL(blob);
						a.href = url;
						a.click();
						document.body.removeChild(a)
						this.dialog.success = true;
						window.URL.revokeObjectURL(url);
					})
					.catch(err => {
						this.dialog.success = true;
					})
			})
		},
		// 生成缩略图
		productThumbnail(item, index) {
			// console.log(item)
			if (!index) index = ''
			return new Promise((resolve, reject) => {
				let data = {
					svg: item.SvgContent,
					name: this.formatDate() + this.pagenum + index,
					width: 400
				};
				// this.$store.state.productThumbnail'http://localhost:5050/svgtopng'
				this.$axios.post(this.$store.state.port.productThumbnail, data)
				.then(({data}) => {
					let url = data.path;
					// 返回URL
					resolve(url);
				})
				
			})
		},
		// 生成png 并下载 或者 缩略图
		downPng() {
			// console.log(this.CurrentTemplateData, this.templateInfo)
			let list = [],
				view = this.draw.viewbox();
			this.CurrentTemplateData.forEach(item => {
				if (item.SvgContent == '') item.SvgContent = '<svg></svg>'
				list.push(item.SvgContent)
			})
			//'http://localhost:5050/downpng' this.$store.state.nodeUrl
			let obj = {
				name: this.formatDate(),
				list,
				width: view.width,
				height: view.height
			}
			this.$axios.post(this.$store.state.port.nodeUrl + '/downpng', obj, {
				responseType: 'blob'
			})
			.then(res => {
				// console.log(res)
				let blob = res.data;
				let a = document.createElement('a');
				document.body.appendChild(a)
				a.target = '_blank'
				if (list.length > 1) a.download = this.formatDate() + '.zip'
				else a.download = this.formatDate() + '.png'
				let url = URL.createObjectURL(blob);
				a.href = url;
				a.click();
				document.body.removeChild(a)
				this.dialog.success = true;
				window.URL.revokeObjectURL(url);
			})
			.catch(err => {
				this.dialog.success = true;
			})
		},
		// 格式化日期
		formatDate() {
			let 
				date = new Date(),
				y = date.getFullYear(),
				m = date.getMonth() + 1,
				id = (this.identity == 'Pages' ? this.templateInfo && this.templateInfo.DocumentNumber : this.templateInfo && this.templateInfo.TemplateNumber) || new Date().getTime();
			m = m < 10 ? '0' + m : m;
			let d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			return y + '-' + m + '-' + d + '-' + id;
		},
		closeDialog (type) { // 关闭下载和印刷对话框
			this.dialog.off = false
		},
		setDownType(type) { // 选择下载文件类型
			this.dialog.success = false;
			if (type) { // pdf
				this.downloadFile()
			} else { // png
				this.downPng()
			}
		},
		/* 吸附参考线 */
		getPoint (gr) { // 计算位置
			let _x, _x2, _y, _y2, _cx, _cy;
			_x = gr.x;
			_y = gr.y;
			_x2 = gr.x2;
			_y2 = gr.y2;
			_cx = gr.cx;
			_cy = gr.cy;
			return {_x, _x2, _y, _y2, _cx, _cy}
		},
		getAllElemPos() { // 获取所有元素的位置
			let zoom = this.draw.viewbox().zoom,
				drbox = this.draw.rbox(this.draw);
			let x = [], y = [], selectBox = {}, dx = [], dy = [],
				rbox = null;
			if (this.toolType == 'group') {
				rbox = this.group.set.bbox();
			} else {
				rbox = this.elementChecked.rbox(this.draw)
			}
			selectBox.x = rbox.x;
			selectBox.y = rbox.y;
			selectBox.x2 = rbox.x2;
			selectBox.y2 = rbox.y2;
			selectBox.cx = rbox.cx;
			selectBox.cy = rbox.cy;
			dx = [0, drbox.cx, drbox.x2];
			dy = [0, drbox.cy, drbox.y2];
			this.draw.children().forEach(group => {
				if (this.toolType == 'group') {
					if (!this.group.set.has(group) && group.data('type') != 'Masking') {
						let gr = group.rbox(this.draw);
						let {_x, _x2, _y, _y2, _cx, _cy} = this.getPoint(gr);
						// console.log(_x, _x2, _y, _y2, _cx, _cy)
						x.push(_x, _x2, _cx)
						y.push(_y, _y2, _cy)
					}
				} else {
					if (group.id() != this.elementChecked.id() && group.data('type') != 'Masking') {
						let gr = group.rbox(this.draw), gb = group.bbox();
						let {_x, _x2, _y, _y2, _cx, _cy} = this.getPoint(gr);
						x.push(_x, _x2, _cx)
						y.push(_y, _y2, _cy)
					}
				}

			})
			this.refLine.lines.forEach(item => {
				if (item.type == 'x') {
					x.push(drbox.width * item.pos)
				} else {
					y.push(drbox.height * item.pos)
				}
			})
			this.guide.selectBox = selectBox;
			this.guide.arr = [x, y, dx, dy];
		},
		setSelectBox (_x, _y) { // 计算选中元素的吸附坐标
			this.guide.selectBox.x += _x;
			this.guide.selectBox.y += _y;
			this.guide.selectBox.x2 += _x;
			this.guide.selectBox.y2 += _y;
			this.guide.selectBox.cx += _x;
			this.guide.selectBox.cy += _y;
		},
		setSelectGuide() { // 计算最近的边界
			let arr = this.guide.arr,
				selectBox = this.guide.selectBox,
				l, t, r, b,cx, cy, dl, dt, dr, db, dcx, dcy;
				l = this.compare(arr[0], selectBox.x)
				r = this.compare(arr[0], selectBox.x2)
				t = this.compare(arr[1], selectBox.y)
				b = this.compare(arr[1], selectBox.y2)
				cx = this.compare(arr[0], selectBox.cx)
				cy = this.compare(arr[1], selectBox.cy)
				dl = this.compare(arr[2], selectBox.x)
				dr = this.compare(arr[2], selectBox.x2)
				dt = this.compare(arr[3], selectBox.y)
				db = this.compare(arr[3], selectBox.y2)
				dcx = this.compare(arr[2], selectBox.cx)
				dcy = this.compare(arr[3], selectBox.cy)
				// console.log(dcx.n)
			return {l,r,t,b,cx,cy, dl, dt, dr, db, dcx, dcy}
		},
		compare(arr, point) { // 比较
			let n = 10000000, size = null;
			
			arr.forEach((item, i) => {
				let _x = Math.abs(point - item)
				if (_x < n) {
					n = _x;
					size = item
				}
			})
			return {n, size}
		},
		setGroupGuide({x, y}) { // 设置群组的吸附
			x && this.group.set.x(x)
			y && this.group.set.y(y)
		},
		WS () {

			let http = 'ws://ws.aliyin.com'//ws.aliyin.com 192.168.3.100:8888
			this.wsServer = new WebSocket(http);
			this.wsServer.onopen =  (e) => {
				// this.wsServer && this.wsServer.send('sffsfsd') //向后台发送数据
			};
			this.wsServer.onclose = (e) => { //当链接关闭的时候触发
				this.wsServer = new WebSocket(http);
			};
			this.wsServer.onmessage = (e) => { //后台返回消息的时候触发
				console.log(e)
				if (e.data != 'ok') {
					this.wsMssage = e.data
				}
			};
			this.wsServer.onerror = (e) => { //错误情况触发
				this.wsServer = new WebSocket(http);
			}
			
		},
		selectColorType(obj) { // 选择颜色设置
			if (obj.type) {
				this.fontColor(obj.color)
			} else {
				this.handleSvgFill(obj.color)
			}
		}
	},
	
	
	computed: {
		// 字体大小的范围
		setSizeScoped() {
			let arr = [];
			for (let i = 16; i <= 200; i++) {
				arr.push(i);
			}
			return arr;
		},
		// 组合里面的元素大于2个才显示功能
		groupLength() {
			if (this.group.set !== null && this.group.set.members.length > 1)
				return true;
			else return false;
		},
		// 换算选中元素的位置大小为HTML元素
		codeBoxComputed() {
			// console.log(Math.abs(this.codeBox.height) + 'px', '计算')
			let style = `left: ${this.codeBox.x}px; top: ${this.codeBox.y}px;width: ${Math.abs(this.codeBox.width)}px;height: ${Math.abs(this.codeBox.height)}px; transform: rotate(${this.codeBox.rotate}deg);display: ${this.codeBox.isShow ? 'block' : 'none'};`
			// console.log(style)
			this.$refs.box && (this.$refs.box.style.height = Math.abs(this.codeBox.height) + 'px')
			return style
			
		},
		// 吸附参考线的位置
		setGuide() {
			let drbox = this.draw.rbox(), 
				drawrbox = this.draw.rbox(this.draw);
			let grbox, gbbox, x1, x2, y1, y2, cx, cy, 
				zoom = this.draw.viewbox().zoom,
				off = {
					l: false, t: false, r: false, b: false,
					cx: false, cy: false, 
					left: false, top: false, right: false, bottom: false,
					_cx: false, _cy: false
				},
				selectBox = this.guide.selectBox,
				obj = this.setSelectGuide();
			if (this.toolType == 'group') {
				gbbox = grbox = this.group.set.bbox();
				x1 = (grbox.x * zoom);
				x2 = (grbox.x * zoom) + grbox.width * zoom;
				y1 = (grbox.y * zoom);
				y2 = (grbox.y * zoom) + grbox.height * zoom;
				cx = (grbox.x * zoom) + grbox.width / 2 * zoom;
				cy = (grbox.y * zoom) + grbox.height / 2 * zoom;
				if (obj.l.n < (5 / zoom)) {
					this.codeBox.x = drbox.x + obj.l.size * zoom
					off.left = true
				} else if (obj.r.n < (5 / zoom)) {
					this.codeBox.x = drbox.x + (obj.r.size - gbbox.w) * zoom
					off.right = true
				} else if (obj.cx.n < (5 / zoom)) {
					this.codeBox.x = drbox.x + (obj.cx.size - gbbox.w / 2) * zoom;
					off._cx = true
				} else if (obj.dl.n < (5 / zoom) ) { // elem + left
					this.codeBox.x = drbox.x + (obj.dl.size) * zoom
					obj.dl.size >= drawrbox.x2 - 30 ? off.r = true : obj.dl.size < drawrbox.cx - 30? off.l = true : off.cx = true
				} else if(obj.dr.n < (5 / zoom)) { // elem + left
					this.codeBox.x = drbox.x + (obj.dr.size - gbbox.w) * zoom
					obj.dr.size >= drawrbox.x2 - 30 ? off.r = true : obj.dr.size < drawrbox.cx - 30 ? off.l = true : off.cx = true
				}
				if (obj.dcx.n < (5 / zoom)) {
					this.codeBox.x = drbox.x + (obj.dcx.size - gbbox.w / 2) * zoom;
					obj.dcx.size >= drawrbox.x2 - 30 ? off.r = true : obj.dcx.size < drawrbox.cx - 30 ? off.l = true : off.cx = true
				} 

				if (obj.t.n < (5 / zoom)) {
					this.codeBox.y = drbox.y + obj.t.size * zoom
					off.top = true
				} else if (obj.b.n < (5 / zoom)) {
					this.codeBox.y = drbox.y + (obj.b.size - gbbox.h) * zoom
					off.bottom = true
				} else if (obj.cy.n < (5 / zoom)) {
					this.codeBox.y = drbox.y + (obj.cy.size - gbbox.h / 2) * zoom;
					off._cy = true
				} else if (obj.dt.n < (5 / zoom)) { // elem + top
					this.codeBox.y = drbox.y + (obj.dt.size) * zoom
					obj.dt.size >= drawrbox.y2 - 30 ? off.b = true : obj.dt.size < drawrbox.cy - 30? off.t = true : off.cy = true
				} else if(obj.db.n < (5 / zoom)) { // elem + top
					this.codeBox.y = drbox.y + (obj.db.size - gbbox.h) * zoom
					obj.db.size >= drawrbox.y2 - 30 ? off.b = true : obj.db.size < drawrbox.cy - 30? off.t = true : off.cy = true
				} 
				if (obj.dcy.n < (5 / zoom)) {
					this.codeBox.y = drbox.y + (obj.dcy.size - gbbox.h / 2) * zoom;
					obj.dcy.size >= drawrbox.y2 - 30 ? off.b = true : obj.dcy.size < drawrbox.cy - 30? off.t = true : off.cy = true
				} 
			} else {
				grbox = this.elementChecked.rbox();
				gbbox = this.elementChecked.bbox();
				x1 = grbox.x - drbox.x;
				x2 = grbox.x - drbox.x + grbox.width;
				y1 = grbox.y - drbox.y;
				y2 = grbox.y - drbox.y + grbox.height;
				cx = grbox.x - drbox.x + grbox.width / 2;
				cy = grbox.y - drbox.y + grbox.height / 2;
				if (obj.l.n < (5 / zoom)) {
					this.codeBox.x = drbox.x + (obj.l.size - gbbox.x) * zoom
					off.left = true
				} else if (obj.r.n < (5 / zoom)) {
					this.codeBox.x = drbox.x + (obj.r.size - gbbox.w - gbbox.x) * zoom
					off.right = true
				} else if (obj.cx.n < (5 / zoom)) {
					this.codeBox.x = drbox.x + (obj.cx.size - gbbox.w / 2 - gbbox.x) * zoom;
					off._cx = true
				} else if (obj.dl.n < (5 / zoom) ) { // elem + left
					this.codeBox.x = drbox.x + (obj.dl.size - gbbox.x) * zoom
					obj.dl.size >= drawrbox.x2 - 30 ? off.r = true : obj.dl.size < drawrbox.cx - 30? off.l = true : off.cx = true
				} else if(obj.dr.n < (5 / zoom)) { // elem + left
					this.codeBox.x = drbox.x + (obj.dr.size - gbbox.w - gbbox.x) * zoom
					obj.dr.size >= drawrbox.x2 - 30 ? off.r = true : obj.dr.size < drawrbox.cx - 30 ? off.l = true : off.cx = true
				}
				if (obj.dcx.n < (5 / zoom)) {
					this.codeBox.x = drbox.x + (obj.dcx.size - gbbox.w / 2 - gbbox.x) * zoom;
					obj.dcx.size >= drawrbox.x2 - 30 ? off.r = true : obj.dcx.size < drawrbox.cx - 30 ? off.l = true : off.cx = true
				} 

				if (obj.t.n < (5 / zoom)) {
					this.codeBox.y = drbox.y + (obj.t.size - gbbox.y) * zoom
					off.top = true
				} else if (obj.b.n < (5 / zoom)) {
					this.codeBox.y = drbox.y + (obj.b.size - gbbox.h - gbbox.y) * zoom
					off.bottom = true
				} else if (obj.cy.n < (5 / zoom)) {
					this.codeBox.y = drbox.y + (obj.cy.size - gbbox.h / 2 - gbbox.y) * zoom;
					off._cy = true
				} else if (obj.dt.n < (5 / zoom)) { // elem + top
					this.codeBox.y = drbox.y + (obj.dt.size - gbbox.y) * zoom
					obj.dt.size >= drawrbox.y2 - 30 ? off.b = true : obj.dt.size < drawrbox.cy - 30? off.t = true : off.cy = true
				} else if(obj.db.n < (5 / zoom)) { // elem + top
					this.codeBox.y = drbox.y + (obj.db.size - gbbox.h - gbbox.y) * zoom
					obj.db.size >= drawrbox.y2 - 30 ? off.b = true : obj.db.size < drawrbox.cy - 30? off.t = true : off.cy = true
				} 
				if (obj.dcy.n < (5 / zoom)) {
					this.codeBox.y = drbox.y + (obj.dcy.size - gbbox.h / 2 - gbbox.y) * zoom;
					obj.dcy.size >= drawrbox.y2 - 30 ? off.b = true : obj.dcy.size < drawrbox.cy - 30? off.t = true : off.cy = true
				} 
			}
				this.rectDraw();
			return {
				x1,
				x2,
				y1,
				y2,
				cx,
				cy,
				off,
				_x: this.codeBox.x,
				_y: this.codeBox.y,

			}
		},
		getTextBox() { // 计算拖拽元素
			if (!this.dragAndDrop) return '';
			let style = '';
			style = `width: ${this.dragAndDrop.width}px;height:${this.dragAndDrop.height}px;left:${this.dragAndDrop.left}px;top:${this.dragAndDrop.top}px;display:${this.dragAndDrop.display || 'block'};${this.dragAndDrop.transform && this.dragAndDrop.transform}`
			return style
			
		},
		// 换算copy元素的位置和宽高
		setCopyBoxComputed() {
			return {
				left: this.copyBox.x + "px",
				top: this.copyBox.y + "px",
				width: this.copyBox.width + "px",
				height: this.copyBox.height + "px",
				display: this.copyBox.display ? 'block' : 'none',
                transition: this.copyBox.transform  || 'none'
			};
		},
		getPageData() { // 获取当前实时的页面数据
			return this.CurrentTemplateData;
		},
		// 右侧预览图计算数据
		CurrentTemplateDataComputed() {
			if (!this.templateInfo) return
			let ratio = this.templateInfo.Size.Height / this.templateInfo.Size.Width;
			let arr = [], faceimg = '';
			this.CurrentTemplateData.forEach(temp => {
				if (temp.Thumb && temp.Thumb.indexOf('http')) temp.Thumb = 'http://img.aliyin.com/' + temp.Thumb
				arr.push({
					PageId: temp.PageId,
					Thumb: temp.Thumb && temp.Thumb,
					_html: temp.SvgContent
				});
			});
			return {
				list: arr,
				ratio,
			};
		},

		/* 顶部工具栏计算属性 */
		// svg填充跟随
		svgToolPosition() {
			if (this.tool_box.indexOf('svg_tool') > -1) {
				let r = this.tool_box.split('svg_tool')[1]
				r = r * 35 + 'px'
				return {
					show: this.tool_box,
					left: r
				}
			} else {
				return {
					show: 'svg_tool0',
					left: 0
				}
			}
		},
		//是否可以撤销
		setundo() {
			let un = this.svgHistory.length
			let re = this.svgRedoList.length
			return {
				un,
				re
			}
		},
		getElemIndex () { // 返回当前元素的位置
			let up = null, down = null;
			if (!this.draw) return {up: false, down: false};
			let childList = this.draw.children(),
				elemIndex = this.elemIndex || 0,
				length = childList.length,
				first = childList[0],
				last = childList[length - 1];
				// console.log(`elemIndex: ${elemIndex}, length: ${length-1}`)
			if (last && last.data('type') == 'Masking') length -= 2
			else length -= 1
			if (elemIndex < length) {
				up = true;
			} else {
				up = false;
			}
			if (elemIndex <= 1) 
				down = false
			else 
				down = true
				
			return {up, down}
		},
		textStyle() {
			let obj = this.textObj,
				style = `
					font-family: ${obj.family};
					color: ${obj.fill};
					text-align: ${obj.align};
					text-decoration: ${obj.underline == 0? '' : 'underline'};
					font-style: ${obj.itailic == 0? '' : 'italic'};
					font-weight: ${obj.bold == 0 ? '' : 'bold'};
					line-height:  ${obj.line};
					letter-spacing: ${obj.spacing}em;
					word-break: break-all;
					font-size:${obj.size}px;margin:0;padding:0;`;
			return style
		},
		headerParams() {
			// console.log(this.templateInfo,123)
			return {
				identity: this.identity == 'Pages' ? false : true,
				tempNum: this.templateInfo != null ? this.templateInfo.TemplateNumber : '',
				productId: this.templateInfo != null ? this.templateInfo.Size.TypeID : '',
				OnlinePrint_Status: this.templateInfo != null ? this.templateInfo.ProductType.OnlinePrint_Status : '',
				design_title: this.design_title
			}
		},

		bleedLine () { // 出血线计算
			let top = 0, right = 0, bottom = 0, left = 0;
			//&& !this.templateInfo.Size.Masking
			if (this.templateInfo ) {
				let size = this.templateInfo.Size;
				top = size.CutSizeTop / size.Height * 100;
				right = size.CutSizeRight  / size.Width * 100;
				bottom = size.CutSizeBottom  / size.Height * 100;
				left = size.CutSizeLeft  / size.Width * 100;
			}
			return {top, right, bottom, left}
		},
		zoom() {
			return this.draw.viewbox().zoom;
		},
		getPreviewState() { // 获取预览数据
			return this.preview
		}
	},
	destroyed() {
		window.removeEventListener("keyup", this.keycode);
		window.removeEventListener("resize", this.setCanvasResize);
	},

	watch: {
		// 监控渲染数据
		loadTemplate(data) {
			this.handleLoadTemplate(data);
		},
		
		wsMssage(data) {
		},
	}
};