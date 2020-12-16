<template>
	<view style="text-align: left">
		<view v-for="(item, index) in list" :key="index" class="item">
			<view>
				<view style="margin-bottom: 8upx;text-align: right;">
					<text style="margin-bottom: 8upx;color: #0e80d2" v-if="item.state==1"> 提现成功</text>
					<text style="margin-bottom: 8upx;color: #0e80d2" v-if="item.state==0"> 提现中</text>
					<text style="margin-bottom: 8upx;color: #e10a07" v-if="item.state==-1"> 提现失败</text>
				</view>
				
				<view style="color: #999999;font-size: 28upx;">
					<view style="margin-bottom: 8upx"> 支付宝账号 {{item.zhifubao}}</view>
					<view style="margin-bottom: 8upx"> 支付宝姓名 {{item.zhifubaoName}}</view>
					<view style="margin-bottom: 8upx"> 发起时间 {{item.createAt}}</view>
					<view style="margin-bottom: 8upx" v-if="item.state==1">成功时间 {{item.outAt}}</view>
					<view style="margin-bottom: 8upx;color: #e10a07" v-if="item.state==-1">{{item.refund}}</view>
					
					<view style="margin-bottom: 8upx;text-align: right;">
						<!-- 提现金额： -->
						<text style="color: #e10a07;font-size: 32upx;font-weight: 600"> ￥{{item.money}}</text>
					</view>
				</view>

			</view>
		</view>
		<view v-if="list.length===0" style="text-align: center;margin-top: 60px">暂无记录</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
			}
		},
		onLoad: function(e) {
			this.$queue.showLoading("加载中...");
			this.getMoney();
		},

		methods: {
			getMoney() {
				let that = this;
				let token = this.$queue.getData("token");
				let relationId = this.$queue.getData("relation_id");
				if (token) {
					//可以提现金额查询预估收入查询
					this.$Request.getT("/cash/list/" + relationId).then(res => {
						if (res.status === 0 && res.data) {
							that.list = res.data;
						}
						uni.hideLoading();
					});
				}

			},
		},

	}
</script>

<style lang='scss'>
	@import "../../static/css/index.css";

	page {
		background: #FFFFFF;
	}

	.item {
		background: white;
		padding: 32rpx;
		margin: 32rpx;
		font-size: 28rpx;
		box-shadow: 7px 9px 34px rgba(0, 0, 0, 0.1);
		border-radius: 16upx;
	}
</style>
