<template>
	<!-- #ifndef MP-WEIXIN -->
	<view class="register">
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view style="padding-top: 172upx;margin-left: 36upx;">
			<view style="color: #333333;font-size: 44upx;">手机快捷登录</view>
			<view style="color: #999999;font-size: 24upx;margin-top: 20upx;">未注册的手机号将自动创建账号</view>
		</view>
		<view style="margin-left: 26upx;margin-top: 104upx;">
			<wInput v-model="phoneData" type="number" maxlength="11" placeholder="请输入手机号"></wInput>
			<wInput v-model="verCode" type="number" maxlength="6" placeholder="请输入验证码" isShowCode ref="runCode" @setCode="sendMsg()"></wInput>
			<wInput v-show="show" v-model="invitation" isShowGet ref="setNumberCode" @setNumberCode="isShowGet()" placeholder="请填写邀请码"></wInput>
		</view>

		<view class="footer" style=" margin-right: 72px;">
			<image v-if="showAgree" @tap="isShowAgree" src="https://api.shengqianxiong.com.cn/img/20201112/669aa8946cfb4ebdb459d57193c0ebca.png"
			 style="width: 36upx;height: 36upx;"></image>
			<image v-else @tap="isShowAgree" src="https://api.shengqianxiong.com.cn/img/20201112/1e9102fc891f4d86a13c7b2ba6921cba.png"
			 style="width: 36upx;height: 36upx;"></image>
			<text style="margin-left: 10upx;margin-right: 0;">同意</text>
			<navigator url="/pages/member/mimi" open-type="navigate">《隐私政策》</navigator>和
			<navigator url="/pages/member/xieyi" open-type="navigate">《用户服务协议》</navigator>
		</view>
		<wButton text="登 录" :rotate="isRotate" @click.native="startReg()"></wButton>
		<view style="width: 100%;text-align: center;margin-top: 40rpx;color: #ff0000;" v-if="weixinLogin">
			<text style="font-size: 30rpx;" @click="weixinLo">微信登录</text>
		</view>
	</view>
	</view>
	<!-- #endif -->

	<!-- #ifdef MP-WEIXIN -->
	<view v-if="isCanUse">
		<view>
			<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
			<view class='headers'>
				<image src='../../static/logo2.png'></image>
			</view>
			<view class='content'>
				<view>申请获取以下权限</view>
				<text>获得你的公开信息(昵称，头像、地区等)</text>
			</view>

			<button style="background: #E10A07;background-color: #E10A07;" class='bottom' type='primary' open-type="getUserInfo"
			 withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
				授权登录
			</button>
			<view class="footer" style="font-size: 32upx;">
				<text @tap="isShowAgree" class="cuIcon" :class="showAgree?'cuIcon-radiobox':'cuIcon-round'">同意
				</text>
				<!-- 协议地址 -->
				<navigator url="/pages/member/mimi" open-type="navigate" style="font-size: 32upx;">《隐私政策》</navigator>和
				<navigator url="/pages/member/xieyi" open-type="navigate" style="font-size: 32upx;">《用户服务协议》</navigator>


			</view>
		</view>
	</view>
	<!-- #endif -->
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button

	export default {
		data() {
			return {
				platform: "mp",
				phoneData: '', // 用户/电话
				passData: '123456', //密码
				isCanUse: true, //默认为true
				verCode: "", //验证码
				weixinLogin: false,
				showAgree: true, //协议是否选择
				isRotate: false, //是否加载旋转
				invitation: '',
				invitations: '',
				isEnable: '否',
				show: false,
			}
		},
		components: {
			wInput,
			wButton,
		},
		onLoad(d) {
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			// #ifdef H5
			let relation = this.$queue.getData("userByinvitationId");
			if (relation) {
				this.invitation = relation;
				this.show = false;
			}
			// #endif
			// #ifdef APP-PLUS
			//微信登录开启
			this.$Request.getT('/common/type/53').then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value && res.data.value == '是') {
						this.weixinLogin = true;
					}
				}
			});
			// #endif
		},
		mounted() {
			_this = this;
		},
		methods: {
			weixinLo() {
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						that.$queue.showLoading('正在登录中...');
						console.error(loginRes.authResult);
						that.$queue.setData('weixinToken', loginRes.authResult.access_token);
						that.$queue.setData('unionid', loginRes.authResult.unionid);
						that.$queue.setData('weixinOpenid', loginRes.authResult.openid);
						that.$Request
							.postJson('/appLogin/loginApp', {
								token: loginRes.authResult.access_token,
								unionid: loginRes.authResult.unionid,
								openid: loginRes.authResult.openid
							})
							.then(res => {
								console.log(JSON.stringify(res))
								if (res.status === 0) {
									that.$queue.setData("token", res.data.uuid);
									that.$queue.setData("userId", res.data.userId);
									that.getUserInfo(res.data.userId, res.data.uuid);
								} else {
									uni.hideLoading();
									uni.navigateTo({
										url: '../public/wxmobile'
									});
								}
							});


					}
				});
			},
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo() {
				let _this = this;
				if (this.showAgree == false) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请先同意《协议》'
					});
					return false;
				}
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						let nickName = infoRes.userInfo.nickName; //昵称
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						try {
							uni.setStorageSync('isCanUse', false); //记录是否第一次授权  false:表示不是第一次授权
							if (_this.$queue.getData("openid")) {
								_this.getWeixinInfo(nickName, avatarUrl);
							} else {
								_this.login(infoRes.encryptedData, infoRes.iv);
							}

						} catch (e) {}
					},
					fail(res) {}
				});
			}, //登录

			getWeixinInfo(nickName, avatarUrl) {
				uni.showLoading({
					title: '登录中...'
				});
				var invitation = '';
				let userByinvitationId = this.$queue.getData('userByinvitationId');
				if (userByinvitationId) {
					invitation = userByinvitationId;
				} else {
					invitation = this.$queue.getInvitation();
				}
				this.$Request.postJson("/user/mp/update", {
					invitation: invitation,
					unionid: this.$queue.getData("unionid"),
					imageUrl: avatarUrl,
					nickName: nickName,
					openid: this.$queue.getData("openid")
				}).then(res => {
					if (res.status === 0) {
						this.$queue.setData("token", res.data.uuid);
						this.$queue.setData("userId", res.data.userId);
						this.$queue.setData("mobile", _this.phoneData);
						this.getUserInfo(res.data.userId, res.data.uuid);
					} else {

						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg,
						});
					}
				});
			},
			login(encryptedData, iv) {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;
						let data = {
							code: code,
							encryptedData: encryptedData,
							iv: iv
						};
						_this.$Request.postJson("/wx/mp/login", data).then(res => {
							if (res.status === 0) {
								_this.$queue.setData("openid", res.data.open_id)
								_this.$queue.setData("unionid", res.data.unionid)
								uni.hideLoading()
								//非第一次授权获取用户信息
								uni.getUserInfo({
									provider: 'weixin',
									success: function(infoRes) { //获取用户信息后向调用信息更新方法
										let nickName = infoRes.userInfo.nickName; //昵称
										let avatarUrl = infoRes.userInfo.avatarUrl; //头像
										if (nickName) {
											_this.getWeixinInfo(nickName, avatarUrl);
										}
									}
								});
							}
						});
					},
				});
			},
			navBack() {
				uni.navigateBack();
			},
			isShowGet() {
				this.show = true;
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
							if (res.data === 'register') {
								this.show = true;
							}
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
				if (this.show) {
					if (this.invitation.length == 0) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '请输入邀请码'
						});
						return false;
					}
				}
				_this.isRotate = true;
				this.$Request.postJson("/user/bindOpenid", {
					pwd: _this.passData,
					phone: _this.phoneData,
					msg: _this.verCode,
					platform: _this.platform,
					invitation: _this.invitation,
					openid: this.$queue.getData("openid")
				}).then(res => {
					if (res.status === 0) {
						this.$queue.setData("token", res.data.uuid);
						this.$queue.setData("userId", res.data.userId);
						this.$queue.setData("mobile", _this.phoneData);
						this.getUserInfo(res.data.userId, res.data.uuid);
					} else {
						_this.isRotate = false;
						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '登录失败',
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
						let href = this.$queue.getData("href");
						if (href) {
							uni.navigateBack();
							this.$queue.remove("href");
						} else {
							uni.switchTab({
								url: '/pages/zysc/index/index'
							});
						}
					} else {
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg,
						});
						this.$queue.logout();
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

	page {
		background-color: #fff;
	}

	.headers {

		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.headers image {
		border-radius: 100upx;
		width: 200rpx;
		height: 200rpx;
	}


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

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		line-height: 80upx;
		border-radius: 80upx;
		margin: 70rpx 50rpx;
		height: 80upx;
		font-size: 35rpx;
	}
</style>
