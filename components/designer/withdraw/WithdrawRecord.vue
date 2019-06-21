<template>
    <div id="withdraw">
        <div class="withdraw">
            <div class="withdraw-header">
                <div class="header-left">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="提现状态 : " class="select">
                            <el-select v-model="formInline.state" style="width: 150px;">
                                <el-option v-for="(item,index) in productList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收益时间 : " class="form-item">
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
                        <el-form-item>
                            <div class="screen" @click="getDrawList">筛选</div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="header-right">
                    <span>当前余额：
                        <span v-if="balance" style="color: red;">{{balance.toFixed(2)}}</span>
                    </span>
                    <el-button class="withdraw-btn" @click="dialogVisible = true">提现</el-button>
                    <el-dialog
                        title="申请提现"
                        :modal-append-to-body="false"
                        :close-on-click-modal="false"
                        :visible.sync="dialogVisible">
                        <el-form :model="form">
                            <el-form-item label="提现金额: " class="draw">
                                <el-input type="number" min="1" v-model="form.money" style="width: 181px;margin-right: 19px;"></el-input>
                                <span class="error-tips">{{error}}</span>
                                <span>当前余额：
                                    <span v-if="balance" style="color: red;">{{balance.toFixed(2)}}</span>
                                </span>
                                <span class="use-balance">
                                    可用余额: 
                                    <span>{{canuseBalance && canuseBalance.toFixed(2)}}</span>
                                </span>
                            </el-form-item>
                            <el-form-item label="提现方式: ">
                                <div class="radio">
                                    <p @click="handleChoose('1')">
                                        <img :src="form.cardtypeId == '1' ? src : image" alt="">
                                        <span>微信</span>
                                    </p>
                                    <p @click="handleChoose('2')">
                                        <img :src="form.cardtypeId == '2' ? src : image" alt="">
                                        <span>支付宝</span>
                                    </p>
                                </div>
                            </el-form-item>
                            <el-form-item label="账号: " class="account">
                                <el-input class="account-input" v-model="form.account"></el-input>
                            </el-form-item>
                            <el-form-item label="真实姓名: ">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="footer">
                            <el-button type="primary" @click="handleApplyDraw">提交申请</el-button>
                            <el-button @click="dialogVisible = false">取消</el-button>
                        </div>
                    </el-dialog>
                </div>
            </div>
            <el-table
                :data="tableData"
                :row-class-name="tableRowClassName">
                <el-table-column
                    label="时间"
                    min-width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.date">{{scope.row.date.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="drawPrice"
                    label="提现金额"
                    min-width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.drawPrice">￥{{scope.row.drawPrice.toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="提现账号"
                    min-width="250">
                    <template slot-scope="scope">
                        <img class="account-img" :src="scope.row.cardtypeid == '1' ? srcWX : srcZFB" alt="">
                        <span class="draw-name">{{scope.row.name}}: </span>
                        <span>{{scope.row.account}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核状态"
                    min-width="75">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state=='-1'" style="color: red">被拒绝</span>
                        <span v-else-if="scope.row.state=='0'" style="color: #0099ff">审核中</span>
                        <span v-else style="color: #008000">已审核</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核时间"
                    min-width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.examinedate">{{scope.row.examinedate.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="当前余额"
                    min-width="130">
                </el-table-column>
            </el-table>
            <div v-if="tableData.length">
                <HomePagination :Page="page" @getTempList="getDrawList" />
            </div>
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: null,      // 每页个数
            },
            formInline: {
                state: '',
                startTime: '',
                endTime: ''
            },
            startTime: '',
            endTime: '',
            form: {
                money: '',
                cardtypeId: '1',
                account: '',
                name: ''
            },
            error: '',
            image: '/img/home/rectangle_icon.png',
            src: '/img/home/rectangle_icon_hl.png',
            productList: [{
                value: '',
                label: '全部'
            },{
                value: '-1',
                label: '审核失败'
            },{
                value: '1',
                label: '审核通过'
            },{
                value: '0',
                label: '审核中'
            }],
            dialogVisible: false,   // 申请提现弹出框
            tableData: [],
            srcWX: '/img/personal/wechat_small_icon.png',
            srcZFB: '/img/personal/pay_small_icon.png',
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
            balance: '',    // 当前余额
            canuseBalance: '',   // 可用余额
        }
    },
    methods: {
        handleChoose(type) {   // 切换提现方式
            this.form.cardtypeId = type
        },

        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },

        // 获取提现记录列表
        getDrawList() {
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.startTime = ''
                this.endTime = ''
            }else{
                this.startTime = this.formInline.startTime
                this.endTime = this.formInline.endTime
            }
            var url = '/MyDraw?pageIndex=' + this.page.currentPage + '&status=' + this.formInline.state + '&starttime=' + this.startTime + '&endtime=' + this.endTime
            this.$axios.get(url).then(res =>{
                console.log(res.data)
                this.balance = res.data.Balance
                this.canuseBalance = res.data.CanUseBalance
                var data = res.data.Data
                var list = []
                for(var i=0;i<data.length;i++){
                    var obj = {}
                    obj.date = data[i].RequestTime
                    obj.drawPrice = data[i].Amount
                    obj.account = data[i].BankCard
                    obj.name = data[i].TrueName
                    obj.cardtypeid = data[i].CardTypeID
                    obj.state = data[i].RequestStatus
                    obj.examinedate = data[i].RequestTime
                    list[i] = obj
                }
                this.tableData = list
                this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
                this.page.pageSize = Math.ceil((res.data)['X-Pagination'].TotalCount / (res.data)['X-Pagination'].TotalPages)
            })
        },
        
        // 申请提现
        handleApplyDraw() {
            if(this.form.money>this.canuseBalance || this.form.money<0){
                return this.$message({type: 'warning', message: '提现金额不能大于当前可用余额且大于0'})
            }
            if(!this.form.account && !this.form.name){
                return this.$message({type: 'warning', message: '请填写提现账号和真实姓名'})
            }
            var formData = new FormData()
            formData.append('money', this.form.money);
            formData.append('cardtypeid', this.form.cardtypeId);
            formData.append('bankcard', this.form.account);
            formData.append('truename', this.form.name);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/MyDraw', formData, config).then(res =>{
                console.log(res.data)
                if(res.data == true){
                    this.$message({type: 'success', message: '申请成功，请等待审核'})
                    this.dialogVisible = false
                    this.getDrawList()
                    this.form = {}
                }
            })
        }
    },
    components: {
        HomePagination
    },
    mounted() {
        this.getDrawList()
    },
    // computed: {
    //     Balance() {
    //         var sum = 0
    //         for(var i=0;i<this.tableData.length;i++){
    //             sum += parseInt(this.tableData[i].balance.split('￥')[1])
    //         }
    //         return sum.toFixed(2)
    //     }
    // }
}
</script>

<style lang="scss">

#withdraw{
    width: 100%;
    min-width: 1200px;
    margin: 65px auto 0;
    padding: 0 65px;
    display: flex;
}

.withdraw{
    width: 1500px;
    min-width: 960px;
    margin: 0 auto;
    user-select: none;
    .el-table{
        width: 100%;
    }
}

.demo-form-inline .el-input__inner, .demo-form-inline .el-form-item__content, .demo-form-inline .el-form-item__label{
    height: 37px;
    line-height: 37px;
}
.withdraw-header{
    min-width: 1140px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 37px;
    height: 76px;
    box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius: 10px;
    background:rgba(254,254,254,1);
    padding: 20px 28px 19px 20px;
    .demo-form-inline .el-form-item{
        margin-right: 42px;
        height: 37px;
        .el-button{
            height: 37px;
        }
    }
}
.withdraw-header .header-right .withdraw-btn{
    width: 109px;
    height: 37px;
    background:rgba(243,152,0,1);
    border-color: rgba(243,152,0,1);
    border-radius:21px;
    margin-left: 34px;
    color: rgba(254,254,254,1);
    &:hover{
        background: rgba(243,152,0,1);
        color: rgba(254,254,254,1);
    }
}

.withdraw .el-table td{
    padding: 0;
    .cell{
        padding: 26px 0;
    }
}

.el-table .cell{
    text-align: center;
    padding: 20px 0;
}
.el-table td{
    padding: 0;
    .draw-name{
        margin-right: 10px;
    }
}
.withdraw .el-table td:nth-child(3) .cell{
    padding-left: 66px;
    text-align: left;
}
.el-table .el-table__header-wrapper th{
    color: rgba(102,102,102,1);
    font-weight: normal;
    padding: 0;
}
.account-img{
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
}

.demo-form-inline .screen{
    background: $color;
    display: inline-block;
    line-height: 37px;
    padding: 0 12px;
    border-radius: 5px;
    color: rgba(254,254,254,1);
    cursor: pointer;
    &:hover{
        background: #0893ff;
    }
}

.el-table .warning-row {
    background: #eeeeee;
}
.el-table .el-table__body .el-table__row:hover>td{
    background: none;
}

.el-table td .cell{
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
}

.el-dialog .el-dialog__close{
    background-image: url(/img/home/fork_white.png);
    &::before{
        content: '';
    }
}

// 申请提现弹出框
.withdraw-header .header-right .el-dialog{
    width: 33%;
    min-width: 630px;
    border-radius: 10px;
    text-align: center;
    .el-dialog__header{
        padding: 25px 20px 0;
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
        padding: 31px 58px 57px;
        .el-form-item{
            display: flex;
            width: 100%;
            .radio{
                margin-left: 26px;
                display: flex;
                img{
                    vertical-align: middle;
                    margin-right: 11px;
                }
                p{
                    margin-right: 84px;
                    cursor: pointer;
                }
            }
        }
        .draw{
            position: relative;
            .error-tips{
                color: red;
                position: absolute;
                top: 50px;
                left: 0;
                display: inline-block;
                line-height: 14px;
            }
            .use-balance{
                margin-left: 10px;
                span{
                    color: rgba(255,0,0,1);
                }
            }
        }
        .el-form-item, .el-input__inner, .el-form-item__label, .el-form-item__content{
            height: 48px;
            line-height: 48px;
            .el-input{
                width: 416px;
                height: 48px;
                line-height: 48px;
            }
            .input{
                margin-left: 14px;
            }
            .el-input{
                margin-left: 26px;
            }
        }
        .account{
            .el-form-item__label{
                margin-left: 24px;
            }
            .account-input{
                margin-left: 30px;
            }
        }
        .footer{
            width: 389px;
            margin: 80px auto 0;
            display: flex;
            .el-button{
                width: 179px;
                height: 48px;
            }
            .el-button+.el-button{
                margin-left: 31px;
            }
        }
    }
}

// 下拉按钮样式
.demo-form-inline .select .el-input__suffix-inner i::before{
    content: '';
}
.demo-form-inline .select .el-select .el-input .el-select__caret{
    transform: rotateZ(0);
}
.demo-form-inline .select .el-input__suffix-inner i::after{
    background-image: url(/img/personal/drop_down.png);
    width: 100%;
    height: 30px;
}

.demo-form-inline .el-form-item__content{
    .el-icon-date::before{
        content: '';
    }
    .el-icon-date::after{
        background-image: url(/img/personal/time_icon.png);
        width: 100%;
        height: 32px;
        margin-right: 8px;
    }
}
</style>
