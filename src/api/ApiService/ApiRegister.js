/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2021-01-05 10:09:09
 * @LastEditors: Shenling
 * @LastEditTime: 2021-01-07 16:08:16
 */
import { Host } from '../index.js'
const apiService = 'bdri-api/api/service'

const apiList = {
	getList: Host + apiService + '/register/page', // API服务列表
	getInfo: Host + apiService + '/register', // 获取api注册详情
	getURL: Host + apiService + '/url', // 获得url
	getInputParam: Host + apiService + '/inputparams', // 获取API输入参数
	getOutputParam: Host + apiService + '/outputparams', // 获取API输出参数
	apiOperation: Host + apiService, // 新增、修改、删除api注册
	getSampleData: Host + apiService + '/apisample', // 请求样例数据
}

export default apiList
