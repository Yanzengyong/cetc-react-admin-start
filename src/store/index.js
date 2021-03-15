/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-08-17 09:06:45
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-08-30 23:00:21
 */
// 注册store
import { createStore, applyMiddleware } from 'redux'
// import thunk from 'redux-thunk'
// import { createLogger } from 'redux-logger'
import reducer from '@/reducers'

// // 调用日子打印方法
// const loggerMiddleware = createLogger()
// applyMiddleware来自redux可以包装store的dispatch
// thunk作用是使action创建函数可以返回一个function代替一个action对象
export default createStore(reducer)
