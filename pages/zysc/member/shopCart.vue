<template>
	<view class="myTask">
		<!-- #ifndef H5 -->
		<view style="width: 100%;height: 100upx;position: fixed;bottom: 0;background: #FFFFFF;z-index: 10;display: flex;"
		 v-if="newsList.length > 0">
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view style="width: 100%;height: 180upx;position: fixed;bottom: 0;background: #FFFFFF;z-index: 10;display: flex;"
			 v-if="newsList.length > 0">
				<!-- #endif -->
				<view v-if="!CheckshowDelete" style="margin-top: 25upx;width: 75%;text-align: right;font-size: 24upx;">总价：<text
					 style="font-size: 34upx;color: #FF0000;">￥{{MaxMoney | formatPrice}}</text></view>
				<view v-if="!CheckshowDelete" class="shopCartUnsetBtn" @tap='goCheckMoney()'>结算({{CheckMaxnumber}})</view>
				<view v-if="CheckshowDelete" style="margin-top: 30upx;width: 45%;text-align: right;font-size: 24upx;"></view>
			</view>
			<view :style=" newsList.length > 0 ? 'margin-top: 20upx;margin-bottom: 180upx;' : 'margin-top: 60upx;margin-bottom: 180upx;'">
				<view style="background: #FFFFFF;width: 97%;height: max-content;margin: 20upx 0upx 10upx 10upx;border-radius: 10rpx;box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 5px 1px;" v-for="(item,index) in newsList"
				 :key='index'>
					<!-- <view style="padding: 10rpx;text-align: left;margin-left: 80rpx;"></view> -->
					<view style="display: flex;padding: 20upx 10upx;" @tap='goOrderDetail(item.goodsId)'>
						<checkbox @click.stop="changeitem(index)" value="item" :checked="checkSelectList[index].checkState" style="width: 50upx;margin-top: 70upx;margin-left: 10upx;border-color :#FFFFFF" />
						<image :src="item.goods.coverImg" style="width: 30%;height: 210upx;margin-left: 20upx;"></image>
						<view style="margin-left: 20upx;width: 58%;">
							<view style="font-size: 30upx;color: #000000;font-weight: 500; width: 95%;height: 80upx;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">{{item.goods.title}}</view>
							<view style="display: flex;width: 90%;margin-top: 10upx;" v-if="item.sku && item.sku.detailJson">
								<view style="font-size: 22upx;color: #999;padding: 2upx 8upx;border-radius: 5upx;background-color:#F2F2F2;">{{item.sku.detailJson}}</view>
							</view>
							<view :style="item.sku && item.sku.detailJson ? 'display: flex;height: 70upx;margin-top: 30rpx;': 'display: flex;height: 70upx;margin-top: 60rpx;'">
								<view style="font-size: 38upx;color: #FF332F;padding-bottom: 10upx;width: 45%;text-align: left;line-height: 90upx;">
									<text style="font-size: 18upx;">¥</text> {{item.goods.price}}</view>
								<view style="width:200upx;height: 60upx;display: flex;border-radius: 5upx;border:1px solid #E6E6E6;" v-if="item.sku">
									<view style="border-right:1px solid #E6E6E6;width: 70upx;color: #999999;text-align: center;font-size: 50upx;"
									 @click.stop="jian(item.number,index)">-</view>
									<view style="width: 80upx;text-align: center;font-size: 24upx;color: #333333;margin-top: 15upx;">{{item.number}}</view>
									<view style="border-left:1px solid #E6E6E6;width: 70upx;color: #999999;text-align: center;padding-top: 10upx;font-size: 36upx;"
									 @click.stop="jia(item.number,index)">+</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 悬浮上拉 -->
				<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '', '']" style="bottom: 100px;"><text
					 class="iconfont icon-shangla"></text></view>

				<!-- 加载更多提示 -->
				<view class="s-col is-col-24" v-if="newsList.length > 0">
					<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
				</view>
				<!-- 加载更多提示 -->
				<view v-if="newsList.length === 0" style="height: 500upx;text-align: center;">
					<image src="https://api.shengqianxiong.com.cn/img/20201116/3c850786ac1b45be9cc2457f1c00116c.png" style="width: 400upx;height: 300upx;margin-top: 100upx;"></image>
					<view style="margin-top: 50upx;">购物车空空如也,请先去添加商品吧</view>
				</view>
			</view>
			
			<!-- #ifdef H5 -->
			<view style="text-align: center;margin-top: 150upx;margin-bottom: 16upx;padding-top: 32upx;">
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<view style="text-align: center;margin-top: 400upx;margin-bottom: 16upx;padding-top: 32upx;">
			<!-- #endif -->
				<text style="font-size: 32upx;color: #F15B6C;">猜你喜欢</text>
			</view>

			<!-- #ifdef H5 -->
			<view style="display: flex;flex-wrap: wrap;margin-bottom: 110upx;">
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view style="display: flex;flex-wrap: wrap;margin-bottom: 0upx;">
					<!-- #endif -->
					<view style="width: 345upx;height: 510upx;background-color: #FFFFFF; border-radius: 20upx;margin-left: 20upx; margin-top: 20upx;box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;"
					 @tap='goDetail(item.id)' v-for="(item,index) in homegoodsList" :key='index' v-if="homegoodsList.length > 0">
						<image :src="item.coverImg" style="width: 345upx;height: 340upx;border-top-left-radius:20upx;border-top-right-radius:20upx;"></image>
						<view style="padding: 16upx 2upx 16upx 16upx;">
							<view style="width: 100%;height:  60upx;">
								<text class="limapboxqing2"><text class="indexr" style=""><text>自营</text></text>{{ item.title }}</text>
							</view>
						</view>
						<view style="padding: 0rpx 15rpx;display: flex;margin:20rpx 0">
							<view v-if="relation" style="font-size: 38upx;color: #FF2A47;"><text style="font-size: 30rpx;">¥</text> {{item.memberPrice}}</view>
							<view v-if='!relation' style="font-size: 38upx;color: #FF2A47;"><text style="font-size: 30rpx;">¥</text>{{item.price}}</view>
							<view style="font-size: 24upx;color: #999999;margin-left: 10rpx;margin-top: 8upx;">{{item.sales}}人已购买</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 0,
				state: 0,
				Maxnumber: 10,
				isExpress: 0,
				size: 10,
				background:'#FFFFFF',
				MaxMoney: 0,
				isEnable: '否',
				CheckMaxnumber: 0,
				newsList: [],
				homegoodsList: [],
				checkSelectList: [],
				loadingType: 0,
				relation: false,
				checkSelectState: false,
				shopcart: 'https://api.shengqianxiong.com.cn/app-image/shopcart.png',
				type: 1,
				CheckshowDelete: false,
				number: 1,
				scrollTop: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				}
			}
		},
		onShow() {
			let a = this.$queue.getData('isEnable');
			if (a === '是') {
				let b = this.$queue.getData('isLieBiaoEnable');
				if (b) {
					this.isEnable = b;
				} else {
					this.isEnable = a;
				}
			} else {
				this.isEnable = a;
			}
			let userId = this.$queue.getData('userId');
			this.MaxMoney = 0;
			this.CheckMaxnumber = 0;
			this.getHomeGoods();
			if (userId) {
				this.page = 0;
				this.getSelectOrderList('');
			}

			let relation_id = this.$queue.getData('relation_id');
			if (relation_id) {
				this.relation = true;
			} else {
				this.relation = false;
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
		onNavigationBarButtonTap() {
			this.CheckshowDelete = true;
		},
		methods: {
			goDetail(id) {
				uni.navigateTo({
					url: '../index/commoditydetail?ordersId=' + id
				});
			},
			getHomeGoods() {
				this.$Request.getT('/goods/homeGoods?page=0&size=100').then(res => {
					if (res.status === 0) {
						if (this.page === 0 || res.status) {
							this.homegoodsList = [];
						}
						let grade = this.$queue.getData('grade');
						res.data.content.forEach(d => {
							d.descrition = '';
							if (d.commissionPrice != 0) {
								if (grade) {
									if (this.relation) {
										d.descrition = ((parseFloat(d.memberPrice) * parseFloat(d.commissionPrice)) * parseFloat(grade)).toFixed(
											2);
									} else {
										d.descrition = ((parseFloat(d.price) * parseFloat(d.commissionPrice)) * parseFloat(grade)).toFixed(2);
									}
								} else {
									if (this.relation) {
										d.descrition = ((parseFloat(d.memberPrice) * parseFloat(d.commissionPrice)) * parseFloat(this.$queue.minMoney()))
											.toFixed(2);
									} else {
										d.descrition = ((parseFloat(d.price) * parseFloat(d.commissionPrice)) * parseFloat(this.$queue.minMoney()))
											.toFixed(2);
									}
								}
							}
							d.sales = d.sales > 10000 ? (d.sales / 10000).toFixed(1) + '万' : d.sales;
							this.homegoodsList.push(d);
						});
					}
				});
			},
			QuanXuan() {
				if (this.checkSelectState) {
					this.checkSelectState = false;
				} else {
					this.checkSelectState = true;
				}
				this.MaxMoney = 0;
				for (var i = 0; i < this.checkSelectList.length; i++) {
					if (this.checkSelectState) {
						this.CheckMaxnumber = i + 1;
						this.checkSelectList[i].checkState = true;
						this.MaxMoney = parseFloat(this.MaxMoney + this.newsList[i].goods.memberPrice);
					} else {
						this.MaxMoney = 0;
						this.CheckMaxnumber = 0;
						this.checkSelectList[i].checkState = false;
					}
				}

			},
			jian(number, index) {
				if (number != 1) {
					let _number = parseInt(number) - 1;
					this.newsList[index].number = _number;
					this.newsList[index].goods.memberPrice = parseFloat(this.newsList[index].goods.memberPrice - this.newsList[index]
						.goods
						.price).toFixed(2);
					if (this.checkSelectList[index].checkState) {
						this.MaxMoney = parseFloat(this.MaxMoney - this.newsList[index].goods.price);
					}
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '确认不要了吗？',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确认',
						success: res => {
							if (res.confirm) {
								this.goDelete(this.newsList[index].id);
							}
						}
					});
				}
			},
			jia(number1, index) {
				let number = number1 + 1;
				if (number <= this.newsList[index].sku.stock) {
					this.newsList[index].number = number;
					this.newsList[index].goods.memberPrice = parseFloat(this.newsList[index].goods.price * number).toFixed(2);
					if (this.checkSelectList[index].checkState) {
						this.MaxMoney = parseFloat(this.MaxMoney + this.newsList[index].goods.price);
					}
				} else {
					this.$queue.showToast('商品只能买这么多了');
				}
			},
			changeitem(index) {
				var test = false;
				test = this.checkSelectList[index].checkState;
				if (test) {
					this.checkSelectList[index].checkState = false;
					this.MaxMoney = parseFloat(this.MaxMoney - this.newsList[index].goods.memberPrice);
					this.CheckMaxnumber = this.CheckMaxnumber - 1;
				} else {
					this.checkSelectList[index].checkState = true;
					this.MaxMoney = parseFloat(this.MaxMoney + this.newsList[index].goods.memberPrice);
					this.CheckMaxnumber = this.CheckMaxnumber + 1;
				}
			},
			goCheckMoney() {
				var state = false;
				var datas = [];
				var ids = '';
				var youfei = 0;
				for (var i = 0; i < this.checkSelectList.length; i++) {
					this.newsList[i].goods.brand = '请选择优惠券信息';
					this.newsList[i].goods.descrition = '';
					this.newsList[i].goods.buyReason = this.newsList[i].goods.memberPrice;
					if (this.checkSelectList[i].checkState == true) {
						state = true;
						youfei = youfei + parseFloat(this.newsList[i].goods.postagePrice);
						if (ids == '') {
							ids = this.newsList[i].id;
						} else {
							ids = ids + ',' + this.newsList[i].id;
						}
						datas.push(this.newsList[i]);
					} else {
						if (!state) {
							state = false;
						}
					}
				}
				if (state) {
					this.checkSelectState = false;
					var money = this.MaxMoney;
					this.MaxMoney = 0;
					this.page = 0;
					this.CheckMaxnumber = 0;
					this.$queue.setData("shopCartOrderList", datas);
					uni.navigateTo({
						url: './shopCartOrder?money=' + money + '&ids=' + ids + '&youfei=' + youfei
					});
				} else {
					this.$queue.showToast('请选择商品');
				}
			},
			goDelete(ids) {
				this.$Request.getT('/selfCart/deleteAll?ids=' + ids).then(res => {
					if (res.status === 0) {
						this.$queue.showToast('删除成功!');
						this.checkSelectState = false;
						this.MaxMoney = 0;
						this.CheckMaxnumber = 0;
						this.page = 0;
						setTimeout(() => {
							this.getSelectOrderList('');
						}, 1000);
					}
				});
			},
			goOrderDetail(id) {
				uni.navigateTo({
					url: '../index/commoditydetail?ordersId=' + id
				});
			},
			getSelectOrderList(type) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/selfCart/list?page=' + this.page + '&size=1000' + '&userId=' + userId).then(res => {
					if (res.status === 0) {
						if (this.page === 0 || res.status) {
							this.newsList = [];
							this.checkSelectList = [];
						}
						if (res.data.totalElements > 0) {
							uni.setTabBarBadge({
								index: 2,
								text: '' + res.data.totalElements
							})
						} else {
							uni.removeTabBarBadge({
								index: 2
							})
						}
						res.data.content.forEach(d => {
							if (d.goods) {
								if (d.goods.status == 1) { //status ==1 正常 2 下架
									if (d.sku) {
										if (this.relation) {
											d.goods.memberPrice = d.sku.memberPrice;
										} else {
											d.goods.memberPrice = d.sku.skuPrice;
										}
									} else {
										if (this.relation) {
											d.goods.memberPrice = d.goods.memberPrice;
										} else {
											d.goods.memberPrice = d.goods.price;
										}
									}
									d.goods.price = d.goods.memberPrice; //将price更改为商品的单价
									d.goods.memberPrice = d.goods.memberPrice * d.number //memberPrice中存储的是商品加了数量的价格
									this.newsList.push(d);

									let data = {};
									data.checkState = false;
									this.checkSelectList.push(data);
								} else {
									this.$Request.getT('/selfCart/deleteAll?ids=' + d.id).then(res => {
										if (res.status === 0) {

										}
									});
								}
							}
						});
						if (res.data.content.length === this.size) {
							this.loadingType = 0;
						} else {
							this.loadingType = 3;
						}
						// if(this.newsList.length === 0){
						// 	this.background = '#F2F2F2';
						// }else{
						// 	this.background = '#F2F2F2';
						// }
					} else {
						this.loadingType = 2;
					}
					uni.hideLoading();
					if (type === 'Refresh') {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 120,
					duration: 300
				});
			}
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.getSelectOrderList('');
		},
		onPullDownRefresh: function() {
			this.page = 0;
			this.getSelectOrderList('Refresh');
		}
	}
</script>

<style>
	@import '../../../static/css/index.css';

	page {
		background: #FFFFFF;
	}

	.myTask>>>uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: #B3B3B3 !important;
		width: 52upx !important;
		height: 52upx !important;
		display: block;
	}

	.myTask>>>uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		width: 52upx !important;
		height: 52upx !important;
	}

	.view_button {
		margin: 15upx 20upx 10upx 30upx;
		line-height: 55upx;
		font-size: 24upx;
		color: #333333;
		width: 150upx;
		height: 55upx;
		box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;
		border-radius: 100upx;
		border: 1upx solid #bababa;
	}

	.indexr {
		color: #FFFFFF;
		background: #E10A07;
		font-size: 22upx;
		padding-left: 12upx;
		display: inline-block;
		padding-right: 13upx;
		border-radius: 8upx;
		margin-right: 8upx;
		padding-top: 2upx;
		padding-bottom: 2upx;
		line-height: 34upx;
	}


	.limapboxqing2 {

		font-size: 28upx;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.tui-tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #fafafa;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}

	.tui-scroll-h1 {
		width: 750rpx;
		height: 80rpx;
		background-color: #ffffff;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		/* #ifdef H5 */
		position: fixed;
		top: 43px;
		left: 0;
		z-index: 999;
		/* #endif */
	}

	.tui-line-h {
		/* #ifdef APP-PLUS */
		height: 1rpx;
		background-color: #cccccc;
		/* #endif */
		position: relative;
	}

	/* #ifndef APP-PLUS*/
	.tui-line-h::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #cccccc;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	/* #endif */

	.tui-tab-item {
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
		// flex-wrap: nowrap;
		// padding-left: 34rpx;
		// padding-right: 34rpx;
	}

	.tui-tab-item-title {
		color: #555;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
		white-space: nowrap;
	}

	.tui-tab-item-title-active {
		color: #E10A07;
		font-size: 32upx;
		font-weight: bold;
		border-bottom-width: 6upx;
		text-align: center;
	}

	.shopCartUnsetBtn {
		padding-left: 20upx;
		padding-right: 20upx;
		width: 200upx;
		background: #fc0b17;
		text-align: center;
		line-height: 90upx;
		font-size: 24upx;
		color: #FFFFFF;
		margin-left: 20upx;
		font-size: 28upx;
	}
</style>
