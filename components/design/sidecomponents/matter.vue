<template>
    <div class="matter" ref="matter">
		<div class="temp-search" ref="search">
			<input v-model="keyword" class="temp-search-input" @keyup="enterUp" type="text" placeholder="请输入素材关键字">
			<span v-if="!keyword" class="temp-search-icon" @click="searchMatter"></span>
			<span v-else class="temp-search-icon-close" @click="resultShowMore"></span>
		</div>
		<div class="leftPanel-material-results-types" v-if="!resultShowMoreOff && !isSearchType">
			<div class="results-types-title">
				<div>{{resultsTypesTitle}}</div>
				<div class="result-close" @click="resultShowMore"></div>
			</div>
			<div class="results-types-tag">
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
        <div class="matter-content"  @scroll="getMore" ref="matterContent">
			<!-- :duration="{ enter: 200, leave: 200 }"  -->
			<!-- <transition name="fade" mode="out-in"> -->
				<div key="type" class="show-animation" v-if="resultShowMoreOff">
					<!-- 个人收藏和购买 -->
					<div class="leftPanel-material-block leftPanel-material-content-block" data-title="团队素材">
						<div class="leftPanel-material-block-con">
							<div class="team-matter picture-filter"></div>
							<div class="team-matter show-bg" @click="getMatter"></div>
						</div>
						<div class="leftPanel-material-block-text"><span v-html="identity == 1 ? '我的素材' : '团队素材'"></span></div>
					</div>
					<div v-if="!identity" class="leftPanel-material-block leftPanel-material-content-block" data-title="团队LOGO">
						<div class="leftPanel-material-block-con">
							<div class="team-logo picture-filter"></div>
							<div class="team-logo show-bg" @click="getMaterialCategories(1, '团队LOGO')"></div>
						</div>
						<div class="leftPanel-material-block-text"><span>团队LOGO</span></div>
					</div>
					<div class="leftPanel-material-block leftPanel-material-content-block" data-title="收藏夹">
						<div class="leftPanel-material-block-con">
							<div class="collect-store picture-filter"></div>
							<div class="collect-store show-bg" @click="getMaterialCategories(1, '收藏夹')"></div>
						</div>
						<div class="leftPanel-material-block-text"><span>收藏夹</span></div>
					</div>
					<!-- 分割线 -->
					<div class="leftPanel-material-cutout-rule leftPanel-material-content-block"></div>
					<!-- 素材分类 -->
					<div class="leftPanel-material-block leftPanel-material-content-block" v-for="(item,index) in materialTypes" :key="index" :data-title="item.TypeName" >
						<div class="leftPanel-material-block-con" @click="getMaterialCategories(item.Num, item.TypeName)">
							<div :style="{'background-image': `url(//img.aliyin.com//${item.ImageUrl})`}" class="item-icon-group show-bg"></div>
						</div>
						<div class="leftPanel-material-block-text"><span>{{item.TypeName}}</span></div>
					</div>
				</div>
				
				<div key="content" :style="{'padding-top': isSearchType ? 0 : ''}" v-if="!resultShowMoreOff" class="leftPanel-material-results" ref="results">
					
					<div class="leftPanel-material-results-results" ref="list">
						<div class="leftPanel-common-results-item" v-for="(item,index) in selectContentList" :key="index">
							<div class="container-noStyle">
								<img draggable="false" @mousedown="setCopyBox($event, item)" @load="handlewaterfall" @click="handleCreateImage($event, item)" :src="$store.state.port.imgBaseUrl + item.FilePath + (item.Svgtext == '' ? '!w300.src': '')" title="点击添加">
								
								<div title="收藏" class="leftPanel-common-results-item-collect"></div>
								<div class="leftPanel-common-results-item-showMore">
									<p>
										<span>素材ID：</span><span style="user-select:text">2131</span>
									</p>
									<p>
										<span>关键词：</span><span>箭头 指向 目标 方向 三角形 形状 拉伸</span>
									</p>
								</div>
							</div>
						</div>
						<div v-if="moreLoading" style="width: 100%;height:30px;margin-top: 100px;margin-bottom: 200px; text-align: center">
							<img style="height:100%;vertical-align: middle;" src="https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/img/loading.gif" alt="">
						</div>
						<div v-if="noMatter" style="position: absolute; bottom: 0; width: 100%; text-align: center">素材完善中</div>
					</div>
					
				</div>
			<!-- </transition> -->
			
			<!-- <Loading :moreShow=""></Loading> -->
			
			
        </div>
    </div>
</template>

<script>
import { setWaterfall } from "@/assets/commonJS.js";
import Share from "@/components/design/share.vue";
import Loading from "@/components/design/loading.vue";
export default {
  components: {
    Share,
    Loading
  },
  props: ["copyBox", "pageIndex"],
  data() {
	let identity =  this.$route.params.t;
	let TeamNum = sessionStorage['teamNum'] || 0;
    	identity = window.atob(identity).split('=')[0] == 'TemplateNumber' ? true : false
    let getloadUrl =
      identity
        ? this.$store.state.port.DesignerMaterials +
		  `?SubStatus=0&AudStatus&StarTime&EndTime&TypeNum&TypeCateNum&Keywords`
        : this.$store.state.port.TeamMaterials +
          `?IsPublic=0`
    return {
      // 设计者身份
      identity,
      // 获取素材接口
      getloadUrl,
      // 固定显示
      fixedShow: false,
      isFile: false, // 是否文件夹
	  page: 0, // 分页页码
	  keyword: '', // 搜索关键字
	  TeamNum: sessionStorage['teamNum'],// 当前团队编号
	  searchPage: 0, // 无类型搜索素材
	  isSearchType: false, // 是否搜索状态
	  isHttpOk: true, // 避免重复请求
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
      /**
       * 页面数据获取
       * @materialTypes // 材料分类
       * @selectTextBlockList 选中材料标签列表
       * @selectContentList 具体内容 图片、图标 列表
       */
      //	1.材料分类
      materialTypes: [],
      // 2.材料分类标签列表
      materialCategories: [],
      //3.具体内容 图片、图标、
      selectContentList: [],
      // 4. 关键词分类
      keyWords: "全部",
      // 选中元素
      ele: null,
      // 结果显示类别名称
      resultsTypesTitle: ""
    };
  },
  methods: {
    /* 所有的css样式切换功能 ↓*/
    // 获取标签
    resultShowMore() {
	  this.resultShowMoreOff = true;
	  this.isSearchType = false
	  this.selectContentList = [];
	  this.page = 0;
	  this.type = ''
	  this.keyword = ''
    },
    // 显示更多标签
    setTagShow() {
      this.tagShow = !this.tagShow;
    },
    //选中当前标签触发，改变当前标签样式
    selectTextBlockListIndex({ index, item }) {
      // console.log(index, item)
      this.textBlockSelected = index;
      this.getSelectContentList({TypeNum: item.TypeNum, num: item.Num});
    },
    // 内容瀑布流设置
    handlewaterfall() {
	  let node = this.$refs.list,
	  	height = node.offsetHeight
	  this.$refs.results['style']['height'] = height + 'px'
      setWaterfall(node, 5, 20);
    },
    /* 所有的css样式切换功能 ↑*/

	/*  发送ajax获取数据方法 ↓ */
	getMatter () { // 根据身份选择获取素材
		if (this.page == 0) {
			this.selectContentList = []
		}; // 重置素材详情列表
		this.isFile = true; // 选择文件夹
		this.resultShowMoreOff = false
		this.moreLoading = true;
		if (this.identity) {
			this.getDeisgnerMatter()
			this.resultsTypesTitle = '我的素材'
		} else {
			this.getTeamMatter()
			this.resultsTypesTitle = '团队素材'
		}
	},
	getDeisgnerMatter() {// 获取设计师素材列表
		let url = this.getloadUrl + `&pageIndex=${this.page}&pageSize=40`
		this.$axios.get(url)
		.then(res => {
			this.moreLoading = false;
			if (res.data == "") return console.log("没有数据");
			let data = JSON.parse(res.data);
			if (data.Data.length < 1) this.noMatter = true
			else this.noMatter = false
			this.selectContentList = this.selectContentList.concat(data.Data);
		});
    },
	getTeamMatter() {// 团队素材
		let url = this.getloadUrl + `&TeamNum=${this.TeamNum}&pageIndex=${this.page}&pageSize=40`
      	this.$axios.get(url)
        .then(res => {
			this.moreLoading = false;
			if (!res) return console.log("没有数据");
			let data = JSON.parse(res.data);
			if (data.Data.length < 1) this.noMatter = true
			else this.noMatter = false
			this.selectContentList = this.selectContentList.concat(data.Data);
        });
	},
	 // 获取所有的素材分类, 类型
    getMaterialTypes() {
      this.$axios.get(this.$store.state.port.MaterialTypes).then(res => {
        // console.log(res);
        this.materialTypes = res.data;
      });
    },
    // 获取当前素材分类的所有标签
    getMaterialCategories(n, title) {
		this.fixedShow = true;
		this.resultsTypesTitle = title;
		this.type = n;
		this.page = 0;
		this.moreShow = true;
		this.isSearchType = false;
		this.isFile = false;
		this.$axios
			.get(this.$store.state.port.MaterialCategories + `?TypeNum=${n}`)
			.then(res => {
			if (!res.data) return;
			this.materialCategories = res.data;
			this.getSelectContentList({TypeNum: n});
			});
    },
	/**根据当前选中类别获取具体内容数据
	 * TypeNum类型, page页码, Num, size页大小
	 */
    getSelectContentList({TypeNum, page = 0, Num = 0, size =30}) {
	  // console.log(TypeNum, Num)
	  this.moreLoading = true;
	  this.searchPage = 0; // 重置无类型素材页码
	  this.isHttpOk = false
	  this.resultShowMoreOff = false;
      this.$axios
        .get(
          this.$store.state.port.MaterialInfos +
            `?TypeNum=${TypeNum}&TypeCategoryNum=${Num}&pageIndex=${page}&pageSize=${size}&keyword=${this.keyword}`
        )
        .then(res => {
			this.moreLoading = false;
			this.isHttpOk = true;
			this.moreShow = false;
			let data = JSON.parse(res.data).Data;
			if (data.length < 1) this.noMatter = true
			else this.noMatter = false
			this.selectContentList = this.selectContentList.concat(data);
        }).catch(err => {this.isHttpOk = true})
    },
    // 使用关键词搜索
    setKeyWords(item) {
		// 样式切换
		this.tagItemShow = item.Num;
		// 设置关键词并查找
		this.keyWords = item.TypeCategoryName;
		this.page = 0;
		let num = item.Num;
		this.selectContentList = [];
		this.getSelectContentList({TypeNum: this.type, page: this.page, num, size: 30});
		
	},
	searchMatter () { // 使用主页面搜索框搜索素材
		if (!this.type) {
			this.resultShowMoreOff = false;
			this.isSearchType = true;
			this.moreLoading = true;
			this.isHttpOk = false
			if (this.page == 0) this.selectContentList = []
			this.materialCategories = this.materialTypes
			let url = this.$store.state.port.MaterialInfos +
				`?TypeNum=0&TypeCategoryNum=0&pageIndex=${this.page}&pageSize=30&KeyWords=${this.keyword}`
			this.$axios.get(url)
			.then(res => {
				this.isHttpOk = true
				this.moreLoading = false;
				if (res.data == '') return console.log('没有数据返回')
				let data = JSON.parse(res.data)
				// console.log(data.Data)
				if (data.Data.length < 1) this.noMatter = true
				else this.noMatter = false
				this.selectContentList = this.selectContentList.concat(data.Data) 
			})
		} else {
			if (this.keyword != '') this.selectContentList = []
			this.getSelectContentList({TypeNum: this.type, page: this.page})
		}
		
	},
	getMore () { // 加载更多
		let uploading = this.$refs.matterContent;
			let total = uploading.scrollHeight; // 整个文档的高度
			let viewHeight = document.documentElement.clientHeight; // 可视区域的高度
			let scrollY = uploading.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
			this.mouseTop = scrollY
			if (viewHeight + scrollY >= total - 72 && !this.noMatter) {
				if (!this.isHttpOk) return
				this.page++;
				if (!this.isSearchType) {
					if (this.isFile) {
						this.getMatter();
					} else {
						this.getSelectContentList({TypeNum: this.type, page: this.page, size: 10});
					}
				} else {
					this.searchPage++
					this.searchMatter()
				}
			}
		
	},

    /*  将图片路径上行给父组件 */
    handleCreateImage(e, obj) {
      let result = this.checkedType(obj);
      this.$emit("handleAdd", result);
    },
    // 检测当前元素类型
    checkedType(obj) {
      let src, type;
      if (obj.TypeNum != 1) {
        if (obj.Svgtext != "") {
          src = obj.Svgtext;
          type = "svg";
        } else {
		  src = this.$store.state.port.imgBaseUrl + obj.FilePath + "!w300.src";
		  let image = document.createElement('img')
		  image.setAttribute('src', this.$store.state.port.imgBaseUrl + obj.FilePath + "!w800.src");
		  image.onload = () => {
			image = null
		  }
          type = "image";
        }
      } else {
        src = obj.Svgtext;
        type = "adsorb";
      }
      return { src, type };
    },
    // 获取当前元素的位置和大小
    setCopyBox(e, item) {
      let ele = e.target,
        x = e.clientX - e.offsetX,
		y = e.clientY - e.offsetY, 
		w = ele.offsetWidth, 
		h = ele.offsetHeight;
      let cx = e.clientX, cy = e.clientY;
      let result = this.checkedType(item);
      let src = this.$store.state.port.imgBaseUrl + item.FilePath + "!w300.src";
      this.$emit("setCopyBox", {result, x, y, w, h, src, cx, cy});
      this.ele = ele;
	},
	enterUp (e) {
		if (e.code == 'Enter' || e.code == 'NumpadEnter')
			this.searchMatter()
	},
  },
  computed: {
    position() {
      let left = this.page.position.left + "px",
        top = this.page.position.top + "px";
      return { left, top };
    }
  },
  mounted() {
    /**
     * 获取后台数据
     */
    // 1.所有的素材分类
    this.getMaterialTypes();
    // 3.素材分类内容数据
	// this.getSelectContentList();
  },
  destroyed() {
  },
  watch: {
    // 监控当前元素的值
    copyBox() {
      // console.log(this.copyBox)
      if (this.copyBox) {
        this.ele.style.display = "none";
      } else {
        this.ele.style.display = "block";
      }
    },
  }
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
    padding-top: 72px;
  	overflow-y: scroll;
  }
  .matter-content .search-active {
    position: fixed;
    top: 50px;
    left: 60px;
    width: 296px;
  }
  .temp-search {
    position: absolute;
    top: 0;
    width: 89%;
    padding: 15px;
    background: #fff;
    z-index: 9;
    .temp-search-input {
      width: 77%;
      height: 42px;
      border: 1px solid rgba(220, 220, 220, 1);
      background-color: transparent;
      padding: 0 50px 0 20px;
      outline: none;
      font-size: 14px;
    }
    .temp-search-icon {
      position: absolute;
      right: 30px;
      top: 28px;
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
		&:hover::before, &:hover::after{
			background: $color;
		}
		&::before {
			content: '';
			position: absolute;
			top: 50%;
			display: inline-block;
			width: 100%;
			height: 1px;
			background: #ccc;
			border-radius: 5px;
		}
		&::after {
			content: '';
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
  overflow: hidden;
  transition: 1s;
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
  padding-top: 98px;
  position: relative;
}
// 标签列表
.leftPanel-material-results-types {
  position: absolute;
  top: 74px;
  width: 326px;
  z-index: 9;
//   box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
  background: #fff;
  .results-types-title {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
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
  min-height: 100%;
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 150px;
  position: relative;
}
.leftPanel-common-results-item {
  position: absolute;
  width: 88px;
  transition: 1s;
  cursor: pointer;
  .container-noStyle {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    transition: 1s;
    img {
      width: 100%;
      height: auto;
      transition: 0.3s;
      &:hover {
        transform: scale(1.1);
      }
    }
    &:hover .leftPanel-common-results-item-dots,
    &:hover .leftPanel-common-results-item-collect {
      display: block;
    }
  }
}
.leftPanel-common-results-item-dots {
  //显示详细信息开关
  display: none;
  position: absolute;
  width: 16px;
  height: 16px;
  left: 6px;
  bottom: 6px;
  border-radius: 50%;
  background: #f6f6f6;
  transition: background 0.2s ease;
  border: 1px solid #e7e7e7;
  &::after {
    content: "";
    display: block;
    width: 14px;
    height: 14px;
    transition: background 0.1s ease;
    background: url(/img/LeftPanel3dot.svg) no-repeat;
  }
}
.leftPanel-common-results-item-collect {
  // 是否收藏
  width: 16px;
  height: 16px;
  position: absolute;
  bottom: 6px;
  right: 6px;
  border-radius: 50%;
  padding: 2px;
  border: 1px solid #e7e7e7;
  display: none;
  background: #fff;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 13px;
    background: url(/img/islike.svg) no-repeat 0 0;
    background-size: 14px auto;
  }
}
.leftPanel-common-results-item-collect.active::after {
  background: url(/img/islike.svg) no-repeat 0 -14px;
  background-size: 14px auto;
}
.leftPanel-common-results-item-showMore {
  // 详细信息: 素材标号,关键词
  position: absolute;
  left: 0;
  width: 280px;
  overflow: hidden;
  background: #fff;
  z-index: 99;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
  padding: 8px;
  text-align: left;
  p {
    line-height: 20px;
    font-size: 14px;
    span {
      color: #4a4a4a;
      display: block;
      width: 200px;
      float: left;
    }
    span:first-child {
      width: 60px;
      color: #9b9b9b;
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
