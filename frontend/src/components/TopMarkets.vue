<template>
    <div class="market">
        <a class="market_block market_block__buy" href="https://app.uniswap.org/swap?chain=arbitrum&inputCurrency=0x3096e7bfd0878cc65be71f8899bc4cfb57187ba3&outputCurrency=0x82af49447d8a07e3bd95bd0d56f35241523fbab1" target="_blank">
            <RocketSvg />
            <a class="">Buy $RWA</a>
        </a>
        <a
            class="market_block"
            target="_blank"
            href="https://www.gate.io/trade/XRWA_USDT "
        >
            <GateioSvg />
            <p class="desktop">Gate</p>
        </a>
        <a class="market_block" href="https://app.uniswap.org/swap?chain=arbitrum&inputCurrency=0x3096e7bfd0878cc65be71f8899bc4cfb57187ba3&outputCurrency=0x82af49447d8a07e3bd95bd0d56f35241523fbab1" target="_blank">
            <UniswapSvg />
            <p class="desktop">UniSwap</p>
        </a>
        <a
            class="market_block"
            href="https://www.coinex.com/en/exchange/rwa-usdt"
            target="_blank"
        >
            <CoinexSvg />
            <p class="desktop">CoinEx</p>
        </a>
        <a
            class="market_block"
            href="https://www.bitmart.com/trade/en?symbol=RWA_USDT"
            target="_blank"
        >
            <BitmartSvg />
            <p class="desktop">Bitmart</p>
        </a>
    </div>
</template>

<script>
import BitmartSvg from "@/assets/svg/BitmartSvg.vue";
import CoinexSvg from "@/assets/svg/CoinexSvg.vue";
import UniswapSvg from "@/assets/svg/UniswapSvg.vue";
import GateioSvg from "@/assets/svg/GateioSvg.vue";
import RocketSvg from "@/assets/svg/RocketSvg.vue";

export default {
    name: "Markets",

    components: { BitmartSvg, CoinexSvg, UniswapSvg, GateioSvg, RocketSvg },

    props: {},

    data() {}
};
</script>

<style lang="scss">
.market {
    border-radius: 12px;
    background-color: #171a1f;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    padding: 12px;
    color: #fff;

    justify-content: space-around;
    &_block {
        display: flex;
        gap: 4px;
        height: 24px !important;
        align-items: center;
        p {
            height: 24px !important;
        }
        div {
            height: 24px;
        }
        &__buy {
            font-weight: 700;
            a {
                color: #337afe !important;
            }
        }
    }
}

.desktop {
    display: none;
    @media (min-width: 620px) {
        display: flex;
    }
}
.mobile {
    display: flex;
    @media (min-width: 620px) {
        display: none;
    }
}
</style>
