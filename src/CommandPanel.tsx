import { useEffect, useState } from "react";

export const CommandPanel = ({
  selectItem,
  supportedNodeTypes,
  nodeText,
}: any) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Enter") {
        selectItem(supportedNodeTypes[selectedItemIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItemIndex]);

  useEffect(() => {
    const normalizedValue = nodeText.toLowerCase().replace(/\//g, "");
    setSelectedItemIndex(
      supportedNodeTypes.findIndex((item: any) =>
        item.value.match(normalizedValue)
      )
    );
  }, [nodeText, supportedNodeTypes]);

  return (
    <div className="command-panel">
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
