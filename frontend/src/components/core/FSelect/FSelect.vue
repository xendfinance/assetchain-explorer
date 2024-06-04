<template>
    <div class="">
        <div
            v-click-outside="hide"
            ref="selector"
            class="f-select"
            tabindex="0"
        >
            <button
                class="current-label"
                ref="dropdown"
                @click="active = !active"
            >
                <span v-if="!val" class="default-label">
                    Type here
                </span>
                <span v-else class="label-text ">
                    {{ val }}
                </span>
                <img src="/img/arrow-down.svg" class="img" />
            </button>

            <div v-if="active" class="options">
                <div
                    v-for="(option, idx) of labels"
                    :key="`${option.name}-${idx}`"
                    class="option"
                    tabindex="0"
                    @click="onSelect(option)"
                    @keyup.enter="onSelect(option)"
                >
                    <span :class="{ 'text-active': val === option.name }">{{
                        option.name
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
export default {
    name: "FSelect",
    props: {
        value: String
    },
    data() {
        return {
            val: this.value,
            active: false,
            labels: [
                {
                    name: "Send a transfer without comment",
                    minStakingAmount: 134,
                    ut: 1
                },
                // { name: "Receive a transaction", minStakingAmount: 134, ut: 1 },
                {
                    name: "Create smart contract",
                    minStakingAmount: 267,
                    ut: 1.4762
                },
                // { name: "Register SBP", minStakingAmount: 1067, ut: 8 },
                // {
                //     name: "Update block creation address",
                //     minStakingAmount: 1067,
                //     ut: 8
                // },
                // {
                //     name: "Update SBP reward retrieval address",
                //     minStakingAmount: 1067,
                //     ut: 8
                // },
                // {
                //     name: "Cancel SBP registration",
                //     minStakingAmount: 534,
                //     ut: 6
                // },
                // { name: "Retrieve SBP rewards", minStakingAmount: 934, ut: 7 },
                // { name: "Vote", minStakingAmount: 534, ut: 4 },
                // { name: "Cancel voting", minStakingAmount: 400, ut: 2.5 },
                { name: "Stake for quota", minStakingAmount: 667, ut: 5 },
                { name: "Cancel staking", minStakingAmount: 667, ut: 5 },
                {
                    name: "Stake for quota with callback",
                    minStakingAmount: 800,
                    ut: 5.5
                },
                {
                    name: "Cancel staking with callback",
                    minStakingAmount: 800,
                    ut: 5.5
                },
                // { name: "Issue new token", minStakingAmount: 1200, ut: 9 },
                // {
                //     name: "Re-issue an additional amount of token",
                //     minStakingAmount: 800,
                //     ut: 6
                // },
                { name: "Burn token", minStakingAmount: 800, ut: 5.5 },
                {
                    name: "Transfer token ownership",
                    minStakingAmount: 934,
                    ut: 6.5
                },
                { name: "Change token type", minStakingAmount: 800, ut: 5.5 },
                {
                    name: "Query token information",
                    minStakingAmount: 267,
                    ut: 1.5
                }
            ]
        };
    },
    watch: {
        value(_val) {
            this.val = _val;
        }
    },
    methods: {
        onSelect(value) {
            this.$emit("select", value);
            this.active = false;
        },
        hide() {
            this.active = false;
        }
    },
    directives: {
        ClickOutside
    }
};
</script>

<style lang="scss" scoped>
@import "style";
</style>
