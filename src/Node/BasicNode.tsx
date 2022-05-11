import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { NodeData, NodeType, useAppState } from "../AppStateContext";
import { CommandPanel } from "./CommandPanel";

export type SupportedNodeType = {
  value: NodeType;
  name: string;
};

const supportedNodeTypes: SupportedNodeType[] = [
  { value: "text", name: "Text" },
  { value: "image", name: "Image" },
  { value: "list", name: "List" },
  { value: "page", name: "Page" },
  { value: "heading1", name: "Heading 1" },
  { value: "heading2", name: "Heading 2" },
  { value: "heading3", name: "Heading 3" },
];

interface BasicNodeProps {
	node: NodeData;
	updateFocusedIndex(index: number): void
	isFocused: boolean
	index: number
	supportedTypes: NodeType[]
}

export const BasicNode = ({
  node,
  updateFocusedIndex,
  isFocused,
  index,
}: BasicNodeProps) => {
  const nodeRef = useRef<any>(null);
  const showCommandPanel = isFocused && node?.value?.match(/^\//);

  const { changeNodeValue, changeNodeType, removeNodeByIndex, addNode } =
    useAppState();

  const parseCommand = (nodeType: string) => {
    changeNodeValue(node, "");
    changeNodeType(node, nodeType);
  };

  useEffect(() => {
    if (isFocused) {
      nodeRef.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.textContent = node.value;
    }
  }, [node?.value]);

  const onKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.textContent[0] === "/") {
        return;
      }
      if (node.type !== "text" && event.target.textContent.length === 0) {
        changeNodeType(node, "text");
        return;
      }
      addNode({ type: node.type, value: "", id: nanoid() }, index + 1);
      updateFocusedIndex(index + 1);
    }
    if (event.key === "Backspace") {
      if (event.target.textContent.length === 0) {
        event.preventDefault();
        removeNodeByIndex(index);
        updateFocusedIndex(index - 1);
      } else if (window?.getSelection()?.anchorOffset === 0) {
        console.log("----");
        event.preventDefault();
        removeNodeByIndex(index - 1);
        updateFocusedIndex(index - 1);
      }
    }
  };

  const handleInput = ({ currentTarget }: any) => {
    const { textContent } = currentTarget;
    changeNodeValue(node, textContent);
  };

  const handleClick = () => {
    updateFocusedIndex(index);
  };

  return (
    <>
      {showCommandPanel && (
        <CommandPanel
          selectItem={parseCommand}
          nodeText={node.value}
          supportedNodeTypes={supportedNodeTypes}
        />
      )}
      <div
        data-placeholder="Type '/' for commands"
        ref={nodeRef}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        onInput={handleInput}
        contentEditable
        suppressContentEditableWarning
        className={`node ${node.type}`}
      />
    </>
  );
};
