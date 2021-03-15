import React from 'react'
import {
	Form,
	Field,
	Input,
	Button,
	Select,
	Checkbox,
	Message,
	DatePicker,
} from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import PropTypes from 'prop-types' // 类型检查
import moment from 'moment'
import {
	jumpToPage,
	getQueryItemValue
} from '@/utils/common'
import { findCurrentRouteItem } from '@/utils/menuForRoute'
import { connect } from 'react-redux'
import { Tab } from '@/reduxActions'
moment.locale('zh-cn')

const FormItem = Form.Item

import {
	BatchTaskManage as BatchTaskManageActions,
	CatalogueAction
} from '@/actions'

const {
	getTreeRQ
} = CatalogueAction

const {
	createJobTask: createTask,
	updateJobTask: updateTask,
	getJobInfo: getInfo
} = BatchTaskManageActions

@connect((state) => ({ state: state.tabs }), Tab)
class JobCreateAndEditService extends React.Component {
	field = new Field(this)

	state = {
		useAirflow: false,
		timeCircleOptions: [
			{ label: '分钟', value: 'minute' },
			{ label: '小时', value: 'hour' },
			{ label: '天', value: 'day' },
			{ label: '周', value: 'week' },
			{ label: '月', value: 'month' },
		],
		startValue: null, // 自定义的日期范围选 --- 开始日期
		endValue: null, // 自定义的日期范围选 --- 结束日期
		endOpen: false, // 自定义的日期范围选 --- 结束日期状态
		hours: [], // 时间 -- 小时
		minutes: [], // 时间 -- 分钟
		rangemonth: [], // 调度间隔 -- 月
		projectDataSource: [],	// 所属项目datasource
		pageType: '', // 页面类型
		catalogueDataSource: []
	}

	static getDerivedStateFromProps (props) {
		const Item = findCurrentRouteItem(props.location.pathname)
		return {
			pageType: Item.type
		}
	}

	// 初始化选择
	initSelectSource = () => {
		let hours = []
		let minutes = []
		let rangemonth = []
		Array(24)
			.fill('hour')
			.forEach((item, index) => {
				if (index < 10) {
					hours.push({ value: `0${index}`, label: `0${index}` })
				} else {
					hours.push({ value: `${index}`, label: `${index}` })
				}
			})
		Array(60)
			.fill('minute')
			.forEach((item, index) => {
				if (index < 10) {
					minutes.push({ value: `0${index}`, label: `0${index}` })
				} else {
					minutes.push({ value: `${index}`, label: `${index}` })
				}
			})
		Array(31)
			.fill('minute')
			.forEach((item, index) => {
				rangemonth.push({ value: `${index + 1}`, label: `每月${index + 1}号` })
			})
		this.setState({
			hours: hours,
			minutes: minutes,
			rangemonth: rangemonth,
		})
	}

	componentDidMount () {
		const {
			pageType
		} = this.state
		this.createInit()
		this.initSelectSource()
		this.getTreeList()
		if (pageType === 'edit') {
			this.getDataInfo()
		}
	}

	// 获取页面详情
	getDataInfo = async () => {
		const { search } = this.props.location
		const uuid = getQueryItemValue(search, 'uuid')
		const response = await getInfo({ uuid })
		console.log(response)
		if (response && response.code === 10000) {
			const data = response.result
			const catalogUuid = data.catalogUuid
			const taskName = data.taskName
			const taskDesc = data.taskDesc
			const isSchedule = data.isSchedule === 1 ? true : false
			const warningEmails = data.warningEmails
			const schedulePeriodic = data.schedulePeriodic
			const scheduleTimeRange = data.scheduleTimeRange ?
				data.schedulePeriodic === 0 ||
				data.schedulePeriodic === 1 ?
				data.scheduleTimeRange :
				data.scheduleTimeRange.split(',') : ''
			const startDate = data.scheduleEffectTime.split(',')[0]
			const endDate = data.scheduleEffectTime.split(',')[1]
			const starthour = data.scheduleStartTime.split(':')[0]
			const startminute = data.scheduleStartTime.split(':')[1]
			const endhour = data.scheduleEndTime.split(':')[0]
			const endminute = data.scheduleEndTime.split(':')[1]
			const hour = data.scheduleTime.split(':')[0]
			const minute = data.scheduleTime.split(':')[1]
			this.field.setValues({
				catalogUuid,
				taskName,
				taskDesc,
				isSchedule,
				warningEmails,
				schedulePeriodic,
				scheduleTimeRange,
				startDate,
				endDate,
				starthour,
				startminute,
				endhour,
				endminute,
				hour,
				minute
			})
		}
	}

	// 获取目录树列表
	getTreeList = async () => {
		const response = await getTreeRQ('govern-datasource/dataworks/project')

		if (response && response.code === 10000) {
			this.setState({
				catalogueDataSource: response.result.children.map((item) => {
					return {
						label: item.label,
						value: item.value
					}
				})
			})
		}
	}


	createInit = () => {
		const { search } = this.props.location
		// 获取url的query值
		const uuid = getQueryItemValue(search, 'uuid')
		const title = getQueryItemValue(search, 'title')
		const jobuuid = getQueryItemValue(search, 'jobuuid')
		const jobtitle = getQueryItemValue(search, 'jobtitle')

		const label = jobtitle ? decodeURI(jobtitle) : title
		const value = jobuuid ? jobuuid : uuid
		this.setState({
			projectDataSource: [{
				label,
				value,
			}]
		}, () => {
			this.field.setValue('projectUuid', value)
		})
	}

	componentWillUnmount () {
		this.setState = () => {
			return
		}
	}

	// 确认提交
	onSubmit = () => {
		this.field.validate((errors, values) => {
			if (errors) return
			console.log(values)
			this.setState({ submitLoading: true })
			const isSchedule = values.isSchedule
			let params = {
				projectUuid: values.projectUuid,
				catalogUuid: values.catalogUuid,
				taskName: values.taskName,
				taskDesc: values.taskDesc,
			}
			if (isSchedule) {
				// 选择了调度周期
				const startDate =
					typeof values.startDate !== 'string'
						? moment(values.startDate).format('YYYY-MM-DD') || ''
						: values.startDate
				const endDate =
					typeof values.endDate !== 'string'
						? moment(values.endDate).format('YYYY-MM-DD') || ''
						: values.endDate
				params = {
					...params,
					scheduleEffectTime: `${startDate},${endDate}`,
					warningEmails: values.warningEmails,
					schedulePeriodic: values.schedulePeriodic,
					scheduleStartTime:
						values.starthour && values.startminute
							? `${values.starthour}:${values.startminute}`
							: '',
					scheduleTimeRange:  values.scheduleTimeRange
					? values.schedulePeriodic === 0 || values.schedulePeriodic === 1
						? values.scheduleTimeRange
						: values.scheduleTimeRange.join(',')
					: '',
					scheduleEndTime:
						values.endhour && values.endminute
							? `${values.endhour}:${values.endminute}`
							: '',
					scheduleTime:
						values.hour && values.minute
							? `${values.hour}:${values.minute}`
							: '',
					isSchedule: values.isSchedule
				}
				this.requestHandle(params)
			} else {
				// 没有选择调度周期
				this.requestHandle(values)
			}
		})
	}

	// 请求处理
	requestHandle = async (params) => {
		console.log(params)

		const { search } = this.props.location
		const { pageType } = this.state
		// 获取url的query值
		const uuid = getQueryItemValue(search, 'uuid')
		const title = getQueryItemValue(search, 'title')
		const jobuuid = getQueryItemValue(search, 'jobuuid')
		const jobtitle = getQueryItemValue(search, 'jobtitle')
		const page = getQueryItemValue(search, 'page')
		// 设置跳转回到作业列表的query值（新增、编辑同样，编辑时候列表的title和uuid为job）
		let response
		const queryParams = [
			{ label: 'uuid', value: jobuuid ?? uuid },
			{ label: 'title', value: jobtitle ?? encodeURI(title) },
		]
		if (pageType === 'create') {
			response = await createTask({
				...params,
				isSchedule: params.isSchedule ? 1 : 0,
			})
		} else {
			response = await updateTask({
				uuid,
				...params,
				isSchedule: params.isSchedule ? 1 : 0,
			})
		}

		if (response && response.code === 10000) {
			Message.success(pageType === 'create' ? '新增成功！' : '编辑成功！')
			// 路由跳转
			jumpToPage(this.props, '作业开发', queryParams, true, page ?? 1)
		} else {
			pageType === 'create' ?
			Message.error(response && response.msg || '新增失败！') :
			Message.error(response && response.msg || '编辑失败！')
		}
	}

	/**
	 * 调度配置方法
	 */
	// change公共方法
	onChange = (stateName, value) => {
		this.setState({
			[stateName]: value,
		})
	}
	// 起始日期的change事件
	onStartChange = (value) => {
		this.onChange('startValue', value)
	}
	// 截止日期的change事件
	onEndChange = (value) => {
		this.onChange('endValue', value)
	}
	// 禁止起始日期
	disabledStartDate = (startValue) => {
  	const { endValue } = this.state
  	if (!startValue || !endValue) {
  		return false
  	}
  	return startValue.valueOf() > endValue.valueOf()
	}
	// 起始日期打开事件
	handleStartOpenChange = (open) => {
		if (!open) {
			this.setState({ endOpen: true })
		}
	}
	// 截止日期打开事件
	handleEndOpenChange = (open) => {
		this.setState({ endOpen: open })
	}
	// 禁止截止日期
	disabledEndDate = (endValue) => {
  	const { startValue } = this.state
  	if (!endValue || !startValue) {
  		return false
  	}
  	return endValue.valueOf() <= startValue.valueOf()
	}

	render () {
		const { pageType, onCancel } = this.props

		const {
			projectDataSource,
			catalogueDataSource,
			endOpen,
			Email,
			hours,
			minutes,
			rangemonth
		} = this.state

		const init = this.field.init

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="所属项目：" required>
						<Select
							dataSource={projectDataSource}
							style={{ width: '49%' }}
							placeholder="请选择所属项目"
							{...init('projectUuid')}
							disabled
						/>
					</FormItem>
					<FormItem label="作业名称：" required>
						<Input
							maxLength={50}
							hasLimitHint
							placeholder="请输入作业名称"
							{...init('taskName', {
								rules: [{ required: true, message: '作业名称不能为空' }],
							})}
						/>
					</FormItem>
					<FormItem label="作业描述：">
						<Input
							maxLength={200}
							hasLimitHint
							placeholder="请输入作业描述"
							{...init('taskDesc')}
						/>
					</FormItem>
					<FormItem label="所属目录：">
						<Select
							dataSource={catalogueDataSource}
							style={{ width: '49%' }}
							placeholder="请选择作业分类"
							{...init('catalogUuid')}
						/>
					</FormItem>
				</InfoContainer>

				<InfoContainer title="调度信息" id="airflowInfo">
					<FormItem label="采集调度配置:" hasFeedback>
						<Checkbox disabled={pageType === 'preview'} name="isSchedule" defaultChecked={false}>
							是否调度
						</Checkbox>
					</FormItem>
					{this.field.getValue('isSchedule') ? (
						<FormItem
							label="调度生效日期:"
							hasFeedback
							required
							requiredMessage="必须选择调度生效日期"
						>
							<DatePicker
								isPreview={pageType === 'preview'}
								placeholder="起时日期"
								{...init('startDate', {}, {
									onChange: this.onStartChange,
									onVisibleChange: this.handleStartOpenChange,
									disabledDate: this.disabledStartDate
								})}
							/>
							<span className="custom-sep"> - </span>
							<DatePicker
								isPreview={pageType === 'preview'}
								placeholder="截止日期"
								{...init('endDate', {}, {
									onChange: this.onEndChange,
									visible: endOpen,
									onVisibleChange: this.handleEndOpenChange,
									disabledDate: this.disabledEndDate
								})}
							/>
						</FormItem>
					) : null}
					{this.field.getValue('isSchedule') && this.field.getValue('datasourceType') !== 'api' ? (
						<FormItem
							label="调度预警邮箱:"
							hasFeedback
							required
							requiredMessage="必须填写调度预警邮箱"
							patternMessage="请输入合法的邮箱"
						>
							<Input
								readOnly={pageType === 'preview'}
								style={{ width: 420 }}
								trim
								placeholder="添加预警邮箱，按逗号“，”分割"
								{...init('warningEmails', {
									rules: [
										{
											required: true,
											message: '端口不能为空',
										},
										{
											validator: Email,
										},
									],
								})}
							/>
						</FormItem>
					) : null}
					{this.field.getValue('isSchedule') ? (
						<FormItem
							label="设置调度周期:"
							hasFeedback
							required
							requiredMessage="必须选择调度周期"
						>
							<Select
								readOnly={pageType === 'preview'}
								style={{ width: 150 }}
								placeholder="设置调度周期"
								showSearch
								hasClear
								{...init('schedulePeriodic', {}, {
									dataSource: [
										{ value: 0, label: '分钟' },
										{ value: 1, label: '小时' },
										{ value: 2, label: '天' },
										{ value: 3, label: '周' },
										{ value: 4, label: '月' },
									],
									onChange: () => {
										// 初始化
										this.field.setValues({
											starthour: '00',
											startminute: '00',
											hour: '00',
											minute: '00',
											endhour: '00',
											endminute: '59',
											scheduleTimeRange: null,
										})
									}
								})}
							/>
						</FormItem>
					) : null}
					{
						// 当调度周期为【分钟】和【小时】的情况
						(this.field.getValue('isSchedule') &&
							this.field.getValue('schedulePeriodic') === 0) ||
						(this.field.getValue('isSchedule') &&
							this.field.getValue('schedulePeriodic') === 1) ? (
							<FormItem
								label="调度开始时间:"
								hasFeedback
								required
								requiredMessage="必须设置调度开始时间"
							>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 100 }}
									showSearch
									hasClear
									{...init('starthour', { initValue: '00' }, {
										dataSource: hours
									})}
								/>
								<span style={{ fontSize: 16, padding: '0 10px' }}>时</span>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 100 }}
									showSearch
									hasClear
									{...init('startminute', { initValue: '00' }, {
										dataSource: minutes
									})}
								/>
								<span style={{ fontSize: 16, padding: '0 10px' }}>分</span>
							</FormItem>
						) : null
					}
					{
						// 当调度周期为【天】和【周】和【月】的情况
						(this.field.getValue('isSchedule') &&
							this.field.getValue('schedulePeriodic') === 2) ||
						(this.field.getValue('isSchedule') &&
							this.field.getValue('schedulePeriodic') === 3) ||
						(this.field.getValue('isSchedule') &&
							this.field.getValue('schedulePeriodic') === 4) ? (
							<FormItem
								label="调度时间:"
								hasFeedback
								required
								requiredMessage="必须设置调度时间"
							>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 100 }}
									showSearch
									hasClear
									{...init('hour', { initValue: '00' }, {
										dataSource: hours
									})}
								/>
								<span style={{ fontSize: 16, padding: '0 10px' }}>时</span>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 100 }}
									showSearch
									hasClear
									{...init('minute', { initValue: '00' }, {
										dataSource: minutes
									})}
								/>
								<span style={{ fontSize: 16, padding: '0 10px' }}>分</span>
							</FormItem>
						) : null
					}
					{
						// 当调度周期为【分钟】
						this.field.getValue('isSchedule') &&
						this.field.getValue('schedulePeriodic') === 0 ? (
							<FormItem
								label="调度间隔时间:"
								hasFeedback
								required
								requiredMessage="必须选择调度间隔时间"
							>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 100 }}
									showSearch
									hasClear
									{...init('scheduleTimeRange', {}, {
										dataSource: [
											{ value: '5', label: '5分钟' },
											{ value: '10', label: '10分钟' },
											{ value: '15', label: '15分钟' },
											{ value: '20', label: '20分钟' },
											{ value: '25', label: '25分钟' },
											{ value: '30', label: '30分钟' },
										]
									})}
								/>
							</FormItem>
						) : null
					}
					{
						// 当调度周期为【小时】
						this.field.getValue('isSchedule') &&
						this.field.getValue('schedulePeriodic') === 1 ? (
							<FormItem
								label="调度间隔时间:"
								hasFeedback
								required
								requiredMessage="必须选择调度间隔时间"
							>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 100 }}
									showSearch
									hasClear
									{...init('scheduleTimeRange', {}, {
										dataSource: [
											{ value: '1', label: '1小时' },
											{ value: '2', label: '2小时' },
											{ value: '3', label: '3小时' },
											{ value: '4', label: '4小时' },
											{ value: '5', label: '5小时' },
											{ value: '6', label: '6小时' },
											{ value: '7', label: '7小时' },
											{ value: '8', label: '8小时' },
											{ value: '9', label: '9小时' },
											{ value: '10', label: '10小时' },
											{ value: '11', label: '11小时' },
											{ value: '12', label: '12小时' },
										]
									})}
								/>
							</FormItem>
						) : null
					}
					{
						// 当调度周期为【周】
						this.field.getValue('isSchedule') &&
						this.field.getValue('schedulePeriodic') === 3 ? (
							<FormItem
								label="调度间隔时间:"
								hasFeedback
								required
								requiredMessage="必须选择调度间隔时间"
							>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 200 }}
									showSearch
									hasClear
									{...init('scheduleTimeRange', {}, {
										dataSource: [
											{ value: '2', label: '星期一' },
											{ value: '3', label: '星期二' },
											{ value: '4', label: '星期三' },
											{ value: '5', label: '星期四' },
											{ value: '6', label: '星期五' },
											{ value: '7', label: '星期六' },
											{ value: '1', label: '星期天' },
										],
										mode: 'multiple'
									})}
								/>
							</FormItem>
						) : null
					}
					{
						// 当调度周期为【月】
						this.field.getValue('isSchedule') &&
						this.field.getValue('schedulePeriodic') === 4 ? (
							<FormItem
								label="调度间隔时间:"
								hasFeedback
								required
								requiredMessage="必须选择调度间隔时间"
							>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 200 }}
									showSearch
									hasClear
									{...init('scheduleTimeRange', {}, {
										dataSource: rangemonth,
										mode: 'multiple'
									})}
								/>
							</FormItem>
						) : null
					}
					{
						// 当调度周期为【分钟】和【小时】的情况
						(this.field.getValue('isSchedule') &&
							this.field.getValue('schedulePeriodic') === 0) ||
						(this.field.getValue('isSchedule') &&
							this.field.getValue('schedulePeriodic') === 1) ? (
							<FormItem
								label="调度结束时间:"
								hasFeedback
								required
								requiredMessage="必须设置调度结束时间"
							>
								<Select
									readOnly={pageType === 'preview'}
									style={{ width: 100 }}
									showSearch
									hasClear
									{...init('endhour', { initValue: '23' }, {
										dataSource: hours
									})}
								/>
								<span style={{ fontSize: 16, padding: '0 10px' }}>时</span>
								<Select
									readOnly={pageType === 'preview'}
									disabled={this.field.getValue('schedulePeriodic') === 1}
									style={{ width: 100 }}
									showSearch
									hasClear
									{...init('endminute', { initValue: '59' }, {
										dataSource: minutes
									})}
								/>
								<span style={{ fontSize: 16, padding: '0 10px' }}>分</span>
							</FormItem>
						) : null
					}
				</InfoContainer>

				<div
					id="operationBtns"
					style={{ display: pageType === 'preview' ? 'none' : '' }}
				>
					<Button
						type="primary"
						style={{ marginRight: 10 }}
						onClick={this.onSubmit}
					>
						确认
					</Button>
					<Button type="secondary" onClick={onCancel}>
						取消
					</Button>
				</div>
			</Form>
		)
	}
}

export default JobCreateAndEditService

// props默认值指定
JobCreateAndEditService.defaultProps = {
	pageType: 'create',
	initFieldUuid: '',
}

JobCreateAndEditService.propTypes = {
	pageType: PropTypes.string, // 页面类型 - 新建业务：create/编辑业务：edit/查看业务：preview
	initFieldUuid: PropTypes.string, // 编辑业务 - 初始化表单数据的业务uuid
}
