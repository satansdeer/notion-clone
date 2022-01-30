import { nanoid } from "nanoid";
import { useEffect } from "react";

export const Node = ({
  node,
  refFunc,
  onAddNode,
  onRemoveNode,
  onChangeNodeType,
  onChangeNodeValue,
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
      case "/page": {
        onChangeNodeType(node, "page");
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
        if (node.type === "paragraph" || event.target.textContent.length > 0) {
          onAddNode({ type: node.type, value: "", id: nanoid() }, index);
        } else {
          onChangeNodeType(node, "paragraph");
        }
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

  return (
    <div className="node-container">
      <div
        data-placeholder="Type '/' for commands"
        ref={(el) => {
          if (el) {
            el.textContent = node.value;
          }
          refFunc(el);
        }}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        onInput={(e) => onChangeNodeValue(node, e.currentTarget.textContent)}
        contentEditable="true"
        suppressContentEditableWarning
        className={`node ${node.type}`}
      />
    </div>
  );
};
