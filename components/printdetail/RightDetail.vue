<template>
    <div id="right-detail">
        <div class="right-detail">
            <div class="product-top">
                <p class="product-title">{{production.Name}}</p>
                <p class="tips" v-if="production.Summary">{{production.Summary}}</p>
                <div class="service">
                   <span class="promise">
                        <font style="background:#E81623">邮</font>
                        全国包邮
                    </span>
                    <span class="promise">
                        <font style="background:#F3960A">票</font>
                        报销发票
                    </span>
                    <span class="promise">
                        <font style="background:#54BE59">送</font>
                        送货上门
                    </span>
                    <span class="promise">
                        <font style="background:#2292E9">近</font>
                        就近印刷
                    </span>
                </div>
            </div>
            <div class="product-info">
                <div class="item">
                    <span class="item-title">尺寸: </span>
                    <div class="choose-list" v-for="(item,i) in production.Sizes" :key="i" @click="setProduct('Sizes', i)">
                        <span :class="{'choose-item': true, active :item.IsDefault}">{{item.Name}}</span>
                        <i v-if="item.IsDefault" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_blue.png'})`}"></i>
                    </div>
                </div>
                <div class="item" v-if="production.IsShowPage">
                    <span class="item-title">P 数: </span>
                    <div class="choose-list" v-for="(item,i) in production.Pages" :key="i" @click="setProduct('Pages', i)">
                        <span v-if="item.DisplayMode == 0" :class="{'choose-item': true, active : item.IsDefault}">{{item.Quantity}}P</span>
                        <img v-else :src="$store.state.port.imgBaseUrl+item.ImageUrl" alt="">
                        <i v-if="item.IsDefault" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_blue.png'})`}"></i>
                    </div>
                </div>
                <div class="list" v-for="(item,i) in production.Attributes" :key="i">
                    <span class="item-title">{{item.Name}}: </span>
                    <div class="item" >
                        <div class="choose-list" v-for="(tmp,index) in item.Items" :key="index" @click.stop="setProduct('Attributes', i, 'Items', index)">
                            <span v-if="tmp.DisplayMode == 0" :class="{'choose-item': true, active : tmp.IsDefault}">{{tmp.Name}}</span>
                            <img v-else :class="{'choose-img': true, active : tmp.IsDefault}" :src="$store.state.port.imgBaseUrl+tmp.ImageUrl" alt="">
                            <i v-if="tmp.IsDefault" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_blue.png'})`}"></i>
                        </div>
                    </div>
                </div>
                <div class="item" v-if="production.Crafts.length">
                    <span class="item-title">工序: </span>
                    <div class="choose-list" v-for="(item,i) in production.Crafts" :key="i" @click="setProduct('Crafts', i)">
                        <span :class="{'choose-item': true, active : item.IsDefault}">{{item.Name}}</span>
                        <i v-if="item.IsDefault" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_blue.png'})`}"></i>
                    </div>
                </div>
                <div class="list">
                    <span class="item-title">数量: </span>
                    <div class="item">
                        <div class="choose-list" v-for="(item,i) in production.Quantities" :key="i">
                            <div  :class="{'choose-item': true, active : item.IsDefault}" @click="setProduct('Quantities', i)">
                                <span v-if="item.DisplayMode == 0" >{{item.Number + unit}}</span>
                                <img v-else :src="$store.state.port.imgBaseUrl+item.ImageUrl" alt="">
                            </div>
                            <i v-if="item.IsDefault" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_blue.png'})`}"></i>
                        </div>
                    </div>
                </div>   
                <div class="item" v-if="production.Urgent">
                    <span class="item-title">加急: </span>
                    <div class="choose-list">
                        <span :class="{'choose-item' : true, active : urgent}" @click="handleChooseUrgent(production)">我要加急</span>
                        <!-- <span :class="['choose-item', urgent == true ? 'active' : '']" @click="handleChooseUrgent(true,production)">加急(加急费用{{production.UrgentFee}})</span> -->
                        <i v-if="urgent" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_blue.png'})`}"></i>
                    </div>
                </div>
                <div class="list" v-if="couponList.length">
                    <span class="item-title coupon">优惠券: </span>
                    <div class="item" style="width: 507px;">
                        <div class="choose-list" v-for="(item,i) in couponList" :key="i" @click="handleCoupon(i)">
                            <span :class="{'choose-item':true, active: couponIndex == i && total >= item.LimitPrice,isUse: total <= item.LimitPrice}">
                                满{{item.LimitPrice}}减{{item.Amount}}
                                <i v-if="couponIndex == i && total" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_blue.png'})`}"></i>
                            </span>
                            <span :class="{'receive-item':true, isUse: item.IsReceived == 1}" @click.stop="handleReceive(item)">
                                {{item.IsReceived == 1 ? '已领取' : '领取'}}
                                 <i v-if="couponIndex == i && total" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_blue.png'})`}"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <span class="item-title">文件: </span>
                    <div class="choose-way">
                        <span :class="['item-way', file == true ? 'upload-file' : '']" @click="handleClick('file')">
                            <img :src="$store.state.port.staticPath + '/img/print/xqy_scwj_icon.png'" alt="">
                            <span>上传文件</span>
                            <i v-if="file == true" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_orange.png'})`}"></i>
                        </span>
                        <span :class="['item-way', self == true ? 'self-design' : '']" @click="handleClick('self')">
                            <img :src="$store.state.port.staticPath + '/img/print/xqy_zzsjj_icon.png'" alt="">
                            <span>自助设计</span>
                            <i v-if="self == true" class="choose-icon" :style="{'background-image': `url(${$store.state.port.staticPath + '/img/print/choose_green.png'})`}"></i>
                        </span>
                        <!-- <span :class="['item-way', original == true ? 'original-design' : '']" @click="handleClick('original')">
                            <img src="/img/print/xqy_ycsjj_icon.png" alt="">
                            <span>原创设计</span>
                        </span> -->
                    </div>
                </div>
                <el-dialog title="上传文件" :visible.sync="$store.state.dialogUpload" :close-on-click-modal="false" :lock-scroll="false" class="upload">
                    <UploadFile @setCartFile="setCartFile"></UploadFile>
                </el-dialog>
                <el-dialog
                    title="选择模板"
                    :visible.sync="dialogVisible"
                    :close-on-click-modal="false"
                    :lock-scroll="false">
                    <div id="Loading" v-if="loading">
                        <div class="loader-inner ball-beat">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div class="choose-title">模板P数: {{pages + 'P'}}  模板尺寸:  {{sizename}}</div>
                    <div class="template-list" v-if="list.length">
                        <div :class="['template-item',tempIndex == i ? 'active' : '']" v-for="(item,i) in list" :key="i" @click="handleChooseTemp(i)">
                            <div class="template-block">
                                <div class="item-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+item.FacePicture})`}"></div>
                            </div>
                            <p class="template-title">{{item.Name}}</p>
                        </div>
                        <div class="template-item" style="height: 0px;visibility: hidden;"></div>
                        <div class="template-item" style="height: 0px;visibility: hidden;"></div>
                        <div class="template-item" style="height: 0px;visibility: hidden;"></div>
                        <div class="template-item" style="height: 0px;visibility: hidden;"></div>
                        <div class="template-item" style="height: 0px;visibility: hidden;"></div>
                    </div>
                    <div style="text-align: center;" v-if="!list.length && !loading">
                        <img :src="$store.state.port.staticPath + '/img/error/ku.png'" alt="">
                        <p>您还没有设计过模板，请点击创建设计，设计您的专属模板</p>
                    </div>
                    <!-- <el-pagination
                        v-if="page.totalRecords > 10 && !loading"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalRecords">
                    </el-pagination> -->
                    <HomePagination :Page="page" @getTempList="getTemplate" v-if="page.totalRecords > 10 && !loading"/>
                    <span slot="footer" class="dialog-footer" v-if="!loading">
                        <el-button v-if="list.length" class="sure-btn" type="primary" @click="handleSure">确认选择</el-button>
                        <el-button class="create-btn" @click="handleToCreate">创建设计</el-button>
                    </span>
                </el-dialog>
                <div class="file-content" v-if="printprice.FileName || tempName">
                    <div class="choose-file" v-if="file == true">
                        <p>
                            <span class="success-file">{{printprice.FileName}}</span>
                            <i class="el-icon-close" @click.stop="handleDel"></i>
                        </p>
                        <!-- <el-upload
                            :action="$store.state.netServer + '/UploadOrderFile'"
                            ref="upload"
                            :limit='1'
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :on-progress='handleProgress'
                            :headers="myHeader"
                            :show-file-list="false">
                            <div class="upload">
                                <div class="choose-btn">
                                    <img src="/img/print/xqy_add_icon.png" alt="">
                                    选择文件
                                </div>
                                <span v-if="!printprice.FileName">未选择任何文件</span>
                                <span class="success-file" v-else>{{printprice.FileName}}<i class="el-icon-close" @click.stop="handleDel"></i></span>
                            </div>
                            <div slot="tip" class="el-upload__tip">支持pdf、jpg、zip、rar、cdr、ai、psd格式</div>
                        </el-upload> -->
                    </div>
                    <div class="selfDesign" v-if="self == true">
                        <p class="self-title" v-if="tempName">
                            <img :src="$store.state.port.staticPath + '/img/print/xqy_wj.png'" alt="">
                            <span>{{tempName}}</span>
                            <img :src="$store.state.port.staticPath + '/img/print/xqy_refresh_icon.png'" alt="" title="重选" @click="dialogVisible = true">
                            <img :src="$store.state.port.staticPath + '/img/print/xqy_fork.png'" alt="" title="删除" @click="handleDelete">
                        </p>
                    </div>
                </div>
            </div>
            <div class="product-price">
                <p>
                    <span class="price-title">总费用: </span>
                    <span class="price">{{totalPrice && totalPrice.toFixed(2)}}</span>
                    <span v-if="couponIndex != null" style="color:red;">(已优惠{{specialrate}}元)</span>
                </p>
                <p class="time">
                    <img :src="$store.state.port.staticPath + '/img/print/xqy_time_icon.png'" alt="">
                    <span v-if="currentDate < xiadanDate">今天<span style="color: #745bff">{{production.PressTime}}</span>前下单，预计<span>{{time}}</span>可以发货</span>
                    <span v-else>现在下单，预计<span>{{time}}</span>可以发货</span>
                </p>
            </div>
            <div class="product-btn">
                <div class="order" @click="handleToCar(true)">立即下单</div>
                <div class="shopping-cart" @click="handleToCar(false)">加入购物车</div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import HomePagination from '@/components/home/HomePagination.vue'
import UploadFile from '@/components/share/UploadFile.vue'
export default {
    data () {
        return {
            list: [],   // 自助设计模板列表
            // tempList: [],
            production: {
                Attributes: [], // 规格
				Crafts: [], // 工序
                Pages: [], // P数
                Sizes: [], // 尺寸
            },
            printprice: { // 获取价格的参数
				SheetId: null, 
				SizeId: null,
				PageId: null,
				QuantityId: null,
				Attributes: null,
				Crafts: null,
				Urgent: null,
				Count: 0, 
				OrderType: 1,
				FileName: '',
				FilePath: '',
                DocumentNum: '',
                Thumb: '',
                Selected: 1
			},
            tempIndex: null,
            dialogVisible: false,
            file: true,
            self: false,
            original: false,
            totalPrice: '',   // 总价格
            time: '',    // 工期
            unit: '',  // 数量单位

            ordertype: 1,
            tempName: '',
            tempNum: '',

            myCar: {
                'InvoiceID': 0,
                'AddressID': 0,
                'ShippingTypeID': 1,
                'CouponCode': '',
                ShoppingCartItem: [],
            },

            currentDate: '',
            xiadanDate: '',

            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 10,      // 每页个数
            },
            pages: '',
            sizename: '',
            loading: true,
            urgent: null,
            couponList: [],
            couponIndex: null,
            total: '',
            specialrate: ''
        }
    },
    props: ['info'],
    methods: {
        // 获取自助设计模板列表
        getTemplate() {
            this.list = []
            this.loading = true
            var formData = new FormData()
            formData.append('TeamNum', localStorage['teamNum']);
            formData.append('pageIndex', this.page.currentPage);
            formData.append('startTime', '');
            formData.append('endTime', '');
            formData.append('typeid', this.$route.query.id);
            formData.append('SizeId', this.printprice.SizeId);
            formData.append('Pages', this.pages);
            formData.append('pageSize', this.page.pageSize);
            this.$axios.post('/ChoseDocument', formData).then(res => {
                if(res == undefined) {
                    this.loading = false
                    return 
                }
                // console.log(res.data)
                if(res.data.Data.length == 0) this.loading = false
                if(res.data.Data.length > 0){
                    this.list = res.data.Data
                    // this.tempList = res.data.Data.slice(0,10)
                    this.loading = false
                    this.page.totalRecords = (res.data)['X-Pagination'].TotalCount
                }
            })
        },
        // 选择模板
        handleChooseTemp(i) {
            this.tempIndex = i
            this.tempNum = this.list[i].DocumentNumber
            // console.log(this.tempNum)
            this.tempName = this.list[i].Name
            this.printprice.FileName = this.list[i].Name
            this.printprice.Thumb = this.list[i].FacePicture
        },
        // 创建设计
        handleToCreate() {
            this.dialogVisible = false
            let num = this.info[0].ProductType.FromClass
            let subtitle = this.info[0].ProductType.TypeName
            this.$router.push({path: '/templatecenter', query: {id: this.$route.query.id, n: num, title: '', subtitle: subtitle}})
        },

        // 删除选择的模板 
        handleDelete() {
            this.tempName = ''
            this.printprice.FileName = ''
            this.printprice.DocumentNum = ''
        },
        handleSure() {  // 确定选择
            this.dialogVisible = false
            this.printprice.DocumentNum = this.tempNum
            this.getPrice(this.printprice)
        },
        // 选择优惠券
        handleCoupon(i) {
            if(this.total <= this.couponList[i].LimitPrice){
                return
            }
            if(this.couponIndex == null) {
                this.couponIndex = i
                this.totalPrice = this.total - this.couponList[i].Amount
            }else if(this.couponIndex != i) {
                this.couponIndex = i
                this.totalPrice = this.total - this.couponList[i].Amount
            }else{
                this.couponIndex = null
                this.totalPrice = this.total
            }
            this.specialrate = this.couponList[i].Amount
        },
        // 领取优惠券
        handleReceive(item) {
            if(!localStorage['token']){
                this.$message({type: 'warning', message: '请先登录'})
                this.$store.commit('setDialogType', 'login')
                return
            }else{
                if(item.IsReceived == 1) return
                var formData = new FormData()
                formData.append('CouponID', item.ID);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/UserCoupon', formData, config).then(res => {
                    // console.log(res.data)
                    if(res.data.status == 'success'){
                        item.IsReceived = 1
                        this.$message.success(res.data.msg)
                    }else{
                        this.$message.warning(res.data.msg)
                    }
                })
            }
        },

        // 获取印刷规格
        getPrintSize() {
            if(this.$route.query.id == undefined) return
            new Promise((resolve, reject) => {
                this.$axios.get('/ProductSheet?TypeID=' + this.$route.query.id).then(res => {
                    if(res.data == '') return console.log('没有返回')
                    this.production = res.data[0]
                    this.unit = res.data[0].ProductType.Unit
                    // console.log(this.production)
                    this.couponList = res.data[0].Coupons
                    if(this.production.Urgent){
                        this.urgent = true
                    }else{
                        this.urgent = false
                    }

                    let SheetId = this.production.ID,
                        SizeId = this.getIsDefault(this.production.Sizes),
                        PageId = this.getIsDefault(this.production.Pages),
                        QuantityId = this.getIsDefault(this.production.Quantities),
                        Attributes = '',
                        Crafts = '',
                        Count = 0,
                        Urgent = this.production.Urgent,
                        OrderType = this.printprice.OrderType,
                        FileName = '',
                        FilePath = '',
                        DocumentNum = '',
                        Thumb = '',
                        Selected = 1
                    this.production.Pages.forEach((item,index) => {
                        if(item['IsDefault']){
                            this.pages = item.Quantity
                        }
                    })
                    this.production.Sizes.forEach((item,index) => {
                        if(item['IsDefault']){
                            this.sizename = item.Name
                        }
                    })
                    this.production.Attributes.forEach((item,index) => {
                        let type;
                        item['Items'].forEach((tmp,i) => {
                            if(tmp['IsDefault']) {
                                Attributes += tmp.ID + ','
                                type = tmp['IsDefault']
                            }
                        })
                        if(!type) {
                            this.production.Attributes[index]['Items'][0]['IsDefault'] = true
                            Attributes += this.production.Attributes[index]['Items'][0].ID + ','
                        }
                    })
                    if(Attributes.lastIndexOf(',') == Attributes.length - 1) Attributes = Attributes.slice(0, -1)
                    resolve({SheetId, SizeId, PageId, QuantityId, Attributes, Crafts, Count, Urgent, OrderType, FileName, FilePath, DocumentNum,Selected,Thumb})
                })
            }).then(obj => {
                // console.log(obj)
                this.printprice = obj
                this.getPrice(this.printprice)
            })
        },
        
        getIsDefault(arr) {  // 获取默认参数id
            let id;
            if(arr.length == 0) id = ''
            for (var i = 0; i<arr.length; i++) {
                if (arr[i]['IsDefault']) id = arr[i].ID
                else {
                    arr[0]['IsDefault'] = true
                    id = arr[0].ID
                }
                if (arr[i]['Items']) {
                    arr[i]['Items'].forEach(item => {
                        if (item['IsDefault']) id = item.ID
                    })
                }
            }
            return id
        },
        setProduct(type, i, child, index) {  // 选择设置产品规格
            let arr = this.production[type], newIndex = i;
            if (child) {
                arr = arr[i][child]
                newIndex = index
            }
            this.setIsDefault(arr, newIndex, type)
        },
        setIsDefault(arr, index, type) {
            let Crafts = '', Attributes = '';
            for (var i = 0; i < arr.length; i++) {
                if (type != 'Crafts') {
                    arr[i]['IsDefault'] = false
                    if (i == index) {
                        arr[i]['IsDefault'] = true
                        switch (type) {
                            case 'Pages':
                                this.printprice.PageId = arr[i].ID
                                this.pages = arr[i].Quantity
                            break;
                            case 'Sizes':
                                this.printprice.SizeId = arr[i].ID
                                this.sizename = arr[i].Name
                            break;
                            case 'Quantities':
                                this.printprice.QuantityId = arr[i].ID
                            break;
                            case 'Urgent':
                            break
                        }
                    }
                } else {
                    if (i == index) 
                        arr[i]['IsDefault'] = arr[i]['IsDefault'] ? false : true
                }
            }
            this.production.Attributes.forEach(item => {
				item['Items'].forEach(temp => {
					if (temp['IsDefault']) {
						Attributes += temp.ID + ','
					}
				})
            })
            this.production.Crafts.forEach(item => {
                if(item['IsDefault']) 
                    Crafts += item.ID + ','
            })
            if (Attributes.lastIndexOf == Attributes.length - 1) Attributes = Attributes.slice(0, -1)
            if (Crafts.lastIndexOf == Crafts.length - 1) Crafts = Crafts.slice(0, -1)
            this.printprice.Attributes = Attributes
            this.printprice.Crafts = Crafts
            this.getPrice(this.printprice)
        },

        handleChooseUrgent(bool) {  // 选择是否加急
            // bool.Urgent = !bool.Urgent
            this.urgent = !this.urgent
            this.printprice.Urgent = this.urgent
            this.getPrice(this.printprice)
        },

        // 获取报价结果
        getPrice(obj) {
            // console.log(obj)
            let formData = new FormData()
            for (let item in obj) {
                formData.append(item, obj[item])
			}
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post(this.$store.state.port.print.printprice, formData, config).then(res => {
                // console.log(res.data)
                this.totalPrice = res.data.TotalPrice || 0
                this.total = res.data.TotalPrice
                this.couponIndex = null
                if(this.currentDate < this.xiadanDate){
                    if(res.data.TotalProductionTime == 0){
                        this.time = '明天上午'
                    }else if(res.data.TotalProductionTime == 1){
                        this.time = '后天'
                    }else{
                        this.time = res.data.TotalProductionTime + '天后'
                    }
                }else{
                    if(res.data.TotalProductionTime == 0){
                        this.time = '后天'
                    }else{
                        this.time = (res.data.TotalProductionTime + 1) + '天后'
                    }
                }
            })
        },

        handleClick(msg) {
            if(msg == 'file'){
                this.printprice.OrderType = 1
                this.getPrice(this.printprice)
                this.file = true
                this.self = false
                this.original = false
                this.$store.commit('setDialogUpload', true)
            }else if(msg == 'self'){
                if (!localStorage['token']) {
                    this.$message({type: 'warning', message: '请先登录'})
                    this.$store.commit('setDialogType', 'login')
                    return
                } else {
                    this.printprice.OrderType = 3
                    this.getPrice(this.printprice)
                    if(this.tempName == '') {
                        this.tempIndex = null
                    }
                    this.dialogVisible = true
                    this.getTemplate()
                    this.self = true
                    this.file = false
                    this.original = false
                }
            }else{
                this.ordertype = 3
                this.original = true
                this.file = false
                this.self = false
            }
        },
        setCartFile(msg) {  // 文件上传成功返回的参数
            // console.log(msg)
            this.printprice.FileName = msg.name
            this.printprice.FilePath = msg.path
            this.getPrice(this.printprice)
        },
        handleDel() {  // 删除文件
            // console.log(123)
            this.printprice.FilePath = ''
            this.printprice.FileName = ''
            this.getPrice(this.printprice)
        },
        // 添加到购物车
        handleToCar(type) {
            if(!localStorage['token']) {
                this.$message({type: 'warning', message: '请先登录'})
                this.$store.commit('setDialogType', 'login')
                return 
            }
            if(type) {
                if(!this.tempNum && !this.printprice.FilePath) {
                    this.$confirm('您还没有选择任何文件,是否立即下单?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'success',
                        lockScroll: false
                    }).then(() => {
                        this.$store.commit('addShopingCar', this.printprice)
                        this.$router.push({path: 'submitorder', query: {t: 'order'}})
                    }).catch(() => {
                        this.$message.warning('已取消选择')
                    })

                }
                if(this.printprice.FilePath) {
                    this.$store.commit('addShopingCar', this.printprice)
                    this.$router.push({path: 'submitorder', query: {t: 'order'}})
                }
                if(this.tempNum) {
                    var formData = new FormData()
                    formData.append('documentnum', this.tempNum);
                    this.$axios.post('/ShopDocument', formData)
                    .then(({data}) => {
                        if(data.state == 'ok') {
                            this.printprice.DocumentNum = data.msg
                            this.$store.commit('addShopingCar', this.printprice)
                            this.$router.push({path: 'submitorder', query: {t: 'order'}})
                        }else{
                            this.$message.warning(data.msg)
                        }
                    }) 
                }
            }else{
                this.$store.commit('addShopingCar', this.printprice)
                this.$confirm('加入购物车成功, 是否去提交订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success',
                    lockScroll: false
                }).then(() => {
                    this.$router.push('/cart')
                }).catch(() => {
                    this.$message.warning('已取消选择')
                })
            }
        }
    },
    computed: {
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    },
    components: {
        HomePagination,
        UploadFile
    },
    mounted() {
        this.getPrintSize()

        var date = new Date()
        var nowHours = date.getHours().toString();
        var nowMin = date.getMinutes().toString();
        var nowSeconds = date.getSeconds().toString()
        function p(str) {
            if(str.length<=1){
                str='0'+str;
            }
            return str
        }
        nowHours = p(nowHours)
        nowMin = p(nowMin)
        nowSeconds = p(nowSeconds)
        this.currentDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + nowHours + ':' + nowMin + ':' + nowSeconds
        this.xiadanDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + '18:00:00'
        //console.log(this.currentDate, this.xiadanDate)

        if(JSON.stringify(this.$route.query) == '{}'){
            this.$router.push('*')
        }
    }
}
</script>

<style lang="scss" scoped>

.right-detail{
    width: 587px;
    user-select: none;
}
.product-top{
    border-bottom:1px solid rgba(238,238,238,1);
    .product-title{
        font-size:28px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:28px;
        margin-bottom: 20px;
    }
    .tips{
        font-size:16px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height: 40px;
    }
    .service{
        display: flex;
        margin-bottom: 25px;
        .promise {
            display: inline-block;
            //height: 24px;
            line-height: 24px;
            border: 1px solid transparent;
            margin-right: 10px;
            font-size: 13px;
            border-radius: 3px;
            padding-right: 5px;
        }
        & .promise:nth-child(1) {
                border-color: #E81623;
        }
        & .promise:nth-child(2) {
                border-color: #F3960A;
        }
        & .promise:nth-child(3) {
                border-color: #54BE59;
        }
        & .promise:nth-child(4) {
                border-color: #2292E9;
        }
        font {
            display: inline-block;
            width: 26px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            color: #fff;
            padding-right: 5px;
        }
    }
}
.product-info{
    padding: 25px 0;
    border-bottom:1px solid rgba(238,238,238,1);
    .list{
        display: -webkit-box;
        .item-title{
            display: inline-block;
            font-size:14px;
            color:rgba(51,51,51,1);
            margin-right: 15px;
            line-height: 32px;
        }
        .coupon{
            margin-left: -14px;
        }
    }
    .item{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // display: -webkit-box;
        margin-bottom: 10px;
        .item-title{
            font-size:14px;
            color:rgba(51,51,51,1);
            margin-right: 15px;
            display: inline-block;
            line-height: 32px;
        }
        .choose-list{
            display: flex;
            flex-wrap: wrap;
            position: relative;
            .choose-item, .receive-item{
                display: inline-block;
                border:1px solid rgba(191,191,191,1);
                border-radius:3px;
                text-align: center;
                padding: 0 12px;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                color:rgba(0,0,0,1);
                position: relative;
                margin-right: 15px;
                margin-bottom: 10px;
                cursor: pointer;
                &:hover{
                    border: 1px solid $color;
                }
                .choose-icon{
                    display: inline-block;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 15px;
                    height: 15px;
                }
            } 
            .choose-icon{
                display: inline-block;
                position: absolute;
                bottom: 10px;
                right: 15px;
                width: 15px;
                height: 15px;
            }
            .receive-item{
                margin-left: -15px;
            }
            .isUse{
                color: rgba(153,153,153,1);
                opacity: .5;
            }
            .choose-img{
                border: 1px solid rgba(255,255,255,1);
                cursor: pointer;
            }
            .active{
                border: 1px solid $color;
            }
        }
    }
    .items{
        width: 100%;
        line-height: 43px;
        height: 43px;
        display: flex;
        .item-title{
            font-size:14px;
            color:rgba(51,51,51,1);
            margin-right: 15px;
        }
        .choose-way{
            .item-way{
                display: inline-block;
                border:1px solid rgba(191,191,191,1);
                border-radius:3px;
                text-align: center;
                width: 118px;
                height: 43px;
                font-size: 14px;
                color:rgba(102,102,102,1);
                position: relative;
                cursor: pointer;
                margin-right: 15px;
                img{
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 5px;
                }
                i{
                    display: inline-block;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 15px;
                    height: 15px;
                }
            }
            .upload-file{
                border: 1px solid rgba(254,108,35,1);
            }
            .self-design{
                border: 1px solid rgba(34,204,118,1);
            }
            .original-design{
                border: 1px solid rgba(243,152,0,1);
                &::before{
                    content: '';
                    // background-image: url(/img/print/choose_yellow.png);
                    display: inline-block;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 15px;
                    height: 15px;
                }
            }
        }
    }
    .file-content{
        margin-top: 25px;
        background:rgba(241,241,242,1);
        border-radius:5px;
        height: 116px;
        .choose-file{
            text-align: center;
            padding: 25px 0 13px;
            position: relative;
            .success-file{
                background: rgba(243,247,247,1);
                color: $color;
                border-radius: 5px;
            }
            .el-icon-close{
                margin-left: 10px;
            }
            // .choose-btn{
            //     width: 128px;
            //     border: 1px solid $color;
            //     border-radius:5px;
            //     color: $color;
            //     margin-right: 20px;
            //     img{
            //         display: inline-block;
            //         vertical-align: middle;
            //         margin-right: 10px;
            //     }
            // }
            // .el-upload__tip{
            //     font-size:14px;
            //     color:rgba(153,153,153,1);
            //     margin-top: 15px;
            // }
        }
        .selfDesign{
            text-align: left;
            padding-top: 15px;
            padding-left: 15px;
            font-size:14px;
            color:rgba(51,51,51,1);
            .self-title{
                display: flex;
                img{
                    display: inline-block;
                    vertical-align: middle;
                }
                img:not(:nth-child(1)) {
                    cursor: pointer;
                }
                span{
                    margin-right: 51px;
                    margin-left: 8px;
                }
                img:last-child{
                    margin-left: 14px;
                }
            }
        }
    }
}
.product-price{
    margin: 24px 0 47px;
    p{
        display: flex;
        line-height:36px;
        font-size:14px;
        color:rgba(51,51,51,1);
        .price-title{
            margin-right: 14px;
        }
        .price{
            font-size:27px;
            font-family:MicrosoftYaHei-Bold;
            font-weight:bold;
            color:rgba(228,57,53,1);
            line-height: 32px;
            margin-right: 22px;
        }
        .deline{
            text-decoration: line-through;
        }
    }
    .time{
        display: flex;
        font-size:14px;
        color:rgba(102,102,102,1);
        line-height: 22px;
        img{
            display: inline-block;
            vertical-align: middle;
            margin-right: 7px;
        }
    }
}
.product-btn{
    height: 48px;
    line-height: 48px;
    display: flex;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(254,254,254,1);
    div{
        width: 167px;
        text-align: center;
        cursor: pointer;
    }
    .shopping-cart{
        background:rgba(243,152,0,1);
        border-radius:5px;
        margin-left: 29px;
    }
    .order{
        background:rgba(255,87,87,1);
        border-radius:5px;
    }
}

.right-detail /deep/ .el-dialog{
    width:1134px;
    background:rgba(255,255,255,1);
    border-radius:10px;
    text-align: center;
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
        padding: 26px 30px 20px;
        .choose-title{
            text-align: left;
            font-size: 18px;
            color: rgba(51,51,51,1);
            padding-bottom: 15px;
        }
        .template-list{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .active{
                &::before{
                    content: '';
                    background-image: url(/img/print/choose_blue.png);
                    display: inline-block;
                    position: absolute;
                    bottom: 47px;
                    right: 0;
                    width: 15px;
                    height: 15px;
                }
            }
            .template-item{
                width: 198px;
                height: 180px;
                text-align: center;
                margin-bottom: 20px;
                cursor: pointer;
                position: relative;
                .template-block{
                    background:rgba(213,221,227,1);
                    border-radius:5px;
                    height: 135px;
                    padding: 22px;
                    .item-image{
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        background-size: contain;
                        background-position: 50%;
                        background-repeat: no-repeat;
                    }
                }
                .template-title{
                    padding: 15px 0 13px;
                }
            }
        }
    }
    .el-dialog__footer{
        text-align: center;
        .el-button{
            border-radius: 5px;
            width: 179px;
            line-height: 24px;
            font-size: 18px;
        }
        .sure-btn{
            background:rgba(243,152,0,1);
            border: none;
            margin-right: 140px;
        }
        .create-btn{
            background: $color;
            color: rgba(255,255,255,1);
        }
    }
}
.right-detail /deep/ .upload .el-dialog{
    width: 630px;
}

#Loading{
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 1000;
}
</style>
