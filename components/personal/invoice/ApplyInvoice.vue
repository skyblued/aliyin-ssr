<template>
    <div id="apply-invoice">
        <div class="apply-invoice">
            <div class="apply-invoice-header">
                <el-form :inline="true" class="form-inline">
                    <el-form-item label="订单号: ">
                        <el-input v-model="formInline.code" @keyup.native="getSearch($event)"></el-input>
                    </el-form-item>
                    <el-form-item label="下单时间: " class="form-item">
                        <div class="block-date">
                            <el-date-picker
                                v-model="formInline.startTime"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择开始日期"
                                :picker-options="pickerOptions0">
                            </el-date-picker>
                        </div>
                        <span class="range">~</span>
                        <div class="block-date">
                            <el-date-picker
                                v-model="formInline.endTime"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择结束日期"
                                :picker-options="pickerOptions1">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <div class="screen" @click="getInvoiceOrder">搜索</div>
                </el-form>
                <span class="back" @click="handleBack"><i class="el-icon-arrow-left"></i>返回</span>
            </div>
            <p class="Tips">提示：支付成功7天之后才能申请发票</p>
            <div class="invoice-content" v-if="orderList.length">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item :name="i" v-for="(item,i) in orderList" :key="i">
                        <template slot="title">
                            <div class="order-info">
                                <div>
                                    <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
                                        <el-checkbox :label="i">订单号: {{item.OrderCode}}</el-checkbox>
                                    </el-checkbox-group>
                                    <span style="margin-right: 53px;">总额: {{item.Amount}}</span>
                                    <span>应付: <span style="color: rgba(255,0,0,1)">{{item.Amount}}</span></span>
                                </div>
                                <span class="time">{{item.CreatedDate && item.CreatedDate.split('T').join(' ')}}</span>
                            </div>
                        </template>
                        <div class="orderInfo-list">
                            <div class="orderInfo-item" v-for="(items, index) in item.OrderItems" :key="index">
                                <div class="orderInfo-thumb">
                                    <div class="orderInfo-thumb-wrap">
                                        <div class="thumbnail" v-if="items.FilePath.indexOf('.png') > -1" :style="{'background-image':`url(${$store.state.port.imgBaseUrl + items.FilePath})`}"></div>
                                        <div class="thumbnail" :style="{'background-image': `url(${items.ThumbnailsUrl.indexOf('aliyin') > -1 ? items.ThumbnailsUrl : $store.state.port.imgBaseUrl+items.ThumbnailsUrl})`}"></div>
                                    </div>
                                    <div class="orderInfo-tip">
                                        <p>名称: <span>{{items.Name}}</span></p>
                                        <p>规格: <span>{{items.AttributeNames}}</span></p>
                                        <p v-if="items.CraftNames">工艺: <span>{{items.CraftNames}}</span></p>
                                        <p v-if="items.SizeName">尺寸: <span>{{items.SizeName}}</span></p>
                                    </div>
                                </div>
                                <div class="orderInfo-name">印刷订单</div>
                                <div class="orderInfo-file">
                                    <div class="upload-file" v-if="!items.FileName">
                                        <img src="/img/print/xqy_scwj_icon.png" alt="">
                                        <span>上传文件</span>
                                    </div>
                                    <span v-else @click="handleDownload(items)" title="点击可下载文件">{{items.FileName}}</span>
                                </div>
                                <div class="orderInfo-number">{{items.Quantity + items.Unit}}</div>
                                <div style="color: rgba(255, 1, 1, 1)">￥{{items.Amount && items.Amount.toFixed(2)}}</div>
                                <div class="orderInfo-state">印刷完成</div>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <div class="invoice-bottom">
                    <div class="settlement">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <span>已选订单数<span style="color: rgba(0, 131, 233, 1);margin-left: 5px;">{{orders}}</span>，订单总金额: <span style="color: rgba(255, 0, 0, 1)">{{orderTotal && orderTotal.toFixed(2)}}</span></span>
                    </div>
                    <div class="apply-block">
                        <HomePagination :Page="page" v-if="page.totalRecords > 10" />
                    </div>
                </div>
                <div class="line"></div>
                <div class="apply-info">
                    <div class="invoice-rise">
                        <p class="invoice-rise-title">发票抬头</p>
                        <div class="rise-list">
                            <div :class="['rise-item', activeIndex == i ? 'active' : '']" v-for="(item,i) in invoiceList" :key="i" @click="handleChooseInvoice(i)">
                                <i class="delete-icon" title="删除" @click.stop="handleDelete(item,i)"></i>
                                <i class="modify" @click.stop="handleModifyInvoice(item)" title="修改"></i>
                                <p>{{item.InvoiceTitle}}</p>
                                <p>{{item.RegisterNo}}</p>
                                <p v-if="item.MakeType == '1'">电子发票</p>
                                <p v-if="item.MakeType == '0'">纸质发票</p>
                                <p>{{item.Email}}</p>
                            </div>
                            <div class="rise-add-item" @click="handleAddInvoice">
                                <img src="/img/personal/add_gray_icon.png" alt="">
                                <span>添加新发票抬头</span>
                            </div>
                        </div>
                        <el-dialog title="添加发票抬头" :visible.sync="$store.state.login.dialogAddInvoice" :close-on-click-modal="false" :lock-scroll="false">
                            <AddInvoice @getInvoice="getInvoice"></AddInvoice>
                        </el-dialog>
                        <el-dialog title="修改发票抬头" :visible.sync="$store.state.login.dialogModifyInvoice" :close-on-click-modal="false" :lock-scroll="false">
                            <ModifyInvoice @getInvoice="getInvoice" :id="InvoiceId"></ModifyInvoice>
                        </el-dialog>
                    </div>
                    <div class="invoice-address" v-if="invoiceType == 0">
                        <p class="invoice-address-title">收件地址</p>
                        <div class="address-list">
                            <div :class="['rise-item', item.IsDefault ? 'active' : '']" v-for="(item,i) in addressList" :key="i" @click="handleChooseAddress(i)">
                                <i class="delete-icon"></i>
                                <i class="modify" @click.stop="handleModifyAddress(item)"></i>
                                <p class="full-name">{{item.ShipName}}</p>
                                <p>{{item.CelPhone}}</p>
                                <p class="item-address"><span>{{item.RegionFullName}}</span> <span>{{item.Address}}</span></p>
                            </div>
                            <div class="rise-add-item" @click="handleAdd">
                                <img src="/img/personal/add_gray_icon.png" alt="">
                                <span>添加新地址</span>
                            </div>
                        </div>
                    </div>
                    <el-dialog title="添加收货地址" :visible.sync="$store.state.login.dialogAdd" :close-on-click-modal="false" :modal-append-to-body="false" :lock-scroll="false">
                        <AddToAddress @setAddress="getAddress"></AddToAddress>
                    </el-dialog>
                    <el-dialog title="修改地址" :visible.sync="$store.state.login.dialogModify" :close-on-click-modal="false" :lock-scroll="false">
                        <ModifyAddress :id="shipId"></ModifyAddress>
                    </el-dialog>
                    <div class="sureBtn" @click="handleOpenInvoice">确认提交开票申请</div>
                </div>
            </div>
            <div v-if="!orderList.length && !show" class="error-tips">
                <img src="/img/error/ku.png" alt="">
                <p>暂无可开票订单</p>
            </div>
        </div>
    </div>
</template>

<script>
import svgToPng from 'save-svg-as-png'
import HomePagination from '@/components/home/HomePagination.vue'
import AddToAddress from '@/components/personal/address/AddToAddress.vue'
import ModifyAddress from '@/components/personal/address/ModifyAddress.vue'
import AddInvoice from '@/components/personal/invoice/AddInvoice.vue'
import ModifyInvoice from '@/components/personal/invoice/ModifyInvoice.vue'
export default {
    data () {
        return {
            formInline: {
                code: '',
                startTime: '',
                endTime: ''
            },
            pickerOptions0: {
                disabledDate: (time) => {
                    if (this.formInline.endTime) {
                        return time.getTime() > new Date(this.formInline.endTime).getTime();
                    } else {
                        return time.getTime() > Date.now();
                    }
                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    if(this.formInline.startTime){
                        return (
                            time.getTime() > Date.now() ||
                            time.getTime() < new Date(this.formInline.startTime).getTime()
                        );
                    }else{
                        return time.getTime() > Date.now();
                    }
                }
            },
            activeNames: ['1'],
            orderList: [],
            checkedList: [],
            isIndeterminate: true,
            checkAll: false,
            checkedId: [],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 10,    // 每页个数
            },
            addressList: [],     // 地址列表
            shipId: '',      // 地址id
            invoiceList: [],     // 发票抬头列表
            InvoiceId: '',   // 发票id
            activeIndex: 0,
            Index: 0,

            orders: 0,  // 已选订单数
            orderTotal: 0,  // 订单总金额
            ordercode: [],  // 开票订单列表
            invoiceType: '',  // 发票类型  
            show: true
        }
    },
    methods: {
        handleCheckedListChange(value) {
            this.ordercode = []
            value.forEach(item => {
                this.ordercode.push(this.orderList[item].OrderCode)
            })
            this.orders = value.length
            let checkedCount = value.length
            this.checkAll = checkedCount === this.checkedId.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedId.length

            var j = 0
            for(var a=0,sum=0;a<value.length;a++){
                j = value[a]
                sum += this.orderList[j].Amount
            }
            this.orderTotal = sum
            
        },
        handleCheckAllChange(val) {
            console.log(val)
            this.checkedList = val ? this.checkedId : []
            this.isIndeterminate = false;
            this.ordercode = []
            this.orderTotal = 0
            if (val) {
                for(var i=0;i<this.orderList.length;i++) {
                    this.orderTotal += this.orderList[i].Amount
                    this.ordercode.push(this.orderList[i].OrderCode)
                }
            } 
        },
        handleAdd() {  // 添加新地址
            this.$store.commit('login/setDialogAdd', true)
        },

        handleBack() {  // 返回
            this.$emit('setInvoice', {msg: 'InvoiceList'})
        },

        // 订单号搜索
        getSearch(e) {
            if (e.keyCode == 13) {
                this.getInvoiceOrder()
                this.formInline.code = ''
            }
        },
        // 获取可开票订单列表
        getInvoiceOrder() {
            this.orderList = []
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.formInline.startTime = ''
                this.formInline.endTime = ''
            }
            var url = '/InvoiceOrder?StartTime=' + this.formInline.startTime + '&EndTime=' + this.formInline.endTime + '&OrderCode=' + this.formInline.code
            this.$axios.get(url).then(res => {
                if(res == undefined) return console.log('没有数据')
                console.log(res.data)
                if(res.data.length == 0) this.show = false
                this.orderList = res.data
                if(this.orderList.length > 0) this.show = false
                this.page.totalRecords = res.data.length

                for (let i = 0; i < this.orderList.length; i++) {
                    this.checkedId.push(i)
                }
            })
        },

        // 下载文件
        handleDownload(items){
            var url = items.FilePath.split('.')[1]
            if(url == 'zip'){
                window.open(this.$store.state.port.imgBaseUrl + items.FilePath)
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
                
                svgToPng.download(items.FileName, canvas.toDataURL('image/png'))
            };
            img.src = this.$store.state.port.imgBaseUrl + items.FilePath;
        },


        handleChange(val) {
            //console.log(val);
        },
        
        // 开发票
        handleOpenInvoice() {
            new Promise((resolve, reject) => {
                console.log(this.ordercode)
                let order = this.ordercode.join(',') + ','
                if(order == '') {
                    this.$message({type: 'warning', message: '请先选择订单'})
                    return 
                }
                if(this.invoiceList.length == 0) return this.$message({type: 'warning', message: '请先填写发票抬头'})
                // if(this.addressList) return this.$message({type: 'warning', message: '请先填写地址'})
                let addressId;
                if (this.invoiceType == 0) addressId = this.shipId
                else addressId = ''
                var formData = new FormData()
                formData.append('OrderCodes', order);
                formData.append('IncoiveID', this.InvoiceId);
                formData.append('AddressID', addressId);
                console.log(order, this.InvoiceId, addressId)
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/InvoiceOrder', formData, config).then(res => {
                    //console.log(res.data)
                    if (res.data == 'success') {
                        this.$message({type: 'success', message: '提交申请开票成功'})
                        this.getInvoiceOrder()
                    }
                })
                resolve()
            })
        },

        // 获取收件地址
        getAddress() {
            this.$axios.get('/shipaddresses?TeamNum=' + localStorage['teamNum']).then(res =>{
                if(!res.data.length) return console.log('没有数据')
                //console.log(res.data)
                this.addressList = res.data
                this.shipId = res.data[0].ShippingId
            })
        },
        // 选择地址
        handleChooseAddress(i) {
            this.addressList.forEach((item,index) => {
                item.IsDefault = false
                if(index == i) {
                    this.addressList[i].IsDefault = true
                }
            })
        },
        // 修改地址
        handleModifyAddress(item) {

            this.shipId = item.ShippingId
            this.$store.commit('login/setDialogModify', true)
        },

        // 获取发票抬头
        getInvoice() {
            var formData = new FormData()
            formData.append('TeamNum', localStorage['teamNum']);
            formData.append('pageSize', 12);
            formData.append('pageIndex', 0);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamInvoices', formData, config).then(res => {
                if(!JSON.parse(res.data).Data.length) return console.log('没有数据')
                console.log(JSON.parse(res.data))
                var data = JSON.parse(res.data).Data
                this.invoiceList = data
                this.InvoiceId = data[0].Id
                this.invoiceType = data[0].MakeType
            })
        },
        // 选择发票抬头
        handleChooseInvoice(i) {
            this.activeIndex = i
            this.invoiceType = this.invoiceList[i].MakeType
        },

        // 添加发票抬头
        handleAddInvoice() {
            this.$store.commit('login/setDialogAddInvoice', true)
        },

        // 修改发票抬头
        handleModifyInvoice(item) {
            this.InvoiceId = item.Id
            this.$store.commit('login/setDialogModifyInvoice', true)
        },
        // 删除发票抬头
        handleDelete(item,i) {
            this.$confirm('是否删除该发票?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var formData = new FormData()
                formData.append('Id', item.Id);
                let config = { 
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/TeamInvoice', {data: formData}, config).then(res => {
                    //console.log(res)
                    if(res.data == true){
                        this.$message({type: 'success',message: '删除成功'})
                        this.tableData.splice(i,1)
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
        }
    },
    mounted() {
        this.getAddress()
        this.getInvoice()
        this.getInvoiceOrder()
    },
    components: {
        HomePagination,
        AddToAddress,
        ModifyAddress,
        AddInvoice,
        ModifyInvoice
    }
}
</script>

<style lang="scss">

#apply-invoice{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.apply-invoice .apply-invoice-header{
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius:10px;
    height: 76px;
    line-height: 76px;
    padding-left: 20px;
    padding-right: 30px;
    display: flex;
    justify-content: space-between;
    .el-form{
        line-height: 37px;
    }
    .back{
        color:rgba(153,153,153,1);
        font-size: 16px;
        cursor: pointer;
        &:hover{
            color: $color;
        }
    }
}

.apply-invoice .invoice-rise .el-dialog .el-dialog__body{
    padding: 30px 20px;
}

.apply-invoice .el-dialog{
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

.apply-invoice{
    min-width: 1200px;
    margin: 0 auto;
    .Tips{
        font-size:12px;
        color:rgba(243,152,0,1);
        margin: 12px 0;
    }
    .invoice-content{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        .el-collapse{
            .el-collapse-item{
                .el-collapse-item__header{
                    padding: 0 22px 0 30px;
                    height: 65px;
                    font-size:16px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(102,102,102,1);
                    border-radius: 10px;
                    .el-checkbox-group{
                        margin-right: 70px;
                    }
                    .time{
                        margin-right: 47px;
                    }
                    .el-icon-arrow-right::before{
                        content: '';
                    }
                    .el-icon-arrow-right{
                        background-image: url(/img/personal/zk_down_icon.png);
                        width: 20px;
                        height: 20px;
                    }
                    .el-collapse-item__arrow.is-active{
                        transform: rotate(-180deg);
                    }
                }
                .el-collapse-item__content{
                    background:rgba(244,244,244,1);
                }
            }
        }
        .order-info{
            width: 100%;
            display: flex;
            justify-content: space-between;
            div{
                display: flex;
            }
        }
        .invoice-bottom{
            display: flex;
            justify-content: space-between;
            padding: 25px 30px;
            .settlement{
                font-size:16px;
                color:rgba(102,102,102,1);
            }
            .apply-block{
                margin-right: 74px;
                .block{
                    margin: 0;
                }
            }
        }
        .line{
            width: 100%;
            height:10px;
            background:rgba(244,244,244,1);
        }
        .apply-info{
            padding: 30px;
            font-size:14px;
            color:rgba(102,102,102,1);
            .active{
                border: 1px solid $color;
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
            .invoice-rise{
                .invoice-rise-title{
                    font-size:18px;
                    color:rgba(51,51,51,1);
                    margin-bottom: 24px;
                }
                .rise-list{
                    display: flex;
                }
            }
            .invoice-address{
                margin-top: 40px;
                .invoice-address-title{
                    font-size:18px;
                    color:rgba(51,51,51,1);
                    margin-bottom: 24px;
                }
            }
            .sureBtn{
                background:$color;
                border-radius:5px;
                color: rgba(255,255,255,1);
                line-height: 48px;
                text-align: center;
                cursor: pointer;
                width: 179px;
                font-size: 18px;
                margin: 55px 0 37px;
            }
        }
    }
    .error-tips{
        text-align: center;
        margin-top: 200px;
    }
}
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
</style>
