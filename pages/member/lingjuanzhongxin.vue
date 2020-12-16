<template>
	<view style="margin-bottom: 50rpx;">
		<view style="width: 100%;margin-left: 12rpx;" v-for='(item,index) in list' :key='index'>
			<view style="background-image: url('https://api.shengqianxiong.com.cn/img/20201109/0d67c059b6064a9f9eb011e0d494b973.png');background-size: 100%;height: 240rpx;margin-top: 10rpx;border-radius: 10rpx;">
				<view style="width: 100%;border-radius: 10rpx;padding: 10rpx;">
					<view style="display: flex;">
						<image :src="item.coupon.goodsImages" style="width: 140rpx;height:140rpx;margin: 25rpx 20rpx 20rpx 20rpx;"></image>
						<view style="margin-top: 25rpx;width: 48%;">
							<view style="font-size: 28rpx;color: #000000;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.coupon.couponName}}</view>
							<view style="font-size: 22rpx;color: #666666;border: 1rpx solid #909090;width: 80rpx;text-align: center;margin-top: 20rpx;line-height: 30rpx;">{{item.type === 2 ? '商品劵' : '通用劵'}}</view>
							<view style="font-size: 24rpx;color: #666666;margin-top: 15rpx;">有效期至{{item.endTime}}</view>
						</view>
						<view style="text-align: center;width: 20%;margin-top: 60rpx;text-align: right;">
							<view style="color: #e23922;font-size: 44rpx;"><text style="font-size: 22rpx;">￥</text>{{item.coupon.lessMoney}}</view>
							<view style="font-size: 24rpx;margin-top: 15rpx;">满{{item.coupon.minMoney}}可用</view>
						</view>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view style="display: flex;margin-left: 30rpx;margin-top: 3rpx;">
						<view style="width: 78%;font-size: 22rpx;">在线支付专享。</view>
						<view style="background: #F15B6C;color: #FFFFFF;font-size: 22rpx;padding: 5rpx;border-radius: 5rpx;width: 100rpx;text-align: center;"
						  @tap='lingJuan(item)'>立即领取</view>
					</view>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<view style="display: flex;margin-left: 30rpx;margin-top: 5rpx;">
						<view style="width: 78%;font-size: 22rpx;margin-top: 5rpx;">在线支付专享。</view>
						<view style="background: #F15B6C;margin-top: 5rpx;color: #FFFFFF;font-size: 22rpx;padding: 5rpx;border-radius: 5rpx;width: 100rpx;text-align: center;height: 30rpx;line-height: 25rpx;"
						 @tap='lingJuan(item)'>立即领取</view>
					</view>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<!-- 悬浮上拉 -->
		<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']" style="bottom: 56px;">
			<text class="iconfont icon-shangla"></text>
		</view>

		<!-- 加载更多提示 -->
		<empty class="empty-content" v-if="list.length === 0" des="暂无优惠券~" show="false"></empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 0,
				size: 10,
				loadingType: 0,
				scrollTop: false,
				tabIndex: 0,
				list: [],
				tabBars: [{
						name: '商品劵',
						id: '0',
					},
					{
						name: '通用卷',
						id: '1',
					}
				],
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多劵了'
				}
			};
		},
		onLoad(d) {
			this.getCouponIssueList();
		},
		methods: {
			lingJuan(item) {
				let userId = this.$queue.getData('userId');
				let nickName = this.$queue.getData('nickName');
				let data = {
					"couponId": item.couponId,
					"couponIssueId": item.couponIssueId,
					"couponName": item.couponName,
					"createTime": item.createTime,
					"goodsIds": item.goodsIds,
					"lessMoney": item.coupon.lessMoney,
					"minMoney": item.coupon.minMoney,
					"nickName": nickName,
					"status": item.status,
					"type": item.type,
					"userId": userId
				}
				this.$Request.postJson('/selfCouponUser/save', data).then(res => {
					if (res.status === 0) {
						this.$queue.showToast('领劵成功');
						this.getCouponIssueList();
					}
				});
			},
			getCouponIssueList() {
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/selfCouponIssue/useList?goodsId=&userId=' + userId).then(res => {
					if (res.status === 0) {
						this.list = [];
						res.data.forEach(d => {
							if(!d.coupon.goodsImages){
								d.coupon.goodsImages = 'https://api.shengqianxiong.com.cn/img/20201111/ce41a2e45ba0415991d8ffd099f1b1c6.png';
							}
							if (d.getStatus === 1) {
								this.list.push(d);
							}
						});
					}
				});
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			}
		}
	};
</script>

<style>
	@import '../../static/css/index.css';

	page {
		background: #F5F0F0;
	}

	.tui-tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #fafafa;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}

	.tui-scroll-h {
		width: 750rpx;
		height: 80rpx;
		background-color: #ffffff;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		/* #ifdef H5 */
		position: fixed;
		top: 44px;
		left: 0;
		z-index: 999;
		/* #endif */
	}

	.tui-line-h {
		/* #ifdef APP-PLUS */
		height: 1rpx;
		background-color: #cccccc;
		/* #endif */
		position: relative;
	}

	/* #ifndef APP-PLUS*/
	.tui-line-h::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #cccccc;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	/* #endif */

	.tui-tab-item {
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
		// flex-wrap: nowrap;
		// padding-left: 34rpx;
		// padding-right: 34rpx;
	}

	.tui-tab-item-title {
		color: #555;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.tui-tab-item-title-active {
		color: #E10A07;
		font-size: 32upx;
		font-weight: bold;
		border-bottom: 1rpx solid #E10A07;
		border-bottom-width: 5upx;
		text-align: center;
	}

	.limapboxqing2 {

		font-size: 28upx;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.empty-content {
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: flex;
	    -webkit-box-align: center;
	    -webkit-align-items: center;
	    align-items: center;
	    -webkit-box-pack: center;
	    -webkit-justify-content: center;
	    justify-content: center;
	    -webkit-box-orient: vertical;
	    -webkit-box-direction: normal;
	    -webkit-flex-direction: column;
	    flex-direction: column;
	    position: fixed;
	    left: 0;
	    top: -1rpx;
	    top: -1rpx;
	    right: 0;
	    bottom: 0;
	    background: #FFFFFF;
	    padding-bottom: 120rpx;
	}
</style>
