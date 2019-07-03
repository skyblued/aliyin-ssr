<template>
    <div id="submit-content">
        <div class="submit-content">
            <p class="title">收货地址</p>
            <div class="address-list">
                <div :class="['rise-item', item.IsDefault ? 'is-active' : '']" v-for="(item,i) in addressList" :key="i" @click.stop="handleChooseAddress(i,item)">
                    <i class="delete-icon" @click.stop="handleDeleteAddress(item,i)"></i>
                    <i class="modify" @click.stop="handleModifyAddress(item)"></i>
                    <p class="full-name">{{item.ShipName}}</p>
                    <p>{{item.CelPhone}}</p>
                    <p class="item-address"><span>{{item.RegionFullName}}</span> <span>{{item.Address}}</span></p>
                </div>
                <div class="rise-add-item" @click="handleAddress">
                    <img src="/img/personal/add_gray_icon.png" alt="">
                    <span>添加新地址</span>
                </div>
            </div>
            <el-dialog title="添加收货地址" :visible.sync="$store.state.login.dialogAdd" :close-on-click-modal="false" :modal-append-to-body="false" class="submit-address" :lock-scroll="false">
                <AddToAddress v-if="$store.state.login.dialogAdd" @setAddress="getAddress"></AddToAddress>
            </el-dialog>
            <el-dialog title="修改地址" :visible.sync="$store.state.login.dialogModify" :close-on-click-modal="false" class="submit-address" :lock-scroll="false">
                <ModifyAddress v-if="$store.state.login.dialogModify" :id="shipId" @setAddress="getAddress"></ModifyAddress>
            </el-dialog>
            <p class="title">配送方式</p>
            <div class="delivery">
                <div :class="['delivery-item', activeIndex == '1' ? 'active' : '']" @click="handleChoose('1')">
                    <span>
                        普通快递物流
                        <i>包邮</i>
                    </span>
                </div>
                <div :class="['delivery-item', activeIndex == '2' ? 'active' : '']" @click="handleChoose('2')">
                    <span>
                        顺丰速运
                        <i>到付</i>
                    </span>
                </div>
                <!-- <div :class="['delivery-item', activeIndex == '3' ? 'active' : '']" @click="handleChoose('3')">
                    <span>普通物流</span>
                    <i>大宗物品</i>
                </div> -->
            </div>
            <div class="content-center">
                <div class="content-list-top">
                    <p class="title">商品列表</p>
                    <p @click="handleBackCart"><i class="el-icon-arrow-left"></i>返回购物车修改</p>
                </div>
                <el-table
                    :data="tableData">
                    <el-table-column
                        label="商品信息"
                        width="450px">
                        <template slot-scope="scope">
                            <div class="orderInfo-thumb">
                                <div class="orderInfo-thumb-wrap">
                                    <div v-if="scope.row.filePath.indexOf('.png') > -1" class="thumbnail" :style="{'background-image' : `url(${$store.state.port.imgBaseUrl + scope.row.filePath})`}"></div>
                                    <div v-else class="thumbnail" :style="{'background-image': `url(${scope.row.thumb.indexOf('aliyin') > -1 ? scope.row.thumb : $store.state.port.imgBaseUrl + scope.row.thumb})`}"></div>
                                </div>
                                <div class="orderInfo-tip" style="line-height: 23px">
                                    <p>名称: <span v-if="scope.row.urgent == true" style="color: rgba(255,0,0,1);font-weight:bold">[加急]</span><span>{{scope.row.name}}</span></p>
                                    <p>
                                        规格: 
                                        <span>{{scope.row.size}}</span>
                                        <span v-for="(item,i) in scope.row.spec" :key="i">
                                            <span v-if="item.Items[0].DisplayMode == '0'">{{item.Items[0].Name}}</span>
                                            <img v-else :src="$store.state.port.imgBaseUrl+item.Items[0].ImageUrl" alt="">
                                        </span>
                                    </p>
                                    <p v-if="scope.row.technology.length">工艺: <span style="margin-right: 5px;" v-for="(items,index) in scope.row.technology" :key="index">{{items.Name}}</span></p>
                                    <p>P 数:  <span>{{scope.row.page + 'P'}}</span></p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="文件信息">
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderType == 1">
                                <div v-if="scope.row.fileName == ''" class="upload-file" @click="handleUpload(scope.$index)">
                                    <img src="/img/print/xqy_scwj_icon.png" alt="" >
                                    <span>上传文件</span>
                                </div>
                                <span v-else>
                                    {{scope.row.fileName}}
                                    <img class="reselect" src="/img/print/xqy_refresh_icon.png" alt="" title="重新选择" @click="handleUpload(scope.$index)">
                                </span>
                            </div>
                            <div v-else>
                                <span>{{scope.row.fileName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="unitprice"
                        label="单位(元)">
                    </el-table-column> -->
                    <el-table-column
                        prop="number"
                        label="数量">
                    </el-table-column>
                    <el-table-column
                        label="小计(元)">
                        <template slot-scope="scope">
                            <span style="color: rgba(255,1,1,1)">￥{{scope.row.subtotal}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog title="上传文件" :visible.sync="$store.state.port.dialogUpload" :close-on-click-modal="false" :lock-scroll="false">
                <UploadFile @setCartFile="getCartFile"></UploadFile>
            </el-dialog>
            <p class="title">优惠券</p>
            <div class="coupon-list" v-if="couponList.length">
                <div :class="{'coupon-item':true, 'coupon-item-active': couponIndex == i}" v-for="(item,i) in couponList" :key="i" @click="handleChooseCoupon(i)">
                    <img :src="$store.state.port.imgBaseUrl + item.Coupon.ImageUrl" alt="" title="点击使用">
                </div>
            </div>
            <div style="margin-bottom: 50px;" v-if="!couponList.length">
                <span style="font-size: 14px;color: rgba(153,153,153,1);">暂无可用优惠券</span>
            </div>
            <div class="title">
                <img @click="handleShowInvoice" :src="checked == true ? '/img/personal/choose_icon.png' : '/img/personal/n_choose_icon.png'" alt="">
                <p>发票</p>
                <span v-if="checked == true">发票抬头为企业，请正确填写纳税人识别号，以免影响报销。</span>
            </div>
            <div class="rise-list" v-if="checked == true">
                <div :class="['rise-item', isIndex == i ? 'is-active' : '']" v-for="(item,i) in invoiceList" :key="i" @click="handleChooseInvoice(i)">
                    <i class="delete-icon"></i>
                    <i class="modify" @click.stop="handleModifyInvoice(item)"></i>
                    <p>{{item.InvoiceTitle}}</p>
                    <p>{{item.RegisterNo}}</p>
                    <p v-if="item.MakeType == '1'">电子发票</p>
                    <p v-if="item.MakeType == '0'">纸质发票</p>
                    <p>{{item.Email}}</p>
                </div>
                <div class="rise-add-item" @click="handleAddInvoice">
                    <img src="/img/personal/add_gray_icon.png" alt="">
                    <span>添加</span>
                </div>
            </div>
            <el-dialog title="添加发票抬头" :visible.sync="$store.state.login.dialogAddInvoice" :close-on-click-modal="false" class="submit-invoice" :lock-scroll="false">
                <AddInvoice @getInvoice="getInvoice"></AddInvoice>
            </el-dialog>
            <el-dialog title="修改发票抬头" :visible.sync="$store.state.login.dialogModifyInvoice" :close-on-click-modal="false" class="submit-invoice" :lock-scroll="false">
                <ModifyInvoice @getInvoice="getInvoice" :id="InvoiceId"></ModifyInvoice>
            </el-dialog>
            <div class="pay-price">
                <div class="pay-price-info">
                    <p>
                        <span>商品总价:</span>
                        <span class="price">{{productamount && productamount.toFixed(2)}}元</span>
                    </p>
                    <p>
                        <span>运费:</span>
                        <span class="price">+{{freight && freight.toFixed(2)}}元</span>
                    </p>
                    <p>
                        <span>优惠券:</span>
                        <span class="price">-{{couponamount && couponamount.toFixed(2)}}元</span>
                    </p>
                    <p>
                        <span>活动优惠:</span>
                        <span class="price">-0.00元</span>
                    </p>
                    <p style="margin-top: 10px;">
                        <span class="actual-title">应付总额:</span>
                        <span class="actual price">{{amount && amount.toFixed(2)}}元</span>
                    </p>
                    <div class="to-pay" @click="handleToPay">提交订单</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AddToAddress from '@/components/personal/address/AddToAddress.vue'
import ModifyAddress from '@/components/personal/address/ModifyAddress.vue'
import AddInvoice from '@/components/personal/invoice/AddInvoice.vue'
import ModifyInvoice from '@/components/personal/invoice/ModifyInvoice.vue'
import UploadFile from '@/components/share/UploadFile.vue'
export default {
    data () {
        return {
            activeIndex: '1',
            tableData: [],
            checked: false,
            addressList: [],
            shipId: '',    // 收货地址id
            invoiceList: [],
            InvoiceId: '',   // 发票信息id
            shipModeId: 1,  // 配送方式id
            isActiveIndex: 0,
            isIndex: 0,
            couponList: [],
            code: '',   // 优惠券id

            orderParam: {
                InvoiceID: '',
                AddressID: '',
                ShippingTypeID: 1,
                CouponCode: '',
                RegionId: null,
                ShoppingCartItem: []
            },

            freight: '',    // 运费
            productamount: '',   // 商品总价
            amount: '',     // 应付总额
            couponamount: '',   // 优惠券满减金额

            ordercode: '',   // 订单编号
            filename: '',
            index: null,
            show: false,
            couponIndex: null
        }
    },
    methods: {
        handleChoose(i) {  // 选择配送方式
            this.activeIndex = i
            this.orderParam.ShippingTypeID = i
            this.getOrderPrice(this.orderParam)
        },
        // 选择优惠券
        handleChooseCoupon(i) {
            if(this.couponIndex == null){
                this.couponIndex = i
                this.orderParam.CouponCode = this.couponList[i].Code
            }else if(this.couponIndex != i) {
                this.couponIndex = i
                this.orderParam.CouponCode = this.couponList[i].Code
            }else{
                this.couponIndex = null
                this.orderParam.CouponCode = ''
            }
            this.getOrderPrice(this.orderParam)
        },

        //是否显示发票
        handleShowInvoice() {
            this.checked = !this.checked
            if(this.checked == false){
                this.orderParam.InvoiceID = ''
            }else{
                this.getInvoice()
            }
        },

        // 获取地址列表
        getAddress() {
            this.$axios.get('/shipaddresses?TeamNum=' + localStorage['teamNum']).then(res =>{
                console.log(res.data)
                this.addressList = res.data
                this.orderParam.AddressID = res.data[0].ShippingId
                this.getOrderPrice(this.orderParam)
            })
        },
        // 选择地址
        handleChooseAddress(i,item) {
            this.addressList.forEach((item,index) => {
                item.IsDefault = false
                if(index == i) {
                    this.addressList[i].IsDefault = true
                }
            })
            this.orderParam.RegionId = this.addressList[i].RegionId
            this.orderParam.AddressID = this.addressList[i].ShippingId
            this.getOrderPrice(this.orderParam)
        },
        handleAddress() {   // 打开添加地址弹出框
            this.$store.commit('login/setDialogAdd', true)
        },
        handleModifyAddress(item) {   // 打开修改地址弹出框
            this.shipId = item.ShippingId
            this.$store.commit('login/setDialogModify', true)
        },
        handleDeleteAddress(item,i) {  // 删除当前地址
            console.log(item,i)
            this.$confirm('是否删除该地址?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var formData = new FormData()
                formData.append('Id', item.ShippingId);
                let config = { 
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/shipaddress', {data: formData}, config).then(res => {
                    //console.log(res)
                    if(res.data == true){
                        this.$message({type: 'success',message: '删除成功'})
                        this.addressList.splice(i,1)
                    }else{
                        this.$message({type: 'error',message: '删除失败'})
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },

        // 获取发票抬头
        getInvoice() {
            if(!this.checked) return
            var formData = new FormData()
            formData.append('TeamNum', localStorage['teamNum']);
            formData.append('pageSize', 12);
            formData.append('pageIndex', 0);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamInvoices', formData, config).then(res => {
                //console.log(JSON.parse(res.data))
                if(!JSON.parse(res.data).Data.length) return
                var data = JSON.parse(res.data).Data
                this.invoiceList = data
                this.orderParam.InvoiceID = data[0].Id
                this.getOrderPrice(this.orderParam)
            })
        },
        // 选择发票抬头
        handleChooseInvoice(i) {
            this.isIndex = i
            this.orderParam.InvoiceID = this.invoiceList[i].Id
            this.getOrderPrice(this.orderParam)
        },
        handleAddInvoice() {   // 打开添加发票弹出框
            this.$store.commit('login/setDialogAddInvoice', true)
        },
        handleModifyInvoice(item) {  // 打开修改发票弹出框
            //console.log(item)
            this.InvoiceId = item.Id
            this.$store.commit('login/setDialogModifyInvoice', true)
        },

        handleBackCart() {  // 返回购物车
            this.$router.push('/order/shoppingCart')
        },
        handleToPay() {  // 立即下单
            if(this.addressList.length == 0 ){
                this.$message({type: 'warning', message: '请先填写收货地址'})
                return 
            }
            if(this.orderParam.RegionId == 0){
                this.$message({type: 'warning', message: '收货地址有误请重新填写'})
                return
            }
            if(this.orderParam.ShoppingCartItem.length == 0) {
                return this.$message.warning('没有商品信息请重新选择')
            }
            let state = false
            new Promise((resolve, reject) => {
                this.orderParam.ShoppingCartItem.forEach((item,index) => {
                    if(item.FileName == ''){
                        state = true
                    }
                })
                if(state) {
                    this.$confirm('您还有产品没有选择文件,是否提交订单?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'success',
                        lockScroll: false
                    }).then(() => {
                        resolve(true)
                    }).catch((error) => {
                        this.$message.error('取消选择')
                    })
                }else{
                    resolve(true)
                }
                
            }).then(res => {
                if(this.show) return
                var obj = this.orderParam
                let config = {
                    headers:{'Content-Type': 'application/json'}
                }
                this.show = true
                this.$axios.post('/SubmitOrder', obj, config)
                .then(res =>{
                    if(res.data.STATUS == "SUCCESS") {
                        if(this.$route.query.t == 'order') {
							this.$deleteCart({i:0,num:1})
                            this.orderParam.ShoppingCartItem = []
                        }else{
                            this.orderParam.ShoppingCartItem.forEach((item,index) => {
                                if(item.Selected == 1){
									this.$deleteCart({i:index,num:this.orderParam.ShoppingCartItem.length})
                                }
                            })
                            this.orderParam.ShoppingCartItem = this.$getCart()
                        } 
                        this.ordercode = res.data.data.OrderCode
                        var formData = new FormData()
                        formData.append('ordercode', res.data.data.OrderCode);
                        this.$axios.put('/SubmitOrder',formData,config).then(res => {
                            
                        })
                        this.$router.push({path: '/order/cashier', query: {code: this.ordercode}})
                    }
                }).catch((error) => {
                    if(error) {
                        this.show = false
                        this.$message.warning('服务器繁忙')
                    }
                })
            })
        },

        
        // 获取订单报价参数
        setOrderParam() {
            new Promise((resolve, reject) => {
                this.$axios.get('/shipaddresses?TeamNum=' + localStorage['teamNum']).then(res =>{
                    console.log(res.data)
                    if(res.data.length == 0) {
                        this.addressList = []
                        this.orderParam.AddressID = ''
                        this.orderParam.RegionId = null
                    }else{
                        this.addressList = res.data
                        let state = true, regionId;
                        res.data.forEach((item,index) => {
                            if(item.IsDefault) {
                                this.orderParam.AddressID = item.ShippingId
                                this.orderParam.RegionId = item.RegionId
                                state = false
                            }
                        })
                        if(state) { 
                            this.orderParam.AddressID = res.data[0].ShippingId
                            this.orderParam.RegionId = res.data[0].RegionId
                            res.data[0].IsDefault = true 
                        }
                    }

                    let AddressID = this.orderParam.AddressID,
                        InvoiceID = this.orderParam.InvoiceID,
                        ShippingTypeID = this.orderParam.ShippingTypeID,
                        CouponCode = this.orderParam.CouponCode,
                        ShoppingCartItem = this.orderParam.ShoppingCartItem,
                        RegionId = this.orderParam.RegionId;
                    resolve({AddressID, InvoiceID, ShippingTypeID, CouponCode, ShoppingCartItem, RegionId})
                })
            }).then(obj => {
                //console.log(obj)
                this.orderParam = obj
                this.getOrderPrice(this.orderParam)
            })
        },

        // 上传文件
        handleUpload(i) {
            this.index = i
            this.$store.commit('port/setDialogUpload', true)
        },

        getCartFile(msg) {
            var car = this.$store.getters.getProductionObj[this.index]
            car.FileName = msg.name
            car.FilePath = msg.path
            this.$store.commit('setShopingCar', {i: this.index, shop: car})
            let cook = this.$myParseCookie(this.$store.state.productionObj)
            this.$cookies.set('myCar', cook, {path: '/'}) 
            this.tableData[this.index].fileName = msg.name
        },

        // 获取订单报价
        getOrderPrice(obj) {
            // console.log(obj)
            if(obj.RegionId == 0) {
                this.$message.warning('收货地址有误请重新填写')
            }
            let config = {
                headers:{'Content-Type': 'application/json'}
            }
            this.$axios.post('/ShoppingCar', obj, config).then(res =>{
                console.log(res.data)
                this.freight = res.data.Freight
                this.productamount = res.data.ProductAmount
                this.amount = res.data.Amount
                this.couponamount = res.data.CouponAmount
                if(res.data.CanUseCoupon.length > 0){
                    this.couponList = res.data.CanUseCoupon
                    // for(var i=0;i<res.data.CanUseCoupon.length;i++){
                    //     this.couponList.push(res.data.CanUseCoupon[i])
                    // }
                    // console.log(this.couponList)
                }
                var data = res.data.ShoppingCartItem
                var list = []
                for(var j=0;j<data.length;j++) {
                    var obj = {}
                    // obj.unitprice = data[j].PerPrice
                    obj.number = data[j].Quantitys[0].Number + data[j].ProductType.Unit
                    obj.subtotal = data[j].TotalPrice
                    obj.name = data[j].PriceSheet.Name
                    if(data[j].OrderType == '1') {
                        obj.thumb = data[j].ProductType.ImageUrl
                    }else{
                        obj.thumb = data[j].Thumb
                    }
                    obj.size = data[j].Sizes[0].ProductWidth + '*' + data[j].Sizes[0].ProductHeight + data[j].Sizes[0].Unit
                    if(data[j].CraftList.length > 0){
                        obj.technology = data[j].CraftList
                    }else{
                        obj.technology = ''
                    }
                    obj.spec = data[j].AttributeList
                    obj.page = data[j].Pages[0].Quantity
                    obj.fileName = data[j].FileName
                    obj.filePath = data[j].FilePath
                    obj.urgent = data[j].Urgent
                    obj.id = j
                    obj.orderType = data[j].OrderType
                    list[j] = obj
                }
                this.tableData = list
            })
        }
        
    },
    mounted() {
        this.setOrderParam()
        var url = this.$route.query.t
        var my_car;
        if(url == 'order') {
            my_car = this.$getCart();
            this.orderParam.ShoppingCartItem.push(my_car[0])
        }else{
            my_car = this.$getCart();
            my_car.forEach((item, index) => {
                if(item.Selected == 1) {
                    this.orderParam.ShoppingCartItem.push(item)
                }
            })
        }
    },
    components: {
        AddToAddress,
        ModifyAddress,
        AddInvoice,
        ModifyInvoice,
        UploadFile
    }
}
</script>

<style lang="scss" scoped>
// 
#submit-content{
    width: 100%;
    background: rgba(244,244,244,1);
    user-select: none;
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 77px;
}

.submit-content /deep/ .el-table{
    .orderInfo-tip {
        span{
            margin-left: 5px;
        }
        img{
            display: inline-block;
            vertical-align: middle;
            width: 64px;
            height: 64px;
        }
    }
    .reselect{
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }
    .orderInfo-thumb-wrap{
        display: inline-block;
        width:90px;
        height:90px;
        background:rgba(213,221,227,1);
        border-radius:5px;
        margin-right: 25px;
        text-align: center;
        .thumbnail{
            display: inline-block;
            width: 80%;
            height: 100%;
            background-size: contain;
            background-position: 50%;
            background-repeat: no-repeat;
        }
    }
}

.submit-content{
    width: 1200px;
    margin: 0 auto;
    border-radius: 10px;
    background: rgba(255,255,255,1);
    padding: 35px 25px 54px;
    color: rgba(102,102,102,1);
    .is-active{
        border: 1px solid $color;
        background: rgba(213,221,227,.3);
        // &::before{
        //     content: '';
        //     position: absolute;
        //     top: 11px;
        //     right: 15px;
        //     background-image: url(/img/personal/Modify_icon.png);
        //     width: 20px;
        //     height: 20px;
        // }
    }
    .title{
        font-size:18px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
        margin-bottom: 25px;
        line-height: 18px;
        display: flex;
        img{
            display: inline-block;
            vertical-align: middle;
            width: 20px;
            height: 20px;
            margin-right: 11px;
        }
        span{
            font-size:14px;
            color:rgba(243,152,0,1);
            margin-left: 30px;
        }
    } 
    .address-list{
        display: flex;
        flex-wrap: wrap;
    }
    .rise-add-item{
        color: rgba(153,153,153,1);
        margin-bottom: 50px;
    }
    .delivery{
        display: flex;
        margin-bottom: 50px;
        .delivery-item{
            border:1px solid rgba(229,229,229,1);
            border-radius:5px;
            line-height: 49px;
            text-align: center;
            cursor: pointer;
            color:rgba(51,51,51,1);
            width: 176px;
            margin-right: 25px;
            span{
                position: relative;
                i{
                    display: inline-block;
                    line-height: 12px;
                    font-size:12px;
                    color:rgba(243,152,0,1);
                    position: absolute;
                    top: -10px;
                    right: -25px;
                }
            }
        }
        .active{
            border: 1px solid $color;
        }
    }
    .content-center{
        margin-bottom: 25px;
        .content-list-top{
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid rgba(244,244,244,1);
            p:last-child{
                cursor: pointer;
                color:rgba(153,153,153,1);
                font-size: 16px;
                &:hover{
                    color: $color;
                }
            }
        }
    }
    .coupon-list{
        display: flex;
        margin-bottom: 50px;
        .coupon-item{
            margin-right: 28px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
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
        }
        .coupon-item-active::after{
            display: block;
        }
        img{
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    }
    .rise-list{
        display: flex;
        flex-wrap: wrap;
    }
    .pay-price{
        padding: 0;
        .to-pay{
            margin-bottom: 0;
        }
    }
}
/*地址样式*/
.address-list{
    display: flex;
    .full-name{
        font-size: 18px;
        color: rgba(51,51,51,1);
        margin-bottom: 10px;
    }
    .item-address{
        line-height: 20px;
        span{
            display: block;
        }
    } 
}
.rise-item{
    border:1px solid rgba(229,229,229,1);
    border-radius:5px;
    height: 128px;
    min-width: 240px;
    line-height: 25px;
    text-align: left;
    padding: 16px 20px 0 20px;
    margin-right: 35px;
    margin-bottom: 15px;
    cursor: pointer;
    position: relative;
    font-size: 14px;
    &:hover{
        border: 1px solid $color;
    }
    .modify{
        position: absolute;
        top: 11px;
        right: 15px;
        background-image: url(/img/personal/Modify_icon.png);
        width: 20px;
        height: 20px;
        display: none;
    }
    .delete-icon{
        position: absolute;
        top: 11px;
        right: 35px;
        background-image: url(/img/desicon/delete_small_blue_icon.png);
        width: 20px;
        height: 20px;
        display: none;
    }
    &:hover .modify, &:hover .delete-icon{
        display: block; 
    }
}
.rise-add-item{
    border:1px solid rgba(229,229,229,1);
    border-radius:5px;
    height: 128px;
    width: 240px;
    text-align: center;
    padding-top: 30px;
    cursor: pointer;
    &:hover{
        border:1px solid $color;
    }
    img{
        margin: 0 auto 13px;
        display: block;
    }
}


.submit-content /deep/ .el-dialog{
    width: 630px;
    border-radius: 10px;
    text-align: center;
    box-shadow: none;
    .el-dialog__header{
        padding: 20px 25px 0;
        line-height: 21px;
        font-size:23px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(51,51,51,1);
        position: relative;
        .el-dialog__headerbtn{
            position: absolute;
            top: 17px;
            right: -45px;
            .el-dialog__close{
                width: 24px;
                height: 24px;
                color: rgba(255,255,255,1);
            }
        }
    }
}

.submit-content /deep/ .submit-address .el-dialog{
    .el-dialog__body{
        padding: 32px 59px 57px 58px;
    }
}
</style>
