/**
 * 
 * @author maxd
 * @date 2019.8.1
 */
module.exports = {
	//微信的appId
	getWxAppid() {
		return 'wxb98da0b4ea7fb0dd'
	},
	//淘宝的appid
	getTaoBaoAppid() {
		return uni.getStorageSync("taobaoAppid")
	},
	//淘宝的Secret
	getTaoBaoSecret() {
		return uni.getStorageSync("taobaoSecret")
	},
	//淘宝h5授权地址
	getTaoBaoRedirect() {
		return uni.getStorageSync("taobaoUrl")
	},
	//好单库接口淘宝名 必须英文的 tb_name
	getTaoBaoName() {
		return uni.getStorageSync("taobaoName")
	},
	//淘宝设置的PID
	getTaoBaoPid() {
		return uni.getStorageSync("taobaoPid")
	},
	//好单库Key
	getTaoBaoKey() {
		return uni.getStorageSync("haodankuKey")
	},
	//全局邀请码
	getInvitation() {
		return uni.getStorageSync("publicRelation")
	},
	//获取拼多多商城地址
	getPingDuoDuo() {
		return uni.getStorageSync("pinduoduo")
	},
	//获取拼多多默认地址
	getPingDuoDuoPid() {
		return uni.getStorageSync("pinduoduopid")
	},
	//京东默认pid
	getJDPid() {
		return uni.getStorageSync("jingdongpid")
	},
	//获取APP下载地址
	getAppDownUrl() {
		return uni.getStorageSync("appurl")
	},
	//全局域名 部分html中需要单独替换 需要修改config中的网络请求域名
	publicYuMing() {
		return 'https://api.shengqianxiong.com.cn'
	},
	minMoney() {
		return uni.getStorageSync("minMoney") ? uni.getStorageSync("minMoney") : '0.3'
	},
	invitaionNum() {
		return uni.getStorageSync("invitaionNum")
	},
	maxMoney() {
		return uni.getStorageSync("maxMoney") ? uni.getStorageSync("maxMoney") : '0.7'
	},
	teamMoney() {
		return uni.getStorageSync("teamMoney")
	},
	cashMoney() {
		return uni.getStorageSync("cashMoney") ? uni.getStorageSync("cashMoney") : '10'
	},
	logout() {
		this.remove("token");
		this.remove("userId");
		this.remove("mobile");
		this.remove("openid");
		this.remove("nickName");
		this.remove("relation");
		this.remove("image_url");
		this.remove("relation_id");
	},
	loginClear() {
		this.remove("token");
		this.remove("userId");
		this.remove("mobile");
		this.remove("nickName");
		this.remove("image_url");
		this.remove("relation_id");
	},
	showLoading(title) {
		uni.showLoading({
			title: title
		});
	},
	showToast(title) {
		uni.showToast({
			title: title,
			mask: false,
			duration: 2000,
			icon: "none"
		});
	},
	getSearchKeys: function(key) {

		let list = uni.getStorageSync("searchKeys");
		let keys = key.replace(/\s*/g, "")
		return list.indexOf(keys);
	},
	setJson: function(key, value) {
		let jsonString = JSON.stringify(value);
		try {
			uni.setStorageSync(key, jsonString);
		} catch (e) {
			// error
		}
	},
	setData: function(key, value) {
		try {
			uni.setStorageSync(key, value);
		} catch (e) {
			// error
		}
	},
	getData: function(key) {
		try {
			const value = uni.getStorageSync(key);
			if (value) {
				return value;
			}
		} catch (e) {
			// error
		}

	},
	getJson: function(key) {
		try {
			const value = uni.getStorageSync(key);
			if (value) {
				return JSON.parse(value);
			}
		} catch (e) {
			// error
		}

	},
	clear: function() {
		uni.clearStorage();
	},
	get: function(key) { //获取队列里面全部的数据
		let data = this.getJson(key);
		if (data instanceof Array) {
			return data;
		}
		return [];
	},
	insert: function(param) { //队列插入数据
		param.capacityNum = param.capacityNum || 100; //队列容量 默认队列中超过100条数据，自动删除尾部
		let data = this.getJson(param.key);
		if (data instanceof Array) {
			if (data.length > param.capacityNum) {
				let total = data.length - param.capacityNum;
				for (let i = 0; i < total; i++) {
					data.pop();
				}
			}
			data.unshift(param.value);
		} else {
			data = [];
			data.push(param.value);
		}
		this.setJson(param.key, data);
	},
	removeItem: function(key, itemIds) { //提供itemIds数组 批量删除队列中的某项数据
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let i = 0; i < itemIds.length; i++) {
				for (let p = 0; p < data.length; p++) {
					if (itemIds[i] === data[p].itemid) {
						data.splice(p, 1);
						break;
					}
				}
			}
			this.setJson(key, data);
		}
	},
	isExist: function(key, itemId) { //检测某条数据在队列中是否存在
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let p = 0; p < data.length; p++) {
				if (itemId === data[p].itemid) {
					return true;
				}
			}
		}
		return false;
	},
	isExistPdd: function(key, itemId) { //检测某条数据在队列中是否存在
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let p = 0; p < data.length; p++) {
				if (itemId === data[p].goodsId) {
					return true;
				}
			}
		}
		return false;
	},
	isExistJd: function(key, itemId) { //检测某条数据在队列中是否存在
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let p = 0; p < data.length; p++) {
				if (itemId === data[p].skuId) {
					return true;
				}
			}
		}
		return false;
	},
	remove: function(key) { //删除某条队列
		try {
			uni.removeStorageSync(key);
			//localStorage.removeItem(key)
		} catch (e) {
			// error
		}
	},
	getCount: function(key) { //获取队列中全部数据数量

		let data = this.getJson(key);
		if (data instanceof Array) {
			return data.length;
		}
		return 0;
	},
};
