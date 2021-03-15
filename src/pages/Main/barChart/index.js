/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-12-28 16:00:25
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 16:47:11
 */
import React from 'react'
import ReactEcharts from 'echarts-for-react'

export default class BarChart extends React.Component {
	state = {
		option: {}
	}

	componentDidMount () {
		this.setState({
			option: this.getOption()
		})
	}

	static getDerivedStateFromProps (props, state) {
		if (JSON.stringify(props.value) !== JSON.stringify(state.value)) {
			return {
				value: props.value
			}
		}
		return null
	}

	componentDidUpdate (prevProps, prevState) {
		const {
			xData,
			values
		} = this.props
		if (JSON.stringify(xData) !== JSON.stringify(prevProps.xData) ||
			JSON.stringify(values) !== JSON.stringify(prevProps.values)) {
				this.setState({
					option: this.getOption()
				})
		}
	}

	getOption = () => {
		const {
			xData, values
		} = this.props

		return {
			tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				top: '32',
        left: 'center',
				bottom: '0',
				width: '85%',
				height: '60%'
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				triggerEvent: true,
				axisLine: {
					show: true,
					lineStyle: {
						color: 'rgba(0, 0, 0, 0.25)'
					}
				},
				axisTick: {
					length: 5,
					lineStyle: {
						color: 'rgba(0, 0, 0, 0.25)'
					},
					alignWithLabel: true
				},
				axisLabel: {
					color: '#595959',
					align: 'center',
					padding: [5, 0, 0, 50],
					margin: 10,
					rotate: -60,
					formatter: (value) => {
						if (typeof value === 'string') {
							const divEl = document.createElement('div')
							divEl.innerText = 'xxxxxxxx'
							return value.length > 5 ? `${value.slice(0, 4)}...` : value
							// return value.length > 5 ? divEl : value
						} else {
							return '暂无名称'
						}
					},
					rich: {
						a: {
								color: 'red',
								lineHeight: 10
						},
						b: {
								backgroundColor: {
										image: 'xxx/xxx.jpg'
								},
								height: 40
						},
						x: {
								fontSize: 18,
								fontFamily: 'Microsoft YaHei',
								borderColor: '#449933',
								borderRadius: 4
						}
					}
				},
				data: xData
			},
			yAxis: {
				type: 'value',
				name: '（次数）',
				nameGap: 19,
				minInterval: 1,
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
				splitLine: {
					lineStyle: {
						color: '#E6E6E6',
						type: 'dotted'
					}
				}
			},
			series: [
        {
					type: 'bar',
					data: values,
					itemStyle: {
						color: '#4679FF',
					},
					barWidth: '60%'
				}
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
