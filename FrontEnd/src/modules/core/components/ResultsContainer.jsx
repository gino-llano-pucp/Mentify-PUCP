import React from 'react'
import LoadingResults from './LoadingResults'
import ItemList from './ItemList'

const ResultsContainer = ({ estado, loading, displayedObjects = [], renderItem, noResultsText, ListRenderer = ItemList}) => {
  console.log("displayedObjects: ", displayedObjects);
  
  return (
    <>
        {loading ? (
            <LoadingResults/>
        ) : displayedObjects.length > 0 ? (
            <ListRenderer estado={estado} items={displayedObjects} renderItem={renderItem} />
        ) : (
            <div>{noResultsText}</div>
        )}
    </>
  )
}

export default ResultsContainer