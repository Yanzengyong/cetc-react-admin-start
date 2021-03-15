<!--
 * @Author: Zhangyao
 * @Date: 2020-08-18 16:59:41
 * @LastEditors: Zhangyao
 * @LastEditTime: 2020-08-21 14:54:11
-->
# 详情 - 新建数据资源服务组件 组件
# 组件名 - DataResourceCreate
## 示例：

### 注：该组件需要配合 InfoLayout 一起使用

```js
import React from 'react'
import InfoLayout from '@/components/InfoLayout'
import DataResourceCreate from '@/componentsService/DataResourceCreate'
class DataResourceCreateLayout extends React.Component {
  state = {}
  render() {
    const { pageType } = this.state
    const navInfo = [
      { label: '选择数据源', value: 'chooseDataSource' },
      { label: '选择数据对象', value: 'chooseDataObject' },
      { label: '配置', value: 'config' },
      { label: '操作', value: 'operationBtns' },
    ]
    return (
      <InfoLayout
        hasNavBar
        navInfo={navInfo}
        displayAdvance={this.state.displayAdvance}
        showAdvance={this.showAdvance}
        pageType={pageType}
      >
        <DataResourceCreate
          onCancel={() => {
            this.props.history.go(-1)
          }}
        ></DataResourceCreate>
      </InfoLayout>
    )
  }
}
export default DataResourceCreateLayout
```

## config 参数说明

| config 参数名称 | config 参数描述 | config 参数类型 | 默认值 |
| --------------- | --------------- | --------------- | ------ |
| onCancel        | 取消按钮        | function        |
