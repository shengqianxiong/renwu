<template>
	<view style="background-color: #fff;">
		<view @click="open(itemid)" class="itemInfo1" v-bind:key="itemid">
			<view style="position: relative"><image :src="itempic" style="border-radius: 10upx;width: 100%;height: 214upx" lazy-load="true" fade-show="true"></image></view>
			<view>
				<text class="twolist-hidden" style="height: 80upx;font-size: 28upx;margin-right: 8upx;margin-left: 8upx;max-lines:2;">
					<text style="overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;white-space: nowrap;display: block;">{{ itemtitle }}</text>
				</text>
				<view>
					<view style="display: flex;margin-left: 10upx;">
						<view style="width: 40%;margin-bottom: 4upx;font-size: 28upx;color: #E20C0A;padding-top: 4upx;text-align: left;margin-top:6upx;margin-right: 0;">
							<text style="font-size: 28upx;margin-right: 4upx">¥</text>
							<text style="text-align: left;font-weight: bold">{{ itemendprice }}</text>
						</view>
						
						<view style="font-size: 22upx;margin-top: 8upx;margin-left:16upx;color: grey; text-overflow: ellipsis;overflow: hidden;float: right;">{{ itemsale }}</view>
						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'orange-goods-card',
	props: [
		'isEnable',
		'itempic',
		'shopname',
		'itemtitle',
		'tkmoneys',
		'itemprice',
		'itemsale',
		'itemendprice',
		'couponmoney',
		'itemid',
		'logo',
		'index',
		'tkmoney',
		'isInvitation'
	],

	methods: {
		open(itemid) {
			if (this.logo == '../../static/img/maos.png') {
				this.$emit('success', this.itemid);
			} else {
				let relation_id = this.$queue.getData('relation_id');
				if (relation_id) {
					if (this.logo == '../../static/img/pinduoduo.png') {
						uni.navigateTo({
							url: '/pages/detail/pdd?itemid=' + itemid + '&relation_id=' + relation_id
						});
					} else if (this.logo == '../../static/img/jd.png') {
						uni.navigateTo({
							url: '/pages/detail/jd?itemid=' + itemid + '&relation_id=' + relation_id
						});
					} else {
						uni.navigateTo({
							url: '/pages/detail/goodsinfo?itemid=' + itemid + '&relation_id=' + relation_id
						});
					}
				} else {
					if (this.logo == '../../static/img/pinduoduo.png') {
						uni.navigateTo({
							url: '/pages/detail/pdd?itemid=' + itemid
						});
					} else if (this.logo == '../../static/img/jd.png') {
						uni.navigateTo({
							url: '/pages/detail/jd?itemid=' + itemid
						});
					} else {
						uni.navigateTo({
							url: '/pages/detail/goodsinfo?itemid=' + itemid
						});
					}
				}
			}
		}
	}
};
</script>

<style>
.dianpu {
	background: rgba(0, 0, 0, 0.1);
	color: #333333;
	position: absolute;
	margin-top: -38upx;
	width: 49%;
	padding-left: 8upx;
}

.itemInfo1 {
	float: left;
	margin-left:18upx;
	width: 30%;
	/* border-radius: 20upx; */
	background-color: #fff;
	margin-top: 16upx;
	padding-bottom: 8upx;
	/* margin-right: 24upx; */
	box-shadow: 2upx 0 2upx 2upx rgba(0, 0, 0, 0.1);
}
.quan:before {
	position: absolute;
	z-index: 1;
	zoom: 1;
	top: 50%;
	margin-top: -3px;
	background: #fff;
	display: block;
	width: 5px;
	height: 5px;
	content: '';
	border-radius: 10px;
	border: 1px solid #fff;
	left: auto;
	right: -4px;
}

.quan:after {
	position: absolute;
	z-index: 1;
	zoom: 1;
	top: 50%;
	margin-top: -3px;
	background: #fff;
	display: block;
	width: 5px;
	height: 5px;
	content: '';
	border-radius: 10px;
	border: 1px solid #fff;
	left: -4px;
}

.twolist-hidden {
	max-height: 40upx;
	color: #333;
	font-weight: 400;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
