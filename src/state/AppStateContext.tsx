import { nanoid } from "nanoid";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { debounce } from "../debounce";
import { supabase } from "../supabaseClient";
import { useNodesState } from "./useNodesState";

type AppStateContextType = {
  title?: string;
  nodes: NodeData[];
  coverImage?: string;
  loading: boolean;
  createPage: any;
  setNodes: any;
  addNode: any;
  removeNodeByIndex: any;
  changeNodeType: any;
  changeNodeValue: any;
  setTitle: any;
  setCoverImage: any;
};

export type NodeType =
  | "text"
  | "image"
  | "list"
  | "page"
  | "heading1"
  | "heading2"
  | "heading3";

export type NodeData = {
  id: string;
  type: NodeType;
  value: string;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  nodes: NodeData[];
  cover: string;
};

const AppStateContext = createContext<AppStateContextType>(
  {} as AppStateContextType
);

const updatePage = debounce(async (page: Partial<Page> & Pick<Page, "id">) => {
  if (!page) {
    return;
  }
  const { error } = await supabase.from("pages").update(page).eq("id", page.id);
}, 500);

export const AppStateProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [pageId, setPageId] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [coverImage, setCoverImage] = useState<string>();
  const { nodes, setNodes, addNode, removeNodeByIndex, updateNode } =
    useNodesState();
  const match = useMatch("/:slug");
  const pageSlug = match ? match.params.slug : "start";
  const user = supabase.auth.user();

  useEffect(() => {
    const fetchPage = async () => {
      const { data } = await supabase
        .from("pages")
        .select(`title, id, cover, nodes`)
        .eq("slug", pageSlug)
        .single();

      setTitle(data?.title);
      setCoverImage(data?.cover);
      setNodes(data?.nodes);
      setPageId(data?.id);
      setLoading(false);
    };
    fetchPage();
  }, [pageSlug]);

  const createPage = async () => {
    if (!user) {
      return;
    }
    const slug = nanoid();

    const page = {
      title: "Untitled",
      slug,
      nodes: [],
      created_by: user.id,
    };

    const { data } = await supabase.from("pages").insert(page);
    console.log("Created page", data);

    return page;
  };

  useEffect(() => {
    if (!pageId || loading) {
      return;
    }
    const page = {
      id: pageId,
      title,
      nodes,
      cover: coverImage,
    };
    updatePage(page);
  }, [pageId, title, nodes, coverImage, loading]);

  const changeNodeType = (node: NodeData, type: NodeType) => {
    updateNode(node, { type });
  };

  const changeNodeValue = (node: NodeData, value: string) => {
    updateNode(node, { value });
  };

  return (
    <AppStateContext.Provider
      value={{
        title,
        nodes,
        coverImage,
        loading,
        createPage,
        setNodes,
        addNode,
        removeNodeByIndex,
        changeNodeType,
        changeNodeValue,
        setTitle,
        setCoverImage,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
