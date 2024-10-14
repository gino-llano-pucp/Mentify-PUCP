import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  
  return (
    <div 
    ref={setNodeRef} 
      className={"w-full py-4 flex flex-col gap-4 p-4 border rounded-xl min-h-[30vh] " + props.color}>
      {props.children}
    </div>
  );
}