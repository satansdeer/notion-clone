import { ChangeEvent, useRef } from "react";
import { FileImage } from "../components/FileImage";
import { uploadImage } from "../utils/uploadImage";
import styles from "./Cover.module.css";

type CoverProps = {
  filePath?: string;
  changePageCover: (filePath: string) => void;
};

export const Cover = ({ filePath, changePageCover }: CoverProps) => {
  const fileInputRef = useRef<any>(null);

  const onChangeCoverImage = () => {
    fileInputRef.current.click();
  };

  const onCoverImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const result = await uploadImage(target?.files?.[0]);

    if (result?.filePath) {
      changePageCover(result.filePath);
    }
  };

  return (
    <div className={styles.cover}>
      {filePath ? (
        <FileImage className={styles.image} filePath={filePath} />
      ) : (
        <img className={styles.image} src="/ztm-notes.png" alt="Cover" />
      )}
      <button className={styles.button} onClick={onChangeCoverImage}>
        Change cover
      </button>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onCoverImageUpload}
      />
    </div>
  );
};
