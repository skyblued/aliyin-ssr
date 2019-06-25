<template>
    <div id="template-list">
        <div class="template-list">
            <div class="template-list-banner" v-if="banner">
                <img :src="$store.state.port.imgBaseUrl + banner[0].FileUrl" alt="">
            </div>
            <div class="template--item" v-for="(item,i) in templateList" :key="i">
                <div class="template-title">
                    <i :class="ss[i]"></i>
                    <div class="hr-title">{{item.ClassName}}</div>
                </div>
                <div class="pic-list">
                    <nuxt-link :to="`/templateList/templateCenter?id=${tmp.TypeId}&n=${tmp.FromClass}&title=${item.ClassName}&subtitle=${tmp.TypeName}`" v-for="(tmp,index) in item.ProductTypeList" :key="index">
                        <div class="pic-item">
                            <div class="pic-img-wrap">
                                <div class="pic-image" :style="{'background-image': `url(${$store.state.port.imgBaseUrl + tmp.ImageUrl})`}"></div>
                            </div>
                            <p class="pic-title">{{tmp.TypeName}}</p>
                        </div>
                    </nuxt-link>
                    <div class="pic-item" style="height: 0px;visibility: hidden;"></div>
                    <div class="pic-item" style="height: 0px;visibility: hidden;"></div>
                    <div class="pic-item" style="height: 0px;visibility: hidden;"></div>
                    <div class="pic-item" style="height: 0px;visibility: hidden;"></div>
                    <div class="pic-item" style="height: 0px;visibility: hidden;"></div>
                    <div class="pic-item" style="height: 0px;visibility: hidden;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['banner', 'templateList'],
    data () {
        return {
            ss: [
                's1',
                's2',
                's3',
                's4'
            ],
        }
    },
    mounted() {
        window.scrollTo(0,0)
    }
}
</script>

<style lang="scss" scoped>
#template-list{
    width: 100%;
    background: #f4f4f4;
}
.template-list{
    width: 1200px;
    margin: 0 auto;
    padding-top:25px;
    .template-list-banner{
        margin-bottom: 40px;
    }
}
.template-title{
    text-align: left;
    display: flex;
    line-height: 16px;
    i{
        display: inline-block;
        width:5px;
        height:16px;
        margin-right: 10px;
        vertical-align: middle;
    }
    .s1{
        background:rgba(74,162,255,1);
    }
    .s2{
        background:rgba(254,121,143,1);
    }
    .s3{
        background:rgba(158,135,242,1);
    }
    .s4{
        background:rgba(255,157,55,1);
    }
    .hr-title{
        font-size:17px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
}

.pic-list{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-top: 30px;
    .pic-item{
        width: 172px;
        height: 220px;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 40px;
        background: rgba(255,255,255,1);
        cursor: pointer;
        &:hover .pic-image{
            transform: translateY(-8px);
            box-shadow: 0 20px 30px 0 rgba(26,56,97,.13);
        }
        .pic-img-wrap{
            width: 100%;
            height: 172px;
            display: flex;
            align-items: center;
            justify-content: center;
            .pic-image{
                display: inline-block;
                width: 80%;
                height: 100%;
                background-size: contain;
                background-position: 50%;
                background-repeat: no-repeat;
                transition: all .2s;
            }
        }
        .pic-title{
            font-size:14px;
            color:rgba(102,102,102,1);
        }
    }
}
</style>
