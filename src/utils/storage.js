const PLATFORM_NAME = 'DataService'

/**
 * 存储信息到localstorage
 */
const setLocalStorageItem = (name, value) => {
	const storageInfo = window.localStorage.getItem(PLATFORM_NAME) &&
	JSON.parse(window.localStorage.getItem(PLATFORM_NAME))
	const _storageInfo = storageInfo ?? {}
	_storageInfo[name] = value
 	window.localStorage.setItem(PLATFORM_NAME, JSON.stringify(_storageInfo))
}

/**
 * 获取本地localstorage的信息
 */
const getLocalStorageItem = (name) => {
	const storageInfo = window.localStorage.getItem(PLATFORM_NAME) &&
	JSON.parse(window.localStorage.getItem(PLATFORM_NAME))
	return storageInfo ? storageInfo[name] : null
}

/**
 * 删除会话sessionStorage中的某个数据
 */
const removeLocalStorageItem = (name) => {
	const storageInfo = window.localStorage.getItem(PLATFORM_NAME) &&
	JSON.parse(window.localStorage.getItem(PLATFORM_NAME))
	delete storageInfo[name]
	window.localStorage.setItem(PLATFORM_NAME, JSON.stringify(storageInfo))
}

/**
 * 清空本地localstorage的信息（本系统的）
 */
const clearLocalStorage = () => {
	window.localStorage.removeItem(PLATFORM_NAME)
}

/**
 * 存储信息到会话存储sessionStorage
 */
const setSessionStorageItem = (name, value) => {
	const storageInfo = window.sessionStorage.getItem(PLATFORM_NAME) &&
	JSON.parse(window.sessionStorage.getItem(PLATFORM_NAME))
	const _storageInfo = storageInfo ?? {}
	_storageInfo[name] = value
 	window.sessionStorage.setItem(PLATFORM_NAME, JSON.stringify(_storageInfo))
}

/**
 * 获取会话sessionStorage的信息
 */
const getSessionStorageItem = (name) => {
	const storageInfo = window.sessionStorage.getItem(PLATFORM_NAME) &&
	JSON.parse(window.sessionStorage.getItem(PLATFORM_NAME))
	return storageInfo ? storageInfo[name] : null
}

/**
 * 删除会话sessionStorage中的某个数据
 */
const removeSessionStorageItem = (name) => {
	const storageInfo = window.sessionStorage.getItem(PLATFORM_NAME) &&
	JSON.parse(window.sessionStorage.getItem(PLATFORM_NAME))
	delete storageInfo[name]
	window.sessionStorage.setItem(PLATFORM_NAME, JSON.stringify(storageInfo))
}

/**
 * 清空会话sessionStorage的信息（本系统的）
 */
const clearSessionStorage = () => {
	window.sessionStorage.removeItem(PLATFORM_NAME)
}


export {
	setLocalStorageItem,
	getLocalStorageItem,
	removeLocalStorageItem,
	clearLocalStorage,
	setSessionStorageItem,
	getSessionStorageItem,
	removeSessionStorageItem,
	clearSessionStorage
}

export default PLATFORM_NAME
