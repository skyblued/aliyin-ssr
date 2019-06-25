<template>
    <div class="matter" ref="matter">
		
        <div class="matter-content"  ref="matterContent">
			<!-- :duration="{ enter: 200, leave: 200 }"  -->
			<transition name="fade" mode="out-in">
				<div key="type" class="show-animation" v-if="resultShowMoreOff">
					<!-- 个人收藏和购买 -->
					<div class="leftPanel-material-block leftPanel-material-content-block" data-title="团队素材">
						<div class="leftPanel-material-block-con">
							<div class="team-matter picture-filter"></div>
							<div class="team-matter show-bg" @click="getMatter('myMatter')"></div>
						</div>
						<div class="leftPanel-material-block-text"><span v-html="identity == 1 ? '我的素材' : '团队素材'"></span></div>
					</div>
					<div v-if="!identity" class="leftPanel-material-block leftPanel-material-content-block" data-title="团队LOGO">
						<div class="leftPanel-material-block-con">
							<div class="team-logo picture-filter"></div>
							<div class="team-logo show-bg" @click="getMatter('logo')"></div>
						</div>
						<div class="leftPanel-material-block-text"><span>团队LOGO</span></div>
					</div>
					<div class="leftPanel-material-block leftPanel-material-content-block" data-title="收藏夹">
						<div class="leftPanel-material-block-con">
							<div class="collect-store picture-filter"></div>
							<div class="collect-store show-bg" @click="getMatter('collect')"></div>
						</div>
						<div class="leftPanel-material-block-text"><span>收藏夹</span></div>
					</div>
					<!-- 分割线 -->
					<div class="leftPanel-material-cutout-rule leftPanel-material-content-block"></div>
					<!-- 素材分类 -->
					<div class="leftPanel-material-block leftPanel-material-content-block" v-for="(item,index) in materialTypes" :key="index" :data-title="item.TypeName" >
						<div class="leftPanel-material-block-con" @click="getMaterialCategories(item)">
							<div :style="{'background-image': `url(//img.aliyin.com//${item.ImageUrl})`}" class="item-icon-group show-bg"></div>
						</div>
						<div class="leftPanel-material-block-text"><span>{{item.TypeName}}</span></div>
					</div>
				</div>
				
				<div key="content" v-else class="leftPanel-material-results" ref="results">
					
					<!-- 搜索 -->
					<div class="temp-search" ref="search" v-if="!isFile">
						<input v-model="params.keyWords" class="temp-search-input" @keyup="enterUp" type="text" placeholder="请输入素材关键字">
						<span class="temp-search-icon" @click="searchMatter"></span>
					</div>
					<!-- 筛选 -->
					<div class="leftPanel-material-results-types">
						<div class="results-types-title">
							<div>{{resultsTypesTitle}}</div>
							<div class="result-close" @click="resultShowMore"></div>
						</div>
						<div class="results-types-tag" v-if="!isFile">
							<span>分类 : </span>
							<div class="result-tag" @click="setTagShow">
								<div class="result-tag-group">{{keyWords}}</div>
								<div :class="{'result-tag-show': true, 'result-tag-show-active': tagShow} ">
									<div :class="{'show-item': true, 'show-item-active': tagItemShow == 0 ? true : false}" @click="setKeyWords({Num:0,TypeCategoryName: '全部'})">全部</div>
									<div :class="{'show-item': true, 'show-item-active': tagItemShow == item.Num ? true : false}" v-for="(item,i) in materialCategories" :key="i" @click="setKeyWords(item)" :title="item.TypeCategoryName || item.TypeName">{{item.TypeCategoryName || item.TypeName}}</div>
								</div>
							</div>
						</div>
					</div>
					<!-- 列表 -->
					<div :style="{top: isFile == '' ? '160px' : '60px'}" class="content-list" ref="contentList" @scroll="getMore">
						<div class="items" ref="itemsList" v-if="resultsTypesTitle != '高清图片'">
							
							<div class="items-item" v-for="(item, index) of selectContentList" :key="index"
								@click="handleCreateImage(item)" 
							>
								<img 
									@load="getSvgContent"
									:style="{'object-fit': resultsTypesTitle != '几何形状' ? 'contain' : 'fill'}"
									draggable="false" 
									@mousedown="getPosDown"
									@mousemove="setPosMove($event, item)"
									@mouseup="oldPos.off = false"
									@error="imgError"
									:src="$store.state.port.imgBaseUrl + item.FilePath + (item.FilePath.indexOf('.svg') != -1 ? '' : '!w300.src')" alt="">
								<div class="item-collect" v-if="resultsTypesTitle != '团队素材' && resultsTypesTitle != '收藏夹' && resultsTypesTitle != '我的素材'  && resultsTypesTitle != '团队LOGO'">
									<div @click="collectMatter(item,index)" title="收藏" :class="{'leftPanel-common-results-item-collect': 1, 'collect-active': item.IsFavorited}"></div>
								</div>
							</div> 
						</div>
						<div v-else ref="list" class="parent-list">
							
							<div v-for="(item, index) of selectContentList"
							:key="index"
							@mousedown="setCopyBox($event, item)"
							class="column-item">
								<img 
									@load="handlewaterfall" 
									class="img-mash" draggable="false" 
									@click.stop="handleCreateImage(item)"
									@error="imgError"
									:src="$store.state.port.imgBaseUrl + item.FilePath + (item.FilePath.indexOf('.svg') != -1 ? '' : '!w300.src')" alt="">
								<div>
									<div @click="collectMatter(item,index)" title="收藏" :class="{'leftPanel-common-results-item-collect': 1, 'collect-active': item.IsFavorited}"></div>
								</div>
							</div>
						</div>
						<div v-if="loadingIcon || baseLine" style="width: 100%;text-align:center;padding: 50px 0;">
							<img v-if="loadingIcon" style="height: 40px;" src="//static.aliyin.com/img/loading.gif" title="加载中..." alt="加载中...">
							<span style="font-size: 14px;">{{baseLine}}</span>
						</div>
						<div v-if="!totalCount" style="text-align:center;padding: 50px 0;"><img style="width: 50%;" src="/img/error/ku.png" title="空空如也" alt="空空如也"></div>
					
					</div>
					
				</div>
			</transition>
			
			
			
        </div>
    </div>
</template>

<script>
import { setWaterfall } from "@/assets/commonJS.js";
import Share from "@/components/design/share.vue";
import Loading from "@/components/design/loading.vue";
export default {
  name: "matter",
  components: {
    Share,
    Loading
  },
  props: ["copyBox", "pageIndex"],
  data() {
    let identity = this.$route.params.t;
    let TeamNum = localStorage["teamNum"] || 0;
    identity =
      window.atob(identity).split("=")[0] == "TemplateNumber" ? true : false;
    let getloadUrl = identity
      ? this.$store.state.port.DesignerMaterials +
        `?SubStatus=0&AudStatus&StarTime&EndTime&TypeNum&TypeCateNum&Keywords`
      : this.$store.state.port.TeamMaterials + `?IsPublic=1`;
    return {
      loadingIcon: true, // 加载样式
      // 设计者身份
      identity,
      // 获取素材接口
      getloadUrl,
      // 固定显示
      fixedShow: false,
      isFile: "", // 是否文件夹
      baseLine: "", // 没有更多
      page: 0, // 分页页码
      keyword: "", // 搜索关键字
      TeamNum: localStorage["teamNum"], // 当前团队编号
      searchPage: 0, // 无类型搜索素材
      // 当前选中类型
      type: "",
      // 加载更多
      moreShow: false,
      moreLoading: false, // 加载动画
      noMatter: false, // 没有素材了
      /**
       * 样式切换类
       */

      resultShowMoreOff: true, // 显示更多标签
      textBlockSelected: 0, // 选中标签样式切换
      tagShow: false,
      tagItemShow: 0,

      params: {
        // 筛选素材的参数
        TypeNum: null,
        TypeCategoryNum: 0,
        pageIndex: 1,
        pageSize: 30,
        keyWords: ""
      },
      //	1.材料分类
      materialTypes: [],
      // 2.材料分类标签列表
      materialCategories: [],
      //3.具体内容 图片、图标、
      selectContentList: [],
      waterfallList: [], // 瀑布流
      // 4. 关键词分类
      keyWords: "全部",
      // 选中元素
	  ele: null,
	  oldPos: {
		  x: 0,
		  y: 0,
		  z:0,
		  off: false
	  },
      // 结果显示类别名称
      resultsTypesTitle: "",
      source: null, // 请求资源源头用于取消请求
      totalCount: 1 // 总的数据
    };
  },
  methods: {
    imgError(err) {
	  // 上传图片有问题
	  err && err.target.parentNode.setAttribute('style', 'display: none')
    },
    /* 所有的css样式切换功能 ↓*/
    // 获取标签
    resultShowMore() {
      this.resultShowMoreOff = true;
      this.isFile = "";
      this.selectContentList = [];
      this.params.pageIndex = 1;
      this.params.TypeCategoryNum = 0;
      this.params.keyWords = "";
      this.tagShow = false;
      this.baseLine = "";
      this.keyWords = "全部";
    },
    // 显示更多标签
    setTagShow() {
      this.tagShow = !this.tagShow;
    },
    //选中当前标签触发，改变当前标签样式
    selectTextBlockListIndex({ index, item }) {
      // console.log(index, item)
      this.textBlockSelected = index;
      this.getSelectContentList({ TypeNum: item.TypeNum, num: item.Num });
	},
    getSvgContent(e) {
	  // 获取svg内容
	  let list = this.$refs.itemsList.childNodes,
			src = e.path[0].src;
		if (src.lastIndexOf('.svg') > -1) {
			fetch(src).then(response => response.text())
			.then(data => {
				list.forEach((div, index) => {
					if (div == e.path[0].parentNode) {
						this.selectContentList[index].Svgtext = data
					}
				})
			})
		}	
    },
    // 内容瀑布流设置
    handlewaterfall() {
      let node = this.$refs.list;
      setWaterfall(node);
    },
    /* 所有的css样式切换功能 ↑*/

    /*  发送ajax获取数据方法 ↓ */
    getMatter(type) {
      // 根据身份选择获取素材

      this.loadingIcon = true;
      this.selectContentList = [];
      this.params.pageIndex = 1;
      this.isFile = type; // 选择文件夹
      this.resultShowMoreOff = false;
      if (type == "myMatter") {
        if (this.identity) {
          this.resultsTypesTitle = "我的素材";
          this.getDeisgnerMatter().then(res => {
            // console.log(res);
            this.selectContentList = res.Data;
          });
        } else {
          this.resultsTypesTitle = "团队素材";
          this.getTeamMatter().then(res => {
            // console.log(res);
            this.selectContentList = res.Data;
          });
        }
      } else if (type == "logo") {
        this.getTeamLogo().then(data => {
          if (typeof data == "object") {
          }
          this.selectContentList = data;
        });
      } else if (type == "collect") {
        this.getCollect().then(data => {
          this.selectContentList = data.data;
        });
      }
    },
    getDeisgnerMatter() {
      // 获取设计师素材列表

      return new Promise((resolve, reject) => {
        let url =
          this.getloadUrl +
          `&pageIndex=${this.params.pageIndex}&pageSize=${
            this.params.pageSize
          }`;
        this.$axios.get(url).then(res => {
          let data = res.data;
          if (!data || data == "[]") data = [];
          else data = JSON.parse(data);
          resolve(data);
        });
      });
    },
    getTeamMatter() {
      // 团队素材

      this.resultShowMoreOff = false;
      return new Promise((resolve, reject) => {
        let url =
          this.getloadUrl +
          `&TeamNum=${this.TeamNum}&pageIndex=${
            this.params.pageIndex
          }&pageSize=${this.params.pageSize}`;
        this.$axios.get(url).then(res => {
          this.loadingIcon = false;
          let data = res.data;
          data = typeof data == "object" ? data : JSON.parse(data);
          resolve(data);
        });
      });
    },
    getTeamLogo() {
      // LOGO
      this.resultsTypesTitle = "团队LOGO";
      this.resultShowMoreOff = false;
      return new Promise((resolve, reject) => {
        let url = `TeamLogos?TeamNum=${this.TeamNum}&IsPublic=1`;
        this.$axios.get(url).then(res => {
          let data = res.data;
          this.loadingIcon = false;
          data = typeof data == "object" ? data : JSON.parse(data);
          resolve(data);
        });
      });
    },
    getCollect() {
      // 获取素材收藏夹
      this.resultsTypesTitle = "收藏夹";
      this.resultShowMoreOff = false;
      return new Promise((resolve, reject) => {
        let url = `FavoritedMaterials?TypeNum=0&TypeCategoryNum=0&pageIndex=${
          this.params.pageIndex
        }&pageSize=${this.params.pageSize}`;
        this.$axios.get(url).then(res => {
          this.loadingIcon = false;
          let data = res.data;
          data = typeof data == "object" ? data : JSON.parse(data);
          resolve(data);
        });
      });
    },

    getMaterialTypes() {
      // 获取所有的素材分类, 类型
      this.$axios.get(this.$store.state.port.MaterialTypes).then(res => {
        this.materialTypes = res.data;
      });
    },

    getMaterialCategories(item) {
      // 获取当前素材分类的所有标签
      this.params.TypeNum = item.Num;
      this.resultsTypesTitle = item.TypeName;
      this.source = item.ID;
      let id = item.ID;
      this.getLabel().then(res => {
        // 获取label
        if (!res.data) return console.log("没有返回数据");
        this.resultShowMoreOff = false;
        this.materialCategories = res.data;
        // if (this.source) this.source.cancel('这里你可以输出一些信息，可以在catch中拿到')
        // this.source = this.$axios.CancelToken.source()
        // console.log(this.source)
        this.getContentList(id).then(res => {
          if (!res) return;
          let data = res.Data;
          this.totalCount = res["X-Pagination"].TotalCount;
          this.selectContentList = data;
        });
      });
    },
    getLabel() {
      // 获取标签

      return new Promise((resolve, reject) => {
        let url =
          this.$store.state.port.MaterialCategories +
          `?TypeNum=${this.params.TypeNum}`;
        this.$axios
          .get(url)
          .then(res => resolve(res))
          .catch(err => reject(err));
      });
    },
    getContentList(id) {
      // 获取内容

      this.loadingIcon = true;
      return new Promise((resolve, reject) => {
        let url =
          this.$store.state.port.MaterialInfos +
          `?TypeNum=${this.params.TypeNum}&TypeCategoryNum=${
            this.params.TypeCategoryNum
          }&pageIndex=${this.params.pageIndex}&pageSize=${
            this.params.pageSize
          }&KeyWords=${this.params.keyWords}`;
        this.$axios
          .get(url)
          .then(res => {
            this.loadingIcon = false;
            let data = res.data;
            data = typeof data == "object" ? data : JSON.parse(data);
            if (this.source != id) resolve(false);
            else resolve(data);
          })
          .catch(err => resolve(err));
      });
    },
    setKeyWords(item) {
      // 使用label搜索
      let id = this.source;
      this.tagItemShow = item.Num; // 样式切换
      this.loadingIcon = true;
      this.selectContentList = []; // 初始化内容
      this.params.pageIndex = 1; // 初始化页码
      this.baseLine = "";
      this.keyWords = item.TypeCategoryName; // 设置关键词并查找
      this.params.TypeCategoryNum = item.Num;
      this.getContentList(id).then(res => {
        if (!res) return;
        let data = res.Data;
        this.totalCount = res["X-Pagination"].TotalCount;
        this.selectContentList = data;
      });
    },
    searchMatter() {
      // 使用搜索框搜索素材
      let id = this.source;
      this.loadingIcon = true;
      this.selectContentList = [];
      this.getContentList(id).then(res => {
        if (!res) return;
        this.totalCount = res["X-Pagination"].TotalCount;
        this.selectContentList = res.Data;
      });
    },
    getMore() {
      // 加载更多
      let id = this.source;
      let uploading = this.$refs.contentList,
        total = uploading.scrollHeight, // 整个文档的高度
        viewHeight = uploading.clientHeight, // 可视区域的高度
        scrollY = uploading.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
      if (viewHeight + scrollY >= total && !this.baseLine) {
        this.params.pageIndex++;
        if (this.isFile == "") {
          this.getContentList(id).then(res => {
            if (!res) return;
            if (this.selectContentList.length == res["X-Pagination"].TotalCount)
              return (this.baseLine = "我是有底线的");
            this.selectContentList = this.selectContentList.concat(res.Data);
          });
        } else if (this.isFile == "myMatter") {
          if (this.identity) {
            this.resultsTypesTitle = "我的素材";
            this.getDeisgnerMatter().then(res => {
              if (!res) return;
              if (res.Data.length == 0) this.baseLine = "我是有底线的";
              this.selectContentList = this.selectContentList.concat(res.Data);
            });
          } else {
            this.resultsTypesTitle = "团队素材";
            this.getTeamMatter().then(res => {
              if (!res) return;
              if (res.Data.length == 0) this.baseLine = "我是有底线的";
              this.selectContentList = this.selectContentList.concat(res.Data);
            });
          }
        } else if (this.isFile == "logo") {
          this.getTeamLogo().then(res => {
            if (!res) return;
            if (res.Data.length == 0) this.baseLine = "我是有底线的";
            this.selectContentList = this.selectContentList.concat(res.Data);
          });
        } else if (this.isFile == "collect") {
          this.getCollect().then(res => {
            if (!res) return;
            if (res.Data.length == 0) this.baseLine = "我是有底线的";
            this.selectContentList = this.selectContentList.concat(res.Data);
          });
        }
      }
    },
    collectMatter(item, i) {
      // 收藏素材
      let url = "/FavoritedMaterial",
        config = {
          headers: { "Content-Type": "multipart/form-data" }
        },
        formdata = new FormData();
      formdata.append("materialnum", item.Num);
      if (item.IsFavorited) {
        this.$axios.delete(url, { data: formdata }).then(res => {
          let data = res.data;
          if (data.state == "Success") {
            item.IsFavorited = false;
            this.$message({ type: "warning", message: "取消收藏" });
          }
        });
      } else {
        this.$axios.post(url, formdata).then(res => {
          let data = res.data;
          if (data.state == "Success") {
            item.IsFavorited = true;
            this.$message({ type: "success", message: "收藏成功" });
          }
        });
      }
    },

    /*  将图片路径上行给父组件 */
    handleCreateImage(obj) {
	//   let result = 
	  this.checkedType(obj).then(result => {
		  this.$emit("handleAdd", result);
	  });
    },

    checkedType(obj) {
      // 检测当前元素类型
    //   console.log(obj)
		return new Promise((resolve, reject) => {
			let src, type;
			if (obj.TypeNum != 1) {
				if (obj.FilePath.lastIndexOf('.svg') > -1) {
				  	src = obj.Svgtext;
					type = "svg";
				} else {
					src = this.$store.state.port.imgBaseUrl + obj.FilePath + "!w300.src";
					let image = document.createElement("img");
					image.setAttribute("src",this.$store.state.port.imgBaseUrl + obj.FilePath + "!w800.src");
					image.onload = () => {image = null; };
					type = "image";
				}
			} else {
				src = obj.Svgtext;
				type = "adsorb";
			}
			resolve({src, type})
		})
    },
	getPosDown(e) {
		this.oldPos.x = e.clientX;
		this.oldPos.y = e.clientY;
		this.oldPos.off = true
	},
	setPosMove(e, item) {
		if (!this.oldPos.off) return
		if (Math.abs(e.clientX - this.oldPos.x) > 5 || Math.abs(e.clientX - this.oldPos.y) > 5) {
			this.setCopyBox(e,item)
			this.oldPos.off = false
		}
	},
    setCopyBox(e, item) {
      // 获取当前元素的位置和大小
        let ele = e.target,
            x = e.clientX - e.offsetX,
            y = e.clientY - e.offsetY,
            w = ele.offsetWidth,
            h = ele.offsetHeight;
        let cx = e.clientX,
            cy = e.clientY;
        this.checkedType(item).then(result => {
            let src = this.$store.state.port.imgBaseUrl + item.FilePath + (item.Svgtext == "" ? "!w300.src" : "");
            this.$emit("setCopyBox", { result, x, y, w, h, src, cx, cy ,item, ele});

        });
    },
    enterUp(e) {
      if (e.code == "Enter" || e.code == "NumpadEnter") this.searchMatter();
    }
  },
  computed: {
    position() {
      let left = this.page.position.left + "px",
        top = this.page.position.top + "px";
      return { left, top };
    }
  },
  mounted() {
    this.getMaterialTypes(); // 1.所有的素材分类
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
// 悬停时 浅蓝色
@import "@/assets/init.scss";
$hoverColor: #00c1de;
.matter {
  width: 100%;
  height: 100%;
  position: relative;
  .matter-content {
    width: 100%;
    height: 100%;
  }

  .temp-search {
    position: relative;
    width: 100%;
    padding: 10px;
    background: #fff;
    z-index: 9;
    .temp-search-input {
      width: 100%;
      height: 42px;
      border: 1px solid rgba(220, 220, 220, 1);
      border-radius: 5px;
      background-color: transparent;
      padding: 0 50px 0 20px;
      outline: none;
      font-size: 14px;
    }
    .temp-search-icon {
      position: absolute;
      right: 22px;
      top: 22px;
      display: inline-block;
      width: 18px;
      height: 18px;
      background: url(/img/search_icon.png) no-repeat 50%;
      cursor: pointer;
    }
    .temp-search-icon-close {
      position: absolute;
      right: 30px;
      top: 28px;
      display: inline-block;
      width: 20px;
      height: 20px;
      transform: rotate(45deg);
      cursor: pointer;
      &:hover::before,
      &:hover::after {
        background: $color;
      }
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        display: inline-block;
        width: 100%;
        height: 1px;
        background: #ccc;
        border-radius: 5px;
      }
      &::after {
        content: "";
        position: absolute;
        left: 50%;
        display: inline-block;
        width: 1px;
        height: 100%;
        background: #ccc;
        border-radius: 5px;
      }
    }
  }
}
.show-animation {
  padding-top: 10px;
  width: 100%;
  overflow: hidden;
}
.leftPanel-material-content-block {
  // 公共
  float: left;
  margin-top: 12px;
  margin-left: 30px;
}
.leftPanel-material-block {
  //材料块
  width: 70px;
  height: 100px;
}
.leftPanel-material-block-con {
  // 材料块图标
  width: 70px;
  height: 70px;
  border-radius: 5px;
  position: relative;
  .team-matter,
  .team-logo,
  .collect-store,
  .item-icon-group {
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
    position: absolute;
    border-radius: 5px;
    transition: all 0.3s;
  }
  .item-icon-group {
    background-size: 70%;
    background-position: 50%;
    border: 1px solid $line;
  }
  .team-matter {
    background: url(/img/desicon/matter/tdsc_icon.png);
  }
  .team-logo {
    background: url(/img/desicon/matter/logo_icon.png);
  }
  .collect-store {
    background: url(/img/desicon/matter/scj_icon.png);
  }
  .picture-filter {
    width: 90%;
    bottom: 0;
    left: 4px;
    opacity: 0.65;
  }
  &:hover .picture-filter {
    filter: blur(3px);
  }
  &:hover .show-bg {
    transform: translateY(-5px);
    cursor: pointer;
  }
}
.leftPanel-material-block-text {
  // 材料描述
  width: 100%;
  color: #626262;
  font-size: 12px;
  line-height: 28px;
  text-align: center;
}
.leftPanel-material-cutout-rule {
  // 截断线
  width: 264px;
  height: 1px;
  padding: 12px 0;
  position: relative;
  &::after {
    content: "";
    width: 264px;
    height: 1px;
    display: block;
    background: rgba(0, 0, 0, 0.12);
    position: absolute;
    top: 12px;
    left: 0;
  }
}
.leftPanel-material-results {
  // 材料块里面的容器
  width: 100%;
  height: 100%;
  position: relative;
}
// 标签列表
.leftPanel-material-results-types {
  width: 100%;
  z-index: 9;
  background: #fff;
  .results-types-title {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    margin: 0 20px;
    border-bottom: 1px solid $line;
    position: relative;
  }
  .results-types-tag {
    display: flex;
    justify-content: space-around;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    margin: 10px 0;
  }
  .result-tag {
    width: 220px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    font-size: 14px;
    border-radius: 3px;
    z-index: 10;
    position: relative;
    cursor: pointer;
    .result-tag-group {
      height: 28px;
      line-height: 28px;
      padding: 0 20px;
      position: relative;
      background: #fff;
      &::after {
        content: "";
        display: block;
        position: absolute;
        right: 15px;
        top: 8px;
        width: 12px;
        height: 12px;
        background: url(/img/desicon/trunDown12px.svg) no-repeat;
        background-size: 100%;
        transition: all 0.3s;
      }
      &:hover::after {
        transform: rotate(180deg);
      }
    }
    .result-tag-show-active {
      display: flex !important;
    }
    .result-tag-show {
      display: none;
      flex-wrap: wrap;
      width: 308px;
      height: auto;
      background: #fff;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.28);
      margin-left: -75px;
      margin-top: 4px;
      .show-item {
        width: 57px;
        height: 32px;
        margin: 5px 9px;
        background: #fff;
        position: relative;
        color: #4a4a4a;
        font-size: 12px;
        line-height: 32px;
        text-align: center;
        border: 1px solid $line;
        border-radius: 3px;
        color: $unchecked;
        cursor: pointer;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .show-item-active {
        background: $color;
        color: #fff;
      }
    }
  }
  .result-close {
    position: absolute;
    top: 12px;
    right: 5px;
    width: 26px;
    height: 26px;
    cursor: pointer;
    &::before {
      content: "";
      position: absolute;
      top: 12px;
      left: 3px;
      width: 20px;
      height: 2px;
      background: rgba(194, 194, 194, 1);
      transform: rotate(45deg);
    }
    &::after {
      content: "";
      position: absolute;
      top: 12px;
      left: 3px;
      width: 20px;
      height: 2px;
      background: rgba(194, 194, 194, 1);
      transform: rotate(-45deg);
    }
    &:hover::before,
    &:hover::after {
      background: rgba(68, 197, 255, 1);
    }
  }
}
// 获取的结果内容区域
.leftPanel-material-results-results {
  margin-left: 10px;
  position: relative;
}
.leftPanel-common-results-item {
  position: absolute;
  width: 30%;
  transition: 1s;
  cursor: pointer;
  .container-noStyle {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    transition: 0.3s;
    &::after {
      display: none;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      z-index: 1;
      pointer-events: none;
    }
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
  &:hover .leftPanel-common-results-item-collect,
  &:hover .container-noStyle::after {
    display: block;
  }
  & .collect-active {
    background-image: url(/img/desicon/matter/collect_red_icon.png);
  }
}
.leftPanel-common-results-item-collect {
  // 是否收藏
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 6px;
  right: 6px;
  border-radius: 50%;
  border: 1px solid #e7e7e7;
  display: none;
  background-color: #fff;
  background-image: url(/img/desicon/matter/collect_gray_icon.png);
  background-size: 100%;
  background-repeat: no-repeat;
  z-index: 2;
  cursor: pointer;
}
.content-list {
  position: absolute;
  width: 100%;
  bottom: 0;
  overflow-y: auto;
  .parent-list {
    width: 100%;
  }
  .column-item {
    position: absolute;
    width: 98px;
    padding: 2px;
    font-size: 0;
    box-sizing: border-box;
    transition: all 0.1s ease;
    cursor: pointer;
    img {
      max-width: 100%;
    }
    &:hover .del-icon,
    &:hover .leftPanel-common-results-item-collect {
      display: block;
    }
    & .collect-active {
      background-image: url(/img/desicon/matter/collect_red_icon.png);
    }
    &:hover .img-mash {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .items {
    padding-left: 15px;
    width: 100%;
    .items-item {
      display: inline-block;
      width: 94px;
      height: 94px;
      margin-right: 7px;
      padding: 10px;
      margin-bottom: 10px;
      background: #f4f4f4;
      cursor: pointer;
      position: relative;
      &:hover .leftPanel-common-results-item-collect {
        display: block;
      }
      & .collect-active {
        background-image: url(/img/desicon/matter/collect_red_icon.png);
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
