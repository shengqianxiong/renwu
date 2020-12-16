<template>
	<view class="coupon-page s-row" @tap="open(itemid)" v-bind:key='itemid' style="margin:16upx 16upx 8upx 16upx;background: white;border-radius: 32upx;">
		<view class="image">
			<image lazy-load='true' fade-show='true' :src="itempic"></image>
		</view>
		<view class="content" style="padding: 16upx;">
			<view style="display: flex">
				<text class="twolist-hidden" style="height: 80upx;font-size: 28upx;margin-right: 4upx;margin-left: 4upx;width: 95%;max-lines:2;overflow: hidden">
					<text style="color: #FFFFFF;background: #E10A07;font-size: 24upx;padding-left: 12upx;padding-right: 12upx;border-radius: 6upx;margin-right: 8upx;padding-top: 4upx;padding-bottom: 4upx;">天猫</text>

					<text> {{ itemtitle }}</text>
				</text>
			</view>
			<view class="money s-row" style="margin-left: -12upx;">
				<text class="coupon-price" style="color: #E20C0A;">
					<text style="font-size: 24upx">¥<text style="font-weight: bold">{{itemendprice}}</text></text>
					<text class="volume" style="font-size: 20upx;color: #999999;margin-left: 16upx;">{{itemsale}}</text>
				</text>
			</view>
			<view class="num s-row" style="font-size: 24upx;margin-top: -16px;margin-right: 32upx;display: flex;">
				<view style="background-color: #E20C0A;width: 90upx;height: 32upx;margin-top:26upx;margin-bottom: 10upx;border-radius: 10upx;">
					<text class="quan" v-if="couponmoney!=null" style="font-size: 12px;color:#FFFFFF;text-align: center;display: block;line-height: 32upx;">
						<i></i>{{couponmoney}}元券<i></i>
					</text>
				</view>
				<view v-if="isEnable!='否'" style="display: flex;color: white;font-size: 24upx;margin-top: 24upx;">
					<view style="color: #FE6C00;padding: 0 12upx; border-radius: 10upx;margin-left: 16upx;">预估返￥{{ tkmoney }}</view>
				</view>

			</view>
			<view style="display: flex;margin-left: -4upx;margin-top: 8upx;" v-if="shopname">
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
			'isEnable', "shopname", "itempic", "tkmoneys", "itemtitle", "itemprice", "itemsale", "itemendprice", "couponmoney",
			"itemid",
			"logo", "tkmoney", "isInvitation"
		],

		methods: {
			open(itemid) {
				let relation_id = this.$queue.getData("relation_id");
				if (relation_id) {
					uni.navigateTo({
						url: "/pages/detail/goodsinfo?itemid=" + itemid + "&relation_id=" + relation_id,
					})
				} else {
					uni.navigateTo({
						url: "/pages/detail/goodsinfo?itemid=" + itemid,
					})
				}
			},
		}
	}
</script>

<style>
	@import "../../static/css/index.css";
</style>
