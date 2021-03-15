const DefaultMenu = {
	title: '首页',
	path: '/LayoutCommon/dataManage/main',
	exact: true,
	component: 'MainPage',
}

// 增强menu（为menu按照原来的格式，给每一个对象中加入layout和path属性）
const enhancerMenu = (MenuConfig) => {
	const menuList = MenuConfig
	const loop = (menus, layout) => {
		menus.forEach((item) => {
			if (item.sideMenu && item.sideMenu.length > 0) {
				// 现在是主菜单，不需要做什么操作，继续往下进行遍历
				const defaultLayout = item.layout ?? ''
				Object.defineProperty(item, 'path', {
					value: defaultLayout ? `/${defaultLayout}${item.path}` : `/pure${item.path}`,
					writable: true,
					enumerable: true,
					configurable: true
				})
				Object.defineProperty(item, 'defaultPath', {
					value: defaultLayout ? `/${defaultLayout}${item.defaultPath}` : `/pure${item.defaultPath}`,
					writable: true,
					enumerable: true,
					configurable: true
				})
				loop(item.sideMenu, defaultLayout)
			} else {
				const newLayout = item.layout ?? layout
				Object.defineProperty(item, 'layout', {
					value: newLayout,
					writable: true,
					enumerable: true,
					configurable: true
				})
				Object.defineProperty(item, 'path', {
					value: newLayout ? `/${newLayout}${item.path}` : `/pure${item.path}`,
					writable: true,
					enumerable: true,
					configurable: true
				})
				if (item.children && item.children.length > 0) {
					loop(item.children, layout)
				}
			}
		})
	}
	loop(menuList)
	return menuList
}

// 将特定的侧边菜单栏转换为数据，每个单位包含父元素
const expendSideMenusHandle = (menus) => {
	let arr = []
	const loop = (menus, parent) => {
		menus.forEach((item) => {
			const newObj = {
				...item,
				parent
			 }
			if (item.children && item.children.length > 0) {
				arr = [...arr, { ...newObj }]
				loop(item.children, newObj)
			} else {
				arr = [...arr, { ...newObj }]
			}
		})
	}
	loop(menus)
	return arr
}

// 将所有平台中的侧边菜单转换为数组，实例化路由对象 (存在component的菜单对象即实例路由)
const instantiationRouteDiv = (MenuConfig) => {
	let routerList = []

	MenuConfig.forEach((item) => {
		const loopMenu = (menus) => {
			menus.forEach((menu) => {
				if (menu.children && menu.children.length > 0) {
					loopMenu(menu.children)
					menu.isSub && !menu.component
						? routerList = [...routerList]
						: routerList = [
							{
								...menu
							},
							...routerList
						]
				} else {
					routerList = [
						{
							...menu
						},
						...routerList
					]
				}
			})
		}
		loopMenu(item.sideMenu)
	})
	return routerList
}

// 获取当前地址的面包屑数据
const getBreadcrumbData = (currentPathInfo) => {
	let breadcrumbList = []
	const loop = (info) => {
		if (info && info.parent && !info.parent.isNav) {
			breadcrumbList.unshift(info)
			loop(info.parent)
		} else {
			breadcrumbList.unshift(info)
		}
	}
	loop(currentPathInfo)
	return breadcrumbList
}

// 获取当前的菜单对象
const findCurrentRouteItem = (MenuConfig, path, title) => {
	const routeList = instantiationRouteDiv(MenuConfig)
	const currentPath = path
	const currentTitle = title
	return routeList.find(
		(item) => item.path === currentPath || item.title === currentTitle
	)
}

/**
 * @name: 根据菜单标题，直接获取菜单对象
 * @param {String} title 在menu中记录的菜单标题
 * @return {*}
 */
const findSpecRouteItem = (MenuConfig, title) => {
	const routeList = instantiationRouteDiv(MenuConfig)
	const specRouteItem = routeList.find(item => item.title === title)
	return specRouteItem ?? {}
}

export {
	DefaultMenu,
	enhancerMenu,
	expendSideMenusHandle,
	instantiationRouteDiv,
	getBreadcrumbData,
	findCurrentRouteItem,
	findSpecRouteItem
}
