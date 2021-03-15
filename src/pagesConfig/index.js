/*
 * @Author: Zhangyao
 * @Date: 2020-09-18 11:38:30
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-03 15:50:39
 */
import DataManage from './dataManage'
import MainPage from './main'
import LayoutCommon from '@/layout'

export default {
	...DataManage,
	...MainPage,
	LayoutCommon
}
