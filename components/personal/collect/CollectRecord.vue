<template>
    <div id="collect">
        <div class="collect">
            <el-form :inline="true" class="form-inline">
                <el-form-item label="产品分类: ">
                    <el-select v-model="formInline.product" clearable class="select">
                        <el-option label="全部" value="0"></el-option>
                        <el-option v-for="(item,index) in productList" :key="index" :label="item.ClassName" :value="item.ClassNum"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收藏时间: " class="form-item">
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
                <div class="screen" @click="getCollect">筛选</div>
            </el-form>
            <div class="waterfall-list" v-loading="loading">
                <div class="waterfall-item" v-for="(item,i) in list" :key="i">
                    <div class="waterfall-block">
                        <div class="waterfall-item-wrap">
                            <img class="image" :src="$store.state.port.imgBaseUrl+item.FacePicture">
                            <div class="img-mask">
                                <div class="tooltip" data-tip="取消" @click="open(i)">
                                    <img class="liketemplate" :src="$store.state.port.staticPath + '/img/home/collect_s_icon_hl.png'" alt="">
                                </div>
                                <div class="again" @click="handleJump(i)">立即制作</div>
                            </div>
                        </div>
                        <div class="waterfall-item-title">
                            <div class="title">
                                <!-- <div contenteditable="true" v-if="item.Name !== ''">{{item.Name}}</div> -->
                                <span v-if="item.Name !== ''">{{item.Name}}</span>
                                <span v-else>未定义</span>
                            </div>
                            <div class="tips">
                                <span>{{item.ProductTypeName}}</span>
                                <span>{{item.AddTime | ToSplit}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            <div class="block" v-if="list.length">
                <HomePagination :Page="page" @getTempList="getCollect" />
            </div>
            <div v-if="show || !list.length" class="to-create">
                <p>您还没有收藏任何模板</p>
                <el-button type="primary" @click="handleToDesign">立即去收藏</el-button>
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
          startTime: '',
          endTime: ''
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
        // 没有收藏记录跳转到模板中心
        handleToDesign() {
            this.$router.push('/tempcenter')
        },

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.page.pageSize = val
            this.getCollect()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page.currentPage = val
            this.getCollect()
        },

        // 获取全部收藏记录列表
        getCollect() { 
            let pageIndex = this.page.currentPage
            let product;
            if(this.formInline.product == 0){
                product = 0
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

            var url = '/FavoritedTemplates?TeamNum=' + this.teamNum + '&pageIndex=' + pageIndex + '&productcategory=' + product + '&startTime=' + this.startTime + '&endTime=' + this.endTime
            this.$axios.get(url).then(res => {
                console.log(res.data)
                this.loading = false
                if(res.data.Data == null){
                    this.show = true
                    return 
                }
                this.list = res.data.Data
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
                this.page.pageSize = Math.ceil(res.data['X-Pagination'].TotalCount / res.data['X-Pagination'].TotalPages)
            })
        },
        // 取消收藏
        open(index) {
            console.log(this.list[index].TemplateNumber)
            this.$confirm('是否取消收藏该模板?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var formData = new FormData(); 
                formData.append("TeamNum", this.teamNum);
                formData.append("TemplateNumber", this.list[index].TemplateNumber);
                this.$axios.delete('/FavoritedTemplate',{data: formData}).then(res => {
                    // console.log(res)
                    if(res.data = 'true') {
                        this.$message({type: 'success',message: '取消收藏成功!'});
                        this.list.splice(index,1)
                        this.page.totalRecords = this.page.totalRecords - 1
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
        // 跳转到模板详情页
        handleJump(i) {
            //console.log(this.list[i].TemplateNumber)
            this.$router.push({path: '/detail', query: {t: this.list[i].TemplateNumber}})
        },
    },
    filters: {
        ToSplit(time) {
            if (!time) return
            time = time.split(' ')[0].replace(/\//ig, '-')
            return time
        }
    },
    mounted() {
        this.getCollect()
        this.$axios.get('/ProductCategories').then(res => {
            //console.log(res)
            this.productList = res.data
        })
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss">
#collect{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.collect{
    min-width: 1200px;
    margin: 0 auto;
    .waterfall-list .waterfall-item .img-mask .tooltip{
        line-height: 42px;
    }
    .block{
        margin-top: -20px;
    }
}

</style>

