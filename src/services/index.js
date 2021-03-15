/*
 * @Author: ShenLing
 * @Date: 2020-09-18 11:07:59
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 14:23:00
 */
import axios from 'axios'
import { LOGIN_URL } from '@/api'
import { getLocalStorageItem, clearLocalStorage } from '@/utils/storage'

const service = axios.create()

// 传参格式化
service.interceptors.request.use(
	config => {
		const TOKEN = getLocalStorageItem('TOKEN')

		if (!config.headers.token) {
			config.headers = {
				'TOKEN': TOKEN
			}
		}

		if (config.method === 'post') config.body = JSON.stringify(config.data)
		return config

	},
	error => {
		return Promise.reject(error)
	}
)
// 返回结果处理
service.interceptors.response.use(
	res => {
		// 这里可根据实际情况做一些操作
		if (res.status === 200) {
			if (res.data != null && res.data.code === 23001) {
				// 跳转到登录页面
				clearLocalStorage()
				// eslint-disable-next-line no-undef
				process.env.NODE_ENV === 'development' ? null :
				window.location.href = LOGIN_URL
				return
			} return res.data
		} else {
			return res.data
		}

	}, error => {
		return Promise.reject(error)
	}
)

export default {
	// post function
	post (url, data) {
		return service({
			method: 'post',
			url,
			data
		})
	},
	// get function
	get (url, data) {
		return service({
			method: 'get',
			url,
			params: data
		})
	},
	// delete function
	put (url, data) {
		return service({
			method: 'put',
			url,
			data
		})
	},
	// delete function
	delete (url, data) {
		return service({
			method: 'delete',
			url,
			data
		})
	}
}
