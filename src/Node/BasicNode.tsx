import { KeyboardEvent, FormEvent } from "react";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import {
  NodeData,
  NodeType,
  useNodesContext,
} from "../state/AppStateContext";
import { CommandPanel } from "./CommandPanel";

export type SupportedNodeType = {
  value: NodeType;
  name: string;
};

interface BasicNodeProps {
  node: NodeData;
  updateFocusedIndex(index: number): void;
  isFocused: boolean;
  index: number;
  supportedTypes: NodeType[];
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
    useNodesContext();

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

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (event.key === "Enter") {
      event.preventDefault();
      if (target.textContent?.[0] === "/") {
        return;
      }
      if (node.type !== "text" && target?.textContent?.length === 0) {
        changeNodeType(node, "text");
        return;
      }
      addNode({ type: node.type, value: "", id: nanoid() }, index + 1);
      updateFocusedIndex(index + 1);
    }
    if (event.key === "Backspace") {
      if (target.textContent?.length === 0) {
        event.preventDefault();
        removeNodeByIndex(index);
        updateFocusedIndex(index - 1);
      } else if (window?.getSelection()?.anchorOffset === 0) {
        event.preventDefault();
        removeNodeByIndex(index - 1);
        updateFocusedIndex(index - 1);
      }
    }
  };

  const handleInput = ({ currentTarget }: FormEvent<HTMLDivElement>) => {
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
