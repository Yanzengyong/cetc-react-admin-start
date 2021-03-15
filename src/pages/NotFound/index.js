/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-18 09:57:17
 */
import React from 'react'
import CountTo from 'react-count-to'
import './index.scss'

class NotFound extends React.Component {

  randomNum = () => {
  	return Math.floor(Math.random() * 9) + 1
  }

  renderDynamicNum = (value, className) => {
  	return (<span className={`digit ${className}`}>{value}</span>)
  }

  render () {
		const { Auth } = this.props

  	return (
  		<div className="error">
  			<div className="container_found">
  				<div className="container_error_404">
  					<div className="clip">
  						<CountTo to={4} speed={1000}>{(val) => this.renderDynamicNum(val, 'thirdDigit')}</CountTo>
  					</div>
  					<div className="clip">
  						<CountTo from={4} to={0} speed={1000}>{(val) => this.renderDynamicNum(val, 'secondDigit')}</CountTo>
  					</div>
  					<div className="clip">
  						<CountTo to={Auth && Auth === 'no' ? 3 : 4} speed={1000}>{(val) => this.renderDynamicNum(val, 'firstDigit')}</CountTo>
  					</div>
  					<div className="msg">
              ERROR!
  						<span className="triangle"></span>
  					</div>
  				</div>
					<h2>{Auth && Auth === 'no' ? '对不起！你没有访问该页面的权限' : '对不起！未能找到该页面'}</h2>
  			</div>
  		</div>
  	)
  }
}

export default NotFound
