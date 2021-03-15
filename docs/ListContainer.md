# 列表内容组件（适用于列表首页的列表部分）

#### 示例：

```js
import ListContainer from '@/components/ListContainer'

class Demo extends React.Component {

  state = {
    searchName: '',
    selectedRowKeys: [],
    currentPage: 1,
    pageTotal: 0,
    pageSize: 10,
  }

  // 刷新列表
  getlistHandle = () => {
  	console.log('刷新列表')
  }

	// 查询搜索的处理函数
	handleSearch = (val) => {
		this.setState({
			searchName: val,
			currentPage: 1,
			}, () => {
			this.getlistHandle()
		})
	}

	// 节流防抖的请求方式
	searchRequest = (val) => {
		this.setState({
			searchName: val,
			currentPage: 1
		}, () => {
			this.getlistHandle()
		})
	}


  // 翻页的change事件
  pageOnChange = (page) => {
  	this.setState({
  			currentPage: page
  	  }, () => {
  			// 获取新的列表
  	})
  }

  // 创建新增数据源
  createHandle = () => {
  	// 创建逻辑
  }

  deleteHandle = (selectedRowKeys) => {
    // 删除逻辑
  }

  render () {
    const { searchName, selectedRowKeys, pageSize, pageTotal, currentPage } = this.state
  	return (
      <ListContainer
				searchRequest={this.searchRequest}
				handleSearch={this.handleSearch}
				createHandle={this.createHandle}
				deleteAllHandle={() => this.deleteHandle(selectedRowKeys)}
				selectedNum={selectedRowKeys.length}
				current={currentPage}
				onChange={this.pageOnChange}
				total={pageTotal}
				pageSize={pageSize}
      >
  	)
  }
}
```

#### 重点

* batchImport、qualityReport、qualityRule属性及对应的方法即将废弃
* 避免按钮等组件越加越多，导致阅读性和复杂性的增加，默认是存在两个按钮，即leftBtnText【+ 创建 / 新增】、rightBtnText【批量删除】
* 若实际项目中，该两个按钮不能满足，请传入rightNode属性解决该问题

#### 参数说明

|  参数名称  | 参数描述 | 参数类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  leftBtnText  | 左边按钮的文字 | String | '+ 创建 / 新增' |
|  hasCheckbox  | 是否存在复选框 | Boolean | '是否存在复选框' |
|  rightBtnText  | 右边按钮的文字 | String | '批量删除' |
|  multipleSelect  | 是否提供多选 | Boolean | true |
|  batchImport  | 是否提供批量导入按钮 <br/> 即将废弃 | Boolean | false |
|  qualityReport  | 是否提供数据质量报告导出 <br/> 即将废弃 | Boolean | false |
|  qualityRule  | 是否提供数据质量规则模板设置 <br/> 即将废弃 | Boolean | false |
|  selectedNum  | 已经选择了n个 | Number | 0 |
|  rightNode  | 右边自定义的元素 | ReactNode | - |
|  leftNode  | 左边自定义的元素 | ReactNode | - |
|  size  | 分页组件大小 <br/> 可选项: 'small', 'medium', 'large' | String | 默认: medium  |
|  type  | 分页组件类型 <br/> 可选值: 'normal', 'simple', 'mini' | String | 'normal' |
|  shape  | 前进后退按钮样式 <br/> 可选值: 'normal', 'arrow-only', 'arrow-prev-only', 'no-border' | String | 'normal' |
|  current  | （受控）当前页码 | Number | - |
|  defaultCurrent  | （非受控）初始页码 | Number | 1 |
|  total  | 总记录数 | Number | 100 |
|  totalRender  | 总数的渲染函数 <br/> 签名: Function(total: Number, range: Array) => void <br/> 参数: total: {Number} 总数 Number range: {Array} 当前数据在总数中的区间 | Function | - |
|  pageShowCount  | 页码显示的数量，更多的使用...代替 | Number | 5 |
|  pageSize  | 一页中的记录数 | Number | 10 |
|  pageSizeSelector  | 每页显示选择器类型 <br/> 可选值: false, 'filter', 'dropdown' | Enum | false |
|  pageSizeList  | 每页显示选择器可选值 | Array<Number>/Array<Object> | [5, 10, 20] |
|  pageSizePosition  | 每页显示选择器在组件中的位置 <br/> 可选值: 'start', 'end' | Enum | 'start' |
|  useFloatLayout | 存在每页显示选择器时是否使用浮动布局 | Boolean | false |
|  hideOnlyOnePage | 当分页数为1时，是否隐藏分页器 | Boolean | false |
|  showJump  | type 设置为 normal 时，在页码数超过5页后，会显示跳转输入框与按钮，当设置 showJump 为 false 时，不再显示该跳转区域 | Boolean | false |
|  link  | 设置页码按钮的跳转链接，它的值为一个包含 {page} 的模版字符串 | String | - |
|  popupProps  | 弹层组件属性，透传给Popup | Object | - |
|  handleSearch  | 点击搜索按钮触发的回调 <br/> 签名: Function(value: String, filterValue: String) => void <br> 参数: value: {String} 输入值 filterValue: {String} 选项值 | Function | func.noop |
|  createHandle  | 创建的按钮的回调 <br/> 签名: Function() => void | Function | func.noop |
|  deleteAllHandle  | 删除的按钮的回调 <br/> 签名: Function() => void | Function | func.noop |
|  handleBatchImport  | 批量导入的按钮 <br/> 签名: Function() => void <br/> 即将废弃 | Function | func.noop |
|  handleExportQualityReport  | 数据质量报告导出的按钮 <br/> 签名: Function() => void <br/> 即将废弃 | Function | func.noop |
|  handleManageQualityRule  | 数据质量规则模板设置的按钮 <br/> 签名: Function() => void <br/> 即将废弃 | Function | func.noop |
|  searchOnChange  | 输入关键字时的回调 <br/> 签名: Function(value: Object) => void <br/> 参数:value: {Object} 输入值 | Function | func.noop |
|  onChange  | 页码发生改变时的回调函数 <br/> 签名: Function(current: Number, e: Object) => void <br/> 参数: current: {Number} 改变后的页码数 e: {Object} 点击事件对象 | Function | func.noop |
|  pageNumberRender  | 自定义页码渲染函数，函数作用于页码button以及当前页/总页数的数字渲染 <br/> 签名: Function(index: Number) => ReactNode <br/> 参数: index: {Number} 分页的页码，从1开始 <br/> 返回值: {ReactNode} 返回渲染结果 | Function | index => index |
|  onPageSizeChange  | 每页显示记录数量改变时的回调函数 <br/> 签名: Function(pageSize: Number) => void <br/> 参数: pageSize: {Number} 改变后的每页显示记录数 <br/> 返回值: {ReactNode} 返回渲染结果 | Function | () => {} |
|  checkboxOnChange  | checkBox状态变化时触发的事件 <br/> 签名: Function(checked: Boolean, e: Event) => void <br/> 参数: checked: {Boolean} 是否选中 <br/>  _e_: {Event} Dom 事件对象 | Function | () => {} |

