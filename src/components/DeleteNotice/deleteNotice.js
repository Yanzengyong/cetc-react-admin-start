/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-12-22 09:02:36
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-01-04 11:17:04
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Dialog } from '@alifd/next'
import IconFont from '@/components/IconFont'
import PropTypes from 'prop-types'
import './index.scss'

class DeleteNotice extends React.Component {
  static propTypes = {
  	message: PropTypes.string, // 左边栏标题
  	onCancel:PropTypes.func, //点击x，取消当前选中的节点
  	onConfirm:PropTypes.func, //点击x，取消当前选中的节点
  }
  static defaultProps = {
  	message: '删除后无法恢复'
  }
  render () {
  	const {
  		message,
  		onCancel,
  		onConfirm
  	} = this.props
  	return (
  		<Dialog
  			title="提示"
  			visible={true}
  			onOk={onConfirm}
  			onCancel={onCancel}
  			onClose={onCancel}
  			footerActions={['cancel', 'ok']}
  		>
  			<div className="deleteInfo">
  				<IconFont className="alertIcon" type="iconwarning-circle-fill" />
  				{message}，是否继续？
  			</div>
  		</Dialog>
  	)
  }
}


DeleteNotice.newInstance = (properties) => {
	const props = properties || []
	const div = document.createElement('div')
	document.body.appendChild(div)
	ReactDOM.render(React.createElement(DeleteNotice, props), div)
	return {
		destroy () {
			// 销毁
			ReactDOM.unmountComponentAtNode(div)
			document.body.removeChild(div)
		}
	}
}

export default DeleteNotice
