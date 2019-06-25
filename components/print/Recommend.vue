<template>
    <div class="recommend">
        <div class="recommend-img">
            <img :src="$store.state.port.staticPath + '/img/print/rmtj_icon.png'" alt="">
            <div v-for="(item,i) in recommendList" :key="i">
                <a target="_blank" :href="item.NavigateUrl.indexOf('www') > -1 ? item.NavigateUrl : 'javascript:;'">
                    <img :src="$store.state.port.imgBaseUrl + item.FileUrl" alt="">
                </a>
            </div>
        </div>
        <div class="advertise" v-if="banner">
            <a target="_blank" :href="banner.NavigateUrl.indexOf('www') > -1 ? banner.NavigateUrl : 'javascript:;'">
                <img :src="$store.state.port.imgBaseUrl + banner.FileUrl" alt="">
            </a>
        </div>
    </div>
</template>

<script>
export default {
    props: ['recommendList','banner'],
    data () {
        return {
            // banner: '',
            // commandList: []
        }
    },
    methods: {
        getCommand() {
            var url = "/Advertise?ID="+134;
            this.$axios.get(url).then(res => {
                // console.log(res.data)
                this.commandList = res.data.Advertisements
            })
        },
        getData() {
            var url = "/Advertise?ID="+135;
            this.$axios.get(url).then(res => {
                // console.log(res.data)
                var data = res.data.Advertisements
                this.banner = data.splice(0,1)
                this.$bus.$emit('setBanner', data)
            })
        }
    },
    created () {
        // this.getCommand()
        // this.getData()
    },
}
</script>

<style lang="scss" scoped>
.recommend{
    width: 1200px;
    margin: 0 auto;
}
.recommend-img{
    display: flex;
    justify-content: space-between;
}
.advertise{
    width: 100%;
    height:117px;
    border-radius:10px;
    margin: 20px 0 42px;
}
</style>
