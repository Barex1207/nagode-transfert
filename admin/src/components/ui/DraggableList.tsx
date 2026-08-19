import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

interface DraggableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function DraggableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  className,
  itemClassName,
}: DraggableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [localItems, setLocalItems] = useState(items);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  function handleDragOver(e: React.DragEvent, overIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === overIndex) return;
    const next = [...localItems];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(overIndex, 0, moved);
    setLocalItems(next);
    setDragIndex(overIndex);
  }

  function handleDrop() {
    if (dragIndex !== null) {
      onReorder(localItems);
    }
    setDragIndex(null);
  }

  return (
    <div className={className}>
      {localItems.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={handleDrop}
          onDragEnd={() => setDragIndex(null)}
          className={`group/drag relative ${itemClassName ?? ''} ${dragIndex === index ? 'opacity-50' : ''}`}
        >
          <div className="absolute left-2 top-2 z-10 cursor-grab text-gray-300 opacity-0 transition-opacity group-hover/drag:opacity-100 active:cursor-grabbing">
            <GripVertical size={16} />
          </div>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
