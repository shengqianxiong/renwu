<template>
	<view class="container">
		<view v-if="relation_id&&isEnable != '否'" class="list-cell b-b" @click="navTo('/pages/member/zhifubao')" hover-class="cell-hover"
		 :hover-stay-time="50">
			<text class="cell-tit">提现账号设置</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" style="margin-top: 2upx" @click="navTo('/pages/public/bind')" hover-class="cell-hover"
		 :hover-stay-time="50">
			<text class="cell-tit">换绑手机号</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				isShow: false,
				version: '',
				isEnable: '否',
				relation_id: '',
			};
		},
		onShow() {
			let a = this.$queue.getData('isEnable');
			if (a) {
				this.isEnable = a;
			}
			let that = this;
			let token = this.$queue.getData("token");
			let relation_id = this.$queue.getData("relation_id");
			if (relation_id) {
				this.relation_id = relation_id;
			}
			if (token) {
				this.isShow = true;
			}

		},
		methods: {
			...mapMutations(['logout']),

			navTo(url) {
				let token = this.$queue.getData("token");
				if (token) {
					uni.navigateTo({
						url: url
					});
				} else {
					uni.navigateTo({
						url: '/pages/member/register'
					});
				}
			},
			//退出登录
			toLogout() {
				let that = this;
				uni.showModal({
					content: '确定要退出登录么',
					success: (e) => {
						if (e.confirm) {
							that.$queue.remove("token");
							that.$queue.remove("userId");
							that.$queue.remove("mobile");
							that.$queue.remove("openid");
							that.$queue.remove("nickName");
							that.$queue.remove("image_url");
							that.$queue.remove("relation_id");
							that.$queue.remove("isInvitation");
							that.isShow = false;
							setTimeout(() => {
								uni.navigateBack();
							}, 200)
						}
					}
				});
			},
			//switch
			switchChange(e) {
				let statusTip = e.detail.value ? '打开' : '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},
			update() {
				//#ifdef APP-PLUS
				// APP检测更新 具体可以参考：https://ask.dcloud.net.cn/article/35667
				plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
					this.$Request.get("/update.json").then(res => {
						console.error(res.wgtUrl);
						console.error(res.version);
						console.error(widgetInfo.version);
						if (res.wgtUrl && widgetInfo.version < res.version) {
							uni.downloadFile({
								url: res.wgtUrl,
								success: (downloadResult) => {
									if (downloadResult.statusCode === 200) {
										plus.runtime.install(downloadResult.tempFilePath, {
											force: false
										}, (d) => {
											console.log('install success...');
											plus.runtime.restart();
										}, (e) => {
											console.error('install fail...');
										})
									}
								}
							})
						}
					})
				});
				//#endif
			}

		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;

		&.log-out-btn {
			margin-top: 40upx;

			.cell-tit {
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 32upx;
		}

		&.m-t {
			margin-top: 18upx;
		}

		.cell-more {
			align-self: baseline;
			font-size: $font-lg;
			color: $font-color-light;
			margin-left: 12upx;
		}

		.cell-tit {
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 12upx;
		}

		switch {
			transform: translateX(8px) scale(.84);
		}
	}
</style>
