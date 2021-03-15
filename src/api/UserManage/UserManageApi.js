/*
 * @Author: ShenLing
 * @Date: 2021-01-26 11:57:06
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 11:21:00
 */
import { Host } from '../index.js'
const userManage = 'user-manage'

const apiList = {
	getUserInfo: Host + userManage + '/login/getUser', // 获取用户信息
	logout: Host + userManage + '/login/logout', // 登出系统
	getDepartmentlist: Host + userManage + '/department/list', // 获取部门列表
	getUserList: Host + userManage + '/user/list', // 获取用户列表
}
export default apiList


