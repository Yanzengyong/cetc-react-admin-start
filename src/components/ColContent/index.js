/**
 * 多行文字显示组件，使用方法如下：一定要加一个盒子ellipsisbox哦，不然位置会不对
 * eg:
 * // 渲染table的行逻辑
 * renderTableCol = (dataIndex, record) => {
 * 	if (dataIndex === 'runState') {
 * 		switch (record[dataIndex]) {
 * 		case 0: return <ColContent content={
 * 			<Tag
 * 				color='#20afe6'
 * 				type="primary"
 * 				size="small">待启动</Tag>
 * 		} />
 * 		case 1: return <ColContent content={
 * 			<Tag
 * 				color='#20e6af'
 * 				type="primary"
 * 				size="small">运行中</Tag>
 * 		} />
 * 		case 2: return <ColContent content={
 * 			<Tag
 * 				color='#c1cc1e'
 * 				type="primary"
 * 				size="small">运行失败</Tag>
 * 		} />
 * 		case 3: return <ColContent content={
 * 			<Tag
 * 				color='#7ee620'
 * 				type="primary"
 * 				size="small">已停止</Tag>
 * 		} />
 * 		default: return <ColContent content={
 * 			<Tag
 * 				color='#c1c3de'
 * 				type="primary"
 * 				size="small">未知类型</Tag>
 * 		} />
 * 		}
 * 	} else {
 * 		return <ColContent content={record[dataIndex]} />
 * 	}
 * }
 * const clos = [
 * 		{
 * 			title: '任务名称',
 * 			dataIndex: 'taskName'
 * 		},
 * 		{
 * 			title: '任务描述',
 * 			dataIndex: 'taskDesc'
 * 		},
 * 		{
 * 			title: '采集类型',
 * 			dataIndex: 'taskType'
 * 		},
 * 		{
 * 			title: '运行状况',
 * 			dataIndex: 'runState'
 * 		}
 * 	]
 * 	const data = [
 * 		{ taskName: 'mengduo', taskDesc: '哈哈哈啊哈哈', taskType: 2, runState: 0 },
 * 		{ taskName: 'yzytask', taskDesc: '', taskType: '哈哈类型', runState: 3 },
 * 	]
 *   <Table
 *     dataSource={data}
 *   >
 *     {clos.map((item) => (
 *       <Table.Column key={item.taskname} title={item.title} cell={(value, index, record) => *   this.renderTableCol(item.dataIndex, record)}/>
 *     ))}
 *   </Table>
 *
 * 说明：
 * content  内容  node/string
 * postion  内容的位置 string
 */
import React from 'react'
import Ellipsis from '@/components/Ellipsis'
import PropTypes from 'prop-types'
import './index.scss'

class ColContent extends React.Component {
  static propTypes = {
  	content: PropTypes.oneOfType([
  		PropTypes.string,
  		PropTypes.node
  	]), // 传入的内容
  	position: PropTypes.string // 位置
  }
  static defaultProps = {
  	content: '暂无',
  	position: 'center'
  }
  render () {
  	let className = ''
  	const { content, position } = this.props
  	switch (position) {
  	case 'left': className = 'cloContent_box_left'
  		break
  	case 'center': className = 'cloContent_box_center'
  		break
  	case 'right': className = 'cloContent_box_right'
  		break
  	default: className = 'cloContent_box_center'
  	}
  	return (
  		<div className={className}>
  			{
  				typeof content === 'string' || typeof content === 'number' ?
  				content === 0 || content ? <Ellipsis text={content} /> : '暂无' : content
  			}
  		</div>
  	)
  }
}

export default ColContent
