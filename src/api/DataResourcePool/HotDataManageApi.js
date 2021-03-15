/*
 * @Author: ShenLing
 * @Date: 2020-10-27 10:37:39
 * @LastEditors: Shenling
 * @LastEditTime: 2020-10-27 14:54:20
 */
import { Host } from '../index.js'
const datapool = 'govern-datapool/'
const apiList = {
	getRetentionList: Host + datapool + 'tsd/retention/list', // 查询保留策略
	updateRetention: Host + datapool + '/tsd/retention/update', // 修改保留策略
	deleteRetention: Host + datapool + '/tsd/retention/delete', // 删除保留策略
	addRetention: Host + datapool + '/tsd/retention/add', // 新增保留策略
}
export default apiList
