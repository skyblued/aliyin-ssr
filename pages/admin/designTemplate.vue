<template>
    <div class="design-template">
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
            <div class="author">
                <span class="text">设计师: </span>
                <span class="selected" @mouseenter="handleAuthor" @mouseleave="handleAuthorLeave">
                    <span style="padding-left: 18px;">{{author}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="author">
                        <li :class="{active: isAuthor == null}" @click="handleAll">全部</li>
                        <li :class="{active: isAuthor == i}" v-for="(item,i) in authorList" :key="i" @click="handleChooseAuthor(i)">
                            {{item.TrueName ? item.TrueName : item.UserName}}
                            <span v-if="item.DesignerStatus == '-2'" style="color: red">(冻结)</span>
                        </li>
                    </ul>
                </span>
            </div>
            <div class="search-btn" @click="getAllTemplate">搜索</div>
        </div>
        <div id="loading" v-if="loading">
            <div class="loader-inner ball-beat">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="design-content" v-if="tableData.length">
            <el-table
                :data="tableData">
                <el-table-column
                    label="编号"
                    prop="TemplateNumber">
                </el-table-column>
                <el-table-column
                    label="封面">
                    <template slot-scope="scope">
                        <div class="temp-thumb" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+scope.row.faceUrl + '?v=' + new Date().getTime()})`}"></div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="产品类型"
                    prop="type">
                </el-table-column>
                <el-table-column
                    label="所属分类"
                    prop="classify">
                </el-table-column>
                <el-table-column
                    label="模板作者"
                    prop="author">
                </el-table-column>
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.addTime">{{scope.row.addTime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="模板状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == '-1'">未提交</span>
                        <span v-else-if="scope.row.state == '1'" style="color: #008000">通过审核</span>
                        <span v-else-if="scope.row.state == '-1'" style="color: red">审核不通过</span>
                        <span v-else>审核中</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="提交时间">
                    <template slot-scope="scope">
                        <span class="subtime" v-if="scope.row.subTime">{{scope.row.subTime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleSee(scope.$index)">查看</el-button>
                        <el-button v-if="scope.row.state == '-1'" type="success" @click.stop="handleSubmit(scope.row)">提交</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="提交模板" :visible.sync="$store.state.dialogSubmit" :close-on-click-modal="false" :modal-append-to-body="false" :lock-scroll="false" top="10vh">
                <temp-submit v-if="$store.state.dialogSubmit" :ProductTypeId="ProductTypeId" :TemplateNumber="TemplateNumber" :faceImg="faceImg" @getRecord="getAllTemplate"></temp-submit>
            </el-dialog>
        </div>

        <div class="block" v-if="tableData.length && page.totalRecords > 20">
            <HomePagination :Page="page" @getTempList="getAllTemplate" />
        </div>
        <div class="blank" v-if="!tableData.length && !loading">
            <img src="/img/error/ku.png" alt="">
            <p>当前没有模板数据</p>
        </div>
    </div>
</template>

<script>
import TempSubmit from '@/components/designer/TempSubmit.vue'
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
            tableData: [],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
            loading: true,
            param: {
                typeId: '',
                productId: '',
                substateId: '',
                audstateId: '',
                authorId: ''
            },
            ProductTypeId: '',
            TemplateNumber: '',
            // tempNum: '',
            faceImg: '',
            authorList: [],
            author: '',
            isAuthor: null,
        }
    },
    methods: {
        getProduct() {
            this.$axios.get('/admin/products').then(res => {
                // console.log(res.data)
                this.productList = res.data
            })
        },
        // 打开提交模板
        handleSubmit(row) {
            console.log(row)
            this.ProductTypeId = row.ProductTypeId
            this.TemplateNumber = row.TemplateNumber
            this.faceImg = row.faceUrl
            this.$store.commit('setDialogSubmit', true)
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
        handleAuthor() {
            this.$refs.author.style.maxHeight = '270px'
            this.$refs.author.style.overflowY = 'auto'
        },
        handleAuthorLeave() {
            this.$refs.author.style.maxHeight = '0'
        },
        getAuthor() {  // 获取设计师列表
            this.$axios.get('/DesignerStatistics').then(res => {
                // console.log(res.data)
                this.authorList = res.data
            })
        },
        handleAll() {
            this.isAuthor = null
            this.author = '全部'
            this.param.authorId = '0'
        },
        handleChooseAuthor(i) {  // 选择设计师
            this.isAuthor = i
            this.author = this.authorList[i].TrueName || this.authorList[i].UserName
            this.param.authorId = this.authorList[i].UserID
        },

        // 获取所有设计模板
        getAllTemplate() {
            this.tableData = []
            this.loading = true
            var formData = new FormData()
            formData.append('pageIndex', this.page.currentPage);
            formData.append('startTime', '');
            formData.append('endTime', '');
            formData.append('producttypeid', this.param.typeId);
            formData.append('productcategory', this.param.productId);
            formData.append('issubmit', this.param.substateId);
            formData.append('isaud', this.param.audstateId);
            formData.append('DesignerId', this.param.authorId)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/DesignersTemplates', formData, config).then(res => {
                console.log(res.data)
                if(res.data.state == 'no') {
                    this.$message.warning('你还不是管理员')
                    this.loading = false
                    return
                }
                var data = res.data.Data
                if(data.length == 0 || data == null) {
                    this.loading = false
                    this.tableData = []
                }
                var list = []
                for(var i=0;i<data.length;i++) {
                    var obj = {}
                    obj.faceUrl = data[i].FacePicture
                    obj.type = data[i].ProductCategorieName
                    obj.classify = data[i].ProductTypeName
                    obj.author = data[i].Author
                    obj.addTime = data[i].AddTime
                    obj.state = data[i].Status
                    obj.subTime = data[i].SubTime
                    obj.TemplateNumber = data[i].TemplateNumber
                    obj.ProductTypeId = data[i].TypeId
                    obj.tempName = data[i].Name
                    list[i] = obj
                }
                this.tableData = list
                if(this.tableData.length > 0) this.loading = false
                this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
            })
        },
        handleSee(index) {
            let str = 'TemplateNumber=' + this.tableData[index].TemplateNumber + '&admin=admin'
            str = window.btoa(str)
            window.open('/design/'+ str)
        }
    },
    mounted() {
        this.getProduct()
        this.getAllTemplate()
        this.getAuthor()
    },
    components: {
        HomePagination,
        TempSubmit
    }
}
</script>

<style lang="scss" scoped>
.design-template{
    padding-left: 10px;
    .design-header{
        display: flex;
        min-width: 1200px;
        line-height: 37px;
        padding: 20px 28px 19px 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        .type, .sub-status, .aud-status, .author{
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
    .blank{
        text-align: center;
        margin: 200px auto 0;
    }
}

.design-template /deep/ .design-content .el-table td{
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
        .subtime, .auditTime{
            display: inline-block;
            width: 90px;
        }
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

.design-template /deep/ .el-dialog{
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

#loading{
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 1000;
}
</style>
