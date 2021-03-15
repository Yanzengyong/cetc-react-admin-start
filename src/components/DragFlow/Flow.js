import React from 'react'
import { Provider } from './ContextType'
import './index.scss'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { jsPlumb } from 'jsplumb'
import panzoom from 'panzoom'
import DeleteNotice from '@/components/DeleteNotice'
import { Message } from '@alifd/next'
import { setSessionStorageItem, getSessionStorageItem } from '@/utils/common'
class NodeList extends React.Component {
  static displayName = 'NodeList'

  render () {
    const {
      backgroundstyle,
      ...restProps
    } = this.props
    return (
      <div style={{ position: 'relative' }} {...restProps} >
        <div
          style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: backgroundstyle,
            position: 'absolute',
            zIndex: -1
          }}
        />
        {this.props.children}
      </div>
    )
  }
}

class DropBox extends React.Component {
  static displayName = 'DropBox'
  render () {
    return (
      <div {...this.props} >
        {this.props.children}
      </div>
    )
  }
}


class FlowContainerClass extends React.Component {

  state = {
    lastDropNode: {},
    currentStatusDropItem: {},
    connectionList: [],
		nodeList: [],
		prveTaskRelation: {},
		taskRelation: {}
  }

  // 移动结束
  moveEnd = true

  // 断开连接为执行的连接数组
	connectionDetachedUnexecutedList = []

	static getDerivedStateFromProps (props, state) {
		const {
			taskRelation: taskRelation_props
		} = props

		const {
			taskRelation: taskRelation_state
		} = state

		if (JSON.stringify(taskRelation_props) !== JSON.stringify(taskRelation_state)) {
			console.log(taskRelation_props.nodeList)

			return {
				connectionList: taskRelation_props.connectionList ?? [],
				nodeList: taskRelation_props.nodeList ?? [],
			}
		} else {
			return null
		}
	}

	componentDidMount () {
    this.JsPlumbInitHandle()
    this.hoverOverlayHandle()
	}

	componentDidUpdate (preProps, preState) {
		const {
			connectionList,
		} = this.state

		if (JSON.stringify(connectionList) !== JSON.stringify(preState.connectionList)) {
			const { config } = this.props
			const CustomInfo = config.ConnectionOverlays.find((item) => item[0] === 'Custom')
			const CustomId = CustomInfo ? CustomInfo[1].id : ''

			const newConnectionList = connectionList.filter((item) => {
				const isHave = preState.connectionList.some((it) => item.sourceId === it.sourceId && item.targetId === it.targetId)

				return !isHave
			})

			const finalConnectionList = newConnectionList.filter((item) => {
				const isHave = this.JsPlumbInstance.getAllConnections().some((it) => {
					return item.sourceId === it.sourceId && item.targetId === it.targetId
				})
				return !isHave
			})
			console.log('渲染当前不存在的连接', finalConnectionList)
			console.log('this.JsPlumbInstance.getAllConnections()', this.JsPlumbInstance.getAllConnections())
			// 渲染当前不存在的连接
			finalConnectionList.forEach((item) => {
				console.log(item)
				const connection = this.JsPlumbInstance.connect({
					source: item.sourceId,
					target: item.targetId,
					anchors: item.anchor,
				})
				console.log('connection===========', connection)
				const overlay = connection.getOverlay(CustomId)
				console.log('overlay====', overlay)
				if (overlay) {
					overlay.hide()
				}
			})

		}
	}

  // hover效果功能
  hoverOverlayHandle = () => {
		this.JsPlumbInstance.bind('mouseover', (conn) => {
      const overlay = conn.getOverlay('custom-delete')
      if (overlay) {
        overlay.show()
      }

    })

    this.JsPlumbInstance.bind('mouseout', (conn) => {
      const overlay = conn.getOverlay('custom-delete')
      if (overlay) {
        overlay.hide()
      }

    })
  }

	// 初始化缩放和整体移动
	initMoveAndZoom = () => {
		const {
			maxScale,
			minScale
		} = this.props

		const DropContainer = this.JsPlumbInstance.getContainer()
		const mainContainerWrap = DropContainer.parentNode
		const pan = panzoom(DropContainer, {
			smoothScroll: false,
			bounds: true,
			boundsPadding: 0.5,
			minZoom: minScale ? minScale : 0.125,
			maxZoom: maxScale ? maxScale : 5,
		})

		// 赋值pan和mainContainerWrap
		this.JsPlumbInstance.mainContainerWrap = mainContainerWrap
		this.JsPlumbInstance.pan = pan

		// 缩放时设置jsPlumb的缩放比率
		pan.on('zoom', (e) => {
			const { scale } = e.getTransform()

			this.JsPlumbInstance.setZoom(scale)
		})

		// 平移时设置鼠标样式
		mainContainerWrap.style.cursor = 'grab'
		mainContainerWrap.addEventListener('mousedown', function wrapMousedown () {
			this.style.cursor = 'grabbing'
			mainContainerWrap.addEventListener('mouseout', function wrapMouseout () {
				this.style.cursor = 'grab'
			})
		})
		mainContainerWrap.addEventListener('mouseup', function wrapMouseup () {
			this.style.cursor = 'grab'
		})
	}

  // 初始化jsplumb
	JsPlumbInitHandle = () => {
		const {
			moveAndZoom
		} = this.props
    // 初始化一个实例
		this.JsPlumbInstance = jsPlumb.getInstance(this.props.config)

		// 这里设置的最大连接数 指的是单个锚点的最大连接数 不是组件的最大连接数
		this.JsPlumbInstance.importDefaults({
      MaxConnections: -1
		})
		console.log(this.JsPlumbInstance)
		jsPlumb.Connectors.StateMachine({ margin: 1, curviness: 10, proximityLimit: 150 })
    // 设置拖拽容器
		this.JsPlumbInstance.setContainer('dropBox-box')

		if (moveAndZoom) {
			this.initMoveAndZoom()
		}

    // 监听链接事件
		this.JsPlumbInstance.bind('connection', (conn) => {

			const { connectionList, nodeList } = this.state
			const connectionId = conn.connection.id
			const sourcePosition_x = conn.source.offsetLeft
			const sourcePosition_y = conn.source.offsetTop
			const targetPosition_x = conn.target.offsetLeft
			const targetPosition_y = conn.target.offsetTop
			// 这个时候需要添加判断是否要进行删除
			// 以此次conn连接的sourceId来判断 在当前的连接数组中加入此次的连接 查找sourceId为dropId的节点 看其节点的最大输出数为多少 若在整个连接数组中当前这个sourceId的数量大于最大输出数时候 删除当前的连接
			// 注意！！！this.JsPlumbInstance.getAllConnections()获取到的就是已经存在的所有连接（包括当前监听事件触发的连接）

			const FinalConnectionList = this.JsPlumbInstance.getAllConnections()
			const currentSourceId = conn.sourceId
			const currentTargetId = conn.targetId
			const currentSourceNode = nodeList.find((item) => item.dropId === currentSourceId)
			const currentTargetNode = nodeList.find((item) => item.dropId === currentTargetId)


			// // 当前起始节点的最大对外连接数
			const currentSourceNode_outMax = currentSourceNode.dragInfo.outMax
			// 以当前起始节点的id为起始连接的连接数组
			const currentSourceNode_sourceConnections = FinalConnectionList.filter((item) => item.sourceId === currentSourceId)
			// 以当前起始节点的id为起始连接的连接数
			const currentSourceNode_sourceConnections_length = currentSourceNode_sourceConnections.length
			// 判断【以当前起始节点的id为起始连接的连接数】是否大于【当前起始节点的最大对外连接数】，若大于则删除这次的连接
			if (currentSourceNode_sourceConnections_length > currentSourceNode_outMax) {
				Message.notice(`【${currentSourceNode.dragInfo.title}】的最大向外连接数为：${currentSourceNode_outMax}`)
				this.JsPlumbInstance.deleteConnection(conn.connection)
			}

			// 当前结束节点的最大接入数
			const currentTargetNode_inMax = currentTargetNode.dragInfo.inMax
			// 以当前结束节点的id为结束连接的连接数组
			const currentTargetNode_targetConnections = FinalConnectionList.filter((item) => item.targetId === currentTargetId)
			// 以当前结束节点的id为结束连接的连接数
			const currentTargetNode_targetConnections_length = currentTargetNode_targetConnections.length
			// 判断【】是否大于【】，若大于则删除这次的连接
			if (currentTargetNode_targetConnections_length > currentTargetNode_inMax) {
				Message.notice(`【${currentTargetNode.dragInfo.title}】的最大接受连接数为：${currentTargetNode_inMax}`)
				this.JsPlumbInstance.deleteConnection(conn.connection)
			}

			if (!this.moveEnd) {
				return
			}
			/**
			 * 需要判断连接是否存在、是否连接的是自己
			 * 如果存在连接就删除重复
			 * 如果连接是自己则删除这次连接
			 */
			const sourceId = conn.sourceId
			const targetId = conn.targetId
			if (sourceId === targetId) {
				this.JsPlumbInstance.deleteConnection(conn.connection)
				return
			}

			let repeatNum = 0
			let justArr = []
			this.JsPlumbInstance.getAllConnections().forEach((item) => {
				const isHave = justArr.some((it) => it.sourceId === item.sourceId && it.targetId === item.targetId)
				if (isHave) {
					repeatNum++
				} else {
					justArr.push(item)
				}
			})

			console.log('repeatNum', repeatNum)
			console.log('justArr', justArr)

			if (repeatNum > 0) {
				// 在状态更新前的connectionList中存在此次的连接
				this.JsPlumbInstance.deleteConnection(conn.connection)
				return
			}

			const {
				onNodeChange
			} = this.props
			if (repeatNum < 1) {

				const newConnectionList = [...connectionList, {
					sourceId: conn.sourceId,
					targetId: conn.targetId,
					sourcePosition: {
						x: sourcePosition_x,
						y: sourcePosition_y
					},
					targetPosition: {
						x: targetPosition_x,
						y: targetPosition_y
					},
					connectionId: connectionId,
					anchor: [
						conn.sourceEndpoint.anchor.type,
						conn.targetEndpoint.anchor.type,
					]
				}]

				let uniqueArr = []
				newConnectionList.forEach((item) => {
					const isHave = uniqueArr.some((it) => it.sourceId === item.sourceId && it.targetId === item.targetId)
					if (!isHave) {
						uniqueArr.push(item)
					}
				})
				console.log('新的连接', uniqueArr)
				onNodeChange(nodeList, uniqueArr)
			}

    })

    // 监听链接断开事件
		this.JsPlumbInstance.bind('connectionDetached', (conn) => {

			// 断开连接的对象起点和终点，在现有的连接当中也有相同终点和起点的，说明是在连接时候产生了相同的连接，被自动清除时触发的断开事件，该情况下不进行状态list的修改
			const repeatConntion = this.JsPlumbInstance.getAllConnections().some((item) => {
				return item.sourceId === conn.sourceId && item.targetId === item.targetId
			})
      // 将监听到的连接加入待办列表（这么做是为了解决同时发生n个连接断开的情况）
      this.connectionDetachedUnexecutedList.push(conn)

      const { nodeList, connectionList } = this.state

			const afterDeleteConnectionList = connectionList.filter((item) => {

        const needUnmount = this.connectionDetachedUnexecutedList.some((it) => it.sourceId === item.sourceId && it.targetId === item.targetId)
        return !needUnmount
			})

			const {
				onNodeChange
			} = this.props

			if (repeatConntion) return
			onNodeChange(nodeList, afterDeleteConnectionList)

    })

    // 监听移动事件
    this.JsPlumbInstance.bind('connectionMoved', (conn) => {

      const { nodeList, connectionList } = this.state
      const connectionId = conn.connection.id
      const afterDeleteConnectionList = connectionList.filter((item) => item.connectionId !== connectionId)
			this.moveEnd = false

			const {
				onNodeChange
			} = this.props

			onNodeChange(nodeList, afterDeleteConnectionList, () => {
        this.moveEnd = true
			})

    })

		// 刷新时、没有初始数据传入时，需要此方法来使用原来本地的数据渲染
		// this.setNodeAndRenderConnectionList()

	}

	// 设置nodelist、主动渲染连接关系
	setNodeAndRenderConnectionList = () => {

    // 判断是否存在数据，如果已经存在数据就渲染已经存在的数据
		console.log('我是使用本地数据进行渲染的')
		const localNodeList = getSessionStorageItem(this.props.storageNodeListName) ?? []

		const flowConnectionList = getSessionStorageItem(this.props.storageConnectionListName) ?? []

		console.log('localNodeList=====', localNodeList)
		console.log('flowConnectionList=====', flowConnectionList)

		if (localNodeList.length > 0) {

      this.setState({
        nodeList: localNodeList
      }, () => {
        if (flowConnectionList.length > 0) {

          const { config } = this.props
          const CustomInfo = config.ConnectionOverlays.find((item) => item[0] === 'Custom')
          const CustomId = CustomInfo ? CustomInfo[1].id : ''

          flowConnectionList.forEach((item) => {
            const connection = this.JsPlumbInstance.connect({
              source: item.sourceId,
              target: item.targetId,
              anchors: item.anchor,
            })
						console.log('本地渲染connection==========', connection)
            const overlay = connection.getOverlay(CustomId)
            if (overlay) {
              overlay.hide()
            }

          })

        }
			})

		}

	}

  addItemToDropBox = (node) => {
		this.setState((prevState) => {
			const {
				onNodeChange
			} = this.props
			onNodeChange([...prevState.nodeList, node], prevState.connectionList)
      return {
        lastDropNode: node
      }
		})
  }

  // 处理状态
  reviseStatusHandle = (statusDropId, status) => {

    const {
      nodeList,
      connectionList
    } = this.state

    // 当前需要修改状态的dropItem
    const currentStatusDropItem = nodeList.find((item) => item.dropId === statusDropId)

    // 查找该dropId的目标dropId，即当前dropNode的tragetId
    const currentConnection = connectionList.filter((item) => item.sourceId === statusDropId)
		console.log(connectionList, statusDropId, currentConnection)

		const {
			onNodeChange
		} = this.props
		onNodeChange(nodeList.map((item) => {
			if (item.dropId === statusDropId) {
				return {
					...item,
					status
				}
			} else {
				return item
			}
		}), connectionList)

    // 重新设置nodelist和修改了状态的dropItem
    this.setState({
      currentStatusDropItem: {
        ...currentStatusDropItem,
        status
      }
    })
    return currentConnection
  }


  deleteDropItemHandle = (dropId, dragInfo) => {

    const { nodeList, connectionList } = this.state
		const afterDeleteNodeList = nodeList.filter((item) => item.dropId !== dropId)
		const {
			onNodeChange
		} = this.props
		const afterDeleteConnectionList = connectionList.filter((item) => item.sourceId !== dropId && item.targetId !== dropId)

		onNodeChange(afterDeleteNodeList, afterDeleteConnectionList, () => {
			this.JsPlumbInstance.remove(dropId)
		})

	}

  onDeleteHandle = (conn) => {
    DeleteNotice.show({
      message: '点击【确认】将删除该连线',
      onCancel: () => {
        DeleteNotice.close()
      },
			onConfirm: () => {
				this.JsPlumbInstance.deleteConnection(conn)
        DeleteNotice.close()
      }
    })
	}

  deleteConnectHandle = (overlay) => {
    let hasOverlay = !!overlay
    if (hasOverlay) {
      this.JsPlumbInstance.bind('click', (conn, originalEvent) => {

        if (!hasOverlay) {
          return
        }
				this.onDeleteHandle(conn)
        // if (window.prompt('确定删除所点击的连接吗？ 输入1确定') === '1') {
        //   this.JsPlumbInstance.deleteConnection(conn)
        // }

        hasOverlay = false
      })
    }
  }

  // 节点在容器中的change事件
  onNodeDragChange = (record) => {

    const { nodeList, connectionList } = this.state
    const setPositionNodeList = nodeList.map((item) => {
      if (item.dropId === record.dropId) {
        return {
          ...item,
          position: {
            x: record.finalPos[0],
            y: record.finalPos[1]
          }
        }
      } else {
        return item
      }
    })
		const {
			onNodeChange
		} = this.props
		onNodeChange(setPositionNodeList, connectionList)
  }

  // 会话存储nodelist
  saveStateNodeList = () => {
    // 进行存储
    setSessionStorageItem(this.props.storageNodeListName, this.state.nodeList)

  }

  // 会话存储connectionlist
  saveStateConnectionList = () => {
    setSessionStorageItem(this.props.storageConnectionListName, this.state.connectionList)
	}

	// 获取缩放比列
	getScaleInfo = () => {
		if (this.JsPlumbInstance.pan) {
			return this.JsPlumbInstance.pan.getTransform()
		}
		return {
			scale: 1,
			x: 0,
			y: 0
		}
	}

	// 清空所有节点和所有关系
	resetNode = async () => {
		const {
			nodeList
		} = this.state
		this.JsPlumbInstance.getAllConnections().forEach((item) => {
			this.JsPlumbInstance.deleteConnection(item)
		})

		for (let i = 0; i < nodeList.length; i++) {
			await this.deleteDropItemHandle(nodeList[i].dropId)
		}

	}

  render () {

    const {
      lastDropNode,
      currentStatusDropItem,
      nodeList
    } = this.state

		const {
			className
		} = this.props

    return (
      <Provider value={{
        nodeList: nodeList,
        lastDropNode: lastDropNode,
        currentStatusDropItem: currentStatusDropItem,
        addItemToDropBox: this.addItemToDropBox,
        deleteDropItemHandle: this.deleteDropItemHandle,
				onNodeDragChange: this.onNodeDragChange,
				getScaleInfo: this.getScaleInfo
      }}>
				<div className={className ?? 'drag_container'}>
          {
            React.Children.map(this.props.children, (item) => {

              if (item.type.displayName === 'NodeList') {
                // 拖拽组件列表
                return (
                  React.cloneElement(item, {
                    className: item.props.className ?? 'drag_sidebar'
                  })
                )
              } else {
                return (
                  React.cloneElement(item, {
                    className: item.props.className ?? 'drag_box',
										id: 'drag_box',
                  }, React.Children.map(item.props.children, (child) => {
                    return React.cloneElement(child, {
                      jsplumbinstance: this.JsPlumbInstance
                    })
                  }))
                )
              }
            })
          }
        </div>
      </Provider>
    )
  }
}

const FlowContainer = DragDropContext(HTML5Backend)(FlowContainerClass)

export {
  FlowContainer,
  NodeList,
	DropBox,
	jsPlumb
}
