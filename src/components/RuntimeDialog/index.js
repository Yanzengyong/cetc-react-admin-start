//数据共享-我的收藏
//样式文件写在scss的index中
import React from 'react'
import { Form, Dialog, DatePicker, Grid } from '@alifd/next'
import ReactEcharts from 'echarts-for-react'
const { Row } = Grid
const { RangePicker } = DatePicker
const FormItem = Form.Item
const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 16
	},
	labelTextAlign: 'right'
}
export default class Runtime extends React.Component {
  echartsReact = React.createRef();
  state = {
  	visible: false,
  	dataSource: []
  }
  // 当外部触发新的传入后进行重新渲染
  componentDidUpdate (prevProps, prevState) {
  	if (prevState.dataSource !== this.state.dataSource && this.state.dataSource.length > 0) {
  		this.echartsReact.getEchartsInstance().setOption({
  			// 所有配置项
  			xAxis: {
  				type: 'category',
  				data: this.state.dataSource.map((item) => item.execTime)
  			},
  			yAxis: {
  				type: 'value'
  			},
  			series: [{
  				data: this.state.dataSource.map((item) => Number(item.value)),
  				type: 'line'
  			}]
  		})
  	}
  }
  static defaultProps = {
  	title: ''
  }
  static getDerivedStateFromProps (nextProps, prevState) {
  	if (nextProps.visible !== prevState.visible ||
      nextProps.dataSource !== prevState.dataSource) {
  		return {
  			visible: nextProps.visible,
  			dataSource: nextProps.dataSource
  		}
  	}
  	return null
  }
  dateRangeHandle = (val) => {
  	this.props.dateRangeHandle(val)
  }
  getOption = () => {
  	return {
  		// 所有配置项
  		xAxis: {
  			type: 'category',
  			data: []
  		},
  		yAxis: {
  			type: 'value'
  		},
  		series: [{
  			data: [],
  			type: 'line'
  		}]
  	}
  }
  render () {
  	const {
  		title,
  		visible,
  		onClose,
  		placeholder
  	} = this.props
  	return(
  		<Dialog
  			style={{ width: 600 }}
  			title={title}
  			visible={visible}
  			footer={false}
  			onClose={onClose}>
  			<Form {...formItemLayout}>
  				<FormItem
  					label="选择时间范围："
  				>
  					<RangePicker
  						format='YYYY-MM-DD'
  						onOk={this.dateRangeHandle} />
  				</FormItem>
  			</Form>
  			<Row justify='center' style={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  				{
  					placeholder === '' ? <ReactEcharts
  					style={{
  						width: '100%',
  						height: '100%'
  						}}
  					ref={(e) => { this.echartsReact = e }}
  					option={this.getOption()} /> : <h3>{placeholder}</h3>
  				}
  			</Row>
  		</Dialog>
  	)
  }
}
