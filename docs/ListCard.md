<!--
 * @Author: Zhangyao
 * @Date: 2020-08-07 16:01:48
 * @LastEditors: Zhangyao
 * @LastEditTime: 2020-10-20 14:18:00
-->

# 首页卡片组件
# 组件名 - ListCard
#### 示例：

```js
import ListCard from "@/components/ListCard";

<ListCard
 	dataSource={data}
	clos={clos}
	operation={this.operation}
	primaryKey="uuid"
	rowSelection={this.rowSelection}
	selectedRowKeys={this.state.selectedRowKeys}
	loading={tableLoading}
	bottomClos={bottomClos}
	tagDataIndex="status"
	tagRule={tagRule}
	starDataIndex="status"
	starOnclick={this.starOnclick}
></ListCard>;
```
#### 组件使用说明

数据样例及cols遵循以下规则（必填）
```js
  dataSource: [
    {
      title: '数据源',
      description:'描述',
      createTime: '2012-5-6',
      dbType: 'mysql',
    },
  ],
	// 或者使用bottomClos，定义方法一致
  clos: [
    {
      title: '数据源名称',
      dataIndex: 'title',
    },
    {
      title: '数据源描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ]
```
```js
	contentReactNode={(item) => {
		return (
			<div>
				<Ellipsis
					line={1}
					text={'字段名称：' + item.name}
					style={{ marginBottom: '8px' }}
				/>
				<Ellipsis
					line={1}
					text={'数据值定义：' + item.name}
					style={{ marginBottom: '8px' }}
				/>
				<Ellipsis line={1} text={'传输类型：' + item.name} />
			</div>
		)
	}}
```
## config 参数说明

| config 参数名称  | config 参数描述                                  | config 参数类型 | 默认值 |
| ---------------- | ------------------------------------------------ | --------------- | ------ |
| dataSource       | 数据源                                           | array           | []     |
| clos             | 展示字段,类似于table的标题,用于字段匹配          | array           |        |
| bottomClos       | 底部自定义渲染，传入数组即可，使用方法和clos一致 | array           |        |
| operation        | 操作区 operation( item)                          | function        |        |
| pictureIndex     | 图片参数字段,需要使用就传，不需要就不传          | string          |        |
| primaryKey       | 每一行的唯一标识，不传默认为index                | string          |        |
| rowSelection     | 卡片选中事件，该方法存在默认带有checkbox，否则无 | function        |        |
| selectedRowKeys  | 多选选中的value数组                              | array           |        |
| loading          | loading状态                                      | bool            |        |
| contentReactNode | 中间内容部分自定义                               | ReactNode       |        |  |
## 卡片星标
| config 参数名称 | config 参数描述                                                        | config 参数类型 | 默认值 |
| --------------- | ---------------------------------------------------------------------- | --------------- | ------ |
| starDataIndex   | 星标，传入字段，和starOnclick配合使用且必传                            | string          | false  |
| starOnclick     | 星标点击事件，默认传递primaryKey，item ，与starDataIndex配合使用且必传 | function        |        |
## 标题标签
| config 参数名称 | config 参数描述                                   | config 参数类型 | 默认值 |
| --------------- | ------------------------------------------------- | --------------- | ------ |
| tagRule         | 标题tag的规则示例，和tagDataIndex配合使用且必传   | array           |        |
| tagList         | 标题tag的参数匹配，useRule为是否使用自定义tag规则 | array           |        |
| tagAlign        | tag标签对齐方式，left靠左，默认靠右               | string          | right  |
示例：
```js
		tagList={[
			{ title: 'ceshi', dataIndex: 'name', },
			{ title: 'ceshi', dataIndex: 'status', useRule:true }
		]}
		tagRule={[
			{ label: '待启动', value: '0', color: '#2E5AFD' },
			{ label: '运行中', value: '1', color: '#67c23A' },
			{ label: '运行失败', value: '2', color: '#f56c6c' },
			{ label: '已停止', value: '3', color: '#E6A23C' },
		]}
```
## 标题气泡提示
| config 参数名称         | config 参数描述                                           | config 参数类型 | 默认值 |
| ----------------------- | --------------------------------------------------------- | --------------- | ------ |
| titleBalloonTriggerType | 标题气泡提示触发行为                                      | string          | hover  |
| titleBalloonAlign       | 标题气泡弹出层位置,'t'(上),'r'(右),'b'(下),'l'(左)        | string          | 'b'    |
| titleBalloonDataIndex   | 标题气泡提示，传入字段                                    | string          |        |
| titleBalloonText        | 自定义标题气泡提示内容,与titleBalloonChange结合使用且必传 | string          |        |
| titleBalloonChange      | 气泡提示打开关闭事件，与titleBalloonText结合使用且必传    | function        |        |
示例：
```js
	// 弹层打开关闭触发事件
	titleBalloonChange = (visible, type) => {
		console.log(visible, type)
		if (visible) {
			this.setState({
				titleBalloonText: '自定义渲染balloon内容',
			})
		}
	}
```
