import { createContext, FC, useContext, useState } from "react";

type AppStateContextType = {
  pages:any;
  addPage(): any;
};

const AppStateContext = createContext<any>({} as AppStateContextType);

const initialPages = {
  testpage0: {
    id: "testpage0",
    title: "Notion App Clone",
    header:
      "https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fpage-cover%2Fwoodcuts_7.jpg?table=block&id=388d07d5-d52d-435b-958e-7bdbfa36ece9&spaceId=a9cc7699-6a37-4c49-9be3-2ad26dc988b1&width=2000&userId=20d86116-606a-485a-9fd5-7acdd1aff393&cache=v2",
    nodes: [],
  },
};

export const AppStateProvider: FC = ({ children }) => {
  const [pages, setPages] = useState(initialPages);
  const [nodes, setNodes] = useState<any>({});

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

  const addNode = (node: any, pageId: string, index: number) => {
    setNodes((oldNodes: any) => ({ ...oldNodes, [node.id]: node }));
    setPages((oldPages: any) => ({
      ...oldPages,
      [pageId]: {
        ...oldPages[pageId],
        nodes: [
          ...oldPages[pageId].nodes.slice(0, index+1),
          node.id,
          ...oldPages[pageId].nodes.slice(index+1),
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

  const changeNodeValue = (node: any, value: string) => {
    setNodes((oldNodes: any) => ({
      ...oldNodes,
      [node.id]: {
        ...oldNodes[node.id],
        value,
      },
    }));
  };

  console.log(pages);
  console.log(nodes);

  return (
    <AppStateContext.Provider
      value={{
        pages,
        nodes,
        addPage,
        addNode,
        removeNode,
        changeNodeType,
        changeNodeValue,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
