import { nanoid } from "nanoid";
import { useState, useRef } from "react";

const initialState = [
  {
    type: "paragraph",
    value: "Test paragraph",
    id: nanoid()
  },
  {
    type: "ul",
    value: "Test list",
    id: nanoid(),
  },
  {
    type: "h1",
    value: "Test heading",
    id: nanoid(),
  },
];

const Node = ({
  node,
  refFunc,
  onAddNode,
  onRemoveNode,
  onChangeNodeType,
  handleNavigation,
  index,
}: any) => {
  const parseCommand = (text: string) => {
    switch (text) {
      case "/text": {
        onChangeNodeType(node, "paragraph");
        break;
      }
      case "/list": {
        onChangeNodeType(node, "ul");
        break;
      }
      case "/heading1": {
        onChangeNodeType(node, "h1");
        break;
      }
      default: {
        break;
      }
    }
  };

  const onKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.textContent[0] === "/") {
        parseCommand(event.target.textContent);
        event.target.textContent = "";
      } else {
        const id = Date.now();
        onAddNode({ type: node.type, value: "", id }, index);
      }
    }
    if (event.key === "Backspace" && event.target.textContent === "") {
      event.preventDefault();
      onRemoveNode(node);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      handleNavigation(node, "up");
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      handleNavigation(node, "down");
    }
  };

  const handleFocus = ({ target }: any) => {
    const range = document.createRange();
    range.selectNodeContents(target);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  switch (node.type) {
    case "paragraph": {
      return (
        <div
          data-placeholder="Type '/' for commands"
          ref={refFunc}
          onFocus={handleFocus}
          onKeyDown={onKeyDown}
          contentEditable="true"
          suppressContentEditableWarning
          className="node"
        >
          {node.value}
        </div>
      );
    }
    case "ul": {
      return (
        <div
          data-placeholder="Type '/' for commands"
          ref={refFunc}
          onFocus={handleFocus}
          onKeyDown={onKeyDown}
          contentEditable="true"
          suppressContentEditableWarning
          className="node list"
        >
          {node.value}
        </div>
      );
    }
    case "h1": {
      return (
        <div
          data-placeholder="Type '/' for commands"
          ref={refFunc}
          onFocus={handleFocus}
          onKeyDown={onKeyDown}
          contentEditable="true"
          suppressContentEditableWarning
          className="node h1"
        >
          {node.value}
        </div>
      );
    }
    default: {
      return <>test</>;
    }
  }
};

function App() {
  const [nodes, setNodes] = useState(initialState);
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
    setNodes((oldNodes: any) => [
      ...oldNodes.slice(0, index + 1),
      node,
      ...oldNodes.slice(index + 1),
    ]);
  };

  const onRemoveNode = (node: any) => {
    const index = nodes.indexOf(node);
    setNodes((oldNodes: any) => [
      ...oldNodes.slice(0, index),
      ...oldNodes.slice(index + 1),
    ]);
    const nodeToFocus = nodes[index - 1];
    nodesRef.current[nodeToFocus?.id]?.focus();
  };

  const onChangeNodeType = (node: any, type: string) => {
    setNodes((oldNodes: any) => [
      ...oldNodes.slice(0, nodes.indexOf(node)),
      { ...node, type },
      ...oldNodes.slice(nodes.indexOf(node) + 1),
    ]);
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
      {nodes.map((node, index) => {
        return (
          <Node
            key={node.id}
            node={node}
            index={index}
            onAddNode={onAddNode}
            handleNavigation={handleNavigation}
            onChangeNodeType={onChangeNodeType}
            onRemoveNode={onRemoveNode}
            refFunc={onRef(node.id)}
          />
        );
      })}
    </div>
  );
}

export default App;
