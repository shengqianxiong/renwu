<template>

    <view class="coupon-page s-row"
          @tap="open(itemid)"
		  v-bind:key='itemid'
          style="border-bottom: 2upx solid ghostwhite;padding: 8upx;">
        <view class="image">
            <image lazy-load='true' fade-show='true' :src="itempic"></image>
        </view>
        <view class="content">
            <view style="display: flex">
                
                <text class="twolist-hidden"
                      style="height: 80upx;font-size: 28upx;margin-right: 4upx;margin-left: 4upx;width: 95%;max-lines:2;overflow: hidden">
                   <text style="color: #FFFFFF;background: #E10A07;font-size: 24upx;padding-left: 12upx;padding-right: 12upx;border-radius: 16upx;margin-right: 8upx;padding-top: 4upx;padding-bottom: 4upx;">天猫</text>
                   
				  <text> {{ itemtitle }}</text>
                </text>
            </view>
            <view class="num s-row">

                <text class="volume">{{itemsale}}人付款</text>
            </view>
			<view style="display: flex;margin-left: -8upx;margin-top: 8upx;" v-if="shopname">
				<image style="height: 36upx;width:36upx;margin-right: 8upx" src="../../static/shop.png"></image>
				<view style="font-size: 24upx;color: #999999;">{{shopname}}</view>
			</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "orange-goods-list",
        props: [
            "itempic","shopname", "itemtitle", "itemprice", "itemsale", "itemendprice", "couponmoney", "itemid", "logo","tkmoney","isInvitation"
        ],
        methods: {
            open(itemid) {
               let relation_id = this.$queue.getData("relation_id");
                if (relation_id) {
                    uni.navigateTo({
                        url: "/pages/detail/goodsinfos?itemid=" + itemid + "&relation_id=" + relation_id,
                    })
                } else {
                    uni.navigateTo({
                        url: "/pages/detail/goodsinfos?itemid=" + itemid,
                    })
                }
            },
        }
    }
</script>

<style>
    @import "../../static/css/index.css";
</style>
