/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-10-10 15:05:16
 * @LastEditors: Shenling
 * @LastEditTime: 2020-10-26 09:13:29
 */
import { Host } from '../index.js'
const datapool = 'govern-datapool/datapool/'
const apiList = {
	getStructure: Host + datapool + 'structure', // 查询库表结构
	getDataStorageMeta: Host + datapool + 'meta', // 查询元数据
	dataStorageUpdate: Host + datapool + 'update', // 更新数据资源池存储配置
	getDataStorage: Host + datapool + 'query', // 查询数据资源池存储配置
	connectRequest: Host + datapool + 'connectTest', // 测试连接接口
}
export default apiList
