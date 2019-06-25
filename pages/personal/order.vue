<template>
    <div class="order-center">
        <PrintOrder v-if="sideTitle == 'PrintOrder'" @setOrder="setOrder"></PrintOrder>
        <OrderDetail v-if="sideTitle == 'OrderDetail'" @setOrder="setOrder" :id="id"></OrderDetail>
    </div>
</template>

<script>
import PrintOrder from '@/components/personal/order/PrintOrder.vue'
import OrderDetail from '@/components/personal/order/OrderDetail.vue'
export default {
    data() {
        return {
            sideTitle: 'PrintOrder',
            id: ''
        }
    },
    methods: {
        setOrder(val) {
            this.sideTitle = val.msg
            this.id = val.id
        }
    },
    components: {
        PrintOrder,
        OrderDetail
    }
}
</script>

<style lang="scss" scoped>

</style>
