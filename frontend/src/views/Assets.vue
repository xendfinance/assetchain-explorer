<template>
    <div class="assets-view narrow-container">
        <f-view-heading>
            <h1>{{ $t("view_assets.title") }}</h1>
        </f-view-heading>
        <f-tabs>
            <template #assets>
                <h2>
                    {{ $t("view_assets.fantom_finance_assets") }}
                    <span class="f-records-count"
                        >({{ assetsRecordsCount }})</span
                    >
                </h2>
            </template>
            <template #erc20-assets>
                <h2 class="assets-view--h2">
                    <span class="assets-view__title">{{
                        $t("view_assets.all_erc20_tokens")
                    }}</span>
                    <span class="assets-view__title assets-view__title--mob">{{
                        $t("view_assets.all_erc20_tokens_mob")
                    }}</span>

                    <span class="f-records-count"
                        >({{ erc20AssetsRecordsCount }})</span
                    >
                </h2>
            </template>

            <f-tab title-slot="assets">
                <asset-list @records-count="onAssetsRecordsCount" />
            </f-tab>
            <f-tab title-slot="erc20-assets">
                <erc20-asset-list @records-count="onErc20AssetsRecordsCount" />
            </f-tab>
        </f-tabs>
    </div>
</template>

<script>
import FViewHeading from "@/components/FViewHeading.vue";
import AssetList from "@/data-tables/AssetList.vue";
import FTabs from "../components/core/FTabs/FTabs.vue";
import FTab from "../components/core/FTabs/FTab.vue";
import Erc20AssetList from "../data-tables/Erc20AssetList.vue";

export default {
    name: "Assets",

    components: { Erc20AssetList, AssetList, FTab, FTabs, FViewHeading },

    data() {
        return {
            assetsRecordsCount: 0,
            erc20AssetsRecordsCount: 0
        };
    },

    methods: {
        onAssetsRecordsCount(_count) {
            this.assetsRecordsCount = _count;
        },

        onErc20AssetsRecordsCount(_count) {
            this.erc20AssetsRecordsCount = _count;
        },

        async init() {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchERC20Tokens(),
                $defi.init()
            ]);

            this.tokens = result[0].filter(
                _item => _item.isActive && _item.symbol !== "RWA"
            );

            this.$emit("records-count", this.tokens.length);
        }
    },

    created() {
        this.init();
    }
};
</script>

<style lang="scss">
.assets-view {
    .f-tabs {
        margin-top: 0px;
    }

    &--h2 {
        display: flex;

        gap: 3px;
    }

    &__title:not(&__title--mob) {
        @media screen and (max-width: 550px) {
            display: none;
        }
    }
    &__title--mob {
        @media screen and (min-width: 551px) {
            display: none;
        }
    }
}

.tab-title {
    font-weight: 400;
}
</style>
