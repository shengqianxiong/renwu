<template>

    <view style="padding:16px;background-color: #fff;">
        <!--头部标题介绍-->
        <view style="display: flex">
            <view>
                <image class="headImage" src="../../static/logo2.png"></image>
            </view>
            <view class="box-name">
                <view class="name" style="width: 75%">
                    <text>地摊侠</text><br>
					<text class="total">{{ showTime | formatDate }}</text>
                </view>
                <view style="width: 35%;text-align:center;border-radius: 16px;border: 1px solid #e10a07;color: #e10a07;padding: 1px 6px 1px 6px"
                      @click="openGoods()">
                    立即领券
                </view>
            </view>
        </view>
        <!--短文-->
        <view style="text-align: left;display: flex;margin-top: 8px">
            <view>
                <view @click="copyHref()" class="content" v-html="content">

                </view>
              <view style="color: #e10a07;margin-top: 4px" @click="copyHref()">#点击此处复制分享素材#</view>
            </view>
        </view>

        <!--图片-->
        <view style="text-align: center;display: flex;margin-top: 8px">
            <view>
                <view v-for="(image,index) in images" :key="index" class="box-float">
                    <image @click="openGoods()" class="image" :src="image+'_310x310.jpg'" @longpress="toSave(image)" lazy-load='true' fade-show='true'></image>
                </view>
            </view>
        </view>
		<view style="display: flex;">
			<!-- <view style="color: #e10a07;text-align: center; margin-top: 10px;border:1px solid #FF1212;width:170px;line-height: 20px; border-radius: 19px;" @click="copyHref()">#点击此处复制分享素材</view> -->
			<!--底部-->
			<view style="text-align: right;margin-top:30upx">
			    <text class="total">
			        {{ total }}次被领取
			    </text>
			</view>
		</view>
		


    </view>


</template>

<script>

    export default {
        name: "orange-handpick",
        props: [
            "total",
            "to",
            "content",
            "images",
            "copy_content",
            "showTime",
        ],
        methods: {
            openGoods() {
                let relation_id = this.$queue.getData("relation_id");
                if (relation_id) {
                    uni.navigateTo({
                        url: "/pages/detail/goodsinfo?itemid=" + this.to + "&relation_id=" + relation_id,
                    })
                } else {
                    uni.navigateTo({
                        url: "/pages/detail/goodsinfo?itemid=" + this.to,
                    })
                }
            },
            /**
             * 复制链接
             */
            copyHref() {
                let relation_id = this.$queue.getData("relation_id");
                if (relation_id) {
                    uni.setClipboardData({
                        data: this.copy_content,
                        success: (r => {
                            this.$queue.showToast("素材复制成功")
                        }),
                    })
                } else {
                    uni.setClipboardData({
                        data: this.copy_content,
                        success: (r => {
                            this.$queue.showToast("素材复制成功")
                        }),
                    })
                }
            },
            /**
             * 保存图片
             * @param url
             */
            toSave(url) {
                //#ifndef H5
                uni.getImageInfo({
                    src: url,
                    success: function (image) {
                        console.log('图片信息：', JSON.stringify(image));
                        uni.saveImageToPhotosAlbum({
                            filePath: image.path,
                            success: function () {
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
            },
        },
        filters: {
            formatDate: function (value) {
                value = parseInt(value + "000");
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return  MM + '-' + d 
            }
        }
    }
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
		
        /* padding-left: 16px; */
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
        height: 180upx;
        width: 180upx;
		margin-right: 12upx;
    }
</style>
