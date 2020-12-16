<template>
	<view class="container">
		<view style="display: flex;margin: 40upx;">
			<image src="../../static/logo2.png" mode="aspectFit" style="width: 140upx;height: 140upx;border-radius: 16upx;"></image>
			<view style="margin-left: 32upx;">
				<view style="color: #e10a07;font-size: 32upx;">实名提醒</view>
				<view style="margin-right: 120upx;font-size: 28upx;color: #999999;margin-top: 16upx;">应国家法律要求全面实行实名制须绑定手机完成认证</view>
			</view>
		</view>

		<view style="margin-left: 26upx;margin-top: 104upx;">
			<wInput v-model="mobile" type="number" maxlength="11" placeholder="请输入手机号"></wInput>

			<wInput v-model="code" type="number" maxlength="6" placeholder="请输入验证码" isShowCode ref="runCode" @setCode="sendMsg()"></wInput>
		</view>
		<button class="confirm-btn" @click="toLogin" :disabled="logining">确认绑定</button>
	</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import listCell from '@/components/com-input';
	export default {
		components: {
			wInput,
			listCell
		},
		data() {
			return {
				mobile: '',
				code: '',
				logining: false,
				sending: false,
				sendTime: '获取验证码',
				count: 60
			};
		},
		onUnload() {
			uni.removeStorage({
				key: 'publisher'
			})
		},
		methods: {
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},

			countDown() {
				const {
					count
				} = this;
				if (count === 1) {
					this.count = 60;
					this.sending = false;
					this.sendTime = '获取验证码';
				} else {
					this.count = count - 1;
					this.sending = true;
					this.sendTime = count - 1 + '秒后重新获取';
					setTimeout(this.countDown.bind(this), 1000);
				}
			},

			sendMsg() {
				const {
					mobile
				} = this;
				if (!mobile) {
					this.$queue.showToast('请输入手机号');
				} else if (mobile.length !== 11) {
					this.$queue.showToast('请输入正确的手机号');
				} else {
					this.$queue.showLoading('正在发送验证码...');
					this.$Request.getT('/user/sendMsg/' + mobile + '/bind').then(res => {
						if (res.status === 0) {
							this.sending = true;
							this.$queue.showToast('验证码发送成功请注意查收');
							this.$refs.runCode.$emit('runCode');
							uni.hideLoading();
						} else {
							uni.hideLoading();
							uni.showModal({
								showCancel: false,
								title: '短信发送失败',
								content: res.msg ? res.msg : '请一分钟后再获取验证码',
							});
						}
					});
				}
			},
			toLogin() {
				let userId = this.$queue.getData('userId');
				var mobile = this.mobile;
				var code = this.code;
				if (!mobile) {
					this.$queue.showToast('请输入手机号');
				} else if (mobile.length !== 11) {
					this.$queue.showToast('请输入正确的手机号');
				} else if (!code) {
					this.$queue.showToast('请输入验证码');
				} else if (code.length != 6) {
					this.$queue.showToast('请输入正确的验证码');
				} else {
					this.$queue.showLoading('正在绑定中...');
					this.$Request.postT('/user/bindPhone?msg=' + code + '&phone=' + mobile + '&userId=' + userId).then(res => {
						if (res.status === 0) {
							this.$queue.setData('relation_id', res.data.relationId);
							this.$queue.setData('mobile', mobile);
							uni.navigateBack();

						} else {
							uni.showModal({
								showCancel: false,
								title: '绑定失败',
								content: res.msg
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
	page {
		background: #fff;
	}

	.container {
		top: 0;
		padding-top: 32upx;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.confirm-btn {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 70px;
		background: #e10a07;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}
</style>
