<template>
    <div class="custom-dialog">
        <div class="dialog-form">
            <!-- <button class="close" @click="closeModal">x</button> -->
            <div class="stake-dialog">
                <div class="stake-title">
                    <div class="stake-text">Claim</div>
                    <div class="small-text">
                        You claim {{ amount }} {{ symbol }}
                    </div>
                </div>
                <div v-if="!loading" class="btns">
                    <div>
                        <button class="btn secondary stake" @click="closeModal">
                            <span class=" button-text">
                                Close
                            </span>
                        </button>
                        <button class="btn primary stake" @click="claim">
                            <span class="button-text">
                                Claim
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
        loading: { type: Boolean, default: false }
    },
    computed: {
        ...mapGetters(["symbol"])
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
        claim() {
            this.$emit("claim", this.amount);
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
}

.stake-text {
    --title-color-dialog: #000;
    font-weight: 600;
    font-size: 26px;
    color: var(--title-color-dialog);
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
    background-color: var(--f-bg-dialog);
    position: fixed;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
    width: 488px;
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
    .stake {
        max-width: 364px;
        width: 100%;
        height: 48px;
        margin-top: 16px;
    }
}

.button-text {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 1px;
}
.msg-content {
    margin-top: 58px;
}
</style>
