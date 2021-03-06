/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-10-29 16:15:56
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-12-21 18:00:09
 */
import React from 'react'
import { ulid } from 'ulid'
import { DragSource } from 'react-dnd'
import ConsumerRegister from './ConsumerRegister'
import { getEmptyImage } from 'react-dnd-html5-backend'

const DragGroup = ({ children, title, className, titleClassName }) => {
  return (
		<div className={className}>
			{title ? (<h3 className={titleClassName}>{title}</h3>) : null}
      <ul className='drag_sidebar_item'>
        {
          children
        }
      </ul>
    </div>
  )
}


const DragItemFn = (name) => {
  return DragSource(name, {
		beginDrag (props, monitor, component) { // 当拖动开始时的回调
			console.log(props)
      const { uuid, outMax, inMax } = props.info
      const dropId = `${uuid}_${ulid()}`
      // return的内容会被放置到 monitor.getItem() 获取到的对象中
      return {
        ...props,
				dropId,
				outMax,
				inMax
      }
    },
    endDrag (props, monitor, component) { // 当拖动停止时的回调
      console.log('我是拖拽开始以后到拖拽结束的')
      // 拖拽元素放下时，drop 结果
      // 注意：该钩子函数是整个动作最后执行的，monitor.getDropResult()拿到的是在droptarget中drop钩子返回的对象
      const dropResult = monitor.getDropResult()
      // console.log(dropResult)
      if (dropResult) { // 如果存在dropResult，说明执行了drop函数
        // 在这里应该像droptarget中创建结果div
        props.addItemToDropBox(dropResult)
      }
    }
  }, (connect, monitor) => {
		console.log('connect======', connect)
    return {
      // 包裹住 DOM 节点，使其可以进行拖拽操作
			connectDragSource: connect.dragSource(),
			connectDragPreview: connect.dragPreview(),
      // 是否处于拖拽状态
			isDragging: monitor.isDragging(),
    }

  })
}


const DragItem = (props) => {
  const {
    dragItemNode: DragItemNode,
    type
  } = props
  const ConsumerDragItem = ConsumerRegister(DragItemFn(type)(
		class extends React.Component {

			componentDidMount () {
				const { connectDragPreview } = this.props
				// const img = new Image()
				// img.src = '/assets/images/close.png'
				// img.onload = () => connectDragPreview(img)
				connectDragPreview(getEmptyImage())
			}
      render () {
        const { connectDragSource, isDragging } = this.props

        return connectDragSource && connectDragSource(
          <div style={{ opacity: isDragging ? 0.8 : 1, position: 'relative', zIndex: 3 }}>
            <DragItemNode {...this.props} />
          </div>
        )
      }
		}

  ))
  return <ConsumerDragItem {...props} />
}

export {
  DragGroup,
  DragItem
}
