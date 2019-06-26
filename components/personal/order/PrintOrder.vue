<template>
    <div id="print-order">
        <div class="print-order">
            <el-form :inline="true" class="form-inline">
                <el-form-item label="订单号: ">
                    <el-input v-model="formInline.code" @keyup.native="getSearch($event)"></el-input>
                </el-form-item>
                <el-form-item label="订单状态: ">
                    <el-select v-model="formInline.state" class="select">
                        <el-option v-for="(item,index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
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
                <div class="screen" @click="getOrderList()">搜索</div>
            </el-form>

            <div id="Loading" v-if="loading">
                <div class="loader-inner ball-beat">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div class="print-order-list" v-if="printOrder.length">
                <div class="print-order-item" v-for="(item,i) in printOrder" :key="i">
                    <div class="order-item-header">
                        <div class="item-header-left">
                            <span class="order-number" @click="handleJumpDetail(i)" title="点击查看订单详情">订单号: {{item.OrderCode}}</span>
                            <span class="order-time">{{item.CreatedDate && item.CreatedDate.split('T').join(' ')}}</span>
                            <span class="total-orders">总额: ￥{{item.Amount && item.Amount.toFixed(2)}}</span>
                            <span class="payable">应付: <span style="color: rgba(255, 0, 0, 1);">￥{{item.Amount && item.Amount.toFixed(2)}}</span></span>
                        </div>
                        <div class="item-header-right" v-if="item.PaymentStatus == 0">
                            <div class="payment-btn" @click="handleToPay(i)">去支付</div>
                            <div class="cancel-order" @click="handleCancel(i)">取消订单</div>
                        </div>
                        <div class="item-header-right" v-if="item.PaymentStatus == 2">支付成功</div>
                    </div>
                    <div class="orderInfo-list">
                        <div class="orderInfo-item" v-for="(items, index) in item.OrderItems" :key="index">
                            <div class="orderInfo-thumb">
                                <div class="orderInfo-thumb-wrap">
                                    <div class="thumbnail" v-if="items.FilePath.indexOf('.png') > -1" :style="{'background-image' : `url(${$store.state.port.imgBaseUrl + items.FilePath})`}"></div>
                                    <div class="thumbnail" v-else :style="{'background-image': `url(${items.ThumbnailsUrl.indexOf('http') > -1 ? items.ThumbnailsUrl : items.ThumbnailsUrl && $store.state.port.imgBaseUrl + items.ThumbnailsUrl})`}"></div>
                                </div>
                                <div class="orderInfo-tip">
                                    <p>名称: <span>{{items.Name}}</span></p>
                                    <p>规格: <span>{{items.AttributeNames}}</span></p>
                                    <p v-if="items.SizeName">尺寸: <span>{{items.SizeName}}</span></p>
                                    <p v-if="items.CraftNames">工艺: <span>{{items.CraftNames}}</span></p>
                                </div>
                            </div>
                            <div class="orderInfo-name" v-if="item.OrderType == 1">印刷订单</div>
                            <div class="orderInfo-file" v-if="items.DocumentName">
                                <span style="cursor: pointer;" title="点击可下载模板文件" @click="handleDown(item,items)">{{items.DocumentName}}</span>
                            </div>
                            <div class="orderInfo-file" v-if="!items.DocumentName">
                                <div v-if="!items.FileName" class="upload-file" @click="handleUpload(items,i)">
                                    <!-- <img src="/img/print/xqy_scwj_icon.png" alt="">
                                    <span>上传文件</span> -->
                                </div>
                                <span v-else @click="handleDownload(items)" title="点击可下载文件">
                                    <span class="fileName">{{items.FileName ? items.FileName : '未命名'}}</span>
                                    <!-- <img src="/img/print/xqy_refresh_icon.png" alt="" title="重新上传文件" @click.stop="handleUpload(items,i)"> -->
                                </span>
                            </div>
                            <div class="orderInfo-number">{{items.Quantity}}{{items.Unit}}</div>
                            <div style="color: rgba(255, 1, 1, 1)">￥{{item.Amount}}</div>
                            <div class="orderInfo-state">
                                <span v-if="items.ItemStatus == 0">等待印刷</span>
                                <span v-else-if="items.ItemStatus == 1">印刷中</span>
                                <span v-else>印刷完成</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog title="上传文件" :visible.sync="$store.state.dialogUpload" :close-on-click-modal="false" :lock-scroll="false">
                <UploadFile @setCartFile="setCartFile"></UploadFile>
            </el-dialog>
            <div class="block" v-if="printOrder.length && page.totalRecords > 10">
                <HomePagination :Page="page" @getTempList="getOrderList" />
            </div>

            <div class="none-order" v-if="!printOrder.length && !loading">
                <img src="/img/error/ku.png" alt="">
                <p>暂时没有任何订单</p>
                <p style="font-size: 14px;margin-top: 10px;">请从在线印刷场景中创建订单</p>
            </div>
        </div>
    </div>
</template>

<script>
import svgToPng from 'save-svg-as-png'
import UploadFile from '@/components/share/UploadFile.vue'
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            formInline: {
                state: '-1',
                code:'',
                startTime: '',
                endTime: ''
            },
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 10,    // 每页个数
            },
            show: false,
            none: false,
            status: [{
                value: '-1',
                label: '全部'
            },{
                value: '0',
                label: '未支付'
            },{
                value: '2',
                label: '已支付'
            }],
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
            printOrder: [],
            itemId: '',
            filepath: '',
            filename: '',
            loading: true
        }
    },
    methods: {
        handleJumpDetail(i) {
            let orderId = this.printOrder[i].OrderId
            this.$emit('setOrder', {msg: 'OrderDetail', id: orderId})
        },
        handleToPay(i) {  // 去支付
            let code = this.printOrder[i].OrderCode
            this.$router.push({path: '/cashier', query: {code}})
        },
        handleCancel(i) {  // 取消订单
            this.$confirm('是否取消该订单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success',
                lockScroll: false
            }).then(() => {
                let code = this.printOrder[i].OrderCode
                var formData = new FormData()
                formData.append('OrderCode', code);
                this.$axios.put('/Orders', formData)
                .then(({data}) => {
                    if(data.state == 'ok'){
                        this.$message.success(data.msg)
                        this.getOrderList()
                    }else{
                        this.$message.error(data.msg)
                    }
                })
            }).catch(() => {
                this.$message.warning('取消选择')
            })
        },

        handleUpload(items,i) {  // 上传文件弹框
            if(this.printOrder[i].PaymentStatus != '0') return this.$message.warning('该订单已支付无法上传文件')
            this.itemId = items.ItemId
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
                    this.getOrderList()
                }else{
                    this.$message.warning(res.data.message)
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
        handleDown(item,items) {  // 下载pdf
            // console.log(item,items)
            if(items.FilePath == '') return this.$message.warning('文件正在生成中，请稍后刷新页面再试')
            this.$axios.get(this.$store.state.port.imgBaseUrl + items.FilePath, {responseType: 'blob'})
            .then(({data}) => {
                var a = document.createElement('a')
                a.download = '订单号:' + item.OrderCode + ' ' + '子订单号: '  + items.OrderId + ' ' + '产品名称: ' + items.TypeName + ' ' + '报价单名称: ' + items.Name + ' ' + '尺寸: ' + items.SizeName + ' ' + '价格: ' + items.Amount + ' ' + '数量: ' + items.Quantity + items.Unit + ' ' + '发货地区: ' + item.ShipRegion + ' ' + '地址: ' + item.ShipAddress + ' ' + '收货人: ' + item.ShipName + ' ' + '电话: ' + item.ShipCellPhone + ' ' + '模板名称: ' + items.DocumentName + '.pdf'
                a.href = URL.createObjectURL(data)
                a.click()
                a = null
            })
        },

        getSearch(e) {
            if(e.keyCode == 13) {
                this.getOrderList()
                this.formInline.code = ''
            }
        },
        // 获取订单列表
        getOrderList() {
            this.printOrder = []
            this.loading = true
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.formInline.startTime = ''
                this.formInline.endTime = ''
            }
            var url = '/orders?status=' + this.formInline.state + '&pageIndex=' + this.page.currentPage + '&pageSize=' + this.page.pageSize + '&startTime=' + this.formInline.startTime + '&endTime=' + this.formInline.endTime + '&orderCode=' + this.formInline.code
            this.$axios.get(url).then(res =>{
                if(res == undefined) {
                    this.loading = false
                    return console.log('没有返回')
                }
                var data = JSON.parse(res.data)
                if(data.Data.length == 0) this.loading = false
                console.log(JSON.parse(res.data))
                if(data.Data.length > 0) {
                    this.loading = false
                    this.printOrder = data.Data
                    this.page.totalRecords = data['X-Pagination'].TotalCount
                }
            })
        }
    },
    mounted() {
        this.getOrderList()
    },
    components: {
        UploadFile,
        HomePagination
    }
}
</script>

<style lang="scss">
#print-order{
    width: 100%;
    padding: 45px 63px;
    // user-select: none;
}
.print-order .el-dialog{
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

.print-order{
    min-width: 1200px;
    margin: 0 auto;
    .print-order-list{
        margin-top: 37px;
        .print-order-item{
            background:rgba(255,255,255,1);
            box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
            border-radius:10px;
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,51,51,1);
            margin-bottom: 20px;
            .order-item-header{
                display: flex;
                justify-content: space-between;
                color:rgba(102,102,102,1);
                line-height: 34px;
                padding: 14px 30px 13px;
                .item-header-left{
                    .order-time{
                        margin-right: 43px;
                    }
                    .order-number{
                        margin-right: 70px;
                        color: $color;
                        cursor: pointer;
                    }
                    .total-orders{
                        margin-right: 53px;
                    }
                }
                .item-header-right{
                    display: flex;
                    div{
                        width: 82px;
                        text-align: center;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .payment-btn{
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
        }
    }
    .none-order{
        width: 100%;
        text-align: center;
        padding-top: 200px;
    }
}
.orderInfo-list{
    .orderInfo-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 30px;
        border-top: 1px solid rgba(244,244,244,1);
        .orderInfo-thumb{
            display: flex;
            min-width: 400px;
            align-items: center;
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
                line-height: 30px;
            }
        }
        .orderInfo-file{
            width: 248px;
            text-align: center;
            .upload-file{
                // border:1px solid rgba(254,108,35,1);
                // border-radius:5px;
                // text-align: center;
                // width: 118px;
                // height: 43px;
                // line-height: 43px;
                // cursor: pointer;
            }
            .fileName{
                display: inline-block;
                width: 180px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            img{
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
            }
            .del{
                margin-left: 12px;
                cursor: pointer;
            }
            span, span img{
                cursor: pointer;
            }
        }
        .orderInfo-number{
            min-width: 50px;
            text-align: center;
        }
        .orderInfo-state{
            width: 65px;
            text-align: center;
        }
    }
}

</style>
