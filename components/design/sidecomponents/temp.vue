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
			<span @click="handleToggleType('store')" :class="toggle == 'store'? 'btn-active' : ''">收藏模板</span>
		</div>
		<div class="temp-filter" v-if="false">
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
		<div class="temp-content" ref="tempList" @scroll="getMoreData" v-if="!loadingIcon">
			<div class="temp-content-item" v-for="(item, index) in list" :key="index">
				
					<img 
					class="template-face" 
					draggable="false" 
					@click="getPage(item, index)" 
					:src="$store.state.port.imgBaseUrl + item.FacePicture" alt="">
				
			</div>
			<transition name="el-zoom-in-top">
				<div class="content-pages" ref="contentPages" v-show="seleteTemplate.templateNum">
					<div class="page-detail">
						<span>{{seleteTemplate.temp && seleteTemplate.temp.Name}}</span>
					</div>
					<div class="page-content">
						<div class="pages-item" v-for="(page, i) in templatePages" :key="i">
							<img class="page-img" @click="copyPage(page)" :src="$store.state.port.imgBaseUrl + page.Thumb" alt="">
						</div>
					</div>
				</div>
			</transition>
		</div>
		<div v-if="loadingIcon" style="text-align:center;padding: 50px 0;"><img style="height: 40px;" src="https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com/img/loading.gif" title="加载中..." alt="加载中..."></div>
		<div v-if="!loadingIcon && !list.length" style="text-align:center;padding: 50px 0;"><img style="width: 50%;" src="/img/error/ku.png" title="空空如也" alt="空空如也"></div>
		
    </div>
</template>

<script>
import Loading from "@/components/design/loading.vue";

export default {
  name: "temp",
  data() {
    return {
      /** 样式,显示切换 */
		loadingIcon: true, // 数据加载
		contentPagesShow: false, // 模板页
		seleteTemplate: { //选中模板
			templateNum: "", // 选中模板下标
			temp: null
		},
		params: { // 查询参数
			pageIndex: 1,
			pageSize: 20
		},
		page: 0, // 分分类
		keyword: "", // 模板搜索关键字

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
  props: ["templateInfo"],
  methods: {
    /**
     * @param {String} 模板类型
     */
    handleToggleType (type) {
		this.toggle = type;
		this.templatePages = "";
		this.seleteTemplate.templateNum = "";
		this.loadingIcon = true;
		this.params.pageIndex = 1;
		this.list = [];
		switch (type) {
			case "bus":
			this.getData({ ChargingMode: "", SortOrder: 0 })
			.then(data => {
				this.list = data.Data;
				this.getMore = data.Data.length;
			})
			break;
			case "team":
			this.getTeamData()
			.then(data => {
				this.list = data.Data;
				this.getMore = data.Data.length;
			});
			break;
			case "store":
			this.getFavoritedTemplates()
			.then(data => {
				this.list = data.Data;
				this.getMore = data.Data.length;
			});
			break;
			default:
			return;
      	}
    },
    // 获取团队母版数据
    getTeamData() {
		return new Promise((resolve, reject) => {
			let url = this.$store.state.port.TeamMasters;
			let formdata = new FormData();
			formdata.append("TeamNum", localStorage["teamNum"]);
			formdata.append("pageIndex", this.params.pageIndex);
			formdata.append("startTime", "");
			formdata.append("endTime", "");
			formdata.append("productcategory", "");

			this.$axios.post(url, formdata).then(({data}) => {
				this.loadingIcon = false;
				if (data == "") return resolve([]);
				resolve(data)
			});
		})
    },
    // 获取团队收藏模板
    getFavoritedTemplates() {
		return new Promise((resolve, reject) => {
			let url = this.$store.state.port.FavoritedTemplates;
			let formdata = new FormData();
			formdata.append("TeamNum", localStorage["teamNum"]);
			formdata.append("pageIndex", this.params.pageIndex);
			formdata.append("startTime", "");
			formdata.append("endTime", "");
			formdata.append("productcategory", "");
			let params = {
				TeamNum: localStorage["teamNum"],
				pageIndex: 0,
				startTime: "",
				endTime: "",
				productcategory: 0
			};
			this.$axios.get(url, { params }).then(({data}) => {
				this.loadingIcon = false;
				if (data == "") return resolve([]);
				resolve(data);
			});
		})
    },
    searchTemp(e) {
      // 搜索
      if (e.code == "Enter" || e.code == "NumpadEnter" || e.type == "click") {
		  this.getData({ ChargingMode: "", SortOrder: 0 })
		  .then(data => {
			  this.list = data.Data;
		  });
	  }
    },
    // 获取公用模板数据
    getData({ ChargingMode = "", SortOrder = 0 }) {
		return new Promise((resolve, reject) => {
			let svgSize = this.templateInfo;
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
			formData.append("pageIndex", this.params.pageIndex);
			formData.append("TeamNum", localStorage["teamNum"]);
			formData.append("KeyWords", this.keyword);

			let config = {
				headers: { "Content-Type": "multipart/form-data" }
			};
			this.$axios.post("/TemplateCenter", formData, config)
			.then(({data}) => {
				// console.log(data)
				this.loadingIcon = false;
				this.keyword = "";
				resolve(data)
				this.moreShow = false;
			})
			.catch(err => {
				resolve([])
				this.moreShow = false;
				// console.log(err);
			});
		})
	},
	getMoreData() { // 加载更多分页
		if (!this.getMore) return;
		let uploading = this.$refs.tempList,
			total = uploading.scrollHeight, // 整个文档的高度
			viewHeight = uploading.clientHeight, // 可视区域的高度
			scrollY = uploading.scrollTop || document.body.scrollTop; // 滚动条滚动的距离
		
		this.params.pageIndex++;
		if (viewHeight + scrollY >= total) { 
			if (this.toggle == 'bus') {
				this.getData({ ChargingMode: "", SortOrder: 0 })
				.then(data => {
					this.list = [].concat(this.list, data.Data);
					this.getMore = data.Data.length;
				})
			} else if (this.toggle == 'team') {
				this.getTeamData()
				.then(data => {
					this.list = [].concat(this.list, data.Data);
					this.getMore = data.Data.length;
				});
			} else if (this.toggle == 'store') {
				this.getFavoritedTemplates()
				.then(data => {
					this.list = [].concat(this.list, data.Data);
					this.getMore = data.Data.length;
				});
			}
		}
	},
    // 排序和收费筛选
    getOrder(SortOrder, title) {
		this.proClass.title = title;
		this.getData({ SortOrder });
		this.seleteTemplate.templateNum = "";
    },
    getMony(ChargingMode, shop) {
      this.proClass.shop = shop;
      this.getData({ ChargingMode });
      this.seleteTemplate.templateNum = "";
    },
    // 查询模板
    getPage(item, index) {
		this.seleteTemplate.templateNum = this.seleteTemplate.templateNum == index + 1 ? "" : index + 1;
		if (this.seleteTemplate.templateNum == '') {
			this.templatePages = [];
			return
		}
		this.seleteTemplate.temp = item;
	//   console.log(item, this.seleteTemplate.templateNum);
		let page =
		this.toggle == "bus" || this.toggle == "store"
			? "TemplatePages"
			: "Pages";
		let child = this.$refs.tempList.childNodes[index],
			step = parseInt(index / 2) + 1,
			height = child.offsetHeight;
		// console.log(step, height)
		this.$refs.contentPages["style"]["top"] = step * (height + 16) + "px";
		let formdata = new FormData(),
		url = null;
		if (page == "TemplatePages") {
		formdata.append("TemplateNumber", item["TemplateNumber"]);
		url = "/Template";
		} else {
		formdata.append("DocumentNumber", item["DocumentNumber"]);
		formdata.append("TeamNum", localStorage["teamNum"]);
		url = "/Document";
		}
		this.$axios.post(url, formdata).then(({data}) => {
		//   console.log(data)
		if (data == "") return this.templatePages = [];
		this.templatePages = data[page];
		// console.log(data);
		});
    },
    // 切换模板
    copyPage(page) {
      this.$confirm("使用模板后，将会覆盖掉此画布上的所有现有内容哦", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
		center: true,
		customClass: 'temp-replace'
      })
        .then(() => {
          this.$emit("templatePageReplace", JSON.parse(JSON.stringify(page)));
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
    this.getData({ ChargingMode: "", SortOrder: 0 }).then(data => {
		this.list = data.Data;
	});
  },
  components: {
    Loading
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/init.scss";
.temp {
  width: 100%;
  height: 100%;
  padding-top: 72px;
  position: relative;
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
    width: 100%;
    padding: 15px;
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
    width: 100px;
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
	position: absolute;
	top: 119px;
	bottom: 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	width: 100%;

	overflow-y: auto;
  .temp-content-item {
		width: 44%;
		background: #fff;
		margin: 8px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
		transition: all .3s;
		&:hover {
			box-shadow: rgba(0, 0, 0, 0.66) 0px 4px 8px 0px;
			.template-face {
				transform: scale(1.2);
			}
		}
		.template-face {
			display: block;
			width: 100%;
			cursor: pointer;
			transition: .3s;
		}
  }
  .content-pages {
	position: absolute;
	width: 100%;
	padding: 10px 8px;
	background: rgb(240, 236, 236);
	box-shadow: rgba(0, 0, 0, 0.66) 0px 4px 8px 0px;
	.page-detail {
		padding: 10px 0;
		text-align: center;
	}
    .page-content {
		// position: absolute;
		display: flex;
		flex-wrap: wrap;
		.pages-item {
			width: 50%;
			border: 1px solid rgba(0, 0, 0, 0.1);
			.page-img {
				display: block;
				width: 100%;
				cursor: pointer;
			}
		}
		
	}
  }
}
</style>

