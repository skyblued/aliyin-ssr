<template>
    <div class="hot-subject">
        <div class="hot-subject-title">
            当前位置: 热门专题
        </div>
        <div class="content" v-if="list[0]">
            <div class="content-item" v-for="(item,i) in list" :key="i" @click="handleClick(item)">
                <div class="content-item-wrap">
                    <img :src="$store.state.port.imgBaseUrl+item.Img" alt="">
                </div>
                <div class="content-description">
                    <p>{{item.Name}}</p>
                    <p>
                        <img :src="$store.state.port.staticPath + '/img/home/use_icon.png'" alt="">
                        <span>浏览量: {{item.AddPeople}}</span>
                    </p>
                </div>
            </div>
            <div class="content-item" style="height: 0px;visibility: hidden;"></div>
            <div class="content-item" style="height: 0px;visibility: hidden;"></div>
            <div class="content-item" style="height: 0px;visibility: hidden;"></div>
        </div>
        <HomePagination class="pagination" :Page="page" />
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data() {
        return {
            page: {
                currentPage: 1,  // 当前页
                pageSize: 10,  // 每页个数
                totalRecords: 100, // 总条数
            }
        }
    },
    props: ["list"],
    methods: {
        // 跳转专题详情
        handleClick(item) {
            let name = item.Name
            let num = item.Num
            this.$router.push({path: '/hotDetail', query: {name,num}})
        }
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss" scoped>
.hot-subject{
    width: 1200px;
    margin: 0 auto;
    user-select: none;
}
.hot-subject-title{
    line-height: 15px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    text-align: left;
    margin-top: 22px;
}
.content{
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 25px auto 0;
}
.content .content-item{
    width:377px;
    height:244px;
    margin-bottom: 36px;
    cursor: pointer;
}
.content .content-item .content-item-wrap{
    width: 100%;
    height: 196px;
}
.content-item img{
    border-radius: 10px 10px 0 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    transition: transform 1s ease;
    &:hover {
        transform: scale(1.1);
    }
}
.content-description{
    width:100%;
    height:48px;
    background:rgba(255, 255, 255,1);
    border-radius: 0 0 10px 10px;
    padding: 17px 20px;
    display: flex;
    justify-content: space-between;
    p{
        line-height: 14px;
        font-size:14px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
        img{
            width: 19px;
            height: 13px;
            margin-right: 7px;
            vertical-align: middle;
        }
    }
}

.pagination{
    margin-top: -27px;
}
</style>
