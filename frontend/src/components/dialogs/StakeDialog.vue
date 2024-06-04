<template>
    <div class="custom-dialog">
        <div class="dialog-form">
            <!-- <button class="close" @click="closeModal">x</button> -->
            <div class="stake-dialog">
                <div class="stake-title">
                    <div class="stake-text">Delegate RWA</div>
                    <div class="table">
                        <div class="table-col bold">
                            <p>Validator</p>
                            <p class="sendfrom">Send From</p>
                            <p class="amount">Amount</p>
                        </div>
                        <div class="table-col">
                            <p>{{ validatorName }}</p>
                            <p class="address">{{ walletAddress }}</p>
                            <p>{{ amountData }}</p>
                        </div>
                    </div>
                </div>
                <div v-if="!loading" class="btns">
                    <div>
                        <button class="btn secondary stake" @click="closeModal">
                            <span class=" button-text">
                                Cancel
                            </span>
                        </button>
                        <button class="btn primary stake" @click="delegate">
                            <span class="button-text">
                                Delegate
                            </span>
                        </button>
                    </div>
                </div>
                <div v-if="loading" class="f-loading-more msg-content">
                    <pulse-loader color="#1969ff"></pulse-loader>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { mapGetters } from "vuex";

export default {
    components: { PulseLoader },
    props: {
        amount: { type: String, default: "" },
        validatorName: { type: String, default: "" },
        stakerInfo: { type: Object, default: () => ({}) },
        loading: { type: Boolean, default: false }
    },
    data() {
        return {
            amountData: this.amount || ""
        };
    },
    computed: {
        ...mapGetters(["symbol", "walletAddress"])
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        delegate() {
            this.$emit("action");
        }
    }
};
</script>

<style scoped lang="scss">
.stake-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 180px;
}

.stake-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    @media (max-width: 640px) {
        width: 300px;
    }
}

.stake-text {
    --title-color-dialog: #000;
    font-weight: 600;
    font-size: 26px;
    color: #fff;
}

.small-text {
    font-weight: 400;
    font-size: 14px;
    color: gray;
}

.custom-dialog {
    position: fixed;
    top: -50px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
}

.dialog-form {
    --f-bg-dialog: #{#fff};
    border-radius: 24px;
    background-color: #131d2d;
    position: fixed;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 36px 20px;
    width: 488px;
    @media (max-width: 640px) {
        padding: 16px 8px;
        width: 350px;
    }
}
.close {
    outline: none;
    border: none;
    background-color: transparent;
    color: gray;
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
    cursor: pointer;
}

.btns {
    div {
        display: flex;
        gap: 20px;
        @media (max-width: 640px) {
            flex-direction: column-reverse;
            gap: 10px;
        }
    }
    .stake {
        width: 190px;
        height: 48px;
        margin-top: 16px;
        @media (max-width: 640px) {
            margin-top: 0;
            width: 320px;
        }
    }
}

.button-text {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    letter-spacing: 1px;
}
.msg-content {
    margin-top: 58px;
}
.table {
    padding: 24px 0px;
    display: flex;
    gap: 25px;
    font-size: 14px;
    color: #fff;

    font: "Fira Sans";
    .bold {
        font-weight: 700;
    }

    font-weight: 400;
    &-col {
        display: flex;
        flex-direction: column;
        gap: 24px;
        .address {
            word-break: break-all;
        }
        .sendfrom {
            white-space: nowrap;
        }
    }
    @media (max-width: 640px) {
        width: 340px;
        padding: 0px 12px;
        margin-bottom: 8px;
        .amount {
            margin-top: 21px;
        }
    }
}

p {
    padding: 0;
}
</style>
