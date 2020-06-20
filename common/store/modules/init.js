// 初始化数据模块
import api from '@/common/request/index'
import store from '@/common/store'
import Router from '@/common/router';
import {
	INIT_DATA,
	PAGE_ROUTES,
	CART_NUM,
	TEMPLATE
} from '../types.js'
const state = {
	initData: {},
	routes: [],
	templateData: uni.getStorageSync('templateData') ? uni.getStorageSync('templateData') : {}, //购物车,涉及到刷新数据丢失，所以存了本地,
}

const actions = {
	getAppInit({
		commit
	}, options) {
		uni.setStorageSync('mode', 'product');
		return new Promise((resolve, reject) => {
			api('init').then(res => {
				commit('INIT_DATA', res.data);
				uni.setStorageSync('sysInfo', res.data.info);
				uni.setStorageSync('shareInfo', res.data.share);
				resolve(res)
			}).then(() => {
				store.dispatch('getTemplate', options);
			}).catch(e => {
				reject(e)
			})
		})
	},
	// 同步前端路由
	getRoutes({
		commit
	}) {
		return new Promise((resolve, reject) => {
			api('dev.asyncLink', {
				data: ROUTES
			}).then(res => {
				commit('PAGE_ROUTES', res.data);
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
	// 模板信息
	getTemplate({
		commit
	}, options) {
		console.log(options,123123)
		var params = {};
		return new Promise((resolve, reject) => {
			//请求预览商城模板
			if (options.query.shop_id) {
				uni.setStorageSync('mode', 'preview');
				params.shop_id = options.query.shop_id;
			}
			if(options.query.custom_id) {
			Router.replace({
				path: '/pages/index/view',
				query: {
					id: options.query.custom_id,
				}
			});
			}
			api('template', params).then(res => {
				uni.setStorageSync('templateData', res.data);
				commit('TEMPLATE', res.data);
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
}

const mutations = {
	[PAGE_ROUTES](state, data) {
		state.routes = data
	},
	[INIT_DATA](state, data) {
		state.initData = data
	},
	[TEMPLATE](state, data) {
		state.templateData = data
	},
}

const getters = {

}

export default {
	state,
	mutations,
	actions,
	getters
}
