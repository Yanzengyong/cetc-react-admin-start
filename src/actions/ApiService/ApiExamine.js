/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2021-01-05 17:57:54
 * @LastEditors: Shenling
 * @LastEditTime: 2021-01-08 12:48:10
 */
import api from '@/api/ApiService/ApiExamine'
import request from '@/services'
import {
	Message
} from '@alifd/next'

export default {

	// api审核列表
	async getList (params) {
		try {
			const result = await request.get(api.getList, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// api审核详情
	async getInfo (uuid, param) {
		try {
			const result = await request.get(`${api.getInfo}/${uuid}`, param)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API订阅
	async sendSubscription (params) {
		try {
			const result = await request.post(api.sendSubscription, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API订阅审核通过
	async passSubscription (params) {
		try {
			const result = await request.put(api.passSubscription, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API订阅审核驳回
	async rejectSubscription (params) {
		try {
			const result = await request.put(api.rejectSubscription, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API重新订阅
	async resendSubscription (params) {
		try {
			const result = await request.post(api.resendSubscription, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API取消订阅
	async cancelSubscription (params) {
		try {
			const result = await request.delete(api.cancelSubscription, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
}
