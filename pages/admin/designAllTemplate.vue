<template>
    <div class="all-template">
        <div class="design-header">
            <div class="type">
                <span class="text">产品类型: </span>
                <span class="selected" @mouseenter="handleEnter" @mouseleave="handleLeave">
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
            <div class="sub-status">
                <span class="text">提交状态: </span>
                <span class="selected" style="width: 118px;" @mouseenter="handleState('sub')" @mouseleave="handleStateLeave('sub')">
                    <span style="padding-left: 18px;">{{substate}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="substate">
                        <li :class="{active: isSubState == i}" v-for="(item,i) in subStateList" :key="i" @click="handleChooseSub(i)">{{item.label}}</li>
                    </ul>
                </span>
            </div>
            <div class="aud-status">
                <span class="text">审核状态: </span>
                <span class="selected" style="width: 118px;" @mouseenter="handleState('aud')" @mouseleave="handleStateLeave('aud')">
                    <span style="padding-left: 18px;">{{audState}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="audstate">
                        <li :class="{active: isAudState == i}" v-for="(item,i) in audStateList" :key="i" @click="handleChooseAud(i)">{{item.label}}</li>
                    </ul>
                </span>
            </div>
            <div class="block-date">
                <el-date-picker
                    v-model="startTime"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择开始日期">
                </el-date-picker>
                <!-- :picker-options="pickerOptions0" -->
            </div>
            <span style="margin: 0 10px;">~</span>
            <div class="block-date">
                <el-date-picker
                    v-model="endTime"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择结束日期">
                </el-date-picker>
                <!-- :picker-options="pickerOptions1" -->
            </div>
            <div class="author">
                <span class="text">设计师: </span>
                <span class="selected" @mouseenter="handleAuthor" @mouseleave="handleAuthorLeave">
                    <span style="padding-left: 18px;">{{author}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="author">
                        <li :class="{active: isAuthor == i}" v-for="(item,i) in authorList" :key="i" @click="handleChooseAuthor(i)">
                            {{item.TrueName ? item.TrueName : item.UserName}}
                            <span v-if="item.DesignerStatus == '-2'" style="color: red">(冻结)</span>
                        </li>
                    </ul>
                </span>
            </div>
            <div class="search-btn" @click="getAllTemplateList">搜索</div>
        </div>

        <div class="all-content">
            <div style="margin: 20px 0; font-size: 20px;">
                总数: <span style="color: red">{{page.totalRecords}}</span>
            </div>
            <el-table
                :data="tableData">
                <el-table-column
                    prop="authorId"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="分类">
                </el-table-column>
                <el-table-column
                    label="日期">
                    <template slot-scope="scope">
                        <span class="subtime" v-if="scope.row.subTime">{{scope.row.subTime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="提交状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == '-1' && !scope.row.text">未提交</span>
                        <span v-if="scope.row.state == '0'" style="color: blue">已提交</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == '0'" style="color: #0099ff">审核中</span>
                        <span v-if="scope.row.state == '1'" style="color: #008000">审核通过</span>
                        <span v-if="scope.row.state == '-1' && scope.row.text" style="color: red">
                            审核未通过
                            <span>{{scope.row.text}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state == '-1' && designState == '-2'" type="success" @click.stop="handleSubmit(scope.row)">提交</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="提交模板" :visible.sync="dialogSubmit" :close-on-click-modal="false" :modal-append-to-body="false" :lock-scroll="false" :show-close="false" top="10vh">
                <temp-submit v-if="dialogSubmit" :ProductTypeId="ProductTypeId" :TemplateNumber="TemplateNumber" :faceImg="faceImg" @getRecord="getAllTemplateList" @toggleDialog="toggleDialog"></temp-submit>
                <div class="close-btn" style="top: 0px;right: -50px;" @click="dialogSubmit = false"></div>
            </el-dialog>
        </div>

        <div class="block" v-if="tableData.length && page.totalRecords > 20">
            <HomePagination :Page="page" @getTempList="getAllTemplateList" />
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
import TempSubmit from '@/components/designer/TempSubmit.vue'
export default {
    data () {
        return {
            product: '全部产品',
            productList: [],
            activeIndex: null,
            productTypeList: [],
            productType: '请先选择上级',
            isActive: null,
            subStateList: [{
                value: '',
                label: '全部'
            },{
                value: '1',
                label: '已提交'
            },{
                value: '-1',
                label: '未提交'
            }],
            substate: '全部',
            isSubState: 0,
            audState: '请选择',
            isAudState: 0,
            audStateList: [{
                value: '0',
                label: '待审核'
            },{
                value: '1',
                label: '审核通过'
            },{
                value: '-1',
                label: '审核失败'
            }],
            param: {
                typeId: '',
                productId: '',
                substateId: '',
                audstateId: '',
                authorId: ''
            },
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
            // pickerOptions0: {
            //     disabledDate: (time) => {
            //         if (this.endTime) {
            //             return time.getTime() > new Date(this.endTime).getTime();
            //         } else {
            //             return time.getTime() > Date.now();
            //         }
            //     }
            // },
            // pickerOptions1: {
            //     disabledDate: (time) => {
            //         if(this.startTime){
            //             return (
            //                 time.getTime() > Date.now() ||
            //                 time.getTime() < new Date(this.startTime).getTime()
            //             );
            //         }else{
            //             return time.getTime() > Date.now();
            //         }
            //     }
            // },
            startTime: '',
            endTime: '',
            author: '',
            isAuthor: null,
            authorList: [],
            tableData: [],   
            designState: '',  // 设计师状态
            ProductTypeId: '',
            TemplateNumber: '',
            faceImg: '',
            dialogSubmit: false,
        }
    },
    created () {
        this.getProduct()
        this.getAuthor()
    },
    methods: {
        toggleDialog(msg) {
            this.dialogSubmit = msg
        },
        getProduct() {
            this.$axios.get('/admin/products').then(res => {
                // console.log(res.data)
                this.productList = res.data
            })
        },
        getAuthor() {  // 获取设计师列表
            this.$axios.get('/DesignerStatistics').then(res => {
                // console.log(res.data)
                this.authorList = res.data
            })
        },

        // 打开提交模板弹框
        handleSubmit(row) {
            // console.log(row)
            this.ProductTypeId = row.ProductTypeId
            this.TemplateNumber = row.TemplateNumber
            this.faceImg = row.faceUrl
            this.dialogSubmit = true
        },
        handleAuthor() {
            this.$refs.author.style.maxHeight = '270px'
            this.$refs.author.style.overflowY = 'auto'
        },
        handleAuthorLeave() {
            this.$refs.author.style.maxHeight = '0'
        },
        handleChooseAuthor(i) {  // 选择设计师
            this.isAuthor = i
            this.author = this.authorList[i].TrueName || this.authorList[i].UserName
            this.param.authorId = this.authorList[i].UserID
            this.designState = this.authorList[i].DesignerStatus
            this.tableData = []
        },

        handleEnter() {
            this.$refs.list.style.maxHeight = '270px'
            this.$refs.list.style.overflow = 'hidden'
        },
        handleLeave() {
            this.$refs.list.style.maxHeight = '0'
        },
        handleChoose(i) {
            if (i == 'null') {
                this.product = '全部产品'
                this.activeIndex = null
                this.productTypeList = []
                this.productType = '请先选择上级'
                this.param.productId = ''
                this.param.typeId = ''
            } else {
                this.product = this.productList[i].ClassName
                this.activeIndex = i
                this.productTypeList = this.productList[i].ProductTypeList
                this.param.productId = this.productList[i].ClassNum
                this.param.typeId = ''
                this.isActive = null
                this.productType = '全部'
            }
            if(this.page.currentPage != 1){
                this.page.currentPage = 1
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
        handleChooseType(i) {
            if(i == 'null') {
                this.productType = '全部'
                this.isActive = null
                this.param.typeId = ''
            }else{
                this.productType = this.productTypeList[i].TypeName
                this.isActive = i
                this.param.typeId = this.productTypeList[i].TypeId
            }
        },
        handleState(msg) {
            if(msg == 'sub'){
                this.$refs.substate.style.maxHeight = '270px'
                this.$refs.substate.style.overflow = 'hidden'
            }else{
                if(this.param.substateId == '1'){
                    this.$refs.audstate.style.maxHeight = '270px'
                    this.$refs.audstate.style.overflow = 'hidden'
                }
            }
        },
        handleStateLeave(msg) {
            if(msg == 'sub'){
                this.$refs.substate.style.maxHeight = '0'
            }else{
                this.$refs.audstate.style.maxHeight = '0'
            }
        },
        handleChooseSub(i) {
            this.substate = this.subStateList[i].label
            this.isSubState = i
            this.param.substateId = this.subStateList[i].value
            if(this.substate == '已提交') {
                this.audState = '待审核'
                this.param.audstateId = '0'
            }else{
                this.audState = '请选择'
                this.param.audstateId = ''
            }
        },
        handleChooseAud(i) {
            this.audState = this.audStateList[i].label
            this.isAudState = i
            this.param.audstateId = this.audStateList[i].value
        },

        // 获取数据
        getAllTemplateList() {
            this.tableData = []
            if(!this.param.authorId) return this.$message.warning('请先选择设计师')
            var formData = new FormData()
            formData.append('pageIndex', this.page.currentPage);
            formData.append('startTime', this.startTime);
            formData.append('endTime', this.endTime);
            formData.append('producttypeid', this.param.typeId);
            formData.append('productcategory', this.param.productId);
            formData.append('issubmit', this.param.substateId);
            formData.append('isaud', this.param.audstateId);
            formData.append('userid', this.param.authorId);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/DesignerStatistics', formData, config).then(res => {
                if(res.data.Data == 'null') return console.log('没有数据')
                console.log(res.data)
                var data = res.data.Data || []
                var list = []
                for(var i=0;i<data.length;i++) {
                    var obj = {}
                    obj.type = data[i].ProductCategorieName + '/' + data[i].ProductTypeName
                    obj.authorId = data[i].AuthorId
                    obj.state = data[i].Status
                    obj.subTime = data[i].SubTime
                    if(data[i].SubTemplate) {
                        obj.text = data[i].SubTemplate.RefuseText
                    }else{
                        obj.text = ''
                    }
                    obj.faceUrl = data[i].FacePicture
                    obj.TemplateNumber = data[i].TemplateNumber
                    obj.ProductTypeId = data[i].TypeId
                    obj.tempName = data[i].Name
                    list[i] = obj
                }
                this.tableData = list
                this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
            })
        }
    },
    components: {
        HomePagination,
        TempSubmit
    }
}
</script>

<style lang="scss" scoped>
.all-template /deep/ .design-header .block-date{
    display: inline-block;
    .el-date-editor, .el-input__inner{
        width: 150px;
    }
    .el-input--prefix .el-input__inner{
        padding-left: 35px;
        padding-right: 0;
    }
}
.all-template{
    padding-left: 10px;
    .design-header{
        display: flex;
        flex-wrap: wrap;
        min-width: 1200px;
        line-height: 37px;
        padding: 20px 28px 19px 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        .type, .sub-status, .aud-status, .author{
            height: 37px;
            display: flex;
            font-size: 14px;
            margin-bottom: 15px;
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
    }
}

.all-template /deep/ .el-table{
    .cell{
        text-align: center;
    }
}
.all-template /deep/ .el-dialog{
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
