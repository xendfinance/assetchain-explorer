<template>
    <header class="f-header" :class="cCssClass">
        <div class="narrow-container">
            <div class="row no-collapse align-items-center">
                <!-- <a
                    v-if="darkMode"
                    href="https://xend.finance"
                    class="mobile-logo"
                    ><img src="/vitra-logo-dark.svg" alt="vitrascan"
                /></a> -->
                <div v-if="darkMode" class="col-2">
                    <a
                        v-if="$route.path === '/'"
                        href="https://xend.finance"
                        class="logo"
                        ><img
                            src="/logo-dark.svg"
                            alt="xend"
                            class="not-fluid mobile-logo"
                    /></a>
                    <router-link v-else to="/" class="logo">
                        <img
                            src="/logo-dark.svg"
                            alt="xend"
                            class="not-fluid mobile-logo"
                        />
                    </router-link>
                </div>
                <div class="col right-col right-col-custom header-li">
                    <f-navigation :items="cNavigation"></f-navigation>
                    <!-- <f-navigation></f-navigation> -->
                    <Navbar />
                    <!-- <FSwitchChain /> -->
                    <f-search-box
                        ref="searchBox"
                        class="small"
                        expandable
                    ></f-search-box>
                    <f-hamburger-switch
                        thickness="2"
                        two-lines
                        @hamburger-switch-on="onHamburgerSwitchOn"
                        @hamburger-switch-off="onHamburgerSwitchOff"
                    ></f-hamburger-switch>
                </div>
            </div>
        </div>

        <div class="f-drawer" @click="onDrawerClick">
            <div class="body"></div>
            <div class="burger-footer">
                <f-social-media-links></f-social-media-links>
            </div>
        </div>
    </header>
</template>

<script>
import FNavigation from "../components/FNavigation.vue";

import FHamburgerSwitch from "../components/FHamburgerSwitch.vue";
import FSocialMediaLinks from "../components/FSocialMediaLinks.vue";
import { mapState } from "vuex";
import FSearchBox from "../components/FSearchBoxHeader.vue";
// import FSwitchChain from "../components/FSwitchChain.vue";
// import FDarkModeSwitch from "@/components/FDarkModeSwitch.vue";

/**
 * Renderes header and takes care of navigation.
 */
export default {
    components: {
        // FDarkModeSwitch,
        FSearchBox,
        FNavigation,
        FHamburgerSwitch,
        FSocialMediaLinks
        // FSwitchChain
    },

    data() {
        return {
            /** Is drawer visible? */
            dDrawerOn: false
        };
    },

    computed: {
        /**
         * Get navigation by current language.
         *
         * @return {array}
         */

        ...mapState({
            darkMode: state => state.darkMode
        }),
        cNavigation() {
            const messages = this.$i18n.messages[this.$i18n.locale];

            return messages.navigation || [];
        },

        /**
         * Container's css classes.
         *
         * @retun {object}
         */
        cCssClass() {
            return {
                "drawer-on": this.dDrawerOn
            };
        },

        /**
         * Is current route home view?
         *
         * @retun {boolean}
         */
        cHomeView() {
            return this.$route.name === "home";
        },

        ...mapState(["breakpoints"])
    },

    watch: {
        /**
         * Watches for vue route change.
         */
        $route() {
            this.hamburgerSwitchOff();
        },

        /**
         * Watches for `breakpoints` state change.
         *
         * @param {object} _breakpoints
         */
        breakpoints(_breakpoints) {
            const menuMobileBreakpoint = _breakpoints["menu-mobile"];

            if (menuMobileBreakpoint && !menuMobileBreakpoint.matches) {
                this.hamburgerSwitchOff();
            }
        }
    },

    methods: {
        moveNavigationToDrawer() {
            const { $refs } = this;

            if (!this.$el) {
                return;
            }

            const eFNavigation = this.$el.querySelector(".f-navigation");
            const eDrawer = this.$el.querySelector(".f-drawer .body");

            if (eFNavigation && eDrawer) {
                eDrawer.appendChild(eFNavigation);

                if ($refs.darkModeSwitch) {
                    eDrawer.prepend($refs.darkModeSwitch.$el);
                }
            }
        },

        moveNavigationFromDrawer() {
            const { $refs } = this;

            if (!this.$el) {
                return;
            }

            const eFNavigation = this.$el.querySelector(".f-navigation");
            const eRightCol = this.$el.querySelector(".right-col");

            if (eFNavigation && eRightCol) {
                eRightCol.insertBefore(eFNavigation, eRightCol.firstChild);
                if ($refs.searchBox && $refs.darkModeSwitch) {
                    $refs.searchBox.$el.parentNode.insertBefore(
                        $refs.darkModeSwitch.$el,
                        $refs.searchBox.$el
                    );
                }
                // eRightCol.appendChild(eFNavigation);
            }
        },

        hamburgerSwitchOff() {
            this.$children.forEach(_child => {
                if (_child.$options._componentTag === "f-hamburger-switch") {
                    _child.dOn = false;
                }
            });
        },

        onHamburgerSwitchOn() {
            this.moveNavigationToDrawer();
            this.dDrawerOn = true;
        },

        onHamburgerSwitchOff() {
            this.dDrawerOn = false;
            setTimeout(() => {
                this.moveNavigationFromDrawer();
            }, 300);
        },

        onDrawerClick() {
            this.hamburgerSwitchOff();
        }
    }
};
</script>

<style lang="scss">
.switch-chain-desktop {
    display: none;
    @include media-max($bp-menu) {
        display: flex;
    }
}
.switch-chain-mobile {
    display: flex;
    margin-right: 8px;
    @include media-max($bp-menu) {
        display: none;
    }
}
.mobile-logo {
    width: 100%;
    max-width: 150px;
    @include media-max($bp-menu) {
        max-width: 120px;
    }
}
.not-fluid {
    bottom: -5px;
    @include media-max($bp-menu) {
        bottom: 0px;
    }
}

.burger-footer {
    --f-links-background-color: #{$primary-color-lightest};
    background-color: var(--f-links-background-color);
}

.copyright {
    padding-top: 8px;
    text-align: center;
    color: #9e9e9e !important;
    display: none;
}

@include media-max($bp-medium) {
    .copyright {
        display: block;
    }
}

.f-header {
    --f-header-background-color: transparent;
    --f-header-burger-color: #0e0e0e;
    --f-header-link-color: #{$secondary-color-lighter};

    /*position: -webkit-sticky;*/
    /*position: sticky;*/
    position: fixed;
    top: 0;
    z-index: 10;
    width: 100%;
    height: $f-header-height;
    color: #fff;
    background-color: var(--f-header-background-color);
    transition: height $transition-length ease;
    border-bottom: 1px solid transparent;
    box-shadow: 0 -5px 9px 0px #000;

    .narrow-container {
        padding-top: 0;
        padding-bottom: 0;
        height: 100%;

        > .row {
            height: 100%;
        }
    }

    .header-li {
        a {
            font-weight: 400;
        }
    }

    .logo {
        > img {
            max-height: 68px;
            margin-bottom: 0 !important;
            transition: opacity $transition-length ease;
            position: relative;
            z-index: 10;
        }
    }

    .f-hamburger-switch {
        position: fixed;
        /*top: 12px;*/
        top: 16px;
        right: 16px;
        z-index: 11;
        transform: scale(0.9);
        display: none;
    }

    .f-drawer {
        position: fixed;
        z-index: 10;
        width: 100%;
        height: 100vh;
        top: 0;
        padding-top: 82px;
        background-color: var(--f-header-burger-color);
        transform: translateX(100%);
        transition: all $transition-length ease;
        display: none;
        flex-direction: column;

        .body {
            flex: 1;
        }

        @include links() {
            // color: var(--f-header-link-color);
            transition: color $transition-length ease;
        }

        a:not(.btn):hover {
            color: #bb1b1b;
            text-decoration: none;
        }
    }

    .f-search-box {
        color: $body-color;
    }

    .right-col {
        //text-align: end;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .f-navigation {
            margin-inline-end: 16px;
        }
    }

    .f-dark-mode-switch {
        margin-inline-end: 16px;
    }

    &.drawer-on {
        .f-drawer {
            transform: translateX(0);
        }
    }
}

.search-box-on {
    .f-header {
        .right-col {
            padding-inline-end: 10px;
        }
    }
}

@include media-max($bp-menu) {
    .f-header {
        .logo {
            position: fixed;
            /*top: 10px;*/
            top: 14px;
            left: 16px;
            z-index: 11;

            > img {
                max-height: 40px;
            }
        }

        &.drawer-on {
            .logo {
                > img {
                    opacity: 1;
                }
            }

            .f-search-box:not(.expanded) {
                opacity: 1;
            }
        }

        .f-hamburger-switch {
            display: inline-block;
        }

        .f-drawer {
            display: flex;
        }

        .right-col {
            .f-navigation {
                display: none;
                margin-inline-end: 0;
            }
        }

        .right-col-custom {
            margin-right: 18px;
        }

        .f-search-box {
            position: fixed;
            z-index: 12;
            top: 102px;
            left: 80%;
            margin-inline-end: 0;
            margin-inline-start: 0;
            /*transform: scale(0.5);*/

            &.small.expandable {
                &:not(.expanded) {
                    input:not(.def):not([type="submit"]).large {
                        background-color: transparent;
                        box-shadow: none;
                    }

                    button[type="submit"] {
                        color: #fff;

                        &:hover {
                            background-color: transparent !important;
                        }
                    }
                }
            }
        }

        .f-dark-mode-switch {
            display: none;
        }

        &.drawer-on {
            .f-navigation {
                display: block;
            }

            .f-dark-mode-switch {
                display: block;
                text-align: end;
                margin-inline-end: 8px;
            }
        }
    }
}
</style>
