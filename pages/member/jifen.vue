<template>
	<view>
		<view style="position: absolute;width: 100%;height: 460upx;background: #e10a07;"></view>
		<view style="color: #FFFFFF;position: relative;padding-left: 80upx;padding-top: 80upx;">
			<view style="font-size: 32upx;">当前积分（个）</view>
			<view style="display: flex;">
				<view style="padding-top: 16upx;font-size: 50upx;font-weight: bold;width: 70%;">{{ total ? total : 0 }}</view>
			<view @click="goMoney" style="background: #FFFFFF;color: #E10A07;padding-top: 16upx;padding-left: 32upx;padding-right: 32upx;border-radius: 32upx;margin-right: 8upx;">积分兑换</view>
			</view>
		</view>
		<view style="border-radius:12px;border:1px solid rgba(238,238,238,1);position: relative;background: #FFFFFF;margin: 64upx 24upx 24upx 24upx;">
			<view style="text-align: center;margin-top: 32upx">
				<text class="news_title">一</text>
				<text style="font-size: 32upx;">积分明细</text>
				<text class="news_title">一</text>
			</view>
			<view v-if="contents.length==0" style="margin-top: 300upx;color: #999999;text-align: center;margin-bottom: 400upx;">暂无积分</view>
			<view v-for="(item, index) in contents" :key="index" style="padding: 32upx;border-bottom: 1upx solid #F0F0F0;font-size: 32upx;color: #666666;">
				<view style="display: flex;">
					<view style="width: 500upx;overflow: hidden;text-overflow: ellipsis;white-space:nowrap">{{item.des}}</view>
					<view class="jifen_number" v-if="item.content!='积分兑换'">+ {{ item.number }}</view>
					<view class="jifen_number" v-if="item.content=='积分兑换'">- {{ item.number }}</view>
				</view>
				<view style="margin-top: 4upx;color: #999999;font-size: 28upx;">{{ item.createAt }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				contents: [],
				modalName: '',
				isLogin: false,
				percent: 0,
				total: 0
			};
		},
		onShow() {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserInfo(userId),
				this.getToatal(userId);
			}
		},
		methods: {
			goMoney() {
				uni.navigateTo({
					url:'/pages/member/chongzhi'
				})
			},
			//获取用户信息
			getUserInfo(userId) {
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						if (res.data.orderJifen) {
							this.total = parseFloat(res.data.orderJifen).toFixed(0);
						}
						
					} else {
						this.$queue.logout();
						uni.showModal({
							title: '用户信息提示',
							content: '本地用户信息失效需要重新授权登录',
							showCancel: false,
							success: e => {
								uni.navigateTo({
									url: '/pages/member/register'
								});
							}
						});
					}
				});
			},
			getToatal(userId) {
				this.$Request.postT('/user/getUserJifenList/'+userId).then(res => {
					if (res.status === 0) {
						this.contents = res.data;
					} else {
						this.contents = [];
					}
				});
			}
		}
	};
</script>

<style scoped>
	
	.xinrenhongbao image {
		animation: myfirst 1s infinite;
	}
	
	@keyframes myfirst {
		0% {
			transform: translate(0px, 0px);
		}
	
		50% {
			transform: translate(0px, -15px);
		}
	
		100% {
			transform: translate(0px, 0px);
		}
	}
	
	.news_title {
		font-weight: bold;
		color: #E67817;
		margin-right: 16px;
		margin-left: 16px;
		width: 6px;
	}
	.jifen_number {
		color: #ff7800;
		margin-left: 8upx;
	}
	.jifen {
		display: flex;
		margin: 8px 16px 8px 16px;
		border-bottom: 1upx solid #f1f1f1;
		padding-bottom: 20upx;
		padding-top: 8upx;
	}
	.title {
		text-align: center;
		color: #ffffff;
		font-size: 26px;
		height: 250upx;
	}
	.news_title {
		font-weight: bold;
		color: #f9221d;
		margin-right: 16px;
		margin-left: 16px;
		width: 6px;
	}
</style>