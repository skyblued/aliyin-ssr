<template>
    <div class="service-show">
        <div class="service-title">服务客户样例展示</div>
        <div class="service-content">
            <img src="/img/themes/shed_bule.png" alt="">
            <div class="service-content-list" v-if="list.length">
                <div class="service-content-item" v-for="(item,i) in list" :key="i">
                    <a :href="`/designer?t=${item.number}`" target="_blank">
                        <div class="service-content-block">
                            <div class="image-wrap" :style="{'background-image': `url(${item.imgUrl})`}"></div>
                        </div>
                    </a>
                    <div class="service-content-bottom">
                        <p>{{item.name}}</p>
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
            list: [{
                id: 0,
                imgUrl: '/img/themes/service15180.png',
                name: '农商银行',
                number: '15180'
            },{
                id: 1,
                imgUrl: '/img/themes/service15186.png',
                name: '嘉海庄园',
                number: '15186'
            },{
                id: 2,
                imgUrl: '/img/themes/service15128.png',
                name: '中国人寿',
                number: '15128'
            },{
                id: 3,
                imgUrl: '/img/themes/service15764.png',
                name: '协和医院',
                number: '15764'
            },{
                id: 4,
                imgUrl: '/img/themes/service15603.png',
                name: '渤海教育',
                number: '15603'
            },{
                id: 5,
                imgUrl: '/img/themes/service15597.png',
                name: '碧桂园',
                number: '15597'
            },{
                id: 6,
                imgUrl: '/img/themes/service15598.png',
                name: '证大财富',
                number: '15598'
            },{
                id: 7,
                imgUrl: '/img/themes/service15588.png',
                name: '中国平安',
                number: '15588'
            },{
                id: 8,
                imgUrl: '/img/themes/service15166.png',
                name: '蟹博汇',
                number: '15166'
            },{
                id: 9,
                imgUrl: '/img/themes/service15346.png',
                name: '美国科视',
                number: '15346'
            },{
                id: 10,
                imgUrl: '/img/themes/service15826.png',
                name: '伊贝诗',
                number: '15826'
            },{
                id: 11,
                imgUrl: '/img/themes/service15783.png',
                name: '五粮液',
                number: '15783'
            }],
        }
    },
    // props: ['casesList'],
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
.service-show{
    width: 1266px;
    margin: 0 auto 100px;
    .service-title{
        width: 667px;
        height: 120px;
        line-height: 100px;
        margin: 0 auto 39px;
        text-align: center;
        background-image: url(/img/themes/box.png);
        background-repeat: no-repeat;
        font-size: 62px;
        font-family: SourceHanSansSC-Heavy;
        font-weight: 800;
        color:rgba(255,255,255,1);
    }
    .service-content{
        .service-content-list{
            width: 1136px;
            // height: 1165px;
            background:rgba(245,249,255,1);
            border-radius: 15px;
            margin: -170px auto 0;
            padding: 130px 28px 16px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .service-content-item{
                width: 260px;
                height: 290px;
                background:rgba(233,233,233,1);
                border-radius: 10px;
                margin-bottom: 50px;
                cursor: pointer;
                .service-content-block{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 231px;
                    background:rgba(255,255,255,1);
                    border-radius: 10px 10px 0px 0px;
                    .image-wrap{
                        display: inline-block;
                        width: 90%;
                        height: 90%;
                        background-size: contain;
                        background-position: 50%;
                        background-repeat: no-repeat;
                    }
                }
                .service-content-bottom{
                    height: 59px;
                    background:rgba(233,233,233,1);
                    border-radius: 0px 0px 10px 10px;
                    text-align: center;
                    padding: 20px 0 19px;
                    font-size: 20px;
                    font-family: AliHYAiHei;
                    font-weight: 400;
                    color:rgba(51,51,51,1);
                    p:hover{
                        color: $color;
                    }
                }
            }
        }
    }
}
</style>
