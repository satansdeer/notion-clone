import {
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useImmer } from "use-immer";
import { createPage } from "../createPage";
import { updatePage } from "./updatePage";
import { withInitialState } from "./withInitialState";

type AppStateContextType = {
  title: string;
  cover: string;
  setTitle: any;
  setCoverImage: any;
  nodes: NodeData[];
  setNodes: any;
  addNode: any;
  removeNodeByIndex: any;
  changeNodeType: any;
  changeNodeValue: any;
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

type AppStateProviderProps = {
  children: React.ReactNode;
  initialState: Page;
};

export const AppStateProvider = withInitialState<AppStateProviderProps>(
  ({ children, initialState }) => {
    const [page, setPage] = useImmer(initialState);
    const didMountRef = useRef(false);

    useEffect(() => {
      if (didMountRef.current) {
        updatePage(page);
      }
      didMountRef.current = true;
    }, [page]);

    const changeNodeType = async (nodeIndex: number, type: NodeType) => {
      if (type === "page") {
        const newPage = await createPage();
        if (newPage) {
          setPage((draft) => {
            draft.nodes[nodeIndex].type = type;
            draft.nodes[nodeIndex].value = newPage.slug;
          });
        }
      } else {
        setPage((draft) => {
          draft.nodes[nodeIndex].type = type;
          draft.nodes[nodeIndex].value = ""
        });
      }
    };

    const changeNodeValue = (nodeIndex: number, value: string) => {
      setPage((draft) => {
        draft.nodes[nodeIndex].value = value;
      });
    };

    const removeNodeByIndex = (nodeIndex: number) => {
      setPage((draft) => {
        draft.nodes.splice(nodeIndex, 1);
      });
    };

    const addNode = (node: NodeData, index: number) => {
      setPage((draft) => {
        draft.nodes.splice(index, 0, node);
      });
    };

    const setTitle = (title: string) => {
      setPage((draft) => {
        draft.title = title;
      });
    };

    const setCoverImage = (coverImage: string) => {
      setPage((draft) => {
        draft.cover = coverImage;
      });
    };

    const setNodes = (nodes: NodeData[]) => {
      setPage((draft) => {
        draft.nodes = nodes;
      });
    };

    return (
      <AppStateContext.Provider
        value={{
          ...page,
          setTitle,
          setCoverImage,
          setNodes,
          addNode,
          removeNodeByIndex,
          changeNodeType,
          changeNodeValue,
        }}
      >
        {children}
      </AppStateContext.Provider>
    );
  }
);

export const useAppState = () => useContext(AppStateContext);
