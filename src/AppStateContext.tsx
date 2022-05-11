import { nanoid } from "nanoid";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { debounce } from "./debounce";
import { supabase } from "./supabaseClient";

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
  changePageTitle: any;
  changePageCover: any;
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

type Page = {
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
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [coverImage, setCoverImage] = useState<string>();
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

  const addNode = async (node: NodeData, index: number) => {
    setNodes((oldNodes) => [
      ...oldNodes.slice(0, index),
      node,
      ...oldNodes.slice(index),
    ]);
  };

  const removeNodeByIndex = async (nodeIndex: number) => {
    setNodes((oldNodes) => [
      ...oldNodes.slice(0, nodeIndex),
      ...oldNodes.slice(nodeIndex + 1),
    ]);
  };

  const changePageTitle = (title: string) => {
    setTitle(title);
  };

  const changePageCover = (cover: string) => {
    setCoverImage(cover);
  };

  const changeNodeValue = async (node: NodeData, value: string) => {
    console.log("changeNodeValue", node, value);
    setNodes((oldNodes) =>
      oldNodes.map((oldNode) => {
        if (oldNode.id === node.id) {
          return {
            ...oldNode,
            value,
          };
        } else {
          return oldNode;
        }
      })
    );
  };

  const changeNodeType = async (node: NodeData, type: NodeType) => {
    if (type === "page") {
      const newPage = await createPage();
      if (newPage) {
        changeNodeValue(node, newPage.slug);
      }
    }
    setNodes((oldNodes) =>
      oldNodes.map((oldNode) => {
        if (oldNode.id === node.id) {
          return {
            ...oldNode,
            type,
          };
        } else {
          return oldNode;
        }
      })
    );
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
        changePageTitle,
        changePageCover,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
