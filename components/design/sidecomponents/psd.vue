<template>
	<div id="psd" style="height: 100%">
		<div>
			<h1>文件上传</h1>
			<button @click="handleupload">上传psd文件</button>
			<p style="font-size: 12px; color: #ccc;">限制17MB</p>
			<input ref="input" type="file" @change="uploadFile" style="opacity: 0">
			<DownloadWait :width="300" v-if="uploadSuccess"></DownloadWait>
			<div style="margin-top: 30px; " v-if="false">
				<button style="font-size: 16px" @click="uploadPsd">测试按钮</button>
				<!-- <span style="font-size: 12px; color: #ccc;">只支持psd格式</span> -->
				<input ref="input2" @change="inputpsd" multiple type="file" style="opacity: 0">
			</div>
		</div>

		<div style="margin: 20px 0;">
			<el-button type="primary" plain @click="assigned">指派用户</el-button>
		</div>


		<div style="position:relative;height: 92%; overflow-y: auto;">
			<span>刀版上传: 
			<input style="margin-left: 20px;width: 200px;" 
			type="file" 
			accept="image/svg+xml"
			@change="uploadMasking"></span>
			<div>刀版列表</div>
			<div class="masking-list">
				<div class="masking-item"
					v-for="(item,i) in Markings" :key="i"
				>
					<img 
						@click="setMasking(item)"
						@load="getMarking(item)"
						:src="$store.state.ossPath + item.MarkingPath" alt="">
					<span 
						v-if="!item.IsSystem"
						@click.stop="delMasking(item, i)"
					class="del-icon"></span>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
import DownloadWait from '@/components/design/downloadWait.vue'
export default {
	components: {
		DownloadWait
	},
	props: {
		zoom: {
			type: Number,
			default: 1
		},
		templateInfo: {
			type: Object
		}
	},
	data() {
		return {
			uploadSuccess: false, // 是否成功上传获取
			Markings: [], // 刀版列表
		}
	},
	methods: {
		handleupload() {
			this.$refs.input.click();
		},
		uploadFile(e) {
			let file = e.target.files[0], size = 0;
			size = file.size / 1024 / 1024;
			if (size > 17) {
				this.$message('上传文件大于17MB')
				return
			}
			let formdata = new FormData();
			formdata.append('psd', file);
			this.uploadSuccess = true;
			// this.$store.state.nodeUrl 'http://localhost:5050'

			this.$axios.post('http://service.aliyin.com' + '/psd', formdata, {timeout: 1000 * 60})
			.then(({data}) => {
				this.uploadSuccess = false;
				e.target.value = ''
				this.$emit('uploadpsd', data)
			})
			.catch(err => {
				e.target.value = ''
				console.log(err)
				this.uploadSuccess = false;
				this.$message('服务器繁忙, 请稍后再试...')
			})
		},
		uploadPsd() { // 点击上传
			this.$refs.input2.click();
		},
		inputpsd(e) { //上传psd
			let files = e.target.files, state = true ;
			
			let formdata = new FormData();
			formdata.append('zoom', 1);
			Array.from(files).map(item => {
				let type = item.name.slice((item.name.lastIndexOf('.')+1)).toLocaleLowerCase();
				// if (type != 'psd') {
				// 	return state = false;
				// } else {
					formdata.append('files', item)
				// }
			})
			if (!state) {
				formdata = null;
				files = null;
				return this.$message.warning('只支持psd格式')
			}
			this.$axios.post('http://localhost:5050' + '/psd/upload', formdata, {timeout: 1000 * 60 * 2})
			.then(({data}) => {
				// console.log(data);
				e.target.value = '';
			})
			.catch(err => e.target.value = '')
		},
		getMarkings() { // 获取刀版列表
			this.$axios.get('/Markings?SizeID=' + this.templateInfo.SizeId)
			.then(({data}) => {
				// console.log(data)
				this.Markings = data
			})
		},
		getMarking(item) { // 获取蒙版里面svg的内容
			fetch(this.$store.state.ossPath + item.MarkingPath).then(response => response.text())
			.then(data => {
				item.MaskingContent = data;
			})
		},
		uploadMasking(e) { // 刀版上传
			let file = e.target.files[0],
				formdata = new FormData();
			formdata.append('SizeID', this.templateInfo.SizeId);
			formdata.append('masking', file);
			this.$axios.post('/Marking', formdata)
			.then(({data}) => {
				if (data.status == 'success') {
					fetch(data.svgurl).then(response => response.text())
					.then(content => {
						this.$message.closeAll();
						this.$message('上传成功');
						let obj = {
							MarkingPath: data.markingpath,
							MaskingContent: content,
							ID: data.markingid,
							SizeID: this.templateInfo.SizeId
						}
						this.Markings.unshift(obj);
					})
				}
				e.target.value = ''
			})
			.catch(err => {
				this.$message.closeAll();
				this.$message('服务器出错');
				e.target.value = ''
			})
		},
		setMasking(item) { // 修改当前画布刀版
			this.$emit('setMasking', item.MaskingContent)
		},
		delMasking(item, i) { // 删除蒙版
			let formdata = new FormData();
			formdata.append('ID', item.ID);
			this.$axios.delete('/Marking',{data:formdata})
			.then(({data}) => {
				if (data) {
					this.Markings.splice(i, 1)
				}
			})
		},
		handleMessage(message, type) {
			this.$message.closeAll();
			this.$message({type,message,customClass: 'info'});
		},
		assigned() { // 指派给用户
			this.$prompt('请输入用户名', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				closeOnClickModal: false
			})
			.then(({ value }) => {
				if (!value) return this.handleMessage('没有指定用户名', 'waring');
				let formdata = new FormData();
				formdata.append('templatenum', this.templateInfo.TemplateNumber)
				formdata.append('username ', value)
				console.log(this.templateInfo.TemplateNumber, value)
				this.$axios.post('/UsersMasters', formdata)
				.then(({data}) => {
					if (data.state = "success") {
						this.handleMessage('指定的用户名是: ' + value, 'success')
					} 
				}).catch(err => {
					this.handleMessage('服务器出错!!!', 'error')
				})
				
			}).catch(err => {})
    	}
	},
	mounted() {
		this.getMarkings();
		// var CancelToken = this.$axios.CancelToken;
		// var source = CancelToken.source();
		// console.log(CancelToken, source)
		// this.$axios.get('http://localhost:5050/test', { cancelToken: source.token
		// }).catch(function(thrown) { if (this.$axios.isCancel(thrown)) { console.log('Request canceled', thrown.message);
		// } else { // 处理错误
		// }
		// });// 取消请求（message 参数是可选的）
		// setTimeout(() =>{
		// 	source.cancel('Operation canceled by the user.')

		// }, 3000)

	},
	watch: {
		zoom: {
			deep: true,
			handler(val, oldval){
				console.log(val, oldval)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.masking-list {
	position: absolute;
	display: flex;
    flex-wrap: wrap;
 }
.masking-item {
	width: 155px;
	height: 155px;
	margin-right: 7px;
    padding: 10px;
    margin-bottom: 10px;
    background: #f4f4f4;
    cursor: pointer;
    position: relative;
	&:hover .del-icon {
		opacity: 1;
	}
	
	img {
		object-fit: fill;
	}
}
.masking-item:nth-child(2n) {
	margin-right: 0;
}
.del-icon {
	opacity: 0;
    position: absolute;
    right: 5px;
    top: 5px;
    width: 25px;
    height: 25px;
    border-radius: 5px;
    background-repeat: no-repeat;
    background-color: white;
    background-size: 100%;
    background-image: url(/img/desicon/delete_small_icon.png);
    z-index: 2;
    cursor: pointer;
	transition: opacity .2s;
	&:hover {
		background-image: url(/img/desicon/delete_small_blue_icon.png);
	}
}
</style>

