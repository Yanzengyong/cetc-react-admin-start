# JavaScript/JSX/TypeScript 代码规范

<!-- TOC depthFrom:2 depthTo:3 -->

- [1 前言](#1-前言)
- [2 文件](#2-文件)
- [3 JavaScript 语言特性](#3-javascript-语言特性)
  - [3.1 引用](#31-引用)
  - [3.2 对象](#32-对象)
  - [3.3 数组](#33-数组)
  - [3.4 解构](#34-解构)
  - [3.5 字符串](#35-字符串)
  - [3.6 函数](#36-函数)
  - [3.7 类](#37-类)
  - [3.8 模块](#38-模块)
  - [3.9 迭代器和生成器](#39-迭代器和生成器)
  - [3.10 属性](#310-属性)
  - [3.11 变量](#311-变量)
  - [3.12 比较操作符和相等](#312-比较操作符和相等)
  - [3.13 代码块](#313-代码块)
  - [3.14 控制语句](#314-控制语句)
  - [3.15 注释](#315-注释)
  - [3.16 空格](#316-空格)
  - [3.17 逗号](#317-逗号)
  - [3.18 分号](#318-分号)
  - [3.19 类型转换](#319-类型转换)
  - [3.20 命名规范](#320-命名规范)
  - [3.21 访问器](#321-访问器)
  - [3.22 事件](#322-事件)
  - [3.23 jQuery](#323-jquery)
  - [3.24 标准库](#324-标准库)
- [4 JSX / React](#4-jsx--react)
- [5 TypeScript](#5-typescript)
- [6 代码格式检查和自动格式化](#6-代码格式检查和自动格式化)
- [7 参考](#7-参考)

<!-- /TOC -->

## 1 前言

JavaScript 作为网页样式的描述语言，在公司一直有着广泛的应用。本文档的目标是使 JavaScript 代码风格保持一致，容易理解和维护。

虽然本文档是针对 JavaScript 设计的，但是在使用其他编译到 JavaScript 的语言（TypeScript 等）时候，适用的部分也应尽量遵循本文档的约定。

## 2 文件

#### 2.1 [强制] `JavaScript` 文件使用无 `BOM` 的 `UTF-8` 编码

UTF-8 不需要 BOM 来表明字节顺序，不要使用 Windows 的记事本改代码！

#### 2.2 [建议] 在文件结尾处，保留一个空行。
#### 2.3 [建议] 采用 `LF` 作为换行符。

## 3 JavaScript 语言特性

### 3.1 引用

#### 3.1.1 [强制] 对所有引用都使用 `const`，禁止使用 `var`
``` js
// bad
var a = 1;
var b = 2;

// good
const a = 1;
const b = 2;
```
#### 3.1.2 [强制] 如果引用是可变的，则使用 `let`
``` js
// bad
var count = 1;
if (true) {
  count += 1;
}

// good, use the let.
let count = 1;
if (true) {
  count += 1;
}
```

### 3.2 对象

#### 3.2.1 [强制] 请使用字面量值创建对象
``` js
// bad
const item = new Object();

// good
const item = {};
```

#### 3.2.2 [强制] 当属性名是动态的时候，使用属性名表达式

``` js
function getKey(k) {
  return `a key named ${k}`;
}

// bad
const obj = {
  id: 5,
  name: 'San Francisco',
};
obj[getKey('enabled')] = true;

// good
const obj = {
  id: 5,
  name: 'San Francisco',
  [getKey('enabled')]: true,
};
```

#### 3.2.3 [强制] 使用对象方法的简写方式
``` js
// bad
const atom = {
  value: 1,

  addValue: function (value) {
    return atom.value + value;
  },
};

// good
const atom = {
  value: 1,

  addValue(value) {
    return atom.value + value;
  },
};
```

#### 3.2.4 [强制] 使用对象属性值的简写
``` js
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  lukeSkywalker: lukeSkywalker,
};

// good
const obj = {
  lukeSkywalker,
};
```

#### 3.2.5 [建议] 对象属性简写分组
``` js
const anakinSkywalker = 'Anakin Skywalker';
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  lukeSkywalker,
  episodeThree: 3,
  mayTheFourth: 4,
  anakinSkywalker,
};

// good
const obj = {
  lukeSkywalker,
  anakinSkywalker,
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  episodeThree: 3,
  mayTheFourth: 4,
};
```

#### 3.2.6 [强制] 属性名为非法标识符时才加引号
``` js
// bad
const bad = {
  'foo': 3,
  'bar': 4,
  'data-blah': 5,
};

// good
const good = {
  foo: 3,
  bar: 4,
  'data-blah': 5,
};
```

#### 3.2.7 [建议] 对象浅拷贝时，更推荐使用扩展运算符 `...`
```js
// very bad
const original = { a: 1, b: 2 };
const copy = Object.assign(original, { c: 3 }); // this mutates `original` ಠ_ಠ
delete copy.a; // so does this

// bad
const original = { a: 1, b: 2 };
const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }

// good es6扩展运算符 ...
const original = { a: 1, b: 2 };
// 浅拷贝
const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

// rest 赋值运算符
const { a, ...noA } = copy; // noA => { b: 2, c: 3 }
```

### 3.3 数组

#### 3.3.1 [建议] 请使用字面量值创建数组
``` js
// bad
const items = new Array();

// good
const items = [];
```

#### 3.3.2 [建议] 向数组中添加元素时使用 `Array#push`
``` js
const someStack = [];

// bad
someStack[someStack.length] = 'abracadabra';

// good
someStack.push('abracadabra');
```

#### 3.3.3 [强制] 使用拓展运算符 `...` 浅拷贝数组
``` js
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i += 1) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

#### 3.3.4 [建议] 将可迭代对象转换成数组时优先使用 `...`
``` js
const foo = document.querySelectorAll('.foo');

// good
const nodes = Array.from(foo);

// best
const nodes = [...foo];
```

#### 3.3.5 [建议] 将类数组对象转换成数组时优先使用 `Array.from`
``` js
const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 };

// bad
const arr = Array.prototype.slice.call(arrLike);
const arr = [].slice.call(arrLike);

// good
const arr = Array.from(arrLike);
```

#### 3.3.6 [强制] 在数组方法的回调函数中使用 `return` 语句。 如果函数体由一条返回一个表达式的语句组成， 并且这个表达式没有副作用， 这个时候可以忽略 `return`
``` js
// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map(x => x + 1);

// bad - no returned value means `acc` becomes undefined after the first iteration
[[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {
  const flatten = acc.concat(item);
  acc[index] = flatten;
});

// good
[[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {
  const flatten = acc.concat(item);
  acc[index] = flatten;
  return flatten;
});

// bad
inbox.filter((msg) => {
  const { subject, author } = msg;
  if (subject === 'Mockingbird') {
    return author === 'Harper Lee';
  } else {
    return false;
  }
});

// good
inbox.filter((msg) => {
  const { subject, author } = msg;
  if (subject === 'Mockingbird') {
    return author === 'Harper Lee';
  }

  return false;
});
```

#### 3.3.7 [强制] 如果一个数组有很多行，在数组的 `[` 后和 `]` 前断行
``` js
// bad
const arr = [
  [0, 1], [2, 3], [4, 5],
];

const objectInArray = [{
  id: 1,
}, {
  id: 2,
}];

const numberInArray = [
  1, 2,
];

// good
const arr = [[0, 1], [2, 3], [4, 5]];

const objectInArray = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];

const numberInArray = [
  1,
  2,
];
```

#### 3.3.8 [强制] 使用数组方法 `map`, `reduce`, `filter`, `some`, `every`, `find`, `findIndex` 等方法时候禁止产生副作用
```js
const a = [
  { value: 2 },
  { value: 3 },
  { value: 4 },
];

// bad
const b = a.map(item => {
  item.value = item.value * 2
});

// good
const b = a.map(item => {
  return item.value * 2
});

const b = a.map(({ value }) => value * 2);
```

### 3.4 解构

#### 3.4.1 [建议] 当需要使用对象的多个属性时，请使用解构赋值
``` js
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// good
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

#### 3.4.2 [建议] 当需要使用数组的多个值时，请同样使用解构赋值
``` js
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

#### 3.4.3 [建议] 函数需要回传多个值时，请使用对象的解构，而不是数组的解构
``` js
// bad
function processInput(input) {
  // then a miracle occurs
  return [left, right, top, bottom];
}

// the caller needs to think about the order of return data
const [left, __, top] = processInput(input);

// good
function processInput(input) {
  // then a miracle occurs
  return { left, right, top, bottom };
}

// the caller selects only the data they need
const { left, top } = processInput(input);
```

### 3.5 字符串

#### 3.5.1 [强制] 字符串统一使用单引号的形式 `''`
``` js
// bad
const name = "Capt. Janeway";

// bad - template literals should contain interpolation or newlines
const name = `Capt. Janeway`;

// good
const name = 'Capt. Janeway';
```

#### 3.5.2 [建议] 字符串太长时候不要跨多行
``` js
// bad
const errorMessage = 'This is a super long error that was thrown because \
of Batman. When you stop to think about how Batman had anything to do \
with this, you would get nowhere \
fast.';

// bad
const errorMessage = 'This is a super long error that was thrown because ' +
  'of Batman. When you stop to think about how Batman had anything to do ' +
  'with this, you would get nowhere fast.';

// good
const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';
```

#### 3.5.3 [强制] 程序化生成字符串时，请使用模板字符串
``` js
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// bad
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

// bad
function sayHi(name) {
  return `How are you, ${ name }?`;
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

#### 3.5.4 [强制] 不要在字符串上使用 `eval()`

#### 3.5.5 [强制] 不要使用没必要的转义符
``` js
// bad
const foo = '\'this\' \i\s \"quoted\"';

// good
const foo = '\'this\' is "quoted"';
const foo = `my name is '${name}'`;
```

### 3.6 函数

#### 3.6.1 [建议] 请使用函数声明，而不是函数表达式
``` js
// bad
const foo = function () {
  // do something
}

// good
function foo () {
  // do something
}
```

#### 3.6.2 [建议] IIFE 语法
``` js
// bad
(function () {
  console.log('Welcome to the Internet. Please follow me.');
})();

// good
(function () {
  console.log('Welcome to the Internet. Please follow me.');
}());
```

#### 3.6.3 [强制] 不要在非函数代码块(`if`, `while` 等)中声明函数
``` js
// bad
if (isUse) {
  function test () {
    // do something
  }
}

// good
let test
if (isUse) {
  test = () => {
    // do something
  }
}
```

#### 3.6.4 [强制] 不要使用 `arguments`，可以选择使用 `...`
``` js
// bad
function foo(name, options, arguments) {
  // ...
}

// good
function foo(name, options, args) {
  // ...
}

// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}

// good
function concatenateAll(...args) {
  return args.join('');
}
```

#### 3.6.5 [强制] 使用默认参数而不是更改参数
``` js
// really bad
function handleThings(opts) {
  // No! We shouldn’t mutate function arguments.
  // Double bad: if opts is falsy it'll be set to an object which may
  // be what you want but it can introduce subtle bugs.
  opts = opts || {};
  // ...
}

// still bad
function handleThings(opts) {
  if (opts === void 0) {
    opts = {};
  }
  // ...
}

// good
function handleThings(opts = {}) {
  // ...
}
```

#### 3.6.6 [强制] 默认参数不要有副作用
``` js
var b = 1;
// bad
function count(a = b++) {
  console.log(a);
}
count();  // 1
count();  // 2
count(3); // 3
count();  // 3
```

#### 3.6.7 [强制] 默认参数位于最后
``` js
// bad
function handleThings(opts = {}, name) {
  // ...
}

// good
function handleThings(name, opts = {}) {
  // ...
}
```

#### 3.6.8 [强制] 不要使用 `Function` 构造器创建函数

真正需要用的时候除外。

``` js
// bad
var add = new Function('a', 'b', 'return a + b');

// still bad
var subtract = Function('a', 'b', 'return a - b');
```

#### 3.6.9 [强制] `function` 和函数名之间有一个空格，匿名函数 `function` 和 `(` 之间不要有空格，`)` 和 `{` 之间有一个空格
``` js
// bad
const f = function(){};
const g = function (){};
const h = function () {};

// good
const x = function() {};
const y = function a() {};
```

#### 3.6.10 [建议] 不要改变函数参数的内容
``` js
// bad
function f1(obj) {
  obj.key = 1;
}

// good
function f2(obj) {
  const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
}
```

#### 3.6.11 [建议] 不要对函数参数重新赋值
``` js
// bad
function f1(a) {
  a = 1;
  // ...
}

function f2(a) {
  if (!a) { a = 1; }
  // ...
}

// good
function f3(a) {
  const b = a || 1;
  // ...
}

function f4(a = 1) {
  // ...
}
```

#### 3.6.12 [强制] 使用 `...` 调用可变参数函数
``` js
// bad
const x = [1, 2, 3, 4, 5];
console.log.apply(console, x);

// good
const x = [1, 2, 3, 4, 5];
console.log(...x);

// bad
new (Function.prototype.bind.apply(Date, [null, 2016, 8, 5]));

// good
new Date(...[2016, 8, 5]);
```

#### 3.6.13 [强制] 函数参数太长需要换行, 每行值包含一个参数，每行逗号结尾
``` js
// bad
function foo(bar,
             baz,
             quux) {
  // ...
}

// good
function foo(
  bar,
  baz,
  quux,
) {
  // ...
}

// bad
console.log(foo,
  bar,
  baz);

// good
console.log(
  foo,
  bar,
  baz,
);
```

#### 3.6.14 [建议] 匿名函数优先使用剪头函数
``` js
// bad
[1, 2, 3].map(function (x) {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map(x => {
  const y = x + 1;
  return x * y;
});
```

#### 3.6.15 [强制] 箭头函数单个参数时候不使用括号
``` js
// bad
[1, 2, 3].map((x) => x * x);

// good
[1, 2, 3].map(x => x * x);

// good
[1, 2, 3].map(number => (
  `A long string with the ${number}. It’s so long that we don’t want it to take up space on the .map line!`
));

```

#### 3.6.16 [建议] 函数体由一个没有副作用的表达式语句组成，省略大括号和 `return`
``` js
// bad
[1, 2, 3].map(number => {
  const nextNumber = number + 1;
  `A string containing the ${nextNumber}.`;
});

// good
[1, 2, 3].map(number => `A string containing the ${number}.`);

// good
[1, 2, 3].map(number => {
  const nextNumber = number + 1;
  return `A string containing the ${nextNumber}.`;
});

```

### 3.7 类

#### 3.7.1 [强制] 使用 `class`，避免直接操作 `prototype`
``` js
// bad
function Queue(contents = []) {
  this.queue = [...contents];
}
Queue.prototype.pop = function () {
  const value = this.queue[0];
  this.queue.splice(0, 1);
  return value;
};

// good
class Queue {
  constructor(contents = []) {
    this.queue = [...contents];
  }
  pop() {
    const value = this.queue[0];
    this.queue.splice(0, 1);
    return value;
  }
}
```

#### 3.7.2 [强制] 继承使用 `extends`
``` js
// bad
const inherits = require('inherits');
function PeekableQueue(contents) {
  Queue.apply(this, contents);
}
inherits(PeekableQueue, Queue);
PeekableQueue.prototype.peek = function () {
  return this.queue[0];
};

// good
class PeekableQueue extends Queue {
  peek() {
    return this.queue[0];
  }
}
```

#### 3.7.3 [强制] 不要使用空 `constructor` 函数
``` js
// bad
class Jedi {
  constructor() {}

  getName() {
    return this.name;
  }
}

// bad
class Rey extends Jedi {
  constructor(...args) {
    super(...args);
  }
}

// good
class Rey extends Jedi {
  constructor(...args) {
    super(...args);
    this.name = 'Rey';
  }
}
```

#### 3.7.4 [强制] 不要重复类属性和方法
``` js
// bad
class Foo {
  bar() { return 1; }
  bar() { return 2; }
}

// good
class Foo {
  bar() { return 1; }
}

// good
class Foo {
  bar() { return 2; }
}
```

### 3.8 模块

#### 3.8.1 [强制] 用 (`import`/`export`) 模块
```js
// bad
const AirbnbStyleGuide = require('./AirbnbStyleGuide');
module.exports = AirbnbStyleGuide.es6;

// ok
import AirbnbStyleGuide from './AirbnbStyleGuide';
export default AirbnbStyleGuide.es6;

// best
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

#### 3.8.2 [强制] 不要用 `import` 通配符， 就是 `*` 这种方式
```js
// bad
import * as AirbnbStyleGuide from './AirbnbStyleGuide';

// good
import AirbnbStyleGuide from './AirbnbStyleGuide';
```

#### 3.8.3 [强制] 不要直接从 `import` 中直接 `export`
```js
// bad
// filename es6.js
export { es6 as default } from './AirbnbStyleGuide';

// good
// filename es6.js
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

#### 3.8.4 [强制] 一个路径只 `import` 一次
```js
// bad
import foo from 'foo';
// … some other imports … //
import { named1, named2 } from 'foo';

// good
import foo, { named1, named2 } from 'foo';

// good
import foo, {
  named1,
  named2,
} from 'foo';
```

#### 3.8.5 [强制] `import` 放在其他所有语句之前
```js
// bad
import foo from 'foo';
foo.init();

import bar from 'bar';

// good
import foo from 'foo';
import bar from 'bar';

foo.init();
```

#### 3.8.6 [强制] 在 `import` 语句里不允许 Webpack loader 语法
```js
// bad
import fooSass from 'css!sass!foo.scss';
import barCss from 'style!css!bar.css';

// good
import fooSass from 'foo.scss';
import barCss from 'bar.css';
```

#### 3.8.7 [建议] 多行 `import` 应该缩进，就像多行数组和对象字面量
```js
// bad
import {longNameA, longNameB, longNameC, longNameD, longNameE} from 'path';

// good
import {
  longNameA,
  longNameB,
  longNameC,
  longNameD,
  longNameE,
} from 'path';
```

#### 3.8.8 [建议] 在一个单一导出模块里，建议使用 `export default`
```js
// bad
export function foo() {}

// good
export default function foo() {}
```

### 3.9 迭代器和生成器

#### 3.9.1 [建议] 用数组的这些迭代方法代替 `for-in`、 `for-of`

用数组的这些迭代方法： `map()` / `every()` / `filter()` / `find()` / `findIndex()` / `reduce()` / `some()` / ... , 用对象的这些方法 `Object.keys()` / `Object.values()` / `Object.entries()`  去产生一个数组， 这样你就能去遍历对象了。

```js
const numbers = [1, 2, 3, 4, 5];

// bad
let sum = 0;
for (let num of numbers) {
  sum += num;
}
sum === 15;

// good
let sum = 0;
numbers.forEach(num => sum += num);
sum === 15;

// best (use the functional force)
const sum = numbers.reduce((total, num) => total + num, 0);
sum === 15;

// bad
const increasedByOne = [];
for (let i = 0; i < numbers.length; i++) {
  increasedByOne.push(numbers[i] + 1);
}

// good
const increasedByOne = [];
numbers.forEach(num => increasedByOne.push(num + 1));

// best (keeping it functional)
const increasedByOne = numbers.map(num => num + 1);
```

#### 3.9.2 [强制] `*` 和 `function` 之间不要有空格, `*` 和函数名之间要有一个空格
``` js
// bad
function * foo() {
  // ...
}

// bad
const bar = function * () {
  // ...
}

// bad
const baz = function *() {
  // ...
}

// bad
const quux = function* () {
  // ...
}

// bad
function*foo() {
  // ...
}

// bad
function *foo() {
  // ...
}

// very bad
function
*
foo() {
  // ...
}

// very bad
const wat = function
*
() {
  // ...
}

// good
function* foo() {
  // ...
}

// good
const foo = function*() {
  // ...
}
```

### 3.10 属性

#### 3.10.1 [建议] 访问属性时使用点符号，当获取的属性是变量时用方括号`[]`取
```js
const luke = {
  jedi: true,
  age: 28,
};

// bad
const isJedi = luke['jedi'];

// good
const isJedi = luke.jedi;

function getProp(prop) {
  return luke[prop];
}

const isJedi = getProp('jedi');
```

#### 3.10.2 [建议] 做幂运算时用幂操作符 `**`
``` js
// bad
const binary = Math.pow(2, 10);

// good
const binary = 2 ** 10;
```

### 3.11 变量

#### 3.11.1 [强制] 总是用 `const` 或 `let` 声明变量，避免产生全局变量，
```js
// bad
superPower = new SuperPower();

// bad
var superPower = new SuperPower();

// good
const superPower = new SuperPower();
```

#### 3.11.2 [强制] 每个变量都用一个 `const` 或 `let`
```js
// bad
const items = getItems(),
  goSportsTeam = true,
  dragonball = 'z';

// bad
// (compare to above, and try to spot the mistake)
const items = getItems(),
  goSportsTeam = true;
  dragonball = 'z';

// good
const items = getItems();
const goSportsTeam = true;
const dragonball = 'z';
```

#### 3.11.3 [建议] 在你需要的地方声明变量，但是要放在合理的位置

`let` 和 `const` 都是块级作用域而不是函数级作用域

```js
// bad - unnecessary function call
function checkName(hasName) {
  const name = getName();

  if (hasName === 'test') {
    return false;
  }

  if (name === 'test') {
    this.setName('');
    return false;
  }

  return name;
}

// good
function checkName(hasName) {
  if (hasName === 'test') {
    return false;
  }

  // 在需要的时候分配
  const name = getName();

  if (name === 'test') {
    this.setName('');
    return false;
  }

  return name;
}
```

#### 3.11.4 [强制] 不要使用链式变量分配
```js
// bad
(function example() {
  // JavaScript interprets this as
  // let a = ( b = ( c = 1 ) );
  // The let keyword only applies to variable a; variables b and c become
  // global variables.
  let a = b = c = 1;
}());

console.log(a); // throws ReferenceError
console.log(b); // 1
console.log(c); // 1

// good
(function example() {
  let a = 1;
  let b = a;
  let c = a;
}());

console.log(a); // throws ReferenceError
console.log(b); // throws ReferenceError
console.log(c); // throws ReferenceError

// the same applies for `const`
```

#### 3.11.5 [强制] 不允许有未使用的变量
```js
// bad

const some_unused_var = 42;

// Write-only variables are not considered as used.
let y = 10;
y = 5;

// A read for a modification of itself is not considered as used.
let z = 0;
z = z + 1;

// Unused function arguments.
function getX(x, y) {
  return x;
}

// good

function getXPlusY(x, y) {
  return x + y;
}

const x = 1;
const y = a + 2;

alert(getXPlusY(x, y));

// 'type' is ignored even if unused because it has a rest property sibling.
// This is a form of extracting an object that omits the specified keys.
const { type, ...coords } = data;
// 'coords' is now the 'data' object without its 'type' property.
```

#### 3.11.6 [建议] `const` 放一起，`let` 放一起
```js
// bad
let i, len, dragonball,
  items = getItems(),
  goSportsTeam = true;

// bad
let i;
const items = getItems();
let dragonball;
const goSportsTeam = true;
let len;

// good
const goSportsTeam = true;
const items = getItems();
let dragonball;
let i;
let length;
```

### 3.12 比较操作符和相等

#### 3.12.1 [强制] 用 `===` 和 `!==` 而不是 `==` 和 `!=`, 仅当判断 `null` 或 `undefined` 时，允许使用 `== null`

#### 3.12.2 [强制] 布尔值用缩写，而字符串和数字要明确比较对象
```js
// bad
if (isValid === true) {
  // ...
}

// good
if (isValid) {
  // ...
}

// bad
if (name) {
  // ...
}

// good
if (name !== '') {
  // ...
}

// bad
if (collection.length) {
  // ...
}

// good
if (collection.length > 0) {
  // ...
}
```

#### 3.12.3 [建议] 不要直接在 `case` 和 `default` 分句里声明变量，可以用大括号后声明变量
```js
// bad
switch (foo) {
  case 1:
    let x = 1;
    break;
  case 2:
    const y = 2;
    break;
  case 3:
    function f() {
      // ...
    }
    break;
  default:
    class C {}
}

// good
switch (foo) {
  case 1: {
    let x = 1;
    break;
  }
  case 2: {
    const y = 2;
    break;
  }
  case 3: {
    function f() {
      // ...
    }
    break;
  }
  case 4:
    bar();
    break;
  default: {
    class C {}
  }
}
```

#### 3.12.4 [强制] 三元表达式禁止嵌套
```js
// bad
const foo = maybe1 > maybe2
  ? "bar"
  : value1 > value2 ? "baz" : null;

// better
const maybeNull = value1 > value2 ? 'baz' : null;

const foo = maybe1 > maybe2
  ? 'bar'
  : maybeNull;

// best
const maybeNull = value1 > value2 ? 'baz' : null;

const foo = maybe1 > maybe2 ? 'bar' : maybeNull;
```

#### 3.12.5 [建议] 避免不必要的三元表达式
```js
// bad
const foo = a ? a : b;
const bar = c ? true : false;
const baz = c ? false : true;

// good
const foo = a || b;
const bar = !!c;
const baz = !c;
```

#### 3.12.6 [强制] 运算符很复杂的时候，用圆括号包起来
```js
// bad
const foo = a && b < 0 || c > 0 || d + 1 === 0;

// bad
const bar = a ** b - 5 % d;

// bad
// one may be confused into thinking (a || b) && c
if (a || b && c) {
  return d;
}

// good
const foo = (a && b < 0) || c > 0 || (d + 1 === 0);

// good
const bar = (a ** b) - (5 % d);

// good
if (a || (b && c)) {
  return d;
}

// good
const bar = a + b / c * d;
```

### 3.13 代码块

#### 3.13.1 [强制] 用大括号包裹多行代码块
```js
// bad
if (test)
  return false;

// good
if (test) return false;

// good
if (test) {
  return false;
}

// bad
function foo() { return false; }

// good
function bar() {
  return false;
}
```

#### 3.13.2 [强制] `if` 表达式的 `else` 和 `if` 的关闭大括号在一行
```js
// bad
if (test) {
  thing1();
  thing2();
}
else {
  thing3();
}

// good
if (test) {
  thing1();
  thing2();
} else {
  thing3();
}
```

#### 3.13.3 [建议] 如果 `if` 语句中总是需要用 `return` 返回， 那后续的 `else` 就不需要写了。 `if` 块中包含 `return`， 它后面的 `else if` 块中也包含了 `return`， 这个时候就可以把 `return` 分到多个 `if` 语句块中

```js
// bad
function foo() {
  if (x) {
    return x;
  } else {
    return y;
  }
}

// bad
function cats() {
  if (x) {
    return x;
  } else if (y) {
    return y;
  }
}

// bad
function dogs() {
  if (x) {
    return x;
  } else {
    if (y) {
      return y;
    }
  }
}

// good
function foo() {
  if (x) {
    return x;
  }

  return y;
}

// good
function cats() {
  if (x) {
    return x;
  }

  if (y) {
    return y;
  }
}

// good
function dogs(x) {
  if (x) {
    if (z) {
      return y;
    }
  } else {
    return z;
  }
}
```

### 3.14 控制语句

#### 3.14.1 [强制]  不要用选择操作符代替控制语句
```js
// bad
!isRunning && startRunning();

// good
if (!isRunning) {
  startRunning();
}
```

#### 3.14.2 [强制] 当你的控制语句(`if`, `while` 等)太长或者超过最大长度限制的时候，把每一个(组)判断条件放在单独一行里。 逻辑操作符放在行首
```js
// bad
if ((foo === 123 || bar === 'abc') && doesItLookGoodWhenItBecomesThatLong() && isThisReallyHappening()) {
  thing1();
}

// bad
if (foo === 123 &&
  bar === 'abc') {
  thing1();
}

// bad
if (foo === 123
  && bar === 'abc') {
  thing1();
}

// bad
if (
  foo === 123 &&
  bar === 'abc'
) {
  thing1();
}

// good
if (
  foo === 123
  && bar === 'abc'
) {
  thing1();
}

// good
if (
  (foo === 123 || bar === 'abc')
  && doesItLookGoodWhenItBecomesThatLong()
  && isThisReallyHappening()
) {
  thing1();
}

// good
if (foo === 123 && bar === 'abc') {
  thing1();
}
```

### 3.15 注释

#### 3.15.1 [强制] 多行注释用 `/** ... */`
```js
// bad
// make() returns a new element
// based on the passed in tag name
//
// @param {String} tag
// @return {Element} element
function make(tag) {

  // ...

  return element;
}

// good
/**
  * make() returns a new element
  * based on the passed-in tag name
  */
function make(tag) {

  // ...

  return element;
}
```

#### 3.15.2 [强制] 单行注释用 `//`，将单行注释放在被注释区域上面，禁止行末注释
```js
// bad
const active = true;  // is current tab

// good
// is current tab
const active = true;

// bad
function getType() {
  console.log('fetching type...');
  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}

// good
function getType() {
  console.log('fetching type...');

  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}

// also good
function getType() {
  // set the default type to 'no type'
  const type = this._type || 'no type';

  return type;
}
```

#### 3.15.3 [强制] 所有注释开头空一格，方便阅读
```js
// bad
//is current tab
const active = true;

// good
// is current tab
const active = true;

// bad
/**
  *make() returns a new element
  *based on the passed-in tag name
  */
function make(tag) {

  // ...

  return element;
}

// good
/**
  * make() returns a new element
  * based on the passed-in tag name
  */
function make(tag) {

  // ...

  return element;
}
```

#### 3.15.4 [强制] 用 `// FIXME: ` 给问题做注释 ，用 `// TODO: ` 去注释问题的解决方案
```js
class Calculator extends Abacus {
constructor() {
  super();

  // FIXME: shouldn't use a global here
  total = 0;
}
}
class Calculator extends Abacus {
  constructor() {
    super();

    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```

### 3.16 空格

#### 3.16.1 [强制] 使用 `2` 个空格作为一个缩进层级，不允许使用 `4` 个空格 或 `tab` 字符。

那是不是不能使用 tab 进行缩进了？大部分文本编辑器都有配置选项，也可以通过配置 .editorconfig ，将 tab 自动转换为空格。

```js
// bad
function foo() {
∙∙∙∙const name;
}

// bad
function bar() {
∙const name;
}

// good
function baz() {
∙∙const name;
}
```

#### 3.16.2 [强制] 在大括号前空一格
```js
// bad
function test(){
  console.log('test');
}

// good
function test() {
  console.log('test');
}

// bad
dog.set('attr',{
  age: '1 year',
  breed: 'Bernese Mountain Dog',
});

// good
dog.set('attr', {
  age: '1 year',
  breed: 'Bernese Mountain Dog',
});
```

#### 3.16.3 [强制] 在控制语句(`if`, `while` 等)的圆括号前空一格。在函数调用和定义时，参数列表和函数名之间不空格
```js
// bad
if(isJedi) {
  fight ();
}

// good
if (isJedi) {
  fight();
}

// bad
function fight () {
  console.log ('Swooosh!');
}

// good
function fight() {
  console.log('Swooosh!');
}
```

#### 3.16.4 [强制] 操作符两边各一个空格
```js
// bad
const x=y+5;

// good
const x = y + 5;
```

#### 3.16.5 [建议] 当出现长的方法链（>2个）时用缩进。用点开头强调该行是一个方法调用，而不是一个新的语句
```js
// bad
$('#items').find('.selected').highlight().end().find('.open').updateCount();

// bad
$('#items').
  find('.selected').
    highlight().
    end().
  find('.open').
    updateCount();

// good
$('#items')
  .find('.selected')
  .highlight()
  .end()
  .find('.open')
  .updateCount();

// bad
const leds = stage.selectAll('.led').data(data).enter().append('svg:svg').classed('led', true)
    .attr('width', (radius + margin) * 2).append('svg:g')
    .attr('transform', `translate(${radius + margin},${radius + margin})`)
    .call(tron.led);

// good
const leds = stage.selectAll('.led')
  .data(data)
  .enter().append('svg:svg')
  .classed('led', true)
  .attr('width', (radius + margin) * 2)
  .append('svg:g')
  .attr('transform', `translate(${radius + margin},${radius + margin})`)
  .call(tron.led);

// good
const leds = stage.selectAll('.led').data(data);
```

#### 3.16.6 [强制] 在一个代码块后下一条语句前空一行
```js
// bad
if (foo) {
  return bar;
}
return baz;

// good
if (foo) {
  return bar;
}

return baz;

// bad
const obj = {
  foo() {
  },
  bar() {
  },
};
return obj;

// good
const obj = {
  foo() {
  },

  bar() {
  },
};

return obj;

// bad
const arr = [
  function foo() {
  },
  function bar() {
  },
];
return arr;

// good
const arr = [
  function foo() {
  },

  function bar() {
  },
];

return arr;
```

#### 3.16.7 [强制] 不要用空白行填充代码块
```js
// bad
function bar() {

  console.log(foo);

}

// bad
if (baz) {

  console.log(qux);
} else {
  console.log(foo);

}

// bad
class Foo {

  constructor(bar) {
    this.bar = bar;
  }
}

// good
function bar() {
  console.log(foo);
}

// good
if (baz) {
  console.log(qux);
} else {
  console.log(foo);
}
```

#### 3.16.8 [强制] 圆括号里不要加空格
```js
// bad
function bar( foo ) {
  return foo;
}

// good
function bar(foo) {
  return foo;
}

// bad
if ( foo ) {
  console.log(foo);
}

// good
if (foo) {
  console.log(foo);
}
```

#### 3.16.9 [强制] 方括号里不要加空格
```js
// bad
const foo = [ 1, 2, 3 ];
console.log(foo[ 0 ]);

// good
const foo = [1, 2, 3];
console.log(foo[0]);
```

#### 3.16.10 [强制] 花括号里前后都要加空格
```js
// bad
const foo = {clark: 'kent'};

// good
const foo = { clark: 'kent' };

// bad
function foo() {return true;}
if (foo) { bar = 0;}

// good
function foo() { return true; }
if (foo) { bar = 0; }
```

#### 3.16.11 [强制]  `,` 前不要空格， `,` 后需要空格
```js
// bad
var foo = 1,bar = 2;
var arr = [1 , 2];

// good
var foo = 1, bar = 2;
var arr = [1, 2];
```

#### 3.16.12 计算属性遵循以上格式
```js
// bad
obj[foo ]
obj[ 'foo']
var x = {[ b ]: a}
obj[foo[ bar ]]

// good
obj[foo]
obj['foo']
var x = { [b]: a }
obj[foo[bar]]
```

#### 3.16.13 [强制] 调用函数时，函数名和小括号之间不要空格
```js
// bad
func ();

func
();

// good
func();
```

#### 3.16.14 [强制] 在对象的字面量属性中， `key` `value` 之间要有空格，`:` 号前面不要加空格
```js
// bad
var obj = { "foo" : 42 };
var obj2 = { "foo":42 };

// good
var obj = { "foo": 42 };
```

#### 3.16.15 [强制] 行末禁止空格

#### 3.16.16 [强制] 禁止出现多个空行。 在文件末尾只允许空一行。
```js
// bad
var x = 1;



var y = 2;

// good
var x = 1;

var y = 2;
```

#### 3.16.17 [强制] 禁止一行代码超过 `120` 个字符（包含空格）。

特殊情况可以例外, 比如长 URL。

``` js
// bad
const foo = jsonData && jsonData.foo && jsonData.foo.bar && jsonData.foo.bar.baz && jsonData.foo.bar.baz.quux && jsonData.foo.bar.baz.quux.xyzzy;

// bad
$.ajax({ method: 'POST', url: 'https://airbnb.com/', data: { name: 'John' } }).done(() => console.log('Congratulations!')).fail(() => console.log('You have failed this city.'));

// good
const foo = jsonData
  && jsonData.foo
  && jsonData.foo.bar
  && jsonData.foo.bar.baz
  && jsonData.foo.bar.baz.quux
  && jsonData.foo.bar.baz.quux.xyzzy;

// good
$.ajax({
  method: 'POST',
  url: 'https://airbnb.com/',
  data: { name: 'John' },
})
  .done(() => console.log('Congratulations!'))
  .fail(() => console.log('You have failed this city.'));
```

### 3.17 逗号

#### 3.17.1 [强制] 不要前置逗号
```js
// bad
const story = [
    once
  , upon
  , aTime
];

// good
const story = [
  once,
  upon,
  aTime,
];

// bad
const hero = {
    firstName: 'Ada'
  , lastName: 'Lovelace'
  , birthYear: 1815
  , superPower: 'computers'
};

// good
const hero = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  birthYear: 1815,
  superPower: 'computers',
};
```

#### 3.17.2 [强制] 额外结尾逗号
```js
// bad
const hero = {
  firstName: 'Dana',
  lastName: 'Scully'
};

const heroes = [
  'Batman',
  'Superman'
];

// good
const hero = {
  firstName: 'Dana',
  lastName: 'Scully',
};

const heroes = [
  'Batman',
  'Superman',
];

// bad
function createHero(
  firstName,
  lastName,
  inventorOf
) {
  // does nothing
}

// good
function createHero(
  firstName,
  lastName,
  inventorOf,
) {
  // does nothing
}

// good (note that a comma must not appear after a "rest" element)
function createHero(
  firstName,
  lastName,
  inventorOf,
  ...heroArgs
) {
  // does nothing
}

// bad
createHero(
  firstName,
  lastName,
  inventorOf
);

// good
createHero(
  firstName,
  lastName,
  inventorOf,
);

// good (note that a comma must not appear after a "rest" element)
createHero(
  firstName,
  lastName,
  inventorOf,
  ...heroArgs
);
```

### 3.18 分号

#### 3.18.1 [强制] 显示结束语句后加分号

本质上加与不加都没问题，但是为了统一，还是加。

```js
// bad - raises exception
const luke = {}
const leia = {}
[luke, leia].forEach(jedi => jedi.father = 'vader')

// bad - raises exception
const reaction = "No! That’s impossible!"
(async function meanwhileOnTheFalcon() {
  // handle `leia`, `lando`, `chewie`, `r2`, `c3p0`
  // ...
}())

// bad - returns `undefined` instead of the value on the next line - always happens when `return` is on a line by itself because of ASI!
function foo() {
  return
    'search your feelings, you know it to be foo'
}

// good
const luke = {};
const leia = {};
[luke, leia].forEach((jedi) => {
  jedi.father = 'vader';
});

// good
const reaction = "No! That’s impossible!";
(async function meanwhileOnTheFalcon() {
  // handle `leia`, `lando`, `chewie`, `r2`, `c3p0`
  // ...
}());

// good
function foo() {
  return 'search your feelings, you know it to be foo';
}
```

### 3.19 类型转换

#### 3.19.1 [强制] 使用 `String` 函数转换成字符串
```js
// => this.reviewScore = 9;

// bad
const totalScore = new String(this.reviewScore); // typeof totalScore is "object" not "string"

// bad
const totalScore = this.reviewScore + ''; // invokes this.reviewScore.valueOf()

// bad
const totalScore = this.reviewScore.toString(); // isn’t guaranteed to return a string

// good
const totalScore = String(this.reviewScore);
```

#### 3.19.2 [强制] 使用 `Number` 函数转换成数字，使用 `parseInt` 函数时候始终指定基数
```js
const inputValue = '4';

// bad
const val = new Number(inputValue);

// bad
const val = +inputValue;

// bad
const val = inputValue >> 0;

// bad
const val = parseInt(inputValue);

// good
const val = Number(inputValue);

// good
const val = parseInt(inputValue, 10);
```

#### 3.19.3 [强制] 使用 Boolean 函数或者 !! 转换成布尔值
```js
const age = 0;

// bad
const hasAge = new Boolean(age);

// good
const hasAge = Boolean(age);

// best
const hasAge = !!age;
```

### 3.20 命名规范

#### 3.20.1 [建议] 避免用一个字母命名，让你的命名具有自描述性
```js
// bad
function q() {
  // ...
}

// good
function query() {
  // ...
}
```

#### 3.20.2 [强制] 用小驼峰式 `camelCase` 命名你的对象、函数、实例
```js
// bad
const OBJEcttsssss = {};
const this_is_my_object = {};
function c() {}

// good
const thisIsMyObject = {};
function thisIsMyFunction() {}
```

#### 3.20.3 [强制] 用大驼峰 `PascalCase` 式命名类
```js
// bad
function user(options) {
  this.name = options.name;
}

const bad = new user({
  name: 'nope',
});

// good
class User {
  constructor(options) {
    this.name = options.name;
  }
}

const good = new User({
  name: 'yup',
});
```

#### 3.20.4 [建议] 不要用前置或后置下划线
```js
// bad
this.__firstName__ = 'Panda';
this.firstName_ = 'Panda';
this._firstName = 'Panda';

// good
this.firstName = 'Panda';

// good, in environments where WeakMaps are available
// see https://kangax.github.io/compat-table/es6/#test-WeakMap
const firstNames = new WeakMap();
firstNames.set(this, 'Panda');
```

#### 3.20.5 [强制] 不要保存引用 `this`， 用箭头函数或 `Function#bind`
```js
// bad
function foo() {
  const self = this;
  return function () {
    console.log(self);
  };
}

// bad
function foo() {
  const that = this;
  return function () {
    console.log(that);
  };
}

// good
function foo() {
  return () => {
    console.log(this);
  };
}
```

#### 3.20.6 [建议] `export default` 导出模块 `A`，则这个文件名也叫 `A.*`， `import` 时候的参数也叫 `A`。 大小写完全一致。
```js
// file 1 contents
class CheckBox {
  // ...
}
export default CheckBox;

// file 2 contents
export default function fortyTwo() { return 42; }

// file 3 contents
export default function insideDirectory() {}

// in some other file
// bad
import CheckBox from './checkBox'; // PascalCase import/export, camelCase filename
import FortyTwo from './FortyTwo'; // PascalCase import/filename, camelCase export
import InsideDirectory from './InsideDirectory'; // PascalCase import/filename, camelCase export

// bad
import CheckBox from './check_box'; // PascalCase import/export, snake_case filename
import forty_two from './forty_two'; // snake_case import/filename, camelCase export
import inside_directory from './inside_directory'; // snake_case import, camelCase export
import index from './inside_directory/index'; // requiring the index file explicitly
import insideDirectory from './insideDirectory/index'; // requiring the index file explicitly

// good
import CheckBox from './CheckBox'; // PascalCase export/import/filename
import fortyTwo from './fortyTwo'; // camelCase export/import/filename
import insideDirectory from './insideDirectory'; // camelCase export/import/directory name/implicit "index"
// supports both insideDirectory.js and insideDirectory/index.js
```

#### 3.20.7 [建议] 当你 `export default` 一个函数时，函数名用小驼峰 `camelCase`，文件名需要和函数名一致
```js
function makeStyleGuide() {
  // ...
}

export default makeStyleGuide;
```

#### 3.20.8 [建议] 当你 `export` 一个结构体/类/单例/函数库/对象时用大驼峰 `PascalCase`

```js
const AirbnbStyleGuide = {
  es6: {
  }
};

export default AirbnbStyleGuide;
```

#### 3.20.9 [强制] 简称和缩写应该全部大写或全部小写
```js
// bad
import SmsContainer from './containers/SmsContainer';

// bad
const HttpRequests = [
  // ...
];

// good
import SMSContainer from './containers/SMSContainer';

// good
const HTTPRequests = [
  // ...
];

// also good
const httpRequests = [
  // ...
];

// best
import TextMessageContainer from './containers/TextMessageContainer';

// best
const requests = [
  // ...
];
```

#### 3.20.10 [强制] 你可以用全大写字母设置常量，他需要满足三个条件

1. 被导出的
2. 是 const 定义的，保证不能被改变
3. 这个变量是可信的，他的子属性都是不能被改变的

```js
// bad
const PRIVATE_VARIABLE = 'should not be unnecessarily uppercased within a file';

// bad
export const THING_TO_BE_CHANGED = 'should obviously not be uppercased';

// bad
export let REASSIGNABLE_VARIABLE = 'do not use let with uppercase variables';

// ---

// allowed but does not supply semantic value
export const apiKey = 'SOMEKEY';

// better in most cases
export const API_KEY = 'SOMEKEY';

// ---

// bad - unnecessarily uppercases key while adding no semantic value
export const MAPPING = {
  KEY: 'value'
};

// good
export const MAPPING = {
  key: 'value'
};
```

### 3.21 访问器

#### 3.21.1 [建议] 不要使用 JavaScript 的 `getters/setters`

可能会产生副作用，难以理解。

```js
// bad
class Dragon {
  get age() {
    // ...
  }

  set age(value) {
    // ...
  }
}

// good
class Dragon {
  getAge() {
    // ...
  }

  setAge(value) {
    // ...
  }
}
```

#### 3.21.2 [建议] 如果属性/方法是 `boolean`， 用 `isVal()` 或 `hasVal()`
```js
// bad
if (!dragon.age()) {
  return false;
}

// good
if (!dragon.hasAge()) {
  return false;
}
```

#### 3.21.3 [建议] 用 `get()` 和 `set()` 函数是可以的，但是要一起用
```js
class Jedi {
  constructor(options = {}) {
    const lightsaber = options.lightsaber || 'blue';
    this.set('lightsaber', lightsaber);
  }

  set(key, val) {
    this[key] = val;
  }

  get(key) {
    return this[key];
  }
}
```

### 3.22 事件

#### 3.22.1 [建议] 当需要对事件传入数据时，传入对象而不是单一的数据
``` js
// bad
$(this).trigger('listingUpdated', listing.id);

// ...

$(this).on('listingUpdated', (e, listingID) => {
  // do something with listingID
});

// prefer:

// good
$(this).trigger('listingUpdated', { listingID: listing.id });

// ...

$(this).on('listingUpdated', (e, data) => {
  // do something with data.listingID
});
```

### 3.23 jQuery

#### 3.23.1 [强制] jQuery 对象使用 `$` 前缀
``` js
// bad
const sidebar = $('.sidebar');

// good
const $sidebar = $('.sidebar');

// good
const $sidebarBtn = $('.sidebar-btn');
```

#### 3.23.2 [强制] 缓存 jQuery 查询
``` js
// bad
function setSidebar() {
  $('.sidebar').hide();

  // ...

  $('.sidebar').css({
    'background-color': 'pink',
  });
}

// good
function setSidebar() {
  const $sidebar = $('.sidebar');
  $sidebar.hide();

  // ...

  $sidebar.css({
    'background-color': 'pink',
  });
}
```

#### 3.23.3 [强制] 对于 jQuery 对象作用域内的查询使用 `find`
``` js
// bad
$('ul', '.sidebar').hide();

// bad
$('.sidebar').find('ul').hide();

// good
$('.sidebar ul').hide();

// good
$('.sidebar > ul').hide();

// good
$sidebar.find('ul').hide();
```

### 3.24 标准库

#### 3.24.1 [强制] 使用 `Number.isNaN` 替代全局 `isNaN`
``` js
// bad
isNaN('1.2'); // false
isNaN('1.2.3'); // true

// good
Number.isNaN('1.2.3'); // false
Number.isNaN(Number('1.2.3')); // true
```

#### 3.24.2 [强制] 使用 `Number.isFinite` 替代全局 `isFinite`
``` js
// bad
isFinite('2e3'); // true

// good
Number.isFinite('2e3'); // false
Number.isFinite(parseInt('2e3', 10)); // true
```

## 4 JSX / React
见 [JSX / React](./react.md)

## 5 TypeScript
见 [TypeScript](./typescript.md)

## 6 代码格式检查和自动格式化
#### 6.1 [强制] 使用 ESlint
#### 6.2 [建议] 使用 Prettier

## 7 参考

- [Airbnb 代码规范](https://github.com/airbnb/javascript)
- [Google 代码规范](https://google.github.io/styleguide/jsguide.html)
- [百度 EFE 代码规范](https://github.com/ecomfe/spec)
- [京东 Aotu 代码规范](https://guide.aotu.io/docs/js/language.html)
