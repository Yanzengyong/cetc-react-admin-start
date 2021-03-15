/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-03 17:26:37
 */
export default [
	{
		title: '首页',
		path: '/dataManage/main',
		subLink: true,
		isSub: false,
		exact: true,
		role: ['sys_admin', 'service_admin', 'service_operator'],
		icon: 'icondesktop',
		component: 'MainPage',
	},
	{
		title: '数据源管理',
		path: '/dataManage/dataSource',
		isSub: true,
		exact: true,
		role: ['sys_admin', 'service_admin'],
		icon: 'iconsever-fill',
		children: [
			{
				title: '数据源接入',
				path: '/dataManage/dataSource/source',
				exact: true,
				component: 'DataManage',
				role: ['sys_admin', 'service_admin'],
				children: [
					{
						title: '新增数据源',
						path: '/dataManage/dataSource/source/create',
						exact: true,
						component: 'DataSourceCreateEditPreviewLayout',
						role: ['service_admin'],
						isHide: 'Y',
						type: 'create',
					},
					{
						title: '编辑数据源',
						path: '/dataManage/dataSource/source/edit',
						exact: true,
						component: 'DataSourceCreateEditPreviewLayout',
						role: ['service_admin'],
						isHide: 'Y',
						type: 'edit',
					},
					{
						title: '查看数据源',
						path: '/dataManage/dataSource/source/preview',
						exact: true,
						component: 'DataSourceCreateEditPreviewLayout',
						role: ['sys_admin', 'service_admin'],
						isHide: 'Y',
						type: 'preview',
					}
				]
			},
		]
	}

]
