import { nanoid } from "nanoid";
import { createContext, FC, useContext, useState } from "react";

type AppStateContextType = {
  pages: any[];
  addPage(): any;
};

const AppStateContext = createContext<any>({} as AppStateContextType);

const initialState = [
  {
    id: "testpage0",
    title: "Notion App Clone",
    header:
      "https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fpage-cover%2Fwoodcuts_7.jpg?table=block&id=388d07d5-d52d-435b-958e-7bdbfa36ece9&spaceId=a9cc7699-6a37-4c49-9be3-2ad26dc988b1&width=2000&userId=20d86116-606a-485a-9fd5-7acdd1aff393&cache=v2",
    nodes: [
      {
        type: "paragraph",
        value: "You can have paragraphs.",
        id: nanoid(),
      },
      {
        type: "ul",
        value: "And lists",
        id: nanoid(),
      },
    ],
  },
];

export const AppStateProvider: FC = ({ children }) => {
  const [pages, setPages] = useState(initialState);

  const addPage = () => {
    const page = {
      id: nanoid(),
      title: "Untitled",
      header:
        "https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Fpage-cover%2Fwoodcuts_7.jpg?table=block&id=388d07d5-d52d-435b-958e-7bdbfa36ece9&spaceId=a9cc7699-6a37-4c49-9be3-2ad26dc988b1&width=2000&userId=20d86116-606a-485a-9fd5-7acdd1aff393&cache=v2",
      nodes: [
        {
          type: "paragraph",
          id: nanoid(),
        },
      ],
    };
    setPages((oldPages: any) => [...oldPages, page]);
    return page;
  };

  const addNode = (node: any, pageId: string, index: number) => {
    setPages((oldPages) =>
      oldPages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            nodes: [
              ...page.nodes.slice(0, index + 1),
              node,
              ...page.nodes.slice(index + 1),
            ],
          };
        } else {
          return page;
        }
      })
    );
  };

  const removeNode = (node: any, pageId: string) => {
    setPages((oldPages) =>
      oldPages.map((page) => {
        if (page.id === pageId) {
          const index = page.nodes.indexOf(node);
          return {
            ...page,
            nodes: [
              ...page.nodes.slice(0, index),
              ...page.nodes.slice(index + 1),
            ],
          };
        } else {
          return page;
        }
      })
    );
  };

  const changeNodeType = (node: any, type: string, pageId: string) => {
    setPages((oldPages) =>
      oldPages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            nodes: page.nodes.map((pageNode) => {
              if (pageNode.id === node.id) {
                return { ...pageNode, type };
              } else {
                return pageNode;
              }
            }),
          };
        } else {
          return page;
        }
      })
    );
  };

  const changeNodeValue = (node: any, value: string, pageId: string) => {
    setPages((oldPages) =>
      oldPages.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            nodes: page.nodes.map((pageNode) => {
              if (pageNode.id === node.id) {
                return { ...pageNode, value };
              } else {
                return pageNode;
              }
            }),
          };
        } else {
          return page;
        }
      })
    );
  };

  console.log(pages);

  return (
    <AppStateContext.Provider
      value={{
        pages,
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
