import { Navigate, Route, Routes } from "react-router-dom";
import { Page } from "./Page";
import Auth from "./Auth";
import { Private } from "./Private";

function App() {
  return (
    <Routes>
      <Route path="/:id" element={<Private component={<Page/>}/>} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Navigate to="/start" />} />
    </Routes>
  );
}

export default App;
