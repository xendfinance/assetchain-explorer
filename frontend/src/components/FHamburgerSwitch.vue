<template>
    <div
        class="f-hamburger-switch"
        role="switch"
        :class="[cCssClass, `thickness${thickness}`]"
        @click="toggle"
    >
        <div class="cont">
            <div :class="darkMode ? 'l1' : 'l1 l1-dark'"></div>
            <div :class="darkMode ? 'l2' : 'l2 l2-dark'" v-if="!twoLines"></div>
            <div :class="darkMode ? 'l3' : 'l3 l3-dark'"></div>
        </div>
    </div>
</template>

<script>
import events from "../mixins/events.js";
import { mapState } from "vuex";

export default {
    mixins: [events],

    props: {
        /** Is switch on? */
        on: {
            type: Boolean,
            default: false
        },

        /** Thickness of one switch row. */
        thickness: {
            type: String,
            default: "1"
        },

        /** Use just 2 lines instead of 3. */
        twoLines: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            /** Is switch on? */
            dOn: this.on
        };
    },

    watch: {
        dOn() {
            if (this.dOn) {
                this.$emit("hamburger-switch-on");
            } else {
                this.$emit("hamburger-switch-off");
            }
        }
    },

    computed: {
        /**
         * Container's css classes.
         */
        cCssClass() {
            return {
                on: this.dOn
            };
        },
        ...mapState({
            darkMode: state => state.darkMode
        })
    },

    methods: {
        toggle() {
            this.dOn = !this.dOn;
        }
    }
};
</script>

<style lang="scss">
.f-hamburger-switch {
    display: inline-block;
    width: 24px;
    height: 20px;
    cursor: pointer;
    /*transform: scale(1.1);*/

    .cont {
        position: relative;

        height: 100%;
        margin-top: 5px;
        /*border: 1px solid transparent;*/
    }

    .l1,
    .l2,
    .l3 {
        position: absolute;
        width: 100%;
        height: 3px !important;
        background-color: #fff;
        transition: all $transition-length ease;
    }

    .l1-dark,
    .l2-dark,
    .l3-dark {
        position: absolute;
        width: 100%;
        height: 3px !important;
        background-color: #000;
        transition: all $transition-length ease;
    }

    .l1 {
        top: 0;
    }

    .l2 {
        top: 50%;
    }

    .l3 {
        bottom: 0;
    }

    &.thickness1 {
        .l1 {
            top: 10%;
        }

        .l2 {
            margin-top: -1px;
        }

        .l3 {
            bottom: 10%;
        }
    }

    &.thickness2 {
        .l1,
        .l2,
        .l3 {
            height: 4px;
        }

        .l1 {
            top: 5%;
        }

        .l2 {
            margin-top: -2px;
        }

        .l3 {
            bottom: 20%;
        }
    }

    &.thickness3 {
        .l1,
        .l2,
        .l3 {
            height: 6px;
        }

        .l2 {
            margin-top: -3px;
        }
    }

    &.on {
        .l1 {
            /*opacity: 1;*/
            /*transform: translate(0, 10px) rotate(45deg);*/
            top: 0;
            transform: translate(0, 9px) rotate(45deg);
        }

        .l2 {
            opacity: 0;
        }

        .l3 {
            /*opacity: 1;*/
            bottom: 0;
            transform: translate(0, -9px) rotate(-45deg);
        }

        &.thickness2 {
            .l1 {
                transform: translate(0, 8.5px) rotate(45deg);
            }

            .l3 {
                transform: translate(0, -8.5px) rotate(-45deg);
            }
        }

        &.thickness3 {
            .l1 {
                transform: translate(0, 7px) rotate(45deg);
            }

            .l3 {
                transform: translate(0, -7px) rotate(-45deg);
            }
        }
    }
}
</style>
