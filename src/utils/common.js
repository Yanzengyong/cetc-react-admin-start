import warning from 'rc-util/lib/warning'
import store from '@/store'
import { findSpecRouteItem } from '@/utils/menuForRoute'
import { Message, Notification } from '@alifd/next'
import DeleteNotice from '@/components/DeleteNotice'
import MenuConfig from '@/menus'
import { getSessionStorageItem, setSessionStorageItem, removeSessionStorageItem } from '@/utils/storage'

/**
 * @name: 根据location.state中的currentPage获取当前缓存页码
 * @param {Object} props 必填，传入本组件所在页面的props，保证包含hashroute内容
 * @return {*}
 */
const getCurrentPageFromLocation = (props) => {
	const pathname = props.location.pathname
	const currentPage = Number(getSessionStorageItem(`currentPage-${pathname}`))
	return currentPage && currentPage > 0 ? currentPage : 1
}

// 验证是否是关闭了tab，关闭了就删除该路由中存储的currentpage
const validateAndRemoveStorage = (props) => {
	const pathname = props.location.pathname
	const hasTabItem = props.state ? props.state.tabs.findIndex((item) => item.path === pathname) : 0
	if (hasTabItem === -1) {
		removeSessionStorageItem(`currentPage-${pathname}`)
	}
}

/**
 * @name: 存储当前页面的currentpage
 * @param {Object} props 必填，传入本组件所在页面的props，保证包含hashroute内容
 * @param {Number} pageNum 需存储的当前页面页码
 * @return {*}
 */
const storageCurrentPage = (props, pageNum) => {
	const pathname = props.location.pathname
	setSessionStorageItem(`currentPage-${pathname}`, pageNum)
}

/**
 * @name: 跳转页面
 * @param {Object} props 必填，传入本组件所在页面的props，保证包含hashroute内容
 * @param {String} routeName 必填，配置在menu里面对应路由的title名称，例如：`“新建业务”`
 * @param {Object} queryParam 选填，跳转页面需要在路由的query部分携带的参数，类型为数组，包含label和value键值对
 * 例如：
 * ```const queryParam = [
	{ label: 'businessUuid', value: item.uuid },
	{ label: 'title', value: encodeURI(item.name) },
]```
 * @param {Boolean} closeTab 选填，是否需要跳转时并关闭原页面
 * @param {String/Number} pageNum 选填，需要缓存于props.location.state中的当前页码
 * @template jumpToPage(this.props, '新建业务', null, false, this.state.currentPage)
 * @template jumpToPage(this.props, '查看业务', queryParam, true)
 */
const jumpToPage = async (props, routeName, queryParam, closeTab, pageNum) => {
	const JobPage = findSpecRouteItem(MenuConfig, routeName)
	let queryStr = ''
	if (queryParam && queryParam.length && queryParam.length > 0) {
		queryParam.map(item => {
			queryStr = queryStr + '&' + item.label + '=' + item.value
		})
	}
	queryStr = queryStr.substr(1)

	if (JobPage && JobPage.path) {
		const path = {
			pathname: `${JobPage.path}`,
			search: queryStr
		}

		if (pageNum) storageCurrentPage(props, pageNum)

		props.history.push(path)

		// 关闭页面
		const { pathname, search } = props.location

		if (closeTab && props.closeItemTab && props.setDeleteTabPath) {
			await props.setDeleteTabPath([`${pathname}${search}`])
			props.closeItemTab(`${pathname}${search}`)
		}
	}
}

/**
 * @name: 删除表格或列表中对象的方法
 * @param {*} thisEvent 调用当前方法的组件的this对象，使用时直接传入this即可
 * @param {Function} deleteAction 删除item的请求方法
 * @param {String} paramLabel 删除请求中，所传参数的label，例如：uuids
 * @param {Array} paramValue 删除请求中，所传参数的uuid数组，例如：['asewegegqw124254112']
 * @param {Function} callback 删除成功后的回调函数，例如： this.getList
 * @return {*} 结果：提示删除结果消息，并执行callback
 * @sample deleteListItemAction(this, deleteSourceRQ, 'uuids', uuids, this.getlistHandle)
 */
const deleteListItemAction = (thisEvent, deleteAction, paramLabel, paramValue, callback, title) => {
	if (paramValue.length > 0) {
		DeleteNotice.show({
			message: '该数据删除后无法恢复',
			onCancel: () => {
				DeleteNotice.close()
			},
			onConfirm: async () => {
				DeleteNotice.close()
				// 确认删除
				let param = {}
				if (paramLabel) {
					param[paramLabel] = paramValue
				} else {
					param = paramValue
				}
				const response = await deleteAction(param)
				if (response) {
					let deleteFailList = []
					// 通过notification展示
					if (response.code === 10000) {
						if (response.result && response.result.length > 0) {
							response.result.map(item => {
								deleteFailList.push(item.uuid)
								let content = ''
								if (item.name && item.msg) {
									content = `${title ? title : ''}【${item.name} 】删除失败：${item.msg}`
								}
								else if (item.msg) {
									content = '删除失败!'
								}
								Notification.error({
									placement: 'topRight',
									content: content,
									duration: 3000
								})
							})
						}
						// 当前页完全删除：页数返回上一页 + 刷新页面数据
						if (paramValue.length === thisEvent.state.data.length && thisEvent.state.currentPage !== 1 && deleteFailList.length === 0) {
							Message.success('删除成功')
							thisEvent.setState({
								currentPage: thisEvent.state.currentPage - 1
							}, () => {
								callback()
							})
						}
						// 当前页不完全删除：页数不变 + 刷新页面数据
						else {
							if (deleteFailList.length === 0) Message.success('删除成功')
							callback()
						}
						thisEvent.setState({ selectedRowKeys: deleteFailList })
					}
					else {
						if (response.result && response.result.length > 0) {
							response.result.map(item => {
								console.log(item)
								deleteFailList.push(item.uuid)
								let content = ''
								if (item.name && item.msg) {
									content = item.name + '删除失败：' + item.msg
								}
								else if (item.msg) {
									content = '删除失败：' + item.msg
								}
								else {
									content = '删除失败'
								}
								Notification.error({
									placement: 'topRight',
									content: content,
									duration: 3000
								})
							})
						}
						else {
							Message.error(response.msg || '删除失败')
						}
					}
				}
				else {
					Message.error('删除失败')
				}
			},
		})
	} else {
		Message.warning('未选中任何数据')
	}

}

/**
 * @name: 获取query值中某个固定属性值
 * @param {String} query 当前路径的search，通常传入this.props.location.search
 * @param {String} attr 属性名
 * @template getQueryItemValue(this.props.location.search, 'uuid')
 */
const getQueryItemValue = (query, attr) => {
	if (!!query && query.indexOf('?') !== -1) {
		// 存在query值
		const queryStr = query.split('?')[1] ?? ''
		let paramsObj = {}
		const queryParamsArr = queryStr.split('&')
		queryParamsArr.forEach((item) => {
			const attrName = item.split('=')[0] ?? ''
			const attrValue = item.split('=')[1] ?? ''
			attrName !== '' ? paramsObj[attrName] = attrValue : ''
		})

		return attr === 'title' ? decodeURI(paramsObj[attr]) : paramsObj[attr]

	} return ''
}

// 判断字符串是否为json
const isJSON = (str) => {
	if (typeof str == 'string') {
		try {
			const obj = JSON.parse(str)
			if (typeof obj == 'object' && obj) {
				return true
			} else {
				return false
			}

		} catch (e) {
			console.warn('error：' + str + '!!!' + e)
			return false
		}
	}
	warning(
		typeof str === 'string',
		`输入判断的类型错误，期望string，实际为${typeof str}`,
	)
}

// 页面离开并且存储当前的页面数据
const leaveAndSave = (storageName, data) => {
	setTimeout(() => {
		const closeTabPathArr = store.getState() && store.getState().tabs && store.getState().tabs.deleteTabPath
		const isString = typeof data === 'string' ? true : false
		const storageData = data ? isString ? data : JSON.stringify(data) : null
		if (closeTabPathArr.indexOf(storageName) === -1) {
			console.log('我是被存储的数据', storageData)
			setSessionStorageItem(storageName, storageData)
		} else {
			console.log(`我是common文件中，当先正在离开的地址是${storageName}，当前的关闭的tab数组为${closeTabPathArr}`)
			removeSessionStorageItem(storageName)
		}
		// 当前离开的页面是关闭了tab的页面
		store.dispatch({
			type: 'SET_DELETE_TAB_PATH',
			path: []
		})
	}, 0)

}

// 查看当前路由是否存在存储数据，若存在则初始化存储数据
const hasStorageAndInit = () => {
	const pathHash = window.location.hash
	const routePathUrl = pathHash.substring(1)

	const storageData = getSessionStorageItem(routePathUrl)

	return storageData && isJSON(storageData) ? JSON.parse(storageData) : storageData
}

// 获取字符串中${}内的值
const getStringSpecialContent = (str) => {
	const reg = /\$\{(.+?)\}/
	const reg_g = /\$\{(.+?)\}/g
	const result = str.match(reg_g)

	let list = result.reduce((pre, item) => {
		pre.push(item.match(reg)[1])
		return pre
	}, [])
	return list
}

export {
	getQueryItemValue,
	leaveAndSave,
	hasStorageAndInit,
	getCurrentPageFromLocation,
	jumpToPage,
	deleteListItemAction,
	validateAndRemoveStorage,
	storageCurrentPage,
	getStringSpecialContent
}
