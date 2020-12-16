<template>

    <view class="coupon-page s-row"
          @tap="open(pingouUrl,materialUrl,couponUrl)"
          style="border-bottom: 1px solid ghostwhite">
        <view class="image">
            <image :src="itempic"></image>
        </view>
        <view class="content">
            <view style="display: flex">
                <view class="title">{{itemtitle}}</view>
            </view>
            <view class="num s-row">
                <text class="tmprice">{{itemprice}}</text>
                <text class="volume">{{itemsale}}</text>
            </view>
            <view class="money s-row" v-if="couponmoney!=null&&tuanPrice==null">
                <text class="coupon-price" v-if="couponmoney!=null" style="margin-left: -6px">
                    <text style="font-weight: 600">{{itemendprice}}</text>
                </text>

                <!--  #ifndef MP-ALIPAY -->
                <text class="quan" v-if="couponmoney!=null">
                    <i></i>{{couponmoney}}<i></i>
                </text>
                <!--  #endif -->
            </view>
            <view class="money s-row" v-if="tuanPrice!=null">
                <view class="person">
                    <view style="width: 70%;text-align: left">{{tuanPrice}}</view>
                    <view style="width: 30%;text-align: right">{{tuanNumber}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "orange-goods-list",
        props: [
            "itempic", "itemtitle", "itemprice", "itemsale", "itemendprice", "couponmoney", "itemid", "logo", "tuanPrice", "tuanNumber", "pingouUrl", "materialUrl", "couponUrl"
        ],
        methods: {
            getQuan(materialUrl) {
                let that=this;
                this.$Request.get('/tao/jd/push?materialId=' + materialUrl + '&siteId=1858541389').then(res => {
                    if (res.code === 200) {
                        // #ifdef H5
                        window.location.assign(res.data.clickURL)
                        // #endif
                        // #ifdef APP-PLUS
                        uni.navigateTo({
                            url: "/pages/jd/details?url=" + res.data.clickURL,
                        })
                        //#endif
                    }
                });
            },
            open(pingouUrl, materialUrl, couponUrl) {
                this.getQuan(materialUrl, couponUrl)
            },
        }
    }
</script>

<style>
    @import "../../static/css/index.css";

    .person {
        display: flex;
        /*background: -moz-linear-gradient(left, #FF5E5E 0, #FF927C 100%);*/
        /*background: -webkit-gradient(linear, left top, left right, color-stop(0, #FF5E5E), color-stop(100%, #FF927C));*/
        /*background: -webkit-linear-gradient(left, #FF5E5E 0, #FF927C 100%);*/
        /*background: -o-linear-gradient(left, #FF5E5E 0, #FF927C 100%);*/
        /*background: -ms-linear-gradient(left, #FF5E5E 0, #FF927C 100%);*/
        /*background: linear-gradient(to left, #FF5E5E 0, #FF927C 100%);*/
        background: #e10a07;
        position: relative;
        z-index: 1;
        zoom: 1;
        font-style: normal;
        border-radius: 3px;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        -o-border-radius: 3px;
        -ms-border-radius: 3px;
        font-size: .785rem;
        min-width: 3rem;
        text-align: left;
        padding: 1px 10px;
        color: #fff;
    }
</style>
