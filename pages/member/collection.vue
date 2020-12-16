<template>
	<view class="index-content" style="background: #FFFFFF;">
		<view style="font-size: 24upx;color: #999999;margin: 20upx 16upx;" v-if="classType === 1">
			提示: 足迹最多保存100个宝贝，超出100个宝贝，如果此时浏览了新的宝贝，最末尾的宝贝将会自动删除
		</view>
		<view style="display: flex;flex-wrap: wrap;">
			<view style="width: 345upx;height: 510upx;background-color: #FFFFFF; border-radius: 20upx;margin-left: 20upx; margin-top: 20upx;box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;"
			 @tap='goDetail(item.goodsId)' v-for="(item,index) in list" :key='index' v-if="list.length > 0">
				<image :src="item.coverImg" style="width: 345upx;height: 340upx;border-top-left-radius:20upx;border-top-right-radius:20upx;"></image>

				<view style="padding: 16upx 2upx 16upx 16upx;">
					<view style="width: 100%;height:  60upx;">
						<text class="limapboxqing2"><text class="indexr" style=""><text>自营</text></text>{{ item.title }}</text>
					</view>
				</view>
				<view style="padding: 0rpx 15rpx;display: flex;margin:20rpx 0">
					<view v-if="relation" style="font-size: 38upx;color: #FF2A47;"><text style="font-size: 30rpx;">¥</text> {{item.goods.memberPrice}}</view>
					<view v-if='!relation' style="font-size: 38upx;color: #FF2A47;"><text style="font-size: 30rpx;">¥</text>{{item.goods.price}}</view>
					<view style="font-size: 24upx;color: #999999;margin-left: 10rpx;margin-top: 8upx;">{{item.goods.sales}}人已购买</view>
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
			<empty v-if="list.length === 0" des="暂无收藏数据,快去收藏吧" show="false"></empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				relation: false,
				scrollTop: false,
				list: [],
				classType: 0,
				page: 0,
				size: 10,
				className: '',
				loadingType: 0,
				isEnable: '否',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}
			}
		},
		onShow() {
			let relation_id = this.$queue.getData('relation_id');
			if (relation_id) {
				this.relation = relation_id;
			}
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			if (this.className === '我的收藏') {
				this.classType = 0;
				this.getCollection('');
			} else if (this.className === '我的足迹') {
				this.classType = 1;
				this.getFootprint('');
			}
		},
		onLoad(d) {
			this.className = d.className;
			uni.setNavigationBarTitle({
				title: d.className
			})
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
			getCollection(type) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/selfUserCollect/list?page=' + this.page + '&size=' + this.size + '&userId=' + userId).then(
					res => {
						if (res.status === 0) {
							if (this.page === 0 || res.status) {
								this.list = [];
							}
							let grade = this.$queue.getData('grade');
							res.data.content.forEach(d => {
								if (d.goods != null) {
									d.goods.descrition = '';
									if (d.goods.commissionPrice != 0) {
										if (grade) {
											if (this.relation) {
												d.goods.descrition = ((parseFloat(d.goods.memberPrice) * parseFloat(d.goods.commissionPrice)) *
													parseFloat(grade)).toFixed(
													2);
											} else {
												d.goods.descrition = ((parseFloat(d.goods.price) * parseFloat(d.goods.commissionPrice)) * parseFloat(
													grade)).toFixed(2);
											}
										} else {
											if (this.relation) {
												d.goods.descrition = ((parseFloat(d.goods.memberPrice) * parseFloat(d.goods.commissionPrice)) *
														parseFloat(this.$queue.minMoney()))
													.toFixed(2);
											} else {
												d.goods.descrition = ((parseFloat(d.goods.price) * parseFloat(d.goods.commissionPrice)) * parseFloat(
														this
														.$queue.minMoney()))
													.toFixed(2);
											}
										}
									}
									d.goods.sales = d.goods.sales > 10000 ? (d.goods.sales / 10000).toFixed(1) + '万' : d.goods.sales;
									this.list.push(d);
								}
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
			getFootprint(type) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/selfUserBrowse/list?page=' + this.page + '&size=' + this.size + '&userId=' + userId).then(
					res => {
						if (res.status === 0) {
							if (this.page === 0 || res.status) {
								this.list = [];
							}
							let grade = this.$queue.getData('grade');
							res.data.content.forEach(d => {
								if (d.goods != null) {
									d.goods.descrition = '';
									if (d.goods.commissionPrice != 0) {
										if (grade) {
											if (this.relation) {
												d.goods.descrition = ((parseFloat(d.goods.memberPrice) * parseFloat(d.goods.commissionPrice)) *
													parseFloat(grade)).toFixed(
													2);
											} else {
												d.goods.descrition = ((parseFloat(d.goods.price) * parseFloat(d.goods.commissionPrice)) * parseFloat(
													grade)).toFixed(2);
											}
										} else {
											if (this.relation) {
												d.goods.descrition = ((parseFloat(d.goods.memberPrice) * parseFloat(d.goods.commissionPrice)) *
														parseFloat(this.$queue.minMoney()))
													.toFixed(2);
											} else {
												d.goods.descrition = ((parseFloat(d.goods.price) * parseFloat(d.goods.commissionPrice)) * parseFloat(
														this
														.$queue.minMoney()))
													.toFixed(2);
											}
										}
									}
									d.goods.sales = d.goods.sales > 10000 ? (d.goods.sales / 10000).toFixed(1) + '万' : d.goods.sales;
									this.list.push(d);
								}
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
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			}
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			if (this.className === '我的收藏') {
				this.getCollection('');
			} else if (this.className === '我的足迹') {
				this.getFootprint('');
			}
		},
		onPullDownRefresh: function() {
			this.page = 0;
			if (this.className === '我的收藏') {
				this.getCollection('Refresh');
			} else if (this.className === '我的足迹') {
				this.getFootprint('Refresh');
			}
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
</style>
