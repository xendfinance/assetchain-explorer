<template>
    <div class="custom-dialog">
        <div class="dialog-form">
            <button class="close" @click="closeModal">x</button>
            <div class="stake-dialog">
                <div class="unstake-title">
                    <div class="stake-text">Unstake RWA</div>
                    <div class="input-label">
                        <span class="small-text">
                            Amount
                        </span>
                        <span
                            class="small-text-desc primary-text"
                            @click="unstakeAmount = amount"
                        >
                            In this stake you have {{ amount }} {{ symbol }}
                        </span>
                        <span
                            class="small-text-mobile primary-text "
                            @click="unstakeAmount = amount"
                        >
                            Entire Balance - {{ amount }} {{ symbol }}
                        </span>
                    </div>
                </div>
                <FInput
                    placeholder="Unstake amount"
                    v-model="unstakeAmount"
                    class="inp-amount"
                    fieldSize="large"
                    validateOnInput
                    :validator="validator"
                    :errorMessage="errorMessage"
                    type="number"
                />
                <div v-if="!loading && !errorMsg" class="btns">
                    <button
                        class="btn stake"
                        :disabled="!unstakeAmount || Boolean(errorMessage)"
                        @click="unstake"
                    >
                        <span class="button-text">
                            OK
                        </span>
                    </button>
                </div>
                <div v-if="loading" class="f-loading-more msg-content">
                    <pulse-loader color="#1969ff"></pulse-loader>
                </div>
                <div v-if="!loading && errorMsg" class="msg-container">
                    <div class="msg query-error">
                        <span>{{ errorMsg }}</span>
                    </div>

                    <button class="btn primary" @click="closeModal">
                        <span class="button-text">
                            Try again
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { mapGetters } from "vuex";
import FInput from "@/components/core/FInput/FInput.vue";

export default {
    components: { PulseLoader, FInput },
    props: {
        amount: { type: String, default: "" },
        loading: { type: Boolean, default: false },
        errorMsg: { type: String, default: "" }
    },
    data() {
        return {
            unstakeAmount: ""
        };
    },
    computed: {
        ...mapGetters(["symbol", "networkOptions"]),
        errorMessage() {
            if (!this.unstakeAmount) return "";
            else if (isNaN(Number(this.unstakeAmount)))
                return "Amount must be a number";
            if (!isNaN(Number(this.unstakeAmount))) {
                const amount = Number(this.unstakeAmount.trim());

                if (amount === 0) return "Amount must be more than zero";
                else if (amount > this.amount)
                    return "Unstake amount exceeds stake";
                else return "";
            } else return "";
        }
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        unstake() {
            this.$emit("action", this.unstakeAmount);
        },
        scannersLink(tx) {
            // return `${this.networkOptions.blockExplorerUrls[0]}/transactions/${tx}`;
            return `/transactions/${tx}`;
        },
        validator(value) {
            if (isNaN(Number(value))) return false;
            else {
                if (!value) return true;
                else {
                    const amount = Number(value.trim());

                    return amount === 0 || amount > this.amount ? false : true;
                }
            }
        }
    }
};
</script>

<style scoped lang="scss">
.input-label {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    margin-top: 32px;
}
.stake-dialog {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 180px;
}

.unstake-title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stake-text {
    --title-color-dialog: #000;
    font-size: 32px;
    color: var(--title-color-dialog);
    @media (min-width: 640px) {
        font-size: 40px;
    }
}

.small-text {
    font-weight: 400;
    font-size: 14px;
}

.small-text-desc {
    font-size: 14px;
    display: none;
    @media (min-width: 640px) {
        display: inline;
    }
}
.small-text-mobile {
    font-size: 13px;
    display: inline;
    @media (min-width: 640px) {
        display: none;
    }
}
.primary-text {
    color: #337afe;
    cursor: pointer;
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
    border-radius: 8px;
    background-color: var(--f-bg-dialog);
    position: fixed;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 16px;
    width: 335px;
    @media (min-width: 640px) {
        border-radius: 18px;
        padding: 24px;
        width: 488px;
    }
    @media (min-width: 1020px) {
        border-radius: 24px;
        padding: 50px;
        width: 790px;
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
    width: 100%;
    display: flex;
    align-items: center;
    justify-items: center;
    .stake {
        max-width: 277px;
        width: 100%;
        height: 48px;
        margin-top: 16px;
        margin-left: auto;
        margin-right: auto;
    }
}

.button-text {
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 1px;
    color: #fff;
}
.msg-content {
    margin-top: 58px;
}
.msg-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
        margin-top: 16px;
        max-width: 364px;
        height: 48px;
    }
    .msg {
        margin-top: 40px;
    }
}

.inp-amount {
    margin-bottom: 24px;
    width: 100%;
    div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
    }
    input {
        height: 44px;
        width: 100%;
    }
    select {
        width: 100%;
    }
    .validator {
        color: #337afe;
    }
}
</style>
