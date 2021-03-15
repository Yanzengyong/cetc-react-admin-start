/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2021-02-25 14:32:05
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 16:49:20
 */

 /**
	* 备注：这里只能接受字符串，但是可以写'http://${window.location.host}/api/'
	* window.location.host的处理在src/api/index.js
	*/
const Host = 'http://${window.location.host}/api/'
// const Host = 'http://10.1.119.26:50200/'
// const Host = 'http://10.1.119.27:50000/'
// const Host = 'http://172.16.119.13/kyw/api/product/dev/'
// const Host = 'http://172.16.117.172:50200/'
// const Host = `http://${window.location.host}/api/`
// const Host = 'http://10.1.119.26:50200/'

// const LOGIN_URL = 'http://172.16.119.13/kyw/systemlogin/#/login' // 登录页
const LOGIN_URL = 'http://172.16.117.172/systemlogin/#/login' // 登录页

// const HOME_URL = 'http://172.16.119.13/kyw/systemlogin/#/platform/home' // 登录页
const HOME_URL = 'http://172.16.117.172/systemlogin/#/platform/home' // 登录页

const REALTIME_TASK_URL = 'http://10.1.119.26:8188/'

exports.Host = Host
exports.LOGIN_URL = LOGIN_URL
exports.HOME_URL = HOME_URL
exports.REALTIME_TASK_URL = REALTIME_TASK_URL
