import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/common";
import Login from "./components/common/login/Login";

import About from "./pages/About";
import Account from "./pages/Account";
import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />

                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            
            </div>
        </BrowserRouter>
    );
}

export default App;
