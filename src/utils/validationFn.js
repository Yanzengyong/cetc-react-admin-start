/*
 * @Author: Zhangyao
 * @Date: 2020-09-28 10:45:00
 * @LastEditors: Shenling
 * @LastEditTime: 2020-12-02 14:25:08
 */
export {
	NoSpace, //不能输入空格
	NoChinese, //不能输入中文
	Port, //请输入正确的端口号
	IpAddress, // 请输入正确的IP地址
	NumEng, //名称只允许数字英文下划线
	Eng_, //只允许输入数字下划线
	NumChineseEnglish, //只允许输入中文、英文、数字但不包括下划线等符号
	Email, //请输入正确的email地址
	OnlyCode, //只允许输入字符
	Url, //url验证
	ZeroToThousand, //1~1000的整数
	NegAndPos, //只能包含正负整数
	onlyChinese, // 只能输入中文、数字、下划线
	NoCommaQuota, // 不可输入英文单双引号、英文逗号
	NoNumChinese, //只能输入英文、特殊字符

}
const NoCommaQuota = (value) => {
	var reg = /[\'\,\"]+/
	let result = reg.test(value)
	return result
}
const NoSpace = (rule, value, callback) => {
	var reg = /^\S+$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('该输入框不能输入空格')
	}
}
const onlyChinese = (rule, value, callback) => {
	var reg = /^[\u4e00-\u9fa50-9_]{0,}$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('该输入框仅能输入中文、数字、下划线')
	}
}
const NoNumChinese = (rule, value, callback) => {
	var reg = /^[\u4e00-\u9fa50-9]{0,}$/
	let result = reg.test(value)
	if (!result) {
		return callback()
	} else {
		return callback('该输入框仅能输入英文、特殊字符')
	}
}
const NoChinese = (rule, value, callback) => {
	var reg = /[\u4e00-\u9fa5]/g
	let result = reg.test(value)
	if (!result) {
		return callback()
	} else {
		return callback('该输入框不能输入中文')
	}
}
const Port = (rule, value, callback) => {
	var reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('请输入正确的端口号')
	}
}
const IpAddress = (rule, value, callback) => {
	var reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('请输入正确的IP地址')
	}
}
const Eng_=(rule, value, callback)=>{
	var reg = /^[A-Za-z_]+$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('只允许输入英文和下划线，例如API_demo')
	}
}
const NumEng = (rule, value, callback) => {
	var reg = /^[A-Za-z0-9_]+$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('只允许输入数字、英文和下划线，例如API_demo_1')
	}
}
const NumChineseEnglish = (rule, value, callback) => {
	var reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('只允许输入中文、英文、数字但不包括下划线等符号')
	}
}
const Email = (rule, value, callback) => {
	var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('请输入正确的email地址')
	}
}
const OnlyCode = (rule, value, callback) => {
	var reg = /[,.+_-`;=?:><|/!@#$%^&*]/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('只允许输入字符')
	}
}
const Url = (rule, value, callback) => {
	var reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('请输入正确的url')
	}
}
const ZeroToThousand = (rule, value, callback) => {
	var reg = /^(?:[0-9]{1,3}|1000)$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('请输入0~1000的整数')
	}
}
const NegAndPos = (rule, value, callback) => {
	var reg = /^(-)?[1-9][0-9]*$/
	let result = reg.test(value)
	if (result) {
		return callback()
	} else {
		return callback('只能包含正负整数')
	}
}
