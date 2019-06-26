<template>
    <div class="toolsbar-wrap">
      <div class="tools-item-wrap">
          <div class="tools-item cart">
            <nuxt-link to="/order/shoppingCart">
              <el-badge :value="$store.getters.getProductionObj.length" class="item">
                <span class="icon"></span>
              </el-badge>
              <span class="text">购物车</span>
            </nuxt-link>
          </div>
        <div class="tools-item kefu">
           <a href="http://wpa.qq.com/msgrd?v=3&uin=1415538799&site=qq&menu=yes" target="_blank">
            <span class="icon"></span>
            <span class="text">客服</span>
          </a>
        </div>
        <div class="tools-item wechat">
          <span class="icon"></span>
          <span class="text">微信</span>
          <div class="wechat-wrap"></div>
        </div>
        <div class="tools-item telphone">
          <span class="icon"></span>
          <span class="text">电话</span>
          <div class="tel-detail">
            <p>咨询热线：4000975123</p>
            <p>在线时间：周一至周五  9:00~18:00</p>
          </div>
        </div>
        <div class="tools-item gotop" ref="btn" @click="handleTop">
          <span class="icon"></span>
          <span class="text">回顶部</span>
        </div>
      </div>
  </div>
</template>

<script>
export default {
    methods: {
        handleTop() {
            this.timer = setInterval(() => {
                let osTop = document.documentElement.scrollTop || document.body.scrollTop
                let ispeed = Math.floor(-osTop / 5)
                document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed
                this.isTop = true
                if (osTop === 0) {
                    clearInterval(this.timer)
                }
            }, 30)
        },
        scrollToTop() {
            let obtn = this.$refs.btn
            let osTop = document.documentElement.scrollTop || document.body.scrollTop
            if (osTop >= 250) {
                obtn.style.display = 'block'
            } else {
                obtn.style.display = 'none'
            }
            if (!this.isTop) {
                clearInterval(this.timer)
            }
            this.isTop = false
        }
    },
    mounted() {
        window.addEventListener('scroll', this.scrollToTop)
    },
    destroyed () {
        window.removeEventListener('scroll', this.scrollToTop); 
    },
}
</script>

<style lang="scss" scoped>
.toolsbar-wrap{
    position: fixed;
    right: 25px;
    bottom: 160px;
    height: 285px;
    z-index: 999;
    .tools-item-wrap{
      background:rgba(244,244,244,1);
      box-shadow:0px 0px 9px 0px rgba(108,108,108,0.18);
    }
    .tools-item{
      position: relative;
      width: 50px;
      height: 58px;
      background: rgba(255,255,255,1);
      // margin-bottom: 5px;
      cursor: pointer;
      color: rgba(153,153,153,1);
      a{
        color: rgba(153,153,153,1);
      }
      &:hover{
        color: rgba(255,255,255,1);
        background: $gradient;
        a{
          color: rgba(255,255,255,1);
        }
      }
      .item{
        display: block;
      }
      .text{
        display: inline-block;
        width: 50px;
        text-align: center;
        font-size: 12px;
      }
      .icon{
        width: 50px;
        height: 36px;
        display: block;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
    .cart{
      border-radius: 5px 5px 0 0;
    }
    .gotop{
      border-radius: 0 0 5px 5px;
      background: rgba(244,244,244,1);
    }
    .telphone{
      position: relative;
      .tel-detail{
        display: none;
        position: absolute;
        top: -20px;
        right: 50px;
        background:rgba(255,255,255,1);
        box-shadow: 0px 0px 9px 0px rgba(108,108,108,0.18);
        border-radius: 5px;
        width: 157px;
        height: 97px;
        font-size:14px;
        padding: 15px 25px 11px 17px;
        line-height: 18px;
        color:rgba(153,153,153,1);
        p:first-child{
          color: rgba(51,51,51,1);
          margin-bottom: 5px;
        }
      }
    }
    .wechat{
      position: relative;
      .wechat-wrap{
        display: none;
        position: absolute;
        top: -20px;
        right: 50px;
        background-image: url(/img/home/wechat_qrcode.png);
        background-repeat: no-repeat;
        background-size: 100%;
        width: 128px;
        height: 128px;
      }
    } 
    .cart .icon{
      background-image: url(/img/home/float/fb_shop_black.png);
    }
    .cart:hover .icon{
      background-image: url(/img/home/float/fb_shop_white.png);
    }
    .kefu .icon{
      background-image: url(/img/home/float/fb_kefu_black.png);
    }
    .kefu:hover .icon{
      background-image: url(/img/home/float/fb_kefu_white.png);
    }
    .wechat .icon{
      background-image: url(/img/home/wechat.png);
      background-repeat: no-repeat;
      background-size: 50%;
    }
    .wechat:hover .wechat-wrap{
      display: block;
    }
    .telphone .icon{
      background-image: url(/img/home/float/fb_telphone_black.png);
    }
    .telphone:hover .icon{
      background-image: url(/img/home/float/fb_telphone_white.png);
    }
    .telphone:hover .tel-detail{
      display: block;
    }
    .gotop .icon{
      background-image: url(/img/home/float/fb_return_black.png);
    }
    .gotop:hover .icon{
      background-image: url(/img/home/float/fb_return_white.png);
    }
  }
</style>
