/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-12-28 14:02:37
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-07 14:17:19
 */
import React from 'react'
import ReactEcharts from 'echarts-for-react'
import * as echarts from 'echarts' //渐变色
import IconFont from '@/components/IconFont'

const getColor = (index) => {
	switch (index) {
	case 1 : return '#2FC25B'
	case 2 : return '#4679FF'
	default: return '#2FC25B'
	}
}
export default class DashboardChart extends React.Component {
	state = {
		xData: [],
		title: '',
		legendData: [],
		legendDataOtherYaxis: [],
		option: {}
	}

	static getDerivedStateFromProps (props, state) {
		if (JSON.stringify(props.legendData) !== JSON.stringify(state.legendData) ||
		JSON.stringify(props.legendDataOtherYaxis) !== JSON.stringify(state.legendDataOtherYaxis)) {
			return {
				legendData: props.legendData,
				legendDataOtherYaxis: props.legendDataOtherYaxis,
			}
		}
		return null
	}

	componentDidUpdate (prevProps, prevState) {
		const {
			xData,
			legendData,
			legendDataOtherYaxis
		} = this.state
		if (JSON.stringify(xData) !== JSON.stringify(prevState.xData) ||
			JSON.stringify(legendData) !== JSON.stringify(prevState.legendData) ||
			JSON.stringify(legendDataOtherYaxis) !== JSON.stringify(prevState.legendDataOtherYaxis)) {
				this.setState({
					option: this.getOption()
				})
		}
	}

	getMinMax = (values, type) => {
		return type === 'max' ? Math.max(...values) : Math.min(...values)
	}

	getOption = () => {
		const {
			xData,
			title,
			legendData,
			legendDataOtherYaxis
		} = this.props

		// const maxValue = this.getMinMax(legendData[0].value, 'max')
		// const splitNumber = 5

		// console.log(maxValue)

		return {
			title: {
				text: title,
				textStyle: {
					color: '#262626',
					fontSize: 14,
					fontFamily: 'PingFang SC',
					lineHeight: 24,
					fontWeight: 500
				},
				left: 'center',
				bottom: 0
			},
			legend: {
				data: [legendData[0].title, legendDataOtherYaxis[0].title],
				textStyle: {
					color: '#8C8C8C'
				},
				icon: 'circle',
				itemGap: 24,
				bottom: 32
			},
			tooltip: {
        trigger: 'axis',
				formatter: function (params) {
					let monthStr = params[0].name + '：' + '<br>'

					let data1Str = params[0].marker + params[0].seriesName.split('近一年').join('') + '：' + params[0].data + '人' + '<br>'
					let data2Str = params[1].marker + params[1].seriesName.split('近一年').join('') + '：' + params[1].data + '次'

					let displayStr = monthStr + data1Str + data2Str
					return displayStr
				}
    },
			grid: {
				top: '32',
        left: 'center',
				bottom: '0',
				width: '80%',
				height: 136
			},
			xAxis: {
				type: 'category',
				axisLine: {
					show: true,
					lineStyle: {
						color: 'rgba(0, 0, 0, 0.25)'
					}
				},
				boundaryGap: false,
				axisTick: {
					length: 5,
					lineStyle: {
						color: 'rgba(0, 0, 0, 0.25)'
					}
				},
				axisLabel: {
					color: '#595959',
					align: 'center',
					padding: [10, 0, 0, 30],
					rotate: -45,
					margin: 10
				},
				data: xData
			},
			yAxis: [
				{
					type: 'value',
					name: '（人数）',
					minInterval: 1,
					nameGap: 19,
					nameTextStyle: {
						color: '#595959',
						fontSize: 12,
						fontWeight: 400,
						fontFamily: 'PingFang SC',
						align: 'center',
						padding: [0, 19, 0, 0]
					},
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#595959',
						align: 'center',
						padding: [0, 19, 0, 0],
					},
					splitNumber: 3,
					splitLine: {
						lineStyle: {
							color: '#E6E6E6',
							type: 'dotted'
						}
					}
				},
				{
					type: 'value',
					name: '（次数）',
					minInterval: 1,
					nameGap: 19,
					nameTextStyle: {
						color: '#595959',
						fontSize: 12,
						fontWeight: 400,
						fontFamily: 'PingFang SC',
						align: 'center',
						padding: [0, 0, 0, 19]
					},
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#595959',
						align: 'center',
						padding: [0, 0, 0, 19],
					},
					splitNumber: 3,
					splitLine: {
						lineStyle: {
							color: '#E6E6E6',
							type: 'dotted'
						}
					},
				}
			],
			series: [
				...legendData.map((item, index) => {
					return {
						name: item.title,
						yAxisIndex: item.yIndex ?? 0,
						type: 'line',
						lineStyle: {
							color: '#2FC25B'
						},
						symbol: 'circle',
						itemStyle: {
							color: '#2FC25B'
						},
						data: item.value
					}
				}),
				...legendDataOtherYaxis.map((item, index) => {
					return {
						name: item.title,
						yAxisIndex: item.yIndex ?? 1,
						type: 'line',
						lineStyle: {
							color: '#4679FF'
						},
						symbol: 'circle',
						itemStyle: {
							color: '#4679FF'
						},
						data: item.value
					}
				})
    	]
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
