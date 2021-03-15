/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-01-08 11:31:36
 */
import AsyncComponent from '@/utils/asyncComponent'

const DataManage = AsyncComponent(() => import('@/pages/DataManage/DataSourceManage'))
const DataSourceCreateEditPreviewLayout= AsyncComponent(() => import('@/pages/DataManage/DataSourceManage/DataSourceCreateEditPreviewLayout'))


export default {
	DataManage, // 数据源管理
	DataSourceCreateEditPreviewLayout //数据源新增
}
