# 详情 - 新建/编辑/查看信息系统服务组件 组件

 * @Author: SHENLing
 * @Date: 2020-08-10
 * @Last Modified by: SHENLing
 * @Last Modified time: 2020-08-10

 ```js
import InfoSystemCheckAndCreateAndEditService from '@/componentsService/InfoSystemCheckAndCreateAndEditService'

class Demo2 extends React.Component {
  state = {
  	pageType: 'create',
  	initFieldUuid: '', // 用于初始化表单数据的业务uuid
  	displayAdvance: false // 是否展开高级部分
  }

  // 点击高级按钮，高级部分切换隐藏/显示模式
  showAdvance = () => {
  	this.setState({
  		displayAdvance: !this.state.displayAdvance
  	})
  }

	render () {
		return (
			<InfoSystemCheckAndCreateAndEditService
  				pageType={this.state.pageType}
  				initFieldUuid={this.state.initFieldUuid}
  				onCancel={() => { this.props.history.go(-1) }}
  				showAdvance={this.showAdvance}
  				displayAdvance={this.state.displayAdvance}
  			/>
		)
	}
}
```


### 参数说明
|  参数名称  | 参数描述 | 参数类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  pageType  | 页面类型 - 新建业务：create/编辑业务：edit/查看业务：check | string | create/edit/preview |
|  initFieldUuid  | 初始化表单数据的业务uuid（用于编辑业务） | string | '' |
|  onCancel  | 取消function | function |  |
|  businessCatalogChangeDisable  | 所属业务不可选 | boolean | false |
|  showAdvance  | 高级选项按钮反馈function | function |  |
|  displayAdvance  | 高级选项内容是否展开（默认不展开） | boolean | false |
