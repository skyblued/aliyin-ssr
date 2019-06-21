<template>
    <div class="main">
        <!-- <div class="pic">
            <div class="hr-all">
                <i></i>
                <div class="hr-title">常用场景</div>
            </div>
            <div class="pic-list" v-if="List.length">
                <div class="pic-item" v-for="(item,i) in List[0].ProductTypeList.slice(0,6)" :key="i" @click="handleToTempcenter(item)">
                    <div class="pic-img">
                        <img :src="$store.state.port.imgBaseUrl+item.ImageUrl" alt="">   
                    </div>
                    <p class="pic-title">{{item.TypeName}}</p>
                    <p class="size"></p>
                </div>
                <div class="pic-item" @click="dialogDiyVisible = true">
                    <div class="svg">
                        <img :src="$store.state.port.staticPath + '/img/personal/diy-size.png'" alt="">
                    </div>
                    <p class="pic-title">自定义尺寸</p>
                </div>
            </div>
            <el-dialog 
                title="自定义尺寸"
                :visible.sync="dialogDiyVisible"
                :lock-scroll="false"
                center>
                <div class="diy-header">
                    <div class="often-size">
                        <div class="size-list">
                            <div :class="{'size-item': true, 'active' : activeIndex == i}" v-for="(item,i) in sizeList" :key="i" @click="handleSelected(i,item)">
                                <p class="paper-size-name">{{item.Name}}</p>
                                <p class="paper-size"><span>{{item.Width}}*{{item.Length}}mm</span></p>
                            </div>
                        </div>
                        <div class="start-btn" @click="handleCreate">开启设计</div>
                    </div>
                </div>
            </el-dialog>
        </div> -->
        <div v-if="dialogVisible">
            <el-dialog
                width="90%"
                :visible.sync="dialogVisible"
                :fullscreen="fullscreen"
                top="10vh"
                class="modal">
                <div slot="title" class="dialog-header">
                    <div class="modal-title">
                        <i class="modal-title-icon" ></i>
                        <span class="modal-title-firstname">{{title}}</span>
                        <span class="modal-title-line"></span>
                        <span class="modal-title-kindname">{{subtitle}}</span>
                    </div>
                    <div class="modal-headerbtn">
                        <span class="modal-headerbtn-maximize" title="放大" @click="max" v-show="!isMax">
                            <i class="el-icon-rank"></i>
                        </span>
                        <span class="modal-headerbtn-maximize" title="缩小" @click="min" v-show="isMax">
                            <i class="el-icon-remove-outline"></i>
                        </span>
                    </div>
                </div>
                <div class="dialog-body">
                    <el-scrollbar wrap-class="list" view-class="view-box" :native="false" style="height: 100%;">
                    <div class="modal-container">
                        <table></table>
                        <KindSelect v-if="typeId" @setSizeID="setSizeID" :typeid="typeId" />
                        <div class="modal-block-list">
                            <div class="modal-block-item">
                                <div @click="handleCreatTemplate" class="modal-block">
                                    <div class="modal-block-img-wrap">
                                        <div class="empty">
                                            <span></span>
                                        </div>
                                    </div>
                                    <div class="modal-block-text-empty">
                                        <span>开启空白画布</span>
                                        <br>
                                        <span>尺寸：{{size.width}} * {{size.height}}</span>
                                    </div>
                                </div>
                            </div> 
                            <div class="modal-block-item" v-for="(item,index) in TemplateList" :key="index">
                                <div class="modal-block">
                                    <div class="modal-block-img-wrap"  @click="handleToDesign(item,index)">
                                        <img :src="$store.state.port.imgBaseUrl+item.FacePicture" alt="">
                                        <div class="block-img-mask">
                                            <div class="tooltip" :data-tip="item.IsFavorite == true ? '取消' : '收藏'" @click.stop="collect(index)">
                                                <img class="delete-img" :src="item.IsFavorite == true ? collectImage : image" alt="">
                                            </div>
                                            <span class="useTemplate" @click.stop="handleJump(index,item)">预览</span>
                                        </div>
                                    </div>
                                    <div class="modal-block-text">
                                        <p class="modal-block-title-wrap">
                                            <router-link :to="{path: '/detail', query: {t: TemplateList[index].TemplateNumber}}"><span class="modal-block-title">{{item.Name}}</span></router-link>
                                        </p>
                                        <p class="modal-block-kind-wrap">
                                            <span class="modal-block-kind">{{subtitle}}</span>
                                            <span class="modal-block-visited">
                                                {{item.Counts}}人使用 
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                    </el-scrollbar>
                    <div class="block-pagination">
                        <HomePagination :Page="page" @getTempList="getTemplateList" />
                    </div>
                </div>
            </el-dialog>
        </div>

        <!--分类模板-->
        <div class="chat-list">
            <div class="chat-media" v-for="(item,i) in List" :key="i">
                <div class="hr-all">
                    <i></i>
                    <div class="hr-title">{{item.ClassName}}</div>
                </div>
                <div class="pic-list">
                    <div class="pic-item" v-for="(tmp,index) in item.ProductTypeList" :key="index" @click="handleChoseTemp(i,tmp)">
                        <div class="pic-img">
                            <img :src="$store.state.port.imgBaseUrl+tmp.ImageUrl" alt="">
                        </div>
                        <p class="pic-title">{{tmp.TypeName}}</p>
                        <p class="size"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import KindSelect from '@/components/templateCenter/KindSelect.vue'
import HomePagination from '@/components/home/HomePagination.vue'
// import SearchList from '@/components/templateCenter/SearchList.vue'
export default {
    data () {
        return {
            dialogVisible: false,
            dialogDiyVisible: false,  // 显示自定义尺寸弹框
            activeIndex: 1,
            fullscreen: false,
            isMax: false,
            currentPage: 1,
            imgList: [],
            sizeList: [],
			// 类型ID
			classNum: null,
			// 模板尺寸 (SizeId)
			// sizeId: 1,
			// 模板尺寸比
            ratio: 0.6086956521739131,
            size: {width: 92, height: 56},
            title: '',     // 当前模板名称在弹框上显示的一级标题
            subtitle: '',   // 当前模板名称在弹框上显示的二级标题
            productnum: '',
            typeId: '',     // 当前模板ID
            TemplateList: [],  // 模板列表
            values: {
                sizeId: '',
                sortId: '',
                priceId: '',
                valueId: ''
            },
            page: {
                totalRecords: 0,   // 总条数
                currentPage: 1,  // 当前页
                pageSize: null,  // 每页个数
            },
            image: '/img/home/collect-icon.png',
            collectImage: '/img/home/collect_s_icon_hl.png'
        }
    },
    props: ['List'],
    methods: {

		/**
		 * 创建空白模板
		 */
		handleCreatTemplate () {
            let classNum = this.classNum;
            let typeId = this.typeId;
            let sizeId = this.values.sizeId
            let teamNum = sessionStorage['teamNum']
            console.log(classNum,typeId,sizeId)
            if(sizeId && typeId && classNum){
                var obj = {
                    ProductCategorieNum: classNum,
                    ProductTypeId: typeId,
                    SizeId: sizeId,
                    Name: '未命名',
                    TeamNum: teamNum,
                    Pages: [{
                        JsonContent: '[]',
                        SvgContent: ''
                    }]
                }
                console.log(obj, '创建参数')
                this.$axios.post(this.$store.state.port.TeamTemplate,obj).then(res =>{
                    //console.log(JSON.parse(res.data))
                    let data = JSON.parse(res.data)
                    let str = 'DocumentNumber=' + data.DocumentNumber
                    str = window.btoa(str)
                    window.open('/designer/'+ str, '_blank')
                })
            }else{
                console.log('缺少必要参数')
            }
		},

        max() {
            this.fullscreen = true
            this.isMax = true
        },
        min() {
            this.isMax = false
            this.fullscreen = false
        },
        // 收藏
        collect(i) {
            if(this.TemplateList[i].IsFavorite == false){
                var formData = new FormData()
                formData.append('TemplateNumber', this.TemplateList[i].TemplateNumber);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/FavoritedTemplate', formData, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '收藏成功'})
                        this.TemplateList[i].IsFavorite = true
                    }else{
                        this.$message({type: 'error', message: '收藏失败'})
                        return
                    }
                })
            }else{
                var formData = new FormData()
                formData.append('TemplateNumber', this.TemplateList[i].TemplateNumber);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/FavoritedTemplate', {data: formData}, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '取消收藏成功'})
                        this.TemplateList[i].IsFavorite = false
                    }else{
                        this.$message({type: 'error', message: '取消收藏失败'})
                        return
                    }
                })
            }
		},
		// 设置版本样式
		setSizeID (obj) {
			console.log(obj)
			this.values.sizeId = obj.id
			this.size = obj.size
        },
        // 选择模板弹框
        handleChoseTemp(i,item) {
			this.dialogVisible = true
            this.title = this.List[i].ClassName
            this.productnum = item.FromClass
            this.subtitle = item.TypeName
			this.typeId = item.TypeId
            this.classNum = this.List[i].ClassNum
            this.getTemplateList()
            // console.log(this.List[i], '弹出')
        },
        // 获取模板列表
        getTemplateList() {
            var formData = new FormData()
            formData.append('ProductCategorieNum', this.productnum)
            formData.append('ProductTypeId', this.typeId);
            formData.append('SizeId', this.values.sizeId);
            formData.append('pageIndex', this.page.currentPage);
            formData.append('SortOrder', this.values.sortId);
            formData.append('ChargingMode', this.values.priceId);
            formData.append('FilterValue', this.values.valueId);
            formData.append('TeamNum', sessionStorage['teamNum'])
            //console.log(this.typeId,this.values.sizeId,this.values.sortId,this.values.priceId)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TemplateCenter', formData, config).then(res => {
                console.log(res.data)
                this.TemplateList = res.data.Data
                this.page.totalRecords = res.data['X-Pagination'].TotalCount
                this.page.pageSize = Math.ceil(res.data['X-Pagination'].TotalCount / res.data['X-Pagination'].TotalPages)
            })
        },
        // 参数
        getValue() {
            this.$root.$on('setPassValue', (val) => {
                // console.log(val)
                this.values.sortId = val.sortId
                this.values.priceId = val.priceId
                this.values.valueId = val.valueId
            })
        },
        // 点击模板进入设计器
        handleToDesign(item,index) {
            console.log(item)
            // 如果是免费模板直接进入设计器
            if(this.TemplateList[1].Price == 0){
                let str = 'TemplateNumber=' + item.TemplateNumber
                str = window.btoa(str)
                var url = this.$router.resolve('/designer/' + str)
                window.open(url.href,'_blank')
            }else{   // 如果是收费或者会员免费进入模板详请页
                this.$router.push({path: '/detail', query: {t: this.TemplateList[index].TemplateNumber}})
            }
        },
        // 预览跳转到模板详情页
        handleJump(index,item){
            console.log(item, 456)
            this.$router.push({path: '/detail', query: {t: this.TemplateList[index].TemplateNumber}})
        },
        handleSelected(i,item) {
            this.activeIndex = i
            this.values.sizeId = item.ID
            this.size.width = item.Width
            this.size.height = item.Length
        },
        // 常用尺寸 开启设计
        // handleCreate() {
        //     let sizeId = this.values.sizeId
        //     let typeId = this.typeId
        //     let classNum = this.classNum;
        //     let teamNum = sessionStorage['teamNum']
        //     if(sizeId && typeId && classNum){
        //         var obj = {
        //             ProductCategorieNum: classNum,
        //             ProductTypeId: typeId,
        //             SizeId: sizeId,
        //             Name: '未命名',
        //             TeamNum: teamNum,
        //             Pages: [{
        //                 JsonContent: '[]',
        //                 SvgContent: ''
        //             }]
        //         }
        //         this.$axios.post(this.$store.state.port.TeamTemplate,obj).then(res =>{
        //             //console.log(JSON.parse(res.data))
        //             let data = JSON.parse(res.data)
        //             let str = 'DocumentNumber=' + data.DocumentNumber
        //             str = window.btoa(str)
        //             window.open('/designer/'+ str)
        //         })
        //     }else{
        //         console.log('缺少必要参数')
        //     }
        // },

        // 跳转到模板中心
        handleToTempcenter(item) {
            let subtitle = item.TypeName
            let typeId = item.TypeId
            let num = item.FromClass
            var j=0
            for(var i=0;i<this.List.length;i++){
                if(num == this.List[i].ClassNum){
                    j = i
                }
            }
            let title = this.List[j].ClassName
            this.$router.push({path: '/tempcenter', query: {subtitle,typeId,title,num}})
        },
        getProductSize() {
            var url = '/ProductTypeSize?TypeID=' + 14;
            this.$axios.get(url).then(result => {
                //console.log(result.data)
                this.sizeList = result.data
            })
        },
    },
    mounted() {
        this.getValue()
        this.getProductSize()
    },
    watch: {
        values: {   // 监听参数对象
            handler(val) {
                this.getTemplateList()
            },
            deep: true
        }
    },
    components: {
        KindSelect,
        HomePagination
        // SearchList
    }
}
</script>

<style lang="scss" scoped>

.main img{
    cursor: pointer;
}

.dialog-header{
    width: 100%;
    height: 62px;
    background: #fff;
    box-shadow: 0 0 10px #c7c7c7;
}
.main{
    padding-top: 49px;
    padding-left: 64px;
    height: auto;
    background:rgba(236,236,236,1);
}
.hr-all{
    text-align: left;
    display: flex;
    line-height: 14px;
    i{
        width:5px;
        height:16px;
        background:rgba(70,192,177,1);
        margin-right: 10px;
    }
    .hr-title{
        font-size:17px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
}

.pic-list{
    margin-top: 31px;
    margin-left: 19px;
}
.pic-item{
    margin-right: 33px;
    margin-bottom: 36px;
    width: 120px;
    height: 187px;
    vertical-align: bottom;
    cursor: pointer;
    display: inline-block;
    transition: all .5s;
    font-family:MicrosoftYaHei;
    font-weight:400;
    text-align: center;
    .pic-title{
        font-size:14px;
        color:rgba(102,102,102,1);
        margin-top: 16px;
        margin-bottom: 11px;
    }
    .size{
        font-size:12px;
        color:rgba(153,153,153,1);
    }
}
.pic-item:hover .pic-title{
    font-weight: bold;
}
.pic-img{
    vertical-align: bottom;
    display: table-cell;
    height: 125px;
    width: 120px;
    text-align: center;
}
.pic-img img{
    max-height: 120px;
    max-width: 120px;
    //transition: box-shadow .4s ease;
}
.svg{
    vertical-align: bottom;
    text-align: center;
    margin-top: 24px;
}


// 自定义尺寸样式
.main /deep/ .pic .el-dialog{
    width: 630px;
    border-radius:10px;
    text-align: center;
    .el-dialog__header{
        padding: 25px 20px 0;
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
            }
        }
    }
    .el-dialog__body{
        padding: 0;
    }
    .el-dialog__body .diy-header{
        padding: 32px 55px 40px 48px;
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
                margin-right: 20px;
                text-align: center;
                padding: 12px 0;
                cursor: pointer;
                &:hover{
                    background: linear-gradient(-37deg,rgba(4,224,255,1) 0%,rgba(92,164,255,1) 100%);
                }
                .paper-size-name{
                    font-size: 20px;
                    margin-bottom: 12px;
                }
            }
            .active{
                background: linear-gradient(-37deg,rgba(4,224,255,1) 0%,rgba(92,164,255,1) 100%);
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









.main /deep/ .el-dialog__header, .main /deep/ .el-dialog__body, .main /deep/ .el-dialog__footer{
    padding: 0;
    user-select: none;
}
.main /deep/ .modal .el-dialog{
    min-width: 1500px;
    .el-dialog__header .el-dialog__headerbtn{
        position: absolute;
        top: 15px;
        right: 10px;
        .el-dialog__close{
            width: 24px;
            height: 24px;
            background-image: url(/img/home/fork_gray.png);
            &::before{
                content: '';
            }
        }
    }
    .el-dialog__body{
        height: 100%;
    }
    .el-dialog__body .block-pagination .home-pagination .block{
        margin: 0;
        margin-bottom: 20px;
    }
}

.modal-title{
    float: left;
    line-height: 62px;
    color: #626262;
}
.dialog-header .modal-title-icon{
    margin-left: 24px;
    width: 27px;
    height: 22px;
    display: inline-block;
    vertical-align: middle;
    background-image: url(/img/home/wechat.png);
}
.dialog-header .modal-title-firstname{
    font-size: 18px;
    margin-left: 15px;
}
.dialog-header .modal-title-line{
    width: 22px;
    height: 22px;
    display: inline-block;
    border-left: 1px solid #626262;
    transform: rotate(45deg);
    position: relative;
    top: 12px;
    left: 7px;
}
.dialog-header .modal-title-kindname{
    font-size: 14px;
}
.modal-headerbtn{
    float: right;
    line-height: 62px;
}
.modal-headerbtn span{
    margin-right: 50px;
    position: relative;
    bottom: 4px;
}
.modal-headerbtn i{
    font-weight: 700;
    font-size: 20px;
    vertical-align: middle;
    color: #9b9b9b;
    cursor: pointer;
}
.dialog-body{
    width: 100%;
    height: 100%;
    background: #f1f1f2;
    overflow: hidden;
    padding: 0 30px 88px;
    position: relative;
    .modal-container{
        width: 100%;
        //padding-left: 8px;
        position: relative;
    }
}
// .list{
//     max-height: 300px;
// }
.dialog-body /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
}
.modal-block-list{
    width: 100%;
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
}
.modal-block-item{
    width: 240px;
    height: 189px;
    margin: 8px 20px 0 0;
    overflow: hidden;
}
.modal-block{
    position: absolute;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    transition: all .3s;
    &:hover{
        box-shadow: 0 4px 15px rgba(0,0,0,.2);
        transform: translateY(-3px);
    }
}
.modal-block:hover .modal-block-img-wrap .block-img-mask{
    display: block;
}
.modal-block .modal-block-img-wrap{
    width: 240px;
    height: 115px;
    margin: 0 0 16px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
}
.modal-block .modal-block-img-wrap img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
.modal-block .modal-block-img-wrap .empty{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.modal-block .modal-block-img-wrap .empty>span{
    display: block;
    width: 100%;
    height: 100%;
    background: #f9f9f9;
}
.modal-block .modal-block-img-wrap .empty>span:after{
    content: "";
    position: absolute;
    width: 93px;
    height: 80px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: url(//static.chuangkit.com/dist/emptyIcon.svg?672ec9f640d330750ff302ca17fe3deb) no-repeat;
}
.modal-block-text-empty{
    width: 100%;
    height: 42px;
    margin-bottom: 10px;
    text-align: center;
}
.modal-block-text-empty span:first-child{
    font-size: 14px;
    color: #9b9b9b;
    line-height: 20px;
}
.modal-block-text-empty span:last-child{
    font-size: 12px;
    color: #bfbfbf;
}
.modal-block .modal-block-img-wrap .block-img-mask{
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
        line-height: 35px;
        background:rgba(255,255,255,1);
        border-radius:5px;
        position: absolute;
        left: 15px;
        top: 15px;
        img{
            width: 20px;
            height: 18px;
            margin: 8px;
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
}

.block-img-mask .useTemplate{
    float: right;
    margin: 16px;
    border-radius: 4px;
    display: block;
    width: 50px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #fff;
    background: $color;
    text-align: center;
    position: relative;
    &:hover{
        background: #0893ff;
    }
}
.modal-block .modal-block-text{
    width: 100%;
    height: 42px;
    padding: 0 12px;
    margin-bottom: 10px;
}
.modal-block .modal-block-text p{
    margin: 0 0 8px;
}
.modal-block .modal-block-text{
    background: transparent;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    transition: color .5s ease;
}
.modal-block .modal-block-text .modal-block-title-wrap{
    height: 14px;
}
.modal-block .modal-block-text .modal-block-title-wrap .modal-block-title{
    // float: left;
    color: #626262;
    font-size: 14px;
    width: 150px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
    &:hover{
        color: $color;
    }
}
.modal-block .modal-block-text .modal-block-kind-wrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.modal-block .modal-block-text .modal-block-kind-wrap .modal-block-kind{
    color: #bfbfbf;
    font-size: 12px;
}
.modal-block .modal-block-text .modal-block-kind-wrap .modal-block-visited{
    display: flex;
    align-items: baseline;
    font-size: 12px;
    color: #bfbfbf;
}
.block-pagination{
    position: absolute;
    right: 110px;
    bottom: 0;
}

// 分类模板

.chat-list .hr-all i{
    background:rgba(255,157,55,1);
}
.chat-list{
    margin-top: 69px;
    .chat-media{
        margin-bottom: 30px;
    }
    .chat-media:last-child{
        margin-bottom: 0;
    }
}
</style>
