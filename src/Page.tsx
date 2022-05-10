import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { useAppState } from "./AppStateContext";
import { CoverImage } from "./CoverImage";
import { Node } from "./Node";
import { PageSpacer } from "./PageSpacer";
import { PageTitle } from "./PageTitle";

export const Page = () => {
  const {
    title,
    nodes,
    coverImage,
    loading,
    createPage,
    updateNodes,
    addNode,
    removeNode,
    changeNodeType,
    changeNodeValue,
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

  const onAddNode = (node: any, index: number) => {
    addNode(node, index);
    setFocusedNodeIndex(index);
  };

  const onRemoveNode = (node: any) => {
    removeNode(node);
    setFocusedNodeIndex((index) => index - 1);
  };

  const onChangeNodeType = async (node: any, type: string) => {
    changeNodeType(node, type);
    if (type === "page") {
      const { slug } = await createPage();
      changeNodeValue(node, slug);
    }
  };

  const onChangeNodeValue = (node: any, value: string) => {
    changeNodeValue(node, value);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <CoverImage filePath={coverImage} changePageCover={changePageCover} />
      <div className="title-container">
        <PageTitle
          title={title}
          onAddNode={onAddNode}
          changePageTitle={changePageTitle}
        />
      </div>
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
              <Node
                key={node.id}
                isFocused={index === focusedNodeIndex}
                onClick={() => setFocusedNodeIndex(index)}
                node={node}
                index={index}
                onAddNode={onAddNode}
                onChangeNodeType={onChangeNodeType}
                onChangeNodeValue={onChangeNodeValue}
                onRemoveNode={onRemoveNode}
              />
            );
          })}
        </ReactSortable>
        <PageSpacer
          onClick={() => {
            onAddNode({ type: "text", id: nanoid() }, nodes.length);
          }}
          showHint={!nodes.length}
        />
      </div>
    </>
  );
};
