/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2021-02-22 10:40:56
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-23 11:51:31
 */
// 初始化state数据
const initialState = {
	userInfo: {}
}
export default (state = initialState, action) => {

	switch (action.type) {
	case 'SET_USERINFO':
			return { ...state, userInfo: action.UserInfo }
	case 'GET_USERINFO':
		return { ...state, userInfo: action.UserInfo }
	default:
		return state
	}
}
