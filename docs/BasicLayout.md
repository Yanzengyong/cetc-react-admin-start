# 基础布局组件【用于首页、列表页】

#### 示例：

```js
import BasicLayout from '@/components/BasicLayout'

class Demo extends React.Component {

  // 目录节点选中
  onSelectedHandle = (node) => {
    // 项目逻辑
  }

  render () {
  	return (
      <BasicLayout
  			title="数据源基础信息管理"
  			subTitle="数据源目录"
  			treeListData={treeList}
        onSelectedHandle={this.onSelectedHandle}
      >
       我是内容
      </BasicLayout>
  	)
  }
}
```

#### 参数说明

|  参数名称  | 参数描述 | 参数类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  subTitle  | 左侧标题 | String | '我是副（左）标题'' |
|  title  | 右侧标题 | String | '我是主（右）标题' |
|  onlyRight  | 是否只显示右侧 | Boolean | false |
|  leftReactNode  | 左侧自定义内容 | ReactNode | - |
|  rightContainerStyle  | 右侧盒子的样式 | Object | - |
|  leftContainerStyle  | 左侧盒子的样式 | Object | - |
|  onSelectedHandle  | 选中tree节点的回调函数 <br/> function (node: Object) => void <br/> node: {Object} 选中的节点对象 | Function | () => {} |
|  notMainPage  | 不是首页 <br/> 值为true时，默认右侧盒子的头部左边显示当前路径的面包屑、右边显示返回按钮 <br/> 值为false时，默认右侧盒子的头部左边显示的是title、右边显示无 | Boolean | false |
|  headLeftReactNode  | 左侧头部自定义右侧内容 | ReactNode | - |
|  headRightReactNode  | 右侧头部自定义右侧内容 | ReactNode | - |

