<template>
    <div class="template-upper">
        <div class="upper-header">
            <div class="type">
                <span class="text">产品类型: </span>
                <span class="selected" @mouseenter="handleEnter('type')" @mouseleave="handleLeave('type')">
                    <span style="padding-left: 18px;">{{product}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="list">
                        <li :class="{active: activeIndex == null}" @click="handleChoose('null')">全部产品</li>
                        <li :class="{active: activeIndex == i}" v-for="(item,i) in productList" :key="i" @click="handleChoose(i)">{{item.ClassName}}</li>
                    </ul>
                </span>
                <span class="selected" @mouseenter="enter" @mouseleave="leave">
                    <span style="padding-left: 18px;">{{productType}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="second" v-if="productTypeList.length">
                        <li :class="{active: isActive == null}" @click="handleChooseType('null')">全部</li>
                        <li :class="{active: isActive == i}" v-for="(item,i) in productTypeList" :key="i" @click="handleChooseType(i)">{{item.TypeName}}</li>
                    </ul>
                </span>
            </div>
            <div class="status">
                <span class="text">状态: </span>
                <span class="selected" style="width: 118px;" @mouseenter="handleEnter('state')" @mouseleave="handleLeave('state')">
                    <span style="padding-left: 18px;">{{state}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="state">
                        <li :class="{active: isState == i}" v-for="(item,i) in stateList" :key="i" @click="handleChooseState(i)">{{item.label}}</li>
                    </ul>
                </span>
            </div>
            <div class="keyword">
                <el-input v-model="keyword" placeholder="请输入模板关键字或名称" @keyup.native="handleSearch($event)"></el-input>
            </div>
            <div class="search-btn" @click="getUpperTemplate">搜索</div>
            <div v-if="isBatch" class="batch" @click="isBatch = false">批量操作</div>
            <div class="batch-btn" v-if="!isBatch">
                <div class="batch-up" @click="handleBatch('up')">批量上架</div>
                <div class="batch-down" @click="handleBatch('down')">批量下架</div>
                <div class="batch-delete" @click="handleBatch('delete')">批量删除</div>
                <div class="out" @click="isBatch = true">退出</div>
            </div>
        </div>
        <div id="loading" v-if="loading">
            <div class="loader-inner ball-beat">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="upper-content" v-if="tableData.length">
            <el-table
                :data="tableData"
                @selection-change="handleSelectionChange">
                <el-table-column
                    width="98">
                    <template slot="header" slot-scope="scope">
                        <el-checkbox :indeterminate="isIndeterminate" :label="scope.row" v-model="checkAll" @change="handleCheckAllChange">编号</el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
                            <el-checkbox :label="scope.row.tempNum">{{scope.row.tempNum}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
                <el-table-column
                    label="封面">
                    <template slot-scope="scope">
                        <div class="temp-thumb" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+scope.row.faceUrl})`}"></div>
                        <p>{{scope.row.tempName}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="产品类型"
                    prop="type">
                </el-table-column>
                <el-table-column
                    label="关键词"
                    prop="keyword">
                </el-table-column>
                <el-table-column
                    label="模板作者"
                    prop="author">
                </el-table-column>
                <el-table-column
                    label="添加时间"
                    width="90">
                    <template slot-scope="scope">
                        <span class="subtime" v-if="scope.row.addTime">{{scope.row.addTime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="上架状态">
                    <template slot-scope="scope"> 
                        <span v-if="scope.row.status == '0'">未上架</span>
                        <span v-else style="color: #008000">已上架</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleSee(scope.$index)">查看</el-button>
                        <el-button type="success" v-if="scope.row.status == '0'" @click="handleUpper(scope.$index)">上架</el-button>
                        <el-button type="primary" v-if="scope.row.status == '1'" @click="handleLower(scope.$index)">下架</el-button>
                        <el-button type="danger" v-if="scope.row.status != '1'" @click="handleDel(scope.$index)">删除</el-button>
                        <el-button v-if="scope.row.status == '1' && !scope.row.isRecommend" @click="handleSet(scope.$index)">推荐</el-button>
                        <el-button v-if="scope.row.status == '1' && scope.row.isRecommend" @click="handleCancel(scope.$index)">取消</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="block" v-if="tableData.length && page.totalRecords > 20">
            <HomePagination :Page="page" @getTempList="getUpperTemplate" />
        </div>

        <div class="blank" v-if="!tableData.length && !loading">
            <img src="/img/error/ku.png" alt="">
            <p>当前没有模板数据</p>
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            product: '全部产品',
            productList: [],
            activeIndex: null,
            productTypeList: [],
            productType: '请先选择上级',
            isActive: null,
            stateList: [{
                value: '',
                label: '全部'
            },{
                value: '0',
                label: '未上架'
            },{
                value: '1',
                label: '已上架'
            },],
            state: '全部',
            isState: '0',
            tableData: [],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
            param: {
                productId: '0',
                productTypeId: '0',
                stateId: ''
            },
            loading: true,
            isIndeterminate: true,
            checkAll: false,
            checkedList: [],
            multipleSelection: [],
            checkedId: [],
            isBatch: true,
            keyword: ''
        }
    },
    methods: {
        handleCheckAllChange(val) {
            this.checkedList = val ? this.checkedId : []
            this.isIndeterminate = false;
            console.log(this.checkedList)
        },
        handleCheckedListChange(value) {
            console.log(this.checkedList)
            let checkedCount = value.length
            this.checkAll = checkedCount === this.checkedId.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedId.length
        },
        // 全选
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleBatch(type) {   // 批量上架、下架、删除
            for(var i=0;i<this.checkedList.length;i++) {
                var formData = new FormData()
                formData.append('action', type);
                formData.append('templatenum', this.checkedList[i]);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/UpperShelfTemplate', formData, config).then(res => {
                    console.log(res.data)
                    if(res.data.state == 'ok') {
                        this.$message.closeAll()
                        this.$message.success(res.data.msg)
                        this.checkedList = []
                        this.getUpperTemplate()
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },

        getProduct() {
            this.$axios.get('/admin/products').then(res => {
                // console.log(res.data)
                this.productList = res.data
            })
        },

        handleEnter(type) {
            if(type == 'type') {
                this.$refs.list.style.maxHeight = '270px'
                this.$refs.list.style.overflow = 'hidden'
            }else{
                this.$refs.state.style.maxHeight = '270px'
                this.$refs.state.style.overflow = 'hidden'
            }
        },
        handleLeave(type) {
            if (type == 'type') {
                this.$refs.list.style.maxHeight = '0'
            } else {
                this.$refs.state.style.maxHeight = '0'
            }
        },
        handleChoose(i) {  // 选择产品类型
            if (i == 'null') {
                this.product = '全部产品'
                this.activeIndex = null
                this.productTypeList = []
                this.productType = '请先选择上级'
                this.param.productId = '0'
                this.param.productTypeId = '0'
            } else {
                this.product = this.productList[i].ClassName
                this.activeIndex = i
                this.productTypeList = this.productList[i].ProductTypeList
                this.productType = '全部'
                this.isActive = null
                this.param.productId = this.productList[i].ClassNum
                this.param.productTypeId = '0'
            }
        },

        enter() {
            if(this.productTypeList.length){
                this.$refs.second.style.maxHeight = '270px'
                this.$refs.second.style.overflowY = 'auto'
            }
        },
        leave() {
            if(this.productTypeList.length){
                this.$refs.second.style.maxHeight = '0'
            }
        },
        handleChooseType(i) {  // 选择产品类型分类
            if(i == 'null') {
                this.productType = '全部'
                this.isActive = null
                this.param.productTypeId = '0'
            }else{
                this.productType = this.productTypeList[i].TypeName
                this.isActive = i
                this.param.productTypeId = this.productTypeList[i].TypeId
            }
        },
        handleChooseState(i) {  // 选择状态
            this.state = this.stateList[i].label
            this.isState = i
            this.param.stateId = this.stateList[i].value
        },
        // 关键字搜索
        handleSearch(e) {
            if(e.keyCode == 13) {
                this.getUpperTemplate()
            }
        },
        // 获取可上架模板列表
        getUpperTemplate() {
            this.tableData = []
            this.checkedId = []
            this.loading = true
            var url = "/UpperShelfTemplate?Type=" + this.param.productTypeId + '&Categories=' + this.param.productId + '&Status=' + this.param.stateId + '&PageSize=' + this.page.pageSize + '&PageIndex=' + this.page.currentPage + '&Keywords=' + this.keyword 
            this.$axios.get(url).then(res => {
                console.log(res.data)
                if(res.data.state == 'no') {
                    this.$message.warning(res.data.msg)
                    this.loading = false
                    return
                }
                var data = res.data.Data
                if(data.length == 0) {
                    this.loading = false
                    return
                }
                var list = []
                for(var i=0;i<data.length;i++) {
                    var obj = {}
                    obj.faceUrl = data[i].FacePicture + '?v=' + new Date().getTime()
                    obj.type = data[i].ProductCategorieName + '/' + data[i].ProductTypeName
                    obj.author = data[i].Author
                    obj.addTime = data[i].AddTime
                    obj.status = data[i].IsUpperShelf
                    obj.tempNum = data[i].TemplateNumber
                    obj.id = data[i].TemplateId
                    obj.isRecommend = data[i].IsIndex
                    obj.tempName = data[i].Name
                    obj.keyword = data[i].Keywords
                    list[i] = obj
                }
                this.tableData = list
                if(this.tableData.length > 0) this.loading = false
                this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
                for (let i = 0; i < this.tableData.length; i++) {
                    this.checkedId.push(this.tableData[i].tempNum)
                    this.multipleSelection = this.checkedId
                }
            })
        },

        upper(index, type) {  // 上架、下架、删除
            console.log(index, type)
            let num = this.tableData[index].tempNum
            var formData = new FormData()
            formData.append('action', type);
            formData.append('templatenum', num);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/UpperShelfTemplate', formData,config).then(res => {
                console.log(res.data)
                if(res.data.state == 'ok') {
                    this.$message.success(res.data.msg)
                    this.getUpperTemplate()
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleUpper(index) {  // 上架
            this.$confirm('确定要上架吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                this.upper(index, 'up')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消上架'
                });         
            })
        },
        handleLower(index) {  // 下架
            this.$confirm('确定要下架吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                this.upper(index, 'down')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消下架'
                });         
            })
        },
        handleDel(index) {   // 删除
            this.$confirm('确定要删除吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                this.upper(index, 'delete')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });         
            })
        },
        handleSee(index) {  // 查看
            let str = 'TemplateNumber=' + this.tableData[index].tempNum + '&admin=admin'
            str = window.btoa(str)
            window.open('/designer/'+ str)
        },
        recommend(index, type) {  // 推荐
            var formData = new FormData()
            formData.append('action', type);
            formData.append('templatenum', this.tableData[index].tempNum);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.put('/RecommendTemplaleClass', formData, config)
            .then(res => {
                // console.log(res.data)
                if(res.data.state == 'ok') {
                    this.$message.success(res.data.msg)
                    this.getUpperTemplate()
                }else{
                    this.$message.warning(res.data.msg)
                }
            })
        },
        handleSet(index) {  // 推荐
            this.$confirm('确定要推荐到首页吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                this.recommend(index, 'set')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });         
            })
        },
        handleCancel(index) {  // 取消推荐
            this.$confirm('确定要取消推荐吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                this.recommend(index, 'cancel')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });         
            })
        }
    },
    mounted() {
        this.getProduct()
        this.getUpperTemplate()
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>
.template-upper{
    padding-left: 10px;
    .upper-header{
        display: flex;
        min-width: 1200px;
        line-height: 37px;
        padding: 20px 28px 19px 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        .type, .status{
            height: 37px;
            display: flex;
            font-size: 14px;
            .text{
                color: rgba(51,51,51,1);
                margin-right: 15px;
            }
            .selected{
                height: 100%;
                width: 158px;
                border: 1px solid rgba(220,223,230,1);
                border-radius: 3px;
                display: inline-block;
                position: relative;
                margin-right: 20px;
                cursor: pointer;
                .select-icon{
                    display: inline-block;
                    background-image: url(/img/personal/drop_down.png);
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    right: 10px;
                    top: 3px;
                }
                .list{
                    width: 100%;
                    max-height: 0;
                    overflow-y: auto;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,.32);
                    background: rgba(255,255,255,1);
                    transition: max-height .2s ease;
                    position: absolute;
                    top: 37px;
                    left: 0;
                    z-index: 20;
                    &::-webkit-scrollbar{
                        width: 10px;
                    }
                    &::-webkit-scrollbar-thumb{
                        border-radius: 5px;
                        background: rgba(231,231,231,1);
                    }
                    &::-webkit-scrollbar-track{
                        border-radius: 0;
                        background: rgba(231,231,231,.7);
                    }
                    li{
                        width: 100%;
                        height: 32px;
                        line-height: 32px;
                        padding-left: 18px;
                        cursor: pointer;
                        transition: background .4s ease;
                        &:hover{
                            background: #e7e7e7;
                        }
                    }
                    .active{
                        font-weight: 700;
                        background: #e7e7e7;
                    }
                }
            }
        }
        .keyword{
            margin-right: 20px;
        }
        .search-btn{
            width: 60px;
            height: 37px;
            line-height: 37px;
            text-align: center;
            color: rgba(255,255,255,1);
            background: $color;
            border-radius: 5px;
            cursor: pointer;
        }
        .batch{
            margin-left: 100px;
            cursor: pointer;
        }
        .batch-btn{
            display: flex;
            height: 37px;
            line-height: 37px;
            font-size: 14px;
            margin-left: 100px;
            div{
                border-radius: 5px;
                border: 1px solid rgba(153,153,153,1);
                padding: 0 10px;
                cursor: pointer;
            }
            .batch-down{
                margin: 0 15px;
            }
            .out{
                margin-left: 15px;
            }
        }
    }
    .upper-content{
        min-width: 1200px;
        height: auto;
    }
    .blank{
        text-align: center;
        margin: 200px auto 0;
    }
}
.template-upper /deep/ .keyword .el-input__inner{
    height: 37px;
    border-radius: 21px;
}
.template-upper /deep/ .upper-content .el-table {
    .cell{
        text-align: center;
    }
    td{
        padding: 0;
        height: 108px;
        line-height: 108px;
        .cell{
            .temp-thumb{
                display: inline-block;
                height: 60px;
                width: 80%;
                background-position: 50%;
                background-size: contain;
                background-repeat: no-repeat;
            }
            // .subtime{
            //     display: inline-block;
            //     width: 86px;
            // }
            .el-button{
                display: block;
                width: 48px;
                height: 32px;
                line-height: 32px;
                padding: 0;
                margin: 0 auto;
            }
            .el-button+.el-button{
                margin-left: 0;
                margin: 5px auto 0;
            }
        }
    }
}

#loading{
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 1000;
}
</style>
