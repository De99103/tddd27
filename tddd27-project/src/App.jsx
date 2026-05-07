import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/common";
import Login from "./components/common/login/Login";

import Home from "./pages/Home";
import About from "./pages/About";
import Statistics from "./pages/Statistics";
import Account from "./pages/Account";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/account" element={<Account />} />
                </Routes>
            
            </div>
        </BrowserRouter>
    );
}

export default App;
