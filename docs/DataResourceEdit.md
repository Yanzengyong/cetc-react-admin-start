<!--
 * @Author: Zhangyao
 * @Date: 2020-08-18 17:02:37
 * @LastEditors: Zhangyao
 * @LastEditTime: 2020-08-21 14:54:23
-->
# 详情 - 编辑数据资源服务组件 组件
# 组件名 - DataResourceEdit
## 示例：

### 注：该组件需要配合 InfoLayout 一起使用

```js
import React from 'react'
import InfoLayout from '@/components/InfoLayout'
import DataResourceEdit from '@/componentsService/DataResourceEdit'
export default class DataResourceEditLayout extends React.Component {
  state = {
  render() {
    return (
      <InfoLayout>
        <DataResourceEdit
          onCancel={() => {
            this.props.history.go(-1)
          }}
        ></DataResourceEdit>
      </InfoLayout>
    )
  }
}
```
## config 参数说明

| config 参数名称 | config 参数描述 | config 参数类型 | 默认值 |
| --------------- | --------------- | --------------- | ------ |
| onCancel        | 取消按钮        | function        |
