/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-12-28 11:02:01
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 17:27:49
 */
import React from 'react'
import ReactEcharts from 'echarts-for-react'

const getColor = (index) => {
	switch (index) {
	case 1 : return '#2FC25B'
	case 2 : return '#35CACA'
	default: return '#2FC25B'
	}
}

export default class DashboardChart extends React.Component {
	state = {
		value: [],
		option: {}
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
		if (JSON.stringify(prevState.value) !== JSON.stringify(this.state.value)) {
			this.setState({
				option: this.getOption()
			})
		}
	}

	getOption = () => {
		const {
			title,
			insideTitle,
			totalNum
		} = this.props
		const {
			value
		} = this.state
		console.log(value)
		return {
			title: [
				{
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
				{
					text: insideTitle,
					textStyle: {
						color: '#8C8C8C',
						fontSize: 12,
						fontFamily: 'PingFang SC',
						lineHeight: 22,
						fontWeight: 400
					},
					left: 'center',
					bottom: 140
				},
				{
					text: `{a|${totalNum ?? 0}} {b|个}`,
					confine: false,
					textStyle: {
						rich: {
							a: {
								color: '#000000',
								fontSize: 24,
								fontFamily: 'PingFang SC',
								lineHeight: 29,
							},
							b: {
								color: 'rgba(0,0,0,0.85)',
								fontSize: 14,
								fontFamily: 'PingFang SC',
								lineHeight: 20
							}
            }
					},
					left: 'center',
					bottom: 105
				}
			],
			tooltip: {
        trigger: 'item',
				formatter: '{b}: {c}个 <br > 占比({d}%)',
				position: function (pos, params, dom, rect, size) {
					// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
					var obj = { top: pos[1] - 50 }
					obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
					return obj
				}
    	},
			series: [
        {
					type: 'pie',
					width: '200',
					height: '200',
					hoverOffset: 10,
					top: 10,
					left: 'center',
					radius: ['65%', '95%'],
					label: {
						show: false,
						position: 'inside',
					},
					itemStyle: {
  					color: (params) => {
						  return getColor(params.dataIndex + 1)
  					}
  				},
					data: value
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
