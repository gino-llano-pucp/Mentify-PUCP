import React from 'react'

const ErrorTableAttribute = ({title, body}) => {
  return (
    <div className="flex flex-row gap-4 w-full">
        <span className="text-gray-600 text-sm w-24">{title}</span>
        <span className='text-sm w-full'>{body}</span>
    </div>
  )
}

export default ErrorTableAttribute