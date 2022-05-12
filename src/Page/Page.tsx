import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useAppState } from "../state/AppStateContext";
import { CoverImage } from "./CoverImage";
import { NodeContainer } from "../Node/NodeContainer";
import { PageSpacer } from "./PageSpacer";
import { PageTitle } from "./PageTitle";
import { List, arrayMove } from "react-movable";

export const Page = () => {
  const { nodes, addNode, setNodes, title, cover, setTitle, setCoverImage } =
    useAppState();

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

  return (
    <>
      <CoverImage filePath={cover} changePageCover={setCoverImage} />
			<a href="/">Back to main page</a>
      <PageTitle title={title} changePageTitle={setTitle} />
      <div className="page-body">
        <List
          values={nodes}
          onChange={({ oldIndex, newIndex }) =>
            setNodes(arrayMove(nodes, oldIndex, newIndex))
          }
          renderList={({ children, props }) => <div {...props}>{children}</div>}
          renderItem={({ value, props, index }) => (
            <div {...props}>
              <NodeContainer
                key={value.id}
                isFocused={index === focusedNodeIndex}
                updateFocusedIndex={setFocusedNodeIndex}
                node={value}
                index={index || 0}
              />
            </div>
          )}
        />
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
