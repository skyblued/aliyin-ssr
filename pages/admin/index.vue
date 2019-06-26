<template>
    <div class="template-audit">
        <div class="audit-header">
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
            <el-date-picker
                style="height: 37px;margin-right: 15px;"
                v-model="date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                @change="handleDate">
            </el-date-picker>
            <div class="search-btn" @click="getTemplateList">搜索</div>
        </div>
        <div id="loading" v-if="loading">
            <div class="loader-inner ball-beat">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="audit-content" v-if="tableData.length">
            <el-table
                :data="tableData">
                <el-table-column
                    label="封面">
                    <template slot-scope="scope">
                        <div class="temp-thumb" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+scope.row.faceUrl + '?v=' + new Date().getTime()})`}"></div>
                        <p>{{scope.row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="产品类型">
                </el-table-column>
                <!-- <el-table-column
                    label="专题"
                    prop="subject">
                </el-table-column> -->
                <el-table-column
                    label="关键词"
                    prop="keyword">
                </el-table-column>
                <el-table-column
                    label="设计师"
                    prop="designer">
                </el-table-column>
                <el-table-column
                    label="提交时间"
                    min-width="90">
                    <template slot-scope="scope">
                        <span class="subtime" v-if="scope.row.subtime">{{scope.row.subtime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == '0'" style="color: #333">待审核</span>
                        <span v-else-if="scope.row.status == '1'" style="color: #008000">审核通过</span>
                        <span v-else style="color: red">审核失败</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核时间"
                    min-width="90">
                    <template slot-scope="scope">
                        <span class="auditTime" v-if="scope.row.auditTime">{{scope.row.auditTime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核备注"
                    prop="text">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.status != '1'" @click="handleSee(scope.$index)">查看</el-button>
                        <el-button type="success" v-if="scope.row.status != '1'" @click="handleAudit(scope.$index)">审核</el-button>
                        <el-button type="danger" v-if="scope.row.status == '0'" @click="handleOpenRefuse(scope.$index)">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog
                title="模板审核"
                :visible.sync="dialogPassTemp"
                :lock-scroll="false"
                width="20%">
                <span>审核通过给设计师对应模板上传报酬</span>
                <div class="reward">
                    <!-- <div style="margin-top: 10px;">默认积分: {{points}}</div> -->
                    <div class="reward-form">
                        <span>分红积分: </span>
                        <el-input v-model="reward" type="number" min="1" :max="points"></el-input>
                    </div>
                    <div class="temp-btn" @click="handlePass">通过</div>
                </div>
            </el-dialog>
            <el-dialog
                title="拒绝申请"
                :visible.sync="dialogRefuseTemp"
                :lock-scroll="false"
                width="20%">
                <span>如果设计师上传的模板不符合规范，可以拒绝要求重新上传</span>
                <div class="reward">
                    <div class="reward-form">
                        <span>拒绝理由: </span>
                        <el-input type="textarea" :rows="2" v-model="textarea"></el-input>
                    </div>
                    <div class="temp-btn" @click="handleRefuse">确定拒绝</div>
                </div>
            </el-dialog>
            <!-- <div class="batch-del">批量删除</div> -->
        </div>

        <div class="block" v-if="tableData.length && page.totalRecords > 20">
            <HomePagination :Page="page" @getTempList="getTemplateList" />
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
                label: '待审核'
            },{
                value: '1',
                label: '审核通过'
            },{
                value: '-1',
                label: '审核失败'
            }],
            state: '全部',
            isState: '0',
            tableData: [],
            dialogPassTemp: false,
            reward: null,
            dialogRefuseTemp: false,
            textarea: '',
            auditId: '',
            param: {
                productId: '0',
                productTypeId: '0',
                stateId: '',
                authorId: '0',
                startTime: '',
                endTime: ''
            },
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
            loading: true,
            points: null,
            author: '全部',
            isAuthor: null,
            authorList: [],
            date: ''
        }
    },
    methods: {
        // 打开模板审核弹框
        handleAudit(index) {
            this.dialogPassTemp = true
            this.reward = this.points = this.tableData[index].points
            this.auditId = this.tableData[index].id
        },
        setAudit(type) {
            var formData = new FormData()
            formData.append('action', type);
            formData.append('subid', this.auditId);
            formData.append('price', this.reward);
            formData.append('remark', this.textarea);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.put('AuditTemplate', formData, config).then(res => {
                if(type == 'audit') {
                    console.log(res.data)
                    if(res.data.status = 'true') {
                        this.dialogPassTemp = false
                        this.reward = ''
                        this.$message.success(res.data.msg)
                        this.getTemplateList()
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }else{
                    console.log(res.data)
                    if(res.data.status = 'true') {
                        this.dialogRefuseTemp = false
                        this.textarea = ''
                        this.$message.success(res.data.msg)
                        this.getTemplateList()
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }
            })
        },
        handlePass() {  // 通过审核
            // if(this.reward == null) return this.$message.warning('请填写分红积分')
            if(this.reward > this.points || this.reward < 1) {
                this.$message.warning('填写的积分不能大于默认积分且不能小于1,请重新填写')    
                return
            }
            this.setAudit('audit')
        },
        handleOpenRefuse(index) {  // 打开拒绝审核弹框
            this.dialogRefuseTemp = true
            this.auditId = this.tableData[index].id
        },
        handleRefuse() {  // 拒绝审核
            if(!this.textarea) return this.$message.warning('请填写拒绝理由')
            this.setAudit('refuse')
        },
        handleSee(index) {
            let str = 'TemplateNumber=' + this.tableData[index].number + '&admin=admin' + '&id=' + this.tableData[index].id
            str = window.btoa(str)
            window.open('/designer/'+ str)
        },

        getProduct() {
            this.$axios.get('/admin/products').then(res => {
                // console.log(res.data)
                this.productList = res.data
            })
        },

        handleEnter(type) {
            if(type == 'type'){
                this.$refs.list.style.maxHeight = '270px'
                this.$refs.list.style.overflow = 'hidden'
            }else{
                this.$refs.state.style.maxHeight = '270px'
                this.$refs.state.style.overflow = 'hidden'
            }
        },
        handleLeave(type) {
            if(type == 'type'){
                this.$refs.list.style.maxHeight = '0'
            }else{
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
                this.param.productId = this.productList[i].ClassNum
                this.param.productTypeId = '0'
                this.isActive = null
                this.productType = '全部'
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
            // this.designState = this.authorList[i].DesignerStatus
            // this.tableData = []
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

        // 获取可审核模板数据
        getTemplateList() {
            this.tableData = []
            this.loading = true
            var formData = new FormData()
            formData.append('ProductType', this.param.productTypeId);
            formData.append('ProductCategories', this.param.productId);
            formData.append('Starus', this.param.stateId);
            formData.append('PageSize', this.page.pageSize);
            formData.append('PageIndex', this.page.currentPage);
            formData.append('StartTime', this.param.startTime);
            formData.append('EndTime', this.param.endTime);
            formData.append('DesignerId', this.param.authorId);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/AuditTemplate', formData, config).then(res => {
                // if(res.data.Data.length == 0) return this.tableData = []
                console.log(res.data)
                if(res.data.state == 'no') {
                    this.$message.warning(res.data.Data)
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
                    obj.id = data[i].ID
                    obj.name = data[i].TemplateName
                    obj.number = data[i].TemplateNum
                    obj.faceUrl = data[i].FacePicture
                    obj.type = data[i].ProductCategorie.ClassName + '/' + data[i].ProductType.TypeName
                    obj.subject = data[i].StrThematic
                    obj.keyword = data[i].Keywords
                    obj.designer = data[i].User.Apply && data[i].User.Apply.TrueName || data[i].User.NickName || data[i].User.UserName || data[i].User.Phone
                    obj.subtime = data[i].SubmitTime
                    obj.status = data[i].Starus
                    obj.auditTime = data[i].AuditingTime
                    obj.text = data[i].RefuseText
                    obj.points = data[i].ProductType.RebateAmount
                    list[i] = obj
                }
                this.tableData = list
                if(this.tableData.length > 0) this.loading = false
                this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
            })
        }
    },
    mounted() {
        this.getProduct()
        this.getTemplateList()
        this.getAuthor()
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>
.template-audit{
    padding-left: 10px;
    // overflow-x: auto;
    .audit-header{
        display: flex;
        flex-wrap: wrap;
        min-width: 1200px;
        line-height: 37px;
        padding: 20px 28px 19px 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        .type, .status, .author{
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
    .audit-content{
        min-width: 1200px;
    }
    .blank{
        text-align: center;
        margin: 200px auto 0;
    }
}
.template-audit /deep/ .audit-content .el-table td{
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
            width: 86px;
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
.template-audit /deep/ .el-dialog{
    border-radius: 10px;
    .el-dialog__header{
        padding: 25px 20px 0;
        line-height: 21px;
        font-size:23px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(51,51,51,1);
        position: relative;
        text-align: center;
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
        .reward{
            .reward-form{
                display: flex;
                line-height: 37px;
                margin: 20px 0;
                span{
                    display: inline-block;
                    min-width: 76px;
                }
                .el-input{
                    display: inline-block;
                }
                .el-input__inner{
                    display: inline-block;
                    height: 37px;
                }
            }
            .temp-btn{
                width: 98px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                background: $color;
                border-radius: 5px;
                color: rgba(255,255,255,1);
                margin: 0 auto;
                cursor: pointer;
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
