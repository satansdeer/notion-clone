import { useState } from "react";

export const CommandPanel = ({ selectItem, supportedNodeTypes }: any) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="command-panel">
      <div className="command-panel-title">Blocks</div>
      <ul>
        {supportedNodeTypes.map((type: any) => {
          return (
            <li key={type.value} onClick={() => selectItem(type.value)}>
              {type.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
