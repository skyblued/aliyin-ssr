<template>
    <div>
        <Carousel></Carousel>
        <Steps></Steps>
        <!-- <hot-subject></hot-subject> -->
        <temp-commend></temp-commend>
        <senior></senior>
    </div>
</template>

<script>
import Carousel from '@/components/Carousel.vue'
import Steps from '@/components/home/Steps.vue'
// import HotSubject from '@/components/home/HotSubject.vue'
import TempCommend from '@/components/home/TempCommend.vue'
import Senior from '@/components/home/Senior.vue'
export default {
    components: {
        
        Carousel,
        Steps,
        // HotSubject,
        TempCommend,
        Senior,
    }
}
</script>

<style>

</style>
