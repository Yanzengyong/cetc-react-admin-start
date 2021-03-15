/*
 * @Description:
 * @Version:
 * @Author: Yanzengyong
 * @Date: 2020-06-15 16:21:45
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-02-22 11:10:07
 */
import { combineReducers } from 'redux'
import tabs from './tabs'
import user from './user'

const rootReducer = combineReducers({
	tabs,
	user
})

export default rootReducer
