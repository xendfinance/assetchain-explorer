<template>
    <div class="socialmedialinks no-markers">
        <div>
            <a
                href="http://web.facebook.com/XendFinance"
                target="_blank"
                rel="nofollow"
                title="XEND on Facebook"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/facebook.svg"
                    width="18"
                    height="18"
                ></icon>
            </a>
        </div>
        <div>
            <a
                href="https://twitter.com/xendfinance"
                target="_blank"
                rel="nofollow"
                title="XEND on Twitter"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/twitter.svg"
                    width="18"
                    height="18"
                ></icon>
            </a>
        </div>
        <div>
            <a
                href="https://t.me/XendAnnouncements"
                target="_blank"
                rel="nofollow"
                title="XEND on Telegram"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/telegram.svg"
                    width="18"
                    height="18"
                ></icon>
            </a>
        </div>
        <div>
            <a
                href="https://www.youtube.com/channel/UCcR2lTpYwCws-axra4AAO8Q/featured"
                target="_blank"
                rel="nofollow"
                title="XEND on YouTube"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/youtube.svg"
                    width="18"
                    height="18"
                ></icon>
            </a>
        </div>
        <div>
            <a
                href="http://www.reddit.com/r/XendFinance/"
                target="_blank"
                rel="nofollow"
                title="XEND on Instagram"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/reddit.svg"
                    width="18"
                    height="18"
                ></icon>
            </a>
        </div>
        <div>
            <a
                href="https://discord.gg/QGHb7jp2GV"
                target="_blank"
                rel="nofollow"
                title="XEND on Discord"
            >
                <icon
                    data="@/assets/svg/social-media/mobile/discord.svg"
                    width="18"
                    height="18"
                ></icon>
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.socialmedialinks {
    --f-social-media-links-color: #{$secondary-color-lighter};
    color: var(--f-social-media-links-color);

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    padding: 40px 20px !important;
    border-bottom: 1px solid #1e2643;
    text-align: center;
    padding: 8px;

    &_label {
        padding-left: 10px;
        font-size: 15px;
        vertical-align: -webkit-baseline-middle;
    }

    &_copyright {
        font-size: 16px;
        font-weight: 600;
        color: white;
    }

    div {
        display: flex;
        flex-direction: row;
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

@include media-max($bp-medium) {
    .socialmedialinks {
        &_label {
            display: none;
        }
    }
}

@include media-max(620px) {
    .socialmedialinks {
        display: flex !important;
    }
}
</style>
