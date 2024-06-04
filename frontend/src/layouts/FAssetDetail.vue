<template>
    <div class="f-asset-detail f-data-layout">
        <f-card>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">
                    {{ $t("view_assets.symbol") }}
                </div>
                <div class="col"><f-crypto-symbol :token="token" /></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">
                    {{ $t("view_assets.name") }}
                </div>
                <div class="col">{{ token.name }}</div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">
                    {{ $t("view_assets.contract") }}
                </div>
                <div class="col">
                    <router-link
                        :to="{
                            name: 'address-detail',
                            params: { id: token.address }
                        }"
                        :title="token.address"
                    >
                        <f-ellipsis :text="token.address" overflow="middle" />
                    </router-link>
                </div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">
                    {{ $t("view_assets.total_supply") }}
                </div>
                <div class="col">
                    {{
                        formatNumberByLocale(
                            $defi
                                .fromTokenValue(token.totalSupply, token)
                                .toFixed(0),
                            0
                        )
                    }}
                </div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">
                    {{ $t("view_assets.price") }}
                </div>
                <div class="col">
                    $
                    {{
                        token.symbol === "RWA"
                            ? token.price.toFixed(4)
                            : formatNumberByLocale(
                                  $defi.fromTokenValue(token.price, token),
                                  $defi.getTokenDecimals(token)
                              )
                    }}
                </div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">
                    {{ $t("view_assets.decimals") }}
                </div>
                <div class="col">{{ token.decimals }}</div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FEllipsis from "@/components/core/FEllipsis/FEllipsis.vue";
import FCard from "@/components/core/FCard/FCard.vue";
import FCryptoSymbol from "@/components/core/FCryptoSymbol/FCryptoSymbol.vue";
import { formatNumberByLocale } from "@/filters.js";
import { mapGetters } from "vuex";

export default {
    name: "FAssetDetail",
    components: { FCryptoSymbol, FCard, FEllipsis },
    props: {
        /** Token address */
        address: {
            type: String,
            required: true,
            default: ""
        }
    },

    data() {
        return {
            tokens: []
            // VCToken: {
            //     address: "XEND",
            //     decimals: 18,
            //     id: "iBc66jXwzD3",
            //     logoURL: "",
            //     name: "XendChain",
            //     symbol: "RWA",
            //     totalSupply: 0
            // }
        };
    },

    created() {
        this.init();
    },

    computed: {
        ...mapGetters(["getTotalSupply", "vcTokenPrice"]),
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
        },
        token() {
            let token;
            if (this.cTokens.length) {
                if (this.address !== "RWA") {
                    token = this.cTokens.filter(
                        _item => _item.address === this.address
                    )[0];
                } else {
                    token = this.cTokens.filter(
                        _item => _item.address === "RWA"
                    )[0];
                }
                return token;
            } else return {};
        }
    },

    methods: {
        async init() {
            const { $defi } = this;
            const result = await Promise.all([$defi.fetchERC20Tokens()]);
            if (result.length) {
                this.tokens = [...result[0]];
            }
        },

        formatNumberByLocale
    }
};
</script>

<style scoped></style>
