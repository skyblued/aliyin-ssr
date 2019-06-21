<template>
    <div class="des-header">
        <div class="des-header-left">
            <div class="logo">
				<router-link to="/"><img :src="$store.state.port.staticPath + '/img/logo_designer.png'" alt="logo"></router-link>
			</div>
            <div class="set">
				<span :class="setundo.un == 0 ? 'undo' : ''" @click="undo('undo')">撤销</span>
				<span :class="setundo.re == 0 ? 'redo' : ''" @click="undo('redo')">恢复</span>
            </div>
        </div>
        <div class="des-header-right">
			<a href="" type="file"></a>
			<div class="des-header-right-btn" @click="download('down')">
				<span class="right-btn-icon download-icon"></span>
				<span>下载</span>
			</div>
			<div class="des-header-right-btn" @click="download('print')">
				<span class="right-btn-icon print-icon"></span>
				<span>印刷</span>
			</div>
			<div class="des-header-right-btn" @click="preview">
				<span class="right-btn-icon share-icon"></span>
				<span>分享</span>
			</div>
			<div class="des-header-right-btn" @click="handleSave">
				<span class="right-save">保存</span>
			</div>
        </div>
		 
    </div>
</template>
<script>
export default {
	props: ['setundo'],
    data() {
        return {
			val: '',
        }
	},
	methods: {
		// 撤销操作
		undo (msg) {
			this.$emit('clear',msg)
		},
		// 保存模板
		handleSave () {
			this.$emit('handleSave')
		},
		download (type) { // 下载和印刷
			this.$emit('setDownAndPrint', type);
		},
		preview () { // 预览
			this.$emit('setPreview')
		},
	}
}
</script>
<style lang="scss" scoped>
body{
	min-width: 1120px;
}

.des-header{
	position: relative;
    background: #0083E9;
    color: white;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    line-height: 50px; 
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
			color: rgba(255, 255, 255, .3);
			cursor: default;
			background: url(/img/desicon/redo_n_icon.png) no-repeat 0 50%;
		}
		span.redo {
			color: rgba(255, 255, 255, .3);
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
			background: url(/img/desicon/header/share_icon.png) no-repeat 50%;
		}
	}
	.des-header-right-btn:last-child {
		float: left;
		line-height: 50px;
		padding-left: 12px;
		.right-save{
			padding: 2px 14px;
			border-radius: 12px;
			background: rgba(255, 255, 255, 1);
			color: rgba(0, 0, 0, .8);
			cursor: pointer;
			&:hover {
				background: rgba(255, 255, 255, .8);
			}
		}
	}
}


</style>
