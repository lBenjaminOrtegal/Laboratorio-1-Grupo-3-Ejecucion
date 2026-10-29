import {Route, Routes} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home.tsx";
import LineUp from "./pages/LineUp.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import NavBarComponent from "./components/NavBarComponent.tsx";

function App() {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen bg-background">
                <NavBarComponent />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/line-up" element={<LineUp/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        
                        {/* Rutas protegidas (ejemplo) */}
                        {/*
                        <Route 
                            path="/profile" 
                            element={
                                <ProtectedRoute 
                                    element={<Profile />}
                                />
                            }
                        />
                        */}
                    </Routes>
                </main>
                {/*<Footer />*/}
            </div>
        </AuthProvider>
    );
}

export default App;