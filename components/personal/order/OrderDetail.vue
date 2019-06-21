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
                        <div class="logistics-btn">
                            <div class="payment" @click="handleToPay">去支付</div>
                            <div class="cancel-order">取消订单</div>
                        </div>
                    </div>
                    <div class="logistics-steps">
                        <div class="logistics-steps-item" v-for="(item,i) in logisticsList" :key="i">
                            <div>
                                <img :src="item.image" alt="">
                                <p class="logistics-title">{{item.title}}</p>
                                <p class="logistics-time">{{item.time}}</p>
                            </div>
                            <img v-if="i != 5" class="steps" :src="item.stepImg" alt="">
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
                            width="321px">
                            <template slot-scope="scope">
                                <div class="orderInfo-thumb">
                                    <img :src="$store.state.port.imgBaseUrl+scope.row.thumb" alt="">
                                    <div class="orderInfo-tip">
                                        <p>名称: <span>{{scope.row.name}}</span></p>
                                        <p>规格: <span>{{scope.row.spec}}</span></p>
                                        <p>工艺: <span>{{scope.row.crafts}}</span></p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="文件信息">
                            <template slot-scope="scope">
                                <div v-if="scope.row.file == ''" class="upload-file">
                                    <img :src="$store.state.port.staticPath + '/img/print/xqy_scwj_icon.png'" alt="">
                                    <span>上传文件</span>
                                </div>
                                <span v-else>自助设计</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="unitPrice"
                            label="单位(元)">
                        </el-table-column>
                        <el-table-column
                            prop="quantity"
                            label="数量">
                        </el-table-column>
                        <el-table-column
                            label="小计(元)">
                            <template slot-scope="scope">
                                <span style="color: rgba(255,1,1,1)">{{scope.row.total}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="state"
                            label="状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.state == 0">等待印刷</span>
                                <span v-else>印刷完成</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分割线 -->
                <div class="line"></div>
                <!-- 收货信息 -->
                <div class="receiving">
                    <p class="receiving-title">收货信息</p>
                    <div class="receiving-info">
                        <p>收货姓名: <span>{{orderDeatil.ShipName}}</span></p>
                        <p>收货电话: <span>{{orderDeatil.ShipCellPhone}}</span></p>
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
                <div class="invoice">
                    <p class="invoice-title">发票信息</p>
                    <div class="invoice-info">
                        <p>
                            <span>发票类型: {{orderDeatil.MakeType == '0' ? '纸质发票' : '电子发票'}}</span>
                            <span class="invoice-btn">查看发票</span>
                        </p>
                        <p>发票内容: <span>{{orderDeatil.InvoiceInfo}}</span></p>
                        <p>发票抬头: <span>{{orderDeatil.InvoiceTitle}}</span></p>
                        <p>纳税识别号: <span>{{orderDeatil.RegisterNo}}</span></p>
                    </div>
                </div>
                <!-- 分割线 -->
                <div class="line"></div>
                <div class="pay-price">
                    <div class="pay-price-info">
                        <p>
                            <span>商品总价:</span>
                            <span class="price">{{orderDeatil.OrderTotal && orderDeatil.OrderTotal.toFixed(2)}}元</span>
                        </p>
                        <p>
                            <span>运费:</span>
                            <span class="price">+{{0 && orderDeatil.Freight.toFixed(2)}}元</span>
                        </p>
                        <p>
                            <span>优惠券:</span>
                            <span class="price">-{{orderDeatil.CouponAmount && orderDeatil.CouponAmount.toFixed(2)}}元</span>
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
export default {
    data() {
        return {
            logisticsList: [{
                id: '1',
                image: '/img/personal/logistics/xd_icon.png',
                src: '/img/personal/logistics/xd_icon_hl.png',
                title: '下单',
                time: '2019-03-23 12:00',
                stepImg: '/img/personal/logistics/arrow_icon.png',
                stepSrc: '/img/personal/logistics/arrow_icon_hl.png'
            },{
                id: '2',
                image: '/img/personal/logistics/fk_icon.png',
                src: '/img/personal/logistics/fk_icon_hl.png',
                title: '付款',
                time: '2019-03-23 12:00',
                stepImg: '/img/personal/logistics/arrow_icon.png',
                stepSrc: '/img/personal/logistics/arrow_icon_hl.png'
            },{
                id: '3',
                image: '/img/personal/logistics/sh_icon.png',
                src: '/img/personal/logistics/sh_icon_hl.png',
                title: '审核',
                time: '2019-03-23 12:00',
                stepImg: '/img/personal/logistics/arrow_icon.png',
                stepSrc: '/img/personal/logistics/arrow_icon_hl.png'
            },{
                id: '4',
                image: '/img/personal/logistics/sc_icon.png',
                src: '/img/personal/logistics/sc_icon_hl.png',
                title: '生产',
                time: '2019-03-23 12:00',
                stepImg: '/img/personal/logistics/arrow_icon.png',
                stepSrc: '/img/personal/logistics/arrow_icon_hl.png'
            },{
                id: '5',
                image: '/img/personal/logistics/fh_icon.png',
                src: '/img/personal/logistics/fh_icon_hl.png',
                title: '发货',
                time: '2019-03-23 12:00',
                stepImg: '/img/personal/logistics/arrow_icon.png',
                stepSrc: '/img/personal/logistics/arrow_icon_hl.png'
            },{
                id: '6',
                image: '/img/personal/logistics/qs_icon.png',
                src: '/img/personal/logistics/qs_icon_hl.png',
                title: '签收',
                time: '2019-03-23 12:00',
                stepImg: '/img/personal/logistics/arrow_icon.png',
                stepSrc: '/img/personal/logistics/arrow_icon_hl.png'
            }],
            tableData: [],
            orderDeatil: {}
        }
    },
    props: ['id'],
    methods: {
        handleBack() {  // 返回订单列表页
            this.$emit('setOrder', {msg: 'PrintOrder', id: ''})
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
                    obj.unitPrice = data[i].Amount
                    obj.quantity = data[i].Quantity + data[i].Unit
                    obj.total = data[i].Amount
                    obj.state = data[i].PrintStatus
                    list[i] = obj
                }
                this.tableData = list
            })
        },
        handleToPay() {
            this.$router.push('/cashier')
        }
    },
    mounted() {
        this.getOrderDetail()
    }
}
</script>

<style lang="scss">

#order-detail{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
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
    img{
        display: inline-block;
        width: 90px;
        height: 90px;
        margin-right: 25px;
    }
    .orderInfo-tip{
        text-align: left;
        line-height: 30px;
    }
}
.upload-file{
    border:1px solid rgba(254,108,35,1);
    border-radius:5px;
    text-align: center;
    width: 118px;
    height: 43px;
    line-height: 43px;
    margin-top: 23px;
    margin: 0 auto;
    cursor: pointer;
    img{
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
    }
}
</style>
