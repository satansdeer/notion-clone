import { NodeData } from "../state/AppStateContext";
import { NodeTypeSwitcher } from "./NodeTypeSwitcher";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type NodeContainerProps = {
  node: NodeData;
  index: number;
  isFocused: boolean;
};

export const NodeContainer = ({
  node,
  index,
  isFocused,
}: NodeContainerProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="node-container"
    >
      <div {...listeners} className="node-drag-handle">
        ⠿
      </div>
      <NodeTypeSwitcher node={node} index={index} isFocused={isFocused} />
    </div>
  );
};
