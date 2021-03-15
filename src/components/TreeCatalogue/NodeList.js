/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-12-22 09:02:36
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-12-29 10:43:02
 */
/**
 * Handle virtual list of the TreeNodes.
 */

import * as React from 'react'
import TreeNode from './TreeNode'
import { getTreeNodeProps, getKey } from './treeUtil'

export default (props) => {
	const {
		data,
		expandedKeys,
		selectedKeys,
		keyEntities,
		selectable,
	} = props

	const treeNodeRequiredProps = {
		expandedKeys,
		selectedKeys,
		keyEntities,
		selectable,
	}

	return (
		<div>
			{data.map((treeNode) => {
				const {
					pos,
					expanded,
					data: { key, level, ...restProps },
				} = treeNode
				const mergedKey = getKey(key, pos)
				delete restProps.children
				const treeNodeProps = getTreeNodeProps(mergedKey, treeNodeRequiredProps)

				return (
					<TreeNode
						key={key}
						selectable
						style={{ paddingLeft: level * 10 }}
						level={level}
						expanded={expanded}
						{...restProps}
						{...treeNodeProps}
						data={treeNode.data}
					/>
				)
			})}
		</div>
	)
}
