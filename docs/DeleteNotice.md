# 删除提示组件

#### 示例：

```js
import DeleteNotice from '@/components/DeleteNotice'

class Demo extends React.Component {

  onDeleteHandle = () => {
    DeleteNotice.show({
      message: '该数据删除后无法恢复',
      onCancel: () => {
        DeleteNotice.close()
      },
      onConfirm: () => {
        DeleteNotice.close()
      }
    })
  }

  render () {
  	return (
      <button onClick={this.onDeleteHandle}>delete click</button>
  	)
  }
}
```

#### 组件使用说明

* show方法，显示删除提示弹窗，接收一个config参数，非必须
* close方法，关闭删除提示弹窗，无参数

#### config参数说明

|  config参数名称  | config参数描述 | config参数类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  message  | 删除文字描述 | string | '删除后无法恢复' |
|  onCancel  | 弹窗点击取消的回调函数 | function | func.noop |
|  onConfirm  | 弹窗点击确认的回调函数 | function | func.noop |
