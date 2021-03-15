import React from 'react'
import IconFont from '../IconFont'
import Ellipsis from '@/components/Ellipsis'
import { Tag } from '@alifd/next'
import './index.scss'

class ModelCard extends React.Component {
  state = {
  	showMore: false
  }
  static defaultProps = {
  	isAdd: null,
  	title: null,
  	name: null,
  	time: null,
  	desc: null,
  	className: null,
  	userList: '',
  	uuid: null,
  	clickhandle: null,
  	actionhandle: null
  }
  moreClickHandle = (e) => {
  	e.stopPropagation()
  	e.nativeEvent.stopImmediatePropagation()
  	this.setState({
  		showMore: true
  	})
  }
  closeMoreBtnHandle = (uuid) => {
  	if (this.state.showMore) {
  		this.setState({
  			showMore: false
  		})
  	} else {
  		this.props.clickhandle(uuid)
  	}
  }
  actionBtnHandle = (type, info) => {
  	this.setState({
  		showMore: false
  	}, () => {
  		this.props.actionhandle(type, info)
  	})
  }
  render () {
  	const { isAdd, title, name, time, desc, className, onClick, userList, uuid, ...other } = this.props
  	const { showMore } = this.state
  	const info = { title, name, time, desc, userList, uuid }
  	return (
  		<div>
  			{isAdd ? (
  				<div
  					onClick={onClick}
  					className='add_style'
  				>
  					<IconFont className='add_icon_style' type='iconadd' />
  					<h5>新建应用</h5>
  				</div>
  			) : (
  				<div onClick={() => { this.closeMoreBtnHandle(uuid) }} {...other} className={`${className} card_container`}>
  					<div className='card_header'>
  						<h3>{title}</h3>
  						<IconFont size='large' onClick={this.moreClickHandle} className='more_icon' type='iconmore' />
  						{showMore ? (
  						  <div className="action_box">
  								<ul>
  									<li onClick={() => this.actionBtnHandle('edit', info)}>编辑应用</li>
  									<li onClick={() => this.actionBtnHandle('dele', info)}>删除应用</li>
  								</ul>
  							</div>
  						) : (null)}
  					</div>
  					<div className="card_body">
  						<div className="card_one_box">
  							<div className="card_name">
  								<b>创建人：</b>
  								<Ellipsis text={name ? name : '暂无'} />
  							</div>
  							<div className="card_time">
  								<b>创建时间：</b>
  								<Ellipsis text={time ? time : '暂无'} />
  							</div>
  						</div>
  						<div className="card_two_box">
  							<b>应用描述：</b>
  								<Ellipsis text={desc ? desc : '暂无'} />
  						</div>
  						<div style={{ marginTop: 6 }} className="card_three_box">
  							<b>成员：</b>
  							<Ellipsis text={userList ?
  								userList.split(',').map((item) => <Tag key={item} style={{ marginRight: 5 }} color='#e26a2e' size='small' type='primary'>{item}</Tag>) : '暂无'
  							} />
  						</div>
  					</div>
  				</div>
  			)}
  		</div>
  	)
  }
}

export default ModelCard
