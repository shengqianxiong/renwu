<template>
	<view class="content">
		<view class="view1" style="margin: 12upx;border-radius: 16upx;">
			<view style="margin-left: 33%;padding-top: 100upx;font-size: 29px;color: #FFFFFF;">¥ {{ money }}</view>
			<view style="display: flex;flex-direction: row;">
				<view style="width: 49%; margin: 80upx 0 0 10upx;text-align: center;" @click="ketixian">
					<view style="font-size: 24upx;color: #FFFFFF;">可提现金额</view>
					<view style="font-size: 32upx;color: #FFFFFF; margin-top: 10upx;">¥ {{ money }}</view>
				</view>
				<view style="background-color: #FFFFFF;width: 1upx; height: 70upx;margin: 80upx 0 0 10upx;"></view>
				<view style="width: 49%; margin: 80upx 0 0 10upx;text-align: center;" @click="leijitixian">
					<view style="font-size: 24upx;color: #FFFFFF;">累计提现金额</view>
					<view style="font-size: 32upx;color: #FFFFFF; margin-top: 10upx;">¥ {{ totalMoney }}</view>
				</view>
			</view>
		</view>

		<view class="view2" style="margin: 12upx;border-radius: 16upx;">
			<view class="view2-view" @tap="getOut">
				<image src="https://api.shengqianxiong.com.cn/img/20201118/5fe614cf486b4a0fb80b0913fbfb9c7a.png" class="view2-view-image"></image>
				<view class="view2-view1">
					<view class="view2-view-text">立即提现</view>
					<image src="../../static/img/my/mygoright.png" class="view2-view-image-right"></image>
				</view>
			</view>
			<view class="view2-view" @click="goZhifuBao">
				<image src="https://api.shengqianxiong.com.cn/img/20201118/86efb280c3d2416e86e7b1900bbe17ff.png" class="view2-view-image"></image>
				<view class="view2-view1">
					<view class="view2-view-text">提现账号</view>
					<image src="../../static/img/my/mygoright.png" class="view2-view-image-right"></image>
				</view>
			</view>
			<view class="view2-view" @tap="list">
				<image src="https://api.shengqianxiong.com.cn/img/20201118/5ce91ac860334fc9ac09c977467607cd.png" class="view2-view-image"></image>
				<view class="view2-view1">
					<view class="view2-view-text">提现记录</view>
					<image src="../../static/img/my/mygoright.png" class="view2-view-image-right"></image>
				</view>
			</view>
			<view class="view2-view" @tap="moneyList">
				<image src="https://api.shengqianxiong.com.cn/img/20201118/22f17a68dc7446d6bef8e0a7a6cbac55.png" class="view2-view-image"></image>
				<view class="view2-view1">
					<view class="view2-view-text">钱包明细</view>
					<image src="../../static/img/my/mygoright.png" class="view2-view-image-right"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: '0.00',
				zhifubao: '',
				walletmoney: '0.00',
				totalMoney: '0.00',
				zhifubaoName: '',
			}
		},
		onShow: function(e) {
			this.getMoney();
			this.getwalletMoney();
		},
		methods: {
			ketixian() {
				uni.showModal({
					showCancel: false,
					confirmColor: '#e10a07',
					title: '可提现金额说明',
					content: '可提现金额是我们通过在商城中购买商品后返利的佣金，这个金额是可提现的'
				});
			},
			leijitixian() {
				uni.showModal({
					showCancel: false,
					confirmColor: '#e10a07',
					title: '累计提现金额说明',
					content: '累计提现金额是我们过往提现成功金额的总计'
				});
			},
			moneyList() {
				uni.navigateTo({
					url: '/pages/member/moneyList'
				})
			},
			list() {
				uni.navigateTo({
					url: '/pages/member/cashList'
				})
			},
			goZhifuBao() {
				uni.navigateTo({
					url: "/pages/member/zhifubao"
				})
			},
			getwalletMoney() {
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/userMoney/selectUserMoney?userId=' + userId).then(res => {
					if (res.status === 0) {
						this.walletmoney = res.data.money;
					}
					uni.hideLoading();
				});
			},
			getMoney() {
				let that = this;
				let token = this.$queue.getData("token");
				let userId = this.$queue.getData("userId");
				if (token) {
					//this.$queue.showLoading("加载中...");
					//可以提现金额查询预估收入查询
					this.$Request.getT("/cash/money/" + userId).then(res => {
						if (res.status === 0 && res.data) {
							that.money = parseFloat(res.data).toFixed(2);
						} else if (res.status === -102) {
							this.$queue.showToast(res.msg);
							this.$queue.logout();
							uni.navigateTo({
								url: '/pages/member/register'
							});
						} else {
							that.money = '0.00';
							//this.$queue.showToast(res.msg);
						}
					});
					this.$Request.getT("/cash/userinfo/" + userId).then(res => {
						if (res.status === 0 && res.data) {
							that.zhifubao = res.data.zhifubao;
							that.zhifubaoName = res.data.zhifubaoName;
						}
						uni.hideLoading();
					});
					//总的提现记录
					this.$Request.getT("/cash/countByRelationId/" + this.$queue.getData("relation_id")).then(res => {
						if (res.status === 0 && res.data) {
							that.totalMoney = parseFloat(res.data).toFixed(2);
						} else {
							that.totalMoney = '0.00';
						}
					});
				}

			},
			getOut() {
				let that = this;
				let token = this.$queue.getData("token");
				let userId = this.$queue.getData("userId");
				let cashMoney = this.$queue.getData("cashMoney");
				if (token) {
					if (that.zhifubao && that.zhifubaoName) {
						if (parseFloat(this.money).toFixed(1) >= parseFloat(cashMoney)) {
							uni.showModal({
								title: "提现申请提示",
								content: '请仔细确认收款人信息\n\n姓名:' + that.zhifubaoName + '\n\n收款账号：' + that.zhifubao + '',
								success: (e) => {
									if (e.confirm) {
										this.$queue.showLoading("提现中...");
										this.$Request.getT("/cash/out/" + userId).then(res => {
											if (res.status === 0 && res.data) {
												that.$queue.showToast("提现申请成功，预计三个工作日到账");
												that.getMoney();
											}
											uni.hideLoading();
										});
									}
								}
							});
						} else {
							this.$queue.showToast("提现金额必须大于或等于" + cashMoney + "元才可提现");
						}
					} else {
						uni.navigateTo({
							url: "/pages/member/zhifubao"
						})
					}
				} else {
					uni.navigateTo({
						url: '/pages/member/register'
					});
				}
			},
		},
	}
</script>

<style lang='less'>
	@import "../../static/css/index.css";

	.view1 {
		/* width: 100%; */
		height: 375upx;
		background: -webkit-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -o-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -ms-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #e10a07), to(#f15b6c));
		background: -o-linear-gradient(right, #e10a07 0, #f15b6c 100%);
		background: -webkit-linear-gradient(right, #e10a07 0, #f15b6c 100%);
		background: linear-gradient(to left, #e10a07 0, #f15b6c 100%);
	}

	.view2 {
		background-color: #ffffff;
	}

	.view2-view {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100upx;
		align-items: center;
	}

	.view2-view1 {
		display: flex;
		flex-direction: row;
		width: 90%;
		align-items: center;
	}

	.view2-view-image {
		margin-left: 40upx;
		width: 50upx;
		height: 50upx;
	}

	.view2-view-text {
		font-size: 14px;
		color: #000000;
		margin-left: 40upx;
		width: 80%;
	}

	.view2-view-image-right {
		width: 18upx;
		height: 20upx;
		margin-left: 30upx;
	}
</style>
