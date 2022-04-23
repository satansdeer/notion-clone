import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";

export const PageTitle = ({ onAddNode, page, changePageTitle }: any) => {
  const headerRef = useRef<any>(null);

  useEffect(() => {
    headerRef.current.textContent = page.title;
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h1
      className="title"
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onAddNode({ type: "paragraph", id: nanoid() }, 0);
        }
      }}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => changePageTitle(page, e.currentTarget.textContent)}
    />
  );
};
