import { BasicNode } from "./BasicNode";
import { ImageNode } from "./ImageNode";
import { PageNode } from "./PageNode";
import { memo } from "react";
import { NodeData } from "../utils/types";

type NodeContainerProps = {
  node: NodeData;
  isFocused: boolean;
  index: number;
  updateFocusedIndex(index: number): void;
};

export const NodeTypeSwitcher = memo(
  ({ node, isFocused, index, updateFocusedIndex }: NodeContainerProps) => {
    if (
      ["text", "list", "heading1", "heading2", "heading3"].includes(node.type)
    ) {
      return (
        <BasicNode
          node={node}
          updateFocusedIndex={updateFocusedIndex}
          isFocused={isFocused}
          index={index}
        />
      );
    }

    if (node.type === "image") {
      return <ImageNode node={node} index={index} isFocused={isFocused} />;
    }

    if (node.type === "page") {
      return <PageNode node={node} index={index} isFocused={isFocused} />;
    }

    return null;
  }
);
