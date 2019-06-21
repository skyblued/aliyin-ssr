<template>
    <div class="showlist">
        <div class="shoplist-list" v-if="TemplateList.length">
            <div class="shoplist-item" v-for="(item,i) in TemplateList" :key="i">
                <div class="shoplist-block">
                    <div class="block-img-wrap">
                        <img :src="$store.state.port.imgBaseUrl+item.FacePicture" alt="">
                        <div class="block-img-mask">
                            <div class="tooltip" data-tip="收藏">
                                <img class="likeTemplate" :src="$store.state.port.staticPath + '/img/home/collect-icon.png'" alt="">
                            </div>
                            <el-button class="design-btn" @click="handleJump(i)">立即制作</el-button>
                        </div>
                    </div>
                    <div class="shoplist-bottom">
                        <p class="shop-title">
                            <span>{{item.Name}}</span>
                        </p>
                        <p class="shop-tips">
                            <span>{{item.ProductTypeName}}</span>
                            <span>
                                <img src="/img/home/user.png" alt=""> 
                                {{item.Counts}}人使用
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="shoplist-item" style="height: 0px;visibility: hidden;"></div>
            <div class="shoplist-item" style="height: 0px;visibility: hidden;"></div>
            <div class="shoplist-item" style="height: 0px;visibility: hidden;"></div>
            <div class="shoplist-item" style="height: 0px;visibility: hidden;"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    props: ["TemplateList"],
    methods: {
        handleJump(i){
            this.$router.push({path: '/detail', query: {t: this.TemplateList[i].TemplateNumber}})
        }
    },
    mounted(){
        //console.log(this.TemplateList)
    },
    watch: {
        TemplateList() {
            //console.log(this.TemplateList)
        }
    }
}
</script>

<style lang="scss" scoped>

.shoplist-list{
    width: 1200px;
    padding-top: 49px;
    padding-bottom: 19px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.shoplist-item{
    display: inline-block;
    width: 280px;
    height: 451px;
    border-radius:10px;
    background:rgba(255,255,255,1);   
    overflow: hidden;
    margin-bottom: 27px;
    position: relative;
    height: 100%;
    cursor: pointer;
    transition: all .3s;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
    &:hover{
        box-shadow: 0 4px 15px rgba(0,0,0,.1);
        transform: translateY(-3px);
    }
}
.shoplist-item .shoplist-block:hover .block-img-wrap .block-img-mask{
    display: block;
}
.shoplist-item .shoplist-block .block-img-wrap{
    width:280px;
    height:374px;
    border-radius:10px 10px 0px 0px;
}
.shoplist-item .shoplist-block .block-img-wrap img{
    width: 100%;
    height: 100%;
}
.shoplist-item .shoplist-block .block-img-wrap .block-img-mask{
    width: 100%;
    height: 374px;
    background:rgba(0,0,0,.2);
    display: none;
    border-radius:10px 10px 0px 0px;
    position: absolute;
    top: 0;
    left: 0;
}
.shoplist-item .shoplist-block .block-img-wrap .block-img-mask .tooltip{
    width:35px;
    height:35px;
    background:rgba(255,255,255,1);
    border-radius:5px;
    position: absolute;
    right: 15px;
    top: 15px;
    &:hover::before{
        content: attr(data-tip);
        font-size: 12px;
        line-height: 12px;
        background-color: #fff;
        color: #626262;
        padding: 4px 6px;
        position: absolute;
        top: 49px;
        left: -.5px;
        white-space: pre;
        border-radius: 2px;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.24);
    }
    &:hover::after{
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 4px solid #fff;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        top: 45px;
        left: 15.5px;
    }
}
.shoplist-item .shoplist-block .block-img-wrap .block-img-mask .tooltip .likeTemplate{
    width: 20px;
    height: 18px;
    margin: 9px 7px 8px 8px;
}
.shoplist-item .shoplist-block .block-img-wrap .block-img-mask .design-btn{
    width:167px;
    height:42px;
    background: $color;
    border-radius:5px;
    border: 1px solid $color;
    position: absolute;
    top: 169px;
    left: 56px;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(254,254,254,1);
}
.shoplist-bottom{
    padding: 12px 17px;
}
.shoplist-bottom .shop-title{
    margin-bottom: 13px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
}

.shoplist-bottom .shop-tips{
    display: flex;
    justify-content: space-between;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.shoplist-bottom .shop-tips span:first-child{
    margin-left: 17px;
}
.shoplist-bottom .shop-tips span:last-child{
    margin-right: 18px;
}
</style>
