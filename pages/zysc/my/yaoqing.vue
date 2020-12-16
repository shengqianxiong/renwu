<template>
	<view class="content">
		<view class="view1" style="box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;border-radius: 20upx;margin-bottom: 20upx;">
			<view style="display: flex;">
				<view style="margin: 70upx 0 0 20upx;height: 100upx; width: 300upx; text-align: center;">
					<view style="font-size: 40upx;color: #333333;">{{ total }}</view>
					<view style="font-size: 28upx;color: #666666;">邀请好友（人）</view>
				</view>
				<view style="margin: 70upx 0 0 75upx;height: 100upx; width: 300upx;text-align: center;">
					<view style="font-size: 40upx;color: #333333;">{{ money }}</view>
					<view style="font-size: 28upx;color: #666666;">总收益</view>
				</view>
			</view>
			<button class="yaoqing_btn" v-bind:style="{backgroundImage: 'url('+toBase64Url+')'}" @click="goYao">邀请好友</button>
		</view>
		<view class="navbar" style="border-top-left-radius: 20rpx;border-top-right-radius: 20rpx;margin-left: 26rpx;width: 93%;">
			<view class="nav-item" :class="{current: index == 1}" @tap="zhishu(1)">
				直属收益
			</view>
			<view class="nav-item" :class="{current: index == 2}" @tap="tuan(2)">
				非直属收益
			</view>
		</view>
		<view class="view2" style="margin-bottom: 50rpx;">
			<view style="display: flex;flex-direction: row;padding: 20upx;">
				<view style="width: 20%;">排名</view>
				<view style="width: 50%;">昵称</view>
				<view style="width: 30%;text-align: center;">累计贡献</view>
			</view>
			<view style="display: flex;flex-direction: row;padding: 20upx;" v-for="(item, index) in list" :key="index">
				<view style="width: 20%;">
					<image v-if="index + 1 == 1" src="https://api.shengqianxiong.com.cn/img/20201118/93ae49db6c064009a16c95cdc37f9b5f.png" style="width: 40upx; height: 40upx;"></image>
					<image v-if="index + 1 == 2" src="https://api.shengqianxiong.com.cn/img/20201118/1335ae43c94640998cf43c2de7689786.png" style="width: 40upx; height: 40upx;"></image>
					<image v-if="index + 1 == 3" src="https://api.shengqianxiong.com.cn/img/20201118/2d06c6ab24aa4c36b8da1be386c9d998.png" style="width: 40upx; height: 40upx;"></image>
					<view v-if="index + 1 > 3" style="font-size: 28upx; color: #000000; margin-left: 15upx;margin-top: 6upx;">{{ index + 1 }}</view>
				</view>
				<view style="width: 50%;display: flex;flex-direction: row;align-items: center;">
					<view style="font-size: 14px; color: #333333;width: 65%;">{{ item.userName }}</view>
				</view>
				<view style="width: 30%;text-align: center;">
					<view style="font-size: 16px;color: #FF580B;">¥{{ item.moneySum }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				index: 1,
				money: 0,
				toBase64Url: 'https://api.shengqianxiong.com.cn/yaoqingbtn.png',
				nickName: '游客',
				total: 0
			};
		},
		onLoad() {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.$Request.getT('/ordersRelation/tuanSum?userId=' + userId).then(res => {
					if (res.status === 0) {
						this.money = res.data.data;
					}
				});
			}
			this.getTeamTotal('');
		},
		methods: {
			zhishu(nub) {
				this.index = nub
				this.getTeamTotal('');
			},
			tuan(nub) {
				this.index = nub
				this.getTeamTotal('');
			},
			goYao() {
				uni.navigateTo({
					url: '/pages/member/yao'
				});
			},
			getTeamTotal(type) {
				let relationId = this.$queue.getData('relation_id');
				if (relationId) {
					this.$Request.getT('/user/team/users/' + relationId).then(res => {
						if (res.status === 0 && res.data) {
							this.total = res.data.length;
						}
					});

					uni.showLoading({
						title: '加载中...'
					});
					let userId = this.$queue.getData('userId');
					this.$Request.getT('/ordersRelation/team?userId=' + userId + '&type=' + this.index).then(
						res => {
							if (res.status === 0 && res.data) {
								this.list = [];
								res.data.data.forEach(d => {
									this.list.push(d);
								});
							}
							uni.hideLoading();
						});
				}
			}
		}
	};
</script>

<style lang="scss">
	scoped>page {
		background: #F8F8F8;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.view1 {
		background-color: #ffffff;
		width: 93%;
		height: 300upx;
		margin-left: 26upx;
		border-radius: 20upx;
		margin-top: 20upx;
	}

	.view2 {
		background-color: #ffffff;
		width: 93%;
		height: 100%;
		margin-left: 26upx;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}

	.yaoqing_btn {
		width: 80%;
		line-height: 80upx;
		margin-top: 30upx;
		height: 85upx;
		color: #FFFFFF;
		background-size: 100%;
	}
</style>
