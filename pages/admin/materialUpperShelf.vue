<template>
    <div class="material-upper">
        <div class="upper-header">
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
            <div class="search-btn" @click="getUpperMaterial">搜索</div>
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
                v-loading="loading"
                :data="tableData">
                <el-table-column
                    label="缩略图">
                    <template slot-scope="scope">
                        <div class="temp-thumb" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+scope.row.thumb})`}"></div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="素材类型"
                    prop=type>
                </el-table-column>
                <el-table-column
                    label="设计师"
                    prop="designer">
                </el-table-column>
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span class="subtime" v-if="scope.row.addTime">{{scope.row.addTime.split('T').join(' ')}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="关键词">
                    <template slot-scope="scope">
                        <span class="keyword" :title="scope.row.keyword">{{scope.row.keyword}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope"> 
                        <span v-if="scope.row.status == '0'">未上架</span>
                        <span v-else style="color: #008000">已上架</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleSee(scope.$index)">查看</el-button>
                        <el-button type="success" v-if="scope.row.status == '0'" @click="handleUpper(scope.$index)">上架</el-button>
                        <el-button type="danger" v-if="scope.row.status == '1'" @click="handleLower(scope.$index)">下架</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog
                class="dialog-image"
                top="10vh"
                :visible.sync="dialogSeeMaterial">
                <img width="100%" :src="$store.state.port.imgBaseUrl + dialogImage" alt="">
            </el-dialog>
        </div>

        <div class="block" v-if="tableData.length && page.totalRecords > 20">
            <HomePagination :Page="page" @getTempList="getUpperMaterial" />
        </div>
        <div class="blank" v-if="!tableData.length && !loading">
            <img src="/img/error/ku.png" alt="">
            <p>当前没有素材数据</p>
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
                label: '未上架'
            },{
                value: '1',
                label: '已上架'
            }],
            isState: '',
            tableData: [],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
            dialogSeeMaterial: false,
            dialogImage: '',
            param: {
                materialId: '0',
                materialTypeId: '0',
                stateId: ''
            },
            loading: true
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

        // 获取可上架素材列表
        getUpperMaterial() {
            this.tableData = []
            this.loading = true
            var url = '/UpperShelfMaterials?Type=' + this.param.materialId + '&Categories=' + this.param.materialTypeId + '&Status=' + this.param.stateId + '&PageSize=' + this.page.pageSize + '&PageIndex=' + this.page.currentPage
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
                    obj.thumb = data[i].FilePath
                    obj.type = data[i].TypeName + '/' + data[i].TypeCategoryName
                    obj.designer = data[i].UserName
                    obj.addTime = data[i].AddTime
                    obj.keyword = data[i].KeyWords
                    obj.status = data[i].IsUpperShelf
                    obj.num = data[i].Num
                    list[i] = obj
                }
                this.tableData = list
                if(this.tableData.length > 0) this.loading = false
                this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
            })
        },

        upper(index, type) {  // 上架、下架
            let num = this.tableData[index].num
            var formData = new FormData()
            formData.append('action', type);
            formData.append('materialnum', num);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/UpperShelfMaterials', formData,config).then(res => {
                console.log(res.data)
                if(res.data.state == 'ok') {
                    this.$message.success(res.data.msg)
                    this.getUpperMaterial()
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
        handleSee(index) {  // 查看
            this.dialogSeeMaterial = true
            this.dialogImage = this.tableData[index].thumb
        }   
    },
    mounted() {
        this.getMaterial()
        this.getUpperMaterial()
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>
.material-upper{
    padding-left: 10px;
    .upper-header{
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
    .blank{
        text-align: center;
        margin: 200px auto 0;
    }
}

.material-upper /deep/ .upper-content .el-table td{
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
        .keyword{
            display: inline-block;
            height: 46px;
            overflow: hidden;
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

.material-upper /deep/ .el-dialog{
    border-radius: 10px;
    .el-dialog__header{
        padding: 0;
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
}

#loading{
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 1000;
}
</style>
