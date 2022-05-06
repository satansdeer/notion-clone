import { useEffect, useState } from "react";

export const CommandPanel = ({ selectItem, supportedNodeTypes }: any) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (event.key === "ArrowUp") {
        setSelectedItemIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "ArrowDown") {
        setSelectedItemIndex((index) =>
          Math.min(index + 1, supportedNodeTypes.length - 1)
        );
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [supportedNodeTypes]);

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
