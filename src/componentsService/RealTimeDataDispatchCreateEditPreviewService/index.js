import React from 'react'
import {
	Form,
	Field,
	Input,
	NumberPicker,
	Select,
	Button,
	Message,
	Table,
	Radio
} from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import IconFont from '@/components/IconFont'
import { leaveAndSave, hasStorageAndInit } from 'utils/common'
import { DataStorageAction, RealTimeDataDispatchAction } from '@/actions'
import './index.scss'
import { NoChinese } from '@/utils/validationFn'
import colorStyle from '@/themeStyle/themeStyle.scss'

const { getStructure } = DataStorageAction
const { addJob, updateJob, queryJob } = RealTimeDataDispatchAction

const FormItem = Form.Item

export default class RealTimeDataDispatchCreateEditPreviewService extends React.Component {
	field = new Field(this)
	state = {
		submitLoading: false,
		cronGeneratorVisible: false,
		TSD_dataStructure: {},
		fieldArray: [],
		tagArray: [],
		fieldAlert: false,

		dataStructure: {},
		tableParam: [],
		timeMap: [],
		tagMapList: [],
		fieldMapList: [],
	}

	async componentDidMount () {
		const initData = hasStorageAndInit()

		if (initData) {
			this.field.setValues(initData)
		} else {
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				// 如果没有初始值、并且是编辑时，获取编辑详情
				let res = await queryJob({ uuid: this.props.initFieldUuid })
				console.log(res)
				if (res.code === 10000) {
					// 切记不能使用setValues，因为它会把删除状态也给传进去了
					this.field.setValue('uuid', res.result.uuid)
					this.field.setValue('name', res.result.name)
					this.field.setValue('memo', res.result.memo)
					this.field.setValue('topics', res.result.topics)
					this.field.setValue('target', res.result.target)
					this.getDataBaseList(res.result.target)

					this.field.setValue('db', res.result.db)
					this.field.setValue('tableType', res.result.tableType)
					this.field.setValue('tablename', res.result.tablename)

					this.field.setValue('tablePrefix', res.result.tablePrefix)

					this.field.setValue('timePattern', res.result.timePattern)
					this.field.setValue('timeField', res.result.timeField)

					this.setState({
						tableParam: res.result.tableParam,
						timeMap: res.result.timeMap,
						fieldMapList: res.result.fieldMapList,
						tagMapList: res.result.tagMapList,
					})
				}
			}
			else {
				// 初始化数据结构
				this.field.setValue('tablePrefix', '')
				this.field.setValue('target', 'TSD')
				this.getDataBaseList('TSD')

				// 初始化数据表选项
				this.field.setValue('tableType', 3)

				this.setState({
					tableParam: [''],
					timeMap: [{ source: [''], type: '' }],
					tagMapList: [{ source: [''], target: '', type: '' }],
					fieldMapList: [{ source: [''], target: '', type: '' }],
				})
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
	 * @return {*}
	 */
	getDataBaseList = async (type) => {
		let res = await getStructure(type)
		if (res && res.code === 10000) {
			this.setState({
				dataStructure: res.result,
			})
		}
	}

	submitHandle = () => {
		this.field.validate((errors, values) => {
			this.setState({
				tableParam: this.sliceEmptyDataArry(this.state.tableParam, 'tableParam'),
				timeMap: this.sliceEmptyDataArry(this.state.timeMap, 'timeMap'),
				tagMapList: this.sliceEmptyDataArry(this.state.tagMapList, 'tagMapList'),
				fieldMapList:  this.sliceEmptyDataArry(this.state.fieldMapList, 'fieldMapList')
			}, () => {
					// 校验time/tag/field列表至少存在一个值
					if (
						this.validateNotEmptyArray(this.state.tableParam, '表名参数') ||
						this.validateNotEmptyArray(this.state.timeMap, '时间') ||
						this.validateNotEmptyArray(this.state.tagMapList, 'TAG') ||
						this.validateNotEmptyArray(this.state.fieldMapList, 'FIELD')) {
						return
					}
					else if (errors) {
						return
					}
					else {
						let params = {
							name: values.name,
							memo: values.memo,
							topics: values.topics,
							target: values.target,
							db: values.db,
							tableType: values.tableType,
							tablename: values.tablename,
							tablePrefix: values.tablePrefix ?? '',
							tableParam: this.state.tableParam[0] === '' ? [] : this.state.tableParam,
							fieldMapList: this.state.fieldMapList,
							timeMap: this.state.timeMap,
							tagMapList: this.state.tagMapList
						}

						if (this.props.pageType !== 'create') params.uuid = values.uuid

						this.setState({ submitLoading: true }, () => {
							if (this.props.pageType === 'create') this.addJob(params)
							else if (this.props.pageType === 'edit') this.updateJob(params)
						})
					}
			})
		})
	}

	// 新建任务请求
	addJob = async (params) => {
		let res = await addJob(params)
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
	updateJob = async (params) => {
		let res = await updateJob(params)
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

	/**
  * @name: 校验非空数组
  * @param {Array} data
  * @return {Boolean}
  */
	validateNotEmptyArray = (data, name) => {
		if (data && data.length > 0) {
			let flag = true
			let keys = Object.keys(data[0])
			if (keys.length > 0) {
				data.map(item => {
					keys.map(keyItem => {
						if (JSON.stringify(item[keyItem]) === '""' || JSON.stringify(item[keyItem]) === '[""]') {
							Message.error(name + '字段列表中的' + switchKeyName(keyItem) + '不能为空')
							flag = false
						}
					})
				})
			}
			else {
				if (JSON.stringify(data) === '[""]') {
					Message.error(name + '不能为空')
					flag = false
				}
			}
			return !flag
		}
		else {
			Message.error(name + '字段列表至少包含一条数据')
			return true
		}

		function switchKeyName (key) {
			switch (key) {
				case 'source': return '来源字段'
				case 'target': return '目标字段'
				case 'type': return '字段类型'
				default: return key
			}
		}
	}

	/**
  * @name: 将数组中空值进行清除
  * @param {Array} data
  * @return {Array}
  */
	sliceEmptyDataArry = (data, type) => {
		let result = []
		if (data && data.length > 0) {
			data.map((item) => {
				let keys = Object.keys(item)
				if (keys.length > 0) {
					let emptyCount = 0
					keys.map(keyItem => {
						if (JSON.stringify(item[keyItem]) === '""' || JSON.stringify(item[keyItem]) === '[""]') {
							emptyCount ++
						}
						if (keyItem === 'source') {
							item.source.map((sourceItem, sourceIndex) => {
								if (sourceItem === '' && sourceIndex !== 0) {
									item.source.splice(sourceIndex, 1)
								}
							})
						}
					})
					if (emptyCount !== keys.length) {
						result.push(item)
					}
				}
				else { // tableParam
					if (item !== '') result.push(item)
				}
			})
		}

		if (result.length === 0 && type === 'tableParam') {
			result = ['']
		}
		if (result.length === 0 && type === 'timeMap') {
			result = [{ source: [''], type: '' }]
		}

		return result
	}

	/**
  * @name: 层级字段输入渲染 - 最多三层结构
  * @param {*} data
  * @param {*} type
  * @param {*} rowIndex
  * @param {*} tableData
  * @return {*}
  */
	renderAttributes = (data, type, rowIndex, tableData) =>
		data.map((item, index) => {
			return (
				<div style={{ width: '100%', display: 'flex', alignItems: 'center' }} key={index}>
					<Input
						style={{
							width: index === 0 ? '85%' : index === 1 ? '80%' : '75%',
							marginBottom: '5px',
							marginLeft: index === 0 ? '0' : index === 1 ? '5%' : '10%',
						}}
						value={item}
						onChange={(v) => {
							let dataArrTemp = []
							if (type === 'tableParam') {
								dataArrTemp = data
								dataArrTemp[index] = v
							}
							else {
								dataArrTemp = tableData
								dataArrTemp[rowIndex]['source'][index] = v
							}
							this.setState({
								tableParam: type === 'tableParam' ? dataArrTemp : this.state.tableParam,
								timeMap: type === 'timeMap' ? dataArrTemp : this.state.timeMap,
								tagMapList: type === 'tagMapList' ? dataArrTemp : this.state.tagMapList,
								fieldMapList: type === 'fieldMapList' ? dataArrTemp : this.state.fieldMapList,
							})
						}}
					/>
					<div>
						<Button
							text
							type="primary"
							style={{
								margin: '0 5px',
								color: data[index + 1] !== undefined || index === 2 || data[index] === '' ? colorStyle.btn_disable_color : colorStyle.btn_edit_color
							}}
							title="增加子节点"
							disabled={data[index + 1] !== undefined || index === 2 || data[index] === ''}
							onClick={() => {
								let dataArrTemp = []
								if (type === 'tableParam') {
									dataArrTemp = data
									dataArrTemp.push('')
								}
								else{
									dataArrTemp = tableData
									dataArrTemp[rowIndex]['source'].push('')
								}
								this.setState({
									tableParam: type === 'tableParam' ? dataArrTemp : this.state.tableParam,
									timeMap: type === 'timeMap' ? dataArrTemp : this.state.timeMap,
									tagMapList: type === 'tagMapList' ? dataArrTemp : this.state.tagMapList,
									fieldMapList: type === 'fieldMapList' ? dataArrTemp : this.state.fieldMapList,
								})
							}}
						>
							<IconFont type="iconcatalogue_add" size="medium" />
						</Button>
						<Button
							text
							type="primary"
							style={{ color: index !== 0 ? colorStyle.btn_delete_color : colorStyle.btn_disable_color }}
							title="删除该节点及其子节点"
							disabled={index === 0}
							onClick={() => {
								let dataArrTemp = []
								if (type === 'tableParam') {
									dataArrTemp = data
									dataArrTemp.splice(index)
								}
								else{
									dataArrTemp = tableData
									dataArrTemp[rowIndex]['source'].splice(index)
								}
								this.setState({
									tableParam: type === 'tableParam' ? dataArrTemp : this.state.tableParam,
									timeMap: type === 'timeMap' ? dataArrTemp : this.state.timeMap,
									tagMapList: type === 'tagMapList' ? dataArrTemp : this.state.tagMapList,
									fieldMapList: type === 'fieldMapList' ? dataArrTemp : this.state.fieldMapList,
								})
							}}
						>
							<IconFont type="iconcatalogue_del" size="medium" />
						</Button>
					</div>
				</div>
			)
		})

	render () {
		const { pageType, onBack } = this.props

		const { submitLoading, dataStructure, timeMap, tagMapList, fieldMapList, tableParam } = this.state

		const init = this.field.init

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="实时数据调度任务名称：" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={50}
							hasLimitHint
							placeholder="请输入实时数据调度任务名称"
							{...init('name', {
								rules: [
									{
										required: true,
										message: '实时数据调度任务名称不能为空',
									},
								],
							})}
						/>
					</FormItem>
					<FormItem label="实时数据调度任务描述：" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={50}
							hasLimitHint
							placeholder="请输入实时数据调度任务描述"
							{...init('memo', {
								rules: [
									{
										required: true,
										message: '实时数据调度任务描述不能为空',
									},
								],
							})}
						/>
					</FormItem>
					<FormItem label="TOPIC：" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={50}
							hasLimitHint
							placeholder="请输入TOPIC"
							{...init('topics', {
								rules: [
									{
										required: true,
										message: 'TOPIC不能为空',
									},
								],
							})}
						/>
					</FormItem>
				</InfoContainer>

				<InfoContainer title="调度配置" id="dispatchConfig">
					<FormItem label="数据库：" required>
						<Radio.Group
							{...init('target', {}, {
								onChange: (v) => {
									this.getDataBaseList(v)
									this.field.setValue('target', v)
									this.field.setValue('db', '') // 数据库置空
									this.field.setValue('tablename', '') // 数据表置空
								}
							})}
						>
							<Radio value="TSD">时序数据库</Radio>
							<Radio value="DWD">数据仓库</Radio>
						</Radio.Group>
					</FormItem>

					<FormItem required>
						<Select
							readOnly={pageType === 'preview'}
							style={{ width: '50%' }}
							placeholder={'请选择数据库'}
							dataSource={Object.keys(dataStructure)}
								{...init('db', {
									rules: [
										{
											required: true,
											message: '数据库不能为空',
										},
									],
								},	{
										onChange: (v) => {
											this.field.setValue('db', v)
											this.field.setValue('tablename', '') // 数据表置空
										},
								})}
							/>
					</FormItem>

					<FormItem label="数据表：" required>
						<Radio.Group
								{...init('tableType', {}, {
									onChange: (v) => {
										this.field.setValue('tableType', v)
										this.field.setValue('tablename', '') // 数据表置空
										this.field.setValue('tablePrefix', '') // 表名前缀置空
										this.field.setValue('tablename', '') // 表名参数置空
										this.setState({ tableParam: v === 3 ? [''] : [] })
									}
								})}
							>
							<Radio value={1}>选择已有表</Radio>
							<Radio value={2}>自定义表名</Radio>
							<Radio value={3}>自定义格式</Radio>
						</Radio.Group>
					</FormItem>


					{this.field.getValue('tableType') === 1 ? (
						<FormItem required>
							<Select
								readOnly={pageType === 'preview'}
								style={{ width: '50%' }}
								placeholder="请选择数据表"
								dataSource={dataStructure[this.field.getValue('db')]}
								{...init('tablename', {
									rules: [
										{
											required: true,
											message: '数据表不能为空',
										},
									],
								})}
							/>
						</FormItem>
						) : null}

						{this.field.getValue('tableType') === 2 ? (
							<FormItem required>
								<Input
									readOnly={pageType === 'preview'}
									style={{ width: '50%' }}
									placeholder="请输入数据表名称"
									{...init('tablename', {
										rules: [
											{
												required: true,
												message: '数据表不能为空',
											},
											{
												validator: NoChinese
											}
										],
									})}
								/>
							</FormItem>
						) : null}

					{this.field.getValue('tableType') === 3 ? (
						<div style={{ width: '50%', border: `1px dashed ${colorStyle.btn_disable_color}`, padding: '10px', borderRadius: '4px' }}>
							<FormItem required label="表名前缀：">
									<Input
										style={{ width: '100%' }}
										readOnly={pageType === 'preview'}
										placeholder="请输入表名前缀"
										{...init('tablePrefix', {
											rules: [
												{
													required: true,
													message: '表名前缀不能为空',
												},
												{
													validator: NoChinese
												}
											],
										})}
									/>
							</FormItem>

							<FormItem required label="表名参数：">
								{this.renderAttributes(tableParam, 'tableParam')}
							</FormItem>
						</div>
					): null}
				</InfoContainer>

				<InfoContainer title="字段映射表" id="attribuitesConfig">
					{this.field.getValue('target') === 'TSD' ? (
						<FormItem label="时间字段" required>
							<Table dataSource={timeMap}>
								<Table.Column
									dataIndex="source"
									title="来源字段"
									cell={(value, index) => {
										return this.renderAttributes(value, 'timeMap', index, timeMap)
									}}
								/>
								<Table.Column
									dataIndex="type"
									title="字段类型"
									style={{ width: '28%' }}
									cell={(value, index) => {
										return (
											<Select
												style={{ width: '100%' }}
												placeholder="请选择字段类型"
												value={value}
												onChange={(v) => {
													let tempData = timeMap
													tempData[index].type = v
													this.setState({ timeMap: tempData })
												}}
											>
												<Select.Option label="yyyy-MM-dd HH:mm:ss" value="yyyy-MM-dd HH:mm:ss"/>
												<Select.Option label="timestamp" value="timestamp" />
											</Select>
										)
									}}
								/>
							</Table>
						</FormItem>
					) : null}

					{this.field.getValue('target') === 'TSD' ? (
						<FormItem label="TAG字段" required>
							<Table dataSource={tagMapList}>
								<Table.Column
									dataIndex="source"
									title="来源字段"
									cell={(value, index) => {
										return this.renderAttributes(value, 'tagMapList', index, tagMapList)
									}}
								/>
								<Table.Column
									dataIndex="target"
									title="目标字段"
									style={{ width: '20%' }}
									cell={(value, index) => {
										return (
											<Input
												style={{ width: '100%' }}
												placeholder="请输入目标字段"
												value={value}
												onChange={(v) => {
													let tempData = tagMapList
													tempData[index].target = v
													this.setState({ tagMapList: tempData })
												}}
											/>
										)
									}}
								/>
								<Table.Column
									dataIndex="type"
									title="字段类型"
									style={{ width: '20%' }}
									cell={(value, index) => {
										return (
											<Select
												style={{ width: '100%' }}
												placeholder="请选择字段类型"
												value={value}
												onChange={(v) => {
													let tempData = tagMapList
													tempData[index].type = v
													this.setState({ tagMapList: tempData })
												}}
											>
												<Select.Option label="integer" value="integer"/>
												<Select.Option label="double" value="double"/>
												<Select.Option label="string" value="string"/>
											</Select>
										)
									}}
								/>
								<Table.Column
									title="操作"
									style={{ width: '8%' }}
									align="center"
									cell={(value, index) => {
										return (
											<Button
												type="primary"
												style={{ backgroundColor: colorStyle.btn_delete_color }}
												onClick={() => {
													let dataTemp = tagMapList
													dataTemp.splice(index, 1)
													this.setState({ tagMapList: dataTemp })
												}}
											>
												删除
											</Button>
										)
									}}
								/>
							</Table>
							<Button
								text
								type="primary"
								style={{ marginTop: '10px' }}
								onClick={() => {
									let dataTemp = tagMapList
									dataTemp.push({ source: [''], target: '', type: '' })
									this.setState({ tagMapList: dataTemp })
								}}
							>
								<IconFont type="iconcatalogue_add" size="xs" style={{ marginRight: '5px' }}/>
								增加字段
							</Button>
						</FormItem>
					) : null}

						<FormItem label="FIELD字段" required>
							<Table dataSource={fieldMapList}>
								<Table.Column
									dataIndex="source"
									title="来源字段"
									cell={(value, index) => {
										return this.renderAttributes(value, 'fieldMapList', index, fieldMapList)
									}}
								/>
								<Table.Column
									dataIndex="target"
									title="目标字段"
									style={{ width: '20%' }}
									cell={(value, index) => {
										return (
											<Input
												style={{ width: '100%' }}
												placeholder="请输入目标字段"
												value={value}
												onChange={(v) => {
													let tempData = fieldMapList
													tempData[index].target = v
													this.setState({ fieldMapList: tempData })
												}}
											/>
										)
									}}
								/>
								<Table.Column
									dataIndex="type"
									title="字段类型"
									style={{ width: '20%' }}
									cell={(value, index) => {
										return (
											<Select
												style={{ width: '100%' }}
												placeholder="请选择字段类型"
												value={value}
												onChange={(v) => {
													let tempData = fieldMapList
													tempData[index].type = v
													this.setState({ fieldMapList: tempData })
												}}
											>
												<Select.Option label="integer" value="integer"/>
												<Select.Option label="double" value="double"/>
												<Select.Option label="string" value="string"/>
											</Select>
										)
									}}
								/>
								<Table.Column
									title="操作"
									style={{ width: '8%' }}
									align="center"
									cell={(value, index) => {
										return (
											<Button
												type="primary"
												style={{ backgroundColor: colorStyle.btn_delete_color }}
												onClick={() => {
													let dataTemp = fieldMapList
													dataTemp.splice(index, 1)
													this.setState({ fieldMapList: dataTemp })
												}}
											>
												删除
											</Button>
										)
									}}
								/>
							</Table>
							<Button
								text
								type="primary"
								style={{ marginTop: '10px' }}
								onClick={() => {
									let dataTemp = this.state.fieldMapList
									dataTemp.push({ source: [''], target: '', type: '' })
									this.setState({ fieldMapList: dataTemp })
								}}
							>
								<IconFont type="iconcatalogue_add" size="xs" style={{ marginRight: '5px' }}/>
								增加字段
							</Button>
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
