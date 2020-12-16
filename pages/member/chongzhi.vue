ss
<template>
	<view>
		<view class="bg" style="margin: 12upx;border-radius: 16upx;position: absolute;width: 96%;height: 380upx"></view>
		<view style="color: #FFFFFF;position: relative;padding-left: 80upx;padding-top: 80upx;">
			<view style="font-size: 32upx;">当前积分（个）</view>
			<view style="display: flex;">
				<view style="padding-top: 16upx;font-size: 50upx;font-weight: bold;width: 70%;">{{ total ? total : 0 }}</view>
			</view>
			<view style="margin-top: 32upx;font-size: 26upx;">注：1000积分=1元，最低可提现积分为1000积分</view>
		</view>
		<view style="margin: 32upx;">
			<view class="main" style="margin-top: 180upx;">
				<wInput v-model="jifen" type="number" maxlength="11" placeholder="请输入要兑换的积分"></wInput>
			</view>

			<wButton text="立即兑换" :rotate="isRotate" @click.native="duihuan()"></wButton>
		</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue'; //input
	import wButton from '../../components/watch-login/watch-button.vue'; //button
	export default {
		data() {
			return {
				modalName: '',
				jifen: '',
				isRotate: false, //是否加载旋转
				isLogin: false,
				percent: 0,
				total: 0
			};
		},
		components: {
			wInput,
			wButton
		},
		onLoad() {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserInfo(userId)
			}
		},
		methods: {
			duihuan() {
				if (!this.jifen) {
					this.$queue.showToast('请输入要兑换的积分');
				} else if (this.jifen > this.total) {
					uni.showModal({
						title: '积分提醒',
						content: '当前可用积分为' + this.total + '，快去领券购物或参与每日签到获取积分吧！',
						showCancel: false
					});
				} else if (this.jifen < 1000) {
					this.$queue.showToast('最低可提现积分为1000');
				} else {
					let userId = this.$queue.getData('userId');
					this.$Request.getT('/user/cashMoney/' + userId + '?money=' + this.jifen).then(res => {
						if (res.status === 0) {
							this.jifen = '';
							this.getUserInfo(userId)
							uni.showModal({
								title: '积分提醒',
								content: '兑换成功！请在【我的提现】中提现',
								showCancel: false
							});
						}else{
							uni.showModal({
								title: '积分提醒',
								content: res.msg,
								showCancel: false
							});
						}
					});
				}
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
			}
		}
	};
</script>

<style scoped>
	.bg {
		background: -webkit-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -o-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -ms-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #e10a07), to(#f15b6c));
		background: -o-linear-gradient(right, #e10a07 0, #f15b6c 100%);
		background: -webkit-linear-gradient(right, #e10a07 0, #f15b6c 100%);
		background: linear-gradient(to left, #e10a07 0, #f15b6c 100%);
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
</style>