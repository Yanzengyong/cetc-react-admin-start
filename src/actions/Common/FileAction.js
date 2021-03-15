/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-10-26 15:45:35
 */
import api from '@/api/Common/FileApi'
import request from '@/services'
import {
	Message
} from '@alifd/next'

export default {
	// 上传文件
	async uploadFileRQ (params) {
		try {
			const result = await request.post(api.uploadFile, params)
			return result
		} catch (error) {
			if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error('请求超时，请检查网络')
			} else {
				Message.error('服务器未知异常，请联系管理员')
			}
		}
	},
	// 预览文件
	async getPreviewFile (params) {
		try {
			const result = await request.get(api.previewFile, params)
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
