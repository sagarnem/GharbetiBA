"use client";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

type MenuItem = {
  id: string;
  label: string;
  children?: MenuItem[];
};

const initialData: MenuItem[] = [
  {
    id: "1",
    label: "Trekking in Nepal",
  },
  {
    id: "2",
    label: "Annapurna Region",
    children: [
      { id: "2-1", label: "Short Annapurna Base Camp Trek" },
      { id: "2-2", label: "Mardi Himal Trek" },
      { id: "2-3", label: "Annapurna Circuit with Tilicho Lake Trek" },
    ],
  },
];

function SortableMenuItem({ item }: { item: MenuItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
  };

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: item.id,
  });

  return (
    <div ref={setDroppableRef}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {item.label}
      </div>
      {item.children && (
        <div className="ml-6 mt-2">
          <SortableContext
            items={item.children.map((child) => child.id)}
            strategy={verticalListSortingStrategy}
          >
            {item.children.map((child) => (
              <SortableMenuItem key={child.id} item={child} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

export default function MenuBuilder() {
  const [menu, setMenu] = useState<MenuItem[]>(initialData);

  const findItemById = (
    items: MenuItem[],
    id: string
  ): { item?: MenuItem; parent?: MenuItem; index?: number } => {
    for (const [i, item] of items.entries()) {
      if (item.id === id) return { item, index: i };
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found.item) return { ...found, parent: item };
      }
    }
    return {};
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setMenu((prev) => {
      const cloned = structuredClone(prev);
      const from = findItemById(cloned, String(active.id));
      const to = findItemById(cloned, String(over.id));

      if (!from.item || from.index === undefined) return prev;

      // Remove the item from its original location
      if (from.parent) {
        from.parent.children?.splice(from.index, 1);
      } else {
        cloned.splice(from.index, 1);
      }

      // Add item to destination
      if (to.item) {
        to.item.children = to.item.children || [];
        to.item.children.push(from.item);
      }

      return cloned;
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Nested Menu Builder</h2>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={menu.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {menu.map((item) => (
            <SortableMenuItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
