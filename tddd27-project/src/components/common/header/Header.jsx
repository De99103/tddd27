import "./Header.css";
import logo from "/src/assets/images/placeholderLogga.png";


function Header() {
    return (
        <div className="header-container">
            <div className="logo-name-container">
                <div className="logo-container"><img src={logo} className="logo" alt="Logo" /></div>
                <div className="startpage">Placeholder Name</div>
            </div>
            
            <div className="navbar-items-container">
                <div className="navbar-items"><a href="/" className="navbar-link">Home</a></div>
                <div className="navbar-items"><a href="/about" className="navbar-link">About</a></div>
                <div className="navbar-items"><a href="/account" className="navbar-link">Account</a></div>
            </div>
            

        </div>
    );
}

export default Header;
