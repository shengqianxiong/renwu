<template>
	<view>
		<view style="width: 95%;height: 180upx;background: #FFFFFF; border-radius: 20upx;padding: 20upx;margin: 20upx;">
			<view style="display: flex;margin: 15upx 0 0 20upx;">
				<image :src="list.img" style="width: 20%; height: 120upx;"></image>
				<view style="margin-left: 20upx;width: 75%;">
					<view style="font-size: 34upx;color: #FF332F;font-weight: bold;margin-top: 10upx;">¥ {{list.price}}</view>
					<view style="width: 100%;margin-top: 10upx;font-size: 28upx;color: #333333;font-weight: 500;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{list.title}}</view>
				</view>
			</view>
		</view>
		<view style="background: #FFFFFF;padding: 20upx;margin: 20upx;width: 95%;border-radius: 20rpx;">
			<view style="font-size: 32rpx;color: #333333;">分享你的使用体验吧</view>
			<view class="orang-view">
				<view><textarea placeholder="写出您的感受，可以帮助更多小伙伴哦~" v-model="content" style="color: #999999;font-size: 26rpx;width: 100%;" /></view>
			</view>
			<view class="header-ping">
				<text class="quanbu2" style="font-weight: bold;">
					服务评分
				</text>
				<view class="feedback-star-view">
					<text class="feedback-star" style="font-size: 42upx;" v-for="(value, key) in stars" :key="key" :class="key < score ? 'active' : ''"
					 @tap="chooseStar(value)"></text>
				</view>
				<text style="color: #999999;font-size: 28upx;text-align: right;margin-left: 20upx;width: 24%;">{{evaluate}}</text>
			</view>
		<shmily-drag-image :list.sync="imageList"></shmily-drag-image>
		</view>
		<button style="background-color: #FF332F;width: 690upx;color: #FFFFFF;border-radius: 20rpx;margin-top: 40rpx;" @click='addPinglun()'>发布评论</button>
		
	</view>
</template>

<script>
	import shmilyDragImage from '@/components/shmily-drag-image/shmily-drag-image.vue'
export default {
	components: {
		shmilyDragImage
	},
	data() {
		return {
			stars: [1, 2, 3, 4, 5],
			imageList: [],
			userImage:'',
			userName:'',
			userId:'',
			content:'',
			list:[],
			evaluate:'',
				score: 0
		};
	},
	onLoad(d) {
		let ordersId = d.ordersId;
		this.userId = this.$queue.getData('userId');
		if(this.userId){
			this.getUserInfo(this.userId);
		}
		if(ordersId){
			this.getListById(ordersId);
		}
	},
	methods: {
		chooseStar(e) {
			this.score = e;
			// 1非常差，2差，3，一般，4好，5非常好
			if(e==1){
				this.evaluate='非常不满意'
			}else if(e==2){
				this.evaluate='不满意'
			}else if(e==3){
				this.evaluate='一般满意'
			}else if(e==4){
				this.evaluate='满意'
			}else if(e==5){
				this.evaluate='非常满意'
			}
		},
		getUserInfo(userId) {
			this.$Request.getT('/user/' + userId).then(res => {
				if (res.status === 0) {
					this.userImage = res.data.image_url;
					this.userName = res.data.nickName;
					}
			});
		},
		getListById(id) {
			uni.showLoading({
				title: '加载中...'
			});
			this.$Request.getT('/orders/find?id=' + id).then(res => {
				if (res.status === 0) {
					this.list = res.data;
				}
				uni.hideLoading();
			});
		},
		addPinglun(){
			uni.showLoading({
				title: '加载中...'
			});
			var image = '';
			for (var i = 0; i < this.imageList.length; i++) {
				if(i === 0){
					image = this.imageList[i];
				}else{
					image = image + ',' + this.imageList[i];
				}
			}
			if(this.content == ''){
				uni.hideLoading();
				this.$queue.showToast('评论信息不能为空！');
				return;
			}
			
			if(this.score === 0){
				uni.hideLoading();
				this.$queue.showToast('评分不能为空');
				return;
			}
			var scoreType = 0;
			if(this.score === 1 || this.score === 2){
				scoreType = 3;
			}else if(this.score === 3){
				scoreType = 2;
			}else{
				scoreType = 1;
			}
			let data = {
				content:this.content,
				goodsId:this.list.goodsId,
				img:image,
				orderId:this.list.id,
				sku:this.list.detailJson,
				skuId:this.list.skuId,
				score:this.score,
				userHeader:this.userImage,
				scoreType:scoreType,
				userId:this.userId,
				userName:this.userName
			}
			this.$Request.postJson('/selfGoodsComment/save',data).then(res =>{
				if(res.status === 0){
					uni.showToast({
						title: '评论成功！'
					});
					setTimeout(res =>{
						uni.hideLoading();
						uni.navigateBack();
					},1000);
				}
			});
		}
	}
};
</script>

<style>
page {
	background-color: #F2F2F2;
}

.ping-img{
		width: 38upx;height: 38upx; vertical-align: text-top;margin-right: 14upx;
	}
	.orang-view{
		background: #F5F6F8; padding: 20upx;border-radius: 15upx;margin: 20upx 0 40upx;
	}
	.header-ping{
		display: flex;justify-content: space-around;padding-bottom: 20upx;
	}
	/* 星星 */
		@font-face {
			font-family: uniicons;
			font-weight: normal;
			font-style: normal;
			src: url('https://img-cdn-qiniu.dcloud.net.cn/fonts/uni.ttf') format('truetype');
		}
		.ping-view2{font-size: 24upx;color: #999999;margin-top:20upx;}
		.feedback-star {
			font-family: uniicons;
			margin-left: 18upx;
			color: #999999;
		}
		.feedback-star-view {
			margin-left: 0upx;
			margin-top: -2upx;
		}
		.feedback-star:after {
			content: '\e408';
		}
		.feedback-star.active {
			color: #FF440C;
		}
		.feedback-star.active:after {
			content: '\e438';
		}
		/* 星星 */
		
</style>
