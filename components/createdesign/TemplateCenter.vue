<template>
    <div id="template-center">
        <div class="template-center">
            <div class="breadcrumb">
                <span>当前位置: </span>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/templateList' }">模板中心</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="title">{{title}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="subtitle">{{subtitle}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="keywords">{{keywords}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="template-types" v-if="typeList.length">
                <div class="template-types-list">
                    <div class="template-types-item" ref="i" v-for="(items,i) in typeList" :key="i" :style="{maxHeight: '37px'}">
                        <span class="template-types-item-title" style="min-width: 60px;">{{items.Name}}: </span>
                        <div class="template-types-selector-list">
                            <span :class="{'template-types-selector-item-all':true, isText: items.IsEnable}" @click="handleChangeAll(i)">全部</span>
                            <div class="template-types-selector-item" v-for="(item,index) in items.FilterValues" :key="index" @click="handleChangeValue(item,i,index)">
                                <img v-if="item.DisplayMode == 1" :src="$store.state.port.imgBaseUrl+item.ImageUrl" alt="">
                                <span v-else :class="{'template-types-selector-item-line': true, active : !item.IsEnable}">{{item.Name}}</span>
                                <i v-if="item.DisplayMode == 1" :class="{'el-icon-check' : !item.IsEnable}"></i>
                            </div>
                        </div>
                        <div class="template-types-selector-more-show" v-if="items.FilterValues.length > 13" @click="handleShowMore(i)" >
                            {{brand != '37px' && isShow == i ? '收起' : '更多'}}
                            <i class="el-icon-arrow-down"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="template-types">
                <div class="template-types-select">
                    <span class="template-types-item-title">排序: </span>
                    <div class="types-dropdown">
                        <div class="dropdown-link">
                            <span>{{sort}}</span>
                            <i class="dropdown-link-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/home/drop_down.png'})`}"></i>
                        </div>
                        <div class="dropdown-menu">
                            <span :class="{'dropdown-item':true, active : sort == item.title}" v-for="(item,i) in sortList" :key="i" @click="handleChooseSort(item)">{{item.title}}</span>
                        </div>
                    </div>
                </div>
                <div class="template-types-select">
                    <span class="template-types-item-title">价格: </span>
                    <div class="types-dropdown">
                        <div class="dropdown-link">
                            <span>{{price}}</span>
                            <i class="dropdown-link-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/home/drop_down.png'})`}"></i>
                        </div>
                        <div class="dropdown-menu">
                            <span :class="{'dropdown-item':true, active : price == item.tips}" v-for="(item,i) in priceList" :key="i" @click="handleChoosePrice(item)">{{item.tips}}</span>
                        </div>
                    </div>
                </div>
                <div class="template-types-select" v-if="sizeList.length">
                    <span class="template-types-item-title">版式: </span>
                    <div class="types-dropdown">
                        <div class="dropdown-link">
                            <span>{{plate}}</span>
                            <i class="dropdown-link-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/home/drop_down.png'})`}"></i>
                        </div>
                        <div class="dropdown-menu">
                            <span :class="{'dropdown-item':true, active: plate == '全部'}" @click="handleChoosePlate('全部')">全部</span>
                            <span :class="{'dropdown-item':true, active : plate == item.Name}" v-for="(item,i) in sizeList" :key="i" @click="handleChoosePlate(item)">{{item.Name}}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="template-center-list" ref="box" :style="{height: height == '' ? '400px' : height + 'px'}">
                <div class="template-center-item">
                    <div class="template-center-block">
                        <div @click="handleCreatTemplate" class="modal-block-img-wrap" :style="{height: height == '' ? '300px' : height + 'px'}">
                            <div class="empty">
                                <span><i :style="{'background-image': `url(${$store.state.port.staticPath + '/img/personal/qyadd_blue_icon.png'})`}"></i></span>
                            </div>
                        </div>
                        <div class="modal-block-text-empty">
                            <span>开启空白画布</span>
                            <br>
                            <span v-if="size.width !== null" style="font-size: 12px;color: #bfbfbf;">尺寸：{{size.width}} * {{size.height}}{{size.unit}}</span>
                        </div>
                    </div>
                </div>
                <div class="template-center-item" v-for="(item,i) in templateList" :key="i">
                    <div class="template-center-block">
                        <div class="block-img-wrap" @click="handleToDesign(item)">
                            <img @load="waterfall" class="image" :src="$store.state.port.imgBaseUrl+item.FacePicture + '!w280.src'" alt="">
                            <div class="block-img-mask">
                                <div class="tooltip" :data-tip="item.IsFavorite == true ? '取消' : '收藏'" @click.stop="handleCollect(i)">
                                    <img class="likeTemplate" :src="$store.state.port.staticPath + (item.IsFavorite == true ? collectImage : image)" alt="">
                                </div>
                                <!-- <el-button class="design-btn"  @click="handleToDesign(item)"><span>立即制作</span></el-button> -->
                            </div>
                        </div>
                        <div class="template-center-item-bottom">
                            <p class="shop-title" v-html="item.Name.replace(keywords, `<span style='color: #745bff'>${keywords}</span>`)" :title="item.Name">
                            </p>
                            <span>
                                <img :src="$store.state.port.staticPath + '/img/home/user.png'" alt=""> 
                                {{item.Visits}}
                            </span>
                            <!-- <p class="shop-tips">
                                <span>{{item.ProductTypeName}}</span>
                                <span>
                                    <img src="/img/home/user.png" alt=""> 
                                    {{item.Visits}}人使用
                                </span>
                            </p> -->
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!templateList.length && !error" class="block-error">
                <img :src="$store.state.port.staticPath + '/img/error/ku.png'" alt="">
                <p v-if="keywords">没有找到与“{{keywords}}”相关的模板，换个关键词试试？</p>
                <p v-else>没有找到相关模板，换个关键词试试? </p>
            </div>
            <el-dialog 
                title="选择尺寸" 
                :visible.sync="dialogSizeVisible"
                :close-on-click-modal="false"
                :lock-scroll="false"
                center>
                <div class="diy-header">
                    <div class="often-size">
                        <div class="size-list">
                            <div :class="{'size-item': true, 'active' : activeIndex == i}" v-for="(item,i) in sizeList" :key="i" @click="handleSelected(i,item)">
                                <p class="paper-size-name">{{item.Name}}</p>
                                <p class="paper-size"><span>{{item.ProductWidth}} * {{item.ProductHeight}}{{item.Unit}}</span></p>
                            </div>
                        </div>
                        <div class="start-btn" @click="handleCreate">开启设计</div>
                    </div>
                </div>
            </el-dialog>

            <HomePagination :Page="page" @setTempList="setTempList" v-if="page.totalRecords > 19" />
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
	name: 'templateCenter',
	props: ['center'],
    data () {
        return {
            isAll: true,
            typeList: [],  // 分类列表
            page: {
                currentPage: 1,  // 当前页
                totalRecords: this.center['X-Pagination'].TotalCount,   // 总条数
                pageSize: 19,      // 每页个数
            },
            title: '',
            subtitle: '',
            typeId: null,
            num: null,
            sizeId: '',
            keywords: '',
            templateParam: {  // 获取模板参数
                ProductCategorieNum: null,
                ProductTypeId: null,
                SizeId: '',
                pageIndex: null,
                pageSize: 19,
                SortOrder: 0,
                ChargingMode: '',
                StrFilterValue: '',
                TeamNum: '',
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
            templateList: this.center.Data,  // 模板列表
            image: '/img/home/collect-icon.png',
            collectImage: '/img/home/collect_s_icon_hl.png',
            dialogSizeVisible: false,
            activeIndex: 0,
            size: {width: null, height: null, unit: ''},
            height: '',
            brand: '37px',
            isShow: null,
            error: true,
            filters: null,  // 被选中的分类
        }
    },
    methods: {
        // 点击显示更多
        handleShowMore(i) {
            if(this.$refs.i[i].style.maxHeight == '37px'){
                // this.$refs.i[i].style.maxHeight = 'auto'
                this.$refs.i[i].style.maxHeight = '200px'
            }else{
                this.$refs.i[i].style.maxHeight = '37px'
            }
            this.brand = this.$refs.i[i].style.maxHeight
            this.isShow = i
        },


        // 瀑布流
        waterfall() {
            var box = this.$refs.box
            var items = box.children
            var gap = 20
            this.height = items[1].offsetHeight - 55

            this.$nextTick(() => {
                var pageWidth = box.offsetWidth;
                var itemWidth = items[0].offsetWidth;
                var columns = parseInt(pageWidth / (itemWidth + gap));
                var arr = []
                for(var i=0;i<items.length;i++) {
                    if(i<columns){
                        // 2- 确定第一行
                        items[i].style.top = 0;
                        items[i].style.left = (itemWidth + gap + 5) * i + 'px';
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
            })
        },

        setTempList(msg) {
            this.templateParam.pageIndex = msg
            this.getTempLateList(this.templateParam)
        },

        // 获取模板参数
        getParam() {
            // new Promise((resolve, reject) => {
            //     if(localStorage['teamNum']) this.templateParam.TeamNum = localStorage['teamNum']
            //     let ProductCategorieNum = this.num,
            //         ProductTypeId = this.typeId,
            //         SizeId = this.templateParam.SizeId,
            //         pageIndex = this.page.currentPage,
            //         pageSize = this.page.pageSize,
            //         SortOrder = this.templateParam.SortOrder,
            //         ChargingMode = this.templateParam.ChargingMode,
            //         StrFilterValue = '',
            //         TeamNum = this.templateParam.TeamNum,
            //         keywords = this.keywords
            //     if(this.$route.query.filter) {
            //         StrFilterValue = this.$route.query.filter.replace(/-/g, ',')
            //     }
            //     this.typeList.forEach(item => {
            //         item['FilterValues'].forEach(temp => {
            //             if (!temp['IsEnable']) {
            //                 StrFilterValue += temp.ValueId + ','
            //             }
            //         })
            //     })
            //     if(StrFilterValue.lastIndexOf(',') == StrFilterValue.length - 1) StrFilterValue = StrFilterValue.slice(0, -1)
            //     resolve({ProductCategorieNum, ProductTypeId, SizeId, pageIndex, SortOrder, ChargingMode, StrFilterValue, TeamNum, keywords,pageSize})
            // }).then(obj => {
            //     // console.log(obj)
            //     // this.templateParam = obj
            //     // this.getTempLateList(this.templateParam)
            // })
            if (!this.templateParam.ProductTypeId) return 
            this.$axios.get('/ProductTypeFilter?productTypeID=' + this.templateParam.ProductTypeId).then(res => {
                if(res === undefined) return console.log('没有数据')
                // console.log(res.data)
                this.typeList = res.data.FilterList || []
                if(this.$route.query.filter) {
                    this.filters = this.setFilter(this.$route.query.filter.replace(/-/g, ','))
                }
            })
            this.$axios.get('/ProductTypeSize?TypeID=' + this.templateParam.ProductTypeId).then(result => {
                // console.log(result.data)
                this.size.width = null
                this.size.height = null
                this.sizeList = result.data || []
                if(result.data.length > 0) {
                    this.sizeId = result.data[0].ID
                    this.size.width = result.data[0].ProductWidth
                    this.size.height = result.data[0].ProductHeight
                    this.size.unit = result.data[0].Unit
                }
                this.plate = this.setPlate(this.$route.query.sizeId)
            })
        },

        // 获取模板列表
        getTempLateList(obj) {
            console.log(obj)
            this.templateList = []
            this.error = true
            window.scrollTo(0,0)
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
                this.error = false
                if(res.data.Data.length == 0) this.error = false
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
            })
        },
        // 全部
        handleChangeAll(i) {
            if(!this.typeList[i].IsEnable){
                this.typeList[i].IsEnable = true
                for(var j=0;j<this.typeList[i].FilterValues.length;j++) {
                    this.typeList[i].FilterValues[j].IsEnable = true
                }
                let StrFilterValue = ''
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
            }
        },
        handleChangeValue(item,i,index) {  // 选择行业
            //this.isAll = false
            this.typeList[i].IsEnable = false
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
            if(this.templateParam.pageIndex != 1) {
                this.templateParam.pageIndex = 1
                this.page.currentPage = 1
            }
            this.templateParam.StrFilterValue = StrFilterValue
            this.getTempLateList(this.templateParam)
        },
        handleChooseSort(item){  // 排序
            let id;
            id = item.value
            this.sort = item.title
            if(this.templateParam.pageIndex != 1){
                this.templateParam.pageIndex = 1
                this.page.currentPage = 1
            }
            this.templateParam.SortOrder = id
            this.getTempLateList(this.templateParam)
        },
        handleChoosePrice(item) {  // 价格
            let id;
            id = item.value
            this.price = item.tips
            if(this.templateParam.pageIndex != 1){
                this.templateParam.pageIndex = 1
                this.page.currentPage = 1
            }
            this.templateParam.ChargingMode = id
            this.getTempLateList(this.templateParam)
        }, 
        handleChoosePlate(item) {  // 版式
            let id;
            if(item == '全部'){
                this.plate = item
                id = ''
                this.size.width = null
                this.size.height = null
                this.size.unit = ''
            }else{
                this.plate = item.Name
                id = item.ID
                this.size.width = item.ProductWidth
                this.size.height = item.ProductHeight
                this.size.unit = item.Unit
                this.sizeId = item.ID
            }
            if(this.templateParam.pageIndex != 1){
                this.templateParam.pageIndex = 1
                this.page.currentPage = 1
            }
            this.templateParam.SizeId = id
            this.getTempLateList(this.templateParam)
        },

        // 收藏模板
        handleCollect(i) {
            if(this.templateList[i].IsFavorite == false){
                var formData = new FormData()
                formData.append('TemplateNumber', this.templateList[i].TemplateNumber);
                formData.append('TeamNum', localStorage['teamNum'])
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
                formData.append('TeamNum', localStorage['teamNum'])
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

        handleSelected(i,item){
            this.activeIndex = i
            this.sizeId = item.ID
            this.size.width = item.ProductWidth
            this.size.height = item.ProductHeight
            this.size.unit = item.Unit
        },

        // 去制作
        handleToDesign(item) {
            if (!localStorage['token']) return this.$store.commit('login/toggleShow', true)
            var formData = new FormData()
            formData.append('TemplateNumber', item.TemplateNumber);
            formData.append('TeamNum', localStorage['teamNum']);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            var url = window.open('/design', '_blank')
            this.$axios.post('/CopyTemplate', formData, config).then(res => {
                if(res.data == '') return console.log('没有返回')
                // console.log(res.data)
                let str = 'DocumentNumber=' + res.data
				str = window.btoa(str);
				// var a = document.createElement('a')
				// 	a.target = "_blank"
				// 	a.href = '/design/' + str;
				// 	a.click();
				// 	a = null;
				// url.location = '/design/' + str
				url.location.replace('/design/' + str)
            })
        },

        // 创建空白画布
        handleCreatTemplate() {
            if(!localStorage['token']) return this.$store.commit('login/toggleShow', true)
            if(this.sizeList.length > 1) {
                this.dialogSizeVisible = true
            }else{
                this.handleCreate()
            }
        },
        handleCreate() {
            let classNum = this.templateParam.ProductCategorieNum;
            let typeId = this.templateParam.ProductTypeId;
            let sizeId = this.sizeId
            let teamNum = localStorage['teamNum']
            if(sizeId && typeId && classNum){
                var obj = {
                    ProductCategorieNum: classNum,
                    TypeId: typeId,
                    SizeId: sizeId,
                    Name: '未命名',
                    TeamNum: teamNum,
                    Pages: [{
                        JsonContent: '[]',
                        SvgContent: ''
                    }]
                }
                // console.log(obj, '创建参数')
                var url = window.open('/design', '_blank')
                this.$axios.post(this.$store.state.port.TeamTemplate,obj).then(res =>{
                    if(res.data == 'NoAuthority') return this.$message('没有权限')
                    // console.log(JSON.parse(res.data))
                    this.dialogSizeVisible = false
                    let data = JSON.parse(res.data)
                    let str = 'DocumentNumber=' + data.DocumentNumber
					str = window.btoa(str)
					// var a = document.createElement('a')
					// a.target = "_blank"
					// a.href = '/design/' + str;
					// a.click();
					// console.log(a)
					// a = null;
                    url.location.replace('/design/' + str)
                })
            }else{
                console.log('缺少必要参数')
            }
        },

        setPlate(index) {
            if(!index) return plate = '全部'
            let plate;
            this.sizeList.forEach(item => {
                if(index.indexOf(item.ID) > -1) {
                    plate = item.Name
                }
            })
            // console.log(plate)
            return  plate
        },
        setFilter(data) {
            if(!data) return
            let arr = [];
            this.typeList.forEach(item => {
                let all = false;
                item.IsEnable = true
                item.FilterValues.forEach((filter,i) => {
                    if(data.indexOf(filter.ValueId) > -1) {
                        filter.IsEnable = false
                        all = true
                    }
                })
                if(all) item.IsEnable = false
                arr.push(item)
            })
            // console.log(arr)
            return
        },
	},
	watch: {
		$route(to,from) {
			// console.log(to,from)
			let query = to.query;
			this.title = query.title;
			this.keywords = this.$route.query.k || '';
			this.subtitle = query.subtitle;
			this.templateParam.ProductCategorieNum = query.n
            this.templateParam.ProductTypeId = query.id
            this.typeId = query.id
            // this.getTempLateList(this.templateParam)
            this.getParam()
		}
	},
    mounted() {
        // console.log(this.$route.query)
        this.title = this.$route.query.title || ''
        this.subtitle = this.$route.query.subtitle || ''
        this.templateParam.ProductTypeId = this.$route.query.id || ''
        this.templateParam.ProductCategorieNum = this.$route.query.n || ''
        this.keywords = this.$route.query.k || ''
        this.templateParam.SizeId = this.$route.query.sizeId || ''

        document.head.querySelector('title').innerHTML = `免费${this.subtitle}模板列表_海量免费${this.subtitle}模板无限制使用_免费下载${this.subtitle}高清无水印文件_阿里印`
		
		this.getParam();
        window.scrollTo(0,0)

        console.log(this.center)

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
        flex-shrink: 0;
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
        padding: 20px 20px 19px 20px;
        margin-top: 25px;
        margin-bottom: 25px;
        .template-types-item{
            width: 100%;
            max-height: 40px;
            display: flex;
            margin-bottom: 10px;
            overflow: hidden;
            position: relative;
            transition: max-height .5s;
            .template-types-selector-list{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                .template-types-selector-item-all{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    // padding: 6px 18px;
                    border-radius: 15px;
                    min-width: 60px;
                    height: 28px;
                    color: rgba(51,51,51,1);
                    cursor: pointer;
                    position: relative;
                    // margin: 3px 0;
                    margin-top: 5px;
                    margin-right: 15px;
                    &:hover{
                        background: rgba(227,228,233,1);
                        color: rgba(0,0,0,.6);
                    }
                }
                .isText{
                    background: $color;
                    color: rgba(255,255,255,1);
                    &:hover{
                        background: $color;
                        color: rgba(255,255,255,1);
                    }
                }
            }
            .template-types-selector-item{
                display: flex;
                align-items: center;
                font-size: 14px;
                color: rgba(51,51,51,1);
                cursor: pointer;
                position: relative;
                // margin: 3px 0;
                margin-top: 5px;
                margin-bottom: 5px;
                i{
                    display: inline-block;
                    width: 100%;
                    line-height: 21px;
                    background: rgba(0,0,0,.1);
                    font-weight: bold;
                    color: rgba(255,255,255,1);
                    text-align: center;
                    position: absolute;
                    top: 4px;
                    left: 0;
                }
                .template-types-selector-item-line{
                    padding: 6px 15px;
                    border-radius: 15px;
                    min-width: 60px;
                    text-align: center;
                    &:hover{
                        // background: $color;
                        // color: white;
                        background: rgba(227,228,233,1);
                        color: rgba(0,0,0,.6);
                    }
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
                .active{
                    background: $color;
                    color: white;
                    &:hover{
                        background: $color;
                        color: white;
                    }
                }
            }
            .template-types-selector-item:not(:last-child){
                margin-right: 13px;
            }
            .template-types-selector-more-show{
                display: flex;
                align-items: center;
                position: absolute;
                top: 11px;
                right: 0;
                font-size: 14px;
                cursor: pointer;
            }
        }
        .template-types-select{
            display: flex;
            font-size:14px;
            color:rgba(102,102,102,1);
            margin-right: 35px;
            .types-dropdown{
                position: relative;
                // &:hover::before{
                //     transform: rotate(180deg);
                // }
                &:hover .dropdown-menu{
                    display: block;
                }
                // &::before{
                //     content: '';
                //     position: absolute;
                //     top: 16px;
                //     right: 12px;
                //     background-image: url(/img/home/drop_down.png);
                //     width: 11px;
                //     height: 6px;
                //     transition: transform .4s ease;
                // }
                .dropdown-link{
                    display: inline-block;
                    border: 1px solid rgba(210,210,210,1);
                    border-radius: 5px;
                    height: 37px;
                    width: 131px;
                    line-height: 37px;
                    padding-left: 20px;
                    cursor: pointer;
                    position: relative;
                    &:hover i{
                        transform: rotate(180deg);
                    }
                    i{
                        display: inline-block;
                        position: absolute;
                        top: 16px;
                        right: 12px;
                        // background-image: url(/img/home/drop_down.png);
                        width: 11px;
                        height: 6px;
                        transition: transform .4s ease;
                    }
                }
                .dropdown-menu{
                    display: none;
                    width: 100%;
                    height: auto;
                    background: rgba(255,255,255,1);
                    position: absolute;
                    top: 37px;
                    left: 0;
                    z-index: 10;
                    text-align: left;
                    padding: 10px 0;
                    box-shadow: 2px 10px 12px 0 rgba(18,38,101,.1);
                    border-radius: 5px;
                    .dropdown-item{
                        display: flex;
                        flex-direction: column;
                        line-height: 30px;
                        padding-left: 30px;
                        width: 100%;
                        cursor: pointer;
                        &:hover{
                            background: rgba(243,244,249,1);
                            color: $color;
                        }
                    }
                    .active{
                        background: rgba(243,244,249,1);
                        color: $color;
                    }
                }
            }
        }
    }
    .template-center-list{
        // padding-top: 25px;
        position: relative;
        .template-center-item{
            position: absolute;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
            transition: all .5s;
            &:hover{
                box-shadow: 0 4px 15px rgba(0,0,0,.1);
                transform: translateY(-5px);
            }
            .template-center-block{
                .modal-block-img-wrap{
                    width: 280px;
                    //margin: 0 0 16px;
                    border-radius: 10px 10px 0 0;
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    .empty{
                        position: relative;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                    .empty>span{
                        display: block;
                        width: 100%;
                        height: 100%;
                        background: rgba(203,216,226,1);
                        i{
                            display: inline-block;
                            position: absolute;
                            width: 57px;
                            height: 57px;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                        }
                    }
                }
                .modal-block-text-empty{
                    width: 100%;
                    height: 55px;
                    padding: 8px;
                    text-align: center;
                    span:first-child{
                        display: inline-block;
                        font-size: 18px;
                        color: rgba(51,51,51,1);
                        line-height: 20px;
                    }
                }
            }
            .template-center-block {
                width: 280px;
                background: rgba(255,255,255,1);
                border-radius: 10px;
                .block-img-wrap{
                    position: relative;
                    &:hover .block-img-mask{
                        // display: block;
                        opacity: 1;
                    }
                    .image{
                        width: 100%;
                        display: block;
                        border-radius: 10px 10px 0 0;
                    }
                    .block-img-mask{
                        width: 100%;
                        height: 100%;
                        background:rgba(0,0,0,.3);
                        // display: none;
                        opacity: 0;
                        transition: opacity .4s ease;
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
                        // .design-btn{
                        //     width:167px;
                        //     height:42px;
                        //     background:rgba(0,131,233,1);
                        //     border-radius:5px;
                        //     border: 1px solid rgba(0,131,233,1);
                        //     position: absolute;
                        //     top: 169px;
                        //     left: 56px;
                        //     color:rgba(254,254,254,1);
                        //     font-size:18px;
                        // }
                    }
                }
            }
            .template-center-block .template-center-item-bottom{
                padding: 18px;
                display: flex;
                justify-content: space-between;
                .shop-title{
                    font-size: 16px;
                    color: rgba(51,51,51,1);
                    width: 180px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                // .shop-tips{
                //     display: flex;
                //     justify-content: space-between;
                //     font-size: 14px;
                //     color: rgba(153,153,153,1);
                // }
            }
        }
    }
    .template-center-item .template-center-block:hover .block-img-wrap .block-img-mask{
        display: block;
    }
    .block-error{
        text-align: center;
        padding-bottom: 100px;
        p{
            font-size: 18px;
            color: rgba(51,51,51,1);
        }
    }
}

.template-center /deep/ .el-dialog{
    width: 630px;
    border-radius:10px;
    text-align: center;
    user-select: none;
    .el-dialog__header{
        padding: 25px 20px 0;
        line-height: 21px;
        font-size:23px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(51,51,51,1);
        position: relative;
        .el-dialog__headerbtn{
            position: absolute;
            top: 17px;
            right: -45px;
            .el-dialog__close{
                width: 24px;
                height: 24px;
                color: rgba(255,255,255,1);
                background-image: url(/img/home/fork_white.png);
                &::before{
                    content: '';
                }
            }
        }
    }
    .el-dialog__body .diy-header{
        padding: 62px 55px 40px 48px;
        .size-list{
            display: flex;
            .size-item{
                width: 125px;
                line-height: 20px;
                background:rgba(191,191,191,1);
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                font-size: 14px;
                border-radius: 5px;
                margin-right: 20px;
                text-align: center;
                padding: 12px 0;
                cursor: pointer;
                &:hover{
                    background: $gradient;
                }
                .paper-size-name{
                    font-size: 20px;
                    margin-bottom: 12px;
                }
            }
            .active{
                background: $gradient;
            }
        }
        .start-btn{
            border-radius:5px;
            width: 179px;
            line-height: 48px;
            text-align: center;
            font-size:18px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(254,254,254,1);
            background: $color;
            margin: 64px auto 25px;
            cursor: pointer;
            user-select: none;
        }
    }
}

</style>
