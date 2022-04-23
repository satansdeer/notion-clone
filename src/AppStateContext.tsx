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
      "XUf1Pp9L9XAawIL2cv_jj",
      "MSYM45C4OKd4Z0iZZVeaJ",
      "cZAYIOrfoRfwogb0aNDTe",
      "rcBTfB6W1IJRzrqSw2U0c",
      "n7ihKVCNZCf1wfx_cr3Wh",
    ],
  },
};

const initialNodes = {
  XUf1Pp9L9XAawIL2cv_jj: {
    type: "paragraph",
    id: "XUf1Pp9L9XAawIL2cv_jj",
    value: "First paragraph",
  },
  MSYM45C4OKd4Z0iZZVeaJ: {
    type: "paragraph",
    value: "",
    id: "MSYM45C4OKd4Z0iZZVeaJ",
  },
  cZAYIOrfoRfwogb0aNDTe: {
    type: "ul",
    value: "first item",
    id: "cZAYIOrfoRfwogb0aNDTe",
  },
  rcBTfB6W1IJRzrqSw2U0c: {
    type: "ul",
    value: "second item",
    id: "rcBTfB6W1IJRzrqSw2U0c",
  },
  n7ihKVCNZCf1wfx_cr3Wh: {
    type: "ul",
    value: "third item",
    id: "n7ihKVCNZCf1wfx_cr3Wh",
  },
};

export const AppStateProvider: FC = ({ children }) => {
  const [pages, setPages] = useState<any>(initialPages);
  const [nodes, setNodes] = useState<any>(initialNodes);

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
    setNodes((oldNodes: any) => ({ ...oldNodes, [node.id]: node }));
    setPages((oldPages: any) => ({
      ...oldPages,
      [pageId]: {
        ...oldPages[pageId],
        nodes: [
          ...oldPages[pageId].nodes.slice(0, index),
          node.id,
          ...oldPages[pageId].nodes.slice(index),
        ],
      },
    }));
  };

  const removeNode = (node: any, pageId: string) => {
    setNodes((oldNodes: any) => {
      const { [node.id]: _, ...newNodes } = oldNodes;
      return newNodes;
    });
    setPages((oldPages: any) => ({
      ...oldPages,
      [pageId]: {
        ...oldPages[pageId],
        nodes: oldPages[pageId].nodes.filter(
          (nodeId: any) => nodeId !== node.id
        ),
      },
    }));
  };

  const changeNodeType = (node: any, type: string) => {
    setNodes((oldNodes: any) => ({
      ...oldNodes,
      [node.id]: {
        ...oldNodes[node.id],
        value: "",
        type,
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

  const changeNodeValue = (node: any, value: string) => {
    setNodes((oldNodes: any) => ({
      ...oldNodes,
      [node.id]: {
        ...oldNodes[node.id],
        value,
      },
    }));
  };

  return (
    <AppStateContext.Provider
      value={{
        pages,
        nodes,
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
