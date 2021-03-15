/*
 * @Author: Zhangyao
 * @Date: 2020-08-04 10:55:23
 * @LastEditors: Shenling
 * @LastEditTime: 2021-02-07 11:27:49
 */
import React from 'react'
import { Checkbox, Loading, Balloon } from '@alifd/next'
import PropTypes from 'prop-types'
import Ellipsis from '@/components/Ellipsis'
import IconFont from '@/components/IconFont'
import SimpleTag from '@/components/SimpleTag'
import { Tag } from '@alifd/next'
import moment from 'moment'
import colorStyle from '@/themeStyle/themeStyle.scss'
import './index.scss'
import { NoNumChinese } from 'utils/validationFn'
// const Tooltip = Balloon.Tooltip
class ListCard extends React.Component {

	state = {
		isShow: [],
		chooseIndex: [],
	}

	clickCardHandle = (info) => {
		this.props.clickCard(info)
	}

	render () {
		const {
			dataSource,
			clos,
			operation,
			pictureIndex,
			primaryKey,
			rowSelection,
			selectedRowKeys,
			loading,
			starDataIndex,
			starOnclick,
			bottomClos,
			titleBalloonDataIndex,
			titleBalloonText,
			titleBalloonChange,
			titleBalloonTriggerType,
			titleBalloonAlign,
			tagAlign,
			simpleTagAlign,
			contentReactNode,
			loadingUuids,
			simpleTag,
			tags,
			balloonNode
		} = this.props

		const setContentMarginStyle = () => {

			if (rowSelection) {
				// 存在选中框checkbox
				if (!pictureIndex) {
					// 不存在图片
					return { marginLeft: 35 }
				}
			} else {
				if (!pictureIndex) {
					// 不存在图片
					return { marginLeft: 8 }
				}
			}
		}

		// 简单标签的渲染
		const simpleTagHandle = (name, useBalloon) => {
			return <SimpleTag style={{ marginLeft: 8, maxWidth: 100 }} key={name} name={name}/>
		}

		// 标签渲染逻辑
		const tagCustom = (item) => {
			return tags && tags.length > 0 ? (
				tags.map((tagItem, tagIndex) => {
					let labelColor = getLabelColor(item[tagItem.dataIndex], tagItem.rules)
					let tagNode = item[tagItem.dataIndex] !== undefined && item[tagItem.dataIndex] !== null ?
							<Tag
							key={tagIndex}
							type="normal"
							className={tagAlign == 'left' ? 'list_card_title_tag_left' : 'list_card_title_tag_right'}
							style={{
								color: labelColor.fontColor,
								backgroundColor: labelColor.bgColor,
								borderColor: labelColor.bgColor,
							}}
						>
							{getLabelName(item[tagItem.dataIndex], tagItem.rules)}
						</Tag>
						: null

					// return tagNode
					return getBalloon(item[tagItem.dataIndex], tagItem.rules) ? (
						<Balloon
							closable={false}
							type="normal"
							trigger={tagNode}
							align="t"
							key={tagIndex}
						>
							{getBalloon(item[tagItem.dataIndex], tagItem.rules)}
						</Balloon>
					) : tagNode
				})
			) : null

			// 获取label对应名称
			function getLabelName (value, list) {
				let labelItem = list.filter(item => { return item.value === value })
				return labelItem.length > 0 ? labelItem[0].label : value
			}

			// 获取label对应颜色
			function getLabelColor (value, list) {
				let labelItem = list.filter(item => { return item.value === value })
				let colorLabel = 'normal'
				let colorItem = { fontColor: colorStyle.status_normal_color, bgColor: colorStyle.status_bg_normal_color }

				if (labelItem.length > 0) {
					if (labelItem[0].statusType) {
						colorLabel = labelItem[0].statusType
					}
					else if (labelItem[0].customColor && labelItem.customColor !== '') {
						colorLabel = 'custom'
					}
					else {
						colorLabel = 'normal'
					}
				}

				switch (colorLabel) {
					case 'disable': colorItem = { fontColor: colorStyle.status_disable_color, bgColor: colorStyle.status_bg_disable_color }; break
					case 'success': colorItem = { fontColor: colorStyle.status_success_color, bgColor: colorStyle.status_bg_success_color }; break
					case 'error': colorItem = { fontColor: colorStyle.status_error_color, bgColor: colorStyle.status_bg_error_color }; break
					case 'processing': colorItem = { fontColor: colorStyle.status_progressing_color, bgColor: colorStyle.status_bg_progressing_color }; break
					case 'custom': colorItem = { fontColor: labelItem[0].customColor, bgColor: 'white' }; break
					default: colorItem = { fontColor: colorStyle.status_normal_color, bgColor: colorStyle.status_bg_normal_color }; break
				}
				return colorItem
			}

			function getBalloon (value, list) {
				let labelItem = list.filter(item => { return item.value === value })
				return labelItem.length > 0 && labelItem[0].balloonNode ? labelItem[0].balloonNode : null
			}
		}

		// 标题渲染逻辑，取值为自定义行的[0]
		const titleCustom = (item) => {
			return titleBalloonDataIndex || titleBalloonText ? (
				<Balloon
					closable={false}
					type="normal"
					trigger={item[clos[0].dataIndex]}
					align={titleBalloonAlign}
					triggerType={titleBalloonTriggerType}
					onVisibleChange={titleBalloonChange}
				>
					{titleBalloonDataIndex
						? item[titleBalloonDataIndex]
						: titleBalloonText}
				</Balloon>
			) : (
					<Ellipsis
						className='card_title'
						// alignCenter
						line={1}
						text={item[clos[0].dataIndex]}
					/>
				)
		}
		// 行选中渲染逻辑
		const rowSelectionCustom = (item, index) => {
			return rowSelection ? (
				<Checkbox
					onClick={(e) => { e.stopPropagation() }}
					className="list_card_title_checkbox"
					value={primaryKey ? item[primaryKey] : index}
				/>
			) : null
		}

		const relation = {
			mysql: 'postgresql-plain-wordmarkbeifen2',
			postgresql: 'postgresql-plain-wordmark',
			KingbaseV8: 'kingbase'
		}
		// 图片渲染逻辑
		const pictureCustom = (item) => {
			return pictureIndex ? (
				<div style={!rowSelection ? { marginLeft: 8 } : null} className='list_card_item_pic_box' span="8">
					<IconFont
						type={'icon' + relation[item.type]}
						size="xxxl"
						className="list_card_img "
					/>
				</div>
			) : null


		}
		// 中间内容渲染逻辑，取值为自定义行的[1]
		const contentCustom = (item) => {
			return (
				<Ellipsis
					className='card_title'
					// className='card_content'
					// alignCenter
					line={2}
					text={
						item[clos[1].dataIndex] == '' || item[clos[1].dataIndex] == null
							? '暂无内容'
							: item[clos[1].dataIndex]
					}
				/>
			)
		}

		return dataSource.length > 0 ? (
			<Loading tip="加载中..." fullScreen visible={loading}>
				<Checkbox.Group onChange={rowSelection} value={selectedRowKeys}>
					{dataSource.map((item, index) => {
						return (
							<Loading visible={loadingUuids && loadingUuids.indexOf(item[primaryKey]) !== -1} style={{ width: '100%' }} key={index}>
								<div className="list_card_item"
									onClick={(e) => {
										e.stopPropagation()
										this.clickCardHandle(item)
									}}
								>
									<div className="list_card_item_left">
										{rowSelectionCustom(item, index)}
										{pictureCustom(item)}
										<div style={setContentMarginStyle()} className="list_card_item_contentbox">
											<div className="list_card_title">
												<div className="tagBox">
													{tagAlign === 'left' ? tagCustom(item) : null}
													{simpleTagAlign === 'left' ? simpleTagHandle(item[simpleTag]) : null}
												</div>
												{titleCustom(item)}
												<div className="tagBox">
													{tagAlign === 'left' ? null : tagCustom(item)}
													{simpleTagAlign === 'left' ? null : simpleTagHandle(item[simpleTag], true)}
												</div>
											</div>

											<div className="list_card_content">
												{contentReactNode ? contentReactNode(item) : contentCustom(item)}
											</div>

											<div className="list_card_content_group">
												{bottomClos ? (
													<div className="content_date_group">
														{bottomClos.map((colItems, index) => {
															if (item[colItems.dataIndex] !== undefined && item[colItems.dataIndex] !== null) {
																let displayText = colItems.timeFormat && moment(item[colItems.dataIndex]).format(colItems.timeFormat) !== 'Invalid date' ? moment(item[colItems.dataIndex]).format(colItems.timeFormat) : item[colItems.dataIndex]

																return (
																	<Ellipsis
																		className="content_date" key={`${item.title}-${index}`}
																		line={1}
																		text={(<span>{colItems.title}：<font color={colItems.highlight ? colorStyle.text_highlight_color : ''}>{displayText}</font></span>)}
																	/>
																)
															}
															else {
																return null
															}
														})}
													</div>
												) : (
														<div className="content_date">
															{clos[2].title}：
															{moment(item[clos[2].dataIndex]).format(
																'YYYY-MM-DD HH:mm:ss'
															)}
														</div>
													)}
											</div>
										</div>
									</div>
									<div
										className="list_card_operation"
										style={
											starDataIndex && starOnclick
												? null
												: { justifyContent: 'center' }
										}
									>
										{starDataIndex && starOnclick ? (
											<div className="operation_icon">
												<IconFont
													type="iconstar"
													size="medium"
													className={
														item[starDataIndex] ? 'choose_start' : 'default_star'
													}
													onClick={() => {
														starOnclick(item[primaryKey], item)
													}}
												/>
											</div>
										) : null}
										<div className="list_card_operation_item">
											{operation(item)}
										</div>
									</div>
								</div>
							</Loading>
						)
					})}

				</Checkbox.Group>
			</Loading>
		) : (
				<div className="nodata_page">
					<IconFont type="iconnodata" className="nodata_img" />
				</div>
			)
	}
}
export default ListCard
ListCard.defaultProps = {
	tagAlign: 'left',
	simpleTagAlign: 'right',
	dataSource: [],
	loading: false,
	simpleTagList: [],
	loadingUuids: [],
}
ListCard.propTypes = {
	dataSource: PropTypes.array, //数据源
	clos: PropTypes.array, //展示字段，类似于table的标题，用于字段匹配
	operation: PropTypes.func, //操作区
	pictureIndex: PropTypes.string, //图片参数字段,需要使用就传，不需要就不传
	primaryKey: PropTypes.string, //每一行的唯一标识，不传默认为index
	rowSelection: PropTypes.func, //卡片选中事件
	selectedRowKeys: PropTypes.array, //多选选中的value数组
	loading: PropTypes.bool, //loading状态
	starDataIndex: PropTypes.string, //星标，传入字段，和starOnclick配合使用且必传
	starOnclick: PropTypes.func, //星标点击事件，默认传递primaryKey，item ，与starDataIndex配合使用且必传
	tags: PropTypes.array, // 自定义标签，其中dataIndex必传
	titleBalloonTriggerType: PropTypes.string, //标题气泡提示触发行为
	titleBalloonAlign: PropTypes.string, //标题气泡弹出层位置,'t'(上),'r'(右),'b'(下),'l'(左)
	titleBalloonDataIndex: PropTypes.string, //标题气泡提示，传入字段
	titleBalloonText: PropTypes.string, //自定义标题气泡提示内容,与titleBalloonChange结合使用且必传
	titleBalloonChange: PropTypes.func, //气泡提示打开关闭事件，与titleBalloonText结合使用且必传
	contentReactNode: PropTypes.func,
	loadingUuids: PropTypes.array,
}
