<template>
    <ul class="socialmedialinks no-markers">
        <li>
            <div>
                <router-link to="/" class="logo">
                    <img src="/logo-dark.svg" alt="xend" class="not-fluid" />
                </router-link>
            </div>
            <div class="socialmedialinks_block">
                <span class="socialmedialinks_copyright">
                    Asset Chain Scan is a Block Explorer and Analytics Platform
                    for Asset Chain by Xend Finance.</span
                >
                <button class="add-chain" @click="addChain()">
                    <MetamaskSvg />
                    <span class="button-text">
                        Add Asset Chain Network
                    </span>
                </button>
            </div>
        </li>
        <li>
            <h2>
                Company
            </h2>
            <div class="socialmedialinks_list">
                <a href="mailto:hello@xend.finance" target="_blank">
                    Contact us</a
                >
                <a href="https://xend.finance/terms" target="_blank">
                    Terms & Conditions</a
                >
                <a href="https://xend.finance/policy" target="_blank">
                    Privacy Policy</a
                >
            </div>
        </li>
        <li>
            <h2>
                Tools
            </h2>
            <div class="socialmedialinks_list">
                <!-- <a href="" target="_blank">
                    Bridge
                </a> -->
                <a :href="bridgeUrl" target="_blank">Bridge</a>
                <a :href="swapUrl" target="_blank">Swap </a>
                 <a :href="advancedExplorerUrl" target="_blank">Advanced Explorer </a>
            </div>
        </li>
        <li>
            <h2>
                Staking
            </h2>
            <div class="socialmedialinks_list">
                <a :href="stakingUrl" target="_blank"
                    >Native Staking</a
                >
                <a href="/staking" target="_blank">Validator Staking </a>
            </div>
        </li>
        <li>
            <h2>
                Developers
            </h2>
            <div class="socialmedialinks_list">
                <a
                    :href="docsUrl"
                    target="_blank"
                >
                    Documentation
                </a>
                <a
                    :href="academyUrl"
                    target="_blank"
                    >Asset Chain Academy</a
                >
                <a href="https://t.me/XendFinanceDevs" target="_blank"
                    >Asset Chain Developers</a
                >
            </div>
        </li>

        <li>
            <h2>
                Community
            </h2>
            <div class="socialmedialinks_grid">
                <div class="socialmedialinks_list">
                    <div>
                        <a
                            href="http://web.facebook.com/XendFinance"
                            target="_blank"
                            rel="nofollow"
                        >
                            <icon
                                data="@/assets/svg/social-media/mobile/facebook.svg"
                                width="18"
                                height="18"
                            ></icon>
                            <span class="socialmedialinks_label">Facebook</span>
                        </a>
                    </div>
                    <div>
                        <a
                            href="https://twitter.com/xendfinance"
                            target="_blank"
                            rel="nofollow"
                        >
                            <icon
                                data="@/assets/svg/social-media/mobile/twitter.svg"
                                width="18"
                                height="18"
                            ></icon>
                            <span class="socialmedialinks_label">Twitter</span>
                        </a>
                    </div>
                    <div>
                        <a
                            href="https://t.me/XendFinanceDevs"
                            target="_blank"
                            rel="nofollow"
                        >
                            <icon
                                data="@/assets/svg/social-media/mobile/telegram.svg"
                                width="18"
                                height="18"
                            ></icon>
                            <span class="socialmedialinks_label">Telegram</span>
                        </a>
                    </div>
                </div>
                <div class="socialmedialinks_list">
                    <div>
                        <a
                            href="http://www.reddit.com/r/XendFinance/"
                            target="_blank"
                            rel="nofollow"
                        >
                            <icon
                                data="@/assets/svg/social-media/mobile/reddit.svg"
                                width="18"
                                height="18"
                            ></icon>
                            <span class="socialmedialinks_label">Reddit</span>
                        </a>
                    </div>
                    <div>
                        <a
                            href="https://discord.gg/QGHb7jp2GV"
                            target="_blank"
                            rel="nofollow"
                        >
                            <icon
                                data="@/assets/svg/social-media/mobile/discord.svg"
                                width="18"
                                height="18"
                            ></icon>
                            <span class="socialmedialinks_label">Discord</span>
                        </a>
                    </div>
                    <div>
                        <a
                            href="https://www.youtube.com/channel/UCcR2lTpYwCws-axra4AAO8Q/featured"
                            target="_blank"
                            rel="nofollow"
                        >
                            <icon
                                data="@/assets/svg/social-media/mobile/youtube.svg"
                                width="18"
                                height="18"
                            ></icon>
                            <span class="socialmedialinks_label">Youtube</span>
                        </a>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
import MetamaskSvg from "../assets/svg/Metamask.vue";
import { mapActions } from "vuex";

export default {
    components: {
        MetamaskSvg
    },
    methods: {
        ...mapActions(["addChain"])
    },
    data() {
        return {
            bridgeUrl: process.env.VUE_APP_BRIDGE_URL,
            swapUrl: process.env.VUE_APP_SWAP_URL,
            stakingUrl: process.env.VUE_APP_STAKING_URL,
            docsUrl: process.env.VUE_APP_DOCS_URL,
            academyUrl: process.env.VUE_APP_ACADEMY_URL,
            advancedExplorerUrl: process.env.VUE_APP_ADAVANCE_EXPLORER_URL
        };
    }
};
</script>

<style lang="scss" scoped>
.socialmedialinks {
    --f-social-media-links-color: #{$secondary-color-lighter};
    color: var(--f-social-media-links-color);

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: start;
    margin-top: 20px;
    padding: 40px 20px !important;
    // border-bottom: 1px solid #1e2643;
    text-align: center;
    padding: 8px;

    &_label {
        padding-left: 10px;
        font-size: 15px;
        vertical-align: -webkit-baseline-middle;
    }

    &_grid {
        display: flex;
        gap: 16px;
    }

    &_list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-weight: 400;
        // color: #bababa;

        a {
            color: #fff !important;
        }
    }

    &_block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        button {
            border-radius: 6px;
            font-size: 12px;
            width: 170px;
            height: 28px;
            background: #337afe;
            padding: 0 6px;
            color: white;
            border: none;
            cursor: pointer;
            &:hover {
                background: #2b6fee;
            }
            &:hover {
                background: #184aa8;
            }
        }
        .add-chain {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    &_copyright {
        width: 294px;
        font-size: 15px;
        font-weight: 400;
        text-align: start;
        line-height: 22px;
        color: #fff;
    }

    li {
        display: flex;
        flex-direction: column;
        // color: #bababa;
        font-weight: 700;
        align-items: start;
        justify-content: space-around;
        gap: 4px;
        div {
            display: flex;
            vertical-align: middle;

            @include links() {
                color: #fff;
                transition: color $transition-length ease;
            }

            a {
                display: flex;
                align-items: center;
            }

            a:not(.btn):hover {
                color: $primary-color;
                text-decoration: none;
            }
        }
    }
}

@include media-max($bp-medium) {
    .socialmedialinks {
        &_label {
            display: none;
        }
    }
}
h2 {
    font-size: 15px;
    margin-bottom: 15px;
    color: #fff;
}
</style>
