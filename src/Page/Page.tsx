import { nanoid } from "nanoid";
import { useAppState } from "../state/AppStateContext";
import { Cover } from "./Cover";
import { Spacer } from "./Spacer";
import { Title } from "./Title";
import { useFocusedNodeIndex } from "./useFocusedNodeIndex";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { NodeContainer } from "../Node/NodeContainer";
import { Link } from "react-router-dom";
import styles from "./Page.module.css";

export const Page = () => {
  const isRootPage = window.location.pathname === "/";
  const {
    nodes,
    addNode,
    reorderNodes,
    title,
    cover,
    setTitle,
    setCoverImage,
  } = useAppState();
  const [focusedNodeIndex, setFocusedNodeIndex] = useFocusedNodeIndex(nodes);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id && active.id !== over?.id) {
      reorderNodes(active.id, over.id);
    }
  };

  return (
    <>
      <Cover filePath={cover} changePageCover={setCoverImage} />
      <div className={styles.body}>
        {!isRootPage && (
          <div className={styles.backLink}>
            <Link to="/">Back to the main page</Link>
          </div>
        )}
        <Title title={title} changePageTitle={setTitle} />
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext strategy={verticalListSortingStrategy} items={nodes}>
            {nodes.map((node, index) => (
              <NodeContainer
                key={node.id}
                node={node}
                isFocused={focusedNodeIndex === index}
                updateFocusedIndex={setFocusedNodeIndex}
                index={index}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            <div style={{ visibility: "hidden" }}>-</div>
          </DragOverlay>
        </DndContext>
        <Spacer
          handleClick={() => {
            addNode({ type: "text", value: "", id: nanoid() }, nodes.length);
            setFocusedNodeIndex(nodes.length);
          }}
          showHint={!nodes.length}
        />
      </div>
    </>
  );
};
