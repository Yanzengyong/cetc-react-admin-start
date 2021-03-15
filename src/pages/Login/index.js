/*
 * @Description:
 * @Version:
 * @Author: Yanzengyong
 * @Date: 2020-09-19 14:24:01
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-09-23 17:59:34
 */
import React from 'react'
import { Form, Input } from '@alifd/next'
import { connect } from 'react-redux'
import { User as UserRedux } from '@/reduxActions'
import './index.scss'

const FormItem = Form.Item

const formItemLayout = {
	wrapperCol: {
		span: 24
	}
}
@connect((state) => (
	{
		user: state.user
	}
), UserRedux)
class LoginPage extends React.Component {

	handleSubmit = (val) => {
		const {
			setUserInfo
		} = this.props
		if (Object.keys(val).length > 0) {
			if (val.username === 'admin' && val.password === 'admin') {
				setUserInfo({
					role: 'admin',
					avatar: 'assets/images/ironman.png',
					name: 'Iron Man',
					token: '13adu8hhbbbasd08911jdh10hd18b'
				})
				this.props.history.replace('/')
			}
			if (val.username === '123' && val.password === '123') {
				setUserInfo({
					role: 'public',
					avatar: 'assets/images/CaptainAmerica.png',
					name: 'Captain America',
					token: '9yhvb813vbdsa9dg71vgoo18h19u1'
				})
				this.props.history.replace('/')
			}
		}
	}

	render () {

		return (
			<div className='login_container'>
				<div className="tip">
					<div className='tip_item'>
						<h3>tourist:</h3>
						<div className='account'>
							username: 123 ; password: 123
						</div>
					</div>
					<div className='tip_item'>
						<h3>admin:</h3>
						<div className='account'>
							username: admin ; password: admin
						</div>
					</div>
				</div>
				<div className="login_box">
					<h1>登陆</h1>
					<Form size='large' style={{ width: 300 }} {...formItemLayout} >
						<FormItem >
							<Input name="username" placeholder="Please Enter Username / 请输入用户名称"/>
						</FormItem>
						<FormItem >
							<Input htmlType="password" name="password" placeholder="Please Enter Password / 请输入密码"/>
						</FormItem>
						<FormItem className='login_submit'>
							<Form.Submit style={{ width: '50%' }} type='primary' onClick={this.handleSubmit}>
								登陆
							</Form.Submit>
						</FormItem>
					</Form>
				</div>
			</div>
		)
	}
}

export default LoginPage
