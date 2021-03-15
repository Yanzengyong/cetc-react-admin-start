import React from 'react'
import {
	Route,
	Redirect,
	Switch,
	HashRouter as Router,
	withRouter
} from 'react-router-dom'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import MenuConfig from '@/menus'
import AllPages from '@/pagesConfig'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { instantiationRouteDiv, DefaultMenu } from 'utils/menuForRoute'
import { getLocalStorageItem } from '@/utils/storage'
import './trastion.scss'


// 所有路由对象列表
const routeList = instantiationRouteDiv(MenuConfig)
// 包含layout的对象列表
const hasLayoutRoute = routeList.filter((item) => item.layout)
// 不包含layout的对象列表
const pureRoute = routeList.filter((item) => !item.layout)
// layout名称列表
const layoutNameList = hasLayoutRoute.map((item) => item.layout)
// layout种类列表
const typeOfLayout = []
// 此时我需要找到有几种类型的layout
layoutNameList.forEach((item) => {
	if (!typeOfLayout.includes(item)) {
		typeOfLayout.push(item)
	}
})
// 已经被分类好的layout列表，格式为[[ ...A_Layout列表 ], [ ...B_Layout列表 ]]
const layoutListOfType = typeOfLayout.map((item) => {
	return hasLayoutRoute.filter((ite) => ite.layout === item)
})
const ANIMATION_MAP = {
  PUSH: 'forward',
  POP: 'back',
	REPLACE: 'forward'
}

// 配置路由鉴权
const AuthRouteComponentHandle = (props) => {
	const {
		role,
		path,
		exact,
		component,
		title
	} = props

	const UserInfo = getLocalStorageItem('UserInfo') ?? {}
	const TOKEN = getLocalStorageItem('TOKEN')

	if (TOKEN) {
	// 存在用户信息、存在用户权限数组，并且该路由的权限至少属于这个用户权限数组的中某一个
		if (UserInfo &&
			UserInfo.role &&
			role.some((item) => item === UserInfo.role)) {
				// 此时该路由可以被加载到目标组件（因为他有访问该页面的权限）
				return (
					<Route
						path={path}
						exact={exact}
						render={(props) => {
							const ItemComponent = AllPages[component]
							return (
								<div style={{ width: '100%', height: '100%' }}>
									<ItemComponent
										{...props}
										title={title}
									/>
								</div>
							)
						}}
					/>
				)
		}
		return (
			<Route component={((extra) => (props) => <NotFound {...props} {...extra} />)({ Auth: 'no' })}/>
		)
	}
	return <Redirect to='/login' />
}

// 渲染无layout的路由列表
const RenderPureRoute = (routeList, props) => {
	return (
		<Route path='/pure'>
			<TransitionGroup style={{ width: '100%', height: '100%' }}>
				<CSSTransition
					key={props.location.pathname}
					timeout={500}
					classNames='forward'
				>
					<Switch>
						{
							routeList.map((item) => {
								return <AuthRouteComponentHandle key={item.path} {...item} />
							})
						}
						<Route component={NotFound}/>
					</Switch>
				</CSSTransition>
			</TransitionGroup>
		</Route>
	)
}

const LayoutRouteComponent = (routeList, props) => {
	const Layout = AllPages[routeList[0].layout]
	return (
		<Layout {...props}>
			<TransitionGroup style={{ width: '100%', height: '100%' }}>
				<CSSTransition
					key={props.location.pathname}
					timeout={500}
					classNames='forward'
				>
					<Switch>
						{
							routeList.map((item) => {
								return <AuthRouteComponentHandle key={item.path} {...item} />
							})
						}
						<Route component={NotFound}/>
					</Switch>
				</CSSTransition>
			</TransitionGroup>
		</Layout>
	)
}

@withRouter
class Routes extends React.Component {
	render () {
		return (
			<Switch>
				<Route path='/login' component={Login}/>
				{
					// 渲染无layout的route
					RenderPureRoute(pureRoute, this.props)
				}
				{
					// 渲染有layout的route
					layoutListOfType.map((item) => {
						const path = `/${item[0].layout}`
						return (
							<Route path={path} key={path}>
								{LayoutRouteComponent(item, this.props) }
							</Route>
						)
					})
				}
				<Redirect from='/' exact to={DefaultMenu.path} />
				<Route component={NotFound}/>
			</Switch>
		)
	}
}


const routes = () => {
	return (
		<Router>
			<Routes />
		</Router>
	)
}

export default routes
