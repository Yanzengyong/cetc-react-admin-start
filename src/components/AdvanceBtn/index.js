import React from 'react'
import { Button } from '@alifd/next'
import './index.scss'
import PropTypes from 'prop-types' // 类型检查

export default class AdvanceBtn extends React.Component {

	render () {
		const { displayAdvance, showAdvance, id } = this.props

		return (
			<Button text type="primary" id={id} onClick={showAdvance} className="advanceBtn_style">
  			<span style={{ marginRight: 5 }}>{displayAdvance ? '-': '+'}</span>
  			<span>高级</span>
  		</Button>
		)
	}
}


// props默认值指定
AdvanceBtn.defaultProps = {
	displayAdvance: false,
	id: 'advanceBtn',
}

AdvanceBtn.propTypes = {
	displayAdvance: PropTypes.bool, // 高级按钮是否展开T/F
	id: PropTypes.string, // 高级按钮区块id名称，用于定位
	showAdvance: PropTypes.func, // 高级按钮点击function
}
