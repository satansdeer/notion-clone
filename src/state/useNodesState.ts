import { useState } from "react";
import { NodeData } from "./AppStateContext";

export const useNodesState = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);

  const addNode = async (node: NodeData, index: number) => {
    setNodes((oldNodes) => [
      ...oldNodes.slice(0, index),
      node,
      ...oldNodes.slice(index),
    ]);
  };

  const removeNodeByIndex = async (nodeIndex: number) => {
    setNodes((oldNodes) => [
      ...oldNodes.slice(0, nodeIndex),
      ...oldNodes.slice(nodeIndex + 1),
    ]);
  };

  const updateNode = async (
    node: NodeData,
    updatedFields: Partial<NodeData>
  ) => {
    console.log("changeNodeValue", node, updatedFields);
    setNodes((oldNodes) =>
      oldNodes.map((oldNode) => {
        if (oldNode.id === node.id) {
          return {
            ...oldNode,
            ...updatedFields,
          };
        } else {
          return oldNode;
        }
      })
    );
  };

  // const changeNodeType = async (node: NodeData, type: NodeType) => {
  //   setNodes((oldNodes) =>
  //     oldNodes.map((oldNode) => {
  //       if (oldNode.id === node.id) {
  //         return {
  //           ...oldNode,
  //           type,
  //         };
  //       } else {
  //         return oldNode;
  //       }
  //     })
  //   );
  // };

  return { nodes, setNodes, addNode, removeNodeByIndex, updateNode };
};
