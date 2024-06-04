<template>
    <div class="f-navigation">
        <nav>
            <slot>
                <ul class="no-markers" v-if="filteredItems">
                    <li v-for="item in filteredItems" :key="item.id">
                        <a
                            v-if="item.url.indexOf('http') === 0"
                            :href="item.url"
                            target="_blank"
                        >
                            {{ item.title }}
                        </a>
                        <router-link v-else :to="item.url">
                            {{ item.title }}
                        </router-link>
                    </li>
                </ul>
            </slot>
        </nav>
    </div>
</template>

<script>
import { helpersMixin } from "../mixins/helpers.js";

export default {
    mixins: [helpersMixin],

    props: {
        /**
         * Array of navigation links.
         *
         * One item is an object with keys:
         * `url` - link url
         * `title` - link title
         */
        items: {
            type: Array,
            default() {
                return [];
            }
        }
    },

    computed: {
        filteredItems() {
            const mainnetInUrl = window.location.href.includes("mainnet");
            return this.items.filter(item => {
                return !(mainnetInUrl && item.title === "Faucet");
            });
        }
    }
};
</script>

<style lang="scss">
.active-color {
    // color: white;
}
.f-navigation {
    --f-navigation-link-color: #{$secondary-color-lighter};
    --f-navigation-active: #{#000};

    display: inline-block;
    nav {
        ul {
            text-align: end;
            li {
                display: inline-block;
                margin-inline-start: 4px;

                @include links() {
                    color: var(--f-navigation-link-color);

                    //letter-spacing: normal;
                    display: inline-block;
                    padding: 16px 8px;
                    padding-inline-end: 24px;

                    text-decoration: none;
                    transition: all $transition-length ease;
                    border-radius: $border-radius;

                    &.router-link-exact-active,
                    &:hover {
                        color: var(--f-navigation-active);
                        text-decoration: none;
                    }
                }
            }
        }
    }
}

@include media-max(1120px) {
    .f-navigation {
        nav {
            ul {
                li {
                    @include links() {
                        font-size: 0.9em;
                        padding: 16px 4px;
                        padding-inline-end: 16px;
                    }
                }
            }
        }
    }
}

@include media-max($bp-menu) {
    .f-navigation {
        nav {
            ul {
                li {
                    @include links() {
                        font-size: 0.8em;
                        padding: 16px 4px;
                        padding-inline-start: 5px;
                        padding-inline-end: 5px;
                    }
                }
            }
        }

        .no-markers {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
    }
}

@include media-max($bp-menu) {
    .f-navigation {
        nav {
            ul {
                li {
                    @include links() {
                        padding-inline-start: 2px;
                        padding-inline-end: 2px;
                    }
                }
            }
        }
    }
}

@include media-max($bp-menu) {
    .f-navigation {
        // padding-top: 24px;
        nav {
            ul {
                li {
                    font-size: 18px;
                    display: block;
                    @include links() {
                        font-size: 1em;
                        padding: 16px 22px;
                    }
                }
            }
        }
    }
}
</style>
