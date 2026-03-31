import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JournalProvider } from "./context";
import { ThemeProvider, AuthProvider } from "./context";

import { Navbar, Sidebar, ProtectedRoute } from "./components";
import {
    DashboardPage,
    EditorPage,
    LoginPage,
    GalleryPage,
    PeoplePage,
    SettingsPage
} from "./pages";

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
        <ThemeProvider>
            <AuthProvider>
                <JournalProvider>
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
                            <Route path="/editor" element={
                                <Mainlayout>
                                    <ProtectedRoute>
                                        <EditorPage />
                                    </ProtectedRoute>
                                </Mainlayout>
                            } />
                            <Route path="/gallery" element={
                                <Mainlayout>
                                    <ProtectedRoute>
                                        <GalleryPage />
                                    </ProtectedRoute>
                                </Mainlayout>
                            } />
                            <Route path="/people" element={
                                <Mainlayout>
                                    <ProtectedRoute>
                                        <PeoplePage />
                                    </ProtectedRoute>
                                </Mainlayout>
                            } />
                            <Route path="/settings" element={
                                <Mainlayout>
                                    <ProtectedRoute>
                                        <SettingsPage />
                                    </ProtectedRoute>
                                </Mainlayout>
                            } />
                        </Routes>
                    </BrowserRouter>
                </JournalProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App;