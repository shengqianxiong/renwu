<template>
	<view class="page" style="background: #FFFFFF;">
		<view class="feedback-title">
			<text>问题和意见</text>
			<text class="feedback-quick" @tap="chooseMsg">快速键入</text>
		</view>
		<view class="feedback-body"><textarea placeholder="请详细描述你的问题和意见..." v-model="sendDate.content" class="feedback-textare" /></view>
		<view class="feedback-title"><text>QQ/邮箱</text></view>
		<view class="feedback-body"><input class="feedback-input" v-model="sendDate.contact" placeholder="方便我们联系你 " /></view>
		<view class="feedback-title feedback-star-view">
			<text>应用评分</text>
			<view class="feedback-star-view">
				<text class="feedback-star" v-for="(value, key) in stars" :key="key" :class="key < sendDate.score ? 'active' : ''" @tap="chooseStar(value)"></text>
			</view>
		</view>
		<button type="primary" style="background: #e10a07" class="feedback-submit" @tap="send">提交</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			msgContents: ['界面显示错乱', '启动缓慢，卡出翔了', 'UI无法直视，丑哭了', '偶发性崩溃'],
			stars: [1, 2, 3, 4, 5],
			imageList: [],
			sendDate: {
				score: 0,
				content: '',
				contact: ''
			}
		};
	},
	onLoad() {
		let deviceInfo = {
			appid: plus.runtime.appid,
			imei: plus.device.imei, //设备标识
			p: plus.os.name === 'Android' ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
			md: plus.device.model, //设备型号
			app_version: plus.runtime.version,
			plus_version: plus.runtime.innerVersion, //基座版本号
			os: plus.os.version,
			net: '' + plus.networkinfo.getCurrentType()
		};
		this.sendDate = Object.assign(deviceInfo, this.sendDate);
	},
	methods: {
		close(e) {
			this.imageList.splice(e, 1);
		},
		chooseMsg() {
			//快速输入
			uni.showActionSheet({
				itemList: this.msgContents,
				success: res => {
					this.sendDate.content = this.msgContents[res.tapIndex];
				}
			});
		},
		chooseImg() {
			//选择图片
			uni.chooseImage({
				sourceType: ['camera', 'album'],
				sizeType: 'compressed',
				count: 8 - this.imageList.length,
				success: res => {
					this.imageList = this.imageList.concat(res.tempFilePaths);
				}
			});
		},
		chooseStar(e) {
			//点击评星
			this.sendDate.score = e;
		},
		previewImage() {
			//预览图片
			uni.previewImage({
				urls: this.imageList
			});
		},
		send() {
			//发送反馈
			console.log(JSON.stringify(this.sendDate));

			if (!this.sendDate.content) {
				uni.showToast({
					icon: 'none',
					title: '请输入反馈内容'
				});
				return;
			}
			if (!this.sendDate.contact) {
				uni.showToast({
					icon: 'none',
					title: '请填写QQ或邮箱'
				});
				return;
			}
			uni.report('意见反馈', this.sendDate);
			this.$queue.showLoading('加载中...');
			this.$Request
				.postJson('/message/add', {
					state: 2,
					title: this.sendDate.contact,
					content: JSON.stringify(this.sendDate)
				})
				.then(res => {
					if (res.status === 0) {
						uni.showToast({
							title: '反馈成功'
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					} else {
						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '反馈失败',
							content: res.msg
						});
					}
				});
		}
	}
};
</script>

<style>
@font-face {
	font-family: uniicons;
	font-weight: normal;
	font-style: normal;
	src: url('https://img-cdn-qiniu.dcloud.net.cn/fonts/uni.ttf') format('truetype');
}
page {
	background-color: #FFFFFF;
}
view {
	font-size: 28upx;
}
.input-view {
	font-size: 28upx;
}
.close-view {
	text-align: center;
	line-height: 14px;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background: #ff5053;
	color: #ffffff;
	position: absolute;
	top: -6px;
	right: -4px;
	font-size: 12px;
}
/* 上传 */
.uni-uploader {
	flex: 1;
	flex-direction: column;
}
.uni-uploader-head {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.uni-uploader-info {
	color: #b2b2b2;
}
.uni-uploader-body {
	margin-top: 16upx;
}
.uni-uploader__files {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.uni-uploader__file {
	margin: 10upx;
	width: 210upx;
	height: 210upx;
}
.uni-uploader__img {
	display: block;
	width: 210upx;
	height: 210upx;
}
.uni-uploader__input-box {
	position: relative;
	margin: 10upx;
	width: 208upx;
	height: 208upx;
	border: 2upx solid #d9d9d9;
}
.uni-uploader__input-box:before,
.uni-uploader__input-box:after {
	content: ' ';
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	background-color: #d9d9d9;
}
.uni-uploader__input-box:before {
	width: 4upx;
	height: 79upx;
}
.uni-uploader__input-box:after {
	width: 79upx;
	height: 4upx;
}
.uni-uploader__input-box:active {
	border-color: #999999;
}
.uni-uploader__input-box:active:before,
.uni-uploader__input-box:active:after {
	background-color: #999999;
}
.uni-uploader__input {
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}

/*问题反馈*/
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 20upx;
	color: #8f8f94;
	font-size: 28upx;
}
.feedback-star-view.feedback-title {
	justify-content: flex-start;
	margin: 0;
}
.feedback-quick {
	position: relative;
	padding-right: 40upx;
}
.feedback-quick:after {
	font-family: uniicons;
	font-size: 40upx;
	content: '\e581';
	position: absolute;
	right: 0;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.feedback-body {
	font-size: 32upx;
	padding: 16upx;
	margin: 16upx;
	border-radius: 16upx;
	background: #F8F8F8;
}
.feedback-textare {
	height: 200upx;
	font-size: 34upx;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 20upx 30upx 0;
}
.feedback-input {
	font-size: 32upx;
	height: 60upx;
	padding: 15upx 20upx;
	line-height: 60upx;
}
.feedback-uploader {
	padding: 22upx 20upx;
}
.feedback-star {
	font-family: uniicons;
	font-size: 40upx;
	margin-left: 6upx;
}
.feedback-star-view {
	margin-left: 20upx;
}
.feedback-star:after {
	content: '\e408';
}
.feedback-star.active {
	color: #ffb400;
}
.feedback-star.active:after {
	content: '\e438';
}
.feedback-submit {
	background: #007aff;
	color: #ffffff;
	margin: 20upx;
}
</style>
