<template>
    <div id="address">
        <div class="address">
            <div class="address-header">
                <p>收货地址</p>
                <div class="add-to-address" @click="handleAdd">添加地址</div>
                <el-dialog title="添加收货地址" :visible.sync="$store.state.login.dialogAdd" :close-on-click-modal="false" :modal-append-to-body="false" :lock-scroll="false" :show-close="false">
                    <AddToAddress v-if="$store.state.login.dialogAdd" @setAddress="getAddressList"></AddToAddress>
                </el-dialog>
            </div>
            <el-table
                :data="tableData"
                :row-class-name="tableRowClassName">
                <el-table-column
                    prop="name"
                    label="联系人"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="联系电话"
                    width="135">
                </el-table-column>
                <el-table-column
                    label="地区"
                    min-width="230">
                    <template slot-scope="scope">
                        <span>{{scope.row.region}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="详细地址"
                    min-width="300">
                </el-table-column>
                <el-table-column
                    label="默认"
                    width="135">
                    <template slot-scope="scope">
                        <img class="choose-btn" @click="handleChange(scope.row)" :src="scope.row.isdefault == true ? '/img/personal/choose_icon.png' : '/img/personal/n_choose_icon.png'" alt="">
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="220">
                    <template slot-scope="scope">
                        <div class="operation-btn">
                            <div class="edit" @click.stop="handleModify(scope.row)">编辑</div> 
                            <div class="delete" @click="handleDelete(scope.row.id,scope.$index)">删除</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="修改地址" :visible.sync="$store.state.login.dialogModify" :close-on-click-modal="false" :lock-scroll="false">
                <ModifyAddress v-if="$store.state.login.dialogModify" :id="shipId" @setAddress="getAddressList"></ModifyAddress>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import AddToAddress from '@/components/personal/address/AddToAddress.vue'
import ModifyAddress from '@/components/personal/address/ModifyAddress.vue'
export default {
    data () {
        return {
            tableData: [],
            shipId: ''
        }
    },
    methods: {

        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },

        handleChange(row) {  // 设为默认地址
            console.log(row)
            row.isdefault = !row.isdefault
            if(row.isdefault == true) {
                var obj = {
                    'ShippingId': row.id,
                    'IsDefault': row.isdefault
                }
                let config = {
                    headers:{'Content-Type': 'application/json'}
                }
                this.$axios.put('shipaddress', obj, config).then(res => {
                    console.log(res.data)
                })
            }
        },

        // 获取收货地址列表
        getAddressList() {
            this.$axios.get('/shipaddresses?TeamNum=' + localStorage['teamNum']).then(res => {
                console.log(res.data)
                var list = []
                for(var i=0;i<res.data.length;i++){
                    var obj = {}
                    obj.region = res.data[i].ProvinceCity
                    obj.name = res.data[i].ShipName
                    obj.phone = res.data[i].CelPhone
                    obj.address = res.data[i].Address
                    obj.isdefault = res.data[i].IsDefault
                    obj.id = res.data[i].ShippingId
                    list[i] = obj
                }
                this.tableData = list
            })
        },
        // 删除一条收货地址
        handleDelete(id,i){
            this.$confirm('是否删除该地址?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var formData = new FormData()
                formData.append('Id', id);
                let config = { 
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/shipaddress', {data: formData}, config).then(res => {
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


        // 修改地址弹框
        handleModify(row) {
            this.shipId = row.id
            this.$store.commit('login/setDialogModify', true)
        },
        // 添加地址弹框
        handleAdd() {
            this.$store.commit('login/setDialogAdd', true)
        },
    },
    mounted() {
        this.getAddressList()
    },
    components: {
        AddToAddress,
        ModifyAddress
    }
}
</script>

<style lang="scss" scoped>

#address{
    width: 100%;
    padding: 45px 63px;
    user-select: none; 
}
.address{
    min-width: 1200px;
    margin: 0 auto;
    .address-header{
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
        .add-to-address{
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
        .choose-btn{
            cursor: pointer;
        }
        .operation-btn{
            // display: flex;
            line-height: 34px;
            width: 82px;
            margin: 0 auto;
            div{
                height: 34px;
                width: 82px;
                cursor: pointer;
                text-align: center;
                font-size:14px;
                border-radius:5px;
            }
            .edit{
                border:1px solid rgba(210,210,210,1);
                color:rgba(51,51,51,1);
                margin-bottom: 10px;
            }
            .delete{
                background:rgba(255,87,87,1);
                color: rgba(255,255,255,1);
            }
        }
    }
}
.address /deep/ .el-table td{
    padding: 0;
    .cell{
        padding: 15px 0;
    }
}

.address /deep/ .el-dialog{
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
</style>
