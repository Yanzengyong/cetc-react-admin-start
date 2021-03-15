/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Shenling
 * @LastEditTime: 2020-11-13 15:20:21
 */

import { Host } from '../index.js'
const dataQualityService = 'govern-quality-new'

const apiList = {
	getProjectList: Host + dataQualityService + '/project/list', // 查询项目列表
	addProject: Host + dataQualityService + '/project/add', // 新增项目
	updateProject: Host + dataQualityService + '/project/update', // 编辑项目
	deleteProject: Host + dataQualityService + '/project/delete', // 删除项目
	getProjectStatistics: Host + dataQualityService + '/project/count', // 首页统计

	getTaskList: Host + dataQualityService + '/quality/queryJobPage', // 查询评估任务列表
	startTask: Host + dataQualityService + '/quality/start', // 开启任务
	stopTask: Host + dataQualityService + '/quality/stop', // 关闭任务
	startWarning: Host + dataQualityService + '/quality/startWarning', // 开启预警
	stopWarning: Host + dataQualityService + '/quality/shutDownWarning', // 关闭预警
	executeTask: Host + dataQualityService + '/quality/execute', // 立即执行一次
	queryTask: Host + dataQualityService + '/quality/query', // 查询任务详情
	addTask: Host + dataQualityService + '/quality/add', // 新增任务
	updateTask: Host + dataQualityService + '/quality/update', // 修改任务
	deleteTask: Host + dataQualityService + '/quality/delete', // 删除任务
	getLogDate: Host + dataQualityService + '/quality/listMetricDate', // 查询任务执行日期列表
	getLogResult: Host + dataQualityService + '/quality/listTriggerDetails', // 任务执行结果详情
	downloadReport: Host + dataQualityService +'/quality/export', // 任务报告导出
}
export default apiList
