import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NodeData } from "../utils/types";

export const useFocusedNodeIndex = (
  nodes: NodeData[]
): [number, Dispatch<SetStateAction<number>>] => {
  const [focusedNodeIndex, setFocusedNodeIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "ArrowDown") {
        setFocusedNodeIndex((index) => Math.min(index + 1, nodes.length - 1));
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [nodes]);

  return [focusedNodeIndex, setFocusedNodeIndex];
};
