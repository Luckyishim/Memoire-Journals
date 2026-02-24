import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Sidebar/>
        <Routes>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;