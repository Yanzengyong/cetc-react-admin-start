/* eslint-disable no-unused-vars */
import React from 'react'
import { NodeMenu, EdgeMenu, GroupMenu, MultiMenu, CanvasMenu, ContextMenu } from 'gg-editor'
import MenuItem from './MenuItem'
import './index.scss'

const FlowContextMenu = ({ type, onClick }) => {
	if (type === 'justDelet') {
		return (
			<ContextMenu className='contextMenu'>
				<NodeMenu>
					<MenuItem icon='icondelete' command="delete" text='删除' />
				</NodeMenu>
				<EdgeMenu>
					<MenuItem icon='icondelete' command="delete" text='删除' />
				</EdgeMenu>
			</ContextMenu>
		)
	} else {
		return (
			<ContextMenu className='contextMenu'>
				<NodeMenu>
					<MenuItem icon='icondelete' command="delete" text='删除' />
					<MenuItem icon='iconsetting' command='set' text='组件设置' />
					{/* <MenuItem icon='iconperview' text='查看结果' onClick={(text) => {}}/> */}
				</NodeMenu>
				<EdgeMenu>
					<MenuItem icon='icondelete' command="delete" text='删除' />
				</EdgeMenu>
				{/* <GroupMenu>
					<MenuItem command="copy" />
					<MenuItem command="delete" />
					<MenuItem command="unGroup" icon="ungroup" text="Ungroup" />
				</GroupMenu>
				<MultiMenu>
					<MenuItem command="copy" />
					<MenuItem command="paste" />
					<MenuItem command="addGroup" icon="group" text="Add Group" />
					<MenuItem command="delete" />
				</MultiMenu>
				<CanvasMenu>
					<MenuItem command="undo" />
					<MenuItem command="redo" />
					<MenuItem command="pasteHere" icon="paste" text="Paste Here" />
				</CanvasMenu> */}
			</ContextMenu>
		)
	}
}

export default FlowContextMenu
