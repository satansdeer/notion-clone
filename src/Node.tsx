import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "./AppStateContext";
import { CommandPanel } from "./CommandPanel";

export const Node = ({
  node,
  onClick,
  isFocused,
  onAddNode,
  onRemoveNode,
  onChangeNodeType,
  onChangeNodeValue,
  index,
}: any) => {
  const nodeRef = useRef<any>(null);
  const [text, setText] = useState("");
  const { pages } = useAppState();
  const navigate = useNavigate();
  const showCommandPanel = text.match(/^\//);

  useEffect(() => {
    if (isFocused) {
      nodeRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.textContent = node.value;
    }
  }, [node?.value]);

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
          onAddNode({ type: node.type, value: "", id: nanoid() }, index + 1);
        } else {
          onChangeNodeType(node, "paragraph");
        }
      }
    }
    if (event.key === "Backspace" && event.target.textContent === "") {
      event.preventDefault();
      onRemoveNode(node);
    }
  };

  const navigateToPage = () => {
    navigate(`/${node.id}`);
  };

  const handleInput = ({ currentTarget }: any) => {
    const { textContent } = currentTarget;
    setText(textContent);
    onChangeNodeValue(node, textContent);
  };

  return (
    <div className="node-container">
      <div className="node-drag-handle">⠿</div>
      {showCommandPanel && (
        <CommandPanel
          selectItem={() => {
            parseCommand(text);
            setText("");
          }}
        />
      )}
      {node?.type === "page" ? (
        <div onClick={navigateToPage} className={`node ${node.type}`}>
          📄 {pages[node.id].title}
        </div>
      ) : (
        <div
          data-placeholder="Type '/' for commands"
          ref={nodeRef}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onInput={handleInput}
          contentEditable={true}
          suppressContentEditableWarning
          className={`node ${node.type}`}
        />
      )}
    </div>
  );
};
