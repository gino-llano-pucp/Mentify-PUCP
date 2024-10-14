import React from 'react'

const ToolbarHeader = ({children}) => {
  return (
    <header className='flex flex-row items-end justify-between w-full'>
        {children}
    </header>
  )
}

export default ToolbarHeader