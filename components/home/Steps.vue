<template>
    <div class="steps">
        <div class="advertising-list">
            <a target="_blank" :href="item.NavigateUrl" v-for="(item,i) in bannerList" :key="i">
                <img :src="item.FileUrl && $store.state.port.imgBaseUrl + item.FileUrl" alt="" :title="item.AdvertisementName">
            </a>
        </div>
    </div>
</template>

<script>
export default {
    props: ['bannerList'],
    data () {
        return {
            
        }
    },
}
</script>

<style lang="scss" scoped>
.steps{
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    .advertising-list{
        width: 100%;
        display: flex;
        justify-content: space-between;
        img{
            cursor: pointer;
        }
    }
}
</style>
