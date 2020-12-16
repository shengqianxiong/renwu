<template>
	<view>
		<view class="category-list">
			<!-- 左侧分类导航 -->
			<scroll-view scroll-y="true" class="left">
				<view class="row" v-for="(category, index) in categoryList" :key="index" :class="[index == showCategoryIndex ? 'on' : '']"
				 @click="showCategory(index)">
					<view class="text">
						<view class="block"></view>
						{{ category.name }}
					</view>
				</view>
			</scroll-view>
			<!-- 右侧子导航 -->
			<scroll-view scroll-y="true" class="right">
				<view class="category" v-for="(category, index) in categoryList" :key="index" v-show="index == showCategoryIndex">
					<view style="text-align: left">
						<text style="color: #000000;margin-right: 8px;margin-left: 8px;font-weight: bold;">{{ categoryList[showCategoryIndex].name }}</text>
					</view>
					<view class="list" v-if="category.children.length > 0">
						<view class="box" v-for="(item, i1) in category.children" :key="i1">
							<image @click="toCategory(item.id,item.name)" :src="item.img" lazy-load="true" fade-show="true"></image>
							<view class="text">{{ item.name }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				showCategoryIndex: 0,
				headerPosition: 'fixed',
				categoryList: []
			};
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = 'fixed';
			} else {
				this.headerPosition = 'absolute';
			}
		},
		onLoad() {
			this.$queue.showLoading('加载中...');
			this.$Request.getT('/goodsType/list').then(res => {
				if (res.status === 0) {
					this.categoryList = [];
					res.data.forEach(d => {
						this.categoryList.push(d);
					});
				}
				uni.hideLoading();
			});
		},
		methods: {
			//分类切换显示
			showCategory(index) {
				this.showCategoryIndex = index;
			},
			toCategory(id, name) {
				uni.navigateTo({
					url: '/pages/categray/search?cid=' + id + '&name=' + name
				});
			}
		}
	};
</script>
<style lang="scss">
	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.category-list {
		width: 100%;
		margin-top: 20upx;
		display: flex;

		.left,
		.right {
			top: 88upx;
			bottom: 0upx;
		}

		.left {
			position: fixed;
			width: 24%;
			/* #ifndef H5 */
			top: 20upx;
			/* #endif */
			/* #ifdef H5 */
			top: 110upx;
			/* #endif */
			left: 0upx;
			background-color: #FFFFFF;

			.row {
				width: 100%;
				height: 90upx;
				display: flex;
				align-items: center;

				.text {
					width: 100%;
					position: relative;
					font-size: 28upx;
					display: flex;
					justify-content: center;
					color: #333333;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;

					.block {
						position: absolute;
						width: 0upx;
						left: 0;
					}
				}

				&.on {
					height: 100upx;
					background-color: #F2F2F2;

					.text {
						font-size: 30upx;
						font-weight: 600;
						color: #FC2C1F;

						.block {
							width: 8upx;
							height: 100upx;
							top: -72%;
						}
					}
				}
			}
		}

		.right {
			margin-left: 27%;
			width: 70%;
			left: 24%;
			background-color: #FFFFFF;
			border-radius: 30upx;

			.category {
				width: 94%;
				padding: 20upx 3%;

				.banner {
					width: 100%;
					height: 24.262vw;
					border-radius: 10upx;
					overflow: hidden;
					box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.3);

					image {
						width: 100%;
						height: 24.262vw;
					}
				}

				.list {
					margin-top: 40upx;
					width: 100%;
					display: flex;
					flex-wrap: wrap;

					.box {
						width: calc(61.44vw / 3);
						margin-bottom: 30upx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;

						image {
							width: 60%;
							height: calc(71.44vw / 3 * 0.6);
						}

						.text {
							margin-top: 5upx;
							width: 100%;
							text-align: center;
							font-size: 26upx;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}
				}
			}
		}
	}
</style>
