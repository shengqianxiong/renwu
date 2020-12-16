<template>
	<view class="register">
		<view class="content">
			<view class="main" style="margin-top: 60upx;">
				<wInput v-model="phoneData" type="number" maxlength="11" placeholder="请输入手机号"></wInput>

				<wInput v-model="verCode" type="number" maxlength="6" placeholder="请输入验证码" isShowCode ref="runCode" @setCode="sendMsg()"></wInput>
				<wInput v-model="invitation" type="text" isShowGet ref="setNumberCode" @setNumberCode="isShowGet()" placeholder="请填写邀请码"></wInput>
			</view>

			<wButton text="绑定手机号" :rotate="isRotate" @click.native="startReg()"></wButton>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button

	export default {
		data() {
			return {
				platform: "app",
				phoneData: '', // 用户/电话
				passData: '123456', //密码
				verCode: "", //验证码
				showAgree: true, //协议是否选择
				isRotate: false, //是否加载旋转
				invitation: '',
				invitations: '',
				isEnable: '否',
			}
		},

		components: {
			wInput,
			wButton,
		},
		onLoad() {
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
		},

		mounted() {
			_this = this;
		},
		methods: {
			navBack() {
				uni.navigateBack();
			},
			isShowGet() {
				this.invitation = this.$queue.getInvitation()
			},
			sendMsg() {
				const {
					phoneData
				} = this;
				if (!phoneData) {
					this.$queue.showToast("请输入手机号");
				} else if (phoneData.length !== 11) {
					this.$queue.showToast("请输入正确的手机号");
				} else {
					this.$queue.showLoading("正在发送验证码...");
					this.$Request.getT("/user/sendMsg/" + phoneData + "/login").then(res => {
						if (res.status === 0) {
							this.sending = true;
							this.$queue.showToast('验证码发送成功请注意查收');
							this.$refs.runCode.$emit('runCode');
							uni.hideLoading();
						} else {
							console.log(JSON.stringify(res))
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
			isShowAgree() {
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
			startReg() {
				//注册
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.showAgree == false) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请先同意《协议》'
					});
					return false;
				}
				if (this.phoneData.length != 11) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不正确'
					});
					return false;
				}
				if (this.passData.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码不能低于六位'
					});
					return false;
				}
				if (this.verCode.length != 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '验证码不正确'
					});
					return false;
				}
				if (this.invitation != undefined && this.invitation != '') {} else {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请输入邀请码'
					});
					return false;
				}
				_this.isRotate = true;
				console.error(_this.$queue.getData('weixinToken'))
				console.error(_this.$queue.getData('unionid'))
				console.error(_this.$queue.getData('weixinOpenid'))
				this.$Request.postJson("/appLogin/loginWeiXinApp", {
					pwd: _this.passData,
					phone: _this.phoneData,
					msg: _this.verCode,
					platform: _this.platform,
					invitation: _this.invitation,
					token: _this.$queue.getData('weixinToken'),
					unionid: _this.$queue.getData('unionid'),
					openid: _this.$queue.getData("weixinOpenid")
				}).then(res => {
					console.log(JSON.stringify(res))
					if (res.status === 0) {
						this.$queue.setData("mobile", _this.phoneData);
						this.$queue.setData("token", res.data.uuid);
						this.$queue.setData("userId", res.data.userId);
						this.getUserInfo(res.data.userId, res.data.uuid);
					} else {
						_this.isRotate = false;
						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '绑定失败',
							content: res.msg,
						});
					}
				});
			},
			getUserInfo(userId, token) {
				this.$Request.getT("/user/" + userId).then(res => {
					if (res.status === 0) {
						this.$queue.setData("image_url", res.data.image_url ? res.data.image_url : '/static/img/common/logo.jpg');
						this.$queue.setData("relation_id", res.data.relationId);
						this.$queue.setData("relation", res.data.invitation);
						this.$queue.setData("grade", res.data.grade);
						this.$queue.setData('pddpid', res.data.pdd);
						this.$queue.setData('jdpid', res.data.jd);
						this.$queue.setData("isInvitation", res.data.isInvitation);
						this.$queue.setData("nickName", res.data.nickName ? res.data.nickName : res.data.phone);
						this.$queue.setData("gender", parseInt(res.data.gender));
						uni.switchTab({
							url: '/pages/zysc/index/index'
						});

					} else {
						uni.showModal({
							showCancel: false,
							title: '绑定失败',
							content: res.msg,
						});

					}
					_this.isRotate = false
				});
			}
		}
	}
</script>

<style lang='scss'>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");

	.back-btn {
		position: absolute;
		left: 20px;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 20px;
		font-size: 20px;
		opacity: 0.8;
		color: $font-color-dark;
	}
</style>
