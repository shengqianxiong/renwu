<template>
	<view class="index-content" style="background: #FFFFFF;">
		<view class="tui-tabs">
			<scroll-view id="tab-bar" scroll-with-animation class="tui-scroll-h" :scroll-x="true" :show-scrollbar="false" style="border-bottom: 2upx solid #F8F8F8;">
				<view style="display: flex;">
					<view v-for="(tab, index) in tab" :data-current="index" @tap="tabSelect" :data-id="index">
						<view class="tui-tab-item-title" style="margin-left: 100upx;" :class="{ 'tui-tab-item-title-active': index == TabCur }">{{ tab.name }}</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view style="display: flex;flex-wrap: wrap;margin-top: 80upx;">
			<view style="width: 345upx;height: 510upx;background-color: #FFFFFF; border-radius: 20upx;margin-left: 20upx; margin-top: 20upx;box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;"
			 @tap='goDetail(item.id)' v-for="(item,index) in couponlist" :key='index' v-if="couponlist.length > 0">
				<image :src="item.coverImg" style="width: 345upx;height: 340upx;border-top-left-radius:20upx;border-top-right-radius:20upx;"></image>

				<view style="padding: 16upx 2upx 16upx 16upx;">
					<view style="width: 100%;height:  60upx;">
						<text class="limapboxqing2"><text class="indexr" style=""><text>自营</text></text>{{ item.title }}</text>
					</view>
				</view>
				<view style="padding: 0rpx 15rpx;display: flex;margin:20rpx 0">
					<view v-if="relation" style="font-size: 38upx;color: #FF2A47;"><text style="font-size: 30rpx;">¥</text> {{item.memberPrice}}</view>
					<view v-if='!relation' style="font-size: 38upx;color: #FF2A47;"><text style="font-size: 30rpx;">¥</text>{{item.price}}</view>
					<view style="font-size: 24upx;color: #999999;margin-left: 10rpx;margin-top: 8upx;">{{item.sales}}人已购买</view>
				</view>
			</view>
			<!-- 悬浮上拉 -->
			<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']" style="bottom: 56px;">
				<text class="iconfont icon-shangla"></text>
			</view>

			<!-- 加载更多提示 -->
			<view class="s-col is-col-24" v-if="couponlist.length > 0">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
			<!-- 加载更多提示 -->
			<empty v-if="couponlist.length === 0" des="暂无数据" show="false"></empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				relation: false,
				//综合createAt 销量sales 佣金比例commissionPrice 超低价price
				tab: [{
						name: '综合',
						id: '0',
						status: 'createAt'
					},
					{
						name: '销量',
						id: '1',
						status: 'sales'
					},
					{
						name: '佣金',
						id: '2',
						status: 'commissionPrice'
					},
					{
						name: '超低价',
						id: '3',
						status: 'price'
					}
				],
				status: 'createAt',
				TabCur: 0,
				scrollLeft: 0,
				scrollTop: false,
				couponlist: [],
				page: 0,
				cid: 1,
				isInvitation: 0,
				loadingType: 0,
				isEnable: '否',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}
			}
		},
		onLoad: function(e) {
			uni.showLoading({
				title: '加载中...'
			});
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			this.cid = e.cid;
			uni.setNavigationBarTitle({
				title: e.name
			});
			this.getGoodsList();
			this.getUserInfo();
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		methods: {
			goDetail(id) {
				uni.navigateTo({
					url: '../zysc/index/commoditydetail?ordersId=' + id
				});
			},
			getGoodsList(type) {
				this.loadingType = 1;
				this.$Request.getT('/goods/userList?page=' + this.page + '&size=10' + '&type=' + this.cid + '&title=' + '&sort=' +
					this.status).then(
					res => {
						if (res.status === 0) {
							if (this.page === 0 || res.status) {
								this.couponlist = [];
							}
							let grade = this.$queue.getData('grade');
							res.data.content.forEach(d => {
								d.descrition = '';
								if (d.commissionPrice != 0) {
									if (grade) {
										if (this.relation) {
											d.descrition = ((parseFloat(d.memberPrice) * parseFloat(d.commissionPrice)) * parseFloat(grade)).toFixed(
												2);
										} else {
											d.descrition = ((parseFloat(d.price) * parseFloat(d.commissionPrice)) * parseFloat(grade)).toFixed(2);
										}
									} else {
										if (this.relation) {
											d.descrition = ((parseFloat(d.memberPrice) * parseFloat(d.commissionPrice)) * parseFloat(this.$queue.minMoney()))
												.toFixed(2);
										} else {
											d.descrition = ((parseFloat(d.price) * parseFloat(d.commissionPrice)) * parseFloat(this.$queue.minMoney()))
												.toFixed(2);
										}
									}
								}
								d.sales = d.sales > 10000 ? (d.sales / 10000).toFixed(1) + '万' : d.sales;
								this.couponlist.push(d);
							});
							if (res.data.content.length === this.size) {
								this.loadingType = 0;
							} else {
								this.loadingType = 3;
							}
						} else {
							this.loadingType = 2;
						}
						uni.hideLoading();

						if (type === "Refresh") {
							uni.stopPullDownRefresh(); // 停止刷新
						}
					});
			},
			getUserInfo() {
				let userId = this.$queue.getData("userId");
				if (userId) {
					this.$Request.getT("/user/" + userId).then(res => {
						if (res.status === 0) {
							this.$queue.setData("image_url", res.data.image_url);
							this.$queue.setData("mobile", res.data.phone);
							this.isInvitation = res.data.isInvitation;
							this.$queue.setData("isInvitation", res.data.isInvitation);
							this.$queue.setData("relation", res.data.invitation);
							this.$queue.setData("grade", res.data.grade);
							this.$queue.setData("nickName", res.data.nickName);
							this.$queue.setData("relation_id", res.data.relationId);
							this.$queue.setData("gender", parseInt(res.data.gender));
						}
					});
				}
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.status = this.tab[this.TabCur].status;
				this.page = 0;
				uni.showLoading({
					title: '加载中...'
				});
				this.getGoodsList();
				//#ifdef H5
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				//#endif
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			navigateBack: function() {
				uni.navigateBack();
			},
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.getGoodsList('');
		},
		onPullDownRefresh: function() {
			this.page = 0;
			this.getGoodsList("Refresh");
		}
	}
</script>

<style lang="less">
	@import '../../static/less/index.less';
	@import '../../static/css/index.css';

	page {
		background: #FFFFFF;
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

	.indexr {
		color: #FFFFFF;
		font-size: 22upx;
		padding-left: 12upx;
		display: inline-block;
		padding-right: 13upx;
		border-radius: 8upx;
		margin-right: 8upx;
		padding-top: 4upx;
		line-height: 38upx;

		background: -moz-linear-gradient(left, #FB2C1A 0, #FF2A46 100%);
		background: -webkit-gradient(linear, left top, left right, color-stop(0, #FB2C1A), color-stop(100%, #FF2A46));
		background: -webkit-linear-gradient(left, #FB2C1A 0, #FF2A46 100%);
		background: -o-linear-gradient(left, #FB2C1A 0, #FF2A46 100%);
		background: -ms-linear-gradient(left, #FB2C1A 0, #FF2A46 100%);
		background: linear-gradient(to left, #FB2C1A 0, #FF2A46 100%);
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
		/* #ifdef APP-PLUS */
		position: fixed;
		top: 0px;
		left: 0;
		z-index: 999;
		/* #endif */
		/* #ifdef H5 */
		position: fixed;
		top: 44px;
		left: 0;
		z-index: 999;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		position: fixed;
		top: 0;
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
		border-bottom-width: 6upx;
		text-align: center;
	}
</style>
