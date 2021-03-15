import React from 'react'
import { Form, Field, Input, Select, DatePicker, Table } from '@alifd/next'
import InfoContainer from '@/components/InfoContainer'
import Ellipsis from '@/components/Ellipsis'

const FormItem = Form.Item

export default class ShowLogService extends React.Component {
	field = new Field(this)
	state = {
		runStatus: '',
		logInfoTable: [],
		logDetail: '',
		basicInfoKeys: []
	}

	componentDidMount () {
		this.initBasicInfo()
		this.initLog()
	}

	initBasicInfo = () => {
		const { basicInfo } = this.props
		let keys = Object.keys(basicInfo)
		if (keys.length > 0) {
			keys.map(item => {
				this.field.setValue(item, basicInfo[item])
			})
			this.setState({ basicInfoKeys: keys })
		}
	}

	initLog = () => {
		console.log('info')
		this.setState({
			logInfoTable: [
				{ uuid: '1', startTime: '2020-09-20 12:12:12', status: '运行成功', runTime: '10s', result: 'SUCCESS: ahgoerhgopiwahgopiwaehgowihghgauhguawhwogahgoawehgowihgwhg agwegfwegwegwegwgwe' },
				{ uuid: '2', startTime: '2020-09-20 12:12:12', status: '运行失败', runTime: '10s', result: 'SUCCESS: ahgoerhgopiwahgopiwaehgowihgopiwhg' },
				{ uuid: '3', startTime: '2020-09-20 12:12:12', status: '运行成功', runTime: '10s', result: 'SUCCESS: ahgoerhgopiwahgopiwaehgowihgopiwhg' },
				{ uuid: '4', startTime: '2020-09-20 12:12:12', status: '运行失败', runTime: '10s', result: 'SUCCESS: ahgoerhgopiwahgopiwaehgowihgopiwhg' },
			]
		})
	}

	onChangeStatus = (val) => {
		this.setState({ runStatus: val }, () => {
			this.initLog()
		})
	}

	renderStatus = (data) => {
		return (
			<font color={data === '运行成功' ? '#67c23A' : '#f56c6c'}>
				{data}
			</font>
		)
	}

	renderResult = (data) => {
		return (
			<a onClick={() => { this.setState({ logDetail: data }) }} className="collect_log_check_detail">
				<Ellipsis alignCenter text={data} />
			</a>
		)
	}

	render () {
		const init = this.field.init

		const { runStatus, logInfoTable, logDetail, basicInfoKeys } = this.state
		const {
			runTimeDataSource
		} = this.props

		return (
			<Form labelAlign="top" field={this.field} style={{ width: '100%' }}>
				<InfoContainer title="基本信息" id="basicInfo" showVisibleChangeBtn>
					{basicInfoKeys.length > 0 ? basicInfoKeys.map((item, index) => {
						return (
							<FormItem label={item} required key={index}>
								<Input placeholder={item} {...init(item)} readOnly/>
							</FormItem>
						)
					}) : null}
				</InfoContainer>

				<InfoContainer title="运行日志" id="runLog">
					<div className="collect_log_filter_bar">
						<Select
							dataSource={runTimeDataSource}
							placeholder='请选择运行时间'
							style={{ width: '75%' }}
						/>
						{/* <DatePicker.RangePicker style={{ width: '460px' }}/> */}
						{/* <Select onChange={this.onChangeStatus} value={runStatus} placeholder="请选择运行状态" style={{ width: '200px' }}>
							<Select.Option value="success">运行成功</Select.Option>
							<Select.Option value="error">运行失败</Select.Option>
						</Select> */}
					</div>
					<Table dataSource={logInfoTable} style={{ marginBottom: '15px' }}>
						<Table.Column dataIndex='startTime' title="运行时间" align="center" width={150}/>
						<Table.Column dataIndex='status' title="结果状态" align="center" width={100} cell={this.renderStatus}/>
						<Table.Column dataIndex='runTime' title="运行时长（runtime）" align="center" width={150}/>
						<Table.Column dataIndex='result' title="结果信息" align="center" width={200} cell={this.renderResult}/>
					</Table>
					<FormItem label="日志详情">
						<div className="collect_log_detail">
							{logDetail}
						</div>
					</FormItem>
				</InfoContainer>
			</Form>
		)
	}
}
