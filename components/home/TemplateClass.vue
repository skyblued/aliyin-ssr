<template>

    <div class="template-class">
        <div :class="{'class-item': true, 'active': activeIndex == i ? true : false}" v-for="(items,i) in barList" :key="i" @mouseenter="handleOver(i)" @mouseleave="handleOut">
            <div class="class-item-block">
                <div class="class-item-img">
                    <img :src="$store.state.port.imgBaseUrl + items.Icon" alt="">
                </div>
                <div class="class-item-label">
                    <p>{{items.ClassName}}</p>
                    <p>
                        <span v-for="(item,index) in barList[i].ProductTypeList.slice(0, 2)" :key="index">{{item.TypeName}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="class-level-item" v-if="isShow" @mouseleave="handleOut" @mouseenter="enter">
            <div class="class-level-item-label">
                <div class="level-tips">
					<nuxt-link v-for="(tmp,id) in SecondList" :key="id"
						:to="`/templateList/templateCenter?id=${tmp.TypeId}&n=${tmp.FromClass}&title=${ClassName}&subtitle=${tmp.TypeName}`"
					>
						<div class="level-tips-item" >
							<div class="tips-icon-wrap">
								<div class="tips-icon" :style="{'background-image': `url(${$store.state.port.imgBaseUrl + tmp.Icon})`}"></div>
							</div>
							<span>{{tmp.TypeName}}</span>
						</div>
					</nuxt-link>
                </div>
            </div>
        </div>
    </div>
	
</template>

<script>
export default {
	props: {
		barList: {}
	},
    data () {
        return {
            // barList: [],
            isShow: '',
            SecondList: [],
            ClassName: '',
            activeIndex: null,
        }
    },
    methods: {
        getData() {
            this.$axios.get(this.$store.state.port.AllTemplate).then((res) => {
                //console.log(res.data)
                this.barList = res.data
            })
        },
        handleOver(i) {
            this.isShow = 'ok'
            this.ClassName = this.barList[i].ClassName
            this.SecondList = this.barList[i].ProductTypeList
            this.activeIndex = i
        },
        handleOut() {
            this.isShow = ''
            this.activeIndex = null
        },
        enter() {
            this.isShow = 'ok'
        },
	}
}
</script>

<style lang="scss" scoped>
.template-class{
    position: relative;
    z-index: 100;
    width:255px;
    height:375px;
    background:rgba(255,255,255,1);
    box-shadow:-2px 1px 27px 2px rgba(203,211,217,0.4);
    border-radius: 10px;
    user-select: none; 
    .active{
        box-shadow: 0px 0px 27px 2px rgba(203,211,217,.7);
    }
}
.template-class .class-item{
    width: 100%;
    padding: 16px 0 19px 20px;
    cursor: pointer;
}
.template-class .class-item .class-item-block{
    height: 59px;
    display: flex;
    align-items: center;
}
.template-class .class-item .class-item-img{
    height: 100%;
    vertical-align: middle;
    margin-right: 10px;
    img{
        width: 59px;
        height: 100%;
    }
}
.template-class .class-item .class-item-label{
    margin: 5px 0;
}
.template-class .class-item .class-item-label p{
    font-family:MicrosoftYaHei;
    font-weight:400;
}
.template-class .class-item .class-item-label p:first-child{
    line-height: 15px;
    font-size:16px;  
    color:rgba(51,51,51,1);
    margin-bottom: 10px;
}
.template-class .class-item .class-item-label p:last-child{
    height:12px;
    line-height: 12px;
    font-size:12px;
    color:rgba(153,153,153,1);  
    display: flex;
    span{
        margin: 0 2px;
    }
}
.template-class .class-level-item{
    width:946px;
    min-height: 376px;
    background:rgba(255,255,255,1);
    box-shadow:2px 1px 27px 10px rgba(203,211,217,0.4);
    position: absolute;
    top: 0;
    left: 255px;
    border-radius: 10px;
}
.template-class .class-level-item .class-level-item-label{
    width: 100%;
    height: 100%;
    padding: 60px 0 0 30px;
}
.template-class .class-level-item .class-level-item-label:last-child{
    margin-bottom: 0;
}
.template-class .class-level-item .class-level-item-label .level-title{
    height:15px;
    line-height: 15px;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin-bottom: 20px;
}
.template-class .class-level-item .class-level-item-label .level-tips{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    .level-tips-item{
        text-align: center;
        height: 100px;
        margin-bottom: 30px;
		cursor: pointer;
		color: rgba(153,153,153,1);
        .tips-icon-wrap{
            display: inline-block;
            width:68px;
            height:68px;
            background:rgba(91,158,240,.1);
            border-radius:10px;
            .tips-icon{
                display: inline-block;
                width: 100%;
                height: 100%;
                background-size: contain;
                background-position: 50%;
                background-repeat: no-repeat;
            }
        }
        span{
            display: block;
            height: 12px;
            width: 109px;
            line-height: 12px;
            margin-top: 16px;
        }
        &:hover span{
            color: #745bff;
        }
    }
}
</style>
