<template>
    <div class="tooltip">
        <div>
            <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="10.5" cy="10.5" r="10.5" fill="white" />
                <path
                    d="M11.4612 11.833C11.4115 11.9902 11.3846 12.2344 11.3805 12.5656H9.70413C9.72896 11.8661 9.79519 11.3839 9.9028 11.119C10.0104 10.8499 10.2877 10.5416 10.7348 10.1939L11.188 9.83999C11.337 9.72823 11.457 9.60613 11.5481 9.47368C11.7137 9.24603 11.7964 8.99562 11.7964 8.72244C11.7964 8.40787 11.7033 8.12227 11.517 7.86565C11.3349 7.60488 10.9997 7.4745 10.5112 7.4745C10.0311 7.4745 9.68964 7.63386 9.48683 7.95257C9.28815 8.27128 9.18881 8.6024 9.18881 8.94595H7.39452C7.44419 7.76631 7.85603 6.93021 8.63004 6.43766C9.11845 6.12309 9.71862 5.96581 10.4305 5.96581C11.366 5.96581 12.142 6.18932 12.7588 6.63634C13.3796 7.08336 13.6901 7.74561 13.6901 8.6231C13.6901 9.16118 13.5555 9.61441 13.2865 9.98279C13.1292 10.2063 12.8271 10.4919 12.38 10.8396L11.9392 11.1811C11.6992 11.3673 11.5398 11.5846 11.4612 11.833ZM11.5108 15.2104H9.66067V13.4162H11.5108V15.2104Z"
                    fill="#337AFE"
                />
            </svg>
        </div>
        <div v-if="showFTMVault" class="row mat-5">
            <f-info
                show-on-hover
                window-class="light"
                window-style="max-width: 350px;"
            >
                Maximum quota for an account in any 24 hour period. The quota
                replenishes automatically after 24 hours
            </f-info>
        </div>
    </div>
</template>

<script>
// import FCard from "../components/core/FCard/FCard.vue";
import FInfo from "@/components/core/FInfo/FInfo.vue";
// import FTMVault from "@/components/FTMVault.vue";
import appConfig from "../../app.config.js";

export default {
    components: {
        // FTMVault,
        FInfo
        // FCard
    },

    data() {
        return {
            showFTMVault: appConfig.flags.ftmVault
        };
    }
};
</script>

<style scoped>
.tooltip {
    position: relative;
}

.window,
.window-right {
    position: absolute;
    top: -58px;
    width: 101px;
    height: 52px;
    padding: 8px 8px 16px 11px;
    color: white;
    font-size: 12px;
    line-height: 14px;
    background-image: url("../assets/img/toltip.png");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0; /* Скрыть окно по умолчанию */
    transition: opacity 0.3s ease-in-out; /* Добавить плавный переход */
}

.tooltip:hover .window,
.tooltip:hover .window-right {
    opacity: 1; /* Показать окно при наведении на tooltip */
}

.window-right {
    right: -92px; /* Расположение окна справа */
}
</style>
