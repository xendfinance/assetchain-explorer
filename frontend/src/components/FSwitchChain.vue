<template>
    <div>
        <div ref="selector" class="switch-chain" tabindex="0">
            <f-toggle-button v-model="active">{{ title }}</f-toggle-button>
        </div>
    </div>
</template>

<script>
import FToggleButton from "./core/FToggleButton/FToggleButton.vue";
import { mapGetters } from "vuex";

export default {
    name: "FSwitchChain",
    components: { FToggleButton },

    data() {
        return {
            val: "Mainnet",
            active: false,
            labels: [
                {
                    name: "Mainnet",
                    link: "#"
                    // disabled: false
                },
                {
                    name: "Testnet",
                    link: "#"
                    // disabled: false
                }
            ]
        };
    },
    computed: {
        ...mapGetters(["explorerTestnet", "explorerMainnet"]),
        title() {
            return this.active ? "Mainnet" : "Testnet";
        }
    },
    watch: {
        active(newVal) {
            const currentUrl = window.location.href;
            if (newVal) {
                if (!currentUrl.includes("mainnet")) {
                    window.location.href = this.labels[0].link;
                }
            } else {
                if (!currentUrl.includes("testnet")) {
                    window.location.href = this.labels[1].link;
                }
            }
        }
    },
    mounted() {
        const currentUrl = window.location.href;
        if (currentUrl.includes("mainnet")) {
            this.active = true;
            this.val = "Mainnet";
        } else if (currentUrl.includes("testnet")) {
            this.active = false;
            this.val = "Testnet";
        }
        this.labels[0].link = this.explorerMainnet;
        this.labels[1].link = this.explorerTestnet;
    }
};
</script>

<style lang="scss">
.switch-chain {
    display: flex;
    flex-direction: row;
    justify-content: end;
    position: relative;
    margin-right: 4px;

    width: 100px;
    @include media-max($bp-menu) {
        margin-right: 12px;
    }
}

.options {
    --bg-option-select: #fcfcfc;
    width: 109px;
    max-height: 240px;
    @media (min-width: 768px) {
        max-height: 361px;
    }
    position: absolute;
    background: var(--bg-option-select);
    border-radius: 6px;
    top: 35px;
    right: -24px;
    z-index: 5;
    a {
        text-decoration: none !important;
    }
}
.disabled {
    opacity: 60;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    width: 100%;
    font-size: 13px;
    cursor: not-allowed;
    span {
        color: #747474;
    }
}
.option {
    display: block;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    width: 100%;
    font-size: 13px;
    cursor: pointer;
    transition: 150ms;
    span {
        --option-select-color: #747474;
        --option-select-color-active: #2b3954;
        color: var(--option-select-color);
    }
    .text-active {
        --bg-button-active: #1969ff;
        color: var(--option-select-color-active);
        font-weight: 700;
    }
    &:hover {
        background: #ffffff07;
    }
}
</style>
