<template>
	<div class="dialog">
		<div class="close-btn" @click="close"></div>
			<div v-if="dialog.success">
				<!-- 切换按钮 -->
				<div class="dialog-btn">
					<div :class="{'btn-item': true,  'btn-active': toggleType == 'down'? true : false}" @click="toggle('down')">
						<div class="down"></div>
						<span>下载文件</span>
					</div>
					<div 
						v-if="info.ProductType.OnlinePrint_Status"
						:class="{'btn-item': 1,'btn-active': toggleType == 'print'? true : false}" @click="toggle('print')">
						<div class="print"></div>
						<span>在线印刷</span>
					</div>
				</div>
				
				<div class="dialog-content">
					<!-- 下载 -->
					<div v-if="toggleType == 'down'">
						<div class="content-item">
							<div>产品类别：</div>
							<div>{{info.Size.Alias}}</div>	
						</div>
						<div class="content-item">
							<div>文件名称：</div>
							<div>{{info.Name}}</div>	
						</div>
						<div class="content-item">
							<div>P数：</div>
							<div>
								<!--  @click="setProduct('Pages', i)" v-for="(item,i) in production.Pages" :key="i" : 1,'select-item':1, active: item.IsDefault}-->
								<span style="padding: 0;" class="item-title">{{(info.Pages && info.Pages.length) || info.TemplatePages.length}}P</span>
							</div>	
						</div>
						<div class="content-item">
							<div>尺寸：</div>
							<div>
								<span style="display: inline-block;font-size: 14px; border-radius:5px; height:32px;line-height: 32px;text-align:center; cursor: pointer">{{`${info.Size.ProductWidth}x${info.Size.ProductHeight}${info.Size.Unit}`}}</span>
							</div>	
						</div>
						<div class="content-item">
							<div>文件类型：</div>
							<div class="item-type">
								<span class="type-title" :class="{'active': !fileType}" @click="selectType(0)">
									<span class="png"></span>
									标清文件(png)
								</span>
								<span class="type-title" :class="{'active': fileType}" @click="selectType(1)">
									<span class="pdf"></span>
									高清文件(pdf)
								</span>
								<span class="type-title" style="display: none;">
									<span class="vip"></span>
									<span style="display:inline-block;">升级会员免费无限下载</span> <sup style="display:inline-block;transform:translateY(-5px)">荐</sup>
								</span>
							</div>	
						</div>
						<div class="content-item" style="margin-bottom: 0">
							<div style="text-align:center;color: #6094e9;">您的打赏,是我的动力</div>
							<!-- <div><span>¥ 8.00</span></div>	 -->
						</div>
						<div class="content-qr">
							<div style="width: 200px;margin:0 auto;">
								<img class="qr-img" src="/img/qrcode.png"  alt=""></div>
							<div class="qr-icon">微信扫码</div>
						</div>
						<div class="pay" style="padding: 0 150px;">
							<div class="pay-item" @click="goDown">确定下载</div>
							<div class="pay-item" @click="close">继续修改</div>
						</div>
					</div>
					<!-- 印刷 -->
					<div v-else>
						<div class="content-item">
							<div>产品类别：</div>
							<div>
								<span style="display: inline-block;margin-right: 30px;">{{info.Size.Alias}}</span>
								<span class="promise">
									<font style="background:#E81623">邮</font>
									全国包邮
								</span>
								<span class="promise">
									<font style="background:#F3960A">票</font>
									报销发票
								</span>
								<span class="promise">
									<font style="background:#54BE59">送</font>
									送货上门
								</span>
								<span class="promise">
									<font style="background:#2292E9">近</font>
									就近印刷
								</span>
								<a :href="`/print/printdetail?id=${info.TypeId}`" target="_blank" class="understand">了解更多></a>
							</div>	
						</div>
						<div class="content-item">
							<div>文件名称：</div>
							<div>{{info.Name}}</div>	
						</div>
						<div class="content-item">
							<div>P数：</div>
							<div v-if="production.Pages.length">
								<!-- @click="setProduct('Pages', i)" -->
								<span style="cursor: auto;padding: 0;" class="item-title">{{(info.Pages && info.Pages.length) || info.TemplatePages.length}}P</span>
							</div>	
						</div>
						<div class="content-item">
							<div>尺寸：</div>
							<div>
								<span style="display: inline-block;font-size: 14px; border-radius:5px; height:32px;line-height: 32px;text-align:center;">{{`${info.Size.ProductWidth}x${info.Size.ProductHeight}${info.Size.Unit}`}}</span>
							</div>	
						</div>
						<div class="content-item" v-for="(item, i) in production.Attributes" :key="i">
							<div>{{item.Name}}：</div>
							<div>
								<span @click="setProduct('Attributes', i, 'Items', index)" v-for="(item,index) in item.Items" :key="index" :class="{'select-item': true, 'item-title':true, active: item.IsDefault}">{{item.Name}}</span>
							</div>
						</div>
						<div class="content-item" v-if="production.Crafts.length">
							<div>工序：</div>
							<div>
								<span @click="setProduct('Crafts', i)" v-for="(item,i) in production.Crafts" :key="i" :class="{'select-item': true, 'item-title':true, active: item.IsDefault}">{{item.Name}}</span>
							</div>
						</div>
						<div class="content-item">
							<div>数量：</div>
							<div>
								<span @click="setProduct('Quantities', i)" v-for="(item,i) in production.Quantities" :key="i" :class="{'select-item': true, 'item-title':true, active: item.IsDefault}">{{item.Number + production.ProductType.Unit}}</span>
							</div>
						</div>
						
						<div class="coupons" v-if="Coupons.length">
							<div>热门优惠劵：</div>
							<div style="display: flex; flex-wrap: wrap;">
								<div v-for="(item,i) in Coupons" :key="i" 
								:class="{'coupons-mask': 1, 'coupons-mask-active': item.isSelect }"
									 @click="(item.LimitPrice <= oldTotalPirce) && addCoupons(i)"
								>
									<img :class="item.LimitPrice > oldTotalPirce ? 'no-meet' : ''" 
									style="display: block;width: 100%;"
									
									:src="$store.state.port.imgBaseUrl + item.ImageUrl" 
									>
									
									<div 
										v-if="item.LimitPrice < oldTotalPirce"
										@click.stop="!item.IsReceived && getCoupons(item, i)"
										class="coupons-title">
										 <span>{{!item.IsReceived ? '点击领取' : '已领取'}}</span>
										</div>
									<div v-if="item.LimitPrice > oldTotalPirce" class="coupons-adopt">
										<span>未满足条件不可使用</span>
									</div>
								</div>
							</div>
						</div>
						
						<div class="content-item">
							<div>参考价格：</div>
							<div style="color:#FF0000;font-size: 24px;height: 30px;">¥ {{TotalPrice.toFixed(2)}}<span v-if="couponsDetail.isSelect" style="padding-left: 20px;font-size: 14px;">(已优惠{{couponsDetail.Amount}}元)</span></div>
						</div>
						<div class="pay" v-if="!identity">
							<div class="pay-item" @click="alginClick && addCar(true)">下单付款</div>
							<div class="pay-item" @click="addCar(false)">加入购物车</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 下载中 -->
			<div v-else style="width:100%;height: 100%;display: flex;justify-content: center;align-items: center;">
				<div style="margin-top: -30px;">
					<DownloadWait></DownloadWait>
				</div>
			</div>
	</div>
</template>

<script>
import DownloadWait from '@/components/design/downloadWait.vue'
import Cookies from 'js-cookie'
export default {
	name: 'preivew',
	props: ['info', 'dialog', 'Thumb'],
	components: {
		DownloadWait
	},
	data () {
		// 获取身份
		let identity = this.$route.params.t;
		identity = window.atob(identity).split('&')
		if (identity.length > 1) identity = true;
		else {
			identity = identity[0].split('=')[0] == 'TemplateNumber' ? true : false
		}
		return {
			identity, // 身份
			toggleType: this.dialog.type, // 切换下载和印刷
			production: { // 产品的规格
				Attributes: [], // 属性
				Crafts: [], // 工序
				Pages: [], // P数
			}, // 产品规格
			product: { // 选中的规格
				index: 0
			},
			Coupons: [], // 优惠券
			couponsIndex: null, // 优惠券下标
			couponsDetail: '', // 优惠的价格
			printprice: { // 获取价格的参数
				SheetId: null, 
				SizeId: null,
				PageId: null,
				QuantityId: null,
				Attributes: null,
				Crafts: null,
				Urgent: null,
				Count: 0, // 数量
				OrderType: 3,// 
				FileName: this.info.Name,
				FilePath: '',
				DocumentNum: '',
				Selected: true
			},
			oldTotalPirce: 0, // 实际价格
			TotalPrice: 0, // 获取当前规格计算总价格
			fileType: 0, // 选择文件类型
			Qr: '', // 支付二维码
			myCar: [], // 购物车
			alginClick: true, // 多次点击
		}
	},
	methods: {
		close () { // 关闭对话框
			this.$emit('close', false)
		},
		toggle(num) { // 切换下载和印刷
			this.toggleType = num
		},
		/* 印刷方法 ↓ */
		getSize () { // 获取印刷规格
			new Promise((resolve, reject)=>{
				this.$axios.get('/ProductSheet?TypeID=' + this.info.Size.TypeID)
				.then(res => {
					if (res.data == '') return console.log('没有任何数据返回')
					this.production = res.data[0]
					// console.log(this.production,)
					this.Coupons = this.production.Coupons;
					let SheetId = this.production.ID,
						SizeId = this.info.SizeId,
						PageId = this.getIsDefault(this.production.Pages),
						QuantityId = this.getIsDefault(this.production.Quantities),
						Attributes = '',
						Crafts = '',
						Urgent = false,
						OrderType = 3,
						FileName = this.info.Name,
						FilePath = '',
						DocumentNum = this.info.DocumentNumber,
						Thumb = this.Thumb[0].Thumb,
						Selected = 1;
					this.production.Attributes.forEach(item => {
						item['Items'].forEach(temp => {
							if (temp['IsDefault']) {
								Attributes += temp.ID + ','
							}
						})
					})
					if (!Attributes) {
						this.production.Attributes[0]['Items'][0]['IsDefault'] = true;
						Attributes += this.production.Attributes[0]['Items'][0].ID
					}
					if(Attributes.lastIndexOf(',') == Attributes.length - 1) Attributes = Attributes.slice(0, -1)
					resolve({SheetId, SizeId, PageId, QuantityId, Attributes, Crafts, Urgent, OrderType, FileName, FilePath, DocumentNum,Thumb,Selected})
				})
			}).then(obj => {
				// console.log(obj)
				this.printprice = obj
				this.getPrintprice(this.printprice)
			})
			// this.$axios.get('/Coupons')
			// .then(res => {
			// 		this.Coupons = (res && res.data) || []
			// })
		},
		getCoupons (item, i) { // 领取优惠券
			if (item.ID == '') return
			let formdata = new FormData()
			 formdata.append('CouponID', item.ID)
			this.$axios.post('UserCoupon', formdata)
			.then(({data}) => {
				if (data.status == 'success') {
					item.IsReceived = 1;
					this.$message.closeAll();
					this.$message({type: 'success', message: data.msg, customClass: 'info'})
				}
			})
		},
		addCoupons(i) {
			this.couponsIndex = i;
			this.Coupons.forEach((c, index) => {
				if (i == index) c.isSelect = !c.isSelect;
				else c.isSelect = false
			})
			this.TotalPrice = this.Coupons[i].isSelect ? (this.oldTotalPirce - this.Coupons[i].Amount) : this.oldTotalPirce;
			// console.log(this.oldTotalPirce , this.Coupons[i])
			this.couponsDetail = this.Coupons[i]
		},
		getPrintprice(obj) { // 获取报价结果
			let formdata = new FormData()
			for (let item in obj) {
				formdata.append(item, obj[item])
			}
			this.$axios.post(this.$store.state.port.print.printprice, formdata)
			.then(res => {
				// console.log(res)
				this.TotalPrice = res.data.TotalPrice || 0
				this.oldTotalPirce = res.data.TotalPrice || 0;
				this.couponsIndex != null && (()=>{
					if (this.Coupons[this.couponsIndex].isSelect && (this.Coupons[this.couponsIndex].LimitPrice <= this.oldTotalPirce)) {
						this.TotalPrice = this.oldTotalPirce - this.Coupons[this.couponsIndex].Amount;
					} else {
						this.Coupons[this.couponsIndex].isSelect = false;
					}
				})()
			})
		},
		getIsDefault(arr) { // 获取推荐规格
			let id;
			for (let i = 0; i < arr.length; i++) {
				
				if (arr[i]['IsDefault']) id = arr[i].ID
				if (arr[i]['Items']) {
					arr[i]['Items'].forEach(item => {
						if (item['IsDefault']) id = item.ID
					})
				}
			}
			if (!id) {
				if (arr[0]['IsDefault'] == false) {
					arr[0]['IsDefault'] = true
					id = arr[0].ID
				} else {
					arr[0]['Items']['IsDefault'] = true
					id = arr[0]['Items'].ID
				}
			} 
			return id
		},
		setProduct(type, i, child, index) { // 选择设置产品规格
			let arr = this.production[type], newIndex = i;
			if (child) {
				arr = arr[i][child]
				newIndex = index
			} 
			this.setIsDefault(arr, newIndex, type)
		},
		setIsDefault(arr, index, type) { // 设置默认规格
			let Crafts = '', Attributes = '';
			for (let i = 0; i < arr.length; i++) {
				if(type != 'Crafts') {
					arr[i]['IsDefault'] = false
					if (i == index) {
						arr[i]['IsDefault'] = true
						switch (type) {
							case 'Pages':
								this.printprice.PageId = arr[i].ID
							break;
							case 'Quantities':
								this.printprice.QuantityId = arr[i].ID
							break;
							case 'Urgent':
							break;
						}	
					}
				} else {
					if (i == index)
						arr[i]['IsDefault'] = arr[i]['IsDefault'] ? false : true
				}
			}
			this.production.Attributes.forEach(item => {
				item['Items'].forEach(temp => {
					if (temp['IsDefault']) {
						Attributes += temp.ID + ','
					}
				})
			})
			this.production.Crafts.forEach(item => {
				if (item['IsDefault'])
					Crafts += item.ID + ','
			})
			if(Attributes.lastIndexOf(',') == Attributes.length - 1) Attributes = Attributes.slice(0, -1)
			if (Crafts.lastIndexOf(',') == Crafts.length - 1) Crafts = Crafts.slice(0, -1)
			this.printprice.Attributes = Attributes
			this.printprice.Crafts = Crafts
			this.getPrintprice(this.printprice)
		},
		addCar (type) { // 加入购物车
			this.alginClick = false;
			let data = new FormData();
			data.append('documentnum', this.info.DocumentNumber)
			this.$axios.post('/ShopDocument',data)
			.then(({data}) => {
				this.alginClick = true;
				if (data.state == 'ok') {
					this.printprice.DocumentNum = data.msg;
					// console.log(this.printprice, '添加参数')
					new Promise((resolve,reject) => {
						this.$store.commit('addShopingCar', this.printprice)
						let cook = this.$myParseCookie(this.$store.state.productionObj)
						this.$cookies.set('myCar', cook, {path: '/'}) 
						resolve(true)
						}).then(res => {
						if (res) {
							if (type) {
								this.$router.push('/order/submitOrder?t=order')
							} else {
								this.$confirm('加入购物车成功, 是否去提交订单?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'success'
								}).then(() => {
									this.$router.push('/order/shoppingCart')
								}).catch(() => {         
									this.close()
								});
							}
						}
					})
				} else {
					this.$message(data.msg)
				}
			})
			.catch(err => this.alginClick = true)
			

		},
		/* 印刷方法 ↑ */
		/* 下载方法 ↓ */
		selectType (type) { // 选择文件类型
			this.fileType = type
		},
		goDown () { // 确定下载
			this.$emit('setDownType', this.fileType)
		},
		getQr () { // 获取支付二维码
			let url = `?Url=${window.location.origin}/pay/&Action=PrintShop&TeamNum=6666&Num=&OrderCode=`
			this.$axios.get(this.$store.state.port.print.pay + url)
			.then(res => {
				this.Qr = res.data;
			})
		},
		/* 下载方法 ↑ */
		
	},
	mounted () {
		this.getSize() // 获取规格
		// this.getQr() // 获取支付二维码
	},
}
</script>

<style scoped lang="scss">
.dialog {
	position: absolute;
	width: 830px;
	height: 670px;
	font-size: 16px;
	background: #fff;
	border-radius: 5px;
	pointer-events: auto;
}
.dialog-btn {
	position: absolute;
	left: -105px;
	top: 0;
	width: 105px;
	height: 120px;
	.btn-item {
		background-color: #fff;
		margin-bottom: 10px;
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		cursor: pointer;
		font-size: 16px;
		color: $color;
		&.btn-active {
			background: $gradient;
			color: #fff;
		}
		&.btn-active .down {
			background-image: url(/img/desicon/downandprint/down_45.png);
		}
		&.btn-active .print {
			background-image: url(/img/desicon/downandprint/print_down.png);
		}
	}
	.down {
		margin: 10px auto;
		width: 49px;
		height: 43px;
		background-image: url(/img/desicon/downandprint/down_44.png);
		background-repeat: no-repeat;
		background-size: 100%;
	}
	.print {
		margin: 10px auto;
		width: 49px;
		height: 43px;
		background-image: url(/img/desicon/downandprint/print_87.png);
		background-repeat: no-repeat;
		background-size: 100%;
		color: $color;
	}
}

.dialog-content {
	padding: 20px;
	
	.content-item {
		display: flex;
		margin-bottom: 15px;
		line-height: 35px;
		&>div:first-child {
			flex: 1;
			text-align: right;
		}
		&>div:last-child {
			padding-left: 5px;
			flex: 6;
			.promise {
				display: inline-block;
				height: 24px;
				line-height: 24px;
				border: 1px solid transparent;
				margin-right: 8px;
				font-size: 13px;
				padding-right: 10px;
			}
			& .promise:nth-child(2) {
					border-color: #E81623;
			}
			& .promise:nth-child(3) {
					border-color: #F3960A;
			}
			& .promise:nth-child(4) {
					border-color: #54BE59;
			}
			& .promise:nth-child(5) {
					border-color: #2292E9;
			}
			& .understand {
				display: inline-block;
				margin-left: 30px;
				font-size: 13px;
				&:hover {
					text-decoration: underline;
					cursor: pointer;
				}
			}
			font {
				display: inline-block;
				width: 26px;
				height: 22px;
				line-height: 24px;
				text-align: center;
				color: #fff;
			}
		}
		.item-type {
			padding-right: 20px;
			.type-title {
				float: left;
				margin-right: 10px;
				font-size: 12px;
				height: 32px;
				line-height: 32px;
				border: 1px solid $color;
				border-radius:5px;
				padding: 0 20px;
				cursor: pointer;
			}
			.type-title:last-child {
				border-color: #fe8600;
				color: #fe8600;
			}
			.active {
				background: $gradient;
				color: #fff;
			}
			.png, 
			.pdf,
			.vip {
				display: inline-block;
				width: 25px;
				height: 25px;
				margin-top: -5px;
				vertical-align: middle;
				background-size: 100%;
				background-repeat: no-repeat;
			}
			.png {
				background-image: url(/img/desicon/downandprint/PDF_gray_icon.png);
			}
			.active .png {
				background-image: url(/img/desicon/downandprint/PNG_icon.png);
			}
			.pdf {
				background-image: url(/img/desicon/downandprint/PDF_gray_icon.png);
			}
			.active .pdf {
				background-image: url(/img/desicon/downandprint/PDF_icon.png);
			}
			.vip {
				background-size: 60%;
				background-position: 5px;
				background-image: url(/img/desicon/downandprint/VIP.png);
			}
		}
		
	}
	// 选中
	.select-item {
		display: inline-block;
		border: 1px solid rgba(191,191,191,1);
		font-size: 14px;
		border-radius:5px;
		height:32px;
		line-height: 32px;
		padding: 0 10px;
		margin-bottom: 10px;
		text-align:center;
		background-position: 101% 98%;
		background-repeat: no-repeat;
		cursor: pointer;
	}
	.item-title {
		margin-right: 10px;
		padding: 0 20px;
	}
	.active {
		background-image: url(/img/desicon/downandprint/choose_blue_icon.png);
		border: 1px solid $color;
	}
	// 优惠券
	.coupons {
		display: flex;
		margin-bottom: 15px;
		&>div:first-child {
			flex: 1;
			text-align: right;
			line-height: 4;
		}
		&>div:last-child {
			padding-left: 5px;
			flex: 6;
		}
	}
	// 优惠券领取成功后
	.coupons-mask {
		position: relative;
		width: 157px;
		margin-right: 8px;
		margin-bottom: 5px;
		border-radius: 4px;
		overflow: hidden;
		cursor: pointer;
		&.coupons-mask-active{
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		}
		&.coupons-mask-active::after {
			display: block;
		}
		&::after {
			content: '使用';
			display: none;
			position: absolute;
			right: -39px;
			bottom: -16px;
			color: rgba(255,96,78,1);
			width: 100px;
			height: 50px;
			padding-top: 5px;
			text-align: center;
			background: #fff;
			transform: rotate(-45deg);
			pointer-events: none;
		}
		.coupons-detail {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			span {
				position: absolute;
				color: #000;
			}
		}
		.coupons-title {
			position: absolute;
			bottom: 3px;
    		right: 36px;
			width:92px;
			height:25px;
			line-height:22px;
    		text-align: center;
			font-size:10px;
			color:#fd3166;
		}
		.coupons-adopt {
			position: absolute;
			bottom: 10px;
			right: 24px;
			text-align: center;
			font-size:10px;
			color: #ccc;
		}
		.no-meet {
			opacity: .5;
		}
		
	}
	// 付款或加入购物车
	.pay {
		display: flex;
		justify-content: space-around;
		padding: 55px 150px;
		.pay-item {
			width: 180px;
			height: 48px;
			line-height: 48px;
			text-align: center;
			border: 1px solid rgba(191,191,191,1);
			border-radius:5px;
			font-size: 18px;
			cursor: pointer;
			&:active{
				opacity: .8;
			}
		}
		&>.pay-item:first-child{
			background: $gradient;
			color: #fff;
		}
	}
}
// 支付
.content-qr {
	// height: 225px;
	text-align: center;
	margin-bottom: 20px;
	.qr-img {
		width: 100%;
		height: 100%;
		border: 1px solid rgba(191,191,191,1);
		border-radius:5px;
	}
	.qr-icon {
		font-size: 14px;
		// padding-left: 35px;
		background-repeat: no-repeat;
		// background-image: url(/img/desicon/downandprint/pay.png);
		background-position: 37%;
		background-size: auto 19px;
	}
}
</style>
