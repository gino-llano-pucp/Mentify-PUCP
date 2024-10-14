import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Tooltip } from '@nextui-org/react';

export function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border rounded-xl bg-white p-2 w-60 h-full overflow-hidden"
    >
      <Tooltip content={props.children} placement="top">
        <span className="break-words hyphens-auto">{props.children}</span>
      </Tooltip>
    </div>
  );
}
