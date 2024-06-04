<template>
    <div class="history_card">
        <h2 class="h3">
            {{ $t("view_home.latest_blocks") }}
            <router-link :to="{ name: 'blocks' }" class="link">
                All blocks
            </router-link>
        </h2>
        <div class="homeblocklist animlist">
            <f-data-table
                v-show="show"
                :columns="dColumns"
                :items="dItems"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                fixed-header
                f-card-off
                mobile-view
                v-bind="{ ...$attrs, ...$props }"
                class="f-data-table-body-bg-color"
            >
                <template v-slot:column-block="{ value, column, col }">
                    <div v-if="column">
                        <div class="row no-collapse no-vert-col-padding mobile">
                            <!-- <div class="col-4 f-row-label">{{ column.label }}</div> -->
                            <p class="col-4 f-row-label ">
                                {{ column.label }}
                                <icon
                                    data="@/assets/svg/angle-right.svg"
                                    color="#B6B6B6"
                                    width="3px"
                                    height="6px"
                                ></icon>
                            </p>
                            <div class="col col_block">
                                <router-link
                                    :to="{
                                        name: 'block-detail',
                                        params: { id: value }
                                    }"
                                    :title="value"
                                    >{{ value }}</router-link
                                >
                            </div>
                        </div>
                        <div
                            class="row-2 no-collapse no-vert-col-padding desktop row-svg"
                        >
                            <div class="svg_block">
                                <Blocks />
                            </div>
                            <div>
                                <p class="col-5 f-row-label">
                                    {{ column.label }}
                                    <icon
                                        data="@/assets/svg/angle-right.svg"
                                        color="#B6B6B6"
                                        width="3px"
                                        height="6px"
                                    ></icon>
                                </p>
                                <div class="col col_block ">
                                    <router-link
                                        :to="{
                                            name: 'block-detail',
                                            params: { id: value }
                                        }"
                                        :title="value"
                                    >
                                        {{ value | formatHash }}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-else>
                        <div class="animlist_label">
                            {{ col.label }} &rsaquo;
                        </div>
                        <span>{{ value }} </span>
                    </template>
                </template>

                <template v-slot:column-age="{ value, column, col }">
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-4 f-row-label ">
                            {{ column.label }}
                        </div>
                        <div class="col col_age">
                            <timeago
                                :datetime="timestampToDate(value)"
                                :auto-update="1"
                                :converter-options="{ includeSeconds: true }"
                            ></timeago>
                        </div>
                    </div>
                    <template v-else>
                        <div class="animlist_label">
                            {{ col.label }}
                        </div>
                        <span>
                            <timeago
                                :datetime="timestampToDate(value)"
                                :auto-update="5"
                                :converter-options="{ includeSeconds: true }"
                            ></timeago>
                        </span>
                    </template>
                </template>

                <template
                    v-slot:column-transaction_count="{ value, column, col }"
                >
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-4 f-row-label ">
                            {{ column.label }}
                        </div>
                        <div class="col col_tx">{{ value }}</div>
                    </div>
                    <template v-else>
                        <div class="animlist_label">
                            {{ col.label }}
                        </div>
                        <span>{{ value }}</span>
                    </template>
                </template>
            </f-data-table>
        </div>
    </div>
</template>

<script>
import FBlockList from "@/data-tables/FBlockList.vue";
import FDataTable from "@/components/core/FDataTable/FDataTable.vue";
import { WEIToFTM } from "@/utils/transactions.js";
import { formatHexToInt, timestampToDate } from "@/filters.js";
import gql from "graphql-tag";
import { cloneObject } from "@/utils";
import { pollingMixin } from "@/mixins/polling.js";
import { GridRowsAnimation } from "@/utils/GridRowsAnimation.js";
import Blocks from "../assets/svg/Blocks.vue";

const rowsAnimation = new GridRowsAnimation({
    itemIdPropName: "id",
    rowsSelector: '.homeblocklist [data-dt-item-id="ITEM_ID"]',
    animationOptions: {
        translateX: ["-60%", 0],
        opacity: [0, 1],
        duration: 250
    }
});

export default {
    name: "HomeBlockList",

    mixins: [pollingMixin],

    components: { FDataTable, Blocks },

    props: {
        ...FBlockList.props
    },

    data() {
        return {
            dItems: [],
            dHasNext: false,
            dColumns: [
                {
                    name: "block",
                    label: this.$t("view_block_list.block"),
                    itemProp: "block.number",
                    formatter: formatHexToInt,
                    width: "160px"
                },
                {
                    name: "age",
                    label: this.$t("view_block_list.age"),
                    itemProp: "block.timestamp"
                },
                {
                    name: "transaction_count",
                    label: this.$t("view_block_list.transaction_count"),
                    itemProp: "block.transactionCount",
                    width: "140px"
                }
            ],
            show: true
        };
    },

    computed: {
        cLoading() {
            return this.dItems.length === 0;
        }
    },

    created() {
        this.updateItems();
    },

    mounted() {
        // this.dColumns[4].width = '100px';
        // console.log(JSON.stringify(this.dColumns[4]));

        this._polling.start(
            "update-blocks",
            () => {
                this.updateItems(true);
            },
            3500
        );
    },

    methods: {
        async updateItems() {
            this.dItems = await this.fetchData();

            setTimeout(() => {
                rowsAnimation.animate(this.dItems);
            }, 1);
        },

        /**
         * @returns {Promise<Array>}
         */
        async fetchData() {
            const data = await this.$apollo.query({
                query: gql`
                    query BlockList($cursor: Cursor, $count: Int!) {
                        blocks(cursor: $cursor, count: $count) {
                            totalCount
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            edges {
                                block {
                                    hash
                                    number
                                    timestamp
                                    transactionCount
                                    gasUsed
                                }
                                cursor
                            }
                        }
                    }
                `,
                variables: {
                    cursor: null,
                    count: this.itemsPerPage
                },
                fetchPolicy: "network-only"
            });

            return cloneObject(
                data.data && data.data.blocks && data.data.blocks.edges
                    ? data.data.blocks.edges
                    : []
            );
        },

        onRowAction(item) {
            this.$router.push({
                name: "block-detail",
                params: { id: item.block.number }
            });
        },

        WEIToFTM,
        timestampToDate
    }
};
</script>

<style lang="scss" scoped>
.f-row-label {
    max-width: 100%;
    color: var(--f-link-color);
    font-size: 13px;
}

.col_block {
    font-weight: 700;
    color: #337afe !important;
    font-size: 15px;
    a {
        color: #337afe !important;
    }
}

.col_age,
.col_tx {
    font-weight: 700;
    font-size: 15px;
    // color: #bababa;
}

.row-svg {
    @media (min-width: 620px) {
        display: flex;
        align-items: center;
        margin: 0;
        padding-left: 28px;
    }
}

.svg_block {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: #0b131e;
    border-radius: 4px;
}

.history_card {
    background: rgb(24, 26, 32);
    border-radius: 12px;
    padding: 6px 0px;
}

.desktop {
    display: none;
    @media (min-width: 620px) {
        display: flex;
    }
}

.mobile {
    @media (min-width: 620px) {
        display: none !important;
    }
}

.h3 {
    margin: 10px 15px 15px 15px;
    .link {
        font-size: 15px;
        font-weight: 700;
    }
}
h2 {
    // color: #bababa;
}
</style>
