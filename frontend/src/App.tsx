import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import LineUp from "./pages/LineUp.tsx";

function App() {
    return (
        <div>
            {/*<Navbar />*/}
            <Routes>
                <Route path="/" element={<Home/>}/>

                {/* Formato para rutas privadas: */}
                {/*<Route*/}
                {/*    path="/admin"*/}
                {/*    element={*/}
                {/*      <PrivateRoute*/}
                {/*          element={<Admin />}*/}
                {/*          rolesAllowed={["ADMIN"]}*/}
                {/*      />*/}
                {/*    }*/}
                {/*/>*/}

                <Route path="/line-up" element={<LineUp/>}/>
            </Routes>
            {/*<Footer />*/}
        </div>
    );
}

export default App;