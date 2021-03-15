# ICON组件【适用于自定义SVG】

#### 示例：

```js
import AdvanceBtn from '@/components/AdvanceBtn'

class Demo extends React.Component {
  state = {
    displayAdvance: false
  }

  showAdvance = () => {
    this.setState({ displayAdvance: !this.state.displayAdvance})
  }
  render () {
    const { displayAdvance, showAdvance } = this.props

  	return (
      <AdvanceBtn displayAdvance={displayAdvance} showAdvance={showAdvance} id="advanceBtn"/>
  	)
  }

}
```

#### 参数说明

|  参数名称  | 参数描述 | 参数类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  displayAdvance  | 是否展开高级样式状态位 | bool | false |
|  showAdvance  | 切换展开高级样式状态function | func |  |
|  id  |  高级按钮所用id  |  string  |  'advanceBtn' |
