<template>
    <div class="f-validators-info">
        <div class="validator_infocards">
            <f-card>
                <h3>Overview</h3>
                <div v-if="pieChartData" class="pie-chart-container">
                    <PieChart
                        :chart-data="pieChartData.chartData"
                        :chart-labels="pieChartData.chartLabels"
                    />
                </div>
                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            Validator's stake ({{
                                (
                                    (dTotals.selfStaked / dTotals.totalStaked) *
                                    100
                                ).toFixed(2) + "%"
                            }}) :
                        </div>
                    </div>
                    <div class="col">
                        {{ formatNumberByLocale(dTotals.selfStaked, 0) }}

                        RWA
                    </div>
                </div>
                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            Delegator's stake ({{
                                (
                                    (dTotals.totalDelegated /
                                        dTotals.totalStaked) *
                                    100
                                ).toFixed(2) + "%"
                            }}) :
                        </div>
                    </div>
                    <div class="col">
                        {{ formatNumberByLocale(dTotals.totalDelegated, 0) }}
                        RWA
                    </div>
                </div>

                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            Total staked :
                        </div>
                    </div>
                    <div class="col">
                        {{ formatNumberByLocale(dTotals.totalStaked, 0) }} RWA
                    </div>
                </div>

                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            Total Fee Rewards :
                        </div>
                    </div>
                    <div class="col">
                        {{ formatNumberByLocale(totalValidatorRewards, 0) }} RWA
                    </div>
                </div>
            </f-card>

            <f-card>
                <h3>Last epoch</h3>
                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            Epoch number :
                        </div>
                    </div>
                    <div class="col">
                        {{ formatHexToInt(epoch.id) }}
                    </div>
                </div>
                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            End time :
                        </div>
                    </div>
                    <div class="col">
                        {{ formatDate(timestampToDate(epoch.endTime)) }}
                    </div>
                </div>
                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            Duration :
                        </div>
                    </div>
                    <div class="col">
                        {{ formatDuration(formatHexToInt(epoch.duration)) }}
                    </div>
                </div>
                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            Fee :
                        </div>
                    </div>
                    <div class="col">
                        <f-t-m-token-value :value="epoch.epochFee" convert />
                    </div>
                </div>
                <div class="vif_row">
                    <div class="col">
                        <div class="validator-container">
                            Total supply :
                        </div>
                    </div>
                    <div class="col">{{ dTotalSupply }} RWA</div>
                </div>
            </f-card>
        </div>

        <div class="f-subsection">
            <h2 class="h1">
                {{ $t("view_validator_list.validators") }}
                <span v-if="dRecordsCount" class="f-records-count"
                    >({{ dRecordsCount }})</span
                >
                <button
                    @click="toggleComponent"
                    :class="showValidators ? '' : 'rotate'"
                >
                    <ArrowSvg />
                </button>
            </h2>

            <f-validator-list
                v-if="showValidators"
                code="validators"
                @records-count="onRecordsCount"
                @validator-list-totals="onValidatorListTotals"
                @validator-list-offline="onValidatorListOffline"
                @validator-list-flagged="onValidatorListFlagged"
                @validator-list-inactive="onValidatorListInactive"
            >
            </f-validator-list>
        </div>
    </div>
</template>

<script>
import gql from "graphql-tag";
import FCard from "../components/core/FCard/FCard.vue";
import { WEIToFTM } from "../utils/transactions.js";
import ArrowSvg from "../assets/svg/ArrowSvg.vue";
import FValidatorList from "../data-tables/FValidatorList.vue";
import {
    numToFixed,
    timestampToDate,
    formatHexToInt,
    formatDate,
    formatDuration,
    formatNumberByLocale
} from "../filters.js";
// import { mapGetters } from "vuex";
import appConfig from "../../app.config.js";
import FTMTokenValue from "@/components/core/FTMTokenValue/FTMTokenValue.vue";
import web3utils from "web3-utils";
import PieChart from "../components/PieChart.vue";
export default {
    components: {
        FTMTokenValue,
        FValidatorList,
        ArrowSvg,
        FCard,
        PieChart
    },
    props: {
        items: {
            type: Object,
            default() {
                return {
                    action: "",
                    data: []
                };
            }
        }
    },

    apollo: {
        currentEpoch: {
            query: gql`
                query Epoch {
                    currentEpoch
                }
            `,
            result(_data) {
                this.$apollo.queries.epoch.refetch({
                    id: web3utils.numberToHex(
                        formatHexToInt(_data.data.currentEpoch) - 1
                    )
                });
                this.$apollo.queries.epoch.skip = false;
            },
            error(_error) {
                this.dValidatorsInfoError = _error.message;
            }
        },
        epoch: {
            query: gql`
                query LastEpoch($id: Long!) {
                    epoch(id: $id) {
                        id
                        endTime
                        duration
                        epochFee
                        totalSupply
                        baseRewardPerSecond
                    }
                }
            `,
            skip() {
                return true;
            },
            variables() {
                return {
                    id: ""
                };
            },
            result(_data) {
                console.log("Fetched data:", _data);
                this.dTotalSupply = formatNumberByLocale(
                    numToFixed(WEIToFTM(_data.data.epoch.totalSupply), 0),
                    0
                );
            },
            error(_error) {
                this.dValidatorsInfoError = _error.message;
            }
        },
        main_epoch: {
            query: gql`
                query EpochById($id: Long) {
                    epoch(id: $id) {
                        id
                        endTime
                        duration
                        epochFee
                        totalSupply
                        baseRewardPerSecond
                        actualValidatorRewards {
                            id
                            totalReward
                            __typename
                        }
                        __typename
                    }
                }
            `,
            // ... rest of the epoch query options ...
            result(_data) {
                // console.log("Fetched data:", _data);
                // this.dTotalSupply = formatNumberByLocale(
                //     numToFixed(WEIToFTM(_data.data.main_epoch.totalSupply), 0),
                //     0
                // );
                // Store the actualValidatorRewards for use in computed property
                this.actualValidatorRewards =
                    _data.data.epoch.actualValidatorRewards;

                console.log(
                    "Fetched data's:",
                    _data.data.epoch.actualValidatorRewards
                );
            }
        }
    },
    computed: {
        totalValidatorRewards() {
            return this.actualValidatorRewards.reduce((total, validator) => {
                return total + parseFloat(WEIToFTM(validator.totalReward));
            }, 0);
        },
        pieChartData() {
            if (
                this.dTotals &&
                this.dTotals.totalDelegated &&
                this.dTotals.selfStaked
            ) {
                const validatorStake = this.dTotals.selfStaked;
                const delegatorStake = this.dTotals.totalDelegated;

                return {
                    chartData: [validatorStake, delegatorStake],
                    chartLabels: ["Validator Stake", "Delegator Stake"]
                };
            }
            return null;
        }
    },
    data() {
        return {
            epoch: {},
            dItems: [],
            dOfflineItems: [],
            dFlaggedItems: [],
            dInactiveItems: [],
            dValidatorsInfoError: "",
            actualValidatorRewards: [],
            dTotals: {},
            dTotalSupply: 0,
            dRecordsCount: 0,
            showRewardsEstimation: appConfig.flags.rewardsEstimation,
            chartData: [],
            chartLabels: [],
            showValidators: true
        };
    },
    methods: {
        /**
         * @param {int} _num
         */
        formatLargeNumber(num) {
            // Convert to a fixed number of decimal places (e.g., 2)
            return parseFloat(num.toFixed(2));
        },
        onRecordsCount(_num) {
            this.dRecordsCount = _num;
        },

        onValidatorListTotals(_totals) {
            this.dTotals = {
                ..._totals,
                fSelfStaked: formatNumberByLocale(
                    numToFixed(_totals.selfStaked, 2)
                ),
                fTotalDelegated: formatNumberByLocale(
                    numToFixed(_totals.totalDelegated, 2)
                ),
                fTotalStaked: formatNumberByLocale(
                    numToFixed(_totals.totalStaked, 2)
                )
            };
        },
        toggleComponent() {
            this.showValidators = !this.showValidators;
        },
        onValidatorListOffline(_offline) {
            this.dOfflineItems = _offline;
        },

        onValidatorListFlagged(_flagged) {
            this.dFlaggedItems = _flagged;
        },

        onValidatorListInactive(_inactive) {
            this.dInactiveItems = _inactive;
        },

        WEIToFTM,
        timestampToDate,
        formatHexToInt,
        formatNumberByLocale,
        numToFixed,
        formatDate,
        formatDuration
    }
};
</script>

<style scoped>
h1 {
    span {
        font-weight: 700 !important;
    }
}

.rotate {
    rotate: 180deg;
}

button {
    border: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
}

.validator_infocards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    width: 100%;
}
.vif_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
@media screen and (max-width: 768px) {
    .validator_infocards {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
}
</style>
