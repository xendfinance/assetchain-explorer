<template>
    <span class="ftmtokenvalue">
        <f-token-value
            :value="cValue"
            :decimals="decimals"
            :number-currency="withPriceCurrency ? 'USD' : undefined"
            :use-placeholder="false"
            no-currency
            v-bind="$attrs"
        />
        <span v-if="!noCurrency"> {{ symbol }}</span>
    </span>
</template>

<script>
import FTokenValue from "@/components/core/FTokenValue/FTokenValue.vue";
import { WEIToFTM } from "@/utils/transactions.js";
import { mapGetters } from "vuex";

export default {
    name: "FTMTokenValue",

    components: { FTokenValue },

    props: {
        value: {
            type: [String, Number],
            default: 0
        },
        decimals: {
            type: Number,
            default: 2
        },
        /** Convert value to FTM */
        convert: {
            type: Boolean,
            default: false
        },
        noCurrency: {
            type: Boolean,
            default: false
        },
        withPriceCurrency: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapGetters(["symbol"]),
        cValue() {
            return this.convert ? WEIToFTM(this.value) : this.value;
        }
    }
};
</script>
