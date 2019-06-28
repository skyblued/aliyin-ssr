<template>
    <div class="hot-show">
        <div class="show-title">热销扇形款式展示</div>
        <div class="show-content">
            <img src="/img/themes/shed_bule.png" alt="">
            <div class="content-list">
                <div class="content-item">
                    <img class="first" src="/img/themes/advertise_icon.png" alt="">
                </div>
                <div class="content-item" v-for="(item,i) in showList" :key="i">
                    <a :href="`/designer?t=${item.number}`" target="_blank">
                        <div class="content-item-block">
                            <div class="block-image" :style="{'background-image': `url(${item.imgUrl})`}"></div>
                        </div>
                    </a>
                    <div class="content-item-bottom">
                        <a :href="`/designer?t=${item.number}`" target="_blank">
                            <p :title="item.name">{{item.name}}</p>
                        </a>
                        <p>
                            <span><span class="price">￥<span>0.37</span></span>元/把 起</span>
                            <span class="price-btn"><a href="#print">立即订购</a></span>
                        </p>
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
            showList: [{
                id: 0,
                imgUrl: '/img/themes/fan15266.png',
                name: '哆啦A梦 - 广告扇',
                number: '15266'
            },{
                id: 1,
                imgUrl: '/img/themes/fan15323.png',
                name: '阿狸 - 广告扇',
                number: '15323'
            },{
                id: 2,
                imgUrl: '/img/themes/fan15717.png',
                name: '蜗牛 - 广告扇',
                number: '15717'
            },{
                id: 3,
                imgUrl: '/img/themes/fan15730.png',
                name: '海绵宝宝 - 广告扇',
                number: '15730'
            },{
                id: 4,
                imgUrl: '/img/themes/fan15744.png',
                name: '快乐虎 - 广告扇',
                number: '15744'
            },{
                id: 5,
                imgUrl: '/img/themes/fan15748.png',
                name: '米老鼠 - 广告扇',
                number: '15748'
            },{
                id: 6,
                imgUrl: '/img/themes/fan15818.png',
                name: '小猪佩奇 - 广告扇',
                number: '15818'
            },{
                id: 7,
                imgUrl: '/img/themes/fan15819.png',
                name: '金科状元 - 广告扇',
                number: '15819'
            }],
        }
    },
    methods: {
        handleClick(item) {
            // this.$emit('setJump')
            if (!localStorage['token']) return this.$store.commit('login/toggleShow', true)
            var formData = new FormData()
            formData.append('TemplateNumber', item.number);
            formData.append('TeamNum', localStorage['teamNum']);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            var url = window.open('/designer', '_blank')
            this.$axios.post('/CopyTemplate', formData, config).then(res => {
                if(res.data == '') return console.log('没有返回')
                // console.log(res.data)
                let str = 'DocumentNumber=' + res.data
                str = window.btoa(str)
                url.location = '/designer/' + str
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.hot-show{
    width: 1266px;
    margin: 0 auto 100px;
    .show-title{
        width: 667px;
        height: 120px;
        line-height: 100px;
        margin: 0 auto 39px;
        text-align: center;
        background-image: url(/img/themes/box.png);
        background-repeat: no-repeat;
        font-size:62px;
        font-family:SourceHanSansSC-Heavy;
        font-weight:800;
        color:rgba(255,255,255,1);
    }
    .show-content{
        img{
            display: inline-block;
            width: 1266px;
            height: 320px;
        }
        .content-list{
            width:1136px;
            height:1514px;
            background:rgba(245,249,255,1);
            border-radius:15px;
            margin: -170px auto 0;
            padding: 136px 28px 0;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .content-item{
                width:346px;
                height:428px;
                background:rgba(255,255,255,1);
                border-radius:10px;
                .first{
                    width: 100%;
                    height: 100%;
                }
                .content-item-block{
                    width: 100%;
                    height: 309px;
                    position: relative;
                    cursor: pointer;
                    .block-image{
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        background-size: contain;
                        background-position: 50%;
                        background-repeat: no-repeat;
                    }
                }
                .content-item-bottom{
                    display: flex;
                    flex-direction: column;
                    height: 119px;
                    padding: 20px;
                    p:first-child{  
                        width: 260px;
                        font-size:28px;
                        color:rgba(51,51,51,1);
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        cursor: pointer;
                        &:hover{
                            color: $color;
                        }
                    }
                    p:last-child{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 20px;
                        font-family:SourceHanSansSC-Regular;
                        font-weight:400;
                        color:rgba(31,127,221,1);
                        .price{
                            color:rgba(255,139,25,1);
                            font-size:24px;
                            span{
                                font-size: 40px;
                                font-weight: 800;
                            }
                        }
                        .price-btn{
                            display: inline-block;
                            width: 107px;
                            height: 31px;
                            line-height: 31px;
                            text-align: center;
                            font-size: 16px;
                            color: rgba(255,255,255,1);
                            border-radius: 14px;
                            background: rgba(31,127,221,1);
                            cursor: pointer;
                            a{
                                color: rgba(255,255,255,1);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
