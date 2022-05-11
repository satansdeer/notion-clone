import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { useAppState, useNodesContext } from "../state/AppStateContext";
import { CoverImage } from "./CoverImage";
import { NodeContainer } from "../Node/NodeContainer";
import { PageSpacer } from "./PageSpacer";
import { PageTitle } from "./PageTitle";

export const Page = () => {
  const { title, coverImage, loading, setTitle, setCoverImage } = useAppState();
  const { nodes, addNode, setNodes } = useNodesContext();

  const [focusedNodeIndex, setFocusedNodeIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "ArrowDown") {
        setFocusedNodeIndex((index) => Math.min(index + 1, nodes.length - 1));
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [nodes]);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <CoverImage filePath={coverImage} changePageCover={setCoverImage} />
      <PageTitle title={title} changePageTitle={setTitle} />
      <div className="page-body">
        <ReactSortable
          animation={200}
          delay={100}
          list={nodes}
          setList={setNodes}
          ghostClass="node-container-ghost"
          dragClass="node-container-drag"
        >
          {nodes.map((node, index) => {
            return (
              <NodeContainer
                key={node.id}
                isFocused={index === focusedNodeIndex}
                updateFocusedIndex={setFocusedNodeIndex}
                node={node}
                index={index}
              />
            );
          })}
        </ReactSortable>
        <PageSpacer
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
