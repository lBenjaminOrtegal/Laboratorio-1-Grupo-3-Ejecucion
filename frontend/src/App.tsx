import {Route, Routes} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home.tsx";
import LineUp from "./pages/LineUp.tsx";
import Festivals from "./pages/Festivals.tsx";
import CreateFestival from "./pages/CreateFestival.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import NotFound from "./pages/NotFound.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";
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
                        <Route path="/festivals" element={<Festivals/>}/>
                        <Route path="/create-festival" element={<ProtectedRoute element={<CreateFestival/>} requiredRole="PRODUCTOR" />}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/unauthorized" element={<Unauthorized/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </main>
                {/*<Footer />*/}
            </div>
        </AuthProvider>
    );
}

export default App;