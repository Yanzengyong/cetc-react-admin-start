/*
 * @Author: Zhangyao
 * @Date: 2020-08-13 09:43:20
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-12-31 15:45:31
 */
import React from 'react'
import InfoLayout from '@/components/InfoLayout'
import DataSourceCreateEditPreview from '@/componentsService/DataSourceCreateEditPreview'
import { findCurrentRouteItem } from '@/utils/menuForRoute'
import { getQueryItemValue, jumpToPage } from '@/utils/common'
import { connect } from 'react-redux'
import { Tab } from '@/reduxActions'

class DataSourceCreateEditPreviewLayout extends React.Component {
	state = {
		rightLabel: '',
		initFieldUuid: '',
		dataSourceUuid: '',
		dataSourceType: '',
		pageType: '',
	}
	// 返回主页
	onBack = async () => {
		// 路由跳转
		jumpToPage(this.props, '数据源接入', '', true)
	}

	componentWillUnmount () {
		this.setState = () => {
			return
		}
	}

	static getDerivedStateFromProps (props, state) {
		const currentUuid = props.location.search
		const prevUuid = state.initFieldUuid
		const Item = findCurrentRouteItem(props.location.pathname)
		const dataSourceType = getQueryItemValue(props.location.search, 'type')
		const dataSourceUuid = getQueryItemValue(props.location.search, 'uuid')
		// 增加一层判断创建时，pageType不同
		if (Item && Item.type === 'create') {
			//在创建的时候，表单的uuid为不同的类型
			if (currentUuid !== prevUuid) {
				return {
					initFieldUuid: dataSourceType,
					pageType: 'create',
					dataSourceType: dataSourceType,
					rightLabel:
						dataSourceType === 'File'
							? '数据源文件信息'
							: dataSourceType + '数据源连接信息',
				}
			}
		} else if (Item && Item.type === 'edit') {
			// 在编辑的时候，表单的uuid为数据源的uuid
			if (currentUuid !== prevUuid) {
				return {
					initFieldUuid: currentUuid,
					pageType: 'edit',
					dataSourceType: dataSourceType,
					dataSourceUuid: dataSourceUuid,
					rightLabel:
						dataSourceType === 'File'
							? '数据源文件信息'
							: dataSourceType + '数据源连接信息',
				}
			}
		} else if (Item && Item.type === 'preview') {
			// 在查看的时候，表单的uuid为数据源的uuid
			if (currentUuid !== prevUuid) {
				return {
					initFieldUuid: currentUuid,
					pageType: 'preview',
					dataSourceType: dataSourceType,
					dataSourceUuid: dataSourceUuid,
					rightLabel:
						dataSourceType === 'File'
							? '数据源文件信息'
							: dataSourceType + '数据源连接信息',
				}
			}
		}
		return null
	}
	// 自己定义的组件，必须添加displayAdvance使用高级。必须添加onCancel使用返回,connectLabel动态传递数据源右边label
	render () {
		const {
			dataSourceType,
			rightLabel,
			pageType,
			initFieldUuid,
			dataSourceUuid,
		} = this.state
		const navInfo = [
			{ label: '基本信息', value: 'basicInfo' },
			{ label: rightLabel, value: 'connectInfo' },
			{ label: '操作', value: 'operationBtns' },
		]
		const operationBtnId = 'operationBtns'
		console.log(this.props)
		return (
			<InfoLayout
				hasNavBar
				navInfo={navInfo}
				operationBtnId={operationBtnId}
				pageType={pageType}
			>
				<DataSourceCreateEditPreview
					key={initFieldUuid}
					initFieldUuid={initFieldUuid}
					pageType={pageType}
					dataSourceType={dataSourceType}
					dataSourceUuid={dataSourceUuid}
					onBack={this.onBack}
					{...this.props}
				/>
			</InfoLayout>
		)
	}
}
export default connect(
	(state) => ({
		state: state.tabs,
	}),
	Tab
)(DataSourceCreateEditPreviewLayout)
