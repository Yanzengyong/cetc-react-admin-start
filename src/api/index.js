/*
 * @Author: Zhangyao
 * @Date: 2020-09-18 11:38:28
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 14:48:45
 */

/**
 * 数据服务系统 首发版
*/
const Config = require('IpConfig')

let Host = Config.Host

if (Config.Host.indexOf('window.location.host') !== -1) {
	const header = Config.Host.split('$')[0]
	const footer = Config.Host.split('}')[1]
	Host = header + window.location.host + footer
}

const LOGIN_URL = Config.LOGIN_URL

const HOME_URL = Config.HOME_URL

const REALTIME_TASK_URL = Config.REALTIME_TASK_URL

export { Host, LOGIN_URL, REALTIME_TASK_URL, HOME_URL }
