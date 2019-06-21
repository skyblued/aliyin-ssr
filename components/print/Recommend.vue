<template>
    <div class="recommend">
        <div class="recommend-img">
            <img :src="$store.state.port.staticPath + '/img/print/rmtj_icon.png'" alt="">
            <!-- <div v-for="(item,i) in banner" :key="i">
                <img ::src="$store.state.port.staticPath + '$store.state.port.imgBaseUrl+item.FileUrl" alt="">
            </div> -->
            <img :src="$store.state.port.staticPath + '/img/print/blue_bg.png'" alt="">
            <img :src="$store.state.port.staticPath + '/img/print/red_bg.png'" alt="">
            <img :src="$store.state.port.staticPath + '/img/print/orange_bg.png'" alt="">
        </div>
        <div class="advertise">

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
    methods: {
        getData() {
            var url = "/Advertise?ID="+128;
            this.$axios.get(url).then(res => {
                //console.log(res.data)
                this.banner = res.data.Advertisements
            })
        }
    },
    mounted () {
        this.getData()
    }
}
</script>

<style lang="scss" scoped>
.recommend-img{
    display: flex;
    justify-content: space-between;
}
.advertise{
    width: 100%;
    height:117px;
    background:rgba(225,240,247,1);
    border-radius:10px;
    margin: 20px 0 42px;
}
</style>
