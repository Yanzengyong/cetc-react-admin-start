/*
 * @Description:
 * @Version:
 * @Author: Yanzengyong
 * @Date: 2020-08-30 21:56:45
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-08-31 11:49:48
 */
export default {
	setTabs (tabs) {
		return {
			type: 'SET_TABS',
			tabs: tabs
		}
	},
	closeItemTab (path) {
		return {
			type: 'CLOSE_ITEM_TAB',
			path: path
		}
	},
	setDeleteTabPath (path) {
		return {
			type: 'SET_DELETE_TAB_PATH',
			path: path
		}
	}
}
