import { ChangeEvent, useEffect, useRef, useState } from "react";
import { NodeData, NodeType, useAppState } from "../state/AppStateContext";
import { supabase } from "../supabaseClient";
import { uploadImage } from "../uploadImage";

type ImageNodeProps = {
  node: NodeData;
	index: number;
  supportedTypes: NodeType[];
};

export const ImageNode = ({ node, index }: ImageNodeProps) => {
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

  const onImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      // setUploading(true)
			const target = event.target as HTMLInputElement;
      const result = await uploadImage(target.files?.[0]);

      await changeNodeValue(index, result?.filePath);
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
