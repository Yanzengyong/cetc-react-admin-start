/*
 * @Author: ShenLing
 * @Date: 2020-09-18 11:07:58
 * @LastEditors: Shenling
 * @LastEditTime: 2020-11-16 09:50:08
 */
import React from 'react'
import { Card, Menu } from '@alifd/next'
import { ItemPanel, Item as ItemNew } from 'gg-editor'
import './index.scss'
import colorStyle from '@/themeStyle/themeStyle.scss'

const { SubMenu } = Menu
class FlowItemPanel extends React.Component {
  state = {
  	currentMenu: null,
  	currentDeepMeny: null
  };
	clickTitle = (e) => {
		console.log(e)
	};
	openOrClose = (index) => {
		if (index === this.state.currentMenu) {
			this.setState({
				currentMenu: null
			})
		} else {
			this.setState({
				currentMenu: index
			})
		}
	};
  openOrCloseDeep = (index) => {
  	if (index === this.state.currentDeepMeny) {
  		this.setState({
  			currentDeepMeny: null
  		})
  	} else {
  		this.setState({
  			currentDeepMeny: index
  		})
  	}
  };
  componentDidMount () {
  }
  renderTree = (data) => {
  	const { currentBlockList } = this.props
  	return data.map((item) => {
  		if (item.children && item.children.length > 0 && item.level !== 2) {
  			// level为2的时候表示为任务（任务可以被拖拽）
  			return (
  				<SubMenu key={item.uuid} label={item.jobName}>
  					{this.renderTree(item.children)}
  				</SubMenu>
  			)
  		} else {
  			return (
  				<SubMenu key={item.uuid} label={item.jobName}>
  					{
  						item.job.map((ite) => {
  							return (
  								currentBlockList.includes(ite.jobName) ? (
  									null
  								) : (
  									<Card className='task_card'>
  										<ItemNew
  											className='ddddd'
  											style={{ height: '100%' }}
  											type="node"
  											size="128*48"
  											model={{
  												projectUuid: ite.projectUuid,
  												id: ite.uuid,
  												color: colorStyle.general_primary_color,
  												label: ite.jobName
  											}}
  										>{ite.jobName}</ItemNew>
  									</Card>
  								)
  							)
  						})
  					}
  				</SubMenu>
  			)
  		}
  	})
  }
  render () {
  	const { treeList } = this.props
  	return (
  		<ItemPanel className='itemPanel'>
  			<Menu className='itemPanel_menuBox' openMode="single">
  				{this.renderTree(treeList)}
  			</Menu>
  		</ItemPanel>
  	)
  }
}

export default FlowItemPanel
