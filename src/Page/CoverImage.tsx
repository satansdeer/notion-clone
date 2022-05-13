import { ChangeEvent, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { uploadImage } from "../uploadImage";
import {DndContext} from '@dnd-kit/core';
import {SortableContext} from '@dnd-kit/sortable';

type CoverImageProps = {
  filePath?: string;
  changePageCover: (filePath: string) => void;
};

export const CoverImage = ({ filePath, changePageCover }: CoverImageProps) => {
  const [cover, setCover] = useState("");
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

  useEffect(() => {
    const downloadImage = async (filePath: string) => {
      const { data } = await supabase.storage.from("images").download(filePath);
      if (data) {
        const url = URL.createObjectURL(data);
        setCover(url);
      }
    };
    setCover("");
    if (filePath) {
      downloadImage(filePath);
    }
  }, [filePath]);

  return (
    <div className="page-header">
      {filePath ? <img
        className="header-image"
        src={cover || "/ztm-notes.png"}
        alt="Cover"
      /> : null}
      <button className="page-header-button" onClick={onChangeCoverImage}>
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
