import React from 'react'
import {
	Search,
	Balloon,
	Dialog,
	Message,
	Form,
	Input,
	Field,
} from '@alifd/next'
import IconFont from '@/components/IconFont'
import Tree from '@/components/TreeCatalogue'
import './index.scss'
const Tooltip = Balloon.Tooltip
import { CatalogueAction } from '@/actions'
import PropTypes from 'prop-types'
import DeleteNotice from '@/components/DeleteNotice'
import { NoSpace } from '@/utils/validationFn'
const { getTreeRQ, addTreeRQ, updateTreeRQ, deleteTreeRQ } = CatalogueAction

const FormItem = Form.Item

class CatalogueService extends React.Component {
	static propTypes = {
		selectable: PropTypes.bool, // 是否可选中
		onSelectedHandle: PropTypes.func, // 树节点被选中的函数
		catalogueType: PropTypes.string, // 目录资源的类型、不同资源请求的地址不同
		maxLevel: PropTypes.number, // 目录树最大层级
		readOnly: PropTypes.bool, // 只读
	}

	static defaultProps = {
		selectable: true,
		catalogueType: '',
		maxLevel: null,
		readOnly: false
	}

	state = {
		treeData: [], // 目录数据
		currentCatalogueName: '', // 当前选中名称
		isShowCurrent: false, // 是否显示当前选中
		dialogVisible: false,
		dialogTitle: '',
		dialogType: '',
		currentNode: {}, // 当前节点, 新增、编辑
		expandedKeys: [], // 当前展开的数组
		selectedKeys: [], // 选中的数据
		rootNode: {}
	}
	field = new Field(this)
	componentDidMount () {
		this.getDirectoryList()
	}
	// 处理treedata数据
	processNode = (data) => {
		return data.map((item) => {
			if (item.children && item.children.length > 0) {
				const childItem = this.processNode(item.children)
				return {
					...item,
					key: item.uuid,
					title: item.label,
					children: childItem,
				}
			} else {
				return {
					...item,
					key: item.uuid,
					title: item.label,
				}
			}
		})
	}
	// 获取数据源目录
	getDirectoryList = async () => {
		const { catalogueType, isVerify } = this.props
		const response = await getTreeRQ(catalogueType, {
			authority: isVerify
		})
		if (response) {
			if (response.code === 10000) {
				this.setState({
					rootNode: response.result,
					treeData: this.processNode(response.result.children),
				})
			} else {
				Message.error(response.msg || '列表获取失败')
			}
		}
	}

	// 创建目录子节点
	onCreateNodeChild = (node) => {
		this.field.reset()
		this.setState({
			dialogVisible: true,
			dialogTitle: '新增当前子目录',
			dialogType: 'create',
			currentNode: node,
		})
	}
	// 更新目录节点
	onUpdateNode = (node) => {
		this.setState(
			{
				dialogVisible: true,
				dialogTitle: '编辑当前目录',
				dialogType: 'update',
				currentNode: node,
			},
			() => {
				this.field.setValues({
					name: node.label || node.title
				})
			}
		)
	}
	// 删除目录节点
	onDeleteNode = (node) => {
		const { catalogueType } = this.props
		DeleteNotice.show({
			message: `目录【 ${ node.title ?? '--'} 】删除后无法恢复`,
			onCancel: () => {
				DeleteNotice.close()
			},
			onConfirm: async () => {
				const response = await deleteTreeRQ(catalogueType, {
					uuid: node.uuid || node.key,
				})
				if (response) {
					if (response.code === 10000) {
						// 当code为成功的时候
						// 这里需要补充===》判断是否
						Message.success('删除目录成功！')
						this.getDirectoryList()
					} else {
						// 否则提示后端返回的提示语
						Message.error(response.msg || '删除目录失败！')
					}
				}
				DeleteNotice.close()
			},
		})
	}

	// 选中目录节点
	onSelectNode = (selectedKeys, record) => {
		const { onSelectedHandle } = this.props
		if (record.selected) {
			// 选中状态
			this.setState(
				{
					selectedKeys: selectedKeys,
					currentCatalogueName: record.node.title,
					isShowCurrent: true,
				},
				() => {
					// 抛出当前选中的节点信息
					if (onSelectedHandle) {
						onSelectedHandle(record.node)
					}
				}
			)
		} else {
			// 未选中状态
			this.deleteCurrentHandle()
		}
	}
	// 初始添加目录
	addCatalogueHandle = () => {
		this.field.reset()
		this.setState({
			dialogVisible: true,
			dialogTitle: '新增根目录',
			dialogType: 'create',
		})
	}
	// 弹窗【新增、修改】确认按钮
	onSubmitForCatalogue = () => {
		const { dialogType, currentNode, expandedKeys, dialogTitle, rootNode } = this.state
		const { catalogueType } = this.props
		const isRoot = dialogTitle === '新增根目录' ? true : false
		if (dialogType === 'create') {
			this.field.validate(async (errors, values) => {
				console.log('errors', errors)
				if (errors) return
				const response = await addTreeRQ(catalogueType, {
					parentUuid: isRoot ? rootNode.uuid : currentNode.uuid || currentNode.key,
					...values,
				})
				if (response) {
					if (response.code === 10000) {
						// 当code为成功的时候
						this.setState(
							{
								dialogVisible: false,
								expandedKeys: [...expandedKeys, currentNode.key], // 新增的子集需要被展开
							},
							() => {
								Message.success('新增目录成功！')
								this.getDirectoryList()
							}
						)
					} else {
						// 否则提示后端返回的提示语
						Message.error(response.msg || '新增目录失败！')
					}
				}
			})
		} else {
			this.field.validate(async (errors, values) => {
				console.log('errors', errors)
				if (errors) return
				const response = await updateTreeRQ(catalogueType, {
					uuid: currentNode.uuid || currentNode.key,
					...values,
				})
				if (response) {
					if (response.code === 10000) {
						// 当code为成功的时候
						this.setState({
							dialogVisible: false,
						})
						Message.success('修改目录成功！')
						this.getDirectoryList()
					} else {
						// 否则提示后端返回的提示语
						Message.error(response.msg || '修改目录失败！')
					}
				}
			})
		}
	}
	// 树形结构的搜索
	handleSearch = (value) => {
		this.tree.searchNodeHandle(value)
	}
	onTreeRef = (ref) => {
		this.tree = ref
	}
	// 树节点展开
	onExpand = (keys, record) => {
		console.log('record====', record)
		this.setState({
			expandedKeys: keys,
		})
	}
	// 删除目录当前选中的节点
	deleteCurrentHandle = () => {
		const { onSelectedHandle } = this.props
		this.setState(
			{
				selectedKeys: [],
				currentCatalogueName: '',
				isShowCurrent: false,
			},
			() => {
				// 抛出当前选中的节点信息
				if (onSelectedHandle) {
					onSelectedHandle({})
				}
			}
		)
	}
	render () {
		const formItemLayout = {
			labelCol: {
				span: 7,
			},
			wrapperCol: {
				span: 17,
			},
		}
		const {
			treeData,
			currentCatalogueName,
			dialogVisible,
			dialogTitle,
			dialogType,
			isShowCurrent,
			expandedKeys,
			selectedKeys,
		} = this.state
		const { selectable, maxLevel, readOnly } = this.props
		const init = this.field.init
		return (
			<div className="catalogue_container">
				<Dialog
					style={{ width: 500 }}
					title={dialogTitle}
					visible={dialogVisible}
					onOk={this.onSubmitForCatalogue}
					onCancel={() => {
						this.setState({ dialogVisible: false })
					}}
					onClose={() => {
						this.setState({ dialogVisible: false })
					}}
				>
					<Form {...formItemLayout} field={this.field}>
						<FormItem
							label={dialogType === 'create' ? '新建目录名称：' : '修改目录名称：'}
							hasFeedback
							required
							requiredMessage="目录名称不能为空"
						>
							<Input
								placeholder={
									dialogType === 'create' ? '请输入目录名称' : '请输入目录名称'
								}
								maxLength={50}
								hasLimitHint
								{...init('name', {
									rules: [
										{
											required: true,
											message: '目录名称不能为空',
										},
										{
											validator: NoSpace
										}
									],
								})}
							/>
						</FormItem>
						{/* <FormItem
  						label={dialogType === 'create' ? '新建目录描述' : '修改目录描述'}
  						hasFeedback
  						required
  						requiredMessage="目录描述不能为空"
  					>
  						<Input.TextArea placeholder={dialogType === 'create' ? '请输入目录描述' : '请输入目录描述'} name="desc" />
  					</FormItem> */}
					</Form>
				</Dialog>
				<Search
					className="catalogue_search"
					type="secondary"
					size="large"
					hasIcon={false}
					searchText={<span className="catalogue_search_btn">搜索</span>}
					onSearch={this.handleSearch}
					onChange={this.handleSearch}
					placeholder='请输入目录名称'
				/>
				<div className="catalogue_tree_box">
					{selectable && currentCatalogueName && isShowCurrent ? (
						<div className="catalogue_currentTree_box">
							<div className='catalogue_selected_tooltip'>
								<span>当前选中：</span>
								<b>
									<i className='catalogue_selected_name'>{currentCatalogueName}</i>
									<IconFont
										className="iconStyle"
										size='small'
										type="iconclose-circle"
										onClick={this.deleteCurrentHandle}
									/>
								</b>
							</div>
						</div>
					) : (
						<div className="catalogue_currentTree_box">
							<div className='catalogue_selected_tooltip'
								style={{ cursor: 'default' }}>
								<span>当前选中：</span>
								<b>
									<i className='catalogue_selected_name'>全部</i>
								</b>
							</div>
						</div>
						)}
					<div className='catalogue_tree_container'>
						{readOnly ? null : (
							<div
								className='catalogue_tree_addBtn_box'
								onClick={this.addCatalogueHandle}
							>
								<IconFont
									className="iconStyle_add"
									size='small'
									type="iconplus"
								/>
								<b>
									{treeData.length === 0 ? '添加目录' : '添加根目录'}
								</b>
							</div>
						)}
						{treeData.length > 0 ? (
							<Tree
								maxLevel={maxLevel}
								onRef={this.onTreeRef}
								selectable={selectable}
								className="catalogue_tree"
								onCreateNodeChild={this.onCreateNodeChild}
								onUpdateNode={this.onUpdateNode}
								onDeleteNode={this.onDeleteNode}
								treeData={treeData}
								onExpand={this.onExpand}
								expandedKeys={expandedKeys}
								onSelect={this.onSelectNode}
								selectedKeys={selectedKeys}
								optionable={!readOnly} // 当readOnly为true时 传入表示是只读 那么optionable这里就需要为false
							/>
						) : null}
					</div>
				</div>
			</div>
		)
	}
}

export default CatalogueService
