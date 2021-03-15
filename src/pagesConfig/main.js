/*
 * @Author: ShenLing
 * @Date: 2020-12-15 15:56:01
 * @LastEditors: Shenling
 * @LastEditTime: 2020-12-15 15:57:24
 */

import AsyncComponent from '@/utils/asyncComponent'

const MainPage = AsyncComponent(() => import('@/pages/Main'))


export default {
	MainPage, // 首页
}
