<!--
 * @Author: Zhangyao
 * @Date: 2020-08-18 16:38:45
 * @LastEditors: Zhangyao
 * @LastEditTime: 2020-08-21 14:54:52
-->
# 详情 - 新建/编辑/查看数据源服务组件 组件
# 组件名 - DataSourceCreateEditPreview
## 示例：

### 注：该组件需要配合 InfoLayout 一起使用

```js
import DataSourceCreateEditPreview from '@/componentsService/DataSourceCreateEditPreview'
import React from 'react'
import InfoLayout from '@/components/InfoLayout'
import DataSourceCreateEditPreview from '@/componentsService/DataSourceCreateEditPreview'
export default class DataSourceCreateEditPreviewLayout extends React.Component {
  state = {
    rightLabel: '',
  }
  componentDidMount() {
    // 区分不同类型的数据源
    let dataSourceType = this.props.location.search.split('=')[1]
    this.setState({
      dataSourceType: dataSourceType,
    })
    switch (dataSourceType) {
      case 'wenjian':
        this.setState({
          rightLabel: '文件信息',
        })
        return
      default:
        this.setState({
          rightLabel: dataSourceType + '数据源连接信息',
        })
    }
    // 区分不同操作
    let pageType = this.props.location.pathname.split('/')[3]
    console.log(pageType)
    switch (pageType) {
      case 'create':
        this.setState({ pageType: 'create' })
        return
      case 'edit':
        this.setState({ pageType: 'edit' })
        return
      case 'preview':
        this.setState({ pageType: 'preview' })
        return
      default:
        break
    }
  }
  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }
  // 点击高级按钮，高级部分切换隐藏/显示模式
  showAdvance = () => {
    this.setState({
      displayAdvance: !this.state.displayAdvance,
    })
  }
  // 自己定义的组件，必须添加displayAdvance使用高级。必须添加onCancel使用返回,connectLabel动态传递数据源右边label
  render() {
    const { dataSourceType, connectLabel, rightLabel, pageType } = this.state
    const navInfo = [
      { label: '基本信息', value: 'basicInfo' },
      { label: '高级', value: 'advanceBtn' },
      { label: rightLabel, value: 'connectInfo' },
      { label: '操作', value: 'operationBtns' },
    ]
    if (pageType === 'preview') {
      navInfo.push({ label: '关联数据资源', value: 'relaDataResource' })
    }
    const advanceBtnId = 'advanceBtn'
    const advanceAffectIds = ['connectInfo', 'relaDataResource']
    const operationBtnId = 'operationBtns'
    return (
      <InfoLayout
        hasNavBar
        navInfo={navInfo}
        displayAdvance={this.state.displayAdvance}
        advanceBtnId={advanceBtnId}
        showAdvance={this.showAdvance}
        advanceAffectIds={advanceAffectIds}
        operationBtnId={operationBtnId}
        pageType={pageType}
      >
        <DataSourceCreateEditPreview
          pageType={pageType}
          showAdvance={this.showAdvance}
          displayAdvance={this.state.displayAdvance}
          dataSourceType={dataSourceType}
          onCancel={() => {
            this.props.history.go(-1)
          }}
        ></DataSourceCreateEditPreview>
      </InfoLayout>
    )
  }
}
```

## config 参数说明

| config 参数名称 | config 参数描述                                                         | config 参数类型 | 默认值 |
| --------------- | ----------------------------------------------------------------------- | --------------- | ------ |
| pageType        | 页面类型 create/edit/preview，新增/编辑/预览                            | String          |
| showAdvance     | 高级按钮的点击事件，与 InfoLayout 中一致                                | function        |
| displayAdvance  | 是否显示高级，与 InfoLayout 中一致                                      | bool            |
| dataSourceType  | 数据源类型，根据不同的数据源渲染不同的侧边栏 label 及连接信息的卡片标题 | string          |
| onCancel        | 取消按钮                                                                | function        |
