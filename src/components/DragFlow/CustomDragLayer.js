/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-12-21 15:15:46
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2020-12-21 17:59:17
 */
import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'

function getItemStyles (props) {
  const { initialOffset, currentOffset } = props
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    }
  }
  let { x, y } = currentOffset
	const Container = document.querySelector('.taskDev_container')
	const leftStart = Container.getBoundingClientRect().left
	const topStart = Container.getBoundingClientRect().top
	const position = {
		x: ((currentOffset.x) - 0) / 1,
		y: ((currentOffset.y) - 0) / 1
	}
	// console.log(initialOffset.x, initialOffset.y, 'currentOffset', currentOffset.x, currentOffset.y)


	// console.log(x, y)
  // const transform = `translate(${position.x}px, ${position.y}px)`
  // const transform = `translate(${position.x + 256}px, ${position.y + 156}px)`
  return {
    // transform,
		// WebkitTransform: transform,
		left: `${currentOffset.x - 265-56}px`,
		top: `${currentOffset.y - 156}px`,
		position: 'absolute',
		zIndex: '2',
		background: 'red',
  }
}

class CustomDragLayer extends Component {
  render () {
		const isDragging = this.props.isDragging
		console.log('this.props===========', this.props)
    if (!isDragging) {
      return null
    }

    // You can specify acceptable type:
    if (this.props.itemType !== 'A') {
      return null
    }

    // The component will work only when dragging
    return (
			<div style={getItemStyles(this.props)}>
				{this.props.children}
			</div>
    )
  }
}

function collect (monitor, x) {
	console.log(x)
	console.log('monitor=========', monitor)
	console.log('getDropResult=========', monitor.getDropResult())
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

export default DragLayer(collect)(CustomDragLayer) // eslint-disable-line new-cap
