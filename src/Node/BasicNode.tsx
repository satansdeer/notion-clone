import { KeyboardEvent, FormEvent } from "react";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { useAppState } from "../state/AppStateContext";
import { CommandPanel } from "./CommandPanel";
import { NodeData, NodeType } from "../utils/types";
import nodeStyles from "./Node.module.css";
import cx from "classnames";

export type SupportedNodeType = {
  value: NodeType;
  name: string;
};

interface BasicNodeProps {
  node: NodeData;
  updateFocusedIndex(index: number): void;
  isFocused: boolean;
  index: number;
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

  const parseCommand = (nodeType: NodeType) => {
    changeNodeType(index, nodeType);
  };

  useEffect(() => {
    if (isFocused) {
      nodeRef.current?.focus();
    } else {
      nodeRef.current?.blur();
    }
  }, [isFocused]);

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.textContent = node.value;
    }
  }, []);

  useEffect(() => {
    if (nodeRef.current && !isFocused) {
      nodeRef.current.textContent = node.value;
    }
  }, [node?.value, isFocused]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (event.key === "Enter") {
      event.preventDefault();
      if (target.textContent?.[0] === "/") {
        return;
      }
      if (node.type !== "text" && target?.textContent?.length === 0) {
        changeNodeType(index, "text");
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
    changeNodeValue(index, textContent || "");
  };

  const handleClick = () => {
    updateFocusedIndex(index);
  };

  return (
    <>
      {showCommandPanel && (
        <CommandPanel selectItem={parseCommand} nodeText={node.value} />
      )}
      <div
        data-placeholder="Type '/' for commands"
        ref={nodeRef}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        onInput={handleInput}
        contentEditable
        suppressContentEditableWarning
        className={cx(nodeStyles.node, nodeStyles[node.type])}
      />
    </>
  );
};
