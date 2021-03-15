import React from 'react'
import {
	Form,
	Field,
	Input,
	Button,
	Message,
	TreeSelect,
	Balloon,
	Grid,
	Tag
} from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import IconFont from '@/components/IconFont'
import UploadFormItem from '@/components/UploadFormItem'
import { NoSpace, NoChinese, Port, IpAddress } from '@/utils/validationFn'
import { leaveAndSave, hasStorageAndInit, getQueryItemValue } from 'utils/common'
import { DataSourceAction, CatalogueAction } from '@/actions'
import { filesUpload } from '@/utils/fileOperation'
import './index.scss'
const { getTreeRQ } = CatalogueAction
const TreeNode = TreeSelect.Node
const Tooltip = Balloon.Tooltip
const {
	testConnectRQ,
	addSourceRQ,
	getSourceInfoRQ,
	updateSourceRQ,
} = DataSourceAction
const FormItem = Form.Item
const { Row, Col } = Grid
export default class DataSourceCreateEditPreview extends React.Component {
	field = new Field(this)
	state = {
		originalFileList: [],
		uploadedFileList: [],
		newFileList: [],
		initFieldUuid: '',
		connectLoading: false,
		currentPage: 1,
		pageSize: 8,
		infoCurrentPage: 1,
		infoPageSize: 8,
		//所属业务
		businessList: [],
		//所属信息系统
		infoSysList: [],
		//选中的业务的uuid
		businessUuid: '',
		submitLoading: false,
		treeList: [],
		usedTimes: 0, // 当前数据源关联API数量
	}
	// 初始化赋值fileList
	async componentDidMount () {
		const {
			location
		} = this.props
		// 获取目录树拉取列表
		this.getCatalgue()

		const initData = hasStorageAndInit()

		// 存在当前修改
		if (initData) {
			this.field.setValues(initData)
		} else {
			if (this.props.pageType === 'edit' || this.props.pageType === 'preview') {
				// 如果没有初始值、并且是编辑时，获取编辑详情
				let result = await getSourceInfoRQ({ uuid: this.props.dataSourceUuid })
				if (result) {
					if (result.code === 10000) {
						console.log(result.result)
						// 切记不能使用setValues，因为它会把删除状态也给传进去了
						this.field.setValue('name', result.result.name)
						this.field.setValue('memo', result.result.memo)
						this.field.setValue('clusterAddress', result.result.clusterAddress)
						this.field.setValue('topic', result.result.topic)
						this.field.setValue('host', result.result.host)
						this.field.setValue('port', result.result.port)
						this.field.setValue('username', result.result.username)
						this.field.setValue('password', result.result.password)
						this.field.setValue('dataSourceType', result.result.type)
						this.field.setValue('defaultDatabase', result.result.defaultDatabase)
						this.field.setValue('catalogueList', result.result.catalogueDirectoryList.map((item) => item.uuid))

						this.setState({ usedTimes: result.result.usedTimes })
						// 设置fileList初始化内容
						this.setInitFileList(result.result.fileResult)
					} else {
						Message.error(
							(result && result.result && result.result.msg) || '详情获取失败'
						)
					}
				}
			}
			else {
				this.field.setValue('dataSourceType', getQueryItemValue(location.search, 'title'))
			}
		}
	}

	getCatalgue = async (params) => {
		const response = await getTreeRQ('govern-datasource/datasource')
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

	componentWillUnmount () {
		this.setState = () => {
			return
		}
		// 以当前的地址为存储的唯一key，当前地址应该为pathname+search
		const pathObj = this.props.location
		const storageName = `${pathObj.pathname}${pathObj.search}`
		// 存储你需要存储的状态对象
		const data = this.field.getValues()
		console.log(data)
		leaveAndSave(storageName, data)
	}

	// 初始化filelist内容
	setInitFileList = (fileResult) => {
		// 因fileResult内容不存在时结果为null而非[],故需进行判断处理
		const fileList = fileResult ? fileResult : []
		this.setState({
			originalFileList: JSON.parse(JSON.stringify(fileList)),
			uploadedFileList: JSON.parse(JSON.stringify(fileList)),
		})
	}

	// 恢复已上传文件列表
	onResetList = () => {
		let saveOriginalFileList = JSON.parse(
			JSON.stringify(this.state.originalFileList)
		)
		this.setState({ uploadedFileList: saveOriginalFileList })
	}

	// 获取待上传新文件列表
	onGetNewFileList = (fileList) => {
		this.setState({ newFileList: fileList })
	}

	// 获取已上传文件调整后的列表
	onGetOldFileList = (fileList) => {
		console.log(this.state.originalFileList)
		this.setState({ uploadedFileList: fileList })
	}

	// 连接测试
	connectTest = () => {
		this.field.validate(
			['host', 'port', 'defaultDatabase', 'username', 'password'],
			(errors, values) => {
				if (!errors) {
					this.setState(
						{
							connectLoading: true,
						},
						async () => {
							values.type = this.props.dataSourceType
							let result = await testConnectRQ(values)
							if (result) {
								if (result.code === 10000) {
									Message.success('连接成功')
									this.setState({
										connectLoading: false,
										currentConnectionStatus: 'success'
									})
								} else {
									Message.error(result.msg || '连接失败')
									this.setState({
										connectLoading: false,
										currentConnectionStatus: 'fail'
									})
								}
							} else {
								this.setState({
									connectLoading: false,
								})
							}
						}
					)
				}
			}
		)
	}

	// 点击提交
	onSubmit = () => {
		this.field.validate(async (errors, values) => {
			if (errors) return

			// 文件类型
			if (this.props.dataSourceType === 'File') {
				if (this.state.newFileList.length === 0) {
					Message.error('暂未上传文件')
					return
				}
				// 校验文件
				// 若为文件类型，则需上传文件
				// 必填项校验：若待上传文件为空，或上传结果uuid为空，则停止新增或编辑操作
				let uploadFileResult = await filesUpload(
					this,
					this.state.newFileList,
					'submitLoading'
				)

				// 若可上传文件为多个，则需将已有文件列表uuid添加进数组中，此时则打开下列代码
				// if (this.state.uploadedFileList.length > 0) {
				// 	this.state.uploadedFileList.map((item) => {
				// 		uploadFileResult.push(item.fileUuid)
				// 	})
				// }
				if (uploadFileResult && uploadFileResult.length > 0) {
					if (this.props.pageType === 'create')
						// 新增模式
						this.addDataSource(values, uploadFileResult)
					else if (this.props.pageType === 'edit')
						// 编辑模式
						this.editDataSource(values, uploadFileResult)
				}
			}
			// 非文件类型
			else {
				if (this.props.pageType === 'create') this.addDataSource(values)
				// 新增模式
				else if (this.props.pageType === 'edit') {
					if (this.state.currentConnectionStatus !== 'success') {
						Message.error('请测试连接数据源成功后再保存数据源信息')
					}
					else {
						this.editDataSource(values) // 编辑模式
					}
				}
			}
		})
	}

	// 提交新增表单
	addDataSource = async (values, fileUuids) => {
		values.type = this.props.dataSourceType
		values.files = fileUuids
		values.port = parseInt(values.port)

		let response = await addSourceRQ(values)
		if (response) {
			if (response.code === 10000) {
				Message.success('新增成功')
				this.props.onBack()
			} else {
				this.setState({
					submitLoading: false,
				})
				Message.error(response.msg || '新增失败')
			}
		} else {
			this.setState({
				submitLoading: false,
			})
		}
	}

	// 提交编辑表单
	editDataSource = async (values, fileUuids) => {
		values.uuid = this.props.dataSourceUuid
		values.type = this.props.dataSourceType
		values.files = fileUuids

		let result = await updateSourceRQ(values)
		console.log(result)
		if (result) {
			if (result.code === 10000) {
				Message.success('修改成功')
				this.props.onBack()
			} else {
				this.setState({
					submitLoading: false,
				})
				Message.error(result.msg || '修改失败')
			}
		} else {
			this.setState({
				submitLoading: false,
			})
		}
	}

	// 渲染连接状态tag
	renderConnectionStatusTag = () => {
		const {
			currentConnectionStatus
		} = this.state

		let name = '未连接！'
		let bg = '#eff4ff'
		let color = '#4679FF'
		let icon = 'iconwarning-circle-fill'

		switch (currentConnectionStatus) {
			case 'success': name = '连接成功！'; bg = '#EDFFED'; color = '#159333'; icon = 'iconcheck-circle-fill'
				break
			case 'fail': name = '连接失败！'; bg = '#FFEDED'; color = '#E62412'; icon = 'iconclose-circle-fill'
				break
			default: name = '未连接！'; bg = '#eff4ff'; color = '#4679FF'; icon = 'iconwarning-circle-fill'
		}

		return (
			<div
				className='datasource_connectionStatus_box'
				style={{
					backgroundColor: bg
				}}
			>
				<IconFont type={icon} style={{ fill: color }} />
				<span style={{ color }}>{name}</span>
			</div>
		)
	}

	render () {
		const { dataSourceType, onBack, pageType } = this.props
		const { connectLoading, submitLoading, treeList, usedTimes, currentConnectionStatus } = this.state
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

				{
					usedTimes && usedTimes > 0 && pageType === 'edit' ? (
						<div className='alert_message_box'>
							<IconFont type="iconwarning-circle-fill" style={{ marginRight: 8, color: '#4679FF' }}/>
							<span className='alert_message_text'>
								<b>{`本数据源已有${usedTimes}个API正在使用，故数据源地址、端口号、用户名不可修改`}</b>
							</span>
						</div>
					) : null
				}

				<InfoContainer title="基本信息" id="basicInfo">
					<Row justify='start'>
						<Col span='8'>
							<FormItem label="数据源类别：" required>
								<Input
									readOnly
									{...init('dataSourceType')}
								/>
							</FormItem>
						</Col>
						<Col span='8' offset='1'>
							<FormItem label="数据源编目" required>
								<TreeSelect
									disabled={pageType === 'preview'}
									hasClear
									style={{ width: '100%' }}
									{...init('catalogueList', {
										rules: [{ required: true, message: '数据源编目不能为空' }]
									}, {
										onChange: (v) => {
											this.field.setValue('catalogueList', v ? [v] : [])
										}
									})}
								>
									{loop(treeList)}
								</TreeSelect>
							</FormItem>
						</Col>
					</Row>
					<FormItem label="数据源名称：" required>
						<Input
							readOnly={pageType === 'preview'}
							maxLength={50}
							hasLimitHint
							placeholder="请输入数据源名称"
							{...init('name', {
								rules: [
									{
										required: true,
										message: '数据源名称不能为空',
									},
									{
										validator: NoSpace,
									},
								],
							})}
						/>
					</FormItem>
					<FormItem label="数据源描述：" required>
						<Input.TextArea
							readOnly={pageType === 'preview'}
							maxLength={200}
							hasLimitHint
							placeholder="请输入数据源描述"
							{...init('memo')}
						/>
					</FormItem>
				</InfoContainer>
				{(() => {
					switch (dataSourceType) {
						case 'File':
							return (
								<InfoContainer title="数据源文件信息" id="connectInfo">
									<UploadFormItem
										pageType={pageType}
										uploadedFileList={this.state.uploadedFileList}
										newFileList={this.state.newFileList}
										uploadLimit={1}
										onResetList={this.onResetList}
										onGetNewFileList={this.onGetNewFileList}
										onGetOldFileList={this.onGetOldFileList}
										fileType=".csv,.txt"
									/>
								</InfoContainer>
							)
						case 'Kafka':
							return (
								<InfoContainer
									title={dataSourceType + '数据源连接信息'}
									id="connectInfo"
								>
									<FormItem
										label="Kafka集群地址（多个地址以英文逗号“,”分割，示例：127.0.0.1:9092,127.0.0.1:9092）"
										required
									>
										<Input
											maxLength={200}
											hasLimitHint
											readOnly={pageType === 'preview'}
											placeholder="请输入Kafka集群地址，并以英文逗号分隔"
											{...init('clusterAddress', {
												rules: [
													{
														required: true,
														message: 'Kafka集群地址不能为空',
													},
												],
											})}
										/>
									</FormItem>
									<FormItem label="TOPIC：" required>
										<Input
											maxLength={200}
											hasLimitHint
											readOnly={pageType === 'preview'}
											placeholder="请输入TOPIC"
											{...init('topic', {
												rules: [
													{
														required: true,
														message: 'TOPIC不能为空',
													},
													{
														validator: NoChinese,
													},
												],
											})}
										/>
									</FormItem>
								</InfoContainer>
							)
						default:
							return (
								<InfoContainer
									title={dataSourceType + '数据源连接信息'}
									id="connectInfo"
								>
									<FormItem label="数据源地址：" required>
										<Input
											disabled={usedTimes && usedTimes > 0 && pageType === 'edit'}
											maxLength={200}
											hasLimitHint
											readOnly={pageType === 'preview'}
											placeholder="请输入数据源地址"
											{...init('host', {
												rules: [
													{
														required: true,
														message: '地址不能为空',
													},
													{
														validator: IpAddress,
													},
												],
											})}
										/>
									</FormItem>
									<FormItem label="数据源端口：" required>
										<Input
											disabled={usedTimes && usedTimes > 0 && pageType === 'edit'}
											maxLength={200}
											hasLimitHint
											readOnly={pageType === 'preview'}
											placeholder="请输入数据源端口"
											{...init('port', {
												rules: [
													{
														required: true,
														message: '端口不能为空',
													},
													{
														validator: Port,
													},
												],
											})}
										/>
									</FormItem>

									<FormItem label="用户名：" required>
										<Input
											disabled={usedTimes && usedTimes > 0 && pageType === 'edit'}
											maxLength={200}
											hasLimitHint
											readOnly={pageType === 'preview'}
											placeholder="请输入用户名"
											{...init('username', {
												rules: [
													{
														required: true,
														message: '用户名不能为空',
													},
													{
														validator: NoChinese,
													},
												],
											})}
										/>
									</FormItem>
									<FormItem label="密码：" required>
										<Input.Password
											maxLength={200}
											hasLimitHint
											readOnly={pageType === 'preview'}
											placeholder="请输入密码"
											{...init('password', {
												rules: [
													{
														required: true,
														message: '密码不能为空',
													},
													{
														validator: NoChinese,
													},
												],
											})}
										/>
									</FormItem>
									<FormItem label="数据库实例名：" required>
										<Input
											maxLength={200}
											hasLimitHint
											readOnly={pageType === 'preview'}
											placeholder="请输入数据库名称"
											{...init('defaultDatabase', {
												rules: [
													{
														required: true,
														message: '数据库名称不能为空',
													},
													{
														validator: NoChinese,
													},
													{
														validator: NoSpace,
													},
												],
											})}
										/>
									</FormItem>
									{pageType === 'preview' ? null : (
										<div className='datasource_connection_box'>
											<Button
												type="primary"
												style={{ marginRight: 10 }}
												onClick={this.connectTest}
												loading={connectLoading}
												size='large'
											>
												测试连接
											</Button>
											{this.renderConnectionStatusTag()}
										</div>
									)}
								</InfoContainer>
							)
					}
				})()}
				{pageType === 'preview' ? null : (
					<div id="operationBtns">
						<FormItem wrapperCol={{ offset: 11 }}>
							<Button
								loading={submitLoading}
								type="primary"
								style={{ marginRight: 10 }}
								onClick={this.onSubmit}
								size='large'
							>
								确认
							</Button>
							<Button type="normal" onClick={onBack} size='large'>
								取消
							</Button>
						</FormItem>
					</div>
				)}
			</Form>
		)
	}
}
