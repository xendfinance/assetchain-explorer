<template>
    <div class="bsinfo">
        <FCard class="bsinfo_block">
            <div class="bsinfo_block-piece">
                <div class="bsinfo_block-label">
                    <Xend />
                    <div>
                        <p class="label-grey">$RWA Token Price</p>

                        <div>
                            <p>
                                <span class="label-white">
                                    {{ "$" + tokenPrice.toFixed(4) }}
                                </span>
                                <span v-if="tokenChange < 0" class="label-red">
                                    {{ tokenChange.toFixed(2) }}%
                                </span>
                                <span v-else class="label-green">
                                    +{{ tokenChange.toFixed(2) }}%
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="border-line-bottom"></div>
                <div class="bsinfo_block-label">
                    <Graph />
                    <div>
                        <p class="label-grey ">$RWA Token Supply</p>
                        <div>
                            <p>
                                <span class="label-white">
                                    {{
                                        "$" +
                                            formatNum(
                                                tokenPrice *
                                                    (chainState.sealedEpoch
                                                        .totalSupply /
                                                        1.0e18)
                                            )
                                    }}</span
                                >
                                <span class="label-grey">
                                    ({{
                                        formatNum(
                                            chainState.sealedEpoch.totalSupply /
                                                1.0e18
                                        ) +
                                            " " +
                                            "RWA"
                                    }})
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-line-right"></div>
            <div class="bsinfo_block-piece">
                <div class="transactions">
                    <div class="bsinfo_block-label">
                        <Transactions />
                        <div>
                            <p class="label-grey">Transactions</p>
                            <div>
                                <p>
                                    <span class="label-white">
                                        {{ formatNum(chainState.transactions) }}
                                    </span>
                                    <!-- <span
                                        v-if="trxVolumePercent.isNegative"
                                        class="label-red"
                                    >
                                        {{ trxVolumePercent.percent }}
                                    </span>
                                    <span v-else class="label-green">
                                        {{ trxVolumePercent.percent }}
                                    </span> -->
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="transactions_second">
                        <p class="label-grey">$RWA Market Cap</p>
                        <p>
                            <span class="label-white"
                                >{{ "$" + formatNum(tokenPrice * marketCap) }}
                            </span>
                            <span class="label-grey">
                                ({{
                                    formatNum(marketCap.toFixed(2)) +
                                        " " +
                                        "RWA"
                                }})
                            </span>
                        </p>
                    </div>
                </div>
                <div class="border-line-bottom"></div>

                <div class="blocks">
                    <div class="bsinfo_block-label">
                        <Timer />
                        <div>
                            <p class="label-grey">Blocks</p>
                            <p class="label-white">
                                {{ formatNum(chainState.blocks) }}
                            </p>
                        </div>
                    </div>
                    <div class="blocks_second">
                        <p class="label-grey">Accounts</p>
                        <p class="label-white">
                            {{ formatNum(chainState.accounts) }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="border-line-right"></div>
            <div class="bsinfo_block-piece">
                <div class="bsinfo_block-label">
                    <div>
                        <p class="label-grey">Total Stake</p>

                        <div>
                            <p>
                                <span class="label-white">
                                    {{ formatNum(activeStakes / 10 ** 18) }}
                                </span>
                                <span class="label-grey font-semibold">
                                    RWA
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="border-line-bottom"></div>
                <div class="bsinfo_block-label">
                    <div>
                        <p class="label-grey ">Validators</p>
                        <div>
                            <p>
                                <span class="label-white">
                                    {{ formatNum(chainState.validators) }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </FCard>
    </div>
</template>

<script>
import FCard from "@/components/core/FCard/FCard.vue";
import { pollingMixin } from "@/mixins/polling.js";
import appConfig from "../../app.config.js";
import gql from "graphql-tag";
import { formatNumberByLocale } from "@/filters.js";

import Xend from "@/assets/svg/Xend.vue";
import Graph from "@/assets/svg/Graph.vue";
import Transactions from "@/assets/svg/Transactions.vue";
import Timer from "@/assets/svg/Timer.vue";

export default {
    name: "BlockscannerInfo",

    components: { FCard, Xend, Graph, Transactions, Timer },

    props: {},

    mixins: [pollingMixin],

    data() {
        return {
            blocksData: [],
            numAnimationDuration: 750,
            chainState: {
                blocks: 0,
                validators: 0,
                accounts: 0,
                transactions: 0,
                sealedEpoch: {}
            },
            trxVolume: [],
            showNetworkNodesMap: appConfig.flags.networkNodesMap,
            showFTMVault: appConfig.flags.ftmVault,
            showDailyBlocks: appConfig.flags.dailyBlocks,
            showDailyTxFees: appConfig.flags.dailyTxFees
        };
    },

    computed: {
        getTrxVolume() {
            return this.trxVolume.length > 1
                ? [...this.trxVolume]
                      .reverse()
                      .slice(0, 2)
                      .map(txv => txv.volume)
                : [];
        },
        trxVolumePercent() {
            let percent = "+0.0%";
            let isNegative = false;
            const CAP = 1000; // Maximum percentage to display

            if (this.getTrxVolume.length) {
                const oldValue = this.getTrxVolume[1];
                const newValue = this.getTrxVolume[0];
                const isPositive = newValue > oldValue;
                isNegative = oldValue > newValue;

                let percentValue;
                if (isPositive) {
                    percentValue = (newValue / oldValue - 1) * 100;
                    if (percentValue > CAP) {
                        percent = `>${CAP}.0%`;
                    } else {
                        percent = `+${percentValue.toFixed(2)}%`;
                    }
                } else if (isNegative) {
                    percentValue = (1 - newValue / oldValue) * 100;
                    if (percentValue > CAP) {
                        percent = `<-${CAP}.0%`;
                    } else {
                        percent = `-${percentValue.toFixed(2)}%`;
                    }
                }
            }

            return { isNegative, percent };
        },
        tokenPrice() {
            return this.$store.state.tokenPrice;
        },
        tokenChange() {
            return this.$store.state.tokenChange;
        },
        marketCap() {
            return this.$store.state.marketCap;
        },
        activeStakes() {
            return this.$store.state.totalStake;
        }
    },

    created() {
        this.updateChainState();
        this.updateVolumeTransaction();
    },

    mounted() {
        this._polling.start(
            "update-net-state",
            () => {
                this.updateChainState();
            },
            5800
        );
    },

    methods: {
        async updateChainState() {
            this.chainState = { ...(await this.fetchState()) };
        },
        async updateVolumeTransaction() {
            this.trxVolume = [...(await this.fetchVolumeTransaction())];
        },

        /**
         * @returns {Promise<Object>}
         */
        async fetchState() {
            const data = await this.$apollo.query({
                query: gql`
                    query State {
                        state {
                            blocks
                            transactions
                            accounts
                            validators
                            sfcLockingEnabled
                            sealedEpoch {
                                id
                                totalSupply
                                baseRewardPerSecond
                            }
                        }
                    }
                `,
                fetchPolicy: "network-only"
            });
            return data.data.state || {};
        },
        async fetchVolumeTransaction() {
            const data = await this.$apollo.query({
                query: gql`
                    query Version {
                        trxVolume {
                            day
                            volume
                            amount
                            gas
                        }
                    }
                `,
                fetchPolicy: "network-only"
            });
            return data.data.trxVolume || [];
        },

        formatNum(_num) {
            return formatNumberByLocale(parseInt(_num), 0);
        }
    }
};
</script>

<style scoped lang="scss">
.label-grey {
    color: #5f667e !important;
}

.label-white {
    // color: #bababa;
    font-weight: 700;
}

.label-red {
    color: rgb(255, 67, 67);
    font-size: 16px;
}

.label-green {
    color: rgb(35, 255, 35);
    font-size: 16px;
}

.bsinfo {
    margin: 20px 0px;
    width: 100%;
    &_block {
        display: flex;
        gap: 10px;
        // width: 100%;
        // justify-content: space-between;

        p {
            padding: 0 !important;
        }

        &-label {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        &-piece {
            display: flex;
            width: 100%;
            flex-direction: column;
            gap: 12px;
            p {
                display: flex;
                gap: 8px;
            }
            &:first-child {
                width: 60%;
            }
            &:nth-child(2) {
                width: 45%;
            }
            &:last-child {
                width: 35%;
            }
        }
    }
}

.transactions,
.blocks {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    &_second {
        display: flex;
        flex-direction: column;
        align-items: end;
    }
}

.border-line {
    &-bottom {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    &-right {
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
}

.total {
    // color: #bababa;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    &_header {
        height: 20px;
        font-size: 18px;
        font-weight: 700;
    }
    &_label {
        font-size: 28px;
        height: 30px;
        font-weight: 700;
    }
}
.font-semibold {
    font-weight: 700;
}
</style>
