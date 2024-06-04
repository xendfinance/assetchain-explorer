<template>
    <div class="burnedftm">
        <!-- <div class="burnedftm_left">
            <p class="burnedftm_amount number">
                {{ cTotalBurned }}
                <span class="burnedftm_ftm">{{ symbol }}</span>
            </p>
        </div> -->
        <FCard class="burnedftm_left">
            <p class="burnedftm_amount number">
                {{ cTotalBurned }}
                <!-- <span class="burnedftm_ftm">FTM</span> -->
                <span class="burnedftm_ftm">{{ symbol }}</span>
            </p>
        </FCard>

        <template v-if="blocks.length > 0">
            <ul class="no-markers">
                <!-- <li
                    v-for="block in blocks"
                    :key="block.blockNumber"
                    class="burnedftm_block"
                    :class="{ 'burnedftm_block-animate': block.__animate__ }"
                >
                    <div class="burnedftm_block_burned number">
                        <span class="fsvgicon">
                            <icon
                                data="@/assets/svg/fire.svg"
                                width="20"
                                height="20"
                                color="#ff711f"
                                aria-hidden="true"
                            />
                        </span>
                        <span>{{ block.ftmValue }}</span>
                    </div>
                    <div class="burnedftm_block_info">
                        Block {{ formatHexToInt(block.blockNumber) }} <br />
                        <timeago
                            :datetime="timestampToDate(block.timestamp)"
                            :auto-update="1"
                            :converter-options="{ includeSeconds: true }"
                        ></timeago>
                    </div>
                </li> -->
                <li
                    v-for="block in blocks"
                    :key="block.blockNumber"
                    class="burnedftm_block"
                    :class="{ 'burnedftm_block-animate': block.__animate__ }"
                    :data-blocknumber="formatHexToInt(block.blockNumber)"
                >
                    <div class="burnedftm_block_burned number">
                        <span class="fsvgicon">
                            <icon
                                data="@/assets/svg/fire.svg"
                                width="20"
                                height="20"
                                color="#337AFE"
                                aria-hidden="true"
                            />
                        </span>
                        <span>{{ block.ftmValue }}</span>
                    </div>
                    <div class="burnedftm_block_info">
                        Block {{ formatHexToInt(block.blockNumber) }} <br />
                    </div>
                </li>
            </ul>
        </template>
    </div>
</template>

<script>
import { pollingMixin } from "@/mixins/polling.js";
import gql from "graphql-tag";
import { cloneObject, defer } from "@/utils/index.js";
import {
    formatHexToInt,
    formatNumberByLocale,
    timestampToDate
} from "@/filters.js";
import { mapGetters } from "vuex";
import { toInt } from "../utils/big-number";
import FCard from "@/components/core/FCard/FCard.vue";

export default {
    name: "BurnedFTM",
    components: { FCard },

    mixins: [pollingMixin],

    props: {
        /** Maximum amount of displayed blocks */
        maxBlocks: {
            type: Number,
            default: 3
        }
    },

    data() {
        return {
            totalBurned: 0,
            blocks: []
        };
    },

    computed: {
        ...mapGetters(["symbol", "zeroAccBalance"]),
        tokenPrice() {
            return this.$store.state.tokenPrice;
        },

        cTotalBurned() {
            const zeroBalance = this.$defi.fromTokenValue(this.zeroAccBalance, {
                decimals: 18
            });
            return formatNumberByLocale(this.totalBurned + zeroBalance, 4);
        }
    },

    mounted() {
        setTimeout(() => {
            this.update();
        }, 3050);

        this._polling.start(
            "update-burned-ftm",
            () => {
                this.update();
            },
            5300
        );
    },

    methods: {
        toInt,
        async update() {
            this.totalBurned = await this.getFtmBurnedTotal();
            this.setBlocks(await this.getFtmLatestBlockBurnList());
        },

        setBlocks(newBlocks) {
            let blocks;
            let newBlocksLen = newBlocks.length;

            if (newBlocksLen > 0) {
                blocks = [...newBlocks, ...this.blocks];

                if (blocks.length > this.maxBlocks) {
                    blocks = blocks.slice(0, this.maxBlocks);
                }

                this.blocks = blocks;

                this.animateBlocks(newBlocksLen, this.blocks);
            }
        },

        animateBlocks(numBlocks, blocks) {
            defer(() => {
                const blocksLen = blocks.length;

                if (numBlocks > blocksLen) {
                    numBlocks = blocksLen;
                }

                for (let i = 0; i < numBlocks; i++) {
                    // blocks[i].__animate__ = true;
                    // blocks[i] = { ...blocks[i], __animate__: true };
                    this.$set(blocks[i], "__animate__", true);
                }
            }, 30);
        },

        /**
         * @returns {Promise<Array>}
         */
        async getFtmLatestBlockBurnList(count = this.maxBlocks) {
            const data = await this.$apollo.query({
                query: gql`
                    query GetFtmLatestBlockBurnList($count: Int = 25) {
                        ftmLatestBlockBurnList(count: $count) {
                            blockNumber
                            timestamp
                            ftmValue
                        }
                    }
                `,
                variables: {
                    count
                },
                fetchPolicy: "network-only"
            });

            return cloneObject(
                (data.data && data.data.ftmLatestBlockBurnList) || []
            );
        },

        /**
         * @returns {Promise<Array>}
         */
        async getFtmBurnedTotal() {
            const data = await this.$apollo.query({
                query: gql`
                    query GetFtmBurnedTotalAmount {
                        ftmBurnedTotalAmount
                    }
                `,
                fetchPolicy: "network-only"
            });

            return (data.data && data.data.ftmBurnedTotalAmount) || 0;
        },

        timestampToDate,
        formatHexToInt
    }
};
</script>

<style lang="scss">
.burnedftm {
    --burnedftm-transition-length: 610ms;
    --burnedftm-border-color: #e6e6e6;

    display: flex;
    align-items: center;
    gap: 16px;

    &_left {
        max-width: 50%;
        width: 100%;
        text-align: center;
        flex: 0.8;
        padding: 50px 20px !important;
    }

    &_amount {
        font-size: 44px;
    }

    &_amount_usd {
        font-size: 16px;
    }

    &_ftm {
        color: $light-gray-color;
        font-size: 1.125rem;
    }

    ul {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--f-spacer-1);
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .no-markers {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    // &_block {
    //     display: flex;
    //     align-items: center;
    //     opacity: 0;
    //     padding: 10px 15px;
    //     transition: opacity var(--burnedftm-transition-length) ease;

    //     &-animate {
    //         opacity: 1;
    //     }

    //     > * {
    //         flex: 1;
    //     }

    //     &_burned {
    //         display: flex;
    //         justify-items: center;
    //         font-size: 20px;
    //         font-weight: 700;

    //         .fsvgicon {
    //             margin-top: -2px;
    //             margin-right: 3px;
    //         }
    //     }

    //     &_info {
    //         font-size: 16px;
    //         text-align: end;
    //         line-height: 1.15;
    //         font-weight: 700;
    //     }

    //     + .burnedftm_block {
    //         border-top: 1px solid var(--burnedftm-border-color);
    //     }
    // }

    &_block {
        background: var(--f-darker-color);
        border: none;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        padding: 10px 15px 10px 15px;
        font-size: 16px;

        &:hover {
            background: var(--f-darker-color-2);
        }

        .fsvgicon {
            margin-right: 9px;
        }
    }
}

@include media-max($bp-medium) {
    .burnedftm {
        flex-direction: column;

        &_left {
            flex: none;
            margin-bottom: 24px;
            max-width: 100%;
            width: 100%;
        }

        ul {
            width: 100%;
            flex: none;
        }

        &_amount {
            font-size: 44px;
            padding-bottom: 0;
        }

        &_amount_usd {
            font-size: 16px;
        }
    }
}
</style>
