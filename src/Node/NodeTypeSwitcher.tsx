import { BasicNode } from "./BasicNode";
import { ImageNode } from "./ImageNode";
import { PageNode } from "./PageNode";
import { NodeData } from "../state/AppStateContext";
import { memo } from "react";

type NodeContainerProps = {
  node: NodeData;
  isFocused: boolean;
  index: number;
};

export const NodeTypeSwitcher = memo(
  ({ node, isFocused, index }: NodeContainerProps) => {
    if (
      ["text", "list", "heading1", "heading2", "heading3"].includes(node.type)
    ) {
      return (
        <BasicNode
          node={node}
          updateFocusedIndex={() => {}}
          isFocused={isFocused}
          index={index}
        />
      );
    }

    if (node.type === "image") {
      return <ImageNode node={node} />;
    }

    if (node.type === "page") {
      return <PageNode node={node} />;
    }

    return null;
  }
);
