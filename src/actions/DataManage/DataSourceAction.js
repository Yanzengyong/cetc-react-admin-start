/*
 * @Author: Zhangyao
 * @Date: 2020-09-18 11:38:28
 * @LastEditors: Shenling
 * @LastEditTime: 2021-01-28 13:58:16
 */
import api from '@/api/DataManage/DataSourceApi'
import request from '@/services'
import {
	Message
} from '@alifd/next'

export default {
	// 查询数据源列表
	async getSourceListRQ (params) {
		try {
			const result = await request.get(api.getSourceList, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 查询数据源
	async getSourceInfoRQ (params) {
		try {
			const result = await request.get(api.getSourceInfo, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 修改数据源
	async updateSourceRQ (params) {
		try {
			const result = await request.post(api.updateSource, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 新增数据源
	async addSourceRQ (params) {
		try {
			const result = await request.post(api.addSource, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 删除数据源
	async deleteSourceRQ (params) {
		try {
			const result = await request.post(api.deleteSource, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 测试连接
	async testConnectRQ (params) {
		try {
			const result = await request.post(api.testConnect, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 查询库表结构
	async getStructureRQ (params) {
		try {
			const result = await request.post(api.getStructure, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 查询数据源元数据
	async getSourceMetaRQ (params) {
		try {
			const result = await request.post(api.getSourceMeta, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 查询样例数据（api）
	async getApiSample (params) {
		try {
			const result = await request.post(api.getApiSample, params)
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
