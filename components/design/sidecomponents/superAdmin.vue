<template>
	<div id="super-admin">
		<h6 style="font-size: 16px;text-align: center;">管理员审核</h6>
		<table class="temp-list" style="width: 100%;">
			<tr>
				<td>模板名称:</td>
				<td><span>{{templateData.TemplateName}}</span></td>
			</tr>
			<tr>
				<td><span>作者:</span></td>
				<td><span>{{templateInfo.Author}}</span></td>
			</tr>
			<tr>
				<td><span>模板编号:</span></td>
				<td><span>{{templateInfo.TemplateNumber}}</span></td>
			</tr>
			<tr 
				v-for="(item,i) in templateData.filters" :key="i"
			>
				<td class="temp-list">{{item.Name}}:</td>
				<td class="temp-list-item">
					<div v-for="(filter, j) in item.FilterValues" :key="j">
						<!-- -->
						<div v-if="filter.isSelected" style="padding:5px 5px 5px 0;">
							<span v-if="filter.DisplayMode == 0">{{filter.Name}}</span>
							<img v-else :src="$store.state.port.ossPath + filter.ImageUrl" alt="">
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<td><span>关键词:</span></td>
				<td><span>{{templateData.Keywords && templateData.Keywords.join(' , ')}}</span></td>
			</tr>
			<tr>
				<td>模板介绍:</td>
				<td><span style="word-break:break-all; ">{{templateData.Content}}</span></td>
			</tr>
		</table>
		<div>
			<el-button v-if="isSubmitState" @click="position.show = !position.show">修改提交信息</el-button>
			<el-button v-else @click="submitShow = !submitShow">提交模板</el-button>
		</div>
		<!-- 提交模板信息 -->
		<transition name="animation-scale">
			<div v-if="submitShow" class="model-dialog">
				<div style="background: #fff;min-width: 850px;border-radius: 10px;padding: 10px;position: absolute;left: 200px;top: 100px;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .6);" 
				ref="submitTemplate" 
				@mousedown.stop="handledown">
					<div @mousedown.stop class="close-btn" style="top:0;right: -55px;" @click="submitShow = false"></div>
					<TempSubmit
						
						:faceImg="templateData.FacePicture"
						@toggleDialog="submitShow = false" 
						:ProductTypeId="templateInfo.ProductType.TypeId" 
						:TemplateNumber="templateInfo.TemplateNumber" 
						:tempName="templateInfo.Name"></TempSubmit>
				</div>
			</div>
		</transition>
		
		<!-- 修改模板信息 -->
		<transition name="animation-scale">
			<div class="put-template"
				v-if="position.show"
				ref="putTemplate"
			>
				<div style="position: relative; text-align: center;font-size: 18px;padding: 10px 0;background: #909399;color: #fff; cursor: move;"
					@mousedown.stop="handledown"
					title="按下拖拽"
				>
					<span>修改提交信息</span>
					<div title="关闭" class="close-btn" style="top: 0" @mousedown.stop @click="position.show = false"></div>
					
				</div>
				<div class="template-content">
					<div class="info">
						<div class="info-item">
							<div class="item-title">模板名称:</div>
							<div class="item-right">
								<el-input size="small" v-model="templateData.TemplateName"></el-input>
							</div>
						</div>

						<div class="info-item"
							v-for="(item, i) in templateData.filters" :key="i"
						>
							<div class="item-title">{{item.Name}}</div>
							<div class="item-right">
								<el-select 
									v-model="FilterVaules[i]" 
									:multiple-limit="3"
									size='medium'
									multiple placeholder="请选择">
									
									<el-option
									v-for="filter in item.FilterValues"
									:key="filter.ValueId"
									:label="filter.Name"
									:value="filter.ValueId">
									<img
										v-if="filter.DisplayMode == 1" 
										:src="$store.state.port.ossPath + filter.ImageUrl" alt="">
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="info-item">
							<div class="item-title">关键词标签:</div>
							<div class="item-right lable-content">
								<div>
									<span class="lable-item"
										v-for="(item, i) in templateData.Keywords" :key="item" 
										@click="delKeywords(i)"
									>{{item}}<span class="label-close"></span></span>
								</div>
								<input 
								@keydown.enter="addKeywords"
								@blur="addKeywords"
								ref="keyInput" 
								class="lable-input" />
							</div>
						</div>
						<div class="info-item">
							<div class="item-title">模板介绍:</div>
							<div class="item-right">
								<el-input
								type="textarea"
								:autosize="{ minRows: 2}"
								placeholder="请输入内容"
								v-model="templateData.Content">
								</el-input>
							</div>
						</div>
					</div>
					<div class="cover">
						<p>模板封面</p>
						<div style="position: relative;">
							<img title="点击预览"
							v-if="templateData.FacePicture"
							@load="uploadProgress = 0"
							@click="previewImg = true" style="width: 100%;cursor:pointer;" 
							:src="$store.state.port.ossPath + templateData.FacePicture">
							<div v-if="uploadProgress" style="position: absolute;bottom: 0;width: 100%;height: 26px;line-height: 26px;text-align: center">{{uploadProgress}}%</div>
							<div v-if="uploadProgress" class="upload-progress" :style="`width: ${uploadProgress}%`"></div>
							<div v-else class="submit-btn" style="width: 90px;padding: 5px;" @click="uploadFacePicture">上传封面</div>
						</div>
					</div>
				</div>
				<div class="template-bottom">
					<div class="submit-btn" @click="submitTemplate">提交</div>
				</div>
			</div>
		</transition>
		<!-- el-zoom-in-center -->
		<div></div>
		<transition name="el-fade-in-linear">
			<div class="img-preivew" v-if="previewImg" @click="previewImg = false" title="点击收起"></div>
		</transition>
		<transition name="scale">
			<div class="img-preivew animation-img" v-if="previewImg" @click="previewImg = false" title="点击收起">
				<img v-if="templateData.FacePicture" :src="$store.state.port.ossPath + templateData.FacePicture" alt="">
			</div>
		</transition>
		<div style="margin-top: 30px;">
			<!-- <el-button type="danger" @click="superBtn">全选</el-button> -->
			<!-- <el-button type="success" @click="dingchang">丁唱</el-button> -->
			<el-button type="success" @click="dingchang2">一键解锁</el-button>
			<el-button type="success" @click="dingchangDasan">一键打散</el-button>
			<!-- <div style="width:100px;">
				<el-input type="number" min='1' resize="both" v-model="size"></el-input>
			</div> -->
		</div>
		
	</div>
</template>

<script>
import TempSubmit from '@/components/designer/TempSubmit.vue'
export default {
	name: 'super-admin',
	components: {
		TempSubmit
	},
	props: {
		templateInfo: {
			type: Object
		},
		PageData: {
			type: Array
		}
	},
	data() {
		let params = this.$route.params.t
		params = window.atob(params)
		let tempId = params.split('&')[0].split('=')[1];
		return {
			bonusPoint: 1, // 积分
			rejectText: '', // 拒绝理由
			toggle: '', // 切换
			tempId, // 模板ID
			isSucces: false, // 是否通过
			isPutaway: true, // 是否上架
			size: 15.4, // 比例
			isSubmitState: true, // 是否提交过
			submitShow: false, // 提交组件的显示
			position: { // 移动记录时间
				show: false,
				move: false,
				x: 0,
				y: 0,
				left: 380,
				top: 85,
				ele: null
			},
			templateData: {
				ID: null,//提交记录的ID
				FilterVaules: null,//属性实际ID,逗号隔开
				StrThematic: null,//所属专题
				Keywords: null,//关键词
				Content: null,//内容
				TemplateName: null,//模板名称 
				FacePicture: null,//封面
				TemplateNumber: null, //模板编号
				filters: [],
			}, // 模板数据
			FilterVaules: [], // 分类选择
			isSubmit: true, // 是否提交过 
			previewImg: false, // 展示大的缩略图
			uploadProgress: 0, // 上传进度
		}
	},
	methods: {
		getState(type) { // 获取模板信息
			return new Promise((resolve, reject) => {
				var formData = new FormData()
                formData.append('action', type);
				formData.append('templatenum', this.templateInfo.TemplateNumber);
				this.$axios.post('/UpperShelfTemplate', formData)
				.then(({data}) => {
                    if(data.state == 'ok') {
						this.isPutaway = !this.isPutaway;
						this.$message.success(data.msg)
						resolve(true)
                    }else{
						this.$message.error(data.msg)
						reject(true)
                    }
                })
			})
		},
		superBtn() { // 回退元素
			// console.log(this.templateInfo)
			this.$emit('superBtn')
		},
		dingchang() {
			this.$emit('dingchang', this.size)
		},
		dingchang2() {
			this.$emit('dingchang2')
		},
		dingchangDasan() {
			this.$emit('dingchangDasan')
		},
		handledown(e) {
			console.log(e)
			let ele = this.$refs.putTemplate || this.$refs.submitTemplate;
			this.position.move = true;
			this.position.x = e.clientX;
			this.position.y = e.clientY;
			this.position.left = ele.offsetLeft;
			this.position.top = ele.offsetTop;
			this.position.ele = ele;
			window.addEventListener('mousemove', this.handleMove)
			window.addEventListener('mouseup', this.handleUp)
		},
		handleMove(e) {
			if (!this.position.move) return;
			let _x = e.clientX - this.position.x,
				_y = e.clientY - this.position.y;
			this.position.ele.style.left = this.position.left + _x + 'px';
			this.position.ele.style.top = this.position.top + _y + 'px';
		},
		handleUp() {
			this.position.move = false
			window.removeEventListener('mousemove', this.handleMove)
			window.removeEventListener('mouseup', this.handleUp)
		},
		
		delKeywords(i) { // 删除关键词
			this.templateData.Keywords.splice(i, 1)
		},
		addKeywords() { // 添加关键词
			let keyword = this.$refs.keyInput.value;
			if (keyword) {
				let arr = keyword.split(' ')
				arr.forEach(key => {
					key && this.templateData.Keywords.push(key)
				})
			}
			this.$refs.keyInput.value = ''
		},
		uploadFacePicture() { // 上传封面
			let input = document.createElement('input');
			input.accept= 'image/*';
			input.type = 'file';
			input.click();
			input.onchange = () => {
				let file = input.files[0], 
					formData = new FormData();
				formData.append('file', file);
				let timer = setInterval(()=> {
					this.uploadProgress++;
					if (this.uploadProgress == 95) {
						clearInterval(timer)
					}
				}, 100)
				this.$axios.post(this.$store.state.port.netServer + '/UploadToOSS', formData)
				.then(({data}) => {
					input = null;
					if (data.status == 'ok') {
						clearInterval(timer)
						this.templateData.FacePicture = data.key;
					}
				})
				.catch(err => {
					this.uploadProgress = 0;
					clearInterval(timer);
					this.handleprompt('服务器出错, 请稍后再试')
				})
			}
		},
		handleprompt(message, type) { // 提示
			this.$message.closeAll();
			this.$message({message, type, customClass: 'info'});
		},
		submitTemplate() { // 提交修改的模板信息
			// console.log(this.templateData)
			if (!this.isSubmit) return this.handleprompt("正在处理,请稍后再试", 'warning');
			if (!this.templateData.TemplateName) return this.handleprompt('没有模板名称', 'warning');
			if (this.FilterVaules.join(',') == '') return this.handleprompt('没有选择分类信息', 'warning');
			if (!this.templateData.FacePicture) return this.handleprompt('没有上传封面', 'warning');
			let arr = ['ID', 'StrThematic', 'Keywords', 'Content', 'TemplateName', 'FacePicture', 'TemplateNumber'],
				formData = new FormData();
			formData.append('FilterVaules', this.FilterVaules.join(','))
			for(let key in arr) {
				if (key == 'Keywords') {
					formData.append(arr[key], this.templateData[arr[key]].join(','))
				} else {
					formData.append(arr[key], this.templateData[arr[key]])
				}
			}
			this.isSubmit = false;
			this.$axios.put(this.$store.state.port.netServer + '/DesignerSubmitTemplate', formData)
			.then(({data}) => {
				this.isSubmit = true;
				this.position.show = false;
				if (data == 'Success') this.handleprompt('修改成功', 'success');
			})
			.catch(err => {
				this.isSubmit = true; 
				this.position.show = false;
				this.handleprompt('服务器出错, 请稍后再试')
			})
		},
		getValue(data) {
			let arr = [];
			if (data) {
				data.forEach(item => {
					arr.push(item.FilterValue)
				})
				return arr.join(',');
			}
			return '';
		},
		parsing(data) { // 解析
			let arr = [], filterVlaue = data.SubTemplate.FilterValues && data.SubTemplate.FilterValues.split(',') || [];
			data.StrFilters.forEach(item => {
				item.FilterValues.forEach((filter, j) => {
					if (filterVlaue.indexOf(String(filter.ValueId)) > -1) {
						filter.isSelected = true;
					} else {
						filter.isSelected = false;
					}
				})
				arr.push(item)
			})
			// console.log(arr)
			return arr;
		},
		reparsing(data) { // 泛解析
			let arr = [];
			data.forEach((item, i) => {
				this.FilterVaules.push([])
				item.FilterValues.forEach(filter => {
					// console.log(filter)
					if (filter.isSelected) {
						arr.push(filter.ValueId)
						this.FilterVaules[i].push(filter.ValueId)
					}
				})
			})
			// console.log(this.FilterVaules)
			return arr
		},
	},
	mounted() {
		let data;
		try {
			data = JSON.parse(JSON.stringify(this.templateInfo));
		} catch (error) {
			data = ''
		}
		console.log(data,data.SubTemplate)
		if (!data) return;
		if(!data.SubTemplate) {
			this.isSubmitState = false;
		}
		if (data.IsPublic || !data.SubTemplate) {
			data.SubTemplate = {FilterValues: this.getValue(data.TempBind)}
			this.templateData.ID = '';
			this.templateData.TemplateName = data.Name;
			this.templateData.TemplateNumber = data.TemplateNumber;
			this.templateData.FacePicture = data.FacePicture || data.TemplatePages[0].Thumb;
			this.templateData.StrThematic = data.StrThematic || '';
			this.templateData.Content = data.Content || '';
			this.templateData.Keywords = data.Keywords && data.Keywords.split(',') || [];
			this.templateData.filters = this.parsing(data);
			this.templateData.FilterVaules = this.reparsing(this.templateData.filters);
		} else {
			this.templateData.ID = data.SubTemplate.ID;
			this.templateData.TemplateName = data.SubTemplate.TemplateName;
			this.templateData.TemplateNumber = data.SubTemplate.TemplateNum;
			this.templateData.FacePicture = data.SubTemplate.FacePicture;
			this.templateData.StrThematic = data.SubTemplate.StrThematic;
			this.templateData.Content = data.SubTemplate.Contents;
			this.templateData.Keywords = data.SubTemplate.Keywords.split(',');
			this.templateData.filters = this.parsing(data);
			this.templateData.FilterVaules = this.reparsing(this.templateData.filters);
		}
		
		
		// console.log(this.FilterVaules)
		
	},
	watch: {
		bonusPoint(num) { // 监控积分
			if (num < 0) {
				this.bonusPoint = 0
			}
		},
		PageData: {
			deep: true,
			handler(val, oldval) {
				// console.log(val, oldval)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.temp-list {
	tr {
		td:first-child {
			text-align: right;
			padding: 5px 0 5px 5px;
			width: 80px;
		}
		td:last-child {
			padding: 5px 5px 5px 0;
			color:rgb(144, 147, 153);
		}
	}
}
.temp-list-item {
    display: flex;
	flex-wrap: wrap;
}

.put-template {
	position: fixed;
	left: 400px;
	top: 100px;
	width: 650px;
	overflow: hidden;
	border: 1px solid #ccc;
	background: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	border-radius: 10px;
	z-index: 2019;
}

.template-content {
	display: flex;
	.info {
		flex: 1;
		.info-item {
			display: flex;
			align-items: center;
			width: 430px;
			padding: 10px;
			.item-title {
				width: 90px;
				font-size: 16px;
				text-align: right;
				margin-right: 20px;
			}
			.item-right {
				width: 73%;
			}
			
		}
	}
	.cover {
		flex: 1;
		text-align: center;
		padding: 10px;
	}
	.lable-content {
		display: flex;
		flex-wrap: wrap;
		padding: 10px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		.lable-item {
			display: inline-block;
			padding: 5px;
			margin: 5px 5px 5px 0;
			background-color: #f0f2f5;
			color: #909399;
			border: 1px solid #dcdfe6;
			border-radius: 4px;
			.label-close {
				position: relative;
				display: inline-block;
				width: 12px;
				height: 12px;
				border-radius: 50%;
				background-color: #c0c4cc;
				overflow: hidden;
				transform: rotate(45deg);
				cursor: pointer;
				margin-left: 5px;
				&:hover {
					background-color: #909399;
				}
				&::before,
				&::after {
					content: "";
					position: absolute;
					left: 2px;
					top: 5px;
					width: 8px;
					height: 1px;
					border-radius: 1px;
					background: #fff;
				}
				&::after {
					transform: rotate(90deg);
				}
			}
		}
	}
	.lable-input {
		width: 100px;
		height: 28px;
		margin: 5px 5px 5px 0;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
	}
}
.template-bottom {
	padding: 30px;
}
.upload-progress {
	width: 100%;
	height: 26px;
	background: $color;
	border-radius: 4px;
}
.submit-btn {
		margin: auto;
		width: 200px;
		background: $color;
		color: #fff;
		padding: 10px;
		border-radius: 5px;
		text-align: center;
		cursor: pointer;
		&:active {
			opacity: .8;
		}
	}
.img-preivew {
	position: fixed;
	z-index: 2019;
	padding: 20px;
	left: 60px;
	top: 50px;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, .3);
	overflow: auto;
	img {
		display: block;
		margin:auto;
		max-width: 100%;
	}
}
.animation-img {
	background: none;
	
}
.animation-img::-webkit-scrollbar {
	display: none;
}
</style>

