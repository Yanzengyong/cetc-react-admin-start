import React from 'react'
import { Button, Message, Select, Search } from '@alifd/next'
import BasicLayout from '@/components/BasicLayout'
import ListContainer from '@/components/ListContainer'
import ListCard from '@/components/ListCard'
import Ellipsis from '@/components/Ellipsis'
import DataSourceDrawer from '@/componentsService/DataSourceDrawer'
import { deleteListItemAction, jumpToPage } from '@/utils/common'
import { getLocalStorageItem, getSessionStorageItem } from '@/utils/storage'
import { getUserRight, getDepartmentRight } from '@/utils/userRightControl'
import { connect } from 'react-redux'
import { DataSourceAction } from '@/actions'
import './index.scss'

const { getSourceListRQ, deleteSourceRQ } = DataSourceAction
const Option = Select.Option

const USER_Info = getLocalStorageItem('UserInfo') ?? {}
// 列表操作权限 - 增删改查
const createBtnRight = getUserRight(USER_Info.roleList, '数据源接入', 'list', 'create')
const checkBtnRight = getUserRight(USER_Info.roleList, '数据源接入', 'list', 'check')
const editBtnRight = getUserRight(USER_Info.roleList, '数据源接入', 'list', 'edit')
const deleteBtnRight = getUserRight(USER_Info.roleList, '数据源接入', 'list', 'delete')

// 目录操作权限 - 增删改查
const menuCheckRight = getUserRight(USER_Info.roleList, '数据源接入', 'menu', 'check')
const menuEditRight = getUserRight(USER_Info.roleList, '数据源接入', 'menu', 'edit')

@connect((state) => ({ state: state.tabs }))
class DataSourceManage extends React.Component {
	state = {
		cols: [
			{
				title: '数据源名称',
				dataIndex: 'name',
			},
			{
				title: '数据源描述',
				dataIndex: 'memo',
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
			},
		],
		bottomCols: [
			{
				title: '创建时间',
				dataIndex: 'createTime',
				timeFormat: 'YYYY-MM-DD HH:mm:ss'
			},
			{
				title: '关联API数量',
				dataIndex: 'usedTimes',
			},
		],
		tableLoading: true,
		selectedRowKeys: [],
		currentPage: this.props.history.location.state
			? this.props.history.location.state.currentPage * 1
			: 1,
		pageTotal: 0,
		pageSize: 5,
		searchName: '',
		dataSourceType: '', // 选择的数据源类型
		selectedDirectoryId: '', // 选中的目录key，用来操作那颗树
		data: [],
		deleteDialogVisible: false,
		deleteParams: [],
		currentCatalogueName: '',
		isShowCurrent: false,
		typeArray: [
			{
				label: 'MySQL',
				value: 'MySQL'
			},
			{
				label: 'PostgreSQL',
				value: 'PostgreSQL'
			},
			{
				label: 'KingbaseV8',
				value: 'KingbaseV8'
			},
		], // 数据源类型选择options
	}
	componentDidMount () {
		let storageName = 'currentPage-' + this.props.location.pathname
		if (getSessionStorageItem(storageName) !== undefined) {
			this.setState(
				{
					currentPage: parseInt(getSessionStorageItem(storageName)),
				},
				() => {
					this.getlistHandle()
				}
			)
		} else {
			this.getlistHandle()
		}
	}

	componentWillUnmount () {
		this.setState = () => {
			return
		}
	}
	// 获取列表的函数
	getlistHandle = async () => {
		const response = await getSourceListRQ({
			isPage: true,
			page: this.state.currentPage,
			limit: this.state.pageSize,
			classification: this.state.selectedDirectoryId,
			name: this.state.searchName,
			type: this.state.dataSourceType,
			token: getLocalStorageItem('TOKEN')
		})
		this.setState({
			tableLoading: false
		})
		if (response && response.code === 10000) {
			this.setState({
				pageTotal: response.result.total,
				data: response.result.list.map((item) => {
					return {
						...item,
						simpletag: item.catalogueDirectoryList &&
							item.catalogueDirectoryList.length > 0 ?
							item.catalogueDirectoryList[0].name : '暂无编目'
					}
				})
			})
		} else {
			Message.error(response && response.msg || '列表获取失败')
		}

	}
	// 多选 、 单选的change事件
	rowSelection = (key) => {
		this.setState({
			selectedRowKeys: key,
		})
	}
	// 关闭数据源抽屉
	dataSourceDrawerOnClose = () => {
		this.setState({
			dataSourceDrawerVisible: false,
		})
	}
	// 选中数据源目录的触发
	onSelectTree = (node) => {
		this.setState(
			{
				selectedDirectoryId: node.uuid,
				searchName: '',
				currentPage: 1,
			},
			() => {
				this.getlistHandle()
			}
		)
	}

	// 查询搜索的处理函数
	handleSearch = (val) => {
		if (val.length > 200) {
			val = val.slice(0, 200)
			Message.notice('查询字符不能大于200，仅使用前200字符进行查询')
		}

		this.setState(
			{
				searchName: val,
				currentPage: 1,
				tableLoading: true,
				selectedRowKeys: []
			},
			() => {
				this.getlistHandle()
			}
		)
	}

	// 节流防抖的请求方式
	searchRequest = (val) => {
		if (val.length > 200) {
			val = val.slice(0, 200)
			Message.notice('查询字符不能大于200，仅使用前200字符进行查询')
		}

		this.setState(
			{
				searchName: val,
				currentPage: 1,
				tableLoading: true
			},
			() => {
				this.getlistHandle()
			}
		)
	}

	// 翻页的change事件
	pageOnChange = (page) => {
		this.setState(
			{
				currentPage: page,
				tableLoading: true,
				selectedRowKeys: [],
			},
			() => {
				this.getlistHandle()
			}
		)
	}
	// 批量删除、删除函数
	deleteHandle = (uuids) => {
		deleteListItemAction(this, deleteSourceRQ, 'uuids', uuids, this.getlistHandle, '数据源')
	}

	operation = (item) => {
		let changeRight = getDepartmentRight(item.departmentUuid, USER_Info)

		return (
			<div className="listCard_operation_box">
				{checkBtnRight ? (
					<Button
						className='btn'
						type="secondary"
						size='large'
						onClick={(e) => {
							e.stopPropagation()
							this.preview(item)
						}}
					>
						查看
					</Button>
				): null}

				{editBtnRight ? (
					<Button
						className='btn'
						type="secondary"
						size='large'
						onClick={(e) => {
							e.stopPropagation()
							this.edit(item)
						}}
						disabled={!changeRight}
					>
						<span style={{ width: '100%', lineHeight: '100%', pointerEvents: 'none' }}>编辑</span>
					</Button>
				) : null}

				{deleteBtnRight ? (
					<Button
						className='btn'
						type="normal"
						warning
						size='large'
						onClick={(e) => {
							e.stopPropagation()
							this.deleteHandle([item.uuid])
						}}
						disabled={!changeRight}
					>
						<span style={{ width: '100%', lineHeight: '100%', pointerEvents: 'none' }}>删除</span>
					</Button>
				): null}
			</div>
		)
	}
	// 创建新增数据源
	createHandle = () => {
		this.setState({
			dataSourceDrawerVisible: true,
		})
	}
	edit = (item) => {
		const params = [
			{ label: 'type', value: item.type },
			{ label: 'uuid', value: item.uuid },
			{ label: 'title', value: encodeURI(item.name) },
		]
		jumpToPage(this.props, '编辑数据源', params, false, this.state.currentPage)
	}
	preview = (item) => {
		const params = [
			{ label: 'type', value: item.type },
			{ label: 'uuid', value: item.uuid },
			{ label: 'title', value: encodeURI(item.name) },
		]
		jumpToPage(this.props, '查看数据源', params, false, this.state.currentPage)
	}
	checkboxOnChange = (checked) => {
		if (checked) {
			let allKeys = []
			this.state.data.map((item) => {
				allKeys.push(item.uuid)
			})
			this.setState({ selectedRowKeys: allKeys })
		} else {
			this.setState({ selectedRowKeys: [] })
		}
	}

	// 点击整个卡片
	clickCard = (info) => {
		if (checkBtnRight) {
			this.preview(info)
		}
	}

	// 选择数据源类型onchang
	onTypeChange = (value) => {
		// 筛选请求 PostgreSQL MySQL
		this.setState({
			dataSourceType: value,
			currentPage: 1,
			selectedRowKeys: []
		}, () => {
			this.getlistHandle()
		})
	}

	// 节流
	deBounceHandle = (fn, intervalTime) => {
		let timer
		return (args) => {
			clearTimeout(timer)
			timer = setTimeout(() => {
				fn.call(this, args)
			}, intervalTime)
		}
	}
	deBounceRequest = this.deBounceHandle(this.searchRequest, 500)

	render () {
		const {
			cols,
			data,
			selectedRowKeys,
			currentPage,
			pageTotal,
			pageSize,
			tableLoading,
			dataSourceDrawerVisible,
			typeArray,
			bottomCols
		} = this.state

		return (
			<div className='outsidePage_container'>
				<BasicLayout
					title="数据源接入"
					subTitle="数据源目录"
					catalogueType="govern-datasource/datasource"
					onSelectedHandle={this.onSelectTree}
					readOnly={!menuEditRight && menuCheckRight}
				>
					<ListContainer
						leftNode={(
							<div>
								<Select
									className='dataSourceManage_select'
									onChange={this.onTypeChange}
									size="large"
									hasClear
									placeholder='数据源类型'
								>
									{
										typeArray.map((item) => (
											<Option value={item.value} key={item.value}>{item.label}</Option>
										))
									}
								</Select>
								<Search
									style={{ width: 326 }}
									type="secondary"
									size="large"
									hasIcon={false}
									placeholder='请输入数据源名称'
									searchText={<span style={{ fontSize: 14 }}>搜索</span>}
									onSearch={this.handleSearch}
									onChange={(value) => {
										this.deBounceRequest(value)
									}}
								/>
							</div>
						)}
						createHandle={this.createHandle}
						deleteAllHandle={() => this.deleteHandle(selectedRowKeys)}
						selectedNum={selectedRowKeys.length}
						current={currentPage}
						onChange={this.pageOnChange}
						total={pageTotal}
						pageSize={pageSize}
						hasCheckbox
						checkboxOnChange={this.checkboxOnChange}
						checkboxValue={selectedRowKeys.length > 0}
						createBtnRight={createBtnRight}
						deleteBtnRight={deleteBtnRight}
					>
						<ListCard
							dataSource={data}
							clos={cols}
							operation={this.operation}
							pictureIndex="type"
							primaryKey="uuid"
							rowSelection={this.rowSelection}
							selectedRowKeys={this.state.selectedRowKeys}
							loading={tableLoading}
							clickCard={this.clickCard}
							simpleTag='simpletag'
							bottomClos={bottomCols}
							contentReactNode={(item) => (
								<div className='datasource_card_content'>
									<span>描述：</span>
									<Ellipsis
										className="datasource_description"
										line={2}
										text={
											item[cols[1].dataIndex] == '' || item[cols[1].dataIndex] == null
												? '暂无内容'
												: item[cols[1].dataIndex]
										}
									/>
								</div>
							)}
						/>
						<DataSourceDrawer
							dataSourceDrawerVisible={dataSourceDrawerVisible}
							dataSourceDrawerOnClose={this.dataSourceDrawerOnClose}
							{...this.props}
							currentPage={this.state.currentPage}
						/>
					</ListContainer>
				</BasicLayout>
			</div>
		)
	}
}

export default DataSourceManage
