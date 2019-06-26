<template>
    <div class="master-temp">
        <div class="designer-header">
            <div class="designer-header-item">
                <div class="designer-header-title">产品分类: </div>
                <div class="designer-header-content">
                    <el-select v-model="product" @change="handleChange" style="width: 150px;">
                        <el-option label="全部" value="all"></el-option>
                        <el-option
                            v-for="(item,i) in productList" 
                            :key="i"
                            :label="item.ClassName"
                            :value="i">
                        </el-option>
                    </el-select>
                    <el-select v-model="value" style="margin-left: 15px;width: 150px;">
                        <el-option label="请先选择上级" value="0"></el-option>
                        <el-option
                            v-for="(item,i) in secondList"
                            :key="i"
                            :label="item.TypeName"
                            :value="item.TypeId">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="designer-header-item">
                <div class="designer-header-title">创建时间: </div>
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
            <div class="designer-search-btn">搜索</div>
        </div>
        <div class="mastertemp-content"></div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            product: '全部',
            productList: [],
            secondList: [],
            value: '请先选择上级',
            date: '',
            param: {
                startTime: '',
                endTime: '',
                productId: '0',
                typeId: '0'
            },
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
        }
    },
    methods: {
        handleChange(value) {
            if(value == 'all') {
                this.param.productId = '0'
                this.param.typeId = '0'
                this.value = '请先选择上级'
                this.secondList = []
            }else{
                this.param.productId = this.productList[value].ClassNum
                this.value = '请先选择上级'
                this.secondList = this.productList[value].ProductTypeList
            }
        },
        // 选择时间
        handleDate(value) {
            if(value != null) {
                this.param.startTime = value[0]
                this.param.endTime = value[1]
            }else{
                this.param.startTime = ''
                this.param.endTime = ''
            }
        },

        // 获取专属模板列表
        getMasterTemp() {
            var url = '/UsersMasters?pageSize=' + this.page.pageSize + '&pageIndex=' + this.page.currentPage + '&startTime=' + this.param.startTime + '&endTime=' + this.param.endTime + '&ProductCategorieNum=' + this.param.productId + '&ProductTypeId=' + this.param.typeId + '&type=' + 'designer'
            this.$axios.get(url).then(res => {
                console.log(res.data)
            })
        }
    },
    mounted() {
        this.$axios.get('/designer/products').then(res => {
            console.log(res.data)
            this.productList = res.data
        })
        this.getMasterTemp()
    }
}
</script>

<style lang="scss" scoped>
.master-temp{
    width: 100%;
    min-width: 1200px;
    margin: 65px auto 0;
    padding: 0 65px;
    display: flex;
}
</style>
