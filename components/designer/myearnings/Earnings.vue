<template>
    <div id="earnings">
        <div class="earnings">
            <div class="earnings-header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="收益类型 : " class="select">
                        <el-select v-model="formInline.type" style="width: 150px;">
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
                        <div class="screen" @click="getBalanceList">筛选</div>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                v-loading="loading"
                :data="tableData"
                :row-class-name="tableRowClassName">
                <el-table-column
                    label="时间"
                    min-width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.date">{{scope.row.date.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="from"
                    label="来源"
                    min-width="100">
                </el-table-column> -->
                <el-table-column
                    label="金额"
                    min-width="75">
                    <template slot-scope="scope">
                        <span v-if="scope.row.price">￥{{scope.row.price.toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="类型"
                    min-width="150">
                </el-table-column>
                <el-table-column
                    prop="balance"
                    label="当前余额">
                    <template slot-scope="scope">
                        <span v-if="scope.row.balance">￥{{scope.row.balance.toFixed(2)}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="tableData.length">
                <HomePagination :Page="page" @getTempList="getBalanceList" />
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
                type: '',
                startTime: '',
                endTime: '',
            },
            productList: [{
                value: '',
                label: '全部'
            },{
                value: '1',
                label: '模板返利'
            },{
                value: '2',
                label: '素材返利'
            }],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: null,      // 每页个数
            },
            startTime: '',
            endTime: '',
            tableData: [], 
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
            loading: true
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },
        // 根据日期查询
        handleBlur() {},

        // 获取收支明细列表
        getBalanceList() {
            this.tableData = []
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.startTime = ''
                this.endTime = ''
            }else{
                this.startTime = this.formInline.startTime
                this.endTime = this.formInline.endTime
            }
            let type = this.formInline.type
            var url = '/BalanceDetils?pageIndex=' + this.page.currentPage + '&type=' + type + '&starttime=' + this.startTime + '&endtime=' + this.endTime
            this.$axios.get(url).then(res =>{
                console.log(res.data)
                this.loading = false
                var data = res.data.Data
                var list = []
                for(var i=0;i<data.length;i++){
                    var obj = {}
                    obj.date = data[i].TradeDate
                    //obj.from = data[i].PayerName
                    obj.price = data[i].Income
                    obj.type = data[i].Remark
                    obj.balance = data[i].Balance
                    list[i] = obj
                }
                this.tableData = list
                //console.log(this.tableData)
                this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
                this.page.pageSize = Math.ceil((res.data)['X-Pagination'].TotalCount / (res.data)['X-Pagination'].TotalPages)
            })
        }
    },
    mounted() {
        this.getBalanceList()
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss">

#earnings{
    width: 100%;
    min-width: 960px;
    margin: 65px auto 0;
    padding: 0 65px;
    display: flex;
}

.earnings{
    width: 1500px;
    min-width: 900px;
    margin: 0 auto;
    user-select: none;
    .el-table{
        width: 100%;
    }
}

.earnings-header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 37px;
    height: 76px;
    box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius: 10px;
    background:rgba(254,254,254,1);
    padding: 20px 28px 19px 20px;
    .el-form .el-form-item{
        margin-right: 42px;
        height: 37px;
        .el-button{
            height: 37px;
        }
    }
}
.earnings .el-table td{
    padding: 9px 0;
}
</style>
