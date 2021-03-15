import React from 'react'
import {
	Form,
	Field,
	Input,
	TreeSelect,
	Select,
	Button,
	Message,
	Balloon,
	TimePicker,
	DatePicker,
	Search,
	Table,
	Pagination,
	Card,
	NumberPicker,
	Loading,
} from '@alifd/next'
import './index.scss'

import InfoContainer from '@/components/InfoContainer'
import IconFont from '@/components/IconFont'
import {
	leaveAndSave,
	hasStorageAndInit,
	getQueryItemValue,
} from 'utils/common'
import {
	DataResourceAction,
	DataStorageAction,
	CatalogueAction,
	DataQualityAction
} from '@/actions'
import moment from 'moment'
import colorStyle from '@/themeStyle/themeStyle.scss'
import { NoCommaQuota } from '@/utils/validationFn'

const { getTreeRQ } = CatalogueAction
const { getList } = DataResourceAction
const { getDataStorageMeta } = DataStorageAction
const { addTask, queryTask, updateTask } = DataQualityAction

const { YearPicker, MonthPicker, RangePicker } = DatePicker
const FormItem = Form.Item
const TreeNode = TreeSelect.Node
const Tooltip = Balloon.Tooltip

const statisticsOptions = [
	{ label: '正则匹配', value: 'Pattern' },
	{ label: '字符串长度范围', value: 'String Length Range' },
	{ label: '字符串长度值', value: 'String Length' },
	{ label: '字符串值', value: 'String Value' },
	{ label: '数值范围', value: 'Int Range' },
	{ label: '数字值', value: 'Int Value' },
	{ label: '日期范围', value: 'Date Range' },
	{ label: '日期值', value: 'Date Value' },
	{ label: '日期枚举', value: 'Date Enumerate' },
	{ label: '枚举', value: 'Enumerate' },
	{ label: '特殊字符', value: 'Special Char' },
	{ label: '敏感词检查', value: 'Sensitive Words' },
	{ label: '统计总数', value: 'Total Count' },
	{ label: '空统计', value: 'Null Count' },
	{ label: '空字符串统计', value: 'Empty Count' },
	{ label: '不重复行统计', value: 'Distinct Count' },
]

const warningTriggerConditionOptions = ['>', '=', '<', '>=', '<=', '=']

export default class DataQualityTaskCreateEditPreviewService extends React.Component {
	field = new Field(this)
	state = {
		submitLoading: false,
		treeList: [],
		resourceTable: [],
		total: 1,
		currentPage: 1,
		pageSize: 5,
		searchName: '',
		selectedClassfication: '',
		selectedResource: '',
		columnsTable: [],
		selectedAttributes: [],
		evaluationInfo: [
			{
				name: '', // 字段名
				code: '', // 评估规则
				value1: '', // 评估内容第一个值
				value2: '', // 评估内容第二个值
				warningTriggerCondition: '', // 预警判断条件
				warningLimit: '', // 预警阈值
			},
		],
		dataResourceAlert: false,
		dataAttributeAlert: false,
		queryLoading: false,

		enumStringAlertRowIndex: []
	}

	componentDidMount () {
		this.getCatalogue()
		this.getResourceTable()

		const initData = hasStorageAndInit()
		// 存在当前修改
		if (initData) {
			this.field.setValues(initData)
		} else {
			this.field.setValue('evaluationType', 'PROFILING')

			// 如果没有初始值、并且是编辑时，获取编辑详情
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				this.setState({ queryLoading: true }, async () => {
					let res = await queryTask({ uuid: this.props.initFieldUuid })
					console.log(res)
					if (res) {
						if (res.code === 10000) {
							// 切记不能使用setValues，因为它会把删除状态也给传进去了
							this.field.setValue('uuid', res.result.uuid)
							this.field.setValue('evaluationName', res.result.evaluationName)
							this.field.setValue('evaluationDescription', res.result.evaluationDescription)
							this.field.setValue('projectUuid', res.result.projectUuid)
							this.field.setValue('projectName', this.props.projectName)

							// 设置cron信息
							const yearTemp = res.result.cronInfo.filter(item => Object.keys(item)[0] === 'year')[0].year === '' ? moment(Date.now()).format('YYYY') : res.result.cronInfo.filter(item => Object.keys(item)[0] === 'year')[0].year
							const monthTemp = res.result.cronInfo.filter(item => Object.keys(item)[0] === 'month')[0].month === '' ? moment(Date.now()).format('MM') : res.result.cronInfo.filter(item => Object.keys(item)[0] === 'month')[0].month
							const dateTemp = res.result.cronInfo.filter(item => Object.keys(item)[0] === 'date')[0].date === '' ? '' : yearTemp + '-' + monthTemp + '-' + res.result.cronInfo.filter(item => Object.keys(item)[0] === 'date')[0].date

							const hourTemp = res.result.cronInfo.filter(item => Object.keys(item)[0] === 'hour')[0].hour === '' ? '00' : res.result.cronInfo.filter(item => Object.keys(item)[0] === 'hour')[0].hour
							const minuteTemp = res.result.cronInfo.filter(item => Object.keys(item)[0] === 'minute')[0].minute === '' ? '00' : res.result.cronInfo.filter(item => Object.keys(item)[0] === 'minute')[0].minute
							const secondTemp = res.result.cronInfo.filter(item => Object.keys(item)[0] === 'second')[0].second === '' ? '00' : res.result.cronInfo.filter(item => Object.keys(item)[0] === 'second')[0].second
							const timeTemp = hourTemp + ':' + minuteTemp + ':' + secondTemp

							this.field.setValue('year', res.result.cronInfo.filter(item => Object.keys(item)[0] === 'year')[0].year)
							this.field.setValue('month', res.result.cronInfo.filter(item => Object.keys(item)[0] === 'month')[0].month)
							this.field.setValue('date', dateTemp)
							this.field.setValue('time', moment(timeTemp, 'HH:mm:ss'))

							// 设置数据资源信息
							this.setState({
								searchName: res.result.dataResourceName,
								selectedResource: [res.result.dataResourceUuid]
							}, () => {
								this.getResourceTable()
							})

							let tempAttribute = []
							let tempEvaInfo = []
							res.result.evaluationInfo.map(item => {
								// 设置已选中数据字段
								if (tempAttribute.findIndex((val) => { return val === item.name }) === -1) tempAttribute.push(item.name)

								// 设置评估规则
								let tempValue1 = item.code !== 'Date Enumerate' && item.code !== 'Enumerate' ? item.value1 : item.value1.substring(1, item.value1.length - 1).split('\',\'')
								let tempValue2 =item.code !== 'Date Enumerate' && item.code !== 'Enumerate' ? item.value2 : []
								tempEvaInfo.push({
									name: item.name,
									code: item.code,
									value1: tempValue1,
									value2: tempValue2,
									warningTriggerCondition: item.warningTriggerCondition,
									warningLimit: item.warningLimit
								})
							})
							this.setState({
								selectedAttributes: tempAttribute,
								evaluationInfo: tempEvaInfo
							})
						} else {
							Message.error((res && res.result && res.result.msg) || '详情获取失败')
						}
					}
					this.setState({ queryLoading: false })
				})
			}
			else {
				this.field.setValue('projectUuid', this.props.projectUuid)
				this.field.setValue('projectName', this.props.projectName)
				this.field.setValue('time', moment('00:00:01', 'HH:mm:ss'))
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
	 * @name: 获取数据资源目录
	 * @return {*}
	 */
	getCatalogue = async () => {
		const response = await getTreeRQ('govern-dataresource/resource')
		if (response) {
			if (response.code === 10000) {
				this.setState({ treeList: response.result.children })
			} else {
				Message.error(response.msg || '数据资源目录获取失败')
			}
		}
	}

	// 获取数据资源列表
	getResourceTable = async () => {
		const response = await getList({
			isPage: true,
			page: this.state.currentPage,
			limit: this.state.pageSize,
			classificationUuid: this.state.selectedClassfication,
			name: this.state.searchName,
			type: 'DWD'
		})
		if (response) {
			if (response.code === 10000) {
				this.setState({
					total: response.result.total,
					resourceTable: response.result.list,
					dataResourceAlert: false
				}, () => {
					this.getMetaData(this.state.selectedResource)
				})
			} else {
				Message.error(response.msg || '列表获取失败')
			}
		} else {
			Message.error('列表获取失败')
		}
	}
	// 查询数据资源
	onSearchResource = (val) => {
		this.setState({ searchName: val }, () => {
			if (this.searchTimeout) {
				clearTimeout(this.searchTimeout)
			}
			this.searchTimeout = setTimeout(async () => {
				this.getResourceTable()
			}, 500)
		})
	}

	// 获取数据结构
	getMetaData = async (selectedResource) => {
		let resourceItem = this.state.resourceTable.filter((item) => { return item.uuid === selectedResource[0] })[0]
		if (resourceItem) {
			let param = {
				database: resourceItem.tbDbName,
				table: resourceItem.tbName,
			}
			const res = await getDataStorageMeta(resourceItem.type, param)
			if (res) {
				if (res.code === 10000) {
					this.setState({
						columnsTable: res.result.columns,
						dataAttributeAlert: false
					})
				} else {
					Message.error(res.msg || '查询该数据资源的字段结构失败')
				}
			} else {
				Message.error('查询该数据资源的字段结构失败')
			}
		}
	}

	/**
	 * @name: 添加规则
	 * @param {*}
	 * @return {*}
	 */
	addRule = () => {
		let newRule = {
			name: '', // 字段名
			code: '', // 评估规则
			value1: '', // 评估内容第一个值
			value2: '', // 评估内容第二个值
			warningTriggerCondition: '', // 预警判断条件
			warningLimit: '', // 预警阈值
		}

		let evaArr = this.state.evaluationInfo
		evaArr.push(newRule)

		this.setState({ evaluationInfo: evaArr })
	}

	/**
	 * @name: 移除规则
	 * @param {Number} index
	 * @return {*}
	 */
	onDeleteRule = (index) => {
		console.log(index)
		let evaArr = this.state.evaluationInfo
		if (evaArr.length > 1) {
			evaArr.splice(index, 1)
			this.setState({ evaluationInfo: evaArr })
		} else {
			Message.error('需至少存在一条数据质量评估规则')
		}
	}

	// 验证数据资源是否已选择
	validateDataResource = () => {
		if (this.state.selectedResource.length === 0) {
			document.getElementById('evalutationAttributes').scrollIntoView({ behavior: 'smooth' })
			return false
		}
		else {
			return true
		}
	}

	// 验证数据字段是否已选择
	validateDataAttribute = () => {
		if (this.state.selectedAttributes.length === 0) {
			document.getElementById('evalutationAttributes').scrollIntoView({ behavior: 'smooth' })
			return false
		}
		else {
			return true
		}
	}

	// 评估规则空值校验
	validateEmptyRules = () => {
		let judge = this.state.evaluationInfo.map((item, index) => {
			if (item.name === '') {
				displayErrorMsg(index, '字段名称')
				return false
			}
			else if (item.code === '') {
				displayErrorMsg(index, '评估规则')
				return false
			}
			else if (item.value1 && item.value1.length === 0 && (item.code !== 'Special Char' && item.code !== 'Total Count' && item.code !== 'Null Count' && item.code !== 'Empty Count' && item.code !== 'Distinct Count')) {
				displayErrorMsg(index, '评估规则配置值')
				return false
			}
			else if (item.value2 && item.value2.length === 0 && (item.code === 'String Length Range' || item.code === 'Int Range' || item.code === 'Date Rang')) {
				displayErrorMsg(index, '评估规则配置值')
				return false
			}
			else if (item.warningTriggerCondition === '') {
				displayErrorMsg(index, '预警判断条件')
				return false
			}
			else if (item.warningLimit === '') {
				displayErrorMsg(index, '预警阈值')
				return false
			}
			else
				return true
		})

		let result = true
		judge.map(judgeItem => {
			result = result && judgeItem
		})
		return result

		function displayErrorMsg (index, emptyInfo) {
			Message.error('评估规则' + (index + 1) + '未填写完整，请补充' + emptyInfo)
		}
	}

	/**
	 * @name: 保存提交
	 * @param {*}
	 * @return {*}
	 */
	submitHandle = () => {
		this.field.validate((errors, values) => {
			if (errors) return
			else {
				if (!this.validateDataResource() || !this.validateDataAttribute()) {
					this.setState({
						dataResourceAlert: !this.validateDataResource(),
						dataAttributeAlert: !this.validateDataAttribute()
					})
					return
				}
				else {
					let judge = this.validateEmptyRules()
					if (!judge) return
					else {
						// 设置cron信息
						let cronYear = ''
						let cronMonth = ''
						let cronDate = ''
						if (values.year) cronYear = moment(values.year).format('YYYY')
						if (values.month) cronMonth = moment(values.month).format('MM')
						if (values.date) cronDate = moment(values.date).format('DD')

						// 设置evaluationInfo
						let evaInfo = []
						this.state.evaluationInfo.map(item => {
							if (item.code !== 'Date Enumerate' && item.code !== 'Enumerate') {
								evaInfo.push(item)
							}
							else {
								let tempValue1 = JSON.stringify(item.value1).replace(/\"/g, '\'')

								let tempInfo = {
									name: item.name,
									code: item.code,
									value1: tempValue1.substring(1, tempValue1.length - 1),
									value2: undefined,
									warningTriggerCondition: item.warningTriggerCondition,
									warningLimit: item.warningLimit
								}
								evaInfo.push(tempInfo)
							}
						})
						console.log(evaInfo)
						let param = {
							cronInfo: [
								{ year: cronYear },
								{ month: cronMonth },
								{ date: cronDate },
								{ hour: moment(values.time).format('HH') ? moment(values.time).format('HH') : '' },
								{ minute: moment(values.time).format('mm') ? moment(values.time).format('mm') : '' },
								{ second: moment(values.time).format('ss') ? moment(values.time).format('ss') : '' },
							],
							uuid: values.uuid,
							evaluationName: values.evaluationName,
							evaluationDescription: values.evaluationDescription,
							evaluationType: 'PROFILING',
							projectUuid: values.projectUuid,
							dataResourceUuid: this.state.selectedResource[0],
							dataResourceName: this.state.resourceTable.filter((item) => {
								return item.uuid === this.state.selectedResource[0]
							})[0].name,
							evaluationInfo: evaInfo
						}

						if (this.props.pageType === 'create') this.addEvaluation(param)
						else this.editEvaluation(param)
					}
				}
			}
		})
	}

	// 新增
	addEvaluation = async (param) => {
		let res = await addTask(param)
		if (res) {
			if (res.code === 10000) {
				Message.success('新增成功')
				this.props.onBack()
			}
			else {
				Message.error(res.msg || '新增失败')
			}
		}
		else {
			Message.error('新增失败')
		}
		this.setState({ submitLoading: false })
	}

	// 编辑
	editEvaluation = async (param) => {
		let res = await updateTask(param)
		if (res) {
			if (res.code === 10000) {
				Message.success('编辑成功')
				this.props.onBack()
			}
			else {
				Message.error(res.msg || '编辑失败')
			}
		}
		else {
			Message.error('编辑失败')
		}
		this.setState({ submitLoading: false })
	}

	render () {
		const { pageType, onBack } = this.props

		const {
			submitLoading,
			treeList,
			selectedClassfication,
			searchName,
			resourceTable,
			selectedResource,
			pageSize,
			currentPage,
			total,
			columnsTable,
			selectedAttributes,
			evaluationInfo,
			dataResourceAlert,
			dataAttributeAlert,
			queryLoading
		} = this.state

		const init = this.field.init

		const loop = (data) =>
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

		const enumerate_table = (type, rule_index) => (
			<div className="enumerate_table">
				<table>
					<thead>
						<tr>
							<td style={{ width: '80%' }}>{type === 'date' ? '日期枚举值' : '枚举值'}</td>
							<td style={{ width: '20%', textAlign: 'center' }}>操作</td>
						</tr>
					</thead>
					<tbody>
						{evaluationInfo[rule_index].value1.length > 0 ? evaluationInfo[rule_index].value1.map((item, index) => {
							return (
								<tr key={index}>
									<td>
										{type === 'date' ? (
											<DatePicker
												style={{ width: '100%' }}
												value={item}
												disabledDate={(date) => {
													return evaluationInfo[rule_index].value1.findIndex((val) => { return val === moment(date).format('YYYY-MM-DD') }) !== -1
												}}
												onChange={(v) => {
													let tempEvaInfo = evaluationInfo
													tempEvaInfo[rule_index].value1[index] = moment(v).format('YYYY-MM-DD')
													this.setState({ evaluationInfo: tempEvaInfo })
												}}
											/>
										) : (
												<div style={{ width: '100%' }}>
													<Input
														style={{ width: '100%' }}
														value={item}
														onChange={(v) => {
															if (NoCommaQuota(v)) {
																this.setState((prevState) => {
																	let arr = prevState.enumStringAlertRowIndex
																	arr.push(index)
																	return {
																		enumStringAlertRowIndex: arr
																	}
																})
															}
															else {
																	let tempEvaInfo = evaluationInfo
																	tempEvaInfo[rule_index].value1[index] = v
																	this.setState((prevState) => {
																		let spliceIndex = prevState.enumStringAlertRowIndex.indexOf(index)
																		let arr = prevState.enumStringAlertRowIndex
																		spliceIndex !== -1 ? arr.splice(spliceIndex, 1) : arr
																		return {
																			evaluationInfo: tempEvaInfo,
																			enumStringAlertRowIndex: arr
																		}
																	})
																}

														}}
													/>
													{this.state.enumStringAlertRowIndex.indexOf(index) !== -1 ? <p style={{ color: 'red' }}>该输入框不能输入英文单双引号、英文逗号</p> : null}
												</div>
										)}
									</td>
									<td style={{ textAlign: 'center' }}>
										<Button
											warning
											disabled={pageType === 'preview'}
											onClick={() => {
												let tempEvaInfo = evaluationInfo
												let newArray = JSON.parse(JSON.stringify(tempEvaInfo[rule_index].value1))
												newArray.splice(index, 1)
												tempEvaInfo[rule_index].value1 = newArray
												this.setState({ evaluationInfo: tempEvaInfo })
											}}
										>
											删除
										</Button>
									</td>
								</tr>
							)
						}) : null}
					</tbody>
				</table>
				<Button
					text
					type="primary"
					style={{ marginTop: 10 }}
					onClick={() => {
						let tempEvaInfo = evaluationInfo
						let newArray = []
						if (tempEvaInfo[rule_index].value1 !== '') {
							newArray = tempEvaInfo[rule_index].value1
						}
						newArray.push('')
						tempEvaInfo[rule_index].value1 = newArray
						this.setState({ evaluationInfo: tempEvaInfo })
					}}>
					+ 新增{type === 'date' ? '日期枚举值' : '枚举值'}
				</Button>
			</div>
		)

		const renderRuleSettings = (item, index) => {
			switch (item.code) {
				case 'Pattern':
					return (
						<Input
							style={{ width: '50%' }}
							placeholder="请输入正则表达式"
							value={item.value1}
							onChange={(v) => {
								let tempEvaInfo = evaluationInfo
								tempEvaInfo[index].value1 = v
								this.setState({ evaluationInfo: tempEvaInfo })
							}}
						/>
					)
				case 'String Length Range':
					return (
						<div
							style={{
								width: '50%',
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<NumberPicker
								style={{ width: '49%' }}
								placeholder="最小长度"
								value={item.value1}
								onChange={(v) => {
									let tempEvaInfo = evaluationInfo
									tempEvaInfo[index].value1 = v
									this.setState({ evaluationInfo: tempEvaInfo })
								}}
							/>
							<span>~</span>
							<NumberPicker
								style={{ width: '49%' }}
								placeholder="最大长度"
								value={item.value2}
								onChange={(v) => {
									let tempEvaInfo = evaluationInfo
									tempEvaInfo[index].value2 = v
									this.setState({ evaluationInfo: tempEvaInfo })
								}}
							/>
						</div>
					)
				case 'String Length':
					return (
						<NumberPicker
							style={{ width: '50%' }}
							placeholder="请输入字符串长度值"
							value={item.value1}
							onChange={(v) => {
								let tempEvaInfo = evaluationInfo
								tempEvaInfo[index].value1 = v
								this.setState({ evaluationInfo: tempEvaInfo })
							}}
						/>
					)
				case 'String Value':
					return (
						<Input
							style={{ width: '50%' }}
							placeholder="请输入字符串值"
							value={item.value1}
							onChange={(v) => {
								let tempEvaInfo = evaluationInfo
								tempEvaInfo[index].value1 = v
								this.setState({ evaluationInfo: tempEvaInfo })
							}}
						/>
					)
				case 'Int Range':
					return (
						<div
							style={{
								width: '50%',
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<NumberPicker
								style={{ width: '49%' }}
								placeholder="最小值"
								value={item.value1}
								onChange={(v) => {
									let tempEvaInfo = evaluationInfo
									tempEvaInfo[index].value1 = v
									this.setState({ evaluationInfo: tempEvaInfo })
								}}
							/>
							<span>~</span>
							<NumberPicker
								style={{ width: '49%' }}
								placeholder="最大值"
								value={item.value2}
								onChange={(v) => {
									let tempEvaInfo = evaluationInfo
									tempEvaInfo[index].value2 = v
									this.setState({ evaluationInfo: tempEvaInfo })
								}}
							/>
						</div>
					)
				case 'Int Value':
					return (
						<NumberPicker
							style={{ width: '50%' }}
							placeholder="请输入数字值"
							value={item.value1}
							onChange={(v) => {
								let tempEvaInfo = evaluationInfo
								tempEvaInfo[index].value1 = v
								this.setState({ evaluationInfo: tempEvaInfo })
							}}
						/>
					)
				case 'Date Range': return (
					<RangePicker
						style={{ width: '50%' }}
						showTime={false}
						value={[item.value1, item.value2]}
						onChange={(dates) => {
							let tempEvaInfo = evaluationInfo
							tempEvaInfo[index].value1 = dates[0] ? moment(dates[0]).format('YYYY-MM-DD') : ''
							tempEvaInfo[index].value2 = dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : ''
							this.setState({ evaluationInfo: tempEvaInfo })
						}}
					/>
				)
				case 'Date Value': return (
					<DatePicker
						style={{ width: '50%' }}
						showTime={false}
						value={item.value1}
						onChange={(v) => {
							let tempEvaInfo = evaluationInfo
							tempEvaInfo[index].value1 = moment(v).format('YYYY-MM-DD')
							this.setState({ evaluationInfo: tempEvaInfo })
						}}
					/>
				)
				case 'Date Enumerate': return (
					enumerate_table('date', index)
				)
				case 'Enumerate': return (
					enumerate_table('normal', index)
				)
				case '特殊字符': return (
					<Input disabled placeholder="该规则无需输入配置值"/>
				)
				case 'Sensitive Words': return (
						<Input
							style={{ width: '50%' }}
							placeholder="请输入敏感词"
							value={item.value1}
							onChange={(v) => {
								let tempEvaInfo = evaluationInfo
								tempEvaInfo[index].value1 = v
								this.setState({ evaluationInfo: tempEvaInfo })
							}}
						/>
				)
				case 'Total Count': return (
					<Input disabled placeholder="该规则无需输入配置值"/>
				)
				case 'Null Count': return (
					<Input disabled placeholder="该规则无需输入配置值"/>
				)
				case 'Empty Count': return (
					<Input disabled placeholder="该规则无需输入配置值"/>
				)
				case 'Distinct Count': return (
					<Input disabled placeholder="该规则无需输入配置值"/>
				)
				default:
					return (
						<Input
							style={{ width: '50%' }}
							placeholder="请先选择规则类型"
							disabled
						/>
					)
			}
		}

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<Loading visible={queryLoading} fullScreen/>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="评估任务名称：" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={50}
							hasLimitHint
							placeholder="请输入评估任务名称"
							{...init('evaluationName', {
								rules: [
									{
										required: true,
										message: '评估任务名称不能为空',
									},
								],
							})}
						/>
					</FormItem>
					<FormItem label="评估任务描述" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={200}
							hasLimitHint
							placeholder="请输入评估任务描述"
							{...init('evaluationDescription', {
								rules: [
									{
										required: true,
										message: '评估任务描述不能为空',
									},
								],
							})}
						/>
					</FormItem>

					<FormItem label="评估类型：" required>
						<Input value="精确型评估任务" disabled />
					</FormItem>

					<FormItem label="所属分组：" required>
						<Input {...init('projectName')} disabled />
					</FormItem>

					<FormItem label="任务CRON定时：" required>
						<YearPicker
							style={{ width: '25%' }}
							placeholder="年"
							{...init('year')}
						/>
						<MonthPicker
							style={{ width: '25%' }}
							placeholder="月"
							format="MM"
							{...init('month')}
						/>
						<DatePicker
							style={{ width: '25%' }}
							placeholder="日"
							format="DD"
							{...init('date')}
						/>
						<TimePicker
							style={{ width: '25%' }}
							placeholder="时间"
							hasClear={false}
							{...init('time', {
								rules: [{ required: true, message: '时间不可为空' }],
							})}
						/>
					</FormItem>
				</InfoContainer>

				<InfoContainer title="配置评估字段" id="evalutationAttributes">

					<FormItem label="选择数据资源：" required>
						<p style={{ color: 'red', display: dataResourceAlert ? 'block' : 'none' }}>数据资源不能为空</p>
						<div style={{ width: '100%', marginBottom: '10px' }}>
							<TreeSelect
								hasClear
								placeholder="请选择数据资源编目"
								style={{ width: '25%' }}
								value={selectedClassfication}
								onChange={(v) => {
									this.setState({ selectedClassfication: v }, () => {
										this.getResourceTable()
									})
								}}
								disabled={pageType === 'preview'}
							>
								{loop(treeList)}
							</TreeSelect>
							<Search
								style={{ width: '25%' }}
								shape="simple"
								placeholder="搜索数据资源名称"
								value={searchName}
								onChange={this.onSearchResource}
							/>
						</div>
						<Table
							size="small"
							primaryKey="uuid"
							dataSource={resourceTable}
							rowSelection={{
								mode: 'single',
								selectedRowKeys: selectedResource,
								onChange: (selectedRowKeys) => {
									this.setState(
										{
											selectedResource: selectedRowKeys,
											selectedAttributes: [],
											dataResourceAlert: false
										},
										() => {
											this.getMetaData(this.state.selectedResource)
										}
									)
								},
							}}
						>
							<Table.Column
								title="数据资源名称"
								dataIndex="name"
								align="center"
							/>
							<Table.Column
								title="类型"
								dataIndex="type"
								align="center"
								cell={(value) => {
									switch (value) {
										case 'DWD': return '数仓数据'
										case 'TSD': return '时序数据'
										case 'PD': return '感知数据'
										default: return ''
									}
								}}
							/>
							<Table.Column
								title="数据库"
								dataIndex="tbDbName"
								align="center"
							/>
							<Table.Column
								title="数据表"
								dataIndex="tbName"
								align="center"
							/>
						</Table>
						<Pagination
							style={{ marginTop: 10, textAlign: 'right' }}
							pageSize={pageSize}
							total={total}
							current={currentPage}
							onChange={(page) => {
								this.setState({ currentPage: page }, () => {
									this.getResourceTable()
								})
							}}
						/>

					</FormItem>

					<FormItem label="选择评估字段：" required>
						<div style={{ color: 'red', display: dataAttributeAlert ? 'block' : 'none' }} id="selectDataAttribute">至少选择一个评估字段</div>
						<Table
							dataSource={columnsTable}
							primaryKey="columnName"
							size="small"
							rowSelection={{
								selectedRowKeys: selectedAttributes,
								onChange: (selectedRowKeys) => {
									this.setState({
										selectedAttributes: selectedRowKeys,
										dataAttributeAlert: false
									})
								},
							}}
						>
							<Table.Column
								dataIndex="columnName"
								title="字段名称"
								align="center"
							/>
							<Table.Column
								dataIndex="typeName"
								title="字段类型"
								align="center"
							/>
							<Table.Column
								dataIndex="columnSize"
								title="字段长度"
								align="center"
							/>
						</Table>
					</FormItem>
				</InfoContainer>

				<InfoContainer title="配置评估规则" id="evaluationRules">
					{evaluationInfo.length > 0
						? evaluationInfo.map((item, index) => (
								<Card
									free
									style={{ width: '100%', marginBottom: '10px' }}
									key={index}
								>
									<Card.Header
										title={'评估规则' + (index + 1)}
										extra={
											<Button
												text
												warning
												type="primary"
												style={{ color: colorStyle.btn_delete_color }}
												onClick={() => this.onDeleteRule(index)}
											>
												删除
											</Button>
										}
									/>
									<Card.Divider />
									<Card.Content>
										<FormItem label="评估字段：" required>
											<Select
												style={{ width: '50%' }}
												dataSource={selectedAttributes}
												value={item.name}
												onChange={(v) => {
													let tempEvaInfo = evaluationInfo
													tempEvaInfo[index].name = v
													this.setState({ evaluationInfo: tempEvaInfo })
												}}
											/>
										</FormItem>
										<FormItem label="规则类型:" required>
											<Select
												style={{ width: '50%' }}
												dataSource={statisticsOptions}
												value={item.code}
												onChange={(v) => {
													let tempEvaInfo = evaluationInfo
													tempEvaInfo[index].code = v
													tempEvaInfo[index].value1 = ''
													tempEvaInfo[index].value2 = ''
													this.setState({ evaluationInfo: tempEvaInfo })
												}}
											/>
										</FormItem>
										<FormItem label="规则配置:" required>
											{renderRuleSettings(item, index)}
										</FormItem>
										<FormItem label="预警规则:" required>
											<Select
												placeholder="预警条件"
												style={{ width: '20%' }}
												dataSource={warningTriggerConditionOptions}
												value={item.warningTriggerCondition}
												onChange={(v) => {
													let tempEvaInfo = evaluationInfo
													console.log(tempEvaInfo)
													tempEvaInfo[index].warningTriggerCondition = v
													this.setState({ evaluationInfo: tempEvaInfo })
												}}
											/>
											<NumberPicker
												placeholder="阈值（数字）"
												style={{ width: '30%' }}
												value={item.warningLimit}
												onChange={(v) => {
													let tempEvaInfo = evaluationInfo
													tempEvaInfo[index].warningLimit = v
													this.setState({ evaluationInfo: tempEvaInfo })
												}}
											/>
										</FormItem>
									</Card.Content>
								</Card>
						))
						: null}

					<Button
						text
						type="primary"
						style={{ marginTop: '10px' }}
						onClick={this.addRule}
					>
						<IconFont type="iconcatalogue_add" size="xs" />
						<span style={{ marginLeft: '5px' }}>添加规则</span>
					</Button>
				</InfoContainer>

				{pageType === 'preview' ? null : (
					<div id="operationBtns">
						<FormItem wrapperCol={{ offset: 11 }}>
							<Button
								loading={submitLoading}
								type="primary"
								onClick={this.submitHandle}
								style={{ marginRight: 20 }}
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
