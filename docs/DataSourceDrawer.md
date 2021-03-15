<!--
 * @Author: Zhangyao
 * @Date: 2020-08-18 16:16:33
 * @LastEditors: Zhangyao
 * @LastEditTime: 2020-08-21 14:55:01
-->
# 数据源抽屉组件
#  组件名- DataSourceDrawer
#### 示例：

```js
import DataSourceDrawer from '@/componentsService/DataSourceDrawer'
  <DataSourceDrawer
    dataSourceDrawerVisible={this.state.dataSourceDrawerVisible}
    dataSourceDrawerOnClose={this.dataSourceDrawerOnClose}
    history={this.props.history}
  ></DataSourceDrawer>
  // 关闭数据源抽屉
  dataSourceDrawerOnClose = () => {
    this.setState({
      dataSourceDrawerVisible: false,
    })
  }
```
<br>

## 组件维护
<br>
步骤一、Iconfont找到对应项目新增icon，icon命名应与后端数据源命名保持一致<br>
步骤二、到'@/componentsService/DataSourceDrawer'对应分类下新增<br>
步骤三、更新该组件文档<br>
分类说明：<br>

| 分组| 类别 | 
| ------ | ---------| 
|relation|关系型数据库|
|norelation|非关系型数据库|
|file|数据文件|
<br>

## config 参数说明

| config 参数名称 | config 参数描述 | config 参数类型 | 默认值 |
| --------------- | ------------------| --------------- | ----------------|
|dataSourceDrawerVisible|数据源抽屉是否显示|bool||
|dataSourceDrawerOnClose|数据源抽屉关闭事件|function||
|history|涉及路由跳转，继承父组件props完成跳转|
