import { nanoid } from "nanoid";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMatch } from "react-router-dom";
import { debounce } from "./debounce";
import { supabase } from "./supabaseClient";
import { useEvent } from "./useEvent";

type AppStateContextType = {
  pages: any;
  addPage(): any;
};

const AppStateContext = createContext<any>({} as AppStateContextType);

const updatePage = debounce(async (page: any) => {
  if (!page) {
    return;
  }
  const { error } = await supabase.from("pages").update(page).eq("id", page.id);
}, 500);

export const AppStateProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState<any>(true);
  const [pageId, setPageId] = useState<any>(null);
  const [title, setTitle] = useState<any>(null);
  const [nodes, setNodes] = useState<any>([]);
  const [coverImage, setCoverImage] = useState<any>(null);
  const match = useMatch("/:slug");
  const pageSlug = match ? match.params.slug : "start";
  const user = supabase.auth.user();

  useEffect(() => {
    const fetchPage = async () => {
      const { data, error, status } = await supabase
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

		console.log("Updating page", pageId);
    const page = {
      id: pageId,
      title,
      nodes,
      cover: coverImage,
    };
    updatePage(page);
  }, [pageId, title, nodes, coverImage, loading]);

  const updateNodes = (nodes: any) => {
    setNodes(nodes);
  };

  const addNode = async (node: any, index: number) => {
    updateNodes((oldNodes: any) => [
      ...oldNodes.slice(0, index),
      node,
      ...oldNodes.slice(index),
    ]);
  };

  const removeNode = async (nodeToRemove: any) => {
    updateNodes((oldPage: any) =>
      oldPage.nodes.filter((node: any) => node.id !== nodeToRemove.id)
    );
  };

  const changePageTitle = (title: string) => {
    setTitle(title);
  };

  const changePageCover = (cover: string) => {
    setCoverImage(cover);
  };

  const changeNodeValue = async (node: any, value: string) => {
    updateNodes((oldNodes: any) =>
      oldNodes.map((oldNode: any) => {
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

  const changeNodeType = async (node: any, type: string) => {
    updateNodes((oldNodes: any) =>
      oldNodes.map((oldNode: any) => {
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
        updateNodes,
        addNode,
        removeNode,
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
