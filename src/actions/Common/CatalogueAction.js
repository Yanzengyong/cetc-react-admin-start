/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-10-14 15:40:54
 */
import { formatUrl } from '@/api/Common/CatalogueApi'
import request from '@/services'
import {
	Message
} from '@alifd/next'

export default {

	// 查询数据源目录列表
	async getTreeRQ (type, params) {
		try {
			const result = await request.get(formatUrl(type).getTree, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 新增实体类目
	async addTreeRQ (type, params) {
		try {
			const result = await request.post(formatUrl(type).addTree, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 修改数据实体类目
	async updateTreeRQ (type, params) {
		try {
			const result = await request.post(formatUrl(type).updateTree, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 删除实体目录
	async deleteTreeRQ (type, params) {
		try {
			const result = await request.post(formatUrl(type).deleteTree, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	}
}
