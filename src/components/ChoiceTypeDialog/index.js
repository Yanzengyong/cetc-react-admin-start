// 选择弹框，例：算法中台-建模中心-新建模型
// title：弹框标题，visible：是否显示，selectTypeHandle选中的类型，根据类型名决定下一步走向，ChoiceDialogCloseHandle，关闭弹框
// typeList：可选择的类型列表，title标题，desc描述，disable是否可选（false可选，true可选）
// 例：	const typeList = [
//   		{
//   			title: '业务模型部署',
//   			desc: '针对业务数据所构建的模型工程，需要定期执行去更新结果。支持拖拽式建模和NoteBook建模两种模型工程。',
//   			disable: false
//   		}, {
//   			title: '模型服务部署',
//   			desc: '针对算法模型所开发的服务接口，对外提供模型服务。支持机器学习和深度学习两种模型应用。',
//   			disable: false
//   		}
//   	];

import React, { Component } from 'react'
import { Dialog } from '@alifd/next'
import './index.scss'

class ChoiceTypeDialog extends Component {
	render () {
  	const { title, typeList, visible } = this.props
  	// const addModelWays = [
  	// 	{
  	// 		title: '可视化拖拽建模',
  	// 		desc: '内置了很多组件化算法供选择，在模型训练时，支持自动调参选择模型。',
  	// 		disable: false
  	// 	}, {
  	// 		title: 'notebook建模',
  	// 		desc: '专门为算法人员准备的开发环境，用户可以像使用Python一样构建模型。',
  	// 		disable: false
  	// 	}, {
  	// 		title: '本地模型上传',
  	// 		desc: '用户可上传本地已开发好的算法模型，配置线上数据源进行模型训练。',
  	// 		disable: true
  	// 	}
  	// ];
  	return (
  		<Dialog
  			title={title}
  			visible={visible}
  			footer={[]}
  			onClose={() => {
  				this.props.ChoiceDialogCloseHandle()
  			}}
  			style={{ width: 460 }}
  		>
  			{typeList.map((item, index) => (
  				<div
  					onClick={() => {
  						this.props.selectTypeHandle(item.title)
  					}}
  					key={index}
  					className={item.disable ? 'disable_Choice_Item_box Choice_Item_box' : 'Choice_Item_box'}
  				>
  					<h3>{item.title}</h3>
  					<p>{item.desc}</p>
  				</div>
  			))}
  		</Dialog>
  	)
	}
}

export default ChoiceTypeDialog
