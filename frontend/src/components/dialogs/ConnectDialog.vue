<template>
    <div class="custom-dialog">
        <div class="wrapper">
            <div class="dialog-form">
                <div class="close" @click="closeModal()">x</div>
                <div class="connect-dialog">
                    <div class="title">
                        <div class="connect-text">Connect wallet</div>
                        <div class="small-text">
                            Choose a provider to connect wallet
                        </div>
                    </div>
                    <div class="btns">
                        <div>
                            <div
                                class="btn secondary connect"
                                @click="
                                    () => {
                                        connectMetamask(), closeModal();
                                    }
                                "
                            >
                                <div class=" button-text">
                                    <span class="z-50">MetaMask</span>
                                </div>
                            </div>
                            <!-- <div class="relative trustwallet">
                                <div
                                    class="btn secondary connect"
                                    @click="
                                        () => {
                                            connectTrustWallet(), closeModal();
                                        }
                                    "
                                >
                                    <div class="button-text">
                                        Trust Wallet
                                    </div>
                                </div>
                            </div> -->
                            <div class="relative">
                                <div
                                    class="btn secondary connect"
                                    @click="
                                        () => {
                                            connectWalletConnect();
                                            closeModal();
                                        }
                                    "
                                >
                                    <div class="button-text">
                                        WalletConnect
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    methods: {
        ...mapActions([
            "connectMetamask",
            "connectWalletConnect",
            "connectTrustWallet"
        ]),
        closeModal() {
            this.$emit("close");
        }
    }
};
</script>

<style scoped lang="scss">
.trustwallet {
    display: none;
    @media (min-width: 640px) {
        display: block;
    }
}
.connect-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
}

.connect-text {
    --title-color-dialog: #000;
    font-weight: 600;
    font-size: 26px;
    color: var(--title-color-dialog);
    // @include for-size(md) {
    //   font-size: 32px;
    // }
}

.small-text {
    font-weight: 400;
    font-size: 14px;

    // @include for-size(md) {
    //   font-size: 16px;
    // }

    color: gray;
}

.button-text {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 1px;

    // @include for-size(md) {
    //   font-size: 16px;
    // }
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

.wrapper {
    border-radius: 24px;
    position: fixed;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    box-shadow: 0px 32px 64px rgba(36, 37, 38, 0.12);
}
.dialog-form {
    --f-bg-dialog: #{#fff};
    border-radius: 24px;
    background-color: var(--f-bg-dialog);
    position: relative;
    padding: 24px;
    width: 100%;
    max-width: 488px;
    @media (min-width: 640px) {
        padding: 50px;
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
    .connect {
        width: 364px;
        height: 48px;
        margin-top: 16px;
    }
}
</style>
