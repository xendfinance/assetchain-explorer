<template>
    <div class="f-search-box-header" :class="cCssClass" :style="inlineStyle">
        <form action="" autocomplete="off" @submit.prevent="onSubmit">
            <input
                type="search"
                name="search"
                class="inp large input input-custom"
                :placeholder="$t('view_home.search_input_placeholder')"
                :aria-label="$t('view_home.search_input_placeholder')"
                v-model="searchText"
                @focus="onFocus"
                @blur="onBlur"
            />
            <button
                type="submit"
                class="btn small  same-size round btn-custom"
                :class="{ 'no-hover': expandable }"
                :aria-label="$t('view_home.search_button_label')"
            >
                <icon
                    data="@/assets/svg/search.svg"
                    width="14"
                    height="14"
                    color="#337AFE"
                ></icon>
            </button>
        </form>

        <f-window
            ref="alertWindow"
            modal
            :title="$t('alert')"
            style="max-width: 680px"
            class="double-body-padding"
            :z-index="14"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            {{ $t("alerts.bad_search_string") }}
        </f-window>
    </div>
</template>

<script>
import events from "../mixins/events.js";
import { throttle } from "../utils";
import { clientInfo } from "../utils/client-info.js";
import { getTypeByStr } from "../utils/transactions.js";
import FWindow from "./core/FWindow/FWindow.vue";
import { isRTLDir } from "@/utils/DOM.js";

export default {
    components: { FWindow },
    mixins: [events],

    props: {
        /** Is search box expandable? */
        expandable: {
            type: Boolean,
            default: false
        },

        /** Is search box expanded? */
        expanded: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            /** Inline style used for expand/collapse. */
            inlineStyle: {
                position: "",
                top: "",
                left: "",
                right: "",
                width: "",
                transform: ""
            },
            /** Search input value. */
            searchText: "",
            /** Is search box expanded? */
            dExpanded: this.expanded
        };
    },

    watch: {
        dExpanded() {
            if (this.expandable) {
                if (this.dExpanded) {
                    this.expand();
                } else {
                    this.collapse();
                }
            }
        }
    },

    computed: {
        /**
         * Container's css classes.
         */
        cCssClass() {
            return {
                expandable: this.expandable,
                expanded: this.dExpanded
            };
        },

        /**
         * Property is set to `true`, if 'menu-mobile' breakpoint is reached.
         *
         * @return {Boolean}
         */
        cMobileView() {
            const menuBreakpoint = this.$store.state.breakpoints["menu-mobile"];

            return menuBreakpoint && menuBreakpoint.matches;
        }
    },

    mounted() {
        if (this.expandable) {
            this.bindEvent(window, "blur", () => {
                this.blurInput(true);
            });

            if (clientInfo.mobile) {
                this.bindEvent(
                    window,
                    "orientationchange",
                    () => {
                        this.blurInput(true);
                    },
                    300,
                    true
                );
            } else {
                this.bindEvent(
                    window,
                    "resize",
                    throttle(
                        () => {
                            this.blurInput(true);
                        },
                        300,
                        true
                    )
                );
            }
        }
    },

    methods: {
        /**
         * Process search string.
         *
         * @param {string} _text
         */
        search(_text) {
            const type = getTypeByStr(_text);
            let routeName = "";

            switch (type) {
                case "transaction_hash":
                    routeName = "transaction-detail";
                    break;
                case "address":
                    routeName = "address-detail";
                    break;
                case "block":
                    routeName = "block-detail";
                    break;
                default:
                    this.$refs.alertWindow.show();
            }

            if (routeName) {
                this.$router.push(
                    { name: routeName, params: { id: _text } },
                    null,
                    () => {}
                );
            }
        },

        expand() {
            const parentElem = this.$el.parentNode;

            if (!parentElem) {
                return;
            }

            const RTLDir = isRTLDir();
            const inlineStyle = this.inlineStyle;

            inlineStyle.position = "";
            inlineStyle.top = "";
            inlineStyle.left = "";
            inlineStyle.right = "";

            const winWidth = window.innerWidth;
            const parentElemRect = parentElem.getBoundingClientRect();
            const elRect = this.$el.getBoundingClientRect();
            let width = 0;
            let tx = 0;

            if (RTLDir) {
                width = this.cMobileView
                    ? winWidth * 0.98
                    : -(elRect.right - parentElemRect.right + elRect.width);
                tx = this.cMobileView
                    ? elRect.right - winWidth * 0.01
                    : elRect.right - parentElemRect.right;
            } else {
                width = this.cMobileView
                    ? winWidth * 0.98
                    : elRect.left - parentElemRect.left + elRect.width;
                tx = this.cMobileView
                    ? elRect.left - winWidth * 0.15
                    : elRect.left - parentElemRect.left;
            }
            // const width = parentElemRect.width * 0.98;
            // const tx = elRect.left - (parentElemRect.left + ((parentElemRect.width - width) / 2));

            document.body.classList.add("search-box-on");

            inlineStyle.position = "fixed";
            inlineStyle.top = `${elRect.top}px`;
            if (RTLDir) {
                // inlineStyle.left = `0px`;
                inlineStyle.left = `${elRect.right}px`;
                // inlineStyle.right = `${elRect.right}px`;
            } else {
                inlineStyle.left = `${elRect.left}px`;
            }
            inlineStyle.transform = `translateX(-${tx}px)`;

            inlineStyle.width = `${width}px`;

            setTimeout(() => {
                document.body.classList.add("search-box-on-anim-end");
            }, 250);
        },

        collapse() {
            const inlineStyle = this.inlineStyle;

            inlineStyle.width = "";
            inlineStyle.transform = "";

            document.body.classList.remove("search-box-on-anim-end");

            setTimeout(() => {
                document.body.classList.remove("search-box-on");

                inlineStyle.position = "";
                inlineStyle.top = "";
                inlineStyle.left = "";
                inlineStyle.right = "";
            }, 250);
        },

        /**
         * Trigger focus event on search input.
         */
        focusInput() {
            const eInput = this.$el.querySelector("input");

            if (eInput) {
                eInput.focus();
            }
        },

        /**
         * Trigger blur event on search input.
         *
         * @param {boolean} [_clear]
         */
        blurInput(_clear) {
            const eInput = this.$el.querySelector("input");

            if (_clear) {
                this.dExpanded = false;
                this.searchText = "";
            }

            if (eInput) {
                eInput.blur();
            }
        },

        /**
         * Triggered on form submit event.
         */
        onSubmit() {
            let searchText;

            if (!this.dExpanded) {
                this.focusInput();
            } else {
                searchText = this.searchText.trim();

                if (searchText) {
                    this.search(searchText);
                }

                this.searchText = "";
                // if (this.expandable) {
                this.blurInput();
                // this.dExpanded = false;
                // }
            }
        },

        /**
         * Triggered on search input focus event.
         */
        onFocus() {
            this.dExpanded = true;
        },

        /**
         * Triggered on search input blur event.
         */
        onBlur() {
            if (this.expandable && this.dExpanded) {
                setTimeout(() => {
                    this.dExpanded = false;
                    this.searchText = "";
                }, 150);
            }
        }
    }
};
</script>

<style lang="scss">
.input {
    text-align: left !important;
}
.f-search-box-header {
    --f-search-box-input-box-shadow: #{$elev3-shadow};
    --f-search-box-input-color: #fff;
    --f-search-box-input-background-color: #{$secondary-color-lightest};
    --f-search-box-input-placeholder-color: #{$secondary-color-lighter};
    --f-search-box-button-hover-color: #fff;

    display: inline-block;
    z-index: 20;

    form {
        display: inline-block;
        position: relative;
        // width: 65%;
        width: 99%;
        /*margin: 0 auto;*/

        /*transition: all $transition-length ease;*/
    }

    @media (max-width: 780px) {
        form {
            width: 65%;
        }
    }

    input:not(.def):not([type="submit"]).large {
        width: 100%;
        height: 3.5rem;
        padding-inline-end: 48px;
        text-align: left;
        border-radius: 3.5rem !important;
        outline: none;
        box-shadow: var(--f-search-box-input-box-shadow);

        &:not(:focus) {
            border-color: transparent;
        }

        &::placeholder {
            color: var(--f-search-box-input-placeholder-color);
        }
    }

    button[type="submit"] {
        width: 25px !important;
        height: 25px !important;
        position: absolute;
        top: 14px;
        right: 10px !important;
        outline: none;
        background: rgba(255, 255, 255, 0.1);
    }

    .input-custom {
        text-overflow: ellipsis;
        text-wrap: nowrap;
    }
    // button[type="submit"]:focus {
    //     color: $theme-color !important;
    //     background-color: transparent !important;
    // }

    &.expandable {
        width: 56px;
        transition: all $transition-length ease;
        text-align: left;

        input:not(.def):not([type="submit"]).large {
            background-color: transparent;

            padding-inline-end: 0;
            height: 36px !important;
            &::placeholder {
                color: transparent;
            }
        }

        &.expanded {
            margin-inline-start: 0;

            input:not(.def):not([type="submit"]).large {
                /*padding-inline-end: 48px;*/
                &::placeholder {
                    color: var(--f-search-box-input-placeholder-color);
                }
            }
        }
    }

    &.small {
        input:not(.def):not([type="submit"]).large {
            background-color: transparent;
        }

        button[type="submit"] {
            top: 4px;
            right: 10px;
        }

        .input-custom {
            text-overflow: ellipsis;
            text-wrap: nowrap;
        }

        &.expandable {
            width: 44px;

            input:not(.def):not([type="submit"]).large {
                height: 44px;
                color: var(--f-search-box-input-color);
                background-color: var(--f-search-box-input-background-color);
                border-color: transparent;
                transition: background-color $transition-length ease;
            }

            &:not(.expanded) {
                input:not(.def):not([type="submit"]).large {
                    background-color: transparent;
                    box-shadow: none;
                }
                button[type="submit"] {
                    top: 4px;
                    right: 33px;
                }
            }
        }
    }
}

.search-box-on-anim-end
    .f-search-box-header.expandable.expanded
    input:not(.def):not([type="submit"]).large {
    padding-inline-end: 48px;
}
</style>
