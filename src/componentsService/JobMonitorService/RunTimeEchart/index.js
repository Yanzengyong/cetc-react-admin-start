import React from 'react'
import ReactEcharts from 'echarts-for-react'

export default class RunTimeEchart extends React.Component {
	state = {
		option: {},
	}

	componentDidMount () {
		this.setState({
			option: this.getOption(),
		})
	}

	getOption = () => {
		return {
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			},
			yAxis: {
				type: 'value',
			},
			series: [
				{
					data: [820, 932, 901, 934, 1290, 1330, 1320],
					type: 'line',
					areaStyle: {},
				},
			],
		}
	}

	render () {
		return (
			<ReactEcharts
				option={this.state.option}
				style={{ width: '100%', height: '100%' }}
			/>
		)
	}
}
