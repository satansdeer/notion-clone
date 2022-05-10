import { BasicNode } from "./BasicNode";
import { CommandPanel } from "../CommandPanel";
import { ImageNode } from "./ImageNode";
import { PageNode } from "./PageNode";
import { SwitchNode } from "../SwitchNode";
import { useAppState } from "../AppStateContext";

const supportedNodeTypes = [
  { value: "text", name: "Text" },
  { value: "image", name: "Image" },
  { value: "list", name: "List" },
  { value: "page", name: "Page" },
  { value: "heading1", name: "Heading 1" },
  { value: "heading2", name: "Heading 2" },
  { value: "heading3", name: "Heading 3" },
];

export const NodeContainer = ({
  node,
  isFocused,
  updateFocusedIndex,
  index,
}: any) => {
  const showCommandPanel = isFocused && node?.value?.match(/^\//);

  const { changeNodeValue, changeNodeType } = useAppState();

  const parseCommand = (nodeType: string) => {
    changeNodeValue(node, "");
    changeNodeType(node, nodeType);
  };

  return (
    <div className="node-container">
      <div className="node-drag-handle">⠿</div>
      {showCommandPanel && (
        <CommandPanel
          selectItem={parseCommand}
          nodeText={node.value}
          supportedNodeTypes={supportedNodeTypes}
        />
      )}
      <SwitchNode type={node.type}>
        <BasicNode
          supportedTypes={["text", "list", "heading1", "heading2", "heading3"]}
          index={index}
					isFocused={isFocused}
          node={node}
          updateFocusedIndex={updateFocusedIndex}
        />
        <ImageNode
          supportedTypes={["image"]}
          index={index}
					isFocused={isFocused}
          node={node}
          updateFocusedIndex={updateFocusedIndex}
        />
        <PageNode
          supportedTypes={["page"]}
          index={index}
					isFocused={isFocused}
          node={node}
          updateFocusedIndex={updateFocusedIndex}
        />
      </SwitchNode>
    </div>
  );
};
