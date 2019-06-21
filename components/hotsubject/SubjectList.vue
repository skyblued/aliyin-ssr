<template>
    <div class="subject-list">
        <div class="subject-list-item" v-for="(item,i) in subjectList" :key="i">
            <div class="subject-list-block">
                <div class="block-img-wrap">
                    <img class="block-image" :src="$store.state.port.imgBaseUrl+item.FacePicture" alt="">
                    <div class="block-img-mask">
                        <div class="tooltip" data-tip="收藏">
                            <img class="likeTemplate" :src="status == false ? image : src" alt="">
                        </div>
                        <el-button class="design-btn" @click="handleJump(item)"><span>立即制作</span></el-button>
                    </div>
                </div>
                <div class="subject-list-bottom">
                    <p class="shop-title">
                        <span>{{item.Name}}</span>
                    </p>
                    <p class="shop-tips">
                        <span>{{item.subtitle}}</span>
                        <span>
                            <img :src="$store.state.port.staticPath + '/img/home/user.png'" alt=""> 
                            {{item.Counts}}人使用
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            content: '收藏',
            status: false,   // 收藏状态
            image: '/img/home/collect-icon.png',
            src: '/img/home/collect_s_icon_hl.png'
        }
    },
    props: ['subjectList','name'],
    methods: {
        handleJump(item) {  // 跳转到模板详情页
            let t = item.TemplateNumber
            this.$router.push({path: '/detail', query: {t,title: this.name}})
        },
        handleCollect(item,event) {  // 收藏模板
            event.preventDefault()
            if(this.status == false){
                let tempNum = item.TemplateNumber
                var formData = new FormData()
                formData.append('TemplateNumber', tempNum);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/FavoritedTemplate', formData, config).then(res => {
                    console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '收藏成功'})
                        this.status = true
                        //this.image = '/img/home/collect_s_icon_hl.png'
                    }else{
                        this.$message({type: 'error', message: '收藏失败'})
                        return
                    }
                })
            }else{
                let tempNum = item.TemplateNumber
                var formData = new FormData()
                formData.append('TemplateNumber', tempNum);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/FavoritedTemplate', {data: formData}, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '取消收藏成功'})
                        this.status = false
                        //this.image = '/img/home/collect_s_icon.png'
                    }else{
                        this.$message({type: 'error', message: '取消收藏失败'})
                        //this.image = '/img/home/collect_s_icon_hl.png'
                        return
                    }
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>

.subject-list{
    width: 1200px;
    padding-top: 25px;
    overflow: hidden;
    column-count: 4; 
    column-gap: 27px;
}
.subject-list-item{
    display: inline-block;
    width: 280px;
    height: auto;
    padding-top: 3px;
}
.subject-list-item .subject-list-block{
    border-radius:10px;
    background:rgba(255,255,255,1);   
    overflow: hidden;
    margin-bottom: 27px;
    // position: relative;
    height: 100%;
    cursor: pointer;
    transition: all .3s;
    //box-shadow: 0 1px 4px 0 rgba(0,0,0,.08);
    &:hover{
        //box-shadow: 0 4px 15px rgba(0,0,0,.1);
        transform: translateY(-3px);
    }
}
.subject-list-item .subject-list-block:hover .block-img-wrap .block-img-mask{
    display: block;
}
.subject-list-item .subject-list-block .block-img-wrap{
    width:280px;
    height:100%;
    position: relative;
}
.subject-list-item .subject-list-block .block-img-wrap .block-image{
    display: block;
    width: 100%;
    height: auto;
}
.subject-list-item .subject-list-block .block-img-wrap .block-img-mask{
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,.2);
    display: none;
    position: absolute;
    top: 0;
    left: 0;
}
.subject-list-item .subject-list-block .block-img-wrap .block-img-mask .tooltip{
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
.subject-list-item .subject-list-block .block-img-wrap .block-img-mask .tooltip .likeTemplate{
    width: 20px;
    height: 18px;
    margin: 9px 7px 8px 8px;
}
.subject-list-item .subject-list-block .block-img-wrap .block-img-mask .design-btn{
    width: 167px;
    height: 42px;
    background: $color;
    border-radius: 5px;
    border: 1px solid $color;
    position: absolute;
    top: 45%;
    left: 56px;
}
.subject-list-item .subject-list-block .block-img-wrap .block-img-mask .design-btn span{
    width:72px;
    height:18px;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(254,254,254,1);
}
.subject-list-bottom{
    width: 100%;
    height: 77px;
}
.subject-list-bottom .shop-title{
    padding: 16px 119px 13px 17px;
}
.subject-list-bottom .shop-title span{
    width:144px;
    height:17px;
    line-height: 17px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.subject-list-bottom .shop-tips{
    display: flex;
    justify-content: space-between;
}
.subject-list-bottom .shop-tips span{
    height:15px;
    line-height: 15px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.subject-list-bottom .shop-tips span:first-child{
    margin-left: 17px;
}
.subject-list-bottom .shop-tips span:last-child{
    margin-right: 18px;
}
.subject-list-bottom .shop-tips span:last-child img{
    display: inline-block;
    width: 11px;
    height: 11px;
}
</style>
