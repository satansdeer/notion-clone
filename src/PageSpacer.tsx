import { nanoid } from "nanoid";
import { useAppState } from "./AppStateContext";

export const PageSpacer = ({ updateFocusedIndex, showHint }: any) => {
  const { addNode } =
    useAppState();

	const handleClick = () => {
		addNode({ type: "text", value: "", id: nanoid() });
		updateFocusedIndex(0);
	}

  return (
    <div className="page-spacer" onClick={handleClick}>
      {showHint && "Click to create the first paragraph."}
    </div>
  );
};
