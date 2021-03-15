<!--
 * @Author: Zhangyao
 * @Date: 2020-08-18 17:05:22
 * @LastEditors: Zhangyao
 * @LastEditTime: 2020-08-21 14:54:39
-->
# 详情 - 查看数据资源服务组件 组件
# 组件名 - DataResourcePreview
## 示例：

### 注：该组件需要配合 InfoLayout 一起使用

```js
import React from 'react'
import InfoLayout from '@/components/InfoLayout'
import DataResourcePreview from '@/componentsService/DataResourcePreview'
export default class DataResourcePreviewLayout extends React.Component {
  state = {}
  // 点击高级按钮，高级部分切换隐藏/显示模式
  showAdvance = () => {
  	this.setState({
  		displayAdvance: !this.state.displayAdvance,
  	})
  }
  componentWillUnmount () {
  	this.setState = () => {
  		return
  	}
  }
  render () {
  	const navInfo = [
  		{ label: '基本信息', value: 'basicInfo' },
  		{ label: '高级', value: 'advanceBtn' },
  		{ label: '样例数据', value: 'sampleData' },
  		{ label: '血缘关系', value: 'bloodKinship' },
  		{ label: '数据量趋势', value: 'dataSize' },
  		{ label: '数据采集概况', value: 'dataCollect' },
  		{ label: '数据模型', value: 'dataModel' },
  		{ label: '数据质量', value: 'dataQuality' },
  	]
  	const advanceBtnId = 'advanceBtn'
  	const advanceAffectIds = [
  		'sampleData',
  		'bloodKinship',
  		'dataSize',
  		'dataCollect',
  		'dataModel',
  		'dataQuality',
  	]
  	return (
  		<InfoLayout
  			hasNavBar
  			navInfo={navInfo}
  			advanceBtnId={advanceBtnId}
  			advanceAffectIds={advanceAffectIds}
  			showAdvance={this.showAdvance}
  			displayAdvance={this.state.displayAdvance}
  		>
  			<DataResourcePreview
  				showAdvance={this.showAdvance}
  				displayAdvance={this.state.displayAdvance}
  				onCancel={() => {
  					this.props.history.go(-1)
  				}}
  			></DataResourcePreview>
  		</InfoLayout>
  	)
  }
}

```
## config 参数说明

| config 参数名称 | config 参数描述                                                         | config 参数类型 | 默认值 |
| --------------- | ----------------------------------------------------------------------- | --------------- | ------ |
| showAdvance     | 高级按钮的点击事件，与 InfoLayout 中一致                                | function        |
| displayAdvance  | 是否显示高级，与 InfoLayout 中一致                                      | bool            |
| onCancel        | 取消按钮                                                                | function        |
