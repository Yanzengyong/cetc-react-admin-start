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
	},

	{
		title: 'API服务',
		path: '/dataManage/dataService',
		isSub: true,
		role: ['sys_admin', 'service_admin', 'service_operator'],
		icon: 'iconapi',
		children: [
			{
				title: 'API注册',
				path: '/dataManage/apiService/register',
				exact: true,
				component: 'ApiRegister',
				role: ['sys_admin', 'service_admin'],
				children: [
					{
						title: '新增API注册',
						path: '/dataManage/apiService/register/create',
						exact: true,
						component: 'ApiRegisterCreateEditPreview',
						role: ['service_admin'],
						isHide: 'Y',
						type: 'create',
					},
					{
						title: '编辑API注册',
						path: '/dataManage/apiService/register/edit',
						exact: true,
						component: 'ApiRegisterCreateEditPreview',
						role: ['service_admin'],
						isHide: 'Y',
						type: 'edit',
					},
					{
						title: '查看API注册',
						path: '/dataManage/apiService/register/preview',
						exact: true,
						component: 'ApiRegisterCreateEditPreview',
						role: ['sys_admin', 'service_admin'],
						isHide: 'Y',
						type: 'preview',
					}
				]
			},
			{
				title: 'API清单',
				path: '/dataManage/apiService/list',
				exact: true,
				component: 'ApiList',
				role: ['sys_admin', 'service_operator'],
				children: [
					{
						title: '查看API清单',
						path: '/dataManage/apiService/list/preview',
						exact: true,
						component: 'ApiListPreview',
						role: ['sys_admin', 'service_operator'],
						isHide: 'Y',
						type: 'preview',
					}
				]
			},
			{
				title: 'API审核',
				path: '/dataManage/apiService/examine',
				exact: true,
				component: 'ApiExamine',
				role: ['service_admin'],
				children: [
					{
						title: '查看API审核',
						path: '/dataManage/apiService/examine/preview',
						exact: true,
						component: 'ApiExaminePreview',
						role: ['service_admin'],
						isHide: 'Y',
						type: 'preview',
					}
				]
			},
			{
				title: '我的API',
				path: '/dataManage/apiService/mine',
				exact: true,
				component: 'MyApi',
				role: ['service_operator'],
				children: [
					{
						title: '查看我的API',
						path: '/dataManage/apiService/mine/preview',
						exact: true,
						component: 'MyApiPreview',
						role: ['service_operator'],
						isHide: 'Y',
						type: 'preview',
					}
				]
			}
		]
	},

]
