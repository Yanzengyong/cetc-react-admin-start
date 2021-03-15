/*
 * @Author: Zhangyao
 * @Date: 2020-08-17 11:06:21
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-11-05 09:09:28
 */
import { Host } from '../index'

export const formatUrl = (part = 'govern-datasource/datasource') => {
	const partUrl = `${part}/catalogue/`

	return {
		getTree: Host + partUrl + 'tree', // 获取目录树
		addTree: Host + partUrl + 'add', //添加数据目录
		deleteTree: Host + partUrl + 'delete', //修改数据目录
		updateTree: Host + partUrl + 'update' //删除数据目录
	}
}

