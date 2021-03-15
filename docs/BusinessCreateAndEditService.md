# 详情 - 新建/编辑/查看信息系统服务组件 组件

- @Author: SHENLing
- @Date: 2020-08-10
- @Last Modified by: SHENLing
- @Last Modified time: 2020-08-10

```js
import BusinessCreateAndEditService from '@/componentsService/BusinessCreateAndEditService'

class Demo2 extends React.Component {
  state = {
    pageType: 'create',
    initFieldUuid: '',
  }

  componentDidMount() {
    let pageType = this.props.location.pathname.split('/')[2]
    this.setState({ pageType: pageType })
  }

  render() {
    return (
      <BusinessCreateAndEditService
        pageType={this.state.pageType}
        initFieldUuid={this.state.initFieldUuid}
        onCancel={() => {
          this.props.history.go(-1)
        }}
      />
    )
  }
}
```

### 参数说明

| 参数名称      | 参数描述                                   | 参数类型 | 默认值      |
| ------------- | ------------------------------------------ | -------- | ----------- |
| pageType      | 页面类型 - 新建业务：create/编辑业务：edit | string   | create/edit |
| initFieldUuid | 初始化表单数据的业务 uuid（用于编辑业务）  | string   | ''          |
| onCancel      | 取消 function                              | function |             |
