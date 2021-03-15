import React from 'react'
import { Form, Field, Input, Select, Button, Table, Message } from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import AdvanceBtn from '@/components/AdvanceBtn'
import PropTypes from 'prop-types' // 类型检查
import IconFont from '@/components/IconFont'
import UploadFormItem from '@/components/UploadFormItem'
import {
	leaveAndSave,
	hasStorageAndInit,
	getQueryItemValue,
} from 'utils/common'
import { BusinessManageAction, FileAction } from '@/actions'
import { IpAddress } from '@/utils/validationFn'
import colorStyle from '@/themeStyle/themeStyle.scss'
const { addViewRQ, queryViewRQ, updateViewRQ } = BusinessManageAction

const { uploadFileRQ } = FileAction

const FormItem = Form.Item

export default class ViewsPreviewAndCreateAndEditService extends React.Component {
	field = new Field(this)

	state = {
		viewInfoData: [],
		fileList: [],
		newFileList: [],
		originalFileList: [],
	}

	componentDidMount () {
		const initData = hasStorageAndInit()
		if (initData) {
			this.field.setValues(initData)
		} else {
			console.log(this.props)
			// 仅限编辑和查看模式下需要查询详情内容并填入field
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				this.initFieldList(this.props.initFieldUuid)
			} else {
				this.field.setValue(
					'informationSystemsUuid',
					getQueryItemValue(this.props.location.search, 'title')
				)
			}
		}
	}

	componentWillUnmount () {
		const pathObj = this.props.location
		const storageName = `${pathObj.pathname}${pathObj.search}`
		leaveAndSave(storageName, this.field.getValues())
		this.setState = () => {
			return
		}
	}

	initFieldList = async (uuid) => {
		const response = await queryViewRQ({ uuid: uuid })
		if (response) {
			if (response.code === 10000) {
				this.field.setValue('uuid', response.result.uuid)
				this.field.setValue('name', response.result.name)
				this.field.setValue('memo', response.result.memo)
				this.field.setValue('urlAddress', response.result.urlAddress)
				this.field.setValue('moduleName', response.result.moduleName)
				this.field.setValue('moduleName', response.result.moduleName)

				this.field.setValue(
					'informationSystemsUuid',
					getQueryItemValue(
						this.props.location.search,
						'informationSystemsName'
					)
				)

				// 因fileResult内容不存在时结果为null而非[],故需进行判断处理
				const fileList = response.result.fileResult
					? response.result.fileResult
					: []
				this.setState({
					originalFileList: JSON.parse(JSON.stringify(fileList)),
					fileList: JSON.parse(JSON.stringify(fileList)),
					viewInfoData: response.result.fields, // 字段信息
				})
			} else {
				Message.error(response.msg || '数据视图详情获取失败')
			}
		} else {
			Message.error('数据视图详情获取失败')
		}
	}

	// 恢复已上传文件列表
	onResetList = () => {
		this.setState({ fileList: this.state.originalFileList })
	}

	// 获取待上传新文件列表
	onGetNewFileList = (fileList) => {
		this.setState({ newFileList: fileList })
	}

	// 获取已上传文件调整后的列表
	onGetOldFileList = (fileList) => {
		this.setState({ fileList: fileList })
	}

	// 视图信息 - 删除操作栏渲染
	renderTableColumn = (type, value, index, record) => {
		const nameCell = (
			<Input
				style={{ width: '100%' }}
				value={record.name}
				maxLength={50}
				hasLimitHint
				placeholder="请输入字段名称（必填）"
				onChange={(val) => this.onChangeViewInfo(val, type, index, record)}
				isPreview={this.props.pageType === 'preview'}
			/>
		)

		const memoCell = (
			<Input
				style={{ width: '100%' }}
				value={record.memo}
				maxLength={200}
				hasLimitHint
				placeholder="请输入字段描述（选填）"
				isPreview={this.props.pageType === 'preview'}
				onChange={(val) => this.onChangeViewInfo(val, type, index, record)}
			/>
		)

		const operationCell = (
			<Button
				text
				style={{ color: colorStyle.btn_delete_color }}
				type="primary"
				onClick={() => this.onDeleteViewInfoData(index)}
			>
				删除
			</Button>
		)

		switch (type) {
			case 'name':
				return nameCell
			case 'memo':
				return memoCell
			case 'operation':
				return operationCell
			default:
				return ''
		}
	}

	// 输入视图字段信息
	onChangeViewInfo = (val, type, index, record) => {
		let newObj = record
		newObj[type] = val

		let dataList = this.state.viewInfoData
		dataList[index] = newObj
		this.setState({ viewInfoData: dataList })
	}

	// 添加视图字段信息
	onAddViewInfoData = () => {
		let data = this.state.viewInfoData
		if (data.length < 100) {
			data.push({ name: '', memo: '' })
			this.setState({ viewInfoData: data })
		} else {
			Message.error('最多添加100行数据')
		}
	}

	// 删除视图字段信息
	onDeleteViewInfoData = (index) => {
		let tempArr = this.state.viewInfoData
		tempArr.splice(index, 1)
		this.setState({ viewInfoData: tempArr })
	}

	// 确认提交
	onSubmit = () => {
		this.field.validate((errors, values) => {
			if (errors) return
			let newArrResult = this.clearEmptyObject(this.state.viewInfoData)
			if (newArrResult === 'error') return
			else {
				this.setState({ viewInfoData: newArrResult }, () => {
					if (this.props.pageType === 'create')
						this.addView(values, this.state.viewInfoData)
					if (this.props.pageType === 'edit')
						this.updateView(values, this.state.viewInfoData)
				})
			}
		})
	}

	// 上传文件
	uploadFile = (fileList) => {
		return new Promise((resolve) => {
			if (fileList.length > 0) {
				this.setState({ loading: true }, async () => {
					let result = []
					for (let i = 0; i < fileList.length; i++) {
						const file = fileList[i]
						try {
							let formData = new FormData()
							formData.append('file', file)
							let response = await uploadFileRQ(formData)
							if (response) {
								if (
									response.code === 10000 &&
									response.result &&
									response.result.fileUuid
								) {
									result.push(response.result.fileUuid)
								} else {
									this.setState({ loading: false }, () => {
										Message.error(response.msg || `${file.name}：文件上传失败`)
									})
								}
							}
						} catch (error) {
							this.setState({ loading: false }, () => {
								Message.error('上传文件异常')
							})
						}
					}
					resolve(result)
				})
			} else {
				resolve([])
			}
		})
	}

	// 新增视图
	addView = async (values, viewInfoArr) => {
		// 1. 上传文件，获得文件uuids
		let uploadFileResult = await this.uploadFile(this.state.newFileList)

		// 2. 处理上传参数
		let param = {
			informationSystemsUuid: getQueryItemValue(
				this.props.location.search,
				'informationSystemsUuid'
			),
			name: values.name,
			memo: values.memo,
			urlAddress: values.urlAddress,
			moduleName: values.moduleName,
			fileUuids: uploadFileResult,
			fields: viewInfoArr,
		}

		// 3. 提交上传
		const response = await addViewRQ(param)
		if (response) {
			if (response.code === 10000) {
				Message.success('新增成功')
				this.setState({ loading: false }, () => {
					const _search = this.props.location.search
					let businessUuid = getQueryItemValue(_search, 'businessUuid')
					let title = getQueryItemValue(_search, 'title')
					let infoSysUuid = getQueryItemValue(_search, 'informationSystemsUuid')
					let businessName = getQueryItemValue(_search, 'businessName')
					this.props.onBack(businessUuid, title, infoSysUuid, businessName)
				})
			} else {
				this.setState({ loading: false }, () => {
					Message.error(response.msg || '新增失败')
				})
			}
		} else {
			this.setState({ loading: false }, () => {
				Message.error('新增失败')
			})
		}
	}

	// 编辑视图
	updateView = async (values, viewInfoArr) => {
		// 1. 上传文件，获得文件uuids
		let uploadFileResult = await this.uploadFile(this.state.newFileList)
		// 将已有文件列表uuid添加进数组中
		if (this.state.fileList.length > 0) {
			this.state.fileList.map((item) => {
				uploadFileResult.push(item.fileUuid)
			})
		}

		// 2. 处理上传参数
		let param = {
			informationSystemsUuid: getQueryItemValue(
				this.props.location.search,
				'informationSystemsUuid'
			),
			uuid: values.uuid,
			name: values.name,
			memo: values.memo,
			urlAddress: values.urlAddress,
			moduleName: values.moduleName,
			fileUuids: uploadFileResult,
			fields: viewInfoArr,
		}

		// 3. 提交上传
		const response = await updateViewRQ(param)
		if (response) {
			if (response.code === 10000) {
				Message.success('编辑成功')
				this.setState({ loading: false }, () => {
					const _search = this.props.location.search
					let businessUuid = getQueryItemValue(_search, 'businessUuid')
					let title = getQueryItemValue(_search, 'informationSystemsName')
					let infoSysUuid = getQueryItemValue(_search, 'informationSystemsUuid')
					let businessName = getQueryItemValue(_search, 'businessName')
					this.props.onBack(businessUuid, title, infoSysUuid, businessName)
				})
			} else {
				this.setState({ loading: false }, () => {
					Message.error(response.msg || '编辑失败')
				})
			}
		} else {
			this.setState({ loading: false }, () => {
				Message.error('编辑失败')
			})
		}
	}

	// 清楚视图信息表格空值并做校验（名称不能为空）
	clearEmptyObject = (arr) => {
		if (arr && arr.length > 0) {
			let newArr = []
			let errorMsg = null
			arr.map((item) => {
				if (item.name !== '') {
					newArr.push(item)
				} else if (item.name === '' && item.memo !== '') {
					Message.warning('视图信息字段名称为必填项')
					errorMsg = 'error'
				}
			})
			if (errorMsg) return errorMsg
			else return newArr
		}
	}

	render () {
		const { pageType, displayAdvance, onBack, showAdvance } = this.props
		const { viewInfoData, fileList, newFileList, loading } = this.state

		const init = this.field.init

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="所属信息系统：" required>
						<Select
							style={{ width: '49%' }}
							placeholder="请选择所属信息系统"
							{...init('informationSystemsUuid')}
							dataSource={[]}
							disabled
						/>
					</FormItem>
					<FormItem label="数据视图名称：" required>
						<Input
							maxLength={50}
							hasLimitHint
							placeholder="请输入数据视图名称"
							{...init('name', {
								rules: [{ required: true, message: '数据视图名称不能为空' }],
							})}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="数据视图描述：">
						<Input
							maxLength={200}
							hasLimitHint
							placeholder="请输入数据视图描述"
							{...init('memo')}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="访问地址：">
						<Input
							maxLength={1000}
							hasLimitHint
							placeholder="请输入数据视图访问地址"
							{...init('urlAddress', {
								rules: [
									{
										validator: IpAddress,
									},
								],
							})}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="模块名称：">
						<Input
							maxLength={200}
							hasLimitHint
							placeholder="请输入数据视图模块名称"
							{...init('moduleName')}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
				</InfoContainer>

				<AdvanceBtn
					displayAdvance={displayAdvance}
					showAdvance={showAdvance}
					id="advanceBtn"
				/>

				<InfoContainer
					title="视图信息"
					id="viewInfo"
					style={{ display: !displayAdvance ? 'none' : '' }}
				>
					<Table dataSource={viewInfoData}>
						<Table.Column
							dataIndex="name"
							title="* 字段名称"
							align="center"
							width={150}
							cell={(value, index, record) =>
								this.renderTableColumn('name', value, index, record)
							}
						/>
						<Table.Column
							dataIndex="memo"
							title="字段描述"
							align="center"
							width={200}
							cell={(value, index, record) =>
								this.renderTableColumn('memo', value, index, record)
							}
						/>
						{pageType !== 'preview' ? (
							<Table.Column
								title="操作"
								align="center"
								width={50}
								cell={(value, index, record) =>
									this.renderTableColumn('operation', value, index, record)
								}
							/>
						) : null}
					</Table>
					<Button
						text
						type="primary"
						onClick={this.onAddViewInfoData}
						style={{
							marginTop: 10,
							display: pageType === 'preview' ? 'none' : '',
						}}
					>
						<IconFont type="iconadd" size="small" />
						<span style={{ marginLeft: 5, fontWeight: 'bold' }}>添加</span>
					</Button>
				</InfoContainer>

				<InfoContainer
					title="附件"
					id="extraFiles"
					style={{ display: !displayAdvance ? 'none' : '' }}
				>
					<UploadFormItem
						pageType={pageType}
						currentFileList={fileList}
						newFileList={newFileList}
						uploadLimit={10}
						onResetList={this.onResetList}
						onGetNewFileList={this.onGetNewFileList}
						onGetOldFileList={this.onGetOldFileList}
					/>
				</InfoContainer>

				<div
					id="operationBtns"
					style={{ display: pageType === 'preview' ? 'none' : '' }}
				>
					<Button
						type="primary"
						style={{ marginRight: 10 }}
						onClick={this.onSubmit}
						loading={loading}
					>
						确认
					</Button>
					<Button type="secondary" onClick={onBack}>
						取消
					</Button>
				</div>
			</Form>
		)
	}
}

// props默认值指定
ViewsPreviewAndCreateAndEditService.defaultProps = {
	pageType: 'create',
	initFieldUuid: '',
	businessCatalogChangeDisable: false,
	displayAdvance: false,
}

ViewsPreviewAndCreateAndEditService.propTypes = {
	pageType: PropTypes.string, // 页面类型 - 新建业务：create/编辑业务：edit/查看业务：preview
	initFieldUuid: PropTypes.string, // 编辑业务 - 初始化表单数据的业务uuid
	onCancel: PropTypes.func, // 取消按钮 - 返回上一页面function
	businessCatalogChangeDisable: PropTypes.bool, // 所属业务不可选
	showAdvance: PropTypes.func, // 高级选项按钮反馈，同父页面统一
	displayAdvance: PropTypes.bool, // 高级选项内容是否展开
}
