import warning from 'rc-util/lib/warning'

export function getPosition (level, index) {
	return `${level}-${index}`
}

export function isTreeNode (node) {
	return node && node.type && node.type.isTreeNode
}

export function getKey (key, pos) {
	if (key !== null && key !== undefined) {
		return key
	}
	return pos
}

export function getTreeNodeProps (key, {
	// expandedKeys,
	selectedKeys,
	keyEntities,
	selectable
}) {
	const entity = keyEntities[key]

	const treeNodeProps = {
		eventKey: key,
		// expanded: expandedKeys.indexOf(key) !== -1,
		selected: selectedKeys.indexOf(key) !== -1,
		selectable: selectable,
		pos: String(entity ? entity.pos : '')
	}

	return treeNodeProps
}

export function convertDataToEntities (
	dataNodes,
	{
		initWrapper,
		processEntity,
		onProcessFinished,
	} = {},
	externalGetKey,
) {
	const posEntities = {}
	const keyEntities = {}
	let wrapper = {
		posEntities,
		keyEntities,
	}

	if (initWrapper) {
		wrapper = initWrapper(wrapper) || wrapper
	}

	traverseDataNodes(
		dataNodes,
		item => {
			const { node, index, pos, key, parentPos, level } = item
			const entity = { node, index, key, pos, level }

			const mergedKey = getKey(key, pos)

			posEntities[pos] = entity
			keyEntities[mergedKey] = entity

			// Fill children
			entity.parent = posEntities[parentPos]
			if (entity.parent) {
				entity.parent.children = entity.parent.children || []
				entity.parent.children.push(entity)
			}

			if (processEntity) {
				processEntity(entity, wrapper)
			}
		},
		externalGetKey,
	)

	if (onProcessFinished) {
		onProcessFinished(wrapper)
	}

	return wrapper
}

// 转换成名称对象列表
export function convertDataToTitleEntities (
	dataNodes,
	keyword
) {
	const titleEntities = {}
	let wrapper = {
		titleEntities
	}

	traverseDataNodes(
		dataNodes,
		item => {
			const { node, index, pos, key, level } = item
			const entity = { node: { ...node, keyword: keyword }, index, key, pos, level }
			titleEntities[node.title] = entity
		}
	)

	return wrapper
}

// 遍历treeData
export function traverseDataNodes (
	dataNodes,
	callback,
	externalGetKey,
) {
	let syntheticGetKey
	if (externalGetKey) {
		if (typeof externalGetKey === 'string') {
			syntheticGetKey = (node) => (node)[externalGetKey]
		} else if (typeof externalGetKey === 'function') {
			syntheticGetKey = (node) => (externalGetKey)(node)
		}
	} else {
		syntheticGetKey = (node, pos) => getKey(node.key, pos)
	}

	function processNode (
		node,
		index,
		parent,
	) {
		const children = node ? node.children : dataNodes
		const pos = node ? getPosition(parent.pos, index) : '0'

		// 如果不是根节点的话
		if (node) {
			const key = syntheticGetKey(node, pos)
			const data = {
				node,
				index,
				pos,
				key,
				parentPos: parent.node ? parent.pos : null,
				level: parent.level + 1,
			}

			callback(data)
		}

		// 处理children节点
		if (children) {
			children.forEach((subNode, subIndex) => {
				processNode(subNode, subIndex, {
					node,
					pos,
					level: parent ? parent.level + 1 : -1,
				})
			})
		}
	}

	processNode(null)
}

// 展平数据，即被显示出来的所有数据，treeNodeList是初始化的所有数据
export function flattenTreeData (treeNodeList, expandedKeys) {
	const expandedKeySet = new Set(expandedKeys === true ? [] : expandedKeys)
	const flattenList = []

	function dig (list, parent) {
		return list.map((treeNode, index) => {
			const pos = getPosition(parent ? parent.pos : '0', index)
			const mergedKey = getKey(treeNode.key, pos)
			const level = parent ? parent.level + 1 : 0
			const expanded = expandedKeys.indexOf(treeNode.key) !== -1 ? true : false
			// Add FlattenDataNode into list
			const flattenNode = {
				...treeNode,
				parent,
				pos,
				level,
				children: null,
				expanded,
				data: treeNode,
			}

			flattenList.push(flattenNode)

			// Loop treeNode children
			if (expandedKeys === true || expandedKeySet.has(mergedKey)) {
				flattenNode.children = dig(treeNode.children || [], flattenNode)
			} else {
				flattenNode.children = []
			}

			return flattenNode
		})
	}

	dig(treeNodeList)
	return flattenList
}

export function convertNodePropsToEventData (props) {

	const {
		data,
		expanded,
		selected,
		pos,
	} = props
	// 判断props属性是否存在于传入的props中，
	const eventData = {
		...data,
		expanded,
		selected,
		pos,
	}
	if (!('props' in eventData)) {
		Object.defineProperty(eventData, 'props', {
			get () {
				warning(
					false,
					'Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`.',
				)
				return props
			},
		})
	}

	return eventData
}
