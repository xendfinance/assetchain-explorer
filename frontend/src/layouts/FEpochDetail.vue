<template>
    <div class="fepochdetail f-data-layout ">
        <f-card class="margin-bottom">
            <template v-if="!queryError">
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t("epoch.epoch") }}</div>
                    <div class="col">
                        <div class="break-word">{{ id - 1 }}</div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">
                        {{ $t("epoch.end_time") }}
                    </div>
                    <div class="col">
                        <div class="break-word">
                            {{ formatDate(timestampToDate(cEpoch.endTime)) }}
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">
                        {{ $t("epoch.total_base_reward") }}
                    </div>
                    <div class="col">
                        <div class="break-word">
                            <f-t-m-token-value
                                :value="cEpoch.totalBaseRewardWeight"
                                convert
                            />
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">
                        {{ $t("epoch.total_fee") }}
                    </div>
                    <div class="col">
                        <div class="break-word">
                            <!-- <f-t-m-token-value
                                :value="cEpoch.epochFee"
                                convert
                            /> -->
                            <f-t-m-token-value
                                :value="cEpoch.epochFee"
                                convert
                            />
                        </div>
                    </div>
                </div>
                <!-- <div class="row no-collapse">
                    <div class="col-4 f-row-label">
                        {{ $t("epoch.reward_per_epoch") }}
                    </div>
                    <div class="col">
                        <div class="break-word">
                            <f-t-m-token-value :value="3" />
                        </div>
                    </div>
                </div> -->
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">
                        {{ $t("epoch.total_tx_reward") }}
                    </div>
                    <div class="col">
                        <div class="break-word">
                            <f-t-m-token-value
                                :value="cEpoch.totalTxRewardWeight"
                                convert
                            />
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="query-error">{{ queryError }}</div>
            </template>
        </f-card>

        <!-- <f-card>
            <template v-if="!queryError">
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">Validator</div>
                    <div class="col f-row-label">Overall Rewards</div>
                </div>
                <div
                    class="row no-collapse"
                    v-for="itemValid in cEpoch.validatorRewards"
                    :key="itemValid.reward"
                >
                    <div class="col-4 f-row-label">
                        {{ formatHexToInt(itemValid.validatorId) }}
                    </div>
                    <div class="col">
                        <div class="break-word">

                            {{
                                itemValid.reward > 0
                                    ? WEIToFTM(itemValid.reward).toFixed(18)
                                    : 0
                            }}
                            {{ symbol }}
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="query-error">{{ queryError }}</div>
            </template>
        </f-card> -->

        <f-card>
            <template v-if="!queryError">
                <!-- <div class="row no-collapse">
                    <div class="col-4 f-row-label">Validator</div>
                    <div class="col f-row-label">Overall Rewards</div>
                </div>
                <div
                    class="row no-collapse"
                    v-for="itemValid in cEpoch.validatorRewards"
                    :key="itemValid.validatorId"
                >
                    <div class="col-4 f-row-label">
                        {{ formatHexToInt(itemValid.validatorId) }}
                    </div>
                    <div class="col">
                        <div class="break-word">
                            {{
                                itemValid.reward > 0
                                    ? WEIToFTM(itemValid.reward).toFixed(18)
                                    : 0
                            }}
                            {{ symbol }}
                        </div>
                    </div>
                </div> -->

                <!-- New section for Actual Validator Rewards -->
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">Validator</div>
                    <div class="col f-row-label">Overall Rewards</div>
                </div>
                <div
                    class="row no-collapse"
                    v-for="actualReward in sortedActualValidatorRewards"
                    :key="actualReward.id"
                >
                    <div class="col-4 f-row-label">
                        {{ actualReward.id }}
                    </div>
                    <div class="col">
                        <div class="break-word">
                            <f-t-m-token-value
                                :value="actualReward.totalReward"
                                convert
                            />
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="query-error">{{ queryError }}</div>
            </template>
        </f-card>
    </div>
</template>

<script>
import FCard from "../components/core/FCard/FCard.vue";
import gql from "graphql-tag";
import { mapGetters } from "vuex";
import { timestampToDate, formatDate, formatHexToInt } from "../filters.js";
import FTMTokenValue from "@/components/core/FTMTokenValue/FTMTokenValue.vue";
import { WEIToFTM } from "@/utils/transactions.js";

export default {
    components: {
        FTMTokenValue,
        FCard
    },

    props: {
        /** Block number. */
        id: {
            type: Number,
            required: true,
            default: 0
        }
    },

    apollo: {
        epoch: {
            query: gql`
                query EpochById($id: Long) {
                    epoch(id: $id) {
                        id
                        endTime
                        epochFee
                        totalTxRewardWeight
                        totalBaseRewardWeight
                        validatorRewards {
                            validatorId
                            reward
                            __typename
                        }
                        actualValidatorRewards {
                            id
                            totalReward
                            __typename
                        }
                        __typename
                    }
                }
            `,
            variables() {
                return {
                    id: `0x${parseInt(this.id).toString(16)}`
                };
            },
            error(_error) {
                this.queryError = _error.message;
            }
        }
    },

    data() {
        return {
            queryError: "",
            dRecordsCount: 0,
            dTransactions: []
        };
    },

    computed: {
        ...mapGetters(["symbol"]),
        cEpoch() {
            return this.epoch || {};
        },
        sortedActualValidatorRewards() {
            // Sort actualValidatorRewards by totalReward in ascending order
            return this.cEpoch.actualValidatorRewards
                ? [...this.cEpoch.actualValidatorRewards].sort(
                      (a, b) => a.id - b.id
                  )
                : [];
        }
    },

    methods: {
        timestampToDate,
        formatDate,
        formatHexToInt,
        WEIToFTM
    }
};
</script>

<style scoped>
.margin-bottom {
    margin-bottom: 30px;
}
</style>
