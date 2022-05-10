import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { useAppState } from "./AppStateContext";
import { CoverImage } from "./CoverImage";
import { NodeContainer } from "./Node/NodeContainer";
import { PageSpacer } from "./PageSpacer";
import { PageTitle } from "./PageTitle";

export const Page = () => {
  const {
    title,
    nodes,
    coverImage,
    loading,
    updateNodes,
    changePageTitle,
    changePageCover,
  } = useAppState();

  const [focusedNodeIndex, setFocusedNodeIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: any) => {
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

  // const onAddNode = (node: any, index: number) => {
  //   addNode(node, index);
  //   setFocusedNodeIndex(index);
  // };

  // const onRemoveNode = (node: any) => {
  //   removeNode(node);
  //   setFocusedNodeIndex((index) => index - 1);
  // };

  // const onChangeNodeType = async (node: any, type: string) => {
  //   changeNodeType(node, type);
  // };

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <CoverImage filePath={coverImage} changePageCover={changePageCover} />
      <PageTitle title={title} changePageTitle={changePageTitle} />
      <div className="page-body">
        <ReactSortable
          animation={200}
          delay={100}
          list={nodes}
          setList={updateNodes}
          ghostClass="node-container-ghost"
          dragClass="node-container-drag"
        >
          {nodes.map((node: any, index: number) => {
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
          updateFocusedIndex={setFocusedNodeIndex}
          showHint={!nodes.length}
        />
      </div>
    </>
  );
};
