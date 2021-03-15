# ICON组件【适用于自定义SVG】

#### 示例：

```js
import IconFont from '@/components/IconFont'

class Demo extends React.Component {

  render () {
  	return (
      <IconFont className='icon_style' type='iconadd' />
  	)
  }

}
```

#### 参数说明

|  参数名称  | 参数描述 | 参数类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  size  | 图标大小 | String | 可选值：xxs, xs, small, medium, large, xl, xxl, xxxl, inherit <br/> 默认值：medium |
|  type  | 图标样式 | String | 可选值：iconfont工程文件图标名称，直接复制粘贴即可 |
