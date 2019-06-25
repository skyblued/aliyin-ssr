<template>
    <div id="submit-content">
        <div class="submit-content">
            <p class="title">收货地址</p>
            <div class="address-list">
                <div :class="['rise-item', isActiveIndex == i ? 'is-active' : '']" v-for="(item,i) in addressList" :key="i" @click.stop="handleChooseAddress(i)">
                    <i class="modify" @click="handleModifyAddress(item)"></i>
                    <p class="full-name">{{item.ShipName}}</p>
                    <p>{{item.CelPhone}}</p>
                    <p class="item-address"><span>{{item.RegionFullName}}</span> <span>{{item.Address}}</span></p>
                </div>
                <div class="rise-add-item" @click="handleAddress">
                    <img src="/img/personal/add_gray_icon.png" alt="">
                    <span>添加新地址</span>
                </div>
            </div>
            <el-dialog title="添加收货地址" :visible.sync="$store.state.dialogAdd" :close-on-click-modal="false" :modal-append-to-body="false">
                <AddToAddress @setAddress="getAddress"></AddToAddress>
            </el-dialog>
            <el-dialog title="修改地址" :visible.sync="$store.state.dialogModify" :close-on-click-modal="false">
                <ModifyAddress :id="shipId"></ModifyAddress>
            </el-dialog>
            <p class="title">配送方式</p>
            <div class="delivery">
                <div :class="['delivery-item', activeIndex == '1' ? 'active' : '']" @click="handleChoose('1')">
                    <span>普通快递</span>
                    <i>包邮</i>
                </div>
                <div :class="['delivery-item', activeIndex == '2' ? 'active' : '']" @click="handleChoose('2')">
                    <span>顺丰速运</span>
                    <i>速度快</i>
                </div>
                <div :class="['delivery-item', activeIndex == '3' ? 'active' : '']" @click="handleChoose('3')">
                    <span>普通物流</span>
                    <i>大宗物品</i>
                </div>
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
                        width="321px">
                        <template slot-scope="scope">
                            <div class="orderInfo-thumb">
                                <img :src="$store.state.port.imgBaseUrl+scope.row.thumb" alt="">
                                <div class="orderInfo-tip">
                                    <p>名称: <span>{{scope.row.name}}</span></p>
                                    <p>规格: <span>{{scope.row.size}} {{scope.row.spec}}</span></p>
                                    <p>工艺: <span>{{scope.row.technology}}</span></p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="文件信息">
                        <template slot-scope="scope">
                            <div v-if="scope.row.file == ''" class="upload-file">
                                <img src="/img/print/xqy_scwj_icon.png" alt="">
                                <span>上传文件</span>
                            </div>
                            <span v-else>自助设计</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="unitprice"
                        label="单位(元)">
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        label="数量">
                    </el-table-column>
                    <el-table-column
                        label="小计(元)">
                        <template slot-scope="scope">
                            <span style="color: rgba(255,1,1,1)">{{scope.row.subtotal}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <p class="title">优惠券</p>
            <div class="coupon-list" v-if="couponList.length">
                <div class="coupon-item" v-for="(item,i) in couponList" :key="i" @click="handleChooseCoupon(i)">
                    <img :src="$store.state.port.imgBaseUrl+item.Coupon.ImageUrl" alt="" title="点击领取">
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
                    <i class="modify" @click.stop="handleModifyInvoice(item)"></i>
                    <p>{{item.InvoiceTitle}}</p>
                    <p>{{item.RegisterNo}}</p>
                    <p v-if="item.MakeType == '1'">电子发票</p>
                    <p v-if="item.MakeType == '0'">纸质发票</p>
                    <p>{{item.Email}}</p>
                </div>
                <div class="rise-add-item" @click="handleAddInvoice">
                    <img :src="$store.state.port.staticPath + '/img/personal/add_gray_icon.png'" alt="">
                    <span>添加</span>
                </div>
            </div>
            <el-dialog title="添加发票抬头" :visible.sync="$store.state.dialogAddInvoice" :close-on-click-modal="false" class="submit-invoice">
                <AddInvoice @getInvoice="getInvoice"></AddInvoice>
            </el-dialog>
            <el-dialog title="修改发票抬头" :visible.sync="$store.state.login.dialogModifyInvoice" :close-on-click-modal="false" class="submit-invoice">
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
                    <div class="to-pay" @click="handleToPay">立即下单</div>
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
import Cookies from 'js-cookie'
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

            orderDetail: {},
            orderParam: {
                InvoiceID: '',
                AddressID: null,
                ShippingTypeID: 1,
                CouponCode: '',
                ShoppingCartItem: []
            },

            freight: '',    // 运费
            productamount: '',   // 商品总价
            amount: '',     // 应付总额
            couponamount: '',   // 优惠券满减金额

            ordercode: '',   // 订单编号

            index: []
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
            this.orderParam.CouponCode = this.couponList[i].Code
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
            this.$axios.get('/shipaddresses?TeamNum=' + sessionStorage['teamNum']).then(res =>{
                console.log(res.data)
                this.addressList = res.data
                this.orderParam.AddressID = res.data[0].ShippingId
            })
        },
        // 选择地址
        handleChooseAddress(i) {
            this.isActiveIndex = i
            this.orderParam.AddressID = this.addressList[i].ShippingId
            this.getOrderPrice(this.orderParam)
        },
        handleAddress() {   // 打开添加地址弹出框
            this.$store.commit('setDialogAdd', true)
        },
        handleModifyAddress(item) {   // 打开修改地址弹出框
            this.shipId = item.ShippingId
            this.$store.commit('setDialogModify', true)
        },

        // 获取发票抬头
        getInvoice() {
            if(!this.checked) return
            var formData = new FormData()
            formData.append('TeamNum', sessionStorage['teamNum']);
            formData.append('pageSize', 12);
            formData.append('pageIndex', 0);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamInvoices', formData, config).then(res => {
                console.log(JSON.parse(res.data))
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
            this.$store.commit('setDialogAddInvoice', true)
        },
        handleModifyInvoice(item) {  // 打开修改发票弹出框
            //console.log(item)
            this.InvoiceId = item.Id
            this.$store.commit('setDialogModifyInvoice', true)
        },

        handleBackCart() {  // 返回购物车
            this.$router.push('/cart')
        },
        handleToPay() {  // 立即下单
            if(this.addressList.length < 0){
                this.$message({type: 'warning', message: '请先填写收货地址'})
                return 
            }
            var obj = this.orderParam
            let config = {
                headers:{'Content-Type': 'application/json'}
            }
            this.$axios.post('/SubmitOrder', obj, config).then(res =>{
                console.log(res.data)
                if(res.data.STATUS == "SUCCESS") {
                    this.ordercode = res.data.data.OrderCode
                    this.$router.push({path: '/cashier', query: {code: this.ordercode}})
                    var list = JSON.parse(Cookies.get('mycar'))
                    if(this.index.length > 1){
                        for(var i=0;i<this.index.length;i++){
                            list.ShoppingCartItem.splice(this.index[i], this.index.length)
                        }
                        var my_car = JSON.stringify(list)
                        Cookies.set('mycar', my_car, {expires: 7})
                    }else{
                        list.ShoppingCartItem.splice(this.index[0], 1)
                        var my_car = JSON.stringify(list)
                        Cookies.set('mycar', my_car, {expires: 7})
                    }
                }
            })
        },
        
        
        // 获取订单报价参数
        setOrderParam() {
            new Promise((resolve, reject) => {
                this.$axios.get('/shipaddresses?TeamNum=' + sessionStorage['teamNum']).then(res =>{
                    //console.log(res.data)
                    this.addressList = res.data
                    this.orderParam.AddressID = res.data[0].ShippingId


                    let AddressID = this.orderParam.AddressID,
                        InvoiceID = this.orderParam.InvoiceID,
                        ShippingTypeID = this.orderParam.ShippingTypeID,
                        CouponCode = this.orderParam.CouponCode,
                        ShoppingCartItem = this.orderDetail.ShoppingCartItem
                    resolve({AddressID, InvoiceID, ShippingTypeID, CouponCode, ShoppingCartItem})
                })
            }).then(obj => {
                console.log(obj)
                this.orderParam = obj
                this.getOrderPrice(this.orderParam)
            })
        },

        // 获取订单报价
        getOrderPrice(obj) {
            console.log(obj)
            let config = {
                headers:{'Content-Type': 'application/json'}
            }
            this.$axios.post('/ShoppingCar', obj, config).then(res =>{
                console.log(res.data)
                this.freight = res.data.Freight
                this.productamount = res.data.ProductAmount
                this.amount = res.data.Amount
                this.couponamount = res.data.CouponAmount
                if(this.couponList.length == 0){
                    if(res.data.CanUseCoupon.length > 0){
                        for(var i=0;i<res.data.CanUseCoupon.length;i++){
                            this.couponList.push(res.data.CanUseCoupon[i])
                        }
                        console.log(this.couponList)
                    }
                }
                var data = res.data.ShoppingCartItem
                var list = []
                for(var j=0;j<data.length;j++) {
                    var obj = {}
                    obj.unitprice = data[j].PerPrice
                    obj.number = data[j].Count
                    obj.subtotal = data[j].TotalPrice
                    obj.name = data[j].PriceSheet.Name
                    obj.thumb = data[j].ProductType.ImageUrl
                    obj.size = data[j].Sizes[0].Width + '*' + data[j].Sizes[0].Height + data[j].Sizes[0].Unit
                    if(data[j].CraftList.length > 0){
                        obj.technology = data[j].CraftList[0].Name
                    }else{
                        obj.technology = ''
                    }
                    obj.spec = data[j].AttributeList[0].Items[0].Name
                    obj.id = j
                    list[j] = obj
                }
                this.tableData = list
            })
        }
        
    },
    created() {
        this.orderDetail = JSON.parse(this.$route.query.msg)
        this.index = this.orderDetail.id
        console.log(this.orderDetail)
    },
    mounted() {
        this.setOrderParam()
        // this.getAddress()
        // this.getInvoice()
        //this.getOrderPrice()
    },
    components: {
        AddToAddress,
        ModifyAddress,
        AddInvoice,
        ModifyInvoice
    }
}
</script>

<style lang="scss" scoped>

#submit-content{
    width: 100%;
    background: rgba(244,244,244,1);
    user-select: none;
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 77px;
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
        &::before{
            content: '';
            position: absolute;
            top: 11px;
            right: 15px;
            background-image: url(/img/personal/Modify_icon.png);
            width: 20px;
            height: 20px;
        }
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
            position: relative;
            i{
                display: inline-block;
                line-height: 12px;
                font-size:12px;
                color:rgba(243,152,0,1);
            }
        }
        .delivery-item:first-child i{
            position: absolute;
            top: 5px;
            right: 32px;
        }
        .delivery-item:nth-child(2) i{
            position: absolute;
            top: 5px;
            right: 18px;
        }
        .delivery-item:last-child i{
            position: absolute;
            top: 5px;
            right: 6px;
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
            width: 225px;
            height: 80px;
            margin-right: 28px;
        }
        img{
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    }
    .rise-list{
        display: flex;
    }
    .pay-price{
        padding: 0;
        .to-pay{
            margin-bottom: 0;
        }
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
    .el-dialog__body{
        padding: 32px 59px 57px 58px;
    }
}

.submit-content /deep/ .submit-invoice .el-dialog{
    .el-dialog__body{
        padding: 30px 20px;
    }
}
</style>
