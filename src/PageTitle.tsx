import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";

export const PageTitle = ({ onAddNode, title, changePageTitle }: any) => {
  const headerRef = useRef<any>(null);

  useEffect(() => {
    headerRef.current.textContent = title;
  }, [title]);

  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h1
      className="title"
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onAddNode({ type: "text", id: nanoid() }, 0);
        }
      }}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => changePageTitle(e.currentTarget.textContent)}
    />
  );
};
