<template>
    <div class="list">
        <div class="list-tabs">
            <span class="tabs-title">分类: </span>
            <div class="list-tabs-item">
                <span :class="{'active': isActive}" @click="handleClick">全部: </span>
                <span :class="{'active': activeIndex == i || item.Name == name}" @click="handleChange(i,item)" v-for="(item,i) in list" :key="i">{{item.Name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list: [],
            visiable: 1,
            isHot: 1,
            activeIndex: null,
            isActive: true
        }
    },
    methods: {
        getData() {
            var url = "/ThematicColumn?Visiable=" + this.visiable+"&IsHot="+ this.isHot
            this.$axios.get(url).then(res=>{
                //console.log(res.data)
                this.list = res.data
            })
        },
        handleChange(i,item) {
            this.activeIndex = i
            this.isActive = false
            let num = item.Num
            let name = item.Name
            this.$emit('getParam', {num,name})
            this.$router.push({path: '/hotdetail', query: {num,name}})
        },
        handleClick() {
            if(!this.isActive){
                this.isActive = true
                this.activeIndex = null
                this.$emit('getParam', {num: 0, name: ''})
                this.$router.push({path: '/hotdetail', query: {num: 0, name: ''}})
            }else{
                return 
            }
        }
    },
    mounted() {
        this.getData()
    },
    computed: {
        name() {
            if(this.$route.query.name){
                this.isActive = false
                return this.$route.query.name
            }else{
                return
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.list{
    height: 142px;
    background:rgba(255,255,255,1);
    box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius: 10px;
    user-select: none;
    .tabs-title{
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight:bold;
        color:rgba(51,51,51,1);
        margin-right: 20px;
    }
    .list-tabs{
        display: flex;
        font-size: 14px;
        //height: 37px;
        line-height: 37px;
        color:rgba(102,102,102,1);
        font-family: MicrosoftYaHei;
        font-weight: 400;
        padding: 32px 0 0 20px;
        .list-tabs-item{
            cursor: pointer;
            .active{
                background: $color;
                border-radius: 5px;
                color: rgba(255,255,255,1);
            }
            span{
                display: inline-block;
                margin: 0 21px;
                height: 37px;
                padding: 0 6px;
                &:hover{
                    background: $color;
                    border-radius: 5px;
                    color: rgba(255,255,255,1);
                }
            }
            span:first-child{
                padding: 0 15px;
                margin: 0;
            }
        }
    }
}
</style>
