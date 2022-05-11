import { useEffect, useState } from "react";
import { useOverflowsScreenBottom } from "../useOverflowsScreenBottom";
import { SupportedNodeType } from "./BasicNode";

type CommandPanelProps = {
  nodeText: string;
  selectItem: (nodeType: string) => void;
  supportedNodeTypes: SupportedNodeType[];
};

export const CommandPanel = ({
  selectItem,
  supportedNodeTypes,
  nodeText,
}: CommandPanelProps) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { overflows, ref } = useOverflowsScreenBottom();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Enter") {
        selectItem(supportedNodeTypes[selectedItemIndex].value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItemIndex, supportedNodeTypes, selectItem]);

  useEffect(() => {
    const normalizedValue = nodeText.toLowerCase().replace(/\//g, "");
    setSelectedItemIndex(
      supportedNodeTypes.findIndex((item) => item.value.match(normalizedValue))
    );
  }, [nodeText, supportedNodeTypes]);

  return (
    <div ref={ref} className={`command-panel ${overflows ? "reverse" : ""}`}>
      <div className="command-panel-title">Blocks</div>
      <ul>
        {supportedNodeTypes.map((type: any, index: number) => {
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
