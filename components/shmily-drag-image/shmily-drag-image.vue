<template>
	<!-- 多图上传支持拖拽排序 -->
	<view class="con">
		<movable-area class="area" :style="{ height: areaHeight }" @mouseenter="mouseenter" @mouseleave="mouseleave">
			<block v-for="(item, index) in imageList" :key="item.id">
				<movable-view class="view" :x="item.x" :y="item.y" direction="all" :damping="40" :disabled="item.disable" @change="onChange($event, item)"
				 @touchstart="touchstart(item)" @mousedown="touchstart(item)" @touchend="touchend(item)" @mouseup="touchend(item)"
				 :style="{ width: viewWidth + 'px', height: viewWidth + 'px', 'z-index': item.zIndex, opacity: item.opacity }">
					<view class="area-con" :style="{ width: childWidth, height: childWidth, transform: 'scale(' + item.scale + ')' }">
						<image class="pre-image" :src="item.src" mode="aspectFill"></image>
						<view class="del-con" @click="delImage(item, index)" @touchstart.stop="delImageMp(item, index)" @touchend.stop="nothing()"
						 @mousedown.stop="nothing()" @mouseup.stop="nothing()">
							<view class="del-wrap">
								<image class="del-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAhdEVYdENyZWF0aW9uIFRpbWUAMjAyMDowNzoyNSAyMTo1NDoyOU4TkJAAAADcSURBVFhH7ZfRCoMwDEXLvkjwwVf/bH/emmAyN6glTW9WBjsgwm28OeCLpj81Sil7zvlJ90UiONS/yY5VogsO6XrBg3IEQ5a/s8vRSWUAKmLqp2w5jz5BiNQEGMo3GbloDLtFXJ1IkaEuhAiiY6gEIqB4yqACSk9piIBiKQ8VUFpLviKg3C2rESKgWERCBZSWiEfgIfffYvrrsAgoISJ3Apy3zuTxcSxLQkV6ykNEPKVQkZEyiAiiZKgDIaC4upACSlcn5fM/+WuDCAHF1E/Z/N9AhkMZnPNDPI+UDjPIXgAQIGjNAAAAAElFTkSuQmCC"></image>
							</view>
						</view>
					</view>
				</movable-view>
			</block>
			<view class="add" v-if="imageList.length < number" :style="{ top: add.y, left: add.x, width: viewWidth + 'px', height: viewWidth + 'px' }"
			 @click="addImages">
				<view class="add-wrap" :style="{ width: childWidth, height: childWidth }">
					<image style="width: 192rpx;height: 192rpx;" src="data:image/png;base64,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"></image>
				</view>
			</view>
		</movable-area>
	</view>
</template>

<script>
	import configdata from '../../common/config.js';
	export default {
		data() {
			return {
				imageList: [],
				width: 0,
				add: {
					x: 0,
					y: 0
				},
				colsValue: 0,
				viewWidth: 0,
				tempItem: null,
				timer: null,
				changeStatus: true,
				preStatus: true,
			}
		},
		props: {
			// 返回排序后图片
			list: {
				type: Array,
				default: function() {
					return []
				}
			},
			// 选择图片数量限制
			number: {
				type: Number,
				default: 5
			},
			// 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位 rpx
			imageWidth: {
				type: Number,
				default: 230
			},
			// 图片列数（cols > 0 则 imageWidth 无效）
			cols: {
				type: Number,
				default: 3
			},
			// 图片周围空白填充，单位 rpx
			padding: {
				type: Number,
				default: 10
			},
			// 拖动图片时放大倍数 [0, ∞)
			scale: {
				type: Number,
				default: 1.1
			},
			// 拖动图片时不透明度
			opacity: {
				type: Number,
				default: 0.7
			},
			// 自定义添加（需配合 @aaddImage 事件使用）
			custom: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			areaHeight() {
				if (this.imageList.length < this.number) {
					return Math.ceil((this.imageList.length + 1) / this.colsValue) * this.viewWidth + 'px'
				} else {
					return Math.ceil(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
				}
			},
			childWidth() {
				return this.viewWidth - this.rpx2px(this.padding) * 2 + 'px'
			},
		},
		created() {
			this.width = uni.getSystemInfoSync().windowWidth
			this.viewWidth = this.rpx2px(this.imageWidth)
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this)
			query.select('.area').boundingClientRect(data => {
				this.colsValue = Math.floor(data.width / this.viewWidth)
				if (this.cols > 0) {
					this.colsValue = this.cols
					this.viewWidth = data.width / this.cols
				}
				for (let item of this.list) {
					this.addProperties(item)
				}
			})
			query.exec()
		},
		methods: {
			onChange(e, item) {
				if (!item) return
				item.oldX = e.detail.x
				item.oldY = e.detail.y
				if (e.detail.source === 'touch') {
					if (item.moveEnd) {
						item.offset = Math.sqrt(Math.pow(item.oldX - item.absX * this.viewWidth, 2) + Math.pow(item.oldY - item.absY *
							this.viewWidth, 2))
					}
					let x = Math.floor((e.detail.x + this.viewWidth / 2) / this.viewWidth)
					if (x >= this.colsValue) return
					let y = Math.floor((e.detail.y + this.viewWidth / 2) / this.viewWidth)
					let index = this.colsValue * y + x
					if (item.index != index && index < this.imageList.length) {
						this.changeStatus = false
						for (let obj of this.imageList) {
							if (item.index > index && obj.index >= index && obj.index < item.index) {
								this.change(obj, 1)
							} else if (item.index < index && obj.index <= index && obj.index > item.index) {
								this.change(obj, -1)
							} else if (obj.id != item.id) {
								obj.offset = 0
								obj.x = obj.oldX
								obj.y = obj.oldY
								setTimeout(() => {
									this.$nextTick(() => {
										obj.x = obj.absX * this.viewWidth
										obj.y = obj.absY * this.viewWidth
									})
								}, 0)
							}
						}
						item.index = index
						item.absX = x
						item.absY = y
						this.sortList()
					}
				}
			},
			change(obj, i) {
				obj.index += i
				obj.offset = 0
				obj.x = obj.oldX
				obj.y = obj.oldY
				obj.absX = obj.index % this.colsValue
				obj.absY = Math.floor(obj.index / this.colsValue)
				setTimeout(() => {
					this.$nextTick(() => {
						obj.x = obj.absX * this.viewWidth
						obj.y = obj.absY * this.viewWidth
					})
				}, 0)
			},
			touchstart(item) {
				this.imageList.forEach(v => {
					v.zIndex = v.index + 9
				})
				item.zIndex = 99
				item.moveEnd = true
				this.tempItem = item
				this.timer = setTimeout(() => {
					item.scale = this.scale
					item.opacity = this.opacity
					clearTimeout(this.timer)
					this.timer = null
				}, 200)
			},
			touchend(item) {
				this.previewImage(item)
				item.scale = 1
				item.opacity = 1
				item.x = item.oldX
				item.y = item.oldY
				item.offset = 0
				item.moveEnd = false
				setTimeout(() => {
					this.$nextTick(() => {
						item.x = item.absX * this.viewWidth
						item.y = item.absY * this.viewWidth
						this.tempItem = null
						this.changeStatus = true
					})
				}, 0)
			},
			previewImage(item) {
				if (this.timer && this.preStatus && this.changeStatus && item.offset < 28.28) {
					clearTimeout(this.timer)
					this.timer = null
					let src = this.list.findIndex(v => v === item.src)
					uni.previewImage({
						urls: this.list,
						current: src,
						success: () => {
							this.preStatus = false
							setTimeout(() => {
								this.preStatus = true
							}, 600)
						}
					})
				} else if (this.timer) {
					clearTimeout(this.timer)
					this.timer = null
				}
			},
			mouseenter() {
				//#ifdef H5
				this.imageList.forEach(v => {
					v.disable = false
				})
				//#endif

			},
			mouseleave() {
				//#ifdef H5
				if (this.tempItem) {
					this.imageList.forEach(v => {
						v.disable = true
						v.zIndex = v.index + 9
						v.offset = 0
						v.moveEnd = false
						if (v.id == this.tempItem.id) {
							if (this.timer) {
								clearTimeout(this.timer)
								this.timer = null
							}
							v.scale = 1
							v.opacity = 1
							v.x = v.oldX
							v.y = v.oldY
							this.$nextTick(() => {
								v.x = v.absX * this.viewWidth
								v.y = v.absY * this.viewWidth
								this.tempItem = null
							})
						}
					})
					this.changeStatus = true
				}
				//#endif
			},
			addImages() {
				console.log('addImages')
				if (this.custom) {
					this.$emit('addImage')
				} else {
					let checkNumber = this.number - this.imageList.length
					uni.chooseImage({
						count: checkNumber,
						sourceType: ['album', 'camera'],
						success: res => {
							let count = checkNumber <= res.tempFilePaths.length ? checkNumber : res.tempFilePaths.length
							for (let i = 0; i < count; i++) {
								this.$queue.showLoading("上传中...");
								uni.uploadFile({ // 上传接口
									url: this.config("APIHOST1") + '/alioss/upload', //真实的接口地址
									filePath: res.tempFilePaths[i],
									name: 'file',
									success: (uploadFileRes) => {
										// this.addProperties(JSON.parse(uploadFileRes.data).data.src) //列表接口
										this.addProperties(JSON.parse(uploadFileRes.data).data)
										uni.hideLoading();
									}
								});
							}
						}
					})
				}
			},
			config: function(name) {
				var info = null;
				if (name) {
					var name2 = name.split("."); //字符分割
					if (name2.length > 1) {
						info = configdata[name2[0]][name2[1]] || null;
					} else {
						info = configdata[name] || null;
					}
					if (info == null) {
						let web_config = cache.get("web_config");
						if (web_config) {
							if (name2.length > 1) {
								info = web_config[name2[0]][name2[1]] || null;
							} else {
								info = web_config[name] || null;
							}
						}
					}
				}
				return info;
			},
			addImage(image) {
				this.addProperties(image)
			},
			delImage(item, index) {
				this.imageList.splice(index, 1)
				for (let obj of this.imageList) {
					if (obj.index > item.index) {
						obj.index -= 1
						obj.x = obj.oldX
						obj.y = obj.oldY
						obj.absX = obj.index % this.colsValue
						obj.absY = Math.floor(obj.index / this.colsValue)
						this.$nextTick(() => {
							obj.x = obj.absX * this.viewWidth
							obj.y = obj.absY * this.viewWidth
						})
					}
				}
				this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
				this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
				this.sortList()
			},
			delImageMp(item, index) {
				//#ifdef MP
				this.delImage(item, index)
				//#endif
			},
			sortList() {
				let list = this.imageList.slice()
				console.log('获取到上传图片的列表', this.imageList)
				list.sort((a, b) => {
					return a.index - b.index
				})
				for (let i = 0; i < list.length; i++) {
					list[i] = list[i].src
				}
				console.log('list', list)
				this.$emit('update:list', list)
			},
			addProperties(item) {
				let absX = this.imageList.length % this.colsValue
				let absY = Math.floor(this.imageList.length / this.colsValue)
				let x = absX * this.viewWidth
				let y = absY * this.viewWidth
				this.imageList.push({
					src: item,
					x,
					y,
					oldX: x,
					oldY: y,
					absX,
					absY,
					scale: 1,
					zIndex: 9,
					opacity: 1,
					index: this.imageList.length,
					id: this.guid(),
					disable: false,
					offset: 0,
					moveEnd: false
				})
				this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
				this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
				this.sortList()
			},
			nothing() {},
			rpx2px(v) {
				return this.width * v / 750
			},
			guid() {
				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}
				return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
			}
		}
	}
</script>

<style lang="scss" scoped>
	.con {

		// padding: 30rpx;
		.area {
			width: 100%;

			.view {
				display: flex;
				justify-content: center;
				align-items: center;

				.area-con {
					position: relative;

					.pre-image {
						width: 100%;
						height: 100%;
					}

					.del-con {
						position: absolute;
						top: -8rpx;
						right: -4rpx;
						padding: 0 0 20rpx 20rpx;

						.del-wrap {
							width: 36rpx;
							height: 36rpx;
							background-color: #ff0000;
							border-radius: 50%;
							display: flex;
							justify-content: center;
							align-items: center;

							.del-image {
								width: 20rpx;
								height: 20rpx;
							}
						}
					}
				}
			}

			.add {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;

				.add-wrap {
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #FFFFFF;
				}
			}
		}
	}
</style>
