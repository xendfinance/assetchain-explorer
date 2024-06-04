<template>
    <div class="f-crypto-symbol">
        <div
            v-if="logoUrl || svgIcon || icon"
            class="img"
            :style="{
                width: imgWidth,
                height: imgHeight,
                borderRadius: '24px'
            }"
        >
            <icon v-if="svgIcon" :data="svgIcon" original />
            <img
                v-else-if="logoUrl"
                src="./erc20.png"
                class="not-fluid token-icon"
                :alt="$defi.getTokenSymbol(token)"
            />
            <img v-if="icon" :src="icon" alt="" />
            <!-- <div v-else-if="icon">{{ icon }}</div> -->
            <!-- <img v-else-if="icon" :src="icon" class="not-fluid token-icon" /> -->
        </div>
        <span v-if="!noSymbol">{{ token.symbol ? token.symbol : "" }}</span>
        <!-- {{ icon }} -->
    </div>
</template>

<script>
import ethIcon from "../../../assets/svg/tokens/ethereum.svg";
import btcIcon from "../../../assets/svg/tokens/bitcoin.svg";
import usdcIcon from "../../../assets/svg/tokens/usdc.svg";
import tetherIcon from "../../../assets/svg/tokens/tether.svg";
import vinuIcon from "../../../assets/svg/tokens/vinuchain.svg";
import vinuToken from "../../../assets/svg/tokens/vinuchain-icon.svg";
import xendToken from "../../../assets/svg/tokens/xendchain.svg";

// import chtIcon from "/img/cht.png";
// import ultIcon from "/img/ult.jpg";
// import uogeIcon from "/img/uoge.png";
// import vfiIcon from "/img/vfi.jpg";
// import wvcIcon from "/img/wvc.png";

/**
 * Render crypto logo and name by given token.
 * Requires vue defi plugin ($defi).
 */
export default {
    name: "FCryptoSymbol",

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return null;
            },
            required: true
        },
        imgWidth: {
            type: String,
            default: "32px"
        },
        imgHeight: {
            type: String,
            default: "32px"
        },
        noSymbol: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            // logoUrl:
            //     this.token &&
            //     this.token.logoUrl &&
            //     this.token.logoUrl !==
            //         "https://repository.fantom.network/logos/erc20.svg"
            //         ? this.token.logoUrl
            //         : ""
        };
    },

    computed: {
        logoUrl() {
            return this.token &&
                this.token.logoUrl &&
                this.token.logoUrl !==
                    "https://repository.fantom.network/logos/erc20.svg"
                ? this.token.logoUrl
                : "./erc20.png";
        },
        svgIcon() {
            const { token } = this;

            if (token) {
                switch (token.symbol) {
                    case "VINU":
                        return vinuIcon;
                    case "VC":
                        return vinuToken;
                    case "USDT":
                        return tetherIcon;
                    case "USDC":
                        return usdcIcon;
                    case "ETH":
                        return ethIcon;
                    case "BTC":
                        return btcIcon;
                    case "RWA":
                        return xendToken;
                    default:
                        return "";
                }
            }

            return null;
        },
        icon() {
            const { token } = this;

            if (token) {
                switch (token.symbol) {
                    case "WVC":
                        return token.address.toLowerCase() ===
                            "0xEd8c5530a0A086a12f57275728128a60DFf04230".toLowerCase()
                            ? "/img/wvc.png"
                            : "";
                    case "ULT":
                        return "/img/ult.jpg";
                    case "UOGE":
                        return "/img/uoge.png";
                    case "CHT":
                        return "/img/cht.png";
                    case "VFI":
                        return "/img/vfi.jpg";
                }
            }

            return null;
        }
    }
};
</script>

<style lang="scss">
@import "style";
.token-icon {
    border-radius: 24px;
}
</style>
