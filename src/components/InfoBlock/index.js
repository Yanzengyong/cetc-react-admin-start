import React from 'react'
import './index.scss'
import IconFont from '@/components/IconFont'
// import moment from 'moment'
class InfoBlock extends React.Component {
	render () {
  	const {
  		icon,
  		title
  	} = this.props
  	return (
  		<div className="infoBlock_container">
  			<div className="infoBlock_head">
  				<IconFont className="infoBlock_iconStyle" type={icon} />
  				<span>{ title }</span>
  			</div>
  			<div className="infoBlock_body">
  				{this.props.children}
  			</div>
  		</div>
  	)
	}
}

export default InfoBlock
