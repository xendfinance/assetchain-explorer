<template>
    <div class="f-validators-info">
        <div class="validator-card">
            <div class="validator-card-section">
                <h3>Overview</h3>
                <div class="stake-info">
                    <div class="stake-item">
                        <div class="stake-label">
                            Validator's stake ({{ ((dTotals.selfStaked / dTotals.totalStaked) * 100).toFixed(2) + "%" }})
                        </div>
                        <div class="stake-value">
                            {{ formatNumberByLocale(dTotals.selfStaked, 0) }}

                            RWA
                        </div>
                    </div>
                    <div class="stake-item">
                        <div class="stake-label">
                            Delegator's stake ({{ ((dTotals.totalDelegated / dTotals.totalStaked) * 100).toFixed(2) + "%" }})
                        </div>
                        <div class="stake-value">
                            <!-- {{}} RWA -->

                            {{
                                formatNumberByLocale(dTotals.totalDelegated, 0)
                            }}
                            RWA
                        </div>
                    </div>
                </div>
                <div class="total-staked-info">
                    <div class="total-staked">
                        Total staked:
                        {{ formatNumberByLocale(dTotals.totalStaked, 0) }} RWA
                    </div>
                    <div class="daily-rewards">
                        Total Validator fee: {{ dTotals.totalFees }} RWA
                    </div>
                </div>
            </div>

            <div class="g-epoch-info">
                <h3>Last epoch</h3>
                <div class="epoch-info">
                    <div class="epoch-item">
                        <!-- Epoch number: {{ epochIdAsInt }} -->
                        Epoch number: {{ formatHexToInt(epoch.id) }}
                    </div>
                    <div class="epoch-item">
                        End time:
                        {{ formatDate(timestampToDate(epoch.endTime)) }}
                    </div>
                    <div class="epoch-item">
                        Duration:
                        {{ formatDuration(formatHexToInt(epoch.duration)) }}
                    </div>
                    <div class="epoch-item">
                        Fee:
                        <f-t-m-token-value :value="epoch.epochFee" convert />
                    </div>
                    <div class="epoch-item">
                        <!-- <f-t-m-token-value :value="dTotalSupply" convert /> -->
                        Total supply: {{ dTotalSupply }} RWA
                    </div>
                </div>
            </div>
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
export default {
    components: {
        FTMTokenValue,
        FValidatorList,
        ArrowSvg
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
        }
    },
    computed: {
       
    },
    data() {
        return {
            epoch: {},
            dItems: [],
            dOfflineItems: [],
            dFlaggedItems: [],
            dInactiveItems: [],
            dValidatorsInfoError: "",
            dTotals: {},
            dTotalSupply: 0,
            dRecordsCount: 0,
            showRewardsEstimation: appConfig.flags.rewardsEstimation,
            showValidators: true
        };
    },
    methods: {
        /**
         * @param {int} _num
         */
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

.validator-card {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    /* justify-content: space-between; */
}

.validator-card-section,
.epoch-info {
    display: flex;
    flex-direction: column;
    background: #181a1f;
    padding: 20px;
    border-radius: 10px;
    color: #fff;
}
.g-epoch-info {
    background: #181a1f;
    padding: 20px;
    border-radius: 10px;
    color: #fff;
}
.stake-info {
    margin-bottom: 10px;
}

.stake-item {
    display: flex;
    gap: 2rem;
    /* justify-content: space-between; */
    margin: 5px 0;
}

.total-staked-info {
    margin-top: 10px;
}

.epoch-item {
    margin: 5px 0;
}

.stake-label,
.stake-value,
.total-staked,
.daily-rewards {
    color: #ccc;
}

.stake-label {
    font-size: 14px;
}

.stake-value,
.total-staked,
.daily-rewards {
    font-size: 16px;
    font-weight: bold;
}
</style>
