<template>
    <div>
        <HeaderTop></HeaderTop>
		<Header></Header>
        <div id="about">
            <div class="about">
                <div class="about-aside">
                    <ul>
                        <!-- @click="handleChoose(i)" -->
                        <nuxt-link v-for="(item,i) in articleList" :key="i"
                            :to="`/content?id=${item.ClassID}&contentId=${item.Content[0].ContentID}`"
                            >
                            <li :class="{active: path == item.ClassID}" @click="handleChoose(i)">{{item.ClassName}}</li>
                        </nuxt-link>
                    </ul>
                </div>
                <div class="about-container">
                    <Abouts :contentList="contentList"></Abouts>
                </div>
            </div>
        </div>
		<Footer :qrcode="qrcode" :articleList="articleList"></Footer>
    </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import Header from '@/components/home/Header'
import Abouts from '@/components/Abouts'
import Footer from '@/components/Footer'
export default {
    name: 'about',
    components: {
		HeaderTop,
        Header,
        Abouts,
		Footer
    },
    async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
        let contentList = []
		let [FooterCode, FooterArticle] = await Promise.all([
			$axios.get(store.state.port.Advertise + '?ID=136'),
			$axios.get('/Articles')
        ])
		return {
			qrcode: FooterCode.data.Advertisements[0].FileUrl,
            articleList: FooterArticle.data,
            contentList
        }
    },
    mounted() {
        for(var i=0;i<this.articleList.length;i++) {
            if(this.$route.query.id == this.articleList[i].ClassID) {
                this.contentList = this.articleList[i].Content
            }
        }
    },
    methods: {
        handleChoose(i) {
            this.contentList = this.articleList[i].Content
            console.log(this.contentList)
        }
    },
    computed: {
        path() {
            return this.$route.query.id
        }
    }
}
</script>

<style lang="scss" scoped>
#about{
    width: 100%;
    background: rgba(244,244,244,1);
    padding-top: 20px;
    padding-bottom: 76px;
}
.about{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .about-aside{
        width: 233px;
        height: 486px;
        background:rgba(255,255,255,1);
        border-radius:5px;
        ul{
            display: flex;
            flex-direction: column;
            li{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 55px;
                color: rgba(51,51,51,1);
                font-size: 16px;
                border-bottom: 1px solid rgba(244,244,244,1);
                position: relative;
                &:hover::after{
                    content: '';
                    display: inline-block;
                    width: 5px;
                    height: 31px;
                    background: $color;
                    position: absolute;
                    left: 0;
                    top: 12px;
                }
            }
            .active{
                &::after{
                    content: '';
                    display: inline-block;
                    width: 5px;
                    height: 31px;
                    background: $color;
                    position: absolute;
                    left: 0;
                    top: 12px;
                }
            }
        }
    }
}
</style>
