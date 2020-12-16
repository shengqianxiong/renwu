<template>
	<view style="background: white;padding:32upx;border-bottom: 1px solid #F6F6F6">
		<!--头部标题介绍-->
		<view style="display: flex">
			<view>
				<image class="headImage" src="../../static/logo2.png"></image>
			</view>
			<view class="box-name">
				<view class="name" style="width: 70%">地摊侠</view>
			</view>
		</view>
		<image v-if="images" @click="previewPhoto" :src="images" style="margin: 16upx;width: 250upx;height: 300upx;"></image>
		<!--短文-->
		<view style="text-align: left;display: flex;margin-top: 8px;padding: 16upx;">
			<view>
				<view @click="copyHref()" class="content" v-html="content"></view>
			</view>
		</view>

		<!--底部-->
		<view style="text-align: right;margin-top: 16px;margin-right: 16px">

			<text v-if="url" class="total" style="color: #E10A07;" @click="goPage()">
				立即查看
			</text>
			<text class="total">{{ showTime }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'orange-handpick',
		props: ['total', 'to', 'url', 'content', 'images', 'copy_content', 'showTime'],
		methods: {
			goPage() {
				//#ifdef APP-PLUS
				plus.runtime.openURL(this.url, function(res) {
					console.log(res);
				});
				//#endif
				//#ifdef H5
				window.location.href = this.url
				//#endif

			},
			openGoods() {
				let relation_id = this.$queue.getData('relation_id');
				if (relation_id) {
					uni.navigateTo({
						url: '/pages/detail/goodsinfo?itemid=' + this.to + '&relation_id=' + relation_id
					});
				} else {
					uni.navigateTo({
						url: '/pages/detail/goodsinfo?itemid=' + this.to
					});
				}
			},
			/**
			 * 复制链接
			 */
			copyHref() {
				let userId = this.$queue.getData('userId');

				if (userId) {
					this.$Request.getT('/user/' + userId).then(res => {
						if (res.status === 0) {
							if (res.data.phone) {
								uni.setClipboardData({
									data: this.content,
									success: r => {
										uni.showModal({
											title: '复制成功',
											content: '请打开【手机淘宝】领取',
											showCancel: false
										});
									}
								});
							} else {
								uni.navigateTo({
									url: '/pages/public/mobile'
								});
							}
						}
					});
				} else {
					uni.navigateTo({
						url: '/pages/member/register'
					});
				}
			},
			/* 预览照片 */
			previewPhoto() {

				let list = []
				list.push(this.images)

				uni.previewImage({
					current: list[0],
					urls: list,
					longPressActions: {
						itemList: ['保存图片'],
						success: function(res) {
							// console.error(res);
							uni.getImageInfo({
								src: list[0],
								success: function(image) {
									console.log('图片信息：', JSON.stringify(image));
									uni.saveImageToPhotosAlbum({
										filePath: image.path,
										success: function() {
											uni.showToast({
												title: '图片保存成功',
												icon: 'none',
												duration: 3000
											});
										}
									});
								}
							});
						}
					}
				});
			},
			/**
			 * 保存图片
			 * @param url
			 */
			toSave(url) {
				//#ifndef H5
				uni.getImageInfo({
					src: url,
					success: function(image) {
						console.log('图片信息：', JSON.stringify(image));
						uni.saveImageToPhotosAlbum({
							filePath: image.path,
							success: function() {
								console.log('save success');
								uni.showToast({
									title: '图片保存成功',
									icon: 'none',
									duration: 3000
								});
							}
						});
					}
				});

				//#endif
			}
		},
		filters: {
			formatDate: function(value) {
				// value = parseInt(value + "000");
				// let date = new Date(value);
				// let y = date.getFullYear();
				// let MM = date.getMonth() + 1;
				// MM = MM < 10 ? ('0' + MM) : MM;
				// let d = date.getDate();
				// d = d < 10 ? ('0' + d) : d;
				// let h = date.getHours();
				// h = h < 10 ? ('0' + h) : h;
				// let m = date.getMinutes();
				// m = m < 10 ? ('0' + m) : m;
				// let s = date.getSeconds();
				// s = s < 10 ? ('0' + s) : s;
				// return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
				return value.split('.')[0].replace('T', ' ');
			}
		}
	};
</script>

<style scoped>
	.headImage {
		margin-right: 8px;
		height: 35px;
		width: 35px;
		border-radius: 50%;
	}

	.name {
		font-size: 15px;
		color: #333333;
	}

	.total {
		font-size: 14px;
		color: #999999;
		padding-left: 16px;
	}

	.box-name {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.box-click {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content {
		font-size: 15px;
	}

	.box-float {
		float: left;
		padding-top: 5px;
		padding-left: 5px;
	}

	.image {
		height: 200upx;
		width: 200upx;
	}
</style>
