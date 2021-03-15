import React from 'react'
import './index.scss'

class LoadingComponent extends React.Component {
	render () {
  	return (
  		<div className='loading2'>
				<div className="circle circle1"></div>
				<div className="circle circle2"></div>
				<div className="circle circle3"></div>
  		</div>
  	)
	}
}

export default LoadingComponent
