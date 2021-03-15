/*
 * @Author: Zhangyao
 * @Date: 2020-08-04 10:55:23
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-02-22 16:01:33
 */
/*
组件说明： 用Fusion组件引用iconfont工程图标文件

使用样例：
import IconFont from '@/components/IconFont'
<IconFont type="iconyulan" size="xs" />
<IconFont type="iconyulan" size="xs" style={{ color: red}}/>

使用文档：
1. 图标大小： 参数：size   可选值：xxs, xs, small, medium, large, xl, xxl, xxxl, inherit  默认值：medium
2. 图标样式： 参数：type   可选值：iconfont工程文件图标名称，直接复制粘贴即可

其他说明：
若更新iconfont图标库，则需将新的URL复制替换下方的sriptUrl
*/

import React from 'react'
import { Icon } from '@alifd/next'

const CustomIcon = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_2290362_mv94iu2ni9s.js',
	// scriptUrl: 'iconfont.js' // 离线引用iconfont包方法（前提，需将下载后的iconfont包放入public文件夹即可"
})

export default class IconFont extends React.Component {
	onClickIcon = () => {
		console.log('icon')
	}
	render () {
		const { type, size, style, className, onClick, original } = this.props

		return original ? (
			<Icon
				role="button"
				aria-label
				onClick={onClick}
				className={className}
				type={type}
				size={size}
				style={style}
			/>
		) : (
			<CustomIcon
				role="button"
				aria-label
				onClick={onClick}
				className={className}
				type={type}
				size={size}
				style={style}
			/>
		)
	}
}
