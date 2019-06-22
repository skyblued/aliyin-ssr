<template>
    <div class="steps">
        <div class="advertising-list">
            <a target="_blank" :href="item.NavigateUrl" v-for="(item,i) in banner" :key="i">
                <img :src="item.FileUrl && $store.state.port.imgBaseUrl + item.FileUrl" alt="" :title="item.AdvertisementName">
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            banner: []
        }
    },
    mounted() {
        this.$axios.get('/Advertise?ID=' + 138).then(res => {
            this.banner = res.data.Advertisements
        })
    }
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
