<template>
    <FCard class="vaultbox">
        <h3 class="vaultbox_title">{{ title }}</h3>
        <p class="vaultbox_amount">
            <span class="number">{{ cAmount }}</span>
            <!-- <span class="vaultbox_amount_currency">{{ symbol }}</span> -->
        </p>
        <p class="vaultbox_amount_usd number" data-testid="amount_usd">
            <FTMTokenValue
                :value="cAmountUSD"
                with-price-currency
                no-currency
                :decimals="18"
            />
        </p>
    </FCard>
</template>

<script>
import { formatNumberByLocale } from "@/filters.js";
import { bFromWei } from "@/utils/big-number.js";
import FTMTokenValue from "@/components/core/FTMTokenValue/FTMTokenValue.vue";
import FCard from "@/components/core/FCard/FCard.vue";
import { mapGetters } from "vuex";

export default {
    name: "FTMVaultBox",
    components: { FCard, FTMTokenValue },

    props: {
        /** FTM amount, 18 decimals, hex number. */
        amount: {
            type: String,
            default: "0x0"
        },
        ftmPrice: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: ""
        }
    },

    computed: {
        ...mapGetters(["symbol"]),
        cAmount() {
            return formatNumberByLocale(bFromWei(this.amount).toNumber(), 4);
        },

        cAmountUSD() {
            return bFromWei(this.amount)
                .multipliedBy(this.ftmPrice)
                .toNumber();
        }
    }
};
</script>

<style lang="scss">
.vaultbox {
    --vaultbox-font-size: 20px;
    --vaultbox-font-size-xl: 44px;
    --vaultbox-background-color: #f9f9f9;

    font-family: $font-family;
    text-align: center;
    //padding: var(--f-spacer-5) var(--f-spacer-7) var(--f-spacer-7) var(--f-spacer-7);
    display: flex;
    flex-direction: column;
    gap: 33px;
    padding: 0;

    &.f-card {
        box-shadow: none;
        background: var(--vaultbox-background-color);
    }

    h3 {
        font-size: var(--vaultbox-font-size);
        font-family: $font-family;
        margin: 0;
        text-align: center;
    }

    &_amount {
        font-weight: 400;
        font-family: $font-family;
        font-size: var(--vaultbox-font-size-xl);
        //padding: 54px 0 var(--f-spacer-5) 0;
        padding: 0;

        &_currency {
            display: none;
            font-weight: normal;
            font-size: 0.5em;
        }

        &_usd {
            font-size: var(--vaultbox-font-size);
        }
    }
}

:root.dark-theme {
    .vaultbox {
        font-family: $font-family;
        --vaultbox-background-color: var(--f-darker-color);
    }
}
</style>
