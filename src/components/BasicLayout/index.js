/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-08-17 09:06:45
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-01-19 13:52:45
 */

import React from 'react'
import CatalogueService from '@/componentsService/CatalogueService'
import PropTypes from 'prop-types'
import { Breadcrumb, Button } from '@alifd/next'
import { withRouter, Link } from 'react-router-dom'
import MenuConfig from '@/menus'
import {	DefaultMenu, expendSideMenusHandle, getBreadcrumbData } from 'utils/menuForRoute'
import './index.scss'

class BasicLayout extends React.Component {
	state = {
		breadcrumbList: []
	}
	componentDidMount () {

		const route = this.props.location

		this.initBreadcrumb(route.pathname)
	}
  matchedKeys = []
  static propTypes = {
  	subTitle: PropTypes.string, // 左边栏标题
  	onlyRight: PropTypes.bool, // 是否需左边树形结构的布局
  	title: PropTypes.string, // 右边栏（主内容）的标题
  	onSelectedHandle: PropTypes.func, // 树节点被选中的函数
  	leftReactNode: PropTypes.node, // div节点
		headRightReactNode: PropTypes.node, // div节点
		headLeftReactNode: PropTypes.node, // div节点
  	leftContainerStyle: PropTypes.object, // 右边盒子的style
		rightContainerStyle: PropTypes.object, // 右边盒子的style
		notMainPage: PropTypes.bool, // 不是主页面
		treeMaxLevel: PropTypes.number, // 目录树可新增的最大层级
		readOnly: PropTypes.bool, // 是否可以编辑，默认可以编辑
		isVerify: PropTypes.bool, // 是否验证用户，以用户信息来获取目录（true：验证用户所属部门，筛选该部门的目录；false：不验证用户所属部门）
  }
  static defaultProps = {
		leftReactNode: null,
		headLeftReactNode: null,
  	headRightReactNode: null,
  	rightContainerStyle: null,
  	leftContainerStyle: null,
  	subTitle: '我是副（左）标题',
  	onlyRight: false,
		title: '我是主（右）标题',
		notMainPage: false,
		treeMaxLevel: null,
		readOnly: false,
		isVerify: false
  }

  // 目录节点选中
  onSelectedHandle = (node) => {
  	const { onSelectedHandle } = this.props
  	if (onSelectedHandle) {
  	  onSelectedHandle(node)
  	}
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
  	const {
  		subTitle,
  		onlyRight,
  		title,
  		leftReactNode,
  		rightContainerStyle,
			leftContainerStyle,
			headLeftReactNode,
			headRightReactNode,
			notMainPage,
			catalogueType,
			treeMaxLevel,
			readOnly,
			isVerify
  	} = this.props

  	return (
  		<div className="basicLayout_container">
  			{!onlyRight && !leftReactNode ? (
  				<div className="basicLayout_left" style={leftContainerStyle}>
  					<div className="basicLayout_head">
  						<h1>{subTitle}</h1>
  					</div>
  					<div className="basicLayout_body">
  						<CatalogueService
								isVerify={isVerify}
								catalogueType={catalogueType}
								maxLevel={treeMaxLevel}
								readOnly={readOnly}
  							onSelectedHandle={this.onSelectedHandle}
  						/>
  					</div>
  				</div>
  			) : leftReactNode}
  			<div
  				className={onlyRight ? 'basicLayout_onlyright' : 'basicLayout_right'}
  				style={rightContainerStyle}
  			>
					{notMainPage ? (
						<div className="basicLayout_head_noMainPage">
								{headLeftReactNode ? (
										<div>{headLeftReactNode}</div>
									): (
										<Breadcrumb>
											{
												this.state.breadcrumbList.map((item, index) => (
													<Breadcrumb.Item key={item.path}>
														{this.state.breadcrumbList.length - 1 === index ? (
															item.title
														) : <Link to={item.path}> {item.title} </Link>}
													</Breadcrumb.Item>
												))
											}
										</Breadcrumb>
									)
								}

								{headRightReactNode ? (
										<div>{headRightReactNode}</div>
									) : (
										<Button
											size='medium'
											type="primary"
											onClick={this.backRouteHandle}
										>返回</Button>
									)
								}
							</div>
						): (
							<div className="basicLayout_head">
								{headLeftReactNode ? <div className='basicLayout_head_left'>{headLeftReactNode}</div> : <h1>{title}</h1> }
								{headRightReactNode ? <div className='basicLayout_head_right'>{headRightReactNode}</div> : null}
							</div>
						)
					}
  				<div className="basicLayout_body">{this.props.children}</div>
  			</div>
  		</div>
  	)
  }
}

export default withRouter(BasicLayout)
