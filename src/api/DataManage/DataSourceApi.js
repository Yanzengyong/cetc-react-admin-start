/*
 * @Author: Zhangyao
 * @Date: 2020-08-04 10:55:23
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-10-26 10:58:39
 */
// http://10.1.119.13/dcy-dev/govern-datasource/swagger-ui.html#
// import { Host } from './index.js'
import { Host } from '../index.js'
const datasource = 'govern-datasource/datasource/'

const api = 'govern-datasource/api/'

const apiList = {
	getSourceList: Host + datasource + 'list', // 查询数据源列表
	testConnect: Host + datasource + 'connectTest', // 测试连接
	getSourceInfo: Host + datasource + 'query', // 查询数据源
	updateSource: Host + datasource + 'update', // 修改数据源
	addSource: Host + datasource + 'add', // 新增数据源
	deleteSource: Host + datasource + 'delete', // 删除数据源
	// getSourceTree: Host + datasource + 'catalogue/tree', // 查询数据源目录列表
	// getSample: Host + datasource + 'sample', // 查询数据源样例数据
	getStructure: Host + datasource + 'structure', // 查询数据源库表结构
	getSourceMeta: Host + datasource + 'meta', // 查询数据源元数据
	getApiSample: Host + api + 'sample' //样例数据（api）
}
export default apiList
