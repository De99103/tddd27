import "./Header.css";
import logo from "/src/assets/images/LiU-Courses Logo.png";

import burgerIcon from "/src/assets/images/burger meny placeholder.png";
import burgerIconWhite from "/src/assets/images/burger menu white.png";
import { useState } from "react";
import Hamburger from "../hamburger/Hamburger.jsx";

function Header() {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const toggleHamburger = () => {
        setHamburgerOpen(!hamburgerOpen);
        console.log("hamburgaren har tryckts på");
    };

    return (
        <header>
            <div className="logo-name-container">
                <img src={logo} className="logo" alt="Logo" />
                <p>LiU-Courses</p>
            </div>
            <span className="navbar-items">
                <div className="navbar-items-desktop">
                    <a href="/" className="navbar-link">
                        Home
                    </a>
                    <a href="/about" className="navbar-link">
                        About
                    </a>
                    <a href="/account" className="navbar-link">
                        Account
                    </a>
                </div>
                {/* <div className="navbar-items-mobile">
                    <img
                        src={burgerIconWhite}
                        className="burger-icon"
                        alt="Logo"
                    />
                </div> */}
                <div className="hamburger" onClick={toggleHamburger}>
                    <Hamburger isOpen={hamburgerOpen} />
                </div>
            </span>

            {/* Samma sak här med att försöka få den här CSS in i sin egna fil, men har problem med variablen "hamburgerOpen" */}

            <style>{`
                @media screen and (max-width: 880px) {
                    .navbar-items-desktop {
                        display: ${hamburgerOpen ? "flex" : "none"};
                        flex-direction: ${hamburgerOpen ? "column" : "row"};
                    }

                    .navbar-items {
                        align-items: ${hamburgerOpen ? "normal" : "center"};
                    }

                    .logo-name-container {
                        display: ${hamburgerOpen ? "none" : "flex"};
                    }
                }
            `}</style>
        </header>
    );
}

export default Header;
