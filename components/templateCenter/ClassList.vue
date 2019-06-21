<template>
    <div class="class-list">
        <div class="first-tabs">
            <span class="tabs-title">全部: </span>
            <div class="first-tabs-list">
                <span :class="{'active' : isActive}" @click="handleAll">全部</span>
                <span :class="{'active': activeIndex == i || items.ClassName == firstname}" v-for="(items,i) in classList" :key="i" @click="handleChange(i)">{{items.ClassName}}</span>
            </div>
        </div>
        <div class="second-tabs" v-if="secondList.length">
            <span class="tabs-title">分类: </span>
            <div class="second-tabs-list">
                <span :class="{'active': (Index == index && isActive == false) || item.TypeName == name}" v-for="(item,index) in secondList" :key="index" @click="handleGet(index)">{{item.TypeName}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            classList: [],
            secondList: [],
            Index: null,
            activeIndex: null,
            isActive: true,
            productNum: '',
            typeId: '',
            title: '',
            subtitle: '',
            i: '',
        }
    },
    methods: {
        handleAll() {
            if(this.isActive){
                this.activeIndex = null
                this.Index = null
            }else{
                this.isActive = true
                this.activeIndex = null
                this.Index = null
                this.secondList = []
                this.typeId = ''
                //this.$emit('getParam',{typeId: '', title: '', subtitle: ''})
                this.$router.push({path: '/tempcenter', query: {typeId: '', title: '', subtitle: ''}})
                this.$bus.$emit('getFilter', {valueId: [],typeId: '',num: '',title:'',subtitle: ''})
            }
        },

        // 获取全部分类
        getClassList() {
            this.$axios.get('/AllTemplateClassification').then(res => {
                // console.log(res.data)
                this.classList = res.data
                //this.secondList = res.data[0].ProductTypeList
                if(this.$route.query.num){
                    var j=0
                    for(var i=0;i<res.data.length;i++){
                        if(this.$route.query.num == res.data[i].ClassNum){
                            j = i
                        }
                    }
                    this.secondList = res.data[j].ProductTypeList
                }
            })
        },
        handleChange(i) {
            this.activeIndex = i
            this.isActive = false
            this.Index = null
            this.productNum = this.classList[i].ClassNum
            this.title = this.classList[i].ClassName
            this.secondList = this.classList[i].ProductTypeList
            this.$emit('getParam', {title: this.title, num: this.productNum})
            this.$router.push({path: '/tempcenter', query: {title: this.title, num: this.productNum}})
        },
        handleGet(index){
            this.Index = index
            this.isActive = false
            let title = this.title
            this.typeId = this.secondList[index].TypeId
            this.subtitle = this.secondList[index].TypeName
            this.$emit('getParam', {typeId: this.typeId, title, subtitle: this.subtitle, num: this.productNum}) 
            this.$router.push({path: '/tempcenter', query: {typeId: this.typeId, title, subtitle: this.subtitle, num: this.productNum}})
        },
    },
    mounted() {
        this.getClassList()
    },
    computed: {
        name() {
            if(this.$route.query.subtitle){
                this.isActive = false
                this.subtitle = this.$route.query.subtitle
                return this.$route.query.subtitle
            }else{
                return 
            }
        },
        firstname() {
            if(this.$route.query.title){
                this.isActive = false
                this.title = this.$route.query.title
                return decodeURIComponent(this.$route.query.title)
            }else{
                return 
            }
        }
    },
    watch: {
        typeId() {
            this.$bus.$emit('useEventBus', this.typeId)
        }
    }
}
</script>

<style lang="scss" scoped>

.class-list{
    margin: 0 auto;
    //width:1204px;
    height:auto;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius:10px;
    padding: 26px 20px;
    .tabs-title{
        font-size: 14px;
        font-family:MicrosoftYaHei;
        font-weight:bold;
        color:rgba(51,51,51,1);
        margin-right: 20px;
    }
    .first-tabs{
        display: flex;
        font-size:14px;
        height: 37px;
        line-height: 37px;
        .first-tabs-list{
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(102,102,102,1);
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
        }
    }
    .second-tabs{
        display: flex;
        font-size: 14px;
        margin-top: 32px;
        .tabs-title{
            width: 56px;
            display: inline-block;
        }
        .second-tabs-list{
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(102,102,102,1);
            cursor: pointer;
            display: flex;
            flex-wrap: wrap;
            width: 1100px;
            span{
                display: inline-block;
                padding: 5px;
                margin-bottom: 15px;
                margin-right: 15px;
                &:hover{
                    background: $color;
                    border-radius: 5px;
                    color: rgba(255,255,255,1);
                }
            }
            .active{
                background: $color;
                border-radius: 5px;
                color: rgba(255,255,255,1);
            }
        }
    }
}

</style>
