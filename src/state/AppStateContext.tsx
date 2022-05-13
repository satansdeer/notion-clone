import { createContext, useContext } from "react";
import { Page, usePageState } from "./usePageState";
import { withInitialState } from "./withInitialState";

type AppStateContextType = ReturnType<typeof usePageState>;

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

const AppStateContext = createContext<AppStateContextType>(
  {} as AppStateContextType
);

type AppStateProviderProps = {
  children: React.ReactNode;
  initialState: Page;
};

export const AppStateProvider = withInitialState<AppStateProviderProps>(
  ({ children, initialState }) => {
    const pageStateHandlers = usePageState(initialState);

    return (
      <AppStateContext.Provider value={pageStateHandlers}>
        {children}
      </AppStateContext.Provider>
    );
  }
);

export const useAppState = () => useContext(AppStateContext);
