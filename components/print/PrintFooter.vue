<template>
    <div id="footer-list">
        <div class="footer-list">
            <div class="footer-item" v-for="(item,i) in footerlist" :key=i>
                <img :src="$store.state.port.staticPath + item.src" alt="">
                <div class='footer-titles'>
                    <p>{{item.title}}</p>
                    <p>{{item.tip}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            footerlist: [{
                src: '/img/print/mfsj_icon.png',
                title: '免费设计',
                tip: '海量模板自助设计'
            },{
                src: '/img/print/ksjh_icon.png',
                title: '快速交货',
                tip: '全国工厂就近生产'
            },{
                src: '/img/print/cjzx_icon.png',
                title: '厂家直销',
                tip: '没有中间商赚差价'
            },{
                src: '/img/print/pzbz_icon.png',
                title: '品质保障',
                tip: '质量问题一律重印'
            }]
        }
    }
}
</script>

<style lang="scss" scoped>
#footer-list{
    width: 100%;
    background: #f4f4f4;
}
.footer-list{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding-bottom: 26px;
    .footer-item{
        background:rgba(255,255,255,1);
        border-radius:5px;
        text-align: center;
        display: flex;
        border-radius:5px;
        padding: 24px 38px 24px 29px;
        img{
            vertical-align: middle;
            display: inline-block;
            margin-right: 33px;
        }
        .footer-titles{
            text-align: left;
            font-family:MicrosoftYaHei;
            font-weight:400;
            line-height: 30px;
            p:first-child{
                font-size:20px;
                color:rgba(51,51,51,1);
            }
            p:last-child{
                font-size:16px;
                color:rgba(153,153,153,1);
            }
        }
    }
}
</style>
