# FORM 中上传文件组件

 * @Author: SHENLing
 * @Date: 2020-08-11
 * @Last Modified by: SHENLing
 * @Last Modified time: 2020-08-17


```js
import UploadFormItem from '@/components/UploadFormItem'

class Demo extends React.Componet {
  state = {
    pageType: 'create',
    fileList: [],
  }

  // 初始化赋值fileList
  componentDidMount() {
    this.setFileListInitData()
  }

  // 设置fileList的初始值
  setFileListInitData = () => {
    this.setState({
      fileList: [{ fileName: '文件1' }, { fileName: '文件2' }],
    })
  }

  // 获取待上传新文件列表
  onGetNewFileList = (fileList) => {
    this.setState({ newFileList: fileList })
  }

  // 获取已上传文件调整后的列表
  onGetOldFileList = (fileList) => {
    console.log(fileList)
    this.setState({ fileList: fileList })
  }

  render() {
    return (
      <UploadFormItem
        pageType={pageType}
        currentFileList={this.state.fileList}
        newFileList={this.state.newFileList}
        uploadLimit={10}
        onResetList={this.setFileListInitData}
        onGetNewFileList={this.onGetNewFileList}
        onGetOldFileList={this.onGetOldFileList}
      />
    )
  }
}
```

#### 参数说明

| 参数名称         | 参数描述                   | 参数类型 | 默认值                                             |
| ---------------- | -------------------------- | -------- | -------------------------------------------------- |
| pageType         | 页面类型（新建/编辑/查看） | String   | 可选值：create, edit, check；默认值：create        |
| currentFileList  | 当前已上传文件列表         | Array    | []，数组内部对象格式须符合：{ fileName: '文件 1' } |
| newFileList      | 待上传文件列表             | Array    | []                                                 |
| uploadLimit      | 上传文件限制               | Number   | 10                                                 |
| onResetList      | 重置已上传文件列表方法     | Function |                                                    |
| onGetNewFileList | 获取待上传新文件列表       | Function |                                                    |
| onGetOldFileList | 获取已上传文件调整后的列表 | Function |                                                    |
