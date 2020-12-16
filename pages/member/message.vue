<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in tabList" :key="index" class="nav-item" :class="{ current: tabFromIndex === item.state }" @click="tabClicks(item.state)">
				{{ item.text }}
			</view>
		</view>
		<view v-for="(item, index) in list" :key="index" class="item" @tap='copyTitle(item.content)'>
			<view style="color: #333333;font-size: 32upx;width: 600upx;overflow: hidden;text-overflow: ellipsis;white-space:nowrap">{{ item.title }}</view>
			<view style="color: #666666;font-size: 28upx;margin-top: 10upx;">{{ item.content }}</view>

			<view style="margin-top: 10upx;color: #999999;font-size: 28upx;text-align: right;">{{ item.createAt }}</view>
		</view>
		<view v-if="list.length === 0" style="background: #FFFFFF;text-align: center;padding-top: 140upx">暂无消息</view>
	</view>
</template>

<script>
import empty from '@/components/empty';

export default {
	components: {
		empty
	},
	data() {
		return {
			tabFromIndex: 5,
			tabCurrentIndex: 0,
			fromInfo: 5,
			list: [],
			page: 0,
			scrollTop: false,
			tabList: [
				{
					state: 5,
					text: '用户消息',
					totalElements: 0
				},
				{
					state: 4,
					text: '订单消息',
					totalElements: 0
				}
			]
		};
	},
	onPageScroll: function(e) {
		this.scrollTop = e.scrollTop > 200;
	},
	onReachBottom: function() {
		this.page = this.page + 1;
		this.loadData();
	},
	onLoad(options) {
		this.$queue.showLoading("加载中...")
		this.loadData();
	},
	methods: {
		//顶部渠道点击
		tabClicks(index) {
			this.list = [];
			this.page = 0;
			this.tabFromIndex = index;
			this.$queue.showLoading("加载中...")
			this.loadData();
		},
		//获取消息列表
		loadData() {
			let that = this;
			let number = 10;
			let token = this.$queue.getData('token');
			if (token) {
				this.$Request
					.getT('/message/findType/' + this.$queue.getData('userId') + '/' + parseInt(this.tabFromIndex) + '/' + parseInt(this.page) + '/' + number)
					.then(res => {
						if (res.status === 0) {
							res.data.content.forEach(d => {
								this.list.push(d);
							});
						}
						uni.hideLoading();
					});
			}
		},
		copyTitle: function(item) {
			uni.setClipboardData({
				data: item,
				success: r => {
					this.$queue.showToast('复制成功');
				}
			});
		}
	}
};
</script>

<style lang="scss">
page,
page {
	background: #ffffff;
}
.content {
	background: #ffffff;
	height: 100%;
}

.navbar {
	display: flex;
	height: 40px;
	padding: 0 5px;
	background: #fff;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 10;

	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 15px;
		color: $font-color-dark;
		position: relative;

		&.current {
			color: $base-color;

			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 44px;
				height: 0;
				border-bottom: 2px solid $base-color;
			}
		}
	}
}

.item {
	background: white;
	padding: 16rpx;
	margin: 16rpx;
	font-size: 28rpx;
	box-shadow: 7px 9px 34px rgba(0, 0, 0, 0.1);
	border-radius: 16upx;
}
</style>