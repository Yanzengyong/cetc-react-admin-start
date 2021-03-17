/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-08-17 09:06:45
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-12-30 10:10:08
 */
import React from 'react'
import { Breadcrumb, Button } from '@alifd/next'
import { withRouter } from 'react-router-dom'
import MenuConfig from '@/menus'
import IconFont from '@/components/IconFont'
import { DefaultMenu, expendSideMenusHandle, getBreadcrumbData } from 'utils/menuForRoute'
import './index.scss'


class InfoHead extends React.Component {
	state = {
		breadcrumbList: []
	}
	componentDidMount () {

		const route = this.props.location

		this.initBreadcrumb(route.pathname)
	}

	// 初始化面包屑
	initBreadcrumb = (path) => {

		const UrlPath = path === '/' ? DefaultMenu.path : path

		const currentMain = MenuConfig.find((item) => {
			return UrlPath.indexOf(item.path) !== -1
		})

		const currentSideMenu = currentMain ? currentMain.sideMenu : []

		const expendSideMenus = expendSideMenusHandle(currentSideMenu)

		const currentPathInfo = expendSideMenus.find((item) => item.path === UrlPath)

		const breadcrumbList = getBreadcrumbData(currentPathInfo)

		this.setState({
			breadcrumbList
		})
	}

	backRouteHandle = () => {
		this.props.history.go(-1)
	}
	render () {
		return (
			<div className="info_head">
				<Breadcrumb>
					{
						this.state.breadcrumbList.map((item) => (
							<Breadcrumb.Item key={item.path}>
								<span className='breadcrumb_title'>{item.title}</span>
							</Breadcrumb.Item>
						))
					}
				</Breadcrumb>
				<Button
					className='infoHead_back'
					text
					onClick={this.backRouteHandle}
				><IconFont className='infoHead_back_icon' type='iconrollback' size='large'/>返回</Button>
			</div>
		)
	}
}

export default withRouter(InfoHead)
