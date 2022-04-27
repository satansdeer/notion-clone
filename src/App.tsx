import { Navigate, Route, Routes } from "react-router-dom";
import { Page } from "./Page";
import Auth from "./Auth";
import { Private } from "./Private";
import { AppStateProvider } from "./AppStateContext";

function App() {
  return (
    <Routes>
      <Route
        path="/:id"
        element={
          <Private
            component={
              <AppStateProvider>
                <Page />
              </AppStateProvider>
            }
          />
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Navigate to="/start" />} />
    </Routes>
  );
}

export default App;
