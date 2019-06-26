<template>
    <div id="order-detail">
        <div class="order-detail">
            <div class="order-detail-header">
                <span>订单详情</span>
                <span class="back" @click="handleBack"><i class="el-icon-arrow-left"></i>返回</span>
            </div>

            <div class="order-details">
                <!-- 物流信息 -->
                <div class="logistics">
                    <div class="logistics-header">
                        <p>订单号: <span>{{orderDeatil.OrderCode}}</span></p>
                        <div class="logistics-btn" v-if="orderDeatil.PaymentStatus == '0'">
                            <div class="payment" @click="handleToPay">去支付</div>
                            <div class="cancel-order">取消订单</div>
                        </div>
                        <div v-else>支付完成</div>
                    </div>
                    <div class="logistics-steps">
                        <div class="logistics-steps-item">
                            <div>
                                <img src="/img/personal/logistics/xd_icon_hl.png" alt="">
                                <p class="logistics-title" style="color: rgba(51,51,51,1)">下单</p>
                                <!-- <p class="logistics-time">{{orderDeatil.CreatedDate | ToSplit}}</p> -->
                            </div>
                            <img class="steps" :src="orderDeatil.PaymentStatus == '0' ? '/img/personal/logistics/arrow_icon.png' : '/img/personal/logistics/arrow_icon_hl.png'" alt="">
                        </div>
                        <div class="logistics-steps-item">
                            <div>
                                <img :src="orderDeatil.PaymentStatus == '0' ? '/img/personal/logistics/fk_icon.png' : '/img/personal/logistics/fk_icon_hl.png'" alt="">
                                <p :class="{'logistics-title': true, active: orderDeatil.PaymentStatus != '0'}">付款</p>
                                <!-- <p class="logistics-time" v-if="orderDeatil.PaymentStatus != '0'">{{orderDeatil.PaymentTime | ToSplit}}</p> -->
                            </div>
                            <img class="steps" :src="orderDeatil.OrderStatus == '0' ? '/img/personal/logistics/arrow_icon.png' : '/img/personal/logistics/arrow_icon_hl.png'" alt="">
                        </div>
                        <div class="logistics-steps-item">
                            <div>
                                <img :src="orderDeatil.OrderStatus == '0' ? '/img/personal/logistics/sh_icon.png' : '/img/personal/logistics/sh_icon_hl.png'" alt="">
                                <p :class="{'logistics-title': true, active: orderDeatil.OrderStatus != '0'}">审核</p>
                                <!-- <p class="logistics-time" v-if="orderDeatil.OrderStatus != '0'">{{orderDeatil.ConfirmTime | ToSplit}}</p> -->
                            </div>
                            <img class="steps" :src="orderDeatil.PrintStatus == '0' ? '/img/personal/logistics/arrow_icon.png' : '/img/personal/logistics/arrow_icon_hl.png'" alt="">
                        </div>
                        <div class="logistics-steps-item">
                            <div>
                                <img :src="orderDeatil.PrintStatus == '0' ? '/img/personal/logistics/sc_icon.png' : '/img/personal/logistics/sc_icon_hl.png'" alt="">
                                <p :class="{'logistics-title': true, active: orderDeatil.PrintStatus != '0'}">生产</p>
                                <!-- <p class="logistics-time" v-if="orderDeatil.PrintStatus != '0'">{{orderDeatil.DesignTime || orderDeatil.PrintTime | ToSplit}}</p> -->
                            </div>
                            <img class="steps" :src="orderDeatil.ShippingStatus == '0' ? '/img/personal/logistics/arrow_icon.png' : '/img/personal/logistics/arrow_icon_hl.png'" alt="">
                        </div>
                        <div class="logistics-steps-item">
                            <div>
                                <img :src="orderDeatil.ShippingStatus == '0' ? '/img/personal/logistics/fh_icon.png' : '/img/personal/logistics/fh_icon_hl.png'" alt="">
                                <p :class="{'logistics-title': true, active: orderDeatil.ShippingStatus != '0'}">发货</p>
                                <!-- <p class="logistics-time" v-if="orderDeatil.ShippingStatus != '0'">{{orderDeatil.ShippingTime | ToSplit}}</p> -->
                            </div>
                            <img class="steps" :src="currentDate !== signforTime ? '/img/personal/logistics/arrow_icon.png' : '/img/personal/logistics/arrow_icon_hl.png'" alt="">
                        </div>
                        <div class="logistics-steps-item">
                            <div>
                                <img :src="currentDate !== signforTime ? '/img/personal/logistics/qs_icon.png' : '/img/personal/logistics/qs_icon_hl.png'" alt="">
                                <p :class="{'logistics-title': true, active: (currentDate > signforTime) && orderDeatil.ShippingStatus != 0}">签收</p>
                                <!-- <p class="logistics-time" v-if="currentDate === signforTime">{{signforTime | ToSplit}}</p> -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 分割线  -->
                <div class="line"></div>
                <!-- 商品清单 -->
                <div class="inventory">
                    <p class="inventory-title">商品清单</p>
                    <el-table
                        :data="tableData">
                        <el-table-column
                            label="商品信息"
                            width="450">
                            <template slot-scope="scope">
                                <div class="orderInfo-thumb">
                                    <div class="orderInfo-thumb-wrap">
                                        <div class="thumbnail" v-if="scope.row.filepath.indexOf('.png') > -1" :style="{'background-image': `url(${$store.state.port.imgBaseUrl + scope.row.filepath})`}"></div>
                                        <div class="thumbnail" v-else :style="{'background-image': `url(${scope.row.thumb.indexOf('aliyin') > -1 ? scope.row.thumb : $store.state.port.imgBaseUrl+scope.row.thumb})`}"></div>
                                    </div>
                                    <div class="orderInfo-tip">
                                        <p>名称: <span>{{scope.row.name}}</span></p>
                                        <p>规格: <span>{{scope.row.spec}}</span></p>
                                        <p v-if="scope.row.crafts">工艺: <span>{{scope.row.crafts}}</span></p>
                                        <p v-if="scope.row.size">尺寸: <span>{{scope.row.size}}</span></p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="文件信息">
                            <template slot-scope="scope">
                                <div class="order-file" v-if="scope.row.tempname">
                                    <span style="cursor: pointer;" title="点击可下载模板文件" @click="handleDown(scope.row)">{{scope.row.tempname}}</span>
                                </div>
                                <div class="order-file" v-if="!scope.row.tempname">
                                    <div v-if="scope.row.fileName == ''" class="upload-file" @click="handleUpload(scope.row)">
                                        <!-- <img src="/img/print/xqy_scwj_icon.png" alt="">
                                        <span>上传文件</span> -->
                                    </div>
                                    <span class="download-name" v-else @click="handleDownload(scope.row)" title="点击可下载文件">
                                        {{scope.row.fileName}}
                                        <!-- <img src="/img/print/xqy_refresh_icon.png" alt="" title="重新上传文件" @click.stop="handleUpload(scope.row)"> -->
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                            prop="unitPrice"
                            label="单位(元)">
                        </el-table-column> -->
                        <el-table-column
                            prop="quantity"
                            label="数量">
                        </el-table-column>
                        <el-table-column
                            label="小计(元)">
                            <template slot-scope="scope">
                                <span style="color: rgba(255,1,1,1)">￥{{scope.row.total}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="state"
                            label="状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.state == 0">等待印刷</span>
                                <span v-else-if="scope.row.state == 1">印刷中</span>
                                <span v-else>印刷完成</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog title="上传文件" :visible.sync="$store.state.dialogUpload" :close-on-click-modal="false" :lock-scroll="false">
                    <UploadFile @setCartFile="setCartFile"></UploadFile>
                </el-dialog>
                <!-- 分割线 -->
                <div class="line"></div>
                <!-- 收货信息 -->
                <div class="receiving">
                    <p class="receiving-title">收货信息</p>
                    <div class="receiving-info">
                        <p>收货姓名: <span>{{orderDeatil.ShipName}}</span></p>
                        <p>收货电话: <span>{{orderDeatil.ShipCellPhone && orderDeatil.ShipCellPhone.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')}}</span></p>
                        <p>收货地址: <span>{{orderDeatil.ShipRegion}} {{orderDeatil.ShipAddress}}</span></p>
                    </div>
                </div>
                <!-- 分割线 -->
                <div class="line"  v-if="orderDeatil.PaymentStatus == 2"></div>
                <!-- 支付信息 -->
                <div class="payment-info" v-if="orderDeatil.PaymentStatus == 2">
                    <p class="payment-title">支付方式</p>
                    <p class="payment-method">支付方式: <span>{{orderDeatil.PaymentTypeName}}（交易号：{{orderDeatil.PayCurrencyCode}}）</span></p>
                </div>
                <!-- 分割线 -->
                <div class="line"></div>
                <!-- 发票信息 -->
                <div class="invoice" v-if="orderDeatil.InvoiceState == '1'">
                    <p class="invoice-title">发票信息</p>
                    <div class="invoice-info">
                        <p>
                            <span>发票类型: <span v-if="orderDeatil.MakeType == '0'">纸质发票</span><span v-if="orderDeatil.MakeType == '1'">电子发票</span></span>
                            <span class="invoice-btn">查看发票</span>
                        </p>
                        <p>发票内容: <span>{{orderDeatil.InvoiceInfo}}</span></p>
                        <p>发票抬头: <span>{{orderDeatil.InvoiceTitle}}</span></p>
                        <p>纳税识别号: <span>{{orderDeatil.RegisterNo}}</span></p>
                    </div>
                </div>
                <div v-else style="padding: 30px;">
                    没有发票信息<span style="color: rgba(0,131,233,1)">去开票</span>
                </div>
                <!-- 分割线 -->
                <div class="line"></div>
                <div class="pay-price">
                    <div class="pay-price-info">
                        <p>
                            <span>商品总价:</span>
                            <span class="price">{{orderDeatil.ProductTotal && orderDeatil.ProductTotal.toFixed(2)}}元</span>
                        </p>
                        <p>
                            <span>运费:</span>
                            <span class="price">+{{orderDeatil.FreightActual && orderDeatil.FreightActual.toFixed(2) || 0}}元</span>
                        </p>
                        <p>
                            <span>优惠券:</span>
                            <span class="price">-{{orderDeatil.CouponAmount && orderDeatil.CouponAmount.toFixed(2) || 0}}元</span>
                        </p>
                        <p>
                            <span>活动优惠:</span>
                            <span class="price">-0.00元</span>
                        </p>
                        <p style="margin-top: 10px;">
                            <span class="actual-title">实付金额:</span>
                            <span class="actual price">{{orderDeatil.Amount && orderDeatil.Amount.toFixed(2)}}元</span>
                        </p>
                        <div class="to-pay" @click="handleToPay" v-if="orderDeatil.PaymentStatus == 0">去付款</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import svgToPng from 'save-svg-as-png'
import UploadFile from '@/components/share/UploadFile.vue'
export default {
    data() {
        return {
            tableData: [],
            orderDeatil: {},
            currentDate:'',
            signforTime: '',
            itemId: '',
            filepath: '',
            filename: ''
        }
    },
    props: ['id'],
    methods: {
        handleBack() {  // 返回订单列表页
            this.$emit('setOrder', {msg: 'PrintOrder', id: ''})
        },

        handleUpload(row) {  // 上传文件弹框
            console.log(row)
            if(this.orderDeatil.PaymentStatus != '0') return this.$message.warning('该订单已支付无法上传文件')
            this.itemId = row.itemId
            this.$store.commit('setDialogUpload', true)
        },
        setCartFile(msg) {
            console.log(msg)
            this.filepath = msg.path
            this.filename = msg.name
            this.$nextTick(() => {
                this.getUpload()
            })
        },   
        getUpload() { // 确定上传文件
            var formData = new FormData()
            formData.append('ItemID', this.itemId);
            formData.append('FilePath', this.filepath);
            formData.append('FileName', this.filename);
            console.log(this.itemId, this.filepath, this.filename, '参数')
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/UploadOrderFile', formData, config).then(res => {
                console.log(res.data)
                if(res.data.state == 'ok'){
                    this.$message.success(res.data.message)
                    this.getOrderDetail()
                }else{
                    this.$message.warning(res.data.message)
                }
            })
        },
        // 下载文件
        handleDownload(row) {
            var url = row.filepath.split('.')[1]
            if(url == 'zip'){
                window.open(this.$store.state.port.imgBaseUrl + row.filepath)
            }

            var canvas = document.createElement('canvas');
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onerror = function () {
                return 
            };
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                
                svgToPng.download(row.fileName, canvas.toDataURL('image/png'))
            };
            img.src = this.$store.state.port.imgBaseUrl + row.filepath;
        },
        // 下载pdf文件
        handleDown(row) {
            console.log(row)
            if(row.filepath == '') return this.$message.warning('文件正在生成中，请稍后刷新页面再试')
            this.$axios.get(this.$store.state.port.imgBaseUrl + row.filepath, {responseType: 'blob'})
            .then(({data}) => {
                var a = document.createElement('a')
                a.download = '订单号: ' + this.orderDeatil.OrderCode + ' ' + '子订单号: ' + row.orderId + ' ' + '产品名称: ' + row.typename + ' ' + '报价单名称: ' + row.name + ' ' + '尺寸: ' + row.size + ' ' + '价格: ' + row.total + ' ' + '数量: ' + row.quantity + ' ' + '发货地区: ' + this.orderDeatil.ShipRegion + ' ' + '地址: ' + this.orderDeatil.ShipAddress + ' ' + '收货人: ' + this.orderDeatil.ShipName + ' ' + '电话: ' + this.orderDeatil.ShipCellPhone + ' ' + '模板名称: ' + row.tempname + '.pdf'
                a.href = URL.createObjectURL(data)
                a.click()
                a = null
            })
        },
 

        // 获取单个订单详情
        getOrderDetail() {
            if(this.id == '') return 
            this.$axios.get('/order?Id=' + this.id).then(res =>{
                console.log(res.data)
                this.orderDeatil = res.data
                var data = res.data.OrderItems
                var list = []
                for(var i=0;i<data.length;i++) {
                    var obj = {}
                    obj.thumb = data[i].ThumbnailsUrl
                    obj.name = data[i].Name
                    obj.spec = data[i].AttributeNames
                    obj.crafts = data[i].CraftNames
                    // obj.unitPrice = data[i].Amount
                    obj.quantity = data[i].Quantity + data[i].Unit
                    obj.total = data[i].Amount
                    obj.state = data[i].ItemStatus
                    obj.fileName = data[i].FileName
                    obj.filepath = data[i].FilePath
                    obj.itemId = data[i].ItemId
                    obj.size = data[i].SizeName
                    obj.tempname = data[i].DocumentName
                    obj.orderId = data[i].OrderId
                    obj.typename = data[i].TypeName
                    list[i] = obj
                }
                this.tableData = list

                this.setcurrentDate()
                this.setSignforDate()
            })
        },
        handleToPay() { // 去付款
            let code = this.orderDeatil.OrderCode
            this.$router.push({path: '/cashier', query: {code}})
        },

        setcurrentDate() {  // 获取当前日期
            var date = new Date()
            var nowHours = date.getHours();
            var nowMin = date.getMinutes();
            var nowSeconds = date.getSeconds();
            function p(str) {
                if(str.length<=1){
                    str='0'+str;
                }
                return str
            }
            nowHours = p(nowHours)
            nowMin = p(nowMin)
            nowSeconds = p(nowSeconds)
            this.currentDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + nowHours + ':' + nowMin + ':' + nowSeconds
            console.log(this.currentDate)
        },
        setSignforDate() {  // 获取签收日期
            var date = new Date(this.orderDeatil.CreatedDate)
            var newDate = new Date(date.getFullYear(),date.getMonth(),date.getDate()+15)
            var year = newDate.getFullYear();
            var month = newDate.getMonth()+1;
            var day = newDate.getDate();
            var hours = newDate.getHours();
            var min = newDate.getMinutes();
            var seconds = newDate.getSeconds();
            function p(str) {
                if(str.length<=1){
                    str='0'+str;
                }
                return str
            }
            hours = p(hours)
            min = p(min)
            seconds = p(seconds)
            newDate = year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + seconds
            this.signforTime = newDate
            console.log(this.signforTime)
        }
    },
    filters: {
        ToSplit(time) {
            if(!time) return
            time = time.split('T').join(' ')
            return time
        }
    },
    mounted() {
        this.getOrderDetail()
    },
    components: {
        UploadFile
    }
}
</script>

<style lang="scss" scoped>

#order-detail{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.order-detail .el-dialog{
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
        padding: 28px 36px;
    }
}

.order-detail{
    min-width: 1200px;
    margin: 0 auto;
    .order-detail-header{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        display: flex;
        justify-content: space-between;
        line-height: 76px;
        padding: 0 32px 0 20px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        font-size:18px;
        color:rgba(51,51,51,1);
        .back{
            font-size:14px;
            color:rgba(153,153,153,1);
            cursor: pointer;
            &:hover{
                color: $color;
            }
        }
    }
    .order-details{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        margin-top: 41px;
        .logistics{
            padding: 11px 30px 34px;
            .logistics-header{
                display: flex;
                justify-content: space-between;
                line-height: 34px;
                p{
                    font-size:16px;
                    color:rgba(102,102,102,1);
                }
                .logistics-btn{
                    display: flex;
                    div{
                        width: 82px;
                        text-align: center;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .payment{
                        background:rgba(243,152,0,1);
                        border-radius:5px;
                        color:rgba(255,255,255,1);
                        margin-right: 29px;
                    }
                    .cancel-order{
                        background:rgba(255,255,255,1);
                        border:1px solid rgba(210,210,210,1);
                        border-radius:5px;
                        color:rgba(51,51,51,1);
                    }
                }
            }
            .logistics-steps{
                display: flex;
                justify-content: space-around;
                padding: 51px 80px 0;
                margin: 0 auto;
                .logistics-steps-item{
                    text-align: center;
                    position: relative;
                    color:rgba(153,153,153,1);
                    display: flex;
                    .logistics-title{
                        font-size: 16px;
                        margin: 10px 0 5px;
                    }
                    .active{
                        color: rgba(51,51,51,1);
                    }
                    .logistics-time{
                        font-size: 14px;
                    }
                    .steps{
                        display: inline-block;
                        width: 67px;
                        height: 19px;
                        margin: 37px 27px;
                    }
                }
            }
        }
        .line{
            width: 100%;
            height:10px;
            background:rgba(244,244,244,1);
        }
        .inventory{
            padding: 30px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,51,51,1);
            .inventory-title{
                font-size:18px;
                margin-bottom: 14px;
            }
            .el-table .download-name{
                cursor: pointer;
                img{
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }
        .receiving{
            padding: 30px;
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(102,102,102,1);
            .receiving-title{
                font-size: 18px;
                color: rgba(51,51,51,1);
                margin-bottom: 15px;
            }
            .receiving-info{
                display: inline-block;
                text-align: left;
                line-height: 30px;
            }
        }
        .payment-info{
            padding: 30px;
            .payment-title{
                font-size: 18px;
                color: rgba(51,51,51,1);
                margin-bottom: 15px;
            }
            .payment-method{
                font-size: 16px;
                color: rgba(102,102,102,1);
            }
        }
        .invoice{
            padding: 30px;
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(102,102,102,1);
            .invoice-title{
                font-size: 18px;
                color: rgba(51,51,51,1);
                margin-bottom: 15px;
            }
            .invoice-info{
                text-align: left;
                line-height: 30px;
                .invoice-btn{
                    background:rgba(255,255,255,1);
                    border:1px solid $color;
                    border-radius:5px;
                    color: $color;
                    padding: 5px 8px 6px;
                    text-align: center; 
                    margin-left: 26px;
                    cursor: pointer;
                }
            }
        }
    }
}
.pay-price{
    padding: 30px;
    font-size: 16px;
    display: flex;
    justify-content: flex-end;
    .pay-price-info{
        text-align: right;
        p{
            width: 250px;
            display: flex;
            justify-content: space-between;
            line-height: 36px;
            .price{
                color: rgba(255,0,0,1);
            }
            .actual{
                font-size: 36px;
                color: rgba(254,0,0,1);
            }
        }
        .actual-title{
            margin-top: 16px;
            line-height: 16px;
        }
        .to-pay{
            background:$color;
            border-radius:5px;
            color:rgba(254,254,254,1);
            font-size: 18px;
            text-align: center;
            line-height: 48px;
            width: 179px;
            margin: 61px 0 26px 71px;
            cursor: pointer;
        }
    }
}
.orderInfo-thumb{
    display: flex;
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
    .orderInfo-tip{
        text-align: left;
        line-height: 23px;
    }
}
.upload-file{
    // border:1px solid rgba(254,108,35,1);
    border-radius:5px;
    text-align: center;
    width: 118px;
    height: 43px;
    line-height: 43px;
    margin-top: 23px;
    margin: 0 auto;
    // cursor: pointer;
    img{
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
    }
}
</style>
