# React / JSX 代码规范

<!-- TOC depthFrom:2 depthTo:2 -->

- [1 基本规则](#1-基本规则)
- [2 命名](#2-命名)
- [3 声明](#3-声明)
- [4 对齐](#4-对齐)
- [5 引号](#5-引号)
- [6 空格](#6-空格)
- [7 Props](#7-props)
- [8 Refs](#8-refs)
- [9 括号](#9-括号)
- [10 标签](#10-标签)
- [11 方法](#11-方法)
- [12 顺序](#12-顺序)

<!-- /TOC -->

## 1 基本规则

### 1.1 [建议] 一个文件只包含一个 React 组件

### 1.2 [强制] 如果有内部 `state` 或者 `refs`, 使用 `class` 继承 `React.Component` 或 `React.PureComponent`

``` js
// bad
const Listing = React.createClass({
  // ...
  render() {
    return <div>{this.state.hello}</div>;
  }
});

// good
class Listing extends React.Component {
  // ...
  render() {
    return <div>{this.state.hello}</div>;
  }
}
```

### 1.3 [建议] 如果没有内部 `state` 或者 `refs`, 使用一般函数组件而不是 `class`

``` js
// bad
class Listing extends React.Component {
  render() {
    return <div>{this.props.hello}</div>;
  }
}

// bad (relying on function name inference is discouraged)
const Listing = ({ hello }) => (
  <div>{hello}</div>
);

// good
function Listing({ hello }) {
  return <div>{hello}</div>;
}
```

### 1.4 [强制] 禁止为继承自 `React.PureComponent` 的组件编写 `shouldComponentUpdate` 实现

### 1.5 [建议] 根据需要, 为函数组件添加 `PureComponent` 能力, 可以使用 `React.memo` 或者 [recompose](https://github.com/acdlite/recompose) 的 `pure` 等

### 1.6 [强制] 禁止使用 `Mixins`

### 1.7 [强制] 禁止使用 `React.createClass`

## 2 命名

### 2.1 [强制] React 组件使用 `.jsx` / `.tsx` 作为文件扩展名

### 2.2 [强制] 文件名使用 `PascalCase` 风格

### 2.3 [强制] 组件名使用 `PascalCase` 风格, 实例名使用 `camelCase` 风格

``` js
// bad
import reservationCard from './ReservationCard';

// good
import ReservationCard from './ReservationCard';

// bad
const ReservationItem = <ReservationCard />;

// good
const reservationItem = <ReservationCard />;
```

### 2.4 [建议] 使用文件名作为组件名

``` js
// bad
import Footer from './Footer/Footer';

// bad
import Footer from './Footer/index';

// good
import Footer from './Footer';
```

### 2.5 [建议] 高阶组件使用 `camelCase` 风格命名, 高阶组件返回新组件时添加 `displayName` 属性

``` js
// bad
export default function withFoo(WrappedComponent) {
  return function WithFoo(props) {
    return <WrappedComponent {...props} foo />;
  }
}

// good
export default function withFoo(WrappedComponent) {
  function WithFoo(props) {
    return <WrappedComponent {...props} foo />;
  }

  const wrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';

  WithFoo.displayName = `withFoo(${wrappedComponentName})`;
  return WithFoo;
}
```

### 2.6 [强制] 属性命名: 组件避免使用 DOM 属性名来表示不一致的含义

``` js
// bad
<MyComponent style="fancy" />

// bad
<MyComponent className="fancy" />

// good
<MyComponent variant="fancy" />
```

## 3 声明

### 3.1 [强制] 属性命名: 不要使用 `diplayName` 来命名组件, 应该使用组件的引用名

``` js
// bad
export default React.createClass({
  displayName: 'ReservationCard',
  // stuff goes here
});

// good
export default class ReservationCard extends React.Component {
}
```

## 4 对齐

### 4.1 [强制] JSX 遵循以下对齐风格

``` js
// bad
<Foo superLongParam="bar"
     anotherSuperLongParam="baz" />

// good
<Foo
  superLongParam="bar"
  anotherSuperLongParam="baz"
/>

// if props fit in one line then keep it on the same line
<Foo bar="bar" />

// children get indented normally
<Foo
  superLongParam="bar"
  anotherSuperLongParam="baz"
>
  <Quux />
</Foo>

// bad
{showButton &&
  <Button />
}

// bad
{
  showButton &&
    <Button />
}

// good
{showButton && (
  <Button />
)}

// good
{showButton && <Button />}
```

## 5 引号

### 5.1 [强制] JSX 属性始终使用双引号 `"`, 其他 JS 始终使用单引号 `'`

``` js
// bad
<Foo bar='bar' />

// good
<Foo bar="bar" />

// bad
<Foo style={{ left: "20px" }} />

// good
<Foo style={{ left: '20px' }} />
```

## 6 空格

### 6.1 [强制] 始终在自闭合标签前加一个空格

``` js
// bad
<Foo/>

// very bad
<Foo                 />

// bad
<Foo
 />

// good
<Foo />
```

### 6.2 [强制] 不要在 JSX 大括号里面填充空格

``` js
// bad
<Foo bar={ baz } />

// good
<Foo bar={baz} />
```

## 7 Props

### 7.1 [强制] 属性名始终使用 `camelCase` 风格

``` js
// bad
<Foo
  UserName="hello"
  phone_number={12345678}
/>

// good
<Foo
  userName="hello"
  phoneNumber={12345678}
/>
```

### 7.2 [强制] 对于多属性需要换行, 从第一个属性开始, 每个属性一行
``` js
// 没有子节点
<SomeComponent
  longProp={longProp}
  anotherLongProp={anotherLongProp}
/>

// 有子节点
<SomeComponent
  longProp={longProp}
  anotherLongProp={anotherLongProp}
>
  <SomeChild />
  <SomeChild />
</SomeComponent>
```

### 7.3 [强制] 当属性值是 `true` 的时候忽略属性值

``` js
// bad
<Foo
  hidden={true}
/>

// good
<Foo
  hidden
/>

// good
<Foo hidden />
```

### 7.4 [建议] 避免使用数组索引作为 `key`, 使用一个稳定的 ID

``` js
// bad
{todos.map((todo, index) =>
  <Todo
    {...todo}
    key={index}
  />
)}

// good
{todos.map(todo => (
  <Todo
    {...todo}
    key={todo.id}
  />
))}
```

### 7.5 [建议] 对于所有非 `isRequired` 的属性，在 `defaultProps` 中声明对应的值

``` js
// bad
function SFC({ foo, bar, children }) {
  return <div>{foo}{bar}{children}</div>;
}
SFC.propTypes = {
  foo: PropTypes.number.isRequired,
  bar: PropTypes.string,
  children: PropTypes.node,
};

// good
function SFC({ foo, bar, children }) {
  return <div>{foo}{bar}{children}</div>;
}
SFC.propTypes = {
  foo: PropTypes.number.isRequired,
  bar: PropTypes.string,
  children: PropTypes.node,
};
SFC.defaultProps = {
  bar: '',
  children: null,
};
```

## 8 Refs

### 8.1 [强制] 不要使用字符串作为 `ref`, 使用 [`callback pattern`](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) 或者 [`createRef API`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs)

``` js
// bad
<Foo
  ref="myRef"
/>

// good
<Foo
  ref={(ref) => { this.myRef = ref; }}
/>
```

## 9 括号

### 9.1 [强制] JSX 标签有多行的时候使用括号 `()` 包起来

``` js
// bad
render() {
  return <MyComponent variant="long body" foo="bar">
           <MyChild />
         </MyComponent>;
}

// good
render() {
  return (
    <MyComponent variant="long body" foo="bar">
      <MyChild />
    </MyComponent>
  );
}

// good, when single line
render() {
  const body = <div>hello</div>;
  return <MyComponent>{body}</MyComponent>;
}
```

## 10 标签

### 10.1 [强制] 没有子标签的时候使用自闭合标签

``` js
// bad
<Foo variant="stuff"></Foo>

// good
<Foo variant="stuff" />
```

### 10.2 [强制] 如果组件有多个属性, 闭标签放到新的一行

``` js
// bad
<Foo
  bar="bar"
  baz="baz" />

// good
<Foo
  bar="bar"
  baz="baz"
/>
```

## 11 方法

### 11.1 [强制] 需要捕获局部变量时候使用箭头函数

``` js
function ItemList(props) {
  return (
    <ul>
      {props.items.map((item, index) => (
        <Item
          key={item.key}
          onClick={() => doSomethingWith(item.name, index)}
        />
      ))}
    </ul>
  );
}
```

### 11.2 [强制] 事件处理函数需要访问 `this` 时候定义成箭头函数

``` js
// bad
class extends React.Component {
  onClickDiv() {
    // do stuff
  }

  render() {
    return <div onClick={this.onClickDiv.bind(this)} />;
  }
}

// good
class extends React.Component {
  constructor(props) {
    super(props);

    this.onClickDiv = this.onClickDiv.bind(this);
  }

  onClickDiv() {
    // do stuff
  }

  render() {
    return <div onClick={this.onClickDiv} />;
  }
}

// best
class extends React.Component {
  onClickDiv = () => {
    // do stuff
  }

  render() {
    return <div onClick={this.onClickDiv} />;
  }
}
```

### 11.3 [强制] 方法不要使用 `_` 前缀

``` js
/ bad
React.createClass({
  _onClickSubmit() {
    // do stuff
  },

  // other stuff
});

// good
class extends React.Component {
  onClickSubmit() {
    // do stuff
  }

  // other stuff
}
```

## 12 顺序

### 12.1 [建议] React 组件属性方法定义顺序

1. `static displayName`
2. `static propTypes`
3. `static contextTypes`
4. `static defaultProps`
5. `static state`
6. 其它静态的属性
7. 其它实例属性
8. `constructor`
9. `getChildContext`
10. `componentWillMount`
11. `componentDidMount`
12. `componentWillReceiveProps`
13. `shouldComponentUpdate`
14. `componentWillUpdate`
15. `componentDidUpdate`
16. `componentWillUnmount`
18. 事件处理方法
19. 其他方法
20. `render`

``` js
import React from 'react';
import PropTypes from 'prop-types';

export default class Link extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    text: PropTypes.string,
  }

  static defaultProps = {
    text: 'Hello World',
  }

  static methodsAreOk() {
    return true;
  }

  render() {
    return <a href={this.props.url} data-id={this.props.id}>{this.props.text}</a>;
  }
}
```
