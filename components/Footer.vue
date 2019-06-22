<template>
    <div class="footer">
        <div class="footer-content">
            <div class="content-left" v-if="ArticlesList.length">
                <ul v-for="(item,i) in ArticlesList" :key="i">
                    <li>{{item.ClassName}}</li>
                    <li v-for="(items,index) in item.Content" :key="index" @click="handleJump(items)">{{items.Title}}</li>
                </ul>
            </div>
            <div class="content-right">
                <div class="contact">
                    <p>400-097-5123</p>
                    <p>周一至周五 9:00-18:00</p>
                    <div class="customer-service">
                        <a href="http://wpa.qq.com/msgrd?v=3&uin=1415538799&site=qq&menu=yes" target="_blank">
                            <span>在线客服</span>
                        </a>
                    </div>
                </div>
                <div class="public-code">
                    <img :src="qrcode && $store.state.port.imgBaseUrl + qrcode" alt="">
                    <p>微信公众号</p>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div style="margin:0  auto;  padding:20px  0;">
                <p  style="margin: 0 auto;  color:#939393;line-height:23px;font-size:14px;">
                    Copyright © 阿里印（武汉）科技有限公司&nbsp; 
                    <a target="_blank" href="http://www.beian.miit.gov.cn" style="color: rgba(153,153,153,1);"> 
                        <span class="link">ICP备案号: 鄂 ICP备 16021980号-3：</span>
                    </a> &nbsp;
                    <a  target="_blank"  href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42011202001340"  style="display:inline-block;text-decoration:none;color: rgba(153,153,153,1);">
                        <img  :src="$store.state.port.staticPath + '/img/home/footer_icon.png'" />
                        <span class="link">鄂公网安备  42011202001340号 </span>
                    </a> 
                    <br> 
                    座机：027-59760849  客服热线：4000-975-123   地址：湖北省武汉市东湖高新区武汉大学科技园武大航域A3栋
                    <a target="_blank" href="http://www.gsxt.gov.cn/%7B61A4CE9206C23F1FEAB664A055B183174B0431C4004FABF59F5BCF93DC3D9FC3115EBAE48E4A7F5FC85C7CEBDE0C39FD4DDBA1F35012533E7C067D1052341B24FD28FD28FDC2FD24F1A772A772A772A7729A1E6D3B4891D6487A9B15D722C6F4E436A2579DCB9DEE3BC8FDDD4A7F3002F73D6BBE6BBE6BBE-1559177601655%7D">
                        <img style="width: 20px;height: 20px;display: inline-block;vertical-align: middle;" :src="$store.state.port.staticPath + '/img/home/govIcon.gif'" >
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            qrcode: '',
            ArticlesList: []
        }
    },
    mounted() {
        var url = "/Advertise?ID="+136;
        this.$axios.get(url).then(res => {
            if(res.data == undefined) return console.log('没有数据')
            // console.log(res.data)
            var data = res.data.Advertisements
            this.qrcode = data[0].FileUrl
        })
        this.getArticles()
    },
    methods: {
        getArticles() {
            this.$axios.get('/Articles').then(res => {
                // console.log(res.data)
                this.ArticlesList = res.data
            })
        },
        handleJump(items) {
            let id = items.ClassID
            let contentId = items.ContentID
            this.$router.push({path: '/content', query: {id: id,contentId: contentId}})
        }
    },
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
    .footer-content{
        width: 1200px;
        margin: 0 auto;
        padding-top: 43px;
        display: flex;
        justify-content: space-between;
        user-select: none;
        .content-left{
            width: 540px;
            display: flex;
            justify-content: space-between;
            ul{
                display: flex;
                flex-direction: column;
                li{
                    font-size: 14px;
                    color: rgba(153,153,153,1);
                    line-height: 28px;
                    text-align: left;
                    cursor: pointer;
                    &:hover{
                        color: $color;
                    }
                    a{
                        color: rgba(153,153,153,1);
                        &:hover{
                            color: $color; 
                        }
                    }
                }
                li:first-child{
                    color: rgba(51,51,51,1);
                    margin-bottom: 10px;
                }
            }
        }
        .content-right{
            display: flex;
            align-items: center;
            .contact{
                color: rgba(153,153,153,1);
                p:first-child{
                    font-size: 24px;
                    font-weight: bold;
                    color: rgba(51,51,51,1);
                }
                p:nth-child(2){
                    margin: 24px 0 15px;
                }
                .customer-service{
                    height: 42px;
                    line-height: 42px;
                    padding: 0 12px;
                    text-align: center;  
                    border: 1px transparent solid;
                    position: relative;
                    cursor: pointer;
                    a{
                        color: rgba(51,51,51,1);
                    }
                    span{
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: block;
                        width: 100%;
                        height: 100%;
                        background: #fff;
                        border-radius: 23px;
                        z-index: 1;
                    }
                    &::after{
                        content: '';
                        position: absolute;
                        top: -1px;left: -1px;right: -1px;bottom: -1px;
                        background: linear-gradient(to right, #17b6ff, #6094e9, #9c36ff);
                        border-radius: 23px;
                        z-index: 0;
                    }
                }
            }
            .public-code{
                margin-left: 46px;
                text-align: center;
                img{
                    width: 121px;
                    height: 121px;
                }
            }
        }
    }
    .footer-bottom{
        width: 100%;
        background: rgba(236,236,236,1);
        text-align: center;
        color: rgba(153,153,153,1);
        margin-top: 40px;
        .link{
            color: rgba(153,153,153,1);
            &:hover{
                color: $color;
            }
        }
    }
}
</style>
