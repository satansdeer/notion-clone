import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { uploadImage } from "./uploadImage";

export const CoverImage = ({filePath, changePageCover}: any) => {
  const [cover, setCover] = useState("");
  const fileInputRef = useRef<any>(null);

  const onChangeCoverImage = () => {
    fileInputRef.current.click();
  };

  const onCoverImageUpload = async (event: any) => {
    const result = await uploadImage(event);

    changePageCover(result?.filePath);
  };


  useEffect(() => {
    const downloadImage = async (filePath: string) => {
      const { data } = await supabase.storage
        .from("images")
        .download(filePath);
      if (data) {
        console.log("Downloaded image", data);
        const url = URL.createObjectURL(data);
        console.log("url", url);
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
      <img
        className="header-image"
        src={cover || "/ztm-notes.png"}
        alt="Cover"
      />
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
