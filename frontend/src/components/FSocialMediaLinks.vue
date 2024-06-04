<template>
    <ul class="f-social-media-links no-markers">
        <li class="icon twitter">
            <a
                href="https://twitter.com/"
                target="_blank"
                rel="nofollow"
                title="XendChain on Twitter"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/twitter.svg"
                    width="32"
                    height="32"
                ></icon>
            </a>
        </li>
        <li class="icon discord">
            <a
                href="https://discord.gg/"
                target="_blank"
                rel="nofollow"
                title="XendChain on Discord"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/discord.svg"
                    width="32"
                    height="32"
                ></icon>
            </a>
        </li>
        <li class="icon telegram">
            <a
                href="https://github.com/vita-inu"
                target="_blank"
                rel="nofollow"
                title="XendChain on Github"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/telegram.svg"
                    width="32"
                    height="32"
                ></icon>
            </a>
        </li>
        <li class="icon reddit">
            <a
                href="https://reddit.com/r/vitainu"
                target="_blank"
                rel="nofollow"
                title="XendChain on Reddit"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/reddit.svg"
                    width="32"
                    height="32"
                ></icon>
            </a>
        </li>
        <li class="icon github">
            <a
                href="https://github.com/vita-inu"
                target="_blank"
                rel="nofollow"
                title="XendChain on Github"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/github.svg"
                    width="32"
                    height="32"
                ></icon>
            </a>
        </li>
    </ul>
</template>

<script>
export default {};
</script>

<style lang="scss">
.f-social-media-links {
    --f-social-media-links-color: #{$secondary-color-lighter};
    color: var(--f-social-media-links-color);

    text-align: center;
    padding: 8px;

    li {
        display: inline-block;
        vertical-align: middle;

        &:not(:last-child) {
            padding-inline-end: 24px;
        }

        @include links() {
            color: inherit;
            transition: color $transition-length ease;
        }

        a:not(.btn):hover {
            color: #fff;
        }
    }

    .linkedin {
        position: relative;
        top: -3px;
    }
}
</style>
