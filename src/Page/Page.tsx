import { nanoid } from "nanoid";
import { useAppState } from "../state/AppStateContext";
import { CoverImage } from "./CoverImage";
import { PageSpacer } from "./PageSpacer";
import { PageTitle } from "./PageTitle";
import { useFocusedNodeIndex } from "./useFocusedNodeIndex";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { NodeContainer } from "../Node/NodeContainer";

export const Page = () => {
  const isRootPage = window.location.pathname === "/";
  const {
    nodes,
    addNode,
    reorderNodes,
    setNodes,
    title,
    cover,
    setTitle,
    setCoverImage,
  } = useAppState();
  const [focusedNodeIndex, setFocusedNodeIndex] = useFocusedNodeIndex(nodes);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(active, over);
    if (over?.id && active.id !== over?.id) {
      reorderNodes(active.id, over.id);
    }
  };

  return (
    <>
      <CoverImage filePath={cover} changePageCover={setCoverImage} />
      {!isRootPage && <a href="/">Back to main page</a>}
      <button onClick={() => setNodes(nodes.slice().reverse())}>Reorder</button>
      <PageTitle title={title} changePageTitle={setTitle} />
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext strategy={verticalListSortingStrategy} items={nodes}>
          {nodes.map((node, index) => (
            <NodeContainer
              key={node.id}
              node={node}
              isFocused={focusedNodeIndex === index}
              index={index}
            />
          ))}
        </SortableContext>
      </DndContext>
      <PageSpacer
        handleClick={() => {
          addNode({ type: "text", value: "", id: nanoid() }, nodes.length);
          setFocusedNodeIndex(nodes.length);
        }}
        showHint={!nodes.length}
      />
    </>
  );
};
