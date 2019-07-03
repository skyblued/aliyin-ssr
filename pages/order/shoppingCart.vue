<template>
    <div id="shopping">
        <div class="shopping" v-if="empty && lg == true">
            <div class="shopping-list">
                <div class="shopping-list-header">
                    <div class="check-wrap">
                        <div :class="{'check-icon': true, 'check-icon-checked': checkAll}" @click="handleSelectAllChange"></div>
                        <span>全选</span>
                    </div>
                    <p class="shopping-info-title">商品信息</p>
                    <p class="file-info-title">文件信息</p>
                    <p class="shopping-number-title">数量</p>
                    <p class="subtotal-title">小计(元)</p>
                    <p class="operate-title">操作</p>
                </div>
                <div class="shopping-item" v-for="(item,i) in tableData" :key="i">
                    <div class="select-wrap">
                        <div :class="{'select-icon':true, 'selected-icon' : item.Selected}" @click="handleSelectedChange(i)"></div>
                    </div>
                    <div class="shopping-info">
                        <div class="thumbnail-wrap">
                            <div v-if="item.filePath.indexOf('.png') > -1" class="thumbnail" :style="{'background-image': `url(${$store.state.port.imgBaseUrl + item.filePath})`}"></div>
                            <div v-else class="thumbnail" :style="{'background-image': `url(${item.thumb.indexOf('aliyin') > -1 ?item.thumb : $store.state.port.imgBaseUrl + item.thumb})`}"></div>
                        </div>
                        <div class="info-wrap">
                            <p>名称:  <span v-if="item.urgent == true" style="color: rgba(255,0,0,1);font-weight:bold">[加急]</span><span>{{item.name}}</span></p>
                            <p>
                                规格:  
                                <span>{{item.size}}</span>
                                <span v-for="(temp,index) in item.spec" :key="index">
                                    <span v-if="temp.Items[0].DisplayMode == '0'">{{temp.Items[0].Name}}</span>
                                    <img v-else :src="$store.state.port.imgBaseUrl+temp.Items[0].ImageUrl" alt="">
                                </span>
                            </p>
                            <p v-if="item.technology.length">工艺:  <span style="margin-right: 5px;" v-for="(items,index) in item.technology" :key="index">{{items.Name}}</span></p>
                            <p>P 数:  <span>{{item.page + 'P'}}</span></p>
                        </div>
                    </div>
                    <div class="file-info" v-if="item.ordertype == '1'">
                        <div v-if="item.filePath == ''" class="upload-file" @click="handleUpload(i)">
                            <img src="/img/print/xqy_scwj_icon.png" alt="">
                            <span>上传文件</span>
                        </div>
                        <span v-else>
                            <span class="file-name" :title="item.fileName">{{item.fileName}}</span>
                            <img class="reselect" src="/img/print/xqy_refresh_icon.png" alt="" title="重新选择" @click="handleUpload(i)"/>
                        </span>
                    </div>
                    <div class="file-info" v-else>{{item.fileName}}</div>
                    <p class="shopping-number">{{item.number}}</p>
                    <p class="subtotal">￥{{item.subtotal && item.subtotal.toFixed(2)}}</p>
                    <p class="operate">
                        <img class="del_icon" @click="handleDelete(i)" src="/img/print/xqy_fork.png" alt="" title="删除">
                    </p>
                </div>
            </div>
            <el-dialog title="上传文件" :visible.sync="$store.state.port.dialogUpload" :close-on-click-modal="false">
                <UploadFile @setCartFile="getCartFile"></UploadFile>
            </el-dialog>
            <div class="shopping-bottom">
                <p class="shopping-tips">
                    <span @click="handleJump">继续购物</span>
                    <span class="cut">|</span>
                    <span>共<span class="shop-num">{{goods}}</span>件商品，已选择<span class="shop-num">{{goodsitem}}</span>件商品</span>
                </p>
                <div class="settle">
                    <p>合计: <span>{{totalPrice && totalPrice.toFixed(2)}}</span>元</p>
                    <el-button :class="['to-settle', disabled == false ? 'disable' : '']" :disabled="disabled" @click="handleToSettle">去结算</el-button>
                </div>
            </div>
        </div>
        <div class="empty" v-else>
            <img src="/img/error/ku.png" alt="">
            <span>购物车里空空如也，您可以去<nuxt-link to="/templateList"><span class="">模板中心</span></nuxt-link>看看</span>
        </div>
    </div>
</template>

<script>
import UploadFile from '@/components/share/UploadFile.vue'
export default {
    data () {
        return {
						tableData: [],
						empty: true, // 是否为空的购物车
						lg: false, // 是否登录
            checkAll: false,
            checkedList: [],

            shopList: [],
            goods: '',   // 总商品数
            goodsitem: '',   // 已选择商品数
            totalPrice: 0,   // 总价
            disabled: true,

            myCar: {
                'InvoiceID': 0,
                'AddressID': 0,
                'ShippingTypeID': 1,
                'CouponCode': '',
                ShoppingCartItem: [],
            },

            filename: '',
            index: null
        }
    },
    methods: {
        handleSelectAllChange() {  // 全选
            this.checkAll = !this.checkAll
            this.tableData.forEach((item,index) => {
                if (this.checkAll) {
                    if(this.checkedList.indexOf(index) == -1){
                        this.checkedList.unshift(index)
                    }
                    item.Selected = 1
                    this.totalPrice = this.shopList.Amount
                    this.goodsitem = this.tableData.length
                    this.disabled = false
                    this.$putCart({i:i,type: 1})
                } else {
                    item.Selected = 0
                    this.checkedList = []
                    this.disabled = true
                    this.totalPrice = 0
                    this.goodsitem = 0
										this.$putCart({i:i,type: 0})
                }
            })
        },
        handleSelectedChange(i) {  // 单选
            this.tableData[i].Selected = !this.tableData[i].Selected
            if (this.tableData[i].Selected == 0) {
                this.$putCart({i:i,type: 0})
                this.totalPrice = this.totalPrice - this.tableData[i].subtotal
                if(this.totalPrice <= 0) this.totalPrice = 0
            } else {
								this.$putCart({i:i,type: 1})
                this.totalPrice += this.tableData[i].subtotal
            }
            this.checkedList = []
            this.tableData.forEach((item,index) => {
                if(item.Selected == 1) {
                    this.checkedList.push(index)
                }
            })

            this.goodsitem = this.checkedList.length
            if(this.goodsitem == 0) this.disabled = true
            else this.disabled = false


            if (this.checkedList.length === this.tableData.length) {
                this.checkAll = true
            } else {
                this.checkAll = false
            }
        },

        handleUpload(i) {
            this.$store.commit('port/setDialogUpload', true)
            this.index = i
        },

        handleJump() {  // 继续购物
            this.$router.push('/print')
        },
        handleToSettle() {  // 去结算
            if(this.disabled == false) {
                this.$router.push({path: '/order/submitOrder', query: {t: 'cart'}})
            }
        },

        // 获取上传文件参数
        getCartFile(msg) {
            var car = this.$store.getters.getProductionObj[this.index]
            car.FileName = msg.name
            car.FilePath = msg.path
            this.$store.commit('setShopingCar', {i: this.index, shop: car})
            let cook = this.$myParseCookie(this.$store.state.productionObj)
            this.$cookies.set('myCar', cook, {path: '/'}) 
            this.tableData[this.index].fileName = msg.name
            this.getData()
        },

        getData() {
            if(this.$store.getters.getProductionObj){
								this.myCar.ShoppingCartItem = this.$getCart();
								if(this.myCar.ShoppingCartItem.length == 0) this.empty = false;
                let formData = this.myCar
                let config = {
                    headers:{'Content-Type': 'application/json'}
                }
                this.$axios.post('/ShoppingCar', formData, config).then(res => {
                    console.log(res.data)
                    this.shopList = res.data
                    this.goods = res.data.ShoppingCartItem.length 
                    var list = []
                    for(var i=0;i<res.data.ShoppingCartItem.length;i++) {
                        var obj = {}
                        // obj.unitprice = res.data.ShoppingCartItem[i].PerPrice
                        obj.fileName = res.data.ShoppingCartItem[i].FileName
                        obj.filePath = res.data.ShoppingCartItem[i].FilePath
                        obj.number = res.data.ShoppingCartItem[i].Quantitys[0].Number + res.data.ShoppingCartItem[i].ProductType.Unit
                        obj.subtotal = res.data.ShoppingCartItem[i].TotalPrice
                        obj.name = res.data.ShoppingCartItem[i].PriceSheet.Name
                        if(res.data.ShoppingCartItem[i].OrderType == '1') {
                            obj.thumb = res.data.ShoppingCartItem[i].ProductType.ImageUrl
                        }else{
                            obj.thumb = res.data.ShoppingCartItem[i].Thumb
                        }
                        obj.size = res.data.ShoppingCartItem[i].Sizes[0].ProductWidth + '*' + res.data.ShoppingCartItem[i].Sizes[0].ProductHeight + res.data.ShoppingCartItem[i].Sizes[0].Unit
                        if(res.data.ShoppingCartItem[i].CraftList.length > 0){
                            obj.technology = res.data.ShoppingCartItem[i].CraftList
                        }else{
                            obj.technology = ''
                        }
                        obj.spec = res.data.ShoppingCartItem[i].AttributeList
                        obj.id = i
                        obj.Selected = formData.ShoppingCartItem[i].Selected
                        obj.ordertype = res.data.ShoppingCartItem[i].OrderType
                        obj.page = res.data.ShoppingCartItem[i].Pages[0].Quantity
                        obj.urgent = res.data.ShoppingCartItem[i].Urgent
                        list[i] = obj
                    }
                    this.tableData = list
                    //console.log(this.tableData)
                    this.totalPrice = 0
                    this.tableData.forEach((item,index) => {
                        if (item.Selected == 1) {
                            this.totalPrice += item.subtotal
                            this.disabled = false
                            this.goodsitem = this.checkedList.length
                        }
                    })
                    if (this.checkedList.length === this.tableData.length) {
                        this.checkAll = true
                    } else {
                        this.checkAll = false
                    }
                })
            }
        },
        // 删除
        handleDelete (i) {
            this.$confirm('是否删除该商品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
								this.$deleteCart({i, num: 1})
                this.checkedList.splice(i,1)
                this.getData()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        }
    },
    mounted() {
				this.getData();
				if(!localStorage['token']){
						this.lg = false
				}else{
						this.lg = true
				}
        if(this.myCar.ShoppingCartItem.length){
						var mycar = this.myCar.ShoppingCartItem;
            mycar.forEach((item,index) => {
                if(item.Selected == 1) {
                    this.checkedList.push(index)
                }
            })
        }
    },
    components: {
        UploadFile
    }
}
</script>

<style lang="scss" scoped>

#shopping{
    width: 100%;
    background: rgba(244,244,244,1);
    user-select: none;
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 69px;
}
.shopping{
    width: 1200px;
    margin: 0 auto;
    .shopping-list{
        background:rgba(255,255,255,1);
        border-radius:10px;
        .shopping-list-header{
            display: flex;
            font-size:14px;
            color:rgba(51,51,51,1);
            height: 68px;
            line-height: 68px;
            text-align: center;
            padding: 0 25px;
            .check-wrap{
                display: inline-block;
                width: 70px;
                line-height: 68px;
                text-align: center;
                .check-icon{
                    display: inline-block;
                    width:21px;
                    height:21px;
                    background:rgba(255,255,255,1);
                    border:1px solid rgba(191,191,191,1);
                    border-radius:3px;
                    cursor: pointer;
                    vertical-align: middle;
                }
                span{
                    display: inline-block;
                    margin-left: 15px;
                }
                .check-icon-checked{
                    background-image: url(/img/personal/choose_icon.png);
                    background-repeat: no-repeat;
                    background-size: 100%;
                    border: none;
                }
            }
            .shopping-info-title{
                width: 450px;
            }
            .file-info-title{
                width: 240px;
            }
            .shopping-number-title, .subtotal-title{
                width: 95px;
            }
            .operate-title{
                width: 200px;
            }
        }
        .shopping-item{
            display: flex;
            font-size:16px;
            color:rgba(51,51,51,1);
            font-family:MicrosoftYaHei;
            font-weight:400;
            border-top: 1px solid rgba(244,244,244,1);
            align-items: center;
            padding: 25px;
            .select-wrap{
                display: inline-block;
                width: 70px;
                text-align: left;
                .select-icon{
                    display: inline-block;
                    width:21px;
                    height:21px;
                    background:rgba(255,255,255,1);
                    border:1px solid rgba(191,191,191,1);
                    border-radius:3px;
                    cursor: pointer;
                    vertical-align: middle;
                }
                .selected-icon{
                    background-image: url(/img/personal/choose_icon.png);
                    background-repeat: no-repeat;
                    background-size: 100%;
                    border: none;
                }
            }
            .shopping-info{
                display: flex;
                width: 450px;
                align-items: center;
                .thumbnail-wrap{
                    display: inline-block;
                    width:90px;
                    height:90px;
                    background:rgba(213,221,227,1);
                    border-radius:5px;
                    margin-right: 25px;
                    text-align: center;
                    .thumbnail{
                        display: inline-block;
                        width: 80%;
                        height: 100%;
                        background-size: contain;
                        background-position: 50%;
                        background-repeat: no-repeat;
                    }
                }
                .info-wrap{
                    p{
                        line-height: 23px;
                        span{
                            margin-left: 10px;
                        }
                        img{
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }
                }
            }
            .file-info{
                width: 240px;
                text-align: center;
                .upload-file{
                    display: inline-block;
                    vertical-align: middle;
                }
                .reselect{
                    display: inline-block;
                    vertical-align: middle;
                    cursor: pointer;
                }
                .file-name{
                    display: inline-block;
                    width: 180px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
            .shopping-number, .subtotal{
                width: 95px;
                text-align: center;
            }
            .subtotal{
                color: rgba(255,0,0,1);
            }
            .operate{
                width: 200px;
                text-align: center;
                .del_icon{
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    vertical-align: middle;
                    cursor: pointer;
                }
            }
        }
    }
    .shopping-bottom{
        background:rgba(255,255,255,1);
        border-radius:10px;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        line-height: 65px;
        padding-left: 25px;
        color:rgba(102,102,102,1);
        font-size: 14px;
        .shopping-tips{
            span:first-child{
                cursor: pointer;
                &:hover{
                    color: $color;
                }
            }
            .cut{
                margin: 0 12px;
            }
            .shop-num{
                padding: 0 5px;
                color: $color;
            }
        }
        .settle{
            display: flex;
            p{
                margin-right: 55px;
                span{
                    font-size: 24px;
                    color: rgba(255,0,0,1);
                    margin: 0 5px;
                }
            }
            .to-settle{
                background:rgba(216,216,216,1);
                text-align: center;
                font-size: 18px;
                color: rgba(255,255,255,1);
                padding: 0 55px;
                border-radius: 0 10px 10px 0;
            }
            .disable{
                background:rgba(243,152,0,1);
                color: rgba(255,255,255,1);
            }
        }
    }
}
.empty{
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 200px 0;
    img{
        display: flex;
        align-self: center;
        width: 208px;
        height: 201px;
    }
    span a>span{
        cursor: pointer;
        text-decoration: underline;
        color: $color;
    }
}



.shopping /deep/ .el-table{
    background: rgba(255,255,255,1);
    border-radius: 10px;
    .del_icon{
        cursor: pointer;
    }
}

.shopping /deep/ .el-dialog{
    width: 630px;
    border-radius: 10px;
    text-align: center;
    box-shadow: none;
    .el-dialog__header{
        padding: 20px 25px 0;
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
            }
        }
    }
    .el-dialog__body{
        padding: 28px 36px;
    }
}
</style>
