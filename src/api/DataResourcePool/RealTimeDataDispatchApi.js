/*
 * @Author: ShenLing
 * @Date: 2020-10-15 09:37:07
 * @LastEditors: Shenling
 * @LastEditTime: 2020-11-05 14:10:07
 */

import { Host } from '../index.js'
const datapool = 'govern-datapool'
const apiList = {
	getList: Host + datapool + '/streamjob/list', // 查询实时调度任务列表
	queryJob: Host + datapool + '/streamjob/query', // 查询任务详情
	addJob: Host + datapool + '/streamjob/add', // 新增实时调度任务
	updateJob: Host + datapool + '/streamjob/update', // 修改实时调度任务
	deleteJob: Host + datapool + '/streamjob/delete', // 删除任务
	startJob: Host + datapool + '/streamjob/start', // 开启任务
	stopJob: Host + datapool + '/streamjob/stop', // 关闭任务
	getJobLogList: Host + datapool + '/streamjob/state', // 查看任务日志列表
}
export default apiList
