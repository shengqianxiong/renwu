<template>
	<view>
		<view style="height: max-content;background-color: #FFFFFF;margin-top: 10upx;padding: 30upx 30upx 10upx 40upx;border-bottom-left-radius: 20upx;border-bottom-right-radius: 20upx;"
		 v-for="(item,index) in list" :key='index'>
			<view style="display: flex;" @tap='goBackByAddress(item)'>
				<view style="font-size: 30upx;color: #333333;width: 67%;">{{item.consignee}}</view>
				<view style="font-size: 30upx;color: #333333;width: 30%;margin-left: 20upx;text-align: right;">{{item.mobile}}</view>
			</view>
			<view style="display: flex;margin-top: 30upx;height: 70upx;">
				<view style="font-size: 30upx;color: #333333;width: 90%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{item.provinces}}{{item.detail}}</view>
			</view>
			<view style="margin-top: 10upx;height: 1upx;background-color: #E3E4E5;"></view>
			<view style="display: flex;padding: 20upx 5upx 20upx 0upx;font-size: 30upx;">
				<radio-group name="openWay" style="text-align: left;width: 70%;">
					<label class="tui-radio" v-if="item.isDefault === 1">
						<radio :checked="item.isDefault === 1 ? true : false" color="#FF332F" disabled='true' style="transform:scale(0.8);" />
						<text style="font-size: 30upx;color: #FF332F;margin-left: 10upx;">默认地址</text>
					</label>
				</radio-group>
				<view style="display: flex;margin-left: 80upx;margin-top: 5upx;width: 40%;text-align: right;">
					<view style="font-size: 30upx;color: #999999;width: 50%;" @tap='deleteAddressList(item.id)'>删除</view>
					<view style="font-size: 30upx;color: #999999;width: 50%;" @tap='goAddress(item.id)'>编辑</view>
				</view>
			</view>
		</view>
		<button style="background: #FF332F;color: #FFFFFF;margin: 30upx;position: fixed;bottom: 0upx;width: 90%;" @tap="goAddress('')">+新建收货地址</button>
		<!-- 悬浮上拉 -->
		<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '', '']" style="bottom: 56px;"><text
			 class="iconfont icon-shangla"></text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openWay: 0,
				list: [],
				loadingType: 0,
				type: 1,
				scrollTop: false
			}
		},
		onShow() {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getAddressList('');
			}
		},
		onLoad() {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getAddressList('');
			}
		},
		methods: {
			goBackByAddress(item) {
				this.$queue.setData('EditAddress', item);
				uni.navigateBack();
			},
			deleteAddressList(id) {
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除此地址信息吗?',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.$Request.getT('/address/delete?id=' + id).then(res => {
								if (res.status === 0) {
									this.$queue.showToast("删除成功！");
									this.getAddressList('');
								} else {
									this.$queue.showToast(res.msg);
								}
							});
						}
					}
				});
			},
			getAddressList(type) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/address/findByUserId?userId=' + userId).then(res => {
					if (res.status === 0) {
						this.list = [];
						res.data.forEach(d => {
							this.list.push(d);
						});
						this.loadingType = 0;
					} else {
						this.loadingType = 2;
					}
					uni.hideLoading();
					if (type === 'Refresh') {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});
			},
			goAddress(id) {
				uni.navigateTo({
					url: './EditAddress?id=' + id
				});
			},
			tabSlect(item) {
				this.tabIndex = item.id;
			},
			selectWay(id) {
				this.openWay = id;
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../../static/less/index.less';
	@import '../../../static/css/index.css';

	page {
		background: #F2F2F2;
	}

	.tui-line-cell {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2upx solid #f2f2f2;
		padding: 0 0 16upx 0;
	}

	.tui-title {
		line-height: 32rpx;
		min-width: 120rpx;
		flex-shrink: 0;
	}

	.tui-input {
		font-size: 32rpx;
		color: #333;
		padding-left: 20rpx;
		flex: 1;
	}
</style>
