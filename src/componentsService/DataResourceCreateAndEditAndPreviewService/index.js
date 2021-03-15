/*
 * @Author: ShenLing
 * @Date: 2020-10-20 14:51:38
 * @LastEditors: Shenling
 * @LastEditTime: 2020-12-03 11:12:24
 */

import React from 'react'
import {
	Form,
	Field,
	Input,
	TreeSelect,
	Select,
	Button,
	Message,
	Balloon
} from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import { leaveAndSave, hasStorageAndInit } from 'utils/common'

import { DataResourceAction, DataStorageAction, CatalogueAction } from '@/actions'

const { getTreeRQ } = CatalogueAction
const { getStructure } = DataStorageAction
const { add, query, update } = DataResourceAction

const FormItem = Form.Item
const TreeNode = TreeSelect.Node
const Tooltip = Balloon.Tooltip

export default class DataResourceCreateAndEditAndPreviewService extends React.Component {
	field = new Field(this)
	state = {
		submitLoading: false,
		treeList: [],
		dataStructure: {}
	}

	async componentDidMount () {

		// 获取目录树拉取列表
		this.getCatalogue()

		const initData = hasStorageAndInit()
		// 存在当前修改
		if (initData) {
			this.field.setValues(initData)
		}
		else {
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				// 如果没有初始值、并且是编辑时，获取编辑详情
				let result = await query({ uuid: this.props.initFieldUuid })
				console.log(result)
				if (result) {
					if (result.code === 10000) {
						// 切记不能使用setValues，因为它会把删除状态也给传进去了
						this.field.setValue('uuid', result.result.uuid)
						this.field.setValue('name', result.result.name)
						this.field.setValue('memo', result.result.memo)
						this.field.setValue('type', result.result.type)
						this.field.setValue('tbDbName', result.result.tbDbName)
						this.field.setValue('tbName', result.result.tbName)
						this.field.setValue('username', result.result.username)
						this.field.setValue('password', result.result.password)
						this.field.setValue('defaultDatabase', result.result.defaultDatabase)
						this.field.setValue(
							'classification',
							result.result.catalogueList.length > 0 && result.result.catalogueList[0].catalogueDirectoryUuid ? result.result.catalogueList[0].catalogueDirectoryUuid : null
						)

						this.getStructure(result.result.type)

					} else {
						Message.error(
							(result && result.result && result.result.msg) || '详情获取失败'
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

	/**
  * @name: 查询数据库表结构
  * @param {String} type TSD时序数据库、PD感知数据、DWD数仓数据
  * @return {*}
  */
	getStructure = async (type) => {
		const res = await getStructure(type)
		if (res) {
			if (res.code === 10000) {
				this.setState({ dataStructure: res.result })
			}
			else {
				Message.error(res.msg || '查询此类数据库表结构失败！')
			}
		}
		else {
			Message.error('查询此类数据库表结构失败！')
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
				if (this.props.pageType === 'create') this.addResource(values)
				else if (this.props.pageType === 'edit') this.updateResource(values)
			})
		})
	}

	/**
  * @name: 新增
  * @param {Object} values 表单数据
  * @return {*}
  */
	addResource = async (values) => {
		let param = {
			name: values.name,
			memo: values.memo,
			classificationUuids: values.classification ? [values.classification] : [],
			tbDbName: values.tbDbName,
			tbName: values.tbName,
			type: values.type
		}
		const res = await add(param)
		if (res) {
			if (res.code === 10000) {
				Message.success('新增数据资源成功')
				this.props.onBack()
			}
			else {
				Message.error(res.msg || '新增数据资源失败！')
			}
		}
		else {
			Message.error('新增数据资源失败！')
		}
		this.setState({ submitLoading: false })
	}

	/**
  * @name: 编辑
  * @param {Object} values 表单数据
  * @return {*}
  */
	updateResource = async (values) => {
		let param = {
			uuid: values.uuid,
			name: values.name,
			memo: values.memo,
			classificationUuids: values.classification ? [values.classification] : [],
			tbDbName: values.tbDbName,
			tbName: values.tbName,
			type: values.type
		}
		const res = await update(param)
		if (res) {
			if (res.code === 10000) {
				Message.success('编辑数据资源成功')
				this.props.onBack()
			}
			else {
				Message.error(res.msg || '编辑数据资源失败！')
			}
		}
		else {
			Message.error('编辑数据资源失败！')
		}
		this.setState({ submitLoading: false })
	}

	render () {
		const { pageType, onBack } = this.props

		const { submitLoading, treeList, dataStructure } = this.state

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

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="数据资源名称：" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={50}
							hasLimitHint
							placeholder="请输入数据资源名称"
							{...init('name', {
								rules: [
									{
										required: true,
										message: '数据资源名称不能为空',
									},
								],
							})}
						/>
					</FormItem>
					<FormItem label="数据资源描述" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={200}
							hasLimitHint
							placeholder="请输入数据资源描述"
							{...init('memo', {
								rules: [
									{
										required: true,
										message: '数据资源描述不能为空',
									},
								],
							})}
						/>
					</FormItem>
					<FormItem label="数据资源编目">
						<TreeSelect
							hasClear
							style={{ width: '100%' }}{...init('classification')}
							disabled={pageType === 'preview'}
						>
							{loop(treeList)}
						</TreeSelect>
					</FormItem>
				</InfoContainer>

				<InfoContainer title="数据资源配置" id="dataResourceSelect">
					<FormItem label="选择数据资源类型：" required>
						<Select
							disabled={pageType === 'preview'}
							style={{ width: '70%' }}
							{...init('type', {
								rules: [
									{
										required: true,
										message: '数据资源类型不能为空',
									},
								],
							}, {
								onChange: (type) => {
									this.getStructure(type)
									this.field.setValue('type', type)
									this.field.setValue('tbDbName', '')
									this.field.setValue('tbName', '')
								}
							})}
						>
							<Select.Option label="时序数据" value="TSD"/>
							<Select.Option label="感知数据" value="PD"/>
							<Select.Option label="数仓数据" value="DWD"/>
						</Select>
					</FormItem>
					<FormItem label="选择数据库：" required>
						<Select
							disabled={pageType === 'preview'}
							style={{ width: '70%' }}
							dataSource={Object.keys(dataStructure)}
							{...init('tbDbName', {
								rules: [
									{
										required: true,
										message: '数据库不能为空',
									},
								],
							}, {
									onChange: (v) => {
									this.field.setValue('tbDbName', v)
									this.field.setValue('tbName', '')
								}
							})}

						/>
					</FormItem>
					<FormItem label="选择数据表：" required>
						<Select
							disabled={pageType === 'preview'}
							style={{ width: '70%' }}
							dataSource={dataStructure[this.field.getValue('tbDbName')]}
							{...init('tbName', {
								rules: [
									{
										required: true,
										message: '数据表不能为空',
									},
								],
							}, {
								onChange: (v) => {
								this.field.setValue('tbName', v)
							}
						})}
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
