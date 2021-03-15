/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2021-01-05 10:12:59
 * @LastEditors: Shenling
 * @LastEditTime: 2021-01-07 16:12:22
 */
import api from '@/api/ApiService/ApiRegister'
import request from '@/services'
import {
	Message
} from '@alifd/next'

export default {

	// 查询api注册列表
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

	// 获取api注册页面详情
	async queryAPI (uuid) {
		try {
			const result = await request.get(`${api.getInfo}/${uuid}`)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 获取URL
	async getURL (param) {
		try {
			const result = await request.get(api.getURL, param)
			return result
		} catch (error) {
			if (
				error &&
				error.code === 'ECONNABORTED' &&
				error.message.indexOf('timeout') !== -1
			) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 获取API输入参数
	async getInputParam (param) {
		try {
			const result = await request.get(api.getInputParam, param)
			return result
		} catch (error) {
			if (
				error &&
				error.code === 'ECONNABORTED' &&
				error.message.indexOf('timeout') !== -1
			) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 获取API输出参数
	async getOutputParam (param) {
		try {
			const result = await request.get(api.getOutputParam, param)
			return result
		} catch (error) {
			if (
				error &&
				error.code === 'ECONNABORTED' &&
				error.message.indexOf('timeout') !== -1
			) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 新增api
	async addAPI (param) {
		try {
			const result = await request.post(api.apiOperation, param)
			return result
		} catch (error) {
			if (
				error &&
				error.code === 'ECONNABORTED' &&
				error.message.indexOf('timeout') !== -1
			) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 编辑api
	async updateAPI (param) {
		try {
			const result = await request.put(api.apiOperation, param)
			return result
		} catch (error) {
			if (
				error &&
				error.code === 'ECONNABORTED' &&
				error.message.indexOf('timeout') !== -1
			) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 删除、批量删除api注册
	async deleteApi (params) {
		try {
			const result = await request.delete(api.apiOperation, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 发送请求获取API样例数据
	async getSampleData (params) {
		try {
			const result = await request.post(api.getSampleData, params)
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
