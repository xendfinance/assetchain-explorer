<template>
    <div class="f-navigation">
        <nav>
            <slot>
                <ul class="no-markers" v-if="filteredItems">
                    <li
                        v-for="item in filteredItems"
                        :key="item.id"
                        class="nav-item"
                    >
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
                        <ul v-if="item.subcontent" class="dropdown">
                            <li
                                v-for="subitem in item.subcontent"
                                :key="subitem.url"
                                class="by"
                            >
                                <a
                                    v-if="subitem.url.indexOf('http') === 0"
                                    :href="subitem.url"
                                    target="_blank"
                                >
                                    {{ subitem.title }}
                                </a>
                                <router-link v-else :to="subitem.url">
                                    {{ subitem.title }}
                                </router-link>
                            </li>
                        </ul>
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
.f-navigation {
    --f-navigation-link-color: #{$secondary-color-lighter};
    --f-navigation-active: #{#000};

    display: inline-block;

    nav {
        ul {
            /* text-align: end; */

            li {
                display: inline-block;
                margin-inline-start: 4px;
                position: relative;

                @include links() {
                    color: var(--f-navigation-link-color);
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

                .dropdown {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0px;
                    background: #171822;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    padding: 8px 0px;
                    min-width: 200px;
                    z-index: 1000;

                    .by {
                        /* display: flex; */
                        display: block;
                        text-align: center;

                        @include links() {
                            color: var(--f-navigation-link-color);
                            display: block;
                            padding: 8px 16px;
                            text-decoration: none;
                            transition: all $transition-length ease;

                            &:hover {
                                background: var(--f-navigation-link-color);
                                color: white;
                            }
                        }
                    }
                }

                &:hover .dropdown {
                    display: block;
                }
            }
        }
    }
}
</style>
