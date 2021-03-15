//数据共享-我的收藏
//样式文件写在scss的index中
import React from 'react'
import { Dialog, Select } from '@alifd/next'
import './index.scss'
export default class Checklog extends React.Component {
  static defaultProps = {
  	title: '',
  	dataSource: [
  		{ label:'option1', value:'option1' },
  		{ label:'option2', value:'option2' }
  	]
  }
  onChange = (val) => {
  	this.props.onChange(val)
  }
  render () {
  	const {
  		title,
  		selectName,
  		dataSource,
  		visible,
  		value,
  		onClose
  	} = this.props
  	return(
  		<Dialog
  			style={{ width: 600 }}
  			visible={visible}
  			footer={false}
  			title={<h3 className='log_dialog_headTitle'>{title}</h3>}
  			onClose={onClose}
  		>
  			<div className="log_dialog_content">
  				<div className="log_dialog_head">
  					<div className="log_dialog_head_name">{selectName}：</div>
  					<Select
  						style={{ width: 220 }}
  						dataSource={dataSource}
  						onChange={this.onChange}
  						showSearch
  						hasClear
  					/>
  				</div>
  				<div className="log_dialog_body">
  					{value}
  				</div>
  			</div>
  		</Dialog>
  	)
  }
}
