<template>
	<view>
		<view class="tui-tabs">
			<scroll-view id="tab-bar" scroll-with-animation class="tui-scroll-h" :scroll-x="true" :show-scrollbar="false" style="border-bottom: 2upx solid #F8F8F8;">
				<view style="display: flex;">
					<view v-for="(tab, index) in tabBars" :id="tab.id" :data-current="index" @tap='tabSlect(tab)'>
						<view class="tui-tab-item-title" style="margin-left: 100upx;" :class="{ 'tui-tab-item-title-active': tabIndex == tab.id }">{{ tab.name }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view style="display: flex;flex-wrap: wrap;margin-top: 80upx;">
			<view style="width: 345upx;height: 510upx;background-color: #FFFFFF; border-radius: 20upx;margin-left: 20upx; margin-top: 20upx;box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;"
			 @tap='goDetail(item.id)' v-for="(item,index) in list" :key='index'>
				<image :src="item.coverImg" style="width: 345upx;height: 340upx;border-top-left-radius:20upx;border-top-right-radius:20upx;"></image>

				<view style="padding: 16upx 2upx 16upx 16upx;">
					<view style="width: 100%;height:  60upx;">
						<text class="limapboxqing2"><text class="indexr" style=""><text>自营</text></text>{{ item.title }}</text>
					</view>
				</view>

				<view style="padding: 0rpx 15rpx;display: flex;margin:20rpx 0">
					<view v-if="relation" style="font-size: 38upx;color: #FF2A47;"><text style="font-size: 30rpx;">¥</text>
						{{item.memberPrice}}</view>
					<view v-if='!relation' style="font-size: 38upx;color: #FF2A47;"><text style="font-size: 30rpx;">¥</text>{{item.price}}</view>
					<view style="font-size: 24upx;color: #999999;margin-left: 10rpx;margin-top: 8upx;">{{item.sales+'人已购买'}}</view>
				</view>
			</view>

			<!-- 悬浮上拉 -->
			<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']" style="bottom: 56px;">
				<text class="iconfont icon-shangla"></text>
			</view>

			<!-- 加载更多提示 -->
			<view class="s-col is-col-24" v-if="list.length > 0">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
			<!-- 加载更多提示 -->
			<empty v-if="list.length === 0" des="暂无数据" show="false"></empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: '0',
				tabStatus: 'createAt',
				isEnable: '否',
				list: [],
				relation: false,
				//综合createAt 销量sales 佣金比例commissionPrice 超低价price
				tabBars: [{
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
				page: 0,
				size: 10,
				loadingType: 0,
				type: 1,
				barTitleName: '',
				scrollTop: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				}
			}
		},
		onShow() {
			let a = this.$queue.getData('isEnable');
			if (a === '是') {
				let b = this.$queue.getData('isLieBiaoEnable');
				if (b) {
					this.isEnable = b;
				} else {
					this.isEnable = a;
				}
			} else {
				this.isEnable = a;
			}
		},
		onLoad(d) {
			let relation_id = this.$queue.getData('relation_id');
			if (relation_id && relation_id !== 'undefined') {
				this.relation = true;
			} else {
				this.relation = false;
			}
			if (d.name) {
				this.barTitleName = d.name;
				uni.setNavigationBarTitle({
					title: d.name
				})
				if (d.name === '精选好物') {
					this.getSelectGoods('', this.tabStatus);
				} else if (d.name === '热卖榜单') {
					this.getSellingList('', this.tabStatus);
				} else if (d.name === '每日上新') {
					this.getNews('', this.tabStatus);
				} else if (d.name === '推荐商品') {
					this.getmrsc('', this.tabStatus);
				} else if (d.name === '网红同款') {
					this.getmrsc('', this.tabStatus);
				}
			}
		},
		methods: {
			getmrsc(type, sort) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request.getT('/goods/recommend?page=' + this.page + '&size=' + this.size + '&sort=' + sort).then(res => {
					if (res.status === 0) {
						if (this.page === 0 || res.status) {
							this.list = [];
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
							this.list.push(d);
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
					if (type === 'Refresh') {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});
			},
			getNews(type, sort) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request.getT('/goods/news?page=' + this.page + '&size=' + this.size + '&sort=' + sort).then(res => {
					if (res.status === 0) {
						if (this.page === 0 || res.status) {
							this.list = [];
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
							this.list.push(d);
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
					if (type === 'Refresh') {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});
			},
			getSelectGoods(type, sort) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request.getT('/goods/selectGoods?page=' + this.page + '&size=' + this.size + '&sort=' + sort).then(res => {
					if (res.status === 0) {
						if (this.page === 0 || res.status) {
							this.list = [];
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
							this.list.push(d);
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
					if (type === 'Refresh') {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});
			},
			getSellingList(type, sort) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request.getT('/goods/selling?page=' + this.page + '&size=' + this.size + '&sort=' + sort).then(res => {
					if (res.status === 0) {
						if (this.page === 0 || res.status) {
							this.list = [];
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
							this.list.push(d);
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
					if (type === 'Refresh') {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});
			},
			getList() {
				this.$Request.getT('/goods/list?page=' + this.page + '&size=' + this.size + '&status=' + 1).then(res => {
					if (res.status === 0) {
						if (this.page === 0 || res.status) {
							this.list = [];
						}
						res.data.content.forEach(d => {
							this.list.push(d);
						});
					}
				});
			},
			goDetail(id) {
				uni.navigateTo({
					url: './commoditydetail?ordersId=' + id
				});
			},
			tabSlect(item) {
				this.switchTab(item.id);
			},
			switchTab(index) {
				this.page = 0;
				this.tabIndex = index;
				this.tabStatus = this.tabBars[index].status;
				this.list = [];
				this.getList1('switch', this.tabStatus);
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			getList1(type, sort) {
				if (this.barTitleName === '精选好物') {
					this.getSelectGoods(type, sort);
				} else if (this.barTitleName === '热卖榜单') {
					this.getSellingList(type, sort);
				} else if (this.barTitleName === '每日上新') {
					this.getNews(type, sort);
				} else if (this.barTitleName === '推荐商品') {
					this.getmrsc(type, sort);
				} else if (d.name === '网红同款') {
					this.getmrsc('', this.tabStatus);
				}
			}
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.getList1('', this.tabStatus);
		},
		onPullDownRefresh: function() {
			this.page = 0;
			this.getList1('Refresh', this.tabStatus);
		}
	}
</script>

<style lang="less" scoped>
	@import '../../../static/less/index.less';
	@import '../../../static/css/index.css';

	page {
		background: #F8F8F8;
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
		/* #ifndef H5 */
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		/* #endif */
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
		border-bottom-width: 6upx;
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
</style>
