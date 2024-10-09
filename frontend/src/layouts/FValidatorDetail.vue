<template>
    <div class="f-validator-detail f-data-layout">
        <template v-if="!dStakerByAddressError">
            <div class="validator_infocards">
                <f-card>
                    <h2>Overview</h2>
                    <div class="vif_row">
                        <div class="col">
                            <div
                                v-show="cStakerName"
                                class="validator-container"
                            >
                                <div class="validator-img">
                                    <img
                                        v-if="cStakerLogoUrl"
                                        :src="cStakerLogoUrl"
                                        :alt="cStakerName"
                                        class="not-fluid"
                                    />
                                    <img
                                        v-else
                                        src="/img/validator.png"
                                        alt="xend logo"
                                        class="not-fluid"
                                        style="width: 32px"
                                    />
                                </div>

                                Validator {{ cStaker.id | formatHexToInt }}

                                <a
                                    v-if="cStakerWebsite"
                                    :href="cStakerWebsite"
                                    target="_blank"
                                    rel="nofollow"
                                    class="validator-website"
                                >
                                    <icon
                                        data="@/assets/svg/external-link-alt.svg"
                                    ></icon>
                                </a>
                            </div>
                        </div>
                        <div class="col">
                            <div v-show="'id' in cStaker">
                                ID {{ cStaker.id | formatHexToInt }}
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            Validator address
                        </div>
                        <div class="col">
                            <div class="break-word">
                                <router-link
                                    :to="{
                                        name: 'address-detail',
                                        params: { id: address }
                                    }"
                                    >{{ address }}</router-link
                                >
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            {{ $t("view_validator_detail.start_epoch") }}
                        </div>
                        <div class="col">
                            <div v-show="'createdEpoch' in cStaker">
                                {{ cStaker.createdEpoch | formatHexToInt }}
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            {{ $t("view_validator_detail.start_time") }}
                        </div>
                        <div class="col">
                            <div v-show="'createdTime' in cStaker">
                                {{
                                    formatDate(
                                        timestampToDate(
                                            formatHexToInt(cStaker.createdTime)
                                        )
                                    )
                                }}
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            {{ $t("view_validator_detail.active") }}
                        </div>
                        <div class="col">
                            <div v-show="'isActive' in cStaker">
                                <f-yes-no
                                    :value="cStaker.isActive"
                                    use-colors
                                />
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            {{ $t("view_validator_detail.online") }}
                        </div>
                        <div class="col">
                            <div v-show="'isOffline' in cStaker">
                                <f-yes-no
                                    :value="!cStaker.isOffline"
                                    use-colors
                                />
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            {{ $t("view_validator_detail.downtime") }}
                        </div>
                        <div class="col">
                            <div v-show="'downtime' in cStaker">
                                {{
                                    clampDowntime(
                                        Math.round(
                                            formatHexToInt(cStaker.downtime) /
                                                10000000
                                        ) / 100
                                    )
                                }}
                                s
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            {{ $t("view_validator_detail.locked_until") }}
                        </div>
                        <div class="col">
                            <div v-show="'lockedUntil' in cStaker">
                                {{
                                    formatDate(
                                        timestampToDate(cStaker.lockedUntil)
                                    )
                                }}
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            {{ $t("view_validator_detail.lock_days") }}
                        </div>
                        <div class="col">
                            <div v-show="'lockedUntil' in cStaker">
                                {{ cLockDays }}
                            </div>
                        </div>
                    </div>
                </f-card>
                <f-card>
                    <h2>Validator stats</h2>
                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            <!-- {{ $t("view_validator_detail.amount_staked") }} -->
                            Validator stake ({{ validatorPercentage }})
                        </div>
                        <div class="col">
                            <div v-show="'stake' in cStaker">
                                {{
                                    formatNumberByLocale(
                                        numToFixed(WEIToFTM(cStaker.stake), 0)
                                    )
                                }}
                                {{ symbol }}
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            Delegator stake ({{ delegatorPercentage }})
                        </div>
                        <div class="col">
                            <div v-show="'delegatedMe' in cStaker">
                                {{
                                    formatNumberByLocale(
                                        numToFixed(
                                            WEIToFTM(cStaker.delegatedMe),
                                            0
                                        )
                                    )
                                }}
                                {{ symbol }}
                            </div>
                        </div>
                    </div>

                    <div class="vif_row">
                        <div class="col-4 f-row-label">
                            {{ $t("view_validator_detail.staking_total") }}
                        </div>
                        <div class="col">
                            <div v-show="'totalStake' in cStaker">
                                {{
                                    formatNumberByLocale(
                                        numToFixed(
                                            WEIToFTM(cStaker.totalStake),
                                            0
                                        )
                                    )
                                }}
                                {{ symbol }}
                            </div>
                        </div>
                    </div>
                    
                </f-card>
            </div>

            <div class="f-subsection">
                <h2 class="h1">
                    {{ $t("view_validator_detail.delegations") }}
                    <span
                        v-if="dDelegationListRecordsCount"
                        class="f-records-count"
                        >({{ dDelegationListRecordsCount }})</span
                    >
                </h2>

                <f-delegation-list
                    :staker-id="cStaker.id"
                    @records-count="onDelegationListRecordsCount"
                />
            </div>
        </template>
        <template v-else>
            <div class="query-error">{{ dStakerByAddressError }}</div>
        </template>
    </div>
</template>

<script>
import FCard from "../components/core/FCard/FCard.vue";
import gql from "graphql-tag";
import {
    formatHexToInt,
    timestampToDate,
    formatNumberByLocale,
    numToFixed,
    clampDowntime,
    formatDate,
    prepareTimestamp
} from "../filters.js";
import { WEIToFTM } from "../utils/transactions.js";
import FDelegationList from "../data-tables/FDelegationList.vue";
import FYesNo from "../components/FYesNo.vue";

import { mapGetters } from "vuex";

const dayS = 60 * 60 * 24;

export default {
    components: {
        FYesNo,

        FDelegationList,
        FCard
    },

    props: {
        /** Validator (staker) address. */
        address: {
            type: String,
            required: true,
            default: ""
        },

        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 20
        }
    },

    apollo: {
        staker: {
            query: gql`
                query StakerByAddress($address: Address!) {
                    staker(address: $address) {
                        id
                        stakerAddress
                        totalStake
                        stake
                        delegatedMe
                        createdEpoch
                        createdTime
                        downtime
                        lockedUntil
                        isActive
                        isOffline
                        stakerInfo {
                            name
                            website
                            contact
                            logoUrl
                        }
                    }
                }
            `,
            variables() {
                return {
                    address: this.address
                };
            },
            error(_error) {
                this.dStakerByAddressError = _error.message;
            }
        }
    },

    data() {
        return {
            dDelegationListRecordsCount: 0,
            dStakerByAddressError: "",
            chartData: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July"
                ],
                datasets: [
                    {
                        label: "My First Dataset",
                        backgroundColor: "#42A5F5",
                        borderColor: "#1E88E5",
                        data: [40, 20, 12, 39, 10, 40, 39],
                        fill: true
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
        };
    },

    computed: {
        ...mapGetters(["symbol"]),

        cStaker() {
            return this.staker || {};
        },

        cStakerName() {
            const { staker } = this;
            console.log("chartData:", this.chartData);

            return staker && staker.stakerInfo && staker.stakerInfo.name
                ? staker.stakerInfo.name
                : this.$t("view_validator_list.unknown");
        },

        cStakerWebsite() {
            const { staker } = this;

            return staker && staker.stakerInfo
                ? staker.stakerInfo.website || staker.stakerInfo.contact
                : "";
        },

        cStakerLogoUrl() {
            const { staker } = this;

            return staker && staker.stakerInfo && staker.stakerInfo.logoUrl
                ? staker.stakerInfo.logoUrl
                : "";
        },

        cDelegationItems() {
            const { cStaker } = this;
            let items = [];

            if (cStaker && cStaker.delegations) {
                items = cStaker.delegations;
            }

            return items;
        },

        cLoading() {
            return this.$apollo.queries.staker.loading;
        },

        cLockDays() {
            const { cStaker } = this;
            const ts =
                cStaker && cStaker.lockedUntil
                    ? prepareTimestamp(cStaker.lockedUntil)
                    : 0;

            return ts > 0
                ? parseInt((ts - Date.now()) / (dayS * 1000), 10)
                : "-";
        },
        validatorPercentage() {
            const { cStaker } = this;
            const validatorstake =
                cStaker && cStaker.stake && cStaker.totalStake
                    ? (cStaker.stake / cStaker.totalStake) * 100
                    : 20;
            return validatorstake.toFixed(2) + "%";
        },
        delegatorPercentage() {
            const { cStaker } = this;
            const delegatortake =
                cStaker && cStaker.delegatedMe && cStaker.totalStake
                    ? (cStaker.delegatedMe / cStaker.totalStake) * 100
                    : 20;
            return delegatortake.toFixed(2) + "%";
        }
    },

    methods: {
        onDelegationListRecordsCount(_num) {
            this.dDelegationListRecordsCount = _num;
        },

        WEIToFTM,
        timestampToDate,
        formatDate,
        formatHexToInt,
        formatNumberByLocale,
        numToFixed,
        clampDowntime
    }
};
</script>

<style lang="scss">
.f-validator-detail {
    .num-block {
        h2 {
            text-align: center;
            margin-top: 16px;
            margin-bottom: 4px;
        }

        .num {
            text-align: center;
            font-weight: bold;
            font-size: $fs48;
        }
    }

    > .f-card {
    }

    .validator-container {
        display: flex;
        align-items: center;
    }

    .validator-img {
        max-width: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-inline-end: 8px;
    }
    .validator-img img {
        width: 30px;
        height: 30px;
    }

    @include links() {
        color: $primary-color;
    }
}

.validator_infocards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
}
.vif_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
@media screen and (max-width: 768px) {
    .validator_infocards {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>
