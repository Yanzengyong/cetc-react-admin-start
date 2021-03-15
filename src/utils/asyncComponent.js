import React from 'react'
import warning from 'rc-util/lib/warning'

export default loadComponent => (
	class AsyncComponent extends React.Component {

    state = {
    	Component: null
    }

    async componentDidMount () {
    	try {
    		const response = await loadComponent()
    		if (response) {
    			this.setState({
    				Component: response.default ? response.default : response
    			})
    		}
    	} catch (error) {
    		warning(false, 'Cannot load component in <AsyncComponent />')
    		throw error
    	}
    }

    componentWillUnmount () {

    	this.setState = () => {
    		return
    	}

    }


    render () {
    	const { Component } = this.state
    	return (Component) ? <Component {...this.props} /> : null
    }
	}
)
