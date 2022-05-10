import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommandPanel } from "./CommandPanel";
import { supabase } from "./supabaseClient";
import { uploadImage } from "./uploadImage";

const supportedNodeTypes = [
  { value: "text", name: "Text" },
  { value: "image", name: "Image" },
  { value: "list", name: "List" },
  { value: "page", name: "Page" },
  { value: "heading1", name: "Heading 1" },
  { value: "heading2", name: "Heading 2" },
  { value: "heading3", name: "Heading 3" },
];

export const Node = ({
  node,
  onClick,
  isFocused,
  onAddNode,
  onRemoveNode,
  onChangeNodeType,
  onChangeNodeValue,
  index,
}: any) => {
  const nodeRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const navigate = useNavigate();
  const showCommandPanel =
    isFocused && node?.value?.match(/^\//);
  const [pageTitle, setPageTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const downloadImage = async (filePath: string) => {
      const { data, error } = await supabase.storage
        .from("images")
        .download(filePath);
      if (data) {
        console.log("Downloaded image", data);
        const url = URL.createObjectURL(data);
        setImageUrl(url);
      }
    };
    if (node.type === "image" && node.value.filePath) {
      downloadImage(node?.value?.filePath);
    }
  }, [node.type, node.value]);

  useEffect(() => {
    const fetchPageTitle = async () => {
      const { data, error, status } = await supabase
        .from("pages")
        .select("title")
        .eq("slug", node.value)
        .single();
      setPageTitle(data?.title);
    };
    if (node.type === "page" && node.value) {
      fetchPageTitle();
    }
  }, [node.type, node.value]);

  useEffect(() => {
    if (isFocused) {
      nodeRef.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.textContent = node.value;
    }
  }, [node?.value]);

  const parseCommand = (nodeType: string) => {
    if (!supportedNodeTypes.find((type: any) => type.value === nodeType)) {
      return;
    }
    onChangeNodeValue(node, "");
    onChangeNodeType(node, nodeType);
    if (nodeType === "image") {
      fileInputRef.current.click();
    }
  };

  const onKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.textContent[0] === "/") {
        return;
      }
      if (node.type !== "text" && event.target.textContent.length === 0) {
        onChangeNodeType(node, "text");
        return;
      }
      onAddNode({ type: "text", value: "", id: nanoid() }, index + 1);
    }
    if (event.key === "Backspace") {
      if (event.target.textContent.length === 0) {
        event.preventDefault();
        onRemoveNode(node, index);
      } else if (window?.getSelection()?.anchorOffset === 0) {
        event.preventDefault();
        onRemoveNode(node, index - 2);
      }
    }
  };

  const navigateToPage = () => {
    navigate(`/${node.value}`);
  };

  const handleInput = ({ currentTarget }: any) => {
    const { textContent } = currentTarget;
    onChangeNodeValue(node, textContent);
  };

  const onImageUpload = async (event: any) => {
    try {
      // setUploading(true)

      const result = await uploadImage(event);

      onChangeNodeValue(node, {
        filePath: result?.filePath,
        name: result?.fileName,
      });
      // onUpload(filePath)
    } catch (error) {
      // alert(error.message)
    } finally {
      // setUploading(false)
    }
  };

  return (
    <div className="node-container">
      <div className="node-drag-handle">⠿</div>
      {showCommandPanel && (
        <CommandPanel
          selectItem={parseCommand}
          nodeText={node.value}
          supportedNodeTypes={supportedNodeTypes}
        />
      )}
      {node?.type === "page" && (
        <div onClick={navigateToPage} className={`node ${node.type}`}>
          📄 {pageTitle}
        </div>
      )}
      {node?.type === "image" && <img src={imageUrl} alt={node.value.name} />}
      {!["page", "image"].includes(node?.type) && (
        <div
          data-placeholder={node.type === "text" ? "Type '/' for commands" : ""}
          ref={nodeRef}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onInput={handleInput}
          contentEditable={true}
          suppressContentEditableWarning
          className={`node ${node.type}`}
        />
      )}
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onImageUpload}
      />
    </div>
  );
};
