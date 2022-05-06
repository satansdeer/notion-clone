import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { useAppState } from "./AppStateContext";
import { Node } from "./Node";
import { PageTitle } from "./PageTitle";
import { supabase } from "./supabaseClient";
import { uploadImage } from "./uploadImage";

export const Page = () => {
  const fileInputRef = useRef<any>(null);
  const {
    title,
    nodes,
    coverImage,
		loading,
    createPage,
    updateNodes,
    addNode,
    removeNode,
    changeNodeType,
    changeNodeValue,
    changePageTitle,
    changePageCover,
  } = useAppState();

  const [cover, setCover] = useState("");

  const [focusedNodeIndex, setFocusedNodeIndex] = useState(0);

  useEffect(() => {
    const downloadImage = async (filePath: string) => {
      const { data, error } = await supabase.storage
        .from("images")
        .download(filePath);
      if (data) {
        console.log("Downloaded image", data);
        const url = URL.createObjectURL(data);
        console.log("url", url);
        setCover(url);
      }
    };
    if (coverImage && coverImage) {
      downloadImage(coverImage);
    }
  }, [coverImage]);

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (event.key === "ArrowUp") {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "ArrowDown") {
        setFocusedNodeIndex((index) => Math.min(index + 1, nodes.length - 1));
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [nodes]);

  const onAddNode = (node: any, index: number) => {
    addNode(node, index);
    setFocusedNodeIndex(index);
  };

  const onRemoveNode = (node: any) => {
    removeNode(node);
    setFocusedNodeIndex((index) => index - 1);
  };

  const onChangeNodeType = async (node: any, type: string) => {
    changeNodeType(node, type);
    if (type === "page") {
      const { slug } = await createPage();
      changeNodeValue(node, slug);
    }
  };

  const onChangeNodeValue = (node: any, value: string) => {
    changeNodeValue(node, value);
  };

  const onChangeCoverImage = () => {
    fileInputRef.current.click();
  };

  const onCoverImageUpload = async (event: any) => {
    const result = await uploadImage(event);

    changePageCover(result?.filePath);
  };

  if (loading) {
    return null;
  }

  return (
    <>
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
      <div className="title-container">
        <PageTitle
          title={title}
          onAddNode={onAddNode}
          changePageTitle={changePageTitle}
        />
      </div>
      <div className="page-body">
        <ReactSortable
          animation={200}
          delay={100}
          list={nodes}
          setList={updateNodes}
          ghostClass="node-container-ghost"
          dragClass="node-container-drag"
        >
          {nodes.map((node: any, index: number) => {
            return (
              <Node
                key={node.id}
                isFocused={index === focusedNodeIndex}
                onClick={() => setFocusedNodeIndex(index)}
                node={node}
                index={index}
                onAddNode={onAddNode}
                onChangeNodeType={onChangeNodeType}
                onChangeNodeValue={onChangeNodeValue}
                onRemoveNode={onRemoveNode}
              />
            );
          })}
        </ReactSortable>
        <div
          className="page-spacer"
          onClick={() =>
            onAddNode({ type: "text", id: nanoid() }, nodes.length)
          }
        >
          {!nodes.length && "Click to create the first paragraph."}
        </div>
      </div>
    </>
  );
};
