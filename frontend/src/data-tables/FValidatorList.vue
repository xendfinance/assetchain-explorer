<template>
    <div class="validator-list-dt">
        <template v-if="!dValidatorListError">
            <f-data-table
                :columns="dColumns"
                :items="dItems"
                :mobile-view="cMobileView"
                :loading="cLoading"
                :code="code"
                first-m-v-column-width="6"
                fixed-header
                class="f-data-table-body-bg-color"
            >
                <template v-slot:column-validator="{ item, column }">
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-6 f-row-label">{{ column.label }}</div>
                        <div class="col break-word">
                            <div class="validator-info">
                                <div class="validator-img">
                                    <img
                                        v-if="item.stakerInfo.logoUrl"
                                        :src="item.stakerInfo.logoUrl"
                                        :alt="item.stakerInfo.name"
                                        class="not-fluid"
                                    />
                                    <img
                                        v-else
                                        src="../assets/img/validator.png"
                                        alt="default logo"
                                        class="not-fluid"
                                    />
                                </div>
                                <div class="validator-details">
                                    <div class="validator-name">
                                        {{ item.stakerInfo.name }}
                                    </div>
                                    <div class="validator-address">
                                        <router-link
                                            :to="{
                                                name: 'validator-detail',
                                                params: {
                                                    address: item.stakerAddress
                                                }
                                            }"
                                            :title="item.stakerAddress"
                                            >{{
                                                item.stakerAddress | formatHash
                                            }}</router-link
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-else>
                        <div class="validator-info">
                            <div class="validator-img">
                                <img
                                    v-if="item.stakerInfo.logoUrl"
                                    :src="item.stakerInfo.logoUrl"
                                    :alt="item.stakerInfo.name"
                                    class="not-fluid"
                                />
                                <img
                                    v-else
                                    src="../assets/img/validator.png"
                                    alt="default logo"
                                    class="not-fluid"
                                />
                            </div>
                            <div class="validator-details">
                                <div class="validator-name">
                                    {{ item.stakerInfo.name }}
                                </div>
                                <div class="validator-address">
                                    <router-link
                                        :to="{
                                            name: 'validator-detail',
                                            params: {
                                                address: item.stakerAddress
                                            }
                                        }"
                                        :title="item.stakerAddress"
                                        >{{
                                            item.stakerAddress | formatHash
                                        }}</router-link
                                    >
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template v-slot:column-status="{ item }">
                    <span
                        :class="{
                            'status-flagged': item.isCheater,
                            'status-offline': !item.isCheater && item.isOffline,
                            'status-inactive':
                                !item.isActive &&
                                !item.isOffline &&
                                !item.isCheater,
                            'status-active':
                                item.isActive &&
                                !item.isOffline &&
                                !item.isCheater
                        }"
                    >
                        {{
                            item.isCheater
                                ? "Flagged"
                                : item.isOffline
                                ? "Offline"
                                : item.isActive
                                ? "Active"
                                : "Inactive"
                        }}
                    </span>
                </template>

                <!-- Other column templates remain unchanged -->
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ dValidatorListError }}</div>
        </template>
    </div>
</template>

<script>
import FDataTable from "../components/core/FDataTable/FDataTable.vue";
import gql from "graphql-tag";
import { WEIToFTM } from "../utils/transactions.js";
import {
    formatHexToInt,
    timestampToDate,
    numToFixed,
    formatNumberByLocale,
    clampDowntime
} from "../filters.js";
import {
    sortByHex
    // sortByLocaleString,
    // sortByLocaleString,
    // sortByString
} from "../utils/array-sorting.js";
import { cloneObject } from "@/utils";
// import { shuffle } from "@/utils/array.js";

export default {
    components: {
        FDataTable
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
                // let remove = [];

                if (_key === "stakers") {
                    data = [..._data.data.stakers];

                    // shuffle(data);
                    data.sort((a, b) => {
                        const idA = parseInt(a.id, 16);
                        const idB = parseInt(b.id, 16);
                        return idA - idB;
                    });

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
                            _item.stakerInfo.name = `Validator ${_item.id.slice(
                                2
                            )}`;
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
                        this.$emit(
                            "validator-list-offline",
                            offline.map(idx => cloneObject(data[idx]))
                        );
                    }

                    // flagged validators
                    if (flagged.length > 0) {
                        this.$emit(
                            "validator-list-flagged",
                            flagged.map(idx => cloneObject(data[idx]))
                        );
                    }

                    // if (remove.length > 0) {
                    //     this.removeItemsByIndices(data, remove);
                    // }

                    // // inactive validators
                    // remove = [];
                    data.forEach((_item, _idx) => {
                        if (!_item.isActive) {
                            inactive.push(cloneObject(data[_idx]));
                        }
                    });

                    if (inactive.length > 0) {
                        this.$emit("validator-list-inactive", inactive);
                    }

                    this.dItems = data;
                    this.stakersLoaded = true; // Set flag when stakers are loaded
                    this.updateItemsWithFees();

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
        },
        epoch: {
            query: gql`
                query EpochById($id: Long) {
                    epoch(id: $id) {
                        id
                        epochFee
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
                    id: `0x${parseInt(844).toString(16)}`
                };
            },
            result(_data, _key) {
                if (_key === "epoch") {
                    const data = [_data.data.epoch];
                    console.log(
                        data[0].actualValidatorRewards,
                        "actualValidatorRewards"
                    );

                    // Build a mapping of validator IDs to their rewards
                    this.fees = {};
                    data[0].actualValidatorRewards.forEach(reward => {
                        this.fees[reward.id] = reward.totalReward;
                    });
                    console.log(this.fees, "fees");

                    this.epochLoaded = true; // Set flag when epoch data is loaded
                    this.updateItemsWithFees();
                }
            },
            skip() {
                return false;
            },
            error(_error) {
                this.dValidatorListError = _error.message;
            }
        }
    },

    created() {
        if (this.items.length > 0) {
            this.dItems = this.items;
        }
    },

    data() {
        return {
            dItems: [],
            dValidatorListError: "",
            dColumns: [
                // {
                //     name: "logo",
                //     label: this.$t("view_validator_list.logo"),
                //     itemProp: "stakerInfo.logoUrl",
                //     cssClass: "align-center",
                //     width: "80px"
                // },
                // {
                //     name: "name",
                //     label: this.$t("view_validator_list.name"),
                //     itemProp: "stakerInfo.name",
                //     sortFunc: sortByLocaleString,
                //     width: "200px"
                // },
                {
                    name: "validator",
                    label: this.$t("view_validator_list.name"),
                    width: "300px"
                },
                {
                    name: "id",
                    label: this.$t("view_validator_list.id"),
                    formatter: formatHexToInt,
                    sortFunc: sortByHex,
                    width: "80px"
                },
                // {
                //     name: "stakerAddress",
                //     label: this.$t("view_validator_list.address"),
                //     sortFunc: sortByString,
                //     width: "200px"
                // },
                {
                    name: "downtime",
                    label: this.$t("view_validator_list.downtime"),
                    formatter: _value =>
                        `${clampDowntime(
                            Math.round(formatHexToInt(_value) / 10000000) / 100
                        )} s`,
                    sortFunc: sortByHex,
                    width: "140px"
                },
                {
                    name: "stake",
                    label: this.$t("view_validator_list.self_staked"),
                    formatter: _value =>
                        formatNumberByLocale(
                            numToFixed(WEIToFTM(_value), 0),
                            0
                        ),
                    sortFunc: sortByHex,
                    cssClass: "align-end"
                },
                {
                    name: "delegatedMe",
                    label: this.$t("view_validator_list.delegated"),
                    formatter: _value =>
                        formatNumberByLocale(
                            numToFixed(WEIToFTM(_value), 0),
                            0
                        ),
                    sortFunc: sortByHex,
                    cssClass: "align-end"
                },
                {
                    name: "status", // Add new status column
                    label: "Status",
                    formatter: (_value, _item) => {
                        if (_item.isCheater) return "Flagged";
                        if (_item.isOffline) return "Offline";
                        return _item.isActive ? "Active" : "Inactive";
                    },
                    width: "100px"
                },
                // computed
                {
                    name: "totalStake",
                    label: this.$t("view_validator_list.total_staked"),
                    formatter: _value =>
                        formatNumberByLocale(
                            numToFixed(WEIToFTM(_value), 0),
                            0
                        ),
                    sortFunc: sortByHex,
                    // sortDir: 'desc',
                    cssClass: "align-end"
                },
                {
                    name: "actualFee",
                    label: "Validator Fee Reward(RWA)",
                    formatter: _value =>
                        formatNumberByLocale(
                            numToFixed(this.WEIToFTM(_value), 0),
                            0
                        ),
                    sortFunc: sortByHex,
                    cssClass: "align-end"
                }
            ],
            fees: {}, // New property to store fees
            stakersLoaded: false, // Flag to check if stakers data is loaded
            epochLoaded: false
        };
    },

    computed: {
        cItems() {
            return this.dItems.map(v => ({
                name: `Validator ${Number(v.id)}`,
                ...v
            }));
        },
        /**
         * Property is set to `true`, if 'tvalidator-list-dt-mobile-view' breakpoint is reached.
         *
         * @return {Boolean}
         */
        cMobileView() {
            const dataTableBreakpoint = this.$store.state.breakpoints[
                "validator-list-dt-mobile-view"
            ];

            return dataTableBreakpoint && dataTableBreakpoint.matches;
        },

        cLoading() {
            return this.loading || this.$apollo.queries.stakers.loading;
        }
    },

    methods: {
        sortDesc(a, b) {
            return b - a;
        },
        hexToDecimal(hex) {
            // Remove '0x' prefix if present
            hex = hex.replace(/^0x/, "");
            return parseInt(hex, 16).toString();
        },
        removeItemsByIndices(_array = [], _indices = []) {
            _indices.sort(this.sortDesc);
            _indices.forEach(_idx => {
                _array.splice(_idx, 1);
            });
        },
        // updateItemsWithFees() {
        //     if (this.stakersLoaded && this.epochLoaded) {
        //         console.log("Stakers and epoch data loaded", this.fees);
        //         this.dItems = this.dItems.map(item => {
        //             console.log(`Processing item with id: ${item.id}`);
        //             const fee = this.fees[item.id];
        //             console.log(`Fee for item ${item.id}:`, fee);
        //             return {
        //                 ...item,
        //                 actualFee: fee || 0
        //             };
        //         });
        //         console.log(this.dItems, "Updated dItems with fees");
        //     }
        // },
        updateItemsWithFees() {
            if (this.stakersLoaded && this.epochLoaded) {
                console.log("Stakers and epoch data loaded", this.fees);

                // Convert fee keys to decimal
                const decimalFees = Object.entries(this.fees).reduce(
                    (acc, [key, value]) => {
                        acc[this.hexToDecimal(key)] = value;
                        return acc;
                    },
                    {}
                );

                console.log("Decimal fees:", decimalFees);

                this.dItems = this.dItems.map(item => {
                    const decimalId = this.hexToDecimal(item.id);
                    console.log(
                        `Processing item with id: ${item.id}, decimal id: ${decimalId}`
                    );
                    const fee = decimalFees[decimalId];
                    console.log(`Fee for item ${decimalId}:`, fee);
                    return {
                        ...item,
                        actualFee: fee || 0
                    };
                });
                console.log(this.dItems, "Updated dItems with fees");
            }
        },
        WEIToFTM,
        timestampToDate,
        numToFixed,
        clampDowntime
    }
};
</script>

<style lang="scss">
.validator-list-dt {
    .validator-info {
        display: flex;
        align-items: center;
    }

    .mobile-item {
        @media (max-width: 600px) {
            gap: 2px;
        }
    }

    .offline {
        color: $error-color;
        font-weight: bold;
    }

    @include links() {
        color: $primary-color;
        font-weight: 700;
    }

    .validator-img {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-inline-end: 8px;
        max-width: fit-content;
    }
    .validator-img img {
        width: 30px;
        height: 30px;
    }

    .status-inactive {
        color: $warning-color;
    }

    .status-offline {
        color: $error-color;
    }

    .status-flagged {
        color: red;
        font-weight: bold;
    }

    .status-active {
        color: $success-color;
    }
}
</style>
