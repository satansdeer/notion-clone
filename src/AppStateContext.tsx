import { createContext, FC, useContext, useState } from "react";

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
        type: "paragraph",
        id: "XUf1Pp9L9XAawIL2cv_jj",
        value: "First paragraph",
      },
      {
        type: "paragraph",
        value: "",
        id: "MSYM45C4OKd4Z0iZZVeaJ",
      },
      {
        type: "ul",
        value: "first item",
        id: "cZAYIOrfoRfwogb0aNDTe",
      },
      {
        type: "ul",
        value: "second item",
        id: "rcBTfB6W1IJRzrqSw2U0c",
      },
      {
        type: "ul",
        value: "third item",
        id: "n7ihKVCNZCf1wfx_cr3Wh",
      },
    ],
  },
};

export const AppStateProvider: FC = ({ children }) => {
  const [pages, setPages] = useState<any>(initialPages);

  const addPage = (id: string) => {
    const page = {
      id,
      title: "Untitled",
      header:
        "https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fpage-cover%2Fwoodcuts_7.jpg?table=block&id=388d07d5-d52d-435b-958e-7bdbfa36ece9&spaceId=a9cc7699-6a37-4c49-9be3-2ad26dc988b1&width=2000&userId=20d86116-606a-485a-9fd5-7acdd1aff393&cache=v2",
      nodes: [],
    };
    setPages((oldPages: any) => ({ ...oldPages, [id]: page }));
    return page;
  };

  const setPageNodes = (pageId: string) => (nodes: any) => {
    setPages((oldPages: any) => ({
      ...oldPages,
      [pageId]: {
        ...oldPages[pageId],
        nodes,
      },
    }));
  };

  const addNode = (node: any, pageId: string, index: number) => {
    setPages((oldPages: any) => ({
      ...oldPages,
      [pageId]: {
        ...oldPages[pageId],
        nodes: [
          ...oldPages[pageId].nodes.slice(0, index),
          node,
          ...oldPages[pageId].nodes.slice(index),
        ],
      },
    }));
  };

  const removeNode = (nodeToRemove: any, pageId: string) => {
    setPages((oldPages: any) => ({
      ...oldPages,
      [pageId]: {
        ...oldPages[pageId],
        nodes: oldPages[pageId].nodes.filter(
          (node: any) => node.id !== nodeToRemove.id
        ),
      },
    }));
  };

  const changePageTitle = (page: any, title: string) => {
    setPages((oldPages: any) => ({
      ...oldPages,
      [page.id]: {
        ...oldPages[page.id],
        title,
      },
    }));
  };

  const changeNodeValue = (node: any, value: string, pageId: string) => {
		console.log(pages[pageId])
    setPages((oldPages: any) => ({
      ...oldPages,
      [pageId]: {
        ...oldPages[pageId],
        nodes: oldPages[pageId].nodes.map((oldNode: any) => {
          if (oldNode.id === node.id) {
            return {
              ...oldNode,
              value,
            };
          } else {
            return oldNode;
          }
        }),
      },
    }));
  };

  const changeNodeType = (node: any, type: string, pageId: string) => {
    setPages((oldPages: any) => ({
      ...oldPages,
      [pageId]: {
        ...oldPages[pageId],
        nodes: oldPages[pageId].nodes.map((oldNode: any) => {
          if (oldNode.id === node.id) {
            return {
              ...oldNode,
              type,
            };
          } else {
            return oldNode;
          }
        }),
      },
    }));
  };

  return (
    <AppStateContext.Provider
      value={{
        pages,
        addPage,
        setPageNodes,
        addNode,
        removeNode,
        changeNodeType,
        changeNodeValue,
        changePageTitle,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
