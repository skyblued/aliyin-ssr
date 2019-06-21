<template>
    <div id="source-income">
        <div class="source-income">
            <div class="source-title source" style="width: 412px;">
                <p class="titles">
                    <span>你关心的收入来源</span>
                    <span class="titles1">一个作品，N种收入来源</span>
                </p>
            </div>
            <div class="source-image">
                <div class="source-item">
                    <div class="source-block">
                        <img :src="$store.state.port.staticPath + '/img/home/recruit/source_income1.png'" alt="">
                    </div>
                    <p>上传作品审核通过，可获得现金奖励</p>
                </div>
                <div class="source-item">
                    <div class="source-block">
                        <img :src="$store.state.port.staticPath + '/img/home/recruit/source_income2.png'" alt="">
                    </div>
                    <p>作品被下载，可获得下载分成</p>
                </div>
                <div class="source-item">
                    <div class="source-block">
                        <img :src="$store.state.port.staticPath + '/img/home/recruit/source_income3.png'" alt="">
                    </div>
                    <p>作品被印刷，可获得印刷分成</p>
                </div>
                <div class="source-item">
                    <div class="source-block">
                        <img :src="$store.state.port.staticPath + '/img/home/recruit/source_income4.png'" alt="">
                    </div>
                    <p>每周作品达标，可获得周奖励</p>
                </div>
                <div class="source-item">
                    <div class="source-block">
                        <img :src="$store.state.port.staticPath + '/img/home/recruit/source_income5.png'" alt="">
                    </div>
                    <p>每月作品达标，可获得月奖励</p>
                </div>
                <div class="source-item">
                    <div class="source-block">
                        <img :src="$store.state.port.staticPath + '/img/home/recruit/source_income6.png'" alt="">
                    </div>
                    <p>每月完成目标，可以领基本工资</p>
                </div>
            </div>
        </div>
        <div class="source-income">
            <div class="source-title proce" style="width: 418px;">
                <p class="titles">你关心的合作流程</p>
                <p class="titles1">只需要四步就可以完成设计师入驻</p>
            </div>
            <div class="process">
                <div class="process-step step1">
                    <p class="step-title">
                        第 <span>1</span> 步
                    </p>
                    <img src="/img/home/recruit/process1.png" alt="">
                    <p class="step-tips">填写入驻申请</p>
                </div>
                <div class="process-step step2">
                    <p class="step-title">
                        第 <span>2</span> 步
                    </p>
                    <img src="/img/home/recruit/process2.png" alt="">
                    <p class="step-tips">完成资格审查</p>
                </div>
                <div class="process-step step3">
                    <p class="step-title">
                        第 <span>3</span> 步
                    </p>
                    <img src="/img/home/recruit/process3.png" alt="">
                    <p class="step-tips">审核通过上传作品</p>
                </div>
                <div class="process-step step4">
                    <p class="step-title">
                        第 <span>4</span> 步
                    </p>
                    <img src="/img/home/recruit/process4.png" alt="">
                    <p class="step-tips">坐享“睡后”收入</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
#source-income{
    width: 100%;
    .source-income{
        width: 1200px;
        margin: 0 auto 70px;
        text-align: center;
        .source{
            background-image: url(/img/home/recruit/ball_icon2.png);
        }
        .proce{
            background-image: url(/img/home/recruit/ball_icon3.png);
        }
        .source-title{
            height: 145px;
            padding-top: 47px;
            margin: 0 auto;
            color:rgba(18,15,75,1);
            background-repeat: no-repeat;
            .titles{
                font-size: 36px;
                line-height: 36px;
                margin: 0 auto 20px;
                span{
                    display: block;
                }
            }
            .titles1{
                font-size:24px;
                line-height: 24px;
                margin-top: 20px;
            }
        }
        .source-image{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: 70px;
            .source-item{
                text-align: center;
                width: 380px;
                height: 270px;
                font-size: 18px;
                font-family: MicrosoftYaHei;
                font-weight: 400;
                color:rgba(51,51,51,1);
                margin-bottom: 65px;
                .source-block{
                    width: 100%;
                    height: 228px;
                }
            }
        }
        .process{
            display: flex;
            justify-content: space-between;
            margin-top: 82px;
            .process-step{
                width: 278px;
                height: 266px;
                text-align: center;
                border-radius: 10px;
                color:rgba(255,255,255,1);
                .step-title{
                    display: inline-block;
                    font-size: 26px;
                    font-family: MicrosoftYaHei-Bold;
                    font-weight: bold;
                    margin-top: 35px;
                    span{
                        display: inline-block;
                        width: 28px;
                        height: 28px;
                        background:rgba(255,255,255,1);
                        border-radius: 50%;
                        font-size: 18px;
                        font-weight: 400;
                        line-height: 28px;
                    }
                }
                img{
                    display: block;
                    width: 89px;
                    height: 89px;
                    margin: 33px auto 30px;
                }
                .step-tips{
                    font-size:20px;
                }
            }
            .step1{
                background-image: url(/img/home/recruit/recruit_step1.png);
                span{
                    color:rgba(253,114,87,1);
                }
            }
            .step2{
                background-image: url(/img/home/recruit/recruit_step2.png);
                span{
                    color:rgba(129,152,193,1);
                }
            }
            .step3{
                background-image: url(/img/home/recruit/recruit_step3.png);
                span{
                    color:rgba(80,130,253,1);
                }
            }
            .step4{
                background-image: url(/img/home/recruit/recruit_step4.png);
                span{
                    color:rgba(255,143,195,1);
                }
            }
        }
    }
}
</style>
