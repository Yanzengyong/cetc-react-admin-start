import React from 'react'
import { Button, Search, Pagination, Checkbox } from '@alifd/next'
import './index.scss'
import PropTypes from 'prop-types'
import colorStyle from '@/themeStyle/themeStyle.scss'

export default class PageHead extends React.Component {

	static propTypes = {
		selectedNum: PropTypes.number,
		handleSearch: PropTypes.func,
		createHandle: PropTypes.func,
		deleteAllHandle: PropTypes.func,
		rightNode: PropTypes.node,
		leftNode: PropTypes.node,
		size: PropTypes.string,
		type: PropTypes.string,
		shape: PropTypes.string,
		current: PropTypes.number,
		defaultCurrent: PropTypes.number,
		onChange: PropTypes.func,
		total: PropTypes.number,
		totalRender: PropTypes.func,
		pageShowCount: PropTypes.number,
		pageSize: PropTypes.number,
		pageSizeSelector: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
		pageSizeList: PropTypes.array,
		pageNumberRender: PropTypes.func,
		pageSizePosition: PropTypes.string,
		useFloatLayout: PropTypes.bool,
		onPageSizeChange: PropTypes.func,
		hideOnlyOnePage: PropTypes.bool,
		showJump: PropTypes.bool,
		link: PropTypes.string,
		popupProps: PropTypes.object,
		searchOnChange: PropTypes.func,
		searchRequest: PropTypes.func,
		leftBtnText: PropTypes.string, // 左边按钮的文字
		rightBtnText: PropTypes.string, // 右边按钮的文字
		hasCheckbox: PropTypes.bool, // 是否有复选框
		unitName: PropTypes.string, // 选中信息框中的单位设置
		placeholder: PropTypes.string, // 搜索框的placeholder
		createBtnRight: PropTypes.bool, // 新建按钮的用户权限
		deleteBtnRight: PropTypes.bool, // 删除按钮的用户权限
	}
	static defaultProps = {
		multipleSelect: true, // 是否提供多选
		selectedNum: 0, // 已经选择了x个行
		handleSearch: () => { }, // 右标题部分的搜索
		createHandle: () => { }, // 创建的按钮
		deleteAllHandle: () => { }, // 删除的按钮
		rightNode: null, // 右边自定义的node
		leftNode: null, // 左边自定义的node
		size: 'medium', // 分页组件大小
		type: 'normal', // 分页组件类型
		shape: 'arrow-only', // 前进后退按钮样式 'normal', 'arrow-only', 'arrow-prev-only', 'no-border'
		current: null, // （受控）当前页码
		defaultCurrent: 1, // （非受控）初始页码
		searchOnChange: () => { },
		searchRequest: null, // 查询搜索发送请求事件
		onChange: () => { }, // 页码发生改变时的回调函数
		total: 100, // 总记录数
		totalRender: null, // 总数的渲染函数
		pageShowCount: 5, // 页码显示的数量，更多的使用...代替
		pageSize: 10, // 一页中的记录数
		pageSizeSelector: false, // 每页显示选择器类型
		pageSizeList: [5, 10, 20], // 每页显示选择器可选值
		pageNumberRender: index => index, // 自定义页码渲染函数，函数作用于页码button以及当前页/总页数的数字渲染
		pageSizePosition: 'start', // 每页显示选择器在组件中的位置
		useFloatLayout: false, // 存在每页显示选择器时是否使用浮动布局
		onPageSizeChange: () => { }, // 每页显示记录数量改变时的回调函数
		hideOnlyOnePage: false, // 当分页数为1时，是否隐藏分页器
		showJump: true, // type 设置为 normal 时，在页码数超过5页后，会显示跳转输入框与按钮，当设置 showJump 为 false 时，不再显示该跳转区域
		link: null, // 设置页码按钮的跳转链接，它的值为一个包含 {page} 的模版字符串
		popupProps: null, // 弹层组件属性，透传给Popup
		leftBtnText: null, // 左边按钮的文字
		rightBtnText: null, // 右边按钮的文字
		hasCheckbox: false, // 复选框
		unitName: '条', // 选中信息框中的单位设置
		placeholder: '',
		createBtnRight: true,
		deleteBtnRight: true,
	}

	// 节流
	deBounceHandle = (fn, intervalTime) => {
		let timer
		return (args) => {
			clearTimeout(timer)
			timer = setTimeout(() => {
				fn.call(this, args)
			}, intervalTime)
		}
	}

	// 抛出的搜索结果函数
	searchRequest = (val) => {
		this.props.searchRequest(val)
	}

	deBounceRequest = this.deBounceHandle(this.searchRequest, 500)


	// 输入框onchange事件
	onChange = (val) => {
		const { searchRequest, searchOnChange } = this.props

		if (searchRequest) {
			this.deBounceRequest(val)
		}
		searchOnChange(val)
	}

	// check change事件
	checkboxOnChange = (checked) => {
		this.props.checkboxOnChange(checked)
	}
	render () {
		const {
			multipleSelect,
			selectedNum,
			handleSearch,
			createHandle,
			deleteAllHandle,
			rightNode,
			leftNode,
			size,
			type,
			shape,
			current,
			defaultCurrent,
			onChange,
			total,
			totalRender,
			pageShowCount,
			pageSize,
			pageSizeSelector,
			pageSizeList,
			pageNumberRender,
			pageSizePosition,
			useFloatLayout,
			onPageSizeChange,
			hideOnlyOnePage,
			showJump,
			link,
			popupProps,
			leftBtnText,
			rightBtnText,
			hasCheckbox,
			checkboxValue,
			unitName,
			placeholder,
			createBtnRight,
			deleteBtnRight
		} = this.props
		return (
			<div className="listContainer">
				<div className="listContainer_utilbox">
					{
						leftNode ? leftNode : (
							<div className="listContainer_utilbox_left">
								<Search
									style={{ width: 288 }}
									type="secondary"
									size="large"
									hasIcon={false}
									placeholder={placeholder}
									searchText={<span style={{ fontSize: 14 }}>搜索</span>}
									onSearch={handleSearch}
									onChange={this.onChange}
								/>
							</div>
						)
					}
					{rightNode ? <div className="listContainer_utilbox_right">{rightNode}</div> : (
						<div className="listContainer_utilbox_right">
							{createBtnRight ? (
								<Button
									style={{ marginRight: '16px' }}
									size="large"
									type="primary"
									onClick={createHandle}
								>{leftBtnText ? leftBtnText : '+ 新增'}</Button>
							) : null}
							{deleteBtnRight ? (
								<Button
									size="large"
									type="primary"
									warning
									onClick={deleteAllHandle}
									style={{ marginRight: '16px', backgroundColor: colorStyle.btn_delete_color }}
								>{rightBtnText ? rightBtnText : '批量删除'}</Button>
							): null}
						</div>
					)}
				</div>
				{!multipleSelect ? (
					<div className='check_message_box'>
						<span className='check_message_text'>
							<b>请选择需要操作的对象</b>
						</span>
					</div>
				) : (
					<div className='check_message_box'>
						{
							hasCheckbox ? (
								<Checkbox onChange={this.checkboxOnChange} checked={checkboxValue} className='listContainer_utilbox_checkbox' />
							) : null
						}
						<span className='check_message_text'>
							<b>已经选中</b>
							<i>{selectedNum}</i>
							<b>{ unitName ? unitName : '条' }</b>
						</span>
					</div>
				)}
				<div className="listContainer_table_box">
					<div className="listContainer_table">
						{this.props.children}
					</div>
					<Pagination
						className='listContainer_Pagination'
						size={size}
						type={type}
						shape={shape}
						current={current}
						defaultCurrent={defaultCurrent}
						onChange={onChange}
						total={total}
						totalRender={totalRender}
						pageShowCount={pageShowCount}
						pageSize={pageSize}
						pageSizeSelector={pageSizeSelector}
						pageSizeList={pageSizeList}
						pageNumberRender={pageNumberRender}
						pageSizePosition={pageSizePosition}
						useFloatLayout={useFloatLayout}
						onPageSizeChange={onPageSizeChange}
						hideOnlyOnePage={hideOnlyOnePage}
						showJump={showJump}
						link={link}
						popupProps={popupProps}
					/>
				</div>
			</div>
		)
	}
}
