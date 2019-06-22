<template>
    <div class="commend">
        <div class="container" v-for="(item,i) in label" :key="i">
            <div class="container-menu-wrap">
                <div class="container-title">{{item.ClassName}}</div>
                <div>
                    <ul>
                        <li :class="{'container-menu-list':true, active: !tmp.Enable}" v-for="(tmp, id) in item.ProductTypeList" :key="id" @click.stop="handleChooseMenu(tmp,id,i)">{{tmp.TypeName}}</li>
                        <li class="container-menu-list"  @click="handleToTemp">更多</li>
                    </ul>
                </div>
            </div>
            <div class="container-list">
                <div class="container-item" v-for="(items,index) in secondList[i].slice(0,10)" :key="index">
                    <div class="container-block" @click="handleToDesign(items)">
                        <div class="block-img-wrap">
                            <img :src="items.FacePicture && $store.state.port.imgBaseUrl + items.FacePicture + '!w280.src'" alt="">
                            <div class="tooltip" :data-tip="items.IsFavorite == true ? '取消' : '收藏'" @click.stop="handleCollect(items)">
                                <img class="likeTemplate" :src="items.IsFavorite == true ? $store.state.port.staticPath + collectImage : $store.state.port.staticPath + image" alt="">
                            </div>
                        </div>
                        <div class="container-bottom">
                            <p class="bottom-title" :title="items.Name">{{items.Name}}</p>
                            <p class="bottom-tips">
                                <span >{{typeName[i]}}</span>
                                <span>
                                    <img :src="$store.state.port.staticPath + '/img/home/user.png'" alt=""> 
                                    {{items.Counts}}人使用
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="container-item" style="height: 0px;visibility: hidden;"></div>
                <div class="container-item" style="height: 0px;visibility: hidden;"></div>
                <div class="container-item" style="height: 0px;visibility: hidden;"></div>
                <div class="container-item" style="height: 0px;visibility: hidden;"></div>
                <div class="container-item" style="height: 0px;visibility: hidden;"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            label: [],
            image: '/img/home/collect-icon.png',
            collectImage: '/img/home/collect_s_icon_hl.png',
            secondList: [],
            typeName: []
        }
    },
    methods: {
        getData() {
            var url = '/RecommendTemplaleClass?TeamNum=' + localStorage['teamNum']
            this.$axios.get(url).then(res => {
                console.log(res.data)
                this.label = res.data
                for(var i=0;i<res.data.length;i++) {
                    this.secondList.push(res.data[i].ProductTypeList[0].Templatelist)
                    res.data[i].ProductTypeList[0].Enable = false
                    this.typeName.push(res.data[i].ProductTypeList[0].TypeName)
                }
            })
        },
        handleChooseMenu(tmp,id,i) {
            this.label[i].ProductTypeList.Enable = false
            for(var j=0;j<this.label[i].ProductTypeList.length;j++) {
                this.label[i].ProductTypeList[j].Enable = true
                if(j == id) {
                    this.label[i].ProductTypeList[j].Enable = false
                }
            }
            this.secondList.splice(i, 1, this.label[i].ProductTypeList[id].Templatelist)
            this.typeName.splice(i,1,tmp.TypeName)
        },
        handleToTemp() {
            this.$router.push('/templatelist')
        },

        // 进入设计器
        handleToDesign(item) {
            // console.log(item)
            if (!localStorage['token']) return this.$store.commit('setDialogType', 'login')
            var formData = new FormData()
            formData.append('TemplateNumber', item.TemplateNumber);
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
        },

        // 收藏模板
        handleCollect(item) {
            // console.log(item)
            if(item.IsFavorite == false){
                var formData = new FormData()
                formData.append('TemplateNumber', item.TemplateNumber);
                formData.append('TeamNum', localStorage['teamNum'])
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/FavoritedTemplate', formData, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '收藏成功'})
                        item.IsFavorite = true
                    }else{
                        this.$message({type: 'error', message: '收藏失败'})
                        return
                    }
                })
            }else{
                var formData = new FormData()
                formData.append('TemplateNumber', item.TemplateNumber);
                formData.append('TeamNum', localStorage['teamNum'])
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/FavoritedTemplate', {data: formData}, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '取消收藏成功'})
                        item.IsFavorite = false
                    }else{
                        this.$message({type: 'error', message: '取消收藏失败'})
                        return
                    }
                })
            }
        }
    },
    mounted() {
        this.getData();
    },
}
</script>

<style lang="scss" scoped>
.commend{
    background:rgba(244,244,244,1);
    border-radius:10px;
    padding: 56px 0 47px;
    margin-top: 60px;
}
.container{
    width: 1200px;
    margin: 0 auto;
    .container-menu-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 40px;
        margin-top: 20px;
        .container-title{
            display: inline-block;
            line-height: 40px;
            height: 40px;
            font-size: 30px;
            font-family: MicrosoftYaHei-Bold;
            font-weight: bold;
            color:rgba(76,77,85,1);
        }
        ul{
            width: 100%;
            height: auto;
            display: flex;
            align-items: center;
            .container-menu-list{
                min-width: 86px;
                height: 28px;
                line-height: 28px;
                display: inline-block;
                margin-top: 1px;
                margin-right: 15px;
                padding: 0 15px;
                color:rgba(51,51,51,1);
                background-color: #fff;
                border-radius: 14px;
                cursor: pointer;
                text-align: center;
                transition: all .3s;
                &:hover{
                    background: #745bff;
                    color: rgba(255,255,255,1);
                }
            }
            li:last-child{
                margin-right: 0;
            }
            .active{
                background: #745bff;
                color: rgba(255,255,255,1);
            }
        }
    }
    .container-list{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 40px;
        .container-item{
            width:220px;
            height:100%;
            border:1px solid rgba(238,238,238,1);
            cursor: pointer;
            margin-bottom: 27px;
            border-radius: 10px;
            transition: all .3s;
            &:hover{
                transform: translateY(-5px);
            }
            .container-block{
                width: 220px;
                .block-img-wrap{
                    width: 100%;
                    height: 100%;
                    position: relative;
                    background: rgba(255,255,255,1);
                    border-radius: 10px 10px 0 0;
                    img{
                        width: 100%;
                        height: auto;
                        border-radius: 10px 10px 0 0;
                    }
                    .tooltip{
                        display: none;
                        width:35px;
                        height:35px;
                        background:rgba(255,255,255,1);
                        border-radius:5px;
                        position: absolute;
                        right: 15px;
                        top: 15px;
                        cursor: pointer;
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
                        .likeTemplate{
                            width: 20px;
                            height: 18px;
                            margin: 9px 7px 8px 8px;
                        }
                    }
                }
            }
            .container-bottom{
                padding: 18px 17px;
                background: rgba(255,255,255,1);
                border-radius: 0 0 10px 10px;
                .bottom-title{
                    display: inline-block;
                    color:rgba(51,51,51,1);
                    width: 100%;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .bottom-tips{
                    display: flex;
                    justify-content: space-between;
                    color:rgba(153,153,153,1);
                    font-size: 14px;
                    margin-top: 5px;
                }
            }
        }
        .container-item:hover .container-block .tooltip{
            display: block;
        }
    }
}
</style>
