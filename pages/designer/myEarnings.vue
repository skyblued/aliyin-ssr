<template>
    <div id="earnings">
        <div class="earnings">
            <div class="earnings-header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="积分类型 : " class="select">
                        <el-select v-model="formInline.type" style="width: 108px;">
                            <el-option v-for="(item,index) in productList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间 : " class="form-item date">
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
                <div class="integral">总积分: {{balance}}</div>
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
        // 根据日期查询
        handleBlur() {},

        // 获取积分明细列表
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
    min-width: 960px;
    margin: 65px auto 0;
    padding: 0 65px;
    display: flex;
}

.earnings{
    width: 1500px;
    min-width: 960px;
    margin: 0 auto;
    user-select: none;
}

.earnings-header{
    min-width: 960px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 37px;
    height: 76px;
    box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius: 10px;
    background:rgba(254,254,254,1);
    padding: 20px 28px 19px 20px;
}

// 搜索按钮样式
.screen{
    background: $color;
    display: inline-block;
    height: 37px;
    line-height: 37px;
    padding: 0 12px;
    border-radius: 5px;
    color: rgba(254,254,254,1);
    cursor: pointer;
}
</style>
