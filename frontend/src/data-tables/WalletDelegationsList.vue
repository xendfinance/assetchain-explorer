<template>
    <f-data-table
        fixed-header
        :columns="columns"
        :items="localItems"
        :loading="loading"
        force-loading
        class="f-data-table-body-bg-color border-none"
        @action="unstake"
        @claim="claim"
    >
        <template v-slot:after-table>
            <div v-if="showFTMVault" class="tooltip-table">
                <f-info
                    show-on-hover
                    window-class="light"
                    window-style="max-width: 350px;"
                >
                    In this block you can stake your RWA tokens.
                </f-info>
            </div>
            <div class="after-table">
                <div class="add-stake">
                    <button
                        v-if="!address"
                        class="btn-delegation"
                        @click="$emit('connect')"
                    >
                        <span class="connect">Connect wallet</span>
                    </button>
                    <router-link v-else to="/delegate" class="btn-delegation">
                        <span>+Add Stake</span>
                    </router-link>
                </div>
            </div>
        </template>
    </f-data-table>
</template>

<script>
import FDataTable from "@/components/core/FDataTable/FDataTable.vue";
import appConfig from "../../app.config.js";
import FInfo from "@/components/core/FInfo/FInfo.vue";
// import FSelect from "@/components/core/FSelect/FSelect.vue";
import { formatNumberByLocale } from "../filters.js";
// import gql from "graphql-tag";
import { mapState } from "vuex";

export default {
    components: {
        FDataTable,
        FInfo
        // FSelect
    },
    props: {
        columns: { type: Array },
        items: { type: Array },
        loading: { type: Boolean }
    },
    data() {
        return {
            showFTMVault: appConfig.flags.ftmVault,
            selectedValue: "",
            minStakingAmount: 0,
            ut: 0,
            // validators: [],
            localItems: [...this.items]
        };
    },

    methods: {
        unstake(item) {
            this.$emit("unstake", item);
        },
        claim(item) {
            this.$emit("claim", item);
        },
        onSelect(value) {
            this.selectedValue = value.name;
            this.minStakingAmount = value.minStakingAmount;
            this.ut = value.ut;
        },

        // async fetchStakers() {
        //     try {
        //         const { data } = await this.$apollo.query({
        //             query: gql`
        //                 query Stakers {
        //                     stakers {
        //                         id
        //                         stakerAddress
        //                         isOffline
        //                         isCheater
        //                         isActive
        //                         createdTime
        //                         stake
        //                         totalStake
        //                         delegatedMe
        //                         downtime
        //                         stakerInfo {
        //                             name
        //                             website
        //                             contact
        //                             logoUrl
        //                         }
        //                     }
        //                 }
        //             `,
        //             fetchPolicy: "network-only"
        //         });

        //         const validatorsMap = data.stakers.reduce((acc, curr) => {
        //             acc[curr.id] = curr.stakerInfo.name;
        //             return acc;
        //         }, {});

        //         const itemsWithHexId = this.items.map(item => ({
        //             ...item,
        //             id: "0x" + item.id.toString(16)
        //         }));

        //         itemsWithHexId.forEach(item => {
        //             if (validatorsMap[item.id]) {
        //                 item.stakingName = validatorsMap[item.id];
        //             }
        //         });

        //         const itemsWithDecimalId = itemsWithHexId.map(item => ({
        //             ...item,
        //             id: parseInt(item.id, 16)
        //         }));

        //         this.items = itemsWithDecimalId;
        //     } catch (error) {
        //         console.error("Error fetching stakers:", error);
        //     }
        // },
        formatNumberByLocale
    },

    computed: {
        stake() {
            return this.items
                .reduce((acc, curr) => (acc += +curr.amount), 0)
                .toFixed(2);
        },
        cashback() {
            if (this.stake && this.minStakingAmount && this.ut) {
                return (
                    (Number(this.stake) / this.minStakingAmount) * this.ut * 100
                );
            }
            return 0;
        },
        ...mapState({
            address: state => state.address
        })
    },
    watch: {
        items(newItems) {
            this.localItems = [...newItems];
        }
    }
    // created() {
    //     this.fetchStakers();
    // }
};
</script>
<style lang="scss">
.connect {
    color: white !important;
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
    border: 2px solid #337afe !important;
    transition: 200ms;
    font-size: 18px;
    font-weight: 700;
    border-radius: 100px;
    span {
        color: var(--btn-delegation-color);
    }
    &:active {
        background-color: #337afe;
        border: 1px solid #337afe;
        span {
            color: white;
        }
    }
    @media (min-width: 768px) {
        &:hover {
            background-color: #337afe;
            border: 1px solid #337afe;
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
        // @include links() {
        //     border: 2px solid #337AFE;
        //     &:hover {
        //         border: none;
        //     }
        // }
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

.border-none {
    .table-item {
        border-bottom: none;
    }
}
</style>
