<template>
	<view>
		<view style="width: 710upx;height: 180upx;background: #FFFFFF;margin: 30upx 20upx 30upx 23upx; padding: 20upx;border-radius: 15upx;">
			<view style="display: flex;margin: 15upx 0 0 20upx;">
				<image :src="image" style="width: 20%; height: 120upx;"></image>
				<view style="margin-left: 20upx;width: 70%;">
					<view style="font-size: 28upx;color: #FF332F;font-weight: bold;margin-top: 10upx;">¥ {{money}}</view>
					<view style="width: 100%;margin-top: 20upx;font-size: 28upx;color: #333333;font-weight: bold;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{title}}</view>
				</view>
			</view>
		</view>

		<view style="width: 710upx;background: #FFFFFF;margin: 30upx 20upx; border-radius: 15upx;" v-if="payList.length > 0">
			<view style="display: flex;margin: 0upx 0 0 30upx;align-items: center;" v-for="(item,index) in payList" :key='index'>
				<view style="display: flex;width: 100%;padding: 20upx;height: 90rpx;" v-if="item.name != '钱包零钱'">
					<image :src="item.image" style="width: 50upx;height: 50upx;border-radius: 50upx;"></image>
					<view style="font-size: 28upx;color: #333333;margin-left: 20upx;width: 70%;">{{item.name}}</view>
					<radio-group name="openWay" style="margin-left: 40upx;" @tap='selectWay(item.id)'>
						<label class="tui-radio">
							<radio color="#FF332F" :checked="openWay === item.id ? true : false" />
						</label>
					</radio-group>
				</view>
				<view style="display: flex;width: 100%;padding: 20upx;height: 90rpx;" v-if="lingqian != 0 && item.name == '钱包零钱'">
					<image :src="item.image" style="width: 50upx;height: 50upx;border-radius: 50upx;"></image>
					<view style="font-size: 28upx;color: #333333;margin-left: 20upx;width: 70%;">{{item.name}}({{lingqian}})</view>
					<radio-group name="openWay" style="margin-left: 40upx;" @tap='selectWay(item.id)'>
						<label class="tui-radio">
							<radio color="#FF332F" :checked="openWay === item.id ? true : false" />
						</label>
					</radio-group>
				</view>
			</view>
		</view>
·
		<button v-if="payList.length > 0" style="background-color: #FF332F;width: 700upx;height: 80upx;font-size: 28upx;color: #FFFFFF;text-align: center;margin: 70upx 20upx;border-radius: 50upx;padding-top: 5upx;"
		 @tap='goPay'>确定支付</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				openWay: 0,
				money: 0,
				payMoney: 0,
				lingqian: 0.00,
				title: '',
				image: '',
				id: '',
				payNum: '',
				providerList: [],
				lingqianImage: 'https://api.shengqianxiong.com.cn/app-image/lingqian.png',
				payList: []
			}
		},
		onBackPress(event) {
			console.log(this.id);
			if (event.from == 'backbutton') {
				uni.showModal({
					title: '温馨提示',
					content: '订单尚未完成支付,确认退出吗?',
					showCancel: true,
					cancelText: '继续支付',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							uni.redirectTo({
								url: '../member/orderdetail?id=' + this.id
							});
						}
					}
				});
				return true; //阻止默认返回行为
			}
		},
		onLoad(d) {
			this.getlingqian();
			// #ifdef H5
			let target = navigator.userAgent.toLowerCase();
			let isWeixin = (/micromessenger/.test(target)) ? true : false;
			this.payList = [];
			if (isWeixin) {
				this.openWay = 0;
				let data = [{
					id: 0,
					image: '../../../static/share/icon_weixin.png',
					name: '微信'
				}, {
					id: 2,
					image: this.lingqianImage,
					name: '钱包零钱'
				}]
				this.payList = data;
			} else {
				this.openWay = 2;
				let data = [{
					id: 2,
					image: this.lingqianImage,
					name: '钱包零钱'
				}]
				this.payList = data;
			}
			// #endif
			// #ifndef H5
			this.openWay = 0;
			let data = [{
				id: 0,
				image: '../../../static/share/icon_weixin.png',
				name: '微信'
			}, {
				id: 2,
				image: this.lingqianImage,
				name: '钱包零钱'
			}]
			this.payList = data;
			// #endif
			if (d) {
				this.id = d.id;
				this.getCheckPay(d.id);
				this.getCommondityList(d.id);
			}
			uni.getProvider({
				service: 'payment',
				success: e => {
					let providerList = [];
					e.provider.map(value => {
						switch (value) {
							case 'wxpay':
								providerList.push({
									name: '微信',
									id: value,
									loading: false
								});
								break;
							default:
								break;
						}
					});
					this.providerList = providerList;
				},
				fail: e => {
					console.log('获取支付通道失败：', e);
				}
			});
		},
		methods: {
			getlingqian() {
				let userId = this.$queue.getData('userId');
				this.$Request.getT("/cash/money/" + userId).then(res => {
					if (res.status === 0 && res.data) {
						this.lingqian = parseFloat(res.data).toFixed(2);
					} else if (res.status === -102) {
						this.$queue.showToast(res.msg);
						this.$queue.logout();
						uni.navigateTo({
							url: '/pages/member/register'
						});
					} else {
						this.lingqian = '0.00';
					}
				});
			},
			getCheckPay(id) {
				this.$Request.getT('/orders/wxPay?ordersId=' + id).then(res => {
					if (res.status === 0) {
						uni.redirectTo({
							url: './myList'
						});
					}
				});
			},
			getCommondityList(id) {
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request.getT('/orders/find?id=' + id).then(res => {
					if (res.status === 0) {
						this.image = res.data.img;
						this.money = res.data.payMoney;
						this.title = res.data.title;
						this.payNum = res.data.payNum;
						this.payMoney = res.data.payMoney;
					}
					uni.hideLoading();
				});
			},
			selectWay: function(id) {
				this.openWay = id;
			},
			goPay() {
				let userId = this.$queue.getData('userId');
				uni.showLoading({
					title: '支付中'
				});
				if (this.openWay === 0) {		//微信支付
					let that = this;
					// #ifdef MP-WEIXIN
					this.$Request.postJson('/pay/wxPay?payNum=' + this.payNum + '&userId=' + userId + '&payMoney=' + this.payMoney).then(
						res => {
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: res.timeStamp,
								nonceStr: res.nonceStr,
								package: res.package,
								signType: res.signType,
								paySign: res.paySign,
								success: function(res) {
									uni.showLoading({
										title: '支付成功'
									});
									uni.hideLoading();
									setTimeout(() => {
										uni.redirectTo({
											url: '../my/myList'
										});
									}, 1000);
								},
								fail: function(err) {
									uni.hideLoading();
									that.$queue.showToast('支付失败');
								}
							});
						});
					// #endif


					// #ifdef H5
					this.$Request.postJson('/pay/wxPayWeb?payNum=' + this.payNum + '&userId=' + userId + '&payMoney=' + this.payMoney)
						.then(
							res => {
								that.callPay(res);
							});
					// #endif
					// #ifdef APP-PLUS
					this.$Request.postJson('/pay/wxPayApp?payNum=' + this.payNum + '&userId=' + userId + '&payMoney=' + this.payMoney).then(
							res => {
								console.log(JSON.stringify(res))
						this.setPayment('wxpay', JSON.stringify(res));
					});
					// #endif
				} else if (this.openWay === 1) {		//支付宝支付
					// #ifdef H5
					this.$Request.getT('/aliPay/payH5?ordersId=' + this.id).then(res => {
						const div = document.createElement('div')
						div.innerHTML = res.data //此处form就是后台返回接收到的数据
						document.body.appendChild(div)
						document.forms[0].submit()
					});
					// #endif
					// #ifdef APP-PLUS
					this.$Request.getT('/aliPay/payApp?ordersId=' + this.id).then(res => {
						this.setPayment('alipay', res.data);
					});
					// #endif
				} else if (this.openWay === 2) {		//零钱支付
					if (this.lingqian > 0) {
						this.$Request.getT('/orders/changePay?ordersId=' + this.id).then(res => {
							if (res.status === 0) {
								uni.hideLoading();
								this.$queue.showToast('支付成功');
								setTimeout(function() {
									uni.hideLoading();
									uni.redirectTo({
										url: './myList'
									});
								}, 1000);
							} else {
								uni.hideLoading();
								this.$queue.showToast(res.msg);
							}
						});
					} else {
						this.$queue.showToast('零钱余额为空，请前往微信打开进行支付');
					}
				}
			},
			callPay: function(response) {
				if (typeof WeixinJSBridge === "undefined") {
					if (document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(response), false);
					} else if (document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(response));
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(response));
					}
				} else {
					this.onBridgeReady(response);
				}
			},
			onBridgeReady: function(response) {
				let that = this;
				if (!response.package) {
					return;
				}
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": response.appid, //公众号名称，由商户传入
						"timeStamp": response.timestamp, //时间戳，自1970年以来的秒数
						"nonceStr": response.noncestr, //随机串
						"package": response.package,
						"signType": response.signType, //微信签名方式：
						"paySign": response.sign //微信签名
					},
					function(res) {
						if (res.err_msg === "get_brand_wcpay_request:ok") {
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							uni.showLoading({
								title: '支付成功'
							});
							setTimeout(function() {
								uni.hideLoading();
								uni.redirectTo({
									url: './myList'
								});
							}, 1000);
						} else {
							uni.hideLoading();
						}
						WeixinJSBridge.log(response.err_msg);
					}
				);
			},
			setPayment(name, order) {
				let that = this;
				uni.requestPayment({
					provider: name,
					orderInfo: order, //微信、支付宝订单数据
					success: function(res) {
						uni.hideLoading();
						uni.showLoading({
							title: '支付成功'
						});
						setTimeout(function() {
							uni.hideLoading();
							uni.redirectTo({
								url: '../member/orderdetail?id=' + that.id
							});
						}, 1000);
					},
					fail: function(err) {
						uni.hideLoading();
						console.log(12)
					}
				});
			}
		}
	}
</script>

<style scoped>
	page {
		background: #F2F2F2;
	}
</style>
