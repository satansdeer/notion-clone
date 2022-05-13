import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { useAppState } from "../state/AppStateContext";
import styles from "./Title.module.css";

type TitleProps = {
  title: string;
  changePageTitle(title: string): void;
};

export const Title = ({ title, changePageTitle }: TitleProps) => {
  const headerRef = useRef<any>(null);

  const { addNode } = useAppState();

  useEffect(() => {
    headerRef.current.textContent = title;
  }, [title]);

  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      <h1
        className={styles.title}
        ref={headerRef}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addNode({ type: "text", id: nanoid(), value: "" }, 0);
          }
        }}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => changePageTitle(e.currentTarget.textContent || "")}
      />
    </div>
  );
};
