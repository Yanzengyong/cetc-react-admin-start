<!--
 * @Author: Zhangyao
 * @Date: 2020-09-18 11:38:28
 * @LastEditors: Zhangyao
 * @LastEditTime: 2020-10-09 15:28:46
-->
# ICON组件【适用于自定义SVG】

#### 示例：

```js
import Ellipsis from '@/components/Ellipsis'

class Demo extends React.Component {

  render () {
  	return (
      <Ellipsis alignCenter text='这是一段很长的文字描述' />
  	)
  }

}
```

#### 参数说明

| 参数名称    | 参数描述     | 参数类型 | 默认值                                    |
| ----------- | ------------ | -------- | ----------------------------------------- |
| text        | 文字内容     | String   | -                                         |
| alignCenter | 文字是否居中 | Boolean  | 默认: false <br/> 效果: textAlign: 'left' |
| style       | 样式         | Object   | -                                         |
| line        | 行数         | number   | 必传，1或者2,默认为1                      |
