/*
 * @Author: ShenLing
 * @Date: 2021-01-28 14:11:55
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-23 12:02:03
 */
import { setLocalStorageItem, getLocalStorageItem } from '@/utils/storage'

export default {
	setUserInfo (UserInfo) {
		setLocalStorageItem('UserInfo', UserInfo)
		setLocalStorageItem('TOKEN', UserInfo.token)
		return {
			type: 'SET_USERINFO',
			UserInfo
		}
	},

	getUserInfo () {
		let UserInfo = getLocalStorageItem('UserInfo') ?? {}
		return {
			type: 'GET_USERINFO',
			UserInfo
		}
	}
}
