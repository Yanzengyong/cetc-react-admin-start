<!--
 * @Author: ShenLing
 * @Date: 2020-12-03 10:42:17
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-12-30 14:09:10
-->
## Q1
> 引入'@/utils/common'内的方法(必须引入tab，否则不生效)

```js
import { connect } from 'react-redux'
import { Tab } from '@/reduxActions'
@connect((state) => ({ state: state.tabs }), Tab)
```


## Q2
> leaveAndStorage()和hasStorageAndInit()方法中仅保存field内容，未能保存state状态

```js
	componentDidMount() {
		const initData = hasStorageAndInit()
		// 存在当前修改
		if (initData) {
			this.field.setValues(initData)
		}
	}

	componentWillUnmount () {
		this.setState = () => {
			return
		}
		// 以当前的地址为存储的唯一key，当前地址应该为pathname+search
		const pathObj = this.props.location
		const storageName = `${pathObj.pathname}${pathObj.search}`
		// 存储你需要存储的状态对象
		const data = this.field.getValues()
		leaveAndSave(storageName, data)
	}


```
## Q3

> safari浏览器适配input的disable时会出现纯白情况，无法看清输入框内的内容。待解决：1.通过主题包改；2.更换写法来替代disable；3.代码中加入safari浏览器的判断修改样式；
