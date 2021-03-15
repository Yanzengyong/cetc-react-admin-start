import { Message } from '@alifd/next'
import { FileAction } from '@/actions'

const { uploadFileRQ } = FileAction

/**
 * @method 文件上传
 * @param {组件this对象} thisObj
 * @param {待上传文件数组 类型：array} fileList
 * @param {this.state状态中loading的名称 选填 默认值为'loading', 可重写为其他状态名， 例如'submitLoading'} loadingName
 */
const filesUpload = (thisObj, fileList, loadingName) => {
	return new Promise((resolve) => {
		let startLoading = {}
		startLoading[loadingName ? loadingName : 'loading'] = true

		let stopLoading = {}
		stopLoading[loadingName ? loadingName : 'loading'] = false

		if (fileList.length > 0) {
			thisObj.setState(startLoading, async () => {
				let result = []
				for (let i = 0; i < fileList.length; i++) {
					const file = fileList[i]
					try {
						let formData = new FormData()
						formData.append('file', file)
						let response = await uploadFileRQ(formData)
						if (response) {
							if (
								response.code === 10000 &&
								response.result &&
								response.result.fileUuid
							) {
								result.push(response.result.fileUuid)
							} else {
								thisObj.setState(stopLoading, () => {
									Message.error(response.msg || `${file.name}：文件上传失败`)
								})
							}
						}
					} catch (error) {
						thisObj.setState(stopLoading, () => {
							Message.error('上传文件异常')
						})
					}
				}
				resolve(result)
			})
		} else {
			resolve([])
		}
	})
}

export {
	filesUpload
}
