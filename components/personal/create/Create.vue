<template>
    <div class="create">
        <Header></Header>
        <Main :List="List"></Main>
    </div>
</template>

<script>
import Header from '@/components/personal/create/Header.vue'
import Main from '@/components/personal/create/Main.vue'
export default {
    data () {
        return {
            List: [],
            ProductTypeList: [],
        }
    },
    methods: {
        getData() {
            this.$axios.get(this.$store.state.port.AllTemplate).then((res) => {
                console.log(res.data)
                this.List = res.data
            })
        }
    },
    mounted() {
        this.getData()
    },
    components: {
        Header,
        Main
    }
}
</script>

<style lang="scss" scoped>
.create{
    width: 100%;
    //overflow-y: auto;
}
</style>
