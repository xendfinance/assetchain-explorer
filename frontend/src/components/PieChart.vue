<!-- <script>
import { Pie } from "vue-chartjs";

export default {
    name: "PieChart",
    extends: Pie,
    props: {
        chartData: {
            type: Array | Object,
            required: false
        },
        chartLabels: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            gradient: null,
            options: {
                responsive: true,
                maintainAspectRatio: false
            },
            mounted() {
                this.gradient = this.$refs.canvas
                    .getContext("2d")
                    .createLinearGradient(0, 0, 0, 450);

                this.gradient.addColorStop(0, "rgba(52, 217, 221, 0.6)");
                this.gradient.addColorStop(0.5, "rgba(52, 217, 221, 0.25)");
                this.gradient.addColorStop(1, "rgba(52, 217, 221, 0)");

                this.renderChart(
                    {
                        labels: this.chartLabels,
                        datasets: [
                            {
                                label: "downloads",
                                borderColor: "#249EBF",
                                pointBackgroundColor: "rgba(0,0,0,0)",
                                pointBorderColor: "rgba(0,0,0,0)",
                                pointHoverBorderColor: "#249EBF",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverRadius: 4,
                                pointHitRadius: 10,
                                pointHoverBorderWidth: 1,
                                borderWidth: 1,
                                backgroundColor: this.gradient,
                                hoverBackgroundColor: this.gradient,
                                data: this.chartData
                            }
                        ]
                    },
                    this.options
                );
            }
        };
    }
};
</script>

<style scoped>
.pie-chart-container {
    position: relative;
    width: 100%;
    height: 400px;
}
</style> -->

<script>
import { Pie } from "vue-chartjs";

export default {
    name: "PieChart",
    extends: Pie,
    props: {
        chartData: {
            type: Array,
            required: false
        },
        chartLabels: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        };
    },
    mounted() {
        this.renderChart(
            {
                datasets: [
                    {
                        label: "Stake",
                        backgroundColor: ["#5EDDB7", "#1968ff"],
                        data: this.chartData
                    }
                ],
                labels: this.chartLabels
            },
            this.options
        );
    }
};
</script>
