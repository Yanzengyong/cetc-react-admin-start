/*
 * @Author: ShenLing
 * @Date: 2020-12-15 15:53:40
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 17:49:52
 */

import React from 'react'
import './index.scss'
import moment from 'moment'

export default class Main extends React.Component {
	render () {
		return (
			<div className='react_admin_template_main'>
				<div className="container">
					<div className="item"></div>
					<div className="item"></div>
					<div className="item"></div>
					<div className="item"></div>
					<div className="item"></div>
					<div className="item"></div>
					<div className="item"></div>
					<div className="item"></div>
				</div>

				<div className="text-box">
					<span className="text">{moment(new Date()).format('YYYY-MM-DD')}</span>
				</div>
			</div>
		)
	}
}
