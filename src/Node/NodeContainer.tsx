import { NodeTypeSwitcher } from "./NodeTypeSwitcher";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { NodeData } from "../utils/types";
import styles from "./NodeContainer.module.css";

type NodeContainerProps = {
  node: NodeData;
  index: number;
  isFocused: boolean;
	updateFocusedIndex(index: number): void;
};

export const NodeContainer = ({
  node,
  index,
  isFocused,
	updateFocusedIndex,
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
      className={styles.container}
    >
      <div {...listeners} className={styles.dragHandle}>
        ⠿
      </div>
      <NodeTypeSwitcher updateFocusedIndex={updateFocusedIndex} node={node} index={index} isFocused={isFocused} />
    </div>
  );
};
