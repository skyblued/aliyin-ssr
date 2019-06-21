<template>
	<div class="dialog">
		<!-- 切换按钮 -->
		<div class="dialog-btn">
			<div :class="{'btn-item': true,  'btn-active': toggleType == 'down'? true : false}" @click="toggle('down')">
				<div class="down"></div>
				<span>下载文件</span>
			</div>
			<div :class="{'btn-item': 1,'btn-active': toggleType == 'print'? true : false}" @click="toggle('print')">
				<div class="print"></div>
				<span>在线印刷</span>
			</div>
		</div>
		<div class="close-btn" @click="close"></div>
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
						<span @click="setProduct('Pages', i)" :class="{'select-item':1, active: item.IsDefault}" v-for="(item,i) in production.Pages" :key="i">{{item.Quantity}}p</span>
					</div>	
				</div>
				<div class="content-item">
					<div>尺寸：</div>
					<div>
						<span style="display: inline-block;border: 1px solid #0083E9;font-size: 14px; border-radius:5px; height:28px;line-height: 28px;padding: 0 10px;text-align:center;background:url(/img/desicon/downandprint/choose_blue_icon.png) no-repeat;background-position: 101% 100%; cursor: pointer">{{`${info.Size.Width}x${info.Size.Height}${info.Size.Unit}`}}</span>
					</div>	
				</div>
				<div class="content-item">
					<div>文件类型：</div>
					<div class="item-type">
						<span class="type-title png" :class="{'png-active': !fileType}" @click="selectType(0)">标清文件(png)</span>
						<span class="type-title pdf" :class="{'pdf-active': fileType}" @click="selectType(1)">高清文件(pdf)</span>
						<span class="type-title vip"><span style="display:inline-block;transform:translateY(-5px)">升级会员免费无限下载</span> <sup style="display:inline-block;transform:translateY(-5px)">荐</sup></span>
					</div>	
				</div>
				<div class="content-item">
					<div>应付金额：</div>
					<div><span>¥ 8.00</span></div>	
				</div>
				<div class="content-qr">
					<img class="qr-img" :src="Qr"  alt="">
					<div class="qr-icon">支持微信、支付宝扫码付款</div>
				</div>
				<div class="pay">
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
							&nbsp;&nbsp;全国包邮&nbsp;&nbsp;
						</span>
						<span class="promise">
							<font style="background:#F3960A">票</font>
							&nbsp;&nbsp;报销发票&nbsp;&nbsp;
						</span>
						<span class="promise">
							<font style="background:#54BE59">送</font>
							&nbsp;&nbsp;送货上门&nbsp;&nbsp;
						</span>
						<span class="promise">
							<font style="background:#2292E9">近</font>
							&nbsp;&nbsp;就近印刷&nbsp;&nbsp;
						</span>
						<span class="understand">了解更多></span>
					</div>	
				</div>
				<div class="content-item">
					<div>文件名称：</div>
					<div>{{info.Name}}</div>	
				</div>
				<div class="content-item">
					<div>P数：</div>
					<div>
						<span @click="setProduct('Pages', i)" :class="{'select-item':1, active: item.IsDefault}" v-for="(item,i) in production.Pages" :key="i">{{item.Quantity}}p</span>
					</div>	
				</div>
				<div class="content-item">
					<div>尺寸：</div>
					<div>
						<span style="display: inline-block;border: 1px solid #0083E9;font-size: 14px; border-radius:5px; height:28px;line-height: 28px;padding: 0 10px;text-align:center;background:url(/img/desicon/downandprint/choose_blue_icon.png) no-repeat;background-position: 101% 100%; cursor: pointer">{{`${info.Size.Width}x${info.Size.Height}${info.Size.Unit}`}}</span>
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
					<div>领取优惠劵：</div>
					<div>
						<div v-for="(item,i) in Coupons" :key="i" :class="{'coupons-mask': 1, 'coupons-mask-active': item.ID == '' }">
							<img @click="getCoupons(item, i)" :src="$store.state.port.imgBaseUrl + item.ImageUrl" :title="item.ID == ''?'已领取' : '点击领取'">
						</div>
					</div>
				</div>
				<div class="content-item">
					<div>印刷费用：</div>
					<div style="color:#FF0000;font-size: 24px;">¥ {{TotalPrice.toFixed(2)}}</div>
				</div>
				<div class="pay">
					<div class="pay-item">下单付款</div>
					<div class="pay-item" @click="addCar">加入购物车</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
	props: ['info', 'dialog'],
	data () {
		return {
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
			printprice: { // 获取价格的参数
				SheetId: null, 
				SizeId: null,
				PageId: null,
				QuantityId: null,
				Attributes: null,
				Crafts: null,
				Urgent: null,
				Count: 0, // 数量
				OrderType: 1,// 
				FileName: '',
				FilePath: '',
				DocumentNum: ''
			},
			TotalPrice: 0, // 获取当前规格计算总价格
			fileType: 0, // 选择文件类型
			Qr: '', // 支付二维码
			myCar: {
				'InvoiceID': 0,
                'AddressID': 0,
                'ShippingTypeID': 1,
				'CouponCode': '',
				ShoppingCartItem: []
			}
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
					// console.log(this.info)
					
					let SheetId = this.production.ID,
						SizeId = this.info.SizeId,
						PageId = this.getIsDefault(this.production.Pages),
						QuantityId = this.getIsDefault(this.production.Quantities),
						Attributes = '',
						Crafts = '',
						Urgent = false,
						OrderType = 1,
						FileName = '',
						FilePath = '',
						DocumentNum = this.info.DocumentNumber
					this.production.Attributes.forEach(item => {
						item['Items'].forEach(temp => {
							if (temp['IsDefault']) {
								Attributes += temp.ID + ','
							}
						})
					})
					if(Attributes.lastIndexOf(',') == Attributes.length - 1) Attributes = Attributes.slice(0, -1)
					resolve({SheetId, SizeId, PageId, QuantityId, Attributes, Crafts, Urgent, OrderType, FileName, FilePath, DocumentNum})
				})
			}).then(obj => {
				// console.log(obj)
				this.printprice = obj
				this.getPrintprice(this.printprice)
			})
			this.$axios.get('/Coupons')
			.then(res => {
				this.Coupons = res.data || []
			})
		},
		getCoupons (item, i) { // 领取优惠券
			if (item.ID == '') return
			let formdata = new FormData()
			 formdata.append('CouponID', item.ID)
			this.$axios.post('UserCoupon', formdata)
			.then(res => {
				if (res.data.status == 'success') {
					this.Coupons[i].ID = ''
					this.$message({type: 'success', message: res.data.msg})
				}
			})
		},
		getPrintprice(obj) { // 获取报价结果
			let formdata = new FormData()
			for (let item in obj) {
				formdata.append(item, obj[item])
			}
			this.$axios.post(this.$store.state.print.printprice, formdata)
			.then(res => {
				// console.log(res)
				this.TotalPrice = res.data.TotalPrice || 0
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
		addCar () { // 加入购物车
			new Promise((resolve,reject) => {
				let myCar = JSON.parse(Cookies.get('mycar')) || ''
				if (myCar == '') {
					this.myCar.ShoppingCartItem.unshift(this.printprice)
					myCar = JSON.stringify(this.myCar)
				} else {
					myCar.ShoppingCartItem.unshift(this.printprice)
					myCar = JSON.stringify(myCar)
				}
				Cookies.set('mycar', myCar, {expires: 7})
				resolve(true)
			}).then(res => {
				if (res) {
					 this.$confirm('加入购物车成功, 是否去提交订单?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'success'
						}).then(() => {
							this.$router.push('/cart')
						}).catch(() => {         
							this.close()
						});
				}
			})

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
			this.$axios.get(this.$store.state.print.pay + url)
			.then(res => {
				this.Qr = res.data;
			})
		},
		/* 下载方法 ↑ */
		
	},
	mounted () {
		this.getSize() // 获取规格
		this.getQr() // 获取支付二维码
		console.log(this.dialog)
	},
	watch: {

	}
}
</script>

<style scoped lang="scss">
@import "@/assets/init.scss";
.dialog {
	font-size: 16px;
	
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
			background: linear-gradient(to top, #0083E9, #00EBF4);
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
.close-btn {
	position: absolute;
	right: -40px;
	top: 5px;
	width: 24px;
	height: 24px;
	transform: rotate(45deg);
	cursor: pointer;
	&::before {
		content: '';
		position: absolute;
		top:50%;
		width: 24px;
		height: 2px;
		border-radius: 2px;
		background: #fff;
		transform: rotate(90deg);
	}
	&::after {
		content: '';
		position: absolute;
		top:50%;
		width: 24px;
		height: 2px;
		border-radius: 2px;
		background: #fff;
	}
}
.dialog-content {
	margin-top: -30px;
	// padding-left: 10px;
	.content-item {
		display: flex;
		margin-bottom: 15px;
		height: 35px;
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
				margin-right: 10px;
				font-size: 13px;
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
				height: 24px;
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
				height: 28px;
				line-height: 28px;
				border: 1px solid rgba(210,210,210,1);
				border-radius:5px;
				padding: 0 10px 0 30px;
				cursor: pointer;
			}
			.type-title:last-child {
				border-color: #fe8600;
				color: #fe8600;
			}
			.png {
				background-repeat: no-repeat;
				background-position: 4px 0;
				background-image: url(/img/desicon/downandprint/PNGgray_icon.png);
				&.png-active {
					background-image: url(/img/desicon/downandprint/PNG_icon.png);
					border: 1px solid $color;
				}
			}
			.pdf {
				background-repeat: no-repeat;
				background-position: 4px 0;
				background-image: url(/img/desicon/downandprint/PDF_gray_icon.png);
				&.pdf-active {
					border: 1px solid $color;
					background-image: url(/img/desicon/downandprint/PDF_icon.png);
				}
			}
			.vip {
				background-repeat: no-repeat;
				background-position: 10px 5px;
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
		height:28px;
		line-height: 28px;
		padding: 0 10px;
		text-align:center;
		background-position: 105% 100%;
		background-repeat: no-repeat;
		cursor: pointer
	}
	.item-title {
		margin-right: 10px;
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
		cursor: pointer;
		width: 194px;
		height: 70px;
		margin-right: 10px;
		margin-bottom: 5px;
		float: left;
		overflow: hidden;
		&.coupons-mask-active {
			cursor: auto;
			opacity: .3;
		}
	}
	// 付款或加入购物车
	.pay {
		display: flex;
		justify-content: space-around;
		padding: 0 150px;
		.pay-item {
			width: 180px;
			height: 48px;
			line-height: 48px;
			text-align: center;
			border: 1px solid rgba(191,191,191,1);
			border-radius:5px;
			font-size: 18px;
			cursor: pointer;
			&:hover {
				// background: rgba(0,131,233,1);
				// color: #fff;
			}
			&:active{
				opacity: .8;
			}
		}
		&>.pay-item:first-child{
			background: rgba(0,131,233,1);
			color: #fff;
		}
	}
}
// 支付
.content-qr {
	height: 225px;
	text-align: center;
	margin-bottom: 20px;
	.qr-img {
		width: 200px;
		height: 200px;
		border: 1px solid rgba(191,191,191,1);
		border-radius:5px;
	}
	.qr-icon {
		font-size: 14px;
		padding-left: 35px;
		background-repeat: no-repeat;
		background-image: url(/img/desicon/downandprint/pay.png);
		background-position: 37%;
		background-size: auto 19px;
	}
}
</style>
