
import * as React from 'react'
import classNames from 'classnames'
import { TreeContext } from './contextTypes'
import { convertNodePropsToEventData } from './treeUtil'
import IconFont from '@/components/IconFont'
import './index.scss'

const ICON_OPEN = 'open'
const ICON_CLOSE = 'close'

const defaultTitle = '暂无'

class InternalTreeNode extends React.Component {

  state = {
		showOpt: false,
		titleX: 0,
		titleY: 0
  }

  componentDidMount () {
		// this.syncLoadData(this.props)
  }

  componentDidUpdate () {
  	// this.syncLoadData(this.props)
  }

  // 节点当前状态
  getNodeState = () => {
  	const { expanded } = this.props

  	return expanded ? ICON_OPEN : ICON_CLOSE
  };

  // 是否有子集
  hasChildren = () => {
  	const { eventKey } = this.props
  	const {
  		context: { keyEntities },
  	} = this.props

  	const { children } = keyEntities[eventKey] || {}

  	return !!(children || []).length
  };

  onExpand = e => {
  	const {
  		context: { onNodeExpand, expanded },
		} = this.props
		console.log(expanded)
  	onNodeExpand(e, convertNodePropsToEventData(this.props))
  };

  // 切换器的渲染
  renderSwitcher = () => {
		const { expanded, level } = this.props

		console.log(level)

		if (this.hasChildren()) {
			// 注释部分实现的功能：第一级为文件icon，第二级以后为箭头
			// return (
			// 	level === 0 ? (
			// 		<IconFont
			// 			onClick={this.onExpand}
			// 			className='switcher'
			// 			type={expanded ? 'iconfolder-open-fill' : 'iconfolder-fill'}
			// 		/>
			// 	): (
			// 		<IconFont
			// 			onClick={this.onExpand}
			// 			className={classNames('switcher',
			// 				`treenode-switcher-${expanded ? 'open' : 'close'}`)}
			// 			type='iconicon-triangle-right'
			// 		/>
			// 	)
			// )
			return (
				<IconFont
					onClick={this.onExpand}
					className='switcher'
					type={expanded ? 'iconfolder-open-fill' : 'iconfolder-fill'}
				/>
			)
  	}
		return <div className='switcher_empty'>
				<IconFont
					className='switcher'
					type='iconfile-text'
				/>
		</div>
	};

	// 渲染文字函数
	renderTitle = () => {
		const { title, data } = this.props
  	const {
  		context: { titleRender, targetNodeList, optionable },
  	} = this.props

  	const currentNode = targetNodeList.find((item) => {
  		return (item.node ?? {}).title === data.title
		})

  	// 目录title
  	let titleNode
  	if (typeof title === 'function') {
  		titleNode = title(data)
  	} else if (titleRender) {
  		titleNode = titleRender(data)
  	} else {
  		titleNode = title
		}

  	const $title = currentNode ? (
  		<span
				className={'tree_title'}
				style={{ backgroundColor: '#c7edff' }}
  		>
				<b
					dangerouslySetInnerHTML={
						{
							__html: titleNode.toString().split(currentNode.node.keyword).join(
						`<span style="color: #EB7E10; font-weight: 600">${currentNode.node.keyword}</span>`
					) }}
				/>
				{optionable ? this.renderOptions() : null}
			</span>
  	) : (
			<span className={'tree_title'}>
				<b>{titleNode}</b>
				{optionable ? this.renderOptions() : null}
			</span>
		)

		return $title
	}

  // 选择器的渲染
  renderSelector = () => {

		const { title, selected } = this.props
  	return (
  		<span
  			ref={this.setSelectHandle}
  			// title={typeof title === 'string' ? title : ''}
  			className={classNames(
  				'treenode',
  				selected && 'node-selected',
  			)}
  			onMouseEnter={this.onMouseEnter}
  			onMouseLeave={this.onMouseLeave}
  			onClick={this.onSelectorClick}
  		>
				{this.renderTitle()}
  		</span>
  	)
	}

	// 渲染目录自定义title
	renderElementTitle = () => {
		const { title, data } = this.props
		const { showOpt, titleX, titleY } = this.state
  	const {
  		context: { targetNodeList }
  	} = this.props

  	const currentNode = targetNodeList.find((item) => {
  		return (item.node ?? {}).title === data.title
		})

		const titleNode = () => {
			return currentNode ? (
				<span
					className={'element_title'}
					style={{ top: titleY + 20, left: titleX }}
				>
					<b
						dangerouslySetInnerHTML={
							{
								__html: title.toString().split(currentNode.node.keyword).join(
							`<span style="color: #EB7E10; font-weight: 700">${currentNode.node.keyword}</span>`
						) }}
					/>
				</span>
			) : (
				<span className={'element_title'} style={{ top: titleY + 20, left: titleX }}>
					<b>{title}</b>
				</span>
			)
		}

		if (showOpt) {

			return titleNode()

		}

	}

  // 点击选择函数
  onSelectorClick = e => {
  	const {
  		context: { onNodeSelect, selectable },
  	} = this.props

  	if (selectable) { // 允许选择
  		onNodeSelect(e, convertNodePropsToEventData(this.props))
  	}
  }
  // 新增目录
  onCreateNode = (e) => {
  	const {
  		context: { onCreateNodeChild },
		} = this.props
		e.stopPropagation()
  	onCreateNodeChild(e, convertNodePropsToEventData(this.props))
	}

  // 编辑目录
  onUpdateNode = (e) => {
  	const {
  		context: { onUpdateNode },
		} = this.props
		e.stopPropagation()
  	onUpdateNode(e, convertNodePropsToEventData(this.props))
	}

  // 目录
  onDeleteNode = (e) => {
  	const {
  		context: { onDeleteNode }
		} = this.props
		e.stopPropagation()
  	onDeleteNode(e, convertNodePropsToEventData(this.props))
	}

  // 渲染选项功能
  renderOptions = () => {
  	const {
  		level,
  		context: { maxLevel }
  	} = this.props
		const MAX = maxLevel ?? Infinity

		return this.state.showOpt ?
		(
			<div className='treenode_options_box'>
				{MAX > level ?
					<IconFont
					onClick={this.onCreateNode}
					size='small'
					type='iconplus-circle'
					className='treenode_options'
				/> : null}
				<IconFont
					onClick={this.onUpdateNode}
					size='small'
					type='iconedit-square'
					className='treenode_options'
				/>
				<IconFont
					onClick={this.onDeleteNode}
					size='small'
					type='iconminus-circle'
					className='treenode_options treenode_options_del'
				/>
			</div>
		)	: null

	}

  render () {
  	const {
  		style
  	} = this.props

  	return (
  		<div
  			onMouseEnter={
  				(e) => {
  					this.setState({
							showOpt: true,
							titleX: e.clientX,
							titleY: e.clientY
  					})
  				}
  			}
  			onMouseLeave={
  				() => {
  					this.setState({
  						showOpt: false
  					})
  				}
  			}
  			className='treenode_item'
  			style={style}
  		>
  			{this.renderSwitcher()}
  			{this.renderSelector()}
				{this.renderElementTitle()}
  		</div>
  	)
  }
}

const ContextTreeNode = props => (
	<TreeContext.Consumer>
		{context => <InternalTreeNode {...props} context={context} />}
	</TreeContext.Consumer>
)

ContextTreeNode.displayName = 'TreeNode'

ContextTreeNode.defaultProps = {
	title: defaultTitle,
}

ContextTreeNode.isTreeNode = 1

export { InternalTreeNode }

export default ContextTreeNode
