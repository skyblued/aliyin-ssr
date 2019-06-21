<template>
    <div class="list">
        <div class="content-list" v-if="this.data.length">
            <div class="content-item" v-for="(item,i) in this.data.slice(0, 8)" :key="i">
                <div class="content-block">
                    <div class="block-img-wrap">
                        <img :src="$store.state.port.imgBaseUrl+item.FacePicture" alt="">
                        <div class="block-img-mask">
                            <div class="tooltip" :data-tip="item.IsFavorite == true ? '取消' : '收藏'">
                                <img class="likeTemplate" :src="item.IsFavorite == true ? collectImage : image" alt="">
                            </div>
                            <el-button class="design-btn" @click="handleJump(i)"><span>立即制作</span></el-button>
                        </div>
                    </div>
                    <div class="content-bottom">
                        <p class="content-title">
                            <span @click="handleChange(i)">{{item.Name}}</span>
                        </p>
                        <p class="content-tips">
                            <span>{{item.ProductTypeName}}</span>
                            <span>
                                <img :src="$store.state.port.staticPath + '/img/home/user.png'" alt=""> 
                                {{item.Counts}}人使用
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="content-item" style="height: 0px;visibility: hidden;"></div>
            <div class="content-item" style="height: 0px;visibility: hidden;"></div>
            <div class="content-item" style="height: 0px;visibility: hidden;"></div>
            <div class="content-item" style="height: 0px;visibility: hidden;"></div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            data: [],
            image: '/img/home/collect-icon.png',
            collectImage: '/img/home/collect_s_icon_hl.png',
        }
    },
    props: ["info"],
    methods: {
        handleChange(i) {
            this.$router.push({path: '/detail', query: {t: this.info[i].TemplateNumber}})
            history.go(0)
        },
        handleJump(i){
            this.$router.push({path: '/designer', query: {t: this.info[i].TemplateNumber}})
        }
    },
    watch: {
        info(val) {
            this.data = val
            console.log(this.data.slice(0, 8))
        }
    }
}
</script>

<style lang="scss" scoped>
.content-list{
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 31px;
    padding-bottom: 43px;
}
.content-item{
    //display: inline-block;
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
.content-item .content-block .block-img-wrap:hover .block-img-mask{
    display: block;
}
.content-item .content-block .block-img-wrap{
    width:280px;
    height:374px;
    border-radius:10px 10px 0px 0px;
}
.content-item .content-block .block-img-wrap img{
    width: 100%;
    height: 100%;
}
.content-item .content-block .block-img-wrap .block-img-mask{
    width: 100%;
    height: 374px;
    background:rgba(0,0,0,.2);
    display: none;
    border-radius:10px 10px 0px 0px;
    position: absolute;
    top: 0;
    left: 0;
}
.content-item .content-block .block-img-wrap .block-img-mask .tooltip{
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
.tooltip-rel{
    position: relative;
}
.content-item .content-block .block-img-wrap .block-img-mask .tooltip .likeTemplate{
    width: 20px;
    height: 18px;
    margin: 9px 7px 8px 8px;
}
.content-item .content-block .block-img-wrap .block-img-mask .design-btn{
    width:167px;
    height:42px;
    background:rgba(0,131,233,1);
    border-radius:5px;
    border: 1px solid rgba(0,131,233,1);
    position: absolute;
    top: 169px;
    left: 56px;
}
.content-item .content-block .block-img-wrap .block-img-mask .design-btn span{
    width:72px;
    height:18px;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(254,254,254,1);
}


.content-bottom{
    width: 100%;
    height: 77px;
    .content-title{
        padding: 16px 119px 13px 17px;
        span{
            width:144px;
            height:17px;
            line-height: 17px;
            font-size:16px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,51,51,1);
        }
    }
    .content-tips{
        display: flex;
        justify-content: space-between;
        span{
            height:15px;
            line-height: 15px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(153,153,153,1);
        }
    }
}
.content-bottom .content-tips span:first-child{
    margin-left: 17px;
}
.content-bottom .content-tips span:last-child{
    margin-right: 18px;
}
.content-bottom .content-tips span:last-child img{
    display: inline-block;
    width: 11px;
    height: 11px;
}
</style>
