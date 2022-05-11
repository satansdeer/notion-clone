import { useEffect, useState } from "react";
import { useOverflowsScreenBottom } from "../useOverflowsScreenBottom";
import { SupportedNodeType } from "./BasicNode";

const supportedNodeTypes: SupportedNodeType[] = [
  { value: "text", name: "Text" },
  { value: "image", name: "Image" },
  { value: "list", name: "List" },
  { value: "page", name: "Page" },
  { value: "heading1", name: "Heading 1" },
  { value: "heading2", name: "Heading 2" },
  { value: "heading3", name: "Heading 3" },
];

type CommandPanelProps = {
  nodeText: string;
  selectItem: (nodeType: string) => void;
};

export const CommandPanel = ({
  selectItem,
  nodeText,
}: CommandPanelProps) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { overflows, ref } = useOverflowsScreenBottom();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        selectItem(supportedNodeTypes[selectedItemIndex].value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItemIndex , selectItem]);

  useEffect(() => {
    const normalizedValue = nodeText.toLowerCase().replace(/\//g, "");
    setSelectedItemIndex(
      supportedNodeTypes.findIndex((item) => item.value.match(normalizedValue))
    );
  }, [nodeText]);

  return (
    <div ref={ref} className={`command-panel ${overflows ? "reverse" : ""}`}>
      <div className="command-panel-title">Blocks</div>
      <ul>
        {supportedNodeTypes.map((type, index) => {
          const selected = selectedItemIndex === index;
          return (
            <li
              className={selected ? "selected" : ""}
              key={type.value}
              onClick={() => selectItem(type.value)}
            >
              {type.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
