import {Route, Routes} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home.tsx";
import Festivals from "./pages/Festivals.tsx";
import FestivalDetail from "./pages/FestivalDetail.tsx";
import CreateFestival from "./pages/CreateFestival.tsx";
import CreatePerformance from "./pages/CreatePerformance.tsx";
import ProducerPanel from "./pages/ProducerPanel.tsx";
import ManagePerformances from "./pages/ManagePerformances.tsx";
import AccessControl from "./pages/AccessControl.tsx";
import MyTickets from "./pages/MyTickets.tsx";
import BuyTicket from "./pages/BuyTicket.tsx";
import MyPurchases from "./pages/MyPurchases.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import NotFound from "./pages/NotFound.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";
import NavBarComponent from "./components/NavBarComponent.tsx";
import AuditoriaPage from "./pages/AuditoriaPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";

function App() {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen bg-background">
                <NavBarComponent />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/festivals" element={<Festivals/>}/>
                        <Route path="/create-festival" element={<ProtectedRoute element={<CreateFestival/>} requiredRole="PRODUCTOR" />}/>
                        <Route path="/create-performance" element={<ProtectedRoute element={<CreatePerformance/>} requiredRole="PRODUCTOR" />}/>
                        <Route path="/producer-panel" element={<ProtectedRoute element={<ProducerPanel/>} requiredRole="PRODUCTOR" />}/>
                        <Route path="/festivals/:id" element={<FestivalDetail/>}/>
                        <Route path="/sales-report" element={<ProtectedRoute element = {<Dashboard/>} requiredRole="PRODUCTOR"/>}/>
                        <Route path="/price-audit" element={<ProtectedRoute element = {<AuditoriaPage/>} requiredRole="PRODUCTOR"/>}/>
                        <Route path="/manage-performances" element={<ProtectedRoute element={<ManagePerformances/>} requiredRole="PRODUCTOR" />}/>
                        <Route path="/access-control" element={<ProtectedRoute element={<AccessControl/>} requiredRole="PRODUCTOR" />}/>
                        <Route path="/my-tickets" element={<ProtectedRoute element={<MyTickets/>} requiredRole="ASISTENTE" />}/>
                        <Route path="/buy-ticket/:idTipoEntrada" element={<ProtectedRoute element={<BuyTicket />} requiredRole="ASISTENTE" />}/>
                        <Route path="/my-purchases" element={<ProtectedRoute element={<MyPurchases/>} requiredRole="ASISTENTE" />}/>
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