<template>
    <!--  darkMode ? 'hometransactionlist-dark' : 'hometransactionlist' -->
    <div class="history_card">
        <h2 class="h3">
            {{ $t("view_home.latest_transactions") }}
            <router-link :to="{ name: 'transactions' }" class="link">
                {{ $t("view_home.view_all_transactions") }}
            </router-link>
        </h2>
        <div class="hometransactionlist-dark">
            <transition enter-active-class="fadelong-enter-active">
                <f-data-table
                    v-show="show"
                    :columns="dColumns"
                    :hidden-columns="hiddenColumns"
                    :items="dItems"
                    :loading="cLoading"
                    f-card-off
                    mobile-view
                    first-m-v-column-width="5"
                    fixed-header
                    v-bind="{ ...$attrs, ...$props }"
                    class="f-data-table-body-bg-color"
                >
                    <!-- <template v-slot:column-hash="{ value, column }">
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <router-link
                                :to="{
                                    name: 'transaction-detail',
                                    params: { id: value }
                                }"
                                :title="value"
                                >{{ value | formatHash }}</router-link
                            >
                        </div>
                    </div>
                    <template v-else>
                        <router-link
                            :to="{
                                name: 'transaction-detail',
                                params: { id: value }
                            }"
                            :title="value"
                            >{{ value | formatHash }}</router-link
                        >
                    </template>
                </template>

                <template v-slot:column-timestamp="{ value, column }">
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <timeago
                                :datetime="timestampToDate(value)"
                                :auto-update="1"
                                :converter-options="{ includeSeconds: true }"
                            ></timeago>
                        </div>
                    </div>
                    <template v-else>
                        <timeago
                            :datetime="timestampToDate(value)"
                            :auto-update="1"
                            :converter-options="{ includeSeconds: true }"
                        ></timeago>
                    </template>
                </template>

                <template v-slot:column-address="{ value, column }">
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <router-link
                                :to="{
                                    name: 'address-detail',
                                    params: { id: value }
                                }"
                                :title="value"
                                >{{ value | formatHash }}</router-link
                            >
                        </div>
                    </div>
                    <template v-else>
                        <router-link
                            :to="{
                                name: 'address-detail',
                                params: { id: value }
                            }"
                            :title="value"
                            >{{ value | formatHash }}</router-link
                        >
                    </template>
                </template>

                <template v-slot:column-from="{ value, column }">
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <router-link
                                :to="{
                                    name: 'address-detail',
                                    params: { id: value }
                                }"
                                :title="value"
                                >{{ value | formatHash }}</router-link
                            >
                        </div>
                    </div>
                    <template v-else>
                        <router-link
                            :to="{
                                name: 'address-detail',
                                params: { id: value }
                            }"
                            :title="value"
                            >{{ value | formatHash }}</router-link
                        >
                    </template>
                </template>

                <template v-slot:column-to="{ value, column }">
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <router-link
                                :to="{
                                    name: 'address-detail',
                                    params: { id: value }
                                }"
                                :title="value"
                                >{{ value | formatHash }}</router-link
                            >
                        </div>
                    </div>
                    <template v-else>
                        <router-link
                            :to="{
                                name: 'address-detail',
                                params: { id: value }
                            }"
                            :title="value"
                            >{{ value | formatHash }}</router-link
                        >
                    </template>
                </template>

                <template v-slot:column-amount="{ value, item, column }">
                    <div
                        v-if="column"
                        class="row no-collapse no-vert-col-padding"
                    >
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <template v-if="addressCol">
                                <f-account-transaction-amount
                                    :address="addressCol"
                                    :from="getFrom(item)"
                                    :to="getTo(item)"
                                    :amount="value"
                                />
                            </template>
                            <template v-else>
                                {{ value }}
                            </template>
                        </div>
                    </div>
                    <template v-else>
                        <template v-if="addressCol">
                            <f-account-transaction-amount
                                :address="addressCol"
                                :from="getFrom(item)"
                                :to="getTo(item)"
                                :amount="value"
                            />
                        </template>
                        <template v-else>
                            {{ value }}
                        </template>
                    </template>
                </template> -->
                    <Transactions />

                    <template v-slot:column-hash="{ value, column, col }">
                        <div v-if="column">
                            <div
                                class="row no-collapse no-vert-col-padding mobile"
                            >
                                <p class="col-5 f-row-label">
                                    {{ column.label }}
                                    <icon
                                        data="@/assets/svg/angle-right.svg"
                                        color="#B6B6B6"
                                        width="3px"
                                        height="6px"
                                    ></icon>
                                </p>
                                <div class="col col_hash">
                                    <router-link
                                        class=""
                                        :to="{
                                            name: 'transaction-detail',
                                            params: { id: value }
                                        }"
                                        :title="value"
                                    >
                                        {{ value | formatHash }}
                                    </router-link>
                                </div>
                            </div>
                            <div
                                class="row-2 no-collapse no-vert-col-padding desktop row-svg"
                            >
                                <div class="svg_block">
                                    <Transactions />
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
                                    <div class="col col_hash">
                                        <router-link
                                            :to="{
                                                name: 'transaction-detail',
                                                params: { id: value }
                                            }"
                                            :title="value"
                                        >
                                            {{
                                                value | formatHash
                                            }}</router-link
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-else>
                            <div class="animlist_label">
                                {{ col.label }} &rsaquo;
                            </div>
                            <span>
                                {{ value | formatHash }}
                            </span>
                        </template>
                    </template>

                    <template v-slot:column-timestamp="{ value, column, col }">
                        <div
                            v-if="column"
                            class="row no-collapse no-vert-col-padding"
                        >
                            <div class="col-5 f-row-label">
                                {{ column.label }}
                            </div>
                            <div class="col col_time">
                                <timeago
                                    :datetime="timestampToDate(value)"
                                    :auto-update="1"
                                    :converter-options="{
                                        includeSeconds: true
                                    }"
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
                                    :auto-update="1"
                                    :converter-options="{
                                        includeSeconds: true
                                    }"
                                ></timeago>
                            </span>
                        </template>
                    </template>

                    <template
                        v-slot:column-amount="{ value, item, column, col }"
                    >
                        <div
                            v-if="column"
                            class="row no-collapse no-vert-col-padding"
                        >
                            <div class="col-5 f-row-label">
                                {{ column.label }}
                            </div>
                            <div class="col col_amount">
                                {{ value }}
                            </div>
                        </div>
                        <template v-else>
                            <div class="animlist_label">
                                {{ col.label }}
                            </div>
                            <span> {{ value }} </span>
                        </template>
                    </template>
                </f-data-table>
            </transition>
        </div>
    </div>
</template>

<script>
import { pollingMixin } from "@/mixins/polling.js";
import FDataTable from "@/components/core/FDataTable/FDataTable.vue";
import { cloneObject, getNestedProp } from "@/utils";
import {
    formatHash,
    formatNumberByLocale,
    numToFixed,
    timestampToDate
} from "@/filters.js";
import { WEIToFTM } from "@/utils/transactions.js";
import gql from "graphql-tag";
import { GridRowsAnimation } from "@/utils/GridRowsAnimation.js";
import Transactions from "@/assets/svg/Transactions.vue";

const rowsAnimation = new GridRowsAnimation({
    itemIdPropName: "id",
    rowsSelector: '.hometransactionlist [data-dt-item-id="ITEM_ID"]',
    animationOptions: {
        translateX: ["60%", 0],
        opacity: [0, 1],
        duration: 250
    }
});

export default {
    name: "HomeTransactionList",

    components: { FDataTable, Transactions },

    mixins: [pollingMixin],

    props: {
        // ...FTransactionList.props,
        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 40
        },
        /** Use address column instead of columns `from` and `to`. */
        addressCol: {
            type: String,
            default: ""
        },
        /** Array of column names to be hidden. */
        hiddenColumns: {
            type: Array,
            default() {
                return [];
            }
        }
    },

    data() {
        return {
            show: true,
            dItems: [],
            dHasNext: false,
            // dOutsideData: !!this.items.action,
            dTransactionListError: "",
            dColumns: [
                {
                    name: "hash",
                    label: this.$t("view_transaction_list.tx_hash"),
                    width: "250px",
                    itemProp: `${!this.withoutCursor ? "transaction." : ""}hash`
                },
                {
                    name: "timestamp",
                    label: this.$t("view_transaction_list.time"),
                    itemProp: `${
                        !this.withoutCursor ? "transaction." : ""
                    }block.timestamp`,
                    width: "220px",
                    hidden: this.cMobileView
                },
                {
                    name: "amount",
                    label: `${this.$t("view_transaction_list.amount")} (RWA)`,
                    itemProp: `${
                        !this.withoutCursor ? "transaction." : ""
                    }value`,
                    formatter: _value => {
                        return formatNumberByLocale(
                            numToFixed(WEIToFTM(_value), 2),
                            2
                        );
                    },
                    width: "100px"
                    /*
                    css: {
                        textAlign: 'right'
                    }
*/
                }
            ]
        };
    },

    computed: {
        cLoading() {
            return this.dItems.length === 0;
        }
    },

    created() {
        this.updateItems();
        this._updatingTxs = false;
    },

    mounted() {
        setTimeout(() => {
            this._polling.start(
                "update-transactions",
                () => {
                    if (!this._updatingTxs) {
                        this._updatingTxs = true;
                        this.updateItems(true);
                    }
                },
                3500
            );
        }, 1750);
    },

    methods: {
        async updateItems() {
            this.dItems = await this.fetchData();

            setTimeout(() => {
                rowsAnimation.animate(this.dItems);
            }, 1);

            this._updatingTxs = false;
        },

        /**
         * @returns {Promise<Array>}
         */
        async fetchData() {
            const data = await this.$apollo.query({
                query: gql`
                    query TransactionList($cursor: Cursor, $count: Int!) {
                        transactions(cursor: $cursor, count: $count) {
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            totalCount
                            edges {
                                cursor
                                transaction {
                                    hash
                                    from
                                    to
                                    value
                                    gasUsed
                                    block {
                                        number
                                        timestamp
                                    }
                                }
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
                data.data &&
                    data.data.transactions &&
                    data.data.transactions.edges
                    ? data.data.transactions.edges
                    : []
            );
        },

        /**
         * Get item's 'from' value.
         *
         * @param {Object} _item
         * @return {*}
         */
        getFrom(_item) {
            return getNestedProp(
                _item,
                `${!this.withoutCursor ? "transaction." : ""}from`
            );
        },

        /**
         * Get item's 'to' value.
         *
         * @param {Object} _item
         * @return {*}
         */
        getTo(_item) {
            return getNestedProp(
                _item,
                `${!this.withoutCursor ? "transaction." : ""}to`
            );
        },

        onRowAction(item) {
            this.$router.push({
                name: "transaction-detail",
                params: { id: item.transaction.hash }
            });
        },

        WEIToFTM,
        timestampToDate,
        numToFixed,
        formatHash,
        formatNumberByLocale
    }
};
</script>

<style lang="scss" scoped>
.f-row-label {
    max-width: 100%;
    color: var(--f-link-color);
    font-size: 13px;
}

.col_hash {
    font-weight: 700;
    color: #337afe;
    a {
        color: #337afe;
    }
    font-size: 15px;
}

.col_time,
.col_amount {
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
