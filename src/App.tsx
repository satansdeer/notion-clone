import { Navigate, Route, Routes } from "react-router-dom";
import { Page } from "./Page";

function App() {
  return (
    <Routes>
      <Route path="/:id" element={<Page />} />
      <Route path="/" element={<Navigate to="/start" />} />
    </Routes>
  );
}

export default App;
