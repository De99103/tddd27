import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/common";

import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Account from "./pages/account";
import Landing from "./pages/Landing";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
        </Routes>
        
        <Landing />

      </div>
    </BrowserRouter>
  );
}

export default App;