<template>
	<view style="background: #F7F7F7;">
		<view style="height: 140upx;background: #FFFFFF;margin-top: 30upx; padding: 10upx;border-radius: 15upx;width: 95%;margin-left: 20upx;">
			<view style="display: flex;margin: 15upx 0 0 20upx;">
				<image src="https://api.shengqianxiong.com.cn/img/20201118/276b48a6ab854b64bcfbd5377b5f5901.png" style="width: 70upx; height: 70upx;margin-top: 10upx;"></image>
				<view style="margin-left: 20upx;width: 80%;">
					<view style="display: flex;">
						<view style="font-size: 32upx;color: #333333;width: 70%;">{{list.consignee}}</view>
						<view style="font-size: 28upx;color: #999999;margin-left: 10upx;">{{list.mobile}}</view>
					</view>
					<view style="margin-top: 10upx;font-size: 26upx;color: #333333;width: 90%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{list.provinces}}{{list.detail}}</view>
				</view>
			</view>
		</view>

		<view style="height: 320upx;background: #FFFFFF;margin-top: 30upx; padding: 10upx;border-radius: 15upx;width: 95%;margin-left: 20upx;">
			<view style="display: flex;">
				<view style="padding: 20upx 0 0upx 30upx;width: 75%;text-align: left;color: #000;font-size: 28upx;">{{list.createAt}}</view>
				<view style="padding: 20upx 0 0upx 0upx;width: 20%;text-align: right;color: #FF332F;font-size: 28upx;">{{list.status}}</view>
			</view>
			<view style="display: flex;padding: 20upx 10upx;" @tap='goOrderDetail(list)'>
				<image :src="list.img" style="width: 30%;height: 190upx;margin-left: 20upx;"></image>
				<view style="margin-left: 20upx;width: 68%;">
					<view style="font-size: 30upx;color: #333333;width: 95%;height: 80upx;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">{{list.title}}</view>
					<view style="display: flex;width: 90%;margin-top: 20upx;" v-if="list.detailJson">
						<view style="font-size: 24upx;color: #333333;">商品规格：</view>
						<view style="font-size: 24upx;color: #666666;padding-left: 10upx;">{{list.detailJson}}</view>
					</view>
					<view :style="list.detailJson ? 'display: flex;height: 50upx;margin-top: 20rpx;': 'display: flex;height: 50upx;margin-top: 70rpx;'">
						<view style="display: flex;width: 43%;">
							<view style="font-size: 30upx;color: #333333;">¥ {{list.price}}</view>
							<view style="font-size: 24upx;color: #666666;padding-top: 7upx;padding-left: 10upx;">×{{list.number}}</view>
						</view>
						<view style="font-size: 26upx;color: #333333;padding: 0 0 10upx 0upx;width: 50%;text-align: right;">实付款: ¥{{list.payMoney}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 淘口令分享 -->
		<simpleModal ref="simpleModalTkl" @maskClose="TklmaskClose">
			<view class="buy-box-title">兑换码</view>
			<view class="buy-box-center" style="width: 700rpx;">
				<view class="code-cent">
					<div class="cente-text">
						<div>
							<view class="textarea">
								【商品】{{ duihuanList.title }}
								<br />
								【链接】{{ duihuanList.linkUrl }}
								<br />
								【兑换码】{{ duihuanList.content }}
							</view>
						</div>
					</div>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="buy-btn-copy"  v-bind:class="[copyTklStatus ? 'active' : '', '']" @tap="copyTklWenAns">{{ copyTklStatus ? '已复制到剪切板' : '一键复制' }}</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view style="display: flex;width: 100%;">
					<view class="buy-btn-copy" style="width: 40%;" @tap="goWeb">一键打开</view>
					<view class="buy-btn-copy" style="width: 40%;" v-bind:class="[copyTklStatus ? 'active' : '', '']" @tap="copyTklWenAns">{{ copyTklStatus ? '已复制到剪切板' : '一键复制' }}</view>
				</view>
				<!-- #endif -->
			</view>
		</simpleModal>

		<view style="height: max-content;background: #FFFFFF;margin-top: 30upx; padding: 10upx;border-radius: 15upx;width: 95%;margin-left: 20upx;margin-bottom: 150upx;">
			<view style="display: flex;padding: 20upx;" v-if='list.couponMoney && list.couponMoney != 0'>
				<view style="font-size: 26upx;color: #333333;width: 25%;">优惠券</view>
				<view style="font-size: 26upx;color: #333333;margin-left: 10upx;width: 70%;">{{'-￥' + list.couponMoney}}</view>
			</view>
			<view style="display: flex;padding: 20upx;">
				<view style="font-size: 26upx;color: #333333;width: 25%;">运费</view>
				<view style="font-size: 26upx;color: #333333;margin-left: 10upx;width: 70%;">{{list.postagePrice == 0 ? '包邮' : list.postagePrice + '元'}}</view>
			</view>
			<view style="display: flex;padding: 20upx;">
				<view style="font-size: 26upx;color: #333333;width: 25%;">订单编号</view>
				<view style="font-size: 26upx;color: #333333;margin-left: 10upx;width: 70%;">{{list.orderNum}}</view>
			</view>
			<view style="display: flex;padding: 20upx;">
				<view style="font-size: 26upx;color: #333333;width: 25%;">下单时间</view>
				<view style="font-size: 26upx;color: #333333;margin-left: 10upx;width: 70%;">{{list.createAt}}</view>
			</view>
			<view style="display: flex;padding: 20upx;" v-if="state != 5 && list.descrition">
				<view style="font-size: 26upx;color: #333333;width: 25%;">订单备注</view>
				<view style="width: 70%;font-size: 26upx;color: #333333;margin-left: 10upx;">{{list.descrition}}</view>
			</view>
			<view style="display: flex;padding: 20upx;" v-if="state != 5">
				<view v-if="state < 2" style="font-size: 26upx;color: #333333;width: 25%;">支付状态</view>
				<view v-if="state >= 2" style="font-size: 26upx;color: #333333;width: 25%;">支付方式</view>
				<view style="width: 70%;font-size: 26upx;color: #333333;margin-left: 10upx;">{{payWay}}</view>
			</view>
			<view style="display: flex;padding: 20upx;" @click="getDuihuanma(list.virtualId)" v-if="list.virtualId && state < 5">
				<view style="font-size: 26upx;color: #333333;width: 25%;">兑换码</view>
				<view style="font-size: 26upx;color: #FC0B17;margin-left: 10upx;width: 70%;">点击查看详情</view>
			</view>
			<view style="display: flex;padding: 20upx;" v-if="refundCheck">
				<view style="font-size: 26upx;color: #333333;width: 25%;">退款原因</view>
				<input type="text" style="width: 70%;font-size: 26upx;color: #333333;margin-left: 10upx;" v-model="refund"
				 :placeholder="state === 6 || state === 7 ? refund : '请输入退款原因'" :disabled="state === 6 || state === 7 ? true : false" />
			</view>
			<view style="display: flex;padding: 20upx;" v-if="state === 8">
				<view style="font-size: 26upx;color: #333333;width: 25%;">拒绝退款原因</view>
				<input type="text" style="width: 70%;font-size: 26upx;color: #333333;margin-left: 10upx;" v-model="refusedRefund"
				 disabled="true" />
			</view>
			<view style="padding: 20upx;" v-if="expList.length > 0">
				<view style="display: flex;">
					<view style="font-size: 26upx;color: #333333;width: 25%;">快递公司</view>
					<view style="width: 70%;">
						<view style="width: 70%;font-size: 26upx;color: #333333;margin-left: 10upx;">{{expName}}</view>
						<view v-for="(item,index) in expList" :key='index'>
							<view style="margin-top: 20upx;width: 100%;font-size: 26upx;color: #333333;margin-left: 10upx;">{{item.status}}</view>
							<view style="height: 1upx;width: 100%;background: #999999;"></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view style="text-align: center;position: fixed;bottom: 0upx;background-color: #FFFFFF;width: 100%;height: 100upx;justify-content: center;overflow: hidden;"
		 v-if="state < 4">
			<view style="display: flex;text-align: center;width: max-content;float: right;">
				<view v-if="state === 3" style="color: #e10a07;border: 3rpx solid #e10a07;" class='view_button' @tap='goconfirm(list)'>确认收货</view>
				<view v-if="state === 3 && isExpress != 2" class='view_button' @tap='getWuLiu(list)'>查看物流</view>
				<view v-if="state === 2 && isExpress != 2" class='view_button' @tap='goRemind(list)'>提醒发货</view>
				<view v-if="state === 2 && isRefund != 2" class='view_button' @tap='gorefund(list)'>退款</view>
				<view v-if="state === 1" class='view_button' @tap='gocancle(list)'>取消订单</view>
				<view v-if="state === 1" style="color: #e10a07;border: 3rpx solid #e10a07;" class='view_button' @tap='goPay(list)'>去支付</view>
			</view>
		</view>
	</view>
</template>

<script>
	import simpleModal from '../../../components/simple-pro/customModal.vue';
	export default {
		components: {
			simpleModal
		},
		data() {
			return {
				state: 0,
				isRefund: 0,
				payWay: '',
				id: 0,
				refusedRefund: '',
				expName: '',
				refund: '',
				isExpress: 0,
				refundCheck: false,
				copyTklStatus: false,
				list: {},
				duihuanList:{},
				pinkUserList: [],
				expList: []
			}
		},
		onLoad(d) {
			this.copyTklStatus = false;
			if (d.id) {
				this.id = d.id;
				this.getListById(d.id);
			}
		},
		methods: {
			goWeb() {
				uni.navigateTo({
					url: '/pages/member/webview?url=' + this.duihuanList.linkUrl
				});
			},
			getDuihuanma(id) {
				this.$Request.getT('/selfGoodsVirtual/find?id=' + id).then(res => {
					if (res.status === 0) {
						this.duihuanList = res.data;
						this.$refs.simpleModalTkl.show({
							showConfirmButton: false
						});
					}
				});
			},
			copyTklWenAns: function() {
				uni.setClipboardData({
					data: this.duihuanList.content,
					success: r => {
						this.$queue.showToast('复制成功')
						this.copyTklStatus = true;
					}
				});
			},
			TklmaskClose: function(e) {
				this.$refs.simpleModalTkl.hide();
				this.copyTklStatus = false;
			},
			TklmaskShow: function(e) {

			},
			goRemind(item) {
				this.$Request.getT('/orders/remind?ordersId=' + item.id).then(res => {
					if (res.status === 0) {
						this.$queue.showToast('已提醒商家及时发货，请注意查收');
					} else {
						this.$queue.showToast(res.msg);
					}
				});
			},
			goOrderDetail(list) {
					uni.navigateTo({
						url: '../index/commoditydetail?ordersId=' + list.goodsId
					});
			},
			gorefund(list) {
				if (this.refundCheck) {
					if (this.refund != undefined && this.refund != '') {} else {
						uni.showToast({
							icon: 'none',
							title: '退款原因不能为空'
						});
						return;
					}
					uni.showModal({
						title: '温馨提示',
						content: '确定要取消订单并退款吗？',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确认',
						success: res => {
							if (res.confirm) {
								this.$Request.getT('/orders/refund?ordersId=' + list.id + '&refund=' + this.refund).then(res => {
									if (res.status === 0) {
										this.getListById(this.id);
									} else {
										this.$queue.showToast(res.msg);
									}
								});
							}
						}
					});
				} else {
					this.refundCheck = true;
				}
			},
			getWuLiu(list) {
				uni.request({
					url: 'https://api.apishop.net/common/express/getExpressInfo?apiKey=fm3fZRQ4af6942e0120200e17ef632f2e0faffeae318483&expressNumber=' +
						list.expressNumber,
					method: 'GET',
					success: res => {
						if (res.statusCode === 200) {
							this.expList = [];
							//快递公司名称
							this.expName = res.data.result.expName;
							if (res.data.result.length > 0) {
								res.data.result.list.forEach(d => {
									this.expList.push(d);
								});
							} else {
								this.$queue.showToast("暂无货运信息");
							}
						} else {
							this.$queue.showToast(res.desc);
						}
					}
				});
			},
			gocancle(list) {
				uni.showModal({
					title: '温馨提示',
					content: '确定要取消此订单吗？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.$Request.getT('/orders/cancel?id=' + list.id).then(res => {
								if (res.status === 0) {
									this.getListById(this.id);
								} else {
									this.$queue.showToast(res.msg);
								}
							});
						}
					}
				});
			},
			goconfirm(list) {
				uni.showModal({
					title: '温馨提示',
					content: '确定收到货物了吗？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.$Request.getT('/orders/confirm?id=' + list.id).then(res => {
								if (res.status === 0) {
									this.getListById(this.id);
								} else {
									this.$queue.showToast(res.msg);
								}
							});
						}
					}
				});
			},
			goPay(list) {
				uni.redirectTo({
					url: '../my/payment?money=' + list.payMoney + '&title=' + list.title + '&img=' + list.img + '&id=' + list.id
				});
			},
			deleteOder(id) {
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除此订单吗？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.$Request.getT('/orders/delete?id=' + id).then(res => {
								if (res.status === 0) {
									uni.navigateBack();
								} else {
									this.$queue.showToast(res.msg);
								}
							});
						}
					}
				});
			},
			getpinkUserList(groupPinkId) {
				this.$Request.getT('/selfGroupPink/find?id=' + groupPinkId).then(res => {
					if (res.status === 0) {
						this.pinkUserList = res.data;
					}
				});
			},
			getListById(id) {
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request.getT('/orders/find?id=' + id).then(res => {
					if (res.status === 0) {
						this.state = res.data.status;
						if (res.data.status === 1) {
							res.data.status = '待付款'
						} else if (res.data.status === 2) {
							res.data.status = '待发货'
						} else if (res.data.status === 3) {
							res.data.status = '已发货'
						} else if (res.data.status === 4) {
							res.data.status = '待评价'
						} else if (res.data.status === 5) {
							res.data.status = '已取消'
						} else if (res.data.status === 6) {
							res.data.status = '退款中'
						} else if (res.data.status === 7) {
							res.data.status = '已退款'
						} else if (res.data.status === 8) {
							res.data.status = '拒绝退款'
						} else if (res.data.status === 10) {
							res.data.status = '已评价'
						}
						this.list = res.data;
						this.isRefund = res.data.isRefund;
						this.refusedRefund = res.data.refusedRefund;
						this.isExpress = res.data.isExpress;
						if (this.state === 6 || this.state === 7) {
							this.refundCheck = true;
							this.refund = res.data.refund;
						}

						if (res.data.payWay === 1 || res.data.payWay === 2 || res.data.payWay === 3) {
							this.payWay = '微信';
						} else if (res.data.payWay === 4 || res.data.payWay === 5) {
							this.payWay = '支付宝';
						} else if (res.data.payWay === 6) {
							this.payWay = '零钱';
						} else {
							this.payWay = '待支付';
						}

					}
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style scoped>
	@import '../../../static/css/index.css';

	page {
		background: #F2F2F2;
	}

	.view_button {
		margin: 25upx 20upx 10upx 30upx;
		line-height: 60upx;
		font-size: 24upx;
		color: #333333;
		width: 150upx;
		height: 60upx;
		box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;
		border-radius: 100upx;
		border: 3rpx solid #bababa;
	}
	
	.buy-box-center .buy-btn-copy {
		background: linear-gradient(to left, #e10a07 0, #e10a07 100%);
		display: block;
		border-radius: 50px;
		line-height: 40px;
		height: 40px;
		text-align: center;
		color: #fff;
		font-size: 16px;
		margin-left: 20upx;
		width: 580rpx;
		margin: 0 auto;
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>
