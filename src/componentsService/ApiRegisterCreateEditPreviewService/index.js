/*
 * @Author: ShenLing
 * @Date: 2021-01-05 18:06:38
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-04 14:21:05
 */
import React from 'react'
import {
	Form,
	Field,
	Input,
	Select,
	Button,
	Message,
	Loading,
	Table,
	TreeSelect,
	Balloon
} from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import IconFont from '@/components/IconFont'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { leaveAndSave, hasStorageAndInit } from 'utils/common'
import { ApiRegisterAction, DataSourceAction, CatalogueAction } from '@/actions'
import colorStyle from '@/themeStyle/themeStyle.scss'
import { NoSpace } from '@/utils/validationFn'
const { getURL, getInputParam, getOutputParam, getSampleData, addAPI, queryAPI, updateAPI } = ApiRegisterAction

const { getSourceListRQ, getStructureRQ } = DataSourceAction
const { getTreeRQ } = CatalogueAction

const FormItem = Form.Item
const TreeNode = TreeSelect.Node
const Tooltip = Balloon.Tooltip
export default class ApiRegisterCreateEditPreviewService extends React.Component {
	field = new Field(this, { parseName: true, autoUnmount: false })
	state = {
		submitLoading: false,
		dataSourceList: [], // 数据源列表
		dataSourceStructureLoading: false, // 查询数据库表结构的loading
		dataSourceStructure: [], // 数据源库表结构
		apiInputOptionList: [], // 输入字段可选列表
		requestResultSample: '', // 请求样例
		detailLoading: false, // 查询api详情loading
		requestLoading: false, // 请求样例数据loading
		treeList: [], // 目录树数据
	}

	async componentDidMount () {

		/**
		 * @name: 获取目录树结构
		 * @param {Object} authority 是否根据用户信息来获取目录
		 * false: 不验证用户所属部门
		 * true: 验证用户所属部门，筛选该部门的目录
		 */
		this.getCatalogue({
			authority: true
		})

		const initData = hasStorageAndInit()

		// 存在当前修改
		if (initData) {
			this.field.setValues(initData)

			// 初始化数据源列表
			this.setState({ dataSourceList: await this.getDataSourceList(1) })
			// 初始化数据源库表结构
			this.getDataSourceStructure(this.field.getValue('datasourceUuid'))
			// 初始化可配置输入字段select列表
			this.getInputParam(false)
		}
		else {
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				// 如果没有初始值、并且是编辑时，获取编辑详情
				this.setState({ detailLoading: true }, async () => {
					let result = await queryAPI(this.props.initFieldUuid)
					if (result) {
						if (result.code === 10000) {
							// 切记不能使用setValues，因为它会把删除状态也给传进去了
							this.field.setValue('uuid', result.result.uuid)
							this.field.setValue('type', result.result.type)
							this.field.setValue('nameChi', result.result.nameChi)
							this.field.setValue('description', result.result.description)
							this.field.setValue('datasourceUuid', result.result.datasourceUuid)
							this.field.setValue('datasourceName', result.result.datasourceName)
							this.field.setValue('databaseName', result.result.databaseName)
							this.field.setValue('tableName', result.result.tableName)
							this.field.setValue('url', result.result.url)
							this.field.setValue('classificationUuids', result.result.classificationUuids)
							this.field.setValue('classificationName', result.result.dmpCatalogueDirectoryVos[0] ? result.result.dmpCatalogueDirectoryVos[0].name : '')
							this.field.setValue('urlWithParam', result.result.urlWithParam)
							this.field.setValue('apiInputTable', result.result.apiInputList)
							this.field.setValue('apiOutputTable', result.result.apiOutputList)

							// 获取数据源可选列表
							this.setState({ dataSourceList: await this.getDataSourceList(1) })

							// 仅编辑状态下需要查询库表接口，并获取可选输入参数等内容
							if (this.props.pageType === 'edit') {
								// 获取数据源可选库表结构
								this.getDataSourceStructure(this.field.getValue('datasourceUuid'))
								this.setRequestUrl()
								this.getInputParam(false)
							}

						} else {
							Message.error(
								(result && result.result && result.result.msg) || '详情获取失败'
							)
						}
					}
					else {
						Message.error('详情获取失败')
					}
					this.setState({ detailLoading: false })
				})
			}
			else {
				// 新建 - 初始化数据源列表、初始化url
				this.setState({ dataSourceList: await this.getDataSourceList(1) })
				this.getURL()
			}
		}
	}

	componentWillUnmount () {
		this.setState = () => {
			return
		}
		// 以当前的地址为存储的唯一key，当前地址应该为pathname+search
		const pathObj = this.props.location
		const storageName = `${pathObj.pathname}${pathObj.search}`
		// 存储你需要存储的状态对象
		const data = this.field.getValues()

		leaveAndSave(storageName, data)
	}

	/**
	 *
	 * @name: 获取编目信息
	 */
	getCatalogue = async (params) => {
		const response = await getTreeRQ('bdri-api/api', params)
		if (response) {
			if (response.code === 10000) {
				this.setState({
					treeList: response.result.children,
				})
			} else {
				Message.error(response.msg || '数据源目录获取失败')
			}
		}
	}

	/**
  * @name: 获取数据源列表（分页方式，便于进行下拉框动态加载）
  * @param {Number} page 动态加载分页页码
  * @param {String} name 数据源名称 - 用于动态搜索
  * @return {Array} 数据源列表
  */
	getDataSourceList = async (page, name) => {
		const response = await getSourceListRQ({
			isPage: true,
			page: page,
			limit: 10,
			name: name,
			type: this.field.getValue('type')
		})
		if (response) {
			if (response.code === 10000) {
				return response.result.list
			} else {
				// Message.error(response.msg || '数据源列表获取失败')
				return []
			}
		}
		else {
			// Message.error('数据源列表获取失败')
			return []
		}
	}

	/**
  * @name: 数据源列表选择框-滚动至底部进行数据动态加载
  * @param {*} async
  * @return {*}
  */
	onScroll = async (e) => {
		const scrollHeight = e.target.scrollHeight // 内容总高度
		const clientHeight = e.target.clientHeight // 窗口高度
		const scrollTop = e.target.scrollTop //滚动高度

		if (scrollTop + clientHeight === scrollHeight) {
			// 到达底部
			const dataSource = this.state.dataSourceList
			let page = parseInt(this.state.dataSourceList.length / 10)
			let otherData = await this.getDataSourceList(page + 1)
			if (otherData && otherData.length > 0) {
				this.setState({ dataSourceList: dataSource.concat(otherData) })
			}
		}
	}

	/**
  * @name: 数据源列表选择框 - 数据检索 - 延时+查询接口
  * @param {*} value
  * @return {*}
  */
	onSearchDataSource = (value) => {
		if (this.searchTimeout) {
			clearTimeout(this.searchTimeout)
		}
		this.searchTimeout = setTimeout(async () => {
			let list = await this.getDataSourceList(1, value)
			this.setState({ dataSourceList: list })
		}, 500)
	}

	/**
  * @name: 获取选中数据源对应的库表结构
  * @param {*} dataSourceUuid
  * @return {*}
  */
	getDataSourceStructure = (dataSourceUuid) => {
		if (dataSourceUuid) {
			let dataSourceItem = this.state.dataSourceList.filter(item => { return item.uuid === dataSourceUuid })[0]
			if (dataSourceItem) {
				let param = {
					uuid: dataSourceUuid,
					host: dataSourceItem.host,
					port: dataSourceItem.port,
				}
				this.setState({ dataSourceStructureLoading: true }, async () => {
					let res = await getStructureRQ(param)
					if (res && res.code === 10000) {
						this.setState({ dataSourceStructure: res.result })
					}
					else {
						this.setState({ dataSourceStructure: [] })
						Message.error(res.msg || '查询数据源库表结构失败')
					}
					this.setState({ dataSourceStructureLoading: false })
				})
			}
		}
	}

	/**
  * @name: 生成URL地址
  * @param {*} async
  * @return {*}
  */
	getURL = async () => {
		const res = await getURL()
		if (res) {
			if (res.code === 10000) {
				this.field.setValue('url', res.result)
			}
			else {
				Message.error(res.msg || '生成URL地址失败')
			}
		}
		else {
			Message.error('生成URL地址失败')
		}
	}

	// 增加输入参数
	addInputParam = () => {
		this.field.addArrayValue('apiInputTable', this.field.getValue('apiInputTable').length, {
			id: '',
			uuid: '',
			apiUuid: '',
			fieldName: '',
			fieldType: '',
			fieldValue: '',
			fieldDescribe: '',
			fieldIsRequired: 0
		})
	}

	/**
  * @name: 获取输入参数列表
  * @param {Boolean} initTable 是否初始化输入字段表格（仅显示limit和page字段）
  * @return {*}
  */
	getInputParam = async (initTable) => {
		if (this.field.getValue('datasourceUuid') && this.field.getValue('databaseName') && this.field.getValue('tableName')) {
			let param = {
				datasourceUuid: this.field.getValue('datasourceUuid'),
				database: this.field.getValue('databaseName'),
				table: this.field.getValue('tableName'),
				type: this.field.getValue('type')
			}
			const res = await getInputParam(param)
			if (res) {
				if (res.code === 10000) {
					if (res.result.length > 0) {
						if (initTable) {
							this.field.setValue('apiInputTable', res.result.filter(item => { return item.fieldName === 'page' || item.fieldName === 'limit' }))
							this.setRequestUrl()
						}
						this.setState({ apiInputOptionList: res.result })
					}
					else {
						Message.error('该数据资源没有相应的输入字段，请重新选择')
					}
				}
				else {
					Message.error(res.msg ||'获取输入参数列表失败')
				}
			}
			else {
				Message.error('获取输入参数列表失败')
			}
		}
	}

	/**
  * @name: 请求地址自动获取 - 根据url和输入字段配置获取
  * @param {*}
  * @return {*}
  */
	setRequestUrl = () => {
		let request = this.field.getValue('url')
		let apiInputTable = this.field.getValue('apiInputTable')

		if (apiInputTable.length > 0) {
			request = request + '?'

			apiInputTable.map((item, index) => {
				if (item.fieldValue !== null && item.fieldValue) {
					request = request + item.fieldName + '=' + item.fieldValue
				}
				else {
					request = request + item.fieldName + '='
				}
				if (index !== apiInputTable.length - 1) {
					request = request + '&'
				}
			})
			this.field.setValue('urlWithParam', request)
		}
		else { //无输入字段配置时，重置url
			this.field.setValue('urlWithParam', request)
		}

		// 查看详情时，自动发送请求，获取样例数据
		if (this.props.pageType === 'preview') {
			this.onSendRequest()
		}
		else {
			this.setState({ requestResultSample: '' })
		}
	}

	/**
  * @name: 获取输出参数列表
  * @param {*} async
  * @return {*}
  */
	getOutputParam = async () => {
		let param = {
			datasourceUuid: this.field.getValue('datasourceUuid'),
			database: this.field.getValue('databaseName'),
			table: this.field.getValue('tableName'),
			type: this.field.getValue('type')
		}
		const res = await getOutputParam(param)
		if (res) {
			if (res.code === 10000) {
				if (res.result.length > 0) {
					this.field.setValue('apiOutputTable', res.result)
				}
				else {
					Message.error('该数据资源没有相应的输出字段，请重新选择')
				}
			}
			else {
				Message.error(res.msg ||'获取输出参数列表失败')
			}
		}
		else {
			Message.error('获取输出参数列表失败')
		}
	}

	/**
  * @name: 输入字段配置表显示渲染
  * @param {*} value Table.Column cell的value
  * @param {*} index Table.Column cell的index
  * @param {*} record Table.Column cell的record
  * @param {*} type Table.Column的类型 - dataIndex，包括fieldName, fieldValue, fieldIsRequired, fieldDescribe, delete
  * @return {*}
  */
	renderInputCell = (value, index, record, type) => {
		const fieldNameCell = (
			<Select
				disabled={record.fieldName === 'limit' || record.fieldName === 'page' || this.props.pageType === 'preview'}
				style={{ width: '100%' }}
				placeholder="请选择字段名称"
				{...this.field.init(`apiInputTable.${index}.${type}`, {}, {
					onChange: (v) => {
						let selectedItem = this.state.apiInputOptionList.filter(item => { return item.fieldName === v })[0]
						let tempFieldTable = this.field.getValue('apiInputTable')
						tempFieldTable[index] = selectedItem
						this.field.setValue('apiInputTable', tempFieldTable)
						this.setRequestUrl()
					}
				})}
			>
				{this.state.apiInputOptionList.length > 0 ? this.state.apiInputOptionList.map((item, optionIndex) => {
					return (
						<Select.Option
							label={item.fieldName}
							value={item.fieldName}
							key={optionIndex}
							disabled={this.field.getValue('apiInputTable').findIndex((value) => {
								return value.fieldName === item.fieldName
							}) !== -1}
						/>
					)
				}): null}
			</Select>
		)

		const fieldValueCell = (
			<Input
				readOnly={this.props.pageType === 'preview'}
				style={{ width: '100%' }}
				placeholder="请输入字段值"
				{...this.field.init(`apiInputTable.${index}.${type}`, {}, {
					onChange: () => {
						this.setRequestUrl()
					}
				})}
			/>
		)

		const isRequiredCell = (
			<Select
				disabled={record.fieldName === 'limit' || record.fieldName === 'page' || this.props.pageType === 'preview'}
				style={{ width: '100%' }}
				placeholder="请选择是否必填"
				{...this.field.init(`apiInputTable.${index}.${type}`)}
			>
				<Select.Option value={0} label="否"/>
				<Select.Option value={1} label="是"/>
			</Select>
		)

		const commentCell = (
			<Input
				readOnly={this.props.pageType === 'preview'}
				style={{ width: '100%' }}
				maxLength={200}
				hasLimitHint
				placeholder="请输入注释"
				{...this.field.init(`apiInputTable.${index}.${type}`)}
			/>
		)

		const deleteCell = (
			<Button
				text
				style={{ color: record.fieldName === 'limit' || record.fieldName === 'page' ? colorStyle.text_secondary_color : colorStyle.text_warning_color }}
				type="primary"
				onClick={() => {
					this.field.deleteArrayValue('apiInputTable', index)
					this.setRequestUrl()
				}}
				disabled={record.fieldName === 'limit' || record.fieldName === 'page' || this.props.pageType === 'preview'}
			>
				删除
			</Button>
		)

		if (this.props.pageType !== 'preview') {
			switch (type) {
				case 'fieldName': return fieldNameCell
				case 'fieldValue': return fieldValueCell
				case 'fieldIsRequired': return isRequiredCell
				case 'fieldDescribe': return commentCell
				case 'delete': return deleteCell
				default: return value
			}
		}
		else {
			return value
		}
	}

	/**
  * @name: 输出字段配置表显示渲染
  * @param {*} value Table.Column cell的value
  * @param {*} index Table.Column cell的index
  * @param {*} record Table.Column cell的record
  * @param {*} type Table.Column的类型 - dataIndex，包括fieldDescribe, delete
  * @return {*}
  */
	renderOutputCell = (value, index, record, type) => {
		const commentCell = (
			<Input
				readOnly={this.props.pageType === 'preview'}
				style={{ width: '100%' }}
				maxLength={200}
				hasLimitHint
				placeholder="请输入注释"
				{...this.field.init(`apiOutputTable.${index}.${type}` ? `apiOutputTable.${index}.${type}` : '')}
			/>
		)

		const deleteCell = (
			<Button
				style={{ color: record.fieldName === 'limit' || record.fieldName === 'page' ? colorStyle.text_secondary_color : colorStyle.text_warning_color }}
				warning
				type="primary"
				text
				onClick={() => {
					const tableData = this.field.getValue('apiOutputTable')
					if (tableData && tableData.length > 1) {
						this.field.deleteArrayValue('apiOutputTable', index)
					} else {
						Message.error('至少需要一个返回字段')
					}
				}}
				disabled={this.props.pageType === 'preview'}
			>
				删除
			</Button>
		)

		if (this.props.pageType !== 'preview') {
			switch (type) {
				case 'fieldDescribe': return commentCell
				case 'delete': return deleteCell
				default: return value
			}
		}
		else {
			return value
		}
	}

	// 发送请求
	onSendRequest = () => {
		this.field.validate((errors, values) => {
			if (errors) return
			else if (values.apiInputTable.length === 0) {
				Message.error('请填写输入参数')
				return
			}
			else if (values.apiOutputTable.length === 0) {
				Message.error('请填写输出参数')
				return
			}
			else {
				let param = {
					type: this.field.getValue('type'),
					nameChi: values.nameChi,
					description: values.description,
					datasourceUuid: values.datasourceUuid,
					databaseName: values.databaseName,
					tableName: values.tableName,
					url: values.url,
					urlWithParam: values.urlWithParam,
					classificationUuids: values.classificationUuids,
					apiInputList: values.apiInputTable,
					apiOutputList: values.apiOutputTable,
				}

				this.setState({ requestLoading: true }, async () => {
					let res = await getSampleData(param)
					this.setState({
						requestLoading: false,
						requestResultSample: 	JSON.stringify(res, null, 4),
					})
				})
			}
		})
	}

	/**
  * @name: 提交校验表单
  * @return {*}
  */
	submitHandle = () => {
		if (this.state.requestResultSample === '') {
			Message.warning('提交保存前请先点击上方“发送请求”按钮以测试该API是否成功获取数据')
		}
		else {
			this.field.validate((errors, values) => {
				if (errors) return
				else if (values.apiInputTable.length === 0) {
					Message.error('请填写输入参数')
					return
				}
				else if (values.apiOutputTable.length === 0) {
					Message.error('请填写输出参数')
					return
				}
				else {
					this.setState({ submitLoading: true }, () => {
						if (this.props.pageType === 'create') this.addAPI(values)
						else if (this.props.pageType === 'edit') this.updateAPI(values)
					})
				}
			})
		}
	}

	/**
  * @name: 新增
  * @param {Object} values 表单数据
  * @return {*}
  */
	addAPI = async (values) => {
		let param = {
			type: this.field.getValue('type'),
			nameChi: values.nameChi,
			description: values.description,
			datasourceUuid: values.datasourceUuid,
			databaseName: values.databaseName,
			tableName: values.tableName,
			url: values.url,
			urlWithParam: values.urlWithParam,
			classificationUuids: values.classificationUuids,
			apiInputList: values.apiInputTable,
			apiOutputList: values.apiOutputTable,
		}
		const res = await addAPI(param)
		if (res) {
			if (res.code === 10000) {
				Message.success('新增API成功')
				this.props.onBack()
			}
			else {
				Message.error(res.msg || '新增API失败！')
			}
		}
		else {
			Message.error('新增API失败！')
		}
		this.setState({ submitLoading: false })
	}

	/**
  * @name: 编辑
  * @param {Object} values 表单数据
  * @return {*}
  */
	updateAPI = async (values) => {
		let param = {
			uuid: values.uuid,
			type: values.type,
			nameChi: values.nameChi,
			description: values.description,
			datasourceUuid: values.datasourceUuid,
			databaseName: values.databaseName,
			tableName: values.tableName,
			url: values.url,
			urlWithParam: values.urlWithParam,
			classificationUuids: values.classificationUuids,
			apiInputList: values.apiInputTable,
			apiOutputList: values.apiOutputTable,
		}
		const res = await updateAPI(param)
		if (res) {
			if (res.code === 10000) {
				Message.success('编辑API成功')
				this.props.onBack()
			}
			else {
				Message.error(res.msg || '编辑API失败！')
			}
		}
		else {
			Message.error('编辑API失败！')
		}
		this.setState({ submitLoading: false })
	}

	render () {
		const { pageType, onBack } = this.props

		const {
			submitLoading,
			dataSourceList,
			dataSourceStructureLoading,
			dataSourceStructure,
			requestLoading,
			requestResultSample,
			detailLoading,
			treeList
		} = this.state

		const init = this.field.init

		const loop = (data) => {
			return (
				data.map((item) => {
					if (item.children) {
						return (
							<TreeNode
								className="dcmtreenode"
								key={item.uuid}
								value={item.uuid}
								label={
									<Tooltip trigger={item.label} align="b">
										{item.label}
									</Tooltip>
								}
								extra={{ parentUuid: item.parentUuid }}
							>
								{loop(item.children)}
							</TreeNode>
						)
					}
					return (
						<TreeNode
							key={item.uuid}
							value={item.uuid}
							label={
								<Tooltip trigger={item.label} align="b">
									{item.label}
								</Tooltip>
							}
							extra={{ parentUuid: item.parentUuid }}
						/>
					)
				})
			)
		}

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<Loading fullScreen visible={detailLoading}/>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="API名称：" required>
						<Input
							readOnly={pageType === 'preview'}
							disabled={pageType === 'edit'}
							maxLength={50}
							hasLimitHint
							placeholder="请输入API名称"
							{...init('nameChi', {
								rules: [
									{
										required: true,
										message: 'API名称不能为空',
									},
									{
										validator: NoSpace
									}
								],
							})}
						/>
					</FormItem>

					<FormItem label="API描述：" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={200}
							hasLimitHint
							placeholder="请输入API描述"
							{...init('description', {
								rules: [
									{
										required: true,
										message: 'API描述不能为空',
									}
								],
							})}
						/>
					</FormItem>

					<FormItem label="数据API目录：" required>
						<TreeSelect
							disabled={pageType === 'preview'}
							hasClear
							style={{ width: '33%' }}
							placeholder="请选择数据API目录"
							{...init('classificationUuids', {
								rules: [
									{
										required: true,
										message: 'API目录不能为空',
									}
								]
							}, {
								onChange: (v) => {
									this.field.setValue('classificationUuids', v ? [v] : [])
								}
							})}
						>
							{loop(treeList)}
						</TreeSelect>
					</FormItem>

					<FormItem label="数据资源：" required>
						<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
						<Select
								disabled={pageType === 'preview' || dataSourceStructureLoading}
								style={{ width: '25%' }}
								placeholder="请选择数据源类型"
								label="数据源类型："
								hasClear
								showSearch
								{...init('type', {}, {
									onChange: async (v) => {

										this.field.setValue('type', v)
										this.setState({ dataSourceList: await this.getDataSourceList(1) })

										// 重选数据类型时需进行以下重置操作
										this.field.setValue('datasourceUuid', '') // 重置数据源选项
										this.field.setValue('databaseName', '') // 重置数据库选择框
										this.field.setValue('tableName', '') // 重置数据表选择框
										this.field.setValue('apiInputTable', []) // 重置输入字段表格
										this.field.setValue('apiOutputTable', []) // 重置输出字段表格
										this.setRequestUrl() // 重置请求url
										this.setState({ dataSourceStructure: [] })
									}
								})}
							>
								<Select.Option label='mysql' value="mysql"/>
								<Select.Option label='KingbaseV8' value="KingbaseV8"/>
								<Select.Option label='postgresql' value="postgresql"/>
							</Select>

							<Select
								disabled={pageType === 'preview'}
								style={{ width: '25%' }}
								placeholder="请选择数据源"
								label="数据源："
								{...init('datasourceUuid', {}, {
									onChange: (v) => {
										this.field.setValue('datasourceUuid', v)

										// 获取选中的数据源类型
										let selectedDataSourceItem = dataSourceList.filter(item => { return item.uuid === v })[0]
										this.field.setValue('type', selectedDataSourceItem ? selectedDataSourceItem.type : '')

										// 重选数据源时需进行以下重置操作
										this.field.setValue('databaseName', '') // 重置数据库选择框
										this.field.setValue('tableName', '') // 重置数据表选择框
										this.getDataSourceStructure(v) // 获取该数据源表结构
										this.field.setValue('apiInputTable', []) // 重置输入字段表格
										this.field.setValue('apiOutputTable', []) // 重置输出字段表格
										this.setRequestUrl() // 重置请求url
									}
								})}
								showSearch
								onSearch={this.onSearchDataSource}
								menuProps={{ onScroll: this.onScroll }} // 下滑至底部进行数据动态加载
								autoHighlightFirstItem={false} // 避免数据动态加载时滚动回第一行
							>
								{dataSourceList && dataSourceList.length > 0
										? dataSourceList.map((item) => {
												return (
													<Select.Option
														label={item.name}
														value={item.uuid}
														key={item.uuid}
													/>
												)
											})
										: null}
							</Select>

							<Select
								style={{ width: '25%' }}
								placeholder="请选择数据库"
								label="数据库："
								// state={dataSourceStructureLoading ? 'loading' : null}
								disabled={pageType === 'preview' || dataSourceStructureLoading}
								{...init('databaseName', {}, {
									onChange: (v) => {
										// 重选数据库时需重置以下内容：
										this.field.setValue('tableName', '') // 重置数据表选择框
										this.field.setValue('apiInputTable', []) // 重置输入字段表格
										this.field.setValue('apiOutputTable', []) // 重置输出字段表格
										this.setRequestUrl() // 重置请求url
									}
								})}
								showSearch
							>
								{Object.keys(dataSourceStructure).map((item, index) => {
									return (
										<Select.Option label={item} value={item} key={index}/>
									)
								})}
							</Select>

							<Select
								disabled={pageType === 'preview' || dataSourceStructureLoading}
								style={{ width: '25%' }}
								placeholder="请选择数据表"
								label="数据表："
								// state={dataSourceStructureLoading ? 'loading' : null}
								showSearch
								{...init('tableName', {}, {
									onChange: (v) => {
										this.field.setValue('apiInputTable', [])
										this.field.setValue('apiOutputTable', [])
										this.getInputParam(true)
										this.getOutputParam()
									}
								})}
							>
								{dataSourceStructure[this.field.getValue('databaseName')] ? (
									dataSourceStructure[this.field.getValue('databaseName')].map((item, index) => {
										return (
											<Select.Option label={item} value={item} key={index} />
										)
									})
								) : null}
							</Select>
						</div>
					</FormItem>

					<FormItem label="URL：" required>
						<Input
							style={{ width: '100%' }}
							readOnly
							{...init('url', {
								rules: [
									{
										required: true,
										message: 'URL不能为空',
									},
								],
							})}
						/>
					</FormItem>

				</InfoContainer>

				<InfoContainer title="输入字段配置" id="inputParamSetting">
					<Table dataSource={this.field.getValue('apiInputTable')}>
						<Table.Column dataIndex="fieldName" title="字段名称" align="center" width={100} cell={(value, index, record) => this.renderInputCell(value, index, record, 'fieldName')} />
						<Table.Column dataIndex="fieldType" title="字段类型" align="center" width={100}/>
						<Table.Column dataIndex="fieldValue" title="字段值" align="center" width={100} cell={(value, index, record) => this.renderInputCell(value, index, record, 'fieldValue')}/>
						<Table.Column dataIndex="fieldIsRequired" title="是否必填" align="center" width={50} cell={(value, index, record) => this.renderInputCell(value, index, record, 'fieldIsRequired')}/>
						<Table.Column dataIndex="fieldDescribe" title="注释" align="center" width={150} cell={(value, index, record) => this.renderInputCell(value, index, record, 'fieldDescribe')} />
						{pageType !== 'preview' ? (
							<Table.Column title="操作" align="center" width={50} cell={(value, index, record) => this.renderInputCell(value, index, record, 'delete')} />
						) : null}
					</Table>

					{pageType !== 'preview' ? (
						<Button text type="primary" onClick={this.addInputParam} style={{ marginTop: '10px', width: '100%' }}>
							<IconFont type="iconplus" size="xs" style={{ marginRight: '3px' }} />添加字段
						</Button>
					): null}

				</InfoContainer>

				<InfoContainer title="返回字段配置" id="returnParamSetting">
					<Table dataSource={this.field.getValue('apiOutputTable')}>
						<Table.Column dataIndex="fieldName" title="字段名称" align="center" width={100}/>
						<Table.Column dataIndex="fieldType" title="字段类型" align="center" width={100}/>
						<Table.Column dataIndex="fieldDescribe" title="注释" align="center" width={150} cell={(value, index, record) => this.renderOutputCell(value, index, record, 'fieldDescribe')} />
						{pageType !== 'preview' ? (
							<Table.Column title="操作" align="center" width={50} cell={(value, index, record) => this.renderOutputCell(value, index, record, 'delete')}/>
						) : null}
					</Table>
					{pageType !== 'preview' ? (
						<Button text type="primary" onClick={() => this.getOutputParam()} style={{ marginTop: '10px' }}>
							<IconFont type="iconrollback" size="xs" style={{ marginRight: '3px' }} />重置返回字段配置内容
						</Button>
					): null}
				</InfoContainer>

				<InfoContainer title="API请求样例" id="requestSample">
					<FormItem label="" required>
						<Input
							style={{ width: 'calc(100% - 160px)' }}
							addonTextBefore="GET"
							readOnly
							{...init('urlWithParam')}
						/>
						<CopyToClipboard text={this.field.getValue('urlWithParam')} onCopy={() => Message.success('已复制该URL至粘贴板')}>
							<Button type="secondary" style={{ width: '80px' }}>复制URL</Button>
						</CopyToClipboard>
						<Button type="primary" style={{ width: '80px' }} onClick={() => this.onSendRequest()}>发送请求</Button>
					</FormItem>

					<Loading style={{ width: '100%', height: '100%' }} visible={requestLoading}>
						<FormItem label="请求结果样例：">
							<Input.TextArea
								placeholder="提交保存前请先点击“发送请求”以测试请求样例"
								value={requestResultSample}
								style={{ fontSize: '16px' }}
								aria-label="TextArea"
								rows={20}
								readOnly
							/>
						</FormItem>
					</Loading>
				</InfoContainer>

				{pageType === 'preview' ? null : (
					<div id="operationBtns">
						<FormItem wrapperCol={{ offset: 11 }}>
							<Button
								loading={submitLoading}
								type="primary"
								onClick={this.submitHandle}
								style={{ marginRight: 20 }}
								disabled={requestResultSample === ''}
							>
								保存
							</Button>
							<Button onClick={() => onBack()}>取消</Button>
						</FormItem>
					</div>
				)}

			</Form>
		)
	}
}
