<template>
    <div id="detail-left"> 
        <div id="detail-block">
            <div id="small" @mouseenter="init" @mouseleave="out" @mousemove="move($event)">
                <img id="smallimg" :src="$store.state.port.imgBaseUrl+image" alt="">
                <div id="move-block"></div>
            </div>
            <div id="big">
                <img id="bigimg" :src="$store.state.port.imgBaseUrl+image" alt="">
            </div>        
        </div>
        <div class="thumbnail" v-for="(items,i) in info" :key="i">
            <img @click="handlePrev(items)" class="img-left" :src="$store.state.port.staticPath + '/img/print/xqy_left.png'" alt="">
            <ul>
                <li :class="activeIndex == index ? 'active' : ''" v-for="(item,index) in items.Albums" :key="index" @mouseover="handleToggle(index,item)">
                    <img :src="$store.state.port.imgBaseUrl+item.ImageUrl" alt="">
                </li>
            </ul>
            <img @click="handleNext(items)" class="img-right" :src="$store.state.port.staticPath + '/img/print/xqy_right.png'" alt="">
        </div>
    </div>
</template>

<script>
var move,small,block,smallimg,bigimg,big,move_maxL,move_maxT,bigimg_maxL,bigimg_maxT;
export default {
    data () {
        return {
            image: '',
            activeIndex: 0,
        }
    },
    props: ['info'],
    mounted() {
        move = document.getElementById('move-block'); // 遮罩层
        smallimg = document.getElementById('smallimg');  // 要被放大的图片
        small = document.getElementById('small');  // 被放大图片的容器
        block = document.getElementById('detail-block')
        big = document.getElementById('big');  // 右侧可视区域
        bigimg = document.getElementById('bigimg');  // 放大后的图片

        // 得到右侧可视区域的宽高
        var bigW = big.clientWidth;
        var bigH = big.clientHeight;

        // 右侧大图的宽高
        var bigimgW = bigimg.offsetWidth;
        var bigimgH = bigimg.offsetHeight;

        // 左侧小图的宽高
        var smallimgW = smallimg.offsetWidth;
        var smallimgH = smallimg.offsetHeight;

        // 左侧遮罩层的宽高
        move.style.width = bigW/bigimgW * smallimgW/3*2 + 'px';
        move.style.height = bigH/bigimgH * smallimgH/3*2 + 'px';

        // 遮罩层运动的最大距离
        move_maxL = block.clientWidth - move.offsetWidth;
        move_maxT = block.clientHeight - move.offsetHeight;

        // 右侧图片运动的最大距离
        bigimg_maxL = bigimg.clientWidth - big.offsetWidth;
        bigimg_maxT = bigimg.clientHeight - big.offsetHeight;

        big.style.display = 'none';
        move.style.visibility = 'hidden';  // 鼠标未移入左侧区域是遮罩层和右侧大图不可见
    },
    watch: {
        info() {
            if(this.info[0].Albums.length > 0){
                for(var i=0;i<this.info.length;i++){
                    this.image = this.info[i].Albums[0].ImageUrl
                }
            }
        }
    },
    methods: {
        handleToggle(i,item) {
            this.activeIndex = i
            this.image = item.ImageUrl
        },
        handleNext(items) {  // 后退
            let num = items.Albums.length
            if(this.activeIndex < num-1){
                this.activeIndex = this.activeIndex + 1
                this.image = items.Albums[this.activeIndex].ImageUrl
            }else{
                this.activeIndex = 0
                this.image = items.Albums[0].ImageUrl
            }
        },
        handlePrev(items) {  // 前进
            let num = items.Albums.length
            if(this.activeIndex <= 0){
                this.activeIndex = num-1
                this.image = items.Albums[num-1].ImageUrl
            }else{
                this.activeIndex = this.activeIndex - 1
                this.image = items.Albums[this.activeIndex].ImageUrl
            }
        },


        init() {
            // 鼠标移入遮罩和大图可见
            move.style.visibility = 'visible';
            big.style.visibility = 'visible';
            big.style.display = 'block';
        },
        out() {
            big.style.display = 'none';
            move.style.visibility = 'hidden';
        },
        // 鼠标移动时遮罩层随鼠标移动而移动
        move(e) {
            var left = e.clientX - block.offsetLeft - move.offsetWidth/2;
            
            var top,scroll = document.documentElement.scrollTop || document.body.scrollTop;
            if(scroll > 0){
                top = e.clientY - block.offsetTop - move.offsetHeight/2 + scroll;
            }else{
                top = e.clientY - block.offsetTop - move.offsetHeight/2
            }


            // 超出边界赋值为0
            if(left < 0) left = 0
            if(top < 0) top = 0
            // 限制运动区域在容器之内
            if(left > move_maxL) left = move_maxL
            if(top > move_maxT) top = move_maxT
            // 放大比例
            var scaleL = left / move_maxL
            var scaleT = top / move_maxT
            // 遮罩层运动位置
            move.style.left = left + 'px';
            move.style.top = top + 'px';

            // 右侧大图运动位置
            bigimg.style.left = -scaleL * bigimg_maxL + 'px';
            bigimg.style.top = -scaleT * bigimg_maxT + 'px';
        }
    }
}
</script>

<style lang="scss" scoped>

#detail-left{
    width: 579px;
    #detail-block{
        width: 100%;
        height: 579px;
        position: relative;
    }
    #small{
        width: 100%;
        height: 579px;
        background:rgba(213,221,227,1);
        border-radius:5px;
        position: relative;
        overflow: hidden;
        #move-block{
            width: 156px;
            height: 156px;
            background: $color;
            opacity: .2;
            position: absolute;
            cursor: move;
        }
        #smallimg{
            width: 100%;
            height: 100%;
        }
    }
    .thumbnail{
        width: 100%;
        display: flex;
        justify-content: space-between;
        line-height: 90px;
        margin-top: 32px;
        align-items:center;
        img{
            height: 48px;
            display: inline-block;
            cursor: pointer;
        }
        ul{
            display: flex;
            justify-content: space-around;
            position: relative;
            li{
                width: 90px;
                height: 90px;
                margin-right: 6px;
                cursor: pointer;
                position: relative;
                border: 2px solid rgba(213,221,227,1);
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .active{
                border:2px solid $color;
                box-shadow:0px 2px 7px 0px rgba(120,120,120,0.81);
                border-radius:5px;
                &::before{
                    content: '';
                    border-bottom: 12px solid $color;
                    border-left: 12px solid transparent;
                    border-right: 12px solid transparent;
                    position: absolute;
                    top: -12px;
                    left: 33px;
                }
            }
        }
    }
}
#big{
    position: absolute;
    top: 0;
    left: 579px;
    width: 350px;
    height: 350px;
    overflow: hidden;
    border: 1px solid rgba(244,244,244,1);
    background: rgba(255,255,255,1);
    visibility: hidden;
    z-index: 10;
}
#big img{
    position: absolute;
    width: 700px;
    height: 700px;
}
</style>
