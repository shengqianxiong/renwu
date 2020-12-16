<template>
	<view class="container">
		<list-cell title="收款人姓名" type="text" placeholder="请输入支付宝收款人姓名" v-model="userName"></list-cell>

		<list-cell title="支付宝账号" type="number" placeholder="请输入要绑定的支付宝手机号" v-model="mobile"></list-cell>

        <wButton text="绑定账户" :rotate="logining" @click.native="toLogin()"></wButton>
	    <view style="padding: 32upx 64upx;font-size: 24upx;color: #999999;">提示：请正确填写收款人的支付宝账户和真实的收款人姓名，否则将无法正常收款</view>
	
	</view>
	</view>
</template>

<script>
	import listCell from '@/components/com-input';
	import wButton from '@/components/watch-login/watch-button.vue'; //button
	export default {
		components: {
			listCell,
			wButton
		},
		data() {
			return {
				mobile: '',
				userName: '',
				logining: false
			}
		},
		onLoad() {
			let userId = this.$queue.getData("userId");
			if (userId) {
				this.$Request.getT("/cash/userinfo/" + userId).then(res => {
					if (res.status === 0) {
						if (res.data.zhifubao) {
							this.mobile = res.data.zhifubao;
						}
						if (res.data.zhifubaoName) {
							this.userName = res.data.zhifubaoName;
						}
					}
				});
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

			toLogin() {
				let userId = this.$queue.getData("userId");
				let token = uni.getStorageSync("token");
				const {
					mobile,
					userName
				} = this;
				if (!mobile) {
					this.$queue.showToast("请设置收款人支付宝账号");
				} else if (!userName) {
					this.$queue.showToast("请设置收款人姓名");
				} else {
					this.$queue.showLoading("修改中...");
					this.$Request.postT("/cash/userinfo?userId=" + userId + "&zhifubao=" + mobile + "&zhifubaoName=" + userName).then(
						res => {
							if (res.status === 0) {
								if (res.data.zhifubao) {
									this.mobile = res.data.zhifubao;
								}
								if (res.data.zhifubaoName) {
									this.userName = res.data.zhifubaoName;
								}
								this.navBack();
							} else {
								this.$queue.showToast(res.msg)
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
		background: #FFFFFF;
	}

	.container {
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
		margin-top: 70upx;
		background: #e10a07;
		color: #fff;
		font-size: $font-lg;
	
		&:after {
			border-radius: 60px;
		}
	}

</style>
