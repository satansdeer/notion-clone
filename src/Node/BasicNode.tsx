import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { useAppState } from "../AppStateContext";

export const BasicNode = ({
  node,
  updateFocusedIndex,
  isFocused,
  index,
}: any) => {
  const nodeRef = useRef<any>(null);

  const { changeNodeValue, changeNodeType, removeNodeByIndex, addNode } =
    useAppState();

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
      addNode({ type: "text", value: "", id: nanoid() }, index + 1);
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
  );
};
