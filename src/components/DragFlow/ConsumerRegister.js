import React from 'react'
import { Consumer } from './ContextType'

const ConsumerRegister = (Component, ItemNode) => {
  return (props) => {
    return (
      <Consumer>
        {
          (vlaue) => (
            <Component
              {...props}
              {...vlaue}
              DropItemNode={ItemNode}
            />
          )
        }
      </Consumer>
    )
  }
}

export default ConsumerRegister
