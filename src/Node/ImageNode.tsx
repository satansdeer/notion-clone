import { useEffect, useRef, useState } from "react";
import { NodeData, NodeType, useAppState } from "../AppStateContext";
import { supabase } from "../supabaseClient";
import { uploadImage } from "../uploadImage";

type ImageNodeProps = {
  node: NodeData;
  supportedTypes: NodeType[];
};

export const ImageNode = ({ node }: ImageNodeProps) => {
  const fileInputRef = useRef<any>(null);
  const [imageUrl, setImageUrl] = useState("");

  const { changeNodeValue } = useAppState();

  useEffect(() => {
    if (!node.value) {
      fileInputRef.current.click();
    }
  }, [node.value]);

  useEffect(() => {
    const downloadImage = async (filePath: string) => {
      const { data } = await supabase.storage
        .from("images")
        .download(filePath);
      if (data) {
        console.log("Downloaded image", data);
        const url = URL.createObjectURL(data);
        setImageUrl(url);
      }
    };
    if (node?.value) {
      downloadImage(node?.value);
    }
  }, [node.type, node.value]);

  const onImageUpload = async (event: any) => {
    try {
      // setUploading(true)

      const result = await uploadImage(event);

      await changeNodeValue(node, result?.filePath);
      // onUpload(filePath)
    } catch (error) {
      // alert(error.message)
    } finally {
      // setUploading(false)
    }
  };

  return (
    <>
      <img src={imageUrl} alt={node.value} />
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onImageUpload}
      />
    </>
  );
};
