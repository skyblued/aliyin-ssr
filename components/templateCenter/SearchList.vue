<template>
     <!-- element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" v-loading="loading2" -->
    <!-- obj.list1 -->
    <div class="templist" v-if="tempList.length">
        <!-- <div class="water">
            <div class="piping" ref="box">
                    <h5>这是第一列</h5>
                    <div v-for="(item,i) in list" :key="i" v-if="i%4 == 0">
                        <router-link to="/detail/1"><img :src="item.imgUrl" alt=""></router-link>
                    </div>
                </div>
                <div class="piping" ref="box1">
                    <h5>这是第2列</h5>
                    <div v-for="(item,i) in list" :key="i" v-if="i%4 == 1"><router-link to="/detail/1"><img :src="item.imgUrl" alt=""></router-link></div>
                </div>
                <div class="piping" ref="box2">
                    <h5>这是第3列</h5>
                    <div v-for="(item,i) in list" :key="i" v-if="i%4 == 2"><router-link to="/detail/1"><img :src="item.imgUrl" alt=""></router-link></div>
                </div>
                <div class="piping" ref="box3">
                    <h5>这是第4列</h5>
                    <div v-for="(item,i) in list" :key="i" v-if="i%4 == 3"><router-link to="/detail/1"><img :src="item.imgUrl" alt=""></router-link></div>
                </div> 
        </div> -->
        <!-- <ul ref="ul"  v-if="demoList[0].src">
            <li  v-for="(item,i) in demoList" :key="i" >
                <img :src="item.src" alt="">
                <p>{{item.title}}</p>
            </li>
        </ul> -->
        <div class="templist-item" v-for="(item,i) in tempList" :key="i">
            <div class="templist-block">
                <div class="block-img-wrap">
                    <img :src="$store.state.port.imgBaseUrl+item.FacePicture" alt="">
                    <div class="block-img-mask">
                        <div class="tooltip" :data-tip="item.IsFavorite == true ? '取消' : '收藏'" @click="handleCollect(i)">
                            <img class="likeTemplate" :src="item.IsFavorite == true ? collectImage : image" alt="">
                        </div>
                        <el-button class="design-btn"  @click="handleToDetail(item)"><span>立即制作</span></el-button>
                    </div>
                </div>
                <div class="templist-bottom">
                    <p class="shop-title">
                        <span>{{item.Name}}</span>
                    </p>
                    <p class="shop-tips">
                        <span>{{item.ProductTypeName}}</span>
                        <span>
                            <img :src="$store.state.port.staticPath + '/img/home/user.png'" alt=""> 
                            {{item.Visits}}人使用
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="templist-item" style="height: 0px;visibility: hidden;"></div>
        <div class="templist-item" style="height: 0px;visibility: hidden;"></div>
        <div class="templist-item" style="height: 0px;visibility: hidden;"></div>
        <div class="templist-item" style="height: 0px;visibility: hidden;"></div>
    </div>
</template>

<script>
export default {
    name: 'SearchList',
    data() {
        return {
            loading2: true,
            imgData: null,
            image: '/img/home/collect-icon.png',
            collectImage: '/img/home/collect_s_icon_hl.png',
            list: [],
            obj: {list1:[], list2:[], list3:[], list4:[] },
            arr: [],
            demoList: [
                {src: '/img/1.jpg', title: '描述'},
                {src: '/img/2.jpg', title: '描述'},
                {src: '/img/3.jpg', title: '描述'},
                {src: '/img/4.jpg', title: '描述'},
                {src: '/img/5.jpg', title: '描述'},
                {src: '/img/6.jpg', title: '描述'},
                {src: '/img/7.jpg', title: '描述'},
                {src: '/img/2.jpg', title: '描述'},
                {src: '/img/9.jpg', title: '描述'}
            ],
            demo: [
                {src: '/img/1.jpg', title: '描述'},
                {src: '/img/2.jpg', title: '描述'},
                {src: '/img/3.jpg', title: '描述'},
                {src: '/img/4.jpg', title: '描述'},
                {src: '/img/5.jpg', title: '描述'},
                {src: '/img/6.jpg', title: '描述'},
                {src: '/img/7.jpg', title: '描述'},
                {src: '/img/2.jpg', title: '描述'},
                {src: '/img/9.jpg', title: '描述'}
            ],
            typeId: '',
            num: '',
            sizeid: ''
        }
    },
    props: ['tempList','title'],
    methods: {
        // 点击跳转到模板详情页
        handleToDetail(item) {
            console.log(item)
            this.typeId = item.ProductTypeId
            let t = item.TemplateNumber
            this.$router.push({path: '/detail', query: {t,title: this.title}})
        },
        handleCollect(i) {
            if(this.tempList[i].IsFavorite == false){
                var formData = new FormData()
                formData.append('TemplateNumber', this.tempList[i].TemplateNumber);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/FavoritedTemplate', formData, config).then(res => {
                    console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '收藏成功'})
                        this.tempList[i].IsFavorite = true
                    }else{
                        this.$message({type: 'error', message: '收藏失败'})
                        return
                    }
                })
            }else{
                var formData = new FormData()
                formData.append('TemplateNumber', this.tempList[i].TemplateNumber);
                formData.append('TeamNum', sessionStorage.getItem('teamNum'))
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.delete('/FavoritedTemplate', {data: formData}, config).then(res => {
                    // console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '取消收藏成功'})
                        this.tempList[i].IsFavorite = false
                    }else{
                        this.$message({type: 'error', message: '取消收藏失败'})
                        return
                    }
                })
            }
        },
        getData() {
            // this.$axios.get('/pubu').then(res =>{
            //     var result = res.data;
            //     for(let i in result){
            //         this.list = this.list.concat(result[i])
            //        // console.log(this.list)
            //     }
            //     this.getMore();
            //    // console.log(this.list)
            // })    
        },
        pubuliu() {

        },
        // waterfall(j) {
        //     if(j < this.list.length){
        //         var that = this;
        //         var newImg = new Image();
        //         // 获取图片地址
        //         // console.log(this.list[j])
        //         newImg.src = this.list[j].imgUrl;
        //         // console.log(that.$refs.piping0,
        //         //         that.$refs.piping1,
        //         //         that.$refs.piping2,
        //         //         that.$refs.piping3)
        //         newImg.onload = () =>{
        //             var arr = [
        //                 that.$refs.piping0.offsetHeight,
        //                 that.$refs.piping1.offsetHeight,
        //                 that.$refs.piping2.offsetHeight,
        //                 that.$refs.piping3.offsetHeight,
        //             ];
        //             var min = arr.indexOf(Math.min.apply(Math,arr))
        //             // 添加卡片模板
        //             var html = `
        //                 <div class="card">
        //                     <a href="/#/detail/1">
        //                         <img class="icon" src= ${newImg.src}>
        //                     </a>
        //                 </div>
        //             `
        //             // 给最小的管道添加卡片
        //             if(min == 0) {
        //                 that.$refs.piping0.innerHTML += html
        //             }else if(min == 1) {
        //                 that.$refs.piping1.innerHTML += html;
        //             }else if(min == 2) {
        //                 that.$refs.piping2.innerHTML += html;
        //             }else if(min == 3) {
        //                 that.$refs.piping3.innerHTML += html;
        //             }
        //             that.waterfall(j+1);
        //         }
        //     }
        // },
        // init(i) {
        //     console.log(this.$refs)
        //     // console.log(this.list,"zhieshi")
        //         this.arr = []
        //     if(i < this.list.length-1) {
        //         console.log('开始获取盒子高度')
        //         for(var index in this.$refs) {
        //             this.arr.push(this.$refs[index].offsetHeight)
        //         }
        //         // var arr = [
        //         //     this.$refs.box0.offsetHeight,
        //         //     this.$refs.box1.offsetHeight,
        //         //     this.$refs.box2.offsetHeight,
        //         //     this.$refs.box3.offsetHeight,
        //         // ]
        //         // console.log(arr)
        //         var minBoxHeight = Math.min.apply(this,this.arr)
        //         var minIndex;
        //         console.log('获取最小高度的盒子下标')
        //         for(var i in this.arr) {
        //             if(minBoxHeight == this.arr[i]){
        //                 minIndex = i;
        //             }
        //         }
        //         var item = this.list.shift()
        //         this.obj[i].push(item);
        //         console.log(this.obj)
        //         i++;
        //         console.log('结束,开始下一轮')
        //         this.init(i)
        //     }
        // },
        // 分页加载
        // getMore() {
        //     console.log('执行')
        //     var li = this.$refs.ul.children;
        //     // console.log(li)
        //     var Height = { f: [], w: [], t: [], four: []}
        //     for (var i = 0;i < li.length;i++){
        //         var inow = i%4;
                
        //         switch(inow) {
        //             case 0:
        //                 li[i].style.left = '5px';
        //                 Height.f.push(li[i].offsetHeight)
        //                 var step = Math.floor(i/4);
        //                 if(!step) {
        //                     li[i].style.top = 0;
        //                 } else {
        //                     var sum = 0;
        //                     for(var j = 0; j < step;j++){
        //                         sum += Height.f[j] + 5;
        //                     }
        //                     li[i].style.top = sum + 'px';
        //                 }
        //                 break;
        //             case 1:
        //                 li[i].style.left = '300px';
        //                 Height.w.push(li[i].offsetHeight);
        //                 var step = Math.floor(i/4);
        //                 if(!step) {
        //                     li[i].style.top = 0;
        //                 } else {
        //                     var sum = 0;
        //                     for(var j = 0; j < step;j++){
        //                         sum += Height.w[j] + 5;
        //                     }
        //                     li[i].style.top = sum + 'px';
        //                 }
        //                 break;
        //             case 2:
        //                 li[i].style.left = '600px';
        //                 Height.t.push(li[i].offsetHeight)
        //                 var step = Math.floor(i/4);
        //                 if(!step) {
        //                     li[i].style.top = 0;
        //                 } else {
        //                     var sum = 0;
        //                     for(var j = 0; j < step;j++){
        //                         sum += Height.t[j] + 5;
        //                     }
        //                     li[i].style.top = sum + 'px';
        //                 }
        //                 break;
        //             case 3:
        //                 this.waterfall(900,li[i],Height,i);
        //                 break;
        //         }
        //     }
        //     console.log('完毕')
		// },
		// position定位实现瀑布流
		// waterfall (left,li,Height,i) {
		// 	li.style.left = left + 'px';
		// 		Height.four.push(li.offsetHeight)
		// 		var step = Math.floor(i/4);
		// 		if(!step) {
		// 			li.style.top = 0;
		// 		} else {
		// 			var sum = 0;
		// 			for(var j = 0; j < step;j++){
		// 				sum += Height.four[j] + 5;
		// 			}
		// 			li.style.top = sum + 'px';
		// 		}
		// },
        // 滚动事件
        // scroll () {
        //     var veiwHeight = document.documentElement.clientHeight; // 可是区域高度
        //     var scrollY = document.documentElement.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
		// 	   var scrollHeight = document.documentElement.scrollHeight; // 整个文档的高度
			
        //     if(veiwHeight + scrollY >= scrollHeight){
        //         this.demoList = this.demoList.concat(this.demo)
        //         this.$nextTick(()=>{this.getMore()});
        //     }
        // }
    },
    // created() {
    //     this.$root.$on('setPassValue', (val) => {
    //         console.log(val)
    //     })
    // },
    mounted() {
        this.getData();
        window.addEventListener('scroll', this.scroll)
    },
    destroyed() {
        window.removeEventListener('scroll', this.scroll)
    }
}
</script>

<style lang="scss" scoped>
//demo
ul{
    position: relative;
}
li{
    position: absolute;
    width: 275px;
    padding: 5px;
    img{
        width: 100%;
    }
}


//
    // .search-list{
    //     width: 100%;
    //     padding: 10px 10px;
    //     // column-count: 4;
    //     // column-gap: 0;
    //     .water{
    //         width: 100%;
    //         padding: 5px 10px;
    //         display: flex;
    //         justify-content: space-between;
    //         min-width: 1250px;
    //     }
    // }
    .water-item{
        padding: 10px;
    }
    .water-item img{
        width: 100%;
    }
    .piping{
        width: 25%;
    }
    // .card{
    //     // width: 100%;
    //     // margin-top: 10px;
    //     // padding: 0 5px;
    // }
    .icon{
        width: 100%;
    }

.templist{
    // height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 25px;
}
.templist-item{
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
.templist-item .templist-block:hover .block-img-wrap .block-img-mask{
    display: block;
}
.templist-item .templist-block .block-img-wrap{
    width:280px;
    height:374px;
    border-radius:10px 10px 0px 0px;
}
.templist-item .templist-block .block-img-wrap img{
    width: 100%;
    height: 100%;
}
.templist-item .templist-block .block-img-wrap .block-img-mask{
    width: 100%;
    height: 374px;
    background:rgba(0,0,0,.2);
    display: none;
    border-radius:10px 10px 0px 0px;
    position: absolute;
    top: 0;
    left: 0;
}
.templist-item .templist-block .block-img-wrap .block-img-mask .tooltip{
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
.templist-item .templist-block .block-img-wrap .block-img-mask .tooltip .likeTemplate{
    width: 20px;
    height: 18px;
    margin: 9px 7px 8px 8px;
}
.templist-item .templist-block .block-img-wrap .block-img-mask .design-btn{
    width:167px;
    height:42px;
    background:rgba(0,131,233,1);
    border-radius:5px;
    border: 1px solid rgba(0,131,233,1);
    position: absolute;
    top: 169px;
    left: 56px;
}
.templist-item .templist-block .block-img-wrap .block-img-mask .design-btn span{
    width:72px;
    height:18px;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(254,254,254,1);
}
.templist-bottom{
    width: 100%;
    height: 77px;
    p{
        margin: 0;
    }
}
.templist-bottom .shop-title{
    padding: 16px 119px 13px 17px;
}
.templist-bottom .shop-title span{
    width:144px;
    height:17px;
    line-height: 17px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.templist-bottom .shop-tips{
    display: flex;
    justify-content: space-between;
}
.templist-bottom .shop-tips span{
    height:15px;
    line-height: 15px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.templist-bottom .shop-tips span:first-child{
    margin-left: 17px;
}
.templist-bottom .shop-tips span:last-child{
    margin-right: 18px;
}
.templist-bottom .shop-tips span:last-child img{
    display: inline-block;
    width: 11px;
    height: 11px;
}
    // .badge{
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     padding: 2px 2px;
    //     background: rgba($color: #000000, $alpha: .5);
    //     color: #fff;
    //     border-bottom-left-radius: 5px;
    // }
</style>
