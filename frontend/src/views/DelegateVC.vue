<template>
    <div class="f-address-detail narrow-container ">
        <div class="f-subsection f-subsection-custom">
            <router-link to="/staking">
                <div class="arrow">
                    <svg
                        width="26"
                        height="15"
                        viewBox="0 0 26 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M25.5 7.5H1M1 7.5L8 1M1 7.5L8 14"
                            :stroke="darkMode ? '#fff' : '#000'"
                        />
                    </svg>
                </div>
            </router-link>
            <h1>Delegate RWA</h1>
            <div class="conect-block">
                <div
                    v-if="!address"
                    :class="
                        !darkMode
                            ? 'btn-connect btn large primary'
                            : 'btn-connect-dark btn large primary'
                    "
                    @click="showWalletDialog = true"
                >
                    Connect Wallet
                </div>
                <div
                    v-else
                    :class="
                        !darkMode
                            ? 'btn-connect btn large primary'
                            : 'btn-connect-dark btn large primary'
                    "
                    class="warning"
                    @click="disconnect()"
                >
                    <div v-if="isChainIdCorrect">
                        <Warning />
                    </div>
                    <p>
                        {{ shortAddress }}
                    </p>
                </div>
            </div>
        </div>
        <div class="f-card">
            <div class="form">
                <div class="inp-amount">
                    <div>
                        <span>Amount</span>

                        <span class="validator">
                            Entire balance
                            {{
                                isNaN(balance)
                                    ? "0"
                                    : (balance / 10 ** 18).toFixed(4)
                            }}
                            RWA
                        </span>
                    </div>
                    <FInput
                        placeholder="Stake amount"
                        v-model="amount"
                        class="inp-amount"
                        fieldSize="large"
                        validateOnInput
                        :validator="validator"
                        :errorMessage="errorMessage"
                        type="number"
                    >
                    </FInput>
                    <!-- <input
                        type="text"
                        name="amount"
                        placeholder="Delegate amount"
                        v-model="amount"
                        class="inp large"
                        @focus="onFocus"
                        @blur="onBlur"
                    /> -->
                </div>
                <div class="inp-validator">
                    <div>
                        <span>Validator</span>
                    </div>
                    <!-- <FInput></FInput> -->
                    <select
                        name="validator"
                        class="inp large"
                        @focus="onFocus"
                        @blur="onBlur"
                        v-model="selectValidator"
                    >
                        <option
                            v-for="validator in validatorsIDs"
                            :key="validator"
                            :value="validator"
                            >{{ validator }}</option
                        >
                    </select>
                </div>
                <button
                    class="btn large primary btn-continue"
                    @click="showStakeDialog = true"
                    :disabled="isDisabled"
                >
                    Continue
                </button>
            </div>
        </div>
        <!-- <h2 class="h1">
            {{ $t("view_validator_list.validators") }}
            <span v-if="dRecordsCount" class="f-records-count">
                ({{ dRecordsCount }})
            </span>
        </h2> -->
        <!-- <f-validator-list
            class="validators-vc"
            code="validators"
            @records-count="onRecordsCount"
        > -->
        <!-- @validator-list-totals="onValidatorListTotals"
            @validator-list-offline="onValidatorListOffline"
            @validator-list-flagged="onValidatorListFlagged"
            @validator-list-inactive="onValidatorListInactive" -->
        <!-- </f-validator-list> -->
        <ConnectDialog
            v-if="showWalletDialog"
            @close="showWalletDialog = false"
        />
        <StakeDialog
            v-if="showStakeDialog"
            :amount="amount"
            :stakerInfo="stakerInfo"
            :validator-name="validatorName"
            :loading="getDialogLoading"
            :errorMsg="getErrorMsg"
            @close="closeStakeDialog"
            @action="stake"
        />
        <SuccessAlert
            v-if="showSuccessAlert"
            :successMsg="getSuccessMsg"
            @close="closeSuccess"
        />
        <ErrorAlert
            v-if="showErrorAlert"
            :errorMsg="getErrorMsg"
            @close="closeError"
        />
    </div>
</template>

<script>
import FInput from "../components/core/FInput/FInput.vue";
import ConnectDialog from "../components/dialogs/ConnectDialog.vue";
import StakeDialog from "../components/dialogs/StakeDialog.vue";
// import FValidatorList from "../data-tables/FValidatorListForSelect.vue";
import SuccessAlert from "../components/dialogs/SuccessAlert.vue";
import ErrorAlert from "../components/dialogs/ErrorAlert.vue";
import Warning from "../components/Warning";

import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { toBigNumberFloat } from "@/utils/big-number.js";
import { BigNumber } from "ethers";
import gql from "graphql-tag";
import { shuffle } from "@/utils/array.js";

import { WEIToFTM } from "@/utils/transactions.js";
import { cloneObject } from "@/utils";
import { numToFixed } from "@/filters";

export default {
    name: "DelegateVC",
    components: {
        ConnectDialog,
        StakeDialog,
        FInput,
        // FValidatorList,
        SuccessAlert,
        ErrorAlert,
        Warning
    },
    props: {
        /**
         * Data and action.
         * Actions:
         * '' - replace items
         * 'append' - append new items
         */
        items: {
            type: Array,
            default() {
                return [];
            }
        },
        /**
         * Grid's code used for identification in local storage
         */
        code: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            amount: "",
            selectValidator: 0,
            showWalletDialog: false,
            showStakeDialog: false,
            showSuccessAlert: false,
            showErrorAlert: false,
            dRecordsCount: 0,
            dItems: [],
            dValidatorListError: "",
            rwaChainId: process.env.VUE_APP_CHAIN_ID
        };
    },
    created() {
        if (this.items.length > 0) {
            this.dItems = this.items;
        }
    },

    apollo: {
        stakers: {
            query: gql`
                query Stakers {
                    stakers {
                        id
                        stakerAddress
                        isOffline
                        isCheater
                        isActive
                        createdTime
                        stake
                        totalStake
                        delegatedMe
                        downtime
                        stakerInfo {
                            name
                            website
                            contact
                            logoUrl
                        }
                    }
                }
            `,
            result(_data, _key) {
                const totals = {
                    selfStaked: 0,
                    totalDelegated: 0,
                    totalStaked: 0
                };
                let data;
                const offline = [];
                const flagged = [];
                const inactive = [];
                let remove = [];
                const tUnknown = this.$t("view_validator_list.unknown");

                if (_key === "stakers") {
                    data = [..._data.data.stakers];

                    shuffle(data);

                    data.forEach((_item, _idx) => {
                        // _item.total_staked = WEIToFTM(_item.stake) + WEIToFTM(_item.delegatedMe);
                        totals.selfStaked += parseFloat(
                            numToFixed(WEIToFTM(_item.stake), 0)
                        );
                        totals.totalDelegated += parseFloat(
                            numToFixed(WEIToFTM(_item.delegatedMe), 0)
                        );
                        totals.totalStaked += parseFloat(
                            numToFixed(WEIToFTM(_item.totalStake), 0)
                        );

                        if (!_item.stakerInfo) {
                            _item.stakerInfo = {};
                        }

                        if (!_item.stakerInfo.name) {
                            _item.stakerInfo.name = tUnknown;
                        }

                        if (_item.isOffline && !_item.isCheater) {
                            offline.push(_idx);
                        }

                        if (_item.isCheater) {
                            flagged.push(_idx);
                        }
                    });

                    // offline validators
                    if (offline.length > 0) {
                        offline.forEach((_idx, _index) => {
                            remove.push(_idx);
                            offline[_index] = cloneObject(data[_idx]);
                        });

                        this.$emit("validator-list-offline", offline);
                    }

                    // flagged validators
                    if (flagged.length > 0) {
                        flagged.forEach((_idx, _index) => {
                            remove.push(_idx);
                            flagged[_index] = cloneObject(data[_idx]);
                        });

                        this.$emit("validator-list-flagged", flagged);
                    }

                    if (remove.length > 0) {
                        this.removeItemsByIndices(data, remove);
                    }

                    // inactive validators
                    remove = [];
                    data.forEach((_item, _idx) => {
                        if (!_item.isActive) {
                            remove.push(_idx);
                            inactive.push(cloneObject(data[_idx]));
                        }
                    });

                    if (inactive.length > 0) {
                        this.removeItemsByIndices(data, remove);

                        this.$emit("validator-list-inactive", inactive);
                    }

                    this.dItems = data;

                    this.$emit("records-count", this.dItems.length);
                    this.$emit("validator-list-totals", totals);
                }
            },
            skip() {
                return this.items.length > 0;
            },
            error(_error) {
                this.dValidatorListError = _error.message;
            }
        }
    },
    watch: {
        getSuccessMsg(value) {
            if (value) {
                this.showStakeDialog = false;
                this.showSuccessAlert = true;
                this.amount = "";
                this.selectValidator = this.validatorsIDs[0];
            }
        },
        getErrorMsg(value) {
            if (value) {
                this.showStakeDialog = false;
                this.showErrorAlert = true;
                this.amount = "";
                this.selectValidator = this.validatorsIDs[0];
            }
        }
    },
    methods: {
        ...mapActions([
            "connectMetamask",
            "updateProviderState",
            // "isLoggedIn",
            "disconnect",
            "delegate"
        ]),
        ...mapMutations(["setErrorMsg", "setSuccessMsg"]),
        onFocus() {},
        onBlur() {},
        closeSuccess() {
            this.setSuccessMsg("");
            this.showSuccessAlert = false;
        },
        closeError() {
            this.setErrorMsg(
                `Please verify that your network settings in your connected wallet are correct, as this may be the cause of the error. The network must be set to "Asset Chain."`
            );
            this.showErrorAlert = false;
        },
        stake() {
            this.delegate({
                delegate: this.amount,
                toValidatorID: this.selectValidator
            });
            // this.amount = "";
            // this.selectValidator = this.validatorsIDs[0];
            this.updateProviderState();
        },
        closeStakeDialog() {
            this.setErrorMsg("");
            this.setSuccessMsg("");
            this.showStakeDialog = false;
        },
        validator(value) {
            if (isNaN(Number(value))) return false;
            else {
                if (!value) return true;
                else {
                    const amount = BigNumber.from(
                        toBigNumberFloat(value.trim())
                    );
                    return amount.lte(0) || amount.gt(this.balance)
                        ? false
                        : true;
                }
            }
        },
        /**
         * @param {int} _num
         */
        onRecordsCount(_num) {
            this.dRecordsCount = _num;
        },

        WEIToFTM,
        numToFixed
    },
    computed: {
        ...mapGetters([
            "balance",
            "chainId",
            "validatorsIDs",
            "shortAddress",
            "getDialogLoading",
            "getErrorMsg",
            "getSuccessMsg"
        ]),
        isChainIdCorrect() {
            return parseInt(this.chainId) != this.rwaChainId;
        },
        stakerInfo() {
            return (
                this.dItems.find(item => item.id == this.selectValidator) || {}
            );
        },
        validatorName() {
            return `Validator ${this.selectValidator}`;
        },
        ...mapState({
            address: state => state.address,
            darkMode: state => state.darkMode
        }),
        isDisabled() {
            return (
                !this.amount ||
                !this.selectValidator ||
                !this.address ||
                Boolean(this.errorMessage)
            );
        },
        errorMessage() {
            if (!this.amount) return "";
            else if (isNaN(Number(this.amount)))
                return "Amount must be a number";
            if (!isNaN(Number(this.amount))) {
                const amount = BigNumber.from(
                    toBigNumberFloat(this.amount.trim())
                );
                if (amount.lte(0)) return "Amount must be more than zero";
                else if (amount.gt(this.balance))
                    return "Delegate amount exceeds balance";
                else return "";
            } else return "";
        }
    },
    mounted() {
        if (this.validatorsIDs[0]) {
            this.selectValidator = this.validatorsIDs[0];
        }
    }
};
</script>

<style lang="scss">
.form {
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 0 auto;
    margin-top: 40px;
    align-items: center;
    .inp-amount,
    .inp-validator {
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
}

.f-address-detail {
    padding-bottom: 164px;
    .balance {
        height: calc(100% - 48px);
        text-align: end;

        h3 {
            text-align: end;
            margin-bottom: 0;
        }

        .usd {
            color: $light-gray-color;
            font-size: 26px;
        }
    }

    .num-block {
        h2 {
            text-align: center;
            margin-top: 16px;
            margin-bottom: 4px;
        }

        .num {
            text-align: center;
            font-weight: bold;
            font-size: $fs36;
        }
    }

    .f-tabs {
        h2 {
            font-size: 18px;
        }
    }
}

.f-card {
    border-radius: 16px !important;
}

.f-subsection-custom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: 24px;
    .arrow {
        width: 200px;
    }
    h1 {
        font-weight: 400;
        font-size: 42px;
        text-align: center;
        margin: 0;
    }
}

.validators-vc {
    margin-top: 27px;
}

.h1 {
    margin-top: 53px;
}

.btn-connect {
    transition: 200ms;
    width: 252px;
    height: 55px;
}

.btn-connect-dark {
    transition: 200ms;
    width: 177px;
    height: 48px;
    color: #fff !important;
}

.btn-continue {
    transition: 200ms;
    width: 177px;
    height: 48px;
    font-weight: 700;
    background: $primary-dark !important;
}

@media (max-width: 768px) {
    .f-subsection-custom {
        .arrow {
            width: 50px;
            right: 10px;
        }
    }
}

@media (max-width: 468px) {
    .btn-connect {
        width: 100%;
        height: 55px;
    }
    .btn-connect-dark {
        width: 100%;
        height: 55px;
        color: #fff !important;
    }
    .form {
        width: 100%;
    }
}

@media (max-width: 600px) {
    .f-subsection-custom {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        position: relative;
        margin-bottom: 24px;
        margin-top: 60px;
        .arrow {
            width: 40px;
        }
        .conect-block {
            position: absolute;
            left: 0;
            top: -40px;
            width: 100%;
        }
        h1 {
            font-weight: 400;
            font-size: 42px;
            text-align: left;
            margin: 0;
        }
    }
}
.warning {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
