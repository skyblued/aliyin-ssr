<template>
    <div class="self-design">
        <div class="self-title">
            <p>5G云端设计工具</p>
            <p>轻松在线自助设计</p>
        </div>
        <div class="self-content">
            <img src="/img/themes/shed_green.png" alt="">
            <div class="content-list" v-if="Tplcategory.length">
                <ul class="content-bars">
                    <li :class="{'bar-item':true, active: activeIndex == i}" v-for="(item,i) in Tplcategory" :key="i" @click="handleChoose(i)">{{item.Value.Name}}</li>
                </ul>
                <div class="self-template-list">
                    <div class="self-template-item" v-for="(tmp,index) in templateList" :key="index">
                        <a :href="`/design?t=${tmp.TemplateNumber}&n=${teamNum}`" target="_blank">
                            <div class="self-template-block" @click="handleToDesign(tmp)">
                                <div class="image-wrap" :style="{'background-image': `url(${$store.state.port.imgBaseUrl + tmp.FacePicture + '!w280.src'})`}"></div>
                            </div>
                        </a>
                        <div class="self-template-bottom">
                            <p :title="tmp.Name" @click="handleToDesign(tmp)">{{tmp.Name}}</p>
                            <p>
                                <span>
                                    <img src="/img/home/user.png" alt="">
                                    <span>{{tmp.Visits}}人使用</span>
                                </span>
                                <span class="design-btn" @click="handleToDesign(tmp)">在线设计</span>
                            </p>
                        </div>
                    </div>
                    <div class="self-template-item" style="height: 0px;visibility: hidden;"></div>
                    <div class="self-template-item" style="height: 0px;visibility: hidden;"></div>
                    <div class="self-template-item" style="height: 0px;visibility: hidden;"></div>
                    <div class="self-template-item" style="height: 0px;visibility: hidden;"></div>
                </div>
                <div class="content-more" @click="handleMore">更多模板</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            templateList: [],
            activeIndex: 0,
            teamNum: null,
        }
    },
    props: ['Tplcategory'],
    methods: {
        // 在线设计
        handleToDesign(item) {
            if (!localStorage['token']) return this.$store.commit('login/toggleShow', true)
            var formData = new FormData()
            formData.append('TemplateNumber', item.TemplateNumber);
            formData.append('TeamNum', localStorage['teamNum']);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            var url = window.open('/design', '_blank')
            this.$axios.post('/CopyTemplate', formData, config).then(res => {
                if(res.data == '') return console.log('没有返回')
                // console.log(res.data)
                let str = 'DocumentNumber=' + res.data
                str = window.btoa(str)
                url.location = '/design/' + str
            })
        },
        handleChoose(i) {
            this.activeIndex = i
            this.templateList = this.Tplcategory[i].Value.Temps
        },
        // 更多模板
        handleMore() {
            this.$router.push({path: 'templateList/templateCenter', query: {n: '6', id: '38',subtitle: '广告扇',title: '宣传物料'}})
        }
    },
    mounted() {
        this.teamNum = localStorage['teamNum']
        this.templateList = this.Tplcategory[0].Value.Temps
    },
}
</script>

<style lang="scss" scoped>
.self-design{
    width: 1266px;
    margin: 0 auto 100px;
    .self-title{
        width: 700px;
        height: 203px;
        margin: 0 auto;
        background-image: url(/img/themes/cloud.png);
        background-repeat: no-repeat;
        padding-top: 58px;
        text-align: center;
        p:first-child{
            font-size: 50px;
            font-family: SourceHanSansSC-Heavy;
            font-weight: 800;
            color:rgba(254,112,53,1);
        }
        p:last-child{
            font-size: 23px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color:rgba(51,51,51,1);
            margin-top: 15px;
        }
    }
    .self-content{
        margin-top: 46px;
        .content-list{
            width: 1136px;
            background:rgba(245,249,255,1);
            border-radius: 15px;
            margin: -165px auto 0;
            padding: 125px 28px 23px;
            .content-bars{
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 69px;
                border-radius: 10px 10px 0px 0px;
                background:rgba(255,199,93,1);
                .bar-item{
                    width: 182px;
                    line-height: 69px;
                    text-align: center;
                    font-size: 28px;
                    font-family: SourceHanSansSC-Heavy;
                    font-weight: 800;
                    color:rgba(255,255,255,1);
                    cursor: pointer;
                    &:hover{
                        height: 77px;
                        margin-top: -8px;
                        border-radius: 10px 10px 0px 0px;
                        background: linear-gradient(0deg,rgba(246,138,42,1),rgba(241,152,54,1),rgba(255,198,0,1));
                    }
                }
                .active{
                    height: 77px;
                    margin-top: -8px;
                    border-radius: 10px 10px 0px 0px;
                    background: linear-gradient(0deg,rgba(246,138,42,1),rgba(241,152,54,1),rgba(255,198,0,1));
                }
            }
            .self-template-list{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                padding-top: 10px;
                .self-template-item{
                    width: 260px;
                    height: 320px;
                    background:rgba(255,255,255,1);
                    border-radius:10px;
                    margin-bottom: 20px;
                    .self-template-block{
                        width: 100%;
                        height: 231px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(209,216,222,.9);
                        border-radius:10px 10px 0 0;
                        cursor: pointer;
                        .image-wrap{
                            display: inline-block;
                            width: 90%;
                            height: 85%;
                            background-size: contain;
                            background-position: 50%;
                            background-repeat: no-repeat;
                        }
                    }
                    .self-template-bottom{
                        padding: 15px;
                        p:first-child{
                            font-size:20px;
                            font-family:MicrosoftYaHei;
                            font-weight:400;
                            color:rgba(51,51,51,1);
                            margin-bottom: 4px;
                            width: 200px;
                            overflow: hidden;
                            text-overflow: ellipsis;
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
                            span{
                                font-size:15px;
                                color:rgba(153,153,153,1);
                                img{
                                    margin-right: 4px;
                                }
                            }
                            .design-btn{
                                display: inline-block;
                                width:107px;
                                height:31px;
                                line-height: 31px;
                                text-align: center;
                                background:rgba(31,127,221,1);
                                border-radius:16px;
                                color: rgba(255,255,255,1);
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .content-more{
                width: 179px;
                height: 42px;
                line-height: 42px;
                margin: 0 auto;
                text-align: center;
                // background: $gradient;
                background:rgba(31,127,221,1);
                border-radius: 21px;
                color: rgba(255,255,255,1);
                font-size: 18px;
                cursor: pointer;
            }
        }
    }
}
</style>
