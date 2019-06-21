 <template>
    <div id="master">
        <div class="master">
            <el-form :inline="true" class="form-inline">
                <el-form-item label="产品分类: ">
                    <el-select v-model="formInline.product" clearable class="select">
                        <el-option label="全部" value="0"></el-option>
                        <el-option v-for="(item,index) in productList" :key="index" :label="item.ClassName" :value="item.ClassNum"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间: " class="form-item">
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
                <div class="screen" @click="getTempData">筛选</div>
            </el-form>
            <div class="waterfall-list" v-loading="loading">
                <div class="waterfall-item" v-for="(item,i) in list" :key="i">
                    <div class="waterfall-block">
                        <div class="waterfall-item-wrap">
                            <img class="image" :src="$store.state.port.imgBaseUrl+item.FacePicture">
                            <div class="img-mask">
                                <div class="tooltip" data-tip="取消" @click="handleCancelSetMaster(i)">
                                    <img class="delete-img" :src="$store.state.port.staticPath + '/img/personal/delete_icon.png'" alt="">
                                </div>
                                <div class="again" @click="handleUseMaster(item)">重新编辑</div>
                            </div>
                        </div>
                        <div class="waterfall-item-title">
                            <div class="title">
                                <!-- <div contenteditable="true" v-if="item.Name !== ''">{{item.Name}}</div> -->
                                <span v-if="item.Name !== ''">{{item.Name}}</span>
                                <span v-else>未定义</span>
                            </div>
                            <div class="tips">
                                <span>名片</span>
                                <span>{{item.AddTime.split('T',10)[0]}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            <div class="block" v-if="list.length">
                <HomePagination :Page="page" @getTempList="getTempData" />
            </div>
            <div v-if="show || !list.length" class="to-create">
                <p>您的团队目前还没有母版</p>
                <el-button type="primary" @click="handleToDesign">立即创建</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data() {
        return {
            formInline: {
            product: '',
            date: ''
            },
            list: [],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: null,    // 每页个数
            },
            teamNum: sessionStorage.getItem('teamNum'),
            productList: [],
            startTime: '',
            endTime: '',
            loading: true,
            show: false,
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
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.page.pageSize = val
            this.getTempData()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page.currentPage = val
            this.getTempData()
        },
        // 获取全部母版列表
        getTempData() {
            let product;
            if(this.formInline.product == 0){
                product = ''
            }else{
                product = this.formInline.product
            }
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.startTime = ''
                this.endTime = ''
            }else{
                this.startTime = this.formInline.startTime
                this.endTime = this.formInline.endTime
            }
            var formData = new FormData()
            formData.append('TeamNum', this.teamNum);
            formData.append('pageIndex', this.page.currentPage);
            formData.append('productcategory', product);
            formData.append('startTime', this.startTime)
            formData.append('endTime', this.endTime)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamMasters',formData,config).then(res => {
                //console.log(res.data)
                this.loading = false
                if(res == undefined){
                    this.show = true
                    return
                }
                this.list = res.data.Data
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
                this.page.pageSize = Math.ceil(res.data['X-Pagination'].TotalCount / res.data['X-Pagination'].TotalPages)
            })
        },
        // 使用母版 跳转到设计器
        handleUseMaster(item) {
            let str = 'DocumentNumber=' + item.DocumentNumber
            str = window.btoa(str)
            var url = this.$router.resolve('/designer/' + str)
            window.open(url.href,'_blank')
        },
        // 取消设置团队母版
        handleCancelSetMaster(index) {
            console.log(this.list[index].DocumentNumber)
            this.$confirm('是否取消该母版?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var formData = new FormData(); 
                formData.append("TeamNum", this.teamNum);
                formData.append("DocumentNum", this.list[index].DocumentNumber);
                this.$axios.put('/TeamMaster',formData).then(res => {
                    console.log(res)
                    if(res.data = 'true') {
                        this.$message({type: 'success',message: '取消成功!'});
                        this.list.splice(index,1)
                    }else{
                        this.$message({type: 'error',message: '取消失败!'});
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
        handleToDesign() {
            this.$router.push('/personal')
        }
    },
    mounted() {
        this.getTempData()
        this.$axios.get('/ProductCategories').then(res => {
            //console.log(res)
            this.productList = res.data
        })
    },
    watch: {
        teamNum() {
            console.log(this.teamNum)
        }
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>

#master{
    width: 100%;
    padding: 30px 0 45px;
    user-select: none;
}
.master{
    min-width: 960px;
    margin: 0 auto;
    .block{
        margin-top: -20px;
    }
    .form-inline{
        box-shadow: none;
        background: none;
        padding: 0;
        margin-bottom: 30px;
    }
}
.master /deep/ .el-input__inner{
    background:rgba(236,236,236,1);
}
</style>
