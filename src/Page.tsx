import { useRef } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useAppState } from "./AppStateContext";
import { Node } from "./Node";

export const Page = () => {
  const match = useMatch("/:id");
  const history = useNavigate();
  const {
    pages,
    addPage,
    addNode,
    removeNode,
    changeNodeType,
    changeNodeValue,
  } = useAppState();
  const page = pages.find((page: any) => page.id === match?.params.id);
  const nodes = page.nodes;
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
      const page = addPage();
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
      const page = addPage();
      history(`/${page.id}`);
    }
  };

  const onChangeNodeValue = (node: any, value: string) => {
    changeNodeValue(node, value, page.id);
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
    <div>
      <img className="header-image" src={page.header} alt="Header" />
      <div className="title-container">
        <h1 contentEditable suppressContentEditableWarning>
          {page.title}
        </h1>
      </div>
      <div className="page-body">
        {nodes.map((node: any, index: number) => {
          return (
            <Node
              key={node.id}
              node={node}
              index={index}
              onAddNode={onAddNode}
              handleNavigation={handleNavigation}
              onChangeNodeType={onChangeNodeType}
              onChangeNodeValue={onChangeNodeValue}
              onRemoveNode={onRemoveNode}
              refFunc={onRef(node.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
