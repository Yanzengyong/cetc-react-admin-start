/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-03 15:51:05
 */
import DataManage from './DataManage'
import { enhancerMenu } from '@/utils/menuForRoute'

const Menu = [
	{
		title: '首页',
		icon: '',
		path: '/dataManage',
		defaultPath: '/dataManage/main',
		sideMenu: DataManage,
		layout: 'LayoutCommon'
	},
]

// 给MenuConfig的每一个对象都新增了layout属性和修改了path属性
const _enhancerMenu = enhancerMenu(Menu)

export default _enhancerMenu
