/*
 * @Author: ShenLing
 * @Date: 2020-10-20 17:31:22
 * @LastEditors: Shenling
 * @LastEditTime: 2020-10-27 09:45:41
 */
import React from 'react'
import './index.scss'
import { Dialog, Tab, Radio, Input, Button, NumberPicker, Checkbox, Grid, Table, Message } from '@alifd/next'

const { Row, Col } = Grid

export default class GronGenerator extends React.Component {
	state = {
		// 各个cron阈表达式
		express: {
			second: '*',
			minute: '*',
			hour: '*',
			date: '*',
			month: '*',
			week: '?',
			year: '*'
		},

		// 每个阈选择的表达式类型
		expressType: {
			second: 'everyTime',
			minute: 'everyTime',
			hour: 'everyTime',
			date: 'everyTime',
			month: 'everyTime',
			week: 'everyTime',
			year: 'everyTime',
		},

		// 周期选择 - 最小时间 / 最大时间
		periodTime: {
			second: { max:2, min:1 },
			minute: { max: 2, min: 1 },
			hour: { max: 2, min: 1 },
			date: { max: 2, min: 1 },
			month: { max: 2, min: 1 },
			week: { max: 2, min: 1 },
			year: { max: 2020, min: 2020 },
		},

		// 循环选择 - 开始时间./ 执行周期
		loopTime: {
			second: { startTime:1, period:1 },
			minute: { startTime: 1, period: 1 },
			hour: { startTime: 1, period: 1 },
			date: { startTime: 1, period: 1 },
			month: { startTime: 1, period: 1 },
		},

		// 枚举指定选择 - 指定时间节点数组，例如日期数组
		enumTime: {
			second: [],
			minute: [],
			hour: [],
			date: [],
			month: [],
			week: []
		},

		// 最近工作日 - 距离X日最近的工作日
		mostRecentWorkDay: 1,

		// 当前月份最后一个星期X
		lastWeekDay: 1,

		// 指定X周的星期X - 例如：第一周的星期三
		weekday: {
			weekNum: 1,
			weekDayNum: 1
		},

		alertMsg: null
	}

	UNSAFE_componentWillReceiveProps (nextProps) {
		if (nextProps.dialogVisible && nextProps.initCron) {
			let cronArr = nextProps.initCron.split(' ')
			let newExpress = JSON.parse(JSON.stringify(this.state.express))
			newExpress.second = cronArr[0] ?? newExpress.second
			newExpress.minute = cronArr[1] ?? newExpress.minute
			newExpress.hour = cronArr[2] ?? newExpress.hour
			newExpress.date = cronArr[3] ?? newExpress.date
			newExpress.month = cronArr[4] ?? newExpress.week
			newExpress.week = cronArr[5] ??	newExpress.week
			newExpress.year = cronArr[6] ?? newExpress.year

			this.reverseGenerateCRON(newExpress)
			this.setState({ express: newExpress })
		}
	}

	reverseGenerateCRON = (express) => {
		let newExpressType = JSON.parse(JSON.stringify(this.state.expressType))

		newExpressType.second = this.getType(express.second, 'second')
		newExpressType.minute = this.getType(express.minute, 'minute')
		newExpressType.hour = this.getType(express.hour, 'hour')
		newExpressType.date = this.getType(express.date, 'date')
		newExpressType.month = this.getType(express.month, 'month')
		newExpressType.week = this.getType(express.week, 'week')
		newExpressType.year = this.getType(express.year, 'year')

		this.setState({ expressType: newExpressType })

	}

	getType = (expStr, expressType) => {
		if (expStr === '*') return 'everyTime'

		else if (expStr === '?') return 'none'

		else if (expStr === 'L') return 'lastDay'

		else if (new RegExp('[-]').test(expStr)) {
			let newPeriodTime = this.state.periodTime
			let values = expStr.split('-')
			newPeriodTime[expressType] = { max: parseInt(values[1]), min: parseInt(values[0]) }

			this.setState({ periodTime: newPeriodTime })
			return 'period'
		}

		else if (new RegExp('[/]').test(expStr)) {
			let newLoopTime = this.state.loopTime
			let values = expStr.split('/')
			newLoopTime[expressType] = { startTime: parseInt(values[0]), period: parseInt(values[1]) }

			this.setState({ loopTime: newLoopTime })
			return 'loop'
		}

		else if (new RegExp('[,]').test(expStr)) {
			let newEnumTime = this.state.enumTime
			let values = expStr.split(',')
			for (let i = 0; i < values.length; i++) {
				values[i] = parseInt(values[i])
			}
			newEnumTime[expressType] = values

			this.setState({ enumTime: newEnumTime })
			return 'enum'
		}

		else if (new RegExp('[W]').test(expStr)) {
			let value = parseInt(expStr.substring(0, 1))
			this.setState({ mostRecentWorkDay: value })
			return 'mostRecentWorkDay'
		}

		else if (new RegExp('[L]').test(expStr)) {
			this.setState({ lastWeekDay: parseInt(expStr.substring(0, 1)) })
			return 'lastWeekDay'
		}

		else if (new RegExp('[#]').test(expStr)) {
			let newWeekday = this.state.weekday
			let values = expStr.split('#')

			newWeekday = { weekNum: parseInt(values[0]), weekDayNum: parseInt(values[1]) }

			this.setState({ weekday: newWeekday })
			return 'weekday'
		}

		else if (expStr === '') {
			return 'optional'
		}

		else return
	}


	/**
  * @name: 选择每个表达式的具体展示类型
  * @param {*} type 表达式内容类型：everyTime, period, loop, enum 等
  * @param {*} expressType cron类型：second, minute, hour, date, month, week, year
  * @return {*}
  */
	onSelectType = (type, expressType) => {
		let expressionTypeState = this.state.expressType
		expressionTypeState[expressType] = type

		this.setState({ expressType: expressionTypeState }, () => {
			// 特殊逻辑判断，获取最新表达式
			this.judgeSpecialCRON(type, expressType)
		})
	}

	/**
  * @name: 获取每个cron阈的表达式字符串
  * @param {*} type
  * @param {*} expressType
  * @return {*}
  */
	getExpressStr = (type, expressType) => {
			switch (type) {
				case 'everyTime': return '*'
				case 'none': return '?'
				case 'lastDay': return 'L'
				case 'period': return this.expressGenerator(type, this.state.periodTime[expressType])
				case 'loop': return this.expressGenerator(type, this.state.loopTime[expressType])
				case 'enum': return this.expressGenerator(type, this.state.enumTime[expressType])
				case 'mostRecentWorkDay': return this.state.mostRecentWorkDay + 'W'
				case 'lastWeekDay': return this.state.lastWeekDay + 'L'
				case 'weekday': return this.expressGenerator(type, this.state.weekday)
				case 'optional': return ''
				default: return
			}
	}

	/**
  * @name: 获取cron表达式
  * @param {type}
  * @return {type}
  */
	expressGenerator = (type, value) => {
		function getEnumString (values) {
			if (values.length > 0) {
				let str = ''
				values.map(item => {
					str = str + ',' + item
				})
				str = str.substring(1, str.length)
				return str
			}
			else
				return '*'
		}
		switch (type) {
			case 'everyTime': return '*'
			case 'period': return value ? value.min + '-' + value.max : ''
			case 'loop': return value ? value.startTime + '/' + value.period : ''
			case 'enum': return getEnumString(value)
			case 'weekday': return value ? value.weekNum + '#' + value.weekDayNum : ''
			default: return '*'
		}
	}

	// 表达式校验并对表达式进行赋值
	judgeSpecialCRON = (type, expressType) => {
		let expressState = JSON.parse(JSON.stringify(this.state.express))

		if (type === this.state.expressType[expressType]) {
			expressState[expressType] = this.getExpressStr(type, expressType)
		}

		// 特殊赋值逻辑
		switch (expressType) {
			case 'date': {
				// 日期和星期不可同时为？（不指定）
				if (expressState.date === '?' && expressState.week === '?') {
					Message.warning('日期和星期不可同时均不指定任何值')
					expressState.week = '*'
				}
				// 日期和星期不可同时指定内容（非？）
				if (expressState.date !== '?' && expressState.week !== '?') {
					Message.warning('日期和星期不可同时指定任何值')
					expressState.week = '?'
				}
				break
			}
			case 'month': {
				// 当月份选择为*（任意）时，星期设定为？（不指定）
				Message.warning('当月份选择为任意值时，星期设定为不指定模式（?）')
				if (expressState.month === '*') {
					expressState.week = '?'
					if (expressState.date === '?') {
						expressState.date = '*'
					}
				}
				break
			}
			case 'week': {
				// 日期和星期不可同时为？（不指定）
				if (expressState.week === '?' && expressState.date === '?') {
					expressState.date = '*'
					Message.warning('日期和星期不可同时均不指定任何值')
				}
				// 日期和星期不可同时指定内容（非？）
				if (expressState.week !== '?' && expressState.date !== '?') {
					expressState.date = '?'
					Message.warning('日期和星期不可同时指定任何值')
				}
				break
			}
			default: break
		}

		this.setState({ express: expressState })
	}

 /**
  * @name: 选择 最小时间-最大时间
  * @param {*} num
  * @param {*} type
  * @param {*} numType
  * @return {*}
  */
	onSelectPeriod = (num, expressType, numType) => {
		let period = JSON.parse(JSON.stringify(this.state.periodTime))
		if (numType === 'max') {
			period[expressType].max = num
		}
		else {
			period[expressType].min = num
		}
		this.setState({ periodTime: period }, () => {
			this.judgeSpecialCRON('period', expressType)
		})
	}

 /**
  * @name: 选择 开始时间/间隔周期
  * @param {*} num
  * @param {*} type
  * @param {*} numType
  * @return {*}
  */
	onSelectLoop = (num, expressType, numType) => {
		let loop = JSON.parse(JSON.stringify(this.state.loopTime))
		if (numType === 'startTime') {
			loop[expressType].startTime = num
		}
		else {
			loop[expressType].period = num
		}
		this.setState({ loopTime: loop }, () => {
			this.judgeSpecialCRON('loop', expressType)
		})
	}

	/**
  * @name: 选择枚举值
  * @param {*} values
  * @param {*} type
  * @return {*}
  */
	onSelectEnum = (values, expressType) => {
		let enumObj = JSON.parse(JSON.stringify(this.state.enumTime))
		enumObj[expressType] = values

		this.setState({ enumTime: enumObj }, () => {
			this.judgeSpecialCRON('enum', expressType)
		})
	}

	/**
  * @name: 选择星期执行循环
  * @param {*} value
  * @param {*} type
  * @return {*}
  */
	onSelectWeekDay = (value, type) => {
		let weekday = JSON.parse(JSON.stringify(this.state.weekday))
		if (type === 'weekNum') {
			weekday.weekNum = value
		}
		else {
			weekday.weekDayNum = value
		}
		this.setState({ weekday: weekday }, () => {
			this.judgeSpecialCRON('weekday', 'week')
		})
	}

	// 确认提交
	onConfirm = () => {
		let expressStr =
			this.state.express.second + ' ' +
			this.state.express.minute + ' ' +
			this.state.express.hour + ' ' +
			this.state.express.date + ' ' +
			this.state.express.month + ' ' +
			this.state.express.week + ' ' +
			this.state.express.year

		this.props.onConfirm(expressStr)
		this.props.onClose()
	}

	render () {
		const { dialogVisible, onClose, isPreview } = this.props
		const {
			periodTime,
			loopTime,
			enumTime,
			mostRecentWorkDay,
			lastWeekDay,
			weekday,

			express,
			expressType,
		} = this.state

		/**
   * @name:  增加空格
   * @param {NUMBER} num：需要多少个空格
   * @return {String} 空格字符
   */
		const spaceDOM = (num) => {
			let space = ''
			for (let i = 0; i < num; i++) {
				space += '\xa0'
			}
			return space
		}

		/**
   * @name: 多选框生成器
   * @param {Number} num
   * @param {Number} colNum
   * @param {String} type 表示CRON类型，可输入second, minute, hour, date, month, week
   * @return {*}
   */
		const checkboxGroup = (num, colNum, type) => {
			let checkboxArray = []

			let rowNum = num % colNum === 0 ? parseInt(num / colNum) : parseInt(num / colNum) + 1

			for (let row = 0; row < rowNum; row++) {
				let startNum = row * colNum
				let endNum = (row + 1) * colNum

				if (row === rowNum - 1 && num % colNum > 0) {
					endNum = num
				}
				checkboxArray.push(
					generateRow(startNum, endNum, type)
				)
			}

			function generateRow (startNum, endNum, type) {
				let colArr = []
				for (let i = startNum; i < endNum; i++) {
					let label = i
					let value = i
					switch (type) {
						case 'second': label = i; break
						case 'minute': label = i; break
						case 'hour': label = i; break
						case 'date': label = i + 1; value = i + 1; break
						case 'month': label = i + 1; value = i + 1; break
						case 'week': label = i + 1; value = i + 1; break
						default: break
					}
					colArr.push({ value: value, label: label })
				}

				return (
					<Row justify="start" style={{ marginTop: 10 }} key={startNum}>
						{colArr.map((item, index) => (
							<Col key={index}>
								<Checkbox value={item.value} label={item.label}/>
							</Col>
						))}
					</Row>

				)
			}

			return checkboxArray
		}

		return (
			<Dialog
				title="CRON生成器"
				visible={dialogVisible}
				onClose={onClose}
				onCancel={onClose}
				onOk={this.onConfirm}
				footer={!isPreview}
			>
				<Tab shape="pure" className="cron_generator_container">
					<Tab.Item title="秒" key={1}>
						<Radio.Group value={expressType.second} itemDirection="ver" className="cron_info" onChange={(type) => this.onSelectType(type, 'second')}>
							<Radio value="everyTime">每秒</Radio>

							<Radio value="period">
								周期从{spaceDOM(2)}
								<NumberPicker min={1} max={58} value={periodTime.second.min} onChange={(num) => this.onSelectPeriod(num, 'second', 'min')}/>
								{spaceDOM(2)}到{spaceDOM(2)}
								<NumberPicker min={2} max={59} value={periodTime.second.max} defaultValue={2} onChange={(num) => this.onSelectPeriod(num, 'second', 'max')} />
								{spaceDOM(2)}秒
							</Radio>

							<Radio value="loop">
								从{spaceDOM(2)}
								<NumberPicker min={0} max={59} value={loopTime.second.startTime} defaultValue={1} onChange={(num) => this.onSelectLoop(num, 'second', 'startTime')}/>
								{spaceDOM(2)}秒开始，每{spaceDOM(2)}
								<NumberPicker min={1} max={59} value={loopTime.second.period} defaultValue={2} onChange={(num) => this.onSelectLoop(num, 'second', 'period')} />
								{spaceDOM(2)}秒执行一次
							</Radio>

							<Radio value="enum">
								指定： <br />
								<Checkbox.Group onChange={(values) => this.onSelectEnum(values, 'second')} value={enumTime.second}>
									{checkboxGroup(60, 10, 'second')}
								</Checkbox.Group>
							</Radio>

						</Radio.Group>
					</Tab.Item>

					<Tab.Item title="分钟" key={2}>
						<Radio.Group value={expressType.minute} itemDirection="ver" className="cron_info" onChange={(type) => this.onSelectType(type, 'minute')}>
							<Radio value="everyTime">每秒</Radio>

							<Radio value="period">
								周期从{spaceDOM(2)}
								<NumberPicker min={1} max={58} value={periodTime.minute.min} onChange={(num) => this.onSelectPeriod(num, 'minute', 'min')}/>
								{spaceDOM(2)}到{spaceDOM(2)}
								<NumberPicker min={2} max={59} value={periodTime.minute.max} defaultValue={2} onChange={(num) => this.onSelectPeriod(num, 'minute', 'max')} />
								{spaceDOM(2)}分钟
							</Radio>

							<Radio value="loop">
								从{spaceDOM(2)}
								<NumberPicker min={0} max={59} value={loopTime.minute.startTime} defaultValue={1} onChange={(num) => this.onSelectLoop(num, 'minute', 'startTime')}/>
								{spaceDOM(2)}分钟开始，每{spaceDOM(2)}
								<NumberPicker min={1} max={59} value={loopTime.minute.period} defaultValue={2} onChange={(num) => this.onSelectLoop(num, 'minute', 'period')} />
								{spaceDOM(2)}分钟执行一次
							</Radio>

							<Radio value="enum">
								指定： <br />
								<Checkbox.Group onChange={(values) => this.onSelectEnum(values, 'minute')} value={enumTime.minute}>
									{checkboxGroup(60, 10, 'minute')}
								</Checkbox.Group>
							</Radio>

						</Radio.Group>
					</Tab.Item>

					<Tab.Item title="小时" key={3}>
					<Radio.Group value={expressType.hour} itemDirection="ver" className="cron_info" onChange={(type) => this.onSelectType(type, 'hour')}>
							<Radio value="everyTime">每小时</Radio>

							<Radio value="period">
								周期从{spaceDOM(2)}
								<NumberPicker min={1} max={58} value={periodTime.hour.min} onChange={(num) => this.onSelectPeriod(num, 'hour', 'min')}/>
								{spaceDOM(2)}到{spaceDOM(2)}
								<NumberPicker min={2} max={59} value={periodTime.hour.max} defaultValue={2} onChange={(num) => this.onSelectPeriod(num, 'hour', 'max')} />
								{spaceDOM(2)}小时
							</Radio>

							<Radio value="loop">
								从{spaceDOM(2)}
								<NumberPicker min={0} max={59} value={loopTime.hour.startTime} defaultValue={1} onChange={(num) => this.onSelectLoop(num, 'hour', 'startTime')}/>
								{spaceDOM(2)}分钟开始，每{spaceDOM(2)}
								<NumberPicker min={1} max={59} value={loopTime.hour.period} defaultValue={2} onChange={(num) => this.onSelectLoop(num, 'hour', 'period')} />
								{spaceDOM(2)}小时执行一次
							</Radio>

							<Radio value="enum">
								指定： <br />
								<Checkbox.Group onChange={(values) => this.onSelectEnum(values, 'hour')} value={enumTime.hour}>
									{checkboxGroup(24, 12, 'hour')}
								</Checkbox.Group>
							</Radio>

						</Radio.Group>
					</Tab.Item>

					<Tab.Item title="日" key={4}>
						<Radio.Group value={expressType.date} itemDirection="ver" className="cron_info" onChange={(type) => this.onSelectType(type, 'date')}>
							<Radio value="everyTime">每日</Radio>

							<Radio value="none">不指定</Radio>

							<Radio value="period">
								周期从{spaceDOM(2)}
								<NumberPicker min={1} max={30} value={periodTime.date.min} onChange={(num) => this.onSelectPeriod(num, 'date', 'min')}/>
								{spaceDOM(2)}到{spaceDOM(2)}
								<NumberPicker min={2} max={31} value={periodTime.date.max} defaultValue={2} onChange={(num) => this.onSelectPeriod(num, 'date', 'max')} />
								{spaceDOM(2)}天
							</Radio>

							<Radio value="loop">
								从{spaceDOM(2)}
								<NumberPicker min={0} max={31} value={loopTime.date.startTime} defaultValue={1} onChange={(num) => this.onSelectLoop(num, 'date', 'startTime')}/>
								{spaceDOM(2)}天开始，每{spaceDOM(2)}
								<NumberPicker min={1} max={31} value={loopTime.date.period} defaultValue={2} onChange={(num) => this.onSelectLoop(num, 'date', 'period')} />
								{spaceDOM(2)}天执行一次
							</Radio>

							<Radio value="mostRecentWorkDay">
								每月{spaceDOM(2)}
								<NumberPicker min={1} max={31} value={mostRecentWorkDay} onChange={(num) => {
									this.setState({ mostRecentWorkDay: num }, () => {
											this.judgeSpecialCRON('mostRecentWorkDay', 'date')
									})
								}} />
								{spaceDOM(2)}号最接近的那个工作日
							</Radio>

							<Radio value="lastDay">本月最后一天</Radio>

							<Radio value="enum">
								指定： <br />
								<Checkbox.Group onChange={(values) => this.onSelectEnum(values, 'date')} value={enumTime.date}>
									{checkboxGroup(31, 10, 'date')}
								</Checkbox.Group>
							</Radio>

						</Radio.Group>
					</Tab.Item>

					<Tab.Item title="月" key={5}>
						<Radio.Group value={expressType.month} itemDirection="ver" className="cron_info" onChange={(type) => this.onSelectType(type, 'month')}>
							<Radio value="everyTime">每月</Radio>

							<Radio value="period">
								周期从{spaceDOM(2)}
								<NumberPicker min={1} max={30} value={periodTime.month.min} onChange={(num) => this.onSelectPeriod(num, 'month', 'min')}/>
								{spaceDOM(2)}到{spaceDOM(2)}
								<NumberPicker min={2} max={31} value={periodTime.month.max} defaultValue={2} onChange={(num) => this.onSelectPeriod(num, 'month', 'max')} />
								{spaceDOM(2)}月
							</Radio>

							<Radio value="loop">
								从{spaceDOM(2)}
								<NumberPicker min={0} max={31} value={loopTime.month.startTime} defaultValue={1} onChange={(num) => this.onSelectLoop(num, 'month', 'startTime')}/>
								{spaceDOM(2)}月开始，每{spaceDOM(2)}
								<NumberPicker min={1} max={31} value={loopTime.month.period} defaultValue={2} onChange={(num) => this.onSelectLoop(num, 'month', 'period')} />
								{spaceDOM(2)}月执行一次
							</Radio>

							<Radio value="enum">
								指定： <br />
								<Checkbox.Group onChange={(values) => this.onSelectEnum(values, 'month')} value={enumTime.month}>
									{checkboxGroup(31, 10, 'month')}
								</Checkbox.Group>
							</Radio>

						</Radio.Group>
					</Tab.Item>

					<Tab.Item title="周" key={6}>
						<Radio.Group value={expressType.week} itemDirection="ver" className="cron_info" onChange={(type) => this.onSelectType(type, 'week')}>
							<Radio value="everyTime">每日</Radio>

							<Radio value="none">不指定</Radio>

							<Radio value="period">
								周期从星期{spaceDOM(2)}
								<NumberPicker min={1} max={30} value={periodTime.week.min} onChange={(num) => this.onSelectPeriod(num, 'week', 'min')}/>
								{spaceDOM(2)}到星期{spaceDOM(2)}
								<NumberPicker min={2} max={31} value={periodTime.week.max} defaultValue={2} onChange={(num) => this.onSelectPeriod(num, 'week', 'max')} />
								{spaceDOM(2)}
							</Radio>

							<Radio value="weekday">
								第{spaceDOM(2)}
								<NumberPicker min={1} max={4} value={weekday.weekNum} defaultValue={1} onChange={(num) => this.onSelectWeekDay(num, 'weekNum')}/>
								{spaceDOM(2)}周的星期{spaceDOM(2)}
								<NumberPicker min={1} max={7} value={weekday.weekDayNum} defaultValue={1} onChange={(num) => this.onSelectWeekDay(num, 'weekDayNum')}/>
								{spaceDOM(2)}
							</Radio>

							<Radio value="lastWeekDay">
								本月最后一个星期{spaceDOM(2)}
								<NumberPicker min={1} max={7} value={lastWeekDay}
									onChange={(num) => {
										this.setState({ lastWeekDay: num }, () => {
											this.judgeSpecialCRON('lastWeekDay', 'week')
										})
									}}
								/>
								{spaceDOM(2)}
							</Radio>

							<Radio value="enum">
								指定： <br />
								<Checkbox.Group onChange={(values) => this.onSelectEnum(values, 'week')} value={enumTime.week}>
									{checkboxGroup(7, 7, 'week')}
								</Checkbox.Group>
							</Radio>

						</Radio.Group>
					</Tab.Item>

					<Tab.Item title="年" key={7}>
						<Radio.Group value={expressType.year} itemDirection="ver" className="cron_info" onChange={(type) => this.onSelectType(type, 'year')}>
							<Radio value="everyTime">每年</Radio>

							{/* <Radio value="optional">不指定</Radio> */}

							<Radio value="period">
								周期从{spaceDOM(2)}
								<NumberPicker min={1970} max={2099} value={periodTime.year.min} onChange={(num) => this.onSelectPeriod(num, 'year', 'min')}/>
								{spaceDOM(2)}年到{spaceDOM(2)}
								<NumberPicker min={1970} max={2099} value={periodTime.year.max} defaultValue={2} onChange={(num) => this.onSelectPeriod(num, 'year', 'max')} />
								{spaceDOM(2)}年
							</Radio>

						</Radio.Group>
					</Tab.Item>
				</Tab>
				<div className="expression_box">
					<span>CRON 表达式：</span>
					<Table dataSource={[express]}>
						<Table.Column dataIndex='second' title="秒" align="center" width={100}/>
						<Table.Column dataIndex='minute' title="分钟" align="center" width={100}/>
						<Table.Column dataIndex='hour' title="小时" align="center" width={100}/>
						<Table.Column dataIndex='date' title="日" align="center" width={100}/>
						<Table.Column dataIndex='month' title="月" align="center" width={100}/>
						<Table.Column dataIndex='week' title="周" align="center" width={100}/>
						<Table.Column dataIndex='year' title="年" align="center" width={100}/>
					</Table>
					<span style={{ color: 'red' }}>{this.state.alertMsg}</span>
				</div>
			</Dialog>
		)
	}
}
