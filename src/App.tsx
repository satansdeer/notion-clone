import { Route, Routes } from "react-router-dom";
import { Page } from "./Page";

function App() {
  return (
    <Routes>
      <Route path="/:id" element={<Page />} />
    </Routes>
  );
}

export default App;
