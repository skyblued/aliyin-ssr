<template>
    <div id="my-template">
        <div class="my-template">
            <div class="template-header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="全部产品 : " class="select">
                        <el-select v-model="formInline.product" clearable style="width: 128px;" @change="handleChange">
                            <el-option label="全部" value="all"></el-option>
                            <el-option v-for="(item,index) in productList" :key="index" :label="item.ClassName" :value="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品分类 : " class="select">
                        <el-select v-model="formInline.productType" clearable style="width: 128px;">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item,index) in productTypeList" :key="index" :label="item.TypeName" :value="item.TypeId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="提交状态 : " class="select">
                        <el-select v-model="formInline.substate" clearable style="width: 98px;" @change="handleChange1">
                            <el-option v-for="(item,index) in substateList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态 : " class="select">
                        <el-select v-model="formInline.audstate" clearable style="width: 118px;" @change="handleChange2">
                            <el-option v-for="(item,index) in audstateList" :key="index" :label="item.label" :value="item.value" :disabled="disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设计时间 : " class="form-item">
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
                        <div class="screen" @click="getData">筛选</div>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                v-loading="loading"
                :data="tableData"
                :row-class-name="tableRowClassName">
                <el-table-column
                    label="缩略图"
                    min-width="164">
                    <template slot-scope="scope">
                        <!-- <img :src="$store.state.port.imgBaseUrl+scope.row.thumb" alt="" style="width: 100px;height: auto;"> -->
                        <div class="temp-thumb" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+scope.row.thumb})`}"></div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="所属产品"
                    width="78">
                    <template slot-scope="scope">
                        <span>{{scope.row.typeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="所属分类"
                    min-width="150">
                    <template slot-scope="scope">
                        <div v-for="(item,i) in scope.row.trade" :key="i" class="temp-filters">
                            <span>{{item.Name}}: </span>
                            <span v-for="(items,index) in item.FilterValues" :key="index" class="temp-classify">
                                <img class="temp-color" v-if="items.DisplayMode == 1" :src="$store.state.port.imgBaseUrl+items.ImageUrl" alt="">
                                <span v-else>{{items.Name}}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="关键词标签"
                    min-width="157">
                    <template slot-scope="scope">
                        <span>{{scope.row.keyword}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="提交时间"
                    width="100">
                    <template slot-scope="scope">
                        <span class="subtime" v-if="scope.row.subdate">{{scope.row.subdate.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="模板状态"
                    min-width="116">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state== -1 " style="color: #333">未提交</span>
                        <span v-else-if="scope.row.state == 1 " style="color: #008000">已通过审核</span>
                        <!-- <span v-else-if="scope.row.state =='已下架'" style="color: #ff9900">已下架</span> -->
                        <span v-else-if="scope.row.state == -1" style="color: red">
                            审核不通过
                            <p style="color: #333">
                                <i class="el-icon-warning"></i>
                            </p>
                        </span>
                        <span v-else style="color: #0099ff">审核中</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="数据状态"
                    min-width="160">
                    <template slot-scope="scope">
                        <div class="data-state">
                            <span class="datastate">浏览: {{scope.row.visits}}</span>
                            <span class="datastate">使用: {{scope.row.use}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="subject"
                    label="专题"
                    width="120">
                    <template slot-scope="scope">
                        <span class="subject">{{scope.row.subject}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="scope.row.state == -1" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="success" v-if="scope.row.state == -1" @click="handleSubmit(scope.row)">提交</el-button>
                        <el-dialog title="提交模板" :visible.sync="$store.state.dialogSubmit" :close-on-click-modal="false" :modal-append-to-body="false">
                            <temp-submit :productId="productId" :tempNum="num" @getRecord="getData"></temp-submit>
                        </el-dialog>
                        <el-button size="mini" type="danger" v-if="scope.row.state == -1 || scope.row.state == 0" @click="handleDelete(scope.row.tempNum,scope.row.i)">删除</el-button>
                        <el-button size="mini" type="primary" v-if="scope.row.state == 2">下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" v-if="tableData.length">
                <HomePagination :Page="page" @getTempList="getData" />
            </div>
        </div>
    </div>
</template>

<script>
import TempSubmit from '@/components/designer/mytemplate/TempSubmit.vue'
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            formInline: {
                product: '',
                productType: '',
                substate: '',
                audstate: '',
                startTime: '',
                endTime: ''
            },
            product: '',
            substateList: [{
                value: '0',
                label: '全部'
            },{
                value: '1',
                label: '已提交'
            },{
                value: '-1',
                label: '未提交'
            }],
            audstateList: [{
                value: '',
                label: '全部'
            },{
                value: '0',
                label: '待审核'
            },{
                value: '1',
                label: '通过审核'
            },{
                value: '-1',
                label: '审核失败'
            }],
            disabled: false,
            tableData: [],   // 设计记录列表
            productList: [],
            productTypeList: [],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: null,    // 每页个数
            },
            startTime: '',
            endTime: '',
            productId: '',                  // 当前模板封面
            num: '',                    // 当前模板编号
            loading: true,      // 加载动画
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
            }
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },

        handleChange(val) {
            if(val !== 'all' && val !== ''){
                this.productTypeList = this.productList[val].ProductTypeList
                this.formInline.productType = ''
                this.product = this.productList[val].ClassNum
            }else{
                this.product = ''
                this.formInline.productType = ''
                this.productTypeList = []
            }
        },
        handleChange1(val) {
            this.formInline.audstate = ''
            if(val == '-1'){
                this.disabled = true
                this.formInline.audstate = ''
            }else{
                this.disabled = false
            }
        },
        handleChange2(val) {
            if(val != ''){
                this.formInline.substate = '1'
            }
        },

        // 提交
        handleSubmit(row) {
            this.$store.commit('setDialogSubmit', true)
            this.productId = row.productId
            this.num = row.tempNum
        },
        // 获取设计师设计记录
        getData() {
            this.tableData = []
            let productType = this.formInline.productType || ''
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.startTime = ''
                this.endTime = ''
            }else{
                this.startTime = this.formInline.startTime
                this.endTime = this.formInline.endTime
            }
            var formData = new FormData()
            formData.append('pageIndex', this.page.currentPage);
            formData.append('productcategory', this.product);
            formData.append('producttypeid', productType);
            formData.append('startTime', this.startTime);
            formData.append('endTime', this.endTime);
            formData.append('issubmit', this.formInline.substate);
            formData.append('isaud', this.formInline.audstate)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/DesignerTemplates', formData, config).then(res => {
                console.log(res.data)
                this.loading = false
                if(res.data.Data == null){
                    return
                }
                var desrecordList = []
                for(var i=0;i<res.data.Data.length;i++) {
                    var obj = {}
                    obj.thumb = res.data.Data[i].FacePicture
                    obj.typeName = res.data.Data[i].ProductTypeName
                    obj.trade = res.data.Data[i].StrFilters
                    obj.keyword = res.data.Data[i].Keywords
                    obj.subdate = res.data.Data[i].SubTime
                    obj.state = res.data.Data[i].Status
                    obj.use = res.data.Data[i].Counts
                    obj.visits = res.data.Data[i].Visits
                    obj.subject = res.data.Data[i].StrThematic
                    obj.tempNum = res.data.Data[i].TemplateNumber
                    obj.productId = res.data.Data[i].ProductTypeId
                    obj.i = i
                    desrecordList[i] = obj
                }
                this.tableData = desrecordList
                var data = (res.data)['X-Pagination']
                this.page.totalRecords = data.TotalCount
                // console.log(this.page.totalRecords)
                this.page.pageSize = Math.ceil(data.TotalCount / data.TotalPages)        
            })
        },
        // 删除模板记录
        handleDelete(num,i){
            this.$confirm('是否删除该模板?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var formData = new FormData()
                formData.append('TemplateNum', num);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/DesignerTemplate', {data: formData}, config).then(res => {
                    console.log(res)
                    if(res.data == true){
                        this.$message({type: 'success',message: '删除成功'})
                        this.tableData.splice(i,1)
                        this.page.totalRecords = this.page.totalRecords - 1
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
        // 编辑
        handleEdit(row) {
            //console.log(row)
            let str = 'TemplateNumber=' + row.tempNum
            str = window.btoa(str)
            window.open('/designer/'+ str)
        },
    },
    mounted() {
        this.$axios.get(this.$store.state.port.AllTemplate).then(res =>{
            //console.log(res.data)
            this.productList = res.data
        })
        this.getData()
    },
    components: {
        TempSubmit,
        HomePagination
    }
}
</script>

<style lang="scss">

#my-template{
    width: 100%;
    min-width: 960px;
    margin: 65px auto 0;
    padding: 0 65px;
    display: flex;
}
.my-template{
    width: 1500px;
    min-width: 900px;
    margin: 0 auto;
    user-select: none;
    overflow: visible;
}

.template-header{
    //min-width: 1200px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 57px;
    height: 76px;
    box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius: 10px;
    background:rgba(254,254,254,1);
    padding: 20px 28px 19px 20px;
    .el-form .el-form-item{
        margin-right: 26px;
        height: 37px;
        .el-button{
            height: 37px;
        }
    }
}
.demo-form-inline .form-item{
    .range{
        margin: 0 10px;
    }
    .block-date{
        display: inline-block;
        .el-date-editor, .el-input__inner{
            width: 144px;
        }
        .el-input--prefix .el-input__inner{
            padding-left: 35px;
            padding-right: 18px;
        }
    }
}
.my-template .el-table{
    width: 100%;
}

.my-template .el-table td{
    padding: 0;
    height: 149px;
    line-height: 149px;
    .cell{
        .temp-thumb{
            display: inline-block;
            height: 104px;
            width: 80%;
            background-position: 50%;
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
    .datastate{
        display: block;
    }
    .temp-filters{
        .temp-color{
            border-radius: 3px;
            display: inline-block;
            width: 23px;
            height: 19px;
            vertical-align: middle;
        }
        .temp-classify{
            margin-right: 5px;
        }
    }
}
.my-template .el-table td:last-child .cell{
    width: 82px;
    margin: 0 auto;
    padding: 8px 10px;
    .el-button{
        width: 100%;
        height: 34px;
        line-height: 34px;
        padding: 0;
        margin: 5px 0;
    }
}


.my-template .el-table .el-table__body .el-table__row td{
    border-right: 1px solid rgba(255,255,255,1);
    color: rgba(51,51,51,1);
}
.my-template .el-table .el-table__body .el-table__row td:last-child{
    border-right: 0;
}

.my-template .el-dialog{
    width: 883px;
    border-radius: 10px;
    text-align: center;
    box-shadow: none;
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
        padding: 30px 51px 60px 32px;
    }
}


</style>
