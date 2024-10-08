<template>
    <div class="dailyblocks">
        <div class="chart_label">
            <h2 class="h3" id="dailyblocks_l">
                {{ $t("daily_blocks.label") }}
            </h2>
            <ChartResolutions
                :value="resolution"
                labeled-by="dailyblocks_l"
                @change="onChartResolutionsChange"
            />
        </div>
        <FCard class="chart_card half-padding">
            <FLightweightCharts
                :series="dailyBlocksSeries"
                series-type="area"
                :fit-content="true"
                :height="280"
                :options="{ handleScroll: false, handleScale: false }"
                :series-options="{
                    priceLineVisible: false,
                    priceFormat: { type: 'price', precision: 0, minMove: 1 }
                }"
            />
        </FCard>
    </div>
</template>

<script>
import ChartResolutions from "@/components/ChartResolutions.vue";
import FLightweightCharts from "@/components/core/FLightweightCharts/FLightweightCharts.vue";
import gql from "graphql-tag";
import { getISODateByTimecode } from "@/utils/time.js";
import { reverseSeries } from "@/utils/chart.js";
import FCard from "@/components/core/FCard/FCard.vue";

export default {
    name: "DailyBlocks",

    components: { FCard, FLightweightCharts, ChartResolutions },

    props: {
        /** Default resolution */
        resolution: {
            type: String,
            default: "14d"
        }
    },

    data() {
        return {
            dailyBlocksSeries: []
        };
    },

    mounted() {
        setTimeout(() => {
            this.loadDailyBlocks(getISODateByTimecode(this.resolution));
        }, 1050);
    },

    methods: {
        async loadDailyBlocks(from = null, to = null) {
            let dailyBlocks = await this.fetchDailyBlocks(from, to);

            dailyBlocks = dailyBlocks.map(item => {
                return {
                    time: item.date.toString(),
                    value: item.blocksCount
                };
            });

            this.dailyBlocksSeries = reverseSeries(dailyBlocks);
        },

        async fetchDailyBlocks(from = null, to = null) {
            const data = await this.$apollo.query({
                query: gql`
                    query DailyFeeFlow($from: Time, $to: Time) {
                        dailyFeeFlow(from: $from, to: $to) {
                            date
                            blocksCount
                        }
                    }
                `,
                variables: {
                    from: from,
                    to: to
                },
                fetchPolicy: "network-only"
            });

            return data.data.dailyFeeFlow || [];
        },

        onChartResolutionsChange(value) {
            this.loadDailyBlocks(getISODateByTimecode(value));
        }
    }
};
</script>

<style scoped>
h2 {
    /* color: #bababa; */
}
</style>
