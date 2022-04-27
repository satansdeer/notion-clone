import { nanoid } from "nanoid";
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMatch } from "react-router-dom";
import { supabase } from "./supabaseClient";

type AppStateContextType = {
  pages: any;
  addPage(): any;
};

const AppStateContext = createContext<any>({} as AppStateContextType);

const initialPages = {
  start: {
    id: "start",
    title: "Notion App Clone",
    header:
      "https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fpage-cover%2Fwoodcuts_7.jpg?table=block&id=388d07d5-d52d-435b-958e-7bdbfa36ece9&spaceId=a9cc7699-6a37-4c49-9be3-2ad26dc988b1&width=2000&userId=20d86116-606a-485a-9fd5-7acdd1aff393&cache=v2",
    nodes: [
      {
        type: "text",
        id: "XUf1Pp9L9XAawIL2cv_jj",
        value: "First paragraph",
      },
      {
        type: "text",
        value: "",
        id: "MSYM45C4OKd4Z0iZZVeaJ",
      },
      {
        type: "list",
        value: "first item",
        id: "cZAYIOrfoRfwogb0aNDTe",
      },
      {
        type: "list",
        value: "second item",
        id: "rcBTfB6W1IJRzrqSw2U0c",
      },
      {
        type: "list",
        value: "third item",
        id: "n7ihKVCNZCf1wfx_cr3Wh",
      },
    ],
  },
};
const updatePage = async (page: any) => {
  if (!page) {
    return;
  }
  const { error } = await supabase
    .from("pages")
    .update({
      title: page.title,
      nodes: page.nodes,
    })
    .eq("id", page.id);
};

export const AppStateProvider: FC = ({ children }) => {
  const debounceTimer = useRef<any>(null);
  const [page, setPage] = useState<any>(null);
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

      setPage({
        ...data,
      });
    };
    fetchPage();
  }, [pageSlug]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => updatePage(page), 1300);
    return () => {
      clearTimeout(debounceTimer.current);
    };
  }, [page]);

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

  const setPageNodes = (nodes: any) => {
    setPage((oldPage: any) => ({
      ...oldPage,
      nodes,
    }));
  };

  const addNode = async (node: any, index: number) => {
    setPage((oldPage: any) => ({
      ...oldPage,
      nodes: [
        ...oldPage.nodes.slice(0, index),
        node,
        ...oldPage.nodes.slice(index),
      ],
    }));
  };

  const removeNode = async (nodeToRemove: any) => {
    setPage((oldPage: any) => ({
      ...oldPage,
      nodes: oldPage.nodes.filter((node: any) => node.id !== nodeToRemove.id),
    }));
  };

  const changePageTitle = (title: string) => {
    setPage((oldPage: any) => ({
      ...oldPage,
      title,
    }));
  };

  const changePageCover = (cover: string) => {
    setPage((oldPage: any) => ({
      ...oldPage,
      cover,
    }));
  };

  const changeNodeValue = async (node: any, value: string) => {
    setPage((oldPage: any) => ({
      ...oldPage,
      nodes: oldPage.nodes.map((oldNode: any) => {
        if (oldNode.id === node.id) {
          return {
            ...oldNode,
            value,
          };
        } else {
          return oldNode;
        }
      }),
    }));
  };

  const changeNodeType = async (node: any, type: string) => {
    setPage((oldPage: any) => ({
      ...oldPage,
      nodes: oldPage.nodes.map((oldNode: any) => {
        if (oldNode.id === node.id) {
          return {
            ...oldNode,
            type,
          };
        } else {
          return oldNode;
        }
      }),
    }));
  };

  return (
    <AppStateContext.Provider
      value={{
        page,
        createPage,
        setPageNodes,
        addNode,
        removeNode,
        changeNodeType,
        changeNodeValue,
        changePageTitle,
				changePageCover
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
