# 详情 - 标题+边框+表单内容 组件

- @Author: SHENLing
- @Date: 2020-08-10
- @Last Modified by: SHENLing
- @Last Modified time: 2020-08-10

```js
import InfoContainer from "@/components/InfoContainer";
class Demo2 extends React.Component {
  render() {
    return (
      <Form labelAlign="top" field={this.field} style={{ width: "100%" }}>
        <InfoContainer
          title="基本信息"
          id="basicInfo"
          style={{ display: !this.props.displayAdvance ? "none" : "" }}
        >
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

        <FormItem>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={this.onSubmit}
          >
            确认
          </Button>
          <Button type="secondary" onClick={this.props.onCancel}>
            取消
          </Button>
        </FormItem>
      </Form>
    );
  }
}
```

### 参数说明

| 参数名称 | 参数描述              | 参数类型 | 默认值 |
| -------- | --------------------- | -------- | ------ |
| title    | 表单标题内容          | string   | ''     |
| id       | 表单锚点 id，用于定位 | string   | ''     |
| style    | 该区块自定义样式      | Object   | {}     |

- 备注：style 控制根据高级按钮显示样式方法：

```js
style={{ display: !this.props.displayAdvance ? 'none': '' }}
```
