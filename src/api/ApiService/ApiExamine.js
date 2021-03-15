/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2021-01-05 17:55:37
 * @LastEditors: Shenling
 * @LastEditTime: 2021-01-07 18:27:52
 */
import { Host } from '../index.js'

const apiService = 'bdri-api/api/subscription'

const apiList = {
	getList: Host + apiService + '/review/page', // API审核 的列表
	getInfo: Host + apiService + '/review', // API审核 的详情

	sendSubscription: Host + apiService, // API订阅
	rejectSubscription: Host + apiService + '/reject', // API订阅审核驳回
	passSubscription: Host + apiService + '/pass', // API订阅审核通过
	resendSubscription: Host + apiService + '/reSubscription', // API重新订阅
	cancelSubscription: Host + apiService, // API取消订阅
}

export default apiList
