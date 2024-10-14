import React from 'react'

function ItemList({items, renderItem}) {
  return (
    <div className='flex flex-wrap w-full gap-4'>
        {items.map((item, index) => (
            <React.Fragment key={index}>
                {renderItem(item)}
            </React.Fragment>
        ))}
    </div>
  )
}

export default ItemList