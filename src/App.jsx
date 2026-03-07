import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar, Sidebar } from "./components";
import { DashboardPage, LoginPage } from "./pages";

function Mainlayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <Mainlayout>
              <DashboardPage />
            </Mainlayout>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;