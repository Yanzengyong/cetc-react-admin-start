/*
 * @Author: ShenLing
 * @Date: 2020-09-18 11:07:59
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-05 10:43:12
 */
import React from 'react'
import InfoHead from '@/components/InfoHead'
import PropTypes from 'prop-types' // 类型检查
import './index.scss'
import colorStyle from '@/themeStyle/index.scss'

export default class InfoLayout extends React.Component {
  state = {
		currentNav: ''
  }

	componentDidMount () {
		const {
			navInfo
		} = this.props
		this.setState({
			currentNav: navInfo.length > 0 ? navInfo[0].value : ''
		})
	}
  // 滚动页面
	onClickNavItem = (sectionId) => {
		console.log(sectionId)
		this.setState({
			currentNav: sectionId
		}, () => {

			if (document.getElementById(sectionId)) {
				document.getElementById(sectionId).scrollIntoView({ behavior:'smooth' }) // 内容content滚动至相应ID位置
			}
			if (sectionId === this.props.advanceBtnId) {
				this.props.showAdvance()
			}

		})

  }

  render () {
  	const { hasNavBar, navInfo, displayAdvance, advanceAffectIds, advanceBtnId, operationBtnId, pageType } = this.props
		const { currentNav } = this.state
  	return (
  		<div className="info_container">
  			<InfoHead />
  			<div className="info_content">
  				<div className="info_form" style={{ width: !hasNavBar ? '100%' : '', paddingRight: !hasNavBar ? '30%' : '' }}>
  					{this.props.children}
					</div>

					<div className="info_nav_newStyle">
						{
							navInfo && navInfo.length > 0 ? navInfo.map(item => (
								item ? (
									<div
										key={item.value}
										onClick={()=> this.onClickNavItem(item.value)}
										className="info_nav_item"
										style={{
											display: (!displayAdvance &&
												advanceAffectIds.filter(id => id === item.value).length > 0) ||
												(item.value === operationBtnId && pageType === 'preview') ?
												'none' : '',
											borderColor: currentNav === item.value ? '#4679FF' : '#F0F0F0',
										}}
									>
										{item.value === advanceBtnId ? (
											<div className='info_nav_itemInfo'>
												<b></b>
												<span
													style={{
														marginRight: 5,
														color: colorStyle.general_primary_color
													}}
												>{displayAdvance ? '-' : '+'}</span>
											</div>
										) : null}
										<div className='info_nav_itemInfo'>
											<b></b>
											<span
												style={{
													color: currentNav === item.value ? '#4679FF' : '#262626'
												}}
											>{item.label}</span>
										</div>
									</div>
								) : null
  						)) : null
  					}
					</div>
  			</div>
  		</div>
  	)
  }
}

// props默认值指定
InfoLayout.defaultProps = {
	hasNavBar: false,
	navInfo: [],
	displayAdvance: false,
	advanceBtnId: 'advanceBtn',
	advanceAffectIds: [],
	operationBtnId: 'operationBtns',
	pageType: '',
}

InfoLayout.propTypes = {
	hasNavBar: PropTypes.bool, // 是否显示快速导航
	navInfo: PropTypes.array, // 导航栏内容（仅限noNavBar={false})时有效
	displayAdvance: PropTypes.bool, // 高级按钮T/F
	advanceBtnId: PropTypes.string, // 高级按钮DOM的id
	showAdvance: PropTypes.func, // 高级按钮点击function
	advanceAffectIds: PropTypes.array, // 受到高级按钮影响的nav的id数组
	operationBtnId: PropTypes.string, // 操作按钮DOM的id
	pageType: PropTypes.string, // 当前页面类型
}
