/*
 * @Author: ShenLing
 * @Date: 2020-10-20 14:51:38
 * @LastEditors: Shenling
 * @LastEditTime: 2020-12-03 11:13:02
 */
import React from 'react'
import {
	Form,
	Field,
	Input,
	NumberPicker,
	Select,
	Button,
	Message,
} from '@alifd/next'
import CronGenerator from '@/components/CronGenerator'
import InfoContainer from '@/components/InfoContainer'
import { DataDispatchAction, DataStorageAction } from '@/actions'
import { leaveAndSave, hasStorageAndInit } from 'utils/common'

const { addJob, updateJob, queryJob } = DataDispatchAction
const { getStructure } = DataStorageAction

const FormItem = Form.Item

export default class DataDispatchCreateEditPreviewService extends React.Component {
	field = new Field(this)
	state = {
		submitLoading: false,
		cronGeneratorVisible: false,
		TSD_dataStructure: {},
		PD_dataStructure: {}
	}

	async componentDidMount () {
		const initData = hasStorageAndInit()

		// 存在当前修改
		if (initData) {
			this.field.setValues(initData)
		} else {
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				// 如果没有初始值、并且是编辑时，获取编辑详情
				let res = await queryJob({ id: this.props.initFieldDataxId })
				console.log(res)
				if (res) {
					if (res.code === 10000) {
						// 切记不能使用setValues，因为它会把删除状态也给传进去了
						this.field.setValue('dataxId', res.result.dataxId)
						this.field.setValue('name', res.result.name)
						this.field.setValue('sourceDatabase', res.result.sourceDatabase)
						this.field.setValue('sourceTable', res.result.sourceTable)
						this.field.setValue('targetDatabase', res.result.targetDatabase)
						this.field.setValue('targetTable', res.result.targetTable)
						this.field.setValue('storeDateRange', res.result.storeDateRange)
						this.field.setValue('executorBlockStrategy', res.result.executorBlockStrategy)
						this.field.setValue('executorFailRetryCount', res.result.executorFailRetryCount)
						this.field.setValue('executorTimeout', res.result.executorTimeout)
						this.field.setValue('jobCron', res.result.jobCron)
					} else {
						Message.error(
							(res && res.result && res.result.msg) || '详情获取失败'
						)
					}
				}
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
  * @name: 获取数据结构
  * @param {string} type 感知数据和时序数据标识符：TSD（时序） PD（感知）
  * @return {*}
  */
	getDataBaseList = async (type) => {
		let res = await getStructure(type)
		if (res && res.code === 10000) {
			this.setState({
				TSD_dataStructure: type === 'TSD' ? res.result : {},
				PD_dataStructure: type === 'PD' ? res.result : {},
			})
		}
	}

	/**
  * @name: 点击数据库选择框时，根据类型，获取对应数据库表结构
  * @param {boolean} visible 打开Select下拉框是否可见
  * @param {string} dbType 感知数据和时序数据标识符：TSD（时序） PD（感知）
  * @return {*}
  */
	onVisibleChange = (visible, dbType) => {
		if (visible) {
			this.getDataBaseList(dbType)
		}
	}

	/**
  * @name: 提交校验表单
  * @return {*}
  */
	submitHandle = () => {
		this.field.validate((errors, values) => {
			if (errors) return

			this.setState({ submitLoading: true }, () => {
				if (this.props.pageType === 'create') this.addJob(values)
				else if (this.props.pageType === 'edit') this.updateJob(values)
			})
		})
	}

	// 新建任务请求
	addJob = async (values) => {
		let param = values
		param.storeDateRange = 3600

		let res = await addJob(param)
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

	// 编辑任务请求
	updateJob = async (values) => {
		let param = values
		let res = await updateJob(param)
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

		const { submitLoading, cronGeneratorVisible, TSD_dataStructure, PD_dataStructure } = this.state

		const init = this.field.init

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="数据调度任务名称：" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={50}
							hasLimitHint
							placeholder="请输入数据调度任务名称"
							{...init('name', {
								rules: [
									{
										required: true,
										message: '数据调度任务名称不能为空',
									},
								],
							})}
						/>
					</FormItem>
				</InfoContainer>

				<InfoContainer title="调度数据信息" id="dispatchInfo">
					<FormItem label="选择时序数据表：" required>
						<Select
							readOnly={pageType === 'preview'}
							style={{ width: '25%' }}
							placeholder="请选择时序数据库"
							onVisibleChange={(visible) => { this.onVisibleChange(visible, 'TSD') }}
							{...init('sourceDatabase', {}, {
									onChange: (v) => {
										this.field.setValue('sourceDatabase', v)
										this.field.setValue('sourceTable', '')
									},
								}
							)}
						>
							{Object.keys(TSD_dataStructure).length > 0 ? (
								Object.keys(TSD_dataStructure).map(item => (
									<Select.Option value={item} label={item} key={item}/>
								))
							): null}
						</Select>
						<Select
							readOnly={pageType === 'preview'}
							style={{ width: '25%' }}
							placeholder="请选择时序数据表"
							{...init('sourceTable', {}, {
									onChange: (v) => {
										this.field.setValue('sourceTable', v)
									},
								}
							)}
						>
							{TSD_dataStructure[this.field.getValue('sourceDatabase')] && TSD_dataStructure[this.field.getValue('sourceDatabase')].length > 0 ? (
									TSD_dataStructure[this.field.getValue('sourceDatabase')].map(item => (
										<Select.Option value={item} label={item} key={item}/>
									))
								) : null}
						</Select>
					</FormItem>
					<FormItem label="选择感知数据表：" required>
						<Select
							readOnly={pageType === 'preview'}
							style={{ width: '25%' }}
							placeholder="请选择感知数据库"
							onVisibleChange={(visible) => { this.onVisibleChange(visible, 'PD') }}
							{...init('targetDatabase', {}, {
									onChange: (v) => {
										this.field.setValue('targetDatabase', v)
										this.field.setValue('targetTable', '')
									},
								}
							)}
						>
							{Object.keys(PD_dataStructure).length > 0 ? (
								Object.keys(PD_dataStructure).map(item => (
									<Select.Option value={item} label={item} key={item}/>
								))
							): null}
						</Select>
						<Select
							readOnly={pageType === 'preview'}
							style={{ width: '25%' }}
							placeholder="请选择感知数据表"
							{...init('targetTable', {}, {
									onChange: (v) => {
										this.field.setValue('targetTable', v)
									},
								}
							)}
						>
							{PD_dataStructure[this.field.getValue('targetDatabase')] && PD_dataStructure[this.field.getValue('targetDatabase')].length > 0 ? (
									PD_dataStructure[this.field.getValue('targetDatabase')].map(item => (
										<Select.Option value={item} label={item} key={item}/>
									))
								) : null}
						</Select>
					</FormItem>
				</InfoContainer>

				<InfoContainer title="调度配置" id="dispatchConfig">
					<FormItem label="阻塞处理：" required>
						<Select
							readOnly={pageType === 'preview'}
							style={{ width: '50%' }}
							placeholder="请选择阻塞处理策略"
							{...init('executorBlockStrategy', {},
								{
									onChange: (v) => {
										this.field.setValue('executorBlockStrategy', v)
									},
								}
							)}
						>
							<Select.Option value="SERIAL_EXECUTION">单机串行</Select.Option>
							<Select.Option value="DISCARD_LATER">丢弃后续调度</Select.Option>
							<Select.Option value="COVER_EARLY">覆盖之前调度</Select.Option>
						</Select>
					</FormItem>

					<FormItem label="CRON表达式（调度周期）：" required>
						<Input placeholder="请获取CRON表达式" style={{ width: '40%' }} readOnly {...init('jobCron')}/>
						<Button type="secondary" style={{ width: '10%' }} onClick={() => { this.setState({ cronGeneratorVisible: true }) }}>获取CRON</Button>
						<CronGenerator
							// isPreview
							initCron={this.field.getValue('jobCron')}
							dialogVisible={cronGeneratorVisible}
							onClose={() => {
								this.setState({ cronGeneratorVisible: false })
							}}
							onConfirm={(val) => {
								this.field.setValue('jobCron', val)
							}}
						/>
					</FormItem>

					<FormItem
						label="失败重试次数："
						required
					>
						<NumberPicker
							style={{ width: '50%' }}
							placeholder="请输入失败重试次数"
							{...init('executorFailRetryCount')}
						/>
					</FormItem>

					<FormItem
						label="任务执行超时时间（秒）:"
						required
					>
						<NumberPicker
							style={{ width: '50%' }}
							placeholder="请输入任务执行超时时间（秒）"
							{...init('executorTimeout')}
						/>
					</FormItem>
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
