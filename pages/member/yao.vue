<template>
	<view>
		<view class="bg" v-bind:style="{backgroundImage: 'url('+toBase64Url+')'}">
			<text class="num" style="font-size: 32upx;color: #000000;margin-bottom: 10px">
				<text style="font-size: 32upx;font-weight: bold;color: #000000;margin-right:10upx;">当前等级</text>
				<text style="font-size: 30upx;font-weight: bold;margin-right:6upx;"> • </text>
				<text style="font-size: 50upx;font-weight: bold;font-weight: bold;">{{ dengji }}</text>
			</text>
			<view style="font-size: 28upx;margin-top: 32upx;color: #000000;">{{ dengjides }}</view>
		</view>
		<view style="text-align: left;color: #333333;font-size: 28upx;">
			<view style="margin-top: 16upx;background: #FFFFFF;border-radius: 16upx;padding: 26upx;margin: 12upx;">
				<view style="font-size: 32upx;font-weight: bold;margin-bottom: 16upx;">邀请规则</view>
				<view>1、每成功邀请1位好友提升1级，最高{{ invitatioNum }}级每级对应相应的返现比例</view>
				<view style="margin-top: 8upx">2、邀请成功可享受终身粉丝佣金{{ teamMoney }}%提成</view>
				<view style="margin-top: 8upx" v-if="setting==2">3、已邀请成功的好友再邀请好友可享受非直属好友佣金{{ threeMoney }}%提成</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view style="margin-top: 16upx;background: #FFFFFF;border-radius: 16upx;padding: 26upx;margin: 12upx;">
				<view style="font-size: 32upx;font-weight: bold;margin-bottom: 16upx;margin-top: 16upx;">邀请方式</view>
				<view>1、点击下方【分享给好友】分享好友、群，请好友注册即可升级</view>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view style="margin-top: 16upx;background: #FFFFFF;border-radius: 16upx;padding: 26upx;margin: 12upx;">
				<view style="font-size: 32upx;font-weight: bold;margin-bottom: 16upx;margin-top: 16upx;">邀请方式</view>
				<view style="margin-top: 8upx;">1、点击下方【分享邀请链接】生成专属推广链接，分享好友、群，让好友注册即可升级</view>
			</view>
			<!-- #endif -->
		</view>
		<view style="display: flex;margin-top: 64upx;margin-left: 16upx;margin-right: 16upx;">

			<!-- #ifdef MP-WEIXIN -->
			<button @click="showPopu()" style="text-align: center;width: 95%;background: #ED3113;font-size: 32upx;color: white;border-radius: 20upx;height: 80upx;line-height: 80upx;margin-left: 20upx;">
				分享给好友
			</button>
			<!-- #endif -->

			<!-- #ifdef H5 -->
			<view @click="shareYQ()" style="text-align: center;width: 95%;background: #ED3113;font-size: 32upx;color: white;border-radius: 20upx;height: 80upx;line-height: 80upx;margin-left: 20upx;">
				分享邀请链接
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view @click="showModal()" style="margin-right: 32upx;text-align: center;width: 50%;background: #FFCB49;font-size: 32upx;color: white;border-radius: 20upx;height: 80upx;line-height: 80upx">
				生成邀请海报
			</view>
			<view @click="shareWeiXin()" style="text-align: center;width: 50%;background: #ED3113;font-size: 32upx;color: white;border-radius: 20upx;height: 80upx;line-height: 80upx;margin-left: 20upx;">
				分享邀请链接
			</view>
			<!-- #endif -->
		</view>
		<tki-qrcode ref="qrcode" :val="url" :size="200" background="#fff" foreground="#000" pdground="#000" :onval="true"
		 :loadMake="true" @result="qrR" :show="false"></tki-qrcode>
		<view class="cu-modal" :class="modalName == 'Image' ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog" v-if="backImage && XCXErweima && haibaoShow" @tap="hideModal">
				<view class="bg-img">
					<!-- #ifndef APP-PLUS -->
					<wm-poster @success="posterSuccess" :imgSrc="backImage" :Referrer="'我的邀请码:'+relationId" :QrSrc="XCXErweima" :Title="title"
					 :LineType="false"></wm-poster>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<wm-poster @success="posterSuccess" :imgSrc="backImage" :Referrer="'我的邀请码:'+relationId" :QrSrc="erweimapath"
					 :Title="title" :LineType="false"></wm-poster>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<uni-popup ref="popusshare" type="bottom">
			<view style="width: 100%;height: max-content;background: #FFFFFF;border-top-left-radius: 20rpx;border-top-right-radius: 20rpx;padding: 40rpx;">
				<view style="display: flex;">
					<view style="width: 50%;text-align: center;" v-for='(item,index) in bottomData' :key='index' @tap='goShare(index)'>
						<button v-if="index === 0" style="text-align:center;background: #FFFFFF;" open-type='share'>
							<image :src="item.icon" style="width: 80rpx;height: 80rpx;"></image>
							<view style="color: #000000;font-size: 28rpx;">{{item.text}}</view>
						</button>
						<view v-if="index != 0">
							<image :src="item.icon" style="width: 80rpx;height: 80rpx;"></image>
							<view style="margin-top: 38rpx;color: #000000;font-size: 28rpx;">{{item.text}}</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import wmPoster from '@/components/wm-poster/wm-posterorders.vue';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	import appShare from '@/utils/share.js';
	export default {
		components: {
			tkiQrcode,
			uniPopup,
			wmPoster
		},
		data() {
			return {
				erweimapath: '',
				poster: {},
				qrShow: false,
				haibaoImg: null,
				haibaoShow: false,
				backgroundImage: '',
				modalName: '',
				totalMoney: '0',
				threeMoney: '',
				setting: 1,
				dengji: 0,
				itemendprice: '识别二维码免费领取',
				tuiguang: '给你说个买东西省钱工具叫地摊侠！\n买东西能货比三家买不了吃亏买不了上当\n我用好久了买东西不但便宜还能返现！\n这一年半载我都省下一大半了！\n点链接可以看看\n',
				backImage: '',
				title: '',
				itemtitle: '',
				relationId: '',
				itemprice: '',
				image: '',
				toBase64Url: 'https://api.shengqianxiong.com.cn/VIP.png',
				imageUrl: '../../static/logo2.png',
				erweima: '',
				itempic: '',
				teamMoney: '20',
				XCXErweima: '',
				url: '',
				bottomData: [{
						text: '分享好友',
						icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-2.png',
						name: 'wx'
					},
					{
						text: '生成海报',
						icon: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
						name: 'more'
					}
				],
				invitatioNum: 0,
				dengjides: '生成海报'
			};
		},
		onShareAppMessage(res) {
			return {
				path: '/pages/zysc/index/index?userByinvitationId=' + this.relationId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.title,
				imageUrl: this.backImage
			}
		},
		onLoad() {
			this.getSetting();
			// #ifdef MP-WEIXIN
			wx.getSetting({
				success(res) {
					if (!res.authSetting['scope.writePhotosAlbum']) {
						wx.authorize({
							scope: 'scope.writePhotosAlbum',
							success() {
								console.log('授权成功');
							}
						});
					}
				}
			});
			// #endif
			let number = this.$queue.invitaionNum();
			this.teamMoney = parseFloat(this.$queue.teamMoney()) * 100;
			this.threeMoney = parseFloat(this.$queue.threeMoney()) * 100;
			this.invitatioNum = parseInt(number);

		},
		onShow() {
			let relationId = this.$queue.getData('relation_id');
			if (relationId) {
				this.relationId = relationId;
				this.getBackGroundImageErweima(relationId);
				this.XCXErweima = this.$queue.publicYuMing() +
					'/tao/user/getImg?page=pages/zysc/index/index&scene=' +
					relationId + '&width=200'
				// #ifdef H5
				this.url = this.$queue.publicYuMing() + '/?userByinvitationId=' + relationId;
				//#endif
			}
			// #ifdef APP-PLUS
			this.url = this.$queue.publicYuMing() + '/#/pages/member/download?userByinvitationId=' + relationId;
			// #endif
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserInfo(userId);
			}
			this.getBackGroundImage();
		},
		methods: {
			getSetting() {
				this.$Request.getT('/common/type/91').then(res => {
					if (res.status == 0) {
						if (res.data && res.data.value) {
							this.setting = res.data.value
						}
					}
				});
			},
			posterSuccess(haibaoImg) {
				this.haibaoImg = haibaoImg;
				this.modalName = 'Image';
			},
			showModal() {
				if (!this.haibaoImg) {
					this.haibaoShow = true;
					this.$queue.showLoading('海报生成中...');
				} else {
					this.modalName = 'Image';
				}
			},
			hideModal() {
				this.modalName = null;
			},
			qrR(path) {
				this.erweimapath = path;
			},
			showPopu() {
				this.$refs.popusshare.open();
			},
			goShare(index) {
				this.$refs.popusshare.close();
				//0,分享好友	1，生成海报
				if (index === 1) {
					this.showModal();
				}
			},
			getBackGroundImageErweima(relationId) {
				this.$Request.getT('/user/getImg?page=/pages/zysc/index/index&scene=userByinvitationId=' + relationId +
					'&width=200').then(res => {

				});
			},
			getBackGroundImage() {
				this.$Request.getT('/selfActivity/state?state=6').then(res => {
					if (res.status === 0) {
						this.backImage = res.data[0].image_url;
						this.title = res.data[0].title;
					}
				});
			},
			hideModal() {
				this.modalName = null;
			},
			shareWeiXin() {
				let shareData = {
					shareUrl: this.url,
					shareTitle: '邀请你加入地摊侠！先领券，再购物，更划算！',
					shareContent: '邀请码：' + this.relationId + '，点击进入，在地摊侠中和我一起购物返利赚大钱吧！',
					shareImg: '../../static/logo2.png',
					type: 0
				};
				appShare(shareData, res => {
					console.log('分享成功回调', res);
				});
			},
			shareYQ() {
				this.sharurl();
			},
			getUserInfo(userId) {
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						if (res.data.gradeDes) {
							this.dengji = res.data.gradeDes;
						} else {
							this.dengji = 0;
						}
						if (res.data.gradeNumber) {
							if (res.data.gradeNumber == '还可邀请0人') {
								this.dengjides = '已到达最高等级';
							} else {
								this.dengjides = res.data.gradeNumber;
							}
						} else {
							this.dengjides = '还可邀请' + this.invitatioNum + '人';
						}
					}
				});
			},
			sharurl() {
				let that = this;
				uni.showModal({
					title: '链接推广',
					content: this.tuiguang + this.url,
					showCancel: true,
					cancelText: '关闭',
					confirmText: '一键复制',
					success: res => {
						if (res.confirm) {
							uni.setClipboardData({
								data: this.tuiguang + this.url,
								success: function() {
									console.log('success');
									that.$queue.showToast('复制成功');
								}
							});
						}
					}
				});
			},
			getMoney() {
				let that = this;
				let relationId = this.$queue.getData('relation_id');
				if (relationId) {
					this.$Request.getT('/user/getCount?invitation=' + relationId).then(res => {
						if (res.status === 0 && res.data) {
							that.totalMoney = res.data;
						} else if (res.status === -102) {
							this.$queue.showToast(res.msg);
							this.$queue.logout();
							uni.navigateTo({
								url: '/pages/member/register'
							});
						} else {
							that.totalMoney = '0';
						}
					});
				}
			},
			getOut() {
				let that = this;
				let relationId = this.$queue.getData('relation_id');
				if (relationId) {
					if (this.totalMoney > 2) {
						that.$queue.showLoading('结算中...');
						this.$Request.getT('/user/getCash?invitation=' + relationId).then(res => {
							if (res.status === 0 && res.data) {
								uni.showModal({
									showCancel: false,
									title: '结算成功',
									content: '请返回【我的】点击【立即提现】'
								});
								that.getMoney();
							}
							uni.hideLoading();
						});
					} else {
						uni.showModal({
							showCancel: false,
							title: '结算提醒',
							content: '邀请必须够3人才可申请结算'
						});
					}
				} else {
					uni.navigateTo({
						url: '/pages/member/register'
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../../static/css/index.css';

	.bg {
		background-repeat: round;
		background-size: 100%;
		padding: 42upx;
		margin: 12upx;
	}

	button {
		font-size: 14px;
	}

	button::after {
		border: none;
	}
</style>
