<template>
  <div id="main" ref="main">
    <div class="box" v-for="i in 20" :key="i" ref="box">
      <div class="wrapper">
        <div class="pic"><img :src="$store.state.port.staticPath + '/img/bizhi.png'" alt=""></div>
        <div class="text">文字描述</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    waterfall(main,box) {
      // var main = document.getElementById(main);
      // var boxs = document.getElementsByClassName(box);
      var main = this.$refs.main;
      var boxs = this.$refs.box;
      console.log(main,boxs)
      var boxWidth = boxs[0].offsetWidth;
      var mainWidth = main.offsetWidth;
      var cols = Math.floor(mainWidth / boxWidth);
      var heightArr = [];
      for(var i=0;i < boxs.length;i++){
        var boxHeight = boxs[i].offsetHeight;
        if(i < cols) {
          heightArr.push(boxs[i].offsetHeight);
          boxs[i].style.top = '0px';
          boxs[i].style.left = i * boxWidth + 'px';
        }else{
          var minBoxHeight = Math.min.apply(this,heightArr);
          var minBoxIndex = this.getIndex(minBoxHeight,heightArr);
          boxs[i].style.top = minBoxHeight + 'px';
          boxs[i].style.left = minBoxIndex * boxWidth + 'px';
          heightArr[minBoxIndex] += boxHeight;
        }
      }
    },
    getIndex( val, arr) {
      for( var i in arr) {
        if(val == arr[i]) return i
      }
    }
  },
  mounted() {
  //  this.waterfall();
  }
}
</script>

<style scoped>
  #main{
    /* position: relative; */
    width: 1280px;
    margin: 0 auto;
    column-count: 4;
  }
  .box{
    /* position: absolute; */
    padding: 7px;
    box-sizing: border-box;
    width: 256px;
    padding: 5px;
    background-color: #fff;
    border: 1px solid #ee44ee;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .2)
  }
  .pic{
    font-size: 0;
  }
  .pic img {
    width: 100%;
    height: auto;
  }
  .text{
    color: #999;
    font-size: 14px;
    background: #fafafa;
    padding-top: 5px;
  }
</style>
