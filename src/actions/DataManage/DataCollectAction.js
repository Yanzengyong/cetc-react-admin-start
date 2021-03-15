/*
 * @Author: ShenLing
 * @Date: 2020-10-15 09:37:07
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-12-03 16:42:07
 */
import api from '@/api/DataManage/DataCollectApi'
import request from '@/services'

import { Message } from '@alifd/next'



export default {
	// 获取列表
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
	// 新增数据采集任务
	async createTask (params) {
		try {
			const result = await request.post(api.createTask, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	async updateTask (params) {
		try {
			const result = await request.post(api.updateTask, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	async deleteTask (params) {
		try {
			const result = await request.post(api.deleteTask, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	async getTaskInfo (params) {
		try {
			const result = await request.get(api.getTaskInfo, params)
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
	async getMetaInfo (params) {
		try {
			const result = await request.post(api.getMetaInfo, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 开启数据采集任务
	async startTask (params) {
		try {
			const result = await request.get(api.startTask, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 停止数据采集任务
	async stopTask (params) {
		try {
			const result = await request.get(api.stopTask, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 数据采集任务 --- 手动执行
	async executeTask (params) {
		try {
			const result = await request.get(api.executeTask, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 数据采集任务日志时间
	async getLogTime (params) {
		try {
			const result = await request.get(api.getLogTime, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 数据采集任务日志查看
	async getLogContent (params) {
		try {
			const result = await request.get(api.getLogContent, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 查询日志列表
	async getLogList (params) {
		try {
			const result = await request.get(api.getLogList, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 查询日志详情
	async getLogInfo (params) {
		try {
			const result = await request.get(api.getLogInfo, params)
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
