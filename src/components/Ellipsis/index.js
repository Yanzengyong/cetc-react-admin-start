/*
 * @Author: Zhangyao
 * @Date: 2020-08-04 10:55:23
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-04 15:39:21
 */
/**
 * eg:
 *    <Ellipsis alignCenter text={item.description}/>
 * 说明：
 * alignCenter  文字是否居中 bool
 * style  行内样式 object
 * text 文字内容 string
 */
import React from 'react'
import { Balloon } from '@alifd/next'
import './index.scss'

const ellipsis = ({ text, style, alignCenter, line, className }) => {
	const ellipsisText = (
		<div
			style={alignCenter ? { textAlign: 'left', ...style } : style}
			className={`ellipsisBox ${className}`}
		>
			<div className={line === 2 ? 'ellipsis2' : 'ellipsis'}>
				{text}
			</div>
		</div>
	)

	return (
		<Balloon
			closable={false}
			type="primary"
			needAdjust
			trigger={ellipsisText}
			align="b"
			style={{
				maxWidth: window.innerWidth / 3.5,
				maxHeight: '150px',
				overflow: 'scroll',
			}}
		>
			{text}
		</Balloon>
	)
}

export default ellipsis
