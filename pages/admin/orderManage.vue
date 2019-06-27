<template>
    <div class="order-manage">
        <div class="order-header">
            <div class="code">
                <span class="text">订单号: </span>
                <span>
                    <el-input v-model="orderCode"></el-input>
                </span>
            </div>
            <div class="status">
                <span class="text">订单状态: </span>
                <span class="selected" @mouseenter="enter" @mouseleave="leave">
                    <span style="padding-left: 18px">{{state}}</span>
                    <span class="select-icon"></span>
                    <ul class="list" ref="list">
                        <li :class="{active: isState == i}" v-for="(item,i) in stateList" :key="i" @click="handleChooseState(i)">{{item.label}}</li>
                    </ul>
                </span>
            </div>
            <div class="search-btn" @click="getOrderList">搜索</div>
        </div>

        <div class="order-content">
            <div class="order-list">
                <div class="order-item" v-for="(item,i) in orderList" :key="i">
                    <div class="order-item-header">
                        <div class="header-left">
                            <span class="order-time">{{item.CreatedDate && item.CreatedDate.split('T').join(' ')}}</span>
                            <span class="order-code">{{item.OrderCode}}</span>
                            <span class="order-price">总额: <span style="color: red">{{item.Amount && item.Amount.toFixed(2)}}</span></span>
                        </div>
                        <div class="header-right">
                            <span v-if="item.PaymentStatus == '0'">未支付</span>
                            <span v-else style="color: #745bff">已支付</span>
                        </div>
                    </div>
                    <div class="orderInfo-list">
                        <div class="orderInfo-item" v-for="(items,index) in item.OrderItems" :key="index">
                            <div class="orderInfo-thumb">
                                <div class="orderInfo-thumb-wrap">
                                    <div class="thumbnail" v-if="items.FilePath.indexOf('.png') > -1" :style="{'background-image':`url(${$store.state.port.imgBaseUrl + items.FilePath})`}"></div>
                                    <div class="thumbnail" v-else :style="{'background-image': `url(${items.ThumbnailsUrl.indexOf('aliyin') > -1 ? items.ThumbnailsUrl : $store.state.port.imgBaseUrl+items.ThumbnailsUrl})`}"></div>
                                </div>
                                <div class="orderInfo-tip">
                                    <p>名称: <span>{{items.Name}}</span></p>
                                    <p>规格: <span>{{items.AttributeNames}}</span></p>
                                    <p v-if="items.SizeName">尺寸: <span>{{items.SizeName}}</span></p>
                                    <p v-if="items.CraftNames">工艺: <span>{{items.CraftNames}}</span></p>
                                </div>
                            </div>
                            <div class="orderInfo-name" v-if="item.OrderType == 1">印刷订单</div>
                            <div class="download-temp" style="min-width: 120px;text-align: center; cursor: pointer;" v-if="items.ItemType == 7" @click="handleToDesign(items)">
                                <span title="点击进入设计器">{{items.DocumentName}}</span>
                                <!-- <img @click="handleDownloadTemp(item,items)" src="/img/desicon/header/download_icon.png" alt=""> -->
                            </div>
                            <div class="orderInfo-file" v-else style="width: 120px;text-align: center; cursor: pointer;">
                                <!-- <div v-if="!items.FilePath" class="upload-file" @click="handleUpload(items,i)">
                                    <img src="/img/print/xqy_scwj_icon.png" alt="">
                                    <span>上传文件</span>
                                </div> -->
                                <span  @click="handleDownload(items)" title="点击可下载文件">
                                    <span class="file-name">{{items.FileName ? items.FileName : '未命名'}}</span>
                                    <!-- <img src="/img/print/xqy_refresh_icon.png" alt="" title="重新上传文件" @click.stop="handleUpload(items,i)"> -->
                                </span>
                            </div>
                            <div class="orderInfo-number" style="width: 110px;">{{items.Quantity}}{{items.Unit}}</div>
                            <div style="color: rgba(255, 1, 1, 1);width: 60px">￥{{item.Amount}}</div>
                            <div class="orderInfo-state" v-if="items.PrintStatus == 0">等待印刷</div>
                            <div class="orderInfo-state" v-if="items.PrintStatus == 1">印刷完成</div>
                            <div class="orderInfo-state" v-if="items.PrintStatus == 2">印刷完成</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="上传文件" :visible.sync="$store.state.dialogUpload" :close-on-click-modal="false">
            <UploadFile @setCartFile="setCartFile"></UploadFile>
        </el-dialog>
        <div class="block" v-if="orderList.length && page.totalRecords > 20">
            <HomePagination :Page="page" @getTempList="getOrderList" />
        </div>
    </div>  
</template>

<script>
import svgToPng from 'save-svg-as-png'
import HomePagination from '@/components/home/HomePagination.vue'
import UploadFile from '@/components/share/UploadFile.vue'
export default {
    data () {
        return {
            orderCode: '',
            stateId: '-1',
            state: '全部',
            isState: 0,
            stateList: [{
                value: '-1',
                label: '全部'
            },{
                value: '0',
                label: '未支付'
            },{
                value: '2',
                label: '已支付'
            }],
            orderList: [],
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 20,    // 每页个数
            },
            itemId: '',
            filepath: '',
            filename: ''
        }
    },
    methods: {
        enter() {
            this.$refs.list.style.maxHeight = '270px'
            this.$refs.list.style.overflow = 'hidden'
        },
        leave() {
            this.$refs.list.style.maxHeight = '0'
        },
        handleChooseState(i) {
            this.isState = i
            this.state = this.stateList[i].label
            this.stateId = this.stateList[i].value
        },

        // 获取全部订单列表
        getOrderList() {
            this.orderList = []
            var url = "/OrderManger?status=" + this.stateId + '&pageIndex=' + this.page.currentPage + '&pageSize=' + this.page.pageSize + '&orderCode=' + this.orderCode;
            this.$axios.get(url).then(res => {
                if(res.data == '你不是管理员') {
                    this.$message.warning(res.data)
                    return
                }
                console.log(JSON.parse(res.data))
                var data = JSON.parse(res.data).Data
                this.orderList = data
                this.page.totalRecords = JSON.parse(res.data)['X-Pagination'].TotalCount
            })
        },
        handleToDesign(item) {
            let str = 'DocumentNumber=' + item.DocumentNumber + '&admin=admin'
            str = window.btoa(str)
            window.open('/design/'+ str)
        },

        // 打开上传文件弹框
        handleUpload(items,i) {
            if(this.orderList[i].PaymentStatus != '0') return this.$message.warning('该订单已支付无法上传文件')
            this.itemId = items.ItemId
            this.$store.commit('setDialogUpload', true)
        },
        setCartFile(msg) {
            console.log(msg)
            this.filepath = msg.path
            this.filename = msg.name
            this.$nextTick(() => {
                this.getUpload()
            })
        }, 
        getUpload() { // 确定上传文件
            var formData = new FormData()
            formData.append('ItemID', this.itemId);
            formData.append('FilePath', this.filepath);
            formData.append('FileName', this.filename);
            console.log(this.itemId, this.filepath, this.filename, '参数')
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/UploadOrderFile', formData, config).then(res => {
                console.log(res.data)
                if(res.data.state == 'ok'){
                    this.$message.success(res.data.message)
                    this.getOrderList()
                }else{
                    this.$message.warning(res.data.message)
                }
            })
        },
        // 下载文件  png
        handleDownload(items){
            var url = items.FilePath.split('.')[1]
            if(url == 'zip'){
                window.open(this.$store.state.port.imgBaseUrl + items.FilePath)
            }

            var canvas = document.createElement('canvas');
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onerror = function () {
                return 
            };
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                
                svgToPng.download(items.FileName, canvas.toDataURL('image/png'))
            };
            img.src = this.$store.state.port.imgBaseUrl + items.FilePath;
        },

        // 下载文件 pdf
        // handleDownloadTemp(item,items) {
        //     console.log(item,items)
        //     this.$axios.get(this.$store.state.port.imgBaseUrl + items.FilePath, {responseType: 'blob'})
        //     .then(({data}) => {
        //         var a = document.createElement('a')
        //         a.download = '订单号:' + item.OrderCode + ' ' + '子订单号: '  + items.OrderId + ' ' + '产品名称: ' + items.TypeName + ' ' + '报价单名称: ' + items.Name + ' ' + '尺寸: ' + items.SizeName + ' ' + '价格: ' + items.Amount + ' ' + '数量: ' + items.Quantity + items.Unit + ' ' + '发货地区: ' + item.ShipRegion + ' ' + '地址: ' + item.ShipAddress + ' ' + '收货人: ' + item.ShipName + ' ' + '电话: ' + item.ShipCellPhone + ' ' + '模板名称: ' + items.DocumentName + '.pdf'
        //         a.href = URL.createObjectURL(data)
        //         a.click()
        //         a = null
        //     })
        // }
    },
    mounted() {
        this.getOrderList()
    },
    components: {
        HomePagination,
        UploadFile
    }
}
</script>

<style lang="scss" scoped>
.order-manage{
    padding-left: 10px;
    .order-header{
        display: flex;
        min-width: 1200px;
        line-height: 37px;
        padding: 20px 28px 19px 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        .code, .status{
            display: flex;
            height: 37px;
            font-size: 14px;
            margin-right: 20px;
        }
        .text{
            margin-right: 15px;
        }
        .status .selected{
            height: 100%;
            width: 158px;
            border: 1px solid rgba(220,223,230,1);
            border-radius: 3px;
            display: inline-block;
            position: relative;
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
                transition: max-height .3s ease;
                position: absolute;
                top: 37px;
                left: 0;
                z-index: 20;
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
        .search-btn{
            width: 60px;
            height: 37px;
            line-height: 37px;
            text-align: center;
            color: rgba(255,255,255,1);
            background: $color;
            border-radius: 5px;
            cursor: pointer;
        }
    }
    .order-content{
        min-width: 1200px;
        margin-top: 20px;
        .order-list{
            .order-item{
                background:rgba(230,230,230,.3);
                box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
                border-radius:10px;
                font-size:14px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(51,51,51,1);
                margin-bottom: 20px;
                .order-item-header{
                    display: flex;
                    justify-content: space-between;
                    color:rgba(102,102,102,1);
                    line-height: 34px;
                    padding: 14px 30px 13px;
                    .order-code{
                        margin: 0 40px;
                    }
                }
                .download-temp{
                    img{
                        display: inline-block;
                        vertical-align: middle;
                        cursor: pointer;
                    }
                }
                .orderInfo-file .file-name{
                    display: inline-block;
                    width: 120px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
.order-manage /deep/ .el-input .el-input__inner{
    height: 37px;
    line-height: 37px;
}
.order-manage /deep/ .el-dialog{
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

.orderInfo-list{
    .orderInfo-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 30px;
        border-top: 1px solid rgba(244,244,244,1);
        .orderInfo-thumb{
            display: flex;
            min-width: 400px;
            align-items: center;
            .orderInfo-thumb-wrap{
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
            .orderInfo-tip{
                line-height: 30px;
            }
        }
        .orderInfo-file{
            width: 248px;
            text-align: center;
            .fileName{
                display: inline-block;
                width: 180px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            img{
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
            }
            .del{
                margin-left: 12px;
                cursor: pointer;
            }
            span, span img{
                cursor: pointer;
            }
        }
        .orderInfo-number{
            min-width: 50px;
            text-align: center;
        }
        .orderInfo-state{
            width: 65px;
            text-align: center;
        }
    }
}
</style>
