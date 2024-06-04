<template>
    <div class="container">
        <div
            class="hoverable"
            @mouseover="showTooltip = true"
            @mouseleave="showTooltip = false"
        >
            <WarningIcon />
        </div>
        <div v-if="showTooltip" class="tooltip">
            Change network
        </div>
    </div>
</template>

<script>
import WarningIcon from "../assets/svg/WarningIcon.vue";

export default {
    components: { WarningIcon },
    data() {
        return {
            showTooltip: false
        };
    }
};
</script>

<style>
.container {
    position: relative;
}

.hoverable {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.tooltip {
    min-width: 132px;
    position: absolute;
    top: -30px; /* Расположение плашки сверху */
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 120, 120, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 8px;
    white-space: nowrap;
    border: 1px solid red;
    z-index: 1; /* Чтобы плашка была выше дива */
}
</style>
