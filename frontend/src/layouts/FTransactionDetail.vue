<template>
    <div class="f-transaction-detail f-data-layout">
        <f-card>
            <template v-if="!dTransactionByHashError">
                <template
                    v-if="
                        cTransaction.hash &&
                            cTransaction.hash ===
                                '0x0000000000000000000000000000000000000000000000000000000000000000'
                    "
                >
                    Transaction <b>{{ id }}</b> does not exist.
                </template>
                <template v-else>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.hash") }}
                        </div>
                        <div class="col">
                            <div class="break-word">{{ id }}</div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.status") }}
                        </div>
                        <div class="col">
                            <div
                                v-show="
                                    cTransaction && 'status' in cTransaction
                                "
                            >
                                <f-transaction-status
                                    :status="cStatus"
                                ></f-transaction-status>
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.from") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                <router-link
                                    :to="{
                                        name: 'address-detail',
                                        params: { id: cTransaction.from }
                                    }"
                                    >{{ cTransaction.from }}</router-link
                                >
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.to") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                <router-link
                                    :to="{
                                        name: 'address-detail',
                                        params: { id: cTransaction.to }
                                    }"
                                    >{{ cTransaction.to }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.time") }}
                        </div>
                        <div class="col">
                            <div
                                class="break-word"
                                v-show="
                                    cTransaction && cTransaction.block.timestamp
                                "
                            >
                                <timeago
                                    :datetime="
                                        timestampToDate(
                                            cTransaction.block.timestamp
                                        )
                                    "
                                ></timeago>
                                ({{
                                    formatDate(
                                        timestampToDate(
                                            cTransaction.block.timestamp
                                        )
                                    )
                                }})
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.amount") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                <!-- {{ WEIToFTM(cTransaction.value) }} -->
                                {{ toDivide(cTxValue) }}
                                {{ symbol }}
                            </div>
                        </div>
                    </div>
                    <!--
                                <div class="row no-collapse">
                                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.fee') }}</div>
                                    <div class="col"><div class="break-word" v-show="cTransaction">{{  WEIToFTM(cTransaction.fee) }} FTM</div></div>
                                </div>
                    -->
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.block") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                <router-link
                                    :to="{
                                        name: 'block-detail',
                                        params: {
                                            id:
                                                cTransaction.block.number
                                                | formatHexToInt
                                        }
                                    }"
                                >
                                    {{
                                        cTransaction.block.number
                                            | formatHexToInt
                                    }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.gas_used") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                {{ cTransaction.gasUsed | formatHexToInt }}
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.gas_limit") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                {{ cTransaction.gas | formatHexToInt }}
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.gas_price") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                {{ cTransaction.gasPrice | formatHexToInt }} WEI
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.nonce") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                {{ cTransaction.nonce | formatHexToInt }}
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.transaction_fee") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                {{ cTransactionFee }} {{ symbol }}
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.transaction_burn") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                {{ cTransactionBurn }} {{ symbol }}
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{ $t("view_transaction_detail.input_data") }}
                        </div>
                        <div class="col">
                            <div class="break-word" v-show="cTransaction">
                                <span v-if="!showData"
                                    >{{ inputData.slice(0, 42) }}...</span
                                >
                                <span v-else>{{ inputData }}</span>
                                <button
                                    class="btn-view"
                                    @click="showData = !showData"
                                >
                                    <span v-if="!showData">View more</span>
                                    <span v-else>Close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="row no-collapse">
                        <div class="col-4 f-row-label">
                            {{
                                $t("view_transaction_detail.decoded_input_data")
                            }}
                        </div>
                        <div class="col">
                            <div
                                v-if="parseInputFunctionName"
                                class="break-word input-data"
                            >
                                <span>Function: </span>
                                <span>{{ parseInputFunctionName }}</span>
                            </div>
                            <div
                                v-if="parseInputData"
                                class="break-word input-data inputdata-block"
                                v-show="cTransaction"
                            >
                                <div
                                    v-for="data in parseInputData"
                                    :key="data[0]"
                                >
                                    <span class="datakeys">{{ data[0] }}:</span>
                                    <span
                                        v-if="
                                            data[0] === 'calls' &&
                                                parseInputFunctionName ===
                                                    'aggregate3Value'
                                        "
                                    >
                                        <span v-if="data[1][0].length">
                                            <div class="">
                                                {{ data[1][0][0] }}
                                            </div>
                                            <div class="">
                                                {{
                                                    $defi.fromTokenValue(
                                                        data[1][0][2],
                                                        {
                                                            decimals: 18
                                                        }
                                                    )
                                                }}
                                            </div>
                                        </span>
                                    </span>
                                    <span
                                        v-else-if="
                                            Array.isArray(data[1]) &&
                                                data[1].length
                                        "
                                    >
                                        <span
                                            v-for="(key, i) in data[1]"
                                            :key="i + '-' + key"
                                            class=""
                                        >
                                            {{ key }}
                                        </span>
                                    </span>
                                    <span v-else>
                                        <span v-if="data[0] === 'amount'">
                                            {{
                                                $defi.fromTokenValue(data[1], {
                                                    decimals: 18
                                                })
                                            }}
                                        </span>
                                        <span v-else>{{ data[1] }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template
                        v-if="
                            cTransaction &&
                                cTransaction.tokenTransactions &&
                                cTransaction.tokenTransactions.length !== 0
                        "
                    >
                        <div class="row no-collapse">
                            <div class="col-4 f-row-label">
                                {{ $t("view_transaction_detail.token_txs") }}
                            </div>
                        </div>
                        <token-transactions-list
                            v-if="cTransaction"
                            :token-transactions="cTransaction.tokenTransactions"
                        />
                    </template>
                </template>
            </template>
            <template v-else>
                <div class="query-error">
                    {{ $t("view_transaction_detail.transaction_not_found") }}
                </div>
            </template>
        </f-card>
    </div>
</template>

<script>
import FCard from "../components/core/FCard/FCard.vue";
import gql from "graphql-tag";
import { WEIToFTM, toDivide } from "../utils/transactions.js";
import { formatHexToInt, timestampToDate, formatDate } from "../filters.js";
import FTransactionStatus from "../components/FTransactionStatus.vue";
import TokenTransactionsList from "@/data-tables/TokenTransactionsList";
import { mapGetters, mapActions } from "vuex";
import { parseArgs, parseFunctionName } from "../contracts/abi/collection.js";
import { toInt } from "../utils";

export default {
    components: {
        TokenTransactionsList,
        FTransactionStatus,
        FCard
    },

    props: {
        /** Transaction id */
        id: {
            type: String,
            required: true,
            default: ""
        }
    },

    created: async function() {
        this.$store.state.inputData = "";

        await this.getData(this.id);
    },

    apollo: {
        transaction: {
            query: gql`
                query TransactionByHash($hash: Bytes32!) {
                    transaction(hash: $hash) {
                        hash
                        index
                        nonce
                        from
                        to
                        value
                        burn
                        gas
                        gasUsed
                        gasPrice
                        inputData
                        status
                        block {
                            hash
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
            `,
            variables() {
                return {
                    hash: this.id
                };
            },
            error(_error) {
                this.dTransactionByHashError = _error.message;
            }
        }
    },

    data() {
        return {
            dTransactionByHashError: "",
            showData: false
        };
    },

    computed: {
        ...mapGetters(["symbol", "inputData"]),

        cTransaction() {
            // return this.transaction || this.getInputData(this.id);
            // console.log(this.getInputData(this.id), "TXXXXXX");
            console.log(this.transaction, "cTransaction");
            return this.transaction === "0x"
                ? this.inputData
                : this.transaction || { block: {} };
        },
        cTxValue() {
            const value = this.$defi.fromTokenValue(this.cTransaction.value, {
                decimals: 18
            });
            if (value > 1) {
                return value.toFixed(4);
            } else {
                return value.noExponents();
            }
        },

        parseInputFunctionName() {
            // const data = this.cTransaction.inputData;
            const data = this.inputData;
            try {
                if (data && parseInt(data.toString())) {
                    return parseFunctionName(data);
                } else return "";
            } catch (e) {
                return "";
            }
        },
        parseInputData() {
            // const data = this.cTransaction.inputData;
            const data = this.inputData;

            try {
                if (data) {
                    if (parseInt(data.toString())) {
                        const dataArr = this.parseArgs(data);
                        console.log(
                            Object.entries(dataArr).filter(d => {
                                if (isNaN(parseInt(d[0]))) {
                                    return d;
                                }
                            }),
                            dataArr,
                            "INPUTDATA"
                        );

                        return Object.entries(dataArr).filter(d => {
                            if (isNaN(parseInt(d[0]))) {
                                return d;
                            }
                        });
                    } else return "";
                } else return "";
            } catch (e) {
                return "";
            }
        },

        parseD() {
            return this.$store.state.inputData;
        },

        cTransactionFee() {
            const { transaction } = this;

            if (transaction) {
                return WEIToFTM(
                    this.formatHexToInt(transaction.gasPrice) *
                        this.formatHexToInt(transaction.gasUsed)
                );
            }

            return 0;
        },

        cTransactionBurn() {
            const { transaction } = this;

            if (transaction) {
                return WEIToFTM(this.formatHexToInt(transaction.burn));
            }

            return 0;
        },

        cStatus() {
            let status = 2;

            if (this.transaction) {
                if (this.transaction.status !== null) {
                    status = this.formatHexToInt(this.transaction.status);
                }
            }

            return status;
        }
        /*
            cLoading() {
                return this.$apollo.queries.transaction.loading;
            }
*/
    },

    methods: {
        ...mapActions(["getInputData"]),
        getData(txHash) {
            this.getInputData(txHash);
        },
        toInt,
        WEIToFTM,
        toDivide,
        formatHexToInt,
        timestampToDate,
        formatDate,
        parseArgs,
        parseFunctionName
    }
};
</script>

<style lang="scss">
.btn-view {
    --btn-view-color: black;
    --btn-view-border: 1px solid black;
    border: none;
    outline: none;
    margin-left: 6px;
    display: inline-block;
    background-color: transparent;
    transition: 200ms;
    font-size: 14px;
    color: var(--btn-view-color);
    span {
        text-decoration: underline;
    }

    &:active {
        color: #337afe;
    }
    @media (min-width: 768px) {
        &:hover {
            color: #337afe;
        }
    }
}

.inputdata-block {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.datakeys {
    padding-right: 4px;
}
.f-transaction-detail {
    .token-transaction-item {
        margin-left: 80px;
    }
    .token-transaction-item {
        padding-bottom: 0.3em;
    }

    @include links() {
        color: $primary-color;
    }
}
</style>
