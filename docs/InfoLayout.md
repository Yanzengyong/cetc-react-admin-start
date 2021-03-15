# 详情组件

- @Author: SHENLing
- @Date: 2020-08-09
- @Last Modified by: SHENLing
- @Last Modified time: 2020-08-09

### 常见用法 - 导航栏索引

```js
import InfoLayout from "@/components/InfoLayout";

class Demo extends React.Component {
  state = {
    displayAdvance: false,
  };

  // 点击高级按钮，高级部分切换隐藏/显示模式
  showAdvance = () => {
    this.setState({
      displayAdvance: !this.state.displayAdvance,
    });
  };

  render() {
    // 导航栏 - 标题+锚点id
    const navInfo = [
      { label: "A部分", value: "a" },
      { label: "高级", value: "advanceBtn" },
      { label: "B部分", value: "b" },
      { label: "C部分", value: "c" },
      { label: "D部分", value: "d" },
      { label: "操作", value: "operationBtns" },
    ];

    // 导航栏 - 高级按钮需用于隐藏的部分的id集合
    const advanceAffectIds = ["b", "c", "d"];

    // 导航栏 - 高级按钮的锚点id（需与navInfo)部分value相同，否则无效果
    const advanceBtnId = "advanceBtn";

    // 导航栏 - 操作按钮的锚点id（需与navInfo）部分value相同，用于在“查看”页面中隐藏导航栏
    const operationBtnId = "operationBtns";

    return (
      <InfoLayout
        hasNavBar
        navInfo={navInfo}
        displayAdvance={this.state.displayAdvance}
        advanceBtnId={advanceBtnId}
        showAdvance={this.showAdvance}
        advanceAffectIds={advanceAffectIds}
        operationBtnId={operationBtnId}
        pageType={this.state.pageType}
      >
        {/*该详情内容部分可自定义，但需将id与导航栏navInfo的value对应后,才可与侧边栏有交互效果  */}
        <div className="business_createAndEdit_content">
          <div id="a" className="test_info_section">
            A部分
          </div>

          <Button
            text
            type="primary"
            id="advanceBtn"
            onClick={this.showAdvance}
          >
            <span style={{ marginRight: 5 }}>
              {this.state.displayAdvance ? "-" : "+"}
            </span>
            <span>高级</span>
          </Button>

          <div
            id="b"
            className="test_info_section"
            style={{ display: !this.state.displayAdvance ? "none" : "" }}
          >
            B部分
          </div>
        </div>
      </InfoLayout>
    );
  }
}
```

### 其他用法 - 无导航栏

```js
import InfoLayout from "@/components/InfoLayout";
class Demo2 extends React.Component {
  render() {
    return (
      <InfoLayout>
        {/*该详情内容部分可自定义，但需将id与导航栏navInfo的value对应后,才可与侧边栏有交互效果  */}
        <div className="business_createAndEdit_content">
          <div className="test_info_section">test info</div>
        </div>
      </InfoLayout>
    );
  }
}
```

#### 参数说明

| 参数名称         | 参数描述                                                                                   | 参数类型 | 默认值                           |
| ---------------- | ------------------------------------------------------------------------------------------ | -------- | -------------------------------- |
| hasNavBar        | 需显示侧边导航栏，若不为 true，则下面所有参数无效                                          | Boolean  | false                            |
| navInfo          | 导航栏锚点信息，包含锚点 label 和 id                                                       | Array    | []                               |
| displayAdvance   | 高级显示部分，切换隐藏/显示模式                                                            | Boolean  | false                            |
| advanceBtnId     | 高级按钮的锚点 id，需同 navInfo 部分高级按钮的 id 一致                                     | string   | "advanceBtn"                     |
| showAdvance      | 切换高级部分显示/隐藏模式的方法                                                            | function | func.noop                        |
| advanceAffectIds | 高级模式需隐藏/显示部分的锚点 id 的集合                                                    | Array    | []                               |
| operationBtnId   | 操作按钮的锚点 id（需与 navInfo）部分 value 相同，用于在“查看”页面中导航栏处隐藏操作部分   | string   | 'operationBtns'                  |
| pageType         | 用于配合 operationBtnId 使用，当页面为查看“pageType === check”页面时，导航栏中隐藏操作部分 | string   | 默认值： 'check'，代表“查看”页面 |

### 备注：

- 若想使详情内容使用标题+边框模式，FORM 表单内容置于边框中，请使用 `InfoContainer` 组件,具体参数详情请参考[InfoContainer.md](./InfoContainer.md) 文档
- 高级按钮可使用`AdvanceBtn`组件，可参考 [AdvanceBtn.md](./AdvanceBtn.md) 文档

```js
import InfoLayout from "@/components/InfoLayout";
import InfoContainer from "@/components/InfoContainer"; // 标题 + 线框样式组件
import AdvanceBtn from "@/components/AdvanceBtn"; // 高级按钮样式组件

class Demo2 extends React.Component {
  render() {
    // 导航栏 - 标题+锚点id
    const navInfo = [
      { label: "A部分", value: "a" },
      { label: "高级", value: "advanceBtn" },
      { label: "B部分", value: "b" },
      { label: "C部分", value: "c" },
      { label: "D部分", value: "d" },
      { label: "操作", value: "operationBtns" },
    ];

    // 导航栏 - 高级按钮需用于隐藏的部分的id集合
    const advanceAffectIds = ["b", "c", "d"];

    // 导航栏 - 高级按钮的锚点id（需与navInfo)部分value相同，否则无效果
    const advanceBtnId = "advanceBtn";

    // 导航栏 - 操作按钮的锚点id（需与navInfo）部分value相同，用于在“查看”页面中隐藏导航栏
    const operationBtnId = "operationBtns";

    return (
      <InfoLayout
        hasNavBar
        navInfo={navInfo}
        displayAdvance={this.state.displayAdvance}
        advanceBtnId={advanceBtnId}
        showAdvance={this.showAdvance}
        advanceAffectIds={advanceAffectIds}
        operationBtnId={operationBtnId}
        pageType={this.state.pageType}
      >
        {/* 该详情表单内容部分可自定义，但需将每个区块的id与导航栏navInfo的value对应后,才可与侧边栏有交互效果  */}
        <Form labelAlign="top" field={this.field} style={{ width: "100%" }}>
          <InfoContainer title="基本信息" id="basicInfo">
            <FormItem label="业务名称：" required>
              <Input
                maxLength={50}
                hasLimitHint
                placeholder="请输入业务名称"
                {...init("name", {
                  rules: [
                    {
                      required: true,
                      message: "业务名称不能为空",
                    },
                  ],
                })}
              />
            </FormItem>
          </InfoContainer>

          {/* 高级按钮 */}
          <AdvanceBtn
            displayAdvance={this.state.displayAdvance}
            showAdvance={this.showAdvance}
            id="advanceBtn"
          ></AdvanceBtn>

          <InfoContainer title="B部分" id="b"></InfoContainer>
        </Form>
      </InfoLayout>
    );
  }
}
```
