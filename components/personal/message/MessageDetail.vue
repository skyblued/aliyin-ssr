<template>
    <div class="message-detail">
        <div class="title">【更新】阿里印2.9.6版本更新：更方便的筛选，更快的播放</div>
        <p class="time">2019-1-12 12:20</p>
        <div class="content">
            <p>阿里印消息服务（Message Service，原 MQS）是阿里云商用的消息中间件服务。与传统的消息中间件不同，消息服务一开始就是基于阿里印自主研发的飞天分布式系统来设计和实现，具有大规模，高可靠、高并发访问和超强消息堆积能力的特点。消息服务API采用HTTP RESTful标准，接入方便，跨网络能力强。</p>
            <p>已全面接入资源访问控制服务（RAM）、专有网络（VPC），支持各种安全访问控制；接入云监控，提供完善的监控及报警机制。消息服务提供丰富的SDK、解决方案、最佳实践和7x24小时的技术支持，帮助应用开发者在应用组件之间自由地传递数据和构建松耦合、分布式、高可用系统。</p>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
.message-detail{
    width: 880px;
    text-align: left;
    margin-top: 29px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    .title{
        font-size:24px;
        color:rgba(51,51,51,1);
        margin-bottom: 20px;
    }
    .time{
        font-size:16px;
        color:rgba(153,153,153,1);
    }
    .content p{
        margin-top: 39px;
        font-size:16px;
        color:rgba(51,51,51,1);
        line-height:30px;
    }
}
</style>
