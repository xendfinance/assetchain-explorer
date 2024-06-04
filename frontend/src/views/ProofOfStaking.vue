<template>
    <div class="narrow-container">
        <div class="f-subsection">
            <h2 class="h1">
                {{ $t("view_validator_list.validators") }}
                <span v-if="dRecordsCount" class="f-records-count"
                    >({{ dRecordsCount }})</span
                >
            </h2>

            <f-validator-list
                code="validators"
                @records-count="onRecordsCount"
                @validator-list-totals="onValidatorListTotals"
                @validator-list-offline="onValidatorListOffline"
                @validator-list-flagged="onValidatorListFlagged"
                @validator-list-inactive="onValidatorListInactive"
            >
            </f-validator-list>
        </div>
    </div>
</template>

<script>
import FValidatorList from "../data-tables/FValidatorListForSelect.vue";

export default {
    components: {
        FValidatorList
    },
    data() {
        return {
            dRecordsCount: 0
        };
    },
    methods: {
        /**
         * @param {int} _num
         */
        onRecordsCount(_num) {
            this.dRecordsCount = _num;
        }
    }
};
</script>
