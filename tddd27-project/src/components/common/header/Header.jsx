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
    };

    return (
        <header>
            <a href="/" className="logo-name-container">
                <img src={logo} className="logo" alt="Logo" />
                <p>LiU-Courses</p>
            </a>
            <span className="navbar-items">
                <div className="navbar-items-desktop">
                    <a href="/" className="navbar-link">
                        Home
                    </a>

                    <a href="/account" className="navbar-link">
                        Account
                    </a>
                    <a href="/about" className="navbar-link">
                        About
                    </a>
                </div>
                <div className="hamburger-component" onClick={toggleHamburger}>
                    <Hamburger isOpen={hamburgerOpen} />
                </div>
            </span>

            <style>{`
                @media screen and (max-width: 767px) {
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
