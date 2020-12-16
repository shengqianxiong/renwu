<template>
	<view class="index-content" style="background: #FFFFFF;">
		<image lazy-load="true" :src="bj1" style="width: 100%;height: 300upx;position: absolute;"></image>
		<view style="position: relative;top: 0;">
			<view class="content-div" style="position: fixed;width: 100%;background-color: red;z-index: 999999;">
				<image lazy-load="true" :src="imageUrl" style="width: 60upx;height: 60upx;margin: 20upx 15upx 0upx 20upx;border-radius: 50upx;"></image>
				<view class="icon_header" @tap='goSearch'>
					<image class="header-imgsuo" src="/static/rindex/sou.png"></image>
					<input type="text" placeholder="输入关键字或者粘贴宝贝标题" class="icon-headerI" style="width: 100%;" />
				</view>
				<image src="https://api.shengqianxiong.com.cn/img/20201112/ae567f90dddf4e63a5d8ac79232f0d8f.png" style="width: 45upx;height: 45upx;margin: 30upx 20upx 0upx 10upx;"
				 @click="navToLogin('/pages/member/message')"></image>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view style="padding: 150upx 16upx 0;margin: 0upx 6upx;">
			<!-- #endif -->
			<!-- #ifndef APP-PLUS -->
			<view style="padding: 130upx 16upx 0;margin: 0upx 6upx ;">
				<!-- #endif -->
				<swiper class="swiper-container" :autoplay="true" :interval="4000" :circular="true" :indicator-dots="true"
				 indicator-active-color="#e10a07" indicator-color="#cccccc" style="height: 300upx;">
					<swiper-item class="swiper-wrapper" style="" v-for="(item, index3) in bannerList" :key="index3" @tap='toNavList(item.linkUrl)'>
						<image lazy-load='true' fade-show='true' :src="item.imgUrl" v-if="item" class="banner_image" mode="scaleToFill"></image>
					</swiper-item>
				</swiper>
			</view>
			<!--首页菜单开始-->
			<view class="message_top">
				<view class="message_top_view" v-for="(item, index) in navlist" :key="index">
					<view class="message_top_view1" @tap='toNavList(item.url)' v-if="item">
						<image lazy-load="true" :src="item.image_url" style="width: 90upx;height: 90upx;"></image>
						<view style="font-size: 24upx;color: #000;">{{ item.title }}</view>
					</view>
				</view>
			</view>
			<!--首页公告开始-->
			<swiper v-if="messageList.length > 0" :autoplay="true" :vertical="true" :interval="4000" :circular="true"
			 :indicator-dots="false" style="height: 60upx;line-height: 50upx;background: #FFFFFF;margin-left: 20upx;margin-right: 32upx;border-radius: 10upx;width: 95%;padding: 5upx 0 0 20upx;">
				<block v-for="(item1, index10) in messageList" :key="index10">
					<swiper-item style="height: 60upx;">
						<view>
							<image src="../../../static/img/laba.png" style="width: 40upx;height: 40upx;margin-top: -5upx;"></image>
							<text>{{ item1.title }}</text>
						</view>
					</swiper-item>
				</block>
			</swiper>

			<view class="index-views">
				<image lazy-load="true" src="" class="index-views-image"></image>
				<view class="index-views-view1" @tap="goCommondityList('精选好物')">
					<view class="index-views-view1-top">
						精选好物
					</view>
					<view class="index-views-view1-top1">精选畅销品</view>
					<view style="display: flex;margin-left: 8upx;">
						<view class='index-views-view1-top2' v-for="(item,index) in jingXuan">
							<image lazy-load="true" :src="item.image_url" style="height: 185upx;width: 160upx;"></image>
						</view>
					</view>
				</view>
				<view class="index-views-view2" style="margin-left: 3upx;">
					<view class="index-views-view2-top" style="padding: 5upx 0upx 0 0;" @tap="goCommondityList('热卖榜单')">
						<view style="margin-top:15upx;padding-left: 10upx;">
							<view style="color:#333333;font-size:32upx;font-weight: 700">热卖榜单</view>
							<view style="color:#FFAB4B;font-size:26upx;margin-top: -3px;">高品质生活</view>
						</view>
						<view style="display: flex;margin-left: 10upx;margin-top: 3upx;">
							<view style="height: 200upx;text-align: left;width: 100%;padding-top: 10upx;" v-for="(item,index) in reMai">
								<image lazy-load="true" :src="item.image_url" style="height: 185upx;width: 165upx;"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="index-views1">
				<image lazy-load="true" src="" class="index-views-image" style="border-bottom-left-radius: 20upx;"></image>
				<view class="index-views-view2-top" style="padding: 5upx 0upx 0 5upx;" @tap="goCommondityList('每日上新')">
					<view style="margin: 15upx 0 0 15upx;color: #333333;font-size: 32upx;font-weight: 700">
						每日上新
					</view>
					<view style="color:#A375FF;margin-left: 16upx;font-size:26upx;margin-top: -3px;">热卖好货数量有限</view>
					<view style="display: flex;margin-left: 8upx;">
						<view style="height: 200upx;text-align: left;width: 100%;padding-top: 10upx;" v-for="(item,index) in meiRi">
							<image lazy-load="true" :src="item.image_url" style="height: 185upx;width: 160upx;border-radius: 15rpx;"></image>
						</view>
					</view>
				</view>
				<view class="index-views-view2">
					<view class="index-views-view2-top" style="padding: 5upx 0upx 0 0;" @tap="goCommondityList('网红同款')">
						<view style="margin-top:15upx;padding-left: 10upx;">
							<view style="color:#333333;font-size:32upx;font-weight: 700">网红同款</view>
							<view style="color:#FF3BBA;font-size:26upx;margin-top: -3px;">网红同款</view>
						</view>
						<view style="display: flex;margin-left: 16upx;margin-top: 3upx;">
							<view style="height: 200upx;text-align: left;width: 100%;padding-top: 10upx;" v-for="(item,index) in meiRi">
								<image lazy-load="true" :src="item.image_url" style="height: 185upx;width: 160upx;border-radius: 15rpx;"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="header-wus">
				<view @tap="goCommondityList('推荐商品')" style="display: flex;margin-bottom: 20upx;">
					<image lazy-load="true" src="https://api.shengqianxiong.com.cn/img/20201112/9c8153e734e44df4866d7a3a341f65f5.png"
					 style="height: 40upx;width: 40upx;"></image>
					<view style="color:#333333;width: 68%; font-size: 32upx;font-weight: 700;margin-left: 10upx;">
						为你推荐
					</view>
					<view class="fr-jutext" style="width: 20%;text-align: right;color: #999999;">查看更多</view>
					<image src="../../../static/img/my/mygoright.png" style="margin-left: 10upx;width: 14upx;height: 26upx;margin-top: 8upx;"></image>
				</view>
				<view style="display: flex;justify-content: space-between;" v-if="mrscList.length>0">
					<view v-for="(g, index) in mrscList" :key="index" class="box-float" @tap='goDetail(g.id)'>
						<image lazy-load='true' fade-show='true' style="border-radius: 16upx;width: 214upx;height: 214upx;margin-right: 20upx;"
						 class="image" :src="g.coverImg" mode="scaleToFill"></image>
						<view class="index-conts">{{g.title}}</view>
						<view>
							<view v-if="relation" class="index-conts2">￥<text style="font-size: 36upx;font-weight: 700;">{{ g.memberPrice }}</text>
								<text style="font-size: 24upx;color: grey;text-decoration:line-through;margin-left: 5px">￥{{ g.originalPrice }}</text>
							</view>

							<view v-if='!relation' class="index-conts2">
								<text style="font-size: 30upx;font-weight: 700;">￥</text>{{ g.price }}
								<text style="font-size: 24upx;color: grey;text-decoration:line-through;margin-left: 20px;font-weight: 100;">￥{{ g.originalPrice }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view style="text-align: center;margin-top: 20upx;margin-bottom: 16upx;padding-top: 16upx;">
				<text class="news_title">一一一</text>
				<text style="font-size: 36upx;color: #FF0000;">精选好物</text>
				<text class="news_title">一一一</text>
			</view>
			<!-- #ifdef H5 -->
			<view style="display: flex;flex-wrap: wrap;padding-bottom: 30upx;margin-left: 13upx">
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view style="display: flex;flex-wrap: wrap;padding-bottom: 0upx;margin-left: 15rpx">
					<!-- #endif -->
					<view style="width: 350upx;height: 510upx;background-color: #FFFFFF; border-radius: 20upx;margin-left: 10upx; margin-top: 15upx;box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;"
					 @tap='goDetail(item.id)' v-for="(item,index) in homegoodsList" :key='index' v-if="homegoodsList.length > 0">
						<image lazy-load="true" :src="item.coverImg" style="width: 350upx;height: 340upx;border-top-left-radius:20upx;border-top-right-radius:20upx;"></image>
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
					<!-- 悬浮上拉 -->
					<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']" style="bottom: 56px;">
						<text class="iconfont icon-shangla"></text>
					</view>
					<!-- 加载更多提示 -->
					<view class="s-col is-col-24" v-if="homegoodsList.length > 0">
						<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				TabCur: 0,
				day: 1,
				hour: 2,
				page: 0,
				size: 10,
				minute: 30,
				money: 0,
				scrollLeft: 0,
				relation: false,
				imageUrl: '../../../static/logo2.png',
				isEnable: '否',
				jximg1: '',
				rmimg1: '',
				newsimg1: '',
				homegoodsList: [],
				messageList: [],
				bannerList: [],
				mrscList: [],
				navlist: [],
				navlists: [],
				jingXuan: [],
				guanggao: [],
				bj1: 'https://api.shengqianxiong.com.cn/img/20201112/cbc3370ae18042ceae462663b9345223.png',
				ju2: 'http://api.shengqianxiong.com.cn/img/20201029/9edc1f657e3f477587f93b0b9939e677.png',
				ju3: 'http://api.shengqianxiong.com.cn/img/20201029/ef30a031176c44b4997e7d928fd70cf1.png',
				reMai: [],
				ShareAppimage: '',
				meiRi: [],
				ShareApptitle: '',
				loadingType: 0,
				scrollTop: false,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}
			}
		},
		onLoad(e) {
			if (e.userByinvitationId) {
				this.$queue.setData('userByinvitationId', e.userByinvitationId);
			}
			this.$Request.getT('/selfActivity/state?state=7').then(res => {
				if (res.status === 0) {
					this.ShareAppimage = res.data[0].image_url;
					this.ShareApptitle = res.data[0].title;
				}
			});
			this.getBannerList();
			this.loadMenuList();
			this.loadMessage();
			// #ifdef MP-WEIXIN
			if (e.scene) {
				const scene = decodeURIComponent(e.scene);
				this.$queue.setData('userByinvitationId', scene.split(',')[0]);
			}
			// #endif
		},
		onShareAppMessage(res) {
			let relation_id = this.$queue.getData('relation_id');
			var image = '';
			var title = '';
			return {
				path: 'pages/zysc/index/index?userByinvitationId=' + relation_id, //这是为了传参   onload(data){let id=data.id;} 
				title: this.ShareApptitle,
				imageUrl: this.ShareAppimage
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
			let relation_id = this.$queue.getData('relation_id');
			if (relation_id && relation_id !== 'undefined') {
				this.$Request.getT('/user/getImg?content=1122').then(res => {

				});
				this.relation = true;
			} else {
				this.relation = false;
			}
			let image_url = this.$queue.getData('image_url');
			if (image_url && image_url !== 'undefined') {
				this.imageUrl = image_url;
			} else {
				this.imageUrl = '/static/img/common/logo.jpg';
			}
			this.page = 0;
			this.getmrsc();
			this.getHomeGoods();
			this.getGuangGao();
			this.getSelectOrderList();

		},
		methods: {
			getSelectOrderList(type) {
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/selfCart/list?page=' + this.page + '&size=' + this.size + '&userId=' + userId).then(res => {
					if (res.status === 0) {
						if (res.data.totalElements > 0) {
							uni.setTabBarBadge({
								index: 2,
								text: '' + res.data.totalElements
							})
						}
					}
				});
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
			/**
			 * 加载公告
			 */
			loadMessage() {
				this.$Request.getT('/message/page/1/0/5').then(res => {
					if (res.status === 0) {
						this.messageList = res.data.content;
					}
				});
			},
			getGuangGao() {
				this.$Request.getT('/selfBanner/list').then(res => {
					if (res.status === 0) {
						this.guanggao = res.data;
					}
				});
			},
			getmrsc() {
				this.$Request.getT('/goods/recommend?page=0&size=3&sort=createAt').then(res => {
					if (res.status === 0) {
						this.mrscList = res.data.content;
					}
				});
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			getHomeGoods(type) {
				this.loadingType = 1;
				this.$Request.getT('/goods/homeGoods?page=' + this.page + '&size=' + this.size).then(res => {
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
						if (res.data.content.length === this.size) {
							this.loadingType = 0;
						} else {
							this.loadingType = 3;
						}
					} else {
						this.loadingType = 2;
					}
					if (type === "Refresh") {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});
			},
			goSearch() {
				uni.navigateTo({
					url: './search'
				});
			},
			goCommondityList(name) {
				uni.navigateTo({
					url: './commodityList?name=' + name
				});
			},
			loadMenuList: function() {
				this.$Request.getT('/selfActivity/list').then(res => {
					if (res.status === 0) {
						if (res.data.length > 0) {
							this.navlist = [];
							this.jingXuan = [];
							this.reMai = [];
							this.meiRi = [];
							res.data.forEach(d => {
								if (d.state == '1') {
									this.navlist.push(d);
								} else if (d.state == '2') {
									this.jingXuan.push(d);
								} else if (d.state == '3') {
									this.reMai.push(d);
								} else if (d.state == '4') {
									this.meiRi.push(d);
								}
							});
						}
					}
				});
			},
			goDetail(id) {
				uni.navigateTo({
					url: './commoditydetail?ordersId=' + id
				});
			},
			/**
			 * @param {Object} url
			 */
			toNavList: function(url) {
				let token = this.$queue.getData('token');
				if (token) {
					if (url.indexOf('/pages/') !== -1) {
						uni.navigateTo({
							url
						});
					} else {
						//#ifndef H5
						uni.navigateTo({
							url: '/pages/member/webview?url=' + url
						});
						//#endif
						//#ifdef H5
						if (url.indexOf('http://') !== -1) {
							window.location.href = url;
						} else {
							window.location.href = 'http://' + url;

						}
						//#endif
					}
				} else {
					this.goLoginInfo();
				}
			},
			getBannerList() {
				this.$Request.getT('/advert/list').then(res => {
					if (res.status === 0) {
						this.bannerList = [];
						res.data.forEach(d => {
							this.bannerList.push(d)
						});
					}
				});
			},
			goMyList() {
				let token = this.$queue.getData('token');
				if (token) {
					uni.navigateTo({
						url: '../my/myList'
					});
				} else {
					this.goLoginInfo();
				}
			},
			//统一登录跳转
			goLoginInfo() {
				uni.navigateTo({
					url: '/pages/member/register'
				});
			},
			tabSlect(item, index) {
				this.TabCur = index;
			}
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.getHomeGoods('');
		},
		onPullDownRefresh: function() {
			this.page = 0;
			this.min_id = 1;
			this.getHomeGoods("Refresh");
		}
	}
</script>

<style lang="scss">
	@import '../../../static/css/index.css';

	page {
		background: #F5F0F0;
	}

	.index-views {
		display: flex;
		position: relative;
		background: #fefeff;
		margin: 0upx 20upx 0;
		border-top-left-radius: 10upx;
		border-top-right-radius: 10upx;
		margin-top: 20upx;
	}

	.index-views-image {
		width: 50%;
		height: 300upx;
		position: relative;
		border-bottom-right-radius: 15upx;
	}

	.index-views-view1 {
		width: 50%;
		height: 284upx;
		border-radius: 12upx;
		padding: 5upx 0upx 0 5upx;
		position: absolute;
	}

	.index-views-view1-top {
		margin: 15upx 0 0 15upx;
		color: #333333;
		font-size: 32upx;
		font-weight: 700
	}

	.index-views-view1-top1 {
		color: #FF3014;
		margin-left: 16upx;
		font-size: 26upx;
		margin-top: -3px;
	}

	.index-views-view1-top2 {
		height: 200upx;
		text-align: left;
		width: 100%;
		padding-top: 10upx;
	}

	.index-views-view2 {
		width: 50%;
		height: 300upx;
		border-radius: 12upx;
	}

	.index-views-view2-top {
		width: 50%;
		height: 284upx;
		border-radius: 12upx;
		position: absolute;
	}

	.index-views1 {
		display: flex;
		position: relative;
		background: #fefeff;
		margin: 0upx 20upx 0;
		border-bottom-left-radius: 20upx;
		border-bottom-right-radius: 20upx;
	}

	.banner_image {
		width: 100%;
		height: 300upx;
		overflow: hidden;
		border-radius: 20rpx;
	}

	.message_top {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		background-color: #FFFFFF;
		padding-bottom: 35upx;
		margin: 15upx 20upx 0 20upx;
		border-radius: 15upx;
	}

	.message_top_view {
		display: flex;
		flex-direction: row;
		padding: 10upx;
		padding-left: 19upx;
	}

	.message_top_view1 {
		width: 115upx;
		height: 120upx;
		text-align: center;
		margin-top: 20upx;
	}

	.index-conts {
		width: 200upx;
		margin-top: 10upx;
		overflow: hidden;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	.indexr {
		color: #FFFFFF;
		font-size: 22upx;
		padding-left: 12upx;
		display: inline-block;
		padding-right: 13upx;
		border-radius: 8upx;
		margin-right: 8upx;
		line-height: 38upx;

		background: -moz-linear-gradient(left, #FB2C1A 0, #FF2A46 100%);
		background: -webkit-gradient(linear, left top, left right, color-stop(0, #FB2C1A), color-stop(100%, #FF2A46));
		background: -webkit-linear-gradient(left, #FB2C1A 0, #FF2A46 100%);
		background: -o-linear-gradient(left, #FB2C1A 0, #FF2A46 100%);
		background: -ms-linear-gradient(left, #FB2C1A 0, #FF2A46 100%);
		background: linear-gradient(to left, #FB2C1A 0, #FF2A46 100%);
	}

	.index-conts2 {
		font-size: 30upx;
		position: absolute;
		float: left;
		color: #FD3B2C;
		width: 80%;
		text-align: left;
	}

	.header-imgsuo {
		width: 31upx;
		height: 31upx;
		margin-right: 10upx;
		align-items: center;
		display: block;
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

	.icon_header {
		width: 530upx;
		display: flex;
		height: 72upx;
		align-items: center;
		line-height: 40upx;
		padding: 10upx 20upx;
		background-color: #FFFFFF;
		border-radius: 10upx;
		margin-top: 14upx;
	}

	.swiper-container {
		height: 300upx;
		border-radius: 4upx;
		transform: translateY(0);
		overflow: hidden;
		overflow: hidden !important;
		/* 兼容IOS，否则在swiper组件内的布局都不受border-radius和overflow的约束 */
		transform: translateY(0) !important;
	}

	.content-div {
		width: 100%;
		display: flex;
		justify-content: space-around;
		z-index: 999;
		height: 104upx;
		/* #ifdef APP-PLUS */
		height: 154upx;
		margin-top: -20rpx;
		padding-top: 55rpx;
		/* #endif */
	}

	.icon-headerI {
		font-size: 28upx;
		color: #dcdcdc;
	}

	.news_title {
		font-weight: bold;
		color: #FF0000;
		margin-right: 32upx;
		margin-left: 32upx;
		width: 12upx;
	}

	.header-wus {
		background-color: #FFFFFF;
		margin: 20upx 20upx 0upx 20upx;
		border-radius: 10upx;
		padding: 28upx 28upx 50upx;
	}

	.header-wus2 {
		color: #333333;
		font-size: 32upx;
		margin-bottom: 10upx;
		font-weight: bold;
	}

	.box-float {
		width: 235upx;
		position: relative;
		border-radius: 10upx;
		padding: 6upx 0;
	}
</style>
