/*
 * @Author: ShenLing
 * @Date: 2021-01-26 16:35:03
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-03 11:53:49
 */
import api from '@/api/UserManage/UserManageApi'
import request from '@/services'
import { Message } from '@alifd/next'

export default {
	// 获取用户信息
	async getUserInfo (params) {
		try {
			const result = await request.get(api.getUserInfo, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 登出
	async logout (params) {
		try {
			const result = await request.get(api.logout, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 获取部门列表
	async getDepartmentlist (params) {
		try {
			const result = await request.get(api.getDepartmentlist, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},

	// 获取用户列表
	async getUserList (params) {
		try {
			const result = await request.get(api.getUserList, params)
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
