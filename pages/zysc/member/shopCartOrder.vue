<template>
	<view>
		<view style="width: 696upx;height: 130upx;background: #FFFFFF;margin: 30upx; padding: 10upx;border-radius: 20upx;"
		 @tap='goEditAddress'>
			<view style="display: flex;margin: 10upx 0 0 20upx;">
				<image src="https://api.shengqianxiong.com.cn/img/20201118/276b48a6ab854b64bcfbd5377b5f5901.png" style="width: 70upx; height: 70upx;margin-top: 10upx;"></image>
				<view style="margin-left: 20upx;width: 80%;" v-if="checkAddress">
					<view style="display: flex;">
						<view style="font-size: 32upx;color: #333333;width: 60%;">{{consignee}}</view>
						<view style="font-size: 28upx;color: #999999;margin-left: 10upx;">{{mobile}}</view>
					</view>
					<view v-if="consignee" style="margin-top: 10upx;font-size: 30upx;color: #333333;width: 90%; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{provinces}}{{detail}}</view>
				</view>
				<view v-if="checkAddress == false" style="margin-left: 20upx;width: 80%;margin-top: 25upx;">暂无地址信息，请添加地址信息</view>
				<image src="https://api.shengqianxiong.com.cn/img/20201112/e0eb6f49777b4b3293d402cb2f991eb5.png" style="width: 17upx;height: 28upx;margin-top: 35upx;"></image>
			</view>
		</view>
		<view style="margin-bottom: 180upx;">
			<view v-for="(item,index) in shopCartOrderList" :key='index' style="width: 696upx;height: max-content;background: #FFFFFF;margin: 30upx; padding: 10upx;border-radius: 20upx;"
			 v-if="shopCartOrderList.length > 0">
				<view style="display: flex;padding: 20upx;">
					<image :src="item.goods.coverImg" style="width: 200upx; height: 200upx;"></image>
					<view style="width: 65%;margin-left: 20upx;">
						<view style="font-size: 28upx;color: #333333;height: 78upx;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">{{item.goods.title}}</view>
						<view style="display: flex;width: 70%;" v-if="item.sku && item.sku.detailJson">
							<view style="font-size: 24upx;color: #333333;margin-top: 25rpx;">商品规格:</view>
							<view style="font-size: 24upx;color: #333333;margin-top: 25rpx;margin-left: 15rpx;">{{item.sku.detailJson}}</view>
						</view>
						<view :style="item.sku ? 'display: flex;width: 70%;margin-top: 30rpx;' : 'display: flex;width: 70%;margin-top: 30rpx;'">
							<view style="font-size: 30upx;color: #333333;margin-top: 25upx;">¥ {{item.goods.price}}</view>
							<view style="font-size: 20upx;color: #666666;margin-top: 30upx;margin-left: 15upx;">x{{item.number}}</view>
						</view>
					</view>
				</view>
				<view style="display: flex;padding: 20upx;">
					<view style="font-size: 30upx;color: #333333;width: 25%;">快递</view>
					<view style="font-size: 30upx;color: #000000;margin-left: 10upx;width: 40%;">{{item.goods.postagePrice == 0 ? '包邮' : item.goods.postagePrice + '元'}}</view>
				</view>
				<view style="display: flex;padding: 20upx;" @tap='getCouponIssueList(item.goodsId,index)'>
					<view style="font-size: 30upx;color: #333333;width: 25%;">优惠券</view>
					<view style="font-size: 30upx;color: #FF3737;margin-left: 10upx;width: 40%;">{{item.goods.brand}}</view>
				</view>
				<view style="display: flex;padding: 30upx 20upx;">
					<view style="font-size: 30upx;color: #333333;width: 25%;">订单备注</view>
					<input type="text" style="width: 70%;font-size: 30upx;color: #999999;margin-left: 10upx;" @input="onInput" v-model="item.goods.type"
					 placeholder="选填" />
				</view>
			</view>
		</view>
		<view style="display: flex;background-color: #FFFFFF;width: 100%;height: 100upx;position: fixed;bottom: 0upx;">
			<view style="display: flex;font-size: 28upx;color: #333333;padding: 25upx 0 10upx 20upx;width: 65%;">
				<view style="font-size: 24upx;color: #666666;padding: 7upx 0 10upx 10upx;">共{{shopCartOrderList.length}}件</view>
				<view style="font-size: 28upx;color: #333333;padding: 5upx 0 10upx 20upx;">合计：</view>
				<view style="font-size: 40upx;color: #FF3737;padding: 0upx 0 10upx 10upx;">¥{{MaxMoney | formatPrice}}</view>
			</view>
			<button style="background-color: #FF332F;width: 200upx;height: 70upx;font-size: 28upx;color: #FFFFFF;text-align: center;margin-top: 10upx;border-radius: 50upx;"
			 @tap='openPopus'>提交订单</button>
		</view>
		<uni-popup ref="popusLingJuan" type="bottom">
			<view style="width: 100%;height: 1000rpx;background: #FFFFFF;border-top-left-radius: 20upx;border-top-right-radius: 20upx;padding: 40upx;">
				<view style="width: 100%;text-align: center;font-size: 32rpx;color: #DD514C;">优惠明细</view>
				<scroll-view scroll-y="true" style="height: 900rpx;">
					<view style="width: 100%;text-align: center;" v-for='(item,index) in CouponIssueList' :key='index'>
						<view style="background: #fcf3e8;width: 100%;height: 130rpx;border-radius: 10rpx;margin-top: 20rpx;">
							<view style="display: flex;color: #e23922;">
								<view style="line-height: 130rpx;margin-left: 0rpx;font-size: 40rpx;color: #e23922;font-weight: 600;width: 150rpx;"><text
									 style="font-size: 20upx;">￥</text>{{item.lessMoney}}</view>
								<view style="margin-left: 20rpx;">
									<view style="margin-top: 25rpx;text-align: left;">满{{item.minMoney}}减{{item.lessMoney}}</view>
									<view style="margin-top: 10rpx;font-size: 26rpx;">截止：{{item.failureTime}}</view>
								</view>
								<view style="height: 105rpx;width: 2rpx;background: #e23922;margin-left: 20rpx;margin-top: 15rpx;"></view>
								<view style="color: #e23922;line-height: 130rpx;height: 130rpx;width: 145rpx;font-weight: 600;" @tap='lingJuan(item)'>立即使用</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="popus" type="bottom">
			<view style="background: #FFFFFF;height: max-content; padding: 20upx;" v-if="payList.length > 0">
				<view style="display: flex;height: 100upx;margin: 0upx 0 0 30upx;align-items: center;padding-bottom: 20upx;" v-for="(item,index) in payList"
				 :key='index'>
					<image :src="item.image" style="width: 50upx;height: 50upx;border-radius: 50upx;"></image>
					<view style="font-size: 28upx;color: #333333;margin-left: 20upx;width: 70%;" v-if="item.name == '钱包零钱'">{{item.name}}({{lingqian}})</view>
					<view style="font-size: 28upx;color: #333333;margin-left: 20upx;width: 70%;" v-else>{{item.name}}</view>
					<radio-group name="openWay" style="margin-left: 40upx;" @tap='selectWay(item.id)'>
						<label class="tui-radio">
							<radio color="#FF332F" :checked="openWay === item.id ? true : false" />
						</label>
					</radio-group>
				</view>
				<button v-if="payList.length > 0" style="background-color: #FF332F;width: 680upx;height: 80upx;font-size: 28upx;color: #FFFFFF;text-align: center;margin: 30upx;border-radius: 50upx;padding-top: 5upx;"
				 @tap='goPay'>确定支付</button>
			</view>


		</uni-popup>

	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		comments: {
			uniPopup
		},
		data() {
			return {
				descrition: '',
				number: 1,
				money: 0,
				consignee: ' ',
				provinces: '',
				commissionPrice: 0,
				sales: '',
				id: 0,
				price: 0,
				postagePrice: '',
				MaxMoney: 0,
				title: '',
				attrValuecoverImg: '',
				checkString: '',
				shopCartOrderList: [],
				CouponIssueList: [],
				JuanIndex: 0,
				ids: '',
				detail: '',
				skuId: 0,
				mobile: '',
				list: {},
				editAddress: {},
				checkAddress: false,
				providerList: [],
				openWay: 0,
				JianMoney: 0,
				youfei: 0,
				lingqian: 0.00,
				lingqianImage: 'https://api.shengqianxiong.com.cn/app-image/lingqian.png',
				payList: []
			}
		},
		filters: {
			formatPrice(data) {
				if (typeof(data) === "number") {
					return parseFloat(data).toFixed(2);
				}
				return 0.00;
			}
		},
		onShow() {
			this.editAddress = this.$queue.getData('EditAddress');
			if (this.editAddress) {
				this.checkAddress = true;
				this.detail = this.editAddress.detail;
				this.consignee = this.editAddress.consignee;
				this.mobile = this.editAddress.mobile;
				this.provinces = this.editAddress.provinces;
			} else {
				this.getAddressList();
			}
		},
		onLoad(d) {
			this.shopCartOrderList = this.$queue.getData('shopCartOrderList');
			this.youfei = d.youfei;
			this.MaxMoney = parseFloat(d.money) + parseFloat(d.youfei);
			this.JianMoney = parseFloat(d.money) + parseFloat(d.youfei);
			this.ids = d.ids;
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
			lingJuan(item) {
				var minMoney = item.minMoney;
				var myMoney = this.shopCartOrderList[this.JuanIndex].goods.buyReason; //这个是获取每个商品的价格总的，不含邮费
				if (myMoney >= minMoney) {
					if (this.shopCartOrderList[this.JuanIndex].goods.brand != '请选择优惠券信息') {
						let youMoney = parseInt(this.shopCartOrderList[this.JuanIndex].goods.descrition);
						let money = this.numFilter(parseFloat(this.MaxMoney) + youMoney);
						this.MaxMoney = this.numFilter(money - item.lessMoney);
						this.shopCartOrderList[this.JuanIndex].goods.descrition = item.lessMoney;
					} else {
						this.shopCartOrderList[this.JuanIndex].goods.descrition = item.lessMoney;
						this.MaxMoney = this.numFilter(parseFloat(this.MaxMoney) - item.lessMoney);
					}
					this.MaxMoney = parseFloat(this.MaxMoney)
					this.shopCartOrderList[this.JuanIndex].goods.brand = '-￥' + item.lessMoney;
					this.shopCartOrderList[this.JuanIndex].goods.brandId = item.couponUserId;
					this.shopCartOrderList[this.JuanIndex].goods.memberPrice = this.numFilter(myMoney - item.lessMoney);
					this.$refs.popusLingJuan.close();
				} else {
					this.$queue.showToast('您不满足使用此劵的资格');
				}
			},
			numFilter(value) {
				// 截取当前数据到小数点后三位
				let tempVal = parseFloat(value).toFixed(2)
				let realVal = tempVal.substring(0, tempVal.length - 1)
				return realVal
			},
			getCouponIssueList(goodsId, index) {
				let userId = this.$queue.getData('userId');
				this.CouponIssueList = [];
				this.$Request.getT('/selfCouponUser/useList?goodsId=' + goodsId + '&userId=' + userId).then(res => {
					if (res.status === 0) {
						res.data.forEach(d => {
							for (var i = 0; i < this.shopCartOrderList.length; i++) {
								if (this.shopCartOrderList[this.JuanIndex].goods.brandId != d.couponUserId) {
									this.CouponIssueList.push(d);
									return;
								}
							}
						});
						if (this.CouponIssueList.length > 0) {
							this.JuanIndex = index;
							this.$refs.popusLingJuan.open();
						} else {
							this.$queue.showToast('你没有可使用的优惠券！');
						}
					}
				});
			},
			goPayment(ids, payNum) {
				let userId = this.$queue.getData('userId');
				this.$queue.remove('shopCartOrderList');
				uni.showLoading({
					title: '支付中'
				});
				if (this.openWay === 0) {
					let that = this;
					// #ifdef MP-WEIXIN
					this.$Request.postJson('/pay/wxPay?payNum=' + payNum + '&userId=' + userId + '&payMoney=' + this.MaxMoney).then(
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
									that.goDelete(that.ids);
								},
								fail: function(err) {
									uni.hideLoading();
									this.$queue.showToast('支付失败');
								}
							});
						});
					// #endif
					// #ifdef H5
					this.$Request.postJson('/pay/wxPayWeb?payNum=' + payNum + '&userId=' + userId + '&payMoney=' + this.MaxMoney).then(
						res => {
							that.callPay(res);
						});
					// #endif
					// #ifdef APP-PLUS
					this.$Request.postJson('/pay/wxPayApp?payNum=' + payNum + '&userId=' + userId + '&payMoney=' + this.MaxMoney).then(
						res => {
							console.log(JSON.stringify(res))
							that.setPayment('wxpay', JSON.stringify(res));
						});
					// #endif
				} else if (this.openWay === 2) {
					this.$Request.getT('/orders/changePay?ordersId=' + ids).then(res => {
						if (res.status === 0) {
							uni.hideLoading();
							this.$queue.showToast('支付成功');
							this.goDelete(this.ids);
						} else {
							uni.hideLoading();
							this.$queue.showToast(res.msg);
						}
					});
				}
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
						setTimeout(() => {
							uni.hideLoading();
							uni.redirectTo({
								url: '../my/myList'
							});
						}, 1000);
					},
					fail: function(err) {
						uni.hideLoading();
						console.log(12)
					}
				});
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
									url: '../my/myList'
								});
							}, 1000);
						} else {
							uni.hideLoading();
						}
						WeixinJSBridge.log(response.err_msg);
					}
				);
			},
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
			openPopus() {
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				if (token) {
					this.$refs.popus.open();
				} else {
					this.loginS();
				}
			},
			loginS() {
				this.$queue.setData('href', '/pages/zysc/member/shopCart');
				uni.navigateTo({
					url: '/pages/member/register'
				});
			},
			hindPopus() {
				this.$refs.popus.close();
			},
			onInput(d) {
				console.log(d);
			},
			getAddressList() {
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/address/findDefaultByUserId?userId=' + userId).then(res => {
					if (res.status === 0) {
						if (res.data) {
							this.checkAddress = true;
							this.detail = res.data.detail;
							this.consignee = res.data.consignee;
							this.mobile = res.data.mobile;
							this.provinces = res.data.provinces;
						} else {
							this.checkAddress = false;
						}
					} else {
						this.checkAddress = false;
					}
				});
			},
			goPay() {
				if (!this.checkAddress) {
					this.$queue.showToast('请设置收货地址信息');
					return;
				}

				if (this.openWay === 2 && this.lingqian < this.MaxMoney) {
					this.$queue.showToast('零钱余额不足，请更换支付方式！');
					return;
				}

				let userId = this.$queue.getData('userId');
				let datas = [];
				for (var i = 0; i < this.shopCartOrderList.length; i++) {
					let data = {
						userId: userId,
						status: '1',
						orderType: '1',
						consignee: this.consignee,
						mobile: this.mobile,
						provinces: this.provinces,
						detail: this.detail,
						//上面的都是地址信息
						couponMoney: this.shopCartOrderList[i].goods.descrition, //这个是优惠券金额，替换了descrition的值描述
						userCouponsId: this.shopCartOrderList[i].goods.brandId, //这个是优惠券id，替换了brandID的值（品牌ID）
						type: this.shopCartOrderList[i].goods.typeId,
						title: this.shopCartOrderList[i].goods.title,
						goodsId: this.shopCartOrderList[i].goodsId,
						img: this.shopCartOrderList[i].goods.coverImg,
						isExpress: '1',
						descrition: this.shopCartOrderList[i].goods.type, //备注信息，稍后需要另改
						skuId: this.shopCartOrderList[i].skuId,
						price: this.shopCartOrderList[i].goods.price,
						number: this.shopCartOrderList[i].number,
						postagePrice: this.shopCartOrderList[i].goods.postagePrice,
						payMoney: this.shopCartOrderList[i].goods.memberPrice + this.shopCartOrderList[i].goods.postagePrice,
						relationId: '',
						detailJson: this.shopCartOrderList[i].sku ? this.shopCartOrderList[i].sku.detailJson : '',
						commissionPrice: this.shopCartOrderList[i].goods.memberPrice * this.shopCartOrderList[i].goods.commissionPrice
					}
					datas.push(data);
				}
				this.$Request.postJson('/orders/saveAll', datas).then(res => {
					if (res.status === 0) {
						var orderIds = '';
						for (var i = 0; i < res.data.length; i++) {
							if (orderIds == '') {
								orderIds = res.data[i].id;
							} else {
								orderIds = orderIds + ',' + res.data[i].id;
							}
						}
						this.goDelete(this.ids);
						this.goPayment(orderIds, res.data[0].payNum);
					} else if (res.status === -1) {
						this.$queue.showToast(res.msg)
					}
				});
			},
			goDelete(ids) {
				this.$Request.getT('/selfCart/deleteAll?ids=' + ids).then(res => {
					if (res.status === 0) {
						setTimeout(() => {
							uni.redirectTo({
								url: '../my/myList'
							});
						}, 1000);
					}
				});
			},
			goEditAddress() {
				uni.navigateTo({
					url: '../my/myaddress'
				});
			},
			selectWay: function(id) {
				this.openWay = id;
			}
		}
	}
</script>

<style scoped>
	page {
		background: #F2F2F2;
	}

	.topic_cont_text {
		padding: 30upx;
		colof: #999;
		background: #E1FFFF;
		max-height: 130upx;
		overflow: hidden;
		word-break: break-all;
		/* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;
		/* 超出部分省略号 */
		display: -webkit-box;
		/** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical;
		/** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 2;
		/** 显示的行数 **/
	}
</style>
