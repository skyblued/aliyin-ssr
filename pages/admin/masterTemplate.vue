<template>
    <div class="admin-master">
        <div class="admin-master-header">
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
            <el-date-picker
                style="height: 37px;margin-right: 15px;"
                v-model="date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="~"
                prefix-icon="el-icon-time"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                @change="handleDate">
            </el-date-picker>
            <div class="admin-master-search" @click="getMasterTemp">搜索</div>
        </div>
        <div class="master-list">
            <div class="master-item" v-for="(item,i) in masterList" :key="i">
                <div class="master-item-block">
                    <div class="block-image-wrap">
                        <div class="mask"></div>
                        <img :src="$store.state.port.imgBaseUrl + item.FacePicture" alt="">
                    </div>
                    <div class="block-theme">{{item.Name}}</div>
                    <div class="block-scene">
                        <span>{{item.ProductTypeName}}</span>
                        <span>{{item.AddTime && item.AddTime.split('T')[0]}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="block" v-if="masterList.length && page.totalRecords > 20">
            <HomePagination :Page="page" @getTempList="getMasterTemp" />
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
            param: {
                productId: '0',
                productTypeId: '0',
                startTime: '',
                endTime: ''
            },
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
            date: '',
            masterList: []
        }
    },
    methods: {
        handleEnter() {
            this.$refs.list.style.maxHeight = '270px'
            this.$refs.list.style.overflow = 'hidden'
        },
        handleLeave() {
            this.$refs.list.style.maxHeight = '0'
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
        handleDate(value) {   // 选择时间
            if(value != null) {
                this.param.startTime = value[0]
                this.param.endTime = value[1]
            }else{
                this.param.startTime = ''
                this.param.endTime = ''
            }
        },

        // 获取专属模板列表
        getMasterTemp() {
            var url = '/UsersMasters?pageSize=' + this.page.pageSize + '&pageIndex=' + this.page.currentPage + '&ProductCategorieNum=' + this.param.productId + '&ProductTypeId=' + this.param.productTypeId +'&type=' + 'admin' + `${this.param.endTime ? '&endTime=' + this.param.endTime : ''}` + `${this.param.startTime ? '&startTime=' + this.param.startTime : ''}`
            this.$axios.get(url).then(res => {
                console.log(res.data)
                this.masterList = res.data.Data
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
            })
        },
    },
    mounted() {
        this.$axios.get('/admin/products').then(res => {
            // console.log(res.data)
            this.productList = res.data
        })
        this.getMasterTemp()
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>
.admin-master{
    padding-left: 10px;
    .admin-master-header{
        display: flex;
        flex-wrap: wrap;
        min-width: 1200px;
        line-height: 37px;
        padding: 20px 28px 19px 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        .type{
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
        .admin-master-search{
            height: 37px;
            padding: 0 15px;
            text-align: center;
            background: $color;
            border-radius: 5px;
            color: rgba(255,255,255,1);
            cursor: pointer;
        }
    }
    .master-list{
        display: flex;
        flex-wrap: wrap;
        margin-left: 30px;
        .master-item{
            width: 240px;
            margin-right: 30px;
            margin-bottom: 30px;
            .master-item-block{
                width: 100%;
                display: inline-block;
                background: rgba(255,255,255,1);
                .block-image-wrap{
                    background: #f9f9fc;
                    border-radius: 6px;
                    width: 100%;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;
                    &:hover .mask{
                        display: block;
                    }
                    .mask{
                        display: none;
                        position: absolute;
                        z-index: 1;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,.2);
                        border-radius: 6px;
                    }
                    img{
                        position: absolute;
                        max-width: 86.88%;
                        max-height: 92.21%;
                        box-shadow: 0 10px 20px 0 rgba(20,35,55,.2);
                        border-style: none
                    }
                }
                .block-theme{
                    width: 200px;
                    height: 24px;
                    margin-top: 12px;
                    font-size: 14px;
                    color: rgba(51,51,51,1);
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
                .block-scene{
                    display: flex;
                    justify-content: space-between;
                    opacity: .5;
                    font-size: 12px;
                    color: #000;
                }
            }
        }
    }
}

.admin-master /deep/ .el-date-editor .el-range__icon{
    font-size: 22px;
}
</style>
