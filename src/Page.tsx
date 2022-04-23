import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import { useAppState } from "./AppStateContext";
import { Node } from "./Node";
import { PageTitle } from "./PageTitle";

export const Page = () => {
  const match = useMatch("/:id");
  const history = useNavigate();
  const {
    pages,
    addPage,
    setPageNodes,
    addNode,
    removeNode,
    changeNodeType,
    changeNodeValue,
    changePageTitle,
  } = useAppState();
  const page = match?.params?.id ? pages[match?.params?.id] : null;
  const [focusedNodeIndex, setFocusedNodeIndex] = useState(0);

  console.log(focusedNodeIndex);

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (event.key === "ArrowUp") {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "ArrowDown") {
        setFocusedNodeIndex((index) =>
          Math.min(index + 1, page?.nodes.length - 1)
        );
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [page]);

  const onAddNode = (node: any, index: number) => {
    addNode(node, page.id, index);
    if (node.type === "page") {
      const page = addPage(node.id);
      history(`/${page.id}`);
    }
    setFocusedNodeIndex(index);
  };

  const onRemoveNode = (node: any) => {
    removeNode(node, page.id);
    setFocusedNodeIndex((index) => index - 1);
  };

  const onChangeNodeType = (node: any, type: string) => {
    changeNodeType(node, type, page.id);
    if (type === "page") {
      const page = addPage(node.id);
      history(`/${page.id}`);
    }
  };

  const onChangeNodeValue = (node: any, value: string) => {
    changeNodeValue(node, value, page.id);
  };

  return (
    <>
      <img className="header-image" src={page.header} alt="Header" />
      <div className="title-container">
        <PageTitle
          page={page}
          onAddNode={onAddNode}
          changePageTitle={changePageTitle}
        />
      </div>
      <div className="page-body">
        <ReactSortable
          animation={200}
          delay={100}
          list={page.nodes}
          setList={setPageNodes(page.id)}
          ghostClass="node-container-ghost"
          dragClass="node-container-drag"
        >
          {page.nodes.map((node: any, index: number) => {
            return (
              <Node
                key={node.id}
                isFocused={index === focusedNodeIndex}
                onClick={() => setFocusedNodeIndex(index)}
                node={node}
                pageId={page.id}
                index={index}
                onAddNode={onAddNode}
                onChangeNodeType={onChangeNodeType}
                onChangeNodeValue={onChangeNodeValue}
                onRemoveNode={onRemoveNode}
              />
            );
          })}
        </ReactSortable>
        <div
          className="page-spacer"
          onClick={() =>
            onAddNode({ type: "paragraph", id: nanoid() }, page.nodes.length)
          }
        >
          {!page.nodes.length && "Click to create the first paragraph."}
        </div>
      </div>
    </>
  );
};
