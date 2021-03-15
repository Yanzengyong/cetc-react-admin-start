/*
 * @Author: ShenLing
 * @Date: 2021-01-28 17:23:45
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-23 12:12:08
 */
import { Message, Notification } from '@alifd/next'

// 用户操作权限控制配置
const userRightConfig = [
	// 1. 数据源接入
	// 1. 数据源接入 - 目录
	{
		pageName: '数据源接入',
		type: 'menu',
		role: {
			sys_admin: ['edit', 'check'], // 目录的edit代表可增删改
			service_admin: ['check'],
		},
	},
	// 1. 数据源接入 - 列表
	{
		pageName: '数据源接入',
		type: 'list',
		role: {
			sys_admin: ['check'],
			service_admin: ['create', 'delete', 'edit', 'check'],
		},
	},

	// 2. API注册
	// 2.1 API注册 - 目录
	{
		pageName: 'API注册',
		type: 'menu',
		role: {
			sys_admin: ['edit', 'check'], // 目录的edit代表可增删改
			service_admin: ['check'],
		},
	},
	// 2. API注册 - 列表
	{
		pageName: 'API注册',
		type: 'list',
		role: {
			sys_admin: ['check'],
			service_admin: ['create', 'delete', 'edit', 'check'],
		},
	},

	// 3. API清单 - 列表 （目录为readonly，故不做单独权限判断）
	{
		pageName: 'API清单',
		type: 'list',
		role: {
			sys_admin: ['check'],
			service_operator: ['check', 'subscript'],
		},
	},

	// 4. API审核 - 列表 （目录为readonly，故不做单独权限判断）
	{
		pageName: 'API审核',
		type: 'list',
		role: {
			service_admin: ['check', 'examine'],
		},
	},

	// 5. 我的API - 列表 （目录为readonly，故不做单独权限判断）
	{
		pageName: '我的API',
		type: 'list',
		role: {
			service_operator: ['check', 'subscript'],
		},
	},
]

/**
 * @name: 根据用户角色，获取用户在页面的目录/列表中对应操作的权限
 * @param {Array} roles 当前登录用户角色code数组
 * @param {String} pageName 当前页面名称，需同上方userRightConfig中的pageName进行对应
 * @param {String} pageType 当前页面操作类型：list - 列表；menu - 目录（例如数据源列表、数据源目录）
 * @param {String} operationType 当前操作类型，传入string需同上方userRightConfig中的role的操作栏对应，例如check/subscription
 * @return {Boolean} 若用户具有该项操作权限，则返回TRUE，反之为FALSE
 * @template getUserRight(['sys_admin', 'service_admin'], '数据源接入', 'list', 'update')
 */
const getUserRight = (roles, pageName, pageType, operationType) => {
	// 当前登录用户在当前查看页面（pageName）的页面类型（pageType）的权限
	let currentPageRightConfig = userRightConfig.filter((item) => { return item.pageName === pageName && item.type === pageType })
	let currentPageUserRight = currentPageRightConfig.length > 0 ? currentPageRightConfig[0].role : undefined

	if (roles.length > 0) {
		// 获取当前传入的多个角色的权限并集
		let rightsArray = []
		roles.map(roleItem => {
			let roleRights = currentPageUserRight[roleItem.roleCode]
			if (roleRights) {
				rightsArray = rightsArray.concat(roleRights)
			}
		})

		// 当前进行的操作operationType是否在可用权限并集内
		let operationRight = rightsArray.findIndex(item => { return item === operationType }) !== -1
		return operationRight
	}
	else {
		return false
	}
}

const getDepartmentRight = (itemDepartmentUuid, userInfo) => {
	if (userInfo.department && itemDepartmentUuid && itemDepartmentUuid === userInfo.department.uuid)
		return true
	else
		return false
}

export { getUserRight, getDepartmentRight }
