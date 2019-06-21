<template>
    <div id="shopping">
        <div class="shopping" v-if="tableData.length || lg == true">
            <el-table
                :data="tableData">
                <el-table-column
                    width="120">
                    <template slot="header" slot-scope="scope">
                        <el-checkbox :indeterminate="isIndeterminate" :label="scope.row" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
                            <el-checkbox :label="scope.row.id"></el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
                <el-table-column
                    label="商品信息"
                    width="450">
                    <template slot-scope="scope">
                        <div class="orderInfo-thumb">
                            <img :src="$store.state.port.imgBaseUrl+scope.row.thumb" alt="">
                            <div class="orderInfo-tip">
                                <p>名称: <span>{{scope.row.name}}</span></p>
                                <p>规格: <span>{{scope.row.size}} {{scope.row.spec}}</span></p>
                                <p>工艺: <span style="margin-right: 5px;" v-for="(item,i) in scope.row.technology" :key="i">{{item.Name}}</span></p>
                                <p>P数: <span>{{scope.row.page + 'P'}}</span></p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="文件信息">
                    <template slot-scope="scope">
                        <div v-if="scope.row.fileName == null" class="upload-file" @click="handleUpload">
                            <img :src="$store.state.port.staticPath + '/img/print/xqy_scwj_icon.png'" alt="">
                            <span>上传文件</span>
                        </div>
                        <!-- <span v-else-if="scope.row.ordertype == '2'">自助设计</span> -->
                        <span v-else>{{scope.row.fileName}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="单价(元)">
                    <template slot-scope="scope">
                        <span>{{scope.row.unitprice && scope.row.unitprice.toFixed(2)}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="number"
                    label="数量"
                    width="75">
                </el-table-column>
                <el-table-column
                    label="小计(元)"
                    width="75">
                    <template slot-scope="scope">
                        <span style="color: rgba(255,1,1,1)">{{scope.row.subtotal && scope.row.subtotal.toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <img class="del_icon" @click="handleDelete(scope.row.id)" :src="$store.state.port.staticPath + '/img/print/xqy_fork.png'" alt="">
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="上传文件" :visible.sync="$store.state.dialogUpload" :close-on-click-modal="false">
                <UploadFile></UploadFile>
            </el-dialog>
            <div class="shopping-bottom">
                <p class="shopping-tips">
                    <span @click="handleJump">继续购物</span>
                    <span class="cut">|</span>
                    <span>共<span class="shop-num">{{goods}}</span>件商品，已选择<span class="shop-num">{{goodsitem || 0}}</span>件商品</span>
                </p>
                <div class="settle">
                    <p>合计: <span>{{totalPrice && totalPrice.toFixed(2)}}</span>元</p>
                    <el-button :class="['to-settle', disabled == false ? 'disable' : '']" :disabled="disabled" @click="handleToSettle">去结算</el-button>
                </div>
            </div>
        </div>
        <div class="empty" v-if="!tableData.length || lg == false">
            <img :src="$store.state.port.staticPath + '/img/error/ku.png'" alt="">
            <span>购物车里空空如也，您可以去<router-link to="/createdesign"><span class="">模板中心</span></router-link>看看</span>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import UploadFile from '@/components/share/UploadFile.vue'
export default {
    data () {
        return {
            tableData: [],
            checkAll: false,
            checkedList: [0],
            isIndeterminate: true,
            checkedId: [],

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
                'id': []
            },
        }
    },
    methods: {
        handleCheckAllChange(val) {
            this.checkedList = val ? this.checkedId : []
            this.isIndeterminate = false;
            if(val == true){
                this.disabled = false
                this.goodsitem = this.checkedList.length
                this.totalPrice = this.shopList.Amount
                var mycar = JSON.parse(Cookies.get('mycar'))
                this.myCar.ShoppingCartItem = mycar.ShoppingCartItem
                this.myCar.id = this.checkedList
            }else{
                this.disabled = true
                this.totalPrice = 0
                return 
            }
        },
        handleCheckedListChange(value) {
            let checkedCount = value.length
            this.checkAll = checkedCount === this.checkedId.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedId.length
            
            var j = 0
            for(var a=0,sum=0;a<value.length;a++){
                j = value[a]
                sum += this.shopList.ShoppingCartItem[j].TotalPrice
            }
            this.totalPrice = sum

            if(value.length > 0){
                this.disabled = false
                this.myCar.ShoppingCartItem = []
                var mycar = JSON.parse(Cookies.get('mycar'))
                value.forEach(item => {
                    this.myCar.ShoppingCartItem.push(mycar.ShoppingCartItem[item])
                })
                this.goodsitem = value.length
            }else{
                this.disabled = true
            }
        },
        handleUpload() {
            this.$store.commit('setDialogUpload', true)
        },

        handleJump() {  // 继续购物
            this.$router.push('/print')
        },
        handleToSettle() {  // 去结算
            if(this.disabled == false) {
                //this.$bus.$emit('setCart', this.myCar)
                this.$router.push({path: '/submitorder', query: {msg: JSON.stringify(this.myCar)}})
            }
        },

        getData() {
            if(Cookies.get('mycar')){
                let formData = JSON.parse(Cookies.get('mycar'))
                let config = {
                    headers:{'Content-Type': 'application/json'}
                }
                this.$axios.post('/ShoppingCar', formData, config).then(res => {
                    console.log(res.data)
                    this.shopList = res.data
                    this.goods = res.data.ShoppingCartItem.length 
                    //this.totalPrice = res.data.TotleAmount
                    var list = []
                    for(var i=0;i<res.data.ShoppingCartItem.length;i++) {
                        var obj = {}
                        // obj.unitprice = res.data.ShoppingCartItem[i].PerPrice
                        obj.fileName = res.data.ShoppingCartItem[i].FileName
                        obj.number = res.data.ShoppingCartItem[i].Count
                        obj.subtotal = res.data.ShoppingCartItem[i].TotalPrice
                        obj.name = res.data.ShoppingCartItem[i].PriceSheet.Name
                        obj.thumb = res.data.ShoppingCartItem[i].ProductType.ImageUrl
                        obj.size = res.data.ShoppingCartItem[i].Sizes[0].Width + '*' + res.data.ShoppingCartItem[i].Sizes[0].Height + res.data.ShoppingCartItem[i].Sizes[0].Unit
                        if(res.data.ShoppingCartItem[i].CraftList.length > 0){
                            obj.technology = res.data.ShoppingCartItem[i].CraftList
                        }else{
                            obj.technology = ''
                        }
                        obj.spec = res.data.ShoppingCartItem[i].AttributeList[0].Items[0].Name
                        obj.id = i
                        //obj.ordertype = res.data.ShoppingCartItem[i].OrderType
                        obj.page = res.data.ShoppingCartItem[i].Pages[0].Quantity
                        list[i] = obj
                    }
                    this.tableData = list
                    //console.log(this.tableData)
                    for (let i = 0; i < this.tableData.length; i++) {
                        this.checkedId.push(this.tableData[i].id)
                    }
                    if (this.checkedList.length > 0 && this.tableData.length > 0) {
                        this.disabled = false
                        this.checkedList.forEach(item => {
                            console.log(this.tableData[item])
                            this.totalPrice = this.tableData[item].subtotal
                            this.goodsitem = this.checkedList.length
                            var mycar = JSON.parse(Cookies.get('mycar'))
                            this.myCar.ShoppingCartItem = [mycar.ShoppingCartItem[item]]
                            console.log(this.myCar, 'dsad')
                        })
                    }
                })
            }
        },
        // 删除
        handleDelete (i) {
            var list = JSON.parse(Cookies.get('mycar'))
            list.ShoppingCartItem.splice(i,1)
            var my_car = JSON.stringify(list)
            Cookies.set('mycar', my_car, {expires: 7})
            this.getData()
        }
    }, 
    computed: {
        lg() {
            if(!localStorage['token']){
                return false
            }else{
                return true
            }
        }
    },
    mounted() {
        this.getData()
        console.log(this.checkedList)
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
