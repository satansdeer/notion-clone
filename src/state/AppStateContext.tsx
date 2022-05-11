import { createContext, FC, useContext, useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { createPage } from "../createPage";
import { supabase } from "../supabaseClient";
import { updatePage } from "./updatePage";
import { useNodesState } from "./useNodesState";

type AppStateContextType = {
  title: string;
  coverImage?: string;
  loading: boolean;
  setTitle: any;
  setCoverImage: any;
};

type NodesContextValue = {
	nodes: NodeData[];
	setNodes: any;
	addNode: any;
	removeNodeByIndex: any;
	changeNodeType: any;
	changeNodeValue: any;
}

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

const NodesContext = createContext<NodesContextValue>(
  {} as NodesContextValue
);

export const AppStateProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [pageId, setPageId] = useState();
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<string>();
  const { nodes, setNodes, addNode, removeNodeByIndex, updateNode } =
    useNodesState();
  const match = useMatch("/:slug");
  const pageSlug = match ? match.params.slug : "start";

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

  const changeNodeType = async (node: NodeData, type: NodeType) => {
    if (type === "page") {
      const newPage = await createPage();
      if (newPage) {
        changeNodeValue(node, newPage.slug);
      }
    }
    updateNode(node, { type });
  };

  const changeNodeValue = (node: NodeData, value: string) => {
    updateNode(node, { value });
  };

  return (
    <NodesContext.Provider value={{
			nodes,
			setNodes,
			addNode,
			removeNodeByIndex,
			changeNodeType,
			changeNodeValue,
		}}>
      <AppStateContext.Provider
        value={{
          title,
          coverImage,
          loading,
          setTitle,
          setCoverImage,
        }}
      >
        {children}
      </AppStateContext.Provider>
    </NodesContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
export const useNodesContext = () => useContext(NodesContext);
