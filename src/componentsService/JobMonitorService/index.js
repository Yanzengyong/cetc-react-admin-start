import React from 'react'
import InfoContainer from '@/components/InfoContainer'
import { Form, Select, DatePicker, Button, Divider } from '@alifd/next'
import './index.scss'
import RunTimeEchart from './RunTimeEchart'
import moment from 'moment'

moment.locale('zh-cn')

const FormItem = Form.Item
const { RangePicker } = DatePicker

const currentDate = moment()
const periodTime = {
	month: moment().subtract(1, 'months'),
	season: moment().subtract(3, 'months'),
	year: moment().subtract(1, 'years'),
}

export default class JobMonitorService extends React.Component {
	state = {
		jobRunTime: [
			{ label: '2020-07-08 21:13:45', value: '2020-07-08 21:13:45' },
		],
		selectedRunTime: '',
		log: '',
		selectedTimePeriod: 'month',
		selectedDateRange: [currentDate, periodTime['month']],
	}

	componentDidMount () {
		this.initJobRunTime()
	}

	// 获取任务调度时间可选option
	initJobRunTime = () => {
		this.setState(
			{
				jobRunTime: [
					{ label: '2020-07-08 21:13:45', value: '2020-07-08 21:13:45' },
				],
			},
			() => {
				this.setState(
					{
						selectedRunTime:
							this.state.jobRunTime[0] && this.state.jobRunTime[0].value
								? this.state.jobRunTime[0].value
								: '',
					},
					() => {
						this.getLog(this.state.selectedRunTime)
					}
				)
			}
		)
	}

	// 选择任务调度时间
	onSelectJobRunTime = (val) => {
		this.setState({ selectedRunTime: val }, () => {
			this.getLog(val)
		})
	}

	// 查询获取任务调度日志
	getLog = (time) => {
		console.log(time)
		this.setState({
			log:
				'gaugawhajvfjkawhovgawefjvadfvhawfvawhfvawhfoi;awfjkeawhgo;eawhgfvueawhgawhfvjksdhvoawdhgfaewhf<br/>jnalwdfawoegfwaejnvawehviawnvkiawjv;awjefvawjgawekvgaweijgiawejgvfklsdmvlafsdjviawmvlkfdjviojfavgdjsaglidsajfgiawgvpjasdikvjaipjgvdsjvkasdmvklasdjvgiaevkdljvawjgvpajgvoawlk;sdbpwgpawejgkdslnvkluahuighaoghawehgwaoehgpawggahwueghaowgiawjgiwaejgiwaejgpeawmkdszg;phgiuyergiuyawehbgoawugjwhesfioawfjhwegiawgfuiweagwaehgeawhgjwaehgewgjsdhgeawhgjiawehgiuweahiughaweiughaweuhgawghuiehgfiuahweghwaeghauwihgawehgiwaehgiweahgwaenhfvaewhgiuvaewhgiuawehguawihgiuaewhgoaehgwaehgiawuehgiuwaehgoawehgawehgiahweolghaehgfaweghawegaweghawahgpeawhgawhgoawgjdshgeawgjsdgvhaweogawejghspoghawhgahgagawehgawehgohweoghwaoeghrfhgiuerhgiwehgiwhegpawegjdhsjkvhraeihugwaejgnjwagbhaehwgiawghauiwehgawehifgwaegaejsghawpeufghwakiehgjewshgiwaehokgnselkjghwihgoqwihgjskwhgiuwaehoilwahegivherkjghawiehgaiwkghwioh',
		})
	}

	onSelectDateRange = (vals) => {
		this.setState({ selectedDateRange: vals, selectedTimePeriod: '' })
	}

	onSelectPeriod = (period) => {
		if (period !== this.state.selectedTimePeriod) {
			this.setState({
				selectedTimePeriod: period,
				selectedDateRange: [currentDate, periodTime[period]],
			})
		} else {
			this.setState({ selectedTimePeriod: '', selectedDateRange: [] })
		}
	}

	render () {
		const {
			jobRunTime,
			selectedRunTime,
			log,
			selectedTimePeriod,
			selectedDateRange,
		} = this.state
		return (
			<Form labelAlign="top" style={{ width: '100%' }}>
				<InfoContainer title="监控日志" id="monitorLog">
					<FormItem label="任务调度时间：">
						<Select
							dataSource={jobRunTime}
							onChange={this.onSelectJobRunTime}
							value={selectedRunTime}
							placeholder="请选择任务调度时间"
						/>
					</FormItem>
					<FormItem label="任务调度日志：">
						<div className="log_container">{log}</div>
					</FormItem>
				</InfoContainer>
				<InfoContainer title="运行时长" id="runningTimeLength">
					<div className="time_range_select">
						<RangePicker
							onChange={this.onSelectDateRange}
							value={selectedDateRange}
						/>
						<div>
							<Button
								text
								type={selectedTimePeriod === 'month' ? 'primary' : 'normal'}
								onClick={() => this.onSelectPeriod('month')}
							>
								近一月
							</Button>
							<Divider direction="ver" />
							<Button
								text
								type={selectedTimePeriod === 'season' ? 'primary' : 'normal'}
								onClick={() => this.onSelectPeriod('season')}
							>
								近三月
							</Button>
							<Divider direction="ver" />
							<Button
								text
								type={selectedTimePeriod === 'year' ? 'primary' : 'normal'}
								onClick={() => this.onSelectPeriod('year')}
							>
								近一年
							</Button>
						</div>
					</div>
					<div className="time_length_chart">
						<RunTimeEchart/>
					</div>
				</InfoContainer>
			</Form>
		)
	}
}
