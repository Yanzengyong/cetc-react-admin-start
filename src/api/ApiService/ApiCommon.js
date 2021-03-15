/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2021-01-05 11:48:16
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-07 16:51:25
 */
import { Host } from '../index.js'

const apiService = 'bdri-api/api/service'
const api = 'bdri-api/api'

const apiList = {
	getList: Host + apiService + '/inventory/page', // API清单页面 / 我的API页面的API 的列表
	getInfo: Host + apiService + '/inventory', // API清单页面 / 我的API页面 的详情

	getViewsLog: Host + api + '/views/page', // 访问日志查询
	getSubscriptionLog: Host + api + '/subscription/logs/page', // 订阅日志查询
	getErrorLog: Host + api + '/logs/page', // 异常日志查询

	getApiSummary: Host + apiService + '/summary', // API统计信息概要(API总数，用户数，总订阅数，总访问时)
	getApiSubPie: Host + apiService + '/subscriptionPieChart', // API订阅信息饼状图
	getApiViewPie: Host + apiService + '/viewPieChart', // API查看信息饼状图
	getApiSubLine: Host + apiService + '/subscriptionLineChart', // API订阅信息折线图
	getApiViewLine: Host + apiService + '/viewLineChart', // API查看信息折线图
	getApiSubList: Host + apiService + '/subscriptionListChart', // API订阅信息列表
	getApiViewList: Host + apiService + '/viewListChart', // API查看信息列表
	getApiSubBar: Host + apiService + '/subscriptionHistogram', // API订阅信息柱状图
	getApiViewBar: Host + apiService + '/viewHistogram', // API查看信息柱状图
	getApiServiceUserList: Host + apiService + '/user/list', // 获取服务系统用户列表
}

export default apiList
