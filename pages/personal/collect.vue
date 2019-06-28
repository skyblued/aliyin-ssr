<template>
    <div id="collect">
        <div class="collect">
            <el-form :inline="true" class="form-inline">
                <el-form-item label="产品分类: ">
                    <el-select v-model="formInline.product" clearable class="select">
                        <el-option label="全部场景" value="0"></el-option>
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
            <div id="Loading" v-if="loading">
                <div class="loader-inner ball-beat">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div class="waterfall-list" v-if="list.length" ref="box">
                <div class="waterfall-item" v-for="(item,i) in list" :key="i">
                    <div class="waterfall-block">
                        <div class="waterfall-item-wrap" @click="handleJump(item)">
                            <img @load="waterfall" class="image" :src="$store.state.port.imgBaseUrl+item.FacePicture">
                            <div class="img-mask">
                                <div class="tooltip" data-tip="取消" @click.stop="open(i)">
                                    <img class="liketemplate" src="/img/home/collect_s_icon_hl.png" alt="">
                                </div>
                                <!-- <div class="again" @click="handleJump(i)">立即制作</div> -->
                            </div>
                        </div>
                        <div class="waterfall-item-title">
                            <div class="title">
                                <!-- <div contenteditable="true" v-if="item.Name !== ''">{{item.Name}}</div> -->
                                <span v-if="item.Name !== ''" :title="item.Name">{{item.Name}}</span>
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
            <div class="block" v-if="list.length && page.totalRecords > 24">
                <HomePagination :Page="page" @getTempList="getCollect" />
            </div>
            <div v-if="!list.length && !loading" class="to-create">
                <img src="/img/error/ku.png" alt="">
                <p>您还没有收藏任何模板</p>
                <el-button class="to-collect" @click="handleToDesign">立即去收藏</el-button>
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
          product: '0',
          startTime: '',
          endTime: ''
        },
        list: [],
        page: {
            currentPage: 1,  // 当前页
            totalRecords: 0,   // 总条数
            pageSize: 24,    // 每页个数
        },
        teamNum: null,
        productList: [],
        startTime: '',
        endTime: '',
        loading: true,
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
        waterfall() {
            if(!this.$refs.box) return
            var box = this.$refs.box
            var items = box.children
            var gap = 20

            var pageWindex = box.offsetWidth;
            var itemWidth = items[0].offsetWidth;
            var columns = parseInt(pageWindex / (itemWidth + gap));
            var arr = []
            for(var i=0;i<items.length;i++) {
                if(i<columns){
                    // 2- 确定第一行
                    items[i].style.top = '25px';
                    items[i].style.left = (itemWidth + gap) * i + 'px';
                    arr.push(items[i].offsetHeight);
                } else {
                    // 其他行
                    // 3- 找到数组中最小高度  和 它的索引
                    var minHeight = arr[0];
                    var index = 0;
                    for (var j = 0; j < arr.length; j++) {
                        if (minHeight > arr[j]) {
                            minHeight = arr[j];
                            index = j;
                        }
                    }
                    // 4- 设置下一行的第一个盒子位置
                    // top值就是最小列的高度 + gap
                    items[i].style.top = arr[index] + gap + 25 + 'px';
                    // left值就是最小列距离左边的距离
                    items[i].style.left = items[index].offsetLeft + 'px';
                    // 5- 修改最小列的高度 
                    // 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
                    arr[index] = arr[index] + items[i].offsetHeight + gap;
                }
            }
            var max = Math.max.apply(null,arr)
            this.$refs.box.style.height = max + 100 + 'px';
        },



        // 没有收藏记录跳转到模板中心
        handleToDesign() {
            this.$router.push('/templateList')
        },

        // 获取全部收藏记录列表
        getCollect() { 
            this.list = []
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

            var url = '/FavoritedTemplates?TeamNum=' + this.teamNum + '&pageIndex=' + this.page.currentPage + '&productcategory=' + product + '&startTime=' + this.startTime + '&endTime=' + this.endTime + '&pageSize=' + this.page.pageSize
            this.$axios.get(url).then(res => {
                if(res.data.Data == null) {
                    this.loading = false
                    return console.log('没有数据')
                }
                console.log(res.data)
                if(res.data.Data.length == 0){
                    this.loading = false
                    this.$refs.box.style.height = '0'
                    return
                }
                this.list = res.data.Data
                this.loading = false
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
            })
        },
        // 取消收藏
        open(index) {
            console.log(this.list[index].TemplateNumber)
            this.$confirm('是否取消收藏该模板?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
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
        // 跳转到设计器
        handleJump(item) {
            var formData = new FormData()
            formData.append('TemplateNumber', item.TemplateNumber);
            formData.append('TeamNum', localStorage['teamNum']);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            var url = window.open('/designer', '_blank')
            this.$axios.post('/CopyTemplate', formData, config).then(res => {
                if(res.data == '') return console.log('没有返回')
                // console.log(res.data)
                let str = 'DocumentNumber=' + res.data
				str = window.btoa(str);
				url.location.replace('/designer/' + str)
            })
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
        this.teamNum = localStorage['teamNum']
        this.getCollect()
        this.$axios.get('/ProductCategories').then(res => {
            //console.log(res)
            this.productList = res.data
        })

        // 监听页面尺寸改变时触发
        window.onresize = (() => {
            this.waterfall()
        })
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>

#collect{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.collect{
    min-width: 960px;
    margin: 0 auto;
    .waterfall-list .waterfall-item .img-mask .tooltip{
        line-height: 42px;
    }
    .block{
        margin-top: -20px;
    }
    .to-collect{
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        background: $color;
        color: rgba(255,255,255,1);
        &:hover{
            background: $color;
            color: rgba(255,255,255,1);
        }
    }
}
.waterfall-item-title .title span{
    display: inline-block;
    width: 150px;
    min-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

