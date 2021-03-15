/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-10-26 15:39:12
 */
import { Host } from '../index'
const fileService = 'service-file'

const apiList = {
	uploadFile: Host + fileService + '/ftp/upload', // 上传文件
	previewFile: Host + fileService + '/ftp/previewfile', // 文件预览
}
export default apiList
