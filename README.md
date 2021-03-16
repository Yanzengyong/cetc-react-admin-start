# React后台管理项目模板

## 前言

> 项目构建是基于create-react-app进行构建的，自定义配置使用了config-overrides，详细配置方法可在网上搜索查找；需要注意的是：**项目开发前，务必详细阅读本文档以及[前端开发规范](./specification/index.md)**

## 项目启动

```sh
yarn start

# or

npm run start
```

## 项目打包

```sh
yarn build

# or

npm run build
```

## 基础篇

> 模板中包含两种使用场景

### 1.【场景1】项目工程不包含登录（login）页面，用户从其他地方跳转到该项目（页面）；

使用：

* 删除src/layout/spare.js
* 删除src/routes/spare.js
* 删除src/pages/Login

---

### 2.【场景2】项目工程包含登录（login）页面，用户需在项目中的登陆页登陆后才可以访问其他页面；

使用：

* 将src/layout/spare.js中的spare.js改成index.js并且删除原index.js文件
* 将src/routes/spare.js中的spare.js改成index.js并且删除原index.js文件

---

### 包含生命周期的组件

* 强制要求在组件卸载的生命周期中为setState置空，即清除网络状态

  ```js
  componentWillUnmount () {
    this.setState = () => {
      return
    }
  }
  ```

---

### 页面组件的引用

* 建议使用按需引入的方式引入

  ```jsx
  import AsyncComponent from '@/utils/asyncComponent'
  
  const MainPage = AsyncComponent(() => import('@/pages/Main'))
  
  export default {
  	MainPage, // 首页
  }
  ```

---

## 路由篇

> 路由格式：/平台名称/菜单名称/功能名称 【或】 /平台名称/父级菜单名称/菜单名称/功能名称
>
> 注：需要注意的是配置DefaultMenu时，path格式为/pure(或layoutname)/*；但是配置菜单时无需加pure或者layoutname前缀，因为会有enhancerMenu函数帮你自动加上

### 1.【场景1】项目工程不包含登录（login）页面，用户从其他地方跳转到该项目（页面）；

* 配置默认路由，打开“src/utils/menuForRoute.js”，配置DefaultMenu对象，**path属性为访问地址是“/”时重定向的新地址（注：路由地址必须是“/pure”或者“/layoutname”作为开头，pure为无layout的页面，layoutname为当前页面使用的layout名称）**；
* 关于路由权限的配置，可根据实际后端返回的数据情况修改src/routes/index.js中AuthRouteComponentHandle函数的role判断；

---

### 2.【场景2】项目工程包含登录（login）页面，用户需在项目中的登陆页登陆后才可以访问其他页面；

* 配置默认路由，打开“src/utils/menuForRoute.js”，配置DefaultMenu对象，**path属性为访问地址是“/”时重定向的新地址（注：路由地址必须是“/pure”或者“/layoutname”作为开头，pure为无layout的页面，layoutname为当前页面使用的layout名称）**；

* 关于路由权限的配置，可根据实际后端返回的数据情况修改src/routes/index.js中AuthRouteComponentHandle函数的role判断；

* 添加无需登陆即可访问的页面的路由，例如：打开src/routes/index.js，引用登陆页面在Routes类中使用：

  ```jsx
  import Login from '@/pages/Login'
  
  @withRouter
  class Routes extends React.Component {
  	render () {
  		return (
  			<Switch>
  				<Route path='/login' component={Login}/>
  				{
  					......
  				}
  				<Redirect from='/' exact to={DefaultMenu.path} />
  				<Route component={NotFound}/>
  			</Switch>
  		)
  	}
  }
  ```


---

## 菜单篇

> 菜单可以在前端自定义写好，也可以通过后端获取渲染，菜单中需要设置所有页面的路由地址及对应的component

#### 菜单配置的参数说明

| 参数名称    | 参数描述                                                     | 参数类型 | 默认值 |
| ----------- | :----------------------------------------------------------- | -------- | ------ |
| title       | 菜单/平台名称                                                | Sring    | ''     |
| icon        | 菜单图标                                                     | Sring    | ''     |
| path        | 菜单/平台对应路由                                            | Sring    | ''     |
| defaultPath | 平台的默认的菜单路由（平台默认页）                           | Sring    | ''     |
| sideMenu    | 平台的菜单数组对象                                           | Array    | []     |
| layout      | 平台的layout组件名称（也是路由篇中的layoutname）             | Sring    | ''     |
| subLink     | 不可下拉的菜单是否可以进行跳转                               | Boolean  | -      |
| isSub       | 是否为submenu，设置值为true，可以下拉该菜单，此时不需要写component和exact | Boolean  | -      |
| exact       | 路由地址是否为精确匹配                                       | Boolean  | false  |
| role        | 该菜单（路由）可以的鉴权，例：['sys_admin', 'service_admin', 'service_operator'] | Array    | -      |
| isHide      | 是否隐藏该路由菜单， 若需要隐藏，则设置isHide: 'Y'           | String   | -      |
| component   | 该路径下对应的组件名称，没有则不写                           | String   | -      |
| children    | 该路径下的子集，没有则不写                                   | Array    | []     |
| type        | 新建/编辑/查看路由下，需增加类型属性，指明跳转至该类型页面   | String   | -      |

---

### 1.【场景1】项目工程不包含登录（login）页面，用户从其他地方跳转到该项目（页面）；

* 在src/pagesConfig/index.js引入layout组件及平台文件（**layout组件导出名称应与菜单中配置的layout名称一致**）；
* 在src/pagesConfig/platform_name.js中引入使用到的页面组件并导出（**页面组件导出名称应与菜单中配置的component名称一致**）；

---

### 2.【场景2】项目工程包含登录（login）页面，用户需在项目中的登陆页登陆后才可以访问其他页面；

* 在src/pagesConfig/index.js引入layout组件及平台文件（**layout组件导出名称应与菜单中配置的layout名称一致**）；
* 在src/pagesConfig/platform_name.js中引入使用到的页面组件并导出（**页面组件导出名称应与菜单中配置的component名称一致**）；

---

## 组件篇

* 基础组件写在components文件夹中，以文件夹为组件单位，文件夹首字母大写；
* 服务组件（包含请求等可整体复用的组件或页面）写在componentsService文件夹中，以文件夹为服务组件单位，文件夹首字母大写；

---

## 页面篇

* 页面写在pages文件夹中，以文件夹为页面单位，文件夹首字母大写，文件夹层级对应实际的页面层级；

---

## 工具类篇

---

## redux篇

---

## 数据请求篇

> 基础请求地址（requestBaseUrl）等在public/ipConfig.js中配置并导出，同时需要在src/api/index.js引入ipConfig.js并再次导出
>
> 注：这么做的目的是为了ipConfig.js不会被webpack编译，而是直接将ipConfig.js输出到打包文件夹中引用，这么做的好处是可以一次打包多次使用（同一版本的打包文件只需修改ipConfig即可满足不同请求需求的部署）

### 关于ipConfig文件说明

* 常量约定全部大写，“_”区分间隔；
* 若配置时需要用到变量，如“window.location.host”，可以写成```const Host = 'http://${window.location.host}/api/'```，变量部分用${}包裹既可以。**注：无需用es6中的字符串模版“ ` ` ”，写成字符串即可**；

### 关于api文件夹说明

* 建立index.js文件，引用ipConfig文件并导出；
* index.js下定义的常量约定全部大写，“_”区分间隔；
* 在api文件夹下以功能（菜单）为单位新建文件，首字母大写；
* 文件夹下的文件名称首字母大写；

例子：

```js
/* public/ipConfig.js **/

const Host = 'http://${window.location.host}/api/'
// const Host = 'http://10.1.119.26:50200/'

const LOGIN_URL = 'http://172.16.117.172/systemlogin/#/login' // 登录页

exports.Host = Host
exports.LOGIN_URL = LOGIN_URL
```

```js
/* src/api/index.js **/

const Config = require('IpConfig')

let Host = Config.Host

if (Config.Host.indexOf('window.location.host') !== -1) {
	const header = Config.Host.split('$')[0]
	const footer = Config.Host.split('}')[1]
	Host = header + window.location.host + footer
}

const LOGIN_URL = Config.LOGIN_URL

export { Host, LOGIN_URL }
```

---

### 关于接口的请求

* 在actions文件夹下以功能（菜单）为单位新建文件，与api文件统一；
* BaseUrl统一引用api文件夹下的index.js内容；
* 提示都在屏幕上方显示；
* 提示不加遮罩层，不加关闭按钮，显示时长用默认（3s）无需设置；
* 统一文件名称首字母大写；

请求例子：

```js
import api from '@/api/Test' // 引用baseurl地址
import request from '@/services' // 引用请求
import { Message } from '@alifd/next' // 引用提示组件

async getDispatchListRQ (params) {
	try {
		const result = await request.get(api.getDispatchList, params)
		return result
	} catch (error) {
	   if (error && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
			Message.error('请求超时，请检查网络')
		} else {
			Message.error('服务器未知异常，请联系管理员')
		}
	}
}

// 调用时
getInfo = async () => {
  const response = await getDispatchListRQ({
    uuid: this.state.uuid
  })
  if (response) { // 注意：此处一定要先做response的判断，不能写在一行，目的是为code不等于1000后的else做提示语的保证
    if (response.code === 10000) {
    // 当code为成功的时候
    } else {
      // 否则提示后端返回的提示语
      Message.error(response.msg || 'xx失败！')
    }
  }
}

/*
注：所有的提示都在屏幕上方显示（好处不会被遮蔽，统一提示风格），不加遮罩层，不加关闭按钮，显示时长用默认（3s）无需设置
**/
```

---

### 关于Tab栏的注意事项

* tab栏支持手动方法删除tab，应用场景为编辑新增等页面在保存、取消时候返回并删除该tab
```js
import { Tab } from '@/reduxActions'

// 返回业务管理主页
onBack = async () => {
	const {
		pathname,
		search
	} = this.props.location

	this.props.history.push(businessManageRoute.path)
	// 注意设置tab的方法需要放在路由跳转的后面
	await this.props.setDeleteTabPath([`${pathname}${search}`])
	this.props.closeItemTab(`${pathname}${search}`)
}

// 该方法基于store，所以需要connect并且引入reduxActions
```

* tab栏支持存储切换离开时候的特定属性，无需考虑何时清除，清除功能已集成在方法中（会在该tab被关闭时清除）

```js
import { leaveAndSave, hasStorageAndInit } from 'utils/common'


componentDidMount () {

	const initData = hasStorageAndInit()
	// 存在当前修改
	if (initData) {
		this.field.setValues(initData)
	} else {
		if (this.props.pageType === 'edit') {
			// 如果没有初始值、并且是编辑时，获取编辑详情
			this.initFieldList(this.props.initFieldUuid)
		}
	}

}

componentWillUnmount () {

	// 以当前的地址为存储的唯一key，当前地址应该为pathname+search
	const pathObj = this.props.location
	const storageName = `${pathObj.pathname}${pathObj.search}`
	// 存储你需要存储的状态对象
	const data = this.field.getValues()
	leaveAndSave(storageName, data)

	this.setState = () => {
		return
	}
}
```



