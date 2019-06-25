<template>
    <div id="invoice-detail">
        <div class="invoice-detail">
            <div class="invoice-detail-header">
                <p>发票详情</p>
                <span class="back" @click="handleBack"><i class="el-icon-arrow-left"></i>返回</span>
            </div>
            <div class="content" v-for="(item,i) in invoiceInfo.RequestDetail" :key="i">
                <div class="content-header">
                    <div class="header-left">
                        <p>订单号: {{item.OrderCode}}</p>
                        <p class="total">总额: ￥{{invoiceInfo.Amount && invoiceInfo.Amount.toFixed(2)}}</p>
                        <p>应付: <span style="color: rgba(255,0,0,1);">￥{{item.OrderAmount && item.OrderAmount.toFixed(2)}}</span></p>
                    </div>
                    <p>{{item.OrderTime && item.OrderTime.split('T').join(' ')}}</p>
                </div>
                <div class="orderInfo-list">
                    <div class="orderInfo-item" v-for="(items,index) in item.OrderInfo.OrderItems" :key="index">
                        <div class="orderInfo-thumb">
                            <div class="orderInfo-thumb-wrap">
                                <div class="thumbnail" v-if="items.FilePath.indexOf('.png') > -1" :style="{'background-image': `url(${$store.state.port.imgBaseUrl + items.FilePath})`}"></div>
                                <div class="thumbnail" v-else :style="{'background-image': `url(${items.ThumbnailsUrl.indexOf('aliyin') > -1 ? items.ThumbnailsUrl : $store.state.port.imgBaseUrl+items.ThumbnailsUrl})`}"></div>
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
                            <div class="upload-file" v-if="items.FileName == ''">
                                <img src="/img/print/xqy_scwj_icon.png" alt="">
                                <span>上传文件</span>
                            </div>
                            <div v-else>
                                <span>{{items.FileName}}</span>
                            </div>
                        </div>
                        <div class="orderInfo-number">{{items.Quantity + items.Unit}}</div>
                        <div style="color: rgba(255, 1, 1, 1)">￥{{items.Amount && items.Amount.toFixed(2)}}</div>
                        <div class="orderInfo-state">印刷完成</div>
                    </div>
                </div>
                <div class="content-info">
                    <p><span class="info-title">申请时间: </span><span>{{invoiceInfo.CreateTime && invoiceInfo.CreateTime.split('T').join(' ')}}</span></p>
                    <p>
                        <span class="info-title">发票抬头: </span>
                        <span v-if="invoiceInfo.CustomerType == '1'">{{invoiceInfo.InvoiceTitle}}</span>
                        <span v-else>个人</span>
                    </p>
                    <p>
                        <span class="info-title">发票类型: </span>
                        <span>{{invoiceInfo.TaxpayerType == '1' ? '专用发票' : '普通发票'}}</span>
                        <span style="margin-left: 10px;">{{invoiceInfo.MakeType == '0' ? '纸质发票' : '电子发票'}}</span>
                    </p>
                    <p><span class="info-title">金额: </span><span>￥{{invoiceInfo.Amount}}</span></p>
                    <p>
                        <span class="info-title">状态: </span>
                        <span v-if="invoiceInfo.InvoiceStatus == '0'">待审核</span>
                        <span v-else-if="invoiceInfo.InvoiceStatus == '1'" style="color:rgba(0, 131, 233, 1);">已开票</span>
                        <span v-else-if="invoiceInfo.InvoiceStatus == '2'" style="color:rgba(243, 152, 0, 1)">{{invoiceInfo.makeType == '0' ? '已发货' : '已上传'}}</span>
                        <span v-else-if="invoiceInfo.InvoiceStatus == '-1'" style="color:rgba(255,0,0,1)">已作废</span>
                        <span v-else-if="invoiceInfo.InvoiceStatus == '-2'" style="color:rgba(255,0,0,1)">已拒绝</span>
                        <span v-else>取消</span>
                    </p>
                    <p v-if="invoiceInfo.MakeType == '0'">
                        <span class="info-title">收货地址: </span>
                        <span>{{item.OrderInfo.ShipName}} {{item.OrderInfo.ShipCellPhone}} {{item.OrderInfo.ShipRegion}} {{item.OrderInfo.ShipAddress}}</span>
                    </p>
                    <p v-else>
                        <span class="info-title">邮箱: </span>
                        <span>{{invoiceInfo.Email}}</span>
                    </p>
                    <p>
                        <span class="info-title">物流信息: </span>
                        <span v-if="invoiceInfo.MakeType == '1'" class="download">下载</span>
                        <span v-else>
                            <span style="margin-right: 10px;">{{invoiceInfo.ExpressCompany}}</span>
                            <span>{{invoiceInfo.ExpressCode}}</span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            invoiceInfo: {}
        }
    },
    props: ['requestId'],
    methods: {
        handleBack() {  // 返回
            this.$emit('setInvoice', {msg: 'InvoiceList'})
        },

        // 获取发票详情
        getInvoiceDetail() {
            if(this.requestId == undefined) return
            this.$axios.get('/InvoiceRequest?RequestID=' + this.requestId).then(res => {
                if (!res.data) return
                console.log(res.data)
                this.invoiceInfo = res.data
            })
        }
    },
    mounted() {
        this.getInvoiceDetail()
    }
}
</script>

<style lang="scss" scoped>

#invoice-detail{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.invoice-detail{
    min-width: 1200px;
    margin: 0 auto;
    .invoice-detail-header{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        height: 76px;
        line-height: 76px;
        padding-left: 20px;
        padding-right: 30px;
        display: flex;
        justify-content: space-between;
        .back{
            color:rgba(153,153,153,1);
            font-size: 16px;
            cursor: pointer;
            &:hover{
                color: $color;
            }
        }
    }
    .content{
        border-radius: 10px;
        background: rgba(255,255,255,1);
        margin-top: 48px;
        color:rgba(51,51,51,1);
        .content-header{
            display: flex;
            justify-content: space-between;
            padding: 30px;
            color:rgba(102,102,102,1);
            .header-left{
                display: flex;
            }
            .total{
                margin: 0 53px 0 70px;
            }
        }
        .orderInfo-list{
            background:rgba(244,244,244,1);
            .orderInfo-thumb-wrap{
                display: inline-block;
                width:90px;
                height:90px;
                background:rgba(213,221,227,1);
                border-radius:5px;
                margin-right: 25px;
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
        .content-info{
            padding: 30px;
            p{
                line-height: 48px;
                color:rgba(51,51,51,1);
                .info-title{
                    display: inline-block;
                    width: 72px;
                    margin-right: 28px;
                    color: rgba(102,102,102,1);
                }
                .download{
                    display: inline-block;
                    background:rgba(255,255,255,1);
                    border:1px solid rgba(210,210,210,1);
                    border-radius:5px;
                    height: 34px;
                    line-height: 34px;
                    text-align: center;
                    width: 82px;
                    color: rgba(102,102,102,1);
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
