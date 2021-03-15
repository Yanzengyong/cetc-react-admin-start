# 目录组件

#### 示例：

```js
import Tree from '@/components/TreeCatalogue'

class Demo extends React.Component {

  state = {
    treeData: [],
    selectable: true
  }
  
  onSelectNode = (selectedKeys, record) => {
  	if (record.selected) { 
      // 选中状态
  	} else { 
      // 未选中状态
  	}
  }

  render () {
    const { treeData, selectable } = this.state
  	return (
      <Tree
        className='catalogue_tree'
        onRef={this.onTreeRef}
        selectable={selectable}
        treeData={treeData_test}
        onSelect={this.onSelectNode}
      />
  	)
  }
}
```

#### treeData示例数据，其中【key、title、children为必须值】，可自行对自己的数据进行处理以达到契合

```js
const treeData_test = [
	{
		key: '0-0',
		title: 'parent 1',
		children: [
			{
				key: '0-0-0', title: 'parent 1-1',
				children: [
					{ key: '0-0-0-0', title: 'parent 1-1-0' }
				]
			},
			{
				key: '0-0-1',
				title: 'parent 1-2',
				children: [
					{ key: '0-0-1-0', title: 'parent 1-2-0' },
					{ key: '0-0-1-1', title: 'parent 1-2-1' },
					{ key: '0-0-1-2', title: 'parent 1-2-2' },
					{ key: '0-0-1-3', title: 'parent 1-2-3' },
					{ key: '0-0-1-4', title: 'parent 1-2-4' },
					{ key: '0-0-1-5', title: 'parent 1-2-5' },
					{ key: '0-0-1-6', title: 'parent 1-2-6' },
					{ key: '0-0-1-7', title: 'parent 1-2-7' },
					{ key: '0-0-1-8', title: 'parent 1-2-8' },
					{ key: '0-0-1-9', title: 'parent 1-2-9', children: [
            { key: '0-0-1-9-1', title: 'parent 1-3-0' },
          ]}
				]
			}
		]
	}
]

// 参考函数
const processNode = (data, index) => {
  index = index || 0
  return data.map((item) => {
    if (item.children && item.children.length > 0) {
      const childItem = this.processNode(item.children, index + 1)
      return {
        ...item,
        level: index,
        children: childItem
      }
    } else {
      return {
        ...item,
        level: index
      }
    }
  })
}
```

#### 参数说明

|  参数名称  | 参数描述 | 参数类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  selectable  | 是否可以被选中 | boolean | true |
|  optionable  | 是否现在选项栏（新增、编辑、删除） | boolean | true |
|  defaultExpandParent  | 默认展开父节点 | boolean | true |
|  autoExpandParent  | 自动暂开父节点 | boolean | true |
|  defaultExpandAll  | 默认展开的节点数组  | array | [] |
|  defaultSelectedKeys  | 默认选中的节点数组 | array | [] |
|  maxLevel  | 最大层级限制(最大层级时选项栏中没有新增) <br/> 层级：0>>>>infinite | number | infinite |
|  titleRender  | 标题 | reactNode | - |
|  treeData  | 目录数据 | array | [] |
|  onSelect  | 节点选中的回调函数 <br/> function(selectedKeys:Array, record: Object) => void <br/> selectedKeys: 选中的数组key值 <br/> record: 选中的事件对象 | function | () => {} |
|  onExpand  | 节点展开的回调函数 <br/> function(expandedKeys:Array, record: Object) => void <br/> expandedKeys: 当前展开的数组key值 <br/> record: 当前点击展开的节点对象 | () => {} |
|  onDeleteNode | 删除该节点 <br/> function(treeNode: Object) => void <br/> Object: 点击删除的节点对象 | function | () => {} |
|  onUpdateNode | 更新该节点 <br/> function(treeNode: Object) => void <br/> Object: 点击更新的节点对象 | function | () => {} |
|  onCreateNodeChild | 新增子节点 <br/> function(treeNode: Object) => void <br/> Object: 新增子节点的节点对象 | function | () => {} |
