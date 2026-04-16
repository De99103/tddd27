import "./Header.css";
import logo from "/src/assets/images/LiU-Courses Logo.png";

function Header() {
    return (
        <header>
            <div className="logo-name-container">
                <img src={logo} className="logo" alt="Logo" />
                <p>LiU-Courses</p>
            </div>

            <div className="navbar-items">
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
        </header>
    );
}

export default Header;
