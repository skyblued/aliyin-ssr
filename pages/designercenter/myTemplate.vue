<template>
    <div id="my-template">
        <div class="my-template">
            <div class="template-header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="产品分类 : ">
                        <el-cascader
                            expand-trigger="hover"
                            :options="options"
                            clearable
                            :change-on-select="true"
                            v-model="selectedOptions"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="提交状态 : " class="select">
                        <el-select v-model="formInline.substate" style="width: 80px;" @change="handleChange1">
                            <el-option v-for="(item,index) in substateList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态 : " class="select">
                        <el-select v-model="formInline.audstate" style="width: 96px;" @change="handleChange2" placeholder="请选择">
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
                        <div class="temp-thumb" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+scope.row.thumbnail})`}"></div>
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
                            <span class="temp-filters-title">{{item.Name}}: </span>
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
                        <span v-if="scope.row.state== -1 && !scope.row.text" style="color: #333">未提交</span>
                        <span v-else-if="scope.row.state == 1 " style="color: #008000">已通过审核</span>
                        <!-- <span v-else-if="scope.row.state =='已下架'" style="color: #ff9900">已下架</span> -->
                        <span v-else-if="scope.row.state == -1 && scope.row.text" style="color: red">
                            审核不通过
                            <p style="color: #333">
                                <i class="el-icon-warning"></i>
                                <span>{{scope.row.text}}</span>
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
                        <el-button size="mini" type="success" v-if="scope.row.state == -1" @click.stop="handleSubmit(scope.row)">提交</el-button>
                        <el-button size="mini" type="danger" v-if="scope.row.state == -1" @click="handleDelete(scope.row.TemplateNumber,scope.$index)">删除</el-button>
                        <el-button size="mini" type="primary" v-if="scope.row.state == 2">下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="提交模板" :visible.sync="dialogSubmit" :close-on-click-modal="false" :modal-append-to-body="false" :lock-scroll="false" top="10vh" :show-close="false">
                <TempSubmit v-if="dialogSubmit" :tempInfo="tempInfo" :ProductTypeId="ProductTypeId" :TemplateNumber="TemplateNumber" :faceImg="faceImg" @getRecord="getData" @toggleDialog="toggleDialog"></TempSubmit>
                <div class="close-btn" style="right: -55px;top: 8px;" @click="dialogSubmit = false"></div>
            </el-dialog>
            <div class="block" v-if="tableData.length && page.totalRecords > 20">
                <HomePagination :Page="page" @getTempList="getData" />
            </div>
        </div>
    </div>
</template>

<script>
import TempSubmit from '@/components/designer/TempSubmit.vue'
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            formInline: {
                substate: '',
                audstate: '',
                startTime: '',
                endTime: ''
            },
            substateList: [{
                value: '',
                label: '全部'
            },{
                value: '1',
                label: '已提交'
            },{
                value: '-1',
                label: '未提交'
            }],
            audstateList: [{
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
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: null,    // 每页个数
            },
            startTime: '',
            endTime: '',
            ProductTypeId: '',                  // 当前模板产品id
            TemplateNumber: '',                    // 当前模板编号
            tempName: '',              // 当前模板名称
            faceImg: '',               // 当前模板封面
            tempInfo: null,      // 当前模板信息     
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
            },
            selectedOptions: [''],
            options: [{
                value: '',
                label: '全部',
            }],
            enumArr: [],
            dialogSubmit: false,  // 提交模板弹框
        }
    },
    methods: {
        toggleDialog(msg) {
            this.dialogSubmit = msg
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },

        handleChange(val) {
            // console.log(val)
        },
        handleChange1(val) {
            this.formInline.audstate = '0'
            if(val == '') {
                this.formInline.audstate = ''
            }
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

        // 打开提交弹框
        handleSubmit(row) {
            this.ProductTypeId = row.ProductTypeId
            this.TemplateNumber = row.TemplateNumber
            this.faceImg = row.thumb
            this.dialogSubmit = true
        },
        // 获取设计师设计记录
        getData() {
            this.tableData = []
            this.loading = true
            let product = this.selectedOptions[0] || ''
            let productType = this.selectedOptions[1] || ''
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.startTime = ''
                this.endTime = ''
            }else{
                this.startTime = this.formInline.startTime
                this.endTime = this.formInline.endTime
            }
            var formData = new FormData()
            formData.append('pageIndex', this.page.currentPage);
            formData.append('productcategory', product);
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
                    obj.thumbnail = res.data.Data[i].FacePicture + '?v=' + new Date().getTime()
                    obj.thumb = res.data.Data[i].FacePicture
                    obj.typeName = res.data.Data[i].ProductTypeName
                    obj.trade = res.data.Data[i].StrFilters
                    obj.keyword = res.data.Data[i].Keywords
                    obj.subdate = res.data.Data[i].SubTime
                    obj.state = res.data.Data[i].Status
                    obj.use = res.data.Data[i].Counts
                    obj.visits = res.data.Data[i].Visits
                    obj.subject = res.data.Data[i].StrThematic
                    obj.TemplateNumber = res.data.Data[i].TemplateNumber
                    obj.ProductTypeId = res.data.Data[i].ProductTypeId
                    obj.tempname = res.data.Data[i].Name
                    obj.i = i
                    if(res.data.Data[i].SubTemplate) {
                        obj.content = res.data.Data[i].SubTemplate.Contents
                        obj.text = res.data.Data[i].SubTemplate.RefuseText
                    }else{
                        obj.text = ''
                        obj.content = ''
                    }
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
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var formData = new FormData()
                formData.append('TemplateNum', num);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/DesignerTemplate', {data: formData}, config).then(res => {
                    //console.log(res)
                    if(res.data == true){
                        this.$message({type: 'success',message: '删除成功'})
                        this.tableData.splice(i,1)
                        this.page.totalRecords = this.page.totalRecords - 1
                        if(this.tableData.length == 0 && this.page.currentPage > 1) {
                            this.page.currentPage -= 1
                            this.getData()
                        }
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
            let str = 'TemplateNumber=' + row.TemplateNumber
            str = window.btoa(str)
            window.open('/designer/'+ str)
        },

        getEnumsList(val) {
            if(val && val.length!=0) {
                val.forEach(item => {
                    this.enumArr.push(item)
                    this.getEnumsList(item.ProductTypeList)
                })
            }
        },
        keep(val) {
            val.Children = []
            if (val.ProductTypeList && val.ProductTypeList.length!= 0) {
                val.ProductTypeList.forEach(item => {
                    val.Children.push({
                        value: item.TypeId,
                        label: item.TypeName,
                        children: item.Children
                    })
                    this.keep(item)
                })
            } else {
                delete val.Children;
            }
        }
    },
    mounted() {
        this.$axios.get('/designer/products').then(res =>{
            console.log(res.data)
            var data = res.data
            this.enumArr = []
            this.getEnumsList(data)
            data.forEach(item => {
                this.keep(item)
                this.options.push({
                    value: item.ClassNum,
                    label: item.ClassName,
                    children: item.Children
                })
            })
            // this.productList = res.data
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
    min-width: 1200px;
    margin: 65px auto 0;
    padding-left: 65px;
    display: flex;
}
.my-template{
    min-width: 1200px;
    user-select: none;
    overflow: visible;
}

.template-header{
    min-width: 1200px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 57px;
    // height: 76px;
    box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius: 10px;
    background:rgba(254,254,254,1);
    padding: 20px;
    padding-bottom: 0;
    .el-form .el-form-item{
        margin-right: 26px;
        height: 37px;
        .el-button{
            height: 37px;
        }
        .el-input__inner{
            padding-left: 10px;
            padding-right: 0;
            font-size: 12px;
        }
        .el-cascader{
            display: inline-block;
            line-height: 37px;
            width: 210px;
            .el-input__suffix-inner i::before{
                content: '';
            }
            .el-input__suffix-inner i::after{
                background-image: url(/img/personal/drop_down.png);
                width: 100%;
                height: 30px;
            }
            .el-input__suffix:hover::before{
                content: '';
                position: absolute;
                top: 10px;
                right: 5px;
                display: inline-block;
                vertical-align: middle;
                background-image: url(/img/print/xqy_fork.png);
                width: 16px;
                height: 16px;
            }
            .el-input__suffix:hover .el-input__suffix-inner i::after{
                display: none;
            }
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
            width: 120px;
        }
        .el-input--prefix .el-input__inner{
            padding-left: 35px;
            padding-right: 0;
        }
    }
}
.my-template .el-table{
    width: 100%;
    box-shadow: 0px 0px 20px 5px rgba(203,211,217,0.3);
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
        text-align: left;
        padding-left: 10px;
        .temp-color{
            border-radius: 3px;
            display: inline-block;
            width: 23px;
            height: 19px;
            vertical-align: middle;
        }
        .temp-filters-title{
            display: inline-block;
            margin-right: 5px;
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
        padding: 30px 32px 60px;
    }
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
