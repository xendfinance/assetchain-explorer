<template>
    <div class="f-address-detail narrow-container narrow-container-custom">
        <div class="f-subsection title">
            <h2 class="h1">
                {{ $t("view_validator_list.title") }}
            </h2>
            <div class="mobile-btn">
                <div
                    v-if="!address"
                    :class="
                        !darkMode
                            ? 'btn-connect btn primary'
                            : 'btn-connect-dark btn primary'
                    "
                    @click="showModal = true"
                >
                    Connect Wallet
                </div>
                <div
                    v-else
                    :class="
                        !darkMode
                            ? 'btn-connect btn large primary'
                            : 'btn-connect-dark btn large primary'
                    "
                >
                    <div class="btn-connect__content">
                        <div v-if="isChainIdCorrect">
                            <Warning />
                        </div>
                        <span class="btn-connect__content--text"
                            >{{ shortAddress }}
                        </span>
                        <span
                            class="btn-connect__content--icon"
                            @click="disconnect()"
                        >
                            <icon
                                data="@/assets/svg/exit.svg"
                                width="18"
                                height="18"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="connect-block">
            <div
                v-if="!address"
                :class="
                    !darkMode
                        ? 'btn-connect btn large primary'
                        : 'btn-connect-dark btn large primary'
                "
                @click="showModal = true"
            >
                Connect Wallet
            </div>
            <div
                v-else
                :class="
                    !darkMode
                        ? 'btn-connect btn large primary'
                        : 'btn-connect-dark btn large primary'
                "
            >
                <div class="btn-connect__content">
                    <div v-if="isChainIdCorrect">
                        <Warning />
                    </div>
                    <span class="btn-connect__content--text"
                        >{{ shortAddress }}
                    </span>
                    <span
                        class="btn-connect__content--icon"
                        @click="disconnect()"
                    >
                        <icon
                            data="@/assets/svg/exit.svg"
                            width="18"
                            height="18"
                        />
                    </span>
                </div>
            </div>
        </div>
        <div class="section">
            <!-- <f-tabs> -->
            <!-- <template #wallet-delegations>
                    <h2 class="tab-title">
                        {{ $t("view_address_detail.wallet-delegations") }}
                        <span class="f-records-count"
                            >({{ filteredUserStakes.length }})</span
                        >
                    </h2>
                </template> -->
            <!-- <template #all-delegations>
                    <h2 class="tab-title delegations">
                        {{ $t("view_address_detail.all-delegations") }}
                        <span class="f-records-count"
                            >({{ delegationsRecordsCount }})</span
                        >
                    </h2>
                </template> -->

            <!--<f-tab title-slot="wallet-delegations">
                     <address-delegation-list
                        :account-address="id"
                        @records-count="onDelegationsRecordsCount"
                    /> -->
            <WalletDelegationsList
                :columns="columns"
                :items="filteredUserStakes"
                :loading="getLoadingStakes"
                @unstake="openUnstake"
                @claim="openClaim"
                @connect="showModal = true"
            />
            <!--</f-tab>
                <f-tab title-slot="all-delegations">
                     <address-delegation-list
                        :account-address="id"
                        @records-count="onDelegationsRecordsCount"
                    />
                    <f-data-table :columns="columns" />
                </f-tab>-->

            <!-- </f-tabs> -->
        </div>
        <div>
            <h2 class="h1">
                History of unstaking
            </h2>
        </div>
        <div class="section">
            <WalletDelegationsHistoryList
                :loading="getLoadingStakes"
                @unstake="openUnstake"
            />
        </div>
        <ConnectDialog v-if="showModal" @close="showModal = false" />
        <UnstakeDialog
            v-if="showUnstakeDialog"
            :amount="unstakeItem.amount"
            :loading="getDialogLoading"
            :errorMsg="getErrorMsg"
            @close="closeUntakeDialog"
            @action="unstake"
        />
        <ClaimDialog
            v-if="showClaimDialog"
            :amount="claimItem.rewards"
            :loading="getDialogLoading"
            :errorMsg="getErrorMsg"
            @close="closeClaimDialog"
            @claim="claim"
        />
        <SuccessAlert
            v-if="showSuccessAlert"
            :successMsg="getSuccessMsg"
            @close="closeSuccess"
        />
        <ErrorAlert
            v-if="showErrorAlert"
            :errorMsg="getErrorMsg"
            @close="closeError"
        />
    </div>
</template>

<script>
import gql from "graphql-tag";
import { WEIToFTM, FTMToUSD } from "../utils/transactions.js";
// import FTransactionList from "../data-tables/FTransactionList.vue";
import { formatHexToInt, timestampToDate } from "../filters.js";
// import FTabs from "@/components/core/FTabs/FTabs.vue";
// import FTab from "@/components/core/FTabs/FTab.vue";
// import AddressDelegationList from "@/data-tables/AddressDelegationList.vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import ConnectDialog from "../components/dialogs/ConnectDialog.vue";
// import FDataTable from "@/components/core/FDataTable/FDataTable.vue";
import WalletDelegationsList from "../data-tables/WalletDelegationsList.vue";
import WalletDelegationsHistoryList from "../data-tables/WalletDelegationsHistoryList.vue";
import UnstakeDialog from "../components/dialogs/UnstakeDialog.vue";
import ClaimDialog from "../components/dialogs/ClaimDialog.vue";
import SuccessAlert from "../components/dialogs/SuccessAlert.vue";
import ErrorAlert from "../components/dialogs/ErrorAlert.vue";
import Warning from "../components/Warning";
// import TooltipGas from "../components/TooltipGas.vue";

export default {
    components: {
        // AddressDelegationList,
        // FTab,
        // FTabs,
        ConnectDialog,
        // FDataTable,
        WalletDelegationsList,
        WalletDelegationsHistoryList,
        UnstakeDialog,
        ClaimDialog,
        SuccessAlert,
        ErrorAlert,
        Warning
        // TooltipGas
        // FTransactionList,
    },

    props: {
        /** Address id. */
        // id: {
        //     type: String,
        //     required: true,
        //     default: ""
        // },

        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 20
        }
    },
    apollo: {
        account: {
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
            variables() {
                return {
                    address: this.id,
                    count: this.itemsPerPage,
                    cursor: null
                };
            },
            error(_error) {
                this.dAccountByAddressError = _error.message;
            }
        }
    },

    data() {
        return {
            columns: [
                {
                    name: "stakingName",
                    label: "Staking name"
                    // itemProp: "delegation.createdTime"
                },
                {
                    name: "validator",
                    label: "Validator",
                    cssClass: "align-center"
                    // itemProp: "delegation._validator",
                    // formatter: (_value, _item) => _item._validator,
                },
                {
                    name: "amount",
                    label: `Amount (RWA)`,
                    cssClass: "align-center"
                    // itemProp: "delegation.amount",
                },
                {
                    name: "rewards",
                    label: `Rewards (RWA)`,
                    cssClass: "align-center"
                    // itemProp: "delegation.amount",
                },
                {
                    name: "action",
                    label: "",
                    cssClass: "align-center"
                    // itemProp: "delegation.lockedUntil"
                },
                {
                    name: "claim",
                    label: "",
                    cssClass: "align-center"
                    // itemProp: "delegation.lockedUntil"
                }
            ],
            amount: "",
            unstakeItem: {},
            claimItem: {},
            showUnstakeDialog: false,
            showClaimDialog: false,
            showModal: false,
            showSuccessAlert: false,
            showErrorAlert: false,
            /** @type {FMintAccount} */
            fMintAccount: {
                collateral: [],
                debt: []
            },
            /** @type {DefiToken[]} */
            tokens: [],
            dRecordsCount: 0,
            erc20RecordsCount: 0,
            erc721RecordsCount: 0,
            erc1155RecordsCount: 0,
            assetsRecordsCount: 0,
            delegationsRecordsCount: 0,
            dAccountByAddressError: "",
            validators: null,
            loadDelegations: false,
            rwaChainId: process.env.VUE_APP_CHAIN_ID
        };
    },

    watch: {
        getSuccessMsg(value) {
            if (value) {
                this.showUnstakeDialog = false;
                this.showClaimDialog = false;
                this.showSuccessAlert = true;
            }
        },
        getErrorMsg(value) {
            if (value) {
                this.showUnstakeDialog = false;
                this.showClaimDialog = false;
                this.showErrorAlert = true;
            }
        },
        /**
         * Watch route change and reset some properties, if only route parameter changes (whole component is reused,
         * not rendered from scratch!).
         *
         * @param {object} _to
         * @param {object} _from
         */
        $route(_to, _from) {
            if (_to.name === _from.name) {
                this.appendItems = false;
                this.initDeFi();
            }
        }
    },

    computed: {
        ...mapGetters([
            "shortAddress",
            "filteredUserStakes",
            "symbol",
            "getLoadingStakes",
            "getDialogLoading",
            "getErrorMsg",
            "getSuccessMsg",
            "chainId"
        ]),
        isChainIdCorrect() {
            return parseInt(this.chainId) != this.rwaChainId;
        },
        ...mapState({
            address: state => state.address,
            darkMode: state => state.darkMode
        }),
        cAccount() {
            if (this.account && this.account.contract) {
                this.$emit("is-contract");
            } else {
                this.$emit("is-address");
            }

            return this.account;
        },

        cTransactionItems() {
            const { cAccount } = this;
            const txList = cAccount ? cAccount.txList : null;

            if (txList) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.dRecordsCount = formatHexToInt(txList.totalCount);
            }

            return {
                action: this.appendItems ? "append" : "replace",
                hasNext: txList ? txList.pageInfo.hasNext : false,
                data: txList ? txList.edges : []
            };
        },

        cAssets() {
            const { cAccount } = this;
            const assets = {};
            const validatorIds = [];

            if (cAccount) {
                const { delegations } = cAccount;

                assets.available = cAccount.balance;
                // assets.stashed = cAccount.stashed || 0;

                assets.delegated = 0;
                assets.pending_rewards = 0;
                assets.claimed_rewards = 0;

                if (delegations && delegations.edges) {
                    delegations.edges.forEach(_edge => {
                        const { delegation } = _edge;

                        validatorIds.push(delegation.toStakerId);

                        assets.delegated += delegation
                            ? WEIToFTM(delegation.amount)
                            : 0;
                        assets.pending_rewards +=
                            delegation && delegation.pendingRewards
                                ? WEIToFTM(delegation.pendingRewards.amount)
                                : 0;
                        assets.claimed_rewards += delegation
                            ? WEIToFTM(delegation.claimedReward)
                            : 0;
                    });

                    this.setValidators(validatorIds);
                }
            }

            return assets;
        },

        cLoading() {
            return this.$apollo.queries.account.loading;
        }
    },

    created() {
        // this.$store.dispatch("isLoggedIn");
        /** If `true`, transaction items will be appended. */
        this.appendItems = false;
        // this.isLoggedIn();
        setTimeout(() => {
            // this.initDeFi();
        }, 400);

        // postpone delegations loading
        setTimeout(() => {
            this.loadDelegations = true;
        }, 2400);
    },
    // setup() {
    //     const store = useStore();

    //     return {
    //         connectMetamask: mapActions("connectMetamask", ["connectMetamask"]),
    //         store
    //     };
    // },

    methods: {
        ...mapActions([
            "connectMetamask",
            // "isLoggedIn",
            "disconnect",
            "undelegate",
            "claimRewards"
        ]),
        ...mapMutations(["setErrorMsg", "setSuccessMsg"]),
        closeSuccess() {
            this.setSuccessMsg("");
            this.showSuccessAlert = false;
        },
        closeError() {
            this.setErrorMsg("");
            this.showErrorAlert = false;
        },
        async openUnstake(item) {
            this.unstakeItem = item;
            this.showUnstakeDialog = true;
        },
        async unstake(amount) {
            this.undelegate({
                toValidatorID: this.unstakeItem.validator,
                amount: amount
            });
        },
        async openClaim(item) {
            this.claimItem = item;
            this.showClaimDialog = true;
        },
        async claim() {
            this.claimRewards({
                toValidatorID: this.claimItem.validator
            });
        },
        closeUntakeDialog() {
            this.setErrorMsg("");
            this.setSuccessMsg("");
            this.showUnstakeDialog = false;
        },
        closeClaimDialog() {
            this.setErrorMsg("");
            this.setSuccessMsg("");
            this.showClaimDialog = false;
        },
        /**
         * Get one item for asset data table.
         *
         * @param {string} _assetName
         * @param {string|number} _value
         */
        /*
            getAssetItem(_assetName, _value) {
                return {
                    asset: _assetName,
                    balance: this.toFTM(_value),
                    valueInFTM: this.toFTM(_value),
                    valueInUSD: this.toUSD(_value)
                }
            },
*/

        async initDeFi() {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchFMintAccount(this.id),
                $defi.fetchERC20Assets(this.id),
                // $defi.fetchERC20Tokens(),
                $defi.init()
            ]);

            this.fMintAccount = result[0];
            this.tokens = result[1];

            setTimeout(async () => {
                this.tokens = await $defi.getERC20TokensWithAvailableBalances(
                    this.id,
                    this.tokens
                );
            }, 30);
        },

        /**
         * @param {array} _validatorIds
         * @return {Promise<void>}
         */
        async setValidators(_validatorIds) {
            let data;

            if (this.validators === null) {
                data = await this.fetchValidators();

                this.validators = data.filter(_validator => {
                    if (_validatorIds.indexOf(_validator.id) > -1) {
                        _validator.name = `${
                            _validator.stakerInfo
                                ? _validator.stakerInfo.name
                                : this.$t("unknown")
                        }, ${parseInt(_validator.id, 16)}`;
                        return true;
                    }

                    return false;
                });
            }
        },

        async fetchValidators() {
            const data = await this.$apollo.query({
                query: gql`
                    query StakerById {
                        stakers {
                            id
                            stakerAddress
                            stakerInfo {
                                name
                                website
                                contact
                                logoUrl
                            }
                        }
                    }
                `,
                fetchPolicy: "network-only"
            });

            return data.data.stakers;
        },

        async getStakerById(_id) {
            const data = await this.$apollo.query({
                query: gql`
                    query StakerById($id: Long!) {
                        staker(id: $id) {
                            id
                            stakerAddress
                            stakerInfo {
                                name
                                website
                                contact
                                logoUrl
                            }
                        }
                    }
                `,
                variables: {
                    id: _id
                },
                fetchPolicy: "network-only"
            });

            return data.data.staker;
        },

        /**
         * Convert value to FTM.
         *
         * @param {string|number} _value
         * @param {boolean} _isNumber Value is number.
         * @return {string}
         */
        toFTM(_value, _isNumber) {
            return _isNumber ? _value : WEIToFTM(_value);
        },

        /**
         * Convert value to USD.
         *
         * @param {string|number} _value
         * @return {string}
         */
        toUSD(_value) {
            return FTMToUSD(WEIToFTM(_value), this.$store.state.tokenPrice);
        },

        onErc20RecordsCount(_count) {
            this.erc20RecordsCount = _count;
        },

        onErc721RecordsCount(_count) {
            this.erc721RecordsCount = _count;
        },

        onErc1155RecordsCount(_count) {
            this.erc1155RecordsCount = _count;
        },

        onAssetsRecordsCount(_count) {
            this.assetsRecordsCount = _count;
        },

        onDelegationsRecordsCount(_count) {
            this.delegationsRecordsCount = _count;
        },

        onFetchMore() {
            const { cAccount } = this;
            const txList = cAccount ? cAccount.txList : null;

            if (txList && txList.pageInfo && txList.pageInfo.hasNext) {
                const cursor = txList.pageInfo.last;
                this.$apollo.queries.account.fetchMore({
                    variables: {
                        address: this.id,
                        count: this.itemsPerPage,
                        cursor
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        this.appendItems = true;
                        return fetchMoreResult;
                    }
                });
            }
        },

        WEIToFTM,
        FTMToUSD,
        timestampToDate
    }
};
</script>

<style lang="scss">
.mobile-btn {
    display: block;
    width: 100%;
    max-width: 240px;
    @media (min-width: 640px) {
        display: none;
    }
    div {
        width: 100%;
    }
}
.title {
    width: 100%;
    max-width: 550px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    justify-items: center;
    gap: 32px;
    padding-top: 60px;
    @media (min-width: 640px) {
        padding-top: 48px;
        margin: 0;
    }
}
.section {
    padding-top: 10px;
}
.tab-title {
    font-weight: 400;
}
.h1 {
    font-family: "Fira Sans";
    color: #fff !important;
}
div {
    font-family: "Fira Sans";
}
.f-address-detail {
    .balance {
        height: calc(100% - 48px);
        text-align: end;

        h3 {
            margin-bottom: 0;
            text-align: end;
        }

        .usd {
            color: $light-gray-color;
            font-size: 26px;
        }
    }

    .num-block {
        h2 {
            margin-top: 16px;
            margin-bottom: 4px;
            text-align: center;
        }

        .num {
            font-size: $fs36;
            font-weight: bold;
            text-align: center;
        }
    }

    .f-tabs {
        h2 {
            font-size: 18px;
        }
    }
}
.f-subsection {
    h1 {
        font-size: 42px;
        font-weight: 400;
        text-align: center;
    }
    .f-card {
        border-radius: 8px !important;
    }
    .no-markers {
        margin: 0 5px !important;
    }
}

.connect-block {
    display: none;
    @media (min-width: 640px) {
        display: block;
    }
}

.narrow-container-custom {
    position: relative;
    padding: 0;
    padding-bottom: 40px !important;
    .connect-block {
        position: absolute;
        top: 40px;
        right: 0;
        z-index: 8;
    }
    .no-markers {
        border-bottom: none;
    }
}

.btn-connect {
    position: relative;
    z-index: 1 !important;
    width: 232px;
    height: 55px;

    &__content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        &--text {
            margin-right: 6px;
            font-weight: 500;
        }
        &--icon {
            margin-bottom: 4px;
        }
        &--icon svg * {
            transition: 200ms;
            // stroke: #fff;
        }
    }
}
.btn-connect-dark {
    position: relative;
    z-index: 1 !important;
    width: 177px;
    height: 48px;
    color: #fff !important;
    background-color: var(--f-primary-dark-color);
    &:hover {
        background: linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15)
            ),
            $primary-dark !important;
    }

    &:active {
        background: linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.25),
                rgba(0, 0, 0, 0.25)
            ),
            $primary-dark !important;
    }
    &:hover .btn-connect__content--icon svg * {
        // background-color: var(--f-primary-dark-color);
        background: linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15)
            ),
            $primary-dark !important;
    }
}

.delegation {
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media (max-width: 768px) {
    .narrow-container-custom {
        position: relative;
        padding: 0 !important;
        padding-bottom: 40px !important;
        margin-top: 40px;
        .connect-block {
            position: absolute;
            top: -20px;
            right: 20px;
            left: 20px;
            z-index: 8;
        }
        .no-markers {
            border-bottom: none;
        }
    }
}

@media (min-width: 600px) {
    .narrow-container-custom {
        padding: 0;
    }
}

@media (max-width: 468px) {
    .f-subsection {
        h1 {
            margin-left: 5px;
            font-size: 42px;
            font-weight: 400;
            text-align: left;
        }
        .no-markers {
            li {
                padding-left: 0;
                h2 {
                    font-size: 16px !important;
                }
            }
        }
    }

    .btn-connect {
        width: 100%;
        height: 55px;
    }
    .btn-connect-dark {
        width: 100%;
        height: 55px;
        color: #fff !important;
    }
}

@media (max-width: 440px) {
    .f-tabs {
        ul {
            width: 100% !important;
            font-size: 10px !important;
        }
    }
}
</style>
