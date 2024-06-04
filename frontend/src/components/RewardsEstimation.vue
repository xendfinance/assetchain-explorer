<template>
    <div class="rewardsestimation">
        <div class="rewardsestimation_row">
            <div class="rew_est_sl1">
                <h3 id="rew_est_sl1">
                    {{ $t("rewards_estimation.your_stake") }}
                    <span class="rewardsestimation_highlighted text-primary">
                        {{ stake ? Number(stake).toFixed(2) : 0 }}
                        {{ symbol }}
                    </span>
                </h3>
                <!-- <div class="desktop-select">
                    <FSelect v-model="selectedValue" @select="onSelect" />
                </div> -->
            </div>
            <FSlider
                name="stake"
                v-model="stake"
                use-lower-fill-bar
                aria-labelledby="rew_est_sl1"
                :min="sliderMin"
                :max="sliderMax"
                :labels="[sliderMin, sliderMax]"
                clickable-labels
            />
        </div>
        <!-- <div class="rewardsestimation_row">
            <h3 id="rew_est_sl2">
                {{ $t("rewards_estimation.locking_for") }}
                <span class="rewardsestimation_highlighted"
                    >{{ formatNumberByLocale(lock, 0) }}
                    {{ $t("rewards_estimation.days") }}</span
                >
            </h3>
            <FSlider
                name="lock"
                v-model="lock"
                use-lower-fill-bar
                aria-labelledby="rew_est_sl2"
                :min="minLock.toString()"
                :max="maxLock.toString()"
                :labels="[
                    $t('rewards_estimation.min_lock'),
                    $t('rewards_estimation.max_lock')
                ]"
                clickable-labels
            />
        </div> -->
        <div class="rewardsestimation_rewards your_rewards">
            <div class="">
                <h3>{{ $t("rewards_estimation.estimated_rewards") }}</h3>
                <div class="rewardsestimation_highlighted text-primary">
                    <template v-if="yApr > 0">
                        {{ cashback ? cashback.toFixed(2) : 0 }} {{ symbol }}
                    </template>

                    <template v-else>-</template>
                    <div v-if="showFTMVault" class="gas">
                        <f-info
                            show-on-hover
                            window-class="light"
                            window-style="max-width: 350px;"
                        >
                            Estimated reward for a year.
                        </f-info>
                    </div>
                </div>
            </div>
            <div>
                <h3>{{ $t("rewards_estimation.current_apr") }}</h3>
                <p class="text-primary">{{ yApr }}%</p>
            </div>
            <div>
                <!-- <h3>{{ $t("rewards_estimation.current_apr") }}</h3>
                <div class="rewardsestimation_highlighted">
                    <template v-if="yApr > 0"
                        >{{
                            apr ? formatNumberByLocale(apr * 100, 2) : 0
                        }}%</template
                    >
                    <template v-else>-</template>
                </div> -->
            </div>
        </div>
        <!-- <div class="mobile-select">
            <FSelect v-model="selectedValue" @select="onSelect" />
        </div> -->
    </div>
</template>

<script>
import gql from "graphql-tag";
import { cloneObject, toHex, toInt } from "@/utils/index.js";
import FSlider from "@/components/core/FSlider/FSlider.vue";
// import FSelect from "./core/FSelect/FSelect.vue";
import FInfo from "./core/FInfo/FInfo.vue";
import { formatNumberByLocale } from "@/filters.js";
import { SFCConfig } from "@/utils/SFCConfig.js";
import { mapGetters } from "vuex";
import appConfig from "../../app.config.js";
import { toBigNumberFloat } from "@/utils/big-number";

export default {
    name: "RewardsEstimation",

    components: {
        FSlider,
        FInfo
        // FSelect
    },

    data() {
        return {
            stake: "1000000",
            sliderMin: "0",
            sliderMax: "1000000",
            lock: "0",
            yApr: 0,
            minLock: 0,
            maxLock: 1,
            showFTMVault: appConfig.flags.ftmVault,
            selectedValue: "",
            minStakingAmount: 0,
            ut: 0
        };
    },

    computed: {
        ...mapGetters(["symbol"]),
        rewards() {
            // const stake = parseInt(this.stake) * Math.pow(10, 18);
            const stake = toBigNumberFloat(this.stake);

            // return (stake / 21000) * 100;
            const m = 1000000;
            const p = 4.201037667e-24;
            return (
                m *
                (1 -
                    2 /
                        (1 +
                            Math.pow(
                                Math.exp(1),
                                this.congestion(1500000) * p * Number(stake)
                            )))
            );
        },

        apr() {
            // const lock = parseInt(this.lock);
            // const minLock = parseInt(this.minLock);
            // const lockP = (lock - minLock) / (365 - minLock);
            // const lockP = lock / this.maxLock;
            // const noLockP = 30;

            // return ((lockP * (100 - noLockP) + noLockP) / 100) * this.yApr;
            return 0;
        },

        cashback() {
            if (this.stake && this.yApr) {
                return (Number(this.stake) / 100) * this.yApr;
            }
            return 0;
        }
    },

    mounted() {
        this.loadVariables();
    },

    methods: {
        // S - value of stake N - min
        // S/N = k% ➝ k% div 100 = кол-во бесплатных транзакций k% mod 100 = 1 транзакция с таким кэшбеком

        onSelect(value) {
            this.selectedValue = value.name;
            this.minStakingAmount = value.minStakingAmount;
            this.ut = value.ut;
        },
        congestion(g) {
            const lowerlimit = 1050000;

            const upperlimit = 2100000;

            if (g < lowerlimit) {
                return 1;
            } else if (g > lowerlimit && g < upperlimit) {
                return (
                    2 -
                    Math.pow(
                        Math.exp(1),
                        8.260667775706495e-9 * (g - lowerlimit)
                    )
                );
            } else if (g > upperlimit) {
                return (
                    Math.pow(
                        Math.exp(1),
                        1.6949794096275418e-10 * (upperlimit - g)
                    ) - 0.9
                );
            } else return 0;
        },
        async loadVariables() {
            const [rewards, sfcConfig] = await Promise.all([
                this.getRewardsEstimation(1000000),
                this.getSFCConfig()
            ]);
            this.yApr = toInt(rewards.yearlyReward) / 1000000;
            this.minLock = sfcConfig.minLockupDurationDays;
            this.maxLock = sfcConfig.maxLockupDurationDays;
            this.lock = this.maxLock.toString();
        },

        async getRewardsEstimation(amount = 1000000) {
            const data = await this.$apollo.query({
                query: gql`
                    query GetRewardsEstimation($amount: Long) {
                        estimateRewards(amount: $amount) {
                            yearlyReward
                        }
                    }
                `,
                variables: {
                    amount: toHex(amount)
                },
                fetchPolicy: "network-only"
            });

            return cloneObject((data.data && data.data.estimateRewards) || {});
        },

        async getSFCConfig() {
            return SFCConfig.get();
        },

        formatNumberByLocale
    }
};
</script>

<style lang="scss">
.desktop-select {
    display: none;
    @media (min-width: 764px) {
        display: block;
    }
}
.mobile-select {
    margin-top: 24px;
    display: block;
    @media (min-width: 764px) {
        display: none;
    }
}
.rewardsestimation {
    h3 {
        font-weight: normal;
    }

    &_row {
        padding-bottom: 48px;
    }

    &_rewards {
        display: flex;
        gap: 220px;

        @media (max-width: 640px) {
            gap: 0px;
            justify-content: space-between;
        }

        h3 {
            margin-bottom: 0;
        }
    }

    &_highlighted {
        font-size: 21px;
        color: var(--f-primary-color);
        font-weight: 600;
    }

    .f-slider {
        .labels {
            > div {
                > * {
                    > span {
                        // transform: translateX(-12%);
                        opacity: 0.61;
                    }

                    &:last-child > span {
                        transform: translateX(-85%);
                    }
                }
            }
        }
    }
}
.rewardsestimation_highlighted {
    display: flex;
    font-size: 18px;
    .gas {
        margin-left: 8px;
    }
}

#rew_est_sl1 {
    display: flex;
    span {
        margin-left: 8px;
    }
}

.rew_est_sl1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24px;
}

.your_rewards {
    align-items: center;
}

.text-primary {
    color: #496fa7;
    font-weight: 700 !important;
}
h3 {
    // color: #bababa !important;
    font-size: 18px;
    font-weight: 700 !important;
}
</style>
