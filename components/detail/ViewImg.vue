<template>
    <div class="viewimg">
        <div class="viewimg-title" v-if="templateDetail.length">
            <p class="title">{{templateDetail.Name}}</p>
            <p class="viewimg-collect">
                <span>收藏 : </span>
                <img :src="templateDetail.IsFavorite == true ? collectImage : image" alt="" @click="handleCollect">
            </p>
        </div>
        <div class="viewimg-item">
            <img class="viewimg-item-clip" :src="$store.state.port.staticPath + '/img/home/clip_icon.png'" alt="">
            <img class="viewimg-img" :src="$store.state.port.imgBaseUrl+templateDetail.FacePicture" alt="">
        </div>
        <p class="viewimg-tips">
            [声明]该素材为阿里印原创或已获得相关权利人授权，作品（含预览图）受著作权法保护，著作权及相关权利归本网站所有。获得授权方可使用，否则将依法要求承担高达人民币50万元的赔偿责任。
        </p>
    </div>
</template>

<script>
export default {
    data () {
        return {
            image: '/img/home/collect_s_icon.png',
            collectImage: '/img/home/collect_s_icon_hl.png',
        }
    },
    props: ['templateDetail'],
    methods: {
        // 获取模板收藏状态
        // getCollectStatus() {
        //     let templateNumber = this.tempNum
        //     let teamNum = sessionStorage.getItem('teamNum')
        //     var url = '/FavoritedTemplate?TemplateNumber=' + templateNumber + '&TeamNum=' + teamNum;
        //     this.$axios.get(url).then(res => {
        //         console.log(res.data)
        //         if(res.data == true){
        //             this.status = true
        //             this.image = '/img/home/collect_s_icon_hl.png'
        //         }else{
        //             this.status = false
        //         }
        //     })
        // },
        // 点击收藏/取消收藏
        handleCollect() {
            if(this.templateDetail.IsFavorite == false){
                var formData = new FormData()
                formData.append('TemplateNumber', this.templateDetail.TemplateNumber);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/FavoritedTemplate', formData, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '收藏成功'})
                        this.templateDetail.IsFavorite = true
                    }else{
                        this.$message({type: 'error', message: '收藏失败'})
                        return
                    }
                })
            }else{
                var formData = new FormData()
                formData.append('TemplateNumber', this.templateDetail.TemplateNumber);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/FavoritedTemplate', {data: formData}, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '取消收藏成功'})
                        this.templateDetail.IsFavorite = false
                    }else{
                        this.$message({type: 'error', message: '取消收藏失败'})
                        return
                    }
                })
            }
        }
    },
    watch: {
        templateDetail() {
            console.log(this.templateDetail)
        }
    },
    mounted() {
        //this.getCollectStatus()
    }
}
</script>

<style lang="scss" scoped>
.viewimg{
    width: 761px;
    padding-top: 29px;
}
.viewimg .viewimg-title{
    display: flex;
    justify-content: space-between;
}
.viewimg .viewimg-title .title{
    height:23px;
    line-height: 23px;
    font-size:23px;
    font-family:MicrosoftYaHei-Bold;
    font-weight:bold;
    color:rgba(51,51,51,1);
    display: inline-block;
}

// 收藏
.viewimg .viewimg-title .viewimg-collect{
    height: 20px;
    line-height: 15px;
}
.viewimg .viewimg-title .viewimg-collect span{
    display: inline-block;
    height:15px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(102,102,102,1);
    margin-right: 15px;
}
.viewimg .viewimg-title .viewimg-collect img{
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
}

.viewimg .viewimg-item{
    width: 100%;
    height: auto;
    background:rgba(204,209,213,1);
    margin-top: 29px;
    padding: 0 72px;
}
.viewimg .viewimg-item .viewimg-item-clip{
    height: 94px;
    display: block;
    z-index: 10;
    margin: 0 auto;
}
.viewimg .viewimg-item .viewimg-img{
    width: 100%;
    height: 100%;
    display: block;
    margin: 0 auto;
    position: relative;
    top: -13px;
}

.viewimg .viewimg-tips{
    display: inline-block;
    width:742px;
    // height:39px;
    // line-height: 39px;
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:26px;
    margin-top: 59px;
    margin-bottom: 45px;
}
</style>
