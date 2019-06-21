<template>
    <div class="footer active" v-if="path == '/recruit'">
        <div class="footer-content">
            <div class="footer-top">
                <span>关于我们</span>
                <span>商务合作</span>
                <span>免责声明</span>
                <span>隐私协议</span>
                <span>使用条款</span>
                <span>服务协议</span>
                <span>联系我们</span>
                <span>版权说明</span>
                <span>设计师招募</span>
                <span>帮助与支持</span>
            </div>
            <div class="footer-title">
                <p>友情链接: </p>
                <span>百度</span>
                <span>阿里巴巴</span>
                <span>腾讯</span>
                <span>支付宝</span>
                <span>微信</span>
                <span>花瓣</span>
                <span>千图网</span>
                <span>我图网</span>
                <span>阿里印</span>
                <span>我图网</span>
                <span>千图网</span>
                <span>包图网</span>
                <span>4K壁纸</span>
                <span>视达网</span>
                <span>摄图网</span>
            </div>
            <div class="footer-tips">
                <span>中国设计网导航</span>
                <span>软件下载</span>
                <span>PPT模板下载</span>
                <span>易图网</span>
                <span>壁纸win10系统下载</span>
                <span>雨林木风</span>
                <span>小程序</span>
                <span>员工福利</span>
            </div>
            <div class="footer-bottom">
                <span>copyright © 阿里印（武汉）科技有限公司 ICP备案号：鄂ICP备100000000号</span>
            </div>
        </div>
    </div>
    <div class="footer" v-else>
        <div class="footer-content">
            <div class="footer-top">
                <span>关于我们</span>
                <span>商务合作</span>
                <span>免责声明</span>
                <span>隐私协议</span>
                <span>使用条款</span>
                <span>服务协议</span>
                <span>联系我们</span>
                <span>版权说明</span>
                <span>设计师招募</span>
                <span>帮助与支持</span>
            </div>
            <div class="footer-title">
                <p>友情链接: </p>
                <span>百度</span>
                <span>阿里巴巴</span>
                <span>腾讯</span>
                <span>支付宝</span>
                <span>微信</span>
                <span>花瓣</span>
                <span>千图网</span>
                <span>我图网</span>
                <span>阿里印</span>
                <span>我图网</span>
                <span>千图网</span>
                <span>包图网</span>
                <span>4K壁纸</span>
                <span>视达网</span>
                <span>摄图网</span>
            </div>
            <div class="footer-tips">
                <span>中国设计网导航</span>
                <span>软件下载</span>
                <span>PPT模板下载</span>
                <span>易图网</span>
                <span>壁纸win10系统下载</span>
                <span>雨林木风</span>
                <span>小程序</span>
                <span>员工福利</span>
            </div>
            <div class="footer-bottom">
                <span>copyright © 阿里印（武汉）科技有限公司 ICP备案号：鄂ICP备100000000号</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        path() {
            return this.$route.fullPath
        }
    }
}
</script>

<style lang="scss" scoped>
.footer{
    height:226px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 44px 10px rgba(203,211,217,0.4);
    margin-top: 0;
}
.active{
    height: 364px;
    background-image: url(/img/home/recruit/bottom_bg.png);
    background-repeat: no-repeat;
    background-position: 100%;
    .footer-content{
        padding-top: 120px;
        .footer-top, .footer-title, .footer-tips{
            color: rgba(255,255,255,1);
            &:hover span{
                color: rgba(255,255,255,1);
            }
        } 
        .footer-bottom{
            color: rgba(255,255,255,.6);
            &:hover span{
                color: rgba(255,255,255,.6);
            }
        }
    }
}
.footer-content{
    width: 1200px;
    margin: 0 auto;
    padding-top: 43px;
}
.footer-content .footer-top{
    width:942px;
    height:17px;
    line-height: 17px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
}
.footer-content span{
    cursor: pointer;
}
.footer-content span:hover{
    color: #0083E9;
}
.footer-content .footer-title, .footer-tips{
    height:13px;
    line-height: 13px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    display: flex;
    justify-content: space-between;
    margin: 24px auto 0;
}
.footer-content .footer-title{
    width: 996px;
    margin: 24px auto 0;
}
.footer-content .footer-tips{
    width: 730px;
    margin: 25px auto 0;
}
.footer-content .footer-title p{
    display: inline-block;
}
.footer-content .footer-bottom{
    width:493px;
    height:14px;
    line-height: 14px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,.6);
    margin: 44px auto 33px;
}
</style>
