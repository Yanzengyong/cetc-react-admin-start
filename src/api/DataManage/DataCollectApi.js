/*
 * @Author: ShenLing
 * @Date: 2020-10-15 09:37:07
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-12-03 16:40:42
 */

import { Host } from '../index.js'
const dataSourceService = 'govern-datasource/datasource/collect/'

const apiList = {
	getList: Host + dataSourceService + 'list', // 采集任务列表
	createTask: Host + dataSourceService + 'add', // 采集任务新增
	updateTask: Host + dataSourceService + 'update', // 采集任务更新
	deleteTask: Host + dataSourceService + 'delete', // 采集任务删除
	getTaskInfo: Host + dataSourceService + 'query', // 采集任务查询详情
	getMetaInfo: Host + dataSourceService + 'param/meta', // 查询数据源元数据
	startTask: Host + dataSourceService + 'start', // 开启数据采集任务
	stopTask: Host + dataSourceService + 'stop', // 停止数据采集任务
	executeTask: Host + dataSourceService + 'execute', // 数据采集任务 --- 手动执行
	getLogTime: Host + dataSourceService + 'times', // 数据采集任务日志时间
	getLogContent: Host + dataSourceService + 'log', // 数据采集任务日志查看

	getLogList: Host + dataSourceService + 'log/list', // 查询日志列表
	getLogInfo: Host + dataSourceService + 'log/query', // 查询日志详情
}
export default apiList
