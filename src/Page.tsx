import { nanoid } from "nanoid";
import { useRef } from "react";
import { Navigate } from "react-router-dom";
import { useMatch, useNavigate } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import { useAppState } from "./AppStateContext";
import { Node } from "./Node";

export const Page = () => {
  const match = useMatch("/:id");
  const history = useNavigate();
  const {
    pages,
    nodes,
    addPage,
    setPageNodes,
    addNode,
    removeNode,
    changeNodeType,
    changeNodeValue,
    changePageTitle,
  } = useAppState();
  const page = match?.params?.id ? pages[match?.params?.id] : null;

  const nodeIdToFocusRef = useRef<any>(null);
  const nodesRef = useRef<any>({});

  const onRef = (nodeId: any) => (el: any) => {
    nodesRef.current[nodeId] = el;
    if (nodeId === nodeIdToFocusRef.current) {
      el?.focus();
      nodeIdToFocusRef.current = null;
    }
  };

  const onAddNode = (node: any, index: number) => {
    nodeIdToFocusRef.current = node.id;
    addNode(node, page.id, index);
    if (node.type === "page") {
      const page = addPage(node.id);
      history(`/${page.id}`);
    }
  };

  const onRemoveNode = (node: any) => {
    const index = nodes.indexOf(node);
    removeNode(node, page.id);
    const nodeToFocus = nodes[index - 1];
    nodesRef.current[nodeToFocus?.id]?.focus();
  };

  const onChangeNodeType = (node: any, type: string) => {
    changeNodeType(node, type, page.id);
    if (type === "page") {
      const page = addPage(node.id);
      history(`/${page.id}`);
    }
  };

  const onChangeNodeValue = (node: any, value: string) => {
    changeNodeValue(node, value);
  };

  const handleNavigation = (node: any, direction: string) => {
    if (direction === "up") {
      const index = nodes.indexOf(node);
      console.log(index);
      if (index > 0) {
        console.log(nodes[index - 1]);
        console.log(nodesRef.current[nodes[index - 1].id]);
        nodesRef.current[nodes[index - 1].id]?.focus();
      }
    }
    if (direction === "down") {
      const index = nodes.indexOf(node);
      if (index < nodes.length - 1) {
        nodesRef.current[nodes[index + 1].id]?.focus();
      }
    }
  };

  return (
    <>
      <img className="header-image" src={page.header} alt="Header" />
      <div className="title-container">
        <h1
          className="title"
          ref={(el) => {
            if (el) {
              el.textContent = page.title;
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddNode({ type: "paragraph", id: nanoid() }, 0);
            }
          }}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => changePageTitle(page, e.currentTarget.textContent)}
        />
      </div>
      <div className="page-body">
        <ReactSortable
          animation={200}
          list={page.nodes}
          setList={setPageNodes(page.id)}
					ghostClass="node-container-ghost"
					dragClass="node-container-drag"
        >
          {page.nodes.map((nodeId: any, index: number) => {
            const node = nodes[nodeId];
            return (
              <Node
                key={nodeId}
                node={node}
                index={index}
                onAddNode={onAddNode}
                handleNavigation={handleNavigation}
                onChangeNodeType={onChangeNodeType}
                onChangeNodeValue={onChangeNodeValue}
                onRemoveNode={onRemoveNode}
                refFunc={onRef(nodeId)}
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
