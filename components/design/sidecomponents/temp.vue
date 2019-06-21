<template>
    <div class="temp">
		
        <div class="temp-search">
			<input v-model="keyword" class="temp-search-input" @keyup="searchTemp" type="text" placeholder="请输入模板关键字">
			<span class="temp-search-icon" @click="searchTemp"></span>
		</div>
		<div class="temp-btn">
			<span @click="handleToggleType('bus')" :class="toggle == 'bus'? 'btn-active' : ''">公用模板</span>
			<span @click="handleToggleType('team')" :class="toggle == 'team'? 'btn-active' : ''">团队模板</span>
			<!-- <span @click="handleToggleType('shopping')" :class="toggle == 'shopping'? 'btn-active' : ''">已购买</span> -->
			<span @click="handleToggleType('store')" :class="toggle == 'store'? 'btn-active' : ''">已收藏</span>
		</div>
		<div class="temp-filter" v-if="toggle == 'bus'">
			<div class="temp-filter-content">
				<span>{{proClass.title}}</span>
				<div class="content-item">
					<span @click="getOrder(0, '热门推荐')">热门推荐</span>
					<span @click="getOrder(1, '使用最多')">使用最多</span>
					<span @click="getOrder(2, '收藏最多')">收藏最多</span>
					<span @click="getOrder(3, '最新上传')">最新上传</span>
				</div>
			</div>
			<div class="temp-filter-content">
				<span>{{proClass.shop}}</span>
				<div class="content-item">
					<span @click="getMony('', '全部')">全部</span>
					<span @click="getMony(0, '免费')">免费</span>
					<span @click="getMony(1, '会员免费')">会员免费</span>
				</div>
			</div>
		</div>
		<!-- 内容 -->
		<div class="temp-content" ref="tempList">
			<div class="temp-content-item" v-for="(item, index) in list" :key="index">
				<img class="template-face" draggable="false" @click="getPage(item, index)" :src="$store.state.port.imgBaseUrl + item.FacePicture" alt="">
			</div>
			<div class="content-pages" ref="contentPages" v-show="templateNum">
				<div class="pages-item" v-for="(page, i) in templatePages" :key="i">
					<img class="page-img" @click="copyPage(page)" :src="$store.state.port.imgBaseUrl + page.Thumb" alt="">
				</div>
			</div>
		</div>
		<div style="margin-top: 200px;"><Loading :moreShow="moreShow"></Loading></div>
    </div>
</template>

<script>
import Loading from "@/components/design/loading.vue";

export default {
  name: "temp",
  data() {
    return {
      /** 样式,显示切换 */
      fixedShow: false, // 固定显示
      contentPagesShow: false, // 模板页
      templateNum: "", // 选中模板下标

	  page: 0, // 分页
	  keyword: '', // 模板搜索关键字

      getMore: true, // 避免重复请求
      moreShow: true,
      toggle: "bus",
      list: [], // 获取当前产品列表
      templatePages: "", // 选中模板后获取模板数据

      proClass: { title: "热门推荐", shop: "全部" }, // 产品排序
      ev: { target: { id: "editor-page" } },
      // 查询当前分类模板
      tempdata: []
    };
  },
  props: ["templateInfo", "pageIndex"],
  methods: {
    /**
     * @param {String} 模板类型
     */
    handleToggleType: function(type) {
		this.toggle = type;
		this.templatePages = ''
		this.templateNum = ''
	  
      switch (type) {
			case "bus":
				this.getData({ ChargingMode: "", SortOrder: 0 })
			break;
			case "team":
				this.getTeamData();
			break;
			case "store":
				this.getFavoritedTemplates()
			break;
			default:
			return;
      }
    },
    // 获取团队母版数据
    getTeamData() {
		let url = this.$store.state.port.TeamMasters;
		let formdata = new FormData();
		formdata.append("TeamNum", sessionStorage["teamNum"]);
		formdata.append("pageIndex", 0);
		formdata.append("startTime", "");
		formdata.append("endTime", "");
		formdata.append("productcategory", '');

		this.$axios.post(url, formdata).then(res => {
			console.log(res);
			if (res == undefined || res == 'undefined') return console.log('没有返回数据')
			this.list = res.data.Data;
		});
	},
	// 获取团队收藏模板
	getFavoritedTemplates () {
		let url = this.$store.state.port.FavoritedTemplates;
		let formdata = new FormData()
		formdata.append('TeamNum', sessionStorage['teamNum'])
		formdata.append('pageIndex', 0)
		formdata.append('startTime', '')
		formdata.append('endTime', '')
		formdata.append('productcategory', '')
		let params = {
			'TeamNum': sessionStorage['teamNum'],
			'pageIndex': 0,
			'startTime': '',
			'endTime': '',
			'productcategory': 0,
		}
		this.$axios.get(url, {params})
		.then(res => {
			console.log(res)
			if (res == undefined || res == 'undefined') return console.log('没有返回数据')
			this.list = res.data.Data;
		})
	},
	searchTemp (e) { // 搜索
		if (e.code == 'Enter' || e.code == 'NumpadEnter' || e.type == 'click')
			this.getData({ ChargingMode: "", SortOrder: 0 })
	},
    // 获取公用模板数据
    getData({ ChargingMode = "", SortOrder = 0 }) {
	  let svgSize = this.templateInfo;
	//   console.log(svgSize)
      if (!this.getMore) return;
      this.getMore = false;
      this.moreShow = true;
      let formData = new FormData();
      let ProductTypeId = svgSize.ProductTypeId || svgSize.Size.TypeID;
      let ProductCategorieNum = svgSize.ProductCategorieNum;
	  let SizeId = svgSize.SizeId;
	//   console.log(ProductCategorieNum,  ProductTypeId, SizeId)
      formData.append("ProductCategorieNum", ProductCategorieNum);
      formData.append("ProductTypeId", ProductTypeId);
      formData.append("SizeId", SizeId);
      formData.append("ChargingMode", ChargingMode);
      formData.append("SortOrder", SortOrder);
      formData.append("pageIndex", this.page);
	  formData.append("TeamNum", sessionStorage["teamNum"]);
	  formData.append('KeyWords', this.keyword)
	 
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$axios
        .post("/TemplateCenter", formData, config)
        .then(res => {
			 this.keyword = ''
          if (res == undefined || res == "") return console.log("没有返回数据");
        //   console.log(res, 'moban')
          this.getMore = true;
          let data = res.data.Data;
          // console.log(data)
          this.list = data;
          this.moreShow = false;
        })
        .catch(err => {
          this.moreShow = false;
          this.getMore = true;
          console.log(err);
        });
    },
    // 排序和收费筛选
    getOrder(SortOrder, title) {
      this.proClass.title = title;
      this.getData({ SortOrder });
      this.templateNum = "";
    },
    getMony(ChargingMode, shop) {
      this.proClass.shop = shop;
      this.getData({ ChargingMode });
      this.templateNum = "";
    },
    // 查询模板
    getPage(item, index) {
		this.templateNum = this.templateNum == index + 1 ? "" : index + 1;
		console.log(item, this.templateNum)
		let page = this.toggle == 'bus' || this.toggle == 'store' ? 'TemplatePages' : 'Pages'
		let tempList = this.$refs.tempList,
			child = tempList.childNodes[index],
			step = (index % 1) + 1;
		let height = child.offsetHeight;
		this.$refs.contentPages["style"]["top"] = step * height + 20 + "px";
		let formdata = new FormData(), url = null;
		if (page == 'TemplatePages') {
			formdata.append('TemplateNumber', item['TemplateNumber'])
			url = '/Template'
		} else {
			formdata.append('DocumentNumber', item['DocumentNumber'])
			formdata.append('TeamNum', sessionStorage['teamNum'])
			url = '/Document'
		}
		this.$axios.post(url, formdata).then(res => {
			if (res == "undefined" || res == "null") return console.log("没有数据");
			if (res.data == "") return console.log("没有数据");
			let data = res.data[page];
			// console.log(data);
			this.templatePages = data;
		});
    },
    // 切换模板
    copyPage(page) {
      this.$confirm("是否使用这一页模板", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          this.$emit("copyPage", page);
        })
        .catch(() => {});
    },
    // 加载模板失败时
    handleLoaded(e) {
      e.target.parentNode.style.opacity = 0;
      // console.log(e.target.parentNode)
    },
    dragend(e, src) {
      e.preventDefault();
      if (e.clientX > 380) this.$emit("accepter", src);
    }
  },
  mounted() {
    this.getData({ ChargingMode: "", SortOrder: 0 });
  },
  updated() {
    this.fixedShow = true;
  },
  components: {
    Loading
  },
  watch: {
    pageIndex() {
      if (!this.getMore) return;
      this.page++;
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/init.scss";
.temp {
  width: 100%;
  padding-top: 72px;
  #search-active {
    position: fixed;
    top: 50px;
    left: 60px;
    width: 296px;
    z-index: 100;
  }
  .temp-search {
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    padding: 15px;
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
  }
}

.temp-btn {
	overflow: hidden;
	padding-left: 15px;
  span {
	float: left;
	margin-right: 10px;
    font-size: 12px;
    border: 1px solid rgba(220, 220, 220, 1);
    border-radius: 3px;
    color: rgba(51, 51, 51, 1);
    padding: 8px 12px;
    cursor: pointer;
  }
  .btn-active {
    background: $color;
    color: #fff;
  }
}
.temp-filter {
	// overflow: hidden;
	font-size: 12px;
	padding-left: 15px;
	margin-top: 15px;
  .temp-filter-content {
	  float: left;
	  width: 50px;
	  margin-right: 10px;
    padding: 3px 35px 3px 5px;
    border: 1px solid rgba(220, 220, 220, 1);
    border-radius: 3px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      right: 5px;
      top: 8px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-top-color: rgba(153, 153, 153, 1);
    }
    &:hover .content-item {
      height: 72px;
      border: 1px solid rgba(220, 220, 220, 1);
    }
    .content-item {
      position: absolute;
      left: 0;
      top: 23px;
      width: 100%;
      height: 0;
      overflow: hidden;
      transition: 0.3s;
      border: 1px solid transparent;
      z-index: 99;
      background: rgba(242, 242, 242, 1);
      span {
        display: block;
        height: 24px;
        line-height: 24px;
        padding-left: 10px;
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

// 内容
.temp-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  position: relative;
  .temp-content-item {
    width: 44%;
    background: #fff;
    margin: 8px;
    border: 1px solid $line;
    border-radius: 3px;
    // overflow: hidden;
    position: relative;
    .template-face {
      display: block;
      width: 100%;
      cursor: pointer;
    }
  }
  .content-pages {
    position: absolute;
    display: flex;
    width: 326px;
    padding-top: 10px;
    padding-left: 8px;
	padding-bottom: 10px;
    flex-wrap: wrap;
	background: rgb(240, 236, 236);
    .pages-item {
      width: 45%;
	  border: 1px solid rgba(0, 0, 0, .1);
      .page-img {
		  display: block;
			width: 100%;
			cursor: pointer;
      }
    }
    .pages-item:nth-child(2n) {
      padding-left: 15px;
    }
  }
}
</style>

