/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 14:10:49
 */
import qs from 'qs'
import { getLocalStorageItem } from '@/utils/common'

const TOKEN = getLocalStorageItem('TOKEN')

// 说明：
/**
 * const TOKEN = window.localStorage.getItem('TOKEN') ?? null
 *
 * Download('http://www.baidu.com')
 *
 * 结果：http://www.baidu.com?token=50aaf7d4c5814aa7ad26f81f24873575
 *
 * Download('http://www.baidu.com', { id: 222, name: 'yzy' })
 *
 * 结果：http://www.baidu.com?token=50aaf7d4c5814aa7ad26f81f24873575&id=222&name=yzy
 *
 *  */

export default (addr, query) => {
	window.open(`${addr}${query ? `?token=${TOKEN}&${qs.stringify(query)}` : `?token=${TOKEN}`}`)
}
