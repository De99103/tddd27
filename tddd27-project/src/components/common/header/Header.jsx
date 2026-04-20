import "./Header.css";
import logo from "/src/assets/images/LiU-Courses Logo.png";

import burgerIcon from "/src/assets/images/burger meny placeholder.png";

function Header() {
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
                <button className="navbar-items-mobile">
                    <img src={burgerIcon} className="burger-icon" alt="Logo" />
                </button>
            </span>
        </header>
    );
}

export default Header;
