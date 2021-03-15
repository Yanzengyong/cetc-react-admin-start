import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Nav, Tab, Dropdown, Menu, Message, Select } from '@alifd/next'
import MenuConfig from '@/menus'
import { getQueryItemValue } from '@/utils/common'
import { getLocalStorageItem, clearLocalStorage, removeSessionStorageItem, clearSessionStorage } from '@/utils/storage'
import { DefaultMenu, expendSideMenusHandle, findCurrentRouteItem } from '@/utils/menuForRoute'
import IconFont from '@/components/IconFont'
import { Tab as TabAction, User as UserRedux } from '@/reduxActions'
import { UserManageAction } from '@/actions'
import { LOGIN_URL, HOME_URL } from '@/api'
import './index.scss'

const {
	getUserInfo,
	logout
} = UserManageAction

const { Item, SubNav } = Nav
@connect((state) => (
	{
		state: state.tabs,
		user: state.user
	}
), { ...TabAction, ...UserRedux })
class Layout extends React.Component {
	state = {
		systemDataSource: [{
			icon: 'Top-home',
			label: '数据服务系统',
			value: '数据服务系统'
		}],
		showContextMenu: false,
		currentContextMenu: {}, // 右键点击的tab
		sideMenu: [],
		sideNavSelectedKeys: [], // 左侧菜单栏选中的selectkeys
		sideNavOpenKeys: [], // 左侧菜单栏打开的openkeys
		activeKey: '',
		showSearchInput: false, // 是否展示search输入框
		selectValue: '数据服务系统',
		selectList: [
			{ systemName: '首页', systemUuid: '000' },
			{ systemName: '数据服务系统', systemUuid: 10000 }
		],
		showBox: true
	}

	async componentDidMount () {
		const route = this.props.location
		this.userInit()
		this.renderRouteTab(route)
		this.initMenu(route.pathname)
		this.routerListenerHandle()
	}

	componentWillUnmount () {
		this.setState = () => {
			return
		}
	}

	// 获取用户信息
	userInit = async () => {
		const TOKEN = getQueryItemValue(this.props.location.search, 'token')

		if (!TOKEN) { // 地址中不存在token
			const _UserInfo = getLocalStorageItem('UserInfo') ?? {}
			// 没有用户token
			if (!_UserInfo) {
				// 没有用户信息
				window.location.href = LOGIN_URL
			}
			if (_UserInfo && Object.keys(this.props.user.userInfo).length === 0) {
				// 本地有用户信息，但store中没有用户信息
				this.props.setUserInfo(_UserInfo)
			}
			return
		}

		const response = await getUserInfo({ token: TOKEN }, {
			headers: {
				'TOKEN': TOKEN
			}
		})

		if (response && response.code === 10000) {
			// 保存用户信息到store中，并且存储在本地
			this.props.setUserInfo({
				...response.result,
				token: TOKEN
			})
			this.setState({
				selectList: this.getSystemList(response.result.roleList)
			})
		} else {
			Message.error(response && response.errorMsg || '获取用户信息失败！')
		}
	}

	//对象数组去重
	getSystemList (arr) {
		let resultArr = arr.reduce((cur, next) => {
			if (cur.findIndex(item => { return item.systemUuid === next.systemUuid }) === -1) {
				cur.push({ systemName: next.systemName, systemUuid: next.systemUuid })
			}
			return cur
		}, [])
		let result = [{ systemName: '首页', systemUuid: '000' }].concat(resultArr)
		return result
	}

	// 跳转不同的系统
	onChange = (v) => {
		switch (v) {
			case '首页': window.location.href = HOME_URL; break
			// case '首页': window.location.href = 'http://localhost:3001/#/platform/home'; break
			case '数据服务系统' : break // 当前系统，不做操作
			default: Message.info('暂未开放，敬请期待'); break
		}
		this.setState({ selectValue: v })
	}

	// 退出登录
	onLogoutSystem = async () => {
		const TOKEN = getLocalStorageItem('TOKEN')
		await logout({ token: TOKEN })
		clearLocalStorage()
		clearSessionStorage()
		window.location.href = LOGIN_URL
	}

	// 监听点击事件（点击某个元素之外自动隐藏此元素）
	clickOtherCloseDom = (e) => {
		const _con = document.querySelector('.tabRender_option_box') // 设置目标区域

		const isChild = (parent, node) => {
			while (node && (node = node.parentNode))
				if (node === parent) return true
			return false
		}

		if (!isChild(_con, e.target)) {
			this.setState({
				showContextMenu: false
			})
		}

	}


	// 监听路由change事件
	routerListenerHandle = () => {
		this.props.history.listen((route) => {
			this.renderRouteTab(route)
			this.initMenu(route.pathname)
		})
	}

	// 根据路由来渲染对应的tab页面
	renderRouteTab = (route) => {
		const NotFound = {
			title: 'NotFound',
			path: route.pathname,
			component: 'NotFound',
		}
		// 菜单路由对象
		const currentTab =
			route.pathname === '/'
				? DefaultMenu
				: findCurrentRouteItem(MenuConfig, route.pathname) ?? NotFound
		const { tabs } = this.props.state

		const NoNotFoundTab = tabs.filter(
			(item) => item.title !== 'NotFound'
		)

		const _title = route.search !== '' && !getQueryItemValue(route.search, 'token') ? `${currentTab.title}(${getQueryItemValue(route.search, 'title')})` : currentTab.title

		let avtiveRoutePath

		if (route.pathname === '/') {
			avtiveRoutePath = DefaultMenu.path
		} else {
			avtiveRoutePath = `${route.pathname}-${route.search}`
		}

		const finalTabs = currentTab.title !== 'NotFound'
		? this.arrayOnlyHandle([
			...tabs,
			{ ...currentTab, search: route.search, title: _title },
		])
		: this.arrayOnlyHandle([
			...NoNotFoundTab,
			route.pathname !== '/'
				? { ...currentTab, search: route.search, title: _title }
				: null,
		])

		this.props.setTabs(finalTabs)

		this.setState({
			activeKey: avtiveRoutePath,
		})
	}

	// 获取需要展开的nav菜单
	getSubMenuOpenKeys = (PathInfo) => {
		let sideNavOpenKeys = ''

		const loopGetOpenKeys = (currentPathInfo) => {
			if (currentPathInfo.parent) {
				currentPathInfo.parent.isSub
					? (sideNavOpenKeys = currentPathInfo.parent.path)
					: loopGetOpenKeys(currentPathInfo.parent)
			} else {
				sideNavOpenKeys = ''
			}
		}
		loopGetOpenKeys(PathInfo)
		return sideNavOpenKeys
	}

	// 初始化菜单
	initMenu = (path) => {
		const UrlPath = path

		const currentMain = MenuConfig.find((item) => {
			return UrlPath.indexOf(item.path) !== -1
		})

		// 类别主题菜单选中值
		const currentMainSelectKeys = currentMain ? currentMain.path : ''

		const currentSideMenu = currentMain ? currentMain.sideMenu : []

		const expendSideMenus = expendSideMenusHandle(currentSideMenu)

		const currentPathInfo =
			expendSideMenus.find((item) => item.path === UrlPath) ?? {}

		const sideNavSelectedKeys = currentPathInfo.isHide
			? currentPathInfo.parent.path
			: currentPathInfo.path

		const sideNavOpenKeys = this.getSubMenuOpenKeys(currentPathInfo)
		console.log(currentSideMenu)
		this.setState({
			MainNavselectedKeys: currentMainSelectKeys,
			sideMenu: currentSideMenu,
			sideNavSelectedKeys: sideNavSelectedKeys,
			sideNavOpenKeys: sideNavOpenKeys,
		})
	}

	// 头部菜单的选中
	headerNavSelect = (selectedKeys, item) => {
		const mainMenu = item.props.data || {}
		const sideMenu = mainMenu ? mainMenu.sideMenu : []

		const expendSideMenus = expendSideMenusHandle(sideMenu)

		const currentPathInfo =
			expendSideMenus.find((item) => item.path === mainMenu.defaultPath) ?? {}

		const sideNavSelectedKeys = currentPathInfo.isHide
			? currentPathInfo.parent.path
			: currentPathInfo.path

		const sideNavOpenKeys = this.getSubMenuOpenKeys(currentPathInfo)

		this.setState(
			{
				MainNavselectedKeys: selectedKeys,
				sideMenu: sideMenu,
				sideNavSelectedKeys: sideNavSelectedKeys,
				sideNavOpenKeys: sideNavOpenKeys,
			},
			() => {
				this.props.history.replace(sideNavSelectedKeys)
			}
		)
	}

	// 对象数组去重
	arrayOnlyHandle = (arr) => {
		const deleteInvalid = arr.filter(
			(item) => item !== null && item !== undefined
		)
		let obj = {}
		return deleteInvalid.reduce((curs, next) => {
			if (!next.search) {
				obj[next.path] ? '' : obj[next.path] = true && curs.push(next)
			} else {
				obj[next.path] ? curs.findIndex((item) => `${item.path}${item.search}` === `${next.path}${next.search}`) !== -1 ? '' : obj[next.path] = true && curs.push(next) : obj[next.path] = true && curs.push(next)
			}
			return curs
		}, [])
	}

	// 侧边栏菜单的选中
	sideNavSelect = (selectedKeys) => {
		this.setState({
			sideNavSelectedKeys: selectedKeys,
		})
	}

	// 侧边栏菜单展开
	sideNavOpen = (openKeys, extra) => {
		const currentKeys = extra.open ? extra.key : []
		this.setState({
			sideNavOpenKeys: currentKeys,
		})
	}


	// 渲染侧边菜单的函数
	renderNavHandle = (menu) =>
		menu.map((menuItem) => {
			console.log(menuItem)
			const UserInfo = getLocalStorageItem('UserInfo') ?? {}

			// 复用逻辑
			const renderItem = (data) => {

				if (
					data.path.indexOf('http') !== -1 ||
					data.path.indexOf('https') !== -1
				) {
					return (
						<Item key={data.path} data={data}>
							<a
								rel="noopener noreferrer"
								href={data.path}
								target="_blank"
							>
								{data.title}
							</a>
						</Item>
					)
				} else {
					return !data.isSub && !data.subLink ? (
						<Item key={data.path} data={data} icon={(
							<IconFont
								size='large'
								type={menuItem.icon}
							/>
						)}>
							<Link className="menu_title" to={data.path}>
								<span>{data.title}</span>
							</Link>
						</Item>
					) : (
						<Item className="menu_noIsSub" key={data.path} data={data} icon={(
							<IconFont
								size='large'
								type={menuItem.icon}
							/>
						)}>
							<Link className='menu_noIsSub_link' to={data.path}>
								<span>{data.title}</span>
							</Link>
						</Item>
					)
				}

			}

			if (UserInfo && UserInfo.roleList) {
				let matchMenu = UserInfo.roleList.filter(roleItem => {
					return menuItem.role.indexOf(roleItem.roleCode) !== -1
				})
				if (matchMenu.length > 0) {
					if (menuItem.children && menuItem.children.length > 0) {
						const isSubNav = menuItem.children.some(
							(item) => item.isHide && item.isHide === 'Y'
						)
						if (!isSubNav) {
							return (
								<SubNav icon={(
									<IconFont
										size='large'
										type={menuItem.icon}
									/>
								)} label={menuItem.title} key={menuItem.path}>
									{this.renderNavHandle(menuItem.children)}
								</SubNav>
							)
						} else {

							return renderItem(menuItem)
						}
					} else {
						return renderItem(menuItem)
					}
				}
			}
		})

	// tab栏的关闭
	onCloseTab = async (path, search) => {

		// 判断是否存在【关闭其他、关闭所有】按钮，存在即不可以做其他操作（选择中也应该加入此规则）
		const { showContextMenu } = this.state
		if (showContextMenu) {
			return
		}

		const { location } = this.props

		const { tabs } = this.props.state

		const closePath = `${path}${search}`

		// 清除本地存储
		removeSessionStorageItem(closePath)

		// 设置被删除的的tab的path数组
		await this.props.setDeleteTabPath([closePath])

		const deleteTabIndex = tabs.findIndex((item) => `${item.path}${item.search}` === closePath)

		const currentUrlPath = `${location.pathname}${location.search}`
		const activeKeyPath = `${location.pathname}-${location.search}`

		const newTabs = tabs.filter((item) => {
			if (item.path !== path) {
				return item
			}
			if (item.path === path && item.search !== search) {
				return item
			}
		})

		let currentTabPath = ''
		const newTabLength = newTabs.length

		if (newTabLength > 0) {
			// 说明至少存在一个
			if (closePath === currentUrlPath) {
				// 假设我现在删除的是我选中的
				if (newTabLength - 1 >= deleteTabIndex + 1) {
					// 当前所剩的tabs的最大索引大于等于我的删除索引+1时，说明我删除的至少不是最后一个tab
					currentTabPath = `${newTabs[deleteTabIndex].path}${newTabs[deleteTabIndex].search}`
				} else {
					// 否则说明我删除的是末尾的tab
					currentTabPath = `${newTabs[newTabLength - 1].path}${newTabs[newTabLength - 1].search}`
				}
			} else {
				// 假设我现在删除的不是我选中的
				currentTabPath = currentUrlPath
			}
		} else {
			// 所有tab被删除完后所做的事情
			currentTabPath = '/'
		}

		this.props.setTabs(newTabs)
		this.setState(
			{
				activeKey: activeKeyPath,
			},
			() => {
				this.props.history.replace(currentTabPath)
			}
		)
	}

	// 右键选项关闭的处理函数
	closeTabHandle = async (type) => {

		const { currentContextMenu } = this.state
		const { tabs } = this.props.state

		let closeTabsArr = []
		let stayTabs = []
		let activeKey = ''
		let goPath = '/'
		if (type && type === 'other') {
			stayTabs = [currentContextMenu]
			activeKey = `${currentContextMenu.path}-${currentContextMenu.search}`
			goPath = `${currentContextMenu.path}${currentContextMenu.search}`
			closeTabsArr = tabs.filter((item) => `${item.path}${item.search}` !== goPath).map((item) => `${item.path}${item.search}`)
		}
		if (type && type === 'all') {
			stayTabs = []
			activeKey = ''
			goPath = '/'
			closeTabsArr = tabs.map((item) => `${item.path}${item.search}`)
		}

		this.props.setTabs(stayTabs)

		// 设置当前删除的tabs的path数组
		await this.props.setDeleteTabPath(closeTabsArr)
		// 清除本地存储
		closeTabsArr.forEach((item) => {
			removeSessionStorageItem(item)
		})

		this.setState({
			showContextMenu: false,
			currentContextMenu: {},
			activeKey: activeKey,
		}, () => {
			this.props.history.replace(goPath)
		})
	}

	// 自定义选项卡渲染
	tabRender = (key, props) => {

		const Search = props.data.search ?? ''
		const Path = props.data.path ?? ''

		const onCloseTab = (e) => {
			// 阻止事件冒泡
			e.stopPropagation()

			this.onCloseTab(Path, Search)
		}

		const onSeleteTab = (e) => {

			e.stopPropagation()
			// 判断是否存在【关闭其他、关闭所有】按钮，存在即不可以做其他操作（选择中也应该加入此规则）
			const { showContextMenu } = this.state
			if (showContextMenu) {
				return
			}
			this.setState({ activeKey: key }, () => {
				this.props.history.replace(`${Path}${Search}`)
			})
		}

		const onContextMenuTab = (e) => {
			e.preventDefault()

			const x = e.clientX - document.querySelector('.layout_menu').offsetWidth
			const y = e.clientY - document.querySelector('.layout_header').offsetHeight

			this.setState({
				showContextMenu: true,
				x,
				y,
				currentContextMenu: props.data
			})
		}

		return (
			<div onClick={onSeleteTab} onContextMenu={onContextMenuTab} className="tabRender_box">
				<span className='tabRender_title' title={props.title} >{props.title}</span>
				<IconFont
					onClick={onCloseTab}
					type="delete-filling"
					original
					size={18}
					className='tabDelete_icon'
				/>
			</div>
		)
	}

	// 点击顶部seatch按钮
	searchIconClick = () => {
		this.setState({
			showSearchInput: true
		})
	}

	// 打开关闭头部系统选择栏
	switchSystemHandle = () => {
		const {
			switchSystemVisible
		} = this.state

		this.setState({
			switchSystemVisible: !switchSystemVisible
		})
	}

	// 选中系统
	selectedSystemHandle = (key, object) => {
		this.setState({ switchSystemVisible: false })
		switch (key) {
			case 'home': window.location.href = HOME_URL; break
			case 'data_service': break // 当前系统，不做操作
			default: Message.info('暂未开放，敬请期待'); break
		}
	}

	render () {
		const {
			systemDataSource,
			sideMenu,
			sideNavSelectedKeys,
			sideNavOpenKeys,
			activeKey,
			showContextMenu,
			y,
			x,
			switchSystemVisible,
			selectValue,
			selectList
		} = this.state

		const { tabs, } = this.props.state

		const TOKEN = getLocalStorageItem('TOKEN')
		const UserInfo = getLocalStorageItem('UserInfo') ?? {}

		const isLoad = TOKEN || getLocalStorageItem('UserInfo') ? true : false

		return (
			<div className="layout_container" onClick={this.clickOtherCloseDom}>
				<div className='layout_leftBox' >
					<div className="layout_logo">
						<img
							src="assets/images/mainLogo.png"
							className="layout_logo_img"
							alt="logo"
						/>
					</div>
					<Nav
						className="layout_menu"
						openMode="single"
						type="secondary"
						selectedKeys={sideNavSelectedKeys}
						onSelect={this.sideNavSelect}
						openKeys={sideNavOpenKeys}

						onOpen={this.sideNavOpen}
					>
						{this.renderNavHandle(sideMenu)}
					</Nav>
				</div>


				<div className="layout_main">
					<div className="layout_header">
						<div className="layout_header_left" />
						<div className="layout_header_right">
							<Select
									size="large"
									hasBorder={false}
									defaultValue='数据服务系统'
									value={selectValue}
									onChange={this.onChange}
								>
									{selectList.length > 0 ? selectList.map((item) => {
										return (
											<Select.Option key={item.systemName} value={item.systemName}>
												{item.systemName}
											</Select.Option>
										)
									}) : null}
								</Select>

							<div className="ver_divider"/>

							<Dropdown
								trigger={
									<div className="latout_header_userBox">
										<div className="avatar_img">
											<img src="assets/images/user.png" alt="头像"/>
										</div>
										<div className="avatar_name">{UserInfo.name || '未登陆'}</div>
									</div>
								}
								triggerType="hover"
								offset={[0, 10]}
							>
								<Menu
									className="layout_drop_down_menu"
									onItemClick={(key) => {
										if (key === 'logout') {
											this.onLogoutSystem(TOKEN)
										}
									}}
								>
									<Menu.Item key="logout">
										<IconFont size={20} type="iconlogout" />
										<span className="menuFont">退出登录</span>
									</Menu.Item>
								</Menu>
							</Dropdown>

						</div>
					</div>

					<div className="layout_content">
						{
							showContextMenu ? (
								<ul style={{ top: y, left: x }} className='tabRender_option_box'>
									<li onClick={() => this.closeTabHandle('other')}>关闭其他</li>
									<li onClick={() => this.closeTabHandle('all')}>关闭所有</li>
								</ul>
							) : null
						}
						<Tab
							className="layout_tab_box"
							navClassName="layout_url_tab"
							activeKey={activeKey}
							tabRender={this.tabRender}
							animation={false}
						>
							{tabs.map((item) => (
								<Tab.Item
									key={`${item.path}-${item.search}`}
									closeable
									title={item.title}
									data={item}
								/>
							))}
						</Tab>
						<div className="layout_content_body">
							{isLoad && this.props.children}
						</div>
						<div className="layout_footer_copyright">
							<div className="copyleft"></div>
							<div className="copyright">
								<img
									src="assets/images/mainLogo.png"
									className="layout_footer_logo"
									alt="logo"
								/>
								<span className='layout_logo_title'>© 中电科大数据研究院有限公司 提升政府治理能力大数据应用技术国家工程实验室</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Layout
