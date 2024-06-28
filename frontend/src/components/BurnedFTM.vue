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
                <span class="burnedftm_ftm">{{ symbol }}</span>
            </p>
        </FCard>

        <template v-if="blocks.length > 0">
            <FCard class="burned">
                <div
                    v-for="block in blocks"
                    :key="block.blockNumber"
                    class="burnedftm_block"
                    :class="{
                        'burnedftm_block-animate': block.__animate__
                    }"
                    :data-blocknumber="formatHexToInt(block.blockNumber)"
                >
                    <div class="burnedftm_block_burned number">
                        <div class="burnedftm_block_burned_icon">
                            <div class="fsvgicon">
                                <icon
                                    data="@/assets/svg/fire.svg"
                                    width="24"
                                    height="24"
                                    color="#337AFE"
                                    aria-hidden="true"
                                />
                            </div>
                            <div class="burnedftm_block_amount">
                                <span class="burnedftm_block_amount_text"
                                    >Amount (RWA)</span
                                >
                                <span class="burnedftm_block_amount_value">{{
                                    block.ftmValue
                                }}</span>
                            </div>
                        </div>
                        <div class="burnedftm_block_info">
                            <span class="burnedftm_block_info_text">
                                Block</span
                            >
                            <!-- <span class="burnedftm_block_info_blocks">{{
                                formatHexToInt(block.blockNumber)
                            }}</span> -->
                            <router-link
                                class="burnedftm_block_info_blocks"
                                :to="{
                                    name: 'block-detail',
                                    params: {
                                        id: formatHexToInt(block.blockNumber)
                                    }
                                }"
                                :title="formatHexToInt(block.blockNumber)"
                            >
                                {{ formatHexToInt(block.blockNumber) }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </FCard>
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
            console.log(
                formatNumberByLocale(this.totalBurned, 4),
                formatNumberByLocale(zeroBalance, 4),
                "BURNED"
            );
            return formatNumberByLocale(this.totalBurned, 4);
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
.burned {
    padding: 24px 8px !important;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.burnedftm {
    --burnedftm-transition-length: 610ms;
    --burnedftm-border-color: #e6e6e6;

    display: flex;
    align-items: center;
    gap: 16px;

    &_left {
        min-width: 50%;
        width: 100%;
        text-align: center;
        flex: 0.8;
        padding: 62px 20px !important;
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

    .no-markers {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &_block {
        background: var(--f-darker-color);
        border: none;
        font-size: 16px;
        border-bottom: 1px solid #23272e;
        padding: 0 12px;
        padding-bottom: 2px;
        &:last-child {
            border-bottom: none;
        }
        &_burned {
            display: flex;
            justify-content: space-between;
            &_icon {
                display: flex;
            }
        }
        &_amount {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            &_text {
                font-size: 13px;
                color: #6c757d;
            }
            &_value {
                font-size: 15px;
                color: #fff;
                font-weight: 700;
            }
        }
        &_info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            &_text {
                font-size: 13px;
                color: #6c757d;
            }
            &_blocks {
                font-size: 15px;
                color: #337afe !important;
                font-weight: 700;
            }
        }

        .fsvgicon {
            width: 40px;
            height: 40px;
            background-color: #0b131e;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
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
