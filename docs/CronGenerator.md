<!--
 * @Author: ShenLing
 * @Date: 2020-10-27 10:05:56
 * @LastEditors: Shenling
 * @LastEditTime: 2020-10-28 09:28:36
-->
# CRON 表达式生成器

> CRON表达式：用于定时任务中配置时间周期的字符串
> 
> 主要功能：
> 1. 进行CRON字符串内容解析到UI
> 2. 根据UI内容选择，获取对应的CRON表达式
> 3. 以对话框形式显示
>

---


### 示例：
```js
import CronGenerator from '@/components/CronGenerator'

onClose = () => {
	this.setState({ cronGeneratorVisible: false })
}

onConfirm = (val) => {
	console.log('NEW CRON: ' + val)
}

render () {
	return (
		<CronGenerator
			isPreview
			initCron={this.field.getValue('jobCron')}
			dialogVisible={cronGeneratorVisible}
			onClose={this.onClose}
			onConfirm={this.onConfirm}
		/>
	)
}
```

### 参数
| 参数名称      | 参数描述                           | 参数类型   | 默认值  | 备注                                           |
| -----------   | ---------------------------------- | ---------- | -------| ---------------------------------------------- |
| isPreview     | 是否开启预览模式                   | Boolean     | false  | 该模式下，将不会显示新增取消按钮                                             |
| initCron      | 需传入解析到UI界面的CRON字符串     | String      | -      | -                                             |
| dialogVisible | CRON对话框显示                     | Boolean     | false  | -                                             |
| onClose       | 关闭对话框对应方法，且取消获取CRON  | Function   | -      | -                                             |
| onConfirm     | 关闭对话框且获取到最新的CRON表达式  | Function   |  -     | 该方法中会传入一个参数val，代表生成的cron表达式|


