<template>
    <div class="kong-menu-xzh gap-bottom" v-if="config.length || promote || banner.type">
        <div v-if="config.length" class="wrapper">
            <div v-for="(row, index) in category" :key="index" class="row">
                <a v-for="(item, key) in row" class="item" :href="item.link">
                    <div class="menu-pic">
                        <img :src="item.pic_url" width="32" height="32"/>
                    </div>
                    <div class="menu-txt">{{item.name}}</div>
                </a>
            </div>
        </div>
        <div v-if="banner.type === 2" class="banner">
            <video controls playsinline webkit-playsinline :poster="banner.v_cover" class="video">
                <source :src="banner.v_link" type="video/mp4"/>
            </video>
        </div>
        <div v-if="banner.type === 3" class="banner">
            <div class="swiper">
                <swipe>
                    <swipe-item v-for="(item, index) in banner.detail" :key="index">
                        <a :href="item.pic_link">
                            <div class="swipe-img" :style="{backgroundImage: 'url(' + item.pic_url + ')'}"></div>
                        </a>
                    </swipe-item>
                </swipe>
            </div>
        </div>
        <div v-if="banner.type === 4" class="banner">
            <a :href="banner.pic_link">
                <div class="banner-img" :style="{backgroundImage: 'url(' + banner.pic_url + ')'}"></div>
            </a>
        </div>
        <a v-if="promote" :href="promote.link" class="promote-link">
            <div class="promote">
                    <div class="arrow"></div>
                    {{promote.title}}<span v-if="promote.tag" class="tag">{{promote.tag}}</span>
            </div>
        </a>
    </div>
</template>

<script>
import _ from 'lodash';
import comp from './index1';
import Swipe from '../components/swipe/swipe';
import SwipeItem from '../components/swipe/swipe-item';
export default {
    name: 'Top',
    props: ['config', 'base', 'promote'],
    components: {
        Swipe,
        SwipeItem
    },
    computed: {
        category() {

            let result = _.chunk(this.config, 5);
            return result;
        },
        banner() {
            let item = this.base.publicity.find(item => item.type === 2 || item.type === 3) || {};
            if (item.type === 3 && item.detail.length === 1) {
                // 3本来是轮播，但是只有一张图就只展现成静态图
                return {
                    type: 4,
                    pic_url: item.detail[0].pic_url,
                    pic_link: item.detail[0].pic_link
                };
            }
            return item;
        }
    }
}
</script>

<style scoped lang="stylus">

    .gap-bottom
        border-bottom: 10px solid #f6f6f6

    .kong-menu-xzh

        .wrapper
            margin: 0 8px
            .row
                margin-top: 24px

                &:after
                    display: block
                    height: 0
                    content: ""
                    clear: both
                    visibility: hidden


            .item
                float: left
                width: 20%
                margin-bottom: -1px

                .menu-pic
                    height: 32px
                    text-align: center

                    img
                        border-radius: 50%

                .menu-txt
                    margin-top: 9px
                    color: #666
                    font-size: 12px
                    line-height: 14px
                    text-align: center
                    overflow: hidden
                    white-space: nowrap
                    text-overflow: ellipsis

        .banner
            padding 24px 17px 0 17px
            margin-bottom 19px

        .swiper
            position relative
            padding 0
            padding-top 15%

            .mint-swipe
                position absolute
                top 0
                bottom 0
                left 0
                right 0

        .video
            width 100%
            box-sizing border-box

        .banner-img
            width 100%
            height 0
            padding 0
            padding-top 15%

        .swipe-img
            width 100%
            height 100%
            background-size cover

        .promote-link
            margin 19px 17px
            display block

        .promote
            font-size 12px
            line-height 12px
            padding 5px 0
            color #333333

            .arrow
                float right
                width 6px
                height 10px
                background url(../assets/arrow.png) no-repeat
                background-size 100%
                margin-top 1px
                margin-right 2px

        .tag
            border solid 1px #f85854
            border-radius 3px
            display inline-block
            font-size 18px
            line-height 18px
            margin-bottom -8px
            margin-left 3px
            vertical-align middle
            transform scale(0.5)
            transform-origin 0 0
            padding 2px 4px 0 4px
            color #f85854

</style>

