<template>
	<div id="download-wait" :style="`width: ${width}`">
		<div class="download-wait-title" style="padding:10px 0;">AI小印智能生成中</div>
		<div class="download-onload">
			<div class="progress-bar-container">
				<div class="progress-bar">
					<div class="progress" :style="`width: ${progressWidth}%;`"></div>
				</div> 
				<span class="progress-text">{{`${progressWidth}%`}}</span>
			</div>
		</div> 
		
		<!-- <div class="download-wait-text">PS：加入VIP可以优先生成哦~</div> -->
	</div>
</template>

<script>
export default {
	name: 'downloadWait',
	props: {
		width: {
			type: String,
			default: '370px'
		}
	},
	data() {
		return {
			progressWidth: 0,
			timer: null,
		}
	},
	methods: {
		setProgress(step, time) { // 进度条控制
			clearInterval(this.timer);
			this.timer = setInterval(() => {
				this.progressWidth = Number(this.progressWidth) + step
				this.progressWidth = this.progressWidth.toFixed(2)
			}, time)
		}
	},
	mounted() {
		this.setProgress(0.45, 100);
	},
	watch: {
		progressWidth(val) {
			if (val < 50) {
				this.setProgress(0.45, 100);
			} else if (val < 90) {
				this.setProgress(0.45, 300);
			} else if (val < 98) {
				this.setProgress(0.12, 1000);
			} else if (val < 99.3) {
				this.setProgress(0.01, 2000);
			} else if (val < 99.90) {
				clearInterval(this.timer)
			}
		}
	},
	destroyed() {
		clearInterval(this.timer)
	}
}
</script>

<style lang="scss" scoped>
#download-wait {
    width: 370px;
	height: 134px;
    background: #fff;
    margin: 0 auto;
    padding: 34px 0 32px;
    text-align: center;
	border-radius: 10px;
}
.download-onload {
    display: flex;
	padding: 0 10%;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    margin-bottom: 16px;
}
.progress-bar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    width: 100%;
}
.progress-bar {
    position: relative;
    display: inline-block;
    width: 85%;
    height: 10px;
    background-color: #c5eafe;
    overflow: hidden;
    border-radius: 5px;
	.progress {
		height: 100%;
		border-radius: 5px;
		background-color: $color;
		transition: width ease .4s;
	}
}
.progress-text {
    color: $color;
    font-size: 12px;
}
.download-wait-title {
    font-size: 16px;
    line-height: 18px;
    text-align: center;
    color: #3E414B;
}
.download-wait-text {
    font-size: 16px;
    line-height: 18px;
    color: #3E414B;
}
</style>

