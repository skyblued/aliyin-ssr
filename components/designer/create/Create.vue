<template>
    <div class="create">
        <div class="pic">
            <!-- <div class="hr-all">
                <i></i>
                <div class="hr-title">常用场景</div>
            </div>
            <div class="pic-list" v-if="List.length">
                <div class="pic-item" v-for="(item,i) in List[0].ProductTypeList.slice(0,6)" :key="i" @click="handleChoseTemp(i,item)">
                    <div class="pic-img">
                        <img :src="$store.state.port.imgBaseUrl+item.ImageUrl" alt="">   
                    </div>
                    <p class="pic-title">{{item.TypeName}}</p>
                    <p class="size">2480*3360px</p>
                </div>
                <div class="pic-item" @click="dialogDiyVisible = true">
                    <div class="svg">
                        <img src="/img/personal/diy-size.png" alt="">
                    </div>
                    <p class="pic-title">自定义尺寸</p>
                </div>
            </div> -->
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
                    <el-dialog 
                        title="自定义尺寸"
                        :visible.sync="dialogDiyVisible"
                        :modal-append-to-body="false"
                        :lock-scroll="false"
                        :close-on-click-modal="false"
                        center>
                        <div class="diy-header">
                            <div class="often-size">
                                <div class="size-list">
                                    <div :class="{'size-item': true, 'active' : activeIndex == i}" v-for="(item,i) in sizeList" :key="i" @click="handleSelected(i,item)">
                                        <p class="paper-size-name">{{item.Name}}</p>
                                        <p class="paper-size"><span>{{item.Width}} * {{item.Height}}mm</span></p>
                                    </div>
                                </div>
                                <div class="start-btn" @click="handleCreate">开启设计</div>
                            </div>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            List: [],
            dialogDiyVisible: false,
            activeIndex: 0,
            sizeList: [],
            typeId: '',     // 当前模板ID
            // 类型ID
			classNum: null,
			// 模板尺寸 (SizeId)
			sizeId: '',
			// 模板尺寸比
			size: {width: 92, height: 56},
        }
    },
    methods: {


        handleSelected(i,item) {
            console.log(item, 132)
            this.activeIndex = i
            this.sizeId = item.ID
            this.size.width = item.Width
            this.size.height = item.Height
        },
        getData() {
            this.$axios.get(this.$store.state.port.AllTemplate).then((res) => {
                //console.log(res.data)
                this.List = res.data
            })
        },
        handleChoseTemp(i,tmp) {
            //console.log(tmp)
            this.dialogDiyVisible = true
            this.typeId = tmp.TypeId
            this.classNum = this.List[i].ClassNum
            var url = '/ProductTypeSize?TypeID='+ this.typeId
            this.$axios.get(url).then(res => {
                if(res.data.length == 0){
                    this.sizeList = []
                    return
                }else{
                    this.sizeList = res.data
                    this.sizeId = res.data[0].ID
                }
            })
        },
        // 设计师创建空白模板
        handleCreate() {
            let sizeId = this.sizeId
            let typeId = this.typeId
            let classNum = this.classNum 
            if(sizeId && typeId && classNum){
                var obj = {
                    ProductCategorieNum: classNum,
                    ProductTypeId: typeId,
                    SizeId: sizeId,
                    Name: '未命名',
                    TemplatePages: [{
                        JsonContent: '[]',
                        SvgContent: '',
                    }]
                }
                this.$axios.post(this.$store.state.port.DesignerTemplate,obj).then(res =>{
                    console.log(JSON.parse(res.data))
                    let data = JSON.parse(res.data)
                    let str = 'TemplateNumber=' + data.TemplateNumber
                    str = window.btoa(str)
                    window.open('/designer/'+ str)
                })
            }else{
                console.log('缺少必要参数')
            }
        },
    },
    mounted() {
        this.getData()
    }
}
</script>

<style lang="scss" scoped>

.create{
    padding: 83px 0 0 64px;
    min-width: 1200px;
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

// 分类模板样式
.chat-list .hr-all i{
    background:rgba(255,157,55,1);
}
.chat-list{
    margin-top: 69px;
    .chat-media{
        margin-bottom: 30px;
    }
}

// 自定义尺寸样式
.create /deep/ .el-dialog{
    width: 630px;
    border-radius:10px;
    text-align: center;
    box-shadow: none;
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
    .el-dialog__body{
        padding: 0;
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

</style>
