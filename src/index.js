/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-08-17 09:06:45
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-02-25 10:58:12
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Routes from '@/routes'
import 'moment/locale/zh-cn'
import { Provider } from 'react-redux'
import store from '@/store'
import './index.scss'
import '@alifd/theme-dataservices/dist/next.css'

ReactDOM.render(
	<Provider store={store}>
		<Routes />
	</Provider>,
	document.getElementById('root')
)

