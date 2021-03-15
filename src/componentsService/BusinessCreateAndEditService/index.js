/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-08-17 09:06:45
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-08-31 14:25:47
 */
import React from 'react'
import {
	Form,
	Field,
	Input,
	CascaderSelect,
	Button,
	Message,
} from '@alifd/next'
import PropTypes from 'prop-types' // 类型检查
import { BusinessManageAction, CatalogueAction } from '@/actions'

const { addBusinessRQ, queryBusinessRQ, updateBusinessRQ } = BusinessManageAction
const { getTreeRQ } = CatalogueAction
import { leaveAndSave, hasStorageAndInit } from 'utils/common'
import { connect } from 'react-redux'

const FormItem = Form.Item

const businessService = 'ms-business/business'

class BusinessCreateAndEditService extends React.Component {
	field = new Field(this)
	state = {
		pageType: '',
		initFieldUuid: '',
		treeList: [],
	}

	componentDidMount () {
		this.getBusinessTree()
		const initData = hasStorageAndInit()
		// 存在当前修改
		if (initData) {
			this.field.setValues(initData)
		} else {
			if (this.props.pageType === 'edit') {
				this.initFieldList(this.props.initFieldUuid)
			}
		}

  }

	componentWillUnmount () {

		// 以当前的地址为存储的唯一key，当前地址应该为pathname+search
		const pathObj = this.props.location
		const storageName = `${pathObj.pathname}${pathObj.search}`
		leaveAndSave(storageName, this.field.getValues())

  	this.setState = () => {
  		return
  	}
  }

	// 初始化编辑表单的内容
	initFieldList = async (uuid) => {
		const response = await queryBusinessRQ({ uuid: uuid })
		console.log(response)
		if (response) {
			if (response.code === 10000) {
				this.field.setValue('uuid', response.result.uuid)
				this.field.setValue('name', response.result.name)
				this.field.setValue('memo', response.result.memo)
				this.field.setValue('catalogueList', response.result.catalogueList[0] ? response.result.catalogueList[0] : '')
			} else {
				Message.error(response.msg || '业务详情获取失败')
			}
		}
		else {
			Message.error('业务详情获取失败')
		}
	}

	// 获取业务分类目录
	getBusinessTree = async () => {
		const response = await getTreeRQ(businessService)
		if (response) {
			if (response.code === 10000) {
				this.setState({
					treeList: response.result.children,
				})
			} else {
				Message.error(response.msg || '业务目录获取失败')
			}
		}
	}

	// 确认提交
	onSubmit = () => {
		this.field.validate((errors, values) => {
			if (errors) return
			if (this.props.pageType === 'create') this.addBusiness(values)
			else if (this.props.pageType === 'edit') this.updateBusiness(values)
		})
	}

  // 提交新增
	addBusiness = async (values) => {
		let params = {
			name: values.name,
			memo: values.memo,
			catalogueList: values.catalogueList ? [values.catalogueList] : [],
		}
		const response = await addBusinessRQ(params)
		if (response) {
			if (response.code === 10000) {
				Message.success('新增成功')
				this.props.onBack()
			} else {
				Message.error(response.msg || '新增失败')
			}
		}
		else {
			Message.error('新增失败')
		}
	}

  // 提交编辑
	updateBusiness = async (values) => {
		let params = {
			uuid: values.uuid,
			name: values.name,
			memo: values.memo,
			catalogueList: values.catalogueList ? [values.catalogueList] : [],
		}
		console.log(params)
		const response = await updateBusinessRQ(params)
		if (response) {
			if (response.code === 10000) {
				Message.success('编辑成功')
				this.props.onBack()
			} else {
				Message.error(response.msg || '编辑失败')
			}
		}
		else {
			Message.error('编辑失败')
		}
	}


	render () {
		const init = this.field.init

		const { treeList } = this.state

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<FormItem label="业务名称：" required>
					<Input
						trim
						maxLength={50}
						hasLimitHint
						placeholder="请输入业务名称"
						{...init('name', {
							rules: [
								{
									required: true,
									message: '业务名称不能为空',
								},
							],
						})}
					/>
				</FormItem>
				<FormItem label="业务描述：" required>
					<Input
						maxLength={200}
						hasLimitHint
						placeholder="请输入业务描述"
						{...init('memo', {
							rules: [
								{
									required: true,
									message: '业务名称不能为空',
								},
							],
						})}
					/>
				</FormItem>

				<FormItem label="业务分类：">
					<CascaderSelect
						style={{ width: '40%' }}
						placeholder="请选择业务分类"
						dataSource={treeList}
						changeOnSelect={true}
						showSearch
						{...init('catalogueList')}
					/>
				</FormItem>

				<FormItem>
					<Button
						type="primary"
						style={{ marginRight: 10 }}
						onClick={this.onSubmit}
					>
						确认
					</Button>
					<Button type="secondary" onClick={this.props.onBack}>
						取消
					</Button>
				</FormItem>
			</Form>
		)
	}
}

// props默认值指定
BusinessCreateAndEditService.defaultProps = {
	pageType: 'create',
	initFieldUuid: '',
}

BusinessCreateAndEditService.propTypes = {
	pageType: PropTypes.string, // 页面类型 - 新建业务/编辑业务
	initFieldUuid: PropTypes.string, // 编辑业务 - 初始化数据的业务uuid
	onBack: PropTypes.func, // 取消按钮 - 返回上一页面function
}

export default connect(
	(state) => ({
		state: state.tabs
	})
)(BusinessCreateAndEditService)
