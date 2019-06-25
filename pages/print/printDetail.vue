<template>
    <div id="print-detail">
        <div class="print-detail">
            <div class="breadcrumb-nav">
                <span>当前位置: </span>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/print' }">在线印刷</el-breadcrumb-item>
                    <el-breadcrumb-item>商品详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="print-detail-content">
                <LeftDetail :info="info"></LeftDetail>
                <RightDetail :info="info"></RightDetail>
            </div>
            <div class="product-detail">
                <p>产品详情</p>
                <div v-html="info.length && info[0].Description"></div>
            </div>

            <div class="footer">
                <PrintFooter></PrintFooter>
            </div>
        </div>
    </div>
</template>

<script>
import LeftDetail from '@/components/printdetail/LeftDetail'
import RightDetail from '@/components/printdetail/RightDetail'
import PrintFooter from '@/components/print/PrintFooter'
export default {
    components: {
        LeftDetail,
        RightDetail,
        PrintFooter
    },
    async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
        var typeId = route.query.id;
		let [LeftDetail] = await Promise.all([
			$axios.get('/ProductSheet?TypeID=' + typeId),
		])
		return {
			info: LeftDetail.data
		}
    },
    mounted() {
        // console.log(this.info)
        window.scrollTo(0,0)
    }
}
</script>

<style lang="scss" scoped>
#print-detail{
    width: 100%;
    background: rgba(244,244,244,1);
}
.print-detail{
    width: 1200px;
    margin: 0 auto;
    // padding-bottom: 26px;
    .breadcrumb-nav{
        display: flex;
        line-height: 16px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color:rgba(153,153,153,1);
        text-align: left;
        margin-top: 18px;
        margin-bottom: 25px;
        span{
            margin-right: 10px;
            cursor: pointer;
        }
    }
    .print-detail-content{
        display: flex;
        justify-content: space-between;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        padding: 30px;
    }
    .product-detail{
        margin-top: 15px;
        text-align: center;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        padding-bottom: 29px;
        p{
            font-size:20px; 
            color:rgba(51,51,51,1);
            text-align: left;
            img{
                width: 100%;
            }
        }
        p:first-child{
            padding: 25px 0 29px 29px;
        }
        p:last-child{
            height: 100%;
            padding: 0 29px;
        }
    }
    .footer{
        margin-top: 117px;
    }
}
</style>
