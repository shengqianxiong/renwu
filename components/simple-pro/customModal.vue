<template>
    <view style="border-radius: 16upx">
        <view class="modal-box" style="padding-right: 16px;padding-left: 16px"
              :class="[isVisibility?'show':'', buttom?'bottom-modal':'' ]" @tap="ClickMaskClose"
              @touchmove.stop.prevent="moveHandleStop">
            <!-- 默认弹窗 -->
            <view class="dialog" v-if="!buttom" @tap.stop="contentClick">
                <view :class="contentClass">
                    <slot></slot>
                </view>
                <view class="simple-bar has-bordert" v-if="showConfirmButton == true || showCancelButton == true">
                    <view class='action has-mg-0 flex-sub text-green' v-if="showCancelButton == true"
                          @tap.stop='handleClose'>{{cancelButtonText}}
                    </view>
                    <view class='action has-mg-0 flex-sub has-borderl' v-if="showConfirmButton == true"
                          @tap.stop='handleConfirm'>{{confirmButtonText}}
                    </view>
                </view>
            </view>

            <!-- 底部弹窗 -->
            <view class="dialog" v-if="buttom" @tap.stop="contentClick">
                <view class="simple-bar has-bordert" v-if="showConfirmButton == true || showCancelButton == true">
                    <view class='action is-black' v-if="showCancelButton == true" @tap.stop='handleClose'>
                        {{cancelButtonText}}
                    </view>
                    <view class='action is-blue' v-if="showConfirmButton == true" @tap.stop='handleConfirm'>
                        {{confirmButtonText}}
                    </view>
                </view>
                <view :class="contentClass">
                    <slot></slot>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    /**
     * 自定义弹窗内容组件
     * 使用方法：
     *        1.引入组件：import simpleModal from '@/components/simple-pro/customModal.vue';
     *        2.定义：components ，simpleModal
     *        3.页面使用：<simpleModal ref="simpleModal">这里面可以写你的自定义内容哟~</simpleModal>
     *        4.指定方法 this.$refs.simpleModal.func();
     *
     * 自定义方法：
     *        1. alert() ; 支持在方法中传入 object 更改内容  该方法仅弹出一个按钮 （如果传入了object参数 其中的参数值优先级最高）
     *        2. hide();
     */
    export default {
        props: {
            buttom: {
                // 是否底部弹出
                type: Boolean,
                default: false
            },
            contentClass: {
                // 弹窗默认样式
                type: String,
                default: "has-bg-white"
            }
        },
        data() {
            return {
                showConfirmButton: true, // 确认按钮
                showCancelButton: false, // 取消按钮
                confirmButtonText: "确定",// 确定按钮文字
                cancelButtonText: "取消",//取消按钮文字
                isVisibility: false, //是否显示
            };
        },
        methods: {
            __setconfig: function (options) {
                if (options != undefined && (typeof options == "object")) {
                    if (options['showConfirmButton'] != undefined) this.showConfirmButton = options['showConfirmButton'];
                    if (options['showCancelButton'] != undefined) this.showCancelButton = options['showCancelButton'];
                    if (options['confirmButtonText'] != undefined) this.confirmButtonText = options['confirmButtonText'];
                    if (options['cancelButtonText'] != undefined) this.cancelButtonText = options['cancelButtonText'];
                    if (options['isVisibility'] != undefined) this.isVisibility = options['isVisibility'];
                    if (options['contentClass'] != undefined) this.contentClass = options['contentClass'];
                }
            },
            show: function (options) {
                // 传入 object 参数 动态修改
                this.__setconfig(options);
                this.isVisibility = true;
            },
            hide: function () {
                this.isVisibility = false;
            },
            handleClose: function () {
                this.isVisibility = false;
                this.$emit('cancelButton');
            },
            handleConfirm: function () {
                this.$emit('confirmButton');
            },
            ClickMaskClose: function () {
                // 点击背景 or 内容时执行关闭  有坑 点击内容的时候也会关闭，
                this.$emit('maskClose');
            },
            contentClick: function (e) {
                this.$emit('contentClick');
            },
            moveHandleStop: function () {

            }
        }
    }
</script>

<style>

</style>
