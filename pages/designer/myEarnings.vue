<template>
    <div id="earnings">
        <div class="earnings">
            <div class="designer-header">
                <div class="designer-header-item">
                    <div class="designer-header-title">积分类型: </div>
                    <div class="designer-header-content">
                        <el-select v-model="type" style="width: 108px;">
                            <el-option 
                                v-for="item in productList" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="designer-header-item">
                    <div class="designer-header-title">时间: </div>
                    <div class="designer-header-content">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            range-separator="~"
                            prefix-icon="el-icon-time"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00', '23:59:59']"
                            @change="handleDate">
                        </el-date-picker>
                    </div>
                </div>
                <div class="designer-search-btn" @click="getBalanceList">搜索</div>
                <div class="integral">总积分: {{balance}}</div>
            </div>
            <el-table
                v-loading="loading"
                :data="tableData"
                :row-class-name="tableRowClassName"
                empty-text="暂无数据">
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
                    label="积分"
                    min-width="75">
                    <template slot-scope="scope">
                        <span v-if="scope.row.price">{{scope.row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="类型"
                    min-width="150">
                </el-table-column>
                <el-table-column
                    prop="balance"
                    label="当前积分">
                    <template slot-scope="scope">
                        <span v-if="scope.row.balance">{{scope.row.balance}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="tableData.length && page.totalRecords > 12">
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
            type:'',
            date: '',
            productList: [{
                value: '',
                label: '全部'
            },{
                value: '1',
                label: '模板积分'
            },{
                value: '2',
                label: '素材积分'
            }],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: null,      // 每页个数
            },
            startTime: '',
            endTime: '',
            tableData: [], 
            loading: true,
            balance: '',  // 总积分
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },
        // 选择时间
        handleDate(value) {
            if(value != null) {
                this.startTime = value[0]
                this.endTime = value[1]
            }else{
                this.startTime = ''
                this.pendTime = ''
            }
        },
        // 获取积分明细列表
        getBalanceList() {
            this.tableData = []
            var url = '/BalanceDetils?pageIndex=' + this.page.currentPage + '&type=' + this.type + '&starttime=' + this.startTime + '&endtime=' + this.endTime
            this.$axios.get(url).then(res =>{
                console.log(res.data)
                this.loading = false
                this.balance = res.data.Balance
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

<style lang="scss" scoped>

#earnings{
    width: 100%;
    margin: 65px auto 0;
    padding-left: 65px;
    display: flex;
}

.earnings{
    min-width: 1200px;
    user-select: none;
    .integral{
        line-height: 37px;
        margin-left: 200px;
    }
}
</style>
