/**
 * Legacy code. Should avoid to use if you are new to import these code.
 */

import React from 'react'
import TreeNode from './TreeNode'


export function arrDel (list, value) {
	const clone = list.slice()
	const index = clone.indexOf(value)
	if (index !== -1) {
		clone.splice(index, 1)
	}
	return clone
}

export function arrAdd (list, value) {
	const clone = list.slice()
	if (clone.indexOf(value) === -1) {
		clone.push(value)
	}
	return clone
}

export function posToArr (pos) {
	return pos.split('-')
}

export function getPosition (level, index) {
	return `${level}-${index}`
}

export function isTreeNode (node) {
	return node && node.type && node.type.isTreeNode
}

export function getDragNodesKeys (dragNodeKey, keyEntities) {
	const dragNodesKeys = [dragNodeKey]

	const entity = keyEntities[dragNodeKey]
	function dig (list = []) {
		list.forEach(({ key, children }) => {
			dragNodesKeys.push(key)
			dig(children)
		})
	}

	dig(entity.children)

	return dragNodesKeys
}


/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
export function calcSelectedKeys (selectedKeys, props) {
	if (!selectedKeys) return undefined

	const { multiple } = props
	if (multiple) {
		return selectedKeys.slice()
	}

	if (selectedKeys.length) {
		return [selectedKeys[0]]
	}
	return selectedKeys
}

const internalProcessProps = (props) => props
export function convertDataToTree (
	treeData,
	processor,
) {
	if (!treeData) return []

	const { processProps = internalProcessProps } = processor || {}
	const list = Array.isArray(treeData) ? treeData : [treeData]
	return list.map(
		({ children, ...props }) => {
			const childrenNodes = convertDataToTree(children, processor)

			return <TreeNode {...processProps(props)}>{childrenNodes}</TreeNode>
		},
	)
}


/**
 * 如果使用 `autoExpandParent` 获取他的父亲节点的列表，此操作不适用于搜索用
 * @param keyList  展开的节点list
 * @param keyEntities 以key为key的treedata键值对对象
 */
export function conductExpandParent (keyList, keyEntities) {
	const expandedKeys = new Set()

	function conductUp (key) {
		if (expandedKeys.has(key)) return

		const entity = keyEntities[key]
		if (!entity) return

		expandedKeys.add(key)

		const { parent, node } = entity

		if (node.disabled) return

		if (parent) {
			conductUp(parent.key)
		}
	}

	(keyList || []).forEach(key => {
		conductUp(key)
	})
	return [...expandedKeys]
}

// 仅仅打开该节点的父节点
export function onlyExpandParent (keyList, keyEntities) {
	const expandedKeys = new Set()
	function conductUp (key) {

		const entity = keyEntities[key]
		if (!entity) return

		const { parent, node } = entity
		if (node.disabled) return

		if (parent) {
			expandedKeys.add(parent.key)
			conductUp(parent.key)
		}
	}

	(keyList || []).forEach(key => {
		conductUp(key)
	})
	return [...expandedKeys]
}

// 通过名称去搜索符合的所有keys
