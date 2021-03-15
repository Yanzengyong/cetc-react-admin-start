import React from 'react'
import { Form, Field, Input, Select, Button, Message } from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import AdvanceBtn from '@/components/AdvanceBtn'
import PropTypes from 'prop-types' // 类型检查
import UploadFormItem from '@/components/UploadFormItem'
import {
	leaveAndSave,
	hasStorageAndInit,
	getQueryItemValue,
} from 'utils/common'
import { BusinessManageAction, FileAction } from '@/actions'

const {
	getInfoSysListRQ,
	addSchemaRQ,
	querySchemaRQ,
	updateSchemaRQ,
} = BusinessManageAction
const { uploadFileRQ } = FileAction

const FormItem = Form.Item

export default class SchemaPreviewAndCreateAndEditService extends React.Component {
	field = new Field(this)

	state = {
		originalFileList: [],
		fileList: [],
		newFileList: [],
		infoSysList: [],
		loading: false,
	}

	async componentDidMount () {
		const initData = hasStorageAndInit()
		console.log(initData)
		if (initData) {
			this.field.setValues(initData)
		} else {
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				this.initFieldList(this.props.initFieldUuid)
			}
			else {
				let list = await this.initInfoSysList(1)
				this.setState({ infoSysList: list })
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

	// 获取信息系统列表
	initInfoSysList = async (page, name) => {
		console.log()
		const _search = this.props.location.search
		const currentBusinessUuid = getQueryItemValue(_search, 'businessUuid')
		const response = await getInfoSysListRQ({
			isPage: true,
			name: name,
			page: page,
			businessUuid: currentBusinessUuid
		})
		if (response) {
			if (response.code === 10000) {
				return response.result.list
			} else {
				Message.error(response.msg || '信息系统列表获取失败')
				return []
			}
		} else {
			Message.error('信息系统列表获取失败')
			return []
		}
	}

	// 信息系统选择框-滚动至底部进行数据动态加载
	onScroll = async (e) => {
		const scrollHeight = e.target.scrollHeight // 内容总高度
		const clientHeight = e.target.clientHeight // 窗口高度
		const scrollTop = e.target.scrollTop //滚动高度

		if (scrollTop + clientHeight === scrollHeight) {
			// 到达底部
			const dataSource = this.state.infoSysList
			let page = parseInt(this.state.infoSysList.length / 10)
			let otherData = await this.initInfoSysList(page + 1)
			if (otherData && otherData.length > 0) {
				this.setState({ infoSysList: dataSource.concat(otherData) })
			}
		}
	}

	// 信息系统选择框 - 数据检索 - 延时+查询接口
	onSearchInfoSys = (value) => {
		if (this.searchTimeout) {
			clearTimeout(this.searchTimeout)
		}
		this.searchTimeout = setTimeout(async () => {
			let list = await this.initInfoSysList(1, value)
			this.setState({ infoSysList: list })
		}, 500)
	}

	// 初始化编辑/查看表单的内容
	initFieldList = async (uuid) => {
		const response = await querySchemaRQ({ uuid: uuid })
		if (response) {
			if (response.code === 10000) {
				this.field.setValue('uuid', response.result.uuid)
				this.field.setValue('name', response.result.name)
				this.field.setValue('businessUuid', response.result.businessUuid)
				this.field.setValue('memo', response.result.memo)
				this.field.setValue('informationSystemsUuid', response.result.informationSystemsUuid)

				// TODO: 待调试 - 使用详情接口查询到的信息系统名称查询列表，且显示为该名称
				let list = await this.initInfoSysList(1, response.result.informationSystemsName)
				this.setState({ infoSysList: list })

				// 因fileResult内容不存在时结果为null而非[],故需进行判断处理
				const fileList = response.result.fileResult
					? response.result.fileResult
					: []
				this.setState({
					originalFileList: JSON.parse(JSON.stringify(fileList)),
					fileList: JSON.parse(JSON.stringify(fileList)),
				})
			} else {
				Message.error(response.msg || '表单详情获取失败')
			}
		} else {
			Message.error('表单详情获取失败')
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

	// 确认提交
	onSubmit = () => {
		this.field.validate(async (errors, values) => {
			if (errors) return

			if (this.props.pageType === 'create') this.addSchema(values)
			else if (this.props.pageType === 'edit') this.updateSchema(values)
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

	// 新增表单
	addSchema = async (values) => {
		// 1. 上传文件，获得文件uuids
		let uploadFileResult = await this.uploadFile(this.state.newFileList)

		// 2. 整理传参
		const _search = this.props.location.search
		let param = {
			name: values.name,
			businessUuid: getQueryItemValue(_search, 'businessUuid'),
			memo: values.memo,
			informationSystemsUuid: values.informationSystemsUuid,
			fileUuid: uploadFileResult.length > 0 ? uploadFileResult[0] : '',
		}

		// 3. 提交
		const response = await addSchemaRQ(param)
		if (response) {
			if (response.code === 10000) {
				Message.success('新增成功')
				this.setState({ loading: false }, () => {
					this.onBackPage()
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

	// 编辑表单
	updateSchema = async (values) => {
		// 1. 上传文件，获得文件uuids
		let uploadFileResult = await this.uploadFile(this.state.newFileList)

		// 2. 整理传参
		const _search = this.props.location.search
		let param = {
			uuid: values.uuid,
			name: values.name,
			businessUuid: getQueryItemValue(_search, 'businessUuid'),
			memo: values.memo,
			informationSystemsUuid: values.informationSystemsUuid,
			fileUuid: uploadFileResult.length > 0 ? uploadFileResult[0] : '',
		}

		// 3. 提交
		const response = await updateSchemaRQ(param)
		if (response) {
			if (response.code === 10000) {
				Message.success('编辑成功')
				this.setState({ loading: false }, () => {
					this.onBackPage()
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

	// 返回上一页
	onBackPage = () => {
		const _search = this.props.location.search
		let backInfoUuid = getQueryItemValue(_search, 'businessUuid')
		let backInfoTitle = getQueryItemValue(_search, 'title')
		this.props.onBack(backInfoUuid, backInfoTitle)
	}

	render () {
		const { pageType, displayAdvance, showAdvance } = this.props

		const init = this.field.init

		const { infoSysList, newFileList, fileList, loading } = this.state

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="表单名称：" required>
						<Input
							trim
							maxLength={50}
							hasLimitHint
							placeholder="请输入表单名称"
							{...init('name', {
								rules: [{ required: true, message: '表单名称不能为空' }],
							})}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="表单描述：">
						<Input
							maxLength={200}
							hasLimitHint
							placeholder="请输入表单描述"
							{...init('memo')}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="表单来源：">
						<Select
							style={{ width: '49%' }}
							placeholder="请选择表单来源（信息系统）"
							{...init('informationSystemsUuid')}
							disabled={pageType === 'preview'}
							hasClear
							showSearch
							onSearch={this.onSearchInfoSys}
							menuProps={{ onScroll: this.onScroll }} // 下滑至底部进行数据动态加载
							autoHighlightFirstItem={false} // 避免数据动态加载时滚动回第一行
						>
							{infoSysList && infoSysList.length > 0
								? infoSysList.map((item) => {
										return (
											<Select.Option
												label={item.name}
												value={item.uuid}
												key={item.id}
											/>
										)
								  })
								: null}
						</Select>
					</FormItem>
				</InfoContainer>

				<AdvanceBtn
					displayAdvance={displayAdvance}
					showAdvance={showAdvance}
					id="advanceBtn"
				/>

				<InfoContainer
					title="文件信息"
					id="fileInfo"
					style={{ display: !displayAdvance ? 'none' : '' }}
				>
					<UploadFormItem
						pageType={pageType}
						currentFileList={fileList}
						newFileList={newFileList}
						uploadLimit={1}
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
					<Button type="secondary" onClick={() => this.onBackPage()}>
						取消
					</Button>
				</div>
			</Form>
		)
	}
}

// props默认值指定
SchemaPreviewAndCreateAndEditService.defaultProps = {
	pageType: 'create',
	initFieldUuid: '',
	businessCatalogChangeDisable: false,
	displayAdvance: false,
}

SchemaPreviewAndCreateAndEditService.propTypes = {
	pageType: PropTypes.string, // 页面类型 - 新建业务：create/编辑业务：edit/查看业务：preview
	initFieldUuid: PropTypes.string, // 编辑业务 - 初始化表单数据的业务uuid
	onCancel: PropTypes.func, // 取消按钮 - 返回上一页面function
	businessCatalogChangeDisable: PropTypes.bool, // 所属业务不可选
	showAdvance: PropTypes.func, // 高级选项按钮反馈，同父页面统一
	displayAdvance: PropTypes.bool, // 高级选项内容是否展开
}
