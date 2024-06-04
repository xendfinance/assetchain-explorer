<template>
    <div class="custom-dialog">
        <div class="dialog-form">
            <!-- <button class="close" @click="closeModal">x</button> -->
            <div class="success-dialog">
                <Confirm />
                <p class="confirmed">
                    CONFIRMED
                </p>
                <!-- <div class="success-title">
                    <div class="success-text">Success!</div>
                    <div class="success-label">
                        Transaction successfully completed. You can follow the
                        information of your operation with the transaction hash:
                    </div>
                </div> -->

                <!-- <div v-if="successMsg" class="msg-container">
                    <div class="msg">
                        <span>Your transaction hash:</span>
                        <a
                            :href="scannersLink(successMsg)"
                            target="_blank"
                            class=""
                        >
                            {{ successMsg.slice(0, 14) }}...
                        </a>
                    </div>
                </div> -->
                <button class="btn primary sucess-button" @click="closeModal">
                    <span class="button-text">
                        Done
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import Confirm from "../../assets/svg/Confirm.vue";

export default {
    components: { Confirm },
    props: {
        successMsg: { type: String, default: "" }
    },
    computed: {
        ...mapGetters(["networkOptions"])
    },
    methods: {
        ...mapMutations(["setSuccessMsg"]),
        closeModal() {
            this.setSuccessMsg("");
            this.$emit("close");
        },
        scannersLink(tx) {
            // return `${this.networkOptions.blockExplorerUrls[0]}/transactions/${tx}`;
            return `/transactions/${tx}`;
        }
    }
};
</script>

<style scoped lang="scss">
.success-label {
    --success-label: #9399a5;
    color: var(--success-label);
    width: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    margin-top: 32px;
}
.success-dialog {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 180px;
    gap: 37px;

    @media (min-width: 640px) {
        gap: 30px;
    }
}

.success-title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.success-text {
    font-size: 32px;
    color: #a3dc00;
    @media (min-width: 640px) {
        font-size: 40px;
    }
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
    border-radius: 23px;
    background-color: #131d2d;
    position: fixed;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 32px 16px;
    width: 335px;
    @media (min-width: 640px) {
        padding: 44px;
        width: 480px;
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

.sucess-button {
    width: 290px;
    height: 48px;
    @media (min-width: 640px) {
        width: 177px;
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
.msg-container {
    --success-link: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
        max-width: 364px;
        height: 48px;
    }
    .msg {
        font-size: 14px;
        font-weight: 700;
        margin-top: 20px;
    }
    a {
        color: var(--success-link);
    }
}

.confirmed {
    color: #fff;
    font-weight: 600;
    font-size: 32px;
    padding-bottom: 0;
    @media (max-width: 640px) {
        font-size: 28px;
    }
}
</style>
