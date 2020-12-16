<template>
	<view class="container">
		<list-cell title="手机号" maxlength="11" type="number" placeholder="请输入手机号" v-model="mobile"></list-cell>
		<list-cell title="验证码" v-model="code" type="number" maxlength="6" placeholder="请输入验证码" isShowCode codeText="获取验证码"
		 setTime="60" ref="runCodes" @setCode="sendMsg()"></list-cell>
		
		<wButton text="立即换绑" :rotate="logining" @click.native="toLogin()"></wButton>
	</view>
	</view>
</template>

<script>
	import listCell from '@/components/com-input';
	import wButton from '@/components/watch-login/watch-button.vue'; //button
	export default {
		components: {
			wButton,
			listCell
		},
		data() {
			return {
				mobile: '',
				code: '',
				logining: false,
				sending: false,
				sendTime: '获取验证码',
				count: 60,
			}
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
					this.sendTime = '获取验证码'
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
					this.$queue.showToast("请输入手机号");
				} else if (mobile.length !== 11) {
					this.$queue.showToast("请输入正确的手机号");
				} else {
					this.$queue.showLoading("正在发送验证码...");
					this.$Request.getT("/user/sendMsg/" + mobile + "/update").then(res => {
						if (res.status === 0) {
							this.sending = true;
							this.$queue.showToast('验证码发送成功请注意查收');
							this.$refs.runCodes.$emit('runCodes');
							uni.hideLoading();
						} else {
							uni.hideLoading();
							uni.showModal({
								showCancel: false,
								title: '短信发送失败',
								content: res.msg,
							});
						}
					});
				}
			},
			toLogin() {
				const {
					mobile,
					code
				} = this;
				let userId = this.$queue.getData("userId");
				if (!mobile) {
					this.$queue.showToast("请输入手机号");
				} else if (mobile.length !== 11) {
					this.$queue.showToast("请输入正确的手机号");
				} else if (!code) {
					this.$queue.showToast("请输入验证码");
				} else {
					this.$queue.showLoading("正在绑定中...");
					this.$Request.postT("/user/updatePhone?msg=" + code + "&phone=" + mobile + "&userId=" + userId).then(res => {
						if (res.status === 0) {
							this.$queue.setData("mobile", mobile);
							uni.switchTab({
								url: '/pages/member/user'
							});
						} else {
							uni.showModal({
								showCancel: false,
								title: '绑定失败',
								content: res.msg,
							});
						}
						uni.hideLoading();
					});
				}
			},
		},

	}
</script>

<style lang='scss'>
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

</style>