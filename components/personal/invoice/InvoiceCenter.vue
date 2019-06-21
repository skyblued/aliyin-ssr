<template>
    <div class="invoice-center">
        <InvoiceList v-if="sideTitle == 'InvoiceList'" @setInvoice="setInvoice"></InvoiceList>
        <ApplyInvoice v-if="sideTitle == 'ApplyInvoice'" @setInvoice="setInvoice"></ApplyInvoice>
        <InvoiceDetail v-if="sideTitle == 'InvoiceDetail'" @setInvoice="setInvoice" :requestId="requestId"></InvoiceDetail>
    </div>
</template>

<script>
import InvoiceList from '@/components/personal/invoice/InvoiceList.vue'
import ApplyInvoice from '@/components/personal/invoice/ApplyInvoice.vue'
import InvoiceDetail from '@/components/personal/invoice/InvoiceDetail.vue'
export default {
    data () {
        return {
            sideTitle: 'InvoiceList',
            requestId: ''
        }
    },
    methods: {
        setInvoice(info) {
            this.sideTitle = info.msg
            this.requestId = info.id
        }
    },
    components: {
        InvoiceList,
        ApplyInvoice,
        InvoiceDetail
    }
}
</script>

<style lang="scss" scoped>

</style>
