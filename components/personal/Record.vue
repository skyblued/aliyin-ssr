<template>
    <div id="record">
        <div class="record">
            <el-form :inline="true" class="form-inline">
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
            <div class="waterfall-list" v-loading="loading">
                <div class="waterfall-item" v-for="(item,i) in list" :key="i">
                    <div class="waterfall-block">
                        <div class="waterfall-item-wrap">
                            <img class="image" :src="$store.state.port.imgBaseUrl+item.FacePicture">
                            <div class="img-mask">
                                <span class="item-set" v-if="$store.state.teamType === 'team'" @click.stop="handleSetMaster(item)">设为母版</span>
                                <div class="tooltip" data-tip="删除" @click="open(i)">
                                    <img class="delete-img" :src="$store.state.port.staticPath + '/img/personal/delete_icon.png'" alt="">
                                </div>
                                <div class="again" @click="handleJump(item,i)">重新编辑</div>
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
                                <span>{{item.AddTime.split('T')[0]}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            <div class="block" v-if="list.length">
                <HomePagination :Page="page" @getTempList="getTempData" />
            </div>
            <div v-if="show && !list.length" class="to-create">
                <p>您还没有创建任何设计</p>
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
          startTime: '',
          endTime: ''
        },
        list: [],  // 设计记录列表
        show: false,
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


        // handleSizeChange(val) {
        //     console.log(`每页 ${val} 条`);
        //     this.page.pageSize = val
        //     this.getTempData()
        // },
        // handleCurrentChange(val) {
        //     console.log(`当前页: ${val}`);
        //     this.page.currentPage = val
        //     this.loading = true
        //     this.getTempData()
        // },
        // 没有记录跳转到创建设计
        handleToDesign() {
            this.$router.push('/personal')
        },
        // 跳转到设计器
        handleJump(item) {
            //console.log(item)
            let str = 'DocumentNumber=' + item.DocumentNumber
            str = window.btoa(str)
            var url = this.$router.resolve('/designer/'+ str)
            window.open(url.href,'_blank')
        },
        // 设为母版
        handleSetMaster(item,i) {
            // console.log(item.DocumentNumber)
            var formData = new FormData()
            formData.append('TeamNum', this.teamNum);
            formData.append('DocumentNum', item.DocumentNumber)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamMaster', formData, config).then(res => {
                console.log(res.data)
                if(res.data = 'true'){
                    this.$message({type: 'success', message: '设置成功'})
                    this.getTempData()
                }else{
                    this.$message({type: 'error', message: '设置失败'})
                }
            })
        },

        // 获取全部设计记录列表
        getTempData() {
            this.list = []
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
            formData.append('productcategory', product);
            formData.append('startTime', this.startTime)
            formData.append('endTime', this.endTime)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/SetUpTemplate',formData,config).then(res => {
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
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
    },
    mounted() {
        this.getTempData()
        this.$axios.get('/ProductCategories').then(res => {
            // console.log(res)
            this.productList = res.data
        })
        //window.addEventListener('scroll', this.scroll)
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
    min-width: 1200px;
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
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius:10px;
    padding: 19px 20px 20px;
    .el-form-item{
        margin: 0;
        height: 37px;
        line-height: 37px;
        margin-right: 42px !important;
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
        &:hover{
            background: #0893ff;
        }
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
    //height: 650px;
    //width: 1380px;
    //overflow: hidden;  
    column-count: 6; 
    column-gap: 20px;
    margin-top: 34px;
    @media screen and (min-width: 1200px) {
        column-count: 5;
    }
    .waterfall-item{
        display: flex;
        break-inside: avoid;
        padding-top: 3px; 
        width: 213px;
        height: auto;
        border-radius:10px;
        .waterfall-block{
            border-radius:10px;
            background:rgba(255,255,255,1);   
            overflow: hidden;
            margin-bottom: 20px;
            position: relative;
            height: 100%;
            cursor: pointer;
            transition: all .3s;
            //box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
            &:hover{
                //box-shadow: 0 4px 15px rgba(0,0,0,.1);
                transform: translateY(-3px);
            }
            .waterfall-item-wrap{
                width: 213px;
                height: 100%;
                position: relative;
                .image{
                    display: block;
                    width: 100%;
                    height: auto;
                }
            }
            .waterfall-item-title{
                font-family:MicrosoftYaHei;
                font-weight:400;
                padding: 8px 13px;
                .title{
                    font-size: 12px;
                    color: rgba(51,51,51,1);
                    margin-bottom: 10px;
                }
                .tips{
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: rgba(153,153,153,1);
                }
            }
        }
    }
}
.waterfall-block:hover .waterfall-item-wrap .img-mask{
    display: block;
}
.waterfall-block .img-mask{
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.24);
    z-index: 10;
    .tooltip{
        width:35px;
        height:35px;
        text-align: center;
        background:rgba(255,255,255,1);
        border-radius:5px;
        position: absolute;
        right: 15px;
        top: 15px;
        img{
            margin-top: 3px;
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
    .again{
        display: inline-block;
        background: $color;
        border-radius:5px;
        line-height: 32px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 21%;
        font-size:14px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(254,254,254,1);
        padding: 0 35px;
        &:hover{
            background: #0893ff;
        }
    }
}
.waterfall-block .img-mask .item-set{
    position: absolute;
    top: 15px;
    left: 8px;
    display: block;
    border-radius: 4px;
    width: 70px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #fff;
    background: $color;
    text-align: center;
    &:hover{
        background: #0893ff;
    }
}

.to-create{
    margin-top: 200px;
    text-align: center;
    p{
        margin-bottom: 15px;
    }
}
</style>
