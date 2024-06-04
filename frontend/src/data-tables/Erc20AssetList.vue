<template>
    <div class="address-asset-list-dt">
        <f-data-table
            :columns="columns"
            :items="cTokens"
            first-m-v-column-width="6"
            class="f-data-table-body-bg-color"
        >
            <template v-slot:column-asset="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <f-crypto-symbol :token="item" />
                    </div>
                </div>
                <template v-else>
                    <f-crypto-symbol :token="item" />
                </template>
            </template>

            <template v-slot:column-name="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}</div>
                    <div class="col">
                        <router-link
                            :to="{
                                name: 'asset-detail',
                                params: { address: item.address }
                            }"
                            :title="value"
                        >
                            {{ value }}
                        </router-link>
                    </div>
                </div>
                <template v-else>
                    <router-link
                        :to="{
                            name: 'asset-detail',
                            params: { address: item.address }
                        }"
                        :title="value"
                    >
                        {{ value }}
                    </router-link>
                </template>
            </template>

            <template v-slot:column-address="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}</div>
                    <div class="col">
                        <router-link
                            :to="{
                                name: 'asset-detail',
                                params: { address: item.address }
                            }"
                            :title="value"
                        >
                            {{ item.address | formatHash }}
                        </router-link>
                    </div>
                </div>
                <template v-else>
                    <router-link
                        :to="{
                            name: 'asset-detail',
                            params: { address: item.address }
                        }"
                        :title="value"
                    >
                        {{ item.address | formatHash }}
                    </router-link>
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
import FDataTable from "../components/core/FDataTable/FDataTable.vue";
import FCryptoSymbol from "../components/core/FCryptoSymbol/FCryptoSymbol.vue";
import { stringSort } from "../utils/array-sorting.js";
import { formatNumberByLocale } from "../filters.js";
import { mapGetters } from "vuex";

export default {
    name: "Erc20AssetList",
    components: { FCryptoSymbol, FDataTable },
    data() {
        return {
            /** @type {[DefiToken]} */
            tokens: [],
            /** @type {DeFi} */
            // defi: this.$defi,
            columns: [
                {
                    name: "asset",
                    label: this.$t("view_assets.asset"),
                    sortFunc: (_itemProp, _direction = "asc") => {
                        return (_a, _b) => {
                            const a = _a.symbol;
                            const b = _b.symbol;

                            return (
                                ((_direction === "desc" ? -1 : 1) *
                                stringSort(a, b))
                            );
                        };
                    },
                    sortDir: "desc",
                    width: "180px"
                },
                {
                    name: "name",
                    label: this.$t("view_assets.name")
                    // cssClass: 'align-center',
                },
                {
                    name: "address",
                    label: this.$t("Hash")
                    // cssClass: 'align-center',
                },
                {
                    name: "totalSupply",
                    label: this.$t("view_assets.total_supply"),
                    formatter: (_value, _item) => {
                        return formatNumberByLocale(
                            this.$defi.fromTokenValue(_value, _item).toFixed(0),
                            0
                        );
                    }
                }
            ]
        };
    },

    created() {
        this.init();
    },

    computed: {
        ...mapGetters(["getTotalSupply"]),

        cTokens() {
            if (this.tokens.length) {
                return this.tokens.map(t =>
                    t.symbol === "RWA"
                        ? {
                              ...t,
                              totalSupply: this.getTotalSupply,
                              price: this.vcTokenPrice
                          }
                        : t
                );
            } else return [];
        }
    },

    methods: {
        async init() {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchERC20Tokens(),
                $defi.init()
            ]);
            if (result[0].length) this.tokens = [...result[0]];
            this.$emit("records-count", this.tokens.length);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../assets//scss/fantom-color-palette";
.assets-vc {
    width: 100%;
    text-align: center;
    color: $primary-color-content;
    max-width: 50%;
}

a {
    color: #337afe !important;
}
</style>
