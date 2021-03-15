/*
 * @Author: ShenLing
 * @Date: 2020-10-15 09:37:07
 * @LastEditors: Shenling
 * @LastEditTime: 2020-11-23 17:47:09
 */

import { Host } from '../index.js'
const datapool = 'govern-datapool'
const apiList = {
	getList: Host + datapool + '/job/list', // 查询调度任务列表
	addJob: Host + datapool + '/job/add', // 新增调度任务
	updateJob: Host + datapool + '/job/update', // 修改调度任务
	startJob: Host + datapool + '/job/start', // 开启任务
	stopJob: Host + datapool + '/job/stop', // 关闭任务
	executeJob: Host + datapool + '/job/execute', // 立即执行任务
	deleteJob: Host + datapool + '/job/delete', // 删除任务
	queryJob: Host + datapool + '/job/query', // 查询任务详情
	getJobLogList: Host + datapool + '/job/log/list', // 查看任务日志列表
	deleteJobLog: Host + datapool + '/job/log/delete', // 清除日志
	queryLog: Host + datapool + '/job/log/query', // 清除日志
}
export default apiList
