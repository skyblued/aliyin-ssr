<template>
    <div id="price-list">
        <div class="price-list">
            <p class="title">
                <img :src="$store.state.port.staticPath + '/img/home/recruit/sunlight.png'" alt="">
                <span>白天，认证设计师，上传模板</span>
            </p>
            <p class="title second">
                <img :src="$store.state.port.staticPath + '/img/home/recruit/moon.png'" alt="">
                <span>夜晚，躺下安心睡觉</span>
                <img :src="$store.state.port.staticPath + '/img/home/recruit/sleep.png'" alt="">
            </p>
            <p class="title">第二天，收入到账，躺着也能赚钱<img :src="$store.state.port.staticPath + '/img/home/recruit/price.png'">   还不赶紧 <img :src="$store.state.port.staticPath + '/img/home/recruit/joinus.png'"></p>
            <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                border>
                <el-table-column
                    prop="scene"
                    label="场景"
                    width="245">
                    <template slot-scope="scope">
                        <span class="scene">{{scope.row.scene}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="分类">
                    <template slot-scope="scope">
                        <span class="tabs-classify">{{scope.row.classify}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="218"
                    label="价格/元">
                    <template slot-scope="scope">
                        <span class="tabs-price">{{scope.row.price}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="more-scene">更多制作场景</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tableData: [{
                id: 1,
                scene: '印刷广告',
                classify: '纸质名片、PVC卡片、宣传单页、印刷海报、不干胶贴、',
                price: '￥50'
            },{
                id: 2,
                scene: '印刷广告',
                classify: '代金卷、手提袋、折页、易拉宝、×展架、门型展架、',
                price: '￥50'
            },{
                id: 3,
                scene: '印刷广告',
                classify: '工作证、画册、挂画、照片书、',
                price: '￥50'
            },{
                id: 4,
                scene: '印刷广告',
                classify: '食品酒水单、笔记本、门票/入场卷、停车卡、',
                price: '￥50'
            },{
                id: 5,
                scene: '印刷广告',
                classify: '信纸、信封、红包、便签、授权书、纸杯、档案袋、封套、纸巾盒、',
                price: '￥50'
            },{
                id: 6,
                scene: '印刷广告',
                classify: '鼠标垫、联单/单据、台历、条幅、地贴、广告扇',
                price: '￥50'
            },{
                id: 7,
                scene: '手机社交',
                classify: '公众号封面首图、公众号封面小图、公众号正文配图、微信二维码、',
                price: '￥50'
            },{
                id: 8,
                scene: '手机社交',
                classify: '邀请函、营销长图、朋友圈配图、手机截屏、',
                price: '￥50'
            },{
                id: 9,
                scene: '手机社交',
                classify: '微信朋友圈封面、微信运动封面图、微信头像、手机海报、',
                price: '￥50'
            },{
                id: 10,
                scene: '手机社交',
                classify: '朋友圈日签、微博焦点图、聊天记录',
                price: '￥50'
            },{
                id: 11,
                scene: '电商网站',
                classify: '淘宝店招、淘宝店首页轮播、',
                price: '￥50'
            },{
                id: 12,
                scene: '电商网站',
                classify: '直通车主图、广告条幅、轮播图片',
                price: '￥50'
            },{
                id: 13,
                scene: '办公文档',
                classify: 'PPT、简历',
                price: '￥50'
            }],
            spanArr: [],
            position: 0,
        }
    },
    methods: {
        rowspan() {
            this.tableData.forEach((item,index) => {
                if (index === 0) {
                    this.spanArr.push(1);
                    this.position = 0
                } else {
                    if (this.tableData[index].scene === this.tableData[index - 1].scene) {
                        this.spanArr[this.position] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.position = index;
                    }
                }
            })
        },


        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        }
    },
    mounted() {
        this.rowspan()
    }
}
</script>

<style lang="scss" scoped>
#price-list{
    width: 100%;
    position: relative;
    top: -160px;
    .price-list{
        width: 1200px;
        margin: 0 auto;
        background:rgba(97,79,252,1);
        box-shadow:0px 0px 78px 20px rgba(97,79,252,0.41);
        border-radius:10px;
        text-align: center;
        padding: 66px 48px 58px;
        .title{
            font-size:26px;
            color:rgba(255,255,255,1);
            height: 50px;
            line-height: 50px;
            img{
                display: inline-block;
                vertical-align: middle;
            }
        }
        .more-scene{
            font-size:24px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:34px;
            opacity:0.5;
            margin-top: 53px;
            cursor: pointer;
        }
    }
}

.price-list /deep/ .el-table{
    background:rgba(255,255,255,1);
    border-radius: 10px;
    margin-top: 65px;
    font-size:20px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    td{
        padding: 0;
    }
    th{
        padding: 8px 0;
        font-size:30px;
    }
    .scene{
        font-size: 30px;
    }
    .el-table__row:last-child td{
        padding: 20px 0;
    }
    .tabs-price{
        font-size:24px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(255,132,0,1);
    }
    .tabs-classify{
        display: inline-block;
        width: 100%;
        text-align: left;
        padding-left: 20px;
    }
}
</style>
