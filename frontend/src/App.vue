<template>
    <div id="app">
        <f-header></f-header>
        <main>
            <!--        <img alt="Vue logo" src="./assets/logo.png">-->
            <!--            <router-view :key="$route.path"></router-view>-->
            <router-view></router-view>
        </main>
        <f-footer></f-footer>

        <f-breakpoints>
            <f-breakpoint value="768px" code="menu-mobile"></f-breakpoint>
            <f-breakpoint
                value="600px"
                code="data-table-mobile-view"
            ></f-breakpoint>
            <f-breakpoint
                value="940px"
                code="contract-list-dt-mobile-view"
            ></f-breakpoint>
            <f-breakpoint
                value="1000px"
                code="transaction-list-dt-mobile-view"
            ></f-breakpoint>
            <f-breakpoint
                value="1100px"
                code="validator-list-dt-mobile-view"
            ></f-breakpoint>
        </f-breakpoints>
        <f-aria-alert />
    </div>
</template>

<script>
import FBreakpoint from "./components/FBreakpoint.vue";
import FBreakpoints from "./components/FBreakpoints.vue";
import FHeader from "./layouts/FHeader.vue";
import FFooter from "./layouts/FFooter.vue";
import gql from "graphql-tag";
import FAriaAlert from "./components/core/FAriaAlert/FAriaAlert.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { pollingMixin } from "@/mixins/polling.js";

export default {
    name: "App",
    mixins: [pollingMixin],
    components: {
        FAriaAlert,
        FBreakpoint,
        FBreakpoints,
        FHeader,
        FFooter
    },
    apollo: {
        // price: {
        //     query: gql`
        //         query Price($to: String!) {
        //             price(to: $to) {
        //                 price
        //             }
        //         }
        //     `,
        //     result(_data) {
        //         if (!_data.data.price) {
        //             return;
        //         }
        //         let tokenPrice = parseFloat(_data.data.price.price);
        //         tokenPrice = parseInt(tokenPrice * 100000) / 100000;
        //         console.log(tokenPrice, "AAAAAAA");
        //         this.$store.commit("setTokenPrice", tokenPrice);
        //     },
        //     variables() {
        //         return {
        //             to: "USD"
        //         };
        //     }
        // },
        gasPrice: {
            query: gql`
                query GasPrice {
                    gasPrice
                }
            `,
            result(_data) {
                const gasPrice = parseInt(_data.data.gasPrice);
                if (gasPrice) {
                    this.$store.commit("setGasPrice", gasPrice);
                }
            }
        }
    },

    created() {
        this.darkMode(this.$store.state.darkMode);

        this.updateSupplyState();
    },
    computed: {
        ...mapGetters(["networkOptions"])
    },
    mounted() {
        this.getPrice();
        this.getTotalStakes();
        // this.getCirculation();

        const autoconnect = JSON.parse(localStorage.getItem("autoconnect"));
        const walletType = localStorage.getItem("walletType");

        if (autoconnect && walletType === "metamask") {
            this.connectMetamask();
            this.accountsChanged();
            this.chainChanged();
        }
        if (autoconnect && walletType === "trustwallet") {
            console.log("connect trust");
            this.connectTrustWallet();
            this.trustChainChanged();
            this.trustAccountsChanged();
        }
        if (autoconnect && walletType === "wc") {
            console.log("connect wc");
            this.connectWalletConnect();
            this.wcChainChanged();
            this.wcAccountsChanged();
        }
    },

    methods: {
        ...mapMutations(["setTotalSupply", "setZeroAccBalance"]),
        ...mapActions([
            "getPrice",
            "getTotalStakes",
            "getCirculation",
            "createContract",
            "connectMetamask",
            "connectTrustWallet",
            "connectWalletConnect",
            "trustChainChanged",
            "accountsChanged",
            "wcChainChanged",
            "trustAccountsChanged",
            "wcAccountsChanged",
            "chainChanged",
            "updateProviderState",
            "updateZeroAddressBalance"
        ]),
        /**
         * @param {boolean} _on
         */
        setDarkMode(_on) {
            this.$store.commit("setDarkMode", _on);

            this.darkMode(_on);
        },

        /**
         * @param {boolean} _on
         */
        darkMode(_on) {
            const { documentElement } = document;

            documentElement.classList.add("theme-transition");

            if (_on) {
                documentElement.classList.add("dark-theme");
            } else {
                documentElement.classList.remove("dark-theme");
            }

            setTimeout(function() {
                documentElement.classList.remove("theme-transition");
            }, 250);
        },
        async updateSupplyState() {
            const chainState = await this.fetchState();
            this.setTotalSupply(chainState.sealedEpoch.totalSupply);
            const account = await this.fetchAccount();
            this.setZeroAccBalance(account.balance);
        },
        async fetchState() {
            const data = await this.$apollo.query({
                query: gql`
                    query State {
                        state {
                            blocks
                            transactions
                            accounts
                            validators
                            sfcLockingEnabled
                            sealedEpoch {
                                id
                                totalSupply
                                baseRewardPerSecond
                            }
                        }
                    }
                `,
                fetchPolicy: "network-only"
            });

            return data.data.state || {};
        },
        async fetchAccount() {
            const data = await this.$apollo.query({
                query: gql`
                    query AccountByAddress(
                        $address: Address!
                        $cursor: Cursor
                        $count: Int!
                    ) {
                        account(address: $address) {
                            address
                            contract {
                                address
                                deployedBy {
                                    hash
                                    contractAddress
                                }
                                name
                                version
                                compiler
                                sourceCode
                                abi
                                validated
                                supportContact
                                timestamp
                            }
                            balance
                            totalValue
                            txCount
                            txList(cursor: $cursor, count: $count) {
                                pageInfo {
                                    first
                                    last
                                    hasNext
                                    hasPrevious
                                }
                                totalCount
                                edges {
                                    cursor
                                    transaction {
                                        hash
                                        from
                                        to
                                        value
                                        gasUsed
                                        block {
                                            number
                                            timestamp
                                        }
                                        tokenTransactions {
                                            trxIndex
                                            tokenAddress
                                            tokenName
                                            tokenSymbol
                                            tokenType
                                            tokenId
                                            tokenDecimals
                                            type
                                            sender
                                            recipient
                                            amount
                                        }
                                    }
                                }
                            }
                            staker {
                                id
                                createdTime
                                isActive
                            }
                            delegations {
                                totalCount
                                edges {
                                    delegation {
                                        toStakerId
                                        createdTime
                                        amount
                                        claimedReward
                                        pendingRewards {
                                            amount
                                        }
                                    }
                                    cursor
                                }
                            }
                        }
                    }
                `,
                variables: {
                    address: "0x0000000000000000000000000000000000000000",
                    count: 1,
                    cursor: null
                }
            });
            return data.data.account;
        }
    }
};
</script>

<style lang="scss">
@import "./assets/scss/main";

body {
    // background-image: url("./assets/img/bg3.png");
    background-size: cover;
    background-position: right top;
    background-repeat: no-repeat;
}

#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: $f-header-height;

    main {
        flex: 1 1;
        // min-height: 0px;
    }
}

.narrow-container {
    padding-top: 16px;
    padding-bottom: 16px;
}
@media (max-width: 576px) {
    .narrow-container {
        padding-right: 20px !important;
        padding-left: 20px !important;
    }
}
</style>
