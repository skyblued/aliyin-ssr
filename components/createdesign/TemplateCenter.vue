<template>
    <div id="template-center">
        <div class="template-center">
            <div class="breadcrumb">
                <span>当前位置: </span>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/templatelist' }">模板中心</el-breadcrumb-item>
                    <el-breadcrumb-item>{{title || keywords}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="subtitle">{{subtitle}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="template-types" v-if="typeList.length">
                <div class="template-types-list">
                    <div class="template-types-item" v-for="(items,i) in typeList" :key="i">
                        <span class="template-types-item-title">{{items.Name}}: </span>
                        <div class="template-types-selector-item" v-for="(item,index) in items.FilterValues" :key="index" @click="handleChangeValue(item,i,index)">
                            <img v-if="items.DisplayMode == 1" :src="$store.state.port.imgBaseUrl+item.ImageUrl" alt="">
                            <span v-else :class="{'template-types-selector-item-line': true, active : !item.IsEnable}">{{item.Name}}</span>
                            <i v-if="item.DisplayMode == 1" :class="{'el-icon-check' : !item.IsEnable}"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="template-types">
                <div class="template-types-select">
                    <span class="template-types-item-title">排序: </span>
                    <el-dropdown @command="handleCommandSort" v-if="sortList.length" class="sort">
                        <p class="el-dropdown-link">
                            <span>{{sort}}</span>
                            <img :src="$store.state.port.staticPath + '/img/home/drop_down.png'" alt="">
                        </p>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="item" v-for="(item,i) in sortList" :key="i">{{item.title}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="template-types-select">
                    <span class="template-types-item-title">价格: </span>
                    <el-dropdown @command="handleCommandPrice" v-if="priceList.length" class="price">
                        <p class="el-dropdown-link">
                            <span>{{price}}</span>
                            <img :src="$store.state.port.staticPath + '/img/home/drop_down.png'" alt="">
                        </p>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="item" v-for="(item,i) in priceList" :key="i">{{item.tips}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="template-types-select" v-if="sizeList.length">
                    <span class="template-types-item-title">版式: </span>
                    <el-dropdown @command="handleCommandFormat" class="format">
                        <p class="el-dropdown-link">
                            <span>{{plate}}</span>
                            <img :src="$store.state.port.staticPath + '/img/home/drop_down.png'" alt="">
                        </p>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="全部">全部</el-dropdown-item>
                            <el-dropdown-item :command="item" v-for="(item,i) in sizeList" :key="i">{{item.Name}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>

            <div class="template-center-list">
                <div class="template-center-item" v-for="(item,i) in templateList" :key="i">
                    <div class="template-center-block">
                        <div class="block-img-wrap">
                            <img :src="$store.state.port.imgBaseUrl+item.FacePicture" alt="">
                            <div class="block-img-mask">
                                <div class="tooltip" :data-tip="item.IsFavorite == true ? '取消' : '收藏'" @click="handleCollect(i)">
                                    <img class="likeTemplate" :src="item.IsFavorite == true ? collectImage : image" alt="">
                                </div>
                                <el-button class="design-btn"  @click="handleToDesign(item)"><span>立即制作</span></el-button>
                            </div>
                        </div>
                        <div class="template-center-item-bottom">
                            <p class="shop-title">
                                <span>{{item.Name}}</span>
                            </p>
                            <p class="shop-tips">
                                <span>{{item.ProductTypeName}}</span>
                                <span>
                                    <img :src="$store.state.port.staticPath + '/img/home/user.png'" alt=""> 
                                    {{item.Visits}}人使用
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="template-center-item" style="height: 0px;visibility: hidden;"></div>
                <div class="template-center-item" style="height: 0px;visibility: hidden;"></div>
                <div class="template-center-item" style="height: 0px;visibility: hidden;"></div>
                <div class="template-center-item" style="height: 0px;visibility: hidden;"></div>
            </div>

            <HomePagination :Page="page" @getTempList="getTempLateList" />
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            typeList: [],  // 分类列表
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 0,      // 每页个数
            },
            title: '',
            subtitle: '',
            typeId: '',
            num: '',
            keywords: '',
            templateParam: {  // 获取模板参数
                ProductCategorieNum: null,
                ProductTypeId: null,
                SizeId: '',
                pageIndex: null,
                SortOrder: 0,
                ChargingMode: '',
                StrFilterValue: null,
                TeamNum: sessionStorage['teamNum'],
                keywords: ''
            },

            sort: '热门推荐',
            price: '全部',
            plate: '全部',
            sortList: [{
                value: 0,
                title: '热门推荐'
            },
            {
                value: 1,
                title: '使用最多'
            },
            {
                value: 2,
                title: '收藏最多'
            },
            {
                value: 3,
                title: '最新上传'
            }],
            priceList: [{
                value: '',
                tips: '全部'
            },{
                value: '0',
                tips: '免费'
            },{
                value: '1',
                tips: '会员免费'
            }],
            sizeList: [],  // 尺寸列表
            templateList: [],  // 模板列表
            image: '/img/home/collect-icon.png',
            collectImage: '/img/home/collect_s_icon_hl.png',
        }
    },
    methods: {
        // 获取模板参数
        getParam() {
            new Promise((resolve, reject) => {
                let ProductCategorieNum = this.num,
                    ProductTypeId = this.typeId,
                    SizeId = this.templateParam.SizeId,
                    pageIndex = this.page.currentPage,
                    SortOrder = this.templateParam.SortOrder,
                    ChargingMode = this.templateParam.ChargingMode,
                    StrFilterValue = '',
                    TeamNum = sessionStorage['teamNum'],
                    keywords = this.keywords
                this.typeList.forEach(item => {
                    item['FilterValues'].forEach(temp => {
                        if (!temp['IsEnable']) {
                            StrFilterValue += temp.ValueId + ','
                        }
                    })
                })
                if(StrFilterValue.lastIndexOf(',') == StrFilterValue.length - 1) StrFilterValue = StrFilterValue.slice(0, -1)
                resolve({ProductCategorieNum, ProductTypeId, SizeId, pageIndex, SortOrder, ChargingMode, StrFilterValue, TeamNum, keywords})
            }).then(obj => {
                console.log(obj)
                this.templateParam = obj
                this.getTempLateList(this.templateParam)
            })
            if (!this.typeId) return 
            this.$axios.get('/ProductTypeFilter?productTypeID=' + this.typeId).then(res => {
                //console.log(res.data)
                this.typeList = res.data || []
            })
            this.$axios.get('/ProductTypeSize?TypeID=' + this.typeId).then(result => {
                //console.log(result.data)
                this.sizeList = result.data || []
            })
        },

        // 获取模板列表
        getTempLateList(obj) {
            this.templateList = []
            let formdata = new FormData()
			for (let item in obj) {
				formdata.append(item, obj[item])
            }
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TemplateCenter', formdata, config).then(res => {
                console.log(res.data)
                this.templateList = res.data.Data
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
                this.page.pageSize = Math.ceil(res.data['X-Pagination'].TotalCount / res.data['X-Pagination'].TotalPages)
            })
        },

        handleChangeValue(item,i,index) {  // 选择行业
            let StrFilterValue = ''
            var arr = this.typeList[i].FilterValues
            for (var i=0;i<arr.length;i++) {
                arr[i].IsEnable = true
                if (i == index) {
                    arr[i].IsEnable = false
                }
            }
            this.typeList.forEach(item => {
                item['FilterValues'].forEach(temp => {
                    if (!temp['IsEnable']) {
                        StrFilterValue += temp.ValueId + ','
                    }
                })
            })
            if(StrFilterValue.lastIndexOf(',') == StrFilterValue.length - 1) StrFilterValue = StrFilterValue.slice(0, -1)
            this.templateParam.StrFilterValue = StrFilterValue
            this.getTempLateList(this.templateParam)
         },

        handleCommandSort(command) {  // 排序
            let id;
            if (command == undefined) id = 0
            else {
                this.sort = command.title
                id = command.value
            }
            this.templateParam.SortOrder = id
            this.getTempLateList(this.templateParam)
        },
        handleCommandPrice(command) {  // 价格
            let id;
            if (command == undefined) id = ''
            else {
                this.price = command.tips
                id = command.value
            }
            this.templateParam.ChargingMode = id
            this.getTempLateList(this.templateParam)
        }, 
        handleCommandFormat(command) {  // 版式
            let id;
            if (command == '全部') {
                this.plate = '全部'
                id = ''
            } else {
                this.plate = command.Name
                id = command.ID
            }
            this.templateParam.SizeId = id
            this.getTempLateList(this.templateParam)
        },

        // 收藏模板
        handleCollect(i) {
            if(this.templateList[i].IsFavorite == false){
                var formData = new FormData()
                formData.append('TemplateNumber', this.templateList[i].TemplateNumber);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/FavoritedTemplate', formData, config).then(res => {
                    //console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '收藏成功'})
                        this.templateList[i].IsFavorite = true
                    }else{
                        this.$message({type: 'error', message: '收藏失败'})
                        return
                    }
                })
            }else{
                var formData = new FormData()
                formData.append('TemplateNumber', this.templateList[i].TemplateNumber);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/FavoritedTemplate', {data: formData}, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '取消收藏成功'})
                        this.templateList[i].IsFavorite = false
                    }else{
                        this.$message({type: 'error', message: '取消收藏失败'})
                        return
                    }
                })
            }
        },

        // 去制作
        handleToDesign(item) {
            if (!localStorage['token']) return this.$store.commit('setDialogType', 'login')
            var formData = new FormData()
            formData.append('TemplateNumber', item.TemplateNumber)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/Template', formData, config).then(res => {
                if(res.data == '') return console.log('没有返回')
                console.log(res.data)
                let obj = {
                    SizeId: res.data.SizeId,
                    ProductCategorieNum : res.data.ProductCategorieNum,
                    ProductTypeId : res.data.ProductTypeId,
                    Name : res.data.Name,
                    TeamNum : sessionStorage['teamNum'],
                    Pages : res.data.TemplatePages
                }
                this.$axios.post(this.$store.state.port.TeamTemplate,obj).then(result =>{
                    //console.log(JSON.parse(res.data))
                    let data = JSON.parse(result.data)
                    let str = 'DocumentNumber=' + data.DocumentNumber
                    str = window.btoa(str)
                    window.open('/designer/'+ str)
                })
            })
        }
    },
    mounted() {
        this.title = this.$route.query.title || ''
        this.subtitle = this.$route.query.subtitle || ''
        this.typeId = this.$route.query.id || ''
        this.num = this.$route.query.n || ''
        this.keywords = this.$route.query.k || ''
        this.getParam()
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>

#template-center{
    width: 100%;
    background: rgba(243,243,243,1);
    padding-top: 20px;
    user-select: none;
}
.template-center /deep/ .el-breadcrumb{
    line-height: 21px;
}
.template-center{
    width: 1200px;
    margin: 0 auto;
    .breadcrumb{
        display: flex;
        line-height: 21px;
        font-size: 14px;
        span{
            margin-right: 10px;
        }
    }
    .template-types-item-title{
        line-height: 37px;
        font-size:14px;
        font-family:MicrosoftYaHei;
        font-weight:bold;
        color:rgba(51,51,51,1);
        margin-right: 20px;
    }
    .template-types{
        display: flex;
        background: rgba(255,255,255,1);
        border-radius: 10px;
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        padding: 20px 84px 19px 20px;
        margin-top: 25px;
        .template-types-item{
            display: flex;
            margin-bottom: 10px;
            .template-types-selector-item{
                display: flex;
                align-items: center;
                margin-right: 15px;
                position: relative;
                i{
                    display: inline-block;
                    width: 100%;
                    line-height: 21px;
                    background: rgba(0,0,0,.1);
                    font-weight: bold;
                    color: rgba(255,255,255,1);
                    text-align: center;
                    position: absolute;
                    top: 8px;
                    left: 0;
                }
                .template-types-selector-item-line{
                    font-size: 14px;
                    color: rgba(51,51,51,1);
                    padding: 8px 5px;
                    cursor: pointer;
                    position: relative;
                    border-radius: 5px;
                    &:hover{
                        background: $color;
                        color: white;
                    }
                }
                .active{
                    background: $color;
                    color: white;
                }
                img{
                    width: 32px;
                    height: 21px;
                    border-radius:3px;
                    cursor: pointer;
                    transition: transform .5s ease;
                    &:hover {
                        transform: scale(1.2);
                    }
                }
            }
        }
        .template-types-select{
            display: flex;
            font-size:14px;
            color:rgba(102,102,102,1);
            margin-right: 35px;
            .el-dropdown-link span{
                margin-right: 25px;
            }
            .price .el-dropdown-link span{
                display: inline-block;
                width: 56px;
                margin-right: 15px;
            }
        }
    }
    .template-center-list{
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-top: 25px;
        .template-center-item{
            display: inline-block;
            width: 280px;
            border-radius:10px;
            background:rgba(255,255,255,1);   
            overflow: hidden;
            margin-bottom: 27px;
            position: relative;
            height: 100%;
            cursor: pointer;
            transition: all .5s;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
            &:hover{
                box-shadow: 0 4px 15px rgba(0,0,0,.1);
                transform: translateY(-5px);
            }
            .template-center-block .block-img-wrap{
                width:280px;
                height:374px;
                border-radius:10px 10px 0px 0px;
                img{
                    width: 100%;
                    height: 100%;
                }
                .block-img-mask{
                    width: 100%;
                    height: 374px;
                    background:rgba(0,0,0,.2);
                    display: none;
                    border-radius:10px 10px 0px 0px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    .tooltip{
                        width:35px;
                        height:35px;
                        background:rgba(255,255,255,1);
                        border-radius:5px;
                        position: absolute;
                        right: 15px;
                        top: 15px;
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
                        .likeTemplate{
                            width: 20px;
                            height: 18px;
                            margin: 9px 7px 8px 8px;
                        }
                    }
                    .design-btn{
                        width:167px;
                        height:42px;
                        background:rgba(0,131,233,1);
                        border-radius:5px;
                        border: 1px solid rgba(0,131,233,1);
                        position: absolute;
                        top: 169px;
                        left: 56px;
                        color:rgba(254,254,254,1);
                        font-size:18px;
                    }
                }
            }
            .template-center-block .template-center-item-bottom{
                padding: 16px 18px;
                .shop-title{
                    font-size: 16px;
                    color: rgba(51,51,51,1);
                    margin-bottom: 5px;
                }
                .shop-tips{
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: rgba(153,153,153,1);
                }
            }
        }
    }
    .template-center-item .template-center-block:hover .block-img-wrap .block-img-mask{
        display: block;
    }
}

.template-center /deep/ .el-dropdown{
    display: inline-block;
    height:37px;
    line-height: 37px;
    border:1px solid rgba(210,210,210,1);
    border-radius:5px;
    padding-left: 17px;
    padding-right: 11px;
    cursor: pointer;
    .el-dropdown-link img{
        transition: transform .4s ease;
    }
    &:hover .el-dropdown-link img{
        transform: rotate(180deg)
    }
}
</style>
