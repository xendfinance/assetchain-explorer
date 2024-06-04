<template>
    <div>
        <f-data-table
            fixed-header
            :columns="columns"
            :items="requestItems"
            :loading="loading"
            force-loading
            class="f-data-table-body-bg-color custom-table"
            @action="openWithdraw"
        >
            <template v-slot:before-title>
                <span class="table-title">Unstake Summary</span>
            </template>
        </f-data-table>
        <WithdrawDialog
            v-if="showWithdrawDialog"
            :amount="withdrawItem.amount"
            :loading="getDialogLoading"
            @close="closeWithdrawDialog"
            @action="withdrawAction"
        />
    </div>
</template>

<script>
import FDataTable from "@/components/core/FDataTable/FDataTable.vue";
import { mapGetters, mapActions } from "vuex";
import {
    formatDate,
    timeNow,
    days,
    hours,
    minutes,
    seconds,
    getTime,
    DAY
} from "@/filters";
import WithdrawDialog from "@/components/dialogs/Withdraw.vue";
import { formatStringFloat } from "@/utils/big-number.js";
export default {
    components: {
        FDataTable,
        WithdrawDialog
    },
    props: {
        loading: { type: Boolean }
    },
    data() {
        return {
            periodWthdraw: 86400,
            time: "",
            intervalid1: "",
            showWithdrawDialog: false,
            withdrawItem: {},
            columns: [
                {
                    name: "validator",
                    label: "Validator",
                    cssClass: " align-center"
                },
                {
                    name: "amount",
                    label: "Amount of unstake",
                    cssClass: " align-center"
                },
                {
                    name: "dateUnstaking",
                    label: "Date of unstake",
                    cssClass: " align-center"
                },
                {
                    name: "action",
                    label: "Time to withdraw",
                    cssClass: " align-center"
                }
            ],
            requestItems: []
        };
    },
    watch: {
        getSuccessMsg(value) {
            if (value) {
                this.showWithdrawDialog = false;
            }
        },
        getErrorMsg(value) {
            if (value) {
                this.showWithdrawDialog = false;
            }
        }
    },
    methods: {
        ...mapActions(["withdraw"]),
        async openWithdraw(item) {
            this.withdrawItem = item;
            this.showWithdrawDialog = true;
        },
        closeWithdrawDialog() {
            this.showWithdrawDialog = false;
        },

        getTimeToClaim(time) {
            const sec = this.getwithdrawalPeriod - (timeNow() - time);
            const daysToClaimIn = Math.floor(sec / DAY);
            const daysToClaimInSec = days(sec);
            const hoursToClaim = hours(daysToClaimInSec);
            const minutesToClaim = minutes(daysToClaimInSec, hoursToClaim);
            const secondsToClaim = seconds(
                daysToClaimInSec,
                hoursToClaim,
                minutesToClaim
            );

            return sec > 0
                ? `${daysToClaimIn > 0 ? daysToClaimIn + ":" : ""}${getTime(
                      hoursToClaim
                  )}:${getTime(minutesToClaim)}:${getTime(secondsToClaim)}`
                : 0;
        },
        intervalRequest() {
            this.intervalid1 = setInterval(() => {
                if (this.filteredRequsest.length) {
                    this.requestItems = this.filteredRequsest.map(r => ({
                        amount: formatStringFloat(r.amount.toString()),
                        dateUnstaking: formatDate(
                            Number(r.dateUnstaking) * 1000,
                            false,
                            true
                        ),
                        epoch: r.epoch,
                        validator: r.validator,
                        wrId: r.wrId,
                        timeToClaim: this.getTimeToClaim(r.dateUnstaking),
                        action: "Withdraw"
                    }));
                } else this.requestItems = [];
            }, 1000);
        },
        async withdrawAction() {
            this.withdraw({
                toValidatorID: this.withdrawItem.validator,
                wrId: this.withdrawItem.wrId
            });
        }
    },
    mounted() {
        this.intervalRequest();
    },
    unMounted() {
        clearInterval(this.intervalid1);
    },
    computed: {
        ...mapGetters([
            "filteredRequsest",
            "getwithdrawalPeriod",
            "getDialogLoading",
            "getErrorMsg",
            "getSuccessMsg"
        ])
    }
};
</script>
<style lang="scss">
.custom-table {
    --custom-table-title: black;
    .table-title {
        font-size: 16px;
        color: #fff;
        @media (min-width: 640px) {
            color: #fff;
            font-size: 18px;
            font-weight: 700;
        }
    }
}

a.btn-delegation:active,
a.btn-delegation:hover,
a.btn-delegation {
    text-decoration: none;
}

.btn-delegation {
    --btn-delegation-color: black;
    --btn-delegation-border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 194px;
    height: 50px;
    background-color: transparent;
    border: var(--btn-delegation-border);
    transition: 200ms;
    font-size: 18px;
    font-weight: 700;
    border-radius: 100px;
    span {
        color: var(--btn-delegation-color);
    }
    &:active {
        background-color: $primary-dark-opacity25;
        border: 1px solid $primary-dark;
        span {
            color: white;
        }
    }
    @media (min-width: 768px) {
        &:hover {
            // background-color: $primary-dark-opacity15;
            // border: 1px solid $primary-dark !important;
            span {
                color: white;
            }
        }

        &:active {
            background-color: $primary-dark-opacity25;
            border: 1px solid $primary-dark;
            span {
                color: white;
            }
        }
    }
}
.gas {
    color: #337afe;
    font-size: 20px;
    font-weight: bold;
}

.after-table {
    width: 100%;
    margin-top: 24px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    @media (min-width: 768px) {
        flex-direction: row;
    }
    .select-block {
        width: 100%;
        max-width: 298px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        @media (min-width: 768px) {
            max-width: 211px;
        }
    }
    .cashback {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .tooltip-gas {
        display: flex;
        align-items: flex-start;
        padding-bottom: 16px;
    }
    .add-stake {
        padding-bottom: 16px;
        @media (min-width: 768px) {
            margin-left: auto;
        }
    }
}

.tooltip-table {
    position: absolute;
    right: 65px;
    top: 15px;
    z-index: 9;
}
@media (max-width: 1000px) {
    .tooltip-table {
        position: absolute;
        right: 40px;
        top: 15px;
        z-index: 9;
    }
}

@media (max-width: 800px) {
    .tooltip-table {
        position: absolute;
        right: 20px;
        top: 15px;
        z-index: 9;
    }
}

@media (max-width: 650px) {
    .tooltip-table {
        position: absolute;
        right: 0px;
        top: 15px;
        z-index: 9;
    }
}
</style>
