<template>
    <div class="custom-dialog">
        <div class="dialog-form">
            <button class="close" @click="closeModal">x</button>
            <div class="error-dialog">
                <div class="error-title">
                    <div class="error-text">Error!</div>
                </div>
                <div v-if="errorMsg" class="msg-container">
                    <div class="msg">
                        <span>{{ errorMsg }}</span>
                    </div>

                    <button
                        class="btn primary sucess-button"
                        @click="closeModal"
                    >
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
import { mapMutations } from "vuex";

export default {
    props: {
        errorMsg: { type: String, default: "" }
    },
    methods: {
        ...mapMutations(["setErrorMsg"]),
        closeModal() {
            this.setErrorMsg("");
            this.$emit("close");
        }
    }
};
</script>

<style scoped lang="scss">
.error-dialog {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 180px;
}

.error-title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.error-text {
    font-size: 32px;
    color: #ff1e57;
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
    background-color: var(--f-bg-dialog);
    position: fixed;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 32px 16px;
    width: 335px;
    @media (min-width: 640px) {
        padding: 44px;
        width: 547px;
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
    margin-top: 68px;
    width: 290px;
    @media (min-width: 640px) {
        margin-top: 42px;
        width: 358px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
        max-width: 364px;
        height: 48px;
    }
    .msg {
        --error-label: #9399a5;
        color: var(--error-label);
        font-size: 14px;
        font-weight: 700;
        margin-top: 20px;
        text-align: center;
    }
    a {
        color: var(--success-link);
    }
}
</style>
