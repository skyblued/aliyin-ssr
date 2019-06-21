<template>
    <div id="invoice">
        <div class="invoice">
            <el-form :inline="true" class="form-inline">
                <el-form-item label="发票状态: ">
                    <el-select v-model="formInline.state" clearable class="select">
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
                <div class="screen" @click="getInvoiceRecord">搜索</div>
                <div class="apply-btn" @click="handleJump">申请发票</div>
            </el-form>
            <div class="invoice-list">
                <el-table
                    :data="tableData"
                    :row-class-name="tableRowClassName">
                    <el-table-column
                        label="申请时间"
                        width="140">
                        <template slot-scope="scope">
                            <span>{{scope.row.time && scope.row.time.split('T').join(' ')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="发票类型"
                        min-width="290">
                        <template slot-scope="scope">
                            <p class="rise">
                                <span>{{scope.row.cusType == '1' ? scope.row.invoice : '个人'}}</span>
                            </p>
                            <p class="rise" v-if="scope.row.taxType == '1'">
                                <span class="rise-icon special">专票</span>
                                <span class="rise-icon zhi">纸</span>
                            </p>
                            <p class="rise" v-else>
                                <span class="rise-icon ordinary">普票</span>
                                <span class="rise-icon zhi" v-if="scope.row.makeType == '0'">纸</span>
                                <span class="rise-icon dian" v-else>电</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="金额">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.amount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.state == '0'">待审核</span>
                            <span v-else-if="scope.row.state == '1'" style="color:rgba(0, 131, 233, 1);">已开票</span>
                            <span v-else-if="scope.row.state == '2'" style="color:rgba(243, 152, 0, 1)">{{scope.row.makeType == '0' ? '已发货' : '已上传'}}</span>
                            <span v-else-if="scope.row.state == '-1'" style="color:rgba(255,0,0,1)">已作废</span>
                            <span v-else-if="scope.row.state == '-2'" style="color:rgba(255,0,0,1)">已拒绝</span>
                            <span v-else>取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="收货地址"
                        min-width="320">
                        <template slot-scope="scope">
                            <p>
                                <span class="name">{{scope.row.name}}  {{scope.row.phone}}</span>
                                <span>{{scope.row.address}}  {{scope.row.ries}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="物流信息"
                        width="130">
                        <template slot-scope="scope">
                            <span class="btn" v-if="scope.row.makeType == '1'">下载</span>
                            <p class="logistic" v-else>
                                <span>{{scope.row.express}}</span>
                                <span>{{scope.row.expressCode}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="130">
                        <template slot-scope="scope">
                            <!-- <div class="btn cancel" @click="handleCancel(scope.row)">取消</div> -->
                            <div class="btn invoice-detail" @click="handleDetail(scope.row.id)">发票详情</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="invoice-block" v-if="tableData.length">
                    <HomePagination :Page="page" @getTempList="getInvoiceRecord" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            formInline: {
                state: '',
                startTime: '',
                endTime: ''
            },
            status: [{
                value: '',
                label: '全部'
            },{
                value: '0',
                label: '待审核'
            },{
                value: '1',
                label: '已开票'
            },{
                value: '2',
                label: '已发货/已上传'
            },{
                value: '-1',
                label: '已作废'
            },{
                value: '-2',
                label: '已拒绝'
            },{
                value: '-3',
                label: '取消'
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
            tableData: [],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 10,    // 每页个数
            },
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },

        // 发票详情
        handleDetail(id) {
            this.$emit('setInvoice', {msg: 'InvoiceDetail', id: id})
        },

        // 获取开票记录
        getInvoiceRecord() {
            this.tableData = []
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.formInline.startTime = ''
                this.formInline.endTime = ''
            }
            var url = '/InvoiceOrders?State=' + this.formInline.state + '&StartTime=' + this.formInline.startTime + '&EndTime=' + this.formInline.endTime + '&PageIndex=' + this.page.currentPage + '&PageSize=' + this.page.pageSize
            this.$axios.get(url).then(res => {
                if(res == undefined) return
                console.log(JSON.parse(res.data))
                let data = JSON.parse(res.data)
                let list = []
                for(var i=0; i<data.Data.length;i++) {
                    var obj = {}
                    obj.time = data.Data[i].CreateTime
                    obj.invoice = data.Data[i].InvoiceTitle
                    obj.taxType = data.Data[i].TaxpayerType
                    obj.makeType = data.Data[i].MakeType
                    obj.amount = data.Data[i].Amount
                    obj.state = data.Data[i].InvoiceStatus
                    obj.name = data.Data[i].ConsignName
                    obj.phone = data.Data[i].Phone
                    obj.address = data.Data[i].ConsignFullRegionName
                    obj.ries = data.Data[i].ConsignAddress
                    obj.cusType = data.Data[i].CustomerType
                    obj.express = data.Data[i].ExpressCompany
                    obj.expressCode = data.Data[i].ExpressCode
                    obj.path = data.Data[i].FilePath
                    obj.id = data.Data[i].ID
                    list[i] = obj
                }
                this.tableData = list
                this.page.totalRecords = data['X-Pagination'].TotalCount
            })
        },

        handleJump() {
            this.$emit('setInvoice', {msg: 'ApplyInvoice'})
        },

    },
    mounted() {
        this.getInvoiceRecord()
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss">

#invoice{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.invoice{
    min-width: 1200px;
    margin: 0 auto;
    .form-inline{
        position: relative;
    }
    .apply-btn{
        display: inline-block;
        position: absolute;
        right: 20px;
        background:$color;
        border-radius:21px;
        color: rgba(255,255,255,1);
        line-height: 37px;
        text-align: center;
        width: 109px;
        cursor: pointer;
    }
    .invoice-list{
        background:rgba(255,255,255,1);
        margin-top: 37px;
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        .invoice-block{
            margin-top: 136px;
        }
    }
    .el-table{
        //width: 98%;
        margin: 0 auto;
        border-radius:10px 10px 0 0;
        td{
            padding: 7px 0;
        }
        th:nth-child(1) .cell{
            padding-left: 40px;
        }
        td:nth-child(1) .cell{
            padding-left: 40px;
        }
        .rise{
            width: 200px;
            margin: 0 auto;
            .rise-icon{
                height: 22px;
                line-height: 22px;
                color: rgba(255,255,255,1);
                border-radius: 2px;
                padding: 0 5px;
                margin-right: 5px;
            }
            .special{
                background:rgba(255,87,87,1);
            }
            .ordinary{
                background:rgba(51,151,230,1);
            }
            .zhi{
                background:rgba(243,152,0,1);
            }
            .dian{
                background:rgba(17,177,96,1);
            }
        }
        .name{
            width: 140px;
            display: block;
            margin: 0 auto;
        }
        .btn{
            display: inline-block;
            background:rgba(255,255,255,1);
            border:1px solid rgba(210,210,210,1);
            border-radius:5px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            width: 82px;
            cursor: pointer;
        }
        .logistic span{
            display: block;
        }
        // .cancel{
        //     margin-bottom: 5px;
        // }
        .invoice-detail{
            background: $color;
            color: rgba(255,255,255,1);
        }
    }
}
</style>

