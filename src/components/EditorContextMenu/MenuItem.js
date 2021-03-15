import React from 'react'
import { Command } from 'gg-editor'
import IconFont from '@/components/IconFont'
import './index.scss'

const MenuItem = (props) => {
	const { command, icon, text } = props
	if (command) {
		return (
			<Command name={command} >
				<div className='item'>
					<IconFont type={icon} className='iconStyle' />
					<span>{text}</span>
				</div>
			</Command>
		)
	} else {
		return (
			<div onClick={() => props.onClick(text)} className='item'>
				<IconFont type={icon} className='iconStyle' />
				<span>{text}</span>
			</div>
		)
	}
}

export default MenuItem
