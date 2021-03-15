/*
 * @Author: ShenLing
 * @Date: 2020-12-15 15:53:40
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 17:49:52
 */

import React from 'react'
import IconFont from '@/components/IconFont'
import PieChart from './pieChart'
import LineChart from './lineChart'
import BarChart from './barChart'
import { Tab, Table, Pagination, Message } from '@alifd/next'
import './index.scss'
import moment from 'moment'
import {
	ApiCommonAction
} from '@/actions'

const {
	getViewsLog,
	getSubscriptionLog,
	getErrorLog,
	getApiSummary,
	getApiSubPie,
	getApiViewPie,
	getApiSubLine,
	getApiViewLine,
	getApiSubList,
	getApiViewList,
	getApiSubBar,
	getApiViewBar
} = ApiCommonAction
export default class Main extends React.Component {
	state = {
		// 数据服务日志 相关state 开始
		tabs: [
			{ tab: '访问日志', key: 'ViewsLog' },
			{ tab: '订阅日志', key: 'SubscriptionLog' },
			{ tab: '异常日志', key: 'ErrorLog' }
		],
		tabItemCols: {
			ViewsLog: [
				{
					title: '访问IP',
					dataIndex: 'userIp'
				},
				{
					title: '机构/部门',
					dataIndex: 'orgAndDep'
				},
				{
					title: '用户',
					dataIndex: 'userName'
				},
				{
					title: 'API名称',
					dataIndex: 'apiName'
				},
				{
					title: '访问时间',
					dataIndex: 'createTime'
				}
			],
			SubscriptionLog: [
				{
					title: '机构/部门',
					dataIndex: 'orgAndDep'
				},
				{
					title: '用户',
					dataIndex: 'userName'
				},
				{
					title: 'API名称',
					dataIndex: 'apiName'
				},
				{
					title: '订阅时间',
					dataIndex: 'createTime'
				},
				{
					title: '订阅状态',
					dataIndex: 'status'
				},
			],
			ErrorLog: [
				{
					title: '访问IP',
					dataIndex: 'userIp'
				},
				{
					title: '机构/部门',
					dataIndex: 'orgAndDep'
				},
				{
					title: '用户',
					dataIndex: 'userName'
				},
				{
					title: 'API名称',
					dataIndex: 'apiName'
				},
				{
					title: '访问时间',
					dataIndex: 'createTime'
				},
				{
					title: '异常原因',
					dataIndex: 'log'
				}
			]
		},
		currentPage: 1,
		pageTotal: 0,
		pageSize: 5,
		currentTab: 'ViewsLog',
		dateStart: Date.parse(moment().subtract(1, 'weeks')),
		dateEnd: Date.parse(moment()),
		tableLoading: false,
		currentRange: '近一周',
		dataSource: [],
		// 数据服务日志 相关state 结束

		// 数据管理平台 state 开始
		dataMangeInfo: {
			apiCount: 0,
			userCount: 0,
			subscriptionCount: 0,
			viewCount: 0
		},
		// 数据管理平台 state 结束

		// 订阅信息列表 开始
		subRankCols: [
			{
				title: '排名',
				dataIndex: 'rank'
			},
			{
				title: 'API名称',
				dataIndex: 'nameChi'
			},
			{
				title: 'URL',
				dataIndex: 'urlWithParam'
			},
			{
				title: '数据源',
				dataIndex: 'datasourceName'
			},
			{
				title: '数据库',
				dataIndex: 'databaseName'
			},
			{
				title: '数据表',
				dataIndex: 'tableName'
			},
			{
				title: '订阅次数',
				dataIndex: 'historySubscription'
			}
		],
		subDataSource: [],
		// 订阅信息列表 结束

		// 访问信息列表 开始
		viewRankCols: [
			{
				title: '排名',
				dataIndex: 'rank'
			},
			{
				title: 'API名称',
				dataIndex: 'nameChi'
			},
			{
				title: 'URL',
				dataIndex: 'urlWithParam'
			},
			{
				title: '数据源',
				dataIndex: 'datasourceName'
			},
			{
				title: '数据库',
				dataIndex: 'databaseName'
			},
			{
				title: '数据表',
				dataIndex: 'tableName'
			},
			{
				title: '访问次数',
				dataIndex: 'historyViews'
			}
		],
		viewDataSource: [],
		// 访问信息列表 结束
		pieTotalNum: 0,
		pieTotalNum2: 0,
		// api订阅概况 开始
		apiSubPieData: [],
		subLineXData: [],
		subLineLegendData: [],
		subLineLegendDataOtherYaxis: [],
		// api订阅概况 结束

		// api访问概况 开始
		apiViewPieData: [],
		viewLineXData: [],
		viewLineLegendData: [],
		viewLineLegendDataOtherYaxis: [],
		// api访问概况 结束

		// api订阅概况 开始
		subBarAxis: [],
		subBarValue: [],
		// api订阅概况 结束

		// api访问概况 开始
		viewBarAxis: [],
		viewBarValue: []
		// api访问概况 结束
	}

	componentDidMount () {
		this.initLogInfo()
		this.getApiSummaryHandle()
		this.getApiSubListHandle()
		this.getApiViewListHandle()
		this.getApiSubPieHandle()
		this.getApiViewPieHandle()
		this.getApiSubLineHandle()
		this.getApiViewLineHandle()
		this.getApiSubBarHandle()
		this.getApiViewBarHandle()
	}

	// 初始化API订阅信息柱状图
	getApiSubBarHandle = async () => {
		const response = await getApiSubBar()
		if (response && response.code === 10000) {
			// console.log('api订阅信息柱状图===', response.result)
			this.setState({
				subBarAxis: response.result.map((item) => item.orgAndDep),
				subBarValue: response.result.map((item) => item.count)
			})
		} else {
			// Message.error(response && response.msg || 'api历史订阅占比获取失败！')
		}
	}

	// 初始化API查看信息柱状图
	getApiViewBarHandle = async () => {
		const response = await getApiViewBar()
		if (response && response.code === 10000) {
			// console.log('api查看信息柱状图===', response.result)
			this.setState({
				viewBarAxis: response.result.map((item) => item.orgAndDep),
				viewBarValue: response.result.map((item) => item.count)
			})
		} else {
			// Message.error(response && response.msg || 'api历史订阅占比获取失败！')
		}
	}

	// 初始化api订阅饼图
	getApiSubPieHandle = async () => {
		const response = await getApiSubPie()
		const formatObj = {
			vaildCount: '历史已被订阅API个数',
			unVaildCount: '历史未被订阅API个数'
		}
		if (response && response.code === 10000) {
			console.log('api订阅饼图===', response.result)
			if (response.result &&
				response.result.vaildCount === 0 &&
				response.result.unVaildCount === 0) {
					// 都为0时
					this.setState({
						apiSubPieData: [
							{
								name: '历史已被订阅API个数',
								value: response.result.vaildCount
							}
						],
						pieTotalNum: response.result.vaildCount
					})
			} else if (response.result &&
				response.result.vaildCount === 0 &&
				response.result.unVaildCount !== 0) {
					// 都为0时
					this.setState({
						apiSubPieData: [
							{
								name: '历史未被订阅API个数',
						 		value: response.result.unVaildCount
							}
						],
						pieTotalNum: response.result.vaildCount
					})
			} else if (response.result &&
				response.result.vaildCount !== 0 &&
				response.result.unVaildCount === 0) {
					this.setState({
						apiSubPieData: [
							{
								name: '历史未被订阅API个数',
						 		value: response.result.vaildCount
							}
						],
						pieTotalNum: response.result.vaildCount
					})
			} else {
				this.setState({
					apiSubPieData: Object.keys(response.result).map((item) => {
						return {
							name: formatObj[item],
							value: response.result[item],
						}
					}),
					pieTotalNum: response.result.vaildCount
				})
			}

		} else {
			Message.error(response && response.msg || 'api历史订阅占比获取失败！')
		}
	}

	// 初始化api订阅折线
	getApiSubLineHandle = async () => {
		const response = await getApiSubLine({
			year: 2021
		})
		if (response && response.code === 10000) {
			const lineXData = response.result.map((item) => `${item.year}/${item.month}`)
			const lineLegendData = [
				{
					title: 'API服务近一年订阅用户数',
					value: response.result.map((item) => item.userCount),
					yIndex: 0
				}
			]
			const lineLegendDataOtherYaxis = [
				{
					title: 'API服务近一年订阅次数',
					value: response.result.map((item) => item.count),
					yIndex: 1
				}
			]
			this.setState({
				subLineXData: lineXData,
				subLineLegendData: lineLegendData,
				subLineLegendDataOtherYaxis: lineLegendDataOtherYaxis,
			})
		} else {
			Message.error(response && response.msg || 'api历史订阅占比获取失败！')
		}
	}

	// 初始化api访问饼图
	getApiViewPieHandle = async () => {
		const response = await getApiViewPie()
		const formatObj = {
			vaildCount: '历史已被访问过的API个数',
			unVaildCount: '历史未被访问过的API个数'
		}
		if (response && response.code === 10000) {
			// console.log('api访问饼图====', response.result)
			if (response.result &&
				response.result.vaildCount === 0 &&
				response.result.unVaildCount === 0) {
					this.setState({
						apiViewPieData: [
							{
								name: '历史已被访问过的API个数',
								value: response.result.vaildCount
							}
						],
						pieTotalNum2: response.result.vaildCount
					})
			} else if (response.result &&
				response.result.vaildCount === 0 &&
				response.result.unVaildCount !== 0) {
					this.setState({
						apiViewPieData: [
							{
								name: '历史未被访问过的API个数',
								value: response.result.unVaildCount
							}
						],
						pieTotalNum2: response.result.vaildCount
					})
			} else if (response.result &&
				response.result.vaildCount !== 0 &&
				response.result.unVaildCount === 0) {
				this.setState({
					apiViewPieData: [
						{
							name: '历史已被访问过的API个数',
							value: response.result.vaildCount
						}
					],
					pieTotalNum2: response.result.vaildCount
				})
			} else {
				this.setState({
					apiViewPieData: Object.keys(response.result).map((item) => {
						return {
							name: formatObj[item],
							value: response.result[item]
						}
					}),
					pieTotalNum2: response.result.vaildCount
				})
			}

		} else {
			Message.error(response && response.msg || 'api历史访问占比获取失败！')
		}
	}

	// 初始化api访问折线
	getApiViewLineHandle = async () => {
		const response = await getApiViewLine({
			year: 2021
		})
		if (response && response.code === 10000) {
			// console.log('api访问折线=====', response.result)
			const lineXData = response.result.map((item) => `${item.year}/${item.month}`)
			const lineLegendData = [
				{
					title: 'API服务近一年访问用户数',
					value: response.result.map((item) => item.userCount),
					yIndex: 0
				}
			]
			const lineLegendDataOtherYaxis = [
				{
					title: 'API服务近一年访问次数',
					value: response.result.map((item) => item.count),
					yIndex: 1
				}
			]
			this.setState({
				viewLineXData: lineXData,
				viewLineLegendData: lineLegendData,
				viewLineLegendDataOtherYaxis: lineLegendDataOtherYaxis,
			})
		} else {
			Message.error(response && response.msg || 'api历史访问占比获取失败！')
		}
	}

	// 初始化订阅排行榜 TOP5
	getApiSubListHandle = async () => {
		const response = await getApiSubList()
		if (response && response.code === 10000) {
			this.setState({
				subDataSource: response.result
			})
		} else {
			Message.error(response && response.msg || '订阅排行榜获取失败！')
		}
	}

	// 初始化访问排行榜 TOP5
	getApiViewListHandle = async () => {
		const response = await getApiViewList()
		if (response && response.code === 10000) {
			this.setState({
				viewDataSource: response.result
			})
		} else {
			Message.error(response && response.msg || '访问排行榜获取失败！')
		}
	}

	// 初始化API统计信息概要
	getApiSummaryHandle = async () => {
		const response = await getApiSummary()
		if (response && response.code === 10000) {
			this.setState({
				dataMangeInfo: response.result
			})
		} else {
			Message.error(response && response.msg || '数据管理平台信息获取失败！')
		}
	}
	// 初始化【数据服务日志】table信息
	initLogInfo = async () => {
		const {
			currentTab,
			currentPage,
			pageSize,
			dateStart,
			dateEnd
		} = this.state

		const FnObj = {
			ViewsLog: getViewsLog,
			SubscriptionLog: getSubscriptionLog,
			ErrorLog: getErrorLog,
		}
		const response = await FnObj[currentTab]({
			apiUuid: '',
			creatTimeStartTime: dateStart,
			creatTimeEndTime: dateEnd,
			limit: pageSize,
			page: currentPage
		})

		console.log({
			apiUuid: '',
			creatTimeStartTime: dateStart,
			creatTimeEndTime: dateEnd,
			limit: pageSize,
			page: currentPage
		})

		this.setState({ tableLoading: false })
		if (response && response.code === 10000) {
			this.setState({
				dataSource: response.result.list,
				pageTotal: response.result.total
			})
		}
	}

	// 翻页改变
	pageChange = (page) => {
		this.setState({
			currentPage: page,
			tableLoading: true
		}, () => {
			this.initLogInfo()
		})
	}

	// tab改变
	tabChange = (key) => {
		this.setState({
			currentPage: 1,
			currentTab: key,
			tableLoading: true
		}, () => {
			this.initLogInfo()
		})
	}

	// 渲染table的column
	renderTableColumn = (value, dataIndex, record) => {
		let content = ''
		if (dataIndex === 'createTime') {
			content = record[dataIndex] ?
			moment(record[dataIndex]).format('YYYY-MM-DD HH:mm:ss') : '暂无数据'
		}
		else if (dataIndex === 'orgAndDep') {
			content = record[dataIndex] ? record[dataIndex] : '暂无数据'
			// content = record[dataIndex] && record[dataIndex].length > 0 ?
			// typeof(record[dataIndex]) === 'object' ? record[dataIndex] .join('、') : record[dataIndex]: '暂无数据'
		}
		else if (dataIndex === 'status') {
			switch (record[dataIndex]) {
				case 0: content = '已订阅'; break
				case 1: content = '取消订阅'; break
				case 2: content = '重新订阅'; break
				default: content = '暂无操作状态'; break
			}
		}
		else {
			content = record[dataIndex] ?? '暂无数据'
		}

		return (
			<div className='rankColsContent' title={content}>{content}</div>
		)
	}

	// 快捷选择时间周期
	selectedRange = (v) => {
		let startDate = 0
		switch (v) {
			case '近一周': startDate = 1
				break
			case '近一月': startDate = 4
				break
			case '近三月': startDate = 12
				break
			default : startDate = 1
		}

		this.setState({
			dateStart: Date.parse(moment().subtract(startDate, 'weeks')),
			dateEnd: Date.parse(moment()),
			currentRange: v,
			currentPage: 1
		}, () => {
			// 用刚才设置的周期时间，请求table数据
			this.initLogInfo()
		})
	}

	render () {
		const countData = (data, title, unit, icon) => {
			return (
				<div className="count_data_display_box">
					<div className="count_Data_display_title">
						<IconFont type={icon ? icon : 'icondata8'} style={{ marginRight: '5px' }} size="large"/>
						<span>{title}</span>
					</div>
					<div className="count_data">
						<span className="count_data_num">{data}</span>
						<span className="count_data_unit">{unit}</span>
					</div>
				</div>
			)
		}

		const pieChart = (title, insideTitle, totalNum, value) => {
			return (
				<PieChart
					title={title}
					insideTitle={insideTitle}
					totalNum={totalNum}
					value={value}
				/>
			)
		}

		const lineChart = (xData, title, legendData, legendDataOtherYaxis) => {
			return (
				<LineChart
					xData={xData}
					title={title}
					legendData={legendData}
					legendDataOtherYaxis={legendDataOtherYaxis}
				/>
			)
		}

		const barChart = (xData, values) => {
			return (
				<BarChart xData={xData} values={values}/>
			)
		}

		const tableDiv = (cols, dataSource) => {
			return (
				<Table style={{ width: '100%' }} dataSource={dataSource} fixedHeader maxBodyHeight={215}>
					{cols.map((item) => (
						<Table.Column
							align='center'
							key={item.dataIndex}
							title={<div className='rankColsTitle'>{item.title}</div>}
							width={100}
							cell={(value, index, record) => {
								const content = record[item.dataIndex] ?? '暂无数据'
								return (
									<div className='rankColsContent' title={record[item.dataIndex]}>{content}</div>
								)
							}}
						/>
					))}
    		</Table>
			)
		}

		const tabTableDiv = (cols, dataSource) => {
			const {
				pageTotal,
				pageSize,
				tableLoading,
				currentPage
			} = this.state
			return (
				<div className='tabTable_box'>
					<div className='tabTable_box_selection'>
						<span onClick={() => this.selectedRange('近一周')} className={currentRange === '近一周' ? 'active' : null} >近一周</span>
						<b></b>
						<span onClick={() => this.selectedRange('近一月')} className={currentRange === '近一月' ? 'active' : null} >近一月</span>
						<b></b>
						<span onClick={() => this.selectedRange('近三月')} className={currentRange === '近三月' ? 'active' : null} >近三月</span>
					</div>
					<Table
						loading={tableLoading}
						style={{ width: '100%' }}
						dataSource={dataSource}
						fixedHeader
					>
						{cols.map((item) => (
							<Table.Column
								key={item.dataIndex}
								title={<div className='rankColsTitle'>{item.title}</div>}
								dataIndex={item.dataIndex}
								cell={(value, index, record) =>
									this.renderTableColumn(value, item.dataIndex, record)
								}
								width={100}
							/>
						))}
					</Table>
					<Pagination
						current={currentPage}
						total={pageTotal}
						pageSize={pageSize}
						onChange={this.pageChange}
						style={{ marginTop: '16px', textAlign: 'right' }}
					/>
				</div>
			)
		}


		const pieTitle = 'API历史订阅占比情况'
		const pieInsideTitle = '历史已被订阅\nAPI个数'

		const pieTitle2 = 'API历史访问占比情况'
		const pieInsideTitle2 = '历史已被访问过\nAPI个数'

		const {
			dataMangeInfo,
			tabItemCols,
			tabs,
			currentRange,
			dataSource,
			currentTab,
			subDataSource,
			subRankCols,
			viewDataSource,
			viewRankCols,
			apiSubPieData,
			apiViewPieData,
			subLineXData,
			subLineLegendData,
			subLineLegendDataOtherYaxis,
			viewLineXData,
			viewLineLegendData,
			viewLineLegendDataOtherYaxis,
			subBarAxis,
			subBarValue,
			viewBarAxis,
			viewBarValue,
			pieTotalNum,
			pieTotalNum2
		} = this.state

		return (
			<div className="main_page_container">
				<div className="main_page_title_bar">
					<div className="main_page_title">数据管理平台</div>
					<div className="main_page_data_section">
						{countData(dataMangeInfo.apiCount, 'API总数', '个', 'iconAPI1')}
						{countData(dataMangeInfo.userCount, 'API订阅用户总数', '人', 'iconteam')}
						{countData(dataMangeInfo.subscriptionCount, ' API总订阅次数', '次', 'iconcalendar-check')}
						{countData(dataMangeInfo.viewCount, 'API总访问次数', '次', 'iconearth')}
					</div>
				</div>

				<div className="main_page_first_box">
					<div className="main_page_charts_ItemBox" style={{ marginRight: 24 }}>
						<div className="main_page_charts_box">
							<div className="main_page_chart_title">API订阅概况</div>
							<div className="resources_charts">
								<div className='charts_pie'>
									{pieChart(pieTitle, pieInsideTitle, pieTotalNum, apiSubPieData)}
								</div>
								<div className='charts_line'>
									{lineChart(subLineXData, 'API服务近一年订阅概况', subLineLegendData, subLineLegendDataOtherYaxis)}
								</div>
							</div>
						</div>
					</div>
					<div className="main_page_charts_ItemBox">
						<div className="main_page_charts_box">
							<div className="main_page_chart_title">API访问概况</div>
							<div className="resources_charts">
								<div className='charts_pie'>
									{pieChart(pieTitle2, pieInsideTitle2, pieTotalNum2, apiViewPieData)}
								</div>
								<div className='charts_line'>
									{lineChart(viewLineXData, 'API服务近一年访问概况', viewLineLegendData, viewLineLegendDataOtherYaxis)}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="main_page_second_box">
					<div className="main_page_table_box" style={{ marginRight: 24 }}>
						<div className="main_page_charts_box">
							<div className="main_page_chart_title">API订阅排行榜 TOP5</div>
							<div className="resources_table">
								{tableDiv(subRankCols, subDataSource)}
							</div>
						</div>
					</div>
					<div className="main_page_charts_ItemBox2">
					<div className="main_page_charts_box">
						<div className="main_page_chart_title">API订阅量TOP10的部门</div>
							<div className="resources_charts">
								{subBarAxis.length > 0 ? barChart(subBarAxis, subBarValue) : (
									<div className='main_charts_nodata'>暂无数据</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="main_page_second_box">
					<div className="main_page_table_box" style={{ marginRight: 24 }}>
						<div className="main_page_charts_box">
							<div className="main_page_chart_title">API访问排行榜 TOP5</div>
							<div className="resources_table">
								{tableDiv(viewRankCols, viewDataSource)}
							</div>
						</div>
					</div>
					<div className="main_page_charts_ItemBox2">
						<div className="main_page_charts_box">
							<div className="main_page_chart_title">API访问量TOP10的部门</div>
							<div className="resources_charts">
								{viewBarAxis.length > 0 ? barChart(viewBarAxis, viewBarValue) : (
									<div className='main_charts_nodata'>暂无数据</div>
								)}
								{}
							</div>
						</div>
					</div>
				</div>

				<div className="main_page_third_box">
					<div className="main_page_charts_box">
						<div className="main_page_chart_title">数据服务日志</div>
						<div className="resources_table_big">
							<Tab
								onChange={this.tabChange}
								size="small"
								shape="capsule"
							>
								{tabs.map(item => (
									<Tab.Item key={item.key} title={item.tab}>
										{tabTableDiv(tabItemCols[currentTab], dataSource)}
									</Tab.Item>
								))}
							</Tab>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
