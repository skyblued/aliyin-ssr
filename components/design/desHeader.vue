<template>
    <div class="des-header">
        <div class="des-header-left">
            <div class="logo">
				<nuxt-link to="/"><img src="/img/logo.svg" alt="logo"></nuxt-link>
			</div>
            <div class="set">
				<span :class="setundo.un == 0 ? 'undo' : ''" @click="undo('undo')">撤销</span>
				<span :class="setundo.re == 0 ? 'redo' : ''" @click="undo('redo')">恢复</span>
            </div>
        </div>
        <div class="des-header-right" 

		>
			<div class="des-header-right-btn" 
				v-if="previewbtn.btnSee"
				@click="preview">
				<span class="right-btn-icon share-icon"></span>
				<span>预览</span>
			</div>
			<div class="des-header-right-btn" 
				:style="`opacity: ${isSave? '.3': '1'}`"
				@click="!isSave && download('down')">
				<span class="right-btn-icon download-icon"></span>
				<span>下载</span>
			</div>
			<div
				v-if="headerParams && headerParams.OnlinePrint_Status" 
				class="des-header-right-btn" 
				:style="`opacity: ${isSave? '.3': '1'}`"
				@click="!isSave && download('print')">
				<span class="right-btn-icon print-icon"></span>
				<span>印刷</span>
			</div>
			<!-- v-if="superAdmin"  -->
			<div class="des-header-right-btn">
				<span @click="handleSave" class="right-save">保存</span>
				<span v-if="headerParams.identity && !superAdmin" @click="toggleDialog(true)" class="right-save">提交</span>
				<span 
					@click="againFile"
					v-if="false"
					class="right-save" 
				>生成文件</span>
			</div>
        </div>
		<transition name="el-fade-in-linear">
			<div class="model-mask" v-if="dialogShow" ></div>
		</transition>
		<transition name="animation-scale">
			<div v-if="dialogShow" class="model-dialog">
				 <div style="background: #fff;min-width: 850px;border-radius: 10px;    padding: 10px;position: relative">
				<div class="close-btn" style="top:0;right: -55px;" @click="dialogShow = false"></div>
					 <TempSubmit 
					:faceImg="getFaceImg"
					@toggleDialog="toggleDialog" 
					:ProductTypeId="headerParams.productId" 
					:TemplateNumber="headerParams.tempNum" 
					:tempName="headerParams.design_title"></TempSubmit>
				 </div>
			</div>
		</transition>
		
    </div>
</template>
<script>
import TempSubmit from '@/components/designer/TempSubmit.vue'
export default {
	components: {
		TempSubmit
	},
	props: ['setundo', 'headerParams', 'isSave', 'previewbtn', 'faceImg'],
    data() {
		let params = this.$route.params,
			query = window.atob(params.t),
			queryArr = query.split('&'),
			queryNumber = queryArr[0].split('='),
			superAdmin = queryArr[1] == 'admin=admin' ? 'admin' : null;
        return {
			superAdmin,
			val: '',
			dialogShow: false, // 提交弹出框
			isSaveOk: false,
			thumb:''
        }
	},
	methods: {
		// 撤销操作
		undo (msg) {
			this.$emit('clear',msg)
		},
		// 保存模板
		handleSave () {
			this.$message.closeAll();
			this.$message({type: 'warning', message: '保存中', customClass: 'info',duration: 0})
			this.$emit('handleSave', true)
		},
		download (type) { // 下载和印刷
			this.$emit('setDownAndPrint', type);
		},
		preview () { // 预览
			this.$emit('setPreview', true)
		},
		toggleDialog(type) { // 关闭提交组件
			this.dialogShow = type
			if (this.dialogShow) {
				window.addEventListener('keydown', this.keydown)
			} else {
				window.removeEventListener('keydown', this.keydown)
			}
		},
		againFile() { // 重新生成PDF文件
			this.$emit('againFile')
		},
		keydown(e) {
			if (e.ctrlKey) this.$emit('clearClone')
		}
	},
	mounted() {
		// console.log(this.headerParams)
	},
	computed: {
		getFaceImg() {
			return this.faceImg.replace(/(http|https):\/\/img.aliyin.com\//, '')
		}
	}
}
</script>
<style lang="scss" scoped>
// 
body{
	min-width: 1120px;
}

.des-header{
	position: relative;
    background: $white;
    color: #000;
    justify-content: space-between;
    width: 100%;
    height: 50px;
	line-height: 50px; 
	border-bottom: 1px solid #EAECEE;
	overflow: hidden;
}

.des-header-left{
	float: left;
	width: 60%;
	height: 100%;
	.logo, .set{
		float: left;
		height: 100%;
		.router-link-active {
			display: block;
			height: 100%;
			padding: 5px 10px;
		}
		img {
			height: 40px;
		}
	}
	.set{
		margin-left: 90px;
		font-size: 14px;
		span {
			display: inline-block;
			padding: 0 10px 0 30px;
			cursor: pointer;
		}
		
		span:first-child{
			background: url(/img/desicon/redo_icon.png) no-repeat 0 50%;
		}
		span:last-child{
			background: url(/img/desicon/undo_icon.png) no-repeat 0 50%;
		}
		span.undo {
			color: #000;
			cursor: default;
			background: url(/img/desicon/redo_n_icon.png) no-repeat 0 50%;
		}
		span.redo {
			color: #000;
			cursor: default;
			background: url(/img/desicon/undo_n_icon.png) no-repeat 0 50%;
		}
	}
	.set span:hover{
		background-color: rgba(0,0,0,.2);
	}
}

.des-header-right{
	float: right;
	height: 100%;
	font-size: 14px;
	padding-right: 18px;
	.des-header-right-btn:not(:last-child){
		float: left;
		padding: 0 12px;
		cursor: pointer;
		line-height: 50px;
		&:hover {
			background-color: rgba(0,0,0,.2);
		}
		.right-btn-icon{
			width: 20px;
			height: 18px;
			background-repeat: no-repeat;
			vertical-align: middle;
			display: inline-block;
			margin-right: 3px;
		}
		.download-icon{
			background: url(/img/desicon/header/download_icon.png) no-repeat 50%;
		}
		.print-icon{
			background: url(/img/desicon/header/print_icon.png) no-repeat 50%;
		}
		.share-icon{
			background: url(/img/desicon/header/preview_icon.png) no-repeat 50%;
		}
	}
	.des-header-right-btn:last-child {
		float: left;
		line-height: 50px;
		padding-left: 12px;
		.right-save{
			padding: 2px 14px;
			border-radius: 12px;
			background: $gradient;
			margin-right: 10px;
			color: #fff;
			cursor: pointer;
			&:hover {
				opacity: .8;
			}
		}
	}
}


</style>
