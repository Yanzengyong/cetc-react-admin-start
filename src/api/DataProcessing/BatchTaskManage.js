/*
 * @Author: ShenLing
 * @Date: 2020-10-15 09:37:07
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-11-30 15:47:11
 */

import { Host } from '../index.js'
const batchTaskService = 'govern-datasource/dataworks/project/'
const jobService = 'govern-datasource/dataworks/task/'
const taskDevService = 'govern-datasource/dataworks/sqltree/'
const componentService = 'govern-datasource/dataworks/etl/'
const apiList = {
	/**
	 * 批数据处理任务
	 */
	getList: Host + batchTaskService + 'list', // 批数据任务列表
	createTask: Host + batchTaskService + 'add', // 批数据任务新增
	updateTask: Host + batchTaskService + 'update', // 批数据任务更新
	deleteTask: Host + batchTaskService + 'delete', // 批数据任务删除

	/**
	 * 二级 --- 作业开发
	 */
	getJobList: Host + jobService + 'list', // 作业列表
	createJobTask: Host + jobService + 'add', // 作业新增
	updateJobTask: Host + jobService + 'update', // 作业修改
	deleteJobTask: Host + jobService + 'delete', // 作业删除
	getJobInfo: Host + jobService + 'query', // 作业详情
	jobStart: Host + jobService + 'start', // 作业调度启动
	jobStop: Host + jobService + 'stop', // 作业调度停止
	getJobTimeList: Host + jobService + 'times', // 作业调度时间列表
	getJobLog: Host + jobService + 'log', // 作业调度日志
	getJobChart: Host + jobService + 'works', // 获取运行时长的图表数据

	/**
	 * 三级 --- 任务开发（拖拽组件）
	 */
	getComponentList: Host + taskDevService + 'query', // 获取可拖拽的组件列表
	saveTaskComponent: Host + componentService + 'add', // 保存任务开发
	executeComponent: Host + componentService + 'execute', // 单个组件执行
}
export default apiList


