import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { useNodesContext } from "../state/AppStateContext";

type PageTitleProps = {
  title: string;
  changePageTitle(title: string): void;
};

export const PageTitle = ({ title, changePageTitle }: PageTitleProps) => {
  const headerRef = useRef<any>(null);

  const { addNode } = useNodesContext();

  useEffect(() => {
    headerRef.current.textContent = title;
  }, [title]);

  return (
    <div className="title-container">
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      <h1
        className="title"
        ref={headerRef}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addNode({ type: "text", id: nanoid() }, 0);
          }
        }}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => changePageTitle(e.currentTarget.textContent || "")}
      />
    </div>
  );
};
