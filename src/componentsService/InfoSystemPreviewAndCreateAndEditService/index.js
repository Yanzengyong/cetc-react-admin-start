import React from 'react'
import {
	Form,
	Field,
	Input,
	Button,
	Radio,
	Select,
	Checkbox,
	Message,
} from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import AdvanceBtn from '@/components/AdvanceBtn'
import UploadFormItem from '@/components/UploadFormItem'
import PropTypes from 'prop-types' // 类型检查
import './index.scss'
import {
	leaveAndSave,
	hasStorageAndInit,
	getQueryItemValue,
} from 'utils/common'
import { BusinessManageAction, FileAction } from '@/actions'
import { IpAddress } from '@/utils/validationFn'
const {
	getBusinessListRQ,
	addInfoSysRQ,
	queryInfoSysRQ,
	updateInfoSysRQ,
} = BusinessManageAction
const { uploadFileRQ } = FileAction

const FormItem = Form.Item

export default class InfoSystemPreviewAndCreateAndEditService extends React.Component {
	field = new Field(this)

	state = {
		fileList: [],
		newFileList: [],
		originalFileList: [],

		businessList: [],
		loading: false,
	}

	componentDidMount () {
		const initData = hasStorageAndInit()
		if (initData) {
			this.field.setValues(initData)
		} else {
			// 仅限编辑和查看模式下需要查询详情内容并填入field
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				this.initFieldList(this.props.initFieldUuid)
			}
		}
		this.initBusinessInfo()
	}

	componentWillUnmount () {
		const pathObj = this.props.location
		const storageName = `${pathObj.pathname}${pathObj.search}`
		leaveAndSave(storageName, this.field.getValues())
		this.setState = () => {
			return
		}
	}

	// 初始化业务信息
	// 快捷访问 -> 新增 情况下，则需查询业务列表，其余情况则无需查询，使用search传入参数即可
	initBusinessInfo = async () => {
		const _search = this.props.location.search
		if (_search === '') {
			let list = await this.getBusinessList(1)
			this.setState({ businessList: list })
		} else {
			if (this.props.pageType === 'create')
				this.field.setValue('businessUuid', getQueryItemValue(_search, 'title'))
		}
	}

	// 获取业务列表
	getBusinessList = async (page, name) => {
		let param = {
			isPage: true,
			name: name,
			page: page,
			limit: 10,
		}
		let response = await getBusinessListRQ(param)
		if (response) {
			if (response.code === 10000) {
				return response.result.list
			} else {
				Message.error(response.msg || '业务列表获取失败')
				return []
			}
		} else {
			return []
		}
	}

	// 业务列表选择框-滚动至底部进行数据动态加载
	onScroll = async (e) => {
		const scrollHeight = e.target.scrollHeight // 内容总高度
		const clientHeight = e.target.clientHeight // 窗口高度
		const scrollTop = e.target.scrollTop //滚动高度
		// TODO:滚动加载有待讨论
		if (scrollTop + clientHeight === scrollHeight) {
			// 到达底部
			const dataSource = this.state.businessList
			let page = parseInt(this.state.businessList.length / 10)
			let otherData = await this.getBusinessList(page + 1)
			if (otherData && otherData.length > 0) {
				this.setState({ businessList: dataSource.concat(otherData) })
			}
		}
	}

	// 业务列表选择框 - 数据检索 - 延时+查询接口
	onSearchBusiness = (value) => {
		if (this.searchTimeout) {
			clearTimeout(this.searchTimeout)
		}
		this.searchTimeout = setTimeout(async () => {
			let list = await this.getBusinessList(1, value)
			this.setState({ businessList: list })
		}, 500)
	}

	// 初始化编辑/查看表单的内容
	initFieldList = async (uuid) => {
		const response = await queryInfoSysRQ({ uuid: uuid })
		if (response) {
			if (response.code === 10000) {
				this.field.setValue('uuid', response.result.uuid)
				this.field.setValue(
					'businessUuid',
					getQueryItemValue(this.props.location.search, 'businessName')
				)
				this.field.setValue('name', response.result.name)
				this.field.setValue('memo', response.result.memo)
				this.field.setValue('intUse', response.result.intUse)
				this.field.setValue('useUnitName', response.result.useUnitName)
				this.field.setValue(
					'useUnitPrincipal',
					response.result.useUnitPrincipal
				)
				this.field.setValue('useUnitContact', response.result.useUnitContact)
				this.field.setValue(
					'useUnitContactType',
					response.result.useUnitContactType
				)
				this.field.setValue('developUnit', response.result.developUnit)
				this.field.setValue(
					'developUnitContact',
					response.result.developUnitContact
				)
				this.field.setValue(
					'developUnitContactType',
					response.result.developUnitContactType
				)
				this.field.setValue(
					'securityClassification',
					response.result.securityClassification
				)
				this.field.setValue('userScale', response.result.userScale)
				this.field.setValue(
					'operatingFrequency',
					response.result.operatingFrequency
				)
				this.field.setValue('accessMode', response.result.accessMode)
				this.field.setValue('loginAddress', response.result.loginAddress)
				this.field.setValue('account', response.result.account)
				this.field.setValue('password', response.result.password)
				this.field.setValue('netstat', response.result.netstat)
				this.field.setValue('dataAccess', response.result.dataAccess)
				this.field.setValue('operationSystem', response.result.operationSystem)
				this.field.setValue(
					'otherOperationSystem',
					response.result.otherOperationSystem
				)
				this.field.setValue('dataSize', response.result.dataSize)
				this.field.setValue(
					'datasourceType',
					response.result.datasourceType !== ''
						? response.result.datasourceType.split(',')
						: []
				)
				this.field.setValue(
					'otherDatasourceType',
					response.result.otherDatasourceType
				)

				// 因fileResult内容不存在时结果为null而非[],故需进行判断处理
				const fileList = response.result.fileResult
					? response.result.fileResult
					: []
				this.setState({
					originalFileList: JSON.parse(JSON.stringify(fileList)),
					fileList: JSON.parse(JSON.stringify(fileList)),
				})
			} else {
				Message.error(response.msg || '信息系统详情获取失败')
			}
		} else {
			Message.error('信息系统详情获取失败')
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

	// 切换高级
	onChangeAdvanceDisplay = () => {
		this.props.showAdvance()
	}

	// 确认提交
	onSubmit = () => {
		this.field.validate(async (errors, values) => {
			if (errors) return

			if (this.props.pageType === 'create') this.addInfoSys(values)
			else if (this.props.pageType === 'edit') this.updateInfoSys(values)
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

	// 新增信息系统
	addInfoSys = async (values) => {
		// 1. 上传文件，获得文件uuids
		let uploadFileResult = await this.uploadFile(this.state.newFileList)

		// 2. 处理上传参数格式
		// 2.1 数据源需通过英文逗号进行拼接后传递给后端
		let datasourceTypeStr = ''
		if (
			values.datasourceType &&
			values.datasourceType.length &&
			values.datasourceType.length > 0
		) {
			values.datasourceType.map((item) => {
				datasourceTypeStr = datasourceTypeStr + ',' + item
			})
		}
		datasourceTypeStr = datasourceTypeStr.slice(1)
		let param = values
		param.datasourceType = datasourceTypeStr

		// 2.2 将已上传至fdfs系统的文件uuid列表放入新增传参
		param.fileUuids = uploadFileResult

		// 2.3 非快捷访问情况下的businessUuid，因直接提取title显示，故在提交时需改为businessUuid本身
		const _search = this.props.location.search
		if (_search !== '') {
			param.businessUuid = getQueryItemValue(_search, 'businessUuid')
		}

		// 3. 提交上传
		const response = await addInfoSysRQ(param)
		if (response) {
			if (response.code === 10000) {
				Message.success('新增成功')
				this.setState({ loading: false }, () => {
					let backInfoUuid = ''
					let backInfoTitle = ''
					if (_search === '') {
						backInfoUuid = param.businessUuid
						backInfoTitle = this.state.businessList.filter((item) => {
							return item.uuid === param.businessUuid
						})[0].name
					} else {
						backInfoUuid = getQueryItemValue(_search, 'businessUuid')
						backInfoTitle = getQueryItemValue(_search, 'title')
					}
					this.props.onBack(backInfoUuid, backInfoTitle)
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

	// 编辑系统
	updateInfoSys = async (values) => {
		// 1. 上传文件，获得文件uuids
		let uploadFileResult = await this.uploadFile(this.state.newFileList)
		// 将已有文件列表uuid添加进数组中
		if (this.state.fileList.length > 0) {
			this.state.fileList.map((item) => {
				uploadFileResult.push(item.fileUuid)
			})
		}

		// 2. 处理上传参数格式
		// 2.1 数据源需通过英文逗号进行拼接后传递给后端
		let datasourceTypeStr = ''
		if (
			values.datasourceType &&
			values.datasourceType.length &&
			values.datasourceType.length > 0
		) {
			values.datasourceType.map((item) => {
				datasourceTypeStr = datasourceTypeStr + ',' + item
			})
		}
		datasourceTypeStr = datasourceTypeStr.slice(1)
		let param = values
		param.datasourceType = datasourceTypeStr

		// 2.2 将新的文件uuid列表放入新增传参
		param.fileUuids = uploadFileResult

		// 2.3 因直接提取title显示，故在提交时需改为businessUuid本身
		const _search = this.props.location.search
		param.businessUuid = getQueryItemValue(_search, 'businessUuid')

		// 3. 提交上传
		const response = await updateInfoSysRQ(param)
		if (response) {
			if (response.code === 10000) {
				Message.success('编辑成功')
				this.setState({ loading: false }, () => {
					let backInfoUuid = param.businessUuid
					let backInfoTitle = getQueryItemValue(
						this.props.location.search,
						'businessName'
					)
					this.props.onBack(backInfoUuid, backInfoTitle)
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

	render () {
		const {
			pageType,
			businessCatalogChangeDisable,
			displayAdvance,
			showAdvance,
			onBack,
		} = this.props

		const { businessList, fileList, newFileList, loading } = this.state

		const init = this.field.init

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<InfoContainer title="基本信息" id="basicInfo">
					<FormItem label="所属业务：" required>
						<Select
							style={{ width: '49%' }}
							placeholder="请选择所属业务"
							{...init('businessUuid')}
							disabled={businessCatalogChangeDisable}
							readOnly={pageType === 'preview'}
							showSearch
							onSearch={this.onSearchBusiness}
							menuProps={{ onScroll: this.onScroll }} // 下滑至底部进行数据动态加载
							autoHighlightFirstItem={false} // 避免数据动态加载时滚动回第一行
						>
							{businessList && businessList.length > 0
								? businessList.map((item) => {
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
					</FormItem>
					<FormItem label="信息系统名称：" required>
						<Input
							trim
							maxLength={50}
							hasLimitHint
							placeholder="请输入信息系统名称"
							{...init('name', {
								rules: [
									{
										required: true,
										message: '信息系统名称不能为空',
									},
								],
							})}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="信息系统描述：">
						<Input
							maxLength={200}
							hasLimitHint
							placeholder="请输入信息系统描述"
							{...init('memo')}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="是否在用：" required>
						<Radio.Group
							{...init('intUse', {
								rules: [
									{
										required: true,
										message: '是否在用不能为空',
									},
								],
							})}
							disabled={pageType === 'preview'}
						>
							<Radio value={0}>是</Radio>
							<Radio value={1}>否</Radio>
						</Radio.Group>
					</FormItem>
					<FormItem label="使用单位：">
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 10,
							}}
						>
							<Input
								trim
								style={{ width: '49%' }}
								maxLength={200}
								hasLimitHint
								placeholder="请输入使用单位全称"
								{...init('useUnitName')}
								readOnly={pageType === 'preview'}
							/>
							<Input
								trim
								style={{ width: '49%' }}
								maxLength={50}
								hasLimitHint
								placeholder="请输入使用单位负责人姓名"
								{...init('useUnitPrincipal')}
								readOnly={pageType === 'preview'}
							/>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 10,
							}}
						>
							<Input
								trim
								style={{ width: '49%' }}
								maxLength={50}
								hasLimitHint
								placeholder="请输入使用单位联系人姓名"
								{...init('useUnitContact')}
								readOnly={pageType === 'preview'}
							/>
							<Input
								trim
								style={{ width: '49%' }}
								maxLength={50}
								hasLimitHint
								placeholder="请输入使用单位联系人联系方式"
								{...init('useUnitContactType')}
								readOnly={pageType === 'preview'}
							/>
						</div>
					</FormItem>
					<FormItem label="开发单位：">
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 10,
							}}
						>
							<Input
								trim
								style={{ width: '49%' }}
								maxLength={200}
								hasLimitHint
								placeholder="请输入开发单位全称"
								{...init('developUnit')}
								readOnly={pageType === 'preview'}
							/>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 10,
							}}
						>
							<Input
								trim
								style={{ width: '49%' }}
								maxLength={50}
								hasLimitHint
								placeholder="请输入开发单位联系人姓名"
								{...init('developUnitContact')}
								readOnly={pageType === 'preview'}
							/>
							<Input
								trim
								style={{ width: '49%' }}
								maxLength={50}
								hasLimitHint
								placeholder="请输入开发单位联系人联系方式"
								{...init('developUnitContactType')}
								readOnly={pageType === 'preview'}
							/>
						</div>
					</FormItem>
					<FormItem label="密级：">
						<Select
							style={{ width: '49%' }}
							hasLimitHint
							placeholder="请选择密级"
							{...init('securityClassification')}
							disabled={pageType === 'preview'}
							hasClear
						>
							<Select.Option label="公开" value={0} />
							<Select.Option label="内部" value={1} />
							<Select.Option label="秘密" value={2} />
							<Select.Option label="机密" value={3} />
							<Select.Option label="绝密" value={4} />
						</Select>
					</FormItem>

					<FormItem label="用户规模：">
						<Input
							style={{ width: '49%' }}
							innerAfter={<span className="userScale_style">人</span>}
							hasLimitHint
							placeholder="请输入用户规模（数字）"
							{...init('userScale')}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="使用频率：">
						<Select
							style={{ width: '49%' }}
							hasLimitHint
							placeholder="请选择使用频率"
							{...init('operatingFrequency')}
							disabled={pageType === 'preview'}
							hasClear
						>
							<Select.Option label="天" value={0} />
							<Select.Option label="周" value={1} />
							<Select.Option label="月" value={2} />
							<Select.Option label="季度" value={3} />
							<Select.Option label="年" value={4} />
						</Select>
					</FormItem>
				</InfoContainer>

				<AdvanceBtn
					displayAdvance={displayAdvance}
					showAdvance={showAdvance}
					id="advanceBtn"
				/>

				<InfoContainer
					title="访问信息"
					id="visitInfo"
					style={{ display: !displayAdvance ? 'none' : '' }}
				>
					<FormItem label="访问方式：">
						<Select
							style={{ width: '49%' }}
							hasLimitHint
							placeholder="请选择访问方式"
							{...init('accessMode')}
							disabled={pageType === 'preview'}
							hasClear
						>
							<Select.Option label="浏览器访问" value={0} />
							<Select.Option label="客户端访问" value={1} />
						</Select>
					</FormItem>
					<FormItem label="访问地址：">
						<Input
							trim
							style={{ width: '49%' }}
							maxLength={1000}
							hasLimitHint
							placeholder="请输入访问地址"
							{...init('loginAddress', {
								rules: [
									{
										message: '请输入正确的URL地址',
									},
									{
										validator: IpAddress,
									},
								],
							})}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="登录用户名：">
						<Input
							trim
							style={{ width: '49%' }}
							maxLength={200}
							hasLimitHint
							placeholder="请输入信息系统登录用户名"
							{...init('account')}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="登录密码：">
						<Input.Password
							style={{ width: '49%' }}
							hasLimitHint
							placeholder="请输入信息系统登录密码"
							{...init('password')}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
				</InfoContainer>

				<InfoContainer
					title="部署信息"
					id="releaseInfo"
					style={{ display: !displayAdvance ? 'none' : '' }}
				>
					<FormItem
						label={
							<span>
								网络是否联通：
								<font color="red">
									（该信息系统是否和本平台在同一个网络，是否能互相访问）
								</font>
							</span>
						}
					>
						<Radio.Group {...init('netstat')} disabled={pageType === 'preview'}>
							<Radio value={0}>是</Radio>
							<Radio value={1}>否</Radio>
						</Radio.Group>
					</FormItem>
					<FormItem
						label={
							<span>
								数据是否联通：
								<font color="red">
									（该信息系统数据库是否和本平台在同一个网络，是否能互相访问）
								</font>
							</span>
						}
					>
						<Radio.Group
							{...init('dataAccess')}
							disabled={pageType === 'preview'}
						>
							<Radio value={0}>是</Radio>
							<Radio value={1}>否</Radio>
						</Radio.Group>
					</FormItem>
					<FormItem label="操作系统：">
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<Select
								style={{ width: '49%' }}
								hasLimitHint
								placeholder="请选择系统部署的操作系统"
								{...init('operationSystem')}
								disabled={pageType === 'preview'}
							>
								<Select.Option label="windows 7" value="windows7" />
								<Select.Option label="windows 2013" value="windows2013" />
								<Select.Option label="windows 8" value="windows8" />
								<Select.Option label="windows 10" value="windows10" />
								<Select.Option label="linux centos 7" value="centos7" />
								<Select.Option label="其他（请填写）" value="others" />
							</Select>
							{this.field.getValue('releaseOperationSystem') &&
							this.field.getValue('releaseOperationSystem') === 'others' ? (
								<Input
									style={{ width: '49%' }}
									maxLength={200}
									hasLimitHint
									placeholder="请填写其他操作系统名称"
									{...init('otherOperationSystem')}
									readOnly={pageType === 'preview'}
								/>
							) : null}
						</div>
					</FormItem>
				</InfoContainer>

				<InfoContainer
					title="数据信息"
					id="dataInfo"
					style={{ display: !displayAdvance ? 'none' : '' }}
				>
					<FormItem label="数据量估算：">
						<Input
							trim
							style={{ width: '49%' }}
							innerAfter={<span className="userScale_style">GB</span>}
							placeholder="请输入数据量估值（数字）"
							{...init('dataSize')}
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
					<FormItem label="数据库类型：">
						<Checkbox.Group
							itemDirection="hoz"
							{...init('datasourceType')}
							disabled={pageType === 'preview'}
						>
							<Checkbox value="MySQL">MySQL</Checkbox>
							<Checkbox value="Hive">Hive</Checkbox>
							<Checkbox value="Oracle">Oracle</Checkbox>
							<Checkbox value="SQL_Server">SQL Server</Checkbox>
							<Checkbox value="PostgressSQL">PostgressSQL</Checkbox>
							<Checkbox value="MongoDB">MongoDB</Checkbox>
							<Checkbox value="Redis">Redis</Checkbox>
							<Checkbox value="Elastic_Search">Elastic Search</Checkbox>
							<Checkbox value="Kafka">Kafka</Checkbox>
							<Checkbox value="RabbitMQ">RabbitMQ</Checkbox>
						</Checkbox.Group>
						<Input
							maxLength={200}
							hasLimitHint
							style={{ width: '49%', marginTop: 10 }}
							{...init('otherDatasourceType')}
							placeholder="其它数据库类型，用英文逗号分隔"
							readOnly={pageType === 'preview'}
						/>
					</FormItem>
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
InfoSystemPreviewAndCreateAndEditService.defaultProps = {
	pageType: 'create',
	initFieldUuid: '',
	businessCatalogChangeDisable: false,
	displayAdvance: false,
}

InfoSystemPreviewAndCreateAndEditService.propTypes = {
	pageType: PropTypes.string, // 页面类型 - 新建业务：create/编辑业务：edit/查看业务：preview
	initFieldUuid: PropTypes.string, // 编辑业务 - 初始化表单数据的业务uuid
	onBack: PropTypes.func, // 取消按钮 - 返回上一页面function
	businessCatalogChangeDisable: PropTypes.bool, // 所属业务不可选
	showAdvance: PropTypes.func, // 高级选项按钮反馈，同父页面统一
	displayAdvance: PropTypes.bool, // 高级选项内容是否展开
}
