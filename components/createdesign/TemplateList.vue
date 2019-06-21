<template>
    <div id="template-list">
        <div class="template-list">
            <div class="template--item" v-for="(item,i) in List" :key="i">
                <div class="template-title">
                    <i></i>
                    <div class="hr-title">{{item.ClassName}}</div>
                </div>
                <div class="pic-list">
                    <div class="pic-item" v-for="(tmp,index) in item.ProductTypeList" :key="index" @click="handleChoseTemp(i,tmp)">
                        <div class="pic-img">
                            <img :src="$store.state.port.imgBaseUrl+tmp.ImageUrl" alt="">
                        </div>
                        <p class="pic-title">{{tmp.TypeName}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            List: []
        }
    },
    methods: {
        getData() {
            this.$axios.get(this.$store.state.port.AllTemplate).then((res) => {
                console.log(res.data)
                this.List = res.data
            })
        },
        handleChoseTemp(i,tmp) {
            console.log(tmp)
            let title = this.List[i].ClassName
            let subtitle = tmp.TypeName
            let typeId = tmp.TypeId
            let n = tmp.FromClass
            // this.$emit('setTemplate', {msg: 'templateCenter', title: title, subtitle: subtitle,typeId: typeId})
            this.$router.push({path: '/templatecenter', query: {id: typeId, n:n, title: title, subtitle: subtitle}})
        }
    },
    mounted() {
        this.getData()
    }
}
</script>

<style lang="scss" scoped>
#template-list{
    width: 100%;
    padding: 20px 68px 0;

}
.template-list{
    //width: 1200px;
    margin: 0 auto;
}
.template-title{
    text-align: left;
    display: flex;
    line-height: 14px;
    i{
        width:5px;
        height:16px;
        background:rgba(255,157,55,1);
        margin-right: 10px;
    }
    .hr-title{
        font-size:17px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
}

.pic-list{
    margin-top: 31px;
    margin-left: 19px;
}
.pic-item{
    margin-right: 33px;
    margin-bottom: 36px;
    width: 120px;
    height: 187px;
    vertical-align: bottom;
    cursor: pointer;
    display: inline-block;
    transition: all .5s;
    font-family:MicrosoftYaHei;
    font-weight:400;
    text-align: center;
    .pic-title{
        font-size:14px;
        color:rgba(102,102,102,1);
        margin-top: 16px;
        margin-bottom: 11px;
    }
    .size{
        font-size:12px;
        color:rgba(153,153,153,1);
    }
}
.pic-item:hover .pic-title{
    font-weight: bold;
}
.pic-img{
    vertical-align: bottom;
    display: table-cell;
    height: 125px;
    width: 120px;
    text-align: center;
}
.pic-img img{
    max-height: 120px;
    max-width: 120px;
}
</style>
