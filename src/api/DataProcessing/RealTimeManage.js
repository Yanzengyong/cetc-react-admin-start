/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-12-22 09:02:36
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 14:50:04
 */
import { REALTIME_TASK_URL } from '../index.js'
const realtimeService ='streamcomputing/'
const realtimeComponent='streamcomponent/'
const realtimeJob ='streamjob/'

const apiList ={
	getList: REALTIME_TASK_URL + realtimeService + 'list', // 实时任务列表
	add: REALTIME_TASK_URL + realtimeService + 'save', // 新增实时任务
	update: REALTIME_TASK_URL + realtimeService + 'update', // 编辑实时任务
	query: REALTIME_TASK_URL + realtimeService + 'query', // 查看实时任务
	delete: REALTIME_TASK_URL + realtimeService + 'delete', // 删除实时任务

	componentQuery: REALTIME_TASK_URL + realtimeComponent + 'query', // 获取组件的接口

	realtimeJobSave: REALTIME_TASK_URL + realtimeJob + 'save', // 保存组件信息
	execute: REALTIME_TASK_URL + realtimeJob + 'execute', // 执行任务
	topic: REALTIME_TASK_URL + realtimeJob + 'topic', // 获取topic列表

}
export default apiList
