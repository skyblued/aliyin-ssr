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
            <div class="print-order-list">
                <div class="print-order-item" v-for="(item,i) in printOrder" :key="i">
                    <div class="order-item-header">
                        <div class="item-header-left">
                            <span class="order-time">{{item.CreatedDate && item.CreatedDate.split('T').join(' ')}}</span>
                            <span class="order-number" @click="handleJumpDetail(i)" title="点击查看订单详情">订单号: {{item.OrderCode}}</span>
                            <span class="total-orders">总额：{{item.Amount && item.Amount.toFixed(2)}}</span>
                            <span class="payable">应付: <span style="color: rgba(255, 0, 0, 1);">{{item.Amount && item.Amount.toFixed(2)}}</span></span>
                        </div>
                        <div class="item-header-right" v-if="item.PaymentStatus == 0">
                            <div class="payment-btn" @click="handleToPay(i)">去支付</div>
                            <div class="cancel-order">取消订单</div>
                        </div>
                        <div class="item-header-right" v-if="item.PaymentStatus == 2">支付成功</div>
                    </div>
                    <div class="orderInfo-list">
                        <div class="orderInfo-item" v-for="(items, index) in item.OrderItems" :key="index">
                            <div class="orderInfo-thumb">
                                <img :src="$store.state.port.imgBaseUrl+items.ThumbnailsUrl" alt="">
                                <div class="orderInfo-tip">
                                    <p>名称: <span>{{items.Name}}</span></p>
                                    <p>规格: <span>{{items.AttributeNames}}</span></p>
                                    <p>工艺: <span>{{items.CraftNames}}</span></p>
                                </div>
                            </div>
                            <div class="orderInfo-name" v-if="item.OrderType == 1">印刷订单</div>
                            <div class="orderInfo-file">
                                <div class="upload-file" @click="handleUpload">
                                    <img :src="$store.state.port.staticPath + '/img/print/xqy_scwj_icon.png'" alt="">
                                    <span>上传文件</span>
                                </div>
                            </div>
                            <div class="orderInfo-number">{{items.Quantity}}{{items.Unit}}</div>
                            <div style="color: rgba(255, 1, 1, 1)">{{items.Amount}}</div>
                            <div class="orderInfo-state" v-if="items.PrintStatus == 0">等待印刷</div>
                            <div class="orderInfo-state" v-if="items.PrintStatus == 1">印刷完成</div>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog title="上传文件" :visible.sync="$store.state.dialogUpload" :close-on-click-modal="false">
                <UploadFile></UploadFile>
            </el-dialog>
            <div class="block" v-if="printOrder.length">
                <HomePagination :Page="page" @getTempList="getOrderList" />
            </div>
        </div>
    </div>
</template>

<script>
import UploadFile from '@/components/share/UploadFile.vue'
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            formInline: {
                state: '0',
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
            status: [{
                value: '0',
                label: '全部'
            },{
                value: '1',
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
            printOrder: []
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

        handleUpload() {  // 上传文件弹框
            this.$store.commit('setDialogUpload', true)
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
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.formInline.startTime = ''
                this.formInline.endTime = ''
            }
            var url = '/orders?status=' + this.formInline.state + '&pageIndex=' + this.page.currentPage + '&pageSize=' + this.page.pageSize + '&startTime=' + this.formInline.startTime + '&endTime=' + this.formInline.endTime + '&orderCode=' + this.formInline.code
            this.$axios.get(url).then(res =>{
                if(res == undefined) return console.log('没有返回')
                var data = JSON.parse(res.data)
                console.log(JSON.parse(res.data))
                this.printOrder = data.Data
                this.page.totalRecords = data['X-Pagination'].TotalCount
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
.print-order{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
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
}
.orderInfo-list{
    .orderInfo-item{
        line-height: 90px;
        display: flex;
        justify-content: space-between;
        padding: 25px 30px;
        border-top: 1px solid rgba(244,244,244,1);
        .orderInfo-thumb{
            display: flex;
            img{
                display: inline-block;
                width: 90px;
                height: 90px;
                margin-right: 25px;
            }
            .orderInfo-tip{
                line-height: 30px;
            }
        }
        .orderInfo-file{
            width: 248px;
            text-align: center;
            .upload-file{
                border:1px solid rgba(254,108,35,1);
                border-radius:5px;
                text-align: center;
                width: 118px;
                height: 43px;
                line-height: 43px;
                margin-top: 23px;
                cursor: pointer;
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
        }
    }
}
</style>
