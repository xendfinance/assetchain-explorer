<template>
    <footer class="f-footer">
        <div class="narrow-container">
            <social-media-links class="desktop" />
            <social-media-mobile-links class="mobile" />
            <!-- <div class="narrow-container_footer">
                <span class="hidden-mobile">Privacy Police</span>
                <span>develop by Gotbit</span>
            </div> -->
        </div>
        <div class="text">
            Asset Chain Scan is a Block Explorer and Analytics Platform for
            Asset Chain by XEND finance.
        </div>
    </footer>
</template>

<script>
import SocialMediaLinks from "@/components/SocialMediaLinks.vue";
import SocialMediaMobileLinks from "@/components/SocialMediaMobileLinks.vue";

export default {
    components: {
        SocialMediaLinks,
        SocialMediaMobileLinks
    }
};
</script>

<style lang="scss" scoped>
.text {
    color: #337afe80;
    padding: 0 20px;
    display: block;
    font-size: 12px;
    text-align: center;
    @media (min-width: 620px) {
        display: none;
    }
}
.f-footer {
    padding-bottom: 20px;
    @media (min-width: 620px) {
        padding-bottom: 0;
    }
    display: flex;
    flex-direction: column;
    --f-footer-link-color: #{$theme-color};
    background-color: #171a1f;
    color: #fff;
    .narrow-container {
        display: flex;
        flex-direction: column;
        padding-top: 8px;
        padding-bottom: 16px;
        height: 100%;
        width: 100%;
        background-color: #171a1f;

        > .row {
            height: 100%;
        }
        &_footer {
            padding: 8px 20px;
            display: flex;
            justify-content: space-between;
            color: #5f667e;
            font-size: 13px;
        }
    }

    @include links() {
        color: var(--f-footer-link-color);
        transition: opacity $transition-length ease;
    }

    a:not(.btn):hover {
        text-decoration: none;
        opacity: 0.5;
    }

    .desktop {
        display: none;
        @media (min-width: 620px) {
            display: flex;
        }
    }
    .mobile {
        display: flex;
        @media (min-width: 620px) {
            display: none;
        }
    }
    @include media-max(620px) {
        .hidden-mobile {
            display: none;
        }
        .narrow-container_footer {
            justify-content: center;
        }
    }
}
</style>
