<!--
 * @Descripttion: 
 * @version: 
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-11-02 15:14:35
-->
# 目录服务组件（带搜索框功能）

#### 示例：

```js
import CatalogueService from '@/componentsService/CatalogueService'

class Demo extends React.Component {

  onSelectedHandle = (node) => {
    // 选中的节点node对象
    // 根据需求应用node对象
  }

  render () {
  	return (
      <CatalogueService
        catalogueType='resource'
        selectedHandle={this.onSelectedHandle}
      />
  	)
  }
}
```

#### catalogueType选项值的设置,注：根据具体情况可修改api和actions中的catalogue文件

```js

// 因为了能够更渐变的给catalogue服务组件传值，默认后端的目录接口地址如下，仅仅以‘part’作为唯一区分

// api/catalogue.js

import { Host } from './index.js'

export const formatUrl = (part) => {
	part = part || 'datasource'
	const partUrl = `govern-datasource/${part}/catalogue/`
	return {
		getTree: Host + partUrl + 'tree', // 获取目录树
		addTree: Host + partUrl + 'add', // 添加数据目录
		deleteTree: Host + partUrl + 'delete', // 删除数据目录
		updateTree: Host + partUrl + 'update' // 修改数据目录
	}
}

// actions/catalogue.js
export default {
  async getTreeRQ (type, params) {
    try {
      const result = await request.get(formatUrl(type).getTree, params)
      return result
    } catch (error) {
      if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        Message.error('请求超时，请检查网络')
      } else {
        Message.error('服务器未知异常，请联系管理员')
      }
    }
  }
}

```


#### 参数说明

|  参数名称  | 参数描述 | 参数类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  catalogueType  | 请求目录数据的类型 | string | 'datasource' <br/> 可选项（不固定）：'datasource'、'resource' <br/> 该选项更新日期为2020.08.10 |
|  selectedHandle  | 选中节点的回调 <br/> 签名:function(node) => void <br/> 参数:node:节点对象 | function | func.noop |
