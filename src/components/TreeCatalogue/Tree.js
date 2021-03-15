import * as React from 'react'
import warning from 'rc-util/lib/warning'
import { TreeContext } from './contextTypes'
import {
	conductExpandParent,
	onlyExpandParent,
	// calcSelectedKeys,
	arrAdd,
	arrDel,
} from './util'

import {
	flattenTreeData,
	convertDataToTitleEntities,
	convertDataToEntities,
} from './treeUtil'
import NodeList from './NodeList'
import TreeNode from './TreeNode'
import './index.scss'


class Tree extends React.Component {
  static defaultProps = {
  	selectable: true, // 是否支持选中
  	optionable: true, // 是否存在编辑烂
  	defaultExpandParent: true, // 默认展开父节点
  	autoExpandParent: true, // 自动暂开父节点
  	defaultExpandAll: false, // 默认展开所有节点
  	defaultExpandedKeys: [], // 默认展开的节点数组
  	defaultSelectedKeys: [], // 默认选中的节点数组
  	maxLevel: null, // 最大层级限制
  	titleRender: '' // 标题
  }

  static TreeNode = TreeNode

  state = {
  	keyEntities: {},
  	selectedKeys: [],
  	checkedKeys: [],
  	expandedKeys: [],
  	treeData: [],
  	flattenNodes: [],
		targetNodeList: [],
  }

  componentDidMount () {
  	this.props.onRef(this)
  }

  static getDerivedStateFromProps (props, prevState) {
  	const { prevProps } = prevState
  	const newState = {
  		prevProps: props,
  	}

  	function needSync (name) { // 第一次传入并且存在需要的值、或者第1+次传入，并且传入的值于已经存在的不相同
  		return (!prevProps && name in props) || (prevProps && prevProps[name] !== props[name])
  	}

  	// 处理treedata数据，添加level属性
  	const processNode = (data, index) => {
  		index = index || 0
  		return data.map((item) => {
  			if (item.children && item.children.length > 0) {
  				const childItem = processNode(item.children, index + 1)
  				return {
  					...item,
  					level: index,
  					children: childItem
  				}
  			} else {
  				return {
  					...item,
  					level: index
  				}
  			}
  		})
  	}
  	// ================== 节点 ==================
  	let treeData

  	// 如果treeData
  	if (needSync('treeData')) {
  		treeData = processNode(props.treeData)
  	}
  	// 保存所有显示的节点信息数组 转换treeData 成 keyEntities
  	if (treeData) {
  		// 这里可以手动加入判断添加level属性
  		newState.treeData = treeData
  		const entitiesMap = convertDataToEntities(treeData)
  		newState.keyEntities = {
  			...entitiesMap.keyEntities,
  		}
  	}


  	const keyEntities = newState.keyEntities || prevState.keyEntities

  	// ================ 展开节点keys =================
  	if (needSync('expandedKeys') || (prevProps && needSync('autoExpandParent'))) {
  		newState.expandedKeys =
        props.autoExpandParent || (!prevProps && props.defaultExpandParent)
        	? conductExpandParent(props.expandedKeys, keyEntities)
        	: props.expandedKeys
  	} else if (!prevProps && props.defaultExpandAll) {
  		const cloneKeyEntities = { ...keyEntities }
  		newState.expandedKeys = Object.keys(cloneKeyEntities).map(key => cloneKeyEntities[key].key)
  	} else if (!prevProps && props.defaultExpandedKeys) {
  		newState.expandedKeys =
        props.autoExpandParent || props.defaultExpandParent
        	? conductExpandParent(props.defaultExpandedKeys, keyEntities)
        	: props.defaultExpandedKeys
  	}

  	if (!newState.expandedKeys) {
  		delete newState.expandedKeys
  	}
  	// ================ 所有显示的节点 =================
  	if (treeData || newState.expandedKeys) {
  		const flattenNodes = flattenTreeData(
  			treeData || prevState.treeData,
  			newState.expandedKeys || prevState.expandedKeys,
  		)
			newState.flattenNodes = flattenNodes
  	}

  	// ================ 选中的节点数组 =================
  	if (props.selectable) {
  		if (needSync('selectedKeys')) {
  			// newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props)
  			newState.selectedKeys = props.selectedKeys
  		} else if (!prevProps && props.defaultSelectedKeys) {
  			// newState.selectedKeys = calcSelectedKeys(props.defaultSelectedKeys, props)
  			newState.selectedKeys = props.defaultSelectedKeys
  		}
  	}

  	return newState
  }

  // 展开并且高亮搜索出来的结果
  searchNodeHandle = (keyword) => {
  	const { treeData, keyEntities } = this.state
  	const TitleEntities = convertDataToTitleEntities(treeData, keyword).titleEntities
  	let targetNodeList = []
  	if (keyword) {
  		for (let key in TitleEntities) {
  			if (key.indexOf(keyword) !== -1) { // 说明包含
  				targetNodeList.push(TitleEntities[key])
  			}
  		}
  	} else {
  		targetNodeList = []
  	}

  	const expandedKeys = onlyExpandParent(
  		(targetNodeList || []).map((item) => item.key.toString()),
  		keyEntities
  	)

  	const flattenNodes = flattenTreeData(treeData, expandedKeys)

  	this.setState({
  		flattenNodes,
  		expandedKeys,
  		targetNodeList
  	})
  }

  // 选择目录【点击目录名称】
  onNodeSelect = (e, treeNode) => {
  	let { selectedKeys } = this.state
  	const { keyEntities } = this.state
  	const { onSelect, multiple } = this.props
  	const { selected, key } = treeNode
  	const targetSelected = !selected

  	// 更新选中的selectedKeys
  	if (!targetSelected) {
  		selectedKeys = arrDel(selectedKeys, key)
  	} else if (!multiple) {
  		selectedKeys = [key]
  	} else {
  		selectedKeys = arrAdd(selectedKeys, key)
  	}

  	const selectedNodes = selectedKeys
  		.map(selectedKey => {
  			const entity = keyEntities[selectedKey]
  			if (!entity) return null

  			return entity.node
  		})
  		.filter(node => node)

  	this.setUncontrolledState({ selectedKeys })

  	if (onSelect) {
  		onSelect(selectedKeys, {
  			event: 'select',
  			selected: targetSelected,
  			node: treeNode,
  			selectedNodes,
  			nativeEvent: e.nativeEvent,
  		})
  	}
  }

  // 新增子节点
  onCreateNodeChild = (e, treeNode) => {
  	const { onCreateNodeChild } = this.props
  	// 向组件掉用方传值
  	onCreateNodeChild(treeNode)
  }

  // 更新节点
  onUpdateNode = (e, treeNode) => {
  	const { onUpdateNode } = this.props
  	// 向组件掉用方传值
  	onUpdateNode(treeNode)
  }

  // 删除
  onDeleteNode = (e, treeNode) => {
  	const { onDeleteNode } = this.props
  	// 向组件掉用方传值
  	onDeleteNode(treeNode)
  }

  // 处理必须传入的props
  getTreeNodeRequiredProps = () => {
  	const {
  		expandedKeys,
  		selectedKeys,
  		keyEntities,
  	} = this.state
  	return {
  		expandedKeys: expandedKeys || [],
  		selectedKeys: selectedKeys || [],
  		keyEntities,
  	}
  };

  // =========================== 展开 ===========================
  /** 设置 `expandedKeys`. 设置所有暂开的node `flattenNodes`. */
  setExpandedKeys = (expandedKeys) => {
  	const { treeData } = this.state
  	const flattenNodes = flattenTreeData(treeData, expandedKeys)
  	console.log('点开展开后的flattenNodes=====', flattenNodes)
  	// this.setUncontrolledState({ expandedKeys, flattenNodes }, true)
  };

  // 点击展开的按钮
  onNodeExpand = (e, treeNode) => {
  	let { expandedKeys } = this.state
  	// const { onExpand, loadData } = this.props 假设需要异步加载tree数据时
		const { onExpand } = this.props

  	const { key, expanded } = treeNode

  	// 更新选中的key值
  	const index = expandedKeys.indexOf(key) // 查看当前点击的节点是否已经存在于已有展开节点数组中

  	const targetExpanded = !expanded
  	// 当为false时，控制台报警
  	warning(
  		(expanded && index !== -1) || (!expanded && index === -1),
  		'Expand state not sync with index check',
  	)

  	if (targetExpanded) {
  		expandedKeys = arrAdd(expandedKeys, key)
  	} else {
  		expandedKeys = arrDel(expandedKeys, key)
  	}

  	this.setExpandedKeys(expandedKeys)
  	if (onExpand) { // 是否存在手动添加onExpand事件
  		onExpand(expandedKeys, {
  			node: treeNode,
  			expanded: targetExpanded,
  			nativeEvent: e.nativeEvent,
  		})
  	}

  	// Async Load data 展开的同时接受加载新的数据
  	// if (targetExpanded && loadData) {
  	// 	const loadPromise = this.onNodeLoad(treeNode)
  	// 	if (loadPromise) {
  	// 		loadPromise.then(() => {
  	// 			// [Legacy] Refresh logic
  	// 			const newFlattenTreeData = flattenTreeData(this.state.treeData, expandedKeys)
  	// 			this.setUncontrolledState({ flattenNodes: newFlattenTreeData })
  	// 		})
  	// 	}
  	// }
  }

  // 只更新不在props中的值
  setUncontrolledState = (
  	state,
  	atomic,
  	forceState,
  ) => {
  	let needSync = false
  	let allPassed = true
  	const newState = {}
  	Object.keys(state).forEach(name => {
  		if (name in this.props) {
  			allPassed = false
  			return
  		}

  		needSync = true
  		newState[name] = state[name]
  	})
  	if (needSync && (!atomic || allPassed)) {
  		this.setState({
  			...newState,
  			...forceState,
  		})
  	}
  }

  render () {
  	const { flattenNodes, keyEntities, targetNodeList } = this.state
  	const {
  		className,
  		style,
  		tabIndex = 0,
  		selectable,
			optionable,
  		titleRender,
			maxLevel
		} = this.props

  	return (
  		<TreeContext.Provider
  			value={{
					maxLevel,
  				selectable,
					optionable,
  				keyEntities,
  				titleRender,
  				targetNodeList,
  				onCreateNodeChild: this.onCreateNodeChild,
  				onUpdateNode: this.onUpdateNode,
  				onDeleteNode: this.onDeleteNode,
  				onNodeExpand: this.onNodeExpand,
  				onNodeSelect: this.onNodeSelect
  			}}
  		>
  			<div
  				className={className}
  			>
  				<NodeList
  					style={style}
  					data={flattenNodes}
  					tabIndex={tabIndex}
  					{...this.getTreeNodeRequiredProps()}
  				/>
  			</div>
  		</TreeContext.Provider>
  	)
  }
}

export default Tree
