/*
 * @Author: ShenLing
 * @Date: 2021-01-06 10:13:58
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-07 15:14:18
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
	DatePicker,
	Tag
} from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import IconFont from '@/components/IconFont'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { leaveAndSave, hasStorageAndInit } from '@/utils/common'
import { ApiRegisterAction, ApiExamineAction } from '@/actions'
import moment from 'moment'
import colorStyle from '@/themeStyle/themeStyle.scss'
import DeleteNotice from '@/components/DeleteNotice'

// const { getInfo } = ApiCommonAction
const { getSampleData } = ApiRegisterAction
const { getInfo, passSubscription, rejectSubscription } = ApiExamineAction

const FormItem = Form.Item

export default class ApiExminePreviewService extends React.Component {
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
	}

	async componentDidMount () {
		// 仅为preview模式，故初始化时仅需查询详情
		this.setState({ detailLoading: true }, async () => {
			// TODO: userUuid需自动获取
			console.log(this.props.subscriptionUuid)

			let result = await getInfo(this.props.subscriptionUuid, { apiUuid: this.props.initFieldUuid })
			console.log(result)
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
					this.field.setValue('urlWithParam', result.result.urlWithParam)
					this.field.setValue('accessToken', result.result.accessToken)
					this.field.setValue('classificationUuids', result.result.classificationUuids)
					this.field.setValue('classificationName', result.result.dmpCatalogueDirectoryVos[0] ? result.result.dmpCatalogueDirectoryVos[0].name : '')
					this.field.setValue('apiInputTable', result.result.apiInputList)
					this.field.setValue('apiOutputTable', result.result.apiOutputList)
					this.field.setValue('tokenExpireTime', moment(result.result.tokenExpireTime).format('YYYY-MM-DD'))
					this.field.setValue('status', result.result.status)
					this.field.setValue('orgAndDep', result.result.orgAndDep)
					this.field.setValue('userName', result.result.userName)
					this.onSendRequest()

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

	// 发送请求
	onSendRequest = () => {
		this.field.validate((errors, values) => {
			if (errors) return
			let param = {
				type: 'Mysql',
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
		})
	}

		/**
  * @name: 通过订阅
  * @param {*} subscriptionuuids
  * @return {*}
  */
	passSubscription = async (subscriptionuuids) => {
		let param = {
			subscriptionuuids: subscriptionuuids
		}
		const response = await passSubscription(param)
		if (response) {
			if (response.code === 10000) {
				Message.success('API申请已成功通过')
				this.setState({
					tableLoading: true,
					currentPage: 1,
				})
				this.props.onBack()
			}
			else {
				Message.error(response.msg || '通过API订阅申请失败')
			}
		}
		else {
			Message.error('通过API订阅申请失败')
		}
	}


		/**
  * @name: 驳回订阅
  * @param {*} subscriptionuuids
  * @return {*}
  */
	rejectSubscription = async (subscriptionuuids) => {
		let param = {
			subscriptionuuids: subscriptionuuids
		}
		const response = await rejectSubscription(param)
		if (response) {
			if (response.code === 10000) {
				Message.success('API申请已成功驳回')
				this.setState({
					tableLoading: true,
					currentPage: 1,
				})
				this.props.onBack()
			}
			else {
				Message.error(response.msg || '驳回API订阅申请失败')
			}
		}
		else {
			Message.error('驳回API订阅申请失败')
		}
	}

	render () {
		const { onBack, subscriptionUuid } = this.props

		const { submitLoading, requestLoading, requestResultSample, detailLoading } = this.state

		const init = this.field.init

		const disabledDate = (date) => {
			const currentDate = moment()
			return date.valueOf() <= currentDate.valueOf()
		}

		const switchSubscriptionStatus = (status) => {
			let label = '未订阅'
			let labelColor = colorStyle.status_disable_color
			let bgColor = colorStyle.status_bg_disable_color

			switch (status) {
				case 0: label = '审核中'; labelColor = colorStyle.status_progressing_color; bgColor = colorStyle.status_bg_progressing_color; break
				case 1: label = '已通过'; labelColor = colorStyle.status_success_color; bgColor = colorStyle.status_bg_success_color; break
				case 2: label = '已驳回'; labelColor = colorStyle.status_error_color; bgColor = colorStyle.status_bg_error_color; break
				default: break
			}

			return (
				<Tag
					type="normal"
					style={{
						color: labelColor,
						backgroundColor: bgColor,
						borderColor: bgColor
					}}
				>
					{label}
				</Tag>
			)
		}

		const renderFieldIsRequired = (value) => {
			switch (value) {
				case 0: return '否'
				case 1: return '是'
				default: return '否'
			}
		}

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<Loading fullScreen visible={detailLoading}/>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="API名称：" required>
						<Input
							readOnly
							maxLength={50}
							hasLimitHint
							placeholder="请输入API名称"
							{...init('nameChi', {
								rules: [
									{
										required: true,
										message: 'API名称不能为空',
									}
								],
							})}
						/>
					</FormItem>

					<FormItem label="API描述：" required>
						<Input
							readOnly
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
					<Input
							readOnly
							style={{ width: '33%' }}
							placeholder="请选择数据API目录"
							{...init('classificationName')}
							/>
					</FormItem>

					<FormItem label="数据表实例：" required>
					<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
							<Input
								readOnly
								style={{ width: '33%' }}
								{...init('datasourceName')}
								innerBefore={<span style={{ margin: 8 }}>数据源：</span>}
							/>
							<Input
								readOnly
								style={{ width: '33%' }}
								{...init('databaseName')}
								innerBefore={<span style={{ margin: 8 }}>数据库：</span>}
							/>
							<Input
								readOnly
								style={{ width: '33%' }}
								{...init('tableName')}
								innerBefore={<span style={{ margin: 8 }}>数据表：</span>}
							/>
						</div>
					</FormItem>

					<FormItem label="URL：" required>
						<Input
							style={{ width: '100%' }}
							readOnly
							{...init('url')}
						/>
					</FormItem>

					<FormItem label="API到期时间：" required>
						<DatePicker
							style={{ width: '33%' }}
							disabled
							disabledDate={disabledDate}
							{...init('tokenExpireTime')}
						/>
					</FormItem>

					<FormItem label="申请人信息：" required>
					{/* <div style={{ width: '100%', display: 'flex' }}> */}
							<Input
								readOnly
								style={{ width: '100%', marginBottom: 10 }}
								{...init('orgAndDep')}
								innerBefore={<span style={{ margin: 8 }}>机构/部门：</span>}
							/>
							<Input
								readOnly
								style={{ width: '100%' }}
								{...init('userName')}
								innerBefore={<span style={{ margin: 8 }}>姓名：</span>}
							/>
						{/* </div> */}
					</FormItem>

					<FormItem label="API当前审核状态：" required>
						{switchSubscriptionStatus(this.field.getValue('status'))}
					</FormItem>

				</InfoContainer>

				<InfoContainer title="输入字段配置" id="inputParamSetting">
					<Table dataSource={this.field.getValue('apiInputTable')}>
						<Table.Column dataIndex="fieldName" title="字段名称" align="center" width={100}/>
						<Table.Column dataIndex="fieldType" title="字段类型" align="center" width={100}/>
						<Table.Column dataIndex="fieldValue" title="字段值" align="center" width={100}/>
						<Table.Column dataIndex="fieldIsRequired" title="是否必填" align="center" width={50} cell={(value) => renderFieldIsRequired(value)}/>
						<Table.Column dataIndex="fieldDescribe" title="注释" align="center" width={150}/>
					</Table>

				</InfoContainer>

				<InfoContainer title="返回字段配置" id="returnParamSetting">
					<Table dataSource={this.field.getValue('apiOutputTable')}>
						<Table.Column dataIndex="fieldName" title="字段名称" align="center" width={100}/>
						<Table.Column dataIndex="fieldType" title="字段类型" align="center" width={100}/>
						<Table.Column dataIndex="fieldDescribe" title="注释" align="center" width={150}/>
					</Table>
				</InfoContainer>

				<InfoContainer title="API请求样例" id="requestSample">
					<FormItem label="" required>
						<Input
							style={{ width: 'calc(100% - 160px)' }}
							addonTextBefore="GET"
							readOnly
							{...init('urlWithParam')}
						/>
						<CopyToClipboard text={this.field.getValue('requestUrl')} onCopy={() => Message.success('已复制该URL至粘贴板')}>
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


				<div id="operationBtns">
					<FormItem wrapperCol={{ offset: 11 }}>
						{this.field.getValue('status') === 0 ? (
							// 通过 - 审核中
							<Button
								loading={submitLoading}
								type="secondary"
								onClick={() => {
									DeleteNotice.show({
										message: '确认通过该申请',
										onCancel: () => {
											DeleteNotice.close()
										},
										onConfirm: () => {
											this.passSubscription([subscriptionUuid])
											DeleteNotice.close()
										}
									})
								}}
								style={{ marginRight: 16 }}
							>
							通过
							</Button>
						) : null}

						{this.field.getValue('status') === 0 || this.field.getValue('status') === 1 ? (
							// 驳回 - 审核中、已通过
							<Button
								loading={submitLoading}
								type="normal"
								warning
								onClick={() => {
									DeleteNotice.show({
										message: '确认驳回该申请',
										onCancel: () => {
											DeleteNotice.close()
										},
										onConfirm: () => {
											this.rejectSubscription([subscriptionUuid])
											DeleteNotice.close()
										}
									})
								}}
								style={{ marginRight: 16 }}
							>
							驳回
							</Button>
						) : null}


							<Button onClick={() => onBack()}>取消操作</Button>
						</FormItem>
					</div>

			</Form>
		)
	}
}
