/*
 * @Author: ShenLing
 * @Date: 2021-01-05 15:47:22
 * @LastEditors: Shenling
 * @LastEditTime: 2021-01-05 17:52:31
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { Dialog, DatePicker, Button } from '@alifd/next'
import PropTypes from 'prop-types'
import './index.scss'
import moment from 'moment'

class SubscriptionDialog extends React.Component {
	state = {
		expireDate: ''
	}

	render () {
		const {
			title,
  		onCancel,
  		onConfirm
		} = this.props

		const disabledDate = (date) => {
			const currentDate = moment()
			return date.valueOf() <= currentDate.valueOf()
		}

  	return (
  		<Dialog
  			title={title}
  			visible={true}
				onOk={() => {
					onConfirm(this.state.expireDate)
				}}
  			onCancel={onCancel}
  			onClose={onCancel}
				footerActions={['cancel', 'ok']}
				footerAlign="right"
				okProps={{ children: '确认订阅' }}
  		>
  			<div>
					<span><font color="red">* </font>API到期时间：</span>
					<span>
						<DatePicker
							disabledDate={disabledDate}
							value={this.state.expireDate}
							onChange={(v) => {
								this.setState({ expireDate: v })
							}}
						/>
					</span>
  			</div>
  		</Dialog>
  	)
  }
}

SubscriptionDialog.newInstance = (properties) => {
	const props = properties || []
	const div = document.createElement('div')
	document.body.appendChild(div)
	ReactDOM.render(React.createElement(SubscriptionDialog, props), div)
	return {
		destroy () {
			// 销毁
			ReactDOM.unmountComponentAtNode(div)
			document.body.removeChild(div)
		}
	}
}

export default SubscriptionDialog

SubscriptionDialog.defaultProps = {
	title: '订阅API'
}

SubscriptionDialog.propTypes = {
	title: PropTypes.string, // 对话框标题
}
