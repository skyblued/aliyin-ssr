<template>
    <div id="invoice-info">
        <div class="invoice-info">
            <div class="invoice-info-header">
                <p>发票抬头</p>
                <div class="add-invoice" @click="handleAdd">添加发票</div>
                <el-dialog title="添加发票抬头" :visible.sync="$store.state.dialogAddInvoice" :close-on-click-modal="false">
                    <AddInvoice @getInvoice="getInvoiceList"></AddInvoice>
                </el-dialog>
            </div>

            <el-table
                :data="tableData"
                :row-class-name="tableRowClassName">
                <el-table-column
                    label="发票抬头"
                    min-width="220">
                    <template slot-scope="scope">
                        <div v-if="scope.row.taxType == '0'" class="rise">
                            <span class="putong">普</span>
                            <span class="dianzi" v-if="scope.row.makeType == '1'">电</span>
                            <span class="zhi" v-if="scope.row.makeType == '0'">纸</span>
                            <span v-if="scope.row.customType == '0'">{{scope.row.rise}}</span>
                            <span v-if="scope.row.customType == '1'">{{scope.row.rise}}</span>
                        </div>
                        <div v-else class="rise">
                            <span class="zhuan">专</span>
                            <span>{{scope.row.rise}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="number"
                    label="纳税人识别号"
                    width="132">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="注册地址"
                    min-width="210">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="注册电话"
                    width="115">
                </el-table-column>
                <el-table-column
                    prop="bank"
                    label="银行名称"
                    width="82">
                </el-table-column>
                <el-table-column
                    prop="account"
                    label="银行账号"
                    width="170">
                </el-table-column>
                <el-table-column
                    label="邮箱"
                    width="155">
                    <template slot-scope="scope">
                        <span>{{scope.row.email}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="115">
                    <template slot-scope="scope">
                        <div class="edit" @click.stop="handleModify(scope.row)">编辑</div> 
                        <el-dialog title="修改发票抬头" :visible.sync="$store.state.dialogModifyInvoice" :close-on-click-modal="false">
                            <ModifyInvoice @getInvoice="getInvoiceList" :id="InvoiceId"></ModifyInvoice>
                        </el-dialog>
                        <div class="delete" @click="handleDelete(scope.row.id,scope.$index)">删除</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import AddInvoice from '@/components/personal/invoice/AddInvoice.vue'
import ModifyInvoice from '@/components/personal/invoice/ModifyInvoice.vue'
export default {
    data () {
        return {
            tableData: [],
            InvoiceId: ''
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },
        // 获取发票列表
        getInvoiceList() {
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
                var list = []
                for(var i=0;i<data.length;i++) {
                    var obj = {}
                    obj.makeType = data[i].MakeType
                    obj.taxType = data[i].TaxpayerType
                    obj.customType = data[i].CustomerType
                    obj.rise = data[i].InvoiceTitle
                    obj.number = data[i].RegisterNo
                    obj.address = ''
                    obj.phone = data[i].Phone
                    obj.bank = data[i].Bank
                    obj.account = data[i].BankNo
                    obj.email = data[i].Email
                    obj.id = data[i].Id
                    list[i] = obj
                }
                this.tableData = list
            })
        },

        // 删除发票
        handleDelete(id,i) {
            this.$confirm('是否删除该发票?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var formData = new FormData()
                formData.append('Id', id);
                let config = { 
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/TeamInvoice', {data: formData}, config).then(res => {
                    //console.log(res)
                    if(res.data == true){
                        this.$message({type: 'success',message: '删除成功'})
                        this.tableData.splice(i,1)
                        //this.page.totalRecords = this.page.totalRecords - 1
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



        // 打开添加发票弹出框
        handleAdd() {
            this.$store.commit('setDialogAddInvoice', true)
        },
        handleModify(row){
            this.InvoiceId = row.id
            this.$store.commit('setDialogModifyInvoice', true)
        }
    },
    mounted() {
        this.getInvoiceList()
    },
    components: {
        AddInvoice,
        ModifyInvoice
    }
}
</script>

<style lang="scss" scoped>

#invoice-info{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.invoice-info{
    min-width: 1200px;
    margin: 0 auto;
    .invoice-info-header{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        line-height: 42px;
        display: flex;
        justify-content: space-between;
        padding: 17px 28px 17px 21px;
        font-size:18px;
        color:rgba(51,51,51,1);
        margin-bottom: 37px;
        .add-invoice{
            background:$color;
            border-radius:21px;
            color: rgba(255,255,255,1);
            text-align: center;
            width: 109px;
            font-size: 16px;
            cursor: pointer;
        }
    }
    .el-table{
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        .edit{
            text-align: center;
            line-height: 34px;
            height: 34px;
            width: 82px;
            border:1px solid rgba(210,210,210,1);
            border-radius:5px;
            color:rgba(51,51,51,1);
            cursor: pointer;
            margin-bottom: 8px;
        }
        .delete{
            text-align: center;
            line-height: 34px;
            height: 34px;
            width: 82px;
            background:rgba(255,87,87,1);
            border-radius:5px;
            color: rgba(255,255,255,1);
            cursor: pointer;
        }
        .regaddress{
            line-height: 30px;
            width: 235px;
            margin: 0 auto;
            text-align: left;
        }
    }
}
.invoice-info /deep/ .el-table td:last-child .cell{
    padding: 15px 17px; 
}

.invoice-info /deep/ .el-table td{
    padding: 0;
    .cell{
        padding: 15px 0;
        .putong{
            display: inline-block;
            background:rgba(51,151,230,1);
            border-radius:2px;
            width: 22px;
            height: 22px;
            color: rgba(255,255,255,1);
            margin-right: 10px;
        }
        .zhi{
            display: inline-block;
            background:rgba(243,152,0,1);
            border-radius:2px;
            width: 22px;
            height: 22px;
            color: rgba(255,255,255,1);
            margin-right: 23px;
        }
        .rise{
            display: flex;
            padding-left: 25px;
            line-height: 22px;
        }
        .dianzi{
            display: inline-block;
            width: 22px;
            height: 22px;
            margin-right: 23px;
            color: rgba(255,255,255,1);
            border-radius:2px;
            background:rgba(17,177,96,1);
        }
        .zhuan{
            display: inline-block;
            width: 22px;
            height: 22px;
            margin-right: 23px;
            margin-left: 32px;
            color: rgba(255,255,255,1);
            border-radius:2px;
            background:rgba(255,87,87,1);
        }
    }
}

.invoice-info /deep/ .el-dialog{
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
</style>
