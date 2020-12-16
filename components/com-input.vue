<template>
    <view>
        <view class="mix-list-cell" :class="border" hover-class="cell-hover" :hover-stay-time="50">
            <text class="cell-tit">{{title}}</text>
            <input
                    class="main-input"
                    :value="value"
                    :type="_type"
                    placeholder-class="placeholder-class"
                    :maxlength="maxlength"
                    :placeholder="placeholder"
                    :password="type==='password'&&!showPassword"
                    @input="onInput"
                    :disabled="readOnly"
            />

            <!-- 是否可见密码 -->
            <image
                    v-if="_isShowPass&&type==='password'&&!_isShowCode"
                    class="img cuIcon"
                    :class="showPassword?'cuIcon-attention':'cuIcon-attentionforbid'"
                    @tap="showPass"
            ></image>
            <!-- 倒计时 -->
            <view
                    v-if="_isShowCode&&!_isShowPass"
                    :class="['vercode',{'vercode-run': second>0}]"
                    @click="setCode"
            >{{ getVerCodeSecond }}
            </view>
        </view>
    </view>

</template>

<script>
    var _this, countDown;
    /**
     *  简单封装了下， 应用范围比较狭窄，可以在此基础上进行扩展使用
     *  比如加入image， iconSize可控等
     */
    export default {
        data() {
            return {
                showPassword: false, //是否显示明文
                second: 0, //倒计时
                isRunCode: false, //是否开始倒计时
                typeList: {
                    left: 'icon-zuo',
                    right: 'icon-you',
                    up: 'icon-shang',
                    down: 'icon-xia'
                },
            }
        },
        props: {
            readOnly: {
                //是否显示获取验证码（二选一）
                type: [Boolean, String],
                default: false,
            },
            type: String, //类型
            logo: String, //类型
            value: String, //值
            placeholder: String, //框内提示
            isShowCode: {
                //是否显示获取验证码（二选一）
                type: [Boolean, String],
                default: false,
            },
            codeText: {
                type: String,
                default: "获取验证码",
            },
            setTime: {
                //倒计时时间设置
                type: [Number, String],
                default: 60,
            },
            maxlength: {
                //最大长度
                type: [Number, String],
                default: 30,
            },
            isShowPass: {
                //是否显示密码图标（二选一）
                type: [Boolean, String],
                default: false,
            },
            icon: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: '标题'
            },
            tips: {
                type: String,
                default: ''
            },
            navigateType: {
                type: String,
                default: 'right'
            },
            border: {
                type: String,
                default: 'b-b'
            },
            hoverClass: {
                type: String,
                default: 'cell-hover'
            },
            iconColor: {
                type: String,
                default: '#333'
            }
        },
        mounted() {
            _this = this
            //准备触发
            this.$on('runCodes', (val) => {
                this.runCodes(val);
            });
            clearInterval(countDown);//先清理一次循环，避免缓存
        },
        methods: {
            showPass() {
                //是否显示密码
                this.showPassword = !this.showPassword
            },
            onInput(e) {
                //传出值
                this.$emit('input', e.target.value)
            },
            setCode() {
                //设置获取验证码的事件
                if (this.isRunCode) {
                    //判断是否开始倒计时，避免重复点击
                    return false;
                }
                this.$emit('setCode')
            },
            runCodes(val) {
                console.error("runCodes")
                //开始倒计时
                if (String(val) == "0") {

                    //判断是否需要终止循环
                    this.second = 0; //初始倒计时
                    clearInterval(countDown);//清理循环
                    this.isRunCode = false; //关闭循环状态
                    return false;
                }
                if (this.isRunCode) {
                    //判断是否开始倒计时，避免重复点击
                    return false;
                }
                this.isRunCode = true
                this.second = this._setTime //倒数秒数

                let _this = this;
                countDown = setInterval(function () {
                    _this.second--
                    if (_this.second == 0) {
                        _this.isRunCode = false
                        clearInterval(countDown)
                    }
                }, 1000)
            }


        },
        computed: {
            _type() {
                //处理值
                const type = this.type
                return type == 'password' ? 'text' : type
            },
            _isShowPass() {
                //处理值
                return String(this.isShowPass) !== 'false'
            },
            _isShowCode() {
                //处理值
                return String(this.isShowCode) !== 'false'
            },
            _setTime() {
                //处理值
                const setTime = Number(this.setTime)
                return setTime > 0 ? setTime : 60
            },
            getVerCodeSecond() {
                //验证码倒计时计算
                if (this.second <= 0) {
                    return this.codeText;
                } else {
                    if (this.second < 10) {
                        return '0' + this.second + "s";
                    } else {
                        return this.second + "s";
                    }
                }

            }
        }
    }
</script>

<style lang='scss'>
    .main-input {
        flex: 1;
        text-align: left;
        color: black;
        font-size: 16px;
        padding-right: 6px;
        margin-left: 10px;
    }

    .icon .mix-list-cell.b-b:after {
        left: 45px;
    }

    .placeholder-class {
        color: black;
        opacity: 0.5;
    }

    .mix-list-cell {
		/* border-radius: 16upx; */
		border-bottom: 4upx solid #F8F8F8;
        margin-top: 1px;
		font-size: 32upx;
        background: white;
        text-align: left;
        display: flex;
		margin: 32upx;
        padding: 24upx 32upx;
        position: relative;

        &.cell-hover {
            background: transparent;
        }

        &.b-b:after {
            left: 16px;
        }

        .cell-icon {
            align-self: center;
            width: 28px;
            max-height: 30px;
            font-size: 18px;
        }

        .cell-more {
            align-self: center;
            font-size: 16px;
            color: #606266;
            margin-left: 10px;
        }

        .cell-tit {
            width: 80px;
            font-size: 16px;
            color: black;
        }

        .cell-tip {
            font-size: 14px;
            color: black;
        }

    }

    .items {
        position: absolute;
        height: 48px;
        width: 100%;
        background: #FFFFFF;
        /*opacity:0.05;*/
    }

    .main-list {
        opacity: 0.8;
        z-index: 88;
        background: white;
        border: 1px solid white;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 18px; /* Input 高度 */
        color: #333333;
        padding: 16px;
        margin-top: 12px;
        margin-bottom: 12px;
    }

    .img {
        width: 16px;
        height: 16px;
        font-size: 16px;
    }

    .vercode {
        color: #e10a07;
        font-size: 14px;
    }

    .vercode-run {
        color: black !important;
    }

    .oBorder {

        border-radius: 2.5rem;
        -webkit-box-shadow: 0 0 30px 0 rgba(43, 86, 112, .1);
        box-shadow: 0 0 30px 0 rgba(43, 86, 112, .1);
    }
</style>
