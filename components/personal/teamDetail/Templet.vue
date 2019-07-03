<template>
    <div id="master">
        <div class="master">
            <el-form :inline="true" class="form-inline">
                <el-form-item label="产品分类: ">
                    <el-select v-model="formInline.product" class="select">
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
            <div id="Loading" v-if="loading">
                <div class="loader-inner ball-beat">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div class="waterfall-list" ref="box">
                <div class="waterfall-item" v-for="(item,i) in list" :key="i">
                    <div class="waterfall-block">
                        <div class="waterfall-item-wrap" @click="handleUseMaster(item)">
                            <img @load="waterfall" class="image" :src="$store.state.port.imgBaseUrl + item.FacePicture + '?v=' + new Date().getTime()">
                            <div class="img-mask">
                                <div class="tooltip" data-tip="删除" @click.stop="handleCancelSetMaster(i)">
                                    <img class="delete-img" src="/img/personal/delete_icon.png" alt="">
                                </div>
                                <div class="item-set" @click.stop="handleModifyMaster(item)">修改母版</div>
                            </div>
                        </div>
                        <div class="waterfall-item-title">
                            <div class="title">
                                <!-- <div contenteditable="true" v-if="item.Name !== ''">{{item.Name}}</div> -->
                                <span style="width: 150px;min-width: 150px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-if="item.Name !== ''" :title="item.Name">{{item.Name}}</span>
                                <span v-else>未定义</span>
                            </div>
                            <div class="tips">
                                <span>{{item.ProductTypeName}}</span>
                                <span>{{item.AddTime.split('T',10)[0]}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            <div class="block" v-if="list.length && page.totalRecords > 24">
                <HomePagination :Page="page" @getTempList="getTempData" />
            </div>
            <div v-if="!loading && !list.length" class="to-create">
                <img src="/img/error/ku.png" alt="">
                <p>您的团队目前还没有通用模板</p>
                <div class="create-btn" @click="handleToDesign">立即创建</div>
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
                pageSize: 20,    // 每页个数
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
        // 瀑布流布局
        waterfall() {
            if(!this.$refs.box) return
            var box = this.$refs.box
            var items = box.children
            var gap = 20
            
            var pageWindex = box.offsetWidth;
            // var pageWindex = document.getElementById('record').offsetWidth
            var itemWidth = items[0].offsetWidth;
            var columns = parseInt(pageWindex / (itemWidth + gap));
            var arr = []
            for(var i=0;i<items.length;i++) {
                if(i<columns){
                    // 2- 确定第一行
                    items[i].style.top = 0;
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
                    items[i].style.top = arr[index] + gap + 'px';
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

        // 获取全部母版列表
        getTempData() {
            this.list = []
            this.loading = true
            let product;
            if(this.formInline.product == 0){
                product = '0'
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
            var url = '/UsersMasters?pageSize=' + this.page.pageSize + '&pageIndex=' + this.page.currentPage + '&ProductCategorieNum=' + product + '&ProductTypeId=' + '0' +'&type=' + 'ordinary' + `${this.endTime ? '&endTime=' + this.endTime : ''}` + `${this.startTime ? '&startTime=' + this.startTime : ''}`
            this.$axios.get(url).then(res => {
                console.log(res.data)
                if(res.data.Data.length == 0) this.loading = false
                this.list = res.data.Data
                this.loading = false
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
            })
            // var formData = new FormData()
            // formData.append('TeamNum', this.teamNum);
            // formData.append('pageIndex', this.page.currentPage);
            // formData.append('pageSize', this.page.pageSize)
            // formData.append('productcategory', product);
            // formData.append('startTime', this.startTime)
            // formData.append('endTime', this.endTime)
            // let config = {
            //     headers:{'Content-Type': 'multipart/form-data'}
            // }
            // this.$axios.post('/TeamMasters',formData,config).then(res => {
            //     console.log(res.data)
            //     if(res == undefined){
            //         this.loading = false
            //         return
            //     }
            //     if(res.data.Data.length == 0) this.loading = false
            //     this.list = res.data.Data
            //     this.loading = false
            //     this.page.totalRecords = res.data['X-Pagination'].TotalCount
            //     this.page.pageSize = Math.ceil(res.data['X-Pagination'].TotalCount / res.data['X-Pagination'].TotalPages)
            // })
        },
        // 修改母版 跳转到设计器
        handleModifyMaster(item) {
            let str = 'TemplateNumber=' + item.TemplateNumber
            str = window.btoa(str)
            var url = this.$router.resolve('/designer/' + str)
            window.open(url.href,'_blank')
        },
        // 使用母版 跳转到设计器
        handleUseMaster(item) {
            console.log(item)
            if (!localStorage['token']) return this.$store.commit('login/toggleShow', true)
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
                str = window.btoa(str)
                url.location = '/designer/' + str
            })
        },
        // 取消设置团队母版
        handleCancelSetMaster(index) {
            this.$confirm('是否取消该母版?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var formData = new FormData(); 
                formData.append("TeamNum", this.teamNum);
                formData.append("TemplateNum", this.list[index].TemplateNumber);
                this.$axios.delete('/TeamMaster',{data: formData})
                .then(res => {
                    // console.log(res.data)
                    if(res.data = 'Success') {
                        this.$message({type: 'success',message: '删除成功!'});
                        this.list.splice(index,1)
                        this.page.totalRecords = this.page.totalRecords - 1
                        if(this.list.length == 0 && this.page.currentPage > 1) {
                            this.page.currentPage -= 1
                            this.getTempData()
                        }
                    }else{
                        this.$message.error('删除失败')
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
        handleToDesign() {
            this.$router.push('/personal/record')
        }
    },
    mounted() {
        this.teamNum = localStorage['teamNum']
        this.$axios.get('/ProductCategories').then(res => {
            console.log(res.data)
            this.productList = res.data
        })
        this.getTempData()
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

.create-btn{
    background: $color;
    color: rgba(255,255,255,1);
    width: 98px;
    height: 42px;
    line-height: 42px;
    border-radius: 5px;
    margin: 0 auto;
    cursor: pointer;
}


</style>
