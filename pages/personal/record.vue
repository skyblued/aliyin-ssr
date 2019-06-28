<template>
    <div id="record">
        <div class="record">
            <el-form :inline="true" class="form-inline" :style="{width: headerWidth}">
                <el-form-item label="产品分类: ">
                    <el-select v-model="formInline.product" clearable class="select">
                        <el-option label="全部" value="0"></el-option>
                        <el-option v-for="(item,index) in productList" :key="index" :label="item.ClassName" :value="item.ClassNum"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设计时间: " class="form-item">
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
            <transition name="el-zoom-in-top">
                <div class="waterfall-list" ref="box" v-if="list.length" style="height: 300px;">
                    <div class="waterfall-item" v-for="(item,i) in list" :key="i">
                        <div class="waterfall-block">
                            <div class="waterfall-item-wrap" @click="handleJump(item,i)">
                                <div v-if="item.FacePicture == ''" style="width: 100%;height: 165px;background: rgba(255,255,255,1);border-radius: 10px 10px 0 0;"></div>
                                <img @load="waterfall" class="image" :src="$store.state.port.imgBaseUrl+item.FacePicture + '?v=' + new Date().getTime()" alt="">
                                <div class="img-mask">
                                    <span v-if="item.MasterDocument == '0'" class="item-set" @click.stop="handleCopy(i, '1')">设为通用模板</span>
                                    <div class="tooltip" data-tip="复制" @click.stop="handleCopy(i, '0')">
                                        <i class="copy-img"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="waterfall-item-title">
                                <div class="title">
                                    <div v-if="item.Status" :title="item.Name" class="template-title" @click="handleClick(item)">{{item.Name}}</div>
                                    <el-input v-else type="text" v-model="name" id="test" class="edit-title" @blur="handleBlur(item)" @focus="select()" ref="input" @keydown.native="handleEditName($event,item)"></el-input>
                                    <i class="delete" title="删除"  @click.stop="open(i)"></i>
                                </div>
                                <div class="tips">
                                    <span>{{item.TypeName && item.TypeName}}</span>
                                    <span>{{item.AddTime.split('T')[0]}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </transition>
            <div class="block" style="height: 100px;" v-if="list.length && page.totalRecords > 24">
                <HomePagination :Page="page" @getTempList="getTempData" />
            </div>
            <div v-if="!list.length && !loading" class="to-create">
                <p>您还没有创建任何设计</p>
                <el-button @click="handleToDesign">立即创建</el-button>
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
            list: [],  // 设计记录列表
            name: '', // 模板名称
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
            headerWidth: ''
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
            let width = (columns * 226) + (columns - 1) * 20 + 'px'
            this.headerWidth = width
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

        handleClick(item) {
            this.name = item.Name
            item.Status = false
            this.$nextTick(() => {
                this.$refs.input[0].focus()
            })
        },
        select() {
            var test = document.getElementById('test')
            test.select()
        },
        // 修改模板名称
        handleEditName(e,item) {
            if(e.keyCode == 13) {
                var formData = new FormData()
                formData.append('Name', this.name);
                formData.append('DocumentNum', item.DocumentNumber);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.put('/Document', formData, config).then(res => {
                    //console.log(res.data)
                    if(res.data == true){
                        this.$message.success('修改成功')
                        item.Status = true
                        item.Name = this.name
                    }else{
                        this.$message.error('修改失败')
                    }
                })
            }
        },
        // 失去焦点修改名称
        handleBlur(item) {
            if(this.name == item.Name) {
                item.Status = true
                return
            }
            var formData = new FormData()
            formData.append('Name', this.name);
            formData.append('DocumentNum', item.DocumentNumber);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.put('/Document', formData, config).then(res => {
                // console.log(res.data)
                if(res.data == true){
                    this.$message.success('修改成功')
                    item.Status = true
                    item.Name = this.name
                }else{
                    this.$message.error('修改失败')
                }
            })
        },

        // 没有记录跳转到创建设计
        handleToDesign() {
            this.$router.push('/personal')
            // this.$emit('setRecord', 'Create')
        },
        // 跳转到设计器
        handleJump(item) {
            //console.log(item)
            let str = 'DocumentNumber=' + item.DocumentNumber
            str = window.btoa(str)
            var url = this.$router.resolve('/designer/'+ str)
            window.open(url.href,'_blank')
        },

        // 获取全部设计记录列表
        getTempData() {
            this.list = []
            this.loading = true
            let product;
            if(this.formInline.product == '0'){
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
            formData.append('pageSize', this.page.pageSize);
            formData.append('productcategory', product);
            formData.append('startTime', this.startTime)
            formData.append('endTime', this.endTime)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/SetUpTemplate',formData,config).then(res => {
                if(res == undefined) {
                    this.list = []
                    this.loading = false
                    return 
                }
                console.log(res.data)
                if(res.data.Data.length == 0){
                    this.loading = false
                    // this.$refs.box.style.height = '0'
                    return
                }
                this.list = res.data.Data
                if(this.list.length > 0) this.loading = false
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
            })
        },

        // 删除模板
        open(index) {
            //console.log(this.list[index].DocumentNumber)
            this.$confirm('是否删除该记录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var formData = new FormData(); 
                formData.append("TeamNum", this.teamNum);
                formData.append("DocumentNumber", this.list[index].DocumentNumber);
                this.$axios.delete('/TeamTemplate',{data: formData}).then(res => {
                    //console.log(res)
                    if(res.data = 'success') {
                        this.$message({type: 'success',message: '删除成功!'});
                        this.list.splice(index,1)
                        this.page.totalRecords = this.page.totalRecords - 1
                        if(this.list.length == 0 && this.page.currentPage > 1) {
                            this.page.currentPage -= 1
                            this.getTempData()
                        }
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
        // 复制模板/设为母版
        handleCopy(i, msg) {
            var formData = new FormData()
            formData.append('DocumentNumber', this.list[i].DocumentNumber);
            formData.append('TeamNum', localStorage['teamNum']);
            formData.append('IsMaster', msg)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/CopyDocument', formData, config)
            .then(res => {
                if(res.data == '') return console.log('没有返回')
                if(msg == '1') {
                    console.log(res.data)
                    if(res.data == 'Success') {
                        this.list[i].MasterDocument = '1'
                        this.$message.success('设为通用模板成功')
                    }else{
                        this.$message.error('设为通用模板失败')
                        return 
                    }
                }else{
                    console.log(JSON.parse(res.data))
                    if(JSON.stringify(res.data) != '{}') {
                        this.$message.success('复制成功')
                        this.getTempData()
                    }else{
                        this.$message.error('复制失败')
                    }
                }
            })
        }
    },
    mounted() {
        this.teamNum = localStorage['teamNum']
        this.getTempData()
        this.$axios.get('/ProductCategories').then(res => {
            // console.log(res)
            this.productList = res.data
        })
        // 监听页面尺寸改变时触发
        window.onresize = (() => {
            this.waterfall()
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

<style lang="scss">

#record{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}

.record{
    min-width: 960px;
    margin: 0 auto;
    .block{
        margin-top: -20px;
    }
}

.form-inline .el-input__inner, .el-input, .form-inline .el-form-item__content, .form-inline .el-form-item__label{
    height: 37px;
    line-height: 37px;
}

.form-inline{
    min-width: 960px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius:10px;
    padding: 19px 20px 20px;
    margin-bottom: 25px;
    .el-form-item{
        margin: 0;
        height: 37px;
        line-height: 37px;
        margin-right: 32px !important;
    }
    .el-form-item__label{
        color:rgba(51,51,51,1);
        float: left;
    }
    .el-form-item__content{
        .el-icon-date::before{
            content: '';
        }
        .el-icon-date::after{
            background-image: url(/img/personal/time_icon.png);
            width: 100%;
            height: 30px;
            vertical-align: middle;
        }
    }
    .el-input{
        width: 173px;
    }
    .screen{
        background: $color;
        display: inline-block;
        line-height: 37px;
        padding: 0 12px;
        border-radius: 5px;
        color: rgba(254,254,254,1);
        cursor: pointer;
    }
}

.form-inline .form-item{
    .range{
        margin: 0 10px;
    }
    .block-date{
        display: inline-block;
        .el-date-editor, .el-input__inner{
            width: 144px;
        }
        .el-input--prefix .el-input__inner{
            padding-left: 35px;
            padding-right: 18px;
        }
    }
}

// 下拉按钮样式
.form-inline .select .el-input__suffix-inner i::before{
    content: '';
}
.form-inline .select .el-input .el-select__caret{
    transform: rotateZ(0);
}
.form-inline .select .el-input__suffix-inner i::after{
    background-image: url(/img/personal/drop_down.png);
    width: 100%;
    height: 30px;
}


.waterfall-list{
    min-width: 1000px;
    position: relative;
    .waterfall-item{
        position: absolute;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
        transition: all .4s;
        &:hover{
            box-shadow: 0 4px 15px rgba(0,0,0,.1);
            transform: translateY(-5px);
        }
        .image{
            width: 226px;
            display: block;
            border-radius: 10px 10px 0 0;
        }
        .waterfall-block{
            background: rgba(255,255,255,1);
            border-radius: 10px;
        }
        .waterfall-item-wrap{
            position: relative;
            &:hover .img-mask{
                opacity: 1;
            }
            .img-mask{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 10px 10px 0 0;
                background: rgba(0,0,0,.3);
                opacity: 0;
                transition: opacity .4s linear;
                .tooltip{
                    width:35px;
                    height:35px;
                    background:rgba(255,255,255,1);
                    border-radius:5px;
                    text-align: center;
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    .copy-img{
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        margin-top: 8px;
                        background-image: url(/img/desicon/copy_small_icon.png);
                        background-repeat: no-repeat;
                    }
                    &:hover .copy-img{
                        background-image: url(/img/desicon/copy_small_bule_icon.png);
                    }
                    &:hover::before{
                        content: attr(data-tip);
                        font-size: 12px;
                        line-height: 12px;
                        background-color: #fff;
                        color: #626262;
                        padding: 4px 6px;
                        position: absolute;
                        top: 49px;
                        left: -.5px;
                        white-space: pre;
                        border-radius: 2px;
                        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.24);
                    }
                    &:hover::after{
                        content: "";
                        position: absolute;
                        width: 0;
                        height: 0;
                        border-bottom: 4px solid #fff;
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        top: 45px;
                        left: 15.5px;
                    }
                }
                .item-set{
                    position: absolute;
                    top: 15px;
                    left: 8px;
                    display: block;
                    border-radius: 4px;
                    min-width: 70px;
                    height: 28px;
                    padding: 0 10px;
                    line-height: 28px;
                    font-size: 14px;
                    color: #fff;
                    background: $color;
                    text-align: center;
                }
            }
        }
        .waterfall-item-title{
            padding: 8px 13px;
            .title{
                font-size: 14px;
                color: rgba(51,51,51,1);
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                .delete{
                    display: inline-block;
                    background-image: url(/img/desicon/delete_small_icon.png);
                    background-repeat: no-repeat;
                    width: 20px;
                    height: 20px;
                    &:hover{
                        background-image: url(/img/desicon/delete_small_blue_icon.png);
                    }
                }
                .template-title{
                    width: 150px;
                    min-width: 150px;
                    border: 1px dashed transparent;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    position: relative;
                    &:hover{
                        border-bottom: 1px dashed #bfbfbf;
                    }
                    &:hover::before{
                        content: '';
                        background-image: url(/img/personal/Modify_icon.png);
                        position: absolute;
                        top: -3px;
                        right: 0;
                        width: 20px;
                        height: 20px;
                    }
                }
                .edit-title{
                    width: 150px;
                    height: 18px;
                    line-height: 18px;
                    font-size: 14px;
                    outline: none;
                    border: none;
                    border-bottom: 1px dashed #bfbfbf;
                    .el-input__inner{
                        outline: none;
                        border: none;
                        height: 18px;
                        line-height: 18px;
                        padding: 0;
                    }
                }
            }
            .tips{
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: rgba(153,153,153,1);
            }
        }
    }
}

.to-create{
    margin-top: 200px;
    text-align: center;
    p{
        margin-bottom: 15px;
    }
    .el-button{
        background: $color;
        color: rgba(255,255,255,1);
        &:hover{
            background: $color;
            color: rgba(255,255,255,1);
        }
    }
}
</style>
