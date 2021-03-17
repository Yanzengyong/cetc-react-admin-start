import React from 'react'
import { Form, Upload, Button, Message } from '@alifd/next'
import IconFont from '@/components/IconFont'
import PropTypes from 'prop-types' // 类型检查
import './index.scss'
import colorStyle from '@/themeStyle/index.scss'

const FormItem = Form.Item

export default class UploadFormItem extends React.Component {
	// 移除文件
	onDeleteFile = (fileIndex) => {
		let tempArr = this.props.uploadedFileList
		tempArr.splice(fileIndex, 1)
		this.props.onGetOldFileList(tempArr)
	}

	// 重置已上传文件列表
	onResetList = () => {
		this.props.onResetList()
	}

	// 新建上传beforeUpload事件
	beforeUpload = (file) => {
		if (file.size > 0) {
			let newList = this.props.newFileList
			newList.push(file)
			this.props.onGetNewFileList(newList)
			return false
		} else {
			Message.error('文件大小必须大于0kB')
			return false
		}
	}

	// 新建上传onRemove删除事件
	onRemove = (file) => {
		const index = this.props.newFileList.indexOf(file)
		let newList = this.props.newFileList.slice()
		newList.splice(index, 1)
		this.props.onGetNewFileList(newList)
	}

	render () {
		const {
			pageType,
			uploadedFileList,
			uploadLimit,
			newFileList,
			fileType,
		} = this.props

		// const currentFileLength = uploadedFileList ? uploadedFileList.length : 0
		const uploadBoxLimit =
			uploadLimit - uploadedFileList.length - newFileList.length

		const resetBtn = (
			<Button
				text
				type="primary"
				style={{
					marginLeft: 10,
					display: pageType === 'preview' ? 'none' : '',
				}}
				onClick={() => this.onResetList()}
			>
				<IconFont type="iconreset" size="xs" style={{ marginRight: 3 }} />
				恢复
			</Button>
		)

		return (
			<div>
				<FormItem
					label={
						<span className="uploadedItem_list_title">
							已上传文件：{resetBtn}
						</span>
					}
				>
					{uploadedFileList && uploadedFileList.length > 0 ? (
						uploadedFileList.map((item, index) => (
							<div className="uploadingFileList" key={index}>
								<span>{item.fileName}</span>
								<Button
									text
									style={{
										color: colorStyle.btn_delete_color,
										display: pageType === 'preview' ? 'none' : '',
									}}
									onClick={() => this.onDeleteFile(index)}
								>
									删除
								</Button>
							</div>
						))
					) : (
						<div>暂无已上传文件</div>
					)}
				</FormItem>
				<FormItem
					style={{
						display: pageType === 'preview' ? 'none' : '',
					}}
					label={
						<span>
							待上传文件：
							<font color="red">
								（共计可添加{uploadLimit}个文件，已上传{uploadedFileList.length}
								个文件，待上传{newFileList.length}个文件，还可添加
								{uploadBoxLimit}个文件）
							</font>
						</span>
					}
				>
					<Upload
						dragable
						multiple
						listType="text"
						limit={uploadBoxLimit}
						beforeUpload={this.beforeUpload}
						onRemove={this.onRemove}
						value={newFileList}
						accept={fileType}
					>
						{uploadBoxLimit !== 0 ? (
							<div className="upload_formItem_place">
								<IconFont
									className="upload_formItem_place_icon"
									type="iconuploadBig"
								/>
								<h6>点击选择需要上传的文件</h6>
								<p>也可将文件拖拽到虚线内进行上传</p>
								<span>（支持多文件同时上传）</span>
							</div>
						) : (
							<div className="upload_formItem_place">
								<IconFont
									className="upload_formItem_place_icon"
									type="iconuploadBig"
								/>
								<h6>不可上传文件</h6>
							</div>
						)}
					</Upload>
				</FormItem>
			</div>
		)
	}
}

// props默认值指定
UploadFormItem.defaultProps = {
	pageType: 'create',
	uploadedFileList: [],
	newFileList: [],
	uploadLimit: 10,
}

UploadFormItem.propTypes = {
	pageType: PropTypes.string, //页面类型（新建/编辑/查看 可选值：create, edit, check；默认值：create
	uploadedFileList: PropTypes.array, // 当前已上传文件列表
	newFileList: PropTypes.array, // 待上传文件列表
	uploadLimit: PropTypes.number, // 上传文件限制
	onResetList: PropTypes.func, // 重置已上传文件列表方法
	onGetNewFileList: PropTypes.func, // 获取待上传新文件列表
	onGetOldFileList: PropTypes.func, // 获取已上传文件调整后的列表
}
