<template>
	<view>
		<view style="margin: 20upx 15upx;border-radius: 15upx;background-color: #FFFFFF;">
			<view style="padding: 20rpx 0 0 30rpx;color: #666666;font-size: 24rpx;display: flex;">
				<view style="margin-top: 7rpx;">商品好评率</view>
				<!-- #ifdef MP-WEIXIN -->
				<view style="margin-left: 10rpx;margin-top: 8rpx;">{{count1 > 0 ? count1 : '无'}}</view>
				<uni-rate style="margin-left: 15rpx;margin-top: 30rpx;" :size='14' :value="count1" />
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view style="margin-left: 10rpx;margin-top: 10rpx;">{{count1 > 0 ? count1 : '无'}}</view>
				<uni-rate style="margin-left: 15rpx;margin-top: 12rpx;" :size='14' :value="count1" />
				<!-- #endif -->
			</view>
			<view class="tui-tabs" style="margin-left: 10rpx;">
				<view style="display: flex;flex-wrap: wrap;">
					<view v-for="(tab, index) in scoreTypeList" :id="index" :data-current="index" @tap='tabSlect(tab)'>
						<view v-if="CountTypeList.length > 0 && CountTypeList[index].count != 0" class="tui-tab-item-title" style="margin:15rpx;"
						 :class="{ 'tui-tab-item-title-active': tabIndex == index }">{{ tab.name }}({{CountTypeList[index].count}})
						</view>
					</view>
				</view>
			</view>
			<view style="width: 100%;padding:20upx 0upx 20upx 20upx;" v-for="(ping,index) in pinglunList" v-if="pinglunList.length > 0">
				<view style="display: flex;padding: 20rpx;">
					<image :src="ping.userHeader" style="width: 80rpx;height: 80rpx;border-radius: 50rpx;"></image>
					<view style="margin-top: 5rpx;margin-left: 10rpx;width: 40%;">
						<view style="margin-left: 20rpx;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{ping.userName}}</view>
						<uni-rate style="margin-left: 15rpx;margin-top: 10rpx;" :size='18' :value="ping.score" />
					</view>
					<view style="margin-left: 20rpx;margin-top: 20rpx;color: #666666;">{{ping.createTime}}</view>
				</view>
				<view style="padding: 0rpx 20rpx 0 20rpx;">{{ping.content}}</view>
				<view style="display: flex;padding: 10rpx 0 0 10rpx;flex-wrap: wrap;" v-if="ping.img.length > 0">
					<view style="margin: 5rpx;" v-for="(item,index) in ping.img">
						<image :src="item" style="width: 210rpx;height: 210rpx;border-radius: 10rpx;" @tap='selectPhoto(item)'></image>
					</view>
				</view>
				<view v-if="ping.reply">
					<view style="margin-left: 20rpx;font-size: 26rpx;color: #666666;">商家回复：{{ping.reply}}</view>
				</view>
			</view>
			<!-- 悬浮上拉 -->
			<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '', '']" style="bottom: 56px;"><text
				 class="iconfont icon-shangla"></text></view>

			<!-- 加载更多提示 -->
			<view class="s-col is-col-24" v-if="pinglunList.length > 0">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
		</view>

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
				count1: 0,
				CountTypeList: [],
				scoreTypeList: [{
						index: '0',
						name: '全部'
					},
					{
						index: '1',
						name: '好评'
					},
					{
						index: '2',
						name: '中评'
					},
					{
						index: '3',
						name: '差评'
					}
				],
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				pinglunList: []
			};
		},
		onLoad(d) {
			if (d.id) {
				this.ordersId = d.id;
				this.getPingLunList('');
				this.getCount(d.id);
			}
		},
		methods: {
			tabSlect(item) {
				this.tabIndex = item.index;
				this.page = 0;
				this.getPingLunList('');
			},
			selectPhoto(item) {
				let imgsArray = [];
				imgsArray[0] = item;
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
			getCount(id) {
				this.$Request.getT('/selfGoodsComment/count?goodsId=' + id).then(res => {
					if (res.status === 0) {
						this.count1 = res.data.count1;
						let data = {};
						data.count = res.data.count;
						this.CountTypeList.push(data);
						let data1 = {};
						data1.count = res.data.count2;
						this.CountTypeList.push(data1);
						let data2 = {};
						data2.count = res.data.count3;
						this.CountTypeList.push(data2);
						let data3 = {};
						data3.count = res.data.count4;
						this.CountTypeList.push(data3);
					}
				});
			},
			getPingLunList(type) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request.getT('/selfGoodsComment/list?scoreType=' + this.tabIndex + '&page=' + this.page + '&size=' + this.size +
						'&goodsId=' +
						this.ordersId)
					.then(res => {
						if (res.status === 0) {
							if (this.page === 0 || res.status) {
								this.pinglunList = [];
							}
							res.data.content.forEach(d => {
								if (d.img) {
									let img = d.img.split(',');
									d.img = img;
								}
								this.pinglunList = res.data.content;
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
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			}
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.getPingLunList('');
		},
		onPullDownRefresh: function() {
			this.page = 0;
			this.getPingLunList('Refresh');
		}
	};
</script>

<style>
	@import '../../../static/css/index.css';

	page {
		background: #F2F2F2;
	}

	.tui-tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #FFFFFF;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}


	.tui-tab-item {
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
		// flex-wrap: nowrap;
		// padding-left: 34rpx;
		// padding-right: 34rpx;
	}

	.tui-tab-item-title {
		color: #333333;
		font-size: 28rpx;
		line-height: 48rpx;
		border-radius: 50rpx;
		background: #F2F2F2;
		width: max-content;
		padding: 0 20rpx 0 20rpx;
		text-align: center;
		height: 50rpx;
	}

	.tui-tab-item-title-active {
		color: #FFFFFF;
		background: #FF440C;
		font-size: 28upx;
		border-bottom-width: 6upx;
		text-align: center;
	}
</style>
