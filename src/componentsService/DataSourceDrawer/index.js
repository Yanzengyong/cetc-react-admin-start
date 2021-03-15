import React, { Component } from 'react'
import { Collapse, Drawer, Grid } from '@alifd/next'
import IconFont from '@/components/IconFont'
import './index.scss'
import { jumpToPage } from '@/utils/common'
import { connect } from 'react-redux'
const Panel = Collapse.Panel
const { Row, Col } = Grid
@connect((state) => ({ state: state.tabs }))
class dataSourceDrawer extends Component {
	state = {
		dataSourceDrawerVisible: false,
		drawerWidth: '',
		drawerHeight: '',
		defaultExpandedKeys: ['panelone', 'paneltwo', 'panelthree', 'panelfour'],
	}

	onClose = () => {
		this.setState({
			dataSourceDrawerVisible: false,
		})
	}
	componentDidMount () {
		const contentDiv = document.querySelector('.layout_content')
		const viewportHeight = document.documentElement.clientHeight
		const topStart = contentDiv ? contentDiv.getBoundingClientRect().top : 0

		//动态获取drawer宽度和drawer高度
		this.setState({
			// drawerWidth: window.innerWidth / 4.5,
			drawerHeight: viewportHeight - topStart
		})
	}
	render () {
		const { dataSourceDrawerVisible, dataSourceDrawerOnClose } = this.props
		const { drawerWidth, defaultExpandedKeys, drawerHeight } = this.state
		// 需要新增数据源，直接Iconfont增加一张图，然后放到对应的分类即可
		// const relation = ['MySQL', 'PostgreSQL']
		const relation = [
			{
				icon: 'postgresql-plain-wordmarkbeifen2',
				type: 'mysql',
				title: 'MySQL',
			},
			{
				icon: 'postgresql-plain-wordmark',
				type: 'postgresql',
				title: 'PostgreSQL',
			},
			{
				icon: 'kingbase',
				type: 'KingbaseV8',
				title: 'KingbaseV8',
			},
		]
		const norelation = ['MongoDB']
		const threeDatasource = ['Kafka']
		// Api。暂时先隐藏
		const file = ['File']
		return (
			<Drawer
				className='drawer_container'
				headerStyle={{
					padding: '16px 0',
					boxShadow: '0px 3px 4px 3px rgba(41,40,40,0.04)'
				}}
				hasMask={false}
				title="请选择数据源类型"
				placement="bottom"
				visible={dataSourceDrawerVisible}
				onClose={dataSourceDrawerOnClose}
				width={458}
				height={drawerHeight}
			>
				<div className='drawer_selected_item_box'>
					<h1>关系型数据库</h1>
					<Row gutter={32} wrap>
						{relation.map((item, index) => {
							return (
								<Col className='item' span="8" key={index}>
									<IconFont
										type={'icon' + item.icon}
										className="icon"
										key={item}
										onClick={() => {
											const params = [
												{ label: 'type', value: item.type },
												{ label: 'title', value: item.title },
											]
											jumpToPage(
												this.props,
												'新增数据源',
												params,
												false,
												this.props.currentPage
											)
										}}
									/>
								</Col>
							)
						})}
        	</Row>
				</div>
				{/* <Collapse defaultExpandedKeys={defaultExpandedKeys}> */}
					{/* <Panel title="关系型数据库" key="panelone">
						<div className="data_source_drawerpanel">
							{relation.map((item) => {
								return (
									<IconFont
										type={'icon' + item}
										size="xxl"
										className="icon"
										key={item}
										onClick={() => {
											const params = [
												{ label: 'type', value: item },
												{ label: 'title', value: item },
											]
											jumpToPage(
												this.props,
												'新增数据源',
												params,
												false,
												this.props.currentPage
											)
										}}
									/>
								)
							})}
						</div>
					</Panel> */}
					{/* <Panel title="非关系型数据库" className="panelBox" key="paneltwo">
						<div className="data_source_drawerpanel">
							{norelation.map((item) => {
								return (
									<IconFont
										type={'icon' + item}
										size="xxl"
										className="icon"
										key={item}
										onClick={() => {
											const params = [
												{ label: 'type', value: item },
												{ label: 'title', value: item },
											]
											jumpToPage(
												this.props,
												'新增数据源',
												params,
												false,
												this.props.currentPage
											)
										}}
									/>
								)
							})}
						</div>
					</Panel>
					<Panel title="中间件" className="panelBox" key="panelthree">
						<div className="data_source_drawerpanel">
							{threeDatasource.map((item, index) => {
								return (
									<IconFont
										type={'icon' + item}
										size="xxxl"
										className="icon"
										key={index}
										onClick={() => {
											const params = [
												{ label: 'type', value: item },
												{ label: 'title', value: item },
											]
											jumpToPage(
												this.props,
												'新增数据源',
												params,
												false,
												this.props.currentPage
											)
										}}
									/>
								)
							})}
						</div>
					</Panel>
					<Panel title="其他数据源" className="panelBox" key="panelfour">
						<div className="data_source_drawerpanel">
							{file.map((item, index) => {
								return (
									<IconFont
										type={'icon' + item}
										size="xxl"
										className="icon"
										key={index}
										onClick={() => {
											this.props.history.push(
												`/dataManage/dataSource/source/create?type=${item}&title=${item}`
											)
										}}
									/>
								)
							})}
						</div>
					</Panel> */}
				{/* </Collapse> */}
			</Drawer>
		)
	}
}
export default dataSourceDrawer
