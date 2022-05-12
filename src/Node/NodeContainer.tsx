import { BasicNode } from "./BasicNode";
import { ImageNode } from "./ImageNode";
import { PageNode } from "./PageNode";
import { SwitchNode } from "./SwitchNode";
import { NodeData } from "../state/AppStateContext";

type NodeContainerProps = {
  node: NodeData;
  index: number;
  updateFocusedIndex: (index: number) => void;
  isFocused: boolean;
};

export const NodeContainer = ({
  node,
  isFocused,
  updateFocusedIndex,
  index,
}: NodeContainerProps) => {
  return (
    <div className="node-container">
      <div data-movable-handle className="node-drag-handle">
        ⠿
      </div>
      <SwitchNode type={node.type}>
        <BasicNode
          supportedTypes={["text", "list", "heading1", "heading2", "heading3"]}
          index={index}
          isFocused={isFocused}
          node={node}
          updateFocusedIndex={updateFocusedIndex}
        />
        <ImageNode supportedTypes={["image"]} node={node} />
        <PageNode supportedTypes={["page"]} node={node} />
      </SwitchNode>
    </div>
  );
};
