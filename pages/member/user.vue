<template>
	<view class="container">
		<view>
			<!-- #ifndef MP-WEIXIN -->
			<image :src="image111" style="width: 100%;height: 380upx;display: block;position: relative;"></image>
			<view class="user-info-box">
				<view style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 40px;">
					<view style="width: 20%;margin-left: 14upx;" class="portrait-box" @click="goLogin">
						<image class="portrait" :src="image_url"></image>
					</view>
					<view style="text-align: left;margin-left: 12upx;width: 70%;position: relative;top:20upx">
						<view class="info-box" @click="goLogin" style="margin-top: 16upx">
							<text v-if="mobile" class="username" style="color: #FEFEFE">{{ mobile ? mobile : '游客' }}</text>
						</view>
						<view style="display: flex;">
							<view @click="copyHref" v-if="relation_id&&isEnable != '否'" style="margin-top: 12upx;font-size: 24upx;color: #FEFEFE;padding: 4upx 20upx;">
								邀请码：{{ relation_id }}
							</view>
						</view>
					</view>
					<image class="img-xin" style="" src="https://api.shengqianxiong.com.cn/img/20201112/ae567f90dddf4e63a5d8ac79232f0d8f.png"
					 @click="navToLogin('/pages/member/message')"></image>
				</view>

				<view style="display: flex;width: 100%;color: #FFFFFF;margin-top: 10rpx;">
					<view style="width: 33%;text-align: center;" @click="navToLogin('/pages/member/collection?className=我的收藏')">收藏夹</view>
					<view style="width: 33%;text-align: center;" @click="navToLogin('/pages/member/collection?className=我的足迹')">足迹</view>
					<!-- #ifdef APP-PLUS -->
					<view style="width: 33%;text-align: center;" @click="navToLogin('/pages/member/set')">设置</view>
					<!-- #endif -->
				</view>

				<view class="vip-card-box" style=" margin-left:52upx auto;width: 700upx;position: absolute;top:226upx;left:26upx">
					<view v-if="isEnable != '否'" class="b-btn" @click="copyTklWenAn">{{ des }}</view>
					<view class="tit" v-if="!relation_id">
						<text class="yticon icon-iLinkapp-" style="margin-right: 4upx;"></text>
						<text>会员购买商品享省钱+返现</text>
					</view>
					<view class="tit" v-else>
						<text>{{ dengji }}</text>
						<text style="margin-left: 14upx">{{ dengjides }}</text>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<image :src="image111" style="width: 100%;height: 480upx;display: block;position: relative;"></image>
			<view class="user-info-box" style="padding-top: 80rpx;">
				<view style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 40px;">
					<view style="width: 20%;margin-left: 14upx;" class="portrait-box" @click="goLogin">
						<image class="portrait" :src="image_url"></image>
					</view>
					<view style="text-align: left;margin-left: 12upx;width: 70%;position: relative;top:20upx">
						<view class="info-box" @click="goLogin" style="margin-top: 16upx">
							<text v-if="mobile" class="username" style="color: #FEFEFE">{{ mobile ? mobile : '游客' }}</text>
						</view>
						<view style="display: flex;">
							<view v-if="isTuan == 1&&isEnable != '否'" style="margin-top: 12upx;font-size: 24upx;color: #FEFEFE;padding: 4upx 20upx;">
								团长
							</view>
							<view @click="copyHref" v-if="relation_id&&isEnable != '否'" style="margin-top: 12upx;font-size: 24upx;color: #FEFEFE;padding: 4upx 20upx;">
								ID：{{ relation_id }}
							</view>
						</view>
					</view>
					<image class="img-xin" style="" src="https://api.shengqianxiong.com.cn/img/20201112/ae567f90dddf4e63a5d8ac79232f0d8f.png"
					 @click="navToLogin('/pages/member/message')"></image>
				</view>
				<view style="display: flex;width: 100%;color: #FFFFFF;margin-top: 10rpx;">
					<view style="width: 30%;text-align: center;" @click="navToLogin('/pages/member/collection?className=我的收藏')">收藏夹</view>
					<view style="width: 30%;text-align: center;" @click="navToLogin('/pages/member/collection?className=我的足迹')">足迹</view>
				</view>
			</view>


			<view class="vip-card-box" style=" margin-left:52upx auto;width: 700upx;position: absolute;top:206upx;left:26upx;padding-top: 120rpx;height: 270rpx;">
				<view v-if="isEnable != '否'" class="b-btn" @click="copyTklWenAn">{{ des }}</view>
				<view class="tit" v-if="!relation_id">
					<text class="yticon icon-iLinkapp-" style="margin-right: 4upx;"></text>
					<text>会员购买商品享省钱+返现</text>
				</view>
				<view class="tit" v-else>
					<text>{{ dengji }}</text>
					<text style="margin-left: 14upx">{{ dengjides }}</text>
				</view>
			</view>
			<!-- #endif -->
		</view>

		<view style="margin: 20upx;background-color: #FFFFFF;border-radius: 15upx;padding:20upx 0upx;">
			<view style="display: flex;justify-content: space-around;font-size: 28upx;color: #FFFFFF; ">
				<view class="addTo" @click="getMoneys()" style="width: 33%;text-align: center;">
					<text style="font-weight: bold;"> <text style="font-size: 20upx;">￥</text> {{moneys}}</text>
					<text class="user-wen">可提现</text>
				</view>
				<view class="addTo" @click="navToLogin('/pages/member/jifen')" style="width: 33%;text-align: center;">
					<text style="font-weight: bold;"> <text style="font-size: 20upx;">￥</text>{{jifen}}</text>
					<text class="user-wen">我的积分</text>
				</view>
				<view class="addTo" @click="navToLogin('/pages/member/youhuijuan')" style="width: 33%;text-align: center;">
					<text style="font-weight: bold;">{{JuanCount}}</text>
					<text class="user-wen">优惠券</text>
				</view>
			</view>
		</view>

		<view style="background: #FFFFFF;width: 95%;  border-radius: 15upx;margin: 20upx; " v-if="isEnable != '否'">

			<view class="tui-box tui-tool-box" style="margin:0 auto;">
				<view class="tui-cell-header">
					<view class="tui-cell-title" style="margin-top: 15upx;">我的订单</view>
				</view>
				<view class="tui-order-list tui-flex-wrap1">
					<view v-if="isEnable != '否'" class="tui-tool-item1" @click="navToLogins('/pages/zysc/my/myList?itemName=daifukuan')">
						<min-badge :count='dingdanCountList.count1'>
							<view class="tui-icon-box">
								<image src="https://api.shengqianxiong.com.cn/img/20201112/b6d8b55292a9424ab3161ead3821b1c9.png" class="tui-tool-icon1"></image>
							</view>
						</min-badge>
						<view class="tui-tool-text1">待付款</view>
					</view>
					<view v-if="isEnable != '否'" class="tui-tool-item1" @click="navToLogins('/pages/zysc/my/myList?itemName=daifahuo')">
						<min-badge :count='dingdanCountList.count2'>
							<view class="tui-icon-box">
								<image src="https://api.shengqianxiong.com.cn/img/20201112/50d0e740a1674bb9a73d7cac5f2b4d8b.png" class="tui-tool-icon1"></image>
							</view>
						</min-badge>
						<view class="tui-tool-text1">待发货</view>
					</view>
					<view v-if="isEnable != '否'" class="tui-tool-item1" @click="navToLogins('/pages/zysc/my/myList?itemName=daishouhuo')">
						<min-badge :count='dingdanCountList.count3'>
							<view class="tui-icon-box">
								<image src="https://api.shengqianxiong.com.cn/img/20201112/d2abeae0388b4c5383f7d28ffb38e399.png" class="tui-tool-icon1"></image>
							</view>
						</min-badge>
						<view class="tui-tool-text1">待收货</view>
					</view>
					<view v-if="isEnable != '否'" class="tui-tool-item1" @click="navToLogins('/pages/zysc/my/myList?itemName=yishouhuo')">
						<min-badge :count='dingdanCountList.count4'>
							<view class="tui-icon-box">
								<image src="https://api.shengqianxiong.com.cn/img/20201112/dcfc0efcb5b247019b26d7374924cdba.png" class="tui-tool-icon1"></image>
							</view>
						</min-badge>
						<view class="tui-tool-text1">待评价</view>
					</view>
					<view v-if="isEnable != '否'" class="tui-tool-item1" @click="navToLogins('/pages/zysc/my/myList?itemName=tuikuan')">
						<min-badge :count='dingdanCountList.count5'>
							<view class="tui-icon-box">
								<image src="https://api.shengqianxiong.com.cn/img/20201112/8a5ac28894894d98807ce612900417b8.png" class="tui-tool-icon1"></image>
							</view>
						</min-badge>
						<view class="tui-tool-text1">退款/售后</view>
					</view>
				</view>
			</view>
		</view>


		<view style="margin: 20upx;background-color: #FFFFFF;border-radius: 15upx;padding:20upx 30upx;" @click="showMessage"
		 v-if="isEnable != '否'">
			<view style="color: #FB2D1D;font-size: 24upx;text-align: left;">
				*每个月25号结算【上月预估】金额，建议26号进行提现
			</view>
		</view>

		<view style="background: #FFFFFF;width: 95%;  border-radius: 15upx;margin: 20upx;">

			<view class="tui-box tui-tool-box" style="margin:0 auto;padding-bottom: 40upx;">
				<view class="tui-cell-header">
					<view class="tui-cell-title">常用工具</view>
				</view>
				<view class="tui-order-list tui-flex-wrap">
					<view v-if="isEnable != '否'" class="tui-tool-item" @click="navToLogins('/pages/zysc/my/myList')">
						<view class="tui-icon-box">
							<image :src="my8" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">我的订单</view>
					</view>
					<view v-if="isEnable != '否'" class="tui-tool-item" @click="navToLogins('/pages/zysc/my/yaoqing')">
						<view class="tui-icon-box">
							<image :src="my4" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">我的团队</view>
					</view>
					<view v-if="isEnable != '否'" class="tui-tool-item" @click="navToYaoqingLogins('/pages/member/yao')">
						<view class="tui-icon-box">
							<image :src="my6" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">邀请好友</view>
					</view>
					<view class=" tui-tool-item" @click="navToLogin('/pages/member/account')">
						<view class="tui-icon-box">
							<image :src="my2" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">账户安全</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>
<script>
	import listCell from '../../components/mix-list-cell';
	import wmPosters from '@/components/wm-poster/wm-posters.vue';
	import minBadge from '@/components/min-badge/min-badge'
	export default {
		components: {
			listCell,
			wmPosters,
			minBadge
		},
		data() {
			return {
				modalName: '',
				couponlist: [],
				des: '会员申请',
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				mobile: '',
				relation_id: '',
				jifen: '0',
				image_url: '/static/logo2.png',
				gender: '',
				isTuan: 0,
				JuanCount: 0,
				moneyAll: '0',
				moneys: '0',
				tuanSum: '0',
				messageList: [],
				dingdanCountList: {},
				jiesuan: '0',
				grade: '',
				phone: '',
				dengji: '',
				dengjides: '',
				lastjiesuan: '0',
				lastMoneyAll: '0',
				orderNum: '0',
				orderMonthNum: '0',
				totalMoney: '0',
				isInvitation: 0,
				moving: false,
				jiaobiaoNumber: 0,
				isEnable: '是',
				itemendprice: '识别二维码免费领取',
				itemtitle: '',
				totalMoney1: '0',
				itemprice: '',
				erweima: '',
				itempic: '',
				image111: 'https://api.shengqianxiong.com.cn/app-image/my111.png',
				my1: 'https://api.shengqianxiong.com.cn/app-image/my1.png',
				my2: 'https://api.shengqianxiong.com.cn/app-image/my2.png',
				my3: 'https://api.shengqianxiong.com.cn/app-image/my3.png',
				my4: 'https://api.shengqianxiong.com.cn/app-image/my4.png',
				my5: 'https://api.shengqianxiong.com.cn/app-image/my5.png',
				my6: 'https://api.shengqianxiong.com.cn/app-image/my6.png',
				my7: 'https://api.shengqianxiong.com.cn/app-image/my7.png',
				my8: 'https://api.shengqianxiong.com.cn/app-image/my8.png',
				footprintKey: 'orange-sqx-footprint'
			};
		},

		onLoad() {
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}

			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserInfo(userId);
			}
			//#ifdef H5
			if (window.location.href.indexOf('?invitation=') !== -1 || window.location.href.indexOf('&invitation=') !== -1) {
				if (window.location.href.indexOf('?invitation=') !== -1) {
					this.$queue.setData('relation', window.location.href.split('?invitation=')[1].split('&')[0]);
				} else {
					this.invitation = window.location.href.split('&invitation=')[1].split('&')[0];
					this.$queue.setData('relation', window.location.href.split('&invitation=')[1].split('&')[0]);
				}
			}
			//#endif
		},
		onShow() {
			let mobile = this.$queue.getData('nickName');
			this.phone = this.$queue.getData('mobile');
			let image_url = this.$queue.getData('image_url');
			let gender = this.$queue.getData('gender');

			if (mobile && mobile !== 'undefined') {
				this.mobile = mobile;
			} else {
				this.mobile = '';
			}
			if (image_url && image_url !== 'undefined') {
				this.image_url = image_url;
			} else {
				this.image_url = '/static/img/common/logo.jpg';
			}
			if (gender) {
				this.gender = gender;
			}
			let relation_id = this.$queue.getData('relation_id');
			if (relation_id && relation_id !== 'undefined') {
				this.des = '我的特权';
				this.relation_id = relation_id;
			} else {
				this.des = '会员申请';
				this.relation_id = '';
			}

			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getDingDanCount();
				this.getMoney();
				this.getUserInfo(userId);
				this.couponlist = this.$queue.get(this.footprintKey);
				this.$Request.getT('/cash/money/' + userId).then(res => {
					if (res.status === 0 && res.data) {
						this.moneys = parseFloat(res.data).toFixed(2);
					} else {
						this.moneys = '0';
					}
				});
				this.$Request.getT('/ordersRelation/tuanSum?userId=' + userId).then(res => {
					if (res.status === 0 && res.data) {
						this.tuanSum = parseFloat(res.data.data).toFixed(2);
					} else {
						this.tuanSum = '0.00';
					}
				});
			} else {
				this.isTuan = 0;
				this.totalMoney = '0';
				this.orderNum = '0';
				this.moneys = '0';
				this.tuanSum = '0';
				this.moneyAll = '0';
				this.lastjiesuan = '0';
				this.lastMoneyAll = '0';
				this.orderMonthNum = '0';
				this.jiesuan = '0';
				this.jifen = '0';
			}
			this.getYouHuiJuanCount();
		},
		methods: {
			getDingDanCount() {
				let userId = this.$queue.getData('userId');
				let count = 0;
				this.$Request.getT('/orders/count?userId=' + userId).then(res => {
					if (res.status === 0) {
						count = res.data.count1 + res.data.count2 + res.data.count3 + res.data.count4 + res.data.count5;
						this.dingdanCountList = res.data;
					}
				});

			},
			getYouHuiJuanCount() {
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/selfCouponUser/userList?page=0&size=100&userId=' + userId + '&goodsId=&type=0').then(res => {
					if (res.status === 0) {
						this.JuanCount = res.data.totalElements;
					}
				});
			},
			//升级规则弹框
			shengJiMethod() {
				uni.navigateTo({
					url: '/pages/member/yao'
				});
			},
			//邀请码复制
			copyHref() {
				uni.setClipboardData({
					data: this.relation_id,
					success: r => {
						this.$queue.showToast('邀请码复制成功');
					}
				});
			},
			//获取用户信息
			getUserInfo(userId) {
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						if (res.data.orderJifen) {
							this.jifen = parseFloat(res.data.orderJifen).toFixed(0);
						}
						this.$queue.setData('image_url', res.data.image_url);
						this.$queue.setData('relation_id', res.data.relationId);
						this.$queue.setData('nickName', res.data.nickName);
						this.$queue.setData('isInvitation', res.data.isInvitation);
						if (res.data.isTuan) {
							this.isTuan = parseInt(res.data.isTuan);
						}
						if (res.data.gradeDes) {
							this.dengji = res.data.gradeDes;
						} else {
							this.dengji = '已邀请0人';
						}
						if (res.data.gradeNumber) {
							if (res.data.gradeNumber == '还可邀请0人') {
								this.dengjides = '已到达最高等级';
							} else {
								this.dengjides = res.data.gradeNumber;
							}
						} else {
							let number = this.$queue.invitaionNum();
							this.dengjides = '还可邀请' + number + '人';
						}
						this.grade = res.data.grade;
						this.isInvitation = res.data.isInvitation;
						this.$queue.setData('relation', res.data.invitation);
						this.$queue.setData('gender', parseInt(res.data.gender));
						this.gender = parseInt(res.data.gender);
						if (res.data.image_url) {
							this.image_url = res.data.image_url;
						} else {
							this.image_url = '/static/img/common/logo.jpg';
						}
						if (res.data.relationId) {
							this.relation_id = res.data.relationId;
							this.des = '我的特权';
						} else {
							this.relation_id = '';
							this.des = '会员申请';
						}
						if (res.data.nickName) {
							this.mobile = res.data.nickName;
						} else {
							this.mobile = res.data.phone;
						}
					} else {
						this.$queue.logout();
						uni.showModal({
							title: '用户信息提示',
							content: '本地用户信息失效需要重新授权登录',
							showCancel: false,
							success: e => {
								uni.navigateTo({
									url: '/pages/member/register'
								});
							}
						});
					}
				});
			},

			//会员申请弹框
			copyTklWenAn: function() {
				let relation_id = this.$queue.getData('relation_id');
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				let gradle = this.$queue.getData('gradle');
				if (!token) {
					this.goLoginInfo();
				} else {
					if (!relation_id) {
						uni.navigateTo({
							url: '/pages/public/mobile'
						});
					} else {
						uni.showModal({
							cancelText: '关闭',
							confirmColor: '#e10a07',
							cancelColor: '#999999',
							confirmText: '我要升级',
							showCancel: true,
							title: '我的特权',
							content: '1、享受 ' +
								this.dengji +
								'级返现！\n2、购买商品可享受省钱 +返现！\n3、分享商品给好友购买拿返现金额！\n4、邀好友加入享受永久粉丝提成！\n5、享受积分免费兑换商品;\n6、可生成专属商城推广链接;\n7、更多会员特权我们将陆续上线！\n注：VIP越高返现越高哦',
							success: res => {
								if (res.confirm) {
									this.shengJiMethod();
								}
							}
						});
					}
				}
			},
			//获取付款收入查询
			getMoney() {
				let that = this;
				let token = this.$queue.getData('token');
				let relation_id = this.$queue.getData('relation_id');
				if (token && relation_id && relation_id !== 'undefined') {
					//团队本月付款收入
					var date = new Date();
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate();
					if (month < 10) {
						month = '0' + month;
					}
					if (day < 10) {
						day = '0' + day;
					}
					var month1 = date.getMonth();
					var nowDate = year + '-' + month;
					if (month1 < 10) {
						month1 = '0' + month1;
					}
					var lastDate = year + '-' + month1;
					this.$Request.getT('/statistics/TeamOrderTotalByRelation?relation=' + relation_id + '&tk_status=12&time=' +
						nowDate).then(res => {
						if (res.status === 0) {
							let totalMoney = 0;
							if (res.data) {
								totalMoney = parseFloat(res.data).toFixed(2);
							}
							this.$Request.getT('/statistics/TeamOrderTotalByRelation?relation=' + relation_id + '&tk_status=3&time=' +
								nowDate).then(res => {
								if (res.status === 0 && res.data) {
									this.totalMoney = (parseFloat(res.data) + parseFloat(totalMoney)).toFixed(2);
								} else {
									this.totalMoney = totalMoney;
								}

								uni.hideLoading();
							});
						} else {
							this.totalMoney = '0';
						}

						uni.hideLoading();
					});
				} else {
					that.totalMoney = '0';
					that.orderNum = '0';
					that.moneys = '0';
					that.moneyAll = '0';
					that.lastjiesuan = '0';
					that.lastMoneyAll = '0';
					that.orderMonthNum = '0';
					that.jiesuan = '0';
				}
			},
			//立即提现
			getMoneys() {
				let token = this.$queue.getData('token');
				if (token) {
					this.navTo('/pages/member/cash');
				} else {
					this.goLoginInfo();
				}
			},
			//结算弹框
			showMessage() {
				uni.showModal({
					showCancel: false,
					title: '结算提示',
					confirmColor: '#e10a07',
					content: '每个月25号结算上月【确认收货】的订单，结算完成后【可提现金额】才会同步更新金额。因结算订单量大，结算时间会较长，结算会在25号晚上完成，建议您26号进行提现。\n举例：5月份确认收货订单，6月25号才会进行结算，以此类推'
				});
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				if (url === '/pages/member/help') {
					//#ifdef H5
					window.location.href = this.$queue.publicYuMing() + '/help/custom.html';
					//#endif
					//#ifdef APP-PLUS
					uni.navigateTo({
						url: '/pages/member/webview?url=' + this.$queue.publicYuMing() + '/help/custom.html'
					});
					//#endif
				} else {
					uni.navigateTo({
						url
					});
				}
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navToLogin(url) {
				let token = this.$queue.getData('token');
				let mobile = this.$queue.getData('mobile');
				let userId = this.$queue.getData('userId');
				if (token) {
					this.$Request.getT('/user/' + userId).then(res => {
						if (res.status === 0 && res.data.phone) {
							uni.navigateTo({
								url
							});
						} else {
							uni.navigateTo({
								url: '/pages/public/mobile'
							});
						}
					});
				} else {
					this.goLoginInfo();
				}
			},
			//统一登录跳转
			goLoginInfo() {
				this.$queue.setData('href', '/pages/member/user');
				uni.navigateTo({
					url: '/pages/member/register'
				});
			},
			navToLogins(url) {
				this.$queue.setData('href', '/pages/member/user');
				let token = this.$queue.getData('token');
				if (token) {
					uni.navigateTo({
						url
					});
				} else {
					this.goLoginInfo();
				}
			},
			navToYaoqingLogins(url) {
				let token = this.$queue.getData('token');
				let relationId = this.$queue.getData('relation_id');
				if (token) {
					if (relationId) {
						uni.navigateTo({
							url
						});
					} else {
						uni.navigateTo({
							url: '/pages/public/mobile'
						});
					}
				} else {
					this.goLoginInfo();
				}
			},
			goLogin(url) {
				let token = this.$queue.getData('token');
				if (!token) {
					this.goLoginInfo();
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	page {
		background: #F3F3F3;
	}

	.app {
		padding: 22rpx;
	}

	.cell {
		margin: 22rpx;
	}

	.test {
		width: 100rpx;
		height: 100rpx;
		background: #dddddd;
	}

	.tui-order-text,
	.tui-tool-text {
		font-size: 26rpx;
		font-weight: 400;
		color: #666;
		padding-top: 4rpx;
	}

	.tui-tool-text {
		font-size: 24rpx;
	}

	.tui-tool-text1 {
		font-size: 24rpx;
		margin-top: 15upx;
	}

	.img-xin {
		width: 50upx;
		height: 50upx;
		position: relative;
		top: 40upx;
		left: -56upx;
	}

	.tui-order-list {
		width: 100%;
		height: 134rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-order-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tui-box {
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.3);
		border-radius: 10rpx;
		// overflow: hidden;
	}

	.tui-cell-header {
		width: 100%;
		height: 74rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-cell-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.tui-tool-box {
		margin-top: 20rpx;
	}

	// 收藏夹
	.addTo {
		display: flex;
		flex-direction: column;
		color: #333333;

		text-align: center;
		font-size: 38upx;
	}

	.user-wen {
		font-size: 24upx;
		margin-left: 10upx;
		margin-top: 10upx
	}

	.tui-flex-wrap {
		flex-wrap: wrap;
		padding-bottom: 30rpx;
	}

	.tui-flex-wrap1 {
		flex-wrap: wrap;
		height: 150upx;
		padding-bottom: 30rpx;
	}

	.tui-tool-item1 {
		width: 20%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 20rpx;
	}

	.tui-tool-item {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-tool-icon {
		width: 92rpx;
		height: 92rpx;
		display: block;
		padding: 4upx;
	}

	.tui-tool-icon1 {
		width: 60rpx;
		height: 50rpx;
		display: block;
	}


	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10px;
	}

	.user-info-box {
		width: 100%;
		height: 200upx;
		// display: flex;
		align-items: center;
		position: absolute;
		top: -10upx;
		// left: 20upx;
		z-index: 1;

		.portrait {
			width: 140upx;
			height: 140upx;
			border-radius: 50%;
			margin-left: 20upx;
		}

		.username {
			font-size: 16px;
			color: #f2f2f2;
			margin-top: 16px;
			margin-left: 10px;
		}

		.username1 {
			font-size: 14px;
			color: whitesmoke;
			margin-top: 16px;
			margin-left: 10px;
		}
	}

	.vip-card-box {
		display: flex;
		flex-direction: column;
		margin-top: 26px;
		color: #f7d680;
		height: 110upx;

		overflow: hidden;
		position: relative;
		padding: 40upx 28upx;

		.card-bg {
			position: absolute;
			top: 40upx;
			right: 0;
			width: 440upx;
			height: 320upx;
		}

		.b-btn {
			position: absolute;
			right: 50upx;
			/* #ifndef MP-WEIXIN */
			top: 30upx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			top: 125upx;
			/* #endif */
			width: 160upx;
			height: 60upx;
			text-align: center;
			line-height: 60upx;
			font-size: 28upx;
			color: #E6BC96;
			border-radius: 32upx;

			background: linear-gradient(left, #3E3834, #262424);
			z-index: 1;
		}

		.tit {
			font-size: 14px;
			color: #B17A46;
			margin-left: 20upx;
			margin-top: 6upx;
			/* #ifdef MP-WEIXIN */
			margin-top: 20rpx;
			/* #endif */
		}
	}
</style>
