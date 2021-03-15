/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2021-01-05 11:47:46
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-07 16:48:55
 */
import api from '@/api/ApiService/ApiCommon'
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

	// 访问日志查询
	async getViewsLog (params) {
		try {
			const result = await request.get(api.getViewsLog, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 订阅日志查询
	async getSubscriptionLog (params) {
		try {
			const result = await request.get(api.getSubscriptionLog, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 异常日志查询
	async getErrorLog (params) {
		try {
			const result = await request.get(api.getErrorLog, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API统计信息概要
	async getApiSummary (params) {
		try {
			const result = await request.get(api.getApiSummary, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API订阅信息饼状图
	async getApiSubPie (params) {
		try {
			const result = await request.get(api.getApiSubPie, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API查看信息饼状图
	async getApiViewPie (params) {
		try {
			const result = await request.get(api.getApiViewPie, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API订阅信息折线图
	async getApiSubLine (params) {
		try {
			const result = await request.get(api.getApiSubLine, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API查看信息折线图
	async getApiViewLine (params) {
		try {
			const result = await request.get(api.getApiViewLine, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API订阅信息列表
	async getApiSubList (params) {
		try {
			const result = await request.get(api.getApiSubList, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API查看信息列表
	async getApiViewList (params) {
		try {
			const result = await request.get(api.getApiViewList, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API订阅信息柱状图
	async getApiSubBar (params) {
		try {
			const result = await request.get(api.getApiSubBar, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// API查看信息柱状图
	async getApiViewBar (params) {
		try {
			const result = await request.get(api.getApiViewBar, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 获取数据服务系统用户列表
	async getApiServiceUserList (params) {
		try {
			const result = await request.get(api.getApiServiceUserList, params)
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
