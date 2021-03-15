/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Shenling
 * @LastEditTime: 2020-10-28 14:20:46
 */

import { Host } from '../index.js'
const dataResouceService = 'govern-dataresource/resource/'

const apiList = {
	getList: Host + dataResouceService + 'list', // 查询列表
	delete: Host + dataResouceService + 'delete', // 删除
	query: Host + dataResouceService + 'query', // 查询详情
	add: Host + dataResouceService + 'add', // 新增
	update: Host + dataResouceService + 'update', // 修改
}
export default apiList
