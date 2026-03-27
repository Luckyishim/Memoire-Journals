import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar, Sidebar, ProtectedRoute } from "./components";
import { DashboardPage, EditorPage, LoginPage } from "./pages";


function Mainlayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Navbar />
        <main style={{ flex: 1, overflow: 'auto' }}>
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
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </Mainlayout>
          } />
          <Route path="/editorPage" element={
            <Mainlayout>
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            </Mainlayout>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;