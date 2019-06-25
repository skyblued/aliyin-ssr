<template>
    <div class="about-us">
        <div class="about-header">
            <div class="header-tabs">
                <nuxt-link v-for="(item,i) in contentList" :key="i" :to="`/content?id=${item.ClassID}&contentId=${item.ContentID}`">
                    <div :class="{'tab-menu':true, active: path == item.ContentID}" @click="handleChoose(i)">
                        <span>{{item.Title}}</span>
                    </div>
                </nuxt-link>
            </div>
        </div>
        <div class="about-content" v-if="contentList.length && contentList[index].Description">
            <div v-html="contentList.length && contentList[index].Description"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            index: 0
        }
    },
    props: ['contentList'],
    methods: {
        handleChoose(i) {
            this.index = i
        }
    },
    mounted() {
        window.scrollTo(0,0)
    },
    computed: {
        path() {
            return this.$route.query.contentId
        }
    }
}
</script>

<style lang="scss">
.about-us{
    width: 947px;
}
.about-header{
    width: 100%;
    height:65px;
    line-height: 65px;
    background:rgba(255,255,255,1);
    border-radius:5px;
    .header-tabs{
        display: flex;
        align-items: center;
        padding-left: 33px;
        .tab-menu{
            margin-right: 40px;
            color:rgba(153,153,153,1);
            font-size: 16px;
            min-width: 82px;
            text-align: center;
            position: relative;
            cursor: pointer;
            &:hover{
                color: $color;
            }
            &:hover::before{
                content: '';
                display: inline-block;
                background-image: url(/img/personal/line_icon.png);
                background-repeat: no-repeat;
                width: 100%;
                height: 4px;
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }
        .active{
            color: $color;
            &::before{
                content: '';
                display: inline-block;
                background-image: url(/img/personal/line_icon.png);
                background-repeat: no-repeat;
                width: 100%;
                height: 4px;
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }
    }
}
.about-content{
    width: 100%;
    height: auto;
    background:rgba(255,255,255,1);
    border-radius:5px;
    margin-top: 20px;
    padding: 30px;
}
</style>
