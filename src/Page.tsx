import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import { useAppState } from "./AppStateContext";
import { Node } from "./Node";
import { PageTitle } from "./PageTitle";
import { supabase } from "./supabaseClient";
import { uploadImage } from "./uploadImage";

export const Page = () => {
  const history = useNavigate();
  const fileInputRef = useRef<any>(null);
  const {
    page,
    createPage,
    setPageNodes,
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
		console.log(page)
    if (page?.cover) {
      downloadImage(page.cover);
    }
  }, [page]);

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (event.key === "ArrowUp") {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "ArrowDown") {
        setFocusedNodeIndex((index) =>
          Math.min(index + 1, page?.nodes.length - 1)
        );
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [page]);

  const onAddNode = (node: any, index: number) => {
    addNode(node, index);
    setFocusedNodeIndex(index);
  };

  const onRemoveNode = (node: any, index: number) => {
    removeNode(node, page.id, index);
    setFocusedNodeIndex((index) => index - 1);
  };

  const onChangeNodeType = async (node: any, type: string) => {
    changeNodeType(node, type, page.id);
    if (type === "page") {
      const { slug } = await createPage();
      changeNodeValue(node, slug);
    }
  };

  const onChangeNodeValue = (node: any, value: string) => {
    changeNodeValue(node, value, page.id);
  };

  const onChangeCoverImage = () => {
    fileInputRef.current.click();
  };

  const onCoverImageUpload = async (event: any) => {
    const result = await uploadImage(event);

    changePageCover(result?.filePath);
  };

  if (!page) {
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
          page={page}
          onAddNode={onAddNode}
          changePageTitle={changePageTitle}
        />
      </div>
      <div className="page-body">
        <ReactSortable
          animation={200}
          delay={100}
          list={page.nodes}
          setList={setPageNodes}
          ghostClass="node-container-ghost"
          dragClass="node-container-drag"
        >
          {page.nodes.map((node: any, index: number) => {
            return (
              <Node
                key={node.id}
                isFocused={index === focusedNodeIndex}
                onClick={() => setFocusedNodeIndex(index)}
                node={node}
                pageId={page.id}
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
            onAddNode({ type: "text", id: nanoid() }, page.nodes.length)
          }
        >
          {!page.nodes.length && "Click to create the first paragraph."}
        </div>
      </div>
    </>
  );
};
