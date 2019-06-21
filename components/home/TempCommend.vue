<template>
    <div class="commend">
        <div class="container">
            <div class="commend-title">
                Select a template
                <p>精选模板推荐</p>
            </div>
            <div class="commend-tips">
                <p>优质的精选专题, 助你高效办公</p>
            </div>
            <div class="commend-label">
                <el-button class="label-item" :class="{active: isActive}" @click="handleClick">全部</el-button>
                <el-button class="label-item" :class="{active: activeIndex == i}" v-for="(item,i) in label" :key="i" @click="handleChange(i)">{{item.ClassName}}</el-button>
                <el-button class="label-item more"><span>more+</span></el-button>
            </div>
            <div v-if="isShow">
                <shop-list :TemplateList="TemplateList"></shop-list>
            </div>
            <div class="choose-more" @click="handleJump">
                <span>查看海量商用模板</span>
            </div>
        </div>
    </div>
</template>

<script>
import ShopList from '../share/ShopList.vue'
export default {
    data() {
        return {
            label: [],
            TemplateList: [],
            isShow: false,
            activeIndex: null,
            isActive: true,
            title: '',
            Index: '',
            productnum: ''
        }
    },
    methods: {
        getData() {
            //var teamNum = sessionStorage['teamNum'] || ''
            var url = '/RecommendTemplaleClass'
            this.$axios.get(url).then(res => {
                //console.log(res.data)
                this.label = res.data
                // this.label.forEach((item,index) => {
                //     if(item.TemplateList.length>0){
                //         this.TemplateList.push(item.TemplateList[index])
                //     }
                // })
                this.TemplateList = res.data[1].TemplateList
                //console.log(this.TemplateList)
            })
        },
        handleChange (index) {
            this.Index = index
            this.TemplateList = this.label[index].TemplateList
            this.activeIndex = index
            this.title = this.label[index].ClassName
            this.productnum = this.label[index].ClassNum
            this.isActive = false
            this.isShow = true
        },
        handleClick() {
            if(this.isActive){
                this.isActive = false
            }else{
                this.isActive = true
                this.activeIndex = null
                this.TemplateList = this.label[1].TemplateList
            }
        },
        handleJump() {
            if(!this.title){
                this.$router.push('/tempcenter')
            }else{
                let title = encodeURIComponent(this.title)
                this.$router.push({path: '/tempcenter', query: {title, num: this.productnum}})
            }
        }
    },
    mounted() {
        this.getData();
        this.isShow = true
    },
    components: {
        ShopList,
    }
}
</script>

<style lang="scss" scoped>

.commend /deep/ .commend-label.el-button span{
    font-size: 16px;
    height: 17px;
    line-height: 16px;
}
.commend{
    //height:1301px;
    background:rgba(244,244,244,1);
    border-radius:10px;
    padding: 56px 0 47px;
}
.container{
    width: 1200px;
    margin: 0 auto;
}
.container .commend-title{
    width:396px;
    height:31px;
    line-height: 31px;
    font-size:38px;
    margin: 0 auto;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(225,229,234,1);
    text-transform: uppercase;
    position: relative;
    user-select: none;
}
.container .commend-title p{
    // width:180px;
    // height:30px;
    font-size:30px;
    color:rgba(76,77,85,1);
    position: absolute;
    top: 0;
    left: 108px;
}
.container .commend-tips{
    width:190px;
    height:14px;
    line-height: 14px;
    font-size:14px;
    margin: 10px auto 40px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    user-select: none;
}
.container .commend-label{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.container .commend-label .label-item{
    height: 37px;
    text-align: center;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    background:rgba(255,255,255,1);
    border:1px solid rgba(210,210,210,1);
    border-radius:5px;
}
.commend-label .label-item:hover{
    border-color: $color;
    color: $color;
    background: #fff;
    outline: 0
}
.commend-label .label-item.active{
    background: $color;
    color: rgba(255,255,255,1);
}
.commend-label .more span{
    line-height: 13px;
    text-decoration:underline;
    color: $color;
}
.container .choose-more{
    width:258px;
    line-height: 40px;
    border:1px solid rgba(220,220,220,1);
    border-radius:5px;
    margin: 0 auto;
    text-align: center;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    user-select: none;
    cursor: pointer;
    &:hover{
        background: $color;
        color: rgba(255,255,255,1);
    }
}
</style>
