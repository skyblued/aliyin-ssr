<template>
    <div class="material-audit">
        <div class="audit-header">
            <div class="type">
                <span class="text">素材类型: </span>
                <span class="selected">
                    <span style="padding-left: 18px;">{{material}}</span>
                    <span class="select-icon"></span>
                    <ul class="list">
                        <li :class="{active: activeIndex == null}" @click="handleChoose('null')">全部素材</li>
                        <li :class="{active: activeIndex == i}" v-for="(item,i) in materialList" :key="i" @click="handleChoose(i)">{{item.TypeName}}</li>
                    </ul>
                </span>
            </div>
            <div class="classify">
                <span class="text">素材分类: </span>
                <span class="selected">
                    <span style="padding-left: 18px;">{{materialType}}</span>
                    <span class="select-icon"></span>
                    <ul class="list">
                        <li :class="{active: isActive == null}" @click="handleChooseClassify('null')">全部分类</li>
                        <li :class="{active: isActive == i}" v-for="(item,i) in materialTypeList" :key="i" @click="handleChooseClassify(i)">{{item.TypeCategoryName}}</li>
                    </ul>
                </span>
            </div>
            <div class="state">
                <span class="text">状态: </span>
                <span class="selected" style="width: 118px;" @mouseleave="leave" @mouseenter="enter">
                    <span style="padding-left: 18px;">{{state}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="list">
                        <li :class="{active: isState == i}" v-for="(item,i) in stateList" :key="i" @click="handleChooseState(i)">{{item.label}}</li>
                    </ul>
                </span>
            </div>
            <div class="search-btn" @click="getMaterialList">搜索</div>
        </div>

        <div class="audit-content">
            <el-table
                :data="tableData">
                <el-table-column
                    label="缩略图">
                    <template slot-scope="scope">
                        <div class="temp-thumb" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+scope.row.thumb})`}"></div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="素材分类"
                    prop="type">
                </el-table-column>
                <el-table-column
                    label="关键词"
                    prop="keyword">
                </el-table-column>
                <el-table-column
                    label="设计师"
                    prop="designer">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == '0'">待审核</span>
                        <span v-else-if="scope.row.state == '1'" style="color: #008000">审核通过</span>
                        <span v-else style="color: red">审核失败</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="提交时间">
                    <template slot-scope="scope">
                        <span class="subtime" v-if="scope.row.subTime">{{scope.row.subTime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核时间">
                    <template slot-scope="scope">
                        <span class="subtime" v-if="scope.row.auditTime">{{scope.row.auditTime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核备注"
                    prop="text">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.state != '1'" @click="handleSee(scope.$index)">查看</el-button>
                        <el-button type="success" v-if="scope.row.state != '1'" @click="handleOpenAudit(scope.$index)">审核</el-button>
                        <el-button type="danger" v-if="scope.row.state == '0'" @click="handleOpenRefuse(scope.$index)">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                class="dialog-image"
                top="10vh"
                :lock-scroll="false"
                :show-close="false"
                :visible.sync="dialogSeeMaterial">
                <img width="100%" :src="$store.state.port.imgBaseUrl + dialogImage" alt="">
                <div class="close-btn" style="top: 0px;right: -50px;" @click="dialogSeeMaterial = false"></div>
            </el-dialog>
            <el-dialog
                title="素材审核"
                :lock-scroll="false"
                :show-close="false"
                :visible.sync="dialogPassMaterial"
                width="20%">
                <span>审核通过给设计师对应素材上传报酬</span>
                <div class="reward">
                    <!-- <div style="margin-top: 10px;">默认积分: {{points}}</div> -->
                    <div class="reward-form">
                        <span>分红积分: </span>
                        <el-input v-model="reward" type="number" min="0" :max="points"></el-input>
                    </div>
                    <div class="temp-btn" @click="handleAudit">通过</div>
                </div>
                <div class="close-btn" style="top: 0px;right: -50px;" @click="dialogPassMaterial = false"></div>
            </el-dialog>
            <el-dialog
                title="拒绝申请"
                :lock-scroll="false"
                :show-close="false"
                :visible.sync="dialogRefuseMaterial"
                width="20%">
                <span>如果设计师上传的素材不符合规范，可以拒绝要求重新上传</span>
                <div class="reward">
                    <div class="reward-form">
                        <span>拒绝理由: </span>
                        <el-input type="textarea" :rows="2" v-model="textarea"></el-input>
                    </div>
                    <div class="temp-btn" @click="handleRefuse">确定拒绝</div>
                </div>
                <div class="close-btn" style="top: 0px;right: -50px;" @click="dialogRefuseMaterial = false"></div>
            </el-dialog>
        </div>

        <div class="block" v-if="tableData.length && page.totalRecords > 20">
            <HomePagination :Page="page" @getTempList="getMaterialList" />
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            material: '全部素材',
            activeIndex: null,
            materialList: [],
            materialType: '请先选择上级',
            materialTypeList: [],
            isActive: null,
            state: '全部',
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
            isState: '',
            tableData: [],
            dialogPassMaterial: false,
            reward: null,
            points: null,
            textarea: '',
            dialogRefuseMaterial: false,
            dialogSeeMaterial: false,
            dialogImage: '',
            param: {
                materialId: '0',
                materialTypeId: '0',
                stateId: ''
            },
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
            auditId: ''
        }
    },
    methods: {
        getMaterial() {
            this.$axios.get(this.$store.state.port.MaterialTypes).then(res => {
                console.log(res.data)
                this.materialList = res.data
            })
        },
        handleChoose(i) {
            if (i == 'null') {
                this.material = '全部素材'
                this.activeIndex = null
                this.materialTypeList = []
                this.materialType = '请先选择上级'
                this.param.materialId = '0'
                this.param.materialTypeId = '0'
            } else {
                this.material = this.materialList[i].TypeName
                this.activeIndex = i
                this.param.materialId = this.materialList[i].Num
                var num = this.materialList[i].Num
                this.$axios.get(this.$store.state.port.MaterialCategories+'?TypeNum='+num).then(res => {
                    console.log(res.data)
                    this.materialTypeList = res.data
                    this.materialType = '全部分类'
                    this.isActive = null
                    this.param.materialTypeId = '0'
                })
            }
        },
        handleChooseClassify(i) {
            if(i == 'null') {
                this.materialType = '全部产品'
                this.isActive = null
                this.param.materialTypeId = '0'
            }else{
                this.isActive = i
                this.materialType = this.materialTypeList[i].TypeCategoryName
                this.param.materialTypeId = this.materialTypeList[i].Num
            }
        },
        handleChooseState(i) {
            this.isState = i
            this.state = this.stateList[i].label
            this.param.stateId = this.stateList[i].value
        },
        leave() {
            this.$refs.list.style.maxHeight = '0'
        },
        enter() {
            this.$refs.list.style.maxHeight = '270px'
            this.$refs.list.style.overflow = 'hidden'
        },

        getMaterialList() {  // 获取审核素材列表
            var url = '/AuditMaterials?Type=' + this.param.materialTypeId + '&Categories=' + this.param.materialId + '&Status=' + this.param.stateId + '&PageSize=' + this.page.pageSize +'&PageIndex=' + this.page.currentPage
            this.$axios.get(url).then(res => {
                console.log(res.data)
                if(res.data.status == 'no') {
                    this.$message.warning(res.data.msg)
                    return
                }
                var data = res.data.Data
                var list = []
                for(var i=0;i<data.length;i++) {
                    var obj = {}
                    obj.id = data[i].ID
                    if(data[i].Material != null){
                        obj.thumb = data[i].Material.FilePath
                    }
                    obj.type = data[i].Type.TypeName + '/' + data[i].TypeCategories.TypeCategoryName
                    obj.keyword = data[i].Keywords
                    // obj.designer = data[i].User.NickName || data[i].User.UserName || data[i].User.Phone
                    obj.designer = data[i].UserName
                    obj.state = data[i].Status
                    obj.subTime = data[i].SubmitTime
                    obj.auditTime = data[i].AuditingTime
                    obj.text = data[i].RefuseText
                    obj.points = data[i].Type.RebateAmount
                    list[i] = obj
                }
                this.tableData = list
                this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
            })
        },
        handleOpenAudit(index) {  // 打开审核
            this.dialogPassMaterial = true
            this.reward = this.points = this.tableData[index].points
            this.auditId = this.tableData[index].id
            // console.log(this.auditId)
        },
        handleAudit() {  // 通过审核
            // if(!this.reward) return this.$message.warning('请填写分红积分')
            if(this.reward > this.points || this.reward < 0) {
                this.$message.warning('填写的积分不能大于默认积分且不能小于0,请重新填写')
                return
            }
            var formData = new FormData()
            formData.append('action', 'audit');
            formData.append('subid', this.auditId);
            formData.append('price', this.reward);
            formData.append('remark', '');
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('AuditMaterials', formData, config).then(res => {
                console.log(res.data)
                if(res.data.status = 'true') {
                    this.dialogPassMaterial = false
                    this.reward = ''
                    this.$message.success(res.data.msg)
                    this.getMaterialList()
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleOpenRefuse(index) {
            this.dialogRefuseMaterial = true
            this.auditId = this.tableData[index].id
        },
        handleRefuse() {  // 拒绝素材
            if(!this.textarea) return this.$message.warning('请填写拒绝理由')
            var formData = new FormData()
            formData.append('action', 'refuse');
            formData.append('subid', this.auditId);
            formData.append('price', '');
            formData.append('remark', this.textarea);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('AuditMaterials', formData, config).then(res => {
                console.log(res.data)
                if(res.data.status = 'true') {
                    this.dialogRefuseMaterial = false
                    this.textarea = ''
                    this.$message.success(res.data.msg)
                    this.getMaterialList()
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleSee(index) {
            this.dialogSeeMaterial = true
            this.dialogImage = this.tableData[index].thumb
            // this.$nextTick(() => {
            //     var img = document.getElementById('img')
            //     var body = document.querySelector('.el-dialog__body')
            //     body.style.height = '100%'
            //     if(body.offsetHeight > '800') {
            //         body.style.height = '800px'
            //         body.style.overflowY = 'auto'
            //     }
            // })
        }
    },
    mounted() {
        this.getMaterial()
        this.getMaterialList()
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>
.material-audit{
    padding-left: 10px;
    .audit-header{
        display: flex;
        min-width: 1200px;
        line-height: 37px;
        padding: 20px 28px 19px 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        .type .selected:hover .list, .classify .selected:hover .list{
            max-height: 270px;
            overflow-y: auto;
        }
        .type, .classify, .state{
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
    .audit-content{
        min-width: 1200px;
        height: auto;
    }
}

.material-audit /deep/ .audit-content .el-table {
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
}
// .material-audit /deep/ .dialog-image .el-dialog__body{
//     margin: 0 50px;
//     padding: 0;
//     padding-bottom: 50px;
//     // overflow-y: auto;
//     &::-webkit-scrollbar{
//         display: none;
//     }
// }
.material-audit /deep/ .dialog-image .el-dialog .el-dialog__header{
    padding: 0;
}

.material-audit /deep/ .el-dialog{
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
</style>
